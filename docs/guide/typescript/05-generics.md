# Generics

Learn how to write reusable, type-safe code with generics.

::: info What You'll Learn
- What generics are and why they matter
- How to create generic functions, interfaces, and classes
- Generic constraints to limit type parameters
- Built-in utility types using generics
:::

## Why Generics?

Generics let you write **flexible code** that works with multiple types while keeping type safety. Think of them as **"type variables"** - placeholders for types that get filled in later.

### The Problem Without Generics

```typescript
// ❌ Problem: You want a function that returns what you pass in

// Option 1: Specific functions for each type
function identityString(value: string): string {
    return value;
}
function identityNumber(value: number): number {
    return value;
}
// Tedious! Need a new function for every type...

// Option 2: Use 'any' - loses type information!
function identityAny(value: any): any {
    return value;
}
const result = identityAny("hello");
// result is 'any' - TypeScript doesn't know it's a string!
result.toUpperCase(); // No autocomplete, no type checking 😢
```

### The Solution: Generics

```typescript
// ✅ Solution: Use a generic type parameter <T>
function identity<T>(value: T): T {
    return value;
}

// TypeScript knows the exact type!
const str = identity<string>("hello");  // str: string
const num = identity(42);               // num: number (inferred!)

str.toUpperCase();  // ✅ Autocomplete works!
num.toFixed(2);     // ✅ Number methods available!
```

### Visual Explanation

```
Without Generics:               With Generics:

identity(value: any): any       identity<T>(value: T): T
         │                                │
         ▼                                ▼
    ┌─────────┐                    ┌─────────┐
    │   any   │                    │    T    │ ← Type placeholder
    │ (lost!) │                    │(preserved)│
    └─────────┘                    └─────────┘
         │                                │
         ▼                                ▼
   Returns: any                   Returns: same type T!
   (no type info)                 (full type safety)
```

## Generic Functions

### Basic Syntax

```typescript
//         ┌─ Type parameter (like a variable for types)
//         │
function identity<T>(value: T): T {
//                      │      │
//                      │      └─ Return type uses T
//                      └─ Parameter type uses T
    return value;
}

// Two ways to call:
const a = identity<string>("hello");  // Explicit: specify <string>
const b = identity(42);               // Inferred: TypeScript figures it out
```

### Multiple Type Parameters

```typescript
// Use multiple type parameters for different types
function pair<T, U>(first: T, second: U): [T, U] {
    return [first, second];
}

const result = pair("hello", 42);  // type: [string, number]
console.log(result[0].length);     // ✅ Knows first is string
console.log(result[1].toFixed());  // ✅ Knows second is number
```

### Generic Arrow Functions

```typescript
// Arrow function syntax for generics
const getFirst = <T>(arr: T[]): T | undefined => {
    return arr[0];
};

const getLast = <T>(arr: T[]): T | undefined => {
    return arr[arr.length - 1];
};

getFirst([1, 2, 3]);        // number | undefined
getLast(["a", "b", "c"]);   // string | undefined
```

### Practical Examples

```typescript
// Swap two values
function swap<T, U>(a: T, b: U): [U, T] {
    return [b, a];
}

const [second, first] = swap("hello", 42);
// second: number (42)
// first: string ("hello")

// Create an array filled with a value
function createArray<T>(length: number, value: T): T[] {
    return Array(length).fill(value);
}

createArray(3, "x");     // ["x", "x", "x"] (string[])
createArray(3, 0);       // [0, 0, 0] (number[])
```

## Generic Constraints

Sometimes you need to limit what types can be used. Use `extends` to add constraints:

### The Problem

```typescript
// ❌ This won't work!
function logLength<T>(value: T): void {
    console.log(value.length);  // Error: Property 'length' does not exist on type 'T'
}
// TypeScript doesn't know if T has a 'length' property
```

### The Solution: Constraints

```typescript
// ✅ Constrain T to types that have a 'length' property
interface HasLength {
    length: number;
}

function logLength<T extends HasLength>(value: T): void {
    console.log(value.length);  // ✅ Now TypeScript knows 'length' exists
}

logLength("hello");     // ✅ OK - string has length
logLength([1, 2, 3]);   // ✅ OK - array has length
logLength({ length: 10 }); // ✅ OK - object has length property
// logLength(42);       // ❌ Error - number has no length
```

### Visual Guide to Constraints

```
<T extends HasLength>
        │
        └─── T must be a subtype of HasLength

HasLength { length: number }
        │
        ├── string ✅ (has length)
        ├── array ✅ (has length)
        ├── { length: 10 } ✅ (has length)
        │
        └── number ❌ (no length property)
```

### keyof Constraint

Use `keyof` to constrain to valid property keys:

```typescript
// Get a property from an object, safely!
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
    return obj[key];
}

const person = { name: "John", age: 30 };

const name = getProperty(person, "name");  // ✅ type: string
const age = getProperty(person, "age");    // ✅ type: number
// getProperty(person, "email");           // ❌ Error: "email" is not a key of person
```

