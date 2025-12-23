# Docker Compose

Docker Compose is a tool for defining and running multi-container applications. In this tutorial, you'll learn how to use Docker Compose to manage complex applications easily.

## What is Docker Compose?

**Docker Compose** lets you define your entire application stack in a single YAML file and manage it with simple commands.

```
┌─────────────────────────────────────────────────────────────┐
│        Without Docker Compose vs With Docker Compose         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   Without Compose (Manual)      With Compose (Easy)        │
│                                                             │
│   docker network create...      docker compose up          │
│   docker volume create...              │                   │
│   docker run -d --name db...           │                   │
│     -e POSTGRES_PASSWORD...            ▼                   │
│     -v pgdata:/var/lib...       Everything runs!           │
│   docker run -d --name redis...                            │
│     --network...                                           │
│   docker run -d --name api...                              │
│     -e DATABASE_URL...                                     │
│     -p 3000:3000...             Just one command! 🎉       │
│   ...and many more commands                                │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Benefits of Docker Compose

| Feature | Benefit |
|---------|---------|
| **Declarative** | Define infrastructure as code |
| **Reproducible** | Same setup every time |
| **Simple** | One command to start everything |
| **Version Control** | Track changes in Git |
| **Environment Management** | Easy dev/test/prod configs |
| **Service Dependencies** | Automatic startup order |

## Installing Docker Compose

Docker Compose comes with Docker Desktop. For Linux:

```bash
# Check if already installed
docker compose version

# If not installed (Linux):
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

sudo chmod +x /usr/local/bin/docker-compose

# Verify installation
docker compose version
```

## Docker Compose File Structure

A basic `docker-compose.yml` file:

```yaml
version: '3.8'  # Compose file version

services:
  # Define your services here
  web:
    image: nginx
    ports:
      - "8080:80"
  
  db:
    image: postgres:15
    environment:
      POSTGRES_PASSWORD: secret

volumes:
  # Define volumes here

networks:
  # Define networks here
```

## Your First Compose File

### Simple Web Application

**docker-compose.yml:**
```yaml
version: '3.8'

services:
  web:
    image: nginx:alpine
    ports:
      - "8080:80"
    volumes:
      - ./html:/usr/share/nginx/html
```

**Commands:**
```bash
# Start services
docker compose up

# Start in background
docker compose up -d

# Stop services
docker compose down

# View logs
docker compose logs

# List running services
docker compose ps
```

## Service Configuration

### Using Images

```yaml
services:
  # From Docker Hub
  web:
    image: nginx:alpine
  
  # Specific version
  db:
    image: postgres:15.3-alpine
  
  # From private registry
  api:
    image: myregistry.com/myapp:latest
```

### Building from Dockerfile

```yaml
services:
  app:
    # Build from current directory
    build: .
  
  api:
    # Build from specific directory
    build: ./api
  
  frontend:
    # Build with options
    build:
      context: ./frontend
      dockerfile: Dockerfile.prod
      args:
        NODE_VERSION: 20
```

### Container Names

```yaml
services:
  db:
    image: postgres:15
    container_name: my-postgres  # Custom name
```

### Environment Variables

```yaml
services:
  app:
    image: node:20-alpine
    environment:
      # Inline
      NODE_ENV: production
      API_KEY: secret123
      PORT: 3000
    
    # Or from file
    env_file:
      - .env
      - .env.production
```

**.env file:**
```env
NODE_ENV=production
DATABASE_URL=postgres://db:5432/myapp
API_KEY=secret123
```

### Port Mapping

```yaml
services:
  web:
    image: nginx
    ports:
      # HOST:CONTAINER
      - "8080:80"
      - "8443:443"
      
      # Specific interface
      - "127.0.0.1:8080:80"
      
      # UDP protocol
      - "53:53/udp"
      
      # Range
      - "3000-3005:3000-3005"
```

### Volumes

```yaml
services:
  db:
    image: postgres:15
    volumes:
      # Named volume
      - postgres-data:/var/lib/postgresql/data
      
      # Bind mount
      - ./config:/etc/config
      
      # Read-only
      - ./static:/usr/share/nginx/html:ro

volumes:
  postgres-data:  # Define named volume
```

### Networks

```yaml
services:
  web:
    image: nginx
    networks:
      - frontend
  
  api:
    image: my-api
    networks:
      - frontend
      - backend
  
  db:
    image: postgres:15
    networks:
      - backend

networks:
  frontend:
  backend:
