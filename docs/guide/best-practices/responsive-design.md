# Responsive Design

Responsive design ensures your website looks great and functions well on all devices, from mobile phones to large desktop monitors.

## Why Responsive Design?

- **Mobile traffic**: Over 50% of web traffic is mobile
- **User experience**: One site works everywhere
- **SEO benefits**: Google prioritizes mobile-friendly sites
- **Cost effective**: Maintain one codebase

## The Viewport Meta Tag

Essential for responsive design. Add to every HTML page:

```html
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
```

| Attribute | Purpose |
|-----------|---------|
| `width=device-width` | Match screen width |
| `initial-scale=1.0` | No initial zoom |
| `maximum-scale=1.0` | Prevent zooming (not recommended) |
| `user-scalable=no` | Disable zoom (accessibility issue) |

## Mobile-First Approach

Start designing for mobile, then enhance for larger screens.

```css
/* Mobile styles (default) */
.container {
    padding: 1rem;
    font-size: 16px;
}

/* Tablet and up */
@media (min-width: 768px) {
    .container {
        padding: 2rem;
        font-size: 18px;
    }
}

/* Desktop and up */
@media (min-width: 1024px) {
    .container {
        max-width: 1200px;
        margin: 0 auto;
    }
}
```

## Media Queries

### Syntax

```css
@media media-type and (condition) {
    /* Styles */
}
```

### Common Breakpoints

```css
/* Mobile phones */
@media (max-width: 767px) { }

/* Tablets */
@media (min-width: 768px) and (max-width: 1023px) { }

/* Desktops */
@media (min-width: 1024px) { }

/* Large screens */
@media (min-width: 1440px) { }
```

### Popular Breakpoint Systems

| Device | Bootstrap | Tailwind |
|--------|-----------|----------|
| Mobile | < 576px | < 640px |
| Small | ≥ 576px | ≥ 640px |
| Medium | ≥ 768px | ≥ 768px |
| Large | ≥ 992px | ≥ 1024px |
| XL | ≥ 1200px | ≥ 1280px |
| 2XL | ≥ 1400px | ≥ 1536px |

### Other Media Features

```css
/* Orientation */
@media (orientation: landscape) { }
@media (orientation: portrait) { }

/* Hover capability */
@media (hover: hover) {
    /* Device supports hover (mouse) */
    .button:hover { background: blue; }
}

/* Reduced motion preference */
@media (prefers-reduced-motion: reduce) {
    * { animation: none !important; }
}

/* Dark mode preference */
@media (prefers-color-scheme: dark) {
    body { background: #1a1a1a; color: #fff; }
}

/* Print styles */
@media print {
    .no-print { display: none; }
}
```

## Flexible Layouts

### Percentage Widths

```css
.sidebar {
    width: 30%;
}

.main-content {
    width: 70%;
}
```

### Max and Min Width

```css
.container {
    width: 100%;
    max-width: 1200px;  /* Never exceeds 1200px */
    min-width: 320px;   /* Never smaller than 320px */
}

img {
    max-width: 100%;    /* Never overflow container */
    height: auto;       /* Maintain aspect ratio */
}
```

### Flexbox for Responsive Layouts

```css
.card-container {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
}

.card {
    flex: 1 1 300px;  /* Grow, shrink, min 300px */
}
```

### CSS Grid for Responsive Layouts

```css
/* Auto-fit columns */
.grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
}

/* Change layout at breakpoints */
.layout {
    display: grid;
    grid-template-columns: 1fr;
}

@media (min-width: 768px) {
    .layout {
        grid-template-columns: 250px 1fr;
    }
}

@media (min-width: 1024px) {
    .layout {
        grid-template-columns: 250px 1fr 300px;
    }
}
```

## Responsive Typography

### Fluid Typography

```css
/* Using clamp() */
h1 {
    font-size: clamp(1.5rem, 4vw, 3rem);
    /* min: 1.5rem, preferred: 4vw, max: 3rem */
}

body {
    font-size: clamp(1rem, 2.5vw, 1.25rem);
}

/* Viewport-based sizing */
.hero-title {
    font-size: 5vw;  /* 5% of viewport width */
}
```

### Responsive Line Height

```css
p {
    line-height: 1.5;  /* Relative to font size */
}

/* Tighter on mobile */
@media (max-width: 767px) {
    p { line-height: 1.4; }
}
```

## Responsive Images

### Basic Responsive Image

```css
img {
    max-width: 100%;
    height: auto;
}
```

### Art Direction with Picture

```html
<picture>
    <!-- Large screens: wide image -->
    <source media="(min-width: 1024px)" srcset="hero-wide.jpg">

    <!-- Medium screens: square image -->
    <source media="(min-width: 768px)" srcset="hero-square.jpg">

    <!-- Small screens: tall image -->
    <img src="hero-tall.jpg" alt="Hero image">
</picture>
```

