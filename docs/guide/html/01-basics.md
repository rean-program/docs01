# HTML Basics

Learn the fundamental building blocks of HTML - the structure and essential elements that form every web page.

## HTML Document Structure

Every HTML page follows this basic structure:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Page Title</title>
</head>
<body>
    <!-- Your content goes here -->
</body>
</html>
```

### Understanding Each Part

#### `<!DOCTYPE html>`
Tells the browser this is an HTML5 document.

#### `<html>`
The root element that contains all other elements.

```html
<html lang="en">
    <!-- All content goes inside -->
</html>
```

The `lang` attribute specifies the language (important for accessibility and SEO).

#### `<head>`
Contains metadata about the document:

```html
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Page description">
    <title>Page Title</title>
    <link rel="stylesheet" href="styles.css">
</head>
```

#### `<body>`
Contains all visible content:

```html
<body>
    <h1>Welcome</h1>
    <p>This is visible content.</p>
</body>
```

## HTML Elements

Elements are the building blocks of HTML:

```html
<tagname attribute="value">Content</tagname>
```

### Anatomy of an Element

```
<p class="intro">Hello World</p>
 │  │            │           │
 │  │            │           └── Closing tag
 │  │            └── Content
 │  └── Attribute
 └── Opening tag
```

### Types of Elements

#### Container Elements
Have opening and closing tags:

```html
<div>Content inside</div>
<p>Paragraph text</p>
<span>Inline content</span>
```

#### Self-Closing Elements
Don't have closing tags:

```html
<br>        <!-- Line break -->
<hr>        <!-- Horizontal rule -->
<img src="photo.jpg" alt="Photo">
<input type="text">
<meta charset="UTF-8">
```

::: tip
In HTML5, the trailing slash is optional: `<br>` and `<br />` are both valid.
:::

## Essential HTML Elements

### Headings

HTML has six levels of headings:

```html
<h1>Heading Level 1</h1>
<h2>Heading Level 2</h2>
<h3>Heading Level 3</h3>
<h4>Heading Level 4</h4>
<h5>Heading Level 5</h5>
<h6>Heading Level 6</h6>
```

::: warning
Use only one `<h1>` per page. Headings should follow a logical hierarchy (don't skip levels).
:::

### Paragraphs

```html
<p>This is a paragraph of text. It automatically adds
spacing above and below.</p>

<p>This is another paragraph. Each paragraph starts
on a new line.</p>
```

### Line Breaks and Horizontal Rules

```html
<p>Line one<br>Line two<br>Line three</p>

<hr>

<p>Content after the horizontal line.</p>
```

### Division and Span

```html
<!-- Block-level container -->
<div>
    <p>Content grouped together</p>
    <p>Another paragraph</p>
</div>

<!-- Inline container -->
<p>Some <span style="color: red;">highlighted</span> text.</p>
```

## Attributes

Attributes provide additional information about elements:

```html
<element attribute="value">Content</element>
```

### Common Attributes

#### id
Unique identifier for an element:

```html
<div id="header">Header content</div>
<p id="intro">Introduction paragraph</p>
```

::: warning
Each `id` must be unique on the page!
:::

#### class
Groups elements for styling:

```html
<p class="highlight">Highlighted text</p>
<p class="highlight important">Multiple classes</p>
```

#### style
Inline CSS styles:

```html
<p style="color: blue; font-size: 18px;">Styled text</p>
```

#### title
Tooltip text on hover:

```html
<p title="This appears on hover">Hover over me</p>
```

### Boolean Attributes

Some attributes don't need values:

```html
<input type="text" disabled>
<input type="checkbox" checked>
<video src="movie.mp4" autoplay muted></video>
```

### Data Attributes

Custom attributes for storing data:

```html
<div data-user-id="123" data-role="admin">
    User information
</div>
```

## Comments

Comments are not displayed in the browser:

```html
<!-- This is a single-line comment -->

<!--
    This is a
    multi-line comment
-->

<p>Visible content</p>
<!-- <p>This paragraph is commented out</p> -->
```

## Nesting Elements

Elements can contain other elements:

```html
<div>
    <h2>Section Title</h2>
    <p>This is a <strong>nested</strong> paragraph.</p>
    <div>
        <p>Deeply nested content</p>
    </div>
