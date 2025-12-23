# CSS Grid

Learn CSS Grid Layout for two-dimensional layouts.

## Introduction to Grid

CSS Grid is the most powerful layout system in CSS. While Flexbox excels at one-dimensional layouts, Grid handles two dimensions - rows AND columns simultaneously.

::: tip Grid vs Flexbox - When to Use Which?
| Use **Flexbox** for | Use **Grid** for |
|---------------------|------------------|
| Navigation bars | Page layouts |
| Card rows | Image galleries |
| Centering content | Dashboard layouts |
| Simple component layouts | Complex overlapping designs |

**Rule of thumb**: If you need to control layout in one direction, use Flexbox. If you need rows AND columns, use Grid.
:::

### Grid Mental Model

Think of Grid like a spreadsheet - you define rows and columns, then place items in cells:

```
        Column 1    Column 2    Column 3
       ┌──────────┬──────────┬──────────┐
Row 1  │  Header spans all three        │
       ├──────────┼──────────┴──────────┤
Row 2  │ Sidebar  │    Main Content     │
       │          │                     │
       ├──────────┼─────────────────────┤
Row 3  │  Footer spans all three        │
       └──────────┴─────────────────────┘
```

### Getting Started

```css
.container {
    display: grid;
    grid-template-columns: 200px 1fr 200px;  /* 3 columns */
    grid-template-rows: auto 1fr auto;        /* 3 rows */
    gap: 20px;                                /* Spacing */
}
```

## Defining Grid Structure

### Grid Template Columns

```css
.container {
    display: grid;

    /* Fixed columns */
    grid-template-columns: 200px 200px 200px;

    /* Flexible columns */
    grid-template-columns: 1fr 1fr 1fr;

    /* Mixed */
    grid-template-columns: 200px 1fr 200px;

    /* Repeat notation */
    grid-template-columns: repeat(3, 1fr);
    grid-template-columns: repeat(4, 200px);
}
```

### Grid Template Rows

```css
.container {
    display: grid;
    grid-template-rows: 100px 200px 100px;
    grid-template-rows: auto 1fr auto;
    grid-template-rows: repeat(3, minmax(100px, auto));
}
```

### The fr Unit

Fractional unit - distributes available space:

```css
.container {
    grid-template-columns: 1fr 2fr 1fr;
    /* First: 25%, Middle: 50%, Last: 25% */
}
```

### minmax() Function

```css
.container {
    grid-template-columns: repeat(3, minmax(200px, 1fr));
    /* Each column: at least 200px, up to 1fr */
}
```

### auto-fit and auto-fill

```css
/* Responsive grid - fills available space */
.container {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
}

/* auto-fit collapses empty tracks */
.container {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
}
```

::: tip
`auto-fill` keeps empty columns. `auto-fit` collapses them, stretching items to fill space.
:::

## Gap

Space between grid items:

```css
.container {
    gap: 20px;              /* Both row and column */
    row-gap: 20px;          /* Between rows */
    column-gap: 10px;       /* Between columns */
    gap: 20px 10px;         /* row-gap column-gap */
}
```

## Placing Items

### Grid Lines

Lines are numbered starting from 1:

```
    1     2     3     4
    |     |     |     |
 1 -+-----+-----+-----+
    |  1  |  2  |  3  |
 2 -+-----+-----+-----+
    |  4  |  5  |  6  |
 3 -+-----+-----+-----+
```

### Grid Column and Row

```css
.item {
    grid-column-start: 1;
    grid-column-end: 3;    /* Spans columns 1-2 */

    grid-row-start: 1;
    grid-row-end: 3;       /* Spans rows 1-2 */
}

/* Shorthand */
.item {
    grid-column: 1 / 3;    /* Start / End */
    grid-row: 1 / 3;
}

/* Span notation */
.item {
    grid-column: span 2;   /* Span 2 columns */
    grid-row: span 3;      /* Span 3 rows */
    grid-column: 2 / span 2; /* Start at 2, span 2 */
}

/* Negative values (from end) */
.item {
    grid-column: 1 / -1;   /* Full width */
}
```

### Grid Area Shorthand

```css
.item {
    /* row-start / column-start / row-end / column-end */
    grid-area: 1 / 1 / 3 / 3;
}
```

## Named Grid Lines

```css
.container {
    grid-template-columns:
        [sidebar-start] 250px
        [sidebar-end content-start] 1fr
        [content-end];
}

.sidebar {
    grid-column: sidebar-start / sidebar-end;
}

.content {
    grid-column: content-start / content-end;
}
```

## Grid Template Areas

Visual layout definition:

