# SEO Basics

Search Engine Optimization (SEO) helps your website rank higher in search results, bringing more organic traffic to your site.

## How Search Engines Work

1. **Crawling**: Bots discover pages by following links
2. **Indexing**: Content is analyzed and stored
3. **Ranking**: Pages are ordered by relevance and quality

## Essential Meta Tags

### Title Tag

The most important on-page SEO element.

```html
<head>
    <title>Learn JavaScript - Free Tutorial for Beginners | MySite</title>
</head>
```

**Best Practices:**
- 50-60 characters maximum
- Include primary keyword
- Make it compelling and unique
- Brand name at the end

### Meta Description

Appears in search results below the title.

```html
<meta name="description" content="Learn JavaScript from scratch with our free, comprehensive tutorial. Master variables, functions, DOM manipulation, and more. Start coding today!">
```

**Best Practices:**
- 150-160 characters maximum
- Include call-to-action
- Summarize page content
- Include relevant keywords naturally

### Viewport Meta

Essential for mobile SEO.

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

### Robots Meta

Control search engine behavior.

```html
<!-- Allow indexing (default) -->
<meta name="robots" content="index, follow">

<!-- Prevent indexing -->
<meta name="robots" content="noindex, nofollow">

<!-- Index but don't follow links -->
<meta name="robots" content="index, nofollow">
```

## Heading Structure

Use headings hierarchically for both SEO and accessibility.

```html
<h1>Main Page Title (Only One Per Page)</h1>

<h2>Major Section</h2>
<p>Content...</p>

<h3>Subsection</h3>
<p>Content...</p>

<h2>Another Major Section</h2>
<h3>Subsection</h3>
<h4>Sub-subsection</h4>
```

**Rules:**
- One `<h1>` per page
- Don't skip levels (h1 → h3)
- Include keywords naturally
- Make headings descriptive

## URL Structure

```
Good URLs:
✅ /blog/javascript-tutorial
✅ /products/wireless-headphones
✅ /about-us

Bad URLs:
❌ /page?id=123&cat=5
❌ /blog/post-123456
❌ /p/12345
```

**Best Practices:**
- Use hyphens, not underscores
- Keep URLs short and descriptive
- Include target keywords
- Use lowercase letters
- Avoid special characters

## Image Optimization

### Alt Text

```html
<!-- Descriptive alt text -->
<img src="golden-retriever.jpg" alt="Golden retriever playing fetch in a park">

<!-- Decorative images -->
<img src="decoration.png" alt="" role="presentation">

<!-- Image as link -->
<a href="/products">
    <img src="logo.png" alt="Company Name - Go to homepage">
</a>
```

### Image SEO Checklist

- [ ] Descriptive file names (`blue-widget.jpg` not `IMG_001.jpg`)
- [ ] Meaningful alt text
- [ ] Compressed file sizes
- [ ] Responsive images
- [ ] WebP format when possible

## Semantic HTML

Search engines understand semantic HTML better.

```html
<!-- Good: Semantic structure -->
<article>
    <header>
        <h1>Article Title</h1>
        <time datetime="2024-01-15">January 15, 2024</time>
    </header>

    <main>
        <p>Article content...</p>
    </main>

    <footer>
        <p>Written by <span>Author Name</span></p>
    </footer>
</article>

<!-- Bad: Div soup -->
<div class="article">
    <div class="header">
        <div class="title">Article Title</div>
    </div>
    <div class="content">...</div>
</div>
```

## Internal Linking

```html
<!-- Link to related content -->
<p>
    Learn more about
    <a href="/javascript/arrays">JavaScript arrays</a>
    in our detailed guide.
</p>

<!-- Breadcrumb navigation -->
<nav aria-label="Breadcrumb">
    <ol>
        <li><a href="/">Home</a></li>
        <li><a href="/tutorials">Tutorials</a></li>
        <li>JavaScript</li>
    </ol>
</nav>
```

**Best Practices:**
- Use descriptive anchor text
- Link to relevant pages
- Create a logical site structure
- Update broken links

## Structured Data (Schema.org)

Help search engines understand your content.

### JSON-LD Format

```html
<script type="application/ld+json">
{
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Learn JavaScript Basics",
    "author": {
        "@type": "Person",
        "name": "John Doe"
    },
    "datePublished": "2024-01-15",
    "image": "https://example.com/image.jpg",
    "publisher": {
        "@type": "Organization",
        "name": "MySite",
        "logo": {
            "@type": "ImageObject",
            "url": "https://example.com/logo.png"
        }
    }
}
</script>
```

