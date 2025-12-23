# Debugging Node.js Applications

Debugging is an essential skill for every developer. In this tutorial, you'll learn various techniques and tools to find and fix bugs in your Node.js applications.

## Console Debugging

The simplest debugging method using `console` methods.

### Basic Console Methods

```javascript
// Basic output
console.log('Hello');

// With formatting
console.log('User: %s, Age: %d', 'John', 25);
console.log(`User: ${'John'}, Age: ${25}`);

// Objects and arrays
const user = { name: 'John', age: 25 };
console.log(user);            // { name: 'John', age: 25 }
console.log('User:', user);   // User: { name: 'John', age: 25 }

// Deep object inspection
console.dir(user, { depth: null, colors: true });

// Table format
const users = [
    { name: 'John', age: 25 },
    { name: 'Jane', age: 30 }
];
console.table(users);
```

### Log Levels

```javascript
console.log('Regular log');      // stdout
console.info('Information');     // stdout
console.warn('Warning!');        // stderr (yellow)
console.error('Error!');         // stderr (red)
console.debug('Debug info');     // stdout (may be filtered)
```

### Timing and Performance

```javascript
// Measure execution time
console.time('operation');
// ... some operation
await someAsyncOperation();
console.timeEnd('operation');
// Output: operation: 123.456ms

// Multiple timers
console.time('total');
console.time('step1');
await step1();
console.timeEnd('step1');  // step1: 50ms

console.time('step2');
await step2();
console.timeEnd('step2');  // step2: 75ms

console.timeEnd('total');  // total: 125ms
```

### Counting

```javascript
function processItem(item) {
    console.count('processItem called');
    // ... process
}

processItem('a');  // processItem called: 1
processItem('b');  // processItem called: 2
processItem('c');  // processItem called: 3

console.countReset('processItem called');
processItem('d');  // processItem called: 1
```

### Grouping Output

```javascript
console.group('User Processing');
console.log('Step 1: Validate');
console.log('Step 2: Transform');

console.group('Sub-process');
console.log('Detail 1');
console.log('Detail 2');
console.groupEnd();

console.log('Step 3: Save');
console.groupEnd();

// Output:
// User Processing
//   Step 1: Validate
//   Step 2: Transform
//   Sub-process
//     Detail 1
//     Detail 2
//   Step 3: Save
```

### Assert

```javascript
const value = 5;

// Only logs if condition is false
console.assert(value > 0, 'Value should be positive');  // No output
console.assert(value > 10, 'Value should be > 10');     // Assertion failed: Value should be > 10
```

### Stack Trace

```javascript
function a() { b(); }
function b() { c(); }
function c() {
    console.trace('Trace from c()');
}

a();
// Trace from c()
//     at c (file.js:4)
//     at b (file.js:2)
//     at a (file.js:1)
```

## Node.js Built-in Debugger

### Using the inspect Flag

```bash
# Start with debugger
node inspect app.js

# Start with inspector (Chrome DevTools)
node --inspect app.js

# Break on first line
node --inspect-brk app.js
```

### Using debugger Statement

```javascript
function calculateTotal(items) {
    let total = 0;

    for (const item of items) {
        debugger;  // Execution pauses here when debugging
        total += item.price * item.quantity;
    }

    return total;
}
```

### Chrome DevTools Debugging

```bash
# Start with inspector
node --inspect app.js
# or break on first line
node --inspect-brk app.js
```

Then open Chrome and navigate to:
- `chrome://inspect`
- Click "Open dedicated DevTools for Node"

```
┌─────────────────────────────────────────────────────────────┐
│                Chrome DevTools for Node.js                  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   Features available:                                       │
│   • Breakpoints                                             │
│   • Step through code (F10, F11)                           │
│   • Watch expressions                                       │
│   • Call stack inspection                                   │
│   • Variable inspection                                     │
│   • Console                                                 │
│   • Memory profiling                                        │
│   • CPU profiling                                           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## VS Code Debugging

### launch.json Configuration

Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Launch Program",
      "program": "${workspaceFolder}/src/index.js",
      "skipFiles": ["<node_internals>/**"]
    },
    {
      "type": "node",
      "request": "launch",
      "name": "Launch TypeScript",
      "program": "${workspaceFolder}/src/index.ts",
      "preLaunchTask": "tsc: build",
      "outFiles": ["${workspaceFolder}/dist/**/*.js"]
    },
    {
      "type": "node",
      "request": "attach",
      "name": "Attach to Process",
      "port": 9229
    },
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Tests",
      "program": "${workspaceFolder}/node_modules/jest/bin/jest",
      "args": ["--runInBand"],
      "console": "integratedTerminal"
    }
  ]
}
```

### Setting Breakpoints

