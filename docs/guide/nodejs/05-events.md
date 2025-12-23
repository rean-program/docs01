# Events in Node.js

Events are fundamental to Node.js. Many built-in modules like HTTP, Streams, and File System use events. In this tutorial, you'll learn how to use the EventEmitter class and build event-driven applications.

## What are Events?

Events are actions or occurrences that your code can respond to. Think of them like notifications.

```
┌─────────────────────────────────────────────────────────────┐
│                    Event-Driven Pattern                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   ┌───────────────┐                                        │
│   │ Event Emitter │  ──── emit('event') ────►              │
│   └───────────────┘                           │            │
│                                               │            │
│                                               ▼            │
│                          ┌─────────────────────────────┐   │
│                          │      Event Listeners        │   │
│                          │                             │   │
│                          │  on('event', callback1)     │   │
│                          │  on('event', callback2)     │   │
│                          │  on('event', callback3)     │   │
│                          │                             │   │
│                          │  All get notified! 🎉       │   │
│                          └─────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## The EventEmitter Class

All event functionality in Node.js comes from the `events` module.

### Basic Usage

```javascript
const EventEmitter = require('events');

// Create an emitter instance
const emitter = new EventEmitter();

// Register a listener (subscriber)
emitter.on('greet', (name) => {
    console.log(`Hello, ${name}!`);
});

// Emit an event (publish)
emitter.emit('greet', 'World');
// Output: Hello, World!
```

### Multiple Listeners

```javascript
const EventEmitter = require('events');
const emitter = new EventEmitter();

// First listener
emitter.on('userLogin', (user) => {
    console.log(`User logged in: ${user.name}`);
});

// Second listener
emitter.on('userLogin', (user) => {
    console.log(`Sending welcome email to: ${user.email}`);
});

// Third listener
emitter.on('userLogin', (user) => {
    console.log(`Logging activity for: ${user.id}`);
});

// Emit event - all listeners are called
emitter.emit('userLogin', {
    id: 1,
    name: 'John',
    email: 'john@example.com'
});

// Output:
// User logged in: John
// Sending welcome email to: john@example.com
// Logging activity for: 1
```

## Event Methods

### on() - Add Listener

```javascript
// Add a listener that runs every time event is emitted
emitter.on('event', (data) => {
    console.log('Event received:', data);
});
```

### once() - Add One-Time Listener

```javascript
// Listener runs only once, then is removed
emitter.once('connect', () => {
    console.log('Connected! (This only runs once)');
});

emitter.emit('connect'); // Connected! (This only runs once)
emitter.emit('connect'); // (Nothing happens)
```

### off() / removeListener() - Remove Listener

```javascript
const callback = (data) => {
    console.log('Data:', data);
};

// Add listener
emitter.on('data', callback);

// Remove listener (must be same function reference)
emitter.off('data', callback);
// or
emitter.removeListener('data', callback);
```

### removeAllListeners() - Remove All

```javascript
// Remove all listeners for specific event
emitter.removeAllListeners('data');

// Remove ALL listeners for ALL events
emitter.removeAllListeners();
```

### emit() - Trigger Event

```javascript
// Emit with no arguments
emitter.emit('start');

// Emit with one argument
emitter.emit('data', 'Hello');

// Emit with multiple arguments
emitter.emit('message', 'Hello', 'World', 123);
```

### Useful Methods

```javascript
const EventEmitter = require('events');
const emitter = new EventEmitter();

emitter.on('event', () => {});
emitter.on('event', () => {});
emitter.on('other', () => {});

// Get all event names
console.log(emitter.eventNames());
// ['event', 'other']

// Count listeners for an event
console.log(emitter.listenerCount('event'));
// 2

// Get listeners array
console.log(emitter.listeners('event'));
// [Function, Function]
```

## Creating Custom Event Emitters

### Extending EventEmitter

```javascript
const EventEmitter = require('events');

class Counter extends EventEmitter {
    constructor() {
        super();
        this.count = 0;
    }

    increment() {
        this.count++;
        this.emit('increment', this.count);

        if (this.count % 10 === 0) {
            this.emit('milestone', this.count);
        }
    }

    decrement() {
        this.count--;
        this.emit('decrement', this.count);
    }

    reset() {
        this.count = 0;
        this.emit('reset');
    }
}

// Usage
const counter = new Counter();

counter.on('increment', (count) => {
    console.log(`Count is now: ${count}`);
});

counter.on('milestone', (count) => {
    console.log(`🎉 Milestone reached: ${count}!`);
});

