# Functions

Functions are reusable blocks of code that perform specific tasks. They are fundamental to JavaScript programming.

::: info What You'll Learn
- How to create and call functions
- Different ways to define functions
- Parameters, arguments, and return values
- Scope and closures
- Higher-order functions
:::

## What is a Function?

A function is like a **recipe** - a set of instructions you can use over and over again.

```
┌─────────────────────────────────────────────────────────────┐
│                     FUNCTION ANATOMY                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   function greet(name) {         ← Function declaration     │
│            ─────  ────                                      │
│              │      │                                       │
│              │      └─ Parameter (input placeholder)        │
│              │                                              │
│              └─ Function name                               │
│                                                             │
│       return `Hello, ${name}!`;  ← Return statement        │
│   }                                (output)                 │
│                                                             │
│   greet("Alice");                ← Function call            │
│         ───────                                             │
│            │                                                │
│            └─ Argument (actual value passed)                │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Function Declaration

The traditional and most common way to define a function.

```js
// Define the function
function greet(name) {
    return `Hello, ${name}!`;
}

// Call (use) the function
console.log(greet("Alice")); // "Hello, Alice!"
console.log(greet("Bob"));   // "Hello, Bob!"
```

### Multiple Parameters

```js
function add(a, b) {
    return a + b;
}

console.log(add(5, 3));   // 8
console.log(add(10, 20)); // 30
```

### No Parameters

```js
function sayHello() {
    return "Hello, World!";
}

console.log(sayHello()); // "Hello, World!"
```

### No Return (Side Effects)

```js
function logMessage(message) {
    console.log(message);
    // No return statement
    // Implicitly returns undefined
}

const result = logMessage("Hello");
console.log(result); // undefined
```

### When to Use Return

```
┌─────────────────────────────────────────────────────────────┐
│            WITH RETURN          │      WITHOUT RETURN       │
├─────────────────────────────────────────────────────────────┤
│                                 │                           │
│  Calculate and give back       │  Do something (side       │
│  a value                        │  effect) - print, save,   │
│                                 │  modify, etc.             │
│                                 │                           │
│  function add(a, b) {          │  function logTime() {     │
│      return a + b;             │      console.log(Date()); │
│  }                              │  }                        │
│                                 │                           │
│  const sum = add(2, 3);        │  logTime(); // just runs  │
│  // sum = 5                     │                           │
│                                 │                           │
└─────────────────────────────────────────────────────────────┘
```

## Function Expression

Assign a function to a variable. The function can be anonymous (no name).

```js
// Anonymous function expression
const multiply = function(a, b) {
    return a * b;
};

console.log(multiply(4, 5)); // 20

// Named function expression (useful for recursion/debugging)
const factorial = function fact(n) {
    if (n <= 1) return 1;
    return n * fact(n - 1);
};
```

### Declaration vs Expression

| Feature | Declaration | Expression |
|---------|-------------|------------|
| Syntax | `function name() {}` | `const name = function() {}` |
| Hoisting | ✅ Hoisted (can call before definition) | ❌ Not hoisted |
| Name | Required | Optional |

```js
// Declaration - can call before it's defined (hoisting)
sayHi(); // Works! "Hi!"
function sayHi() {
    console.log("Hi!");
}

// Expression - cannot call before it's defined
// sayBye(); // Error! Cannot access before initialization
const sayBye = function() {
    console.log("Bye!");
};
sayBye(); // Works after definition
```

## Arrow Functions (ES6)

A shorter, more concise syntax for writing functions.

```js
// Regular function
const add = function(a, b) {
    return a + b;
};

// Arrow function equivalent
const addArrow = (a, b) => {
    return a + b;
};

// Even shorter: implicit return (single expression)
const addShort = (a, b) => a + b;
```

### Arrow Function Syntax Rules

```js
// Multiple parameters - parentheses required
const add = (a, b) => a + b;

// Single parameter - parentheses optional
const double = n => n * 2;
const doubleAlt = (n) => n * 2;  // Also valid

// No parameters - empty parentheses required
const sayHello = () => "Hello!";

// Multiple lines - curly braces and return required
const greet = (name) => {
    const greeting = `Hello, ${name}!`;
    return greeting;
};

