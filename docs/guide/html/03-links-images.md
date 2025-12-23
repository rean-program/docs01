# Links and Images

Learn how to create hyperlinks to connect pages and add images to enhance your web content.

## Hyperlinks

The anchor element `<a>` creates clickable links.

### Basic Links

```html
<a href="https://www.example.com">Visit Example</a>
```

### Link Attributes

```html
<a href="https://www.example.com"
   target="_blank"
   title="Opens in new tab"
   rel="noopener noreferrer">
    Visit Example
</a>
```

| Attribute | Purpose |
|-----------|---------|
| `href` | URL destination |
| `target` | Where to open link |
| `title` | Tooltip on hover |
| `rel` | Relationship to linked page |
| `download` | Download instead of navigate |

## Types of Links

### External Links

Links to other websites:

```html
<a href="https://www.google.com">Google</a>
<a href="https://www.github.com">GitHub</a>
```

### Internal Links

Links within your website:

```html
<!-- Same directory -->
<a href="about.html">About Us</a>

<!-- Subdirectory -->
<a href="pages/contact.html">Contact</a>

<!-- Parent directory -->
<a href="../index.html">Home</a>

<!-- Root-relative -->
<a href="/about.html">About</a>
```

### Page Section Links (Anchors)

Link to specific parts of a page:

```html
<!-- Create an anchor point -->
<h2 id="section1">Section 1</h2>

<!-- Link to the anchor -->
<a href="#section1">Go to Section 1</a>

<!-- Link to section on another page -->
<a href="page.html#section1">Go to Section 1 on another page</a>
```

### Email Links

```html
<a href="mailto:info@example.com">Email Us</a>

<!-- With subject line -->
<a href="mailto:info@example.com?subject=Hello">Email with Subject</a>

<!-- With subject and body -->
<a href="mailto:info@example.com?subject=Hello&body=Hi there!">
    Email with Message
</a>

<!-- Multiple recipients -->
<a href="mailto:one@example.com,two@example.com">Email Both</a>
```

### Phone Links

```html
<a href="tel:+1234567890">Call Us: (123) 456-7890</a>

<!-- International format recommended -->
<a href="tel:+14155551234">+1 (415) 555-1234</a>
```

### Download Links

```html
<a href="document.pdf" download>Download PDF</a>

<!-- Custom filename -->
<a href="document.pdf" download="my-file.pdf">Download as my-file.pdf</a>
```

## Link Targets

The `target` attribute controls where links open:

```html
<!-- New tab/window -->
<a href="page.html" target="_blank">New Tab</a>

<!-- Same frame (default) -->
<a href="page.html" target="_self">Same Tab</a>

<!-- Parent frame -->
<a href="page.html" target="_parent">Parent Frame</a>

<!-- Full window -->
<a href="page.html" target="_top">Full Window</a>
```

::: warning Security Note
When using `target="_blank"`, always add `rel="noopener noreferrer"` for security:

```html
<a href="https://external-site.com"
   target="_blank"
   rel="noopener noreferrer">
    External Link
</a>
```
:::

## Images

The `<img>` element displays images.

### Basic Image

```html
<img src="photo.jpg" alt="A beautiful sunset">
```

### Image Attributes

```html
<img src="photo.jpg"
     alt="Description of the image"
     width="800"
     height="600"
     loading="lazy"
     title="Tooltip text">
```

| Attribute | Purpose |
|-----------|---------|
| `src` | Image file path (required) |
| `alt` | Alternative text (required for accessibility) |
| `width` | Width in pixels |
| `height` | Height in pixels |
| `loading` | lazy, eager |
| `title` | Tooltip on hover |

### Image Sources

```html
<!-- Same directory -->
<img src="image.jpg" alt="Local image">

<!-- Subdirectory -->
<img src="images/photo.jpg" alt="Image in folder">

<!-- Parent directory -->
<img src="../images/photo.jpg" alt="Image in parent">

<!-- Absolute URL -->
<img src="https://example.com/image.jpg" alt="External image">

<!-- Data URL (embedded) -->
<img src="data:image/png;base64,iVBORw0KGgo..." alt="Embedded image">
```

## Image Formats

| Format | Best For |
|--------|----------|
| `.jpg` / `.jpeg` | Photos, complex images |
| `.png` | Graphics with transparency |
| `.gif` | Simple animations |
| `.svg` | Vector graphics, icons |
| `.webp` | Modern format, good compression |

