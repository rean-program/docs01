# Async Programming

JavaScript is single-threaded but handles asynchronous operations through an event loop. This allows non-blocking operations like network requests, file I/O, and timers.

::: info What You'll Learn
- Understand synchronous vs asynchronous code execution
- Master callbacks and recognize callback hell
- Work with Promises and their methods
- Write clean async code with async/await
- Use the Fetch API for HTTP requests
- Understand the JavaScript event loop
:::

## Why Async Matters

```
┌─────────────────────────────────────────────────────────────┐
│                    Real World Analogy                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  SYNCHRONOUS (Waiting in Line)      ASYNCHRONOUS (Online)   │
│  ┌─────────────────────┐           ┌─────────────────────┐  │
│  │ 1. Go to bank       │           │ 1. Start online     │  │
│  │ 2. Wait in line...  │           │    transfer         │  │
│  │ 3. Wait more...     │           │ 2. Do other things  │  │
│  │ 4. Finally served   │           │ 3. Get notification │  │
│  │ 5. Go home          │           │    when done        │  │
│  └─────────────────────┘           └─────────────────────┘  │
│                                                              │
│  Total time: 2 hours               Total time: 5 minutes    │
│  (Blocked the whole time)          (Free to do other work)  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Synchronous vs Asynchronous

### Synchronous Code

```js
console.log("First");
console.log("Second");
console.log("Third");
// Output: First, Second, Third (in order)
```

### Asynchronous Code

```js
console.log("First");

setTimeout(() => {
    console.log("Second");
}, 1000);

console.log("Third");
// Output: First, Third, Second
```

::: tip Execution Timeline
```
Time →
0ms      1ms      2ms      ...      1000ms    1001ms
|        |        |                 |         |
▼        ▼        ▼                 ▼         ▼
"First"  "Third"  (waiting...)      "Second"  (done)
   ↓        ↓                          ↓
   |        |                          |
   └────────┴── Main thread busy ──────┴── Timer callback
```
:::

## Async Patterns Comparison

| Pattern | Syntax | Error Handling | Best For |
|---------|--------|----------------|----------|
| Callbacks | `fn(callback)` | Error-first `(err, data)` | Simple, single operations |
| Promises | `.then().catch()` | `.catch()` block | Chaining operations |
| Async/Await | `await fn()` | `try/catch` | Clean, readable code |

## Callbacks

The traditional way to handle async operations:

```js
function fetchData(callback) {
    setTimeout(() => {
        const data = { id: 1, name: "Product" };
        callback(data);
    }, 1000);
}

fetchData((data) => {
    console.log("Received:", data);
});
```

### Callback Hell

Nested callbacks become hard to manage:

```js
getUser(userId, (user) => {
    getOrders(user.id, (orders) => {
        getOrderDetails(orders[0].id, (details) => {
            getProduct(details.productId, (product) => {
                console.log(product);
                // This is callback hell!
            });
        });
    });
});
```

::: warning The Pyramid of Doom
```
getUser ──┐
          └──> getOrders ──┐
                           └──> getOrderDetails ──┐
                                                  └──> getProduct ──┐
                                                                    └──> ???

Problems:
• Hard to read (grows to the right)
• Hard to maintain
• Error handling is messy
• Difficult to debug
```
:::

### Error Handling with Callbacks

```js
function fetchData(callback) {
    setTimeout(() => {
        const error = Math.random() > 0.5 ? new Error("Failed") : null;
        const data = { id: 1, name: "Product" };

        callback(error, data);
    }, 1000);
}

fetchData((error, data) => {
    if (error) {
        console.error("Error:", error.message);
        return;
    }
    console.log("Data:", data);
});
```

## Promises

Promises represent the eventual completion or failure of an async operation.

```
┌────────────────────────────────────────────────────────────────┐
│                    Promise Lifecycle                            │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│   new Promise()          resolve(value)          .then()        │
│        │                      │                     │           │
│        ▼                      ▼                     ▼           │
│   ┌─────────┐            ┌─────────┐          ┌─────────┐      │
│   │ PENDING │ ────────▶  │FULFILLED│ ───────▶ │ Handle  │      │
│   └─────────┘            └─────────┘          │ Success │      │
│        │                                      └─────────┘      │
│        │ reject(error)                                          │
│        │      │                                                 │
│        ▼      ▼                                                 │
│   ┌─────────────┐            ┌─────────┐                       │
│   │  REJECTED   │ ─────────▶ │ Handle  │                       │
│   └─────────────┘            │  Error  │                       │
│                              └─────────┘                       │
│                                   ▲                             │
│                                   │                             │
│                              .catch()                           │
│                                                                 │
└────────────────────────────────────────────────────────────────┘
```

### Creating Promises

```js
const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
        const success = true;

        if (success) {
            resolve({ id: 1, name: "Product" });
        } else {
            reject(new Error("Failed to fetch"));
        }
    }, 1000);
});
```

### Using Promises

```js
promise
    .then((data) => {
        console.log("Success:", data);
        return data.name;
    })
    .then((name) => {
        console.log("Name:", name);
    })
    .catch((error) => {
        console.error("Error:", error.message);
    })
    .finally(() => {
        console.log("Done (success or failure)");
    });
