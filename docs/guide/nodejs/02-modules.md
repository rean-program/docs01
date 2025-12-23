# Node.js Modules

Modules are the building blocks of Node.js applications. They allow you to organize your code into reusable, maintainable pieces. In this tutorial, you'll learn about CommonJS and ES Modules.

## What are Modules?

A module is simply a JavaScript file that exports code (functions, objects, variables) that can be imported and used by other files.

```
┌─────────────────────────────────────────────────────────────┐
│                    Without Modules                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   app.js (One huge file with everything!)                   │
│   ┌─────────────────────────────────────────────────────┐  │
│   │  // Database connection                              │  │
│   │  // User authentication                              │  │
│   │  // API routes                                       │  │
│   │  // Utility functions                                │  │
│   │  // Business logic                                   │  │
│   │  // ... 5000+ lines of code 😱                       │  │
│   └─────────────────────────────────────────────────────┘  │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                    With Modules                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐     │
│   │ db.js    │ │ auth.js  │ │ routes.js│ │ utils.js │     │
│   │          │ │          │ │          │ │          │     │
│   │ Database │ │ Login/   │ │ API      │ │ Helper   │     │
│   │ code     │ │ Logout   │ │ endpoints│ │ functions│     │
│   └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘     │
│        │            │            │            │            │
│        └────────────┴─────┬──────┴────────────┘            │
│                           │                                │
│                     ┌─────▼─────┐                          │
│                     │  app.js   │                          │
│                     │  (main)   │                          │
│                     └───────────┘                          │
│                                                             │
│   Clean, organized, reusable! 🎉                           │
└─────────────────────────────────────────────────────────────┘
```

## Two Module Systems

Node.js supports two module systems:

| Feature | CommonJS | ES Modules (ESM) |
|---------|----------|------------------|
| **Syntax** | `require()` / `module.exports` | `import` / `export` |
| **Loading** | Synchronous | Asynchronous |
| **File Extension** | `.js` (default) | `.mjs` or `.js` with config |
| **Support** | Node.js (all versions) | Node.js 12+ |
| **Browser** | Needs bundler | Native support |
| **Use in 2024** | Still widely used | Recommended for new projects |

## CommonJS Modules

CommonJS is the original module system in Node.js.

### Exporting (module.exports)

**Single Export:**

```javascript
// greet.js
function greet(name) {
    return `Hello, ${name}!`;
}

// Export the function
module.exports = greet;
```

```javascript
// app.js
const greet = require('./greet');

console.log(greet('World'));  // Hello, World!
```

**Multiple Exports:**

```javascript
// math.js
function add(a, b) {
    return a + b;
}

function subtract(a, b) {
    return a - b;
}

function multiply(a, b) {
    return a * b;
}

function divide(a, b) {
    if (b === 0) throw new Error('Cannot divide by zero');
    return a / b;
}

// Export multiple functions
module.exports = {
    add,
    subtract,
    multiply,
    divide
};
```

```javascript
// app.js
const math = require('./math');

console.log(math.add(5, 3));       // 8
console.log(math.subtract(10, 4)); // 6
console.log(math.multiply(2, 6));  // 12
console.log(math.divide(15, 3));   // 5
```

**Destructuring Import:**

```javascript
// app.js
const { add, multiply } = require('./math');

console.log(add(5, 3));      // 8
console.log(multiply(2, 6)); // 12
```

### Using exports Shorthand

```javascript
// utils.js
exports.capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
exports.lowercase = (str) => str.toLowerCase();
exports.uppercase = (str) => str.toUpperCase();
```

```javascript
// app.js
const { capitalize, uppercase } = require('./utils');

console.log(capitalize('hello')); // Hello
console.log(uppercase('hello'));  // HELLO
```

::: warning exports vs module.exports
`exports` is a reference to `module.exports`. If you assign a new value to `exports`, it breaks the reference:

```javascript
// ❌ This doesn't work
exports = { greet: () => 'Hello' };

// ✅ This works
module.exports = { greet: () => 'Hello' };

// ✅ This also works
exports.greet = () => 'Hello';
```
:::

### Exporting a Class

