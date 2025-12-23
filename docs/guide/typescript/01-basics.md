# TypeScript Basics

Welcome to your first TypeScript lesson! In this lesson, you'll learn the fundamental building blocks of TypeScript - **types**. By the end, you'll understand how to add type safety to your JavaScript code.

## What Are Types?

In programming, a **type** describes what kind of value a variable can hold.

Think of types like labels on containers:
- A jar labeled "Cookies" should only contain cookies
- A box labeled "Toys" should only contain toys
- A variable with type `string` should only contain text

```typescript
// In JavaScript, variables can hold anything (chaos!)
let mystery = "Hello";  // It's a string now
mystery = 42;           // Now it's a number!
mystery = true;         // Now it's a boolean!

// In TypeScript, variables are labeled (order!)
let greeting: string = "Hello";
greeting = 42;    // ❌ Error! Can't put a number in a string container
greeting = "Hi";  // ✅ This works - it's still a string
```

## Type Annotations

A **type annotation** tells TypeScript what type a variable should be. You write it after the variable name with a colon (`:`).

```typescript
//        name     type annotation
//         ↓            ↓
let firstName: string = "John";
//                        ↑
//                    the value
```

### The Syntax Pattern

```typescript
let variableName: type = value;
```

**Examples:**
```typescript
let name: string = "Alice";      // Text
let age: number = 25;            // Number
let isStudent: boolean = true;   // True or false
```

## Primitive Types

These are the basic building blocks - the simplest types in TypeScript.

### String (Text)

Use `string` for any text value.

```typescript
// All of these are strings
let firstName: string = "John";         // Double quotes
let lastName: string = 'Doe';           // Single quotes
let greeting: string = `Hello!`;        // Template literal (backticks)

// Template literals can include variables
let fullName: string = `${firstName} ${lastName}`;  // "John Doe"

// Common string operations
let message: string = "Hello, World!";
console.log(message.length);        // 13
console.log(message.toUpperCase()); // "HELLO, WORLD!"
console.log(message.toLowerCase()); // "hello, world!"
```

### Number

Use `number` for any numeric value - integers, decimals, negative numbers, etc.

```typescript
// All numbers use the same type
let integer: number = 42;
let decimal: number = 3.14;
let negative: number = -10;

// Special number formats
let hex: number = 0xff;        // Hexadecimal (255)
let binary: number = 0b1010;   // Binary (10)
let octal: number = 0o744;     // Octal (484)

// Common operations
let price: number = 19.99;
console.log(price.toFixed(1));  // "20.0" (rounded to 1 decimal)
console.log(Math.round(price)); // 20
```

::: tip No Integer Type
Unlike some languages, TypeScript doesn't have separate `int` and `float` types. All numbers are `number`.
:::

### Boolean

Use `boolean` for true/false values.

```typescript
let isActive: boolean = true;
let isComplete: boolean = false;

// Booleans are often used in conditions
let age: number = 20;
let canVote: boolean = age >= 18;  // true

if (canVote) {
    console.log("You can vote!");
}
```

### Quick Reference Table

| Type | Description | Example Values |
|------|-------------|----------------|
| `string` | Text | `"hello"`, `'world'`, `` `template` `` |
| `number` | Numbers | `42`, `3.14`, `-10`, `0xff` |
| `boolean` | True/False | `true`, `false` |

## Type Inference

Here's something cool: **TypeScript is smart!** You don't always need to write type annotations - TypeScript can often figure out the type automatically.

```typescript
// TypeScript infers the type from the value
let message = "Hello, World!";  // TypeScript knows this is a string
let count = 42;                  // TypeScript knows this is a number
let active = true;               // TypeScript knows this is a boolean

// Hover over these variables in VS Code - you'll see the types!

// You can verify with errors:
message = 123;  // ❌ Error: Type 'number' is not assignable to type 'string'
```

### When to Use Explicit Types vs Inference

| Situation | Recommendation | Example |
|-----------|---------------|---------|
| Value is obvious | Let TypeScript infer | `let name = "John"` |
| No initial value | Add type annotation | `let name: string;` |
| Function parameters | Always add types | `function greet(name: string)` |
| Complex objects | Usually add types | `let user: User = {...}` |

