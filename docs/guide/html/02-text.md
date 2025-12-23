# Text and Typography

Learn how to format and style text content in HTML using various text elements and formatting tags.

## Text Formatting Elements

### Bold Text

Two ways to make text bold:

```html
<!-- Strong importance (semantic) -->
<p>This is <strong>very important</strong> text.</p>

<!-- Bold style (visual only) -->
<p>This is <b>bold</b> text.</p>
```

::: tip
Use `<strong>` for text that is semantically important. Use `<b>` for stylistically bold text without extra importance.
:::

### Italic Text

```html
<!-- Emphasized text (semantic) -->
<p>I <em>really</em> like HTML.</p>

<!-- Italic style (visual only) -->
<p>The book <i>HTML Basics</i> is great.</p>
```

### Underlined Text

```html
<p>This text has an <u>underline</u>.</p>
```

::: warning
Avoid underlines for non-link text as users may confuse it with hyperlinks.
:::

### Strikethrough Text

```html
<!-- Deleted/removed text -->
<p>Price: <del>$100</del> $75</p>

<!-- Strikethrough (visual) -->
<p>This is <s>incorrect</s> information.</p>
```

### Combined Formatting

```html
<p>You can combine <strong><em>bold and italic</em></strong> text.</p>
<p>Or even <strong><em><u>bold, italic, and underlined</u></em></strong>.</p>
```

## Semantic Text Elements

### Marked/Highlighted Text

```html
<p>Search results for "HTML": Found in <mark>HTML</mark> tutorial.</p>
```

### Small Text

```html
<p>Regular text <small>and smaller text</small></p>
<p><small>Copyright notice or fine print</small></p>
```

### Subscript and Superscript

```html
<!-- Subscript (below baseline) -->
<p>H<sub>2</sub>O is water.</p>
<p>CO<sub>2</sub> is carbon dioxide.</p>

<!-- Superscript (above baseline) -->
<p>E = mc<sup>2</sup></p>
<p>2<sup>nd</sup> place, 3<sup>rd</sup> edition</p>
```

### Inserted and Deleted Text

```html
<p>My favorite color is <del>blue</del> <ins>green</ins>.</p>
```

## Code and Technical Text

### Inline Code

```html
<p>Use the <code>console.log()</code> function to debug.</p>
<p>The <code>&lt;html&gt;</code> element is the root element.</p>
```

### Preformatted Text

Preserves whitespace and line breaks:

```html
<pre>
    This text
        preserves
            spacing and
                line breaks.
</pre>
```

### Code Blocks

```html
<pre><code>
function greet(name) {
    console.log("Hello, " + name);
}

greet("World");
</code></pre>
```

### Keyboard Input

```html
<p>Press <kbd>Ctrl</kbd> + <kbd>C</kbd> to copy.</p>
<p>Press <kbd>Ctrl</kbd> + <kbd>S</kbd> to save.</p>
```

### Sample Output

```html
<p>The program displayed: <samp>Hello, World!</samp></p>
```

### Variables

```html
<p>The area formula is: <var>A</var> = π<var>r</var><sup>2</sup></p>
```

## Quotations

### Block Quotes

For longer quotations:

```html
<blockquote cite="https://example.com/source">
    <p>The only way to do great work is to love what you do.</p>
    <footer>— Steve Jobs</footer>
</blockquote>
```

### Inline Quotes

For short quotations:

```html
<p>As Einstein said, <q>Imagination is more important than knowledge.</q></p>
```

### Citations

```html
<p><cite>The Great Gatsby</cite> was written by F. Scott Fitzgerald.</p>
```

## Abbreviations and Definitions

### Abbreviations

```html
<p>The <abbr title="World Wide Web">WWW</abbr> was invented by Tim Berners-Lee.</p>
<p><abbr title="HyperText Markup Language">HTML</abbr> is easy to learn.</p>
```

### Definitions

```html
<p><dfn>HTML</dfn> is the standard markup language for creating web pages.</p>
```

