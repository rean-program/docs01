# Advanced Techniques

Learn CSS custom properties, functions, and best practices.

## Introduction

Welcome to the advanced chapter! Here you'll learn techniques used by professional developers to create maintainable, scalable CSS.

::: tip What Makes CSS "Advanced"?
Advanced CSS isn't about complexity - it's about:
- **Maintainability**: Code that's easy to update
- **Scalability**: Systems that work for small and large projects
- **Performance**: Fast-loading, smooth-rendering sites
- **Organization**: Consistent patterns others can understand
:::

### Topics Covered

| Topic | What You'll Learn |
|-------|-------------------|
| **CSS Variables** | Create reusable values across your stylesheet |
| **CSS Functions** | `calc()`, `min()`, `max()`, `clamp()` |
| **Logical Properties** | Direction-agnostic CSS |
| **Advanced Selectors** | `:is()`, `:where()`, `:has()` |
| **Architecture** | BEM naming, utility classes, design tokens |
| **Dark Mode** | Implementing theme switching |

## CSS Custom Properties (Variables)

CSS Variables (Custom Properties) let you define reusable values. They're one of the most impactful features added to CSS!

### Defining Variables

```css
:root {
    --primary-color: #007bff;
    --secondary-color: #6c757d;
    --font-size-base: 16px;
    --spacing-unit: 8px;
    --border-radius: 4px;
}
```

### Using Variables

```css
.button {
    background-color: var(--primary-color);
    padding: calc(var(--spacing-unit) * 2);
    border-radius: var(--border-radius);
    font-size: var(--font-size-base);
}
```

### Fallback Values

```css
.element {
    color: var(--text-color, #333);  /* Falls back to #333 */
}
```

### Scoped Variables

```css
.card {
    --card-padding: 20px;
    padding: var(--card-padding);
}

.card.compact {
    --card-padding: 10px;  /* Override for this variant */
}
```

### Dynamic Variables

```css
:root {
    --hue: 210;
    --primary: hsl(var(--hue), 100%, 50%);
    --primary-light: hsl(var(--hue), 100%, 70%);
    --primary-dark: hsl(var(--hue), 100%, 30%);
}

/* Change entire color scheme by changing one variable */
.theme-green {
    --hue: 120;
}
```

## CSS Functions

### calc()

```css
.element {
    width: calc(100% - 40px);
    padding: calc(var(--spacing) * 2);
    font-size: calc(1rem + 0.5vw);
    margin: calc(100vh - 60px);
}
```

### min(), max(), clamp()

```css
.responsive {
    /* Minimum of values */
    width: min(100%, 1200px);

    /* Maximum of values */
    width: max(300px, 50%);

    /* Clamp between min and max */
    font-size: clamp(1rem, 2.5vw, 2rem);
    width: clamp(300px, 50%, 800px);
}
```

### Color Functions

```css
.colors {
    /* Modern color functions */
    color: rgb(255 0 0);           /* Space-separated */
    color: rgb(255 0 0 / 50%);     /* With alpha */
    color: hsl(210 100% 50%);
    color: hsl(210 100% 50% / 0.5);

    /* Color mixing (modern browsers) */
    background: color-mix(in srgb, blue, white 50%);
}
```

## Logical Properties

Direction-agnostic properties for internationalization:

```css
.logical {
    /* Instead of left/right */
    margin-inline-start: 1rem;  /* Start of inline axis */
    margin-inline-end: 1rem;    /* End of inline axis */
    margin-inline: 1rem;        /* Both sides */

    /* Instead of top/bottom */
    margin-block-start: 1rem;   /* Start of block axis */
    margin-block-end: 1rem;     /* End of block axis */
    margin-block: 1rem;         /* Both sides */

    /* Padding works the same */
    padding-inline: 2rem;
    padding-block: 1rem;

    /* Size properties */
    inline-size: 300px;  /* width in horizontal writing mode */
    block-size: 200px;   /* height in horizontal writing mode */

    /* Border */
    border-inline-start: 2px solid blue;
}
```

## Advanced Selectors

### :is() and :where()

