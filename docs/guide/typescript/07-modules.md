# Modules

Learn how to organize TypeScript code with modules.

::: info What You'll Learn
- How to export and import code between files
- Named exports vs default exports
- Re-exporting and barrel files
- Module resolution and path mapping
- Organizing large projects
:::

## Why Use Modules?

Modules help you **organize code into separate files**, making your codebase:
- **Maintainable**: Each file has a single responsibility
- **Reusable**: Import the same code in multiple places
- **Encapsulated**: Hide internal implementation details
- **Scalable**: Easier to navigate large projects

```
Without Modules:              With Modules:
┌──────────────────┐         ┌──────────────────┐
│ app.ts           │         │ app.ts           │
│ - 5000 lines     │         │ - imports utils  │
│ - all code here  │         │ - imports user   │
│ - hard to find   │         │ - 50 lines       │
│ - hard to test   │         └──────────────────┘
└──────────────────┘                  ↓
                              ┌───────────────────────┐
                              │ utils/  │ user/       │
                              │ math.ts │ service.ts  │
                              │ date.ts │ model.ts    │
                              └───────────────────────┘
```

## ES Modules Basics

TypeScript uses standard ES modules (the modern JavaScript module system).

### Named Exports

Export multiple things from a file by name:

```typescript
// math.ts - Named exports
export const PI = 3.14159;

export function add(a: number, b: number): number {
    return a + b;
}

export function subtract(a: number, b: number): number {
    return a - b;
}

export class Calculator {
    add(a: number, b: number): number {
        return a + b;
    }
}

// Export types and interfaces too
export interface MathOperation {
    (a: number, b: number): number;
}

export type ID = string | number;
```

### Named Imports

Import specific items by name:

```typescript
// app.ts - Importing named exports
import { add, subtract, PI, Calculator } from "./math";

console.log(add(2, 3));       // 5
console.log(subtract(5, 2));  // 3
console.log(PI);              // 3.14159

const calc = new Calculator();
```

### Import with Aliases

Rename imports to avoid conflicts:

```typescript
// If you have naming conflicts, use 'as'
import { add as mathAdd } from "./math";
import { add as dateAdd } from "./date-utils";

mathAdd(2, 3);        // Math addition
dateAdd(date, 1);     // Date addition
```

### Export List

Export multiple items at once:

```typescript
// math.ts
const multiply = (a: number, b: number) => a * b;
const divide = (a: number, b: number) => a / b;

// Export at the end of file
export { multiply, divide };

// Or rename on export
export { multiply as mul, divide as div };
```

## Default Exports

Each file can have ONE default export:

```typescript
// logger.ts - Default export
export default class Logger {
    log(message: string): void {
        console.log(`[LOG] ${message}`);
    }

    error(message: string): void {
        console.error(`[ERROR] ${message}`);
    }
}
```

```typescript
// app.ts - Import default
import Logger from "./logger";  // No curly braces!

const logger = new Logger();
logger.log("Hello");
```

### Named vs Default Exports

| Feature | Named Export | Default Export |
|---------|--------------|----------------|
| Syntax | `export { name }` | `export default` |
| Import | `import { name }` | `import name` |
| Rename | `import { name as alias }` | `import anyName` |
| Per file | Unlimited | One only |
| Best for | Utilities, types | Main class/function |

::: tip When to Use Which
- **Named exports**: Multiple related things (utilities, constants, types)
- **Default exports**: Main thing the file provides (class, component)
- **Many prefer named exports only** for consistency and better refactoring
:::

### Mixed Exports

Combine default and named exports:

```typescript
// user.ts
export default class User {
    constructor(public name: string) {}
}

export function createUser(name: string): User {
    return new User(name);
}

export type UserRole = "admin" | "user" | "guest";
```

```typescript
// app.ts - Import both
import User, { createUser, UserRole } from "./user";

const user = new User("John");
const anotherUser = createUser("Jane");
const role: UserRole = "admin";
```

## Importing Everything

Import all exports as a namespace object:

```typescript
// Import everything with * as
import * as MathUtils from "./math";

MathUtils.add(1, 2);
MathUtils.subtract(5, 3);
console.log(MathUtils.PI);
```

## Side-Effect Imports

Import a file just to run its code (no specific imports):

```typescript
// polyfills.ts
if (!Array.prototype.includes) {
    Array.prototype.includes = function(item) { /* ... */ };
}

// app.ts - Run the file but import nothing
import "./polyfills";  // Just runs the code
```

## Type-Only Imports

Import only types (removed during compilation):

```typescript
// types.ts
export interface User {
    id: number;
    name: string;
}

export class UserService { /* ... */ }
```

