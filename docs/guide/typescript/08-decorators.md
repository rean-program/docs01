# Decorators

Learn metaprogramming with TypeScript decorators.

::: info What You'll Learn
- What decorators are and how they work
- Class, method, property, and parameter decorators
- Creating decorator factories
- Practical decorator patterns
:::

## What Are Decorators?

Decorators are **special functions** that can modify classes, methods, properties, or parameters. They're like wrappers that add extra behavior without changing the original code.

```
Without Decorator:              With Decorator:
┌─────────────────┐            ┌─────────────────┐
│ class User      │            │ @log            │ ← Adds logging
│   save() {...}  │            │ class User      │
│                 │            │   save() {...}  │
└─────────────────┘            └─────────────────┘
                                      │
                                      ▼
                               Automatically logs
                               when methods run!
```

::: tip Enable Decorators
Add these options to your `tsconfig.json`:
```json
{
    "compilerOptions": {
        "experimentalDecorators": true,
        "emitDecoratorMetadata": true
    }
}
```
:::

## Types of Decorators

| Type | Target | Use Case |
|------|--------|----------|
| Class | `@decorator class` | Modify or replace class |
| Method | `@decorator method()` | Modify method behavior |
| Property | `@decorator prop` | Track/validate properties |
| Parameter | `method(@decorator param)` | Mark parameters |
| Accessor | `@decorator get/set` | Modify getter/setter |

## Class Decorators

Class decorators receive the **constructor function** and can modify or replace the class:

### Simple Class Decorator

```typescript
// A decorator is just a function
function sealed(constructor: Function) {
    // Seal prevents adding/removing properties
    Object.seal(constructor);
    Object.seal(constructor.prototype);
}

@sealed
class Greeter {
    greeting: string;

    constructor(message: string) {
        this.greeting = message;
    }

    greet() {
        return `Hello, ${this.greeting}`;
    }
}

// The class is now sealed - can't add new properties
```

### Decorator Factory (Decorator with Parameters)

```typescript
// Decorator factory: a function that RETURNS a decorator
function logger(prefix: string) {
    // This returned function is the actual decorator
    return function <T extends { new (...args: any[]): {} }>(
        constructor: T
    ) {
        return class extends constructor {
            constructor(...args: any[]) {
                super(...args);
                console.log(`${prefix}: Instance created`);
            }
        };
    };
}

@logger("MyClass")
class MyClass {
    constructor(public name: string) {}
}

const instance = new MyClass("Test");
// Output: "MyClass: Instance created"
```

### Visual Breakdown

```
@logger("MyClass")      ← Decorator factory call
class MyClass           ← Original class
    │
    ▼
logger("MyClass")       ← Returns a decorator function
    │
    ▼
decorator(MyClass)      ← Decorator modifies/replaces class
    │
    ▼
New Enhanced Class      ← Class now logs on instantiation
```

### Adding Properties with Class Decorator

```typescript
function withTimestamp<T extends { new (...args: any[]): {} }>(
    constructor: T
) {
    return class extends constructor {
        createdAt = new Date();
    };
}

@withTimestamp
class Document {
    constructor(public title: string) {}
}

const doc = new Document("My Doc") as Document & { createdAt: Date };
console.log(doc.createdAt); // Current date
console.log(doc.title);     // "My Doc"
```

## Method Decorators

Method decorators can **wrap, modify, or replace** method behavior:

### Basic Method Decorator

```typescript
function log(
    target: any,           // Class prototype (or constructor for static)
    propertyKey: string,   // Method name
    descriptor: PropertyDescriptor  // Method descriptor
) {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
        console.log(`Calling ${propertyKey} with:`, args);
        const result = originalMethod.apply(this, args);
        console.log(`Result:`, result);
        return result;
    };

    return descriptor;
}

class Calculator {
    @log
    add(a: number, b: number): number {
        return a + b;
    }
}

const calc = new Calculator();
calc.add(2, 3);
// Output:
// Calling add with: [2, 3]
// Result: 5
```