```

### Dependencies

Control startup order:

```yaml
services:
  web:
    image: nginx
    depends_on:
      - api
  
  api:
    image: my-api
    depends_on:
      - db
      - redis
  
  db:
    image: postgres:15
  
  redis:
    image: redis:alpine

# Startup order: db & redis → api → web
```

### Restart Policies

```yaml
services:
  app:
    image: my-app
    restart: always
    # Options: no, always, on-failure, unless-stopped
```

### Health Checks

```yaml
services:
  api:
    image: my-api
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
```

## Complete Example

### Full-Stack Application

**Project structure:**
```
my-app/
├── docker-compose.yml
├── frontend/
│   ├── Dockerfile
│   └── ...
├── backend/
│   ├── Dockerfile
│   └── ...
└── nginx/
    └── nginx.conf
```

**docker-compose.yml:**
```yaml
version: '3.8'

services:
  # Frontend
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: my-app-frontend
    restart: unless-stopped
    environment:
      - REACT_APP_API_URL=http://localhost:3000
    depends_on:
      - backend
    networks:
      - app-network

  # Backend API
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: my-app-backend
    restart: unless-stopped
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://postgres:secret@db:5432/myapp
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis
    networks:
      - app-network
    volumes:
      - ./backend/uploads:/app/uploads

  # Nginx Reverse Proxy
  nginx:
    image: nginx:alpine
    container_name: my-app-nginx
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/ssl:/etc/nginx/ssl:ro
    depends_on:
      - frontend
      - backend
    networks:
      - app-network

  # PostgreSQL Database
  db:
    image: postgres:15-alpine
    container_name: my-app-db
    restart: unless-stopped
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=secret
      - POSTGRES_DB=myapp
    volumes:
      - postgres-data:/var/lib/postgresql/data
      - ./database/init.sql:/docker-entrypoint-initdb.d/init.sql
    networks:
      - app-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Redis Cache
  redis:
    image: redis:7-alpine
    container_name: my-app-redis
    restart: unless-stopped
    command: redis-server --appendonly yes
    volumes:
      - redis-data:/data
    networks:
      - app-network
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 3s
      retries: 5

volumes:
  postgres-data:
  redis-data:

networks:
  app-network:
    driver: bridge
```

## Docker Compose Commands

### Starting Services

```bash
# Start services (foreground)
docker compose up

# Start in background (detached)
docker compose up -d

# Build before starting
docker compose up --build

# Start specific services
docker compose up web db

# Force recreate containers
docker compose up --force-recreate

# Remove orphan containers
docker compose up --remove-orphans
```

### Stopping Services

```bash
# Stop services
docker compose stop

# Stop specific service
docker compose stop web

# Stop and remove containers
docker compose down

# Remove containers, networks, volumes
docker compose down -v

# Remove containers and images
docker compose down --rmi all
```

### Viewing Status

```bash
# List running services
docker compose ps

# View logs
docker compose logs

# Follow logs
docker compose logs -f

# Logs for specific service
docker compose logs -f web

# Tail last 100 lines
docker compose logs --tail=100 web
```

### Managing Services

```bash
# Restart services
docker compose restart

# Restart specific service
docker compose restart web

# Pause services
docker compose pause

# Unpause services
docker compose unpause

# Execute command in service
docker compose exec web sh

# Run one-off command
docker compose run --rm web npm test
```

### Building

```bash
# Build all services
docker compose build

# Build specific service
docker compose build web

# Build without cache
docker compose build --no-cache

# Build with progress
docker compose build --progress plain
```

### Scaling Services

```bash
# Scale a service
docker compose up -d --scale api=3

# Verify scaling
docker compose ps
```

## Environment-Specific Configs

### Multiple Compose Files

```bash
# Base configuration
docker-compose.yml

# Development overrides
docker-compose.dev.yml

# Production overrides
docker-compose.prod.yml
```

**docker-compose.yml (base):**
```yaml
version: '3.8'

services:
  web:
    image: nginx
    ports:
      - "80:80"
  
  db:
    image: postgres:15
```

**docker-compose.dev.yml:**
```yaml
version: '3.8'

services:
  web:
    volumes:
      - ./html:/usr/share/nginx/html
  
  db:
    ports:
      - "5432:5432"  # Expose for debugging
```

**docker-compose.prod.yml:**
```yaml
version: '3.8'

services:
  web:
    restart: always
  
  db:
    restart: always
    volumes:
      - postgres-data:/var/lib/postgresql/data

volumes:
  postgres-data:
```

**Usage:**
```bash
# Development
docker compose -f docker-compose.yml -f docker-compose.dev.yml up

# Production
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

### Using Environment Variables

