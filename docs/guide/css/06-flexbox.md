# Flexbox

Learn CSS Flexible Box Layout for one-dimensional layouts.

## Introduction to Flexbox

Flexbox (Flexible Box Layout) revolutionized CSS layouts. It makes previously difficult tasks (like vertical centering) trivially easy!

::: tip Why Flexbox is Amazing
Before Flexbox, developers used floats, tables, and complex hacks. Flexbox provides:
- **Easy centering** (both horizontal and vertical)
- **Flexible sizing** (items grow and shrink automatically)
- **Order control** (reorder items without changing HTML)
- **Space distribution** (even spacing between items)
:::

### Flexbox Mental Model

Think of Flexbox as a **container** with **items**:
- **Flex Container**: The parent element with `display: flex`
- **Flex Items**: The direct children of the flex container
- **Main Axis**: The primary direction (row = horizontal, column = vertical)
- **Cross Axis**: Perpendicular to the main axis

```
Main Axis (row) →
┌────────────────────────────────────┐
│  ┌─────┐  ┌─────┐  ┌─────┐        │  ↑
│  │Item │  │Item │  │Item │        │  │ Cross Axis
│  │  1  │  │  2  │  │  3  │        │  ↓
│  └─────┘  └─────┘  └─────┘        │
└────────────────────────────────────┘
       Flex Container
```

### Getting Started

```css
.container {
    display: flex;  /* This one line activates Flexbox! */
}
```

All direct children immediately become flex items and line up in a row.

## Flex Container Properties

### Flex Direction

```css
.container {
    display: flex;
    flex-direction: row;            /* Default: left to right */
    flex-direction: row-reverse;    /* Right to left */
    flex-direction: column;         /* Top to bottom */
    flex-direction: column-reverse; /* Bottom to top */
}
```

### Flex Wrap

```css
.container {
    flex-wrap: nowrap;       /* Default: single line */
    flex-wrap: wrap;         /* Wrap to new lines */
    flex-wrap: wrap-reverse; /* Wrap upward */
}
```

### Flex Flow (Shorthand)

```css
.container {
    /* flex-direction flex-wrap */
    flex-flow: row wrap;
    flex-flow: column nowrap;
}
```

## Main Axis Alignment

### Justify Content

Aligns items along the main axis:

```css
.container {
    display: flex;
    justify-content: flex-start;    /* Start (default) */
    justify-content: flex-end;      /* End */
    justify-content: center;        /* Center */
    justify-content: space-between; /* Space between items */
    justify-content: space-around;  /* Space around items */
    justify-content: space-evenly;  /* Even space everywhere */
}
```

Visual examples (with row direction):

```
flex-start:     |■ ■ ■           |
flex-end:       |           ■ ■ ■|
center:         |     ■ ■ ■     |
space-between:  |■      ■      ■|
space-around:   |  ■    ■    ■  |
space-evenly:   |   ■   ■   ■   |
```

## Cross Axis Alignment

### Align Items

Aligns items along the cross axis:

```css
.container {
    display: flex;
    align-items: stretch;    /* Default: fill container height */
    align-items: flex-start; /* Top */
    align-items: flex-end;   /* Bottom */
    align-items: center;     /* Center */
    align-items: baseline;   /* Text baseline */
}
```

### Align Content

Aligns multiple lines (when wrapping):

```css
.container {
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;    /* Pack lines at start */
    align-content: flex-end;      /* Pack lines at end */
    align-content: center;        /* Center lines */
    align-content: space-between; /* Space between lines */
    align-content: space-around;  /* Space around lines */
    align-content: stretch;       /* Stretch to fill */
}
```

## Gap

Space between flex items:

```css
.container {
    display: flex;
    gap: 20px;           /* Both row and column */
    row-gap: 20px;       /* Between rows */
    column-gap: 10px;    /* Between columns */
    gap: 20px 10px;      /* row-gap column-gap */
}
```

## Flex Item Properties

### Flex Grow

How much an item should grow:

```css
.item {
    flex-grow: 0;  /* Default: don't grow */
    flex-grow: 1;  /* Grow to fill space */
    flex-grow: 2;  /* Grow twice as much as flex-grow: 1 */
}
```

