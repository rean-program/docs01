# Semantic HTML

Learn how to use meaningful HTML elements that describe their content, improving accessibility, SEO, and code maintainability.

## What is Semantic HTML?

Semantic HTML uses elements that convey meaning about their content, not just presentation.

```html
<!-- Non-semantic -->
<div class="header">
    <div class="nav">...</div>
</div>
<div class="main">...</div>
<div class="footer">...</div>

<!-- Semantic -->
<header>
    <nav>...</nav>
</header>
<main>...</main>
<footer>...</footer>
```

## Benefits of Semantic HTML

1. **Accessibility**: Screen readers understand page structure
2. **SEO**: Search engines better understand content
3. **Maintainability**: Code is self-documenting
4. **Consistency**: Standard structure across projects

## Document Structure Elements

### `<header>`

Introductory content or navigation:

```html
<header>
    <h1>Website Name</h1>
    <nav>
        <a href="/">Home</a>
        <a href="/about">About</a>
    </nav>
</header>
```

Can also be used within sections:

```html
<article>
    <header>
        <h2>Article Title</h2>
        <p>Published: January 15, 2024</p>
    </header>
    <p>Article content...</p>
</article>
```

### `<nav>`

Navigation links:

```html
<nav aria-label="Main navigation">
    <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/products">Products</a></li>
        <li><a href="/about">About</a></li>
        <li><a href="/contact">Contact</a></li>
    </ul>
</nav>
```

### `<main>`

The main content of the document (only one per page):

```html
<body>
    <header>...</header>
    <nav>...</nav>

    <main>
        <h1>Page Title</h1>
        <p>Main content goes here...</p>
    </main>

    <footer>...</footer>
</body>
```

### `<footer>`

Footer content:

```html
<footer>
    <p>&copy; 2024 Company Name</p>
    <nav>
        <a href="/privacy">Privacy Policy</a>
        <a href="/terms">Terms of Service</a>
    </nav>
</footer>
```

## Content Sectioning

### `<article>`

Self-contained, independently distributable content:

```html
<article>
    <header>
        <h2>Blog Post Title</h2>
        <time datetime="2024-01-15">January 15, 2024</time>
    </header>
    <p>Article content...</p>
    <footer>
        <p>Written by: John Doe</p>
    </footer>
</article>
```

Use for:
- Blog posts
- News articles
- Forum posts
- Product cards
- Comments

### `<section>`

Thematic grouping of content:

```html
<section>
    <h2>Our Services</h2>
    <p>We offer the following services...</p>
</section>

<section>
    <h2>Testimonials</h2>
    <blockquote>Great service!</blockquote>
</section>
```

### `<aside>`

Content tangentially related to main content:

```html
<main>
    <article>
        <h1>Main Article</h1>
        <p>Article content...</p>
    </article>

    <aside>
        <h2>Related Articles</h2>
        <ul>
            <li><a href="#">Article 1</a></li>
            <li><a href="#">Article 2</a></li>
        </ul>
    </aside>
</main>
```

Use for:
- Sidebars
- Related content
- Advertisements
- Author bios

### Article vs Section vs Div

```html
<!-- Article: Self-contained, can stand alone -->
<article>
    <h2>News Story</h2>
    <p>This can be syndicated or shared...</p>
</article>

<!-- Section: Thematic grouping, needs context -->
<section>
    <h2>Chapter 1</h2>
    <p>Part of a larger document...</p>
</section>

<!-- Div: No semantic meaning, for styling only -->
<div class="card-container">
    <article class="card">...</article>
    <article class="card">...</article>
</div>
```

## Text Content Elements

### `<figure>` and `<figcaption>`

Self-contained content with caption:

```html
<figure>
    <img src="chart.png" alt="Sales chart for Q4">
    <figcaption>Figure 1: Q4 Sales Performance</figcaption>
</figure>

<figure>
    <pre><code>
function hello() {
    console.log("Hello!");
}
    </code></pre>
    <figcaption>Example: Hello World function</figcaption>
</figure>

<figure>
    <blockquote>
        The only way to do great work is to love what you do.
    </blockquote>
    <figcaption>— Steve Jobs</figcaption>
</figure>
```

