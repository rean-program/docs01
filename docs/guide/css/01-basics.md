# CSS Basics

Learn the fundamentals of CSS including selectors, properties, and values.

## Introduction

Before diving into CSS selectors, let's understand why they're so important. Selectors are the "targeting system" of CSS - they tell the browser exactly which HTML elements should receive your styles. Mastering selectors is the foundation of writing efficient, maintainable CSS.

::: tip Why Selectors Matter
Imagine trying to give directions without being able to name streets or landmarks. Selectors are how you "point" at specific elements on your page. The more precise your selectors, the more control you have over your design.
:::

## CSS Selectors

Selectors are patterns used to select the HTML elements you want to style. Think of them as a way to "find" elements in your HTML document.

### Element Selector

**What it does:** Selects ALL elements of a given type (tag name).

**When to use:** When you want consistent styling across all instances of an element.

```css
/* Every paragraph on the page will be blue */
p {
    color: blue;
}

/* Every h1 heading will be 32px */
h1 {
    font-size: 32px;
}
```

| Element | What It Selects |
|---------|-----------------|
| `p` | All `<p>` paragraphs |
| `h1` | All `<h1>` headings |
| `div` | All `<div>` containers |
| `a` | All `<a>` links |
| `img` | All `<img>` images |

::: warning Be Careful
Element selectors are very broad. Using `div { color: red; }` will affect EVERY div on your page. For more targeted styling, use class or ID selectors.
:::

### Class Selector

**What it does:** Selects elements that have a specific class attribute. Classes are prefixed with a dot (`.`).

**When to use:** When you want to apply the same styles to multiple elements, or when you need reusable style "packages."

**The Analogy:** Think of classes like labels or tags. Just like you might tag a photo with "vacation" and "beach", you can tag HTML elements with multiple classes.

```html
<!-- HTML: Adding classes to elements -->
<p class="highlight">This is highlighted</p>
<p class="highlight important">This has two classes</p>
<span class="highlight">This span is also highlighted</span>
```

```css
/* CSS: Styling classes */
.highlight {
    background-color: yellow;
}

.important {
    font-weight: bold;
}

/* An element with both classes gets BOTH styles */
```

**Key Points About Classes:**
| Feature | Description |
|---------|-------------|
| Reusable | One class can be used on unlimited elements |
| Multiple | One element can have multiple classes |
| Naming | Use lowercase, hyphens for multi-word (`my-class`) |
| Specificity | Classes have medium specificity (higher than elements) |

::: info Best Practice
Classes are the workhorses of CSS. Professional developers use classes for almost all styling because they're reusable and have manageable specificity.
:::

### ID Selector

**What it does:** Selects a single, unique element with a specific ID. IDs are prefixed with a hash (`#`).

**When to use:** For unique elements that appear only once per page (like a main navigation, header, or footer).

```html
<!-- HTML: Each ID must be unique on the page -->
<div id="header">Site Header</div>
<div id="main-content">Main Content</div>
<div id="footer">Site Footer</div>
```

```css
/* CSS: Selecting by ID */
#header {
    background-color: #333;
    color: white;
}

#main-content {
    padding: 20px;
}
```

**Classes vs IDs:**
| Feature | Class (`.`) | ID (`#`) |
|---------|-------------|----------|
| Uniqueness | Can repeat | Must be unique |
| Usage | Multiple elements | Single element |
| Specificity | Medium (10) | High (100) |
| Recommendation | Preferred for styling | Use sparingly |

::: warning Important
IDs should be unique on a page - never use the same ID twice! While browsers may still work with duplicate IDs, it's invalid HTML and causes problems with JavaScript and accessibility.
:::

::: tip Professional Advice
Many developers avoid using IDs for styling altogether. IDs have very high specificity, making them hard to override. Save IDs for JavaScript targeting or anchor links, and use classes for CSS styling.
:::

### Universal Selector

**What it does:** Selects EVERY element on the page. Use the asterisk (`*`).

**When to use:** For CSS resets or applying box-sizing to all elements.

