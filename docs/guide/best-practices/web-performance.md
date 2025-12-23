# Web Performance

Website performance directly impacts user experience, conversion rates, and SEO rankings. Fast websites keep users engaged and improve business outcomes.

## Why Performance Matters

### User Impact
- 53% of mobile users abandon sites that take over 3 seconds to load
- Every 100ms delay reduces conversions by 7%
- Slow sites frustrate users and damage brand perception

### SEO Impact
- Google uses page speed as a ranking factor
- Core Web Vitals affect search rankings
- Faster sites get better visibility

## Core Web Vitals

Google's Core Web Vitals measure real-world user experience:

| Metric | Measures | Good | Needs Work | Poor |
|--------|----------|------|------------|------|
| **LCP** (Largest Contentful Paint) | Loading | < 2.5s | 2.5-4s | > 4s |
| **INP** (Interaction to Next Paint) | Interactivity | < 200ms | 200-500ms | > 500ms |
| **CLS** (Cumulative Layout Shift) | Visual stability | < 0.1 | 0.1-0.25 | > 0.25 |

### Largest Contentful Paint (LCP)

Time until the largest content element is visible.

**Common Causes of Poor LCP:**
- Slow server response
- Large unoptimized images
- Render-blocking resources
- Client-side rendering

**How to Improve:**
```html
<!-- Preload critical resources -->
<link rel="preload" href="hero-image.jpg" as="image">
<link rel="preload" href="critical.css" as="style">

<!-- Use responsive images -->
<img
    src="hero-800.jpg"
    srcset="hero-400.jpg 400w,
            hero-800.jpg 800w,
            hero-1200.jpg 1200w"
    sizes="(max-width: 600px) 400px, 800px"
    alt="Hero image"
>
```

### Interaction to Next Paint (INP)

Time from user interaction to visual response.

**How to Improve:**
```javascript
// ❌ Blocking the main thread
button.addEventListener('click', () => {
    // Heavy computation blocks UI
    processLargeDataset();
});

// ✅ Use requestIdleCallback or Web Workers
button.addEventListener('click', () => {
    // Show immediate feedback
    showLoadingState();

    // Defer heavy work
    requestIdleCallback(() => {
        processLargeDataset();
    });
});
```

### Cumulative Layout Shift (CLS)

Measures unexpected layout shifts during page load.

**How to Prevent:**
```css
/* ✅ Always set dimensions for images */
img {
    width: 100%;
    height: auto;
    aspect-ratio: 16 / 9;
}

/* ✅ Reserve space for dynamic content */
.ad-container {
    min-height: 250px;
}

/* ✅ Use transform for animations */
.animated {
    transform: translateX(100px); /* ✅ No layout shift */
    /* left: 100px; ❌ Causes layout shift */
}
```

## Image Optimization

Images often account for 50%+ of page weight.

### Choose the Right Format

| Format | Best For | Compression |
|--------|----------|-------------|
| WebP | Photos, general use | Lossy/Lossless |
| AVIF | Photos (best compression) | Lossy |
| SVG | Icons, logos, illustrations | Vector |
| PNG | Transparency needed | Lossless |
| JPEG | Photos (legacy support) | Lossy |

### Modern Image Loading

```html
<!-- Modern formats with fallback -->
<picture>
    <source srcset="image.avif" type="image/avif">
    <source srcset="image.webp" type="image/webp">
    <img src="image.jpg" alt="Description">
</picture>

<!-- Lazy loading -->
<img src="image.jpg" alt="Description" loading="lazy">

<!-- Eager loading for above-the-fold -->
<img src="hero.jpg" alt="Hero" loading="eager" fetchpriority="high">
```

### Responsive Images

```html
<img
    src="photo-800.jpg"
    srcset="
        photo-400.jpg 400w,
        photo-800.jpg 800w,
        photo-1200.jpg 1200w,
        photo-1600.jpg 1600w
    "
    sizes="
        (max-width: 600px) 100vw,
        (max-width: 1200px) 50vw,
        800px
    "
    alt="Responsive photo"
>
```

## CSS Performance

### Critical CSS

Inline critical styles for faster first paint:

```html
<head>
    <!-- Critical CSS inline -->
    <style>
        /* Above-the-fold styles */
        body { font-family: sans-serif; margin: 0; }
        .header { background: #333; color: white; }
    </style>

    <!-- Non-critical CSS deferred -->
    <link
        rel="preload"
        href="styles.css"
        as="style"
        onload="this.onload=null;this.rel='stylesheet'"
    >
</head>
```

### Efficient Selectors

```css
/* ✅ Efficient selectors */
.nav-link { }
.card-title { }

/* ❌ Inefficient selectors */
div.container ul li a { }
.wrapper > div > ul > li > a { }
[class^="icon-"] { }
```