```javascript
// User.js
class User {
    constructor(name, email) {
        this.name = name;
        this.email = email;
    }

    greet() {
        return `Hello, I'm ${this.name}`;
    }

    getInfo() {
        return {
            name: this.name,
            email: this.email
        };
    }
}

module.exports = User;
```

```javascript
// app.js
const User = require('./User');

const user = new User('John', 'john@example.com');
console.log(user.greet());    // Hello, I'm John
console.log(user.getInfo());  // { name: 'John', email: 'john@example.com' }
```

## ES Modules (ESM)

ES Modules are the modern JavaScript standard for modules.

### Enabling ES Modules

**Option 1: Use .mjs extension**
```javascript
// greet.mjs
export function greet(name) {
    return `Hello, ${name}!`;
}
```

**Option 2: Add "type": "module" to package.json**
```json
{
  "name": "my-project",
  "type": "module"
}
```

Then use `.js` extension normally.

### Named Exports

```javascript
// math.js
export function add(a, b) {
    return a + b;
}

export function subtract(a, b) {
    return a - b;
}

export const PI = 3.14159;

export const E = 2.71828;
```

```javascript
// app.js
import { add, subtract, PI } from './math.js';

console.log(add(5, 3));    // 8
console.log(subtract(10, 4)); // 6
console.log(PI);           // 3.14159
```

### Default Export

```javascript
// Calculator.js
export default class Calculator {
    add(a, b) {
        return a + b;
    }

    subtract(a, b) {
        return a - b;
    }

    multiply(a, b) {
        return a * b;
    }

    divide(a, b) {
        if (b === 0) throw new Error('Cannot divide by zero');
        return a / b;
    }
}
```

```javascript
// app.js
import Calculator from './Calculator.js';

const calc = new Calculator();
console.log(calc.add(5, 3));      // 8
console.log(calc.multiply(4, 7)); // 28
```

### Combining Default and Named Exports

```javascript
// utils.js
// Default export
export default function mainFunction() {
    return 'Main function';
}

// Named exports
export function helper1() {
    return 'Helper 1';
}

export function helper2() {
    return 'Helper 2';
}

export const VERSION = '1.0.0';
```

```javascript
// app.js
import mainFunction, { helper1, helper2, VERSION } from './utils.js';

console.log(mainFunction()); // Main function
console.log(helper1());      // Helper 1
console.log(VERSION);        // 1.0.0
```

### Import All as Namespace

```javascript
// app.js
import * as math from './math.js';

console.log(math.add(5, 3));    // 8
console.log(math.PI);           // 3.14159
console.log(math.subtract(10, 4)); // 6
```

### Renaming Imports/Exports

```javascript
// math.js
function add(a, b) {
    return a + b;
}

export { add as sum };
```

```javascript
// app.js
import { sum as addition } from './math.js';

console.log(addition(5, 3)); // 8
```

### Dynamic Imports

Load modules dynamically at runtime:

```javascript
// app.js
async function loadModule() {
    // Conditionally load a module
    if (needsAdvancedMath) {
        const { default: AdvancedMath } = await import('./advanced-math.js');
        const math = new AdvancedMath();
        return math.calculate();
    }
}

// Or with .then()
import('./math.js').then(math => {
    console.log(math.add(5, 3));
});
```

## Built-in Modules

Node.js comes with many built-in modules that don't need installation:

### Importing Built-in Modules

**CommonJS:**
```javascript
const fs = require('fs');
const path = require('path');
const http = require('http');
const os = require('os');
```

**ES Modules:**
```javascript
import fs from 'fs';
import path from 'path';
import http from 'http';
import os from 'os';

// Or with node: prefix (recommended)
import fs from 'node:fs';
import path from 'node:path';
```

### Common Built-in Modules

| Module | Purpose | Example |
|--------|---------|---------|
| `fs` | File system operations | Read/write files |
| `path` | File path utilities | Join paths, get extensions |
| `http` | HTTP server/client | Create web servers |
| `https` | HTTPS server/client | Secure connections |
| `os` | Operating system info | CPU, memory, platform |
| `events` | Event emitter | Custom events |
| `stream` | Streaming data | Handle large files |
| `util` | Utility functions | Promisify, format |
| `crypto` | Cryptography | Hashing, encryption |
| `url` | URL parsing | Parse/format URLs |
| `querystring` | Query string parsing | Parse form data |
| `buffer` | Binary data | Handle binary data |
| `child_process` | Run commands | Execute shell commands |

### Path Module Example

```javascript
const path = require('path');

