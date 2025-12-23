# Web Accessibility

Web accessibility (a11y) ensures that websites are usable by everyone, including people with disabilities. It's not just good practice—it's often a legal requirement.

## Why Accessibility Matters

### Who Benefits
- **Visual impairments** - Blindness, low vision, color blindness
- **Hearing impairments** - Deafness, hard of hearing
- **Motor impairments** - Limited fine motor control
- **Cognitive impairments** - Learning disabilities, attention disorders
- **Temporary disabilities** - Broken arm, lost glasses
- **Situational limitations** - Bright sunlight, noisy environment

### Business Benefits
- Larger audience reach
- Better SEO (search engines love accessible sites)
- Legal compliance
- Improved user experience for everyone

## Core Principles (POUR)

The Web Content Accessibility Guidelines (WCAG) are based on four principles:

| Principle | Meaning |
|-----------|---------|
| **Perceivable** | Users can perceive the content |
| **Operable** | Users can navigate and interact |
| **Understandable** | Content is clear and predictable |
| **Robust** | Works with assistive technologies |

## Semantic HTML

Using proper HTML elements is the foundation of accessibility.

### Good vs Bad Examples

```html
<!-- ❌ Bad: Non-semantic -->
<div class="button" onclick="submit()">Submit</div>
<div class="header">Page Title</div>

<!-- ✅ Good: Semantic -->
<button type="submit">Submit</button>
<h1>Page Title</h1>
```

### Document Structure

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <title>Descriptive Page Title</title>
</head>
<body>
    <header>
        <nav aria-label="Main navigation">
            <!-- Navigation links -->
        </nav>
    </header>

    <main>
        <h1>Main Heading</h1>
        <article>
            <h2>Article Title</h2>
            <p>Content...</p>
        </article>
    </main>

    <aside>
        <!-- Sidebar content -->
    </aside>

    <footer>
        <!-- Footer content -->
    </footer>
</body>
</html>
```

### Heading Hierarchy

Always use proper heading levels:

```html
<!-- ✅ Correct hierarchy -->
<h1>Page Title</h1>
    <h2>Section 1</h2>
        <h3>Subsection 1.1</h3>
        <h3>Subsection 1.2</h3>
    <h2>Section 2</h2>

<!-- ❌ Wrong: Skipping levels -->
<h1>Page Title</h1>
    <h4>This skips h2 and h3</h4>
```

## Images and Alt Text

Every image needs appropriate alt text:

```html
<!-- Informative image -->
<img src="chart.png" alt="Sales increased 25% from Q1 to Q2 2024">

<!-- Decorative image -->
<img src="decoration.png" alt="" role="presentation">

<!-- Complex image with long description -->
<figure>
    <img src="complex-diagram.png" alt="System architecture diagram">
    <figcaption>
        Detailed description of the system architecture...
    </figcaption>
</figure>

<!-- Image as link -->
<a href="/home">
    <img src="logo.png" alt="Company Name - Go to homepage">
</a>
```

### Alt Text Guidelines

| Image Type | Alt Text |
|------------|----------|
| Informative | Describe the content/message |
| Decorative | Empty alt="" |
| Functional | Describe the action |
| Complex | Brief alt + detailed description |
| Text in image | Include all text |

## Forms and Labels

Forms must be properly labeled and accessible.

```html
<!-- ✅ Accessible form -->
<form>
    <div>
        <label for="name">Full Name *</label>
        <input
            type="text"
            id="name"
            name="name"
            required
            aria-describedby="name-hint"
        >
        <span id="name-hint">Enter your first and last name</span>
    </div>

    <div>
        <label for="email">Email Address *</label>
        <input
            type="email"
            id="email"
            name="email"
            required
            aria-invalid="false"
        >
    </div>

    <fieldset>
        <legend>Preferred Contact Method</legend>
        <label>
            <input type="radio" name="contact" value="email"> Email
        </label>
        <label>
            <input type="radio" name="contact" value="phone"> Phone
        </label>
    </fieldset>

    <button type="submit">Submit Form</button>
</form>
```

### Form Best Practices
- Always use `<label>` with matching `for` attribute
- Group related inputs with `<fieldset>` and `<legend>`
- Indicate required fields clearly
- Provide helpful error messages
- Don't rely only on color for validation

## Keyboard Navigation

All interactive elements must be keyboard accessible.

### Focus Management

```css
/* ❌ Never remove focus outlines without replacement */
*:focus {
    outline: none;
}

/* ✅ Style focus states clearly */
*:focus {
    outline: 2px solid #005fcc;
    outline-offset: 2px;
}

/* ✅ Custom focus styles */
button:focus-visible {
    outline: 3px solid #005fcc;
    outline-offset: 2px;
}
```

### Skip Links

Allow users to skip repetitive content:

```html
<body>
    <a href="#main-content" class="skip-link">
        Skip to main content
    </a>

    <header><!-- Navigation --></header>

    <main id="main-content">
        <!-- Main content -->
    </main>
