# Advanced Node.js Topics

In this final chapter, we'll explore advanced topics including clustering, worker threads, security best practices, performance optimization, and deployment strategies.

## Clustering

Node.js runs on a single thread by default. Clustering allows you to utilize all CPU cores.

```
┌─────────────────────────────────────────────────────────────┐
│                    Cluster Architecture                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│                    Master Process                           │
│                    ┌───────────┐                           │
│                    │   Master  │                           │
│                    │  (manages │                           │
│                    │  workers) │                           │
│                    └─────┬─────┘                           │
│           ┌──────────────┼──────────────┐                  │
│           │              │              │                  │
│           ▼              ▼              ▼                  │
│    ┌───────────┐  ┌───────────┐  ┌───────────┐           │
│    │  Worker   │  │  Worker   │  │  Worker   │           │
│    │  (CPU 1)  │  │  (CPU 2)  │  │  (CPU 3)  │           │
│    └───────────┘  └───────────┘  └───────────┘           │
│                                                             │
│    Each worker handles requests independently               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Basic Cluster Setup

```javascript
const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;

if (cluster.isPrimary) {
    console.log(`Primary ${process.pid} is running`);
    console.log(`Forking ${numCPUs} workers...`);

    // Fork workers
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    // Handle worker exit
    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died`);
        console.log('Starting a new worker...');
        cluster.fork();
    });

} else {
    // Workers share the TCP connection
    http.createServer((req, res) => {
        res.writeHead(200);
        res.end(`Hello from worker ${process.pid}\n`);
    }).listen(8000);

    console.log(`Worker ${process.pid} started`);
}
```

### Graceful Shutdown with Clustering

```javascript
const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;

if (cluster.isPrimary) {
    const workers = [];

    for (let i = 0; i < numCPUs; i++) {
        workers.push(cluster.fork());
    }

    // Graceful shutdown
    process.on('SIGTERM', () => {
        console.log('SIGTERM received, shutting down gracefully...');

        workers.forEach(worker => {
            worker.send('shutdown');
        });

        setTimeout(() => {
            console.log('Forcing shutdown...');
            process.exit(1);
        }, 30000);
    });

    cluster.on('exit', (worker, code, signal) => {
        if (!worker.exitedAfterDisconnect) {
            console.log(`Worker ${worker.process.pid} crashed, restarting...`);
            cluster.fork();
        }
    });

} else {
    const server = http.createServer((req, res) => {
        res.writeHead(200);
        res.end('Hello World');
    });

    server.listen(8000);

    process.on('message', (msg) => {
        if (msg === 'shutdown') {
            console.log(`Worker ${process.pid} shutting down...`);

            server.close(() => {
                process.exit(0);
            });
        }
    });
}
```

## Worker Threads

For CPU-intensive tasks, use Worker Threads instead of clustering.

```
┌─────────────────────────────────────────────────────────────┐
│           Worker Threads vs Cluster                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   Cluster:                                                  │
│   • Separate processes                                      │
│   • Own memory space                                        │
│   • Good for: Handling more HTTP requests                   │
│                                                             │
│   Worker Threads:                                           │
│   • Same process, separate threads                          │
│   • Shared memory possible                                  │
│   • Good for: CPU-intensive calculations                    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Basic Worker Thread

**main.js:**
```javascript
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');

if (isMainThread) {
    // Main thread
    const worker = new Worker(__filename, {
        workerData: { start: 1, end: 1000000 }
    });

    worker.on('message', (result) => {
        console.log('Sum:', result);
    });

    worker.on('error', (error) => {
        console.error('Worker error:', error);
    });

    worker.on('exit', (code) => {
        console.log(`Worker exited with code ${code}`);
    });

} else {
    // Worker thread
    const { start, end } = workerData;
    let sum = 0;

    for (let i = start; i <= end; i++) {
        sum += i;
    }

    parentPort.postMessage(sum);
}
```

### Worker Pool

```javascript
const { Worker } = require('worker_threads');
const os = require('os');

class WorkerPool {
    constructor(workerScript, size = os.cpus().length) {
        this.workerScript = workerScript;
        this.size = size;
        this.workers = [];
        this.freeWorkers = [];
        this.taskQueue = [];

        this.init();
    }

    init() {
        for (let i = 0; i < this.size; i++) {
            this.addWorker();
        }
    }

    addWorker() {
        const worker = new Worker(this.workerScript);

        worker.on('message', (result) => {
            worker.taskCallback(null, result);
            worker.taskCallback = null;
            this.freeWorkers.push(worker);
            this.processQueue();
        });

        worker.on('error', (error) => {
            if (worker.taskCallback) {
                worker.taskCallback(error);
            }
            this.workers = this.workers.filter(w => w !== worker);
            this.addWorker();
        });

        this.workers.push(worker);
        this.freeWorkers.push(worker);
    }

    processQueue() {
        if (this.taskQueue.length > 0 && this.freeWorkers.length > 0) {
            const { data, callback } = this.taskQueue.shift();
            const worker = this.freeWorkers.pop();

            worker.taskCallback = callback;
            worker.postMessage(data);
        }
    }

    execute(data) {
        return new Promise((resolve, reject) => {
            this.taskQueue.push({
                data,
                callback: (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            });
            this.processQueue();
        });
    }

    destroy() {
        this.workers.forEach(worker => worker.terminate());
    }
}

// Usage
const pool = new WorkerPool('./heavy-task.js');

const results = await Promise.all([
    pool.execute({ task: 'compute', value: 100 }),
    pool.execute({ task: 'compute', value: 200 }),
    pool.execute({ task: 'compute', value: 300 })
]);
```

## Security Best Practices

### 1. Input Validation

```javascript
const validator = require('validator');

function validateUserInput(input) {
    const errors = [];

    // Email validation
    if (!validator.isEmail(input.email)) {
        errors.push('Invalid email format');
    }

    // Length validation
    if (!validator.isLength(input.username, { min: 3, max: 30 })) {
        errors.push('Username must be 3-30 characters');
    }

    // Alphanumeric check
    if (!validator.isAlphanumeric(input.username)) {
        errors.push('Username must be alphanumeric');
    }

    // Sanitize
    const sanitized = {
        email: validator.normalizeEmail(input.email),
        username: validator.escape(input.username)
    };

    return { errors, sanitized };
}
```

### 2. Preventing SQL Injection

```javascript
// ❌ Bad - SQL Injection vulnerable
const query = `SELECT * FROM users WHERE id = ${userId}`;

// ✅ Good - Parameterized query
const query = 'SELECT * FROM users WHERE id = ?';
db.query(query, [userId]);

// ✅ Using an ORM (Prisma, TypeORM, Sequelize)
const user = await prisma.user.findUnique({
    where: { id: userId }
});
```

### 3. Preventing XSS

```javascript
const escapeHtml = require('escape-html');

// ❌ Bad - XSS vulnerable
res.send(`<h1>Hello ${userName}</h1>`);

// ✅ Good - Escape user input
res.send(`<h1>Hello ${escapeHtml(userName)}</h1>`);

// ✅ Better - Use template engines with auto-escaping
// EJS, Pug, Handlebars automatically escape by default
```

### 4. Environment Variables

```javascript
// Never hardcode secrets
// ❌ Bad
const API_KEY = 'sk-1234567890';

// ✅ Good - Use environment variables
require('dotenv').config();
const API_KEY = process.env.API_KEY;

// Validate required env vars
const requiredEnvVars = ['DATABASE_URL', 'API_KEY', 'JWT_SECRET'];
for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
        throw new Error(`Missing required environment variable: ${envVar}`);
    }
}
```

### 5. Rate Limiting

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per window
    message: 'Too many requests, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});

app.use('/api/', limiter);

// Stricter limit for auth routes
const authLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, // 5 login attempts per hour
    message: 'Too many login attempts'
});

app.use('/api/auth/', authLimiter);
```

