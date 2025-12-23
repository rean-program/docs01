# Async Programming in Node.js

Asynchronous programming is at the heart of Node.js. It allows your application to handle multiple operations simultaneously without blocking. In this tutorial, you'll master callbacks, promises, and async/await.

## Why Asynchronous?

Node.js is designed to be non-blocking. Instead of waiting for slow operations (file I/O, network requests, database queries), it continues executing other code.

```
┌─────────────────────────────────────────────────────────────┐
│                    Synchronous (Blocking)                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   Request 1: Read File                                      │
│   ████████████████████ (2 seconds)                          │
│                        │                                    │
│   Request 2: Query DB  ▼                                    │
│                        ████████████████████ (2 seconds)     │
│                                            │                │
│   Request 3: API Call                      ▼                │
│                                            ████████ (1 sec) │
│                                                             │
│   Total Time: 5 seconds  😢                                 │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                   Asynchronous (Non-Blocking)               │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   Request 1: Read File    ████████████████████              │
│   Request 2: Query DB     ████████████████████              │
│   Request 3: API Call     ████████                          │
│                                                             │
│   Total Time: 2 seconds  🎉                                 │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## The Event Loop

The event loop is what makes async programming possible in Node.js.

```
┌─────────────────────────────────────────────────────────────┐
│                    Node.js Event Loop                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   ┌──────────────────────────────────────────────────┐     │
│   │                  Call Stack                       │     │
│   │  (Currently executing code)                       │     │
│   └────────────────────┬─────────────────────────────┘     │
│                        │                                    │
│                        ▼                                    │
│   ┌──────────────────────────────────────────────────┐     │
│   │                  Event Loop                       │     │
│   │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐    │     │
│   │  │Timers  │→│I/O     │→│Check   │→│Close   │    │     │
│   │  │        │ │Callbacks│ │setImm. │ │Callbacks│   │     │
│   │  └────────┘ └────────┘ └────────┘ └────────┘    │     │
│   └────────────────────┬─────────────────────────────┘     │
│                        │                                    │
│                        ▼                                    │
│   ┌──────────────────────────────────────────────────┐     │
│   │              Callback Queue                       │     │
│   │  (Completed async operations waiting to run)      │     │
│   └──────────────────────────────────────────────────┘     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Key Concept:**
1. Synchronous code runs first (on the call stack)
2. Async operations are offloaded to the system
3. When complete, callbacks are added to the queue
4. Event loop moves callbacks to the stack when it's empty

## Callbacks

Callbacks are the original async pattern in Node.js. A callback is a function passed as an argument to another function.

### Basic Callback Pattern

```javascript
// Simulating an async operation
function fetchData(callback) {
    setTimeout(() => {
        const data = { id: 1, name: 'John' };
        callback(data);
    }, 1000);
}

// Using the callback
fetchData((data) => {
    console.log('Received:', data);
});

console.log('Waiting for data...');

// Output:
// Waiting for data...
// (after 1 second)
// Received: { id: 1, name: 'John' }
```

### Error-First Callbacks (Node.js Convention)

Node.js uses "error-first" callbacks where the first parameter is always the error.

```javascript
const fs = require('fs');

// Error-first callback pattern
fs.readFile('file.txt', 'utf8', (error, data) => {
    if (error) {
        console.error('Error:', error.message);
        return;
    }
    console.log('Data:', data);
});
```

**The Pattern:**
```javascript
function asyncOperation(params, callback) {
    // ... do async work ...

    if (somethingWentWrong) {
        callback(new Error('Something failed'), null);
    } else {
        callback(null, result);
    }
}

// Usage
asyncOperation(params, (error, result) => {
    if (error) {
        // Handle error
        return;
    }
    // Use result
});
```

### Callback Hell (The Problem)

When you have nested callbacks, code becomes hard to read:

```javascript
// 😱 Callback Hell - Don't do this!
fs.readFile('file1.txt', 'utf8', (err1, data1) => {
    if (err1) return console.error(err1);

    fs.readFile('file2.txt', 'utf8', (err2, data2) => {
        if (err2) return console.error(err2);

        fs.readFile('file3.txt', 'utf8', (err3, data3) => {
            if (err3) return console.error(err3);

            fs.writeFile('output.txt', data1 + data2 + data3, (err4) => {
                if (err4) return console.error(err4);

                console.log('Done!');
            });
        });
    });
});
```

## Promises

Promises are a cleaner way to handle async operations. A Promise represents a value that may be available now, later, or never.

### Promise States

