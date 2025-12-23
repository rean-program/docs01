# Advanced Patterns

This guide covers advanced JavaScript patterns, techniques, and best practices used in professional development.

::: info What You'll Learn
- Apply functional programming principles
- Use memoization to optimize performance
- Control function execution with debounce/throttle
- Intercept objects with Proxy
- Implement state management patterns
- Build lazy evaluation systems
- Work with Web Workers for parallel processing
:::

## Advanced Patterns Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                  Advanced JavaScript Patterns                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  FUNCTIONAL PROGRAMMING         PERFORMANCE                      │
│  ────────────────────          ───────────                       │
│  • Pure functions              • Memoization                     │
│  • Immutability               • Debounce/Throttle               │
│  • Composition                • Lazy evaluation                  │
│  • Currying                   • Web Workers                      │
│                                                                  │
│  DESIGN PATTERNS              META-PROGRAMMING                   │
│  ──────────────              ────────────────                    │
│  • Module pattern            • Proxy/Reflect                     │
│  • State management          • Dependency injection              │
│  • Result type               • Observable objects                │
│  • Error handling                                                │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Functional Programming

Writing code using functions as the primary building blocks.

::: tip Functional Programming Principles
| Principle | Description | Benefit |
|-----------|-------------|---------|
| Pure Functions | Same input → same output | Predictable, testable |
| Immutability | Never modify data | Fewer bugs |
| Composition | Combine small functions | Reusable code |
| Declarative | Describe what, not how | Readable code |
:::

### Pure Functions

Functions that always produce the same output for the same input and have no side effects.

```
┌─────────────────────────────────────────────────────────────────┐
│                    Pure vs Impure Functions                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  PURE FUNCTION                    IMPURE FUNCTION                │
│  ─────────────                    ───────────────                │
│  function add(a, b) {             let total = 0;                 │
│      return a + b;                function addToTotal(x) {       │
│  }                                    total += x;  ← Side effect │
│                                       return total;              │
│  add(2, 3) = 5  ✓                 }                              │
│  add(2, 3) = 5  ✓                                                │
│  (always same)                    addToTotal(5) = 5              │
│                                   addToTotal(5) = 10             │
│                                   (different results!)           │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

```js
// Pure function
function add(a, b) {
    return a + b;
}

// Impure function (side effect)
let total = 0;
function addToTotal(value) {
    total += value; // Modifies external state
    return total;
}

// Making it pure
function addToValue(currentTotal, value) {
    return currentTotal + value;
}
```

### Immutability

Never modify existing data; create new copies instead:

```js
// Mutable (avoid)
const user = { name: "John", age: 30 };
user.age = 31;

// Immutable (preferred)
const updatedUser = { ...user, age: 31 };

// Arrays
const numbers = [1, 2, 3];

// Mutable (avoid)
numbers.push(4);

// Immutable (preferred)
const newNumbers = [...numbers, 4];

// Deep immutability
const state = {
    user: { name: "John", settings: { theme: "dark" } },
    items: [1, 2, 3]
};

const newState = {
    ...state,
    user: {
        ...state.user,
        settings: {
            ...state.user.settings,
            theme: "light"
        }
    }
};
```

### Function Composition

Combine simple functions to build complex operations:

```js
const compose = (...fns) => (x) =>
    fns.reduceRight((acc, fn) => fn(acc), x);

const pipe = (...fns) => (x) =>
    fns.reduce((acc, fn) => fn(acc), x);

// Example functions
const add10 = (x) => x + 10;
const multiply2 = (x) => x * 2;
const subtract5 = (x) => x - 5;

// Compose (right to left)
const composed = compose(subtract5, multiply2, add10);
console.log(composed(5)); // ((5 + 10) * 2) - 5 = 25

// Pipe (left to right)
const piped = pipe(add10, multiply2, subtract5);
console.log(piped(5)); // ((5 + 10) * 2) - 5 = 25
```

### Currying

Transform a function with multiple arguments into a sequence of functions:

```js
// Regular function
const add = (a, b, c) => a + b + c;

