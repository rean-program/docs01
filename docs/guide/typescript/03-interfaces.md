# Objects & Interfaces

Objects are everywhere in JavaScript - and TypeScript gives you powerful tools to describe their shapes. In this lesson, you'll learn how to use **interfaces** and **type aliases** to define object structures.

## Why Define Object Shapes?

```typescript
// Without types - what properties does user have? 🤷
function displayUser(user) {
    console.log(user.name);  // Does 'name' exist?
    console.log(user.email); // What about 'email'?
}

// With interfaces - crystal clear! ✨
interface User {
    name: string;
    email: string;
    age: number;
}

function displayUser(user: User) {
    console.log(user.name);  // ✅ We know this exists
    console.log(user.email); // ✅ And this too
}
```

## Defining Interfaces

An interface describes what properties an object should have.

### Basic Interface

```typescript
interface User {
    id: number;
    name: string;
    email: string;
}

// Object must match the interface exactly
const user: User = {
    id: 1,
    name: "John",
    email: "john@example.com"
};

// Missing properties cause errors
const badUser: User = {
    id: 2,
    name: "Jane"
    // ❌ Error: Property 'email' is missing
};

// Extra properties cause errors too
const extraUser: User = {
    id: 3,
    name: "Bob",
    email: "bob@example.com",
    phone: "555-1234"  // ❌ Error: 'phone' does not exist on type 'User'
};
```

### Reading an Interface

```typescript
interface Product {
    id: number;        // Required: must be a number
    name: string;      // Required: must be a string
    price: number;     // Required: must be a number
    description?: string;  // Optional: string or undefined
    readonly sku: string;  // Cannot be changed after creation
}
```

## Optional Properties

Use `?` for properties that might not exist.

```typescript
interface Config {
    host: string;
    port: number;
    debug?: boolean;    // Optional
    timeout?: number;   // Optional
}

// Both of these are valid:
const config1: Config = {
    host: "localhost",
    port: 3000
};

const config2: Config = {
    host: "localhost",
    port: 3000,
    debug: true,
    timeout: 5000
};
```

### Working with Optional Properties

```typescript
interface User {
    name: string;
    nickname?: string;
}

function greet(user: User) {
    console.log(`Hello, ${user.name}!`);

    // Must check before using optional properties
    if (user.nickname) {
        console.log(`Or should I call you ${user.nickname}?`);
    }

    // Or use optional chaining
    console.log(user.nickname?.toUpperCase());

    // Or provide a default
    const displayName = user.nickname ?? user.name;
}
```

## Readonly Properties

Use `readonly` to prevent modification after creation.

```typescript
interface Point {
    readonly x: number;
    readonly y: number;
}

const point: Point = { x: 10, y: 20 };
point.x = 5;  // ❌ Error: Cannot assign to 'x' because it is read-only

// Useful for immutable data
interface Config {
    readonly apiKey: string;
    readonly apiUrl: string;
}

const config: Config = {
    apiKey: "secret-key",
    apiUrl: "https://api.example.com"
};
// config.apiKey = "new-key";  // ❌ Error!
```

### Readonly Arrays

```typescript
interface Data {
    readonly items: readonly string[];  // Can't modify array or its contents
}

const data: Data = {
    items: ["a", "b", "c"]
};

// data.items = ["x", "y"];     // ❌ Error: items is readonly
// data.items.push("d");        // ❌ Error: push doesn't exist on readonly array
// data.items[0] = "changed";   // ❌ Error: cannot assign to readonly index
```

## Index Signatures

When you don't know all property names ahead of time.

### String Index Signature

```typescript
// Any string key maps to a string value
interface Dictionary {
    [key: string]: string;
}

const colors: Dictionary = {
    red: "#ff0000",
    green: "#00ff00",
    blue: "#0000ff"
    // Can add any string key!
};

colors.purple = "#800080";  // ✅ OK
console.log(colors.red);     // "#ff0000"
```

### Number Index Signature

```typescript
interface StringArray {
    [index: number]: string;
}

const arr: StringArray = ["apple", "banana", "cherry"];
const first: string = arr[0];  // "apple"
```

### Mixed Properties

```typescript
interface NamedDictionary {
    name: string;                    // Known property
    [key: string]: string | number;  // Other properties
}

const dict: NamedDictionary = {
    name: "My Dictionary",  // Required
    foo: "bar",             // Additional string
    count: 42               // Additional number
};
```