```
┌─────────────────────────────────────────────────────────────┐
│                    Promise States                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   ┌─────────────┐                                          │
│   │   PENDING   │  ← Initial state                         │
│   └──────┬──────┘                                          │
│          │                                                  │
│          ├──────────────────────┐                          │
│          │                      │                          │
│          ▼                      ▼                          │
│   ┌─────────────┐        ┌─────────────┐                  │
│   │  FULFILLED  │        │  REJECTED   │                  │
│   │  (Success)  │        │  (Error)    │                  │
│   └─────────────┘        └─────────────┘                  │
│          │                      │                          │
│          ▼                      ▼                          │
│      .then()                .catch()                       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Creating Promises

```javascript
// Creating a Promise
const myPromise = new Promise((resolve, reject) => {
    // Async operation
    setTimeout(() => {
        const success = true;

        if (success) {
            resolve('Operation completed!');  // Success
        } else {
            reject(new Error('Operation failed'));  // Failure
        }
    }, 1000);
});

// Using the Promise
myPromise
    .then(result => {
        console.log('Success:', result);
    })
    .catch(error => {
        console.error('Error:', error.message);
    });
```

### Converting Callbacks to Promises

```javascript
const fs = require('fs');

// Wrap callback-based function in a Promise
function readFilePromise(filepath) {
    return new Promise((resolve, reject) => {
        fs.readFile(filepath, 'utf8', (error, data) => {
            if (error) {
                reject(error);
            } else {
                resolve(data);
            }
        });
    });
}

// Usage
readFilePromise('file.txt')
    .then(data => console.log(data))
    .catch(error => console.error(error));
```

### Using util.promisify

Node.js provides a helper to convert callback functions to promises:

```javascript
const fs = require('fs');
const util = require('util');

// Convert callback function to promise
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

// Now use with promises
readFile('file.txt', 'utf8')
    .then(data => console.log(data))
    .catch(error => console.error(error));
```

### Promise Chaining

```javascript
// Promise chaining - much cleaner than callbacks!
readFile('file1.txt', 'utf8')
    .then(data1 => {
        console.log('File 1:', data1);
        return readFile('file2.txt', 'utf8');
    })
    .then(data2 => {
        console.log('File 2:', data2);
        return readFile('file3.txt', 'utf8');
    })
    .then(data3 => {
        console.log('File 3:', data3);
    })
    .catch(error => {
        // Catches any error in the chain
        console.error('Error:', error.message);
    })
    .finally(() => {
        // Always runs
        console.log('All done!');
    });
```

### Promise.all - Parallel Execution

Run multiple promises in parallel and wait for all to complete:

```javascript
const fs = require('fs').promises;

async function readAllFiles() {
    try {
        // Run all reads in parallel
        const results = await Promise.all([
            fs.readFile('file1.txt', 'utf8'),
            fs.readFile('file2.txt', 'utf8'),
            fs.readFile('file3.txt', 'utf8')
        ]);

        console.log('File 1:', results[0]);
        console.log('File 2:', results[1]);
        console.log('File 3:', results[2]);
    } catch (error) {
        // If ANY promise fails, catch is triggered
        console.error('Error:', error.message);
    }
}
```

### Promise.allSettled

Get results of all promises, even if some fail:

```javascript
const promises = [
    Promise.resolve('Success 1'),
    Promise.reject(new Error('Failed')),
    Promise.resolve('Success 2')
];

const results = await Promise.allSettled(promises);

results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
        console.log(`Promise ${index}: ${result.value}`);
    } else {
        console.log(`Promise ${index} failed: ${result.reason.message}`);
    }
});

// Output:
// Promise 0: Success 1
// Promise 1 failed: Failed
// Promise 2: Success 2
```

### Promise.race

Returns when the first promise settles (resolves or rejects):

```javascript
// Timeout pattern
function fetchWithTimeout(url, timeout) {
    return Promise.race([
        fetch(url),
        new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Timeout')), timeout)
        )
    ]);
}

// Usage
try {
    const response = await fetchWithTimeout('https://api.example.com', 5000);
    console.log('Response received');
} catch (error) {
    console.error('Error:', error.message); // 'Timeout' if too slow
}
```

### Promise.any

Returns when the first promise fulfills (ignores rejections):

```javascript
const promises = [
    Promise.reject(new Error('Error 1')),
    Promise.resolve('Success!'),
    Promise.reject(new Error('Error 2'))
];

const result = await Promise.any(promises);
console.log(result); // 'Success!'
```

## Async/Await

Async/await is syntactic sugar over Promises, making async code look synchronous.

### Basic Syntax

```javascript
// Mark function as async
async function fetchData() {
    // await pauses execution until promise resolves
    const response = await fetch('https://api.example.com/data');
    const data = await response.json();
    return data;
}

