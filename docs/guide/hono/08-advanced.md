# Advanced Topics

This chapter covers advanced Hono features including RPC, streaming, WebSockets, and best practices for building production applications.

## Hono RPC

Hono provides type-safe RPC functionality that enables end-to-end type safety between server and client.

### Server Setup

```typescript
// server.ts
import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'

const app = new Hono()

// Define routes with schemas
const routes = app
    .get('/users', (c) => {
        return c.json([
            { id: 1, name: 'John' },
            { id: 2, name: 'Jane' }
        ])
    })
    .get('/users/:id', (c) => {
        const id = c.req.param('id')
        return c.json({ id: parseInt(id), name: 'User' })
    })
    .post(
        '/users',
        zValidator('json', z.object({
            name: z.string(),
            email: z.string().email()
        })),
        (c) => {
            const data = c.req.valid('json')
            return c.json({ id: 1, ...data }, 201)
        }
    )

// Export type for client
export type AppType = typeof routes

export default app
```

### Client Setup

```typescript
// client.ts
import { hc } from 'hono/client'
import type { AppType } from './server'

// Create typed client
const client = hc<AppType>('http://localhost:8787')

// Type-safe API calls
async function main() {
    // GET /users
    const usersRes = await client.users.$get()
    const users = await usersRes.json()
    // users is typed as { id: number, name: string }[]

    // GET /users/:id
    const userRes = await client.users[':id'].$get({
        param: { id: '1' }
    })
    const user = await userRes.json()

    // POST /users
    const createRes = await client.users.$post({
        json: {
            name: 'Alice',
            email: 'alice@example.com'
        }
    })
    const created = await createRes.json()
}
```

### RPC with Query Parameters

```typescript
// Server
const app = new Hono()
    .get('/search',
        zValidator('query', z.object({
            q: z.string(),
            page: z.coerce.number().default(1)
        })),
        (c) => {
            const { q, page } = c.req.valid('query')
            return c.json({ query: q, page, results: [] })
        }
    )

// Client
const res = await client.search.$get({
    query: { q: 'hono', page: '1' }
})
```

### RPC with Headers

```typescript
// Client with authorization
const res = await client.protected.$get({}, {
    headers: {
        'Authorization': 'Bearer token123'
    }
})
```

## Streaming Responses

### Basic Streaming

```typescript
import { Hono } from 'hono'
import { stream } from 'hono/streaming'

const app = new Hono()

app.get('/stream', (c) => {
    return stream(c, async (stream) => {
        for (let i = 0; i < 5; i++) {
            await stream.write(`data: ${i}\n\n`)
            await stream.sleep(1000)
        }
    })
})
```

### Server-Sent Events (SSE)

```typescript
import { Hono } from 'hono'
import { streamSSE } from 'hono/streaming'

const app = new Hono()

app.get('/sse', (c) => {
    return streamSSE(c, async (stream) => {
        let id = 0

        while (true) {
            await stream.writeSSE({
                data: JSON.stringify({ time: new Date().toISOString() }),
                event: 'time-update',
                id: String(id++)
            })
            await stream.sleep(1000)
        }
    })
})
```

### Streaming Text

```typescript
import { streamText } from 'hono/streaming'

app.get('/text-stream', (c) => {
    return streamText(c, async (stream) => {
        await stream.write('Hello ')
        await stream.sleep(500)
        await stream.write('World ')
        await stream.sleep(500)
        await stream.write('!')
    })
})
```

### AI/LLM Streaming

```typescript
app.post('/chat', async (c) => {
    const { message } = await c.req.json()

    return streamText(c, async (stream) => {
        // Simulate AI response streaming
        const response = 'This is a simulated AI response that streams word by word.'
        const words = response.split(' ')

        for (const word of words) {
            await stream.write(word + ' ')
            await stream.sleep(100)
        }
    })
})
```

## WebSockets

### Basic WebSocket Handler

```typescript
import { Hono } from 'hono'
import { upgradeWebSocket } from 'hono/cloudflare-workers'

const app = new Hono()

app.get('/ws', upgradeWebSocket((c) => {
    return {
        onOpen(event, ws) {
            console.log('Connection opened')
            ws.send('Welcome!')
        },
        onMessage(event, ws) {
            console.log('Message received:', event.data)
            ws.send(`Echo: ${event.data}`)
        },
        onClose(event, ws) {
            console.log('Connection closed')
        },
        onError(event, ws) {
            console.error('WebSocket error:', event)
        }
    }
}))

export default app
```

