# Responsive Design

Learn how to create websites that work on all screen sizes.

## Introduction

Responsive design ensures your website looks great on any device - from mobile phones to ultra-wide desktop monitors. In a world where over 50% of web traffic comes from mobile devices, responsive design isn't optional!

::: tip The Responsive Mindset
Instead of building separate mobile and desktop sites, responsive design uses:
- **Fluid layouts** that adapt to screen size
- **Flexible images** that scale within their containers
- **Media queries** that apply different styles at different sizes
:::

### Mobile-First Philosophy

The modern approach is to design for mobile FIRST, then enhance for larger screens:

```css
/* Mobile styles (default) */
.container { padding: 10px; }

/* Tablet and up */
@media (min-width: 768px) {
    .container { padding: 20px; }
}

/* Desktop */
@media (min-width: 1024px) {
    .container { padding: 40px; }
}
```

**Why mobile-first?**
- Mobile users have the most constraints (small screen, slow connection)
- Easier to add complexity than remove it
- Forces you to prioritize content

## Viewport Meta Tag

Essential for responsive design - without it, mobile browsers assume your site is designed for desktop:

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

## Media Queries

### Basic Syntax

```css
@media (condition) {
    /* Styles applied when condition is true */
}
```

### Width-Based Queries

```css
/* Max-width: up to 768px */
@media (max-width: 768px) {
    .container {
        padding: 10px;
    }
}

/* Min-width: 768px and above */
@media (min-width: 768px) {
    .container {
        max-width: 720px;
    }
}

/* Range */
@media (min-width: 768px) and (max-width: 1024px) {
    /* Tablet styles */
}
```

### Common Breakpoints

```css
/* Mobile first approach */
/* Base styles for mobile */

/* Small tablets */
@media (min-width: 576px) { }

/* Tablets */
@media (min-width: 768px) { }

/* Laptops */
@media (min-width: 992px) { }

/* Desktops */
@media (min-width: 1200px) { }

/* Large screens */
@media (min-width: 1400px) { }
```

### Media Types

```css
@media screen { /* Screen devices */ }
@media print { /* Print styles */ }
@media all { /* All devices (default) */ }
```

### Other Features

```css
/* Orientation */
@media (orientation: portrait) { }
@media (orientation: landscape) { }

/* Hover capability */
@media (hover: hover) {
    /* Device supports hover */
}

/* Reduced motion preference */
@media (prefers-reduced-motion: reduce) {
    * {
        animation: none !important;
        transition: none !important;
    }
}

/* Dark mode preference */
@media (prefers-color-scheme: dark) {
    body {
        background: #1a1a1a;
        color: #fff;
    }
}

/* High resolution screens */
@media (min-resolution: 2dppx) {
    /* Retina display styles */
}
```

## Mobile-First Approach

Start with mobile styles, add complexity for larger screens:

```css
/* Base styles (mobile) */
.container {
    padding: 1rem;
}

.grid {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

/* Tablet and up */
@media (min-width: 768px) {
    .container {
        padding: 2rem;
    }

    .grid {
        flex-direction: row;
    }
}

/* Desktop */
@media (min-width: 1024px) {
    .container {
        max-width: 1200px;
        margin: 0 auto;
    }
}
```

## Responsive Units

### Viewport Units

```css
.hero {
    height: 100vh;   /* Full viewport height */
    width: 100vw;    /* Full viewport width */
    padding: 5vmin;  /* Smaller of vw or vh */
}
```

### Relative Units

```css
.content {
    font-size: 1rem;     /* Relative to root */
    padding: 1.5em;      /* Relative to element's font-size */
    width: 80%;          /* Percentage of parent */
}
```

### Container Queries (Modern)

```css
.card-container {
    container-type: inline-size;
    container-name: card;
}

@container card (min-width: 400px) {
    .card {
        display: flex;
    }
}
```

## Fluid Typography

### Using clamp()

```css
html {
    /* Min: 16px, Preferred: 2.5vw, Max: 22px */
    font-size: clamp(1rem, 2.5vw, 1.375rem);
}

h1 {
    /* Responsive heading */
    font-size: clamp(2rem, 5vw, 4rem);
}
```

### Fluid Scale

```css
:root {
    --step-0: clamp(1rem, 0.95rem + 0.25vw, 1.125rem);
    --step-1: clamp(1.125rem, 1.05rem + 0.38vw, 1.35rem);
    --step-2: clamp(1.266rem, 1.15rem + 0.58vw, 1.62rem);
    --step-3: clamp(1.424rem, 1.25rem + 0.87vw, 1.944rem);
}

body { font-size: var(--step-0); }
h3 { font-size: var(--step-1); }
h2 { font-size: var(--step-2); }
h1 { font-size: var(--step-3); }
```