// Returning an object - wrap in parentheses
const createUser = (name, age) => ({ name, age });
// Without parentheses, {} would be seen as function body
```

### Arrow Function Cheat Sheet

```
┌─────────────────────────────────────────────────────────────┐
│                  ARROW FUNCTION SHORTCUTS                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Parameters:                                                │
│  ───────────                                                │
│  ()          →  No parameters                               │
│  x           →  One parameter (no parentheses needed)       │
│  (x, y)      →  Multiple parameters                         │
│                                                             │
│  Body:                                                      │
│  ─────                                                      │
│  => x        →  Single expression (implicit return)         │
│  => { }      →  Multiple statements (explicit return)       │
│  => ({ })    →  Return object literal                       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

::: tip When to Use Arrow Functions
- Short, simple functions
- Callbacks (array methods, event handlers)
- When you need to preserve `this` context

**When NOT to use:**
- Object methods (use regular functions for correct `this`)
- When you need the `arguments` object
- Constructors (can't use `new` with arrow functions)
:::

## Parameters and Arguments

### Parameters vs Arguments

```js
//                    parameters (placeholders)
//                         ↓     ↓
function greet(firstName, lastName) {
    return `Hello, ${firstName} ${lastName}!`;
}

//              arguments (actual values)
//                  ↓       ↓
greet("John", "Doe");
```

### Default Parameters

Provide fallback values when arguments aren't passed.

```js
function greet(name = "Guest") {
    return `Hello, ${name}!`;
}

console.log(greet());        // "Hello, Guest!"
console.log(greet("Alice")); // "Hello, Alice!"

// Multiple defaults
function createUser(name = "Anonymous", role = "user", active = true) {
    return { name, role, active };
}

console.log(createUser());                    // { name: "Anonymous", role: "user", active: true }
console.log(createUser("John"));              // { name: "John", role: "user", active: true }
console.log(createUser("John", "admin"));     // { name: "John", role: "admin", active: true }
```

### Rest Parameters

Collect any number of arguments into an array.

```js
function sum(...numbers) {
    return numbers.reduce((total, n) => total + n, 0);
}

console.log(sum(1, 2));           // 3
console.log(sum(1, 2, 3, 4, 5));  // 15

// Combining with regular parameters
function introduce(greeting, ...names) {
    return `${greeting}, ${names.join(" and ")}!`;
}

console.log(introduce("Hello", "Alice", "Bob", "Charlie"));
// "Hello, Alice and Bob and Charlie!"
```

### Destructuring Parameters

Extract values from objects/arrays in parameters.

```js
// Object destructuring
function printUser({ name, age, city = "Unknown" }) {
    console.log(`${name}, ${age}, from ${city}`);
}

printUser({ name: "Alice", age: 25, city: "NYC" });
// "Alice, 25, from NYC"

printUser({ name: "Bob", age: 30 });
// "Bob, 30, from Unknown"

// Array destructuring
function getFirstTwo([first, second]) {
    return `First: ${first}, Second: ${second}`;
}

getFirstTwo([1, 2, 3, 4]); // "First: 1, Second: 2"
```

## Scope

Scope determines where variables are accessible.

### Visual Guide to Scope

```
┌──────────────────────────────────────────────────────────────┐
│  GLOBAL SCOPE                                                │
│  ─────────────                                               │
│  const globalVar = "I'm everywhere!";                        │
│                                                              │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │  FUNCTION SCOPE (myFunction)                            │ │
│  │  ──────────────                                         │ │
│  │  const functionVar = "I'm in this function";            │ │
│  │  // Can access: globalVar, functionVar                  │ │
│  │                                                         │ │
│  │  ┌───────────────────────────────────────────────────┐  │ │
│  │  │  BLOCK SCOPE (if, for, etc.)                      │  │ │
│  │  │  ───────────                                      │  │ │
│  │  │  const blockVar = "I'm only in this block";       │  │ │
│  │  │  // Can access: globalVar, functionVar, blockVar  │  │ │
│  │  └───────────────────────────────────────────────────┘  │ │
│  │  // Cannot access blockVar here!                        │ │
│  └─────────────────────────────────────────────────────────┘ │
│  // Cannot access functionVar or blockVar here!              │
└──────────────────────────────────────────────────────────────┘
```

### Global Scope

Variables declared outside any function.

```js
const globalVar = "I'm global";

function showGlobal() {
    console.log(globalVar); // ✅ Accessible
}

showGlobal(); // "I'm global"
console.log(globalVar); // ✅ Accessible everywhere
```

### Function Scope

Variables declared inside a function are only accessible within that function.

```js
function myFunction() {
    const localVar = "I'm local";
    console.log(localVar); // ✅ Accessible
}

myFunction();
// console.log(localVar); // ❌ Error: localVar is not defined
```

### Block Scope (let and const)

Variables declared with `let` and `const` are limited to their block `{}`.

```js
if (true) {
    let blockLet = "Block scoped with let";
    const blockConst = "Block scoped with const";
    var notBlockScoped = "Function scoped with var";

    console.log(blockLet);   // ✅ Accessible
    console.log(blockConst); // ✅ Accessible
}

// console.log(blockLet);   // ❌ Error
// console.log(blockConst); // ❌ Error
console.log(notBlockScoped); // ✅ "Function scoped with var" - var ignores blocks!
```

::: warning Avoid var
Use `let` and `const` instead of `var`. The `var` keyword doesn't respect block scope, which can cause bugs.
:::

## Closures

A closure is a function that "remembers" variables from its outer scope, even after the outer function has finished running.

### Simple Closure Example

```js
function createCounter() {
    let count = 0;  // This variable is "enclosed"

    return function() {
        count++;
        return count;
    };
}

const counter = createCounter();
console.log(counter()); // 1
console.log(counter()); // 2
console.log(counter()); // 3

// Each call to createCounter() creates a new, separate closure
const counter2 = createCounter();
console.log(counter2()); // 1 (separate count)
```

### How Closures Work

```
┌─────────────────────────────────────────────────────────────┐
│  createCounter() runs:                                      │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  let count = 0                                       │   │
│  │                                                      │   │
│  │  Returns inner function ─────┐                       │   │
│  └──────────────────────────────┼───────────────────────┘   │
│                                 │                           │
│  createCounter() finishes...    │                           │
│  BUT count is NOT garbage       │                           │
│  collected because...           │                           │
│                                 ▼                           │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  The returned function       │                       │   │
│  │  still has a reference ──────┘                       │   │
│  │  to count (closure!)                                 │   │
│  │                                                      │   │
│  │  counter() → count++ → return count                  │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Practical Closure Examples

```js
// Create private variables
function createBankAccount(initialBalance) {
    let balance = initialBalance;  // Private!

    return {
        deposit: (amount) => {
            balance += amount;
            return balance;
        },
        withdraw: (amount) => {
            if (amount > balance) {
                return "Insufficient funds";
            }
            balance -= amount;
            return balance;
        },
        getBalance: () => balance
    };
}

const account = createBankAccount(100);
console.log(account.getBalance()); // 100
console.log(account.deposit(50));  // 150
console.log(account.withdraw(30)); // 120
// console.log(account.balance);   // undefined - can't access directly!

// Create function factories
function createMultiplier(multiplier) {
    return function(number) {
        return number * multiplier;
    };
}

const double = createMultiplier(2);
const triple = createMultiplier(3);
const tenTimes = createMultiplier(10);

console.log(double(5));    // 10
console.log(triple(5));    // 15
console.log(tenTimes(5));  // 50
```

## Higher-Order Functions

Functions that take other functions as arguments or return functions.

### Functions as Arguments (Callbacks)

```js
// Custom higher-order function
function processArray(arr, callback) {
    const result = [];
    for (const item of arr) {
        result.push(callback(item));
    }
    return result;
}

const numbers = [1, 2, 3, 4, 5];

// Pass different functions for different behaviors
const doubled = processArray(numbers, n => n * 2);
console.log(doubled); // [2, 4, 6, 8, 10]

const squared = processArray(numbers, n => n * n);
console.log(squared); // [1, 4, 9, 16, 25]

const asStrings = processArray(numbers, n => `Number: ${n}`);
console.log(asStrings); // ["Number: 1", "Number: 2", ...]
```

### Functions as Return Values

```js
function createGreeter(greeting) {
    return function(name) {
        return `${greeting}, ${name}!`;
    };
}

const sayHello = createGreeter("Hello");
const sayGoodbye = createGreeter("Goodbye");
const sayHi = createGreeter("Hi there");

console.log(sayHello("Alice"));   // "Hello, Alice!"
console.log(sayGoodbye("Bob"));   // "Goodbye, Bob!"
console.log(sayHi("Charlie"));    // "Hi there, Charlie!"
```

### Common Higher-Order Functions

```js
const numbers = [1, 2, 3, 4, 5];

// map - transform each element
const doubled = numbers.map(n => n * 2);
// [2, 4, 6, 8, 10]

// filter - keep elements that pass test
const evens = numbers.filter(n => n % 2 === 0);
// [2, 4]

// reduce - combine into single value
const sum = numbers.reduce((total, n) => total + n, 0);
// 15

// find - get first matching element
const firstEven = numbers.find(n => n % 2 === 0);
// 2

// every - check if ALL pass test
const allPositive = numbers.every(n => n > 0);
// true

// some - check if ANY pass test
const hasNegative = numbers.some(n => n < 0);
// false
```

## The `this` Keyword

The value of `this` depends on how a function is called.

### this in Different Contexts

```js
// In an object method - this = the object
const person = {
    name: "Alice",
    greet: function() {
        console.log(`Hello, I'm ${this.name}`);
    }
};
person.greet(); // "Hello, I'm Alice"

// Regular function (non-strict) - this = window/global
function showThis() {
    console.log(this);
}
showThis(); // Window object (browser) or global (Node)

// Arrow function - this = surrounding scope's this
const obj = {
    name: "Bob",
    greetRegular: function() {
        console.log(`Regular: ${this.name}`);
    },
    greetArrow: () => {
        console.log(`Arrow: ${this.name}`); // this is NOT obj!
    }
};
obj.greetRegular(); // "Regular: Bob"
obj.greetArrow();   // "Arrow: undefined"
```

### Binding this Explicitly

```js
function greet() {
    console.log(`Hello, ${this.name}`);
}

const person1 = { name: "Alice" };
const person2 = { name: "Bob" };

// call - invoke immediately with specified 'this'
greet.call(person1);  // "Hello, Alice"
greet.call(person2);  // "Hello, Bob"

// apply - like call, but pass arguments as array
function introduce(greeting, punctuation) {
    console.log(`${greeting}, I'm ${this.name}${punctuation}`);
}
introduce.apply(person1, ["Hi", "!"]); // "Hi, I'm Alice!"

// bind - create new function with bound 'this'
const greetAlice = greet.bind(person1);
greetAlice(); // "Hello, Alice"
```

### Common this Problem and Solution

```js
const user = {
    name: "Alice",
    friends: ["Bob", "Charlie"],

    // ❌ Problem: this is lost in callback
    listFriendsBroken: function() {
        this.friends.forEach(function(friend) {
            console.log(`${this.name} is friends with ${friend}`);
            // this.name is undefined!
        });
    },

    // ✅ Solution 1: Arrow function (inherits this)
    listFriendsArrow: function() {
        this.friends.forEach((friend) => {
            console.log(`${this.name} is friends with ${friend}`);
        });
    },

    // ✅ Solution 2: Save this in a variable
    listFriendsSaved: function() {
        const self = this;
        this.friends.forEach(function(friend) {
            console.log(`${self.name} is friends with ${friend}`);
        });
    },

    // ✅ Solution 3: Use bind
    listFriendsBind: function() {
        this.friends.forEach(function(friend) {
            console.log(`${this.name} is friends with ${friend}`);
        }.bind(this));
    }
};
```

## IIFE (Immediately Invoked Function Expression)

A function that runs immediately after being defined.

```js
// Basic IIFE
(function() {
    const private = "I'm private to this IIFE";
    console.log(private);
})();

// Arrow function IIFE
(() => {
    console.log("Arrow IIFE!");
})();

// IIFE with parameters
((name) => {
    console.log(`Hello, ${name}!`);
})("World");

// IIFE returning a value
const result = (() => {
    const a = 10;
    const b = 20;
    return a + b;
})();
console.log(result); // 30
```

### Why Use IIFE?

```js
// Create private scope to avoid polluting global namespace
const counter = (function() {
    let count = 0;  // Private variable

    return {
        increment: () => ++count,
        decrement: () => --count,
        getCount: () => count
    };
})();

counter.increment();
counter.increment();
console.log(counter.getCount()); // 2
// count is not accessible from outside!
```

## Recursion

A function that calls itself. Must have a **base case** to stop!

```js
// Countdown
function countdown(n) {
    if (n <= 0) {           // Base case - when to stop
        console.log("Done!");
        return;
    }
    console.log(n);
    countdown(n - 1);       // Recursive call
}

countdown(5);
// 5, 4, 3, 2, 1, Done!

// Factorial: n! = n × (n-1) × (n-2) × ... × 1
function factorial(n) {
    if (n <= 1) return 1;   // Base case
    return n * factorial(n - 1);
}

console.log(factorial(5)); // 120 (5 × 4 × 3 × 2 × 1)
```

### Recursion Visualization

```
factorial(5)
├── 5 * factorial(4)
│   ├── 4 * factorial(3)
│   │   ├── 3 * factorial(2)
│   │   │   ├── 2 * factorial(1)
│   │   │   │   └── 1  (base case!)
│   │   │   └── 2 * 1 = 2
│   │   └── 3 * 2 = 6
│   └── 4 * 6 = 24
└── 5 * 24 = 120
```

::: warning Always Include a Base Case!
Without a base case, recursion will continue forever (stack overflow).

```js
// ❌ Bad - infinite recursion
function badRecursion(n) {
    return badRecursion(n + 1); // Never stops!
}
```
:::

## Exercises

### Exercise 1: Simple Calculator

Create a calculator with functions for add, subtract, multiply, divide.

::: details Solution
```js
const calculator = {
    add: (a, b) => a + b,
    subtract: (a, b) => a - b,
    multiply: (a, b) => a * b,
    divide: (a, b) => {
        if (b === 0) return "Cannot divide by zero";
        return a / b;
    }
};

console.log(calculator.add(10, 5));      // 15
console.log(calculator.subtract(10, 5)); // 5
console.log(calculator.multiply(10, 5)); // 50
console.log(calculator.divide(10, 5));   // 2
console.log(calculator.divide(10, 0));   // "Cannot divide by zero"
```
:::

### Exercise 2: Function Composition

Create a function that composes two functions together.

::: details Solution
```js
function compose(f, g) {
    return function(x) {
        return f(g(x));  // Apply g first, then f
    };
}

const addOne = x => x + 1;
const double = x => x * 2;

const addOneThenDouble = compose(double, addOne);
const doubleThenAddOne = compose(addOne, double);

console.log(addOneThenDouble(5)); // 12 ((5 + 1) * 2)
console.log(doubleThenAddOne(5)); // 11 ((5 * 2) + 1)
```
:::

### Exercise 3: Memoization

Create a memoized function that caches results.

::: details Solution
```js
function memoize(fn) {
    const cache = {};

    return function(...args) {
        const key = JSON.stringify(args);

        if (key in cache) {
            console.log("From cache:", key);
            return cache[key];
        }

        console.log("Computing:", key);
        const result = fn.apply(this, args);
        cache[key] = result;
        return result;
    };
}

// Example: expensive fibonacci calculation
const fibonacci = memoize(function(n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
});

console.log(fibonacci(10)); // Computing (first time)
console.log(fibonacci(10)); // From cache (instant!)
```
:::

### Exercise 4: Debounce Function

Create a debounce function that limits how often a function can run.

::: details Solution
```js
function debounce(fn, delay) {
    let timeoutId;

    return function(...args) {
        // Clear previous timeout
        clearTimeout(timeoutId);

        // Set new timeout
        timeoutId = setTimeout(() => {
            fn.apply(this, args);
        }, delay);
    };
}

// Usage: only runs after user stops typing for 300ms
const handleSearch = debounce((query) => {
    console.log("Searching for:", query);
}, 300);

// Simulating rapid typing
handleSearch("h");
handleSearch("he");
handleSearch("hel");
handleSearch("hell");
handleSearch("hello");
// Only "Searching for: hello" will print (after 300ms)
```
:::

## Summary

| Concept | Description | Example |
|---------|-------------|---------|
| **Declaration** | Traditional function syntax, hoisted | `function name() {}` |
| **Expression** | Assigned to variable, not hoisted | `const fn = function() {}` |
| **Arrow Function** | Concise syntax, lexical `this` | `const fn = () => {}` |
| **Default Parameters** | Fallback values | `function(x = 10)` |
| **Rest Parameters** | Collect arguments | `function(...args)` |
| **Scope** | Variable accessibility | Global, function, block |
| **Closure** | Function remembering outer scope | Counter example |
| **Higher-Order** | Functions with function args/returns | map, filter, reduce |
| **this** | Context-dependent keyword | Varies by call method |
| **IIFE** | Immediately invoked | `(() => {})()` |
| **Recursion** | Function calling itself | factorial(n) |

## Next Steps

Continue to [Arrays](/guide/javascript/04-arrays) to learn about working with collections of data.