### Chat Room Example

```typescript
import { Hono } from 'hono'
import { upgradeWebSocket } from 'hono/cloudflare-workers'

const app = new Hono()

// Store connections
const clients = new Set<WebSocket>()

app.get('/chat', upgradeWebSocket((c) => {
    return {
        onOpen(event, ws) {
            clients.add(ws.raw)
            broadcast(`User joined. Total: ${clients.size}`)
        },
        onMessage(event, ws) {
            const message = event.data.toString()
            broadcast(message)
        },
        onClose(event, ws) {
            clients.delete(ws.raw)
            broadcast(`User left. Total: ${clients.size}`)
        }
    }
}))

function broadcast(message: string) {
    for (const client of clients) {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message)
        }
    }
}

export default app
```

### WebSocket with Authentication

```typescript
app.get('/ws/secure', upgradeWebSocket((c) => {
    // Check auth before upgrade
    const token = c.req.query('token')

    if (token !== 'valid-token') {
        return {
            onOpen(event, ws) {
                ws.send(JSON.stringify({ error: 'Unauthorized' }))
                ws.close(1008, 'Unauthorized')
            }
        }
    }

    return {
        onOpen(event, ws) {
            ws.send(JSON.stringify({ status: 'connected' }))
        },
        onMessage(event, ws) {
            // Handle authenticated messages
        }
    }
}))
```

## JSX and HTML

### JSX Support

```typescript
// Enable JSX in tsconfig.json
// "jsx": "react-jsx",
// "jsxImportSource": "hono/jsx"

import { Hono } from 'hono'

const app = new Hono()

const Layout = ({ children }: { children: any }) => (
    <html>
        <head>
            <title>Hono App</title>
        </head>
        <body>{children}</body>
    </html>
)

const Home = () => (
    <Layout>
        <h1>Welcome to Hono</h1>
        <p>This is rendered with JSX</p>
    </Layout>
)

app.get('/', (c) => {
    return c.html(<Home />)
})
```

### HTML Helper

```typescript
import { Hono } from 'hono'
import { html } from 'hono/html'

const app = new Hono()

app.get('/', (c) => {
    const name = 'World'

    return c.html(html`
        <!DOCTYPE html>
        <html>
            <head>
                <title>Hello</title>
            </head>
            <body>
                <h1>Hello ${name}!</h1>
            </body>
        </html>
    `)
})
```

## File Handling

### File Upload

```typescript
app.post('/upload', async (c) => {
    const body = await c.req.parseBody()
    const file = body['file'] as File

    if (!file) {
        return c.json({ error: 'No file provided' }, 400)
    }

    // Process file
    const content = await file.arrayBuffer()

    // Store in R2 (Cloudflare)
    await c.env.BUCKET.put(file.name, content, {
        httpMetadata: {
            contentType: file.type
        }
    })

    return c.json({
        filename: file.name,
        size: file.size,
        type: file.type
    })
})
```

### Serving Static Files

```typescript
import { Hono } from 'hono'
import { serveStatic } from 'hono/cloudflare-workers'

const app = new Hono()

// Serve static files from __STATIC_CONTENT (Cloudflare Workers Sites)
app.get('/static/*', serveStatic({ root: './' }))

// Or for specific file
app.get('/favicon.ico', serveStatic({ path: './favicon.ico' }))
```

## Factory Pattern

### Creating App Factories

```typescript
import { Hono } from 'hono'
import { createFactory } from 'hono/factory'

// Define types
type Bindings = {
    DATABASE_URL: string
}

type Variables = {
    user: { id: string; name: string }
}

// Create factory
const factory = createFactory<{
    Bindings: Bindings
    Variables: Variables
}>()

// Create typed middleware
const authMiddleware = factory.createMiddleware(async (c, next) => {
    c.set('user', { id: '1', name: 'John' })
    await next()
})

// Create handlers
const getUser = factory.createHandlers(authMiddleware, (c) => {
    const user = c.get('user')
    return c.json(user)
})

// Use in app
const app = new Hono<{ Bindings: Bindings; Variables: Variables }>()

app.get('/user', ...getUser)
```

## Error Handling Patterns

### Custom Error Classes

