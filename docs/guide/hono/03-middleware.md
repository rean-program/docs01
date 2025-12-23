# Middleware

Middleware is code that runs **between** receiving a request and sending a response. Think of it like security checkpoints at an airport - every request passes through them before reaching the destination.

## What is Middleware?

Middleware can:
- ✅ Run code before your route handler
- ✅ Run code after your route handler
- ✅ Modify the request or response
- ✅ Stop the request (e.g., if not authenticated)
- ✅ Pass data to the next middleware/handler

### Visual Flow

```
Request comes in
      ↓
┌─────────────────┐
│  Middleware 1   │ ← Runs first (e.g., logging)
│    (before)     │
└─────────────────┘
      ↓
┌─────────────────┐
│  Middleware 2   │ ← Runs second (e.g., auth check)
│    (before)     │
└─────────────────┘
      ↓
┌─────────────────┐
│  Route Handler  │ ← Your actual code
└─────────────────┘
      ↓
┌─────────────────┐
│  Middleware 2   │ ← Runs after handler
│    (after)      │
└─────────────────┘
      ↓
┌─────────────────┐
│  Middleware 1   │ ← Runs last
│    (after)      │
└─────────────────┘
      ↓
Response sent back
```

## Basic Middleware

### Your First Middleware

```typescript
import { Hono } from 'hono'

const app = new Hono()

// This middleware runs for EVERY request
app.use('*', async (c, next) => {
    console.log('🚀 Request started!')
    console.log(`📍 ${c.req.method} ${c.req.path}`)

    await next()  // Continue to next middleware/handler

    console.log('✅ Request finished!')
})

app.get('/', (c) => {
    console.log('👋 Handler running')
    return c.text('Hello!')
})

export default app
```

**When you visit `/`, you'll see:**
```
🚀 Request started!
📍 GET /
👋 Handler running
✅ Request finished!
```

### Understanding `next()`

The `next()` function is crucial - it passes control to the next middleware or handler:

```typescript
// WITHOUT next() - request stops here!
app.use('*', async (c, next) => {
    console.log('Start')
    // Forgot next()!
})

// WITH next() - continues to handler
app.use('*', async (c, next) => {
    console.log('Start')
    await next()  // ← Important!
    console.log('End')
})
```

## Built-in Middleware

Hono comes with useful middleware ready to use.

### Logger - See All Requests

```typescript
import { Hono } from 'hono'
import { logger } from 'hono/logger'

const app = new Hono()

// Add logging
app.use('*', logger())

app.get('/', (c) => c.text('Hello!'))
app.get('/users', (c) => c.json([]))

export default app
```

**Output in console:**
```
<-- GET /
--> GET / 200 5ms

<-- GET /users
--> GET /users 200 2ms
```

### CORS - Allow Cross-Origin Requests

When your frontend (e.g., React) calls your API, you need CORS:

```typescript
import { Hono } from 'hono'
import { cors } from 'hono/cors'

const app = new Hono()

// Allow ALL origins (for development)
app.use('/api/*', cors())

// Or be specific (for production)
app.use('/api/*', cors({
    origin: 'https://mywebsite.com',  // Only allow this domain
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowHeaders: ['Content-Type', 'Authorization'],
    credentials: true  // Allow cookies
}))

// Allow multiple origins
app.use('/api/*', cors({
    origin: ['https://mywebsite.com', 'https://admin.mywebsite.com']
}))

app.get('/api/data', (c) => c.json({ data: 'value' }))

export default app
```

### Basic Auth - Simple Username/Password

```typescript
import { Hono } from 'hono'
import { basicAuth } from 'hono/basic-auth'

const app = new Hono()

// Protect admin routes
app.use('/admin/*', basicAuth({
    username: 'admin',
    password: 'secret123'
}))

// Public route - anyone can access
app.get('/', (c) => c.text('Public page'))

// Protected route - needs username/password
app.get('/admin/dashboard', (c) => {
    return c.text('Welcome to admin dashboard!')
})

export default app
```

**What happens:**
- Visit `/` → Works normally
- Visit `/admin/dashboard` → Browser asks for username/password

### Bearer Auth - Token Authentication