### `<time>`

Machine-readable dates and times:

```html
<p>Published: <time datetime="2024-01-15">January 15, 2024</time></p>
<p>Event starts: <time datetime="2024-03-20T19:00">March 20 at 7 PM</time></p>
<p>Duration: <time datetime="PT2H30M">2 hours 30 minutes</time></p>
```

### `<address>`

Contact information:

```html
<address>
    <p>Written by <a href="mailto:john@example.com">John Doe</a></p>
    <p>Visit us at:</p>
    <p>123 Main Street<br>
    New York, NY 10001</p>
</address>
```

### `<mark>`

Highlighted/marked text:

```html
<p>Search results for "HTML": Found in the <mark>HTML</mark> tutorial.</p>
```

### `<details>` and `<summary>`

Collapsible content:

```html
<details>
    <summary>Click to expand</summary>
    <p>This content is hidden until clicked.</p>
</details>

<details open>
    <summary>FAQ: How do I reset my password?</summary>
    <p>Go to Settings > Security > Reset Password.</p>
</details>
```

## Complete Page Structure

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Semantic HTML Example</title>
</head>
<body>
    <header>
        <h1>My Website</h1>
        <nav aria-label="Main">
            <ul>
                <li><a href="/">Home</a></li>
                <li><a href="/blog">Blog</a></li>
                <li><a href="/about">About</a></li>
            </ul>
        </nav>
    </header>

    <main>
        <article>
            <header>
                <h2>Article Title</h2>
                <p>By <address class="inline">John Doe</address></p>
                <time datetime="2024-01-15">January 15, 2024</time>
            </header>

            <section>
                <h3>Introduction</h3>
                <p>Article introduction...</p>
            </section>

            <section>
                <h3>Main Content</h3>
                <p>Article body...</p>

                <figure>
                    <img src="diagram.png" alt="System architecture">
                    <figcaption>Figure 1: System Architecture</figcaption>
                </figure>
            </section>

            <footer>
                <p>Tags: HTML, Web Development</p>
            </footer>
        </article>

        <aside>
            <section>
                <h3>Related Posts</h3>
                <ul>
                    <li><a href="#">CSS Basics</a></li>
                    <li><a href="#">JavaScript Intro</a></li>
                </ul>
            </section>

            <section>
                <h3>About the Author</h3>
                <p>John is a web developer...</p>
            </section>
        </aside>
    </main>

    <footer>
        <nav aria-label="Footer">
            <a href="/privacy">Privacy</a>
            <a href="/terms">Terms</a>
        </nav>
        <p>&copy; 2024 My Website</p>
    </footer>
</body>
</html>
```

## ARIA Landmarks

Enhance semantics with ARIA roles:

```html
<header role="banner">...</header>
<nav role="navigation" aria-label="Main">...</nav>
<main role="main">...</main>
<aside role="complementary">...</aside>
<footer role="contentinfo">...</footer>
<form role="search">...</form>
```

::: tip
Modern browsers recognize semantic elements automatically. ARIA roles provide fallback for older browsers and additional context.
:::

## Common Patterns

### Blog Layout

```html
<body>
    <header>
        <h1>Blog Name</h1>
        <nav>...</nav>
    </header>

    <main>
        <article>
            <h2>Post Title</h2>
            <p>Content...</p>
        </article>

        <article>
            <h2>Another Post</h2>
            <p>Content...</p>
        </article>
    </main>

    <aside>
        <section>
            <h3>Categories</h3>
            <ul>...</ul>
        </section>
    </aside>

    <footer>...</footer>
</body>
```

### Product Page

```html
<main>
    <article class="product">
        <header>
            <h1>Product Name</h1>
            <p class="price">$99.99</p>
        </header>

        <figure>
            <img src="product.jpg" alt="Product image">
        </figure>

        <section>
            <h2>Description</h2>
            <p>Product details...</p>
        </section>

        <section>
            <h2>Specifications</h2>
            <dl>
                <dt>Weight</dt>
                <dd>2.5 kg</dd>
                <dt>Dimensions</dt>
                <dd>10 x 20 x 5 cm</dd>
            </dl>
        </section>

        <section>
            <h2>Reviews</h2>
            <article class="review">
                <header>
                    <strong>John D.</strong>
                    <time datetime="2024-01-10">Jan 10, 2024</time>
                </header>
                <p>Great product!</p>
            </article>
        </section>
    </article>