```typescript
import { HTTPException } from 'hono/http-exception'

class NotFoundError extends HTTPException {
    constructor(resource: string) {
        super(404, { message: `${resource} not found` })
    }
}

class ValidationError extends HTTPException {
    constructor(errors: Record<string, string[]>) {
        super(400, {
            message: JSON.stringify({ errors })
        })
    }
}

class UnauthorizedError extends HTTPException {
    constructor(message = 'Unauthorized') {
        super(401, { message })
    }
}

// Usage
app.get('/users/:id', (c) => {
    const user = findUser(c.req.param('id'))
    if (!user) {
        throw new NotFoundError('User')
    }
    return c.json(user)
})
```

### Global Error Handler

```typescript
app.onError((err, c) => {
    // Log error
    console.error({
        message: err.message,
        stack: err.stack,
        path: c.req.path,
        method: c.req.method,
        requestId: c.get('requestId')
    })

    // Handle known errors
    if (err instanceof HTTPException) {
        const body = err.message.startsWith('{')
            ? JSON.parse(err.message)
            : { error: err.message }

        return c.json(body, err.status)
    }

    // Handle unknown errors
    return c.json({
        error: 'Internal Server Error',
        requestId: c.get('requestId')
    }, 500)
})
```

## Best Practices

### Project Structure

```
src/
├── index.ts           # Entry point
├── app.ts             # App configuration
├── routes/
│   ├── index.ts       # Route aggregation
│   ├── users.ts       # User routes
│   └── posts.ts       # Post routes
├── middleware/
│   ├── auth.ts
│   └── logger.ts
├── services/
│   ├── user.service.ts
│   └── post.service.ts
├── validators/
│   ├── user.ts
│   └── post.ts
├── types/
│   └── index.ts
└── utils/
    └── helpers.ts
```

### Route Organization

```typescript
// routes/users.ts
import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { createUserSchema, updateUserSchema } from '../validators/user'
import { UserService } from '../services/user.service'

export const createUserRoutes = (userService: UserService) => {
    const app = new Hono()

    app.get('/', async (c) => {
        const users = await userService.findAll()
        return c.json(users)
    })

    app.get('/:id', async (c) => {
        const user = await userService.findById(c.req.param('id'))
        return c.json(user)
    })

    app.post('/',
        zValidator('json', createUserSchema),
        async (c) => {
            const data = c.req.valid('json')
            const user = await userService.create(data)
            return c.json(user, 201)
        }
    )

    return app
}

// routes/index.ts
import { Hono } from 'hono'
import { createUserRoutes } from './users'
import { createPostRoutes } from './posts'

export const createRoutes = (services: Services) => {
    const app = new Hono()

    app.route('/users', createUserRoutes(services.user))
    app.route('/posts', createPostRoutes(services.post))

    return app
}
```

### Dependency Injection

```typescript
// services/index.ts
import { UserService } from './user.service'
import { PostService } from './post.service'

export interface Services {
    user: UserService
    post: PostService
}

export const createServices = (env: Bindings): Services => {
    return {
        user: new UserService(env.DB),
        post: new PostService(env.DB)
    }
}

// app.ts
import { Hono } from 'hono'
import { createServices } from './services'
import { createRoutes } from './routes'

type Bindings = {
    DB: D1Database
}

const app = new Hono<{ Bindings: Bindings }>()

app.use('*', async (c, next) => {
    const services = createServices(c.env)
    c.set('services', services)
    await next()
})

app.route('/api', createRoutes())
```

### Response Helpers

```typescript
// utils/response.ts
import { Context } from 'hono'

export const success = <T>(c: Context, data: T, status = 200) => {
    return c.json({ success: true, data }, status)
}

export const error = (c: Context, message: string, status = 400) => {
    return c.json({ success: false, error: message }, status)
}

export const paginated = <T>(
    c: Context,
    data: T[],
    page: number,
    limit: number,
    total: number
) => {
    return c.json({
        success: true,
        data,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
        }
    })
}

// Usage
app.get('/users', async (c) => {
    const users = await getUsers()
    return success(c, users)
})
```

## Summary

In this chapter, you learned:

- Type-safe RPC between server and client
- Streaming responses and SSE
- WebSocket implementation
- JSX and HTML rendering
- File handling
- Factory patterns
- Error handling best practices
- Project structure and organization

## Congratulations!

You've completed the Hono tutorial! You now have the knowledge to build fast, type-safe web applications with Hono.

### Continue Learning

- [Hono Official Documentation](https://hono.dev)
- [Hono GitHub Repository](https://github.com/honojs/hono)
- [Hono Examples](https://github.com/honojs/examples)

---

[Previous: Deployment](/guide/hono/07-deployment) | [Back to Index](/guide/hono/)