## Extending Interfaces

Interfaces can inherit from other interfaces.

### Single Inheritance

```typescript
interface Animal {
    name: string;
    age: number;
}

interface Dog extends Animal {
    breed: string;
    bark(): void;
}

const myDog: Dog = {
    name: "Buddy",
    age: 3,
    breed: "Golden Retriever",
    bark() {
        console.log("Woof!");
    }
};
```

### Multiple Inheritance

```typescript
interface Swimmer {
    swim(): void;
}

interface Flyer {
    fly(): void;
}

interface Duck extends Animal, Swimmer, Flyer {
    quack(): void;
}

const duck: Duck = {
    name: "Donald",
    age: 5,
    swim() { console.log("Swimming..."); },
    fly() { console.log("Flying..."); },
    quack() { console.log("Quack!"); }
};
```

### Extending for Modification

```typescript
// Base interface
interface BaseUser {
    id: number;
    name: string;
}

// Extended with more properties
interface User extends BaseUser {
    email: string;
    createdAt: Date;
}

// Extended for admin
interface Admin extends User {
    permissions: string[];
    adminSince: Date;
}
```

## Interface vs Type Alias

Both can define object shapes, but they have differences.

### Type Alias Syntax

```typescript
type User = {
    id: number;
    name: string;
    email: string;
};
```

### Key Differences

| Feature | Interface | Type Alias |
|---------|-----------|------------|
| Object shapes | ✅ Yes | ✅ Yes |
| Extend/inherit | ✅ `extends` | ✅ `&` (intersection) |
| Declaration merging | ✅ Yes | ❌ No |
| Union types | ❌ No | ✅ Yes |
| Primitives | ❌ No | ✅ Yes |

### Declaration Merging (Interfaces Only)

```typescript
// Declare interface
interface User {
    name: string;
}

// Add more properties in another declaration
interface User {
    age: number;
}

// User now has both properties!
const user: User = {
    name: "John",
    age: 30
};

// This does NOT work with type aliases:
type Person = { name: string };
type Person = { age: number };  // ❌ Error: Duplicate identifier
```

### Type Alias Exclusive Features

```typescript
// Union types (only with type alias)
type ID = string | number;
type Status = "pending" | "active" | "completed";

// Primitive types
type Name = string;

// Tuple types
type Coordinate = [number, number];

// Mapped types (advanced)
type Readonly<T> = {
    readonly [K in keyof T]: T[K];
};
```

### When to Use Which

```
┌─────────────────────────────────────────────────────────┐
│ Use INTERFACE when:                                     │
│ • Defining object shapes                                │
│ • Creating contracts for classes                        │
│ • You might need declaration merging                    │
│ • Working in a library (for extensibility)              │
├─────────────────────────────────────────────────────────┤
│ Use TYPE ALIAS when:                                    │
│ • Creating union types                                  │
│ • Working with tuples                                   │
│ • Mapping or transforming types                         │
│ • You want the alias to be "closed"                     │
└─────────────────────────────────────────────────────────┘
```

## Function Properties in Interfaces

Interfaces can describe objects with methods.

```typescript
// Method syntax
interface Calculator {
    add(a: number, b: number): number;
    subtract(a: number, b: number): number;
}

// Property syntax (same thing)
interface Calculator {
    add: (a: number, b: number) => number;
    subtract: (a: number, b: number) => number;
}

// Implementation
const calc: Calculator = {
    add(a, b) {
        return a + b;
    },
    subtract(a, b) {
        return a - b;
    }
};
```

### Callable Interface

```typescript
// Interface for a function itself
interface Greeting {
    (name: string): string;
}

const greet: Greeting = (name) => `Hello, ${name}!`;
console.log(greet("World"));  // "Hello, World!"

// Callable with properties
interface Counter {
    (): number;           // Can be called
    count: number;        // Has a property
    reset(): void;        // Has a method
}

function createCounter(): Counter {
    const fn = function() {
        return ++fn.count;
    } as Counter;
    fn.count = 0;
    fn.reset = function() {
        fn.count = 0;
    };
    return fn;
}

const counter = createCounter();
console.log(counter());  // 1
console.log(counter());  // 2
counter.reset();
console.log(counter());  // 1
```

## Class Implements Interface

Interfaces define contracts that classes must follow.

