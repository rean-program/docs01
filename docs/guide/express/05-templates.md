# Template Engines in Express.js

Template engines enable you to use static template files and inject dynamic data at runtime. Express supports many template engines including EJS, Pug, and Handlebars.

## Setting Up a Template Engine

### Basic Configuration

```javascript
const express = require('express');
const path = require('path');
const app = express();

// Set the views directory
app.set('views', path.join(__dirname, 'views'));

// Set the template engine
app.set('view engine', 'ejs'); // or 'pug', 'hbs'
```

### Rendering Views

```javascript
app.get('/', (req, res) => {
  res.render('index', {
    title: 'Home Page',
    message: 'Welcome!'
  });
});
```

## EJS (Embedded JavaScript)

EJS is a simple templating language that lets you generate HTML with plain JavaScript.

### Installation

```bash
npm install ejs
```

### Basic Syntax

```javascript
// app.js
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('index', {
    title: 'My App',
    user: { name: 'John', email: 'john@example.com' },
    items: ['Apple', 'Banana', 'Orange']
  });
});
```

```html
<!-- views/index.ejs -->
<!DOCTYPE html>
<html>
<head>
  <title><%= title %></title>
</head>
<body>
  <h1>Hello, <%= user.name %>!</h1>

  <!-- Unescaped output (be careful with XSS) -->
  <%- '<strong>Bold text</strong>' %>

  <!-- Conditionals -->
  <% if (user) { %>
    <p>Email: <%= user.email %></p>
  <% } else { %>
    <p>Please log in</p>
  <% } %>

  <!-- Loops -->
  <ul>
    <% items.forEach(item => { %>
      <li><%= item %></li>
    <% }); %>
  </ul>

  <!-- Comments (not rendered) -->
  <%# This is a comment %>
</body>
</html>
```

### EJS Includes (Partials)

```html
<!-- views/partials/header.ejs -->
<!DOCTYPE html>
<html>
<head>
  <title><%= title %></title>
  <link rel="stylesheet" href="/css/style.css">
</head>
<body>
  <nav>
    <a href="/">Home</a>
    <a href="/about">About</a>
  </nav>
```

```html
<!-- views/partials/footer.ejs -->
  <footer>
    <p>&copy; 2024 My App</p>
  </footer>
</body>
</html>
```

```html
<!-- views/index.ejs -->
<%- include('partials/header', { title: 'Home' }) %>

<main>
  <h1>Welcome</h1>
  <p>This is the home page.</p>
</main>

<%- include('partials/footer') %>
```

### EJS Layouts

Create a layout system with includes:

```html
<!-- views/layouts/main.ejs -->
<!DOCTYPE html>
<html>
<head>
  <title><%= title %></title>
</head>
<body>
  <%- include('../partials/nav') %>

  <main>
    <%- body %>
  </main>

  <%- include('../partials/footer') %>
</body>
</html>
```

## Pug (formerly Jade)

Pug uses indentation-based syntax for cleaner templates.

### Installation

```bash
npm install pug
```

### Basic Syntax

```javascript
// app.js
app.set('view engine', 'pug');
```

```pug
//- views/index.pug
doctype html
html
  head
    title= title
    link(rel="stylesheet" href="/css/style.css")
  body
    h1 Hello, #{user.name}!

    //- Conditionals
    if user
      p Email: #{user.email}
    else
      p Please log in

    //- Loops
    ul
      each item in items
        li= item

    //- Attributes
    a(href="/about" class="btn" id="about-link") About

    //- Classes shorthand
    .container
      .row
        .col Content

    //- JavaScript
    - const year = new Date().getFullYear()
    p Copyright #{year}
```

### Pug Mixins (Reusable Components)

```pug
//- views/mixins/card.pug
mixin card(title, content)
  .card
    .card-header= title
    .card-body= content

//- views/index.pug
include mixins/card

+card('Welcome', 'This is a card component')
+card('About', 'Another card')
```

### Pug Inheritance

```pug
//- views/layouts/base.pug
doctype html
html
  head
    title= title
    block styles
  body
    include ../partials/nav

    main
      block content

    include ../partials/footer

    block scripts
```

```pug
//- views/home.pug
extends layouts/base

block styles
  link(rel="stylesheet" href="/css/home.css")

block content
  h1 Welcome Home
  p This is the home page

block scripts
  script(src="/js/home.js")
```

## Handlebars

Handlebars provides logic-less templates with helpers.

### Installation

```bash
npm install express-handlebars
```

### Setup

