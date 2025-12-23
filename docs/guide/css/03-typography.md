# Typography

Learn how to style text and fonts in CSS.

## Introduction

Typography is the art of arranging text to make it readable, appealing, and effective. Good typography can make the difference between a professional website and an amateur one.

::: tip Why Typography Matters
- **Readability**: 95% of web content is text. If it's hard to read, visitors leave
- **Hierarchy**: Typography guides users through your content
- **Brand Identity**: Fonts convey personality (modern, traditional, playful, serious)
- **Accessibility**: Proper typography helps users with visual impairments
:::

### Key Typography Concepts

| Concept | What It Controls |
|---------|------------------|
| **Font Family** | The typeface (Arial, Georgia, etc.) |
| **Font Size** | How big the text is |
| **Font Weight** | How bold/thin the text is |
| **Line Height** | Spacing between lines |
| **Letter Spacing** | Spacing between characters |
| **Text Alignment** | Left, center, right, justified |

## Font Family

The `font-family` property sets the typeface. Always provide fallback fonts!

### Setting Fonts

```css
body {
    font-family: Arial, Helvetica, sans-serif;
}

h1 {
    font-family: Georgia, 'Times New Roman', serif;
}

code {
    font-family: 'Courier New', Consolas, monospace;
}
```

### Font Stacks

Always provide fallback fonts:

```css
/* Sans-serif stack */
.sans {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
                 'Helvetica Neue', Arial, sans-serif;
}

/* Serif stack */
.serif {
    font-family: Georgia, Cambria, 'Times New Roman', Times, serif;
}

/* Monospace stack */
.mono {
    font-family: 'SF Mono', Monaco, Consolas, 'Liberation Mono',
                 'Courier New', monospace;
}
```

### Generic Font Families

| Generic | Description |
|---------|-------------|
| `serif` | Fonts with decorative strokes |
| `sans-serif` | Fonts without decorative strokes |
| `monospace` | Fixed-width fonts |
| `cursive` | Script-like fonts |
| `fantasy` | Decorative fonts |

### Web Fonts (Google Fonts)

```html
<!-- In HTML head -->
<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet">
```

```css
body {
    font-family: 'Roboto', sans-serif;
}
```

### @font-face

```css
@font-face {
    font-family: 'CustomFont';
    src: url('fonts/custom.woff2') format('woff2'),
         url('fonts/custom.woff') format('woff');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
}

body {
    font-family: 'CustomFont', sans-serif;
}
```

## Font Size

### Units

```css
.size-examples {
    font-size: 16px;     /* Pixels - fixed size */
    font-size: 1em;      /* Relative to parent */
    font-size: 1rem;     /* Relative to root (html) */
    font-size: 100%;     /* Percentage of parent */
    font-size: larger;   /* Keyword */
    font-size: 1.5vw;    /* Viewport width */
}
```

### Responsive Typography

```css
html {
    font-size: 16px;  /* Base size */
}

h1 { font-size: 2.5rem; }    /* 40px */
h2 { font-size: 2rem; }      /* 32px */
h3 { font-size: 1.75rem; }   /* 28px */
h4 { font-size: 1.5rem; }    /* 24px */
p  { font-size: 1rem; }      /* 16px */
small { font-size: 0.875rem; } /* 14px */
```

::: tip
Using `rem` units makes it easy to scale your entire site by changing the root font size.
:::

### Fluid Typography

```css
/* Scales between 16px and 24px based on viewport */
html {
    font-size: clamp(1rem, 2.5vw, 1.5rem);
}
```

## Font Weight

```css
.weight-examples {
    font-weight: normal;   /* 400 */
    font-weight: bold;     /* 700 */
    font-weight: lighter;  /* Relative */
    font-weight: bolder;   /* Relative */

    /* Numeric values */
    font-weight: 100;  /* Thin */
    font-weight: 200;  /* Extra Light */
    font-weight: 300;  /* Light */
    font-weight: 400;  /* Normal */
    font-weight: 500;  /* Medium */
    font-weight: 600;  /* Semi Bold */
    font-weight: 700;  /* Bold */
    font-weight: 800;  /* Extra Bold */
    font-weight: 900;  /* Black */
}
```

## Font Style

```css
.style-examples {
    font-style: normal;
    font-style: italic;
    font-style: oblique;
    font-style: oblique 10deg;  /* Custom angle */
}
```

## Text Properties

### Text Color

```css
.text-color {
    color: #333;
    color: rgb(51, 51, 51);
    color: hsl(0, 0%, 20%);
}
```

### Text Alignment

```css
.alignment {
    text-align: left;
    text-align: center;
    text-align: right;
    text-align: justify;
}
```

### Text Decoration

```css
.decoration {
    text-decoration: none;
    text-decoration: underline;
    text-decoration: overline;
    text-decoration: line-through;

    /* Detailed control */
    text-decoration: underline dotted red;
    text-decoration-line: underline;
    text-decoration-style: wavy;
    text-decoration-color: blue;
    text-decoration-thickness: 2px;
    text-underline-offset: 3px;
}
```

### Text Transform

