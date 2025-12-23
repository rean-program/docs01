# Context API

The Context object (`c`) is your best friend in Hono. It gives you everything you need to handle requests and send responses. Let's explore it in detail!

## What is Context?

Every route handler receives a Context object. Think of it as a toolbox:

```typescript
app.get('/example', (c) => {
    // 'c' is the Context object
    // It has tools for:
    // - Reading the request (c.req)
    // - Sending responses (c.json, c.text, etc.)
    // - Storing data (c.set, c.get)
    // - Accessing environment (c.env)

    return c.text('Hello!')
})
```

## Reading Request Data

### Get URL Parameters

URL parameters are the `:something` parts in your routes:

```typescript
// Route: /users/:id
// URL: /users/123

app.get('/users/:id', (c) => {
    // Get single parameter
    const id = c.req.param('id')  // '123'

    return c.json({ userId: id })
})

// Multiple parameters
// Route: /users/:userId/posts/:postId
// URL: /users/5/posts/10

app.get('/users/:userId/posts/:postId', (c) => {
    // Get individually
    const userId = c.req.param('userId')   // '5'
    const postId = c.req.param('postId')   // '10'

    // Or get all at once
    const allParams = c.req.param()
    // { userId: '5', postId: '10' }

    return c.json({ userId, postId })
})
```

### Get Query Parameters

Query parameters come after `?` in the URL:

```typescript
// URL: /search?q=hono&page=2&limit=10

app.get('/search', (c) => {
    // Get single query param
    const query = c.req.query('q')       // 'hono'
    const page = c.req.query('page')     // '2'
    const limit = c.req.query('limit')   // '10'

    // Missing param returns undefined
    const missing = c.req.query('foo')   // undefined

    // Get all query params
    const allQueries = c.req.query()
    // { q: 'hono', page: '2', limit: '10' }

    return c.json({
        searchQuery: query,
        page: parseInt(page || '1'),
        limit: parseInt(limit || '10')
    })
})

// Multiple values with same key
// URL: /filter?tag=js&tag=ts&tag=hono

app.get('/filter', (c) => {
    // queries() returns an array
    const tags = c.req.queries('tag')
    // ['js', 'ts', 'hono']

    return c.json({ tags })
})
```

### Get Request Headers

```typescript
app.get('/check-headers', (c) => {
    // Common headers
    const contentType = c.req.header('Content-Type')
    const auth = c.req.header('Authorization')
    const userAgent = c.req.header('User-Agent')
    const accept = c.req.header('Accept')

    // Custom headers
    const apiKey = c.req.header('X-API-Key')
    const requestId = c.req.header('X-Request-ID')

    // Headers are case-insensitive
    const same1 = c.req.header('content-type')
    const same2 = c.req.header('Content-Type')
    // Both return the same value

    return c.json({
        contentType,
        hasAuth: !!auth,
        userAgent,
        apiKey
    })
})
```

### Get Request Body

#### JSON Body (Most Common)

```typescript
app.post('/users', async (c) => {
    // Parse JSON body
    const body = await c.req.json()

    // Example body: { "name": "John", "email": "john@example.com" }
    console.log(body.name)   // 'John'
    console.log(body.email)  // 'john@example.com'

    return c.json({
        message: 'User created',
        user: body
    }, 201)
})

// With TypeScript types
interface CreateUserBody {
    name: string
    email: string
    age?: number
}

app.post('/users', async (c) => {
    const body = await c.req.json<CreateUserBody>()
    // Now TypeScript knows the shape of body!

    return c.json({ name: body.name, email: body.email })
})
```

#### Form Data

```typescript
// HTML form: <form method="POST" action="/login">
//   <input name="email" />
//   <input name="password" type="password" />
// </form>

app.post('/login', async (c) => {
    const body = await c.req.parseBody()

    const email = body.email      // 'user@example.com'
    const password = body.password // 'secret123'

    return c.json({ email })
})
```

#### File Upload

```typescript
// HTML form: <form method="POST" enctype="multipart/form-data">
//   <input name="file" type="file" />
//   <input name="description" />
// </form>

app.post('/upload', async (c) => {
    const body = await c.req.parseBody()

    // Get the file
    const file = body.file as File

    // Get other form fields
    const description = body.description as string

    // File properties
    console.log(file.name)  // 'photo.jpg'
    console.log(file.size)  // 12345 (bytes)
    console.log(file.type)  // 'image/jpeg'

    // Read file content
    const content = await file.arrayBuffer()

    return c.json({
        filename: file.name,
        size: file.size,
        type: file.type,
        description
    })
})
```