```typescript
// app.ts - Type-only import
import type { User } from "./types";

// Or inline type import
import { UserService, type User } from "./types";

// The type import is erased at runtime
const user: User = { id: 1, name: "John" };
```

::: tip Why Type-Only Imports?
- Makes it clear the import is only for types
- Can improve build performance
- Prevents accidentally importing runtime code
:::

## Re-exporting (Barrel Files)

Create an `index.ts` that re-exports from multiple files:

```typescript
// utils/math.ts
export function add(a: number, b: number) { return a + b; }
export function subtract(a: number, b: number) { return a - b; }

// utils/date.ts
export function formatDate(date: Date) { return date.toISOString(); }
export function parseDate(str: string) { return new Date(str); }

// utils/index.ts - Barrel file
export { add, subtract } from "./math";
export { formatDate, parseDate } from "./date";
export { default as Logger } from "./logger";

// Re-export everything from a file
export * from "./helpers";

// Re-export with rename
export { User as UserModel } from "./user";

// Re-export types
export type { UserConfig, UserOptions } from "./user";
```

```typescript
// app.ts - Simple import from barrel
import { add, formatDate, Logger } from "./utils";
// Instead of:
// import { add } from "./utils/math";
// import { formatDate } from "./utils/date";
// import Logger from "./utils/logger";
```

### Visual Guide to Barrel Files

```
utils/
├── index.ts    ← Barrel file (re-exports everything)
├── math.ts     ← Individual module
├── date.ts     ← Individual module
└── logger.ts   ← Individual module

Without barrel:                 With barrel:
import { add } from           import { add, formatDate }
  "./utils/math";               from "./utils";
import { formatDate } from
  "./utils/date";
```

## Module Resolution

### Path Mapping

Configure shorter import paths in `tsconfig.json`:

```json
{
    "compilerOptions": {
        "baseUrl": ".",
        "paths": {
            "@/*": ["src/*"],
            "@utils/*": ["src/utils/*"],
            "@components/*": ["src/components/*"],
            "@services/*": ["src/services/*"]
        }
    }
}
```

```typescript
// Without path mapping
import { Button } from "../../../components/Button";
import { formatDate } from "../../../../utils/date";

// With path mapping
import { Button } from "@components/Button";
import { formatDate } from "@utils/date";
import { api } from "@/services/api";
```

## Namespaces

::: warning Legacy Feature
Namespaces are an older TypeScript pattern. **Prefer ES modules** for new code. You may encounter namespaces in older codebases.
:::

```typescript
// Using namespace to group related code
namespace Validation {
    export interface Validator {
        isValid(value: string): boolean;
    }

    export class EmailValidator implements Validator {
        isValid(value: string): boolean {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        }
    }

    export class PhoneValidator implements Validator {
        isValid(value: string): boolean {
            return /^\d{10}$/.test(value);
        }
    }
}

// Usage
const emailValidator = new Validation.EmailValidator();
console.log(emailValidator.isValid("test@example.com"));
```

## Dynamic Imports

Load modules at runtime (code splitting):

```typescript
// Load a module only when needed
async function loadChartLibrary() {
    // Module is loaded when this function runs
    const { Chart } = await import("./chart-library");
    return new Chart();
}

// Conditional import
async function loadFeature(featureName: string) {
    switch (featureName) {
        case "charts":
            return import("./features/charts");
        case "maps":
            return import("./features/maps");
        default:
            throw new Error(`Unknown feature: ${featureName}`);
    }
}

// Usage
const charts = await loadFeature("charts");
charts.render();
```

## Module Augmentation

Extend existing modules with new types:

```typescript
// Extend Express Request
import "express";

declare module "express" {
    interface Request {
        user?: {
            id: string;
            email: string;
            role: "admin" | "user";
        };
        startTime?: number;
    }
}

// Now TypeScript knows about request.user
app.use((req, res, next) => {
    req.user = { id: "123", email: "user@test.com", role: "user" };
    req.startTime = Date.now();
    next();
});
```

### Extending Global Types

```typescript
// Extend built-in Array
declare global {
    interface Array<T> {
        first(): T | undefined;
        last(): T | undefined;
        isEmpty(): boolean;
    }
}

// Implement the extensions
Array.prototype.first = function () {
    return this[0];
};

Array.prototype.last = function () {
    return this[this.length - 1];
};

Array.prototype.isEmpty = function () {
    return this.length === 0;
};

// Usage
const arr = [1, 2, 3];
console.log(arr.first()); // 1
console.log(arr.last());  // 3
console.log(arr.isEmpty()); // false

export {}; // Make this a module
```

## Organizing Large Projects

### Feature-Based Structure

Organize by feature, not by type:

```
src/
├── features/
│   ├── auth/
│   │   ├── index.ts        # Barrel file
│   │   ├── auth.service.ts
│   │   ├── auth.types.ts
│   │   └── auth.utils.ts
│   │
│   ├── users/
│   │   ├── index.ts
│   │   ├── user.service.ts
│   │   ├── user.model.ts
│   │   └── user.types.ts
│   │
│   └── products/
│       ├── index.ts
│       ├── product.service.ts
│       └── product.types.ts
│
├── shared/
│   ├── utils/
│   ├── types/
│   └── constants/
│
└── index.ts
```

### Barrel Files for Features

```typescript
// features/auth/index.ts
export { AuthService } from "./auth.service";
export { login, logout, register } from "./auth.utils";
export type { LoginCredentials, AuthToken, AuthState } from "./auth.types";

// features/index.ts
export * from "./auth";
export * from "./users";
export * from "./products";

// app.ts - Clean imports
import { AuthService, UserService, ProductService } from "@/features";
```

## CommonJS Interoperability

Working with older Node.js modules:

```json
// tsconfig.json
{
    "compilerOptions": {
        "esModuleInterop": true,
        "allowSyntheticDefaultImports": true
    }
}
```

```typescript
// With esModuleInterop enabled
import express from "express";      // Works with CommonJS default
import * as fs from "fs";           // Namespace import

// Import types from CommonJS
import type { Request, Response } from "express";
```

## Practice Exercise

Create a modular API client:

```typescript
// types/index.ts
export interface ApiConfig {
    baseUrl: string;
    timeout?: number;
    headers?: Record<string, string>;
}

export interface ApiResponse<T> {
    data: T;
    status: number;
    message?: string;
}

export interface ApiError {
    code: string;
    message: string;
    details?: unknown;
}

// client/http.ts
import type { ApiConfig, ApiResponse, ApiError } from "../types";

export class HttpClient {
    private config: Required<ApiConfig>;

    constructor(config: ApiConfig) {
        this.config = {
            timeout: 5000,
            headers: {},
            ...config
        };
    }

    async request<T>(
        method: string,
        path: string,
        body?: unknown
    ): Promise<ApiResponse<T>> {
        const response = await fetch(`${this.config.baseUrl}${path}`, {
            method,
            headers: {
                "Content-Type": "application/json",
                ...this.config.headers
            },
            body: body ? JSON.stringify(body) : undefined
        });

        const data = await response.json();

        if (!response.ok) {
            throw {
                code: "API_ERROR",
                message: data.message || "Request failed",
                details: data
            } as ApiError;
        }

        return {
            data,
            status: response.status
        };
    }

    get<T>(path: string): Promise<ApiResponse<T>> {
        return this.request<T>("GET", path);
    }

    post<T, U>(path: string, body: U): Promise<ApiResponse<T>> {
        return this.request<T>("POST", path, body);
    }

    put<T, U>(path: string, body: U): Promise<ApiResponse<T>> {
        return this.request<T>("PUT", path, body);
    }

    delete<T>(path: string): Promise<ApiResponse<T>> {
        return this.request<T>("DELETE", path);
    }
}

// services/user.service.ts
import { HttpClient } from "../client/http";

export interface User {
    id: number;
    name: string;
    email: string;
}

export interface CreateUserDto {
    name: string;
    email: string;
}

export class UserService {
    constructor(private http: HttpClient) {}

    async getUsers(): Promise<User[]> {
        const response = await this.http.get<User[]>("/users");
        return response.data;
    }

    async getUser(id: number): Promise<User> {
        const response = await this.http.get<User>(`/users/${id}`);
        return response.data;
    }

    async createUser(data: CreateUserDto): Promise<User> {
        const response = await this.http.post<User, CreateUserDto>(
            "/users",
            data
        );
        return response.data;
    }

    async deleteUser(id: number): Promise<void> {
        await this.http.delete(`/users/${id}`);
    }
}

// index.ts - Main barrel file
export { HttpClient } from "./client/http";
export { UserService } from "./services/user.service";
export type * from "./types";

// app.ts - Usage
import { HttpClient, UserService } from "./api";

const http = new HttpClient({ baseUrl: "https://api.example.com" });
const userService = new UserService(http);

const users = await userService.getUsers();
console.log(users);
```

## Summary

| Concept | Syntax | Use Case |
|---------|--------|----------|
| Named export | `export { name }` | Multiple exports per file |
| Default export | `export default` | One main export |
| Named import | `import { name }` | Import specific items |
| Default import | `import Name` | Import main export |
| Re-export | `export * from` | Barrel files |
| Type import | `import type { T }` | Types only |
| Dynamic import | `await import()` | Code splitting |
| Path mapping | `@/...` | Cleaner imports |

---

[Next: Decorators →](/guide/typescript/08-decorators)