- Click left of line number to set breakpoint
- Right-click for conditional breakpoints
- Use `debugger` statement in code

### Debugging Features

| Feature | Shortcut | Description |
|---------|----------|-------------|
| Continue | F5 | Run to next breakpoint |
| Step Over | F10 | Execute current line |
| Step Into | F11 | Enter function call |
| Step Out | Shift+F11 | Exit current function |
| Restart | Ctrl+Shift+F5 | Restart debugging |
| Stop | Shift+F5 | Stop debugging |

## Debug Module

Use the `debug` package for conditional debugging.

```bash
npm install debug
```

```javascript
const debug = require('debug');

// Create namespaced debuggers
const dbLog = debug('app:db');
const authLog = debug('app:auth');
const httpLog = debug('app:http');

// Use them
dbLog('Connected to database');
authLog('User authenticated: %s', username);
httpLog('Request: %s %s', req.method, req.url);
```

```bash
# Enable specific namespace
DEBUG=app:db node app.js

# Enable multiple
DEBUG=app:db,app:auth node app.js

# Enable all app namespaces
DEBUG=app:* node app.js

# Enable everything
DEBUG=* node app.js

# Exclude specific
DEBUG=*,-app:http node app.js
```

### Creating a Custom Logger

```javascript
const debug = require('debug');

class Logger {
    constructor(namespace) {
        this.debug = debug(`app:${namespace}`);
        this.error = debug(`app:${namespace}:error`);
        this.warn = debug(`app:${namespace}:warn`);
    }

    log(...args) {
        this.debug(...args);
    }

    info(...args) {
        this.debug('[INFO]', ...args);
    }

    warning(...args) {
        this.warn('[WARN]', ...args);
    }

    err(...args) {
        this.error('[ERROR]', ...args);
    }
}

// Usage
const logger = new Logger('server');
logger.log('Server started on port %d', 3000);
logger.warning('Low memory');
logger.err('Failed to connect');
```

## Error Handling and Stack Traces

### Understanding Stack Traces

```javascript
function outer() {
    inner();
}

function inner() {
    throw new Error('Something went wrong');
}

try {
    outer();
} catch (error) {
    console.error(error.stack);
}

// Output:
// Error: Something went wrong
//     at inner (file.js:6:11)
//     at outer (file.js:2:5)
//     at file.js:10:5
```

### Error with Custom Properties

```javascript
class AppError extends Error {
    constructor(message, code, details = {}) {
        super(message);
        this.name = 'AppError';
        this.code = code;
        this.details = details;
        this.timestamp = new Date().toISOString();

        // Capture stack trace
        Error.captureStackTrace(this, this.constructor);
    }
}

// Usage
throw new AppError('User not found', 'USER_NOT_FOUND', { userId: 123 });
```

### Async Stack Traces

```javascript
// Enable async stack traces (Node.js 12+)
// Run with: node --async-stack-traces app.js

async function fetchUser(id) {
    const response = await fetch(`/users/${id}`);
    if (!response.ok) {
        throw new Error('Failed to fetch user');
    }
    return response.json();
}

async function processUsers() {
    const user = await fetchUser(123);  // Error here shows full async trace
}
```

## Memory Debugging

### Detecting Memory Leaks

```javascript
// Check memory usage
const used = process.memoryUsage();
console.log({
    rss: `${Math.round(used.rss / 1024 / 1024)} MB`,
    heapTotal: `${Math.round(used.heapTotal / 1024 / 1024)} MB`,
    heapUsed: `${Math.round(used.heapUsed / 1024 / 1024)} MB`,
    external: `${Math.round(used.external / 1024 / 1024)} MB`
});
```

### Memory Monitoring

```javascript
class MemoryMonitor {
    constructor(intervalMs = 5000) {
        this.interval = null;
        this.intervalMs = intervalMs;
        this.history = [];
    }

    start() {
        this.interval = setInterval(() => {
            const usage = process.memoryUsage();
            const record = {
                timestamp: Date.now(),
                heapUsed: usage.heapUsed,
                heapTotal: usage.heapTotal,
                rss: usage.rss
            };
            this.history.push(record);

            // Keep last 100 records
            if (this.history.length > 100) {
                this.history.shift();
            }

            // Check for leak (heap growing consistently)
            if (this.history.length >= 10) {
                const recent = this.history.slice(-10);
                const growing = recent.every((r, i) =>
                    i === 0 || r.heapUsed > recent[i - 1].heapUsed
                );
                if (growing) {
                    console.warn('Possible memory leak detected!');
                }
            }
        }, this.intervalMs);
    }

    stop() {
        clearInterval(this.interval);
    }

    report() {
        const current = process.memoryUsage();
        return {
            current: {
                heapUsed: `${(current.heapUsed / 1024 / 1024).toFixed(2)} MB`,
                heapTotal: `${(current.heapTotal / 1024 / 1024).toFixed(2)} MB`,
                rss: `${(current.rss / 1024 / 1024).toFixed(2)} MB`
            },
            history: this.history.length
        };
    }
}

// Usage
const monitor = new MemoryMonitor();
monitor.start();

// Later
console.log(monitor.report());
```

