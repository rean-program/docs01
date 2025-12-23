# Advanced HTML Features

Learn about meta tags, SEO optimization, accessibility best practices, and advanced HTML features.

## Meta Tags

Meta tags provide information about your webpage to browsers and search engines.

### Essential Meta Tags

```html
<head>
    <!-- Character encoding -->
    <meta charset="UTF-8">

    <!-- Viewport for responsive design -->
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <!-- Page description (for SEO) -->
    <meta name="description" content="A comprehensive guide to HTML5">

    <!-- Keywords (less important for modern SEO) -->
    <meta name="keywords" content="HTML, tutorial, web development">

    <!-- Author -->
    <meta name="author" content="John Doe">

    <!-- Page title -->
    <title>HTML Tutorial - Learn Web Development</title>
</head>
```

### Robots Meta Tag

Control search engine behavior:

```html
<!-- Allow indexing and following links -->
<meta name="robots" content="index, follow">

<!-- Prevent indexing -->
<meta name="robots" content="noindex">

<!-- Prevent following links -->
<meta name="robots" content="nofollow">

<!-- Prevent caching -->
<meta name="robots" content="noarchive">

<!-- Multiple directives -->
<meta name="robots" content="noindex, nofollow, noarchive">
```

### Open Graph Tags (Social Media)

```html
<meta property="og:title" content="Page Title">
<meta property="og:description" content="Page description">
<meta property="og:image" content="https://example.com/image.jpg">
<meta property="og:url" content="https://example.com/page">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Site Name">
```

### Twitter Card Tags

```html
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:site" content="@username">
<meta name="twitter:title" content="Page Title">
<meta name="twitter:description" content="Page description">
<meta name="twitter:image" content="https://example.com/image.jpg">
```

### Other Useful Meta Tags

```html
<!-- Refresh/redirect -->
<meta http-equiv="refresh" content="5;url=https://example.com">

<!-- Theme color (mobile browsers) -->
<meta name="theme-color" content="#3498db">

<!-- Apple mobile web app -->
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black">

<!-- Disable phone number detection -->
<meta name="format-detection" content="telephone=no">
```

## Favicon and Icons

```html
<head>
    <!-- Standard favicon -->
    <link rel="icon" type="image/x-icon" href="/favicon.ico">

    <!-- PNG favicon -->
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">

    <!-- Apple touch icon -->
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">

    <!-- Android/Chrome -->
    <link rel="manifest" href="/site.webmanifest">
</head>
```

## SEO Best Practices

### Heading Hierarchy

```html
<!-- Good: Logical hierarchy -->
<h1>Main Page Title</h1>
    <h2>Major Section</h2>
        <h3>Subsection</h3>
        <h3>Subsection</h3>
    <h2>Another Major Section</h2>
        <h3>Subsection</h3>

<!-- Bad: Skipping levels -->
<h1>Title</h1>
    <h4>Subsection</h4>  <!-- Skipped h2 and h3 -->
```

### Descriptive Links

```html
<!-- Bad -->
<a href="products.html">Click here</a>
<a href="report.pdf">Read more</a>

<!-- Good -->
<a href="products.html">View our product catalog</a>
<a href="report.pdf">Download the annual report (PDF, 2MB)</a>
```

### Image Alt Text

```html
<!-- Decorative image -->
<img src="decoration.png" alt="">

<!-- Informative image -->
<img src="chart.png" alt="Sales increased 25% in Q4 2024">

<!-- Linked image -->
<a href="/products">
    <img src="product.jpg" alt="Blue Widget - $29.99">
</a>
```

### Structured Data (JSON-LD)

```html
<script type="application/ld+json">
{
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "HTML Tutorial for Beginners",
    "author": {
        "@type": "Person",
        "name": "John Doe"
    },
    "datePublished": "2024-01-15",
    "image": "https://example.com/article-image.jpg",
    "publisher": {
        "@type": "Organization",
        "name": "Web Dev Tutorials",
        "logo": {
            "@type": "ImageObject",
            "url": "https://example.com/logo.png"
        }
    }
}
</script>
```

## Accessibility (a11y)

### ARIA Attributes

```html
<!-- Labels -->
<button aria-label="Close dialog">×</button>

<!-- Descriptions -->
<input type="text" aria-describedby="help-text">
<p id="help-text">Enter your username (letters and numbers only)</p>

<!-- States -->
<button aria-expanded="false" aria-controls="menu">Menu</button>
<nav id="menu" aria-hidden="true">...</nav>

<!-- Roles -->
<div role="alert">Form submitted successfully!</div>
<div role="progressbar" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100">
    75%
</div>
```

### Skip Navigation

```html
<body>
    <a href="#main-content" class="skip-link">Skip to main content</a>

    <header>...</header>
    <nav>...</nav>

    <main id="main-content">
        <h1>Page Title</h1>
        ...
    </main>
</body>
```

