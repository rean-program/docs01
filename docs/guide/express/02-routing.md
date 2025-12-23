# Routing in Express.js

Routing determines how your application responds to client requests at specific endpoints. Each route can have one or more handler functions.

## Basic Routing

A route definition has the structure:

```javascript
app.METHOD(PATH, HANDLER)
```

- `app` - Express instance
- `METHOD` - HTTP method (get, post, put, delete, etc.)
- `PATH` - URL path
- `HANDLER` - Function executed when route matches

```javascript
const express = require('express');
const app = express();

// Home page
app.get('/', (req, res) => {
  res.send('Home Page');
});

// About page
app.get('/about', (req, res) => {
  res.send('About Page');
});

// Contact page
app.get('/contact', (req, res) => {
  res.send('Contact Page');
});

app.listen(3000);
```

## Route Parameters

Capture dynamic values from the URL:

```javascript
// Single parameter
app.get('/users/:id', (req, res) => {
  const userId = req.params.id;
  res.send(`User ID: ${userId}`);
});
// GET /users/123 → User ID: 123

// Multiple parameters
app.get('/posts/:year/:month', (req, res) => {
  const { year, month } = req.params;
  res.send(`Posts from ${month}/${year}`);
});
// GET /posts/2024/03 → Posts from 03/2024

// Optional parameters (using regex)
app.get('/files/:name.:ext?', (req, res) => {
  const { name, ext } = req.params;
  res.json({ name, ext: ext || 'txt' });
});
// GET /files/readme → { name: "readme", ext: "txt" }
// GET /files/readme.md → { name: "readme", ext: "md" }
```

## Query Strings

Access query parameters with `req.query`:

```javascript
// GET /search?q=express&limit=10
app.get('/search', (req, res) => {
  const { q, limit = 20 } = req.query;
  res.json({
    query: q,
    limit: parseInt(limit),
    message: `Searching for "${q}" with limit ${limit}`
  });
});

// GET /products?category=electronics&sort=price&order=asc
app.get('/products', (req, res) => {
  const { category, sort, order } = req.query;
  res.json({ category, sort, order });
});
```

## Route Patterns

Express supports pattern matching in routes:

```javascript
// Match exact string
app.get('/about', handler);

// Match with parameter
app.get('/users/:id', handler);

// Match with wildcard (*)
app.get('/files/*', (req, res) => {
  res.send(`Path: ${req.params[0]}`);
});
// GET /files/images/photo.jpg → Path: images/photo.jpg

// Match with regex
app.get(/.*fly$/, (req, res) => {
  res.send('Matches: butterfly, dragonfly, etc.');
});
```

## Route Handlers

### Single Handler

```javascript
app.get('/example', (req, res) => {
  res.send('Hello');
});
```

### Multiple Handlers

```javascript
const logRequest = (req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next(); // Pass to next handler
};

const sendResponse = (req, res) => {
  res.send('Hello');
};

app.get('/example', logRequest, sendResponse);
```

### Array of Handlers

```javascript
const handlers = [
  (req, res, next) => {
    console.log('Handler 1');
    next();
  },
  (req, res, next) => {
    console.log('Handler 2');
    next();
  },
  (req, res) => {
    res.send('Done');
  }
];

app.get('/example', handlers);
```

## Express Router

Organize routes into modular files:

### routes/users.js

```javascript
const express = require('express');
const router = express.Router();

// GET /users
router.get('/', (req, res) => {
  res.json([
    { id: 1, name: 'John' },
    { id: 2, name: 'Jane' }
  ]);
});

// GET /users/:id
router.get('/:id', (req, res) => {
  res.json({ id: req.params.id, name: 'John' });
});

// POST /users
router.post('/', (req, res) => {
  res.status(201).json({ message: 'User created' });
});

// PUT /users/:id
router.put('/:id', (req, res) => {
  res.json({ message: `User ${req.params.id} updated` });
});

// DELETE /users/:id
router.delete('/:id', (req, res) => {
  res.json({ message: `User ${req.params.id} deleted` });
});

module.exports = router;
```

### routes/products.js

```javascript
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json([{ id: 1, name: 'Laptop' }]);
});

router.get('/:id', (req, res) => {
  res.json({ id: req.params.id, name: 'Laptop' });
});

module.exports = router;
```

### app.js

```javascript
const express = require('express');
const app = express();

const usersRouter = require('./routes/users');
const productsRouter = require('./routes/products');

// Mount routers
app.use('/users', usersRouter);
app.use('/products', productsRouter);

// Now these routes are available:
// GET /users
// GET /users/:id
// POST /users
// PUT /users/:id
// DELETE /users/:id
// GET /products
// GET /products/:id

app.listen(3000);
```

## Route Methods

### app.all()

Matches all HTTP methods:

```javascript
app.all('/api/*', (req, res, next) => {
  console.log('API request received');
  next();
});
```

### app.route()

Chain handlers for a single path:

```javascript
app.route('/book')
  .get((req, res) => {
    res.send('Get a book');
  })
  .post((req, res) => {
    res.send('Add a book');
  })
  .put((req, res) => {
    res.send('Update a book');
  })
  .delete((req, res) => {
    res.send('Delete a book');
  });
```

## RESTful API Example

```javascript
const express = require('express');
const app = express();

app.use(express.json());

// In-memory data store
let todos = [
  { id: 1, title: 'Learn Express', completed: false },
  { id: 2, title: 'Build API', completed: false }
];

// GET all todos
app.get('/api/todos', (req, res) => {
  res.json(todos);
});

// GET single todo
app.get('/api/todos/:id', (req, res) => {
  const todo = todos.find(t => t.id === parseInt(req.params.id));
  if (!todo) {
    return res.status(404).json({ error: 'Todo not found' });
  }
  res.json(todo);
});

// POST create todo
app.post('/api/todos', (req, res) => {
  const { title } = req.body;
  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  const todo = {
    id: todos.length + 1,
    title,
    completed: false
  };
  todos.push(todo);
  res.status(201).json(todo);
});

// PUT update todo
app.put('/api/todos/:id', (req, res) => {
  const todo = todos.find(t => t.id === parseInt(req.params.id));
  if (!todo) {
    return res.status(404).json({ error: 'Todo not found' });
  }

  const { title, completed } = req.body;
  todo.title = title ?? todo.title;
  todo.completed = completed ?? todo.completed;

  res.json(todo);
});

// DELETE todo
app.delete('/api/todos/:id', (req, res) => {
  const index = todos.findIndex(t => t.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ error: 'Todo not found' });
  }

  todos.splice(index, 1);
  res.status(204).send();
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

## 404 Handling

Handle unmatched routes:

```javascript
// Define all your routes first...
app.get('/', (req, res) => res.send('Home'));
app.get('/about', (req, res) => res.send('About'));

// Then add 404 handler at the end
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});
```

## Summary

In this tutorial, you learned:

- Basic route definitions
- Route parameters and query strings
- Route patterns and wildcards
- Multiple route handlers
- Express Router for modular code
- Building RESTful APIs
- Handling 404 errors

Next, we'll explore [Middleware](/guide/express/03-middleware) - the backbone of Express applications.