## Address and Contact Information

```html
<address>
    Written by <a href="mailto:john@example.com">John Doe</a><br>
    123 Main Street<br>
    New York, NY 10001<br>
    USA
</address>
```

## Text Direction

### Bidirectional Override

```html
<!-- Right-to-left text -->
<p><bdo dir="rtl">This text goes right to left</bdo></p>

<!-- Left-to-right text -->
<p><bdo dir="ltr">This text goes left to right</bdo></p>
```

### Bidirectional Isolation

```html
<p>User <bdi>إيان</bdi> submitted 3 comments.</p>
```

## Time and Dates

```html
<p>The event is on <time datetime="2024-12-25">December 25, 2024</time>.</p>
<p>The meeting starts at <time datetime="14:30">2:30 PM</time>.</p>
<p>Published: <time datetime="2024-01-15T09:00:00Z">January 15, 2024</time></p>
```

## Line Breaks and Word Breaks

### Line Break

```html
<p>Line one<br>
Line two<br>
Line three</p>
```

### Word Break Opportunity

```html
<p>This is a verylongwordthatmightoverflow<wbr>soyoucanbreakithere.</p>
```

## Whitespace Handling

HTML collapses multiple spaces into one:

```html
<!-- These render the same -->
<p>Hello    World</p>
<p>Hello World</p>

<!-- Use &nbsp; for multiple spaces -->
<p>Hello&nbsp;&nbsp;&nbsp;&nbsp;World</p>

<!-- Use <pre> to preserve spaces -->
<pre>Hello    World</pre>
```

## Headings Best Practices

```html
<!-- Good: Logical hierarchy -->
<h1>Main Title</h1>
    <h2>Section One</h2>
        <h3>Subsection</h3>
    <h2>Section Two</h2>
        <h3>Subsection</h3>

<!-- Bad: Skipping levels -->
<h1>Main Title</h1>
    <h4>Subsection</h4>  <!-- Skip from h1 to h4 -->
```

## Paragraph Formatting

### Multiple Paragraphs

```html
<p>First paragraph with some text content.</p>

<p>Second paragraph. Paragraphs automatically have
vertical spacing between them.</p>

<p>Third paragraph. Use paragraphs to separate
distinct blocks of content.</p>
```

### Preserving Line Breaks in Paragraphs

```html
<p>
    Address:<br>
    123 Main Street<br>
    New York, NY 10001
</p>
```

## Complete Example

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Text Formatting Example</title>
</head>
<body>
    <h1>Text Formatting in HTML</h1>

    <h2>Introduction</h2>
    <p>HTML provides many ways to format text. You can make text
    <strong>bold</strong>, <em>italic</em>, or even
    <strong><em>both</em></strong>.</p>

    <h2>Technical Documentation</h2>
    <p>Use the <code>print()</code> function to output text.
    Press <kbd>Enter</kbd> to execute.</p>

    <pre><code>
def greet(name):
    print(f"Hello, {name}!")

greet("World")
    </code></pre>

    <h2>Quotations</h2>
    <blockquote>
        <p>The best way to predict the future is to create it.</p>
        <footer>— <cite>Peter Drucker</cite></footer>
    </blockquote>

    <h2>Scientific Notation</h2>
    <p>Water is H<sub>2</sub>O.</p>
    <p>Einstein's equation: E = mc<sup>2</sup></p>

    <h2>Abbreviations</h2>
    <p><abbr title="HyperText Markup Language">HTML</abbr> and
    <abbr title="Cascading Style Sheets">CSS</abbr> are essential
    web technologies.</p>

    <h2>Updates</h2>
    <p>Price: <del>$99.99</del> <ins>$79.99</ins>
    <mark>Sale!</mark></p>

    <h2>Contact</h2>
    <address>
        Contact us at:<br>
        <a href="mailto:info@example.com">info@example.com</a><br>
        123 Web Street, Internet City
    </address>
