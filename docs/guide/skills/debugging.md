# Debugging Basics

Debugging is the process of finding and fixing errors in your code. It's an essential skill for every developer. This guide covers practical debugging techniques for web development.

## Types of Errors

### Syntax Errors

Code that doesn't follow language rules—usually caught immediately.

```javascript
// ❌ Syntax error: missing closing parenthesis
console.log("Hello"

// ❌ Syntax error: unexpected token
const obj = { name: "John", }  // trailing comma (older browsers)

// ✅ Correct
console.log("Hello");
const obj = { name: "John" };
```

### Runtime Errors

Errors that occur when code runs.

```javascript
// ❌ Runtime error: undefined variable
console.log(userName);  // ReferenceError: userName is not defined

// ❌ Runtime error: calling method on null
const element = document.querySelector('.missing');
element.classList.add('active');  // TypeError: Cannot read property 'classList' of null

// ✅ Safe version
const element = document.querySelector('.missing');
if (element) {
    element.classList.add('active');
}
```

### Logical Errors

Code runs without errors but produces wrong results.

```javascript
// ❌ Logical error: wrong comparison
function isAdult(age) {
    return age > 18;  // Bug: 18-year-olds are adults!
}

// ✅ Correct logic
function isAdult(age) {
    return age >= 18;
}
```

## Console Methods

The console is your primary debugging tool.

### Basic Logging

```javascript
// Simple log
console.log('Debug message');

// Log multiple values
console.log('Name:', name, 'Age:', age);

// Log objects (expandable in console)
console.log({ name, age, email });

// Styled logs
console.log('%cImportant!', 'color: red; font-size: 20px;');
```

### Log Levels

```javascript
// Informational
console.info('Application started');

// Warnings
console.warn('Deprecated function used');

// Errors
console.error('Failed to load data');

// Debug (may be hidden by default)
console.debug('Detailed debug info');
```

### Advanced Console Methods

```javascript
// Tables for arrays/objects
const users = [
    { name: 'Alice', age: 25 },
    { name: 'Bob', age: 30 }
];
console.table(users);

// Grouping related logs
console.group('User Data');
console.log('Name:', user.name);
console.log('Email:', user.email);
console.groupEnd();

// Collapsed group
console.groupCollapsed('Details');
console.log('Hidden by default');
console.groupEnd();

// Timing operations
console.time('dataLoad');
await loadData();
console.timeEnd('dataLoad');  // dataLoad: 523.456ms

// Count occurrences
function handleClick() {
    console.count('clicked');  // clicked: 1, clicked: 2, ...
}

// Assert (logs only if condition is false)
console.assert(age >= 18, 'User is not an adult');

// Stack trace
console.trace('How did we get here?');
```

## Debugging with Breakpoints

Breakpoints pause code execution for inspection.

### Setting Breakpoints

1. Open DevTools (`F12`)
2. Go to Sources panel
3. Find your JavaScript file
4. Click line number to add breakpoint

### Types of Breakpoints

| Type | Purpose |
|------|---------|
| Line breakpoint | Pause at specific line |
| Conditional | Pause only when condition is true |
| DOM breakpoint | Pause when DOM changes |
| XHR breakpoint | Pause on network requests |
| Event listener | Pause on specific events |

### Debugger Statement

```javascript
function calculateTotal(items) {
    let total = 0;

    debugger;  // Execution pauses here when DevTools is open

    for (const item of items) {
        total += item.price;
    }

    return total;
}
```

### Stepping Through Code

When paused at a breakpoint:

| Button | Action | Use When |
|--------|--------|----------|
| Resume (F8) | Continue execution | Done inspecting |
| Step Over (F10) | Execute current line | Don't need to see function internals |
| Step Into (F11) | Enter function call | Want to see function execution |
| Step Out (Shift+F11) | Exit current function | Done with current function |

### Watching Variables

In the Sources panel while paused:
- **Scope**: View all variables in current scope
- **Watch**: Add expressions to monitor
- **Call Stack**: See function call hierarchy

## Common Debugging Patterns

### Binary Search Debugging

Narrow down the problem location:

```javascript
function processData(data) {
    // Step 1: Is data received correctly?
    console.log('Input data:', data);

    const processed = transform(data);

    // Step 2: Is transformation correct?
    console.log('After transform:', processed);

    const filtered = filter(processed);

    // Step 3: Is filtering correct?
    console.log('After filter:', filtered);

    return format(filtered);
}
```

### Isolating the Problem