### Form Accessibility

```html
<form>
    <!-- Associated label -->
    <label for="email">Email Address:</label>
    <input type="email"
           id="email"
           name="email"
           required
           aria-required="true">

    <!-- Error messages -->
    <input type="password"
           id="password"
           aria-invalid="true"
           aria-describedby="password-error">
    <p id="password-error" role="alert">
        Password must be at least 8 characters
    </p>

    <!-- Fieldset for groups -->
    <fieldset>
        <legend>Shipping Address</legend>
        <label for="street">Street:</label>
        <input type="text" id="street" name="street">
        ...
    </fieldset>
</form>
```

### Live Regions

```html
<!-- Announce updates to screen readers -->
<div aria-live="polite" aria-atomic="true">
    <!-- Content changes here will be announced -->
</div>

<!-- Urgent announcements -->
<div role="alert" aria-live="assertive">
    Error: Please fix the form errors
</div>

<!-- Status updates -->
<div role="status" aria-live="polite">
    Loading... 50% complete
</div>
```

## Template Element

Define reusable HTML fragments:

```html
<template id="card-template">
    <article class="card">
        <h2 class="card-title"></h2>
        <p class="card-content"></p>
        <a class="card-link" href="">Read more</a>
    </article>
</template>

<script>
const template = document.getElementById('card-template');
const clone = template.content.cloneNode(true);

clone.querySelector('.card-title').textContent = 'Card Title';
clone.querySelector('.card-content').textContent = 'Card description...';
clone.querySelector('.card-link').href = '/article/1';

document.body.appendChild(clone);
</script>
```

## Dialog Element

Native modal dialogs:

```html
<dialog id="myDialog">
    <h2>Dialog Title</h2>
    <p>Dialog content goes here.</p>
    <form method="dialog">
        <button value="cancel">Cancel</button>
        <button value="confirm">Confirm</button>
    </form>
</dialog>

<button onclick="document.getElementById('myDialog').showModal()">
    Open Dialog
</button>

<script>
const dialog = document.getElementById('myDialog');

dialog.addEventListener('close', () => {
    console.log('Dialog closed with:', dialog.returnValue);
});
</script>
```

## Content Editable

Make elements editable:

```html
<div contenteditable="true">
    Click here to edit this text...
</div>

<p contenteditable="true" spellcheck="true">
    Editable paragraph with spell checking
</p>
```

## Draggable Elements

```html
<div draggable="true" id="drag-item">
    Drag me!
</div>

<div id="drop-zone">
    Drop here
</div>

<script>
const item = document.getElementById('drag-item');
const zone = document.getElementById('drop-zone');

item.addEventListener('dragstart', (e) => {
    e.dataTransfer.setData('text/plain', e.target.id);
});

zone.addEventListener('dragover', (e) => {
    e.preventDefault();
});

zone.addEventListener('drop', (e) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain');
    zone.appendChild(document.getElementById(id));
});
</script>
```

## Complete HTML5 Template

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <!-- Character encoding -->
    <meta charset="UTF-8">

    <!-- Viewport -->
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <!-- SEO -->
    <meta name="description" content="Page description for search engines">
    <meta name="author" content="Author Name">
    <meta name="robots" content="index, follow">

    <!-- Open Graph -->
    <meta property="og:title" content="Page Title">
    <meta property="og:description" content="Page description">
    <meta property="og:image" content="https://example.com/image.jpg">
    <meta property="og:url" content="https://example.com/page">
    <meta property="og:type" content="website">

    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="Page Title">
    <meta name="twitter:description" content="Page description">

    <!-- Favicon -->
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
    <link rel="apple-touch-icon" href="/apple-touch-icon.png">

    <!-- Theme -->
    <meta name="theme-color" content="#3498db">

    <!-- Styles -->
    <link rel="stylesheet" href="styles.css">

    <!-- Title -->
    <title>Page Title | Site Name</title>

    <!-- Structured Data -->
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "Page Title",
        "description": "Page description"
    }
    </script>
</head>
<body>
    <!-- Skip link -->
    <a href="#main" class="skip-link">Skip to main content</a>

    <!-- Header -->
    <header role="banner">
        <nav aria-label="Main navigation">
            <ul>
                <li><a href="/">Home</a></li>
                <li><a href="/about">About</a></li>
                <li><a href="/contact">Contact</a></li>
            </ul>
        </nav>
    </header>

    <!-- Main content -->
    <main id="main" role="main">
        <article>
            <h1>Page Title</h1>
            <p>Content goes here...</p>
        </article>
    </main>

    <!-- Sidebar -->
    <aside role="complementary">
        <h2>Related Content</h2>
        ...
    </aside>

    <!-- Footer -->
    <footer role="contentinfo">
        <p>&copy; 2024 Site Name. All rights reserved.</p>
    </footer>

    <!-- Scripts -->
    <script src="script.js"></script>