## Responsive Images

### Basic Responsive Image

```css
img {
    max-width: 100%;
    height: auto;
}
```

### Object Fit

```css
.image-cover {
    width: 100%;
    height: 300px;
    object-fit: cover;    /* Cover container, crop if needed */
    object-position: center;
}

.image-contain {
    object-fit: contain;  /* Fit inside, letterbox if needed */
}
```

### Picture Element (HTML)

```html
<picture>
    <source media="(min-width: 1200px)" srcset="large.jpg">
    <source media="(min-width: 768px)" srcset="medium.jpg">
    <img src="small.jpg" alt="Description">
</picture>
```

### Background Images

```css
.hero {
    background-image: url('mobile.jpg');
    background-size: cover;
    background-position: center;
}

@media (min-width: 768px) {
    .hero {
        background-image: url('desktop.jpg');
    }
}
```

## Responsive Patterns

### Responsive Navigation

```css
.nav {
    display: flex;
    flex-direction: column;
}

.nav-toggle {
    display: block;
}

.nav-menu {
    display: none;
}

.nav-menu.active {
    display: flex;
    flex-direction: column;
}

@media (min-width: 768px) {
    .nav {
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }

    .nav-toggle {
        display: none;
    }

    .nav-menu {
        display: flex;
        flex-direction: row;
        gap: 2rem;
    }
}
```

### Responsive Grid

```css
.grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
}

@media (min-width: 576px) {
    .grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (min-width: 992px) {
    .grid {
        grid-template-columns: repeat(3, 1fr);
    }
}

@media (min-width: 1200px) {
    .grid {
        grid-template-columns: repeat(4, 1fr);
    }
}

/* Or use auto-fit */
.grid-auto {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
}
```

### Responsive Table

```css
/* Stack on mobile */
@media (max-width: 768px) {
    table, thead, tbody, tr, th, td {
        display: block;
    }

    thead {
        display: none;
    }

    tr {
        margin-bottom: 1rem;
        border: 1px solid #ddd;
    }

    td {
        padding: 0.5rem;
        text-align: right;
    }

    td::before {
        content: attr(data-label);
        float: left;
        font-weight: bold;
    }
}
```

### Show/Hide Elements

```css
.mobile-only {
    display: block;
}

.desktop-only {
    display: none;
}

@media (min-width: 768px) {
    .mobile-only {
        display: none;
    }

    .desktop-only {
        display: block;
    }
}
```

## Responsive Spacing

```css
:root {
    --space-xs: clamp(0.5rem, 1vw, 0.75rem);
    --space-sm: clamp(0.75rem, 2vw, 1rem);
    --space-md: clamp(1rem, 3vw, 1.5rem);
    --space-lg: clamp(1.5rem, 4vw, 2.5rem);
    --space-xl: clamp(2rem, 6vw, 4rem);
}

.section {
    padding: var(--space-lg) var(--space-md);
}
```

## Practice Exercise

Create a responsive landing page:

```css
/* Reset and base */
* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

html {
    font-size: clamp(14px, 2vw, 16px);
}

/* Mobile-first layout */
.container {
    width: 100%;
    padding: 0 1rem;
}

/* Header */
.header {
    padding: 1rem;
}

.nav-toggle {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
}

.nav-menu {
    display: none;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem 0;
}

.nav-menu.active {
    display: flex;
}

/* Hero */
.hero {
    padding: 3rem 1rem;
    text-align: center;
}

.hero h1 {
    font-size: clamp(2rem, 5vw, 3.5rem);
    margin-bottom: 1rem;
}

/* Cards */
.cards {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.5rem;
    padding: 2rem 1rem;
}

.card {
    padding: 1.5rem;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Tablet */
@media (min-width: 768px) {
    .container {
        max-width: 720px;
        margin: 0 auto;
    }

    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .nav-toggle {
        display: none;
    }

    .nav-menu {
        display: flex;
        flex-direction: row;
        gap: 2rem;
    }

    .hero {
        padding: 5rem 2rem;
    }

    .cards {
        grid-template-columns: repeat(2, 1fr);
    }
}

/* Desktop */
@media (min-width: 992px) {
    .container {
        max-width: 960px;
    }

    .cards {
        grid-template-columns: repeat(3, 1fr);
    }
}

/* Large screens */
@media (min-width: 1200px) {
    .container {
        max-width: 1140px;
    }

    .hero {
        padding: 8rem 2rem;
    }
}
```