### Multiple Constraints

```typescript
// T must have both id and name
interface HasId {
    id: number;
}

interface HasName {
    name: string;
}

// Use intersection type for multiple constraints
function displayItem<T extends HasId & HasName>(item: T): string {
    return `${item.id}: ${item.name}`;
}

displayItem({ id: 1, name: "Widget", price: 10 }); // ✅ OK
// displayItem({ id: 1 });                         // ❌ Error: missing 'name'
```

## Generic Interfaces

Define interfaces that work with any type:

```typescript
// Generic container interface
interface Container<T> {
    value: T;
    getValue(): T;
    setValue(value: T): void;
}

// Implement for strings
const stringContainer: Container<string> = {
    value: "hello",
    getValue() { return this.value; },
    setValue(value) { this.value = value; }
};

// Implement for numbers
const numberContainer: Container<number> = {
    value: 42,
    getValue() { return this.value; },
    setValue(value) { this.value = value; }
};
```

### Generic Interface for API Responses

```typescript
// Common pattern for API responses
interface ApiResponse<T> {
    data: T;
    status: number;
    message?: string;
    timestamp: Date;
}

interface User {
    id: number;
    name: string;
}

interface Product {
    id: number;
    title: string;
    price: number;
}

// Same interface, different data types!
const userResponse: ApiResponse<User> = {
    data: { id: 1, name: "John" },
    status: 200,
    timestamp: new Date()
};

const productResponse: ApiResponse<Product> = {
    data: { id: 1, title: "Widget", price: 9.99 },
    status: 200,
    timestamp: new Date()
};
```

## Generic Classes

Create reusable data structures:

```typescript
class Queue<T> {
    private items: T[] = [];

    enqueue(item: T): void {
        this.items.push(item);
    }

    dequeue(): T | undefined {
        return this.items.shift();
    }

    peek(): T | undefined {
        return this.items[0];
    }

    isEmpty(): boolean {
        return this.items.length === 0;
    }
}

// Queue of numbers
const numberQueue = new Queue<number>();
numberQueue.enqueue(1);
numberQueue.enqueue(2);
console.log(numberQueue.dequeue()); // 1

// Queue of strings
const stringQueue = new Queue<string>();
stringQueue.enqueue("first");
stringQueue.enqueue("second");
console.log(stringQueue.dequeue()); // "first"
```

### Generic Class with Constraints

```typescript
// Data store that requires items to have an 'id'
class DataStore<T extends { id: number }> {
    private items: Map<number, T> = new Map();

    add(item: T): void {
        this.items.set(item.id, item);  // ✅ TypeScript knows 'id' exists
    }

    get(id: number): T | undefined {
        return this.items.get(id);
    }

    remove(id: number): boolean {
        return this.items.delete(id);
    }

    getAll(): T[] {
        return Array.from(this.items.values());
    }
}

interface User { id: number; name: string; }
interface Product { id: number; title: string; }

const userStore = new DataStore<User>();
userStore.add({ id: 1, name: "John" });

const productStore = new DataStore<Product>();
productStore.add({ id: 1, title: "Widget" });
```

## Generic Type Aliases

Create reusable type definitions:

```typescript
// Result type for operations that might fail
type Result<T, E = Error> =
    | { success: true; value: T }
    | { success: false; error: E };

function divide(a: number, b: number): Result<number, string> {
    if (b === 0) {
        return { success: false, error: "Cannot divide by zero" };
    }
    return { success: true, value: a / b };
}

const result = divide(10, 2);
if (result.success) {
    console.log(result.value);  // ✅ TypeScript knows 'value' exists
} else {
    console.log(result.error);  // ✅ TypeScript knows 'error' exists
}
```

### Nullable Type Helper

```typescript
// Make any type nullable
type Maybe<T> = T | null | undefined;

let userName: Maybe<string> = "John";
userName = null;      // ✅ OK
userName = undefined; // ✅ OK

// Async function type helper
type AsyncFn<T> = () => Promise<T>;

const fetchUser: AsyncFn<{ id: number; name: string }> = async () => {
    return { id: 1, name: "John" };
};
```

## Default Type Parameters

Provide defaults when type isn't specified:

```typescript
// Default type is 'any'
interface ApiResponse<T = any> {
    data: T;
    status: number;
}

// Uses default type
const response1: ApiResponse = { data: "anything", status: 200 };

// Specifies type
const response2: ApiResponse<string[]> = {
    data: ["a", "b"],
    status: 200
};
```

## Conditional Types with Generics

Types that change based on conditions:

```typescript
// Is it a string?
type IsString<T> = T extends string ? true : false;

type A = IsString<"hello">;  // true
type B = IsString<42>;       // false

// Extract array element type
type ElementType<T> = T extends (infer E)[] ? E : never;

type NumElement = ElementType<number[]>;  // number
type StrElement = ElementType<string[]>;  // string

// Unwrap Promise
type Awaited<T> = T extends Promise<infer U> ? U : T;

type Result = Awaited<Promise<string>>;   // string
type Same = Awaited<number>;              // number (not a Promise)
```