```css
/* Instead of long selector lists */
:is(h1, h2, h3, h4, h5, h6) {
    font-family: Georgia, serif;
}

/* Nested with :is() */
article :is(h1, h2, h3) {
    color: #333;
}

/* :where() has 0 specificity */
:where(h1, h2, h3) {
    margin: 0;  /* Easy to override */
}
```

### :has() (Parent Selector)

```css
/* Style parent based on child */
.card:has(img) {
    padding-top: 0;
}

/* Form validation styling */
.form-group:has(:invalid) {
    border-color: red;
}

/* Navigation with dropdown */
.nav-item:has(.dropdown):hover .dropdown {
    display: block;
}
```

### :not()

```css
/* All paragraphs except first */
p:not(:first-child) {
    margin-top: 1em;
}

/* Multiple exclusions */
button:not(.primary):not(.secondary) {
    background: gray;
}
```

## CSS Architecture

### BEM Naming Convention

```css
/* Block */
.card { }

/* Element (part of block) */
.card__title { }
.card__content { }
.card__button { }

/* Modifier (variation) */
.card--featured { }
.card__button--primary { }
```

### Utility Classes

```css
/* Spacing utilities */
.m-0 { margin: 0; }
.m-1 { margin: 0.25rem; }
.m-2 { margin: 0.5rem; }
.m-3 { margin: 1rem; }

.p-0 { padding: 0; }
.p-1 { padding: 0.25rem; }
.p-2 { padding: 0.5rem; }

/* Display utilities */
.d-none { display: none; }
.d-block { display: block; }
.d-flex { display: flex; }
.d-grid { display: grid; }

/* Text utilities */
.text-center { text-align: center; }
.text-left { text-align: left; }
.text-right { text-align: right; }

.font-bold { font-weight: bold; }
.font-normal { font-weight: normal; }
```

### Design Tokens

```css
:root {
    /* Colors */
    --color-primary-50: #eff6ff;
    --color-primary-100: #dbeafe;
    --color-primary-500: #3b82f6;
    --color-primary-600: #2563eb;
    --color-primary-900: #1e3a8a;

    /* Typography */
    --font-sans: system-ui, -apple-system, sans-serif;
    --font-mono: 'SF Mono', Monaco, monospace;

    --text-xs: 0.75rem;
    --text-sm: 0.875rem;
    --text-base: 1rem;
    --text-lg: 1.125rem;
    --text-xl: 1.25rem;

    /* Spacing */
    --space-1: 0.25rem;
    --space-2: 0.5rem;
    --space-3: 0.75rem;
    --space-4: 1rem;
    --space-6: 1.5rem;
    --space-8: 2rem;

    /* Shadows */
    --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
    --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
    --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);

    /* Border radius */
    --radius-sm: 0.25rem;
    --radius-md: 0.375rem;
    --radius-lg: 0.5rem;
    --radius-full: 9999px;
}
```

## Dark Mode

### Using Media Query

```css
:root {
    --bg-color: #ffffff;
    --text-color: #333333;
}

@media (prefers-color-scheme: dark) {
    :root {
        --bg-color: #1a1a1a;
        --text-color: #f0f0f0;
    }
}

body {
    background: var(--bg-color);
    color: var(--text-color);
}
```

### Using Class Toggle

```css
:root {
    --bg-color: #ffffff;
    --text-color: #333333;
}

:root.dark {
    --bg-color: #1a1a1a;
    --text-color: #f0f0f0;
}

/* Or on body */
body.dark {
    --bg-color: #1a1a1a;
    --text-color: #f0f0f0;
}
```

### Complete Theme System

```css
:root {
    /* Light theme (default) */
    --bg-primary: #ffffff;
    --bg-secondary: #f8f9fa;
    --text-primary: #212529;
    --text-secondary: #6c757d;
    --border-color: #dee2e6;
    --accent: #007bff;
}

[data-theme="dark"] {
    --bg-primary: #1a1a2e;
    --bg-secondary: #16213e;
    --text-primary: #f8f9fa;
    --text-secondary: #adb5bd;
    --border-color: #495057;
    --accent: #4dabf7;
}
```

## Performance Best Practices

### Efficient Selectors

```css
/* Good - specific and efficient */
.nav-link { }
.card-title { }

/* Avoid - expensive selectors */
div > ul > li > a { }  /* Deep nesting */
[class*="btn"] { }      /* Attribute substring */
*:first-child { }       /* Universal with pseudo */
```

