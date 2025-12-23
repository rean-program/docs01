# Functions in TypeScript

Functions are the building blocks of any application. In this lesson, you'll learn how to add type safety to functions - making your code more reliable and self-documenting.

## Why Type Functions?

```typescript
// JavaScript - What does this function expect? What does it return? 🤷
function processUser(user, options) {
    // ...
}

// TypeScript - Crystal clear!
function processUser(user: User, options: ProcessOptions): Result {
    // ...
}
```

With typed functions:
- You know what to pass in
- You know what you'll get back
- Your editor can help you with autocomplete
- Errors are caught before you run the code

## Basic Function Syntax

### Parameter Types and Return Types

```typescript
//              parameter types      return type
//                    ↓                   ↓
function add(a: number, b: number): number {
    return a + b;
}

// Calling the function
add(5, 10);     // ✅ Returns 15
add("5", 10);   // ❌ Error: "5" is not a number
```

### Breaking It Down

```typescript
function functionName(param1: Type1, param2: Type2): ReturnType {
    // function body
    return someValue;  // must match ReturnType
}
```

### Arrow Functions

Arrow functions follow the same pattern:

```typescript
// Full syntax
const multiply = (a: number, b: number): number => {
    return a * b;
};

// Shorthand (implicit return)
const multiply = (a: number, b: number): number => a * b;

// TypeScript can infer the return type
const multiply = (a: number, b: number) => a * b;  // return type inferred as number
```

## Function Type Expressions

You can define the type of a function separately:

```typescript
// Define a function type
type MathOperation = (a: number, b: number) => number;

// Use that type
const add: MathOperation = (a, b) => a + b;
const subtract: MathOperation = (a, b) => a - b;
const multiply: MathOperation = (a, b) => a * b;

// All these functions have the same type signature!
```

### Type Alias vs Inline

```typescript
// Inline (good for one-off uses)
const greet: (name: string) => string = (name) => `Hello, ${name}!`;

// Type alias (better for reuse)
type Greeter = (name: string) => string;
const greet: Greeter = (name) => `Hello, ${name}!`;
const farewell: Greeter = (name) => `Goodbye, ${name}!`;
```

## Optional Parameters

Not all parameters are always needed. Use `?` to make them optional.

```typescript
// greeting is optional
function greet(name: string, greeting?: string): string {
    if (greeting) {
        return `${greeting}, ${name}!`;
    }
    return `Hello, ${name}!`;
}

greet("John");          // "Hello, John!"
greet("John", "Hi");    // "Hi, John!"
```

### Rules for Optional Parameters

```typescript
// ✅ Correct: Optional parameters come AFTER required ones
function example(required: string, optional?: number): void {}

// ❌ Wrong: Optional before required
function example(optional?: string, required: number): void {}
// Error: Required parameter cannot follow optional parameter
```

### Optional vs Undefined

```typescript
// These are different!
function fn1(x?: number) { }   // x can be omitted
function fn2(x: number | undefined) { }  // x must be passed (even if undefined)

fn1();           // ✅ OK
fn1(undefined);  // ✅ OK
fn1(5);          // ✅ OK

fn2();           // ❌ Error: Expected 1 argument
fn2(undefined);  // ✅ OK
fn2(5);          // ✅ OK
```

## Default Parameters

Default values provide a fallback when a parameter isn't provided.

```typescript
function greet(name: string, greeting: string = "Hello"): string {
    return `${greeting}, ${name}!`;
}

greet("John");          // "Hello, John!" (uses default)
greet("John", "Hi");    // "Hi, John!" (uses provided value)
```

### Default Parameters with Type Inference

```typescript
// TypeScript infers the type from the default value
function createUser(name: string, age: number = 18, active = true) {
    return { name, age, active };
}
// age is inferred as number (from 18)
// active is inferred as boolean (from true)
```

### Default vs Optional: When to Use Which

| Use Case | Approach |
|----------|----------|
| Value should be missing sometimes | Optional (`?`) |
| Value has a sensible default | Default (`= value`) |
| Caller might explicitly pass `undefined` | Default value |

## Rest Parameters

Rest parameters let you accept any number of arguments.

```typescript
function sum(...numbers: number[]): number {
    return numbers.reduce((total, n) => total + n, 0);
}

sum(1, 2);           // 3
sum(1, 2, 3, 4, 5);  // 15
sum();               // 0 (empty array)
```

### Rest with Other Parameters

```typescript
// Rest parameter must be last
function logMessages(level: string, ...messages: string[]): void {
    messages.forEach(msg => {
        console.log(`[${level}] ${msg}`);
    });
}

logMessages("INFO", "Server started", "Listening on port 3000");
// [INFO] Server started
// [INFO] Listening on port 3000
```

### Typed Rest Parameters

```typescript
// Rest parameters can be tuples too!
function createPoint(...coords: [number, number, number?]): void {
    const [x, y, z] = coords;
    console.log(`Point: (${x}, ${y}, ${z ?? 0})`);
}

createPoint(1, 2);     // Point: (1, 2, 0)
createPoint(1, 2, 3);  // Point: (1, 2, 3)
```