### Resolution Switching

```html
<img
    src="image-800.jpg"
    srcset="
        image-400.jpg 400w,
        image-800.jpg 800w,
        image-1200.jpg 1200w
    "
    sizes="
        (max-width: 600px) 100vw,
        (max-width: 1200px) 50vw,
        600px
    "
    alt="Responsive image"
>
```

### Background Images

```css
.hero {
    background-image: url('hero-mobile.jpg');
    background-size: cover;
    background-position: center;
}

@media (min-width: 768px) {
    .hero {
        background-image: url('hero-desktop.jpg');
    }
}

/* High DPI screens */
@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
    .hero {
        background-image: url('hero@2x.jpg');
    }
}
```

## Responsive Navigation

### Mobile Menu Pattern

```html
<nav class="navbar">
    <a href="/" class="logo">Logo</a>
    <button class="menu-toggle" aria-label="Toggle menu">☰</button>
    <ul class="nav-links">
        <li><a href="/">Home</a></li>
        <li><a href="/about">About</a></li>
        <li><a href="/contact">Contact</a></li>
    </ul>
</nav>
```

```css
.navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
}

.nav-links {
    display: none;
    flex-direction: column;
    position: absolute;
    top: 60px;
    left: 0;
    right: 0;
    background: white;
}

.nav-links.active {
    display: flex;
}

.menu-toggle {
    display: block;
}

/* Desktop */
@media (min-width: 768px) {
    .nav-links {
        display: flex;
        flex-direction: row;
        position: static;
        background: none;
    }

    .menu-toggle {
        display: none;
    }
}
```

```javascript
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});
```

## Responsive Tables

### Horizontal Scroll

```css
.table-container {
    overflow-x: auto;
}

table {
    min-width: 600px;
}
```

### Stacked Layout

```css
@media (max-width: 767px) {
    table, thead, tbody, th, td, tr {
        display: block;
    }

    thead {
        display: none;
    }

    tr {
        margin-bottom: 1rem;
        border: 1px solid #ccc;
    }

    td {
        display: flex;
        justify-content: space-between;
        padding: 0.5rem;
        border-bottom: 1px solid #eee;
    }

    td::before {
        content: attr(data-label);
        font-weight: bold;
    }
}
```

```html
<tr>
    <td data-label="Name">John Doe</td>
    <td data-label="Email">john@example.com</td>
    <td data-label="Role">Admin</td>
</tr>
```

## CSS Units for Responsive Design

| Unit | Description | Use Case |
|------|-------------|----------|
| `%` | Relative to parent | Widths, margins |
| `vw` | Viewport width | Full-width elements |
| `vh` | Viewport height | Hero sections |
| `rem` | Root font size | Typography, spacing |
| `em` | Parent font size | Component spacing |
| `ch` | Character width | Line lengths |

```css
/* Practical examples */
.container {
    width: 90%;           /* 90% of parent */
    max-width: 75rem;     /* 1200px at 16px root */
    padding: 1.5rem;      /* Scales with font */
}

.hero {
    min-height: 100vh;    /* Full viewport height */
}

p {
    max-width: 65ch;      /* Optimal reading width */
}
```

## Testing Responsive Design

### Browser DevTools

1. Open DevTools (F12)
2. Toggle device toolbar (`Ctrl+Shift+M`)
3. Select device or enter dimensions
4. Test different orientations

### Key Testing Points

- [ ] Text is readable without zooming
- [ ] Buttons/links are tap-friendly (44x44px min)
- [ ] No horizontal scrolling
- [ ] Images scale properly
- [ ] Forms are usable on mobile
- [ ] Navigation works on all sizes

## Common Patterns

### Card Grid

```css
.cards {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.5rem;
}
```

### Two Column Layout

```css
.two-column {
    display: grid;
    grid-template-columns: 1fr;
    gap: 2rem;
}

@media (min-width: 768px) {
    .two-column {
        grid-template-columns: 1fr 1fr;
    }
}
```

### Sidebar Layout

```css
.with-sidebar {
    display: grid;
    grid-template-columns: 1fr;
}

@media (min-width: 768px) {
    .with-sidebar {
        grid-template-columns: 250px 1fr;
    }
}
```

## Summary

- Always include viewport meta tag
- Use mobile-first approach
- Master media queries and breakpoints
- Use flexible units (%, rem, vw)
- Leverage Flexbox and Grid
- Make images responsive
- Test on real devices

## Next Steps

Learn about [Browser Compatibility](/guide/best-practices/browser-compatibility) to ensure your site works across all browsers.
