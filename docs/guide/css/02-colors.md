# Colors & Backgrounds

Learn how to work with colors and backgrounds in CSS.

## Introduction

Color is one of the most powerful tools in web design. It creates mood, guides attention, establishes brand identity, and affects usability. In this chapter, you'll learn all the ways CSS lets you work with color.

::: tip Why Colors Matter
Studies show that color can increase brand recognition by up to 80% and affects purchasing decisions by 85%. Getting colors right is crucial for effective web design!
:::

## Color Values

CSS supports multiple ways to specify colors. Each method has its advantages.

### Quick Comparison

| Format | Example | Best For |
|--------|---------|----------|
| Named | `red` | Quick prototyping |
| Hex | `#ff0000` | Most common in production |
| RGB | `rgb(255, 0, 0)` | When you need calculations |
| RGBA | `rgba(255, 0, 0, 0.5)` | Colors with transparency |
| HSL | `hsl(0, 100%, 50%)` | Creating color variations |
| HSLA | `hsla(0, 100%, 50%, 0.5)` | HSL with transparency |

### Named Colors

CSS has 147 predefined color names. These are easy to remember but limited.

```css
.examples {
    color: red;
    color: blue;
    color: green;
    color: coral;
    color: darkslategray;
    color: rebeccapurple;  /* Named after CSS pioneer Eric Meyer's daughter */
}
```

**Common Named Colors:**

| Color | Name | Hex Equivalent |
|-------|------|----------------|
| <span style="color: red">■</span> | `red` | #ff0000 |
| <span style="color: blue">■</span> | `blue` | #0000ff |
| <span style="color: green">■</span> | `green` | #008000 |
| <span style="color: orange">■</span> | `orange` | #ffa500 |
| <span style="color: purple">■</span> | `purple` | #800080 |
| <span style="color: gray">■</span> | `gray` | #808080 |

::: warning Limited Palette
Named colors are convenient but limiting. For precise brand colors or custom designs, use hex or RGB values.
:::

### Hexadecimal Colors

**The most popular color format in CSS.** Hex codes represent RGB values using hexadecimal (base-16) numbers.

**Structure:** `#RRGGBB` - Two digits each for Red, Green, Blue

```css
.hex-colors {
    color: #ff0000;  /* Red: ff=255, 00=0, 00=0 */
    color: #00ff00;  /* Green: 00=0, ff=255, 00=0 */
    color: #0000ff;  /* Blue: 00=0, 00=0, ff=255 */
    color: #ffffff;  /* White: all at maximum */
    color: #000000;  /* Black: all at zero */
    color: #808080;  /* Gray: all at middle (128) */
}
```

**How Hex Works:**

| Hex Value | Decimal | Meaning |
|-----------|---------|---------|
| `00` | 0 | No color |
| `80` | 128 | Half intensity |
| `ff` | 255 | Full intensity |

```
#ff6b35
 │││││└── Blue: 35 (53 in decimal)
 │││└└── Green: 6b (107 in decimal)
 └└└── Red: ff (255 in decimal)
```

### Shorthand Hex

When each pair of digits is the same, you can use 3-digit shorthand:

```css
.shorthand {
    color: #f00;    /* Expands to #ff0000 (Red) */
    color: #0f0;    /* Expands to #00ff00 (Green) */
    color: #00f;    /* Expands to #0000ff (Blue) */
    color: #fff;    /* Expands to #ffffff (White) */
    color: #000;    /* Expands to #000000 (Black) */
    color: #369;    /* Expands to #336699 */
}
```

**8-digit Hex (with transparency):**
```css
.transparent {
    color: #ff000080;  /* Red with 50% opacity */
    /*           ││
                 └└── Alpha: 80 = ~50% opacity */
}
```

::: tip Pro Tip
Use a color picker tool or browser DevTools to find hex values. Memorizing common grays is useful:
- `#333` = Dark gray (text)
- `#666` = Medium gray (secondary text)
- `#999` = Light gray (disabled)
- `#ccc` = Very light gray (borders)
- `#f5f5f5` = Off-white (backgrounds)
:::

### RGB and RGBA

**RGB** = Red, Green, Blue - each value ranges from 0 to 255.

```css
.rgb-colors {
    color: rgb(255, 0, 0);      /* Red: max red, no green, no blue */
    color: rgb(0, 255, 0);      /* Green: no red, max green, no blue */
    color: rgb(0, 0, 255);      /* Blue: no red, no green, max blue */
    color: rgb(128, 128, 128);  /* Gray: equal amounts of all */
    color: rgb(255, 255, 0);    /* Yellow: red + green */
    color: rgb(255, 0, 255);    /* Magenta: red + blue */
    color: rgb(0, 255, 255);    /* Cyan: green + blue */
}
```

**RGBA** = RGB with Alpha (transparency). Alpha ranges from 0 (invisible) to 1 (solid).

```css
.rgba-colors {
    color: rgba(255, 0, 0, 1);     /* Solid red (100% visible) */
    color: rgba(255, 0, 0, 0.5);   /* 50% transparent red */
    color: rgba(255, 0, 0, 0.25);  /* 25% transparent red */
    color: rgba(0, 0, 0, 0.3);     /* 30% black - great for overlays */
}
```