```typescript
interface Printable {
    print(): void;
}

interface Serializable {
    toJSON(): string;
}

// Class must implement all interface methods
class Document implements Printable, Serializable {
    constructor(public content: string) {}

    print(): void {
        console.log(this.content);
    }

    toJSON(): string {
        return JSON.stringify({ content: this.content });
    }
}

const doc = new Document("Hello, World!");
doc.print();  // "Hello, World!"
console.log(doc.toJSON());  // '{"content":"Hello, World!"}'
```

## Generic Interfaces

Interfaces can use type parameters.

```typescript
// Generic container
interface Container<T> {
    value: T;
    getValue(): T;
    setValue(value: T): void;
}

// Implementation for strings
class StringContainer implements Container<string> {
    constructor(public value: string) {}

    getValue(): string {
        return this.value;
    }

    setValue(value: string): void {
        this.value = value;
    }
}

// Implementation for any type
class Box<T> implements Container<T> {
    constructor(public value: T) {}

    getValue(): T {
        return this.value;
    }

    setValue(value: T): void {
        this.value = value;
    }
}

const stringBox = new Box<string>("hello");
const numberBox = new Box<number>(42);
```

### Generic Interface with Constraints

```typescript
// T must have an id property
interface Repository<T extends { id: number }> {
    findById(id: number): T | undefined;
    save(item: T): void;
    delete(id: number): boolean;
}

interface User {
    id: number;
    name: string;
}

class UserRepository implements Repository<User> {
    private users: User[] = [];

    findById(id: number): User | undefined {
        return this.users.find(u => u.id === id);
    }

    save(user: User): void {
        this.users.push(user);
    }

    delete(id: number): boolean {
        const index = this.users.findIndex(u => u.id === id);
        if (index > -1) {
            this.users.splice(index, 1);
            return true;
        }
        return false;
    }
}
```

## Intersection Types

Combine multiple types into one using `&`.

```typescript
interface HasName {
    name: string;
}

interface HasAge {
    age: number;
}

// Intersection: must have BOTH name AND age
type Person = HasName & HasAge;

const person: Person = {
    name: "John",
    age: 30
};

// More complex intersection
interface Employee extends Person {
    employeeId: string;
    department: string;
}

// Or use intersection
type Employee = Person & {
    employeeId: string;
    department: string;
};
```

### Intersection vs Union

```
Intersection (&): Must satisfy ALL types
Union (|): Must satisfy AT LEAST ONE type

interface A { a: string }
interface B { b: number }

type Both = A & B;     // { a: string, b: number }
type Either = A | B;   // { a: string } OR { b: number }
```

## Nested Interfaces

Interfaces can contain other interfaces.

```typescript
interface Address {
    street: string;
    city: string;
    country: string;
    postalCode: string;
}

interface Person {
    name: string;
    address: Address;  // Nested interface
}

interface Company {
    name: string;
    address: Address;
    employees: Person[];  // Array of nested interfaces
}

const company: Company = {
    name: "Tech Corp",
    address: {
        street: "123 Main St",
        city: "San Francisco",
        country: "USA",
        postalCode: "94102"
    },
    employees: [
        {
            name: "John",
            address: {
                street: "456 Oak Ave",
                city: "Oakland",
                country: "USA",
                postalCode: "94601"
            }
        }
    ]
};
```

## Utility Types for Interfaces

TypeScript provides built-in utility types.

```typescript
interface User {
    id: number;
    name: string;
    email: string;
    password: string;
}

// Partial<T> - All properties optional
type PartialUser = Partial<User>;
// { id?: number; name?: string; email?: string; password?: string; }

// Required<T> - All properties required
type RequiredUser = Required<Partial<User>>;

// Pick<T, K> - Select specific properties
type UserCredentials = Pick<User, "email" | "password">;
// { email: string; password: string; }

// Omit<T, K> - Exclude properties
type PublicUser = Omit<User, "password">;
// { id: number; name: string; email: string; }

// Readonly<T> - All properties readonly
type ImmutableUser = Readonly<User>;

// Record<K, T> - Object type from keys and value type
type UserRoles = Record<string, "admin" | "user" | "guest">;
// { [key: string]: "admin" | "user" | "guest" }
```

### Practical Utility Type Usage