```typescript
import { Hono } from 'hono'
import { bearerAuth } from 'hono/bearer-auth'

const app = new Hono()

// Simple token check
app.use('/api/*', bearerAuth({
    token: 'my-secret-token-12345'
}))

// Client must send: Authorization: Bearer my-secret-token-12345
app.get('/api/data', (c) => {
    return c.json({ secret: 'data' })
})

export default app
```

**To access:**
```bash
curl http://localhost:8787/api/data \
  -H "Authorization: Bearer my-secret-token-12345"
```

### Pretty JSON - Formatted JSON Output

```typescript
import { Hono } from 'hono'
import { prettyJSON } from 'hono/pretty-json'

const app = new Hono()

app.use('*', prettyJSON())

app.get('/data', (c) => {
    return c.json({
        user: { name: 'John', age: 30 },
        posts: [1, 2, 3]
    })
})

export default app
```

**Without `?pretty`:**
```json
{"user":{"name":"John","age":30},"posts":[1,2,3]}
```

**With `?pretty`:**
```json
{
  "user": {
    "name": "John",
    "age": 30
  },
  "posts": [1, 2, 3]
}
```

### Secure Headers - Add Security Headers

```typescript
import { Hono } from 'hono'
import { secureHeaders } from 'hono/secure-headers'

const app = new Hono()

// Add security headers to all responses
app.use('*', secureHeaders())

app.get('/', (c) => c.text('Secure page'))

export default app
```

**Adds headers like:**
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: SAMEORIGIN`
- `X-XSS-Protection: 1; mode=block`

### Compress - Smaller Responses

```typescript
import { Hono } from 'hono'
import { compress } from 'hono/compress'

const app = new Hono()

// Compress all responses
app.use('*', compress())

app.get('/big-data', (c) => {
    // This large response will be compressed
    return c.json({ data: 'lots of data...'.repeat(1000) })
})

export default app
```

## Creating Custom Middleware

### Simple Custom Middleware

```typescript
import { Hono } from 'hono'

const app = new Hono()

// Custom middleware: Add request timing
app.use('*', async (c, next) => {
    const start = Date.now()

    await next()

    const duration = Date.now() - start
    c.header('X-Response-Time', `${duration}ms`)
    console.log(`Request took ${duration}ms`)
})

app.get('/', (c) => c.text('Hello!'))

export default app
```

### Request ID Middleware

Give every request a unique ID for tracking:

```typescript
import { Hono } from 'hono'

const app = new Hono()

// Add unique ID to each request
app.use('*', async (c, next) => {
    // Check if client sent an ID, or create new one
    const requestId = c.req.header('X-Request-ID') || crypto.randomUUID()

    // Store it for later use
    c.set('requestId', requestId)

    // Add to response
    c.header('X-Request-ID', requestId)

    await next()
})

app.get('/', (c) => {
    const requestId = c.get('requestId')
    return c.json({
        message: 'Hello!',
        requestId: requestId
    })
})

export default app
```

### Authentication Middleware

```typescript
import { Hono } from 'hono'

// Define types for our variables
type Variables = {
    user: {
        id: string
        name: string
        role: string
    }
}

const app = new Hono<{ Variables: Variables }>()

// Authentication middleware
const authMiddleware = async (c, next) => {
    // Get token from header
    const token = c.req.header('Authorization')?.replace('Bearer ', '')

    // No token? Reject!
    if (!token) {
        return c.json({ error: 'No token provided' }, 401)
    }

    // Invalid token? Reject!
    // (In real app, verify JWT here)
    if (token !== 'valid-token') {
        return c.json({ error: 'Invalid token' }, 401)
    }

    // Token is good! Set user info
    c.set('user', {
        id: '123',
        name: 'John Doe',
        role: 'user'
    })

    await next()
}

// Public routes (no auth needed)
app.get('/', (c) => c.text('Welcome!'))
app.get('/public', (c) => c.text('Public page'))

// Protected routes (auth required)
app.use('/api/*', authMiddleware)

app.get('/api/profile', (c) => {
    const user = c.get('user')
    return c.json({
        message: `Hello ${user.name}!`,
        user: user
    })
})

app.get('/api/settings', (c) => {
    const user = c.get('user')
    return c.json({
        user: user.name,
        settings: { theme: 'dark' }
    })
})

