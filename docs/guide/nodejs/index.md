# Node.js Tutorial

::: info Official Documentation
This tutorial is based on the official Node.js documentation. For the most up-to-date information, visit: [https://nodejs.org/docs/](https://nodejs.org/docs/)
:::

Welcome to the Node.js tutorial! Learn how to build powerful server-side applications with JavaScript.

## What is Node.js?

Node.js is a **JavaScript runtime** built on Chrome's V8 JavaScript engine. It allows you to run JavaScript on the server-side, outside of a web browser.

```
┌─────────────────────────────────────────────────────────────┐
│                    Traditional Web Development               │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   Browser                         Server                    │
│   ┌─────────────┐                ┌─────────────┐           │
│   │ JavaScript  │                │ PHP/Python/ │           │
│   │ (Frontend)  │  ──────────►   │ Ruby/Java   │           │
│   └─────────────┘                └─────────────┘           │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                    With Node.js                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   Browser                         Server                    │
│   ┌─────────────┐                ┌─────────────┐           │
│   │ JavaScript  │                │ JavaScript  │           │
│   │ (Frontend)  │  ──────────►   │ (Node.js)   │           │
│   └─────────────┘                └─────────────┘           │
│                                                             │
│   Same language everywhere! 🎉                              │
└─────────────────────────────────────────────────────────────┘
```

## Why Learn Node.js?

| Feature | Description |
|---------|-------------|
| **JavaScript Everywhere** | Use the same language for frontend and backend |
| **Non-blocking I/O** | Handle thousands of concurrent connections efficiently |
| **NPM Ecosystem** | Access to millions of open-source packages |
| **Fast Performance** | Powered by V8 engine, same as Chrome |
| **Large Community** | Extensive resources, tutorials, and support |
| **Industry Adoption** | Used by Netflix, PayPal, LinkedIn, Walmart |

## What You'll Learn

### Beginner
- [Getting Started](/guide/nodejs/01-introduction) - Install Node.js and write your first program
- [Modules](/guide/nodejs/02-modules) - CommonJS and ES Modules
- [File System](/guide/nodejs/03-file-system) - Read, write, and manage files

### Intermediate
- [Async Programming](/guide/nodejs/04-async) - Callbacks, Promises, async/await
- [Events](/guide/nodejs/05-events) - Event-driven architecture
- [Streams](/guide/nodejs/06-streams) - Handle large data efficiently

### Advanced
- [HTTP Module](/guide/nodejs/07-http) - Build web servers from scratch
- [NPM & Packages](/guide/nodejs/08-npm) - Package management
- [Debugging](/guide/nodejs/09-debugging) - Debug like a pro
- [Advanced Topics](/guide/nodejs/10-advanced) - Performance, security, clustering

## Prerequisites

Before starting this tutorial, you should have:

- ✅ Basic understanding of JavaScript
- ✅ Familiarity with command line/terminal
- ✅ A code editor (VS Code recommended)

::: tip New to JavaScript?
Check out our [JavaScript Tutorial](/guide/javascript/) first!
:::

## Quick Start

```javascript
// hello.js - Your first Node.js program
console.log('Hello, Node.js!')

// Run it with: node hello.js
```

```bash
# Check if Node.js is installed
node --version

# Run your first program
node hello.js
# Output: Hello, Node.js!
```

## Node.js vs Browser JavaScript

| Feature | Browser | Node.js |
|---------|---------|---------|
| DOM Access | ✅ Yes | ❌ No |
| `window` object | ✅ Yes | ❌ No |
| `document` object | ✅ Yes | ❌ No |
| File System | ❌ No | ✅ Yes |
| `process` object | ❌ No | ✅ Yes |
| `require`/`import` | Limited | ✅ Full support |
| Network access | Limited | ✅ Full access |

## Video Tutorials

::: tip Recommended Video Resources
Learn Node.js through these excellent video tutorials from the community.
:::

### Free Courses

| Course | Creator | Description |
|--------|---------|-------------|
| [Node.js Full Course](https://www.youtube.com/watch?v=Oe421EPjeBE) | freeCodeCamp | 8-hour comprehensive course |
| [Node.js Crash Course](https://www.youtube.com/watch?v=fBNz5xF-Kx4) | Traversy Media | 1.5-hour beginner crash course |
| [Node.js Tutorial for Beginners](https://www.youtube.com/watch?v=TlB_eWDSMt4) | Programming with Mosh | 1-hour beginner tutorial |
| [Node.js in 100 Seconds](https://www.youtube.com/watch?v=ENrzD9HAZK4) | Fireship | Quick 100-second explanation |

### Official Resources

| Resource | Description |
|----------|-------------|
| [Node.js Learn](https://nodejs.org/en/learn) | Official Node.js learning resources |
| [Node.js Guides](https://nodejs.org/en/docs/guides) | Official guides and documentation |

### Topic-Specific Videos

| Topic | Video | Duration |
|-------|-------|----------|
| Async Programming | [Node.js Async](https://www.youtube.com/watch?v=PoRJizFvM7s) | ~25 min |
| File System | [Node.js File System](https://www.youtube.com/watch?v=U57kU311-nE) | ~20 min |
| Streams | [Node.js Streams](https://www.youtube.com/watch?v=GlybFFMXXmQ) | ~30 min |
| REST API | [Build REST API](https://www.youtube.com/watch?v=pKd0Rpw7O48) | ~1 hour |

## Let's Begin!

Ready to start? Head over to the [Getting Started](/guide/nodejs/01-introduction) guide!

---

[Get Started →](/guide/nodejs/01-introduction)