```typescript
// ✅ Good: Type is obvious from the value
let score = 100;

// ✅ Good: No value, so we need to specify type
let username: string;
username = "john_doe";

// ❌ Avoid: Redundant - TypeScript already knows it's a string
let city: string = "New York";  // The : string is unnecessary
```

## Null and Undefined

These two types represent "nothing" or "missing values."

```typescript
// undefined = variable declared but not assigned
let notAssigned: undefined = undefined;

// null = intentionally empty/no value
let empty: null = null;
```

### The Real-World Use Case

Most often, you'll use these with **union types** (we'll cover this soon):

```typescript
// A user might or might not have a middle name
let middleName: string | null = null;
middleName = "Robert";  // Later assigned a value

// A value might be there or not
let searchResult: string | undefined = undefined;
searchResult = "Found it!";
```

## Arrays

Arrays hold multiple values of the same type.

### Declaring Arrays

```typescript
// Syntax 1: type followed by []
let names: string[] = ["Alice", "Bob", "Charlie"];
let scores: number[] = [85, 92, 78, 95];
let flags: boolean[] = [true, false, true];

// Syntax 2: Array<type> (generic syntax)
let items: Array<string> = ["apple", "banana", "cherry"];

// Both syntaxes do the same thing - use whichever you prefer
```

### Working with Arrays

```typescript
let fruits: string[] = ["apple", "banana"];

// Adding items
fruits.push("cherry");           // ["apple", "banana", "cherry"]

// Accessing items
console.log(fruits[0]);          // "apple"
console.log(fruits.length);      // 3

// TypeScript prevents type errors
fruits.push(123);                // ❌ Error: number is not string
```

### Array Methods with Types

TypeScript knows what types your array operations return:

```typescript
const numbers: number[] = [1, 2, 3, 4, 5];

// map: takes numbers, returns numbers
const doubled = numbers.map(n => n * 2);
// TypeScript knows: doubled is number[]

// filter: returns same type
const evens = numbers.filter(n => n % 2 === 0);
// TypeScript knows: evens is number[]

// find: might not find anything!
const found = numbers.find(n => n > 3);
// TypeScript knows: found is number | undefined (might be undefined!)

// This is why TypeScript is helpful:
console.log(found.toFixed(2));  // ❌ Error: 'found' might be undefined

// You need to check first:
if (found !== undefined) {
    console.log(found.toFixed(2));  // ✅ Now TypeScript knows it's safe
}
```

### Mixed Arrays (Union Types)

What if you need different types in one array?

```typescript
// Array that can hold strings OR numbers
let mixed: (string | number)[] = ["hello", 42, "world", 100];

// Array of different objects (not recommended - use tuples or proper types instead)
let anything: any[] = [1, "two", true, { name: "object" }];
```

## Tuples

Tuples are **fixed-length arrays** where each position has a specific type.

### Why Tuples?

Arrays: "Any number of items, all the same type"
Tuples: "Exactly N items, each with a specific type"

```typescript
// Tuple: exactly 2 items - a string then a number
let person: [string, number] = ["Alice", 30];

// This won't work:
person = ["Bob", 25, true];  // ❌ Error: too many elements
person = [30, "Alice"];       // ❌ Error: wrong order
person = ["Bob"];             // ❌ Error: missing second element
```

### Common Use Cases

```typescript
// Coordinates (x, y)
let point: [number, number] = [10, 20];

// Key-value pair
let entry: [string, number] = ["score", 100];

// Function returning multiple values
function getNameAndAge(): [string, number] {
    return ["John", 30];
}

// Destructuring tuples
const [name, age] = getNameAndAge();
console.log(name);  // "John"
console.log(age);   // 30
```

### Named Tuple Elements (TypeScript 4.0+)

You can label tuple positions for clarity:

```typescript
type Coordinate = [x: number, y: number, z?: number];

let point2D: Coordinate = [10, 20];
let point3D: Coordinate = [10, 20, 30];
```

## Enums

Enums let you define a set of named constants. They're great for values that can only be one of a few options.

### Numeric Enums

```typescript
// Define the enum
enum Direction {
    Up,      // 0
    Down,    // 1
    Left,    // 2
    Right    // 3
}

// Use the enum
let playerDirection: Direction = Direction.Up;

// Use in conditions
if (playerDirection === Direction.Up) {
    console.log("Moving up!");
}

// Check the value
console.log(Direction.Up);    // 0
console.log(Direction.Right); // 3
```