```css
.transform {
    text-transform: none;
    text-transform: uppercase;
    text-transform: lowercase;
    text-transform: capitalize;
}
```

### Text Indent

```css
.indent {
    text-indent: 2em;    /* First line indent */
    text-indent: 50px;
}
```

## Line Height

```css
.line-height {
    line-height: normal;    /* Browser default */
    line-height: 1.5;       /* Multiplier (recommended) */
    line-height: 24px;      /* Fixed value */
    line-height: 150%;      /* Percentage */
}
```

### Readable Line Height

```css
/* Optimal for body text */
body {
    line-height: 1.6;
}

/* Tighter for headings */
h1, h2, h3 {
    line-height: 1.2;
}
```

## Letter and Word Spacing

```css
.spacing {
    letter-spacing: normal;
    letter-spacing: 0.05em;   /* Slight increase */
    letter-spacing: 2px;      /* Fixed value */
    letter-spacing: -0.5px;   /* Tighter */

    word-spacing: normal;
    word-spacing: 0.25em;
    word-spacing: 5px;
}
```

### Common Uses

```css
/* Uppercase text often needs more spacing */
.uppercase-heading {
    text-transform: uppercase;
    letter-spacing: 0.1em;
}

/* Tight tracking for large display text */
.display-text {
    font-size: 4rem;
    letter-spacing: -0.02em;
}
```

## Text Shadow

```css
.shadows {
    /* offset-x | offset-y | color */
    text-shadow: 2px 2px #000;

    /* offset-x | offset-y | blur-radius | color */
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);

    /* Multiple shadows */
    text-shadow:
        1px 1px 2px black,
        0 0 25px blue,
        0 0 5px darkblue;
}
```

### Common Effects

```css
/* Subtle shadow for readability */
.subtle {
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
}

/* Glow effect */
.glow {
    text-shadow: 0 0 10px #fff, 0 0 20px #fff, 0 0 30px #0ff;
}

/* Outline/stroke effect */
.outline {
    text-shadow:
        -1px -1px 0 #000,
        1px -1px 0 #000,
        -1px 1px 0 #000,
        1px 1px 0 #000;
}
```

## White Space and Overflow

### White Space

```css
.whitespace {
    white-space: normal;     /* Default wrapping */
    white-space: nowrap;     /* No wrapping */
    white-space: pre;        /* Preserve whitespace */
    white-space: pre-wrap;   /* Preserve + wrap */
    white-space: pre-line;   /* Collapse spaces, preserve newlines */
}
```

### Text Overflow

```css
.ellipsis {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;  /* Adds "..." */
}

/* Multi-line ellipsis */
.multi-line-ellipsis {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
```

### Word Break and Wrap

```css
.word-handling {
    word-break: normal;
    word-break: break-all;    /* Break anywhere */
    word-break: keep-all;     /* CJK: no break */

    overflow-wrap: normal;
    overflow-wrap: break-word; /* Break long words */

    hyphens: none;
    hyphens: auto;            /* Auto-hyphenation */
}
```

## Font Shorthand

```css
/* font: style weight size/line-height family */
.shorthand {
    font: italic bold 16px/1.5 Arial, sans-serif;
}

/* Minimum required: size and family */
.minimum {
    font: 16px Arial;
}

/* Common patterns */
body {
    font: 400 16px/1.6 'Helvetica Neue', sans-serif;
}

h1 {
    font: 700 2.5rem/1.2 Georgia, serif;
}
```

## Typographic Scale

```css
:root {
    --font-size-xs: 0.75rem;    /* 12px */
    --font-size-sm: 0.875rem;   /* 14px */
    --font-size-base: 1rem;     /* 16px */
    --font-size-lg: 1.125rem;   /* 18px */
    --font-size-xl: 1.25rem;    /* 20px */
    --font-size-2xl: 1.5rem;    /* 24px */
    --font-size-3xl: 1.875rem;  /* 30px */
    --font-size-4xl: 2.25rem;   /* 36px */
    --font-size-5xl: 3rem;      /* 48px */
}
```

## Practice Exercise

Create a styled article:

```css
.article {
    max-width: 65ch;  /* Optimal reading width */
    margin: 0 auto;
    font-family: Georgia, serif;
    font-size: 1.125rem;
    line-height: 1.7;
    color: #333;
}

.article h1 {
    font-family: 'Helvetica Neue', sans-serif;
    font-size: 2.5rem;
    font-weight: 700;
    line-height: 1.2;
    letter-spacing: -0.02em;
    margin-bottom: 0.5em;
}

.article h2 {
    font-size: 1.75rem;
    font-weight: 600;
    margin-top: 2em;
    margin-bottom: 0.5em;
}

.article p {
    margin-bottom: 1.5em;
}

.article p:first-of-type::first-letter {
    font-size: 3em;
    float: left;
    line-height: 1;
    margin-right: 0.1em;
}

.article a {
    color: #0066cc;
    text-decoration: underline;
    text-underline-offset: 2px;
}

.article a:hover {
    color: #004499;
}

.article blockquote {
    font-style: italic;
    border-left: 4px solid #ddd;
    padding-left: 1em;
    margin: 1.5em 0;
    color: #666;
}
```