```css
/* Common CSS Reset Pattern */
* {
    margin: 0;           /* Remove default margins */
    padding: 0;          /* Remove default padding */
    box-sizing: border-box;  /* Include padding in width calculations */
}
```

::: danger Performance Warning
The universal selector affects every single element. Use it sparingly and only for global resets. Avoid using it with expensive properties or in combination with other selectors like `* > *`.
:::

## Combining Selectors

One of CSS's superpowers is the ability to combine selectors. This lets you target elements with surgical precision.

### Selector Combination Quick Reference

| Syntax | Name | What It Selects |
|--------|------|-----------------|
| `A, B` | Grouping | Elements matching A OR B |
| `A B` | Descendant | B elements inside A (any level) |
| `A > B` | Child | B elements directly inside A |
| `A + B` | Adjacent Sibling | B element immediately after A |
| `A ~ B` | General Sibling | All B elements after A |

### Grouping Selector

**What it does:** Applies the same styles to multiple selectors at once. Use commas (`,`) to separate selectors.

**When to use:** To avoid repeating the same styles for different elements.

```css
/* Without grouping - repetitive! */
h1 {
    font-family: Georgia, serif;
    color: #333;
}
h2 {
    font-family: Georgia, serif;
    color: #333;
}
h3 {
    font-family: Georgia, serif;
    color: #333;
}

/* With grouping - much cleaner! */
h1, h2, h3 {
    font-family: Georgia, serif;
    color: #333;
}
```

### Descendant Selector

**What it does:** Selects elements that are INSIDE other elements (at any nesting level). Use a space between selectors.

**The Analogy:** Like saying "find all the books in the library" - it doesn't matter which shelf or room they're on.

```css
/* All paragraphs inside article - any level deep */
article p {
    line-height: 1.6;
}

/* Links inside navigation */
nav a {
    text-decoration: none;
}
```

```html
<!-- Example HTML -->
<article>
    <p>This paragraph is selected</p>
    <div>
        <p>This paragraph is ALSO selected (nested deeper)</p>
    </div>
</article>
```

### Child Selector

**What it does:** Selects elements that are DIRECT children only (not grandchildren). Use `>` between selectors.

**The Analogy:** Like saying "find books on THIS shelf" - not books on shelves inside cabinets.

```css
/* Only direct paragraph children of article */
article > p {
    margin-bottom: 1em;
}
```

```html
<article>
    <p>✅ This IS selected (direct child)</p>
    <div>
        <p>❌ This is NOT selected (grandchild)</p>
    </div>
</article>
```

### Adjacent Sibling Selector

**What it does:** Selects an element that comes IMMEDIATELY after another element. Use `+` between selectors.

**When to use:** For styling elements based on what comes before them.

```css
/* Paragraph immediately after h2 */
h2 + p {
    font-size: 1.2em;
    font-weight: 500;
}
```

```html
<h2>Heading</h2>
<p>✅ This paragraph IS selected (immediately after h2)</p>
<p>❌ This paragraph is NOT selected (not immediately after)</p>
```

### General Sibling Selector

**What it does:** Selects ALL siblings that come after an element. Use `~` between selectors.

```css
/* All paragraphs that come after h2 (at the same level) */
h2 ~ p {
    color: #666;
}
```

```html
<h2>Heading</h2>
<p>✅ Selected</p>
<div>Not a paragraph</div>
<p>✅ Also selected</p>
```

## Attribute Selectors

**What they do:** Select elements based on their HTML attributes (like `href`, `type`, `title`, etc.).

**When to use:** For styling form inputs, links, or any element where the attribute value matters.

### Attribute Selector Types

| Selector | Meaning | Example |
|----------|---------|---------|
| `[attr]` | Has attribute | `[title]` - has title attribute |
| `[attr="value"]` | Exact match | `[type="text"]` - type is exactly "text" |
| `[attr*="value"]` | Contains | `[class*="btn"]` - class contains "btn" |
| `[attr^="value"]` | Starts with | `[href^="https"]` - href starts with "https" |
| `[attr$="value"]` | Ends with | `[src$=".png"]` - src ends with ".png" |
| `[attr~="value"]` | Word in list | `[class~="active"]` - class contains word "active" |

