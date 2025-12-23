# TypeScript Tutorial

::: info Official Documentation
This tutorial is based on the official TypeScript documentation. For the most up-to-date information, visit: [https://www.typescriptlang.org/docs/](https://www.typescriptlang.org/docs/)
:::

Welcome to the comprehensive TypeScript tutorial! Learn how to write type-safe JavaScript at scale.

## What is TypeScript?

TypeScript is **JavaScript with superpowers**. It adds optional static typing to JavaScript, which helps you catch errors before your code runs.

Think of it this way:
- **JavaScript**: You write code, run it, and discover errors
- **TypeScript**: You write code, see errors immediately in your editor, fix them, then run

```typescript
// JavaScript - This runs but causes problems
function greet(name) {
    return `Hello, ${name.toUpperCase()}!`;
}
greet(123); // Runtime error! 123 doesn't have toUpperCase()

// TypeScript - This shows an error BEFORE you run it
function greet(name: string): string {
    return `Hello, ${name.toUpperCase()}!`;
}
greet(123); // ❌ Error: Argument of type 'number' is not assignable to type 'string'
greet("John"); // ✅ Works perfectly: "Hello, JOHN!"
```

## Why Should You Learn TypeScript?

### The Problem TypeScript Solves

```javascript
// Without TypeScript - Common bugs in JavaScript
function calculateTotal(items) {
    let total = 0;
    for (let item of items) {
        total += item.price * item.quanity; // Typo: "quanity" instead of "quantity"
    }
    return total;
}

// This runs without error but gives wrong results!
// You might not notice until production 😱
```

```typescript
// With TypeScript - Errors caught immediately
interface CartItem {
    name: string;
    price: number;
    quantity: number;
}

function calculateTotal(items: CartItem[]): number {
    let total = 0;
    for (let item of items) {
        total += item.price * item.quanity; // ❌ Error: Property 'quanity' does not exist
        total += item.price * item.quantity; // ✅ Correct!
    }
    return total;
}
```

### Benefits at a Glance

| Benefit | What It Means | Example |
|---------|--------------|---------|
| **Catch Errors Early** | Find bugs before running code | Typos, wrong types, missing properties |
| **Better Autocomplete** | Your editor knows what's available | Type `user.` and see all properties |
| **Self-Documenting** | Types explain what code expects | `function greet(name: string)` is clear |
| **Safer Refactoring** | Rename with confidence | Change a property name, see all affected code |
| **Team Collaboration** | Everyone understands the data shapes | Interfaces define contracts |

## How TypeScript Works

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Your Code     │     │   TypeScript    │     │   JavaScript    │
│   (.ts files)   │ ──▶ │   Compiler      │ ──▶ │   (.js files)   │
│                 │     │   (tsc)         │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │  Type Errors    │
                    │  (if any)       │
                    └─────────────────┘
```

**Important**: TypeScript is converted to JavaScript before it runs. Browsers and Node.js only run JavaScript!

## Tutorial Structure

### 🟢 Beginner Level
Start here if you're new to TypeScript:

| Lesson | What You'll Learn |
|--------|-------------------|
| [Basics](/guide/typescript/01-basics) | Types, variables, type annotations - the foundation |
| [Functions](/guide/typescript/02-functions) | How to type function parameters and returns |
| [Objects & Interfaces](/guide/typescript/03-interfaces) | Defining shapes for your data |

### 🟡 Intermediate Level
Ready to level up? Learn these powerful features:

| Lesson | What You'll Learn |
|--------|-------------------|
| [Classes](/guide/typescript/04-classes) | Object-oriented programming with types |
| [Generics](/guide/typescript/05-generics) | Reusable, type-safe code |
| [Type Manipulation](/guide/typescript/06-type-manipulation) | Transform and combine types |

### 🔴 Advanced Level
Master TypeScript with these advanced topics:

| Lesson | What You'll Learn |
|--------|-------------------|
| [Modules](/guide/typescript/07-modules) | Organize code across files |
| [Decorators](/guide/typescript/08-decorators) | Metaprogramming features |
| [Declaration Files](/guide/typescript/09-declarations) | Type definitions for libraries |
| [Advanced Patterns](/guide/typescript/10-advanced) | Professional patterns and practices |

## Prerequisites

Before starting, you should have:

- ✅ **Basic JavaScript knowledge** - variables, functions, arrays, objects
- ✅ **Familiarity with ES6+** - arrow functions, destructuring, template literals
- ✅ **Node.js installed** - [Download here](https://nodejs.org/)
- ✅ **A code editor** - VS Code is recommended (best TypeScript support)

::: tip New to JavaScript?
If you're not comfortable with JavaScript yet, check out our [JavaScript Tutorial](/guide/javascript/) first!
:::

## Getting Started

### Step 1: Install TypeScript

Open your terminal and run:

```bash
# Install TypeScript globally (available everywhere)
npm install -g typescript

# Verify installation
tsc --version
# Should show something like: Version 5.x.x
```

### Step 2: Create Your First TypeScript File

Create a new file called `hello.ts`:

```typescript
// hello.ts

// This is a type annotation - we're saying "name must be a string"
function greet(name: string): string {
    return `Hello, ${name}!`;
}

// TypeScript knows this is correct
const message = greet("World");
console.log(message);

// Try uncommenting this line - you'll see an error!
// greet(123);
```

### Step 3: Compile and Run

```bash
# Compile TypeScript to JavaScript
tsc hello.ts

# This creates hello.js - run it with Node
node hello.js
# Output: Hello, World!
```

### Step 4: See TypeScript in Action

Try adding this code to see type checking:

```typescript
// This will show an error in your editor immediately!
function add(a: number, b: number): number {
    return a + b;
}

add(5, "10"); // ❌ Error: Argument of type 'string' is not assignable to type 'number'
add(5, 10);   // ✅ Works: returns 15
```

## Setting Up a Real Project

For real projects, you'll want a configuration file:

```bash
# Create a new folder
mkdir my-ts-project
cd my-ts-project

# Initialize npm
npm init -y

# Install TypeScript locally
npm install --save-dev typescript

# Create TypeScript config
npx tsc --init
```

This creates `tsconfig.json`:

```json
{
    "compilerOptions": {
        "target": "ES2020",           // JavaScript version to output
        "module": "commonjs",          // Module system
        "strict": true,                // Enable all strict checks
        "esModuleInterop": true,       // Better import compatibility
        "skipLibCheck": true,          // Skip checking .d.ts files
        "forceConsistentCasingInFileNames": true,
        "outDir": "./dist",            // Output folder
        "rootDir": "./src"             // Source folder
    },
    "include": ["src/**/*"],
    "exclude": ["node_modules"]
}
```

**Project structure:**
```
my-ts-project/
├── src/
│   └── index.ts      ← Your TypeScript code
├── dist/             ← Compiled JavaScript (generated)
├── package.json
└── tsconfig.json
```

## TypeScript vs JavaScript Comparison

### Before (JavaScript)

```javascript
// You have no idea what shape 'user' should be
function displayUser(user) {
    // This might crash if user is null
    // Or if user.name doesn't exist
    console.log(user.name.toUpperCase());
    console.log(`Age: ${user.age}`);
}

// Easy to make mistakes
displayUser({ nam: "John", age: 30 }); // Typo in 'name' - no error!
displayUser(null); // Crashes at runtime!
```

### After (TypeScript)

```typescript
// Clear definition of what a User looks like
interface User {
    name: string;
    age: number;
    email?: string; // Optional property
}

// TypeScript knows exactly what to expect
function displayUser(user: User): void {
    console.log(user.name.toUpperCase());
    console.log(`Age: ${user.age}`);
}

displayUser({ nam: "John", age: 30 }); // ❌ Error: 'nam' doesn't exist on type 'User'
displayUser(null); // ❌ Error: Argument of type 'null' is not assignable
displayUser({ name: "John", age: 30 }); // ✅ Works perfectly!
```

## Common TypeScript Syntax Cheat Sheet

```typescript
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// BASIC TYPES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
let name: string = "John";
let age: number = 30;
let isActive: boolean = true;
let items: string[] = ["a", "b", "c"];

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// FUNCTIONS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function add(a: number, b: number): number {
    return a + b;
}