// Join paths (cross-platform)
const filePath = path.join('users', 'john', 'documents', 'file.txt');
console.log(filePath);  // users/john/documents/file.txt (Unix)
                        // users\john\documents\file.txt (Windows)

// Get file extension
console.log(path.extname('photo.jpg'));     // .jpg
console.log(path.extname('archive.tar.gz')); // .gz

// Get filename
console.log(path.basename('/home/user/file.txt'));      // file.txt
console.log(path.basename('/home/user/file.txt', '.txt')); // file

// Get directory name
console.log(path.dirname('/home/user/file.txt'));  // /home/user

// Parse path into components
const parsed = path.parse('/home/user/documents/file.txt');
console.log(parsed);
// {
//   root: '/',
//   dir: '/home/user/documents',
//   base: 'file.txt',
//   ext: '.txt',
//   name: 'file'
// }

// Resolve to absolute path
console.log(path.resolve('file.txt'));  // /current/working/directory/file.txt

// Check if path is absolute
console.log(path.isAbsolute('/home/user')); // true
console.log(path.isAbsolute('file.txt'));   // false
```

## Module Resolution

How does Node.js find modules?

```
┌─────────────────────────────────────────────────────────────┐
│              Module Resolution Order                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   require('something')                                      │
│         │                                                   │
│         ▼                                                   │
│   1. Is it a built-in module? (fs, path, http)             │
│         │ Yes → Load built-in                              │
│         │ No ↓                                              │
│   2. Does it start with './' or '../' or '/'?              │
│         │ Yes → Load as file or directory                  │
│         │ No ↓                                              │
│   3. Look in node_modules folders                          │
│         │                                                   │
│         ├── ./node_modules/something                       │
│         ├── ../node_modules/something                      │
│         ├── ../../node_modules/something                   │
│         └── ... (up to root)                               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### File Extension Resolution

When you `require('./myfile')`, Node.js looks for:

1. `myfile.js`
2. `myfile.json`
3. `myfile.node` (compiled addon)

### Directory as Module

If you `require('./mydir')`:

1. Look for `mydir/package.json` with "main" field
2. Look for `mydir/index.js`
3. Look for `mydir/index.json`
4. Look for `mydir/index.node`

```javascript
// mydir/index.js
module.exports = {
    greet: () => 'Hello from directory module!'
};
```

```javascript
// app.js
const mydir = require('./mydir');
console.log(mydir.greet()); // Hello from directory module!
```

## Creating a Module Package

Let's create a reusable utility module:

```
string-utils/
├── index.js
├── capitalize.js
├── truncate.js
└── slugify.js
```

**capitalize.js:**
```javascript
/**
 * Capitalizes the first letter of a string
 * @param {string} str - Input string
 * @returns {string} Capitalized string
 */
function capitalize(str) {
    if (typeof str !== 'string' || str.length === 0) {
        return str;
    }
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

module.exports = capitalize;
```

**truncate.js:**
```javascript
/**
 * Truncates a string to specified length
 * @param {string} str - Input string
 * @param {number} length - Maximum length
 * @param {string} ending - Ending to append (default: '...')
 * @returns {string} Truncated string
 */
function truncate(str, length, ending = '...') {
    if (typeof str !== 'string') return str;
    if (str.length <= length) return str;
    return str.slice(0, length - ending.length) + ending;
}

module.exports = truncate;
```

**slugify.js:**
```javascript
/**
 * Converts a string to URL-friendly slug
 * @param {string} str - Input string
 * @returns {string} URL slug
 */
function slugify(str) {
    if (typeof str !== 'string') return str;
    return str
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')    // Remove non-word chars
        .replace(/[\s_-]+/g, '-')    // Replace spaces with -
        .replace(/^-+|-+$/g, '');    // Remove leading/trailing -
}

module.exports = slugify;
```