### Minimize Reflows

```javascript
// ❌ Multiple reflows
element.style.width = '100px';
element.style.height = '100px';
element.style.margin = '10px';

// ✅ Single reflow with class
element.classList.add('sized');

// ✅ Or batch with cssText
element.style.cssText = 'width:100px; height:100px; margin:10px;';
```

## JavaScript Performance

### Loading Strategies

```html
<!-- Default: Blocks HTML parsing -->
<script src="app.js"></script>

<!-- Async: Downloads parallel, executes when ready -->
<script src="analytics.js" async></script>

<!-- Defer: Downloads parallel, executes after parsing -->
<script src="app.js" defer></script>

<!-- Module: Deferred by default -->
<script type="module" src="app.js"></script>
```

### When to Use Each

| Attribute | Use Case |
|-----------|----------|
| (none) | Critical, small inline scripts |
| `async` | Independent scripts (analytics) |
| `defer` | Scripts that need DOM |
| `module` | Modern ES modules |

### Code Splitting

Load only what's needed:

```javascript
// Dynamic import - loads only when needed
button.addEventListener('click', async () => {
    const { heavyFunction } = await import('./heavy-module.js');
    heavyFunction();
});
```

### Debouncing and Throttling

```javascript
// Debounce: Execute after delay with no new calls
function debounce(func, delay) {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), delay);
    };
}

// Throttle: Execute at most once per interval
function throttle(func, limit) {
    let inThrottle;
    return (...args) => {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Usage
window.addEventListener('resize', debounce(handleResize, 250));
window.addEventListener('scroll', throttle(handleScroll, 100));
```

## Caching Strategies

### Browser Caching

```
# .htaccess or server config
Cache-Control: public, max-age=31536000  # 1 year for static assets
Cache-Control: no-cache                   # Always revalidate
Cache-Control: no-store                   # Never cache
```

### Service Workers

```javascript
// Register service worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js');
}

// sw.js - Cache files for offline use
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open('v1').then((cache) => {
            return cache.addAll([
                '/',
                '/styles.css',
                '/app.js',
                '/offline.html'
            ]);
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then(response => response || fetch(event.request))
    );
});
```

## Resource Hints

```html
<head>
    <!-- DNS prefetch for external domains -->
    <link rel="dns-prefetch" href="//api.example.com">

    <!-- Preconnect for critical third parties -->
    <link rel="preconnect" href="https://fonts.googleapis.com">

    <!-- Prefetch resources for next navigation -->
    <link rel="prefetch" href="/next-page.html">

    <!-- Preload critical resources -->
    <link rel="preload" href="critical.css" as="style">
    <link rel="preload" href="hero.jpg" as="image">
</head>
```

## Measuring Performance

### Lighthouse

Built into Chrome DevTools:
1. Open DevTools (`F12`)
2. Go to Lighthouse tab
3. Select categories
4. Generate report

### WebPageTest

- [webpagetest.org](https://www.webpagetest.org)
- Tests from real locations
- Filmstrip and waterfall views
- Performance comparison

### Real User Monitoring

```javascript
// Measure Core Web Vitals
import { onCLS, onINP, onLCP } from 'web-vitals';

onCLS(console.log);
onINP(console.log);
onLCP(console.log);
```

## Performance Checklist

### Images
- [ ] Use modern formats (WebP, AVIF)
- [ ] Implement responsive images
- [ ] Lazy load below-the-fold images
- [ ] Specify dimensions to prevent CLS

### CSS
- [ ] Inline critical CSS
- [ ] Remove unused CSS
- [ ] Minimize CSS files
- [ ] Avoid expensive selectors

### JavaScript
- [ ] Defer non-critical scripts
- [ ] Code split large bundles
- [ ] Minimize and compress
- [ ] Remove unused code

### General
- [ ] Enable compression (gzip/brotli)
- [ ] Use a CDN
- [ ] Implement caching
- [ ] Optimize fonts

## Performance Budget

Set limits to prevent regression:

| Resource | Budget |
|----------|--------|
| Total page weight | < 1.5 MB |
| JavaScript | < 300 KB |
| Images | < 500 KB |
| Time to Interactive | < 3.5s |
| LCP | < 2.5s |

## Summary

- Core Web Vitals (LCP, INP, CLS) are key metrics
- Optimize images with modern formats and lazy loading
- Defer non-critical CSS and JavaScript
- Use caching and CDNs effectively
- Measure regularly and set performance budgets

## Next Steps

Learn about [Debugging Basics](/guide/skills/debugging) to troubleshoot issues in your optimized websites.
