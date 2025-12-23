# Box Model

Learn about the CSS box model including margins, padding, borders, and sizing.

## Introduction

The CSS box model is one of the most fundamental concepts in CSS. Understanding it is essential for controlling layout and spacing. Every single element on a webpage is a rectangular box!

::: tip Why the Box Model Matters
The box model affects EVERYTHING about how elements take up space:
- How much room an element needs
- How elements are spaced from each other
- Where borders and backgrounds appear
- Why your layouts sometimes "break"
:::

## Understanding the Box Model

Every HTML element is a rectangular box. The box model consists of:

1. **Content** - The actual content (text, images)
2. **Padding** - Space between content and border
3. **Border** - The border around padding
4. **Margin** - Space outside the border

```
┌─────────────────────────────────────┐
│              MARGIN                 │
│   ┌─────────────────────────────┐   │
│   │          BORDER             │   │
│   │   ┌─────────────────────┐   │   │
│   │   │      PADDING        │   │   │
│   │   │   ┌─────────────┐   │   │   │
│   │   │   │   CONTENT   │   │   │   │
│   │   │   └─────────────┘   │   │   │
│   │   └─────────────────────┘   │   │
│   └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

## Box Sizing

### Content-Box (Default)

Width and height only apply to content:

```css
.content-box {
    box-sizing: content-box;
    width: 300px;
    padding: 20px;
    border: 5px solid black;
    /* Total width: 300 + 40 + 10 = 350px */
}
```

### Border-Box (Recommended)

Width and height include padding and border:

```css
.border-box {
    box-sizing: border-box;
    width: 300px;
    padding: 20px;
    border: 5px solid black;
    /* Total width: 300px (content shrinks to 250px) */
}
```

### Universal Reset

```css
*, *::before, *::after {
    box-sizing: border-box;
}
```

::: tip
Always use `box-sizing: border-box` for predictable sizing. Include it in your CSS reset.
:::

## Width and Height

### Basic Sizing

```css
.sizing {
    width: 300px;
    height: 200px;

    /* Percentage of parent */
    width: 50%;
    height: 100%;

    /* Viewport units */
    width: 100vw;
    height: 100vh;

    /* Auto */
    width: auto;  /* Default for block elements */
    height: auto; /* Fits content */
}
```

### Min and Max

```css
.constrained {
    width: 100%;
    max-width: 1200px;  /* Won't exceed 1200px */
    min-width: 320px;   /* Won't go below 320px */

    height: auto;
    min-height: 100vh;  /* At least full viewport */
    max-height: 500px;  /* Won't exceed 500px */
}
```

### Common Patterns

```css
/* Centered container with max width */
.container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

/* Responsive image */
img {
    max-width: 100%;
    height: auto;
}

/* Full viewport section */
.hero {
    min-height: 100vh;
}
```

## Padding

Space between content and border.

### Individual Sides

```css
.padding-individual {
    padding-top: 10px;
    padding-right: 20px;
    padding-bottom: 10px;
    padding-left: 20px;
}
```

### Shorthand

```css
.padding-shorthand {
    /* All sides */
    padding: 20px;

    /* Vertical | Horizontal */
    padding: 10px 20px;

    /* Top | Horizontal | Bottom */
    padding: 10px 20px 30px;

    /* Top | Right | Bottom | Left (clockwise) */
    padding: 10px 20px 30px 40px;
}
```

### Percentage Padding

```css
.percentage-padding {
    /* Percentage based on PARENT'S WIDTH */
    padding: 5%;
    padding-top: 10%;  /* Also based on width! */
}
```

::: tip
Percentage padding is always calculated based on the parent's width, even for vertical padding. This is useful for aspect ratio boxes.
:::

### Aspect Ratio Box

```css
/* 16:9 aspect ratio */
.video-container {
    position: relative;
    padding-top: 56.25%;  /* 9/16 = 0.5625 */
}

.video-container iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}

/* Modern approach */
.video-modern {
    aspect-ratio: 16 / 9;
}
```

## Margin

Space outside the border.

### Individual Sides

```css
.margin-individual {
    margin-top: 20px;
    margin-right: 15px;
    margin-bottom: 20px;
    margin-left: 15px;
}
```

### Shorthand

```css
.margin-shorthand {
    /* All sides */
    margin: 20px;

    /* Vertical | Horizontal */
    margin: 10px 20px;

    /* Top | Horizontal | Bottom */
    margin: 10px 20px 30px;

    /* Top | Right | Bottom | Left */
    margin: 10px 20px 30px 40px;
}
```

### Auto Margin

```css
/* Center horizontally */
.centered {
    width: 300px;
    margin: 0 auto;
}

