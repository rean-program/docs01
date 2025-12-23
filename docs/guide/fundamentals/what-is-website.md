# What is a Website?

A website is a collection of web pages that are linked together and hosted on the internet. When you type a URL into your browser or click a link, you're accessing a website.

## Components of a Website

Every website consists of several key components:

### 1. Web Pages
Individual documents that contain content like text, images, videos, and interactive elements. Each page has its own unique URL.

### 2. Domain Name
The human-readable address of a website (e.g., `google.com`, `github.com`). Domain names are easier to remember than IP addresses.

### 3. Web Hosting
A service that stores your website files on a server connected to the internet, making your site accessible 24/7.

### 4. Files and Assets
- **HTML files** - Structure and content
- **CSS files** - Styling and layout
- **JavaScript files** - Interactivity and functionality
- **Images, videos, fonts** - Media assets

## Types of Websites

### Static Websites
- Content doesn't change unless manually updated
- Fast loading and simple to host
- Examples: Portfolio sites, documentation, landing pages

```html
<!-- Example of a simple static page -->
<!DOCTYPE html>
<html>
  <head>
    <title>My Static Website</title>
  </head>
  <body>
    <h1>Welcome to My Site</h1>
    <p>This content stays the same.</p>
  </body>
</html>
```

### Dynamic Websites
- Content changes based on user interaction or data
- Requires server-side processing
- Examples: Social media, e-commerce, web applications

### Web Applications
- Highly interactive and feature-rich
- Often feel like desktop applications
- Examples: Gmail, Google Docs, Trello

## Website vs Web Application

| Feature | Website | Web Application |
|---------|---------|-----------------|
| Purpose | Provide information | Perform tasks |
| Interactivity | Limited | High |
| User Input | Minimal | Extensive |
| Examples | Blog, News site | Email client, Project manager |

## How Websites Are Built

Websites are built using three core technologies:

### HTML (Structure)
HTML (HyperText Markup Language) defines the structure and content of web pages.

```html
<article>
  <h1>Article Title</h1>
  <p>This is a paragraph of content.</p>
</article>
```

### CSS (Style)
CSS (Cascading Style Sheets) controls the visual appearance.

```css
article {
  max-width: 800px;
  margin: 0 auto;
  font-family: Arial, sans-serif;
}
```

### JavaScript (Behavior)
JavaScript adds interactivity and dynamic functionality.

```javascript
document.querySelector('button').addEventListener('click', () => {
  alert('Button clicked!');
});
```

## Key Concepts

### URLs (Uniform Resource Locators)
A URL is the address of a specific resource on the web.

```
https://www.example.com/path/to/page.html
│       │              │
│       │              └── Path to resource
│       └── Domain name
└── Protocol (secure HTTP)
```

### Browsers
Web browsers (Chrome, Firefox, Safari, Edge) are applications that:
- Request web pages from servers
- Interpret HTML, CSS, and JavaScript
- Render the visual output you see

### Servers
Web servers are computers that:
- Store website files
- Respond to browser requests
- Deliver content over the internet

## Summary

- A website is a collection of interconnected web pages
- Websites are built with HTML, CSS, and JavaScript
- They're hosted on servers and accessed via domain names
- Websites can be static, dynamic, or full web applications

## Next Steps

Now that you understand what a website is, learn [How the Web Works](/guide/fundamentals/how-web-works) to understand the technology that makes it all possible.