```typescript
interface User {
    id: number;
    name: string;
    email: string;
}

// For creating (id is generated)
type CreateUserInput = Omit<User, "id">;

// For updating (all fields optional)
type UpdateUserInput = Partial<Omit<User, "id">>;

// For API responses (immutable)
type UserResponse = Readonly<User>;

function createUser(input: CreateUserInput): User {
    return {
        id: Math.random(),
        ...input
    };
}

function updateUser(id: number, updates: UpdateUserInput): User {
    // ...
}
```

## Discriminated Unions

Use a common property to distinguish between types.

```typescript
// Each shape has a "kind" discriminator
interface Circle {
    kind: "circle";
    radius: number;
}

interface Rectangle {
    kind: "rectangle";
    width: number;
    height: number;
}

interface Triangle {
    kind: "triangle";
    base: number;
    height: number;
}

// Union of all shapes
type Shape = Circle | Rectangle | Triangle;

function getArea(shape: Shape): number {
    // TypeScript narrows the type based on 'kind'
    switch (shape.kind) {
        case "circle":
            // TypeScript knows: shape is Circle
            return Math.PI * shape.radius ** 2;
        case "rectangle":
            // TypeScript knows: shape is Rectangle
            return shape.width * shape.height;
        case "triangle":
            // TypeScript knows: shape is Triangle
            return 0.5 * shape.base * shape.height;
    }
}

// Usage
const circle: Shape = { kind: "circle", radius: 5 };
const rect: Shape = { kind: "rectangle", width: 10, height: 20 };

console.log(getArea(circle));  // ~78.54
console.log(getArea(rect));    // 200
```

## Type Guards

Custom functions to narrow types.

```typescript
interface Bird {
    fly(): void;
    layEggs(): void;
}

interface Fish {
    swim(): void;
    layEggs(): void;
}

// Type guard function
function isFish(pet: Bird | Fish): pet is Fish {
    return (pet as Fish).swim !== undefined;
}

// Using the type guard
function move(pet: Bird | Fish) {
    if (isFish(pet)) {
        pet.swim();  // TypeScript knows pet is Fish
    } else {
        pet.fly();   // TypeScript knows pet is Bird
    }
}

// Using 'in' operator (built-in type guard)
function move2(pet: Bird | Fish) {
    if ("swim" in pet) {
        pet.swim();
    } else {
        pet.fly();
    }
}
```

## Summary

| Concept | Syntax | Purpose |
|---------|--------|---------|
| Interface | `interface Name { }` | Define object shape |
| Optional | `prop?: type` | Property may not exist |
| Readonly | `readonly prop: type` | Property can't change |
| Index signature | `[key: string]: type` | Dynamic property names |
| Extends | `interface B extends A` | Inherit properties |
| Implements | `class C implements I` | Class contract |
| Generics | `interface Box<T>` | Reusable with any type |
| Intersection | `A & B` | Combine types |
| Discriminated union | `kind: "name"` | Type-safe variants |

## Practice Exercise

Build a typed API system:

```typescript
// 1. Define response interfaces
interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: {
        code: string;
        message: string;
    };
    timestamp: Date;
}

interface PaginatedResponse<T> extends ApiResponse<T[]> {
    pagination: {
        page: number;
        perPage: number;
        total: number;
        totalPages: number;
    };
}

// 2. Define data models
interface User {
    id: number;
    name: string;
    email: string;
}

interface Post {
    id: number;
    title: string;
    content: string;
    authorId: number;
}

// 3. Create mock API functions
function getUser(id: number): ApiResponse<User> {
    return {
        success: true,
        data: { id, name: "John", email: "john@example.com" },
        timestamp: new Date()
    };
}

function getPosts(page: number = 1): PaginatedResponse<Post> {
    return {
        success: true,
        data: [
            { id: 1, title: "Hello", content: "World", authorId: 1 }
        ],
        timestamp: new Date(),
        pagination: {
            page,
            perPage: 10,
            total: 1,
            totalPages: 1
        }
    };
}

// 4. Use the functions
const userResponse = getUser(1);
if (userResponse.success && userResponse.data) {
    console.log(userResponse.data.name);  // TypeScript knows the type!
}
```

## What's Next?

Well done! You've learned:
- ✅ Defining interfaces
- ✅ Optional and readonly properties
- ✅ Extending interfaces
- ✅ Interface vs type alias
- ✅ Generic interfaces
- ✅ Utility types
- ✅ Discriminated unions

Next, we'll explore **Classes** in TypeScript - object-oriented programming with full type safety!

---

[Next: Classes →](/guide/typescript/04-classes)