### How Method Decorators Work

```
@log
add(a, b) { return a + b; }

Step 1: Decorator receives:
  - target: Calculator.prototype
  - propertyKey: "add"
  - descriptor: { value: [original function], ... }

Step 2: Decorator wraps original method:
  descriptor.value = function(...args) {
      console.log("before");      ← Added behavior
      const result = original();  ← Original method
      console.log("after");       ← Added behavior
      return result;
  }

Step 3: Decorated method replaces original
```

### Decorator Factory for Methods

```typescript
// Measure execution time
function measure(label?: string) {
    return function (
        target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor
    ) {
        const originalMethod = descriptor.value;

        descriptor.value = async function (...args: any[]) {
            const start = performance.now();
            const result = await originalMethod.apply(this, args);
            const end = performance.now();
            console.log(`${label || propertyKey} took ${end - start}ms`);
            return result;
        };

        return descriptor;
    };
}

class DataService {
    @measure("Fetching data")
    async fetchData() {
        await new Promise(resolve => setTimeout(resolve, 100));
        return { data: "test" };
    }
}

const service = new DataService();
await service.fetchData();
// Output: "Fetching data took 100.5ms"
```

### Debounce Decorator

```typescript
function debounce(ms: number) {
    return function (
        target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor
    ) {
        let timeout: NodeJS.Timeout;
        const originalMethod = descriptor.value;

        descriptor.value = function (...args: any[]) {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                originalMethod.apply(this, args);
            }, ms);
        };

        return descriptor;
    };
}

class SearchInput {
    @debounce(300)
    search(query: string) {
        console.log("Searching for:", query);
    }
}

const input = new SearchInput();
input.search("h");
input.search("he");
input.search("hel");
input.search("hell");
input.search("hello");
// Only "Searching for: hello" is logged (after 300ms)
```

## Property Decorators

Property decorators modify how properties work:

### Required Property Validator

```typescript
function required(target: any, propertyKey: string) {
    let value: any;

    const getter = function () {
        return value;
    };

    const setter = function (newVal: any) {
        if (newVal === undefined || newVal === null || newVal === "") {
            throw new Error(`${propertyKey} is required`);
        }
        value = newVal;
    };

    Object.defineProperty(target, propertyKey, {
        get: getter,
        set: setter,
        enumerable: true,
        configurable: true
    });
}

class User {
    @required
    name!: string;

    @required
    email!: string;
}

const user = new User();
// user.name = "";     // ❌ Error: name is required
user.name = "John";    // ✅ OK
```

### Observable Property

```typescript
function observable(target: any, propertyKey: string) {
    const privateKey = `_${propertyKey}`;
    const callbacksKey = `_${propertyKey}Callbacks`;

    Object.defineProperty(target, propertyKey, {
        get() {
            return this[privateKey];
        },
        set(value) {
            const oldValue = this[privateKey];
            this[privateKey] = value;

            // Notify all listeners
            if (this[callbacksKey]) {
                this[callbacksKey].forEach((cb: Function) =>
                    cb(value, oldValue)
                );
            }
        }
    });

    // Add method to subscribe to changes
    target[`on${propertyKey.charAt(0).toUpperCase() + propertyKey.slice(1)}Change`] =
        function (callback: Function) {
            if (!this[callbacksKey]) {
                this[callbacksKey] = [];
            }
            this[callbacksKey].push(callback);
        };
}

class Store {
    @observable
    count = 0;
}

const store = new Store() as Store & {
    onCountChange: (cb: (n: number, o: number) => void) => void;
};

store.onCountChange((newVal, oldVal) => {
    console.log(`Count changed from ${oldVal} to ${newVal}`);
});

store.count = 5;  // "Count changed from 0 to 5"
store.count = 10; // "Count changed from 5 to 10"
```

## Parameter Decorators

Mark parameters for special handling (often used with method decorators):