### 6. Security Headers

```javascript
const helmet = require('helmet');

app.use(helmet());

// Or configure individually
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", 'data:', 'https:'],
        },
    },
    crossOriginEmbedderPolicy: true,
    crossOriginOpenerPolicy: true,
    crossOriginResourcePolicy: { policy: "same-site" },
    dnsPrefetchControl: true,
    frameguard: { action: 'deny' },
    hidePoweredBy: true,
    hsts: true,
    ieNoOpen: true,
    noSniff: true,
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    xssFilter: true,
}));
```

## Performance Optimization

### 1. Caching

```javascript
const NodeCache = require('node-cache');

const cache = new NodeCache({
    stdTTL: 600,        // 10 minutes default TTL
    checkperiod: 120    // Check for expired every 2 min
});

async function getUser(id) {
    const cacheKey = `user:${id}`;

    // Check cache first
    const cached = cache.get(cacheKey);
    if (cached) {
        return cached;
    }

    // Fetch from database
    const user = await db.users.findById(id);

    // Store in cache
    cache.set(cacheKey, user);

    return user;
}

// Invalidate cache when data changes
async function updateUser(id, data) {
    await db.users.update(id, data);
    cache.del(`user:${id}`);
}
```

### 2. Response Compression

```javascript
const compression = require('compression');

// Compress all responses
app.use(compression());

// With options
app.use(compression({
    level: 6,                    // Compression level (0-9)
    threshold: 1024,             // Only compress > 1KB
    filter: (req, res) => {
        if (req.headers['x-no-compression']) {
            return false;
        }
        return compression.filter(req, res);
    }
}));
```

