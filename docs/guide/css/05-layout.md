# Layout

Learn about CSS display modes, positioning, and layout techniques.

## Introduction

Layout is how you arrange elements on a page. CSS gives you several powerful tools to control where elements appear and how they interact with each other.

::: tip Layout Evolution
CSS layout has evolved significantly:
- **Old way**: Tables, floats, and hacks
- **Modern way**: Flexbox and Grid
- **Best practice**: Use Flexbox for 1D layouts, Grid for 2D layouts
:::

### Layout Concepts Overview

| Concept | What It Does | When to Use |
|---------|--------------|-------------|
| **Display** | Controls how elements flow | Always - it's fundamental |
| **Position** | Places elements precisely | Overlays, fixed headers, tooltips |
| **Float** | Text wrapping around images | Rarely - use Flexbox instead |
| **Flexbox** | One-dimensional layouts | Navigation, card rows, centering |
| **Grid** | Two-dimensional layouts | Page layouts, galleries |

## Display Property

The `display` property determines how an element behaves in the layout. It's the foundation of CSS layout.

### Block Elements

Take full width, stack vertically:

```css
.block {
    display: block;
}
```

Default block elements: `<div>`, `<p>`, `<h1>`-`<h6>`, `<section>`, `<article>`

### Inline Elements

Flow with text, no width/height:

```css
.inline {
    display: inline;
    /* width and height have no effect */
    /* vertical margin/padding don't affect layout */
}
```

Default inline elements: `<span>`, `<a>`, `<strong>`, `<em>`, `<img>`

### Inline-Block

Inline flow with block properties:

```css
.inline-block {
    display: inline-block;
    width: 200px;      /* Works! */
    height: 100px;     /* Works! */
    margin: 10px;      /* Full margin works */
}
```

### None

Removes element from layout:

```css
.hidden {
    display: none;  /* Element is gone */
}

/* vs visibility */
.invisible {
    visibility: hidden;  /* Space preserved */
}
```

## Position Property

### Static (Default)

Normal document flow:

```css
.static {
    position: static;
    /* top, right, bottom, left have no effect */
}
```

### Relative

Positioned relative to normal position:

```css
.relative {
    position: relative;
    top: 20px;     /* Moves down 20px from normal position */
    left: 10px;    /* Moves right 10px */
    /* Original space is preserved */
}
```

### Absolute

Positioned relative to nearest positioned ancestor:

```css
.parent {
    position: relative;  /* Creates positioning context */
}

.absolute {
    position: absolute;
    top: 0;
    right: 0;
    /* Removed from normal flow */
}
```

### Fixed

Positioned relative to viewport:

```css
.fixed-header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
    /* Stays in place when scrolling */
}
```

### Sticky

Hybrid of relative and fixed:

```css
.sticky-nav {
    position: sticky;
    top: 0;  /* Sticks when reaching this offset */
}
```

## Position Properties

### Top, Right, Bottom, Left

```css
.positioned {
    position: absolute;
    top: 20px;      /* Distance from top */
    right: 20px;    /* Distance from right */
    bottom: 20px;   /* Distance from bottom */
    left: 20px;     /* Distance from left */
}

/* Centering with position */
.centered {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

/* Stretch to fill */
.fill {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    /* Or use inset: 0; */
}
```

### Inset Shorthand

```css
.inset {
    inset: 0;                    /* All sides */
    inset: 10px 20px;            /* top/bottom | left/right */
    inset: 10px 20px 30px 40px;  /* top | right | bottom | left */
}
```

## Z-Index

Controls stacking order:

```css
.layer1 { z-index: 1; }
.layer2 { z-index: 2; }  /* On top of layer1 */
.layer3 { z-index: 3; }  /* On top of both */

/* Common z-index scale */
:root {
    --z-dropdown: 100;
    --z-sticky: 200;
    --z-fixed: 300;
    --z-modal-backdrop: 400;
    --z-modal: 500;
    --z-popover: 600;
    --z-tooltip: 700;
}
```

::: tip
`z-index` only works on positioned elements (not `static`).
:::

## Float

Traditional layout method (largely replaced by Flexbox/Grid):

```css
.float-left {
    float: left;
    margin-right: 20px;
}

.float-right {
    float: right;
    margin-left: 20px;
}
```

### Clearing Floats

```css
/* Clear after floated elements */
.clear {
    clear: both;
}

/* Clearfix hack */
.clearfix::after {
    content: '';
    display: table;
    clear: both;
}
```

## Centering Techniques

### Horizontal Centering

```css
/* Block element */
.center-block {
    width: 300px;
    margin: 0 auto;
}

/* Inline/text content */
.center-text {
    text-align: center;
}

/* Flexbox */
.center-flex {
    display: flex;
    justify-content: center;
}
```

### Vertical Centering

```css
/* Flexbox (recommended) */
.center-vertical {
    display: flex;
    align-items: center;
    min-height: 100vh;
}

/* Grid */
.center-grid {
    display: grid;
    place-items: center;
    min-height: 100vh;
}

/* Position + Transform */
.center-absolute {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
}
```

### Both Axes

```css
/* Flexbox */
.center-both-flex {
    display: flex;
    justify-content: center;
    align-items: center;
}

/* Grid (simplest) */
.center-both-grid {
    display: grid;
    place-items: center;
}

/* Position + Transform */
.center-both-absolute {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
```

## Multi-Column Layout

```css
.columns {
    column-count: 3;
    column-gap: 20px;
    column-rule: 1px solid #ddd;
}

/* Or specify width */
.auto-columns {
    column-width: 250px;  /* Auto-calculates count */
}

/* Span across columns */
.columns h2 {
    column-span: all;
}
```

## Common Layout Patterns

### Header, Main, Footer

```css
body {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}

main {
    flex: 1;  /* Grows to fill space */
}
```

### Sidebar Layout

```css
.layout {
    display: grid;
    grid-template-columns: 250px 1fr;
    gap: 20px;
}

.sidebar {
    /* Fixed width */
}

.content {
    /* Flexible */
}
```

### Card Grid

```css
.card-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
}
```

### Holy Grail Layout

```css
.holy-grail {
    display: grid;
    grid-template:
        "header header header" auto
        "nav    main   aside" 1fr
        "footer footer footer" auto
        / 200px 1fr 200px;
    min-height: 100vh;
}

header { grid-area: header; }
nav    { grid-area: nav; }
main   { grid-area: main; }
aside  { grid-area: aside; }
footer { grid-area: footer; }
```

## Practice Exercise

Create a page layout:

```css
* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

body {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}

.header {
    position: sticky;
    top: 0;
    background: #333;
    color: white;
    padding: 1rem 2rem;
    z-index: 100;
}

.nav {
    display: flex;
    gap: 2rem;
    justify-content: center;
}

.nav a {
    color: white;
    text-decoration: none;
}

.main {
    flex: 1;
    display: grid;
    grid-template-columns: 250px 1fr;
    gap: 2rem;
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;
}

.sidebar {
    position: sticky;
    top: 80px;
    height: fit-content;
}

.content {
    /* Main content area */
}

.footer {
    background: #333;
    color: white;
    text-align: center;
    padding: 2rem;
}
```