</body>
```

```css
.skip-link {
    position: absolute;
    top: -40px;
    left: 0;
    padding: 8px;
    background: #000;
    color: #fff;
    z-index: 100;
}

.skip-link:focus {
    top: 0;
}
```

### Tab Order

Ensure logical tab order:

```html
<!-- ✅ Natural tab order -->
<input type="text">     <!-- Tab 1 -->
<input type="email">    <!-- Tab 2 -->
<button>Submit</button> <!-- Tab 3 -->

<!-- ❌ Avoid changing tab order unless necessary -->
<input tabindex="2">
<input tabindex="1">
<input tabindex="3">
```

## Color and Contrast

### Contrast Requirements

| Element | Minimum Ratio |
|---------|---------------|
| Normal text | 4.5:1 |
| Large text (18pt+) | 3:1 |
| UI components | 3:1 |

```css
/* ✅ Good contrast */
.text {
    color: #333333;        /* Dark text */
    background: #ffffff;   /* Light background */
    /* Contrast ratio: 12.6:1 */
}

/* ❌ Poor contrast */
.low-contrast {
    color: #999999;
    background: #ffffff;
    /* Contrast ratio: 2.8:1 - fails WCAG */
}
```

### Don't Rely on Color Alone

```html
<!-- ❌ Color only -->
<span style="color: red;">Error occurred</span>

<!-- ✅ Color + icon + text -->
<span style="color: red;">
    ⚠️ Error: Please enter a valid email
</span>
```

## ARIA (Accessible Rich Internet Applications)

ARIA adds accessibility information when HTML alone isn't enough.

### Common ARIA Attributes

```html
<!-- Roles -->
<div role="navigation">...</div>
<div role="button" tabindex="0">Click me</div>
<div role="alert">Important message!</div>

<!-- States -->
<button aria-expanded="false">Menu</button>
<input aria-invalid="true">
<div aria-hidden="true">Decorative content</div>

<!-- Properties -->
<input aria-label="Search">
<input aria-describedby="help-text">
<nav aria-labelledby="nav-heading">
```

### ARIA Rules

1. **Don't use ARIA if native HTML works**
```html
<!-- ❌ Unnecessary ARIA -->
<div role="button">Click</div>

<!-- ✅ Use native element -->
<button>Click</button>
```

2. **Don't change native semantics**
```html
<!-- ❌ Wrong -->
<h1 role="button">Heading</h1>

<!-- ✅ Correct -->
<h1><button>Heading</button></h1>
```

## Multimedia Accessibility

### Video

```html
<video controls>
    <source src="video.mp4" type="video/mp4">
    <track
        kind="captions"
        src="captions.vtt"
        srclang="en"
        label="English"
        default
    >
    <track
        kind="descriptions"
        src="descriptions.vtt"
        srclang="en"
        label="Audio descriptions"
    >
</video>
```

### Audio

```html
<audio controls>
    <source src="podcast.mp3" type="audio/mpeg">
</audio>
<a href="transcript.html">Read transcript</a>
```

## Testing Accessibility

### Automated Tools
- **Lighthouse** - Built into Chrome DevTools
- **axe DevTools** - Browser extension
- **WAVE** - Web accessibility evaluation tool

### Manual Testing
1. Navigate using only keyboard (Tab, Enter, Space, Arrow keys)
2. Test with screen reader (NVDA, VoiceOver, JAWS)
3. Zoom to 200% and check layout
4. Disable CSS and check content order
5. Check color contrast

### Screen Reader Testing

| OS | Screen Reader |
|----|---------------|
| Windows | NVDA (free), JAWS |
| Mac | VoiceOver (built-in) |
| iOS | VoiceOver (built-in) |
| Android | TalkBack (built-in) |

## Accessibility Checklist

- [ ] All images have appropriate alt text
- [ ] Heading hierarchy is logical (h1 → h2 → h3)
- [ ] Forms have associated labels
- [ ] Color contrast meets WCAG standards
- [ ] Site is keyboard navigable
- [ ] Focus states are visible
- [ ] Skip links are provided
- [ ] Language is declared (`<html lang="en">`)
- [ ] Page has a descriptive title
- [ ] Error messages are clear and helpful
- [ ] Videos have captions
- [ ] Content is readable at 200% zoom

## Summary

- Accessibility benefits everyone, not just users with disabilities
- Use semantic HTML as the foundation
- Ensure keyboard navigation works
- Maintain sufficient color contrast
- Test with automated tools and manual methods
- Follow WCAG guidelines (aim for AA level)

## Next Steps

Learn about [Web Performance](/guide/best-practices/web-performance) to make your accessible sites fast too.