export default app
```

**Testing:**
```bash
# Without token - fails
curl http://localhost:8787/api/profile
# {"error":"No token provided"}

# With valid token - works!
curl http://localhost:8787/api/profile \
  -H "Authorization: Bearer valid-token"
# {"message":"Hello John Doe!","user":{...}}
```

### Admin Only Middleware

```typescript
// Check if user is admin
const adminOnly = async (c, next) => {
    const user = c.get('user')

    if (!user) {
        return c.json({ error: 'Not authenticated' }, 401)
    }

    if (user.role !== 'admin') {
        return c.json({ error: 'Admin access required' }, 403)
    }

    await next()
}

// Usage: Chain middlewares
app.get('/admin/users',
    authMiddleware,  // First: check if logged in
    adminOnly,       // Then: check if admin
    (c) => {
        return c.json({ users: [] })
    }
)
```

### Rate Limiting Middleware

Prevent too many requests:

```typescript
import { Hono } from 'hono'

const app = new Hono()

// Simple rate limiter
const rateLimiter = () => {
    const requests = new Map()  // Store: IP -> { count, resetTime }

    return async (c, next) => {
        const ip = c.req.header('x-forwarded-for') || 'unknown'
        const now = Date.now()
        const windowMs = 60 * 1000  // 1 minute
        const maxRequests = 10      // 10 requests per minute

        const record = requests.get(ip)

        // Reset if window expired
        if (!record || now > record.resetTime) {
            requests.set(ip, {
                count: 1,
                resetTime: now + windowMs
            })
            await next()
            return
        }

        // Too many requests?
        if (record.count >= maxRequests) {
            return c.json({
                error: 'Too many requests',
                retryAfter: Math.ceil((record.resetTime - now) / 1000)
            }, 429)
        }

        // Increment count
        record.count++
        await next()
    }
}

// Apply rate limiting to API
app.use('/api/*', rateLimiter())

app.get('/api/data', (c) => {
    return c.json({ data: 'value' })
})

export default app
```

### Error Handling Middleware

Catch all errors in one place:

```typescript
import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'

const app = new Hono()

// Error handler middleware
app.use('*', async (c, next) => {
    try {
        await next()
    } catch (error) {
        console.error('Error caught:', error)

        // Handle known HTTP errors
        if (error instanceof HTTPException) {
            return c.json({
                error: error.message,
                status: error.status
            }, error.status)
        }

        // Handle unknown errors
        return c.json({
            error: 'Internal Server Error',
            message: error.message
        }, 500)
    }
})

// Route that might throw
app.get('/users/:id', (c) => {
    const id = c.req.param('id')

    if (id === '0') {
        throw new HTTPException(400, { message: 'Invalid user ID' })
    }

    if (id === '999') {
        throw new HTTPException(404, { message: 'User not found' })
    }

    return c.json({ id, name: 'John' })
})

// Route with unexpected error
app.get('/crash', (c) => {
    throw new Error('Something went wrong!')
})

export default app
```

## Middleware for Specific Routes

### Apply to All Routes

```typescript
// '*' means all routes
app.use('*', logger())
app.use('*', cors())
```

### Apply to Path Prefix

```typescript
// Only /api/* routes
app.use('/api/*', authMiddleware)

// Only /admin/* routes
app.use('/admin/*', adminOnly)
```

### Apply to Single Route

```typescript
// Only this specific route
app.get('/protected',
    authMiddleware,  // Middleware
    (c) => {         // Handler
        return c.text('Secret content')
    }
)
```

### Multiple Middlewares on Route

```typescript
app.post('/admin/users',
    authMiddleware,     // 1. Check login
    adminOnly,          // 2. Check admin
    rateLimiter(),      // 3. Rate limit
    async (c) => {      // 4. Handler
        const body = await c.req.json()
        return c.json({ created: body })
    }
)
```

## Complete Example: API with Multiple Middleware

```typescript
import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { cors } from 'hono/cors'
import { secureHeaders } from 'hono/secure-headers'
import { prettyJSON } from 'hono/pretty-json'

// Types
type Variables = {
    user: { id: string; name: string; role: 'user' | 'admin' } | null
    requestId: string
}

const app = new Hono<{ Variables: Variables }>()

// ===== GLOBAL MIDDLEWARE (runs on ALL requests) =====

