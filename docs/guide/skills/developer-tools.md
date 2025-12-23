# Developer Tools

Browser Developer Tools (DevTools) are essential for web development. They allow you to inspect, debug, and optimize your websites in real-time.

## Opening DevTools

| Browser | Windows/Linux | Mac |
|---------|---------------|-----|
| Chrome | `F12` or `Ctrl+Shift+I` | `Cmd+Option+I` |
| Firefox | `F12` or `Ctrl+Shift+I` | `Cmd+Option+I` |
| Safari | - | `Cmd+Option+I` (enable in Preferences first) |
| Edge | `F12` or `Ctrl+Shift+I` | `Cmd+Option+I` |

## Essential Panels

### Elements Panel

Inspect and modify HTML and CSS in real-time.

**Key Features:**
- View the DOM tree structure
- Edit HTML directly
- Modify CSS styles live
- See computed styles
- Check box model dimensions

**How to Use:**
1. Right-click any element on the page
2. Select "Inspect" or "Inspect Element"
3. The Elements panel opens with that element highlighted

```html
<!-- You can edit this live in DevTools -->
<div class="card">
  <h2>Edit me!</h2>
  <p>Change styles in real-time</p>
</div>
```

### Console Panel

Execute JavaScript and view logs, errors, and warnings.

**Common Uses:**
```javascript
// Log messages
console.log('Hello, DevTools!');

// Log objects (expandable)
console.log({ name: 'John', age: 30 });

// Display tables
console.table([
  { name: 'Alice', score: 95 },
  { name: 'Bob', score: 87 }
]);

// Warnings and errors
console.warn('This is a warning');
console.error('This is an error');

// Timing operations
console.time('loop');
for (let i = 0; i < 1000000; i++) {}
console.timeEnd('loop');
```

### Network Panel

Monitor all network requests made by the page.

**What You Can See:**
- All HTTP requests (HTML, CSS, JS, images, APIs)
- Request and response headers
- Response data
- Load times and sizes
- Waterfall timing chart

**Useful Filters:**
| Filter | Purpose |
|--------|---------|
| XHR | API calls only |
| JS | JavaScript files |
| CSS | Stylesheets |
| Img | Images |
| Doc | HTML documents |

### Sources Panel

Debug JavaScript with breakpoints and step-through execution.

**Debugging Steps:**
1. Open Sources panel
2. Find your JavaScript file
3. Click line number to set a breakpoint
4. Refresh the page
5. Execution pauses at breakpoint
6. Use controls to step through code

**Debugging Controls:**
| Button | Action |
|--------|--------|
| ▶️ Resume | Continue execution |
| ⤵️ Step Over | Execute current line |
| ⬇️ Step Into | Enter function call |
| ⬆️ Step Out | Exit current function |

### Application Panel

Inspect storage, caches, and service workers.

**Storage Types:**
- **Local Storage** - Persistent key-value storage
- **Session Storage** - Cleared when tab closes
- **Cookies** - Server-accessible data
- **IndexedDB** - Large structured data storage

```javascript
// Local Storage example
localStorage.setItem('theme', 'dark');
console.log(localStorage.getItem('theme')); // 'dark'

// Session Storage example
sessionStorage.setItem('tempData', 'value');
```

### Performance Panel

Analyze page load and runtime performance.

**What It Measures:**
- Page load timeline
- JavaScript execution time
- Layout and paint operations
- Memory usage

### Lighthouse Panel

Audit your page for performance, accessibility, SEO, and best practices.

**Categories:**
- Performance (0-100 score)
- Accessibility (0-100 score)
- Best Practices (0-100 score)
- SEO (0-100 score)
- Progressive Web App

## Useful DevTools Features

### Device Mode (Responsive Design)

Test how your site looks on different devices:
1. Click the device toolbar icon (or `Ctrl+Shift+M`)
2. Select a device preset or enter custom dimensions
3. Test touch events and mobile features

### Color Picker

Click any color value in CSS to open the color picker:
- Pick colors from the page
- Switch between formats (hex, rgb, hsl)
- Access color palettes

### CSS Changes Tracking

1. Make CSS changes in Elements panel
2. Go to **Changes** tab
3. See all modifications you've made
4. Copy changes to your source files

### Snippets

Save and run JavaScript snippets:
1. Go to Sources → Snippets
2. Create new snippet
3. Write reusable code
4. Run with `Ctrl+Enter`

```javascript
// Example snippet: Clear all console logs
console.clear();
document.querySelectorAll('*').forEach(el => {
  el.style.outline = '1px solid red';
});
```

## DevTools Shortcuts

### General
| Shortcut | Action |
|----------|--------|
| `Ctrl+Shift+C` | Select element mode |
| `Ctrl+Shift+P` | Command menu |
| `Ctrl+F` | Search in current panel |
| `Ctrl+Shift+F` | Search across all sources |
| `Esc` | Toggle console drawer |

### Console
| Shortcut | Action |
|----------|--------|
| `Ctrl+L` | Clear console |
| `↑` / `↓` | Previous/next command |
| `Tab` | Autocomplete |

### Elements
| Shortcut | Action |
|----------|--------|
| `↑` / `↓` | Navigate DOM tree |
| `Enter` | Edit attribute |
| `H` | Hide element |
| `Delete` | Delete element |

## Tips and Tricks

### 1. Copy as cURL
Right-click any network request → "Copy as cURL" to replicate in terminal.

### 2. Screenshot Element
Right-click element in DOM → "Capture node screenshot"

### 3. Force Element State
Right-click element → "Force state" → Select `:hover`, `:active`, etc.

### 4. Console Shortcuts
```javascript
// Select element (like querySelector)
$('header')

// Select all elements (like querySelectorAll)
$$('.card')

// Reference last selected element
$0

// Copy any value to clipboard
copy($0.innerHTML)
```

### 5. Preserve Console Logs
Check "Preserve log" to keep console output across page reloads.

## Summary

- DevTools are built into every modern browser
- Elements panel for HTML/CSS inspection
- Console for JavaScript debugging and logging
- Network panel for monitoring requests
- Sources panel for debugging with breakpoints
- Performance and Lighthouse for optimization

## Next Steps

Learn about [Version Control with Git](/guide/skills/version-control) to manage your code effectively.