```css
/* Example: 3 items, middle one grows */
.item:nth-child(2) {
    flex-grow: 1;
}
/* Result: |■ ■■■■■■■■ ■| */
```

### Flex Shrink

How much an item should shrink:

```css
.item {
    flex-shrink: 1;  /* Default: shrink equally */
    flex-shrink: 0;  /* Don't shrink */
    flex-shrink: 2;  /* Shrink twice as much */
}
```

### Flex Basis

Initial size before growing/shrinking:

```css
.item {
    flex-basis: auto;   /* Use width/height */
    flex-basis: 0;      /* Start from zero */
    flex-basis: 200px;  /* Fixed starting size */
    flex-basis: 25%;    /* Percentage */
}
```

### Flex Shorthand

```css
.item {
    /* flex-grow flex-shrink flex-basis */
    flex: 0 1 auto;  /* Default */
    flex: 1;         /* Same as: 1 1 0 */
    flex: auto;      /* Same as: 1 1 auto */
    flex: none;      /* Same as: 0 0 auto */
    flex: 1 0 200px; /* Grow, don't shrink, start at 200px */
}
```

::: tip
Common pattern: `flex: 1` makes items share space equally.
:::

### Align Self

Override alignment for a single item:

```css
.container {
    display: flex;
    align-items: flex-start;
}

.special-item {
    align-self: flex-end;   /* This item aligns to end */
    align-self: center;     /* This item centers */
    align-self: stretch;    /* This item stretches */
}
```

### Order

Change visual order:

```css
.item:nth-child(1) { order: 3; }
.item:nth-child(2) { order: 1; }
.item:nth-child(3) { order: 2; }
/* Visual order: 2, 3, 1 */
```

## Common Flexbox Patterns

### Navigation Bar

```css
.navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
}

.nav-links {
    display: flex;
    gap: 2rem;
}

.nav-right {
    margin-left: auto;  /* Push to right */
}
```

### Centering

```css
.center {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
}
```

### Card Layout

```css
.cards {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
}

.card {
    flex: 1 1 300px;  /* Grow, shrink, min 300px */
    max-width: 400px;
}
```

### Footer at Bottom

```css
body {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}

main {
    flex: 1;  /* Grows to push footer down */
}

footer {
    /* Stays at bottom */
}
```

### Equal Height Columns

```css
.columns {
    display: flex;
}

.column {
    flex: 1;  /* Equal width */
    /* Height matches tallest column automatically */
}
```

### Media Object

```css
.media {
    display: flex;
    gap: 1rem;
}

.media-image {
    flex-shrink: 0;  /* Don't shrink image */
}

.media-content {
    flex: 1;  /* Content takes remaining space */
}
```

### Input with Button

```css
.input-group {
    display: flex;
}

.input-group input {
    flex: 1;
    border-right: none;
}

.input-group button {
    flex-shrink: 0;
}
```

### Sticky Footer (Flexbox Version)

```css
.page {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
}

.header { /* Fixed height */ }

.main {
    flex: 1 0 auto;
}

.footer { /* Fixed height */ }
```

## Practice Exercise

Build a responsive header:

```css
.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
    background: #333;
    color: white;
}

.logo {
    font-size: 1.5rem;
    font-weight: bold;
}

.nav {
    display: flex;
    gap: 1.5rem;
    list-style: none;
    margin: 0;
    padding: 0;
}

.nav a {
    color: white;
    text-decoration: none;
    padding: 0.5rem;
}

.nav a:hover {
    color: #ffd700;
}

.auth-buttons {
    display: flex;
    gap: 0.5rem;
}

.btn {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.btn-login {
    background: transparent;
    color: white;
    border: 1px solid white;
}

.btn-signup {
    background: #ffd700;
    color: #333;
}

/* Responsive */
@media (max-width: 768px) {
    .header {
        flex-wrap: wrap;
    }

    .nav {
        order: 3;
        width: 100%;
        justify-content: center;
        margin-top: 1rem;
    }
}
```
