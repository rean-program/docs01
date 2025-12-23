# Getting Started with Node.js

Node.js lets you run JavaScript on the server-side. In this tutorial, you'll learn how to install Node.js, understand its architecture, and write your first programs.

## What is Node.js?

Node.js is a **runtime environment** that executes JavaScript code outside a web browser. It was created by Ryan Dahl in 2009 and has become one of the most popular backend technologies.

```
┌─────────────────────────────────────────────────────────────┐
│                    How Node.js Works                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   Your JavaScript Code                                      │
│         │                                                   │
│         ▼                                                   │
│   ┌─────────────────────────────────────────┐              │
│   │              Node.js Runtime             │              │
│   │  ┌─────────────┐   ┌─────────────────┐  │              │
│   │  │   V8 Engine │   │  Node.js APIs   │  │              │
│   │  │ (JavaScript │   │  (fs, http,     │  │              │
│   │  │  execution) │   │   path, etc.)   │  │              │
│   │  └─────────────┘   └─────────────────┘  │              │
│   │                                          │              │
│   │  ┌─────────────────────────────────┐    │              │
│   │  │           libuv                  │    │              │
│   │  │  (Async I/O, Event Loop)        │    │              │
│   │  └─────────────────────────────────┘    │              │
│   └─────────────────────────────────────────┘              │
│         │                                                   │
│         ▼                                                   │
│   Operating System (Windows, macOS, Linux)                  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Key Components

| Component | Purpose |
|-----------|---------|
| **V8 Engine** | Google's JavaScript engine that compiles JS to machine code |
| **Node.js APIs** | Built-in modules like `fs`, `http`, `path`, `os` |
| **libuv** | Library that handles async I/O and the event loop |
| **npm** | Package manager for installing third-party modules |

## Installation

### Step 1: Download Node.js

Visit [nodejs.org](https://nodejs.org) and download the **LTS (Long Term Support)** version.

```
┌─────────────────────────────────────────┐
│          Which Version to Choose?        │
├─────────────────────────────────────────┤
│                                         │
│   LTS (Recommended)    Current          │
│   ┌─────────────┐     ┌─────────────┐  │
│   │   20.x.x    │     │   21.x.x    │  │
│   │             │     │             │  │
│   │  • Stable   │     │  • Latest   │  │
│   │  • Tested   │     │  • Features │  │
│   │  • Safe     │     │  • Unstable │  │
│   └─────────────┘     └─────────────┘  │
│         ↑                               │
│    Choose this!                         │
└─────────────────────────────────────────┘
```

### Step 2: Verify Installation

Open your terminal and run:

```bash
# Check Node.js version
node --version
# Output: v20.x.x (or similar)

# Check npm version (comes with Node.js)
npm --version
# Output: 10.x.x (or similar)
```

### Alternative: Using Version Managers

For professional development, use a version manager to switch between Node.js versions:

**nvm (Node Version Manager)** - Recommended for macOS/Linux:
```bash
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Install Node.js
nvm install 20

# Use a specific version
nvm use 20

# List installed versions
nvm list
```

**nvm-windows** - For Windows:
```bash
# Download from: https://github.com/coreybutler/nvm-windows/releases

# Install Node.js
nvm install 20.0.0
nvm use 20.0.0
```

## Your First Node.js Program

### Hello World

Create a file called `hello.js`:

```javascript
// hello.js
console.log('Hello, Node.js!');
console.log('Welcome to server-side JavaScript!');
```

Run it:

```bash
node hello.js
```

**Output:**
```
Hello, Node.js!
Welcome to server-side JavaScript!
```

### Understanding the Code

```javascript
console.log('Hello, Node.js!');
//  ↑           ↑
//  │           └── The message to print
//  └── Built-in function to print output
```

Unlike browser JavaScript, Node.js runs directly in your terminal without needing an HTML file!

## The REPL (Read-Eval-Print-Loop)

Node.js comes with an interactive shell called REPL:

```bash
# Start REPL
node

# You'll see this prompt:
>
```

Try some commands:

```javascript
> 2 + 2
4

> 'Hello'.toUpperCase()
'HELLO'

> const name = 'Node.js'
undefined

> `Welcome to ${name}!`
'Welcome to Node.js!'

> Math.random()
0.7234567891234567

> .exit  // Exit REPL
```

### REPL Commands

| Command | Description |
|---------|-------------|
| `.help` | Show all REPL commands |
| `.clear` | Clear the REPL context |
| `.exit` | Exit the REPL |
| `.save filename` | Save current REPL session to a file |
| `.load filename` | Load a file into the REPL |
| `Tab` | Auto-complete |
| `↑/↓` | Navigate command history |

## Global Objects in Node.js

Node.js provides several global objects that are available everywhere:

### console

```javascript
// Different log levels
console.log('Regular message');
console.info('Information');
console.warn('Warning message');
console.error('Error message');