// Curried version
const curriedAdd = (a) => (b) => (c) => a + b + c;

console.log(curriedAdd(1)(2)(3)); // 6

// Generic curry function
function curry(fn) {
    return function curried(...args) {
        if (args.length >= fn.length) {
            return fn.apply(this, args);
        }
        return (...moreArgs) => curried.apply(this, [...args, ...moreArgs]);
    };
}

const curriedSum = curry((a, b, c) => a + b + c);
console.log(curriedSum(1)(2)(3));     // 6
console.log(curriedSum(1, 2)(3));     // 6
console.log(curriedSum(1)(2, 3));     // 6

// Practical use
const multiply = curry((a, b) => a * b);
const double = multiply(2);
const triple = multiply(3);

console.log(double(5)); // 10
console.log(triple(5)); // 15
```

### Partial Application

Pre-fill some arguments of a function:

```js
function partial(fn, ...presetArgs) {
    return function(...laterArgs) {
        return fn(...presetArgs, ...laterArgs);
    };
}

function greet(greeting, name, punctuation) {
    return `${greeting}, ${name}${punctuation}`;
}

const sayHello = partial(greet, "Hello");
const sayHelloToJohn = partial(greet, "Hello", "John");

console.log(sayHello("Alice", "!")); // "Hello, Alice!"
console.log(sayHelloToJohn("?")); // "Hello, John?"
```

## Memoization

Cache function results for expensive computations.

```
┌─────────────────────────────────────────────────────────────────┐
│                    How Memoization Works                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  First call: fibonacci(10)                                       │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  args: [10]  →  Cache Miss  →  Compute  →  Store in cache │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│  Second call: fibonacci(10)                                      │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  args: [10]  →  Cache Hit!  →  Return cached value        │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│  Cache:                                                          │
│  ┌─────────────────┐                                            │
│  │  [10] → 55     │  ← Stored result                           │
│  │  [5]  → 5      │                                            │
│  │  [8]  → 21     │                                            │
│  └─────────────────┘                                            │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

```js
function memoize(fn) {
    const cache = new Map();

    return function(...args) {
        const key = JSON.stringify(args);

        if (cache.has(key)) {
            return cache.get(key);
        }

        const result = fn.apply(this, args);
        cache.set(key, result);
        return result;
    };
}

// Memoized fibonacci
const fibonacci = memoize((n) => {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
});

console.log(fibonacci(40)); // Fast!

// With TTL (time-to-live)
function memoizeWithTTL(fn, ttl = 60000) {
    const cache = new Map();

    return function(...args) {
        const key = JSON.stringify(args);
        const cached = cache.get(key);

        if (cached && Date.now() - cached.timestamp < ttl) {
            return cached.value;
        }

        const value = fn.apply(this, args);
        cache.set(key, { value, timestamp: Date.now() });
        return value;
    };
}
```

## Debounce and Throttle

Control function execution frequency.

```
┌─────────────────────────────────────────────────────────────────┐
│               Debounce vs Throttle Comparison                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  User Events:  X  X  X  X  X  X  X  X  X  X  (rapid clicks)     │
│  Time:         ─────────────────────────────→                    │
│                                                                  │
│  DEBOUNCE (wait 300ms after LAST event)                         │
│  ──────────────────────────────────────                         │
│  Executes:                              │ X │                    │
│                                         └───┘                    │
│  Only executes after user STOPS for 300ms                        │
│  Use case: Search input, resize handler                          │
│                                                                  │
│  THROTTLE (max once per 300ms)                                   │
│  ────────────────────────────                                    │
│  Executes:  │X│     │X│     │X│     │X│                         │
│             └─┘     └─┘     └─┘     └─┘                          │
│  Executes at regular intervals during events                     │
│  Use case: Scroll handler, mousemove                             │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Debounce

Wait until action stops for a period:

```js
function debounce(fn, delay) {
    let timeoutId;

    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            fn.apply(this, args);
        }, delay);
    };
}