**index.js:**
```javascript
const capitalize = require('./capitalize');
const truncate = require('./truncate');
const slugify = require('./slugify');

module.exports = {
    capitalize,
    truncate,
    slugify
};
```

**Usage:**
```javascript
const { capitalize, truncate, slugify } = require('./string-utils');

console.log(capitalize('hello world'));
// Hello world

console.log(truncate('This is a very long text that needs to be shortened', 20));
// This is a very lo...

console.log(slugify('Hello World! This is a Test'));
// hello-world-this-is-a-test
```

## CommonJS vs ES Modules Comparison

```javascript
// ==================== CommonJS ====================

// Exporting
module.exports = function() { };
module.exports = { func1, func2 };
exports.myFunc = function() { };

// Importing
const module = require('./module');
const { func1, func2 } = require('./module');

// ==================== ES Modules ====================

// Exporting
export default function() { }
export { func1, func2 };
export const myFunc = function() { };

// Importing
import module from './module.js';
import { func1, func2 } from './module.js';
import * as utils from './module.js';
```

## Best Practices

### 1. One Module, One Responsibility

```javascript
// ❌ Bad: Module does too much
// utils.js
module.exports = {
    formatDate: () => {},
    validateEmail: () => {},
    connectDatabase: () => {},
    sendEmail: () => {},
    // ... many unrelated functions
};

// ✅ Good: Separate by responsibility
// date-utils.js
module.exports = { formatDate, parseDate };

// validation.js
module.exports = { validateEmail, validatePhone };

// database.js
module.exports = { connect, disconnect, query };
```

### 2. Keep Modules Small

```javascript
// ✅ Good: Focused, easy to understand
// calculator.js (50-100 lines)
module.exports = {
    add: (a, b) => a + b,
    subtract: (a, b) => a - b,
    multiply: (a, b) => a * b,
    divide: (a, b) => b !== 0 ? a / b : NaN
};
```

### 3. Use Clear Names

```javascript
// ❌ Bad: Unclear names
const u = require('./u');
const x = require('./x');

// ✅ Good: Descriptive names
const userService = require('./services/userService');
const validateInput = require('./utils/validation');
```

### 4. Export at the Bottom

```javascript
// ✅ Good: Easy to see what's exported
function helper1() { }
function helper2() { }
function privateHelper() { } // Not exported

module.exports = {
    helper1,
    helper2
};
```

## Exercise: Create a Logger Module

Create a simple logging module with different log levels:

```javascript
// logger.js
const colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    gray: '\x1b[90m'
};

function getTimestamp() {
    return new Date().toISOString();
}

function formatMessage(level, message) {
    return `[${getTimestamp()}] [${level.toUpperCase()}] ${message}`;
}

const logger = {
    info(message) {
        console.log(colors.blue + formatMessage('info', message) + colors.reset);
    },

    warn(message) {
        console.log(colors.yellow + formatMessage('warn', message) + colors.reset);
    },

    error(message) {
        console.log(colors.red + formatMessage('error', message) + colors.reset);
    },

    debug(message) {
        if (process.env.DEBUG) {
            console.log(colors.gray + formatMessage('debug', message) + colors.reset);
        }
    }
};

module.exports = logger;
```

**Usage:**
```javascript
const logger = require('./logger');

logger.info('Application started');
logger.warn('Low memory warning');
logger.error('Failed to connect to database');
logger.debug('This only shows when DEBUG=true');
```

**Output:**
```
[2024-01-15T10:30:45.123Z] [INFO] Application started
[2024-01-15T10:30:45.124Z] [WARN] Low memory warning
[2024-01-15T10:30:45.125Z] [ERROR] Failed to connect to database
```

## Summary

| Topic | What You Learned |
|-------|-----------------|
| **Module Concept** | Organize code into reusable files |
| **CommonJS** | `require()` and `module.exports` |
| **ES Modules** | `import` and `export` |
| **Built-in Modules** | `fs`, `path`, `http`, `os`, etc. |
| **Module Resolution** | How Node.js finds modules |
| **Best Practices** | Single responsibility, clear names |

## What's Next?

In the next chapter, we'll explore the [File System](/guide/nodejs/03-file-system) module - how to read, write, and manage files in Node.js.

---

[Next: File System →](/guide/nodejs/03-file-system)