**docker-compose.yml:**
```yaml
version: '3.8'

services:
  web:
    image: nginx:${NGINX_VERSION:-alpine}
    ports:
      - "${WEB_PORT:-80}:80"
  
  db:
    image: postgres:${POSTGRES_VERSION:-15}
    environment:
      POSTGRES_PASSWORD: ${DB_PASSWORD}
```

**.env:**
```env
NGINX_VERSION=1.24-alpine
POSTGRES_VERSION=15.3
WEB_PORT=8080
DB_PASSWORD=secret123
```

## Practical Examples

### Example 1: WordPress Development

```yaml
version: '3.8'

services:
  wordpress:
    image: wordpress:latest
    ports:
      - "8080:80"
    environment:
      WORDPRESS_DB_HOST: db
      WORDPRESS_DB_USER: wordpress
      WORDPRESS_DB_PASSWORD: wordpress
      WORDPRESS_DB_NAME: wordpress
    volumes:
      - ./wp-content:/var/www/html/wp-content
    depends_on:
      - db

  db:
    image: mysql:8
    environment:
      MYSQL_DATABASE: wordpress
      MYSQL_USER: wordpress
      MYSQL_PASSWORD: wordpress
      MYSQL_ROOT_PASSWORD: rootpassword
    volumes:
      - db-data:/var/lib/mysql

  phpmyadmin:
    image: phpmyadmin:latest
    ports:
      - "8081:80"
    environment:
      PMA_HOST: db
      PMA_USER: root
      PMA_PASSWORD: rootpassword
    depends_on:
      - db

volumes:
  db-data:
```

### Example 2: MERN Stack

```yaml
version: '3.8'

services:
  # MongoDB
  mongo:
    image: mongo:7
    restart: unless-stopped
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: password
    volumes:
      - mongo-data:/data/db
    networks:
      - mern-network

  # Express API
  api:
    build: ./server
    restart: unless-stopped
    environment:
      - PORT=5000
      - MONGO_URI=mongodb://admin:password@mongo:27017
      - JWT_SECRET=mysecret
    depends_on:
      - mongo
    networks:
      - mern-network

  # React Frontend
  frontend:
    build: ./client
    restart: unless-stopped
    environment:
      - REACT_APP_API_URL=http://localhost:5000
    depends_on:
      - api
    networks:
      - mern-network

  # Nginx
  nginx:
    image: nginx:alpine
    restart: unless-stopped
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
    depends_on:
      - frontend
      - api
    networks:
      - mern-network

volumes:
  mongo-data:

networks:
  mern-network:
    driver: bridge
```

## Best Practices

::: tip 1. Use Version Control
Store docker-compose.yml in Git:
```bash
git add docker-compose.yml
git commit -m "Add Docker Compose configuration"
```
:::

::: tip 2. Environment Variables
Never commit secrets:
```bash
# .gitignore
.env
.env.local
*.secret
```
:::

::: tip 3. Health Checks
Add health checks for critical services:
```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost/health"]
  interval: 30s
  timeout: 3s
  retries: 3
```
:::

::: tip 4. Resource Limits
Set resource limits:
```yaml
deploy:
  resources:
    limits:
      cpus: '0.5'
      memory: 512M
```
:::

::: tip 5. Named Volumes
Use named volumes for persistence:
```yaml
volumes:
  - postgres-data:/var/lib/postgresql/data
```
:::

## Troubleshooting

### View Service Logs

```bash
# All services
docker compose logs

# Specific service with follow
docker compose logs -f api

# With timestamps
docker compose logs -t api
```

### Debugging Services

```bash
# Access shell in service
docker compose exec api sh

# Run commands
docker compose exec api npm test

# Check service status
docker compose ps

# Inspect service
docker compose exec api env
```

### Common Issues

```bash
# Port already in use
# Change port in docker-compose.yml
ports:
  - "8081:80"  # Use different port

# Service won't start
docker compose up  # View error messages
docker compose logs service-name

# Reset everything
docker compose down -v
docker compose up --build --force-recreate
```

## Summary

You learned:
- ✅ What Docker Compose is and its benefits
- ✅ docker-compose.yml file structure
- ✅ Service configuration options
- ✅ Managing multi-container applications
- ✅ Docker Compose commands
- ✅ Environment-specific configurations
- ✅ Real-world examples and patterns
- ✅ Best practices and troubleshooting

::: tip 💡 Key Takeaway
Docker Compose simplifies multi-container applications. Define your entire stack in YAML, use environment variables for configuration, and manage everything with simple commands!
:::

Next: [Docker Registry](./08-registry.md) - Learn to share and distribute your Docker images!