/* Push to right */
.push-right {
    margin-left: auto;
}

/* Center with flexbox */
.flex-center {
    display: flex;
}
.flex-center .item {
    margin: auto;  /* Centers in both directions */
}
```

### Negative Margins

```css
.negative-margin {
    margin-top: -20px;  /* Pulls element up */
    margin-left: -10px; /* Pulls element left */
}

/* Overlap effect */
.overlap {
    margin-top: -50px;
    position: relative;
    z-index: 1;
}
```

## Margin Collapse

Vertical margins collapse into a single margin:

```css
.first {
    margin-bottom: 30px;
}

.second {
    margin-top: 20px;
}
/* Gap between them is 30px, not 50px */
```

### When Margins Collapse

- Adjacent siblings
- Parent and first/last child (if no padding/border)
- Empty blocks

### Preventing Collapse

```css
/* Add padding or border */
.parent {
    padding-top: 1px;
}

/* Use flexbox or grid */
.parent {
    display: flex;
    flex-direction: column;
}

/* Use overflow */
.parent {
    overflow: hidden;
}
```

## Border

### Border Properties

```css
.border-full {
    border-width: 2px;
    border-style: solid;
    border-color: #333;
}
```

### Border Shorthand

```css
.border-shorthand {
    /* width | style | color */
    border: 2px solid #333;
}
```

### Border Styles

```css
.border-styles {
    border-style: none;
    border-style: solid;
    border-style: dashed;
    border-style: dotted;
    border-style: double;
    border-style: groove;
    border-style: ridge;
    border-style: inset;
    border-style: outset;
}
```

### Individual Borders

```css
.individual-borders {
    border-top: 2px solid red;
    border-right: 3px dashed green;
    border-bottom: 4px dotted blue;
    border-left: 5px double orange;
}
```

### Border Radius

```css
.border-radius {
    border-radius: 10px;           /* All corners */
    border-radius: 50%;            /* Circle/ellipse */
    border-radius: 10px 20px;      /* TL+BR | TR+BL */
    border-radius: 10px 20px 30px 40px; /* TL | TR | BR | BL */
}

/* Individual corners */
.corners {
    border-top-left-radius: 10px;
    border-top-right-radius: 20px;
    border-bottom-right-radius: 30px;
    border-bottom-left-radius: 40px;
}

/* Elliptical corners */
.elliptical {
    border-radius: 50px / 25px;  /* Horizontal / Vertical */
}
```

## Outline

Similar to border but doesn't affect layout:

```css
.outline {
    outline: 2px solid blue;
    outline-offset: 5px;  /* Space between element and outline */
}

/* Focus styles */
button:focus {
    outline: 2px solid #007bff;
    outline-offset: 2px;
}

/* Remove default (provide alternative!) */
button:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.5);
}
```

## Box Shadow

```css
.shadow {
    /* offset-x | offset-y | color */
    box-shadow: 5px 5px rgba(0, 0, 0, 0.3);

    /* offset-x | offset-y | blur | color */
    box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.3);

    /* offset-x | offset-y | blur | spread | color */
    box-shadow: 5px 5px 10px 2px rgba(0, 0, 0, 0.3);

    /* Inset shadow */
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2);
}
```

### Multiple Shadows

```css
.multi-shadow {
    box-shadow:
        0 1px 3px rgba(0, 0, 0, 0.12),
        0 1px 2px rgba(0, 0, 0, 0.24);
}
```

### Common Shadow Patterns

```css
/* Subtle elevation */
.card {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Medium elevation */
.dropdown {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* High elevation */
.modal {
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}
```

## Overflow

Control content that exceeds the box:

```css
.overflow {
    overflow: visible;  /* Default - content overflows */
    overflow: hidden;   /* Clip content */
    overflow: scroll;   /* Always show scrollbars */
    overflow: auto;     /* Scrollbars when needed */
}

/* Individual axes */
.scroll-horizontal {
    overflow-x: auto;
    overflow-y: hidden;
}
```

## Practice Exercise

Create a card component:

```css
.card {
    box-sizing: border-box;
    width: 100%;
    max-width: 350px;
    margin: 20px;
    padding: 0;
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    overflow: hidden;
}

.card-image {
    width: 100%;
    height: 200px;
    object-fit: cover;
}

.card-content {
    padding: 20px;
}

.card-title {
    margin: 0 0 10px 0;
    font-size: 1.25rem;
}

.card-text {
    margin: 0 0 15px 0;
    color: #666;
}

.card-button {
    display: inline-block;
    padding: 10px 20px;
    border: none;
    border-radius: 6px;
    background: #007bff;
    color: white;
    cursor: pointer;
}

.card-button:hover {
    background: #0056b3;
}
```