```html
<img src="photo.jpg" alt="Photograph">
<img src="logo.png" alt="Logo with transparency">
<img src="animation.gif" alt="Animated image">
<img src="icon.svg" alt="Vector icon">
<img src="image.webp" alt="WebP image">
```

## Responsive Images

### Using srcset

Provide different images for different screen sizes:

```html
<img src="small.jpg"
     srcset="small.jpg 480w,
             medium.jpg 800w,
             large.jpg 1200w"
     sizes="(max-width: 600px) 480px,
            (max-width: 1000px) 800px,
            1200px"
     alt="Responsive image">
```

### Picture Element

More control over image selection:

```html
<picture>
    <source media="(min-width: 1200px)" srcset="large.jpg">
    <source media="(min-width: 800px)" srcset="medium.jpg">
    <source media="(min-width: 480px)" srcset="small.jpg">
    <img src="fallback.jpg" alt="Description">
</picture>
```

### Art Direction

Different crops for different screens:

```html
<picture>
    <source media="(min-width: 800px)" srcset="wide-crop.jpg">
    <source media="(min-width: 400px)" srcset="square-crop.jpg">
    <img src="portrait-crop.jpg" alt="Adaptive image">
</picture>
```

## Figure and Caption

Group images with captions:

```html
<figure>
    <img src="chart.png" alt="Sales data chart">
    <figcaption>Figure 1: Quarterly sales data for 2024</figcaption>
</figure>
```

Multiple images in a figure:

```html
<figure>
    <img src="photo1.jpg" alt="Beach sunset">
    <img src="photo2.jpg" alt="Beach sunrise">
    <figcaption>Beach views at different times of day</figcaption>
</figure>
```

## Image Links

Make images clickable:

```html
<a href="https://example.com">
    <img src="logo.png" alt="Company Logo">
</a>

<!-- Image link to full-size version -->
<a href="large-photo.jpg">
    <img src="thumbnail.jpg" alt="Click for full size">
</a>
```

## Image Maps

Create clickable regions on an image:

```html
<img src="office-map.png"
     alt="Office floor plan"
     usemap="#office-map">

<map name="office-map">
    <area shape="rect"
          coords="0,0,100,100"
          href="room1.html"
          alt="Room 1">

    <area shape="circle"
          coords="200,200,50"
          href="meeting-room.html"
          alt="Meeting Room">

    <area shape="poly"
          coords="300,100,350,150,300,200,250,150"
          href="reception.html"
          alt="Reception">
</map>
```

## Lazy Loading

Defer loading of off-screen images:

```html
<!-- Native lazy loading -->
<img src="image.jpg" alt="Description" loading="lazy">

<!-- Eager loading (default) -->
<img src="hero.jpg" alt="Hero image" loading="eager">
```

## Accessibility Best Practices

### Alt Text Guidelines

```html
<!-- Descriptive alt text -->
<img src="dog.jpg" alt="Golden retriever playing fetch in the park">

<!-- Decorative images (empty alt) -->
<img src="decoration.png" alt="">

<!-- Complex images -->
<img src="chart.png"
     alt="Bar chart showing sales increased 25% in Q4"
     longdesc="chart-description.html">
```

### Link Accessibility

```html
<!-- Clear link text -->
<a href="report.pdf">Download Annual Report (PDF, 2MB)</a>

<!-- Avoid vague text -->
<!-- Bad: -->
<a href="page.html">Click here</a>

<!-- Good: -->
<a href="page.html">Read our privacy policy</a>

<!-- ARIA for icons -->
<a href="https://twitter.com" aria-label="Follow us on Twitter">
    <img src="twitter-icon.png" alt="">
</a>
```

