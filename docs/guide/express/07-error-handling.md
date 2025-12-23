# Error Handling in Express.js

Proper error handling is crucial for building robust applications. Express provides mechanisms for catching and handling errors throughout your application.

## Default Error Handling

Express has a built-in error handler that handles any errors thrown in the application:

```javascript
app.get('/', (req, res) => {
  throw new Error('Something went wrong!');
});

// Express catches this and sends a 500 response
```

However, relying on the default handler isn't ideal for production. Let's build better error handling.

## Synchronous Error Handling

Errors thrown in synchronous code are automatically caught:

```javascript
app.get('/sync-error', (req, res) => {
  throw new Error('Sync error occurred');
});

app.get('/user/:id', (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    throw new Error('Invalid user ID');
  }
  res.json({ id });
});
```

## Asynchronous Error Handling

Errors in async code must be passed to `next()`:

```javascript
// Using callbacks - pass error to next()
app.get('/callback', (req, res, next) => {
  fs.readFile('/file-does-not-exist', (err, data) => {
    if (err) {
      return next(err); // Pass error to error handler
    }
    res.send(data);
  });
});

// Using Promises - catch and pass to next()
app.get('/promise', (req, res, next) => {
  fetchData()
    .then(data => res.json(data))
    .catch(next); // Pass error to error handler
});

// Using async/await - try/catch
app.get('/async', async (req, res, next) => {
  try {
    const data = await fetchData();
    res.json(data);
  } catch (err) {
    next(err);
  }
});
```

### Express Async Handler

Use a wrapper to avoid repetitive try/catch:

```javascript
// Wrapper function
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Usage
app.get('/users', asyncHandler(async (req, res) => {
  const users = await User.findAll();
  res.json(users);
}));

// Or use express-async-errors package
require('express-async-errors');

app.get('/users', async (req, res) => {
  const users = await User.findAll(); // Errors auto-forwarded
  res.json(users);
});
```

## Custom Error Classes

Create specific error types for different scenarios:

```javascript
// errors/AppError.js
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
```

```javascript
// errors/index.js
const AppError = require('./AppError');

class BadRequestError extends AppError {
  constructor(message = 'Bad Request') {
    super(message, 400);
  }
}

class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, 401);
  }
}

class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') {
    super(message, 403);
  }
}

class NotFoundError extends AppError {
  constructor(message = 'Not Found') {
    super(message, 404);
  }
}

class ValidationError extends AppError {
  constructor(errors) {
    super('Validation Error', 400);
    this.errors = errors;
  }
}

module.exports = {
  AppError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ValidationError
};
```

### Using Custom Errors

```javascript
const { NotFoundError, ValidationError } = require('./errors');

app.get('/users/:id', async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    res.json(user);
  } catch (err) {
    next(err);
  }
});

app.post('/users', async (req, res, next) => {
  try {
    const errors = validateUser(req.body);
    if (errors.length > 0) {
      throw new ValidationError(errors);
    }
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
});
```

## Error Handler Middleware

Create a centralized error handler:

```javascript
// middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
  // Log error
  console.error(`${err.name}: ${err.message}`);
  console.error(err.stack);

  // Default values
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Handle specific error types
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors).map(e => e.message).join(', ');
  }

  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  if (err.code === 11000) {
    statusCode = 400;
    message = 'Duplicate field value';
  }

  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  }

  // Send response
  res.status(statusCode).json({
    status: 'error',
    message,
    ...(process.env.NODE_ENV === 'development' && {
      stack: err.stack,
      error: err
    })
  });
};

module.exports = errorHandler;
```

### Using the Error Handler

```javascript
const express = require('express');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Routes
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);

// 404 handler
app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
});

// Error handler (must be last)
app.use(errorHandler);
```

## Handling Different Environments

```javascript
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  if (process.env.NODE_ENV === 'development') {
    return res.status(statusCode).json({
      status: 'error',
      message: err.message,
      stack: err.stack,
      error: err
    });
  }

  // Production
  if (err.isOperational) {
    // Operational error: send message to client
    return res.status(statusCode).json({
      status: 'error',
      message: err.message
    });
  }

  // Programming error: don't leak details
  console.error('ERROR:', err);
  return res.status(500).json({
    status: 'error',
    message: 'Something went wrong'
  });
};
```

## Logging Errors

```bash
npm install winston
```

```javascript
// utils/logger.js
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

module.exports = logger;
```

```javascript
// middleware/errorHandler.js
const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  logger.error({
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userId: req.user?.id
  });

  // ... rest of error handling
};
```

## Handling Uncaught Exceptions

```javascript
// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! Shutting down...');
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

// Handle SIGTERM
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});
```

## Complete Error Handling Setup

```javascript
// app.js
const express = require('express');
require('express-async-errors');

const { NotFoundError } = require('./errors');
const errorHandler = require('./middleware/errorHandler');
const logger = require('./utils/logger');

const app = express();

app.use(express.json());

// Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/posts', require('./routes/posts'));

// 404 handler
app.use((req, res, next) => {
  next(new NotFoundError(`Route ${req.originalUrl} not found`));
});

// Error handler
app.use(errorHandler);

module.exports = app;
```

```javascript
// server.js
const app = require('./app');
const logger = require('./utils/logger');

process.on('uncaughtException', (err) => {
  logger.error('UNCAUGHT EXCEPTION!', err);
  process.exit(1);
});

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  logger.info(`Server running on port ${port}`);
});

process.on('unhandledRejection', (err) => {
  logger.error('UNHANDLED REJECTION!', err);
  server.close(() => process.exit(1));
});

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  server.close(() => logger.info('Process terminated'));
});
```

## Testing Error Handling

```javascript
// tests/errorHandling.test.js
const request = require('supertest');
const app = require('../app');

describe('Error Handling', () => {
  test('should return 404 for unknown routes', async () => {
    const res = await request(app).get('/unknown-route');
    expect(res.status).toBe(404);
    expect(res.body.message).toContain('not found');
  });

  test('should return 400 for invalid data', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({ email: 'invalid' });
    expect(res.status).toBe(400);
  });

  test('should return 401 for unauthorized access', async () => {
    const res = await request(app).get('/api/protected');
    expect(res.status).toBe(401);
  });
});
```

## Summary

In this tutorial, you learned:

- Handling synchronous and asynchronous errors
- Creating custom error classes
- Building centralized error handlers
- Environment-specific error responses
- Logging errors with Winston
- Handling uncaught exceptions
- Testing error handling

Next, we'll explore [Authentication](/guide/express/08-authentication) - securing your Express applications.