// Usage: Only search after user stops typing
const search = debounce((query) => {
    console.log("Searching for:", query);
}, 300);

input.addEventListener("input", (e) => {
    search(e.target.value);
});
```

### Throttle

Execute at most once per time period:

```js
function throttle(fn, limit) {
    let inThrottle;

    return function(...args) {
        if (!inThrottle) {
            fn.apply(this, args);
            inThrottle = true;
            setTimeout(() => {
                inThrottle = false;
            }, limit);
        }
    };
}

// Usage: Limit scroll event handling
const handleScroll = throttle(() => {
    console.log("Scroll position:", window.scrollY);
}, 100);

window.addEventListener("scroll", handleScroll);
```

## Proxy and Reflect

### Proxy for Object Interception

```js
const user = {
    name: "John",
    age: 30
};

const userProxy = new Proxy(user, {
    get(target, property) {
        console.log(`Getting ${property}`);
        return target[property];
    },

    set(target, property, value) {
        console.log(`Setting ${property} to ${value}`);
        target[property] = value;
        return true;
    },

    deleteProperty(target, property) {
        console.log(`Deleting ${property}`);
        delete target[property];
        return true;
    }
});

userProxy.name;        // Logs: Getting name
userProxy.age = 31;    // Logs: Setting age to 31
delete userProxy.name; // Logs: Deleting name
```

### Validation with Proxy

```js
function createValidatedObject(schema) {
    return new Proxy({}, {
        set(target, property, value) {
            const validator = schema[property];

            if (validator && !validator(value)) {
                throw new Error(`Invalid value for ${property}`);
            }

            target[property] = value;
            return true;
        }
    });
}

const personSchema = {
    name: (v) => typeof v === "string" && v.length > 0,
    age: (v) => typeof v === "number" && v >= 0 && v <= 150,
    email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
};

const person = createValidatedObject(personSchema);
person.name = "John";      // OK
person.age = 30;           // OK
// person.age = -5;        // Error: Invalid value for age
// person.email = "bad";   // Error: Invalid value for email
```

### Observable Objects

```js
function createObservable(target, callback) {
    return new Proxy(target, {
        set(obj, prop, value) {
            const oldValue = obj[prop];
            obj[prop] = value;
            callback(prop, value, oldValue);
            return true;
        }
    });
}

const state = createObservable({ count: 0 }, (prop, newVal, oldVal) => {
    console.log(`${prop} changed from ${oldVal} to ${newVal}`);
});

state.count = 1; // Logs: count changed from 0 to 1
state.count = 2; // Logs: count changed from 1 to 2
```

## Module Patterns

### Revealing Module Pattern

```js
const Calculator = (function() {
    // Private
    let result = 0;

    function validate(n) {
        return typeof n === "number" && !isNaN(n);
    }

    // Public API
    return {
        add(n) {
            if (validate(n)) result += n;
            return this;
        },

        subtract(n) {
            if (validate(n)) result -= n;
            return this;
        },

        getResult() {
            return result;
        },

        reset() {
            result = 0;
            return this;
        }
    };
})();

Calculator.add(5).add(3).subtract(2);
console.log(Calculator.getResult()); // 6
```

### ES Modules Best Practices

```js
// utils/math.js
export const add = (a, b) => a + b;
export const subtract = (a, b) => a - b;

// utils/index.js (barrel file)
export * from "./math.js";
export * from "./string.js";
export * from "./array.js";

// main.js
import { add, subtract } from "./utils/index.js";
```

## State Management

Centralizing application state for predictable updates.

```
┌─────────────────────────────────────────────────────────────────┐
│                    State Management Flow                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│           ┌─────────────┐                                       │
│           │    VIEW     │ ◀───────────────┐                     │
│           │ (UI renders │                  │                     │
│           │   state)    │                  │                     │
│           └──────┬──────┘                  │                     │
│                  │                         │                     │
│           User clicks                 State updates              │
│                  │                         │                     │
│                  ▼                         │                     │
│           ┌─────────────┐          ┌──────┴──────┐              │
│           │   ACTION    │ ───────▶ │    STORE    │              │
│           │ { type: X } │          │  { count }  │              │
│           └─────────────┘          └──────┬──────┘              │
│                                           │                      │
│                                    Reducer processes             │
│                                    action, returns               │
│                                    new state                     │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Simple Store

