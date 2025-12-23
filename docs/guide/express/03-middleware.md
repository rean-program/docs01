# Middleware in Express.js

Middleware functions are the backbone of Express applications. They have access to the request object, response object, and the next middleware function in the application's request-response cycle.

## What is Middleware?

Middleware functions can:

- Execute any code
- Modify request and response objects
- End the request-response cycle
- Call the next middleware in the stack

```javascript
const middleware = (req, res, next) => {
  // Do something
  next(); // Pass control to next middleware
};
```

## How Middleware Works

```javascript
const express = require('express');
const app = express();

// Middleware 1
app.use((req, res, next) => {
  console.log('1. First middleware');
  next();
});

// Middleware 2
app.use((req, res, next) => {
  console.log('2. Second middleware');
  next();
});

// Route handler
app.get('/', (req, res) => {
  console.log('3. Route handler');
  res.send('Hello World');
});

// Output for GET /:
// 1. First middleware
// 2. Second middleware
// 3. Route handler
```

## Built-in Middleware

Express comes with several built-in middleware functions:

### express.json()

Parses incoming JSON payloads:

```javascript
app.use(express.json());

app.post('/api/users', (req, res) => {
  console.log(req.body); // Parsed JSON object
  res.json({ received: req.body });
});
```

### express.urlencoded()

Parses URL-encoded payloads (form submissions):

```javascript
app.use(express.urlencoded({ extended: true }));

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  res.send(`Hello ${username}`);
});
```

### express.static()

Serves static files:

```javascript
// Serve files from 'public' directory
app.use(express.static('public'));

// With virtual path prefix
app.use('/static', express.static('public'));

// Multiple directories
app.use(express.static('public'));
app.use(express.static('uploads'));
```

### express.Router()

Creates modular route handlers (covered in Routing chapter).

## Application-Level Middleware

Bind to app instance using `app.use()` or `app.METHOD()`:

```javascript
const express = require('express');
const app = express();

// Runs for all requests
app.use((req, res, next) => {
  req.requestTime = Date.now();
  next();
});

// Runs only for /api/* paths
app.use('/api', (req, res, next) => {
  console.log('API request');
  next();
});

// Runs only for GET requests to /users
app.get('/users', (req, res, next) => {
  console.log('Getting users');
  next();
}, (req, res) => {
  res.send('Users list');
});
```

## Router-Level Middleware

Works the same as application-level but bound to `express.Router()`:

```javascript
const express = require('express');
const router = express.Router();

// Middleware for this router
router.use((req, res, next) => {
  console.log('Router middleware');
  next();
});

// Middleware for specific path
router.use('/admin', (req, res, next) => {
  console.log('Admin area');
  next();
});

router.get('/', (req, res) => {
  res.send('Router home');
});

module.exports = router;
```

## Third-Party Middleware

### Popular Middleware Packages

```bash
npm install morgan cors helmet compression cookie-parser
```

### morgan - HTTP Request Logger

```javascript
const morgan = require('morgan');

// Predefined formats
app.use(morgan('dev'));      // Colored output for development
app.use(morgan('combined')); // Apache combined format
app.use(morgan('tiny'));     // Minimal output

// Custom format
app.use(morgan(':method :url :status :response-time ms'));
```

### cors - Cross-Origin Resource Sharing

```javascript
const cors = require('cors');

// Enable all CORS requests
app.use(cors());

// Configure CORS
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Enable CORS for specific routes
app.get('/api/public', cors(), (req, res) => {
  res.json({ message: 'Public data' });
});
```

### helmet - Security Headers

```javascript
const helmet = require('helmet');

// Use all default protections
app.use(helmet());

// Configure specific protections
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));
```

### compression - Response Compression

```javascript
const compression = require('compression');

app.use(compression());

// With options
app.use(compression({
  level: 6,              // Compression level (0-9)
  threshold: 1024,       // Only compress responses > 1KB
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  }
}));
```