### Common Schema Types

```html
<!-- Organization -->
<script type="application/ld+json">
{
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Company Name",
    "url": "https://example.com",
    "logo": "https://example.com/logo.png",
    "sameAs": [
        "https://twitter.com/company",
        "https://facebook.com/company"
    ]
}
</script>

<!-- FAQ Page -->
<script type="application/ld+json">
{
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [{
        "@type": "Question",
        "name": "What is JavaScript?",
        "acceptedAnswer": {
            "@type": "Answer",
            "text": "JavaScript is a programming language..."
        }
    }]
}
</script>

<!-- Breadcrumbs -->
<script type="application/ld+json">
{
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [{
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://example.com/"
    },{
        "@type": "ListItem",
        "position": 2,
        "name": "Tutorials",
        "item": "https://example.com/tutorials"
    }]
}
</script>
```

## Page Speed

Page speed is a ranking factor.

### Quick Wins

```html
<!-- Preload critical resources -->
<link rel="preload" href="critical.css" as="style">
<link rel="preload" href="hero.jpg" as="image">

<!-- Lazy load images -->
<img src="image.jpg" loading="lazy" alt="Description">

<!-- Defer non-critical JavaScript -->
<script src="analytics.js" defer></script>
```

### Performance Checklist

- [ ] Compress images
- [ ] Minify CSS/JavaScript
- [ ] Enable browser caching
- [ ] Use a CDN
- [ ] Optimize fonts
- [ ] Reduce server response time

## Mobile-First

Google uses mobile-first indexing.

```html
<!-- Viewport meta tag -->
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

**Requirements:**
- Responsive design
- Tap targets 44x44px minimum
- Readable text without zooming
- No horizontal scrolling

## Sitemap

Help search engines find all your pages.

```xml
<!-- sitemap.xml -->
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>https://example.com/</loc>
        <lastmod>2024-01-15</lastmod>
        <changefreq>weekly</changefreq>
        <priority>1.0</priority>
    </url>
    <url>
        <loc>https://example.com/about</loc>
        <lastmod>2024-01-10</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
    </url>
</urlset>
```

## Robots.txt

Control what search engines can access.

```txt
# robots.txt
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /private/

Sitemap: https://example.com/sitemap.xml
```

## Canonical URLs

Prevent duplicate content issues.

```html
<!-- Specify the preferred URL -->
<link rel="canonical" href="https://example.com/page">

<!-- For paginated content -->
<link rel="prev" href="https://example.com/page?p=1">
<link rel="next" href="https://example.com/page?p=3">
```

## Open Graph & Social

Optimize how your pages appear when shared.

```html
<!-- Open Graph (Facebook, LinkedIn) -->
<meta property="og:title" content="Page Title">
<meta property="og:description" content="Page description">
<meta property="og:image" content="https://example.com/image.jpg">
<meta property="og:url" content="https://example.com/page">
<meta property="og:type" content="article">

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Page Title">
<meta name="twitter:description" content="Page description">
<meta name="twitter:image" content="https://example.com/image.jpg">
```

## SEO Tools

| Tool | Purpose |
|------|---------|
| Google Search Console | Monitor search performance |
| Google Analytics | Track traffic and behavior |
| Lighthouse | Performance and SEO audits |
| Screaming Frog | Site crawling and analysis |
| Ahrefs/SEMrush | Keyword research, backlinks |

## SEO Checklist

### Technical SEO
- [ ] Mobile-friendly design
- [ ] Fast page load times
- [ ] HTTPS enabled
- [ ] XML sitemap submitted
- [ ] robots.txt configured
- [ ] Canonical URLs set

### On-Page SEO
- [ ] Unique title tags
- [ ] Meta descriptions
- [ ] Proper heading structure
- [ ] Optimized images with alt text
- [ ] Internal linking
- [ ] Clean URL structure

### Content
- [ ] Quality, original content
- [ ] Target relevant keywords
- [ ] Regular updates
- [ ] Structured data markup

## Summary

- Optimize title tags and meta descriptions
- Use semantic HTML and proper heading structure
- Create clean, descriptive URLs
- Optimize images with alt text
- Implement structured data
- Ensure fast page speed
- Make your site mobile-friendly
- Submit a sitemap

## Next Steps

Learn about [Web Storage](/guide/skills/web-storage) to store data in the browser.