## Complete Example

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Links and Images Example</title>
</head>
<body>
    <header>
        <a href="/">
            <img src="logo.png" alt="Company Logo" width="150">
        </a>
        <nav>
            <a href="/">Home</a>
            <a href="/about.html">About</a>
            <a href="/contact.html">Contact</a>
        </nav>
    </header>

    <main>
        <h1>Welcome to Our Site</h1>

        <figure>
            <picture>
                <source media="(min-width: 800px)" srcset="hero-large.jpg">
                <source media="(min-width: 400px)" srcset="hero-medium.jpg">
                <img src="hero-small.jpg"
                     alt="Beautiful mountain landscape"
                     loading="eager">
            </picture>
            <figcaption>Photo by John Doe</figcaption>
        </figure>

        <h2 id="services">Our Services</h2>
        <p>We offer <a href="/services.html">various services</a>
        to meet your needs.</p>

        <h2 id="gallery">Gallery</h2>
        <div class="gallery">
            <a href="photos/photo1-large.jpg">
                <img src="photos/photo1-thumb.jpg"
                     alt="Sunset over ocean"
                     loading="lazy">
            </a>
            <a href="photos/photo2-large.jpg">
                <img src="photos/photo2-thumb.jpg"
                     alt="Mountain peaks"
                     loading="lazy">
            </a>
        </div>

        <h2>Resources</h2>
        <ul>
            <li><a href="guide.pdf" download>Download User Guide (PDF)</a></li>
            <li><a href="https://docs.example.com"
                   target="_blank"
                   rel="noopener noreferrer">
                   Online Documentation ↗
            </a></li>
        </ul>

        <h2>Contact</h2>
        <p>
            <a href="mailto:info@example.com">Email us</a> or
            <a href="tel:+1234567890">call (123) 456-7890</a>
        </p>
    </main>

    <footer>
        <p><a href="#top">Back to top ↑</a></p>
        <p>Follow us:
            <a href="https://twitter.com/example"
               target="_blank"
               rel="noopener noreferrer"
               aria-label="Twitter">
                <img src="icons/twitter.svg" alt="" width="24">
            </a>
            <a href="https://facebook.com/example"
               target="_blank"
               rel="noopener noreferrer"
               aria-label="Facebook">
                <img src="icons/facebook.svg" alt="" width="24">
            </a>
        </p>
    </footer>
</body>
</html>
```

## Exercises

### Exercise 1: Navigation Menu
Create a navigation menu with internal and external links.

::: details Solution
```html
<nav>
    <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/about.html">About Us</a></li>
        <li><a href="/services.html">Services</a></li>
        <li><a href="/contact.html">Contact</a></li>
        <li>
            <a href="https://twitter.com/company"
               target="_blank"
               rel="noopener noreferrer">
                Twitter ↗
            </a>
        </li>
    </ul>
</nav>
```
:::

### Exercise 2: Image Gallery
Create a simple image gallery with thumbnails that link to full-size images.

::: details Solution
```html
<h2>Photo Gallery</h2>
<div class="gallery">
    <figure>
        <a href="images/sunset-full.jpg">
            <img src="images/sunset-thumb.jpg"
                 alt="Sunset over the ocean"
                 width="200"
                 loading="lazy">
        </a>
        <figcaption>Sunset</figcaption>
    </figure>

    <figure>
        <a href="images/mountain-full.jpg">
            <img src="images/mountain-thumb.jpg"
                 alt="Snow-capped mountain peaks"
                 width="200"
                 loading="lazy">
        </a>
        <figcaption>Mountains</figcaption>
    </figure>

    <figure>
        <a href="images/forest-full.jpg">
            <img src="images/forest-thumb.jpg"
                 alt="Misty forest path"
                 width="200"
                 loading="lazy">
        </a>
        <figcaption>Forest</figcaption>
    </figure>
</div>
```
:::

### Exercise 3: Contact Section
Create a contact section with email, phone, and address with a map link.

::: details Solution
```html
<section id="contact">
    <h2>Contact Us</h2>

    <address>
        <p><strong>Email:</strong>
            <a href="mailto:hello@company.com">hello@company.com</a>
        </p>
        <p><strong>Phone:</strong>
            <a href="tel:+1-555-123-4567">+1 (555) 123-4567</a>
        </p>
        <p><strong>Address:</strong><br>
            123 Business Street<br>
            Suite 100<br>
            San Francisco, CA 94102
        </p>
        <p>
            <a href="https://maps.google.com/?q=123+Business+Street+SF"
               target="_blank"
               rel="noopener noreferrer">
                View on Google Maps ↗
            </a>
        </p>
    </address>

    <figure>
        <img src="office-photo.jpg"
             alt="Our modern office building exterior"
             width="400">
        <figcaption>Our headquarters</figcaption>
    </figure>
</section>
```
:::

## Summary

- Use `<a href="">` to create links
- `target="_blank"` opens links in new tabs (add `rel="noopener noreferrer"`)
- Link to page sections with `#id` anchors
- `mailto:` and `tel:` create email and phone links
- `<img>` requires `src` and `alt` attributes
- Use `srcset` and `<picture>` for responsive images
- `<figure>` and `<figcaption>` group images with captions
- `loading="lazy"` defers off-screen image loading
- Always write descriptive alt text for accessibility

## Next Steps

Continue to [Lists and Tables](/guide/html/04-lists-tables) to learn how to organize data.