counter.on('reset', () => {
    console.log('Counter was reset');
});

// Test it
for (let i = 0; i < 15; i++) {
    counter.increment();
}

// Output:
// Count is now: 1
// Count is now: 2
// ...
// Count is now: 10
// 🎉 Milestone reached: 10!
// ...
```

### Building a Logger with Events

```javascript
const EventEmitter = require('events');
const fs = require('fs').promises;

class Logger extends EventEmitter {
    constructor(options = {}) {
        super();
        this.logFile = options.logFile || 'app.log';
        this.levels = ['debug', 'info', 'warn', 'error'];
    }

    async log(level, message) {
        if (!this.levels.includes(level)) {
            level = 'info';
        }

        const timestamp = new Date().toISOString();
        const logEntry = {
            timestamp,
            level,
            message
        };

        // Emit event for each log
        this.emit('log', logEntry);
        this.emit(level, logEntry);

        // Write to file
        const line = `[${timestamp}] [${level.toUpperCase()}] ${message}\n`;
        await fs.appendFile(this.logFile, line);
    }

    debug(message) { return this.log('debug', message); }
    info(message) { return this.log('info', message); }
    warn(message) { return this.log('warn', message); }
    error(message) { return this.log('error', message); }
}

// Usage
const logger = new Logger({ logFile: 'app.log' });

// Listen to all logs
logger.on('log', (entry) => {
    console.log(`[${entry.level}] ${entry.message}`);
});

// Listen only to errors
logger.on('error', (entry) => {
    // Send alert, notify admin, etc.
    console.error('ALERT! Error occurred:', entry.message);
});

// Use the logger
logger.info('Application started');
logger.warn('Low memory');
logger.error('Database connection failed');
```

## Error Handling with Events

### The 'error' Event

If an `error` event is emitted and there's no listener, Node.js will throw an exception and crash!

```javascript
const EventEmitter = require('events');
const emitter = new EventEmitter();

// ❌ Bad - No error handler, will crash!
emitter.emit('error', new Error('Something went wrong'));

// ✅ Good - Always add error handler
emitter.on('error', (error) => {
    console.error('Error occurred:', error.message);
});

emitter.emit('error', new Error('Something went wrong'));
// Error occurred: Something went wrong
```

### Best Practice: Always Handle Errors

```javascript
class MyService extends EventEmitter {
    async doSomething() {
        try {
            // ... risky operation
            throw new Error('Operation failed');
        } catch (error) {
            // Emit error event
            this.emit('error', error);
        }
    }
}

const service = new MyService();

// Always add error handler!
service.on('error', (error) => {
    console.error('Service error:', error.message);
    // Log, notify, recover, etc.
});

service.doSomething();
```

## Event Listener Best Practices

### Memory Leaks Warning

Node.js warns if you add more than 10 listeners to a single event (possible memory leak).

```javascript
const emitter = new EventEmitter();

// Set max listeners (0 = unlimited)
emitter.setMaxListeners(20);

// Or globally
EventEmitter.defaultMaxListeners = 20;

// Check current max
console.log(emitter.getMaxListeners()); // 20
```

### Removing Listeners to Prevent Memory Leaks

```javascript
class DataFetcher extends EventEmitter {
    constructor() {
        super();
    }

    fetch() {
        // Simulate async data fetch
        setTimeout(() => {
            this.emit('data', { id: 1, name: 'Test' });
        }, 1000);
    }
}

// ❌ Bad - Listeners accumulate
function badUsage() {
    const fetcher = new DataFetcher();

    // Adding listener every time - memory leak!
    setInterval(() => {
        fetcher.on('data', (data) => {
            console.log(data);
        });
        fetcher.fetch();
    }, 2000);
}

// ✅ Good - Use once() or remove listeners
function goodUsage() {
    const fetcher = new DataFetcher();

    setInterval(() => {
        // Use once() - auto-removes after first call
        fetcher.once('data', (data) => {
            console.log(data);
        });
        fetcher.fetch();
    }, 2000);
}
```

## Real-World Examples

### 1. HTTP Server Events

```javascript
const http = require('http');

const server = http.createServer();

// Server events
server.on('request', (req, res) => {
    console.log(`Request: ${req.method} ${req.url}`);
    res.end('Hello World');
});

server.on('listening', () => {
    console.log('Server is listening on port 3000');
});

server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
        console.error('Port 3000 is already in use');
    } else {
        console.error('Server error:', error);
    }
});

server.on('close', () => {
    console.log('Server closed');
});