const multiply = (a: number, b: number): number => a * b;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// OBJECTS & INTERFACES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
interface User {
    id: number;
    name: string;
    email?: string; // Optional
}

const user: User = { id: 1, name: "John" };

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// UNION TYPES (this OR that)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
let id: string | number;
id = "abc123"; // OK
id = 123;      // OK

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TYPE ALIASES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
type ID = string | number;
type Status = "pending" | "active" | "completed";
```

## VS Code Tips for TypeScript

VS Code has excellent TypeScript support built-in:

1. **Hover over variables** to see their types
2. **Ctrl/Cmd + Click** on a type to go to its definition
3. **F2** to rename a symbol everywhere
4. **Ctrl/Cmd + Space** for autocomplete
5. **Red squiggly lines** show errors before you run code

::: tip Quick Fix
When you see a red squiggly line, click on it and press `Ctrl/Cmd + .` to see quick fixes!
:::

## Video Tutorials

::: tip Recommended Video Resources
Learn TypeScript through these excellent video tutorials from the community.
:::

### Free Courses

| Course | Creator | Description |
|--------|---------|-------------|
| [TypeScript Full Course](https://www.youtube.com/watch?v=30LWjhZzg50) | freeCodeCamp | 5-hour comprehensive course |
| [TypeScript Crash Course](https://www.youtube.com/watch?v=BCg4U1FzODs) | Traversy Media | 1-hour beginner crash course |
| [TypeScript Tutorial for Beginners](https://www.youtube.com/watch?v=d56mG7DezGs) | Programming with Mosh | 1-hour beginner tutorial |
| [TypeScript in 100 Seconds](https://www.youtube.com/watch?v=zQnBQ4tB3ZA) | Fireship | Quick 100-second explanation |

### Official Resources

| Resource | Description |
|----------|-------------|
| [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/) | Official TypeScript documentation |
| [TypeScript Playground](https://www.typescriptlang.org/play) | Interactive TypeScript editor |

### Topic-Specific Videos

| Topic | Video | Duration |
|-------|-------|----------|
| Generics | [TypeScript Generics](https://www.youtube.com/watch?v=nViEqpgwxHE) | ~20 min |
| Interfaces vs Types | [Interface vs Type](https://www.youtube.com/watch?v=oiFo2z8ILNo) | ~15 min |
| Utility Types | [Utility Types](https://www.youtube.com/watch?v=EU0TB_8KHpY) | ~25 min |
| Advanced Patterns | [Advanced TypeScript](https://www.youtube.com/watch?v=F2Z4T_WPdfY) | ~40 min |

## What's Next?

Ready to start learning? Begin with the basics:

**[Start with TypeScript Basics →](/guide/typescript/01-basics)**

You'll learn:
- How to add types to variables
- All the basic types (string, number, boolean, etc.)
- How TypeScript infers types automatically
- Arrays, tuples, and enums
- Union types and type aliases

Let's begin your TypeScript journey!