**Common Use Cases for RGBA:**
```css
/* Semi-transparent overlay */
.overlay {
    background: rgba(0, 0, 0, 0.5);  /* 50% black overlay */
}

/* Subtle shadows */
.card {
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

/* Hover effects */
.button:hover {
    background: rgba(255, 255, 255, 0.1);  /* Subtle white highlight */
}
```

### HSL and HSLA

**HSL** = Hue, Saturation, Lightness - a more intuitive color model!

- **Hue**: The color itself (0-360 degrees on a color wheel)
- **Saturation**: How vivid the color is (0% = gray, 100% = full color)
- **Lightness**: How light or dark (0% = black, 50% = pure color, 100% = white)

```
Hue Color Wheel:
0°/360° = Red
60° = Yellow
120° = Green
180° = Cyan
240° = Blue
300° = Magenta
```

```css
.hsl-colors {
    color: hsl(0, 100%, 50%);     /* Pure Red */
    color: hsl(120, 100%, 50%);   /* Pure Green */
    color: hsl(240, 100%, 50%);   /* Pure Blue */
    color: hsl(0, 0%, 50%);       /* Gray (no saturation) */
}

/* HSLA with alpha */
.hsla-colors {
    color: hsla(0, 100%, 50%, 0.5);  /* 50% transparent red */
}
```

### Why HSL is Powerful

HSL makes it easy to create color variations:

```css
:root {
    /* Start with a base color */
    --primary-hue: 210;  /* Blue */

    /* Create variations by adjusting lightness */
    --primary-light: hsl(210, 100%, 70%);   /* Lighter */
    --primary: hsl(210, 100%, 50%);          /* Base */
    --primary-dark: hsl(210, 100%, 30%);    /* Darker */

    /* Desaturated version for disabled states */
    --primary-muted: hsl(210, 30%, 50%);
}
```

::: tip HSL for Designers
HSL is often easier to work with because:
1. **Adjusting lightness** creates shades (darker) and tints (lighter)
2. **Adjusting saturation** makes colors more vivid or muted
3. **Changing hue** shifts to a completely different color
:::

## Color Properties

Now let's see how to apply colors to different parts of elements.

### Text Color

The `color` property sets the color of text content.

```css
/* Main text color - applied to body for inheritance */
body {
    color: #333;  /* Dark gray for readability */
}

/* Link colors with states */
a {
    color: #007bff;           /* Default link color */
}

a:visited {
    color: #6c757d;           /* Visited links */
}

a:hover {
    color: #0056b3;           /* Darker on hover */
}

/* Semantic colors */
.success { color: #28a745; }  /* Green for success */
.warning { color: #ffc107; }  /* Yellow for warnings */
.danger  { color: #dc3545; }  /* Red for errors */
.info    { color: #17a2b8; }  /* Blue for info */
```

::: tip Text Color Best Practices
- Never use pure black (`#000`) for body text - it's too harsh. Use `#333` or `#222`
- Ensure sufficient contrast for accessibility (WCAG recommends 4.5:1 ratio)
- Use semantic colors consistently (red for errors, green for success)
:::

### Background Color

The `background-color` property fills the element's background.

```css
/* Page background */
body {
    background-color: #f8f9fa;   /* Light gray - easier on eyes than white */
}

/* Card background */
.card {
    background-color: #ffffff;   /* White cards on gray background */
}

/* Highlight text */
.highlight {
    background-color: yellow;
}

/* Semi-transparent overlays */
.modal-backdrop {
    background-color: rgba(0, 0, 0, 0.5);  /* 50% black overlay */
}

/* Button states */
.button {
    background-color: #007bff;
}

.button:hover {
    background-color: #0056b3;  /* Darker on hover */
}

.button:disabled {
    background-color: #cccccc;  /* Gray when disabled */
}
```

### Transparent Backgrounds

```css
/* Fully transparent */
.glass {
    background-color: transparent;
}

/* Semi-transparent for "glassmorphism" effect */
.glass-card {
    background-color: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(10px);  /* Blur content behind */
}
```

### Border Color

```css
.border-example {
    border: 2px solid #ddd;
    border-color: #333;

    /* Individual sides */
    border-top-color: red;
    border-right-color: green;
    border-bottom-color: blue;
    border-left-color: orange;
}
```

## Background Properties

### Background Image

```css
.bg-image {
    background-image: url('path/to/image.jpg');
}
```

### Background Repeat

```css
.repeat-options {
    background-repeat: repeat;      /* Default - tiles both ways */
    background-repeat: repeat-x;    /* Tiles horizontally */
    background-repeat: repeat-y;    /* Tiles vertically */
    background-repeat: no-repeat;   /* No tiling */
    background-repeat: space;       /* Even spacing */
    background-repeat: round;       /* Resize to fit */
}
```

### Background Position

```css
.position-options {
    background-position: top left;
    background-position: center center;
    background-position: bottom right;
    background-position: 50% 50%;
    background-position: 20px 40px;
}
```

### Background Size