</div>
```

### Proper Nesting

```html
<!-- Correct -->
<p><strong>Bold text</strong></p>

<!-- Incorrect - tags must close in order -->
<p><strong>Bold text</p></strong>
```

## Block vs Inline Elements

### Block Elements
- Start on a new line
- Take full width available
- Can contain other block and inline elements

```html
<div>Block element</div>
<p>Paragraph is block</p>
<h1>Heading is block</h1>
<ul>List is block</ul>
```

### Inline Elements
- Don't start on a new line
- Only take necessary width
- Can only contain text or other inline elements

```html
<span>Inline element</span>
<strong>Bold is inline</strong>
<a href="#">Link is inline</a>
<img src="image.jpg" alt="Image is inline">
```

### Visual Example

```html
<div style="background: lightblue;">
    Block element (full width)
</div>
<span style="background: lightgreen;">Inline</span>
<span style="background: lightyellow;">Inline</span>
```

## Special Characters

Use HTML entities for special characters:

| Character | Entity | Description |
|-----------|--------|-------------|
| `<` | `&lt;` | Less than |
| `>` | `&gt;` | Greater than |
| `&` | `&amp;` | Ampersand |
| `"` | `&quot;` | Double quote |
| `'` | `&apos;` | Single quote |
| ` ` | `&nbsp;` | Non-breaking space |
| `©` | `&copy;` | Copyright |
| `®` | `&reg;` | Registered |
| `™` | `&trade;` | Trademark |

```html
<p>5 &lt; 10 and 10 &gt; 5</p>
<p>&copy; 2024 My Company</p>
<p>Use &amp; for ampersand</p>
```

## Complete Example

Here's a complete HTML page using what we've learned:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="My first complete HTML page">
    <title>My First Page</title>
</head>
<body>
    <!-- Header Section -->
    <div id="header">
        <h1>Welcome to My Website</h1>
        <p class="tagline">Learning HTML is <strong>fun</strong>!</p>
    </div>

    <hr>

    <!-- Main Content -->
    <div id="content">
        <h2>About This Page</h2>
        <p>This is my first HTML page. I'm learning about:</p>

        <div class="topic">
            <h3>HTML Elements</h3>
            <p>Elements are the building blocks of web pages.</p>
        </div>

        <div class="topic">
            <h3>Attributes</h3>
            <p>Attributes provide additional information about elements.</p>
        </div>
    </div>

    <!-- Footer -->
    <hr>
    <div id="footer">
        <p>&copy; 2024 My Website. All rights reserved.</p>
    </div>
</body>
</html>
```

## Exercises

### Exercise 1: Create a Basic Page
Create an HTML page with a heading, two paragraphs, and a horizontal rule between them.

::: details Solution
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>My Page</title>
</head>
<body>
    <h1>My First Heading</h1>
    <p>This is my first paragraph. It contains some introductory text.</p>

    <hr>

    <p>This is my second paragraph after the horizontal rule.</p>
</body>
</html>
```
:::

### Exercise 2: Using Attributes
Create a page with elements that use id, class, and title attributes.

::: details Solution
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Attributes Practice</title>
</head>
<body>
    <div id="main-container">
        <h1 id="page-title" class="heading">Welcome</h1>
        <p class="intro highlight" title="This is an introduction">
            Hover over this paragraph to see the title.
        </p>
        <p class="content">Regular paragraph with class.</p>
    </div>
</body>
</html>
```
:::

### Exercise 3: Proper Nesting
Fix the incorrectly nested HTML:

```html
<div>
<p><strong>Bold and <em>italic</p></strong></em>
</div>
```

::: details Solution
```html
<div>
    <p><strong>Bold and <em>italic</em></strong></p>
</div>
```
:::

## Summary

- HTML documents have a standard structure: `<!DOCTYPE>`, `<html>`, `<head>`, `<body>`
- Elements consist of tags, attributes, and content
- Some elements are self-closing (no closing tag needed)
- Attributes provide additional information about elements
- Block elements take full width; inline elements only take needed space
- Use HTML entities for special characters
- Always nest elements properly

## Next Steps

Continue to [Text and Typography](/guide/html/02-text) to learn about formatting text content.