// 1. Add request ID
app.use('*', async (c, next) => {
    c.set('requestId', crypto.randomUUID())
    c.header('X-Request-ID', c.get('requestId'))
    await next()
})

// 2. Timing
app.use('*', async (c, next) => {
    const start = Date.now()
    await next()
    c.header('X-Response-Time', `${Date.now() - start}ms`)
})

// 3. Logging
app.use('*', logger())

// 4. Security headers
app.use('*', secureHeaders())

// 5. Pretty JSON
app.use('*', prettyJSON())

// ===== API MIDDLEWARE =====

// CORS for API routes
app.use('/api/*', cors({
    origin: '*',
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE']
}))

// Auth for API routes
app.use('/api/*', async (c, next) => {
    const token = c.req.header('Authorization')?.replace('Bearer ', '')

    if (token === 'user-token') {
        c.set('user', { id: '1', name: 'John', role: 'user' })
    } else if (token === 'admin-token') {
        c.set('user', { id: '2', name: 'Admin', role: 'admin' })
    } else {
        c.set('user', null)
    }

    await next()
})

// ===== HELPER MIDDLEWARE =====

// Require authentication
const requireAuth = async (c, next) => {
    if (!c.get('user')) {
        return c.json({
            error: 'Authentication required',
            requestId: c.get('requestId')
        }, 401)
    }
    await next()
}

// Require admin role
const requireAdmin = async (c, next) => {
    const user = c.get('user')
    if (!user || user.role !== 'admin') {
        return c.json({
            error: 'Admin access required',
            requestId: c.get('requestId')
        }, 403)
    }
    await next()
}

// ===== ROUTES =====

// Public
app.get('/', (c) => {
    return c.json({
        message: 'Welcome to the API!',
        requestId: c.get('requestId')
    })
})

// Public API
app.get('/api/products', (c) => {
    return c.json({
        products: [
            { id: 1, name: 'Laptop', price: 999 },
            { id: 2, name: 'Phone', price: 699 }
        ]
    })
})

// Requires login
app.get('/api/profile', requireAuth, (c) => {
    return c.json({
        user: c.get('user')
    })
})

// Requires login
app.get('/api/orders', requireAuth, (c) => {
    const user = c.get('user')!
    return c.json({
        userId: user.id,
        orders: [
            { id: 1, total: 99.99, status: 'delivered' }
        ]
    })
})

// Requires admin
app.get('/api/admin/users', requireAuth, requireAdmin, (c) => {
    return c.json({
        users: [
            { id: 1, name: 'John', role: 'user' },
            { id: 2, name: 'Admin', role: 'admin' }
        ]
    })
})

app.post('/api/admin/users', requireAuth, requireAdmin, async (c) => {
    const body = await c.req.json()
    return c.json({
        message: 'User created',
        user: { id: 999, ...body }
    }, 201)
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
    console.error(`[${c.get('requestId')}] Error:`, err)
    return c.json({
        error: 'Internal Server Error',
        requestId: c.get('requestId')
    }, 500)
})

export default app
```

**Testing the API:**

```bash
# Public - works without auth
curl http://localhost:8787/
curl http://localhost:8787/api/products

# Protected - needs user token
curl http://localhost:8787/api/profile \
  -H "Authorization: Bearer user-token"

# Admin - needs admin token
curl http://localhost:8787/api/admin/users \
  -H "Authorization: Bearer admin-token"

# Wrong token - gets 403
curl http://localhost:8787/api/admin/users \
  -H "Authorization: Bearer user-token"
```

## Summary

In this chapter, you learned:

- ✅ What middleware is and how it works
- ✅ Built-in middleware (logger, CORS, auth, etc.)
- ✅ Creating custom middleware
- ✅ Authentication and authorization
- ✅ Rate limiting
- ✅ Error handling
- ✅ Applying middleware to specific routes
- ✅ Building a complete API with multiple middleware layers

## What's Next?

In the next chapter, we'll explore the [Context API](/guide/hono/04-context) in detail:
- All request methods (params, query, body, headers)
- All response helpers (json, text, html, redirect)
- Context variables and type safety
- Environment bindings

---

[Previous: Routing](/guide/hono/02-routing) | [Next: Context API →](/guide/hono/04-context)