</body>
</html>
```

## Text Elements Reference

| Element | Purpose | Example |
|---------|---------|---------|
| `<strong>` | Important text | `<strong>Warning</strong>` |
| `<em>` | Emphasized text | `<em>Note</em>` |
| `<b>` | Bold (visual) | `<b>Bold</b>` |
| `<i>` | Italic (visual) | `<i>Italic</i>` |
| `<u>` | Underlined | `<u>Underlined</u>` |
| `<mark>` | Highlighted | `<mark>Important</mark>` |
| `<small>` | Small text | `<small>Fine print</small>` |
| `<del>` | Deleted text | `<del>Removed</del>` |
| `<ins>` | Inserted text | `<ins>Added</ins>` |
| `<sub>` | Subscript | `H<sub>2</sub>O` |
| `<sup>` | Superscript | `x<sup>2</sup>` |
| `<code>` | Code | `<code>var x</code>` |
| `<pre>` | Preformatted | `<pre>  text  </pre>` |
| `<kbd>` | Keyboard input | `<kbd>Enter</kbd>` |
| `<abbr>` | Abbreviation | `<abbr title="...">HTML</abbr>` |
| `<q>` | Inline quote | `<q>Quote</q>` |
| `<blockquote>` | Block quote | `<blockquote>...</blockquote>` |
| `<cite>` | Citation | `<cite>Book Title</cite>` |

## Exercises

### Exercise 1: Format a Recipe
Create a recipe with proper text formatting including a title, ingredients, and instructions.

::: details Solution
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Chocolate Chip Cookies</title>
</head>
<body>
    <h1>Chocolate Chip Cookies</h1>
    <p><small>Prep time: 15 minutes | Cook time: 12 minutes</small></p>

    <h2>Ingredients</h2>
    <p>
        2 cups flour<br>
        1 cup sugar<br>
        <sup>1</sup>/<sub>2</sub> cup butter<br>
        1 cup chocolate chips
    </p>

    <h2>Instructions</h2>
    <p><strong>Step 1:</strong> Preheat oven to <mark>350°F</mark>.</p>
    <p><strong>Step 2:</strong> Mix <em>dry ingredients</em> in a bowl.</p>
    <p><strong>Step 3:</strong> Add butter and mix until smooth.</p>
    <p><strong>Step 4:</strong> Fold in chocolate chips.</p>
    <p><strong>Step 5:</strong> Bake for <time datetime="PT12M">12 minutes</time>.</p>
</body>
</html>
```
:::

### Exercise 2: Create a Code Tutorial
Create a simple programming tutorial with code examples and keyboard shortcuts.

::: details Solution
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Python Basics</title>
</head>
<body>
    <h1>Python Basics</h1>

    <h2>Hello World</h2>
    <p>The simplest Python program uses the <code>print()</code> function:</p>

    <pre><code>print("Hello, World!")</code></pre>

    <p>Output: <samp>Hello, World!</samp></p>

    <h2>Variables</h2>
    <p>Variables store data. The variable <var>x</var> can hold any value:</p>

    <pre><code>x = 42
name = "Alice"
pi = 3.14159</code></pre>

    <h2>Keyboard Shortcuts</h2>
    <p>Press <kbd>Ctrl</kbd> + <kbd>Enter</kbd> to run code.</p>
    <p>Press <kbd>Ctrl</kbd> + <kbd>S</kbd> to save your file.</p>
</body>
</html>
```
:::

## Summary

- Use `<strong>` for important text, `<em>` for emphasis
- `<code>`, `<pre>`, and `<kbd>` are for technical content
- `<blockquote>` and `<q>` handle quotations
- `<sub>` and `<sup>` for subscript and superscript
- `<abbr>` with `title` attribute for abbreviations
- `<mark>` highlights text
- `<del>` and `<ins>` show changes
- `<time>` provides machine-readable dates

## Next Steps

Continue to [Links and Images](/guide/html/03-links-images) to learn how to add hyperlinks and images to your pages.