### Reduce Repaints

```css
/* Use transform instead of position */
.animate {
    transform: translateX(100px);  /* Good */
    /* left: 100px; */             /* Avoid */
}

/* Use opacity for visibility */
.fade {
    opacity: 0;  /* Good - compositor only */
    /* visibility: hidden; */  /* Causes repaint */
}
```

### Critical CSS

```css
/* Inline critical above-the-fold CSS */
<style>
    body { margin: 0; font-family: sans-serif; }
    .header { /* critical header styles */ }
    .hero { /* critical hero styles */ }
</style>

/* Load rest asynchronously */
<link rel="preload" href="styles.css" as="style">
```

### Layer Management

```css
@layer reset, base, components, utilities;

@layer reset {
    * { margin: 0; padding: 0; }
}

@layer base {
    body { font-family: sans-serif; }
}

@layer components {
    .button { /* ... */ }
}

@layer utilities {
    .mt-4 { margin-top: 1rem; }
}
```

## Practice Exercise

Create a complete design system:

```css
/* tokens.css - Design Tokens */
:root {
    /* Colors */
    --color-primary: #3b82f6;
    --color-primary-dark: #2563eb;
    --color-secondary: #64748b;
    --color-success: #22c55e;
    --color-warning: #f59e0b;
    --color-danger: #ef4444;

    --color-gray-50: #f8fafc;
    --color-gray-100: #f1f5f9;
    --color-gray-200: #e2e8f0;
    --color-gray-300: #cbd5e1;
    --color-gray-700: #334155;
    --color-gray-800: #1e293b;
    --color-gray-900: #0f172a;

    /* Typography */
    --font-family: 'Inter', system-ui, sans-serif;
    --font-size-sm: 0.875rem;
    --font-size-base: 1rem;
    --font-size-lg: 1.125rem;
    --font-size-xl: 1.25rem;
    --font-size-2xl: 1.5rem;
    --font-size-3xl: 1.875rem;

    --font-weight-normal: 400;
    --font-weight-medium: 500;
    --font-weight-semibold: 600;
    --font-weight-bold: 700;

    --line-height-tight: 1.25;
    --line-height-normal: 1.5;
    --line-height-relaxed: 1.625;

    /* Spacing */
    --space-1: 0.25rem;
    --space-2: 0.5rem;
    --space-3: 0.75rem;
    --space-4: 1rem;
    --space-5: 1.25rem;
    --space-6: 1.5rem;
    --space-8: 2rem;
    --space-10: 2.5rem;
    --space-12: 3rem;

    /* Borders */
    --radius-sm: 0.25rem;
    --radius-md: 0.375rem;
    --radius-lg: 0.5rem;
    --radius-xl: 0.75rem;
    --radius-full: 9999px;

    /* Shadows */
    --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
    --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
    --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
    --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1);

    /* Transitions */
    --transition-fast: 150ms ease;
    --transition-normal: 200ms ease;
    --transition-slow: 300ms ease;
}

/* Dark mode */
[data-theme="dark"] {
    --color-gray-50: #0f172a;
    --color-gray-100: #1e293b;
    --color-gray-200: #334155;
    --color-gray-300: #475569;
    --color-gray-700: #e2e8f0;
    --color-gray-800: #f1f5f9;
    --color-gray-900: #f8fafc;
}

/* components.css - Reusable Components */
.btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: var(--space-2) var(--space-4);
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-medium);
    border-radius: var(--radius-md);
    border: none;
    cursor: pointer;
    transition: all var(--transition-fast);
}

.btn--primary {
    background: var(--color-primary);
    color: white;
}

.btn--primary:hover {
    background: var(--color-primary-dark);
}

.btn--secondary {
    background: var(--color-gray-200);
    color: var(--color-gray-800);
}

.card {
    background: white;
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-md);
    overflow: hidden;
}

.card__header {
    padding: var(--space-4);
    border-bottom: 1px solid var(--color-gray-200);
}

.card__body {
    padding: var(--space-4);
}

.card__footer {
    padding: var(--space-4);
    border-top: 1px solid var(--color-gray-200);
    background: var(--color-gray-50);
}
```