</body>
</html>
```

## HTML Validation

Always validate your HTML:

1. **W3C Validator**: https://validator.w3.org/
2. **Browser DevTools**: Check console for errors
3. **VS Code Extensions**: HTMLHint, W3C Validation

Common validation errors:
- Missing alt attributes on images
- Unclosed tags
- Duplicate IDs
- Invalid nesting
- Missing required attributes

## Best Practices Summary

### Document Structure
- Always include `<!DOCTYPE html>`
- Set `lang` attribute on `<html>`
- Include proper `<head>` with meta tags
- Use semantic elements appropriately

### Accessibility
- Use proper heading hierarchy
- Add alt text to images
- Use labels for form inputs
- Ensure keyboard navigation works
- Test with screen readers

### SEO
- Write descriptive title and meta description
- Use semantic HTML structure
- Include Open Graph tags
- Add structured data where appropriate
- Use descriptive link text

### Performance
- Use lazy loading for images
- Minimize inline styles and scripts
- Optimize images
- Use preload for critical resources

## Exercises

### Exercise 1: Complete Head Section
Create a complete `<head>` section for a blog post page.

::: details Solution
```html
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>How to Learn HTML in 2024 | Web Dev Blog</title>
    <meta name="description" content="A comprehensive guide to learning HTML from scratch in 2024. Perfect for beginners wanting to start web development.">
    <meta name="author" content="Jane Smith">
    <meta name="robots" content="index, follow">

    <meta property="og:title" content="How to Learn HTML in 2024">
    <meta property="og:description" content="A comprehensive guide to learning HTML from scratch.">
    <meta property="og:image" content="https://blog.example.com/images/html-guide.jpg">
    <meta property="og:url" content="https://blog.example.com/how-to-learn-html">
    <meta property="og:type" content="article">

    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:site" content="@webdevblog">
    <meta name="twitter:title" content="How to Learn HTML in 2024">
    <meta name="twitter:description" content="A comprehensive guide to learning HTML from scratch.">
    <meta name="twitter:image" content="https://blog.example.com/images/html-guide.jpg">

    <link rel="icon" type="image/png" href="/favicon.png">
    <link rel="apple-touch-icon" href="/apple-touch-icon.png">
    <meta name="theme-color" content="#2563eb">

    <link rel="canonical" href="https://blog.example.com/how-to-learn-html">
    <link rel="stylesheet" href="/styles/main.css">

    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": "How to Learn HTML in 2024",
        "author": {
            "@type": "Person",
            "name": "Jane Smith"
        },
        "datePublished": "2024-01-15",
        "image": "https://blog.example.com/images/html-guide.jpg"
    }
    </script>
</head>
```
:::

### Exercise 2: Accessible Form
Create an accessible contact form with proper ARIA attributes.

::: details Solution
```html
<form action="/contact" method="POST" aria-labelledby="form-title">
    <h2 id="form-title">Contact Us</h2>

    <div>
        <label for="name">Name <span aria-hidden="true">*</span></label>
        <input type="text"
               id="name"
               name="name"
               required
               aria-required="true"
               autocomplete="name">
    </div>

    <div>
        <label for="email">Email <span aria-hidden="true">*</span></label>
        <input type="email"
               id="email"
               name="email"
               required
               aria-required="true"
               aria-describedby="email-hint"
               autocomplete="email">
        <p id="email-hint" class="hint">We'll never share your email.</p>
    </div>

    <div>
        <label for="subject">Subject</label>
        <select id="subject" name="subject">
            <option value="">Select a subject</option>
            <option value="general">General Inquiry</option>
            <option value="support">Technical Support</option>
            <option value="feedback">Feedback</option>
        </select>
    </div>

    <div>
        <label for="message">Message <span aria-hidden="true">*</span></label>
        <textarea id="message"
                  name="message"
                  required
                  aria-required="true"
                  rows="5"></textarea>
    </div>

    <div aria-live="polite" id="form-status"></div>

    <button type="submit">Send Message</button>
</form>
```
:::

## Summary

- Meta tags provide essential information to browsers and search engines
- Open Graph and Twitter cards control social media sharing appearance
- Proper heading hierarchy improves SEO and accessibility
- ARIA attributes enhance accessibility for assistive technologies
- Template, dialog, and other HTML5 features add functionality
- Always validate your HTML and follow best practices

## Conclusion

Congratulations! You've completed the HTML tutorial. You now have a solid foundation in HTML, from basic elements to advanced features. Keep practicing and building projects to reinforce your skills!

### Next Steps
- Learn CSS to style your HTML
- Learn JavaScript to add interactivity
- Practice by building real projects
- Study web accessibility guidelines (WCAG)
- Explore responsive web design