```

### Promise States

1. **Pending**: Initial state, neither fulfilled nor rejected
2. **Fulfilled**: Operation completed successfully
3. **Rejected**: Operation failed

```js
const pending = new Promise(() => {});
const fulfilled = Promise.resolve("Success");
const rejected = Promise.reject(new Error("Failed"));
```

::: tip Promise States at a Glance
| State | Description | Next Action |
|-------|-------------|-------------|
| `pending` | Operation in progress | Wait... |
| `fulfilled` | Success! Value available | `.then(value)` |
| `rejected` | Error occurred | `.catch(error)` |

**Note:** A promise can only change state once. Once settled (fulfilled or rejected), it's final!
:::

### Chaining Promises

```js
function getUser(userId) {
    return new Promise((resolve) => {
        setTimeout(() => resolve({ id: userId, name: "John" }), 100);
    });
}

function getOrders(userId) {
    return new Promise((resolve) => {
        setTimeout(() => resolve([{ id: 1 }, { id: 2 }]), 100);
    });
}

function getOrderDetails(orderId) {
    return new Promise((resolve) => {
        setTimeout(() => resolve({ orderId, total: 99.99 }), 100);
    });
}

// Chain instead of nest
getUser(1)
    .then(user => {
        console.log("User:", user);
        return getOrders(user.id);
    })
    .then(orders => {
        console.log("Orders:", orders);
        return getOrderDetails(orders[0].id);
    })
    .then(details => {
        console.log("Details:", details);
    })
    .catch(error => {
        console.error("Error:", error);
    });
```

### Promise Static Methods

```
┌─────────────────────────────────────────────────────────────────┐
│              Promise Static Methods Comparison                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Promise.all()              Promise.allSettled()                 │
│  ┌───┐ ┌───┐ ┌───┐          ┌───┐ ┌───┐ ┌───┐                   │
│  │ ✓ │ │ ✓ │ │ ✓ │ → ✓      │ ✓ │ │ ✗ │ │ ✓ │ → Results[]       │
│  └───┘ └───┘ └───┘          └───┘ └───┘ └───┘                   │
│  │ ✓ │ │ ✗ │ │ ✓ │ → ✗      All results returned                │
│  ALL must succeed           regardless of success/failure        │
│                                                                  │
│  Promise.race()             Promise.any()                        │
│  ┌───┐ ┌───┐ ┌───┐          ┌───┐ ┌───┐ ┌───┐                   │
│  │ 🏃 │ │ 🚶 │ │ 🐢 │ → First │ ✗ │ │ ✓ │ │ ✗ │ → First ✓       │
│  └───┘ └───┘ └───┘          └───┘ └───┘ └───┘                   │
│  First to finish wins       First SUCCESS wins                   │
│  (success OR failure)       (ignores failures)                   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

#### Promise.all()

Wait for all promises to resolve:

```js
const promise1 = fetch("/api/users");
const promise2 = fetch("/api/products");
const promise3 = fetch("/api/orders");

Promise.all([promise1, promise2, promise3])
    .then(([users, products, orders]) => {
        console.log("All data loaded");
    })
    .catch(error => {
        console.log("One failed, all fail");
    });
```

#### Promise.allSettled()

Wait for all to complete (regardless of success/failure):

```js
Promise.allSettled([promise1, promise2, promise3])
    .then(results => {
        results.forEach(result => {
            if (result.status === "fulfilled") {
                console.log("Success:", result.value);
            } else {
                console.log("Failed:", result.reason);
            }
        });
    });
```

#### Promise.race()

Return first settled promise:

```js
const slow = new Promise(resolve => setTimeout(() => resolve("slow"), 2000));
const fast = new Promise(resolve => setTimeout(() => resolve("fast"), 100));

Promise.race([slow, fast])
    .then(result => {
        console.log(result); // "fast"
    });
```

#### Promise.any()

Return first fulfilled promise:

```js
const promises = [
    Promise.reject("Error 1"),
    Promise.resolve("Success"),
    Promise.reject("Error 2")
];

Promise.any(promises)
    .then(result => {
        console.log(result); // "Success"
    })
    .catch(errors => {
        console.log("All failed");
    });
```

## Async/Await

Syntactic sugar over Promises for cleaner async code.

```
┌─────────────────────────────────────────────────────────────────┐
│            Callbacks → Promises → Async/Await                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  CALLBACKS (Old Way)         PROMISES (Better)                   │
│  ┌──────────────────┐        ┌──────────────────┐               │
│  │ getData(cb => {  │        │ getData()        │               │
│  │   process(cb => {│        │   .then(process) │               │
│  │     save(cb => { │        │   .then(save)    │               │
│  │       done()     │        │   .then(done)    │               │
│  │     })           │        │   .catch(error)  │               │
│  │   })             │        │                  │               │
│  │ })               │        │                  │               │
│  └──────────────────┘        └──────────────────┘               │
│                                                                  │
│  ASYNC/AWAIT (Best)                                              │
│  ┌──────────────────────────────────────────────┐               │
│  │ async function run() {                        │               │
│  │   const data = await getData();               │  Reads like   │
│  │   const result = await process(data);         │  synchronous  │
│  │   await save(result);                         │  code!        │
│  │   done();                                     │               │
│  │ }                                             │               │
│  └──────────────────────────────────────────────┘               │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Basic Usage

```js
async function fetchUser() {
    const response = await fetch("/api/user");
    const user = await response.json();
    return user;
}

// Using the function
fetchUser().then(user => console.log(user));
```

### Error Handling

```js
async function fetchData() {
    try {
        const response = await fetch("/api/data");

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Fetch failed:", error);
        throw error; // Re-throw if caller needs to handle
    }
}
```

### Sequential vs Parallel

```
┌─────────────────────────────────────────────────────────────────┐
│              Sequential vs Parallel Execution                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  SEQUENTIAL (One at a time)                                      │
│  ────────────────────────────────────────────────────           │
│  Time →                                                          │
│  |──── User ────|──── Orders ────|──── Products ────|           │
│  0s             1s                2s                 3s          │
│  Total: 3 seconds                                                │
│                                                                  │
│  PARALLEL (All at once)                                          │
│  ────────────────────────────────────────────────────           │
│  Time →                                                          │
│  |──── User ────────|                                           │
│  |──── Orders ──────|                                           │
│  |──── Products ────|                                           │
│  0s                 1s                                           │
│  Total: 1 second (fastest request time)                          │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

```js
// Sequential - one after another (SLOW)
async function sequential() {
    const user = await getUser(1);      // Wait 1s
    const orders = await getOrders(1);  // Then wait 1s
    const products = await getProducts(); // Then wait 1s
    return { user, orders, products };   // Total: ~3s
}

// Parallel - all at once (FAST)
async function parallel() {
    const [user, orders, products] = await Promise.all([
        getUser(1),      // Start immediately
        getOrders(1),    // Start immediately
        getProducts()    // Start immediately
    ]);
    return { user, orders, products }; // Total: ~1s
}
```

::: tip When to Use Each
- **Sequential**: When requests depend on each other
- **Parallel**: When requests are independent (3x faster!)
:::

### Async Loops

```js
// Sequential processing
async function processSequentially(items) {
    for (const item of items) {
        await processItem(item);
    }
}

// Parallel processing
async function processInParallel(items) {
    await Promise.all(items.map(item => processItem(item)));
}

// Batched parallel processing
async function processBatched(items, batchSize = 3) {
    for (let i = 0; i < items.length; i += batchSize) {
        const batch = items.slice(i, i + batchSize);
        await Promise.all(batch.map(item => processItem(item)));
    }
}
```

### Top-Level Await

In ES modules, you can use await at the top level:

```js
// In an ES module (.mjs or type="module")
const response = await fetch("/api/config");
const config = await response.json();

export { config };
```

## Fetch API

Modern API for making HTTP requests.

