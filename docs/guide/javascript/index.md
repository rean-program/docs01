# JavaScript Tutorial

::: info Official Documentation
This tutorial is based on MDN Web Docs. For the most up-to-date information, visit: [https://developer.mozilla.org/en-US/docs/Web/JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
:::

Welcome to the comprehensive JavaScript tutorial! This guide will take you from beginner to advanced level.

## What is JavaScript?

JavaScript is a versatile, high-level programming language primarily used for web development. It enables interactive web pages and is an essential part of web applications.

### Think of a Website Like a House

```
┌─────────────────────────────────────────────────────────────┐
│                    🏠 A WEBSITE                              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   HTML (Structure)         CSS (Style)        JAVASCRIPT    │
│   ─────────────────       ────────────       ────────────   │
│                                                             │
│   🧱 The walls,           🎨 The paint,      ⚡ The         │
│   rooms, and              wallpaper,         electricity,   │
│   foundation              and decorations    plumbing, and  │
│                                              appliances     │
│                                                             │
│   "What is on            "How it looks"     "How it works" │
│   the page"                                                 │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### What Can JavaScript Do?

| Feature | Example | What It Does |
|---------|---------|--------------|
| **User Interaction** | Button clicks, form submissions | Respond to what users do |
| **Dynamic Content** | Update text without refreshing | Change the page in real-time |
| **Animations** | Slideshows, transitions | Make things move and change |
| **Form Validation** | Check email format | Validate input before sending |
| **API Calls** | Fetch weather data | Get data from other websites |
| **Games** | Browser games | Create interactive experiences |

### Simple Example

```js
// This is JavaScript - it makes things happen!
console.log("Hello, JavaScript!");

// Change a button's text when clicked
document.querySelector("button").addEventListener("click", function() {
    this.textContent = "You clicked me!";
});
```

## Tutorial Structure

This tutorial is organized into three levels to help you learn progressively:

### 🟢 Beginner Level (Start Here!)

| Lesson | Topic | What You'll Learn |
|--------|-------|-------------------|
| [01 - Basics](/guide/javascript/01-basics) | Variables & Data Types | How to store and work with information |
| [02 - Control Flow](/guide/javascript/02-control-flow) | Conditionals & Loops | How to make decisions and repeat actions |
| [03 - Functions](/guide/javascript/03-functions) | Functions & Scope | How to create reusable code blocks |

### 🟡 Intermediate Level

| Lesson | Topic | What You'll Learn |
|--------|-------|-------------------|
| [04 - Arrays](/guide/javascript/04-arrays) | Arrays & Methods | How to work with lists of data |
| [05 - Objects](/guide/javascript/05-objects) | Objects & Methods | How to organize related data |
| [06 - DOM](/guide/javascript/06-dom) | DOM Manipulation | How to change web pages with JavaScript |

### 🔴 Advanced Level

| Lesson | Topic | What You'll Learn |
|--------|-------|-------------------|
| [07 - Async](/guide/javascript/07-async) | Async Programming | How to handle operations that take time |
| [08 - ES6+](/guide/javascript/08-es6) | Modern Features | New JavaScript features (ES6 and beyond) |
| [09 - OOP](/guide/javascript/09-oop) | Object-Oriented | How to structure larger programs |
| [10 - Advanced](/guide/javascript/10-advanced) | Design Patterns | Best practices and advanced techniques |

## Prerequisites

Before starting, you should have:

| Requirement | Why You Need It |
|-------------|-----------------|
| Basic HTML knowledge | JavaScript manipulates HTML elements |
| Basic CSS understanding | Helps with styling changes |
| Code editor (VS Code) | Where you'll write your code |
| Web browser | Where you'll run and test your code |

## Getting Started

You can run JavaScript in several ways:

### Method 1: Browser Console (Easiest!)

The fastest way to try JavaScript:

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Open any web page in your browser                        │
│ 2. Press F12 (or right-click → "Inspect")                   │
│ 3. Click the "Console" tab                                  │
│ 4. Type JavaScript and press Enter!                         │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ > console.log("Hello!")                                 │ │
│ │ Hello!                                                  │ │
│ │ > 2 + 2                                                 │ │
│ │ 4                                                       │ │
│ │ > _                                                     │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Method 2: HTML File

Create an HTML file with embedded JavaScript:

```html
<!DOCTYPE html>
<html>
<head>
    <title>My JavaScript Page</title>
</head>
<body>
    <h1>Hello World</h1>
    <button id="myButton">Click Me</button>

    <!-- JavaScript goes here, at the end of body -->
    <script>
        console.log("Hello from HTML!");

        // Make the button interactive
        document.getElementById("myButton").onclick = function() {
            alert("Button clicked!");
        };
    </script>
</body>
</html>
```

### Method 3: External JavaScript File

For larger projects, keep JavaScript in separate files:

```html
<!-- index.html -->
<!DOCTYPE html>
<html>
<head>
    <title>My App</title>
</head>
<body>
    <h1>My App</h1>

    <!-- Link to external JavaScript file -->
    <script src="script.js"></script>
</body>
</html>
```

```js
// script.js
console.log("Hello from external file!");
```

### Method 4: Node.js (Server-Side)

Run JavaScript outside the browser:

```bash
# Install Node.js from nodejs.org, then:
node script.js
```

## Your First JavaScript Program

Let's write a simple program step by step:

```js
// Step 1: Store some data
const name = "Alice";
const age = 25;

// Step 2: Make a decision
if (age >= 18) {
    console.log(name + " is an adult");
} else {
    console.log(name + " is a minor");
}

// Step 3: Create a reusable function
function greet(personName) {
    return "Hello, " + personName + "!";
}

// Step 4: Use the function
console.log(greet(name));  // Output: Hello, Alice!
```

## Quick Reference

### Variables

```js
const name = "John";    // Cannot be changed (use by default)
let age = 25;           // Can be changed
var oldWay = "avoid";   // Old way (don't use)
```

### Data Types

```js
"Hello"          // String (text)
42               // Number
true / false     // Boolean
null             // Intentionally empty
undefined        // Not yet defined
{ key: "value" } // Object
[1, 2, 3]        // Array
```

### Common Operations

```js
// Output
console.log("Message");

// Math
let sum = 5 + 3;      // 8
let product = 4 * 2;  // 8

// Conditions
if (condition) {
    // do something
}

// Loops
for (let i = 0; i < 5; i++) {
    console.log(i);
}

// Functions
function doSomething(param) {
    return param * 2;
}
```

## Tips for Learning

::: tip 💡 Practice Tips
1. **Type the code yourself** - Don't just copy and paste
2. **Experiment** - Change values and see what happens
3. **Use console.log()** - Print values to understand what's happening
4. **Make mistakes** - Errors teach you how things work
5. **Build small projects** - Apply what you learn
:::

::: warning ⚠️ Common Beginner Mistakes
- Forgetting semicolons (`;`) at the end of statements
- Using `=` (assignment) instead of `===` (comparison)
- Forgetting to declare variables with `const` or `let`
- Misspelling variable names (JavaScript is case-sensitive!)
- Forgetting curly braces `{}` around code blocks
:::

## Video Tutorials

::: tip Recommended Video Resources
Learn JavaScript through these excellent video tutorials from the community.
:::

### Free Courses

| Course | Creator | Description |
|--------|---------|-------------|
| [JavaScript Full Course](https://www.youtube.com/watch?v=PkZNo7MFNFg) | freeCodeCamp | 3+ hour comprehensive course |
| [JavaScript Crash Course](https://www.youtube.com/watch?v=hdI2bqOjy3c) | Traversy Media | 1.5-hour beginner crash course |
| [Modern JavaScript Tutorial](https://www.youtube.com/watch?v=W6NZfCO5SIk) | Programming with Mosh | 1-hour ES6+ tutorial |
| [JavaScript in 100 Seconds](https://www.youtube.com/watch?v=DHjqpvDnNGE) | Fireship | Quick 100-second explanation |

### Official Resources

| Resource | Description |
|----------|-------------|
| [MDN JavaScript Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide) | Mozilla's official JavaScript guide |
| [JavaScript.info](https://javascript.info/) | Modern JavaScript tutorial |

### Topic-Specific Videos

| Topic | Video | Duration |
|-------|-------|----------|
| Async/Await | [Async JavaScript](https://www.youtube.com/watch?v=PoRJizFvM7s) | ~25 min |
| DOM Manipulation | [DOM Tutorial](https://www.youtube.com/watch?v=y17RuWkWdn8) | ~20 min |
| ES6 Features | [ES6 Tutorial](https://www.youtube.com/watch?v=nZ1DMMsyVyI) | ~30 min |
| Array Methods | [Array Methods](https://www.youtube.com/watch?v=rRgD1yVwIvE) | ~35 min |

## Let's Begin!

Ready to start coding? Head to the first lesson:

**[→ Start with JavaScript Basics](/guide/javascript/01-basics)**

---

::: info 📚 Learning Path
**Total Lessons:** 10 | **Estimated Time:** Self-paced | **Difficulty:** Beginner to Advanced

After completing this tutorial, you'll be able to:
- Write JavaScript programs from scratch
- Manipulate web pages dynamically
- Handle user interactions
- Work with data from APIs
- Build interactive web applications
:::
