# Browser Compatibility

Different browsers can render websites differently. Understanding browser compatibility helps ensure your site works for all users.

## Major Browsers

| Browser | Engine | Market Share |
|---------|--------|--------------|
| Chrome | Blink | ~65% |
| Safari | WebKit | ~18% |
| Firefox | Gecko | ~3% |
| Edge | Blink | ~5% |
| Samsung Internet | Blink | ~2% |

## Checking Browser Support

### Can I Use

[caniuse.com](https://caniuse.com) - The essential resource for browser support.

```
Example: Search "CSS Grid"
- Chrome: Full support since v57
- Safari: Full support since v10.1
- Firefox: Full support since v52
- Edge: Full support since v16
```

### MDN Web Docs

[developer.mozilla.org](https://developer.mozilla.org) - Comprehensive documentation with browser compatibility tables.

## CSS Compatibility

### Feature Queries

Test if a browser supports a CSS feature:

```css
/* Default styles (fallback) */
.container {
    display: block;
}

/* If browser supports grid */
@supports (display: grid) {
    .container {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
    }
}

/* Multiple conditions */
@supports (display: grid) and (gap: 1rem) {
    .container {
        display: grid;
        gap: 1rem;
    }
}

/* Negation */
@supports not (display: grid) {
    .container {
        display: flex;
        flex-wrap: wrap;
    }
}
```

### Vendor Prefixes

Some CSS properties need prefixes for older browsers:

```css
.box {
    /* Vendor prefixes (older browsers) */
    -webkit-transform: rotate(45deg);  /* Chrome, Safari, newer Opera */
    -moz-transform: rotate(45deg);     /* Firefox */
    -ms-transform: rotate(45deg);      /* IE */
    -o-transform: rotate(45deg);       /* Old Opera */

    /* Standard property (always last) */
    transform: rotate(45deg);
}
```

### Autoprefixer

Use build tools to add prefixes automatically:

```javascript
// postcss.config.js
module.exports = {
    plugins: [
        require('autoprefixer')
    ]
}
```

```json
// package.json - browserslist
{
    "browserslist": [
        "> 1%",
        "last 2 versions",
        "not dead"
    ]
}
```

### CSS Fallbacks

```css
/* Color fallbacks */
.button {
    background-color: #3498db;           /* Fallback */
    background-color: oklch(60% 0.15 250); /* Modern */
}

/* Layout fallbacks */
.container {
    display: flex;        /* Fallback for older browsers */
    display: grid;        /* Modern browsers will use this */
}

/* Font fallbacks */
body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont,
                 'Segoe UI', Roboto, sans-serif;
}
```

## JavaScript Compatibility

### Feature Detection

```javascript
// Check if feature exists
if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(success, error);
} else {
    console.log('Geolocation not supported');
}

// Check for API support
if ('fetch' in window) {
    fetch('/api/data');
} else {
    // Use XMLHttpRequest fallback
}

// Check for method support
if (Array.prototype.includes) {
    // Safe to use .includes()
}

// Check for CSS support in JS
if (CSS.supports('display', 'grid')) {
    // Grid is supported
}
```

### Polyfills

Add missing features to older browsers:

```html
<!-- Load polyfills conditionally -->
<script src="https://polyfill.io/v3/polyfill.min.js?features=fetch,Promise,Array.prototype.includes"></script>
```

```javascript
// Or include specific polyfills
import 'core-js/stable';
import 'regenerator-runtime/runtime';
```

### Babel

Transpile modern JavaScript to older syntax:

```javascript
// babel.config.js
module.exports = {
    presets: [
        ['@babel/preset-env', {
            targets: '> 0.25%, not dead',
            useBuiltIns: 'usage',
            corejs: 3
        }]
    ]
};
```

**Before (ES6+):**
```javascript
const greet = (name) => `Hello, ${name}!`;
const numbers = [1, 2, 3];
const doubled = numbers.map(n => n * 2);
```

**After (ES5):**
```javascript
var greet = function(name) {
    return 'Hello, ' + name + '!';
};
var numbers = [1, 2, 3];
var doubled = numbers.map(function(n) {
    return n * 2;
});
```

## HTML Compatibility

### Semantic Element Fallbacks

```html
<!-- HTML5 Shiv for IE8 and below -->
<!--[if lt IE 9]>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/html5shiv/3.7.3/html5shiv.min.js"></script>
<![endif]-->
```

### Input Type Fallbacks

```html
<!-- Falls back to text input if not supported -->
<input type="date" placeholder="YYYY-MM-DD">
<input type="color" value="#000000">
<input type="range" min="0" max="100">
```

```javascript
// Check input type support
const input = document.createElement('input');
input.type = 'date';
const dateSupported = input.type === 'date';

if (!dateSupported) {
    // Use a date picker library
}
```

## Testing Strategies

### Browser Testing Tools

| Tool | Purpose |
|------|---------|
| BrowserStack | Real device testing |
| LambdaTest | Cross-browser testing |
| Sauce Labs | Automated testing |
| Browserling | Quick manual testing |

### Local Testing

```bash
# Install multiple browsers for testing
# Chrome, Firefox, Safari, Edge

# Use browser developer tools
# Chrome: F12 → Device Toolbar
# Firefox: F12 → Responsive Design Mode
```

### Virtual Machines

- Windows VMs for Edge/IE testing on Mac/Linux
- Microsoft provides free VMs for testing

## Common Compatibility Issues

### Flexbox Gaps

```css
/* gap not supported in older Safari */
.flex-container {
    display: flex;
    gap: 1rem; /* May not work in Safari < 14.1 */
}

/* Fallback using margin */
.flex-container {
    display: flex;
    margin: -0.5rem;
}

.flex-container > * {
    margin: 0.5rem;
}
```

### CSS Grid in IE11

```css
/* Modern Grid */
.grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
}

/* IE11 Grid (limited support) */
.grid {
    display: -ms-grid;
    -ms-grid-columns: 1fr 1rem 1fr 1rem 1fr;
}

.grid > *:nth-child(1) { -ms-grid-column: 1; }
.grid > *:nth-child(2) { -ms-grid-column: 3; }
.grid > *:nth-child(3) { -ms-grid-column: 5; }
```

### Smooth Scrolling

```css
/* Not supported in all browsers */
html {
    scroll-behavior: smooth;
}
```

```javascript
// JavaScript fallback
function smoothScroll(target) {
    if ('scrollBehavior' in document.documentElement.style) {
        window.scrollTo({ top: target, behavior: 'smooth' });
    } else {
        window.scrollTo(0, target);
    }
}
```

### Object-fit

```css
.image-container img {
    width: 100%;
    height: 300px;
    object-fit: cover; /* Not in IE11 */
}

/* IE11 fallback using background */
.image-container {
    background-size: cover;
    background-position: center;
}
```

## Progressive Enhancement

Build a baseline that works everywhere, then enhance:

```html
<!-- Works without JavaScript -->
<a href="/page" class="js-ajax-link">View Page</a>
```

```javascript
// Enhance with JavaScript if available
if ('fetch' in window) {
    document.querySelectorAll('.js-ajax-link').forEach(link => {
        link.addEventListener('click', async (e) => {
            e.preventDefault();
            const content = await fetch(link.href).then(r => r.text());
            document.getElementById('content').innerHTML = content;
        });
    });
}
```

## Graceful Degradation

Start with full features, ensure basics work without them:

```css
/* Full experience */
.hero {
    background: linear-gradient(to right, #667eea, #764ba2);
}

/* Fallback for no gradient support */
.hero {
    background-color: #667eea; /* Solid color fallback */
    background: linear-gradient(to right, #667eea, #764ba2);
}
```

## Browserslist Configuration

Define target browsers for your build tools:

```json
// package.json
{
    "browserslist": [
        "defaults",
        "not IE 11",
        "maintained node versions"
    ]
}
```

```
// .browserslistrc file
> 0.5%
last 2 versions
Firefox ESR
not dead
not IE 11
```

**Common Queries:**
| Query | Meaning |
|-------|---------|
| `defaults` | Reasonable default |
| `> 1%` | More than 1% market share |
| `last 2 versions` | Last 2 versions of each browser |
| `not dead` | Browsers with official support |
| `not IE 11` | Exclude IE11 |

## Summary

- Check browser support on caniuse.com
- Use feature queries (`@supports`) for CSS
- Use feature detection for JavaScript
- Add polyfills for missing features
- Use Babel for JavaScript compatibility
- Use Autoprefixer for CSS prefixes
- Test on multiple browsers
- Practice progressive enhancement

## Next Steps

Learn about [SEO Basics](/guide/best-practices/seo-basics) to make your compatible site discoverable.