::: info Fetch Method Reference
| Method | Use Case | Body? |
|--------|----------|-------|
| `GET` | Retrieve data | No |
| `POST` | Create new resource | Yes |
| `PUT` | Replace entire resource | Yes |
| `PATCH` | Update partial resource | Yes |
| `DELETE` | Remove resource | Rarely |
:::

### GET Request

```js
async function getUsers() {
    const response = await fetch("/api/users");
    const users = await response.json();
    return users;
}
```

### POST Request

```js
async function createUser(userData) {
    const response = await fetch("/api/users", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(userData)
    });

    if (!response.ok) {
        throw new Error("Failed to create user");
    }

    return response.json();
}
```

### Other Methods

```js
// PUT
await fetch("/api/users/1", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedData)
});

// DELETE
await fetch("/api/users/1", {
    method: "DELETE"
});

// With query parameters
const params = new URLSearchParams({ page: 1, limit: 10 });
await fetch(`/api/users?${params}`);
```

### Handling Response

```js
async function handleResponse(url) {
    const response = await fetch(url);

    // Check status
    console.log(response.status);     // 200
    console.log(response.ok);         // true (200-299)
    console.log(response.statusText); // "OK"

    // Response headers
    console.log(response.headers.get("Content-Type"));

    // Parse body (can only be read once)
    const json = await response.json();
    // or
    const text = await response.text();
    // or
    const blob = await response.blob();
}
```

### Fetch with Timeout

```js
async function fetchWithTimeout(url, timeout = 5000) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
        const response = await fetch(url, {
            signal: controller.signal
        });
        clearTimeout(timeoutId);
        return response;
    } catch (error) {
        clearTimeout(timeoutId);
        if (error.name === "AbortError") {
            throw new Error("Request timed out");
        }
        throw error;
    }
}
```

## Timers

### setTimeout

Execute once after delay:

```js
const timeoutId = setTimeout(() => {
    console.log("Executed after 2 seconds");
}, 2000);

// Cancel before execution
clearTimeout(timeoutId);
```

### setInterval

Execute repeatedly:

```js
let count = 0;
const intervalId = setInterval(() => {
    count++;
    console.log(`Count: ${count}`);

    if (count >= 5) {
        clearInterval(intervalId);
    }
}, 1000);
```

### Promisified Timer

```js
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function example() {
    console.log("Start");
    await delay(2000);
    console.log("After 2 seconds");
}
```

## Event Loop

Understanding how JavaScript handles async operations.

```
┌─────────────────────────────────────────────────────────────────┐
│                    JavaScript Event Loop                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐     ┌─────────────────────────────────────┐   │
│  │  Call Stack  │     │           Web APIs                  │   │
│  │──────────────│     │  ┌─────────┐ ┌────────┐ ┌───────┐  │   │
│  │ function()   │────▶│  │setTimeout│ │ fetch()│ │ DOM   │  │   │
│  │              │     │  └─────────┘ └────────┘ └───────┘  │   │
│  └──────────────┘     └──────────────────┬──────────────────┘   │
│         ▲                                │                       │
│         │                                ▼                       │
│         │            ┌─────────────────────────────────────┐    │
│         │            │          Task Queues                 │    │
│         │            │  ┌───────────────────────────────┐  │    │
│         │            │  │ Microtasks (Promises, queueM) │  │    │
│         │            │  │ Priority: HIGH (runs first)   │  │    │
│         │            │  └───────────────────────────────┘  │    │
│         │            │  ┌───────────────────────────────┐  │    │
│         └────────────│  │ Macrotasks (setTimeout, I/O)  │  │    │
│                      │  │ Priority: LOW (runs after)    │  │    │
│                      │  └───────────────────────────────┘  │    │
│                      └─────────────────────────────────────┘    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

```js
console.log("1. Synchronous");

setTimeout(() => {
    console.log("4. Timeout (macrotask)");
}, 0);

Promise.resolve().then(() => {
    console.log("3. Promise (microtask)");
});

console.log("2. Synchronous");

// Output order: 1, 2, 3, 4
// Microtasks (Promises) execute before macrotasks (setTimeout)
```

::: tip Execution Priority
1. **Synchronous code** runs first (Call Stack)
2. **Microtasks** run next (Promises, queueMicrotask)
3. **Macrotasks** run last (setTimeout, setInterval, I/O)

Even `setTimeout(..., 0)` waits for microtasks!
:::

## Error Handling Patterns

### Async Error Wrapper

```js
function asyncHandler(fn) {
    return function(...args) {
        return fn(...args).catch(error => {
            console.error("Async error:", error);
        });
    };
}