</main>
```

### FAQ Page

```html
<main>
    <h1>Frequently Asked Questions</h1>

    <section>
        <h2>General Questions</h2>

        <details>
            <summary>What is your return policy?</summary>
            <p>We accept returns within 30 days...</p>
        </details>

        <details>
            <summary>How do I track my order?</summary>
            <p>Log in to your account and...</p>
        </details>
    </section>

    <section>
        <h2>Technical Support</h2>

        <details>
            <summary>How do I reset my password?</summary>
            <p>Click "Forgot Password" on the login page...</p>
        </details>
    </section>
</main>
```

## Semantic Elements Reference

| Element | Purpose |
|---------|---------|
| `<header>` | Introductory content |
| `<nav>` | Navigation links |
| `<main>` | Main content (one per page) |
| `<article>` | Self-contained content |
| `<section>` | Thematic grouping |
| `<aside>` | Tangentially related content |
| `<footer>` | Footer content |
| `<figure>` | Self-contained media |
| `<figcaption>` | Caption for figure |
| `<time>` | Date/time |
| `<address>` | Contact information |
| `<mark>` | Highlighted text |
| `<details>` | Collapsible content |
| `<summary>` | Summary for details |

## Exercises

### Exercise 1: Convert Non-Semantic HTML
Convert this non-semantic HTML to semantic:

```html
<div class="header">
    <div class="logo">My Site</div>
    <div class="menu">
        <a href="/">Home</a>
        <a href="/about">About</a>
    </div>
</div>
<div class="content">
    <div class="post">
        <div class="title">Blog Post</div>
        <div class="text">Content here...</div>
    </div>
</div>
<div class="sidebar">
    <div class="widget">Related Posts</div>
</div>
<div class="footer">Copyright 2024</div>
```

::: details Solution
```html
<header>
    <h1>My Site</h1>
    <nav>
        <a href="/">Home</a>
        <a href="/about">About</a>
    </nav>
</header>
<main>
    <article>
        <h2>Blog Post</h2>
        <p>Content here...</p>
    </article>
</main>
<aside>
    <section>
        <h3>Related Posts</h3>
    </section>
</aside>
<footer>
    <p>Copyright 2024</p>
</footer>
```
:::

### Exercise 2: Create a News Article
Create a semantically correct news article with author, date, and related content.

::: details Solution
```html
<article>
    <header>
        <h1>Breaking: New Technology Announced</h1>
        <p>
            By <address class="inline">Jane Smith</address> |
            <time datetime="2024-01-15T14:30">January 15, 2024 at 2:30 PM</time>
        </p>
    </header>

    <figure>
        <img src="tech-announcement.jpg" alt="CEO presenting new device">
        <figcaption>CEO John Doe unveils the new product</figcaption>
    </figure>

    <section>
        <p>The company announced today that...</p>
        <p>This new technology will...</p>
    </section>

    <aside>
        <h2>Quick Facts</h2>
        <ul>
            <li>Release date: March 2024</li>
            <li>Price: $299</li>
            <li>Pre-orders start: February 1</li>
        </ul>
    </aside>

    <footer>
        <p>Tags: Technology, Announcements, Products</p>
        <p>Share: <a href="#">Twitter</a> | <a href="#">Facebook</a></p>
    </footer>
</article>
```
:::

## Summary

- Semantic HTML conveys meaning, not just presentation
- Use `<header>`, `<nav>`, `<main>`, `<footer>` for page structure
- `<article>` for self-contained content, `<section>` for thematic groups
- `<aside>` for related but tangential content
- `<figure>` with `<figcaption>` for media with captions
- `<time>` for machine-readable dates
- `<details>` and `<summary>` for collapsible content
- Semantic HTML improves accessibility, SEO, and maintainability

## Next Steps

Continue to [Media](/guide/html/07-media) to learn about embedding audio, video, and other multimedia.