```css
/* Has attribute - any element with a title attribute */
[title] {
    cursor: help;
    border-bottom: 1px dotted;
}

/* Exact match - input type is exactly "text" */
[type="text"] {
    border: 1px solid #ccc;
    padding: 8px;
}

/* Contains - class contains "btn" anywhere */
[class*="btn"] {
    cursor: pointer;
}

/* Starts with - links to external sites (https) */
[href^="https"] {
    color: green;
}

/* Ends with - PNG images */
[src$=".png"] {
    border: 1px solid #ddd;
}
```

### Practical Examples

```css
/* Style all required form fields */
input[required] {
    border-left: 3px solid red;
}

/* Style all PDF download links */
a[href$=".pdf"]::after {
    content: " (PDF)";
    font-size: 0.8em;
}

/* Style external links */
a[href^="http"]:not([href*="yourdomain.com"]) {
    background: url('external-icon.svg') right center no-repeat;
    padding-right: 20px;
}
```

## Pseudo-classes

**What they are:** Pseudo-classes select elements based on their STATE or POSITION - things that aren't in the HTML itself.

**Syntax:** Pseudo-classes start with a single colon (`:`).

**The Analogy:** Think of pseudo-classes like describing someone's current activity: "the person who is *walking*" or "the *first* person in line."

### Interactive Pseudo-classes

These respond to user actions:

```css
/* Link states - in LVHA order! */
a:link {
    color: blue;      /* Unvisited link */
}

a:visited {
    color: purple;    /* Visited link */
}

a:hover {
    color: red;       /* Mouse over */
    text-decoration: underline;
}

a:active {
    color: orange;    /* Being clicked */
}

/* Form focus state */
input:focus {
    outline: 2px solid blue;
    border-color: blue;
}

/* Button states */
button:hover {
    background-color: darkblue;
}

button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}
```

::: tip LVHA Order
Link pseudo-classes MUST be in this order to work correctly: **L**ink, **V**isited, **H**over, **A**ctive. Remember: "**L**o**V**e **HA**te"
:::

### Form State Pseudo-classes

```css
/* Valid and invalid inputs */
input:valid {
    border-color: green;
}

input:invalid {
    border-color: red;
}

/* Checked checkboxes/radio buttons */
input:checked + label {
    font-weight: bold;
}

/* Placeholder shown */
input:placeholder-shown {
    border-style: dashed;
}
```

### Structural Pseudo-classes

Select elements based on their position in the DOM:

| Pseudo-class | Selects |
|--------------|---------|
| `:first-child` | First child of its parent |
| `:last-child` | Last child of its parent |
| `:nth-child(n)` | The nth child |
| `:nth-child(even)` | Even children (2, 4, 6...) |
| `:nth-child(odd)` | Odd children (1, 3, 5...) |
| `:nth-child(3n)` | Every 3rd child |
| `:only-child` | Only child (no siblings) |
| `:first-of-type` | First of its element type |
| `:last-of-type` | Last of its element type |

```css
/* First item in a list */
li:first-child {
    font-weight: bold;
}

/* Last item - no bottom border */
li:last-child {
    border-bottom: none;
}

/* Zebra stripe table rows */
tr:nth-child(even) {
    background-color: #f2f2f2;
}

/* Every 3rd item */
li:nth-child(3n) {
    color: red;
}

/* First 3 items */
li:nth-child(-n+3) {
    background: yellow;
}
```

### Understanding nth-child Formulas

```css
/* Formula: an + b
   a = cycle size
   b = offset
*/

:nth-child(3n)     /* Every 3rd: 3, 6, 9, 12... */
:nth-child(3n+1)   /* 3n, starting at 1: 1, 4, 7, 10... */
:nth-child(2n)     /* Every 2nd (even): 2, 4, 6, 8... */
:nth-child(2n+1)   /* Every 2nd, starting at 1 (odd): 1, 3, 5... */
:nth-child(-n+3)   /* First 3 items: 3, 2, 1 (counts down) */
:nth-child(n+4)    /* From 4th onward: 4, 5, 6, 7... */
```