```css
.size-options {
    background-size: auto;        /* Original size */
    background-size: cover;       /* Cover entire element */
    background-size: contain;     /* Fit within element */
    background-size: 100px 200px; /* Specific dimensions */
    background-size: 50% auto;    /* Percentage */
}
```

### Background Attachment

```css
.attachment-options {
    background-attachment: scroll;  /* Scrolls with content */
    background-attachment: fixed;   /* Fixed to viewport */
    background-attachment: local;   /* Scrolls with element */
}
```

### Background Shorthand

```css
.shorthand {
    /* image position/size repeat attachment color */
    background: url('bg.jpg') center/cover no-repeat fixed #f0f0f0;
}

/* Common patterns */
.hero {
    background: url('hero.jpg') center/cover no-repeat;
}

.pattern {
    background: url('pattern.png') repeat #fff;
}
```

## Multiple Backgrounds

Stack multiple backgrounds (first listed is on top):

```css
.multi-bg {
    background:
        url('overlay.png') center/cover no-repeat,
        url('pattern.png') repeat,
        linear-gradient(to bottom, #333, #666);
}
```

## Gradients

### Linear Gradient

```css
.linear-examples {
    /* Top to bottom (default) */
    background: linear-gradient(#ff0000, #0000ff);

    /* With direction */
    background: linear-gradient(to right, #ff0000, #0000ff);
    background: linear-gradient(to bottom right, #ff0000, #0000ff);

    /* With angle */
    background: linear-gradient(45deg, #ff0000, #0000ff);

    /* Multiple color stops */
    background: linear-gradient(to right, red, orange, yellow, green, blue);

    /* With positions */
    background: linear-gradient(to right, red 0%, blue 50%, green 100%);
}
```

### Radial Gradient

```css
.radial-examples {
    /* Default: ellipse at center */
    background: radial-gradient(#ff0000, #0000ff);

    /* Circle */
    background: radial-gradient(circle, #ff0000, #0000ff);

    /* Position */
    background: radial-gradient(circle at top left, #ff0000, #0000ff);

    /* Size keywords */
    background: radial-gradient(circle closest-side, red, blue);
    background: radial-gradient(circle farthest-corner, red, blue);
}
```

### Conic Gradient

```css
.conic-examples {
    background: conic-gradient(red, yellow, green, blue, red);

    /* Pie chart effect */
    background: conic-gradient(
        red 0deg 90deg,
        blue 90deg 180deg,
        green 180deg 270deg,
        yellow 270deg 360deg
    );
}
```

## Opacity

### Element Opacity

```css
.opacity-examples {
    opacity: 1;     /* Fully visible */
    opacity: 0.5;   /* 50% transparent */
    opacity: 0;     /* Invisible */
}
```

::: tip
`opacity` affects the entire element including children. Use `rgba()` or `hsla()` for background-only transparency.
:::

### Comparison

```css
/* Entire element transparent */
.full-opacity {
    background-color: red;
    opacity: 0.5;
    /* Text is also 50% transparent */
}

/* Only background transparent */
.bg-only {
    background-color: rgba(255, 0, 0, 0.5);
    /* Text remains solid */
}
```

## Color Schemes

### Creating a Palette

```css
:root {
    /* Primary colors */
    --primary: #007bff;
    --primary-dark: #0056b3;
    --primary-light: #66b3ff;

    /* Secondary colors */
    --secondary: #6c757d;
    --secondary-dark: #545b62;

    /* Semantic colors */
    --success: #28a745;
    --warning: #ffc107;
    --danger: #dc3545;
    --info: #17a2b8;

    /* Neutrals */
    --white: #ffffff;
    --gray-100: #f8f9fa;
    --gray-200: #e9ecef;
    --gray-300: #dee2e6;
    --gray-800: #343a40;
    --black: #000000;
}

/* Usage */
.button-primary {
    background-color: var(--primary);
    color: var(--white);
}

.button-primary:hover {
    background-color: var(--primary-dark);
}
```

## Practice Exercise

### Challenge: Create a Gradient Button with Hover Effects

```css
.gradient-button {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 12px 24px;
    border: none;
    border-radius: 25px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.gradient-button:hover {
    background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}
```

### What You Practiced

- **Gradient backgrounds** with `linear-gradient()`
- **Hover transitions** for interactive feedback
- **RGBA** for semi-transparent shadows
- **Transform** for subtle lift effect

### Extra Challenges

1. Create a color scheme using CSS variables
2. Make a card with a semi-transparent overlay on a background image
3. Create a "glassmorphism" card effect using `backdrop-filter`
4. Build a progress bar with gradient colors

## Summary

| Concept | What You Learned |
|---------|------------------|
| **Color Formats** | Named, Hex, RGB, RGBA, HSL, HSLA |
| **Text Colors** | Using `color` for text |
| **Backgrounds** | `background-color`, images, gradients |
| **Transparency** | RGBA, HSLA, and `opacity` |
| **Gradients** | Linear, radial, and conic gradients |
| **Color Systems** | Creating palettes with CSS variables |

::: info Next Steps
Continue to [Typography](/guide/css/03-typography) to learn about fonts, text styling, and creating readable content!
:::