### Heap Snapshots

```bash
# Generate heap snapshot
node --inspect app.js
# Then use Chrome DevTools Memory tab to take snapshot
```

## Performance Debugging

### Using console.time

```javascript
async function benchmark() {
    console.time('Total');

    console.time('Database Query');
    const users = await db.query('SELECT * FROM users');
    console.timeEnd('Database Query');

    console.time('Data Processing');
    const processed = users.map(transform);
    console.timeEnd('Data Processing');

    console.time('Response Formatting');
    const response = formatResponse(processed);
    console.timeEnd('Response Formatting');

    console.timeEnd('Total');
}
```

### Performance Hooks

```javascript
const { performance, PerformanceObserver } = require('perf_hooks');

// Create observer
const obs = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    entries.forEach((entry) => {
        console.log(`${entry.name}: ${entry.duration.toFixed(2)}ms`);
    });
});

obs.observe({ entryTypes: ['measure'] });

// Measure performance
performance.mark('start');

await someOperation();

performance.mark('end');
performance.measure('Operation Duration', 'start', 'end');
```

### CPU Profiling

```bash
# Generate CPU profile
node --prof app.js

# Process the log
node --prof-process isolate-*.log > profile.txt
```

## Common Debugging Scenarios

### 1. Debugging Async Issues

```javascript
// Add error handling to all promises
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Wrap async functions for debugging
function debugAsync(fn, name) {
    return async function(...args) {
        console.log(`[${name}] Starting with args:`, args);
        const start = Date.now();
        try {
            const result = await fn.apply(this, args);
            console.log(`[${name}] Completed in ${Date.now() - start}ms`);
            return result;
        } catch (error) {
            console.error(`[${name}] Failed after ${Date.now() - start}ms:`, error);
            throw error;
        }
    };
}

// Usage
const debuggedFetch = debugAsync(fetchUser, 'fetchUser');
await debuggedFetch(123);
```

### 2. Debugging Request/Response

```javascript
const http = require('http');

// Debug middleware
function debugMiddleware(req, res, next) {
    const start = Date.now();
    const requestId = Math.random().toString(36).slice(2, 9);

    console.log(`[${requestId}] → ${req.method} ${req.url}`);
    console.log(`[${requestId}]   Headers:`, req.headers);

    // Capture response
    const originalEnd = res.end;
    res.end = function(chunk, encoding) {
        const duration = Date.now() - start;
        console.log(`[${requestId}] ← ${res.statusCode} (${duration}ms)`);
        originalEnd.call(this, chunk, encoding);
    };

    next();
}
```

### 3. Debugging Event Emitters

```javascript
const EventEmitter = require('events');

// Debug wrapper
function debugEmitter(emitter, name) {
    const originalEmit = emitter.emit;

    emitter.emit = function(event, ...args) {
        console.log(`[${name}] Emitting: ${event}`, args);
        return originalEmit.apply(this, [event, ...args]);
    };

    const originalOn = emitter.on;
    emitter.on = function(event, handler) {
        console.log(`[${name}] Listener added: ${event}`);
        return originalOn.call(this, event, handler);
    };

    return emitter;
}

// Usage
const emitter = debugEmitter(new EventEmitter(), 'MyEmitter');
emitter.on('data', (d) => console.log(d));
emitter.emit('data', { test: 123 });
```

## Debugging Tools Summary

| Tool | Use Case | Command/Setup |
|------|----------|---------------|
| console.* | Quick debugging | Built-in |
| Chrome DevTools | Visual debugging | `node --inspect` |
| VS Code | IDE debugging | launch.json |
| debug module | Conditional logging | `npm i debug` |
| node --prof | CPU profiling | `node --prof app.js` |
| heapdump | Memory issues | `npm i heapdump` |

## Best Practices

1. **Use structured logging** in production
2. **Never leave debug code** in production
3. **Log meaningful information** with context
4. **Use appropriate log levels**
5. **Add request IDs** for tracing
6. **Handle all errors** explicitly
7. **Monitor memory** in long-running apps
8. **Profile before optimizing**

## What's Next?

In the next chapter, we'll explore [Advanced Topics](/guide/nodejs/10-advanced) - performance optimization, clustering, security, and more.

---

[Next: Advanced Topics →](/guide/nodejs/10-advanced)