// Formatted output
console.log('Name: %s, Age: %d', 'John', 25);

// Object inspection
const user = { name: 'John', age: 25 };
console.log(user);         // { name: 'John', age: 25 }
console.table(user);       // Formatted table

// Timing
console.time('operation');
// ... some operation
console.timeEnd('operation'); // operation: 2.345ms
```

### process

The `process` object provides information about the current Node.js process:

```javascript
// Node.js version
console.log(process.version);  // v20.x.x

// Current working directory
console.log(process.cwd());    // /Users/you/project

// Platform
console.log(process.platform); // darwin, win32, linux

// Command line arguments
console.log(process.argv);
// ['/path/to/node', '/path/to/script.js', 'arg1', 'arg2']

// Environment variables
console.log(process.env.PATH);
console.log(process.env.NODE_ENV);

// Exit the program
process.exit(0);  // 0 = success, 1 = error
```

**Example: Using Command Line Arguments**

```javascript
// greet.js
const args = process.argv.slice(2); // Remove node and script path
const name = args[0] || 'World';

console.log(`Hello, ${name}!`);
```

```bash
node greet.js
# Output: Hello, World!

node greet.js John
# Output: Hello, John!
```

### __dirname and __filename

```javascript
// These are available in CommonJS modules

console.log(__dirname);  // /Users/you/project
console.log(__filename); // /Users/you/project/index.js
```

::: warning Note for ES Modules
In ES modules (using `import`/`export`), `__dirname` and `__filename` are not available. Use this instead:

```javascript
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
```
:::

### global

The `global` object is Node.js's equivalent to `window` in browsers:

```javascript
// Set a global variable
global.myVar = 'Hello';

// Access it anywhere
console.log(myVar); // 'Hello'

// Check if something is global
console.log(global.console === console); // true
console.log(global.setTimeout === setTimeout); // true
```

## Built-in Modules

Node.js comes with many built-in modules. Here's a preview:

```javascript
// File System - Read and write files
const fs = require('fs');

// Path - Handle file paths
const path = require('path');

// HTTP - Create web servers
const http = require('http');

// OS - Operating system info
const os = require('os');

// Events - Event-driven programming
const EventEmitter = require('events');
```

**Quick Example - OS Information:**

```javascript
const os = require('os');

console.log('Platform:', os.platform());     // darwin, win32, linux
console.log('Architecture:', os.arch());     // x64, arm64
console.log('CPUs:', os.cpus().length);      // 8
console.log('Total Memory:', (os.totalmem() / 1024 / 1024 / 1024).toFixed(2), 'GB');
console.log('Free Memory:', (os.freemem() / 1024 / 1024 / 1024).toFixed(2), 'GB');
console.log('Home Directory:', os.homedir());
console.log('Username:', os.userInfo().username);
```

**Output:**
```
Platform: darwin
Architecture: arm64
CPUs: 8
Total Memory: 16.00 GB
Free Memory: 4.23 GB
Home Directory: /Users/john
Username: john
```

## Creating a Simple Program

Let's create a more complete program that demonstrates Node.js capabilities:

```javascript
// system-info.js
const os = require('os');

// Helper function to format bytes
function formatBytes(bytes) {
    const gb = bytes / (1024 * 1024 * 1024);
    return gb.toFixed(2) + ' GB';
}

