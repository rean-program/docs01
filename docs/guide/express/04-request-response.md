# Request & Response in Express.js

Understanding the request and response objects is essential for building Express applications. These objects provide access to incoming data and methods to send responses.

## The Request Object (req)

The `req` object represents the HTTP request and contains properties for the request query string, parameters, body, headers, and more.

### Request Properties

```javascript
app.get('/example', (req, res) => {
  // URL and path
  console.log(req.url);          // /example?name=john
  console.log(req.path);         // /example
  console.log(req.originalUrl);  // /example?name=john
  console.log(req.baseUrl);      // Base URL if using router

  // HTTP method
  console.log(req.method);       // GET

  // Protocol and host
  console.log(req.protocol);     // http or https
  console.log(req.hostname);     // localhost
  console.log(req.ip);           // Client IP address

  // Check if secure (HTTPS)
  console.log(req.secure);       // true or false

  // Check if XHR (Ajax) request
  console.log(req.xhr);          // true or false
});
```

### Route Parameters

```javascript
// GET /users/123/posts/456
app.get('/users/:userId/posts/:postId', (req, res) => {
  console.log(req.params);
  // { userId: '123', postId: '456' }

  const { userId, postId } = req.params;
  res.json({ userId, postId });
});
```

### Query String

```javascript
// GET /search?q=express&page=2&limit=10
app.get('/search', (req, res) => {
  console.log(req.query);
  // { q: 'express', page: '2', limit: '10' }

  const { q, page = 1, limit = 20 } = req.query;
  res.json({
    query: q,
    page: parseInt(page),
    limit: parseInt(limit)
  });
});

// GET /filter?tags=js&tags=node&tags=express
app.get('/filter', (req, res) => {
  console.log(req.query.tags);
  // ['js', 'node', 'express']
});
```

### Request Body

```javascript
// Enable body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// POST with JSON body
app.post('/api/users', (req, res) => {
  console.log(req.body);
  // { name: 'John', email: 'john@example.com' }

  const { name, email } = req.body;
  res.json({ name, email });
});
```

### Request Headers

```javascript
app.get('/headers', (req, res) => {
  // Get all headers
  console.log(req.headers);

  // Get specific header (case-insensitive)
  console.log(req.get('Content-Type'));
  console.log(req.get('Authorization'));
  console.log(req.headers['user-agent']);

  // Check Accept header
  console.log(req.accepts('html'));        // 'html' or false
  console.log(req.accepts('json'));        // 'json' or false
  console.log(req.accepts(['html', 'json']));

  res.json({ headers: req.headers });
});
```

### Cookies

```javascript
const cookieParser = require('cookie-parser');
app.use(cookieParser('secret-key'));

app.get('/cookies', (req, res) => {
  // Unsigned cookies
  console.log(req.cookies);
  // { theme: 'dark', lang: 'en' }

  // Signed cookies
  console.log(req.signedCookies);
  // { sessionId: 'abc123' }

  res.json({
    cookies: req.cookies,
    signedCookies: req.signedCookies
  });
});
```

## The Response Object (res)

The `res` object represents the HTTP response that Express sends when it receives a request.

### Sending Responses

```javascript
// Send string
app.get('/text', (req, res) => {
  res.send('Hello World');
});

// Send HTML
app.get('/html', (req, res) => {
  res.send('<h1>Hello World</h1>');
});

// Send JSON
app.get('/json', (req, res) => {
  res.json({
    message: 'Hello World',
    timestamp: new Date()
  });
});

// Send JSON with pretty printing
app.get('/pretty', (req, res) => {
  res.set('Content-Type', 'application/json');
  res.send(JSON.stringify({ message: 'Hello' }, null, 2));
});
```

### Status Codes

```javascript
// Set status and send
app.get('/created', (req, res) => {
  res.status(201).json({ message: 'Created' });
});

// Send status only
app.get('/no-content', (req, res) => {
  res.sendStatus(204); // No Content
});

// Common status codes
app.post('/users', (req, res) => {
  // 200 OK - Success
  // 201 Created - Resource created
  // 204 No Content - Success with no body
  // 400 Bad Request - Invalid data
  // 401 Unauthorized - Not authenticated
  // 403 Forbidden - Not authorized
  // 404 Not Found - Resource not found
  // 500 Internal Server Error

  res.status(201).json({ id: 1, ...req.body });
});
```

### Response Headers

```javascript
app.get('/headers', (req, res) => {
  // Set single header
  res.set('X-Custom-Header', 'value');
  res.set('Content-Type', 'application/json');

  // Set multiple headers
  res.set({
    'X-Request-Id': '12345',
    'X-Response-Time': '100ms'
  });

  // Append to existing header
  res.append('Set-Cookie', 'foo=bar');
  res.append('Set-Cookie', 'baz=qux');

  // Remove header
  res.removeHeader('X-Powered-By');

  res.json({ message: 'Headers set' });
});
```

### Cookies