```javascript
const express = require('express');
const { engine } = require('express-handlebars');

const app = express();

app.engine('hbs', engine({
  extname: '.hbs',
  defaultLayout: 'main',
  layoutsDir: 'views/layouts',
  partialsDir: 'views/partials'
}));

app.set('view engine', 'hbs');
app.set('views', './views');

app.get('/', (req, res) => {
  res.render('home', {
    title: 'Home',
    user: { name: 'John' },
    items: ['Apple', 'Banana']
  });
});
```

### Basic Syntax

```handlebars
{{!-- views/layouts/main.hbs --}}
<!DOCTYPE html>
<html>
<head>
  <title>{{title}}</title>
</head>
<body>
  {{> nav}}

  <main>
    {{{body}}}
  </main>

  {{> footer}}
</body>
</html>
```

```handlebars
{{!-- views/home.hbs --}}
<h1>Hello, {{user.name}}!</h1>

{{!-- Conditionals --}}
{{#if user}}
  <p>Welcome back!</p>
{{else}}
  <p>Please log in</p>
{{/if}}

{{!-- Loops --}}
<ul>
  {{#each items}}
    <li>{{this}}</li>
  {{/each}}
</ul>

{{!-- Unless (inverse if) --}}
{{#unless loggedIn}}
  <a href="/login">Login</a>
{{/unless}}
```

### Handlebars Partials

```handlebars
{{!-- views/partials/nav.hbs --}}
<nav>
  <a href="/">Home</a>
  <a href="/about">About</a>
</nav>
```

### Custom Helpers

```javascript
app.engine('hbs', engine({
  helpers: {
    // Format date
    formatDate: (date) => {
      return new Date(date).toLocaleDateString();
    },
    // Conditional equality
    eq: (a, b) => a === b,
    // Uppercase
    upper: (str) => str.toUpperCase(),
    // JSON stringify
    json: (obj) => JSON.stringify(obj, null, 2)
  }
}));
```

```handlebars
<p>Date: {{formatDate createdAt}}</p>
<p>{{upper name}}</p>

{{#if (eq status 'active')}}
  <span class="badge">Active</span>
{{/if}}
```

## Comparing Template Engines

| Feature | EJS | Pug | Handlebars |
|---------|-----|-----|------------|
| Syntax | HTML + JS | Indentation | Mustache |
| Learning Curve | Low | Medium | Low |
| Logic in Templates | Full JS | Full JS | Limited |
| File Size | Small | Small | Medium |
| Performance | Fast | Fast | Fast |

## Practical Example: Blog Application

```javascript
const express = require('express');
const path = require('path');
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));

// Sample data
const posts = [
  { id: 1, title: 'First Post', content: 'Hello World', author: 'John', date: new Date() },
  { id: 2, title: 'Second Post', content: 'Express is great', author: 'Jane', date: new Date() }
];

// Home - List all posts
app.get('/', (req, res) => {
  res.render('home', {
    title: 'My Blog',
    posts
  });
});

// Single post
app.get('/posts/:id', (req, res) => {
  const post = posts.find(p => p.id === parseInt(req.params.id));
  if (!post) {
    return res.status(404).render('404', { title: 'Not Found' });
  }
  res.render('post', { title: post.title, post });
});

app.listen(3000);
```

```html
<!-- views/home.ejs -->
<%- include('partials/header', { title }) %>

<div class="container">
  <h1>Blog Posts</h1>

  <% if (posts.length === 0) { %>
    <p>No posts yet.</p>
  <% } else { %>
    <div class="posts">
      <% posts.forEach(post => { %>
        <article class="post-card">
          <h2><a href="/posts/<%= post.id %>"><%= post.title %></a></h2>
          <p class="meta">
            By <%= post.author %> on <%= post.date.toLocaleDateString() %>
          </p>
          <p><%= post.content.substring(0, 100) %>...</p>
          <a href="/posts/<%= post.id %>" class="read-more">Read more</a>
        </article>
      <% }); %>
    </div>
  <% } %>
</div>

<%- include('partials/footer') %>
```

```html
<!-- views/post.ejs -->
<%- include('partials/header', { title }) %>

<div class="container">
  <article class="post">
    <h1><%= post.title %></h1>
    <p class="meta">
      By <%= post.author %> on <%= post.date.toLocaleDateString() %>
    </p>
    <div class="content">
      <%- post.content %>
    </div>
    <a href="/" class="back-link">&larr; Back to posts</a>
  </article>
</div>

<%- include('partials/footer') %>
```

## Summary

In this tutorial, you learned:

- Setting up template engines in Express
- EJS syntax and features
- Pug indentation-based templates
- Handlebars logic-less templates
- Using partials and layouts
- Creating custom helpers
- Building a practical blog example

Next, we'll explore [Static Files](/guide/express/06-static-files) - serving CSS, JavaScript, and images.