// Helper function to format uptime
function formatUptime(seconds) {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${days}d ${hours}h ${minutes}m`;
}

// Display system information
console.log('='.repeat(50));
console.log('         SYSTEM INFORMATION');
console.log('='.repeat(50));
console.log();

console.log('Operating System:');
console.log(`  Platform:     ${os.platform()}`);
console.log(`  Type:         ${os.type()}`);
console.log(`  Release:      ${os.release()}`);
console.log(`  Architecture: ${os.arch()}`);
console.log();

console.log('Hardware:');
console.log(`  CPUs:         ${os.cpus().length} cores`);
console.log(`  CPU Model:    ${os.cpus()[0].model}`);
console.log(`  Total Memory: ${formatBytes(os.totalmem())}`);
console.log(`  Free Memory:  ${formatBytes(os.freemem())}`);
console.log();

console.log('User:');
console.log(`  Username:     ${os.userInfo().username}`);
console.log(`  Home Dir:     ${os.homedir()}`);
console.log();

console.log('Network:');
const networkInterfaces = os.networkInterfaces();
for (const [name, interfaces] of Object.entries(networkInterfaces)) {
    for (const iface of interfaces) {
        if (iface.family === 'IPv4' && !iface.internal) {
            console.log(`  ${name}:       ${iface.address}`);
        }
    }
}
console.log();

console.log(`System Uptime:  ${formatUptime(os.uptime())}`);
console.log('='.repeat(50));
```

Run it:

```bash
node system-info.js
```

## Project Structure Best Practices

For real projects, organize your code properly:

```
my-node-project/
├── src/                  # Source code
│   ├── index.js         # Entry point
│   ├── utils/           # Utility functions
│   └── services/        # Business logic
├── tests/               # Test files
├── config/              # Configuration files
├── node_modules/        # Dependencies (auto-generated)
├── package.json         # Project metadata
├── package-lock.json    # Dependency lock file
├── .gitignore           # Git ignore rules
└── README.md            # Project documentation
```

### Initialize a Project

```bash
# Create project directory
mkdir my-project
cd my-project

# Initialize package.json
npm init -y

# This creates package.json with defaults
```

**package.json:**

```json
{
  "name": "my-project",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "start": "node src/index.js",
    "dev": "node --watch src/index.js"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
```

## Running Node.js Scripts

### Basic Run

```bash
node script.js
```

### With Arguments

```bash
node script.js arg1 arg2 --flag=value
```

### Watch Mode (Auto-restart on changes)

```bash
# Node.js 18+
node --watch script.js

# Or using nodemon (popular alternative)
npm install -g nodemon
nodemon script.js
```

### Using npm Scripts

```json
// package.json
{
  "scripts": {
    "start": "node index.js",
    "dev": "node --watch index.js",
    "test": "node test.js"
  }
}
```

```bash
npm start
npm run dev
npm test
```

## Exercise: Build a Calculator

Create a command-line calculator:

```javascript
// calculator.js
const args = process.argv.slice(2);

// Check if we have enough arguments
if (args.length !== 3) {
    console.log('Usage: node calculator.js <num1> <operator> <num2>');
    console.log('Example: node calculator.js 10 + 5');
    console.log('Operators: + - * / %');
    process.exit(1);
}

const num1 = parseFloat(args[0]);
const operator = args[1];
const num2 = parseFloat(args[2]);

// Validate numbers
if (isNaN(num1) || isNaN(num2)) {
    console.error('Error: Please provide valid numbers');
    process.exit(1);
}

let result;

switch (operator) {
    case '+':
        result = num1 + num2;
        break;
    case '-':
        result = num1 - num2;
        break;
    case '*':
    case 'x':
        result = num1 * num2;
        break;
    case '/':
        if (num2 === 0) {
            console.error('Error: Cannot divide by zero');
            process.exit(1);
        }
        result = num1 / num2;
        break;
    case '%':
        result = num1 % num2;
        break;
    default:
        console.error(`Error: Unknown operator "${operator}"`);
        console.log('Valid operators: + - * / %');
        process.exit(1);
}

console.log(`${num1} ${operator} ${num2} = ${result}`);
```

**Test it:**

```bash
node calculator.js 10 + 5
# Output: 10 + 5 = 15

node calculator.js 20 - 8
# Output: 20 - 8 = 12

node calculator.js 6 x 7
# Output: 6 x 7 = 42

node calculator.js 100 / 4
# Output: 100 / 4 = 25
```

## Common Errors and Solutions

### Error: 'node' is not recognized

**Problem:** Node.js is not in your PATH.

**Solution:**
- Reinstall Node.js and ensure "Add to PATH" is selected
- Or manually add Node.js to your system PATH

### Error: Cannot find module

**Problem:** The module you're trying to import doesn't exist.

**Solution:**
```bash
# Install the missing package
npm install <package-name>

# Or check if the file path is correct
```

### Error: SyntaxError: Unexpected token

**Problem:** JavaScript syntax error in your code.

**Solution:**
- Check for missing brackets, parentheses, or quotes
- Ensure you're using the correct module syntax (CommonJS vs ESM)

## Summary

In this tutorial, you learned:

| Topic | What You Learned |
|-------|-----------------|
| **What is Node.js** | JavaScript runtime for server-side development |
| **Installation** | How to install and verify Node.js |
| **REPL** | Interactive JavaScript shell |
| **Global Objects** | `console`, `process`, `global`, `__dirname`, `__filename` |
| **Built-in Modules** | Preview of `os`, `fs`, `path`, `http` |
| **Project Setup** | Initialize projects with `npm init` |
| **Running Scripts** | Execute files with `node` command |

## What's Next?

In the next chapter, we'll explore [Modules](/guide/nodejs/02-modules) - how to organize your code into reusable pieces using CommonJS and ES Modules.

---

[Next: Modules →](/guide/nodejs/02-modules)