```js
function createStore(initialState, reducer) {
    let state = initialState;
    const listeners = new Set();

    return {
        getState() {
            return state;
        },

        dispatch(action) {
            state = reducer(state, action);
            listeners.forEach(listener => listener(state));
        },

        subscribe(listener) {
            listeners.add(listener);
            return () => listeners.delete(listener);
        }
    };
}

// Reducer
function counterReducer(state, action) {
    switch (action.type) {
        case "INCREMENT":
            return { ...state, count: state.count + 1 };
        case "DECREMENT":
            return { ...state, count: state.count - 1 };
        default:
            return state;
    }
}

// Usage
const store = createStore({ count: 0 }, counterReducer);

const unsubscribe = store.subscribe((state) => {
    console.log("State:", state);
});

store.dispatch({ type: "INCREMENT" }); // State: { count: 1 }
store.dispatch({ type: "INCREMENT" }); // State: { count: 2 }
store.dispatch({ type: "DECREMENT" }); // State: { count: 1 }

unsubscribe();
```

## Error Handling Patterns

### Result Type

```js
class Result {
    constructor(value, error) {
        this.value = value;
        this.error = error;
    }

    static ok(value) {
        return new Result(value, null);
    }

    static err(error) {
        return new Result(null, error);
    }

    isOk() {
        return this.error === null;
    }

    isErr() {
        return this.error !== null;
    }

    map(fn) {
        if (this.isErr()) return this;
        return Result.ok(fn(this.value));
    }

    flatMap(fn) {
        if (this.isErr()) return this;
        return fn(this.value);
    }

    unwrapOr(defaultValue) {
        return this.isOk() ? this.value : defaultValue;
    }
}

// Usage
function divide(a, b) {
    if (b === 0) {
        return Result.err("Division by zero");
    }
    return Result.ok(a / b);
}

const result = divide(10, 2)
    .map(x => x * 2)
    .map(x => x + 1);

console.log(result.unwrapOr(0)); // 11
```

### Try/Catch Wrapper

```js
function tryCatch(fn) {
    return function(...args) {
        try {
            const result = fn.apply(this, args);
            return { success: true, data: result };
        } catch (error) {
            return { success: false, error };
        }
    };
}

const safeParse = tryCatch(JSON.parse);

const result1 = safeParse('{"valid": true}');
console.log(result1); // { success: true, data: { valid: true } }

const result2 = safeParse("invalid json");
console.log(result2); // { success: false, error: SyntaxError }
```

## Lazy Evaluation

### Lazy Sequences

```js
function* lazyMap(iterable, fn) {
    for (const item of iterable) {
        yield fn(item);
    }
}

function* lazyFilter(iterable, predicate) {
    for (const item of iterable) {
        if (predicate(item)) {
            yield item;
        }
    }
}

function* lazyTake(iterable, n) {
    let count = 0;
    for (const item of iterable) {
        if (count >= n) break;
        yield item;
        count++;
    }
}

// Process only what's needed
function* infiniteNumbers() {
    let n = 1;
    while (true) {
        yield n++;
    }
}

const result = lazyTake(
    lazyFilter(
        lazyMap(infiniteNumbers(), x => x * 2),
        x => x % 4 === 0
    ),
    5
);

console.log([...result]); // [4, 8, 12, 16, 20]
```

### Lazy Properties

```js
function lazy(getter) {
    let cached;
    let computed = false;

    return {
        get value() {
            if (!computed) {
                cached = getter();
                computed = true;
            }
            return cached;
        }
    };
}

const expensiveData = lazy(() => {
    console.log("Computing...");
    return Array.from({ length: 1000000 }, (_, i) => i);
});

// Not computed until accessed
console.log("Before access");
console.log(expensiveData.value.length); // "Computing..." then 1000000
console.log(expensiveData.value.length); // 1000000 (cached)
```