```typescript
const requiredParams: Map<string, number[]> = new Map();

// Parameter decorator - marks required parameters
function required(
    target: any,
    propertyKey: string,
    parameterIndex: number
) {
    const params = requiredParams.get(propertyKey) || [];
    params.push(parameterIndex);
    requiredParams.set(propertyKey, params);
}

// Method decorator - validates required parameters
function validate(
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
) {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
        const params = requiredParams.get(propertyKey) || [];

        for (const index of params) {
            if (args[index] === undefined || args[index] === null) {
                throw new Error(
                    `Parameter at index ${index} is required for ${propertyKey}`
                );
            }
        }

        return originalMethod.apply(this, args);
    };

    return descriptor;
}

class UserService {
    @validate
    createUser(
        @required name: string,
        @required email: string,
        age?: number  // Not required
    ) {
        return { name, email, age };
    }
}

const service = new UserService();
// service.createUser(null, "test@test.com");  // ❌ Error
service.createUser("John", "john@test.com");   // ✅ OK
service.createUser("John", "john@test.com", 30); // ✅ OK
```

## Decorator Composition

Multiple decorators are evaluated **top-down** but executed **bottom-up**:

```typescript
function first() {
    console.log("first(): factory evaluated");
    return function (target: any, key: string, desc: PropertyDescriptor) {
        console.log("first(): decorator called");
    };
}

function second() {
    console.log("second(): factory evaluated");
    return function (target: any, key: string, desc: PropertyDescriptor) {
        console.log("second(): decorator called");
    };
}

class Example {
    @first()    // ← Evaluated first
    @second()   // ← Evaluated second
    method() {} // ← But executed in reverse!
}

// Output:
// first(): factory evaluated
// second(): factory evaluated
// second(): decorator called   ← Called first!
// first(): decorator called    ← Called second!
```

### Visual Explanation

```
@first()        ← Factories evaluated top-down
@second()
method()
    │
    ▼
first() returns decorator1
second() returns decorator2
    │
    ▼
Execute bottom-up:
  decorator2(method)    ← second() called first
  decorator1(result)    ← first() called second
    │
    ▼
Final decorated method
```

## Practical Examples

### API Route Decorator

```typescript
interface RouteDefinition {
    path: string;
    method: string;
    handler: string;
}

const routes: RouteDefinition[] = [];

function Route(method: string, path: string) {
    return function (
        target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor
    ) {
        routes.push({
            path,
            method,
            handler: propertyKey
        });
    };
}

// Convenience decorators
const Get = (path: string) => Route("GET", path);
const Post = (path: string) => Route("POST", path);
const Put = (path: string) => Route("PUT", path);
const Delete = (path: string) => Route("DELETE", path);

class UserController {
    @Get("/users")
    getUsers() {
        return [{ id: 1, name: "John" }];
    }

    @Get("/users/:id")
    getUser(id: string) {
        return { id, name: "John" };
    }

    @Post("/users")
    createUser(data: any) {
        return { id: 1, ...data };
    }

    @Delete("/users/:id")
    deleteUser(id: string) {
        return { success: true };
    }
}

console.log(routes);
// [
//   { path: "/users", method: "GET", handler: "getUsers" },
//   { path: "/users/:id", method: "GET", handler: "getUser" },
//   { path: "/users", method: "POST", handler: "createUser" },
//   { path: "/users/:id", method: "DELETE", handler: "deleteUser" }
// ]
```

### Memoization Decorator

```typescript
function memoize(
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
) {
    const originalMethod = descriptor.value;
    const cache = new Map<string, any>();

    descriptor.value = function (...args: any[]) {
        const key = JSON.stringify(args);

        if (cache.has(key)) {
            console.log(`Cache hit for ${propertyKey}(${key})`);
            return cache.get(key);
        }

        console.log(`Cache miss for ${propertyKey}(${key})`);
        const result = originalMethod.apply(this, args);
        cache.set(key, result);
        return result;
    };

    return descriptor;
}

class MathService {
    @memoize
    fibonacci(n: number): number {
        if (n <= 1) return n;
        return this.fibonacci(n - 1) + this.fibonacci(n - 2);
    }
}

const math = new MathService();
console.log(math.fibonacci(10)); // Calculates and caches
console.log(math.fibonacci(10)); // Returns from cache instantly
```