```css
.container {
    display: grid;
    grid-template-areas:
        "header  header  header"
        "sidebar content content"
        "footer  footer  footer";
    grid-template-columns: 250px 1fr 1fr;
    grid-template-rows: auto 1fr auto;
}

.header  { grid-area: header; }
.sidebar { grid-area: sidebar; }
.content { grid-area: content; }
.footer  { grid-area: footer; }
```

### Empty Cells

Use `.` for empty cells:

```css
grid-template-areas:
    "header header header"
    "sidebar . content"
    "footer footer footer";
```

## Alignment

### Justify Items (Horizontal)

Aligns items within their cell horizontally:

```css
.container {
    justify-items: start;   /* Left */
    justify-items: end;     /* Right */
    justify-items: center;  /* Center */
    justify-items: stretch; /* Fill cell (default) */
}
```

### Align Items (Vertical)

Aligns items within their cell vertically:

```css
.container {
    align-items: start;   /* Top */
    align-items: end;     /* Bottom */
    align-items: center;  /* Center */
    align-items: stretch; /* Fill cell (default) */
}
```

### Place Items (Shorthand)

```css
.container {
    place-items: center;           /* Both axes */
    place-items: center start;     /* align-items justify-items */
}
```

### Justify Content (Grid Alignment)

Aligns the entire grid horizontally:

```css
.container {
    justify-content: start;
    justify-content: end;
    justify-content: center;
    justify-content: space-between;
    justify-content: space-around;
    justify-content: space-evenly;
}
```

### Align Content (Grid Alignment)

Aligns the entire grid vertically:

```css
.container {
    align-content: start;
    align-content: end;
    align-content: center;
    align-content: space-between;
    align-content: space-around;
    align-content: space-evenly;
}
```

### Place Content (Shorthand)

```css
.container {
    place-content: center;         /* Both axes */
    place-content: center start;   /* align-content justify-content */
}
```

## Item Alignment

Override container alignment for individual items:

```css
.item {
    justify-self: start;    /* Horizontal */
    align-self: end;        /* Vertical */
    place-self: center;     /* Both */
}
```

## Implicit Grid

When items are placed outside the explicit grid:

```css
.container {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    /* Only defines columns, rows are implicit */

    grid-auto-rows: 100px;           /* Implicit row height */
    grid-auto-rows: minmax(100px, auto);

    grid-auto-columns: 200px;        /* Implicit column width */

    grid-auto-flow: row;             /* Fill by row (default) */
    grid-auto-flow: column;          /* Fill by column */
    grid-auto-flow: dense;           /* Fill gaps */
}
```

## Common Grid Patterns

### Basic Page Layout

```css
.page {
    display: grid;
    grid-template-areas:
        "header"
        "main"
        "footer";
    grid-template-rows: auto 1fr auto;
    min-height: 100vh;
}
```

### Sidebar Layout

```css
.layout {
    display: grid;
    grid-template-columns: 250px 1fr;
    gap: 2rem;
}

/* Responsive */
@media (max-width: 768px) {
    .layout {
        grid-template-columns: 1fr;
    }
}
```

### Card Grid

```css
.cards {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
}
```

### Holy Grail Layout

```css
.holy-grail {
    display: grid;
    grid-template:
        "header header header" auto
        "nav main aside" 1fr
        "footer footer footer" auto
        / 200px 1fr 200px;
    min-height: 100vh;
    gap: 1rem;
}
```

### Magazine Layout

```css
.magazine {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1rem;
}

.featured {
    grid-column: span 2;
    grid-row: span 2;
}

.standard {
    grid-column: span 1;
    grid-row: span 1;
}
```

### Masonry-like Layout

```css
.masonry {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    grid-auto-rows: 10px;
    gap: 10px;
}

.item-small  { grid-row: span 20; }
.item-medium { grid-row: span 30; }
.item-large  { grid-row: span 40; }
```

### Centered Content

```css
.center {
    display: grid;
    place-items: center;
    min-height: 100vh;
}
```

## Practice Exercise

Build a dashboard layout:

```css
.dashboard {
    display: grid;
    grid-template-areas:
        "sidebar header"
        "sidebar main";
    grid-template-columns: 250px 1fr;
    grid-template-rows: 60px 1fr;
    min-height: 100vh;
}

.sidebar {
    grid-area: sidebar;
    background: #2c3e50;
    color: white;
    padding: 1rem;
}

.header {
    grid-area: header;
    background: white;
    border-bottom: 1px solid #eee;
    padding: 1rem 2rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.main {
    grid-area: main;
    padding: 2rem;
    background: #f5f5f5;
}

.cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
}

.card {
    background: white;
    padding: 1.5rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Responsive */
@media (max-width: 768px) {
    .dashboard {
        grid-template-areas:
            "header"
            "main";
        grid-template-columns: 1fr;
        grid-template-rows: 60px 1fr;
    }

    .sidebar {
        display: none;
    }
}
```