## Pseudo-elements

**What they are:** Pseudo-elements let you style PARTS of an element or INSERT content that doesn't exist in HTML.

**Syntax:** Pseudo-elements use double colons (`::`).

**Key difference:** Pseudo-*classes* select whole elements in a state. Pseudo-*elements* select PART of an element or create virtual elements.

### Common Pseudo-elements

| Pseudo-element | What It Styles |
|----------------|----------------|
| `::first-line` | First line of text |
| `::first-letter` | First letter |
| `::before` | Inserted content before |
| `::after` | Inserted content after |
| `::selection` | Highlighted/selected text |
| `::placeholder` | Input placeholder text |

```css
/* First line of paragraph - great for articles */
p::first-line {
    font-weight: bold;
    font-variant: small-caps;
}

/* Drop cap effect - first letter */
p::first-letter {
    font-size: 3em;
    float: left;
    line-height: 1;
    margin-right: 0.1em;
    color: #333;
}

/* Custom text selection colors */
::selection {
    background-color: #007bff;
    color: white;
}

/* Style placeholder text */
input::placeholder {
    color: #999;
    font-style: italic;
}
```

### ::before and ::after

These pseudo-elements INSERT content before or after an element's actual content. They require the `content` property.

```css
/* Add quotation marks around quotes */
.quote::before {
    content: '"';
    font-size: 1.5em;
    color: #666;
}

.quote::after {
    content: '"';
    font-size: 1.5em;
    color: #666;
}

/* Add icon before external links */
a[href^="http"]::before {
    content: '🔗 ';
}

/* Required field asterisk */
.required::after {
    content: ' *';
    color: red;
}

/* Clearfix using ::after */
.clearfix::after {
    content: '';
    display: table;
    clear: both;
}
```

::: warning Content Property Required
`::before` and `::after` will NOT appear without the `content` property. Even if you want no visible content, use `content: ''`.
:::

### Creative Uses of Pseudo-elements

```css
/* Decorative line under heading */
h2::after {
    content: '';
    display: block;
    width: 50px;
    height: 3px;
    background: #007bff;
    margin-top: 10px;
}

/* Custom bullet points */
li::before {
    content: '✓';
    color: green;
    margin-right: 10px;
}

/* Tooltip using ::after */
.tooltip:hover::after {
    content: attr(data-tooltip);
    position: absolute;
    background: #333;
    color: white;
    padding: 5px 10px;
    border-radius: 4px;
}
```

## CSS Properties and Values

Now that you know how to SELECT elements, let's learn about WHAT you can change - properties and values.

### Understanding the Property: Value Pattern

Every CSS declaration follows this pattern:
```css
property: value;
```

- **Property:** What aspect you want to change (color, size, spacing, etc.)
- **Value:** What you want to change it to (blue, 16px, 10%, etc.)

### Common Properties

| Property | Description | Example Values |
|----------|-------------|----------------|
| `color` | Text color | `red`, `#ff0000`, `rgb(255,0,0)` |
| `background-color` | Background color | `blue`, `#0000ff` |
| `font-size` | Text size | `16px`, `1.5em`, `1rem` |
| `width` | Element width | `100px`, `50%`, `auto` |
| `height` | Element height | `200px`, `100vh` |
| `margin` | Outside spacing | `10px`, `1em auto` |
| `padding` | Inside spacing | `15px`, `10px 20px` |
| `border` | Element border | `1px solid black` |

### Value Types Explained

CSS has different types of values. Understanding these helps you know what values are valid for each property.