## Function Overloads

Sometimes a function behaves differently based on its inputs. Overloads let you describe these variations.

### The Problem

```typescript
// This function can return string OR number depending on input
function format(value: string | number): string | number {
    if (typeof value === "string") {
        return value.trim();
    }
    return value.toFixed(2);
}

// But TypeScript doesn't know which!
const result = format("hello");  // Type is string | number 😕
```

### The Solution: Overloads

```typescript
// Overload signatures (what callers see)
function format(value: string): string;
function format(value: number): string;

// Implementation signature (must handle all overloads)
function format(value: string | number): string {
    if (typeof value === "string") {
        return value.trim();
    }
    return value.toFixed(2);
}

// Now TypeScript knows exactly what you get!
const str = format("  hello  ");  // Type is string ✅
const num = format(42.1234);       // Type is string ✅
```

### More Complex Overloads

```typescript
// Different return types based on input
function getValue(key: "name"): string;
function getValue(key: "age"): number;
function getValue(key: "active"): boolean;
function getValue(key: string): string | number | boolean {
    const data: Record<string, any> = {
        name: "John",
        age: 30,
        active: true
    };
    return data[key];
}

const name = getValue("name");     // type: string
const age = getValue("age");       // type: number
const active = getValue("active"); // type: boolean
```

### When to Use Overloads

| Situation | Use Overloads? |
|-----------|---------------|
| Different input types → different output types | ✅ Yes |
| Same logic regardless of types | ❌ No (use union types) |
| Complex relationships between inputs and outputs | ✅ Yes |

## The `this` Parameter

In TypeScript, you can explicitly type `this` in methods.

```typescript
interface User {
    name: string;
    greet(this: User): void;  // Explicitly type 'this'
}

const user: User = {
    name: "John",
    greet() {
        console.log(`Hello, I'm ${this.name}`);  // 'this' is typed!
    }
};

user.greet();  // ✅ OK: "Hello, I'm John"

// Prevents common mistakes:
const greetFn = user.greet;
greetFn();  // ❌ Error: 'this' context is not of type 'User'
```

### Why This Matters

```typescript
// Without 'this' typing, this common bug goes unnoticed:
class Button {
    label: string = "Click me";

    handleClick() {
        console.log(this.label);  // 'this' might be wrong!
    }
}

const button = new Button();
const handler = button.handleClick;
handler();  // undefined! (or error in strict mode)

// TypeScript with 'this' parameter catches this:
class SafeButton {
    label: string = "Click me";

    handleClick(this: SafeButton) {
        console.log(this.label);
    }
}

const safeButton = new SafeButton();
const safeHandler = safeButton.handleClick;
safeHandler();  // ❌ Error caught at compile time!
```

## Callback Functions

Functions passed to other functions need typing too.

```typescript
// Define callback type
type Callback = (error: Error | null, data?: string) => void;

// Function that accepts a callback
function fetchData(url: string, callback: Callback): void {
    // Simulated async operation
    setTimeout(() => {
        if (url.startsWith("http")) {
            callback(null, "Data loaded successfully");
        } else {
            callback(new Error("Invalid URL"));
        }
    }, 1000);
}

// Using the function
fetchData("https://api.example.com", (error, data) => {
    // TypeScript knows the types!
    if (error) {
        console.error(error.message);
    } else {
        console.log(data);
    }
});
```

### Event Handler Callbacks

```typescript
// Typing event handlers
type ClickHandler = (event: MouseEvent) => void;
type InputHandler = (event: KeyboardEvent) => void;

interface ButtonProps {
    onClick: ClickHandler;
    onKeyDown?: InputHandler;
}

function setupButton(props: ButtonProps): void {
    const button = document.createElement("button");
    button.addEventListener("click", props.onClick);
    if (props.onKeyDown) {
        button.addEventListener("keydown", props.onKeyDown);
    }
}
```

## Void vs Undefined

These are subtly different:

```typescript
// void: Function doesn't return anything meaningful
function logMessage(msg: string): void {
    console.log(msg);
    // No return statement (or return undefined)
}

// A void function CAN return undefined
function voidFn(): void {
    return undefined;  // ✅ OK
}

// But callbacks with void return can "ignore" return values
type VoidCallback = () => void;

// This is valid! Array.push returns a number, but we ignore it
const fn: VoidCallback = () => [1, 2, 3].push(4);
```

### The `undefined` Return Type

```typescript
// undefined: Function explicitly returns undefined
function getUndefined(): undefined {
    return undefined;  // Must explicitly return undefined
}

// This won't work:
function broken(): undefined {
    console.log("hi");
    // ❌ Error: Must return undefined
}
```

## Never Return Type

`never` is for functions that never return normally.

```typescript
// Function that always throws
function throwError(message: string): never {
    throw new Error(message);
}

// Function with infinite loop
function forever(): never {
    while (true) {
        // Runs forever
    }
}

// Useful for exhaustive checking
type Shape = "circle" | "square" | "triangle";