// Usage
const data = await fetchData();
console.log(data);
```

### Error Handling with try/catch

```javascript
async function processFiles() {
    try {
        const data1 = await fs.readFile('file1.txt', 'utf8');
        const data2 = await fs.readFile('file2.txt', 'utf8');
        const data3 = await fs.readFile('file3.txt', 'utf8');

        await fs.writeFile('output.txt', data1 + data2 + data3);

        console.log('All files processed!');
    } catch (error) {
        console.error('Error processing files:', error.message);
    }
}
```

### Comparison: Callbacks vs Promises vs Async/Await

```javascript
// ==================== Callbacks ====================
fs.readFile('file.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log(data);
});

// ==================== Promises ====================
fs.promises.readFile('file.txt', 'utf8')
    .then(data => console.log(data))
    .catch(err => console.error(err));

// ==================== Async/Await ====================
async function read() {
    try {
        const data = await fs.promises.readFile('file.txt', 'utf8');
        console.log(data);
    } catch (err) {
        console.error(err);
    }
}
```

### Parallel vs Sequential

```javascript
const fs = require('fs').promises;

// ❌ Sequential - Slow (each waits for previous)
async function sequentialRead() {
    const file1 = await fs.readFile('file1.txt', 'utf8');  // Wait
    const file2 = await fs.readFile('file2.txt', 'utf8');  // Wait
    const file3 = await fs.readFile('file3.txt', 'utf8');  // Wait
    return [file1, file2, file3];
}

// ✅ Parallel - Fast (all run simultaneously)
async function parallelRead() {
    const [file1, file2, file3] = await Promise.all([
        fs.readFile('file1.txt', 'utf8'),
        fs.readFile('file2.txt', 'utf8'),
        fs.readFile('file3.txt', 'utf8')
    ]);
    return [file1, file2, file3];
}
```

### Async Loops

```javascript
const files = ['file1.txt', 'file2.txt', 'file3.txt'];

// ❌ forEach doesn't wait for async
files.forEach(async (file) => {
    const data = await fs.readFile(file, 'utf8');  // Won't work as expected!
    console.log(data);
});

// ✅ Use for...of for sequential
for (const file of files) {
    const data = await fs.readFile(file, 'utf8');
    console.log(data);
}

// ✅ Use Promise.all for parallel
const contents = await Promise.all(
    files.map(file => fs.readFile(file, 'utf8'))
);
contents.forEach(data => console.log(data));
```

## Common Async Patterns

### Retry Pattern

```javascript
async function withRetry(fn, maxRetries = 3, delay = 1000) {
    let lastError;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            return await fn();
        } catch (error) {
            lastError = error;
            console.log(`Attempt ${attempt} failed: ${error.message}`);

            if (attempt < maxRetries) {
                console.log(`Retrying in ${delay}ms...`);
                await new Promise(resolve => setTimeout(resolve, delay));
                delay *= 2; // Exponential backoff
            }
        }
    }

    throw lastError;
}

// Usage
const data = await withRetry(async () => {
    const response = await fetch('https://api.example.com/data');
    if (!response.ok) throw new Error('API Error');
    return response.json();
});
```

### Timeout Pattern

```javascript
function withTimeout(promise, timeout) {
    return Promise.race([
        promise,
        new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Operation timed out')), timeout)
        )
    ]);
}

// Usage
try {
    const result = await withTimeout(
        fetch('https://api.example.com/data'),
        5000 // 5 second timeout
    );
    console.log('Result:', result);
} catch (error) {
    if (error.message === 'Operation timed out') {
        console.error('Request took too long');
    } else {
        console.error('Request failed:', error.message);
    }
}
```

### Throttle/Rate Limit Pattern

```javascript
class RateLimiter {
    constructor(maxConcurrent = 5) {
        this.maxConcurrent = maxConcurrent;
        this.running = 0;
        this.queue = [];
    }

    async execute(fn) {
        return new Promise((resolve, reject) => {
            this.queue.push({ fn, resolve, reject });
            this.processQueue();
        });
    }

    async processQueue() {
        if (this.running >= this.maxConcurrent || this.queue.length === 0) {
            return;
        }

        this.running++;
        const { fn, resolve, reject } = this.queue.shift();

        try {
            const result = await fn();
            resolve(result);
        } catch (error) {
            reject(error);
        } finally {
            this.running--;
            this.processQueue();
        }
    }
}

// Usage - only 3 concurrent requests
const limiter = new RateLimiter(3);