```javascript
// Test individual parts
const result1 = functionA(input);
console.log('A:', result1);

const result2 = functionB(result1);
console.log('B:', result2);

const result3 = functionC(result2);
console.log('C:', result3);  // Bug appears here!
```

### Rubber Duck Debugging

Explain your code line by line to find issues:
1. Describe what each line should do
2. Compare expected vs actual behavior
3. The discrepancy reveals the bug

## Debugging HTML/CSS

### Inspecting Elements

1. Right-click element → Inspect
2. View and edit HTML in Elements panel
3. Modify CSS in Styles panel
4. Changes are live (not saved)

### Common CSS Issues

```css
/* Check if style is being applied */
/* Look for strikethrough in DevTools = overridden */

/* Issue: Specificity conflicts */
.button { color: blue; }        /* Specificity: 0,1,0 */
#nav .button { color: red; }    /* Specificity: 1,1,0 - wins! */

/* Issue: Missing units */
.box {
    width: 100;    /* ❌ Missing unit */
    width: 100px;  /* ✅ Correct */
}

/* Issue: Typos */
.box {
    backgorund: red;   /* ❌ Typo */
    background: red;   /* ✅ Correct */
}
```

### Layout Debugging

```css
/* Temporarily visualize all elements */
* {
    outline: 1px solid red !important;
}

/* Or specific elements */
.debug {
    background: rgba(255, 0, 0, 0.1);
    border: 1px dashed red;
}
```

## Debugging Network Issues

### Network Panel Essentials

1. Open DevTools → Network tab
2. Refresh page to see requests
3. Click request for details

### What to Check

| Tab | Shows |
|-----|-------|
| Headers | Request/response headers, status code |
| Preview | Formatted response (JSON, HTML) |
| Response | Raw response data |
| Timing | Request timing breakdown |

### Common Issues

```javascript
// Issue: Wrong URL
fetch('/api/user')   // ❌ Might need full path
fetch('https://api.example.com/user')  // ✅ Or check base URL

// Issue: CORS errors
// Check console for "Access-Control-Allow-Origin" errors
// Solution: Configure server or use proxy

// Issue: Incorrect Content-Type
fetch('/api/data', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'  // Required for JSON
    },
    body: JSON.stringify(data)
});
```

## Error Handling

### Try-Catch Blocks

```javascript
async function fetchUser(id) {
    try {
        const response = await fetch(`/api/users/${id}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const user = await response.json();
        return user;

    } catch (error) {
        console.error('Failed to fetch user:', error.message);
        // Handle error appropriately
        return null;
    }
}
```

### Global Error Handling

```javascript
// Catch unhandled errors
window.onerror = function(message, source, line, column, error) {
    console.error('Global error:', { message, source, line, column });
    // Send to error tracking service
    return true;  // Prevents default browser error handling
};

// Catch unhandled promise rejections
window.onunhandledrejection = function(event) {
    console.error('Unhandled rejection:', event.reason);
};
```

## Debugging Tips

### 1. Reproduce Consistently
- Document exact steps to trigger the bug
- Identify if it's intermittent or consistent

### 2. Check the Obvious First
- Is the file saved?
- Is the cache cleared?
- Is the correct file being loaded?
- Are there typos?

### 3. Read Error Messages Carefully
```
TypeError: Cannot read property 'name' of undefined
    at getUserName (app.js:42)
    at handleClick (app.js:28)
```
- Error type: `TypeError`
- What failed: Reading `name` from `undefined`
- Location: `app.js` line 42

### 4. Use Version Control
```bash
# Find when bug was introduced
git bisect start
git bisect bad          # Current version has bug
git bisect good v1.0    # v1.0 was working
# Git helps find the problematic commit
```

### 5. Take Breaks
- Fresh eyes catch bugs faster
- Walk away and return later
- Explain the problem to someone else

## Debugging Checklist

- [ ] Read the error message completely
- [ ] Check browser console for errors
- [ ] Verify code is saved and loaded
- [ ] Clear cache and hard refresh
- [ ] Add console.log at key points
- [ ] Use breakpoints for complex issues
- [ ] Check network requests
- [ ] Inspect element styles
- [ ] Test in different browsers
- [ ] Simplify to minimal reproduction

## Summary

- Use console methods for quick debugging
- Master breakpoints for complex issues
- Inspect Elements and Network panels
- Read error messages carefully
- Isolate problems systematically
- Handle errors gracefully in production

## What's Next?

You now have the foundational knowledge to start building websites. Begin with the [HTML Tutorial](/guide/html/) to learn how to structure web pages.