server.listen(3000);
```

### 2. Process Events

```javascript
// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection:', reason);
});

// Handle process termination
process.on('SIGINT', () => {
    console.log('Received SIGINT. Graceful shutdown...');
    // Cleanup code here
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('Received SIGTERM. Graceful shutdown...');
    // Cleanup code here
    process.exit(0);
});

// Before exit (sync cleanup only)
process.on('beforeExit', (code) => {
    console.log('About to exit with code:', code);
});

// On exit (sync cleanup only)
process.on('exit', (code) => {
    console.log('Exiting with code:', code);
});
```

### 3. Building an Event Bus

```javascript
const EventEmitter = require('events');

// Singleton event bus
class EventBus extends EventEmitter {
    constructor() {
        super();
        this.setMaxListeners(100);
    }
}

const eventBus = new EventBus();

// Module A - User Service
class UserService {
    constructor() {
        // Listen for events from other modules
        eventBus.on('order:created', this.onOrderCreated.bind(this));
    }

    async createUser(userData) {
        const user = { id: Date.now(), ...userData };
        // Emit event for other modules
        eventBus.emit('user:created', user);
        return user;
    }

    onOrderCreated(order) {
        console.log(`UserService: User ${order.userId} created an order`);
    }
}

// Module B - Order Service
class OrderService {
    constructor() {
        eventBus.on('user:created', this.onUserCreated.bind(this));
    }

    async createOrder(orderData) {
        const order = { id: Date.now(), ...orderData };
        eventBus.emit('order:created', order);
        return order;
    }

    onUserCreated(user) {
        console.log(`OrderService: New user ${user.name} registered`);
    }
}

// Module C - Email Service
class EmailService {
    constructor() {
        eventBus.on('user:created', this.sendWelcomeEmail.bind(this));
        eventBus.on('order:created', this.sendOrderConfirmation.bind(this));
    }

    sendWelcomeEmail(user) {
        console.log(`EmailService: Sending welcome email to ${user.email}`);
    }

    sendOrderConfirmation(order) {
        console.log(`EmailService: Sending order confirmation for #${order.id}`);
    }
}

// Usage
const userService = new UserService();
const orderService = new OrderService();
const emailService = new EmailService();

// Create a user - triggers events across modules
await userService.createUser({
    name: 'John',
    email: 'john@example.com'
});

// Output:
// OrderService: New user John registered
// EmailService: Sending welcome email to john@example.com
```

### 4. File Watcher with Events

```javascript
const EventEmitter = require('events');
const fs = require('fs');
const path = require('path');

class FileWatcher extends EventEmitter {
    constructor(directory) {
        super();
        this.directory = directory;
        this.watcher = null;
    }

    start() {
        this.watcher = fs.watch(this.directory, { recursive: true }, (eventType, filename) => {
            if (!filename) return;

            const filepath = path.join(this.directory, filename);
            const ext = path.extname(filename);

            // Emit general change event
            this.emit('change', {
                type: eventType,
                file: filename,
                path: filepath
            });

            // Emit specific events based on file type
            if (ext === '.js') {
                this.emit('jsChange', filepath);
            } else if (ext === '.css') {
                this.emit('cssChange', filepath);
            } else if (ext === '.html') {
                this.emit('htmlChange', filepath);
            }

            // Emit events based on event type
            if (eventType === 'rename') {
                // Could be add or delete
                fs.access(filepath, fs.constants.F_OK, (err) => {
                    if (err) {
                        this.emit('delete', filename);
                    } else {
                        this.emit('add', filename);
                    }
                });
            } else if (eventType === 'change') {
                this.emit('modify', filename);
            }
        });

        this.emit('started', this.directory);
        console.log(`Watching: ${this.directory}`);
    }

    stop() {
        if (this.watcher) {
            this.watcher.close();
            this.emit('stopped');
            console.log('Stopped watching');
        }
    }
}

// Usage
const watcher = new FileWatcher('./src');

watcher.on('change', (info) => {
    console.log(`[${info.type}] ${info.file}`);
});

watcher.on('jsChange', (filepath) => {
    console.log('JavaScript file changed:', filepath);
    // Could trigger rebuild, tests, etc.
});

watcher.on('add', (filename) => {
    console.log('New file added:', filename);
});

watcher.on('delete', (filename) => {
    console.log('File deleted:', filename);
});

watcher.start();

// Stop after 60 seconds
setTimeout(() => watcher.stop(), 60000);
```

## Async Events with Promises

### Waiting for Events

```javascript
const EventEmitter = require('events');