## Mapped Types with Generics

Transform types property by property:

```typescript
// Make all properties optional (like Partial)
type MyPartial<T> = {
    [K in keyof T]?: T[K];
};

// Make all properties required (like Required)
type MyRequired<T> = {
    [K in keyof T]-?: T[K];
};

// Make all properties readonly (like Readonly)
type MyReadonly<T> = {
    readonly [K in keyof T]: T[K];
};

// Usage
interface User {
    id: number;
    name: string;
    email?: string;
}

type PartialUser = MyPartial<User>;
// { id?: number; name?: string; email?: string }

type ReadonlyUser = MyReadonly<User>;
// { readonly id: number; readonly name: string; readonly email?: string }
```

### Pick and Omit

```typescript
// Select specific properties
type MyPick<T, K extends keyof T> = {
    [P in K]: T[P];
};

// Exclude specific properties
type MyOmit<T, K extends keyof T> = {
    [P in Exclude<keyof T, K>]: T[P];
};

interface User {
    id: number;
    name: string;
    email: string;
    password: string;
}

type PublicUser = MyOmit<User, "password">;
// { id: number; name: string; email: string }

type Credentials = MyPick<User, "email" | "password">;
// { email: string; password: string }
```

## Common Patterns

### Type-Safe Object.keys

```typescript
function keys<T extends object>(obj: T): (keyof T)[] {
    return Object.keys(obj) as (keyof T)[];
}

const person = { name: "John", age: 30 };
const personKeys = keys(person);  // ("name" | "age")[]
```

### Type-Safe Merge

```typescript
function merge<T extends object, U extends object>(
    target: T,
    source: U
): T & U {
    return { ...target, ...source };
}

const merged = merge(
    { name: "John" },
    { age: 30 }
);
// { name: string; age: number }
```

### Group By

```typescript
function groupBy<T, K extends keyof T>(
    items: T[],
    key: K
): Map<T[K], T[]> {
    const map = new Map<T[K], T[]>();

    for (const item of items) {
        const groupKey = item[key];
        const group = map.get(groupKey) || [];
        group.push(item);
        map.set(groupKey, group);
    }

    return map;
}

interface Person { name: string; city: string; }

const people: Person[] = [
    { name: "Alice", city: "NYC" },
    { name: "Bob", city: "LA" },
    { name: "Carol", city: "NYC" }
];

const byCity = groupBy(people, "city");
// Map { "NYC" => [Alice, Carol], "LA" => [Bob] }
```

## Practice Exercise

Build a type-safe event emitter:

```typescript
// Event map type
interface EventMap {
    click: { x: number; y: number };
    keypress: { key: string; code: number };
    submit: { data: Record<string, unknown> };
}

// Generic event listener
type EventListener<T> = (event: T) => void;

class TypedEventEmitter<Events extends Record<string, unknown>> {
    private listeners = new Map<
        keyof Events,
        Set<EventListener<any>>
    >();

    on<K extends keyof Events>(
        event: K,
        listener: EventListener<Events[K]>
    ): () => void {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, new Set());
        }

        const listeners = this.listeners.get(event)!;
        listeners.add(listener);

        // Return unsubscribe function
        return () => listeners.delete(listener);
    }

    emit<K extends keyof Events>(event: K, data: Events[K]): void {
        const listeners = this.listeners.get(event);
        if (listeners) {
            listeners.forEach(listener => listener(data));
        }
    }

    once<K extends keyof Events>(
        event: K,
        listener: EventListener<Events[K]>
    ): void {
        const unsubscribe = this.on(event, (data) => {
            unsubscribe();
            listener(data);
        });
    }
}

// Usage - fully type-safe!
const emitter = new TypedEventEmitter<EventMap>();

// ✅ TypeScript knows the event data shape
emitter.on("click", (event) => {
    console.log(`Clicked at ${event.x}, ${event.y}`);
});

emitter.on("keypress", (event) => {
    console.log(`Key: ${event.key}, Code: ${event.code}`);
});

// ✅ Type checking on emit
emitter.emit("click", { x: 100, y: 200 });

// ❌ Error: wrong shape
// emitter.emit("click", { key: "a" });
```

## Summary

| Concept | Syntax | Use Case |
|---------|--------|----------|
| Basic generic | `<T>` | Reusable functions/classes |
| Multiple generics | `<T, U>` | Multiple related types |
| Constraints | `<T extends Type>` | Limit allowed types |
| Default type | `<T = Default>` | Provide fallback type |
| keyof constraint | `<K extends keyof T>` | Valid property keys |
| Conditional | `T extends U ? X : Y` | Type depends on condition |
| Mapped | `{ [K in keyof T]: ... }` | Transform all properties |

---

[Next: Type Manipulation →](/guide/typescript/06-type-manipulation)
