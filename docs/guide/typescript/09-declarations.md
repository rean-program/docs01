# Declaration Files

Learn how to create and use TypeScript declaration files.

::: info What You'll Learn
- What declaration files are and why they matter
- How to create `.d.ts` files for JavaScript libraries
- Declaration merging and module augmentation
- Publishing type definitions
:::

## What Are Declaration Files?

Declaration files (`.d.ts`) describe the **shape of JavaScript code** for TypeScript. They contain only type information - no actual implementation code.

```
JavaScript Library          Declaration File
┌─────────────────┐        ┌─────────────────┐
│ lodash.js       │        │ lodash.d.ts     │
│ function sum()  │   ←    │ function sum(   │
│ { ... }         │        │   ...numbers    │
│                 │        │ ): number;      │
└─────────────────┘        └─────────────────┘
    Runtime code              Type information
    (how it works)            (what types it uses)
```

### Why Declaration Files?

| Benefit | Description |
|---------|-------------|
| Type checking | Catch errors when using libraries |
| Autocomplete | See available methods and properties |
| Documentation | Types serve as inline documentation |
| Refactoring | Safe renaming across your codebase |

## Using Type Definitions

Most popular libraries have type definitions available:

```bash
# Install a library and its types
npm install lodash
npm install --save-dev @types/lodash

# Many modern libraries include their own types
npm install axios  # Types included!
```

```typescript
// TypeScript now knows about lodash
import { chunk, uniq } from "lodash";

chunk([1, 2, 3, 4], 2);  // ✅ TypeScript knows this returns number[][]
// chunk("invalid");     // ❌ Error: string is not an array
```

## Creating Declaration Files

### Basic Syntax

Declaration files use `declare` to describe external code:

```typescript
// math.d.ts

// Declare a function
declare function add(a: number, b: number): number;
declare function subtract(a: number, b: number): number;

// Declare a constant
declare const PI: number;

// Declare a class
declare class Calculator {
    add(a: number, b: number): number;
    subtract(a: number, b: number): number;
}

// Declare an interface (no 'declare' needed for types)
interface MathOptions {
    precision?: number;
    rounding?: "up" | "down" | "nearest";
}
```

### For a Module

Describe a module that can be imported:

```typescript
// mylib.d.ts
declare module "mylib" {
    // Named exports
    export function doSomething(value: string): void;
    export const version: string;

    // Types
    export interface Options {
        debug?: boolean;
        timeout?: number;
    }

    // Class
    export class Client {
        constructor(options?: Options);
        connect(): Promise<void>;
        disconnect(): void;
    }

    // Default export
    export default Client;
}
```

```typescript
// Usage
import Client, { doSomething, Options } from "mylib";

const options: Options = { debug: true };
const client = new Client(options);
```

### For Global Variables

Describe variables available globally (like `window` properties):

```typescript
// globals.d.ts

// Global variables
declare const API_URL: string;
declare const DEBUG: boolean;

// Global function
declare function log(message: string): void;

// Extending Window
declare global {
    interface Window {
        myApp: {
            version: string;
            init(): void;
            config: Record<string, unknown>;
        };
    }
}

export {}; // Make this a module (required for declare global)
```

```typescript
// Now you can use these globals with type safety
console.log(API_URL);
window.myApp.init();
```

## Declaration Merging

TypeScript allows you to **combine multiple declarations** with the same name:

### Interface Merging

```typescript
// First declaration
interface User {
    name: string;
}

// Second declaration (merged automatically)
interface User {
    age: number;
}

// User now has BOTH properties
const user: User = {
    name: "John",
    age: 30
};  // ✅ Both required!
```

### Visual Guide

```
interface User {           interface User {
    name: string;    +         age: number;
}                          }
        │                          │
        └──────────┬───────────────┘
                   │
                   ▼
           interface User {
               name: string;
               age: number;
           }
```

### Namespace Merging

```typescript
namespace Animals {
    export class Dog {
        bark() { console.log("Woof!"); }
    }
}

namespace Animals {
    export class Cat {
        meow() { console.log("Meow!"); }
    }
}

// Animals now has both Dog and Cat
const dog = new Animals.Dog();
const cat = new Animals.Cat();
```

### Function + Namespace Merging

Add properties to a function:

```typescript
function buildLabel(name: string): string {
    return buildLabel.prefix + name + buildLabel.suffix;
}

namespace buildLabel {
    export let prefix = "Hello, ";
    export let suffix = "!";
}

console.log(buildLabel("World")); // "Hello, World!"
buildLabel.prefix = "Hi, ";
console.log(buildLabel("World")); // "Hi, World!"
```

## Module Augmentation

Extend existing modules with new types:

### Extending Express

```typescript
// express-extensions.d.ts
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

    interface Response {
        success(data: unknown): Response;
        error(message: string): Response;
    }
}
```

```typescript
// Now TypeScript knows about request.user
import express from "express";

const app = express();

app.use((req, res, next) => {
    req.user = { id: "123", email: "user@test.com", role: "user" };
    req.startTime = Date.now();
    next();
});

app.get("/profile", (req, res) => {
    if (req.user) {
        res.json({ user: req.user });
    }
});
```

### Extending Built-in Types

```typescript
// array-extensions.d.ts
declare global {
    interface Array<T> {
        first(): T | undefined;
        last(): T | undefined;
        isEmpty(): boolean;
        random(): T | undefined;
    }
}

export {};
```

```typescript
// Implementation
Array.prototype.first = function () {
    return this[0];
};

Array.prototype.last = function () {
    return this[this.length - 1];
};

Array.prototype.isEmpty = function () {
    return this.length === 0;
};

Array.prototype.random = function () {
    if (this.length === 0) return undefined;
    return this[Math.floor(Math.random() * this.length)];
};

// Usage - TypeScript knows about these methods!
const arr = [1, 2, 3, 4, 5];
console.log(arr.first());  // 1
console.log(arr.last());   // 5
console.log(arr.isEmpty()); // false
console.log(arr.random()); // random element
```

## Triple-Slash Directives

Reference other declaration files:

```typescript
/// <reference path="./globals.d.ts" />
/// <reference types="node" />
/// <reference lib="es2020" />

// Now you can use types from those files
```

| Directive | Purpose |
|-----------|---------|
| `/// <reference path="..." />` | Reference local file |
| `/// <reference types="..." />` | Reference @types package |
| `/// <reference lib="..." />` | Reference built-in lib |

## Ambient Declarations

Describe external code that exists at runtime:

```typescript
// Describe jQuery (loaded via <script> tag)
declare const jQuery: (selector: string) => {
    html(content: string): void;
    on(event: string, handler: () => void): void;
    css(property: string, value: string): void;
};

declare const $: typeof jQuery;

// Now you can use jQuery with types
$(".button").on("click", () => {
    $(".content").html("Clicked!");
});
```

### Describing a Namespace

```typescript
// Describe Express types
declare namespace Express {
    interface Request {
        body: any;
        params: Record<string, string>;
        query: Record<string, string>;
    }

    interface Response {
        send(body: any): Response;
        json(body: any): Response;
        status(code: number): Response;
    }

    interface Application {
        get(path: string, handler: (req: Request, res: Response) => void): void;
        post(path: string, handler: (req: Request, res: Response) => void): void;
    }
}

declare function express(): Express.Application;
```

## Wildcard Module Declarations

Handle non-TypeScript imports:

```typescript
// assets.d.ts

// Images
declare module "*.png" {
    const value: string;
    export default value;
}

declare module "*.jpg" {
    const value: string;
    export default value;
}

declare module "*.svg" {
    const value: string;
    export default value;
}

// CSS Modules
declare module "*.module.css" {
    const classes: { [key: string]: string };
    export default classes;
}

declare module "*.module.scss" {
    const classes: { [key: string]: string };
    export default classes;
}

// JSON
declare module "*.json" {
    const value: any;
    export default value;
}
```

```typescript
// Now TypeScript allows these imports
import logo from "./logo.png";
import styles from "./styles.module.css";
import config from "./config.json";

console.log(logo);              // string (path)
console.log(styles.container);  // string (class name)
console.log(config);            // any
```

## Shorthand Declarations

Quick fix for untyped modules:

```typescript
// Allows import but everything is 'any'
declare module "my-untyped-lib";

// With basic structure
declare module "my-other-lib" {
    export function doThing(): void;
    export default function(): string;
}
```

## Publishing Type Definitions

### Including Types in Your Package

```json
// package.json
{
    "name": "my-library",
    "main": "dist/index.js",
    "types": "dist/index.d.ts",
    "files": ["dist"]
}
```

### TypeScript Config for Libraries

```json
// tsconfig.json
{
    "compilerOptions": {
        "declaration": true,
        "declarationDir": "dist",
        "declarationMap": true,
        "emitDeclarationOnly": false,
        "outDir": "dist",
        "rootDir": "src"
    },
    "include": ["src"]
}
```

| Option | Purpose |
|--------|---------|
| `declaration` | Generate `.d.ts` files |
| `declarationDir` | Output directory for `.d.ts` |
| `declarationMap` | Generate `.d.ts.map` for debugging |
| `emitDeclarationOnly` | Only generate types (no JS) |

## DefinitelyTyped