// Helper function to wait for an event
function waitForEvent(emitter, event, timeout = 5000) {
    return new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
            reject(new Error(`Timeout waiting for ${event}`));
        }, timeout);

        emitter.once(event, (data) => {
            clearTimeout(timer);
            resolve(data);
        });

        emitter.once('error', (error) => {
            clearTimeout(timer);
            reject(error);
        });
    });
}

// Usage
const emitter = new EventEmitter();

async function main() {
    // Start waiting for event
    const dataPromise = waitForEvent(emitter, 'data');

    // Simulate async event emission
    setTimeout(() => {
        emitter.emit('data', { message: 'Hello!' });
    }, 1000);

    // Wait for the event
    const data = await dataPromise;
    console.log('Received:', data);
}

main();
```

### Using events.once() (Node.js 11.13+)

```javascript
const { once } = require('events');
const EventEmitter = require('events');

const emitter = new EventEmitter();

async function main() {
    // Start async operation
    setTimeout(() => {
        emitter.emit('ready', 'Data loaded');
    }, 1000);

    // Wait for event using events.once()
    const [result] = await once(emitter, 'ready');
    console.log('Result:', result);
}

main();
```

## Exercise: Build a Task Queue with Events

```javascript
const EventEmitter = require('events');

class TaskQueue extends EventEmitter {
    constructor(concurrency = 1) {
        super();
        this.concurrency = concurrency;
        this.running = 0;
        this.queue = [];
        this.completedCount = 0;
        this.failedCount = 0;
    }

    add(task, name = 'unnamed') {
        this.queue.push({ task, name });
        this.emit('taskAdded', { name, queueLength: this.queue.length });
        this.process();
    }

    async process() {
        while (this.running < this.concurrency && this.queue.length > 0) {
            const { task, name } = this.queue.shift();
            this.running++;

            this.emit('taskStarted', { name, running: this.running });

            try {
                const result = await task();
                this.completedCount++;
                this.emit('taskCompleted', { name, result });
            } catch (error) {
                this.failedCount++;
                this.emit('taskFailed', { name, error });
            } finally {
                this.running--;
                this.emit('taskFinished', {
                    name,
                    running: this.running,
                    queued: this.queue.length
                });

                // Check if all done
                if (this.running === 0 && this.queue.length === 0) {
                    this.emit('allComplete', {
                        completed: this.completedCount,
                        failed: this.failedCount
                    });
                }

                // Process next
                this.process();
            }
        }
    }

    get stats() {
        return {
            running: this.running,
            queued: this.queue.length,
            completed: this.completedCount,
            failed: this.failedCount
        };
    }
}

// Usage
const queue = new TaskQueue(2); // 2 concurrent tasks

// Set up event listeners
queue.on('taskAdded', ({ name, queueLength }) => {
    console.log(`📥 Added: ${name} (Queue: ${queueLength})`);
});

queue.on('taskStarted', ({ name }) => {
    console.log(`▶️  Started: ${name}`);
});

queue.on('taskCompleted', ({ name, result }) => {
    console.log(`✅ Completed: ${name} - Result: ${result}`);
});

queue.on('taskFailed', ({ name, error }) => {
    console.log(`❌ Failed: ${name} - Error: ${error.message}`);
});

queue.on('allComplete', ({ completed, failed }) => {
    console.log(`\n📊 All tasks complete!`);
    console.log(`   Completed: ${completed}`);
    console.log(`   Failed: ${failed}`);
});

// Add tasks
for (let i = 1; i <= 5; i++) {
    queue.add(
        () => new Promise((resolve, reject) => {
            setTimeout(() => {
                if (Math.random() > 0.2) {
                    resolve(`Task ${i} result`);
                } else {
                    reject(new Error(`Task ${i} failed randomly`));
                }
            }, Math.random() * 2000);
        }),
        `Task-${i}`
    );
}
```

## Summary

| Method | Description |
|--------|-------------|
| `on(event, callback)` | Add listener |
| `once(event, callback)` | Add one-time listener |
| `emit(event, ...args)` | Trigger event |
| `off(event, callback)` | Remove listener |
| `removeAllListeners(event)` | Remove all listeners |
| `listenerCount(event)` | Count listeners |
| `eventNames()` | Get all event names |
| `setMaxListeners(n)` | Set max listeners |

## What's Next?

In the next chapter, we'll explore [Streams](/guide/nodejs/06-streams) - how to efficiently handle large amounts of data in Node.js.

---

[Next: Streams →](/guide/nodejs/06-streams)
