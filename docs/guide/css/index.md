# CSS Tutorial

::: info Official Documentation
This tutorial is based on MDN Web Docs. For the most up-to-date information, visit: [https://developer.mozilla.org/en-US/docs/Web/CSS](https://developer.mozilla.org/en-US/docs/Web/CSS)
:::

Welcome to the comprehensive CSS tutorial! Learn how to style and design beautiful web pages.

## What is CSS?

**CSS (Cascading Style Sheets)** is the language used to style and layout web pages. While HTML provides the structure and content of a webpage (like the skeleton and organs of a body), CSS is like the clothing, makeup, and accessories that make it look beautiful.

### Think of it This Way

Imagine building a house:
- **HTML** = The structure (walls, rooms, doors, windows)
- **CSS** = The decoration (paint colors, furniture arrangement, curtains, lighting)
- **JavaScript** = The functionality (electricity, plumbing, smart home features)

Without CSS, websites would look like plain text documents from the 1990s. CSS transforms boring content into engaging, visually appealing experiences.

### What Can CSS Do?

| Capability | Examples |
|------------|----------|
| **Colors** | Text color, background colors, gradients |
| **Layout** | Position elements, create columns, center content |
| **Typography** | Fonts, sizes, line spacing, text decoration |
| **Spacing** | Margins, padding, gaps between elements |
| **Effects** | Shadows, rounded corners, transparency |
| **Animation** | Transitions, keyframe animations, transforms |
| **Responsive** | Adapt layouts for different screen sizes |

### Before and After CSS

```html
<!-- Without CSS: Plain, unstyled HTML -->
<button>Click Me</button>
```

The button above would appear as a basic gray rectangle with default browser styling.

```css
/* With CSS: Styled, attractive button */
.button {
    background-color: #007bff;    /* Blue background */
    color: white;                  /* White text */
    padding: 10px 20px;           /* Inner spacing */
    border: none;                  /* Remove default border */
    border-radius: 5px;           /* Rounded corners */
    font-size: 16px;              /* Text size */
    cursor: pointer;              /* Hand cursor on hover */
    transition: background 0.3s;  /* Smooth color change */
}

.button:hover {
    background-color: #0056b3;    /* Darker blue on hover */
}
```

::: tip The Power of CSS
With just a few lines of CSS, a plain button transforms into a professional, interactive element that users want to click!
:::

### Complete Example

```css
/* Basic CSS Example */
body {
    font-family: Arial, sans-serif;  /* Set readable font */
    background-color: #f0f0f0;       /* Light gray background */
    margin: 0;                        /* Remove default margin */
    padding: 20px;                    /* Add some breathing room */
}

h1 {
    color: #333;           /* Dark gray text */
    text-align: center;    /* Center the heading */
    margin-bottom: 30px;   /* Space below heading */
}

.button {
    background-color: #007bff;
    color: white;
    padding: 10px 20px;
    border-radius: 5px;
}
```

## Tutorial Structure

This tutorial is organized into three levels. Each level builds upon the previous one, so we recommend following the order if you're new to CSS.

### Beginner Level

Start here if you're new to CSS. These fundamentals are essential for everything that follows.

| Chapter | Topic | What You'll Learn |
|---------|-------|-------------------|
| 1 | [Basics](/guide/css/01-basics) | Selectors, properties, values - the building blocks of CSS |
| 2 | [Colors & Backgrounds](/guide/css/02-colors) | Color formats, gradients, background images |
| 3 | [Typography](/guide/css/03-typography) | Fonts, text styling, readability |

### Intermediate Level

Once you're comfortable with the basics, learn how to control spacing and positioning.

| Chapter | Topic | What You'll Learn |
|---------|-------|-------------------|
| 4 | [Box Model](/guide/css/04-box-model) | Margins, padding, borders - how elements take up space |
| 5 | [Layout](/guide/css/05-layout) | Display types, positioning, document flow |
| 6 | [Flexbox](/guide/css/06-flexbox) | One-dimensional layouts made easy |

### Advanced Level

Master modern CSS techniques used by professional developers.

| Chapter | Topic | What You'll Learn |
|---------|-------|-------------------|
| 7 | [Grid](/guide/css/07-grid) | Two-dimensional layouts for complex designs |
| 8 | [Responsive Design](/guide/css/08-responsive) | Media queries, mobile-first approach |
| 9 | [Animations](/guide/css/09-animations) | Transitions, keyframes, transforms |
| 10 | [Advanced Techniques](/guide/css/10-advanced) | CSS variables, functions, best practices |

::: warning Learning Path Recommendation
Don't skip ahead! CSS concepts build upon each other. Understanding the Box Model (Chapter 4) is essential before tackling Flexbox or Grid.
:::

## Prerequisites

Before starting this CSS tutorial, make sure you have:

| Requirement | Why It's Needed |
|-------------|-----------------|
| **Basic HTML knowledge** | CSS styles HTML elements - you need to understand tags, attributes, and document structure |
| **Text editor** | VS Code is recommended (free, powerful, great CSS support) |
| **Web browser** | Chrome, Firefox, or Edge with developer tools for testing |
| **Curiosity** | Willingness to experiment and break things! |

::: info New to HTML?
If you haven't learned HTML yet, we recommend completing our [HTML Tutorial](/guide/html/) first. CSS and HTML work together, and trying to learn CSS without HTML is like trying to decorate a house that doesn't exist yet.
:::

## Getting Started

### How CSS Connects to HTML

Think of HTML and CSS as a partnership:
- **HTML** creates elements (a paragraph, a button, a heading)
- **CSS** tells those elements how to look (blue text, rounded corners, centered)

CSS needs a way to "connect" to your HTML. There are three methods, each with different use cases:

### Adding CSS to HTML

There are three ways to add CSS to your HTML:

#### 1. Inline CSS

**What it is:** CSS written directly inside an HTML element using the `style` attribute.

```html
<p style="color: blue; font-size: 16px;">Styled text</p>
```

| Pros | Cons |
|------|------|
| Quick for testing | Hard to maintain |
| Highest specificity | Mixes content with presentation |
| No extra files needed | Cannot reuse styles |

::: warning When to Use Inline CSS
Only use inline CSS for quick tests or when you need to override other styles. It's generally considered bad practice for production code.
:::

#### 2. Internal CSS (in `<head>`)

**What it is:** CSS written inside `<style>` tags in the HTML document's `<head>` section.

```html
<!DOCTYPE html>
<html>
<head>
    <style>
        /* All paragraphs on this page will be blue */
        p {
            color: blue;
            font-size: 16px;
        }
    </style>
</head>
<body>
    <p>Styled text</p>
    <p>This paragraph is also blue!</p>
</body>
</html>
```

| Pros | Cons |
|------|------|
| Styles multiple elements at once | Only works for one HTML file |
| Good for single-page sites | Cannot share styles between pages |
| No extra HTTP request | Increases HTML file size |

#### 3. External CSS (Recommended)

**What it is:** CSS written in a separate `.css` file and linked to HTML using the `<link>` tag.

```html
<!-- index.html -->
<!DOCTYPE html>
<html>
<head>
    <!-- This line connects your CSS file -->
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <p>Styled text</p>
</body>
</html>
```

```css
/* styles.css - A separate file */
p {
    color: blue;
    font-size: 16px;
}
```

| Pros | Cons |
|------|------|
| Reusable across multiple pages | Requires additional HTTP request |
| Clean separation of concerns | Slightly more setup |
| Browser caching improves performance | Must manage multiple files |
| Easier to maintain | - |

::: tip Best Practice
External CSS files are the **industry standard** for professional web development. They keep your code organized, maintainable, and allow browsers to cache styles for faster page loads.
:::

### Comparison Summary

| Method | Best For | Avoid When |
|--------|----------|------------|
| **Inline** | Quick debugging, email templates | Building maintainable websites |
| **Internal** | Single-page sites, prototypes | Multi-page websites |
| **External** | All production websites | Very small one-off pages |

## CSS Syntax

Understanding CSS syntax is like learning the grammar of a new language. Once you know the rules, everything else becomes easier.

### Anatomy of a CSS Rule

CSS rules consist of **selectors** and **declarations**:

```css
selector {
    property: value;    /* This is a declaration */
    property: value;    /* Another declaration */
}
```

### Visual Breakdown

```css
/*  SELECTOR     DECLARATION BLOCK
    ↓            ↓                    */
    h1       {   color: blue;   }
/*               ↑       ↑
              PROPERTY  VALUE         */
```

### Components Explained

| Component | Description | Example |
|-----------|-------------|---------|
| **Selector** | Targets which HTML elements to style | `h1`, `.button`, `#header` |
| **Declaration Block** | Contains all the style rules (inside `{ }`) | `{ color: blue; }` |
| **Property** | The aspect you want to change | `color`, `font-size`, `margin` |
| **Value** | The setting for that property | `blue`, `16px`, `10px` |
| **Declaration** | A complete property-value pair | `color: blue;` |

### Syntax Rules to Remember

```css
/* Rule 1: Declarations end with semicolons */
p {
    color: blue;     /* ← Semicolon here */
    font-size: 16px; /* ← And here */
}

/* Rule 2: Properties and values are separated by colons */
h1 {
    color: red;      /* ← Colon between property and value */
}

/* Rule 3: Multiple selectors can share styles */
h1, h2, h3 {         /* ← Comma-separated selectors */
    font-family: Arial;
}

/* Rule 4: Comments use /* */ syntax */
/* This is a CSS comment - ignored by the browser */
```

::: danger Common Mistakes
```css
/* WRONG - Missing semicolon */
p { color: blue }

/* WRONG - Using equals instead of colon */
p { color = blue; }

/* WRONG - Missing closing brace */
p { color: blue;

/* CORRECT */
p { color: blue; }
```
:::

## The Cascade

CSS stands for **Cascading** Style Sheets. But what does "cascading" mean?

### The Waterfall Analogy

Imagine a waterfall flowing down a mountain. Water at the top flows down and can be "overwritten" by water joining from other streams below. CSS works similarly - styles "flow" down and can be overwritten by other rules.

### What Happens When Multiple Rules Apply?

When multiple CSS rules target the same element, the browser needs to decide which one wins. This decision follows three main principles:

### 1. Specificity - The More Specific Rule Wins

Think of specificity like addressing a letter:
- "Someone in the USA" (very general)
- "Someone in New York" (more specific)
- "John Smith at 123 Main St, New York" (very specific)

The more specific address always wins!

```css
/* Specificity: 0-0-1 (just element) */
p { color: blue; }

/* Specificity: 0-1-1 (class + element) - WINS! */
p.intro { color: red; }

/* Specificity: 1-0-0 (ID) - WINS over classes! */
#special { color: green; }
```

### Specificity Scoring

| Selector Type | Example | Score |
|---------------|---------|-------|
| Element | `p`, `div`, `h1` | 0-0-1 |
| Class | `.button`, `.header` | 0-1-0 |
| ID | `#navbar`, `#main` | 1-0-0 |
| Inline style | `style="..."` | 1-0-0-0 |

::: tip Calculating Specificity
Count each type separately. `div.container#main` = 1 ID + 1 class + 1 element = 1-1-1
:::

### 2. Source Order - Later Rules Override Earlier Ones

When two rules have the same specificity, the one that comes **last** wins:

```css
p { color: blue; }   /* First */
p { color: red; }    /* Last - THIS WINS! */
```

### 3. Importance - The `!important` Override

`!important` overrides everything else (but use it sparingly!):

```css
p { color: blue !important; }  /* This wins over everything */
p#special { color: red; }       /* Even this won't override */
```

::: danger Avoid `!important`
Using `!important` is like shouting in a conversation. It works, but it makes your code harder to maintain. Only use it as a last resort.
:::

### Cascade Priority (Highest to Lowest)

1. `!important` declarations
2. Inline styles (`style="..."`)
3. ID selectors (`#id`)
4. Class selectors (`.class`)
5. Element selectors (`p`, `div`)
6. Universal selector (`*`)

## Common CSS Properties Reference

Here are some frequently used CSS properties to get you started:

| Category | Property | What It Does | Example |
|----------|----------|--------------|---------|
| **Color** | `color` | Text color | `color: #333;` |
| | `background-color` | Background color | `background-color: #f0f0f0;` |
| **Text** | `font-size` | Text size | `font-size: 16px;` |
| | `font-family` | Font type | `font-family: Arial;` |
| | `text-align` | Text alignment | `text-align: center;` |
| **Spacing** | `margin` | Outside spacing | `margin: 10px;` |
| | `padding` | Inside spacing | `padding: 20px;` |
| **Size** | `width` | Element width | `width: 100%;` |
| | `height` | Element height | `height: 200px;` |
| **Border** | `border` | Element border | `border: 1px solid black;` |
| | `border-radius` | Rounded corners | `border-radius: 5px;` |

## Your First CSS Challenge

Try creating this simple styled card:

```html
<!-- HTML -->
<div class="card">
    <h2>Hello CSS!</h2>
    <p>I'm learning to style web pages.</p>
</div>
```

```css
/* CSS */
.card {
    background-color: white;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 20px;
    max-width: 300px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.card h2 {
    color: #333;
    margin-top: 0;
}

.card p {
    color: #666;
    line-height: 1.5;
}
```

::: info Practice Makes Perfect
The best way to learn CSS is by experimenting. Change values, break things, and see what happens!
:::

## Video Tutorials

::: tip Recommended Video Resources
Learn CSS through these excellent video tutorials from the community.
:::

### Free Courses

| Course | Creator | Description |
|--------|---------|-------------|
| [CSS Full Course](https://www.youtube.com/watch?v=OXGznpKZ_sA) | freeCodeCamp | 11-hour comprehensive CSS course |
| [CSS Crash Course](https://www.youtube.com/watch?v=yfoY53QXEnI) | Traversy Media | 1-hour beginner crash course |
| [CSS Tutorial for Beginners](https://www.youtube.com/watch?v=1PnVor36_40) | Dave Gray | 9-hour complete course |
| [CSS in 100 Seconds](https://www.youtube.com/watch?v=OEV8gMkCHXQ) | Fireship | Quick 100-second explanation |

### Official Resources

| Resource | Description |
|----------|-------------|
| [MDN CSS Basics](https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/CSS_basics) | Mozilla's official CSS learning path |
| [CSS-Tricks](https://css-tricks.com/) | Excellent CSS tutorials and guides |

### Topic-Specific Videos

| Topic | Video | Duration |
|-------|-------|----------|
| Flexbox | [Flexbox Tutorial](https://www.youtube.com/watch?v=fYq5PXgSsbE) | ~20 min |
| CSS Grid | [CSS Grid Tutorial](https://www.youtube.com/watch?v=EFafSYg-PkI) | ~18 min |
| Animations | [CSS Animations](https://www.youtube.com/watch?v=YszONjKpgg4) | ~30 min |
| Responsive Design | [Responsive Web Design](https://www.youtube.com/watch?v=srvUrASNj0s) | ~1 hour |

## Next Steps

Ready to dive deeper? Start with [Chapter 1: CSS Basics](/guide/css/01-basics) to learn about selectors, properties, and values in detail.

Let's begin your CSS journey!