#### Raw Text Body

```typescript
app.post('/webhook', async (c) => {
    // Get raw text
    const rawBody = await c.req.text()

    console.log(rawBody)  // The raw string

    return c.text('Received')
})
```

### Get Other Request Info

```typescript
app.get('/info', (c) => {
    // HTTP method
    const method = c.req.method  // 'GET', 'POST', etc.

    // Full URL
    const url = c.req.url
    // 'http://localhost:8787/info?foo=bar'

    // Just the path
    const path = c.req.path  // '/info'

    // The raw Request object (Web standard)
    const rawRequest = c.req.raw

    return c.json({
        method,
        url,
        path
    })
})
```

## Sending Responses

### Text Response

```typescript
// Simple text
app.get('/hello', (c) => {
    return c.text('Hello World!')
})

// With status code
app.get('/not-found', (c) => {
    return c.text('Page not found', 404)
})

// With headers
app.get('/custom', (c) => {
    return c.text('Hello', 200, {
        'X-Custom-Header': 'value',
        'Cache-Control': 'no-cache'
    })
})
```

### JSON Response (Most Common for APIs)

```typescript
// Simple JSON
app.get('/user', (c) => {
    return c.json({
        id: 1,
        name: 'John',
        email: 'john@example.com'
    })
})

// With status code
app.post('/users', (c) => {
    return c.json(
        { id: 1, name: 'John' },
        201  // Created
    )
})

// Error responses
app.get('/error', (c) => {
    return c.json(
        { error: 'Something went wrong' },
        500  // Internal Server Error
    )
})

// With custom headers
app.get('/data', (c) => {
    return c.json(
        { data: 'value' },
        200,
        { 'Cache-Control': 'max-age=3600' }
    )
})
```

### HTML Response

```typescript
// Simple HTML
app.get('/page', (c) => {
    return c.html('<h1>Hello World!</h1>')
})

// Full HTML page
app.get('/home', (c) => {
    return c.html(`
        <!DOCTYPE html>
        <html>
            <head>
                <title>My App</title>
                <style>
                    body { font-family: Arial, sans-serif; }
                </style>
            </head>
            <body>
                <h1>Welcome!</h1>
                <p>This is my Hono app.</p>
            </body>
        </html>
    `)
})

// Dynamic HTML
app.get('/greet/:name', (c) => {
    const name = c.req.param('name')

    return c.html(`
        <h1>Hello, ${name}!</h1>
        <p>Welcome to our site.</p>
    `)
})
```

### Redirect Response

```typescript
// Temporary redirect (302) - default
app.get('/old-page', (c) => {
    return c.redirect('/new-page')
})

// Permanent redirect (301)
app.get('/legacy-url', (c) => {
    return c.redirect('/modern-url', 301)
})

// Redirect to external URL
app.get('/go-to-google', (c) => {
    return c.redirect('https://google.com')
})

// Redirect after action
app.post('/login', async (c) => {
    // ... login logic ...

    // Redirect to dashboard after successful login
    return c.redirect('/dashboard')
})
```

### No Content Response

```typescript
// 204 No Content - success but no body
app.delete('/users/:id', (c) => {
    // ... delete user logic ...

    return c.body(null, 204)
})
```

### Setting Response Headers

```typescript
app.get('/with-headers', (c) => {
    // Set individual headers
    c.header('X-Custom-Header', 'my-value')
    c.header('X-Another-Header', 'another-value')

    // Set cache headers
    c.header('Cache-Control', 'public, max-age=3600')

    // Set multiple cookies
    c.header('Set-Cookie', 'session=abc123', { append: true })
    c.header('Set-Cookie', 'user=john', { append: true })

    return c.json({ message: 'Check the headers!' })
})
```

### Setting Status Code

```typescript
app.get('/status-example', (c) => {
    // Set status before response
    c.status(201)

    return c.json({ created: true })
})
```

## Context Variables

Store data during a request (useful with middleware):

### Setting Variables