### String Enums (More Common)

String enums are more readable and easier to debug:

```typescript
enum Status {
    Pending = "PENDING",
    Active = "ACTIVE",
    Completed = "COMPLETED",
    Cancelled = "CANCELLED"
}

let orderStatus: Status = Status.Pending;
console.log(orderStatus);  // "PENDING" (readable!)

// Great for API responses
function updateOrder(status: Status) {
    // TypeScript ensures only valid statuses are passed
}

updateOrder(Status.Active);     // ✅ Works
updateOrder("ACTIVE");          // ❌ Error: must use the enum
```

### When to Use Enums

```typescript
// ✅ Good use case: Limited set of options
enum Color {
    Red = "RED",
    Green = "GREEN",
    Blue = "BLUE"
}

enum HttpStatus {
    OK = 200,
    NotFound = 404,
    ServerError = 500
}

// ❌ Don't use enums for things that could change or grow indefinitely
// Instead use a union type:
type Country = "USA" | "UK" | "Canada" | "Australia";
```

## Any Type (Use Sparingly!)

The `any` type opts out of type checking completely.

```typescript
let anything: any = "hello";
anything = 42;           // OK
anything = true;         // OK
anything = { a: 1 };     // OK

// TypeScript won't catch errors!
anything.nonExistentMethod();  // No error at compile time, crashes at runtime
```

::: warning Avoid any
Using `any` defeats the purpose of TypeScript. Your code becomes just like JavaScript - no type safety!

Use `any` only when:
- Migrating JavaScript to TypeScript gradually
- Working with truly dynamic data you can't type
- Quick prototyping (then fix it later!)
:::

## Unknown Type (Safer than any)

`unknown` is the type-safe version of `any`. You must check the type before using it.

```typescript
let value: unknown = "hello";

// Can't use it directly:
value.toUpperCase();  // ❌ Error: Object is of type 'unknown'

// Must narrow the type first:
if (typeof value === "string") {
    value.toUpperCase();  // ✅ Now TypeScript knows it's a string
}

// Or use type assertion (if you're sure):
let str = value as string;
str.toUpperCase();  // ✅ Works
```

### any vs unknown

| Feature | `any` | `unknown` |
|---------|-------|-----------|
| Assign any value | ✅ | ✅ |
| Use without checking | ✅ (unsafe!) | ❌ (must check) |
| Type safety | None | Preserved |
| Recommended | No | Yes (when needed) |

## Void Type

`void` means a function doesn't return anything.

```typescript
// This function does something but doesn't return a value
function logMessage(message: string): void {
    console.log(message);
    // No return statement
}

// Arrow function with void
const greet = (name: string): void => {
    console.log(`Hello, ${name}!`);
};

// You can't use the "result" of a void function
const result = logMessage("Hi");  // result is void (undefined)
```

## Never Type

`never` represents values that never occur. Used for:
1. Functions that always throw errors
2. Functions with infinite loops
3. Exhaustive type checking

```typescript
// Function that always throws - never returns normally
function throwError(message: string): never {
    throw new Error(message);
}

// Function with infinite loop - never returns
function infiniteLoop(): never {
    while (true) {
        // ...
    }
}

// Exhaustive checking (advanced but useful!)
type Shape = "circle" | "square";

function getArea(shape: Shape): number {
    switch (shape) {
        case "circle":
            return Math.PI * 10 * 10;
        case "square":
            return 10 * 10;
        default:
            // If we add a new shape and forget to handle it,
            // TypeScript will show an error here!
            const exhaustiveCheck: never = shape;
            return exhaustiveCheck;
    }
}
```

## Union Types

Union types let a variable hold one of several types. Use the `|` (pipe) symbol.

```typescript
// id can be string OR number
let id: string | number;
id = "abc123";  // ✅ OK
id = 123;       // ✅ OK
id = true;      // ❌ Error: boolean is not string | number

// Common use: nullable values
let username: string | null = null;
username = "john_doe";

// In functions
function printId(id: string | number): void {
    console.log(`ID: ${id}`);
}

printId("abc");  // OK
printId(123);    // OK
```

### Type Narrowing

When using union types, you often need to "narrow" the type:

```typescript
function printId(id: string | number): void {
    // TypeScript doesn't know which type it is yet
    // id.toUpperCase();  // ❌ Error: might be number

    // Narrow with typeof
    if (typeof id === "string") {
        // In here, TypeScript knows id is a string
        console.log(id.toUpperCase());
    } else {
        // In here, TypeScript knows id is a number
        console.log(id.toFixed(2));
    }
}
```

## Literal Types

Literal types are exact values used as types.

```typescript
// This variable can ONLY be "hello"
let greeting: "hello" = "hello";
greeting = "hi";  // ❌ Error: "hi" is not "hello"

// More useful: Union of literals
type Direction = "up" | "down" | "left" | "right";

let move: Direction = "up";     // ✅ OK
move = "diagonal";               // ❌ Error: not in the union

// Great for function parameters
function setVolume(level: "low" | "medium" | "high"): void {
    console.log(`Volume set to ${level}`);
}

setVolume("medium");  // ✅ OK
setVolume("maximum"); // ❌ Error: not a valid option
```

## Type Aliases

Type aliases let you create custom names for types. Use the `type` keyword.

```typescript
// Create a reusable type
type ID = string | number;
type Status = "pending" | "active" | "completed";

// Use your custom types
let orderId: ID = "ORD-123";
let orderStatus: Status = "pending";

// Object type alias
type User = {
    id: ID;
    name: string;
    email: string;
    status: Status;
};

// Use the type
const user: User = {
    id: 1,
    name: "John",
    email: "john@example.com",
    status: "active"
};

// Function type alias
type Callback = (message: string) => void;

const logger: Callback = (msg) => console.log(msg);
```

## Type Assertions

Sometimes you know more about a type than TypeScript does. Use assertions to tell TypeScript.

```typescript
// Angle bracket syntax (doesn't work in JSX/React)
let value: unknown = "hello world";
let length1: number = (<string>value).length;

// "as" syntax (works everywhere, preferred)
let length2: number = (value as string).length;

// Common use: DOM elements
const canvas = document.getElementById("myCanvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d");

// Non-null assertion (!) - tells TypeScript "trust me, this isn't null"
const element = document.querySelector(".btn")!;
// ⚠️ Use carefully! If it IS null, your code will crash
```

::: warning Be Careful with Assertions
Type assertions override TypeScript's type checking. If you're wrong, you'll get runtime errors. Only use when you truly know better than TypeScript.
:::

## Summary

| Concept | Purpose | Example |
|---------|---------|---------|
| Type Annotation | Explicitly declare type | `let name: string` |
| Type Inference | Let TypeScript figure it out | `let name = "John"` |
| Primitives | Basic types | `string`, `number`, `boolean` |
| Arrays | Lists of same type | `string[]`, `number[]` |
| Tuples | Fixed-length typed arrays | `[string, number]` |
| Enums | Named constants | `enum Status { Active, Inactive }` |
| Union Types | One of several types | `string \| number` |
| Literal Types | Exact values as types | `"success" \| "error"` |
| Type Aliases | Custom type names | `type ID = string \| number` |

## Practice Exercise

Try creating these types for a simple e-commerce system:

```typescript
// 1. Create a Product type
type Product = {
    id: number;
    name: string;
    price: number;
    category: "electronics" | "clothing" | "food";
    inStock: boolean;
};

// 2. Create a CartItem type
type CartItem = {
    product: Product;
    quantity: number;
};

// 3. Create a Cart type
type Cart = {
    items: CartItem[];
    total: number;
};

// 4. Create some test data
const laptop: Product = {
    id: 1,
    name: "MacBook Pro",
    price: 1999,
    category: "electronics",
    inStock: true
};

const myCart: Cart = {
    items: [{ product: laptop, quantity: 1 }],
    total: 1999
};

// 5. Try making intentional errors to see TypeScript catch them!
// laptop.category = "furniture";  // ❌ Error!
// myCart.items.push("invalid");   // ❌ Error!
```

## What's Next?

Great job completing the basics! You now understand:
- ✅ How to add type annotations
- ✅ All primitive types
- ✅ Arrays and tuples
- ✅ Enums for named constants
- ✅ Union types and type aliases

In the next lesson, we'll learn how to type **functions** - parameters, return types, optional parameters, and more.

---

[Next: Functions →](/guide/typescript/02-functions)