### cookie-parser - Parse Cookies

```javascript
const cookieParser = require('cookie-parser');

app.use(cookieParser());

app.get('/', (req, res) => {
  console.log(req.cookies);        // Unsigned cookies
  console.log(req.signedCookies);  // Signed cookies

  res.cookie('name', 'value', {
    httpOnly: true,
    secure: true,
    maxAge: 24 * 60 * 60 * 1000 // 1 day
  });
  res.send('Cookie set');
});
```

## Custom Middleware

### Logger Middleware

```javascript
const logger = (req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.url} ${res.statusCode} - ${duration}ms`);
  });

  next();
};

app.use(logger);
```

### Authentication Middleware

```javascript
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    // Verify token (example using jwt)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Protect routes
app.get('/api/profile', authenticate, (req, res) => {
  res.json({ user: req.user });
});
```

### Authorization Middleware

```javascript
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    next();
  };
};

// Usage
app.get('/api/admin', authenticate, authorize('admin'), (req, res) => {
  res.json({ message: 'Admin area' });
});

app.get('/api/dashboard', authenticate, authorize('admin', 'user'), (req, res) => {
  res.json({ message: 'Dashboard' });
});
```

### Validation Middleware

```javascript
const validateUser = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];

  if (!email || !email.includes('@')) {
    errors.push('Valid email is required');
  }

  if (!password || password.length < 6) {
    errors.push('Password must be at least 6 characters');
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};

app.post('/api/register', validateUser, (req, res) => {
  res.json({ message: 'User registered' });
});
```

### Rate Limiting Middleware

```javascript
const rateLimit = (windowMs, maxRequests) => {
  const requests = new Map();

  return (req, res, next) => {
    const ip = req.ip;
    const now = Date.now();

    // Clean old entries
    if (requests.has(ip)) {
      const data = requests.get(ip);
      data.requests = data.requests.filter(time => now - time < windowMs);
    }

    if (!requests.has(ip)) {
      requests.set(ip, { requests: [] });
    }

    const data = requests.get(ip);

    if (data.requests.length >= maxRequests) {
      return res.status(429).json({
        error: 'Too many requests',
        retryAfter: Math.ceil((data.requests[0] + windowMs - now) / 1000)
      });
    }

    data.requests.push(now);
    next();
  };
};

// 100 requests per 15 minutes
app.use('/api', rateLimit(15 * 60 * 1000, 100));
```

## Error-Handling Middleware

Error-handling middleware takes four arguments:

```javascript
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
};

// Must be defined AFTER all other middleware and routes
app.use(errorHandler);
```

### Triggering Error Handlers

```javascript
// Synchronous errors
app.get('/error', (req, res) => {
  throw new Error('Something went wrong');
});

// Asynchronous errors (must pass to next)
app.get('/async-error', async (req, res, next) => {
  try {
    await someAsyncOperation();
  } catch (error) {
    next(error);
  }
});

// Using express-async-errors package
require('express-async-errors');

app.get('/async-error', async (req, res) => {
  await someAsyncOperation(); // Errors auto-forwarded
});
```

## Middleware Order

Order matters! Middleware executes in the order it's defined:

```javascript
// Correct order
app.use(express.json());           // 1. Parse body
app.use(morgan('dev'));            // 2. Log requests
app.use(cors());                   // 3. Enable CORS
app.use(helmet());                 // 4. Security headers
app.use('/api', authenticate);     // 5. Auth for API routes

// Routes
app.use('/api/users', usersRouter);
app.use('/api/posts', postsRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler (always last)
app.use(errorHandler);
```

## Summary

In this tutorial, you learned:

- What middleware is and how it works
- Built-in middleware (json, urlencoded, static)
- Third-party middleware (morgan, cors, helmet)
- Creating custom middleware
- Authentication and authorization
- Error-handling middleware
- Proper middleware ordering

Next, we'll explore [Request & Response](/guide/express/04-request-response) objects in depth.