```typescript
// Define variable types (TypeScript)
type Variables = {
    user: { id: string; name: string }
    requestId: string
    startTime: number
}

const app = new Hono<{ Variables: Variables }>()

// Set variables in middleware
app.use('*', async (c, next) => {
    // Set values
    c.set('requestId', crypto.randomUUID())
    c.set('startTime', Date.now())

    await next()
})

app.use('/api/*', async (c, next) => {
    // Simulate getting user from token
    c.set('user', { id: '123', name: 'John' })

    await next()
})
```

### Getting Variables

```typescript
app.get('/api/profile', (c) => {
    // Get values set by middleware
    const user = c.get('user')
    const requestId = c.get('requestId')
    const startTime = c.get('startTime')

    return c.json({
        user,
        requestId,
        processingTime: Date.now() - startTime
    })
})
```

### Practical Example

```typescript
type Variables = {
    user: { id: string; name: string; role: string } | null
    requestId: string
}

const app = new Hono<{ Variables: Variables }>()

// Add request ID to every request
app.use('*', async (c, next) => {
    c.set('requestId', crypto.randomUUID())
    await next()
})

// Try to authenticate user
app.use('/api/*', async (c, next) => {
    const token = c.req.header('Authorization')

    if (token === 'Bearer valid-token') {
        c.set('user', {
            id: '1',
            name: 'John',
            role: 'admin'
        })
    } else {
        c.set('user', null)
    }

    await next()
})

// Use the variables
app.get('/api/me', (c) => {
    const user = c.get('user')
    const requestId = c.get('requestId')

    if (!user) {
        return c.json({
            error: 'Not authenticated',
            requestId
        }, 401)
    }

    return c.json({
        user,
        requestId
    })
})
```

## Environment Variables (Bindings)

For Cloudflare Workers, access environment variables and bindings:

### Basic Environment Variables

```typescript
// Define binding types
type Bindings = {
    API_KEY: string
    DATABASE_URL: string
    SECRET: string
}

const app = new Hono<{ Bindings: Bindings }>()

app.get('/config', (c) => {
    // Access environment variables
    const apiKey = c.env.API_KEY
    const dbUrl = c.env.DATABASE_URL

    return c.json({
        hasApiKey: !!apiKey,
        dbConfigured: !!dbUrl
    })
})
```

### Cloudflare KV Storage

```typescript
type Bindings = {
    MY_KV: KVNamespace
}

const app = new Hono<{ Bindings: Bindings }>()

// Read from KV
app.get('/kv/:key', async (c) => {
    const key = c.req.param('key')
    const value = await c.env.MY_KV.get(key)

    if (!value) {
        return c.json({ error: 'Key not found' }, 404)
    }

    return c.json({ key, value })
})

// Write to KV
app.post('/kv/:key', async (c) => {
    const key = c.req.param('key')
    const { value } = await c.req.json()

    await c.env.MY_KV.put(key, value)

    return c.json({ message: 'Saved', key, value })
})

// Delete from KV
app.delete('/kv/:key', async (c) => {
    const key = c.req.param('key')
    await c.env.MY_KV.delete(key)

    return c.json({ message: 'Deleted', key })
})
```

### Cloudflare D1 Database

```typescript
type Bindings = {
    DB: D1Database
}

const app = new Hono<{ Bindings: Bindings }>()

// Query database
app.get('/users', async (c) => {
    const { results } = await c.env.DB
        .prepare('SELECT * FROM users')
        .all()

    return c.json({ users: results })
})

// Insert into database
app.post('/users', async (c) => {
    const { name, email } = await c.req.json()

    const result = await c.env.DB
        .prepare('INSERT INTO users (name, email) VALUES (?, ?)')
        .bind(name, email)
        .run()

    return c.json({
        message: 'User created',
        id: result.lastRowId
    }, 201)
})
```

## Error Handling

### Using HTTPException

```typescript
import { HTTPException } from 'hono/http-exception'

app.get('/users/:id', (c) => {
    const id = c.req.param('id')

    // Validate ID
    if (isNaN(parseInt(id))) {
        throw new HTTPException(400, {
            message: 'Invalid user ID'
        })
    }

    // Simulate user not found
    if (id === '999') {
        throw new HTTPException(404, {
            message: 'User not found'
        })
    }

    return c.json({ id, name: 'John' })
})

// Handle errors globally
app.onError((err, c) => {
    if (err instanceof HTTPException) {
        return c.json({
            error: err.message,
            status: err.status
        }, err.status)
    }

    // Unknown error
    return c.json({
        error: 'Internal Server Error'
    }, 500)
})
```