function getArea(shape: Shape): number {
    switch (shape) {
        case "circle":
            return Math.PI * 10 * 10;
        case "square":
            return 10 * 10;
        case "triangle":
            return 0.5 * 10 * 10;
        default:
            // If we forget a case, TypeScript will error here
            const _exhaustive: never = shape;
            throw new Error(`Unknown shape: ${_exhaustive}`);
    }
}
```

## Generic Functions

Generics let you create reusable functions that work with any type.

### The Problem

```typescript
// Without generics, you'd need multiple functions:
function identityString(value: string): string {
    return value;
}
function identityNumber(value: number): number {
    return value;
}

// Or use 'any' (loses type safety):
function identityAny(value: any): any {
    return value;
}
```

### The Solution: Generics

```typescript
// T is a "type parameter" - a placeholder for any type
function identity<T>(value: T): T {
    return value;
}

// TypeScript infers T from the argument
const str = identity("hello");  // T is string, returns string
const num = identity(42);        // T is number, returns number

// Or specify explicitly
const explicit = identity<string>("hello");
```

### Multiple Type Parameters

```typescript
function pair<T, U>(first: T, second: U): [T, U] {
    return [first, second];
}

const result = pair("hello", 42);  // Type: [string, number]
```

### Generic Constraints

Limit what types can be used:

```typescript
// T must have a 'length' property
function logLength<T extends { length: number }>(value: T): void {
    console.log(`Length: ${value.length}`);
}

logLength("hello");     // ✅ string has length
logLength([1, 2, 3]);   // ✅ array has length
logLength(123);         // ❌ number doesn't have length
```

### Common Generic Patterns

```typescript
// Find in array
function findById<T extends { id: number }>(items: T[], id: number): T | undefined {
    return items.find(item => item.id === id);
}

// Map values
function mapArray<T, U>(arr: T[], fn: (item: T) => U): U[] {
    return arr.map(fn);
}

// Get property
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
    return obj[key];
}
```

## Async Functions

Async functions always return Promises.

```typescript
// Async function returns Promise<T>
async function fetchUser(id: number): Promise<User> {
    const response = await fetch(`/api/users/${id}`);
    return response.json();
}

// Arrow function async
const loadData = async (): Promise<string[]> => {
    const response = await fetch("/api/data");
    return response.json();
};

// With error handling
async function safeFetch<T>(url: string): Promise<T | null> {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        return response.json();
    } catch (error) {
        console.error("Fetch failed:", error);
        return null;
    }
}
```

### Promise Types

```typescript
// Function returning Promise
function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Promise with value
function fetchNumber(): Promise<number> {
    return Promise.resolve(42);
}

// Promise that might reject
async function riskyOperation(): Promise<string> {
    if (Math.random() > 0.5) {
        throw new Error("Operation failed");
    }
    return "Success!";
}
```

## Construct Signatures

For functions used with `new`:

```typescript
// Constructor signature
interface UserConstructor {
    new (name: string, age: number): User;
}

class User {
    constructor(public name: string, public age: number) {}
}

// Factory function that takes a constructor
function createInstance<T>(
    Constructor: new (...args: any[]) => T,
    ...args: any[]
): T {
    return new Constructor(...args);
}

const user = createInstance(User, "John", 30);
```

## Summary

| Concept | Syntax | Use Case |
|---------|--------|----------|
| Basic types | `(a: number): string` | Define input/output types |
| Optional | `(a?: number)` | Parameter not always needed |
| Default | `(a: number = 10)` | Provide fallback value |
| Rest | `(...args: number[])` | Variable number of args |
| Overloads | Multiple signatures | Different behaviors |
| Generics | `<T>(a: T): T` | Reusable typed functions |
| Async | `async (): Promise<T>` | Async operations |

## Practice Exercise

Create a typed utility library:

```typescript
// 1. Array utilities
function first<T>(arr: T[]): T | undefined {
    return arr[0];
}

function last<T>(arr: T[]): T | undefined {
    return arr[arr.length - 1];
}

function chunk<T>(arr: T[], size: number): T[][] {
    const result: T[][] = [];
    for (let i = 0; i < arr.length; i += size) {
        result.push(arr.slice(i, i + size));
    }
    return result;
}

// 2. Test your functions
const numbers = [1, 2, 3, 4, 5];
console.log(first(numbers));        // 1
console.log(last(numbers));         // 5
console.log(chunk(numbers, 2));     // [[1, 2], [3, 4], [5]]

// 3. Create an async retry function
async function retry<T>(
    fn: () => Promise<T>,
    attempts: number = 3
): Promise<T> {
    for (let i = 0; i < attempts; i++) {
        try {
            return await fn();
        } catch (error) {
            if (i === attempts - 1) throw error;
            console.log(`Attempt ${i + 1} failed, retrying...`);
        }
    }
    throw new Error("Should not reach here");
}
```

## What's Next?

Excellent work! You've learned:
- ✅ Parameter and return types
- ✅ Optional and default parameters
- ✅ Rest parameters
- ✅ Function overloads
- ✅ Generic functions
- ✅ Async functions

Next, we'll explore **Objects and Interfaces** - how to define complex data shapes in TypeScript.

---

[Next: Objects & Interfaces →](/guide/typescript/03-interfaces)