### 3. Database Query Optimization

```javascript
// ❌ Bad - N+1 query problem
const users = await User.findAll();
for (const user of users) {
    const posts = await Post.findAll({ where: { userId: user.id } });
    // ...
}

// ✅ Good - Eager loading
const users = await User.findAll({
    include: [{ model: Post }]
});

// ✅ Good - Batch queries
const userIds = users.map(u => u.id);
const posts = await Post.findAll({
    where: { userId: userIds }
});
```

### 4. Async Operations

```javascript
// ❌ Bad - Sequential when parallel is possible
const user = await getUser(id);
const products = await getProducts();
const orders = await getOrders(id);

// ✅ Good - Parallel execution
const [user, products, orders] = await Promise.all([
    getUser(id),
    getProducts(),
    getOrders(id)
]);
```

### 5. Memory Management

```javascript
// Avoid memory leaks with event listeners
const EventEmitter = require('events');

class MyService extends EventEmitter {
    constructor() {
        super();
        // Set max listeners to avoid warnings
        this.setMaxListeners(20);
    }

    // Clean up listeners when done
    destroy() {
        this.removeAllListeners();
    }
}

// Close database connections
process.on('SIGTERM', async () => {
    await db.close();
    process.exit(0);
});
```

## Process Management

### Using PM2

```bash
# Install PM2
npm install -g pm2

# Start application
pm2 start app.js

# Start with name
pm2 start app.js --name "my-app"

# Start in cluster mode
pm2 start app.js -i max  # Use all CPUs
pm2 start app.js -i 4    # Use 4 instances

# List processes
pm2 list

# Monitor
pm2 monit

# Logs
pm2 logs
pm2 logs my-app

# Restart
pm2 restart my-app

# Stop
pm2 stop my-app

# Delete
pm2 delete my-app
```

### PM2 Ecosystem File

**ecosystem.config.js:**
```javascript
module.exports = {
    apps: [{
        name: 'my-app',
        script: './src/index.js',
        instances: 'max',
        exec_mode: 'cluster',
        autorestart: true,
        watch: false,
        max_memory_restart: '1G',
        env: {
            NODE_ENV: 'development'
        },
        env_production: {
            NODE_ENV: 'production',
            PORT: 3000
        }
    }]
};
```

```bash
# Start with ecosystem file
pm2 start ecosystem.config.js --env production
```

## Error Handling Best Practices

### Global Error Handlers

```javascript
// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    // Log error, send alerts, etc.
    process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    // In production, you might want to exit
    // process.exit(1);
});

// Express error handler
app.use((err, req, res, next) => {
    console.error(err.stack);

    // Don't leak error details in production
    const isDev = process.env.NODE_ENV === 'development';

    res.status(err.status || 500).json({
        error: {
            message: isDev ? err.message : 'Internal Server Error',
            ...(isDev && { stack: err.stack })
        }
    });
});
```

### Custom Error Classes

