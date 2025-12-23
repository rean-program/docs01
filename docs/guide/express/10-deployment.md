# Deploying Express.js Applications

This tutorial covers preparing your Express application for production and deploying to various platforms.

## Production Preparation

### Environment Variables

```javascript
// config/index.js
require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  corsOrigin: process.env.CORS_ORIGIN || '*'
};
```

```env
# .env.example
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb://localhost:27017/myapp
JWT_SECRET=your-secret-key
CORS_ORIGIN=https://myapp.com
```

### Production Middleware

```javascript
const express = require('express');
const helmet = require('helmet');
const compression = require('compression');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const config = require('./config');

const app = express();

// Security headers
app.use(helmet());

// CORS
app.use(cors({
  origin: config.corsOrigin,
  credentials: true
}));

// Compression
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests' }
});
app.use('/api', limiter);

// Body parsing
app.use(express.json({ limit: '10kb' }));

// Trust proxy (for load balancers)
app.set('trust proxy', 1);
```

### Health Check Endpoint

```javascript
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// More detailed health check
app.get('/health/detailed', async (req, res) => {
  try {
    // Check database
    await mongoose.connection.db.admin().ping();

    res.json({
      status: 'ok',
      database: 'connected',
      memory: process.memoryUsage(),
      uptime: process.uptime()
    });
  } catch (err) {
    res.status(503).json({
      status: 'error',
      database: 'disconnected'
    });
  }
});
```

### Graceful Shutdown

```javascript
const server = app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});

const gracefulShutdown = async (signal) => {
  console.log(`${signal} received. Shutting down gracefully...`);

  server.close(async () => {
    console.log('HTTP server closed');

    // Close database connections
    await mongoose.connection.close();
    console.log('Database connections closed');

    process.exit(0);
  });

  // Force close after 30s
  setTimeout(() => {
    console.error('Forcing shutdown...');
    process.exit(1);
  }, 30000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
```

### Logging

```bash
npm install winston morgan
```

```javascript
const winston = require('winston');
const morgan = require('morgan');

// Winston logger
const logger = winston.createLogger({
  level: config.nodeEnv === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

if (config.nodeEnv !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

// Morgan HTTP logging
const morganFormat = config.nodeEnv === 'production' ? 'combined' : 'dev';
app.use(morgan(morganFormat, {
  stream: { write: (message) => logger.info(message.trim()) }
}));
```

## Docker Deployment

### Dockerfile

```dockerfile
# Dockerfile
FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy source
COPY . .

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001
USER nodejs

EXPOSE 3000

CMD ["node", "server.js"]
```

### Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://mongo:27017/myapp
      - JWT_SECRET=${JWT_SECRET}
    depends_on:
      - mongo
    restart: unless-stopped

  mongo:
    image: mongo:7
    volumes:
      - mongo_data:/data/db
    restart: unless-stopped

volumes:
  mongo_data:
```

```bash
# Build and run
docker-compose up -d

# View logs
docker-compose logs -f app
```

## Platform Deployments

### Railway

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Deploy
railway up
```

Add `railway.json`:

```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "node server.js",
    "healthcheckPath": "/health"
  }
}
```

### Render

Create `render.yaml`:

```yaml
services:
  - type: web
    name: my-express-app
    env: node
    buildCommand: npm install
    startCommand: node server.js
    healthCheckPath: /health
    envVars:
      - key: NODE_ENV
        value: production
      - key: JWT_SECRET
        generateValue: true
```

### Fly.io

```bash
# Install Fly CLI
curl -L https://fly.io/install.sh | sh

# Login
fly auth login

# Launch app
fly launch
```

Create `fly.toml`:

```toml
app = "my-express-app"
primary_region = "sjc"

[build]
  builder = "heroku/buildpacks:20"

[env]
  NODE_ENV = "production"

[http_service]
  internal_port = 3000
  force_https = true
  auto_stop_machines = true
  auto_start_machines = true

[[services]]
  http_checks = []
  internal_port = 3000
  protocol = "tcp"

  [[services.ports]]
    handlers = ["http"]
    port = 80

  [[services.ports]]
    handlers = ["tls", "http"]
    port = 443

  [[services.tcp_checks]]
    grace_period = "1s"
    interval = "15s"
    timeout = "2s"
```

### DigitalOcean App Platform

Create `.do/app.yaml`:

```yaml
name: my-express-app
services:
  - name: api
    source_dir: /
    github:
      repo: username/repo
      branch: main
      deploy_on_push: true
    run_command: node server.js
    environment_slug: node-js
    instance_count: 1
    instance_size_slug: basic-xxs
    http_port: 3000
    envs:
      - key: NODE_ENV
        value: production
      - key: JWT_SECRET
        type: SECRET
    health_check:
      http_path: /health
```

### AWS EC2 with PM2

```bash
# Install PM2
npm install -g pm2

# Start application
pm2 start server.js --name "my-app"

# Setup startup script
pm2 startup
pm2 save

# Monitor
pm2 monit
```

Create `ecosystem.config.js`:

```javascript
module.exports = {
  apps: [{
    name: 'my-app',
    script: 'server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }]
};
```

## Nginx Reverse Proxy

```nginx
# /etc/nginx/sites-available/myapp
server {
    listen 80;
    server_name myapp.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name myapp.com;

    ssl_certificate /etc/letsencrypt/live/myapp.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/myapp.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    location /static {
        alias /var/www/myapp/public;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

## CI/CD with GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm test

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      # Deploy to Railway
      - name: Deploy to Railway
        uses: bervProject/railway-deploy@main
        with:
          railway_token: ${{ secrets.RAILWAY_TOKEN }}
          service: my-app

      # Or deploy to Render
      - name: Deploy to Render
        run: curl ${{ secrets.RENDER_DEPLOY_HOOK }}

      # Or deploy to server via SSH
      - name: Deploy to Server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.SSH_KEY }}
          script: |
            cd /var/www/myapp
            git pull
            npm ci --only=production
            pm2 restart my-app
```

## Monitoring

### Application Performance

```bash
npm install @opentelemetry/api @opentelemetry/node
```

### Error Tracking (Sentry)

```bash
npm install @sentry/node
```

```javascript
const Sentry = require('@sentry/node');

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV
});

app.use(Sentry.Handlers.requestHandler());
// ... routes
app.use(Sentry.Handlers.errorHandler());
```

## Summary

In this tutorial, you learned:

- Production preparation (env vars, middleware, health checks)
- Graceful shutdown handling
- Docker containerization
- Deploying to various platforms
- Nginx reverse proxy setup
- CI/CD with GitHub Actions
- Monitoring and error tracking

Congratulations! You've completed the Express.js tutorial series. You now have the knowledge to build and deploy production-ready Express applications.