const safeGetUser = asyncHandler(async (id) => {
    const response = await fetch(`/api/users/${id}`);
    return response.json();
});
```

### Retry Pattern

```js
async function fetchWithRetry(url, retries = 3, delay = 1000) {
    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(url);
            if (response.ok) return response;
        } catch (error) {
            console.log(`Attempt ${i + 1} failed`);
        }

        if (i < retries - 1) {
            await new Promise(r => setTimeout(r, delay));
        }
    }
    throw new Error("All retry attempts failed");
}
```

## Exercises

### Exercise 1: Sequential API Calls
Fetch user, then their posts, then comments on the first post.

::: details Solution
```js
async function getUserPostComments(userId) {
    try {
        // Get user
        const userRes = await fetch(`/api/users/${userId}`);
        const user = await userRes.json();
        console.log("User:", user.name);

        // Get user's posts
        const postsRes = await fetch(`/api/users/${userId}/posts`);
        const posts = await postsRes.json();
        console.log("Posts:", posts.length);

        // Get comments on first post
        if (posts.length > 0) {
            const commentsRes = await fetch(`/api/posts/${posts[0].id}/comments`);
            const comments = await commentsRes.json();
            console.log("Comments:", comments.length);
            return { user, posts, comments };
        }

        return { user, posts, comments: [] };
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}
```
:::

### Exercise 2: Parallel with Timeout
Fetch multiple URLs in parallel with a timeout.

::: details Solution
```js
async function fetchAllWithTimeout(urls, timeout = 5000) {
    const fetchWithTimeout = async (url) => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        try {
            const response = await fetch(url, { signal: controller.signal });
            clearTimeout(timeoutId);
            return { url, data: await response.json(), error: null };
        } catch (error) {
            clearTimeout(timeoutId);
            return { url, data: null, error: error.message };
        }
    };

    return Promise.all(urls.map(fetchWithTimeout));
}

// Usage
const results = await fetchAllWithTimeout([
    "/api/users",
    "/api/products",
    "/api/orders"
], 3000);

results.forEach(({ url, data, error }) => {
    if (error) {
        console.log(`${url} failed: ${error}`);
    } else {
        console.log(`${url} succeeded:`, data);
    }
});
```
:::

### Exercise 3: Debounce Function
Create a debounced async function.

::: details Solution
```js
function debounceAsync(fn, delay) {
    let timeoutId;

    return function(...args) {
        return new Promise((resolve, reject) => {
            clearTimeout(timeoutId);

            timeoutId = setTimeout(async () => {
                try {
                    const result = await fn.apply(this, args);
                    resolve(result);
                } catch (error) {
                    reject(error);
                }
            }, delay);
        });
    };
}

// Usage
const debouncedSearch = debounceAsync(async (query) => {
    const response = await fetch(`/api/search?q=${query}`);
    return response.json();
}, 300);

// In search input handler
input.addEventListener("input", async (e) => {
    const results = await debouncedSearch(e.target.value);
    displayResults(results);
});
```
:::

## Quick Reference

::: tip Async Cheat Sheet
```js
// Creating a Promise
const promise = new Promise((resolve, reject) => {
    // resolve(value) for success
    // reject(error) for failure
});

// Using Promises
promise
    .then(value => { /* success */ })
    .catch(error => { /* failure */ })
    .finally(() => { /* always runs */ });

// Async/Await
async function fetchData() {
    try {
        const result = await promise;
        return result;
    } catch (error) {
        console.error(error);
    }
}

// Parallel Promises
await Promise.all([p1, p2, p3]);      // All must succeed
await Promise.allSettled([p1, p2]);   // Get all results
await Promise.race([p1, p2]);         // First to finish
await Promise.any([p1, p2]);          // First success
```
:::

## Summary

| Concept | Key Point |
|---------|-----------|
| Callbacks | Original pattern, leads to nesting issues |
| Promises | Chainable with `.then()`, `.catch()` |
| Async/Await | Cleanest syntax, use `try/catch` |
| Promise.all | Run parallel, fail if any fails |
| Fetch API | Modern HTTP requests |
| Event Loop | Microtasks before macrotasks |

## Next Steps

Continue to [ES6+ Features](/guide/javascript/08-es6) to learn about modern JavaScript syntax and features.