```css
.example {
    /* KEYWORDS - Predefined words with special meaning */
    display: block;         /* block, inline, flex, grid, none */
    position: relative;     /* static, relative, absolute, fixed */
    text-align: center;     /* left, center, right, justify */

    /* LENGTH UNITS - Sizes with units */
    width: 100px;           /* pixels - fixed size */
    font-size: 1.5em;       /* em - relative to parent font-size */
    padding: 1rem;          /* rem - relative to root font-size */
    height: 100vh;          /* vh - viewport height percentage */

    /* PERCENTAGES - Relative to parent */
    width: 50%;             /* 50% of parent's width */

    /* COLORS - Multiple formats available */
    color: red;                    /* Named color keyword */
    color: #ff0000;                /* Hex code (6 digits) */
    color: #f00;                   /* Hex code (3 digit shorthand) */
    color: rgb(255, 0, 0);         /* RGB function */
    color: rgba(255, 0, 0, 0.5);   /* RGBA with alpha/opacity */
    color: hsl(0, 100%, 50%);      /* HSL (hue, saturation, lightness) */

    /* URLS - For external resources */
    background-image: url('image.jpg');
    background-image: url('../images/photo.png');
}
```

### CSS Units Quick Reference

| Unit | Type | Relative To | Best For |
|------|------|-------------|----------|
| `px` | Absolute | Nothing (fixed) | Borders, small details |
| `em` | Relative | Parent element's font-size | Padding, margins |
| `rem` | Relative | Root (html) font-size | Font sizes, spacing |
| `%` | Relative | Parent element | Widths, responsive sizing |
| `vw` | Relative | Viewport width | Full-width sections |
| `vh` | Relative | Viewport height | Full-height sections |

::: tip Modern Best Practice
Use `rem` for font sizes and spacing. This makes your site more accessible because users can adjust base font size in their browser settings.
:::

## Specificity

**What it is:** Specificity is CSS's conflict resolution system. When multiple rules target the same element, specificity determines which rule wins.

**The Analogy:** Think of specificity like a voting system. Different selectors have different "voting power." The selector with the most votes wins.

### Specificity Hierarchy

Think of specificity as a 4-digit number: **`inline, ID, class, element`**

| Selector Type | Specificity Value | Example |
|---------------|-------------------|---------|
| Inline styles | 1-0-0-0 (1000) | `style="color: red"` |
| ID selector | 0-1-0-0 (100) | `#header` |
| Class, attribute, pseudo-class | 0-0-1-0 (10) | `.button`, `[type="text"]`, `:hover` |
| Element, pseudo-element | 0-0-0-1 (1) | `p`, `div`, `::before` |

### Calculating Specificity

Count each type of selector:

```css
/* Specificity: 0-0-0-1 (just one element) */
p { color: blue; }

/* Specificity: 0-0-1-0 (one class) */
.text { color: green; }

/* Specificity: 0-0-1-1 (one class + one element) */
p.text { color: red; }

/* Specificity: 0-1-0-0 (one ID) */
#main { color: purple; }

/* Specificity: 0-1-0-1 (one ID + one element) */
#main p { color: orange; }

/* Specificity: 0-1-1-1 (one ID + one class + one element) */
#main p.text { color: pink; }
```

### Visual Specificity Examples

```
Selector                    | Specificity    | Who Wins?
----------------------------|----------------|----------
p                           | 0-0-0-1        |
.intro                      | 0-0-1-0        | ← Wins vs p
p.intro                     | 0-0-1-1        | ← Wins vs .intro
#content                    | 0-1-0-0        | ← Wins vs p.intro
#content p.intro            | 0-1-1-1        | ← Wins vs #content
style="color: red"          | 1-0-0-0        | ← Wins vs everything
```

### Common Specificity Mistakes

```css
/* Problem: ID specificity is hard to override */
#navigation a { color: blue; }

/* This WON'T work - class is lower specificity than ID */
.active { color: red; } /* Won't override! */

/* Solution: Match or exceed the specificity */
#navigation a.active { color: red; } /* Works! */
```

::: danger The `!important` Escape Hatch
```css
p { color: red !important; }  /* Overrides everything */
```
`!important` wins over everything, but it makes your CSS very hard to maintain. It's like breaking the rules of the game - avoid it when possible!
:::

::: tip Best Practice
Keep specificity LOW and consistent. Use classes for most styling. This makes your CSS easier to maintain and override when needed.
:::

## Inheritance

**What it is:** Some CSS properties automatically pass down from parent elements to their children. This is CSS inheritance.

**The Analogy:** Like genetic inheritance - children inherit traits from their parents. A `<p>` inside a `<body>` inherits the body's text color.