## Dependency Injection

```js
class Container {
    #services = new Map();

    register(name, factory, singleton = true) {
        this.#services.set(name, {
            factory,
            singleton,
            instance: null
        });
    }

    resolve(name) {
        const service = this.#services.get(name);

        if (!service) {
            throw new Error(`Service ${name} not found`);
        }

        if (service.singleton) {
            if (!service.instance) {
                service.instance = service.factory(this);
            }
            return service.instance;
        }

        return service.factory(this);
    }
}

// Usage
const container = new Container();

container.register("config", () => ({
    apiUrl: "https://api.example.com"
}));

container.register("httpClient", (c) => ({
    config: c.resolve("config"),
    get(url) {
        return fetch(`${this.config.apiUrl}${url}`);
    }
}));

container.register("userService", (c) => ({
    http: c.resolve("httpClient"),
    async getUser(id) {
        return this.http.get(`/users/${id}`);
    }
}));

const userService = container.resolve("userService");
```

## Web Workers

### Basic Worker

```js
// worker.js
self.onmessage = function(e) {
    const result = heavyComputation(e.data);
    self.postMessage(result);
};

function heavyComputation(data) {
    // CPU-intensive work
    let result = 0;
    for (let i = 0; i < data.iterations; i++) {
        result += Math.sqrt(i);
    }
    return result;
}

// main.js
const worker = new Worker("worker.js");

worker.onmessage = function(e) {
    console.log("Result:", e.data);
};

worker.postMessage({ iterations: 1000000 });
```

### Worker Pool

```js
class WorkerPool {
    #workers = [];
    #queue = [];
    #activeCount = 0;

    constructor(workerScript, size = navigator.hardwareConcurrency) {
        for (let i = 0; i < size; i++) {
            const worker = new Worker(workerScript);
            worker.onmessage = (e) => this.#onMessage(worker, e);
            this.#workers.push({ worker, busy: false });
        }
    }

    exec(data) {
        return new Promise((resolve, reject) => {
            this.#queue.push({ data, resolve, reject });
            this.#runNext();
        });
    }

    #runNext() {
        const availableWorker = this.#workers.find(w => !w.busy);
        const task = this.#queue.shift();

        if (availableWorker && task) {
            availableWorker.busy = true;
            availableWorker.task = task;
            availableWorker.worker.postMessage(task.data);
        }
    }

    #onMessage(worker, event) {
        const workerInfo = this.#workers.find(w => w.worker === worker);
        workerInfo.task.resolve(event.data);
        workerInfo.busy = false;
        workerInfo.task = null;
        this.#runNext();
    }

    terminate() {
        this.#workers.forEach(w => w.worker.terminate());
    }
}
```

## Performance Patterns

### Request Animation Frame

```js
class Animator {
    #frameId = null;
    #lastTime = 0;

    start(callback) {
        const animate = (currentTime) => {
            const deltaTime = currentTime - this.#lastTime;
            this.#lastTime = currentTime;

            callback(deltaTime);

            this.#frameId = requestAnimationFrame(animate);
        };

        this.#frameId = requestAnimationFrame(animate);
    }

    stop() {
        if (this.#frameId) {
            cancelAnimationFrame(this.#frameId);
            this.#frameId = null;
        }
    }
}

const animator = new Animator();
let position = 0;

animator.start((deltaTime) => {
    position += deltaTime * 0.1; // Move based on time
    element.style.transform = `translateX(${position}px)`;

    if (position > 500) {
        animator.stop();
    }
});
```

### Batch DOM Updates