const urls = ['url1', 'url2', 'url3', 'url4', 'url5', 'url6'];

const results = await Promise.all(
    urls.map(url => limiter.execute(() => fetch(url)))
);
```

### Sequential Processing with Results

```javascript
async function processSequentially(items, processor) {
    const results = [];

    for (const item of items) {
        const result = await processor(item);
        results.push(result);
    }

    return results;
}

// Usage
const users = [1, 2, 3, 4, 5];
const profiles = await processSequentially(users, async (userId) => {
    const response = await fetch(`/api/users/${userId}`);
    return response.json();
});
```

## Practical Example: Data Pipeline

```javascript
const fs = require('fs').promises;

class DataPipeline {
    constructor() {
        this.steps = [];
    }

    addStep(name, fn) {
        this.steps.push({ name, fn });
        return this; // For chaining
    }

    async run(input) {
        let data = input;

        for (const step of this.steps) {
            console.log(`Running: ${step.name}`);
            const startTime = Date.now();

            try {
                data = await step.fn(data);
                const duration = Date.now() - startTime;
                console.log(`  ✓ Completed in ${duration}ms`);
            } catch (error) {
                console.error(`  ✗ Failed: ${error.message}`);
                throw error;
            }
        }

        return data;
    }
}

// Usage
const pipeline = new DataPipeline()
    .addStep('Read File', async (filepath) => {
        return await fs.readFile(filepath, 'utf8');
    })
    .addStep('Parse JSON', async (content) => {
        return JSON.parse(content);
    })
    .addStep('Transform Data', async (data) => {
        return data.map(item => ({
            ...item,
            processed: true,
            timestamp: new Date().toISOString()
        }));
    })
    .addStep('Save Results', async (data) => {
        await fs.writeFile('output.json', JSON.stringify(data, null, 2));
        return data;
    });

// Run the pipeline
const result = await pipeline.run('input.json');
console.log('Pipeline completed! Processed', result.length, 'items');
```

## Exercise: Build an Async Task Queue

```javascript
class TaskQueue {
    constructor(concurrency = 1) {
        this.concurrency = concurrency;
        this.running = 0;
        this.queue = [];
        this.results = [];
    }

    // Add a task to the queue
    add(task) {
        return new Promise((resolve, reject) => {
            this.queue.push({
                task,
                resolve,
                reject
            });
            this.process();
        });
    }

    // Add multiple tasks
    addAll(tasks) {
        return Promise.all(tasks.map(task => this.add(task)));
    }

    // Process queue
    async process() {
        if (this.running >= this.concurrency || this.queue.length === 0) {
            return;
        }

        this.running++;
        const { task, resolve, reject } = this.queue.shift();

        try {
            const result = await task();
            resolve(result);
        } catch (error) {
            reject(error);
        } finally {
            this.running--;
            this.process();
        }
    }

    // Wait for all tasks to complete
    async drain() {
        while (this.running > 0 || this.queue.length > 0) {
            await new Promise(resolve => setTimeout(resolve, 10));
        }
    }

    // Get queue stats
    get stats() {
        return {
            running: this.running,
            queued: this.queue.length
        };
    }
}

// Usage
const queue = new TaskQueue(3); // 3 concurrent tasks

// Add tasks
const tasks = Array.from({ length: 10 }, (_, i) => {
    return () => new Promise(resolve => {
        setTimeout(() => {
            console.log(`Task ${i + 1} completed`);
            resolve(i + 1);
        }, Math.random() * 1000);
    });
});

const results = await queue.addAll(tasks);
console.log('All results:', results);
```

## Summary

| Pattern | Use Case | Syntax |
|---------|----------|--------|
| **Callbacks** | Legacy code, events | `fn(callback)` |
| **Promises** | Single async operation | `.then().catch()` |
| **async/await** | Clean async code | `await promise` |
| **Promise.all** | Parallel operations | `await Promise.all([])` |
| **Promise.race** | First to complete/timeout | `await Promise.race([])` |
| **Promise.allSettled** | All results (with failures) | `await Promise.allSettled([])` |

## Best Practices

1. **Always handle errors** - Use try/catch or .catch()
2. **Prefer async/await** - Cleaner and easier to debug
3. **Use Promise.all for parallel** - Don't await in sequence unnecessarily
4. **Add timeouts** - Prevent hanging operations
5. **Implement retries** - For unreliable operations

## What's Next?

In the next chapter, we'll explore [Events](/guide/nodejs/05-events) - the event-driven architecture that powers Node.js.

---

[Next: Events →](/guide/nodejs/05-events)