```javascript
class AppError extends Error {
    constructor(message, statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}

class NotFoundError extends AppError {
    constructor(message = 'Resource not found') {
        super(message, 404);
    }
}

class ValidationError extends AppError {
    constructor(message = 'Validation failed', errors = []) {
        super(message, 400);
        this.errors = errors;
    }
}

class UnauthorizedError extends AppError {
    constructor(message = 'Unauthorized') {
        super(message, 401);
    }
}

// Usage
if (!user) {
    throw new NotFoundError('User not found');
}
```

## Testing

### Unit Testing with Jest

```javascript
// math.js
function add(a, b) {
    return a + b;
}

function divide(a, b) {
    if (b === 0) throw new Error('Cannot divide by zero');
    return a / b;
}

module.exports = { add, divide };

// math.test.js
const { add, divide } = require('./math');

describe('Math functions', () => {
    describe('add', () => {
        it('should add two positive numbers', () => {
            expect(add(2, 3)).toBe(5);
        });

        it('should handle negative numbers', () => {
            expect(add(-1, -2)).toBe(-3);
        });
    });

    describe('divide', () => {
        it('should divide two numbers', () => {
            expect(divide(10, 2)).toBe(5);
        });

        it('should throw on division by zero', () => {
            expect(() => divide(10, 0)).toThrow('Cannot divide by zero');
        });
    });
});
```

### Integration Testing

```javascript
const request = require('supertest');
const app = require('./app');

describe('User API', () => {
    describe('GET /api/users', () => {
        it('should return all users', async () => {
            const res = await request(app)
                .get('/api/users')
                .expect('Content-Type', /json/)
                .expect(200);

            expect(Array.isArray(res.body)).toBe(true);
        });
    });

    describe('POST /api/users', () => {
        it('should create a new user', async () => {
            const userData = {
                name: 'John Doe',
                email: 'john@example.com'
            };

            const res = await request(app)
                .post('/api/users')
                .send(userData)
                .expect(201);

            expect(res.body.name).toBe(userData.name);
            expect(res.body.email).toBe(userData.email);
            expect(res.body.id).toBeDefined();
        });

        it('should return 400 for invalid data', async () => {
            const res = await request(app)
                .post('/api/users')
                .send({})
                .expect(400);

            expect(res.body.error).toBeDefined();
        });
    });
});
```

## Deployment Checklist

```markdown
## Pre-Deployment Checklist

### Code Quality
- [ ] All tests passing
- [ ] No console.log statements in production code
- [ ] Error handling in place
- [ ] Input validation implemented

### Security
- [ ] Environment variables configured
- [ ] No secrets in code
- [ ] Security headers enabled (helmet)
- [ ] Rate limiting configured
- [ ] HTTPS enabled

### Performance
- [ ] Response compression enabled
- [ ] Caching implemented where needed
- [ ] Database indexes created
- [ ] No N+1 queries

### Monitoring
- [ ] Logging configured
- [ ] Health check endpoint
- [ ] Error tracking (Sentry, etc.)
- [ ] Performance monitoring

### Infrastructure
- [ ] Node.js version specified in package.json
- [ ] PM2 or similar process manager
- [ ] Graceful shutdown handling
- [ ] Backup strategy for database
```

## Summary

| Topic | Key Takeaway |
|-------|--------------|
| **Clustering** | Use all CPU cores for HTTP servers |
| **Worker Threads** | Offload CPU-intensive tasks |
| **Security** | Validate input, sanitize output, use HTTPS |
| **Performance** | Cache, compress, optimize queries |
| **Process Management** | Use PM2 for production |
| **Error Handling** | Global handlers, custom error classes |
| **Testing** | Unit tests, integration tests, coverage |

## What's Next?

Congratulations on completing the Node.js tutorial! You now have a solid foundation in:

- Core Node.js concepts
- Asynchronous programming
- File system operations
- Building HTTP servers
- Package management
- Debugging and testing
- Production best practices

Continue learning by:
- Building real projects
- Exploring frameworks (Express, NestJS, Hono)
- Learning databases (MongoDB, PostgreSQL)
- Studying microservices architecture

---

[Back to Tutorial Index →](/guide/nodejs/)