```js
class DOMBatcher {
    #reads = [];
    #writes = [];
    #scheduled = false;

    read(fn) {
        this.#reads.push(fn);
        this.#schedule();
    }

    write(fn) {
        this.#writes.push(fn);
        this.#schedule();
    }

    #schedule() {
        if (!this.#scheduled) {
            this.#scheduled = true;
            requestAnimationFrame(() => this.#flush());
        }
    }

    #flush() {
        // Execute all reads first
        const reads = this.#reads.splice(0);
        reads.forEach(fn => fn());

        // Then all writes
        const writes = this.#writes.splice(0);
        writes.forEach(fn => fn());

        this.#scheduled = false;
    }
}

const batcher = new DOMBatcher();

// Avoid layout thrashing
elements.forEach(el => {
    batcher.read(() => {
        const height = el.offsetHeight;
        batcher.write(() => {
            el.style.height = `${height * 2}px`;
        });
    });
});
```

## Exercises

### Exercise 1: Implement pipe with async support

::: details Solution
```js
function pipeAsync(...fns) {
    return async function(x) {
        let result = x;
        for (const fn of fns) {
            result = await fn(result);
        }
        return result;
    };
}

// Usage
const fetchUser = async (id) => {
    const res = await fetch(`/api/users/${id}`);
    return res.json();
};

const extractEmail = (user) => user.email;
const sendWelcome = async (email) => {
    console.log(`Sending welcome to ${email}`);
    return { sent: true, email };
};

const welcomeUser = pipeAsync(fetchUser, extractEmail, sendWelcome);
await welcomeUser(1);
```
:::

### Exercise 2: Create a simple reactive system

::: details Solution
```js
function reactive(obj) {
    const deps = new Map();
    let activeEffect = null;

    function track(key) {
        if (activeEffect) {
            if (!deps.has(key)) {
                deps.set(key, new Set());
            }
            deps.get(key).add(activeEffect);
        }
    }

    function trigger(key) {
        const effects = deps.get(key);
        if (effects) {
            effects.forEach(effect => effect());
        }
    }

    const proxy = new Proxy(obj, {
        get(target, key) {
            track(key);
            return target[key];
        },
        set(target, key, value) {
            target[key] = value;
            trigger(key);
            return true;
        }
    });

    function effect(fn) {
        activeEffect = fn;
        fn();
        activeEffect = null;
    }

    return { proxy, effect };
}

// Usage
const { proxy: state, effect } = reactive({ count: 0 });

effect(() => {
    console.log("Count is:", state.count);
});

state.count = 1; // Logs: Count is: 1
state.count = 2; // Logs: Count is: 2
```
:::

## Quick Reference

::: tip Advanced Patterns Cheat Sheet
```js
// Memoization
const memoize = (fn) => {
    const cache = new Map();
    return (...args) => {
        const key = JSON.stringify(args);
        if (cache.has(key)) return cache.get(key);
        const result = fn(...args);
        cache.set(key, result);
        return result;
    };
};

// Debounce
const debounce = (fn, delay) => {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn(...args), delay);
    };
};

// Throttle
const throttle = (fn, limit) => {
    let inThrottle;
    return (...args) => {
        if (!inThrottle) {
            fn(...args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};

// Compose (right to left)
const compose = (...fns) => (x) =>
    fns.reduceRight((acc, fn) => fn(acc), x);

// Pipe (left to right)
const pipe = (...fns) => (x) =>
    fns.reduce((acc, fn) => fn(acc), x);
```
:::

## Summary

| Pattern | Purpose | Use Case |
|---------|---------|----------|
| Pure Functions | Predictable code | Calculations |
| Immutability | Prevent mutations | State updates |
| Memoization | Cache results | Expensive computations |
| Debounce | Wait for pause | Search input |
| Throttle | Limit frequency | Scroll events |
| Proxy | Intercept operations | Validation, reactivity |
| State Management | Centralize state | App-wide data |
| Lazy Evaluation | Defer computation | Large datasets |
| Web Workers | Parallel processing | CPU-intensive tasks |

## Conclusion

Congratulations on completing the JavaScript tutorial! You've learned everything from basic syntax to advanced patterns. Keep practicing and building projects to solidify your knowledge.

### Recommended Next Steps

1. Build real projects
2. Contribute to open source
3. Learn a framework (React, Vue, or Angular)
4. Explore Node.js for backend development
5. Study TypeScript for type safety

Happy coding!
