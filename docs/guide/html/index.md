# HTML Tutorial

::: info Official Documentation
This tutorial is based on MDN Web Docs. For the most up-to-date information, visit: [https://developer.mozilla.org/en-US/docs/Web/HTML](https://developer.mozilla.org/en-US/docs/Web/HTML)
:::

Welcome to the comprehensive HTML tutorial! Learn how to structure web pages from the ground up.

## What is HTML?

HTML (HyperText Markup Language) is the standard language for creating web pages. It describes the structure of a web page using markup elements.

```html
<!DOCTYPE html>
<html>
<head>
    <title>My First Page</title>
</head>
<body>
    <h1>Hello, World!</h1>
    <p>Welcome to HTML!</p>
</body>
</html>
```

## Tutorial Structure

### Beginner Level
- [Basics](/guide/html/01-basics) - HTML Structure and Elements
- [Text](/guide/html/02-text) - Text Formatting and Typography
- [Links & Images](/guide/html/03-links-images) - Hyperlinks and Images

### Intermediate Level
- [Lists & Tables](/guide/html/04-lists-tables) - Organizing Data
- [Forms](/guide/html/05-forms) - User Input and Forms
- [Semantic HTML](/guide/html/06-semantic) - Meaningful Markup

### Advanced Level
- [Media](/guide/html/07-media) - Audio, Video, and Multimedia
- [Advanced Features](/guide/html/08-advanced) - Meta Tags, SEO, and Best Practices

## Prerequisites

- A text editor (VS Code recommended)
- A web browser (Chrome, Firefox, Safari, or Edge)
- No prior programming experience required!

## Getting Started

### Creating Your First HTML File

1. Open your text editor
2. Create a new file called `index.html`
3. Type the following code:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My First Website</title>
</head>
<body>
    <h1>Welcome to My Website</h1>
    <p>This is my first HTML page!</p>
</body>
</html>
```

4. Save the file
5. Open it in your web browser

::: tip
You can open HTML files directly in your browser by double-clicking them or dragging them into the browser window.
:::

## How HTML Works

HTML uses **tags** to mark up content:

```html
<tagname>Content goes here</tagname>
```

- Tags usually come in pairs: opening `<tag>` and closing `</tag>`
- Some tags are self-closing: `<img />`, `<br />`, `<hr />`
- Tags can have **attributes** that provide additional information

```html
<a href="https://example.com">Click me</a>
<img src="image.jpg" alt="Description" />
```

## HTML Document Structure

Every HTML document has this basic structure:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <!-- Metadata goes here -->
    <meta charset="UTF-8">
    <title>Page Title</title>
</head>
<body>
    <!-- Visible content goes here -->
</body>
</html>
```

| Element | Purpose |
|---------|---------|
| `<!DOCTYPE html>` | Declares HTML5 document type |
| `<html>` | Root element of the page |
| `<head>` | Contains metadata (not displayed) |
| `<body>` | Contains visible page content |

## Video Tutorials

::: tip Recommended Video Resources
Learn HTML through these excellent video tutorials from the community.
:::

### Free Courses

| Course | Creator | Description |
|--------|---------|-------------|
| [HTML Full Course](https://www.youtube.com/watch?v=kUMe1FH4CHE) | freeCodeCamp | 2-hour complete HTML tutorial |
| [HTML Crash Course](https://www.youtube.com/watch?v=UB1O30fR-EE) | Traversy Media | 1-hour beginner crash course |
| [HTML Tutorial for Beginners](https://www.youtube.com/watch?v=qz0aGYrrlhU) | Programming with Mosh | 1-hour beginner tutorial |
| [HTML in 100 Seconds](https://www.youtube.com/watch?v=ok-plXXHlWw) | Fireship | Quick 100-second explanation |

### Official Resources

| Resource | Description |
|----------|-------------|
| [MDN HTML Basics](https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/HTML_basics) | Mozilla's official HTML learning path |
| [W3Schools HTML](https://www.w3schools.com/html/) | Interactive HTML tutorials and examples |

### Topic-Specific Videos

| Topic | Video | Duration |
|-------|-------|----------|
| HTML Forms | [HTML Forms Tutorial](https://www.youtube.com/watch?v=fNcJuPIZ2WE) | ~30 min |
| Semantic HTML | [Semantic HTML Tutorial](https://www.youtube.com/watch?v=kGW8Al_cga4) | ~12 min |
| HTML Tables | [HTML Tables Tutorial](https://www.youtube.com/watch?v=iDA0kF5lrVk) | ~15 min |
| Accessibility | [HTML Accessibility](https://www.youtube.com/watch?v=0hqhAIjE_8I) | ~20 min |

Let's begin your HTML journey!