### How Inheritance Works

```css
body {
    font-family: Arial, sans-serif;  /* Inherited by all text */
    color: #333;                      /* Inherited by all text */
}

/* All these automatically get Arial font and #333 color! */
/* <h1>, <p>, <span>, <a>, etc. */
```

```html
<body>                          <!-- font-family: Arial; color: #333 -->
    <article>                   <!-- Inherits both -->
        <h1>Title</h1>          <!-- Inherits both -->
        <p>                     <!-- Inherits both -->
            Some <span>text</span>  <!-- Inherits both -->
        </p>
    </article>
</body>
```

### What Gets Inherited (and What Doesn't)

**Generally inherited** (text-related properties):
| Property | Why It Makes Sense |
|----------|-------------------|
| `color` | All text should match by default |
| `font-family` | Consistent fonts throughout |
| `font-size` | Text sizing |
| `font-weight` | Bold/normal text |
| `line-height` | Text spacing |
| `text-align` | Text alignment |
| `visibility` | Show/hide content |
| `cursor` | Mouse cursor style |

**NOT inherited** (box/layout properties):
| Property | Why It Doesn't Inherit |
|----------|----------------------|
| `background` | Each box should have its own |
| `border` | Borders on every element would be chaos |
| `margin`, `padding` | Spacing is element-specific |
| `width`, `height` | Size is element-specific |
| `display`, `position` | Layout is element-specific |

### Controlling Inheritance

```css
/* Force inheritance - use parent's value */
.child {
    border: inherit;
}

/* Reset to default browser value */
.reset {
    color: initial;
}

/* Remove all inherited and non-inherited styles */
.clean-slate {
    all: unset;
}
```

::: tip Practical Use of Inheritance
Set global text styles on `body` and let them cascade down. This is more efficient than styling every element individually!
```css
body {
    font-family: 'Segoe UI', sans-serif;
    color: #333;
    line-height: 1.6;
}
/* Now all text elements inherit these values */
```
:::

## Practice Exercise

Let's put everything together! Create a styled card component using what you've learned.

### Challenge: Build a Card Component

```html
<div class="card">
    <h2 class="card-title">Card Title</h2>
    <p class="card-content">This is the card content. It explains what this card is about.</p>
    <a href="#" class="card-link">Read More</a>
</div>
```

```css
/* The card container */
.card {
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 20px;
    max-width: 300px;
    background-color: white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Card title - using descendant selector would also work */
.card-title {
    color: #333;
    margin-top: 0;
    margin-bottom: 10px;
    font-size: 1.25rem;
}

/* Card content */
.card-content {
    color: #666;
    line-height: 1.5;
    margin-bottom: 15px;
}

/* Card link with hover state */
.card-link {
    color: #007bff;
    text-decoration: none;
    font-weight: 500;
}

/* Pseudo-class for hover effect */
.card-link:hover {
    text-decoration: underline;
    color: #0056b3;
}
```

### What You Practiced

- **Class selectors** (`.card`, `.card-title`)
- **Multiple properties** (border, padding, color)
- **Pseudo-classes** (`:hover`)
- **Value types** (colors, units, keywords)

### Extra Challenges

Try these modifications to practice more:

1. **Add a `:first-child` selector** to make the first card different
2. **Use attribute selector** to style links that go to external sites
3. **Add `::before`** to add an icon before the "Read More" link
4. **Create a `.card:hover`** effect that lifts the card slightly

## Summary

Congratulations! You've learned the fundamentals of CSS:

| Concept | What You Learned |
|---------|------------------|
| **Selectors** | How to target elements (element, class, ID, attribute, pseudo) |
| **Combining** | Grouping, descendant, child, sibling selectors |
| **Properties** | What you can style (color, size, spacing, etc.) |
| **Values** | Different value types (keywords, lengths, colors) |
| **Specificity** | How CSS resolves conflicts |
| **Inheritance** | How properties pass to children |

::: info Next Steps
Now that you understand the basics, continue to [Colors & Backgrounds](/guide/css/02-colors) to learn about working with colors, gradients, and background images!
:::