### 404 Handler

```typescript
app.notFound((c) => {
    return c.json({
        error: 'Not Found',
        message: `Route ${c.req.method} ${c.req.path} not found`
    }, 404)
})
```

## Complete Example

```typescript
import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'

// Types
type Bindings = {
    API_KEY: string
}

type Variables = {
    user: { id: string; name: string } | null
    requestId: string
}

// Create app with types
const app = new Hono<{
    Bindings: Bindings
    Variables: Variables
}>()

// ===== MIDDLEWARE =====

// Request ID
app.use('*', async (c, next) => {
    c.set('requestId', crypto.randomUUID())
    c.header('X-Request-ID', c.get('requestId'))
    await next()
})

// Auth
app.use('/api/*', async (c, next) => {
    const token = c.req.header('Authorization')?.replace('Bearer ', '')

    if (token === 'valid') {
        c.set('user', { id: '1', name: 'John' })
    } else {
        c.set('user', null)
    }

    await next()
})

// ===== ROUTES =====

// Show request info
app.get('/', (c) => {
    return c.json({
        message: 'Welcome!',
        requestId: c.get('requestId'),
        info: {
            method: c.req.method,
            path: c.req.path,
            url: c.req.url
        }
    })
})

// Query parameters example
app.get('/search', (c) => {
    const query = c.req.query('q') || ''
    const page = parseInt(c.req.query('page') || '1')
    const limit = parseInt(c.req.query('limit') || '10')

    return c.json({
        query,
        page,
        limit,
        results: []
    })
})

// URL parameters example
app.get('/users/:id', (c) => {
    const id = c.req.param('id')

    if (isNaN(parseInt(id))) {
        throw new HTTPException(400, { message: 'Invalid ID' })
    }

    return c.json({
        id: parseInt(id),
        name: 'User ' + id
    })
})

// POST with JSON body
app.post('/api/posts', async (c) => {
    const user = c.get('user')

    if (!user) {
        throw new HTTPException(401, { message: 'Login required' })
    }

    const body = await c.req.json<{
        title: string
        content: string
    }>()

    if (!body.title || !body.content) {
        throw new HTTPException(400, {
            message: 'Title and content required'
        })
    }

    return c.json({
        id: 1,
        title: body.title,
        content: body.content,
        author: user.name,
        createdAt: new Date().toISOString()
    }, 201)
})

// Headers example
app.get('/headers', (c) => {
    return c.json({
        userAgent: c.req.header('User-Agent'),
        accept: c.req.header('Accept'),
        contentType: c.req.header('Content-Type')
    })
})

// Different response types
app.get('/html', (c) => {
    return c.html('<h1>Hello HTML!</h1>')
})

app.get('/redirect', (c) => {
    return c.redirect('/')
})

// ===== ERROR HANDLING =====

app.notFound((c) => {
    return c.json({
        error: 'Not Found',
        path: c.req.path,
        requestId: c.get('requestId')
    }, 404)
})

app.onError((err, c) => {
    console.error('Error:', err)

    if (err instanceof HTTPException) {
        return c.json({
            error: err.message,
            requestId: c.get('requestId')
        }, err.status)
    }

    return c.json({
        error: 'Internal Server Error',
        requestId: c.get('requestId')
    }, 500)
})

export default app
```

## Summary

In this chapter, you learned:

- ✅ Getting URL parameters (`c.req.param()`)
- ✅ Getting query parameters (`c.req.query()`)
- ✅ Getting headers (`c.req.header()`)
- ✅ Getting request body (JSON, form, file)
- ✅ Sending responses (text, JSON, HTML, redirect)
- ✅ Setting response headers
- ✅ Using context variables (`c.set()`, `c.get()`)
- ✅ Accessing environment variables (`c.env`)
- ✅ Error handling with HTTPException

## What's Next?

In the next chapter, we'll learn about [Validation](/guide/hono/05-validation):
- Built-in validators
- Zod integration
- Custom validation
- Type-safe validation

---

[Previous: Middleware](/guide/hono/03-middleware) | [Next: Validation →](/guide/hono/05-validation)