Community-maintained type definitions at [@types](https://github.com/DefinitelyTyped/DefinitelyTyped):

```bash
# Search for types
npm search @types/lodash

# Install types
npm install --save-dev @types/lodash
npm install --save-dev @types/express
npm install --save-dev @types/node
```

### Creating an @types Package

```typescript
// index.d.ts for @types/my-package
export interface Options {
    debug?: boolean;
    timeout?: number;
}

export function init(options?: Options): void;
export function process(data: string): string;
export function cleanup(): void;

// Allow UMD usage
export as namespace MyPackage;
```

## Practice Exercise

Create declaration files for a JavaScript library:

```typescript
// api-client.d.ts

/**
 * Configuration options for the API client
 */
export interface ApiClientConfig {
    /** Base URL for API requests */
    baseUrl: string;
    /** Request timeout in milliseconds */
    timeout?: number;
    /** Default headers for all requests */
    headers?: Record<string, string>;
    /** Retry configuration */
    retry?: {
        /** Number of retry attempts */
        attempts: number;
        /** Delay between retries in ms */
        delay: number;
    };
}

/**
 * HTTP request options
 */
export interface RequestOptions {
    /** HTTP method */
    method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
    /** Request headers */
    headers?: Record<string, string>;
    /** Request body */
    body?: unknown;
    /** Query parameters */
    params?: Record<string, string | number | boolean>;
    /** Abort signal for cancellation */
    signal?: AbortSignal;
}

/**
 * API response wrapper
 */
export interface ApiResponse<T> {
    /** Response data */
    data: T;
    /** HTTP status code */
    status: number;
    /** Response headers */
    headers: Record<string, string>;
}

/**
 * API error
 */
export interface ApiError extends Error {
    /** Error code */
    code: string;
    /** HTTP status code */
    status?: number;
    /** Response data */
    response?: unknown;
}

/**
 * Request interceptor function
 */
export type RequestInterceptor = (
    config: RequestOptions
) => RequestOptions | Promise<RequestOptions>;

/**
 * Response interceptor function
 */
export type ResponseInterceptor<T = unknown> = (
    response: ApiResponse<T>
) => ApiResponse<T> | Promise<ApiResponse<T>>;

/**
 * Error interceptor function
 */
export type ErrorInterceptor = (
    error: ApiError
) => never | Promise<never> | ApiResponse<unknown>;

/**
 * API Client class for making HTTP requests
 */
export declare class ApiClient {
    /**
     * Creates a new API client instance
     * @param config - Client configuration
     */
    constructor(config: ApiClientConfig);

    /**
     * Make a GET request
     * @param path - Request path
     * @param options - Request options
     */
    get<T>(path: string, options?: RequestOptions): Promise<ApiResponse<T>>;

    /**
     * Make a POST request
     * @param path - Request path
     * @param body - Request body
     * @param options - Request options
     */
    post<T, U = unknown>(
        path: string,
        body?: U,
        options?: RequestOptions
    ): Promise<ApiResponse<T>>;

    /**
     * Make a PUT request
     */
    put<T, U = unknown>(
        path: string,
        body?: U,
        options?: RequestOptions
    ): Promise<ApiResponse<T>>;

    /**
     * Make a DELETE request
     */
    delete<T>(path: string, options?: RequestOptions): Promise<ApiResponse<T>>;

    /**
     * Add a request interceptor
     * @returns Function to remove the interceptor
     */
    addRequestInterceptor(interceptor: RequestInterceptor): () => void;

    /**
     * Add a response interceptor
     * @returns Function to remove the interceptor
     */
    addResponseInterceptor<T>(interceptor: ResponseInterceptor<T>): () => void;

    /**
     * Add an error interceptor
     * @returns Function to remove the interceptor
     */
    addErrorInterceptor(interceptor: ErrorInterceptor): () => void;

    /**
     * Set default headers for all requests
     */
    setHeaders(headers: Record<string, string>): void;

    /**
     * Set authorization header
     * @param token - Auth token
     * @param type - Auth type (default: "Bearer")
     */
    setAuthToken(token: string, type?: string): void;
}

/**
 * Create a new API client instance
 */
export declare function createClient(config: ApiClientConfig): ApiClient;

export default ApiClient;
```

## Summary

| Concept | Purpose |
|---------|---------|
| `.d.ts` files | Type information for JS code |
| `declare` | Describe external code |
| `declare module` | Type a module |
| `declare global` | Extend global types |
| Interface merging | Combine declarations |
| Module augmentation | Extend existing modules |
| `@types/*` | Community type definitions |
| Wildcard modules | Handle non-TS imports |

---

[Next: Advanced Patterns →](/guide/typescript/10-advanced)