### Validation Decorators

```typescript
import "reflect-metadata";

const validatorsKey = Symbol("validators");

interface Validator {
    validate(value: any): boolean;
    message: string;
}

function addValidator(target: any, propertyKey: string, validator: Validator) {
    const validators: Map<string, Validator[]> =
        Reflect.getMetadata(validatorsKey, target) || new Map();

    const propertyValidators = validators.get(propertyKey) || [];
    propertyValidators.push(validator);
    validators.set(propertyKey, propertyValidators);

    Reflect.defineMetadata(validatorsKey, validators, target);
}

// Validation decorator factories
function MinLength(min: number, message?: string) {
    return function (target: any, propertyKey: string) {
        addValidator(target, propertyKey, {
            validate: (value) => typeof value === "string" && value.length >= min,
            message: message || `${propertyKey} must be at least ${min} characters`
        });
    };
}

function MaxLength(max: number, message?: string) {
    return function (target: any, propertyKey: string) {
        addValidator(target, propertyKey, {
            validate: (value) => typeof value === "string" && value.length <= max,
            message: message || `${propertyKey} must be at most ${max} characters`
        });
    };
}

function Email(message?: string) {
    return function (target: any, propertyKey: string) {
        addValidator(target, propertyKey, {
            validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
            message: message || `${propertyKey} must be a valid email`
        });
    };
}

function Min(min: number, message?: string) {
    return function (target: any, propertyKey: string) {
        addValidator(target, propertyKey, {
            validate: (value) => typeof value === "number" && value >= min,
            message: message || `${propertyKey} must be at least ${min}`
        });
    };
}

function Max(max: number, message?: string) {
    return function (target: any, propertyKey: string) {
        addValidator(target, propertyKey, {
            validate: (value) => typeof value === "number" && value <= max,
            message: message || `${propertyKey} must be at most ${max}`
        });
    };
}

// Validate function
function validate<T extends object>(obj: T): { valid: boolean; errors: string[] } {
    const validators: Map<string, Validator[]> =
        Reflect.getMetadata(validatorsKey, obj) || new Map();

    const errors: string[] = [];

    for (const [propertyKey, propertyValidators] of validators) {
        const value = (obj as any)[propertyKey];

        for (const validator of propertyValidators) {
            if (!validator.validate(value)) {
                errors.push(validator.message);
            }
        }
    }

    return {
        valid: errors.length === 0,
        errors
    };
}

// Usage
class CreateUserDto {
    @MinLength(2)
    @MaxLength(50)
    name!: string;

    @Email()
    email!: string;

    @Min(0)
    @Max(120)
    age!: number;
}

const dto = new CreateUserDto();
dto.name = "J";          // Too short
dto.email = "invalid";   // Not valid email
dto.age = 150;           // Too high

const result = validate(dto);
console.log(result);
// {
//     valid: false,
//     errors: [
//         "name must be at least 2 characters",
//         "email must be a valid email",
//         "age must be at most 120"
//     ]
// }
```

## Summary

| Decorator Type | Receives | Common Use |
|---------------|----------|------------|
| Class | `constructor` | Add properties, wrap class |
| Method | `target, key, descriptor` | Logging, caching, validation |
| Property | `target, key` | Observable, validation |
| Parameter | `target, key, index` | Mark for validation |
| Accessor | `target, key, descriptor` | Configure getter/setter |

### Key Points
- Decorators are functions that modify behavior
- Decorator factories return decorators (for parameters)
- Multiple decorators: factories run top-down, decorators bottom-up
- Common in frameworks like Angular, NestJS, TypeORM

---

[Next: Declaration Files →](/guide/typescript/09-declarations)