```javascript
app.get('/set-cookie', (req, res) => {
  // Simple cookie
  res.cookie('name', 'value');

  // Cookie with options
  res.cookie('session', 'abc123', {
    httpOnly: true,     // Not accessible via JavaScript
    secure: true,       // HTTPS only
    sameSite: 'strict', // CSRF protection
    maxAge: 24 * 60 * 60 * 1000, // 1 day in ms
    path: '/',          // Cookie path
    domain: '.example.com' // Cookie domain
  });

  // Signed cookie
  res.cookie('userId', '123', { signed: true });

  res.send('Cookies set');
});

app.get('/clear-cookie', (req, res) => {
  res.clearCookie('name');
  res.clearCookie('session', { path: '/' });
  res.send('Cookies cleared');
});
```

### Redirects

```javascript
// Simple redirect (302 by default)
app.get('/old-page', (req, res) => {
  res.redirect('/new-page');
});

// Redirect with status
app.get('/moved', (req, res) => {
  res.redirect(301, '/permanent-location');
});

// Redirect to external URL
app.get('/google', (req, res) => {
  res.redirect('https://google.com');
});

// Redirect back (uses Referer header)
app.post('/action', (req, res) => {
  // Process action...
  res.redirect('back');
});

// Redirect with query string
app.get('/search', (req, res) => {
  res.redirect('/results?q=' + encodeURIComponent(req.query.q));
});
```

### Sending Files

```javascript
const path = require('path');

// Send file
app.get('/file', (req, res) => {
  res.sendFile(path.join(__dirname, 'files', 'document.pdf'));
});

// Send file with options
app.get('/image', (req, res) => {
  res.sendFile('image.png', {
    root: path.join(__dirname, 'public'),
    headers: {
      'Cache-Control': 'max-age=31536000'
    }
  }, (err) => {
    if (err) {
      res.status(404).send('File not found');
    }
  });
});

// Download file (prompts save dialog)
app.get('/download', (req, res) => {
  res.download(
    path.join(__dirname, 'files', 'report.pdf'),
    'monthly-report.pdf', // Custom filename
    (err) => {
      if (err) {
        res.status(500).send('Download failed');
      }
    }
  );
});
```

### Content Negotiation

```javascript
app.get('/data', (req, res) => {
  const data = { name: 'John', age: 30 };

  res.format({
    'text/plain': () => {
      res.send(`Name: ${data.name}, Age: ${data.age}`);
    },
    'text/html': () => {
      res.send(`<p>Name: ${data.name}</p><p>Age: ${data.age}</p>`);
    },
    'application/json': () => {
      res.json(data);
    },
    default: () => {
      res.status(406).send('Not Acceptable');
    }
  });
});
```

### Streaming Responses

```javascript
const fs = require('fs');

app.get('/stream', (req, res) => {
  const stream = fs.createReadStream('large-file.txt');

  res.set('Content-Type', 'text/plain');
  stream.pipe(res);
});

// Server-Sent Events
app.get('/events', (req, res) => {
  res.set({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });

  const interval = setInterval(() => {
    res.write(`data: ${JSON.stringify({ time: new Date() })}\n\n`);
  }, 1000);

  req.on('close', () => {
    clearInterval(interval);
  });
});
```

## Request Lifecycle

```javascript
const express = require('express');
const app = express();

app.use(express.json());

// Track request timing
app.use((req, res, next) => {
  req.startTime = Date.now();

  // Override res.json to add timing
  const originalJson = res.json.bind(res);
  res.json = (data) => {
    const duration = Date.now() - req.startTime;
    res.set('X-Response-Time', `${duration}ms`);
    return originalJson(data);
  };

  next();
});

app.get('/api/data', (req, res) => {
  // Simulate processing
  setTimeout(() => {
    res.json({ message: 'Done' });
  }, 100);
});

app.listen(3000);
```

## Practical Example

```javascript
const express = require('express');
const app = express();

app.use(express.json());

// Products API
const products = [
  { id: 1, name: 'Laptop', price: 999 },
  { id: 2, name: 'Phone', price: 699 }
];

app.get('/api/products', (req, res) => {
  const { minPrice, maxPrice, sort } = req.query;

  let result = [...products];

  // Filter by price
  if (minPrice) {
    result = result.filter(p => p.price >= parseInt(minPrice));
  }
  if (maxPrice) {
    result = result.filter(p => p.price <= parseInt(maxPrice));
  }

  // Sort
  if (sort === 'price') {
    result.sort((a, b) => a.price - b.price);
  } else if (sort === '-price') {
    result.sort((a, b) => b.price - a.price);
  }

  res.json({
    count: result.length,
    data: result
  });
});

app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));

  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  // Content negotiation
  res.format({
    json: () => res.json(product),
    html: () => res.send(`<h1>${product.name}</h1><p>$${product.price}</p>`),
    default: () => res.json(product)
  });
});

app.listen(3000);
```

## Summary

In this tutorial, you learned:

- Request object properties and methods
- Accessing params, query, body, and headers
- Response methods (send, json, status)
- Setting headers and cookies
- Redirects and file downloads
- Content negotiation
- Streaming responses

Next, we'll explore [Template Engines](/guide/express/05-templates) for rendering dynamic HTML.
