# Hono Tutorial

::: info Official Documentation
This tutorial is based on the official Hono documentation. For the most up-to-date information, visit: [https://hono.dev](https://hono.dev)
:::

Welcome to the comprehensive Hono tutorial! Learn how to build fast, lightweight web applications with Hono - the ultrafast web framework for the Edge.

## What is Hono?

Hono (炎 means "flame" in Japanese) is a small, simple, and ultrafast web framework for the Edge. It works on any JavaScript runtime: Cloudflare Workers, Deno, Bun, Vercel, AWS Lambda, Node.js, and more.

```typescript
// A simple Hono application
import { Hono } from 'hono'

const app = new Hono()

app.get('/', (c) => c.text('Hello Hono!'))

export default app
```

## Why Hono?

### Key Features

| Feature | Description |
|---------|-------------|
| **Ultrafast** | One of the fastest routers in the JavaScript ecosystem |
| **Lightweight** | Zero dependencies, small bundle size (~14KB) |
| **Multi-runtime** | Works on Cloudflare Workers, Deno, Bun, Node.js, and more |
| **TypeScript** | First-class TypeScript support with type inference |
| **Middleware** | Rich middleware ecosystem for common tasks |
| **Web Standards** | Built on Web Standard APIs (Request/Response) |

### Performance Comparison

Hono is designed for speed. Here's how it compares:

```
Hono        ████████████████████████████████ 100%
Express     ███████████████                   47%
Fastify     ██████████████████████████        81%
```

### Runtime Support

Hono runs everywhere:

- **Cloudflare Workers** - Edge computing
- **Deno** - Secure runtime
- **Bun** - Fast all-in-one toolkit
- **Node.js** - Traditional server
- **AWS Lambda** - Serverless
- **Vercel** - Edge Functions
- **Netlify** - Edge Functions

## Tutorial Structure

### Beginner
1. **[Getting Started](/guide/hono/01-introduction)** - Installation, first app, basic concepts
2. **[Routing](/guide/hono/02-routing)** - Routes, parameters, groups, methods

### Intermediate
3. **[Middleware](/guide/hono/03-middleware)** - Built-in and custom middleware
4. **[Context API](/guide/hono/04-context)** - Request, response, and context helpers
5. **[Validation](/guide/hono/05-validation)** - Input validation with Zod

### Advanced
6. **[Testing](/guide/hono/06-testing)** - Unit and integration testing
7. **[Deployment](/guide/hono/07-deployment)** - Deploy to various platforms
8. **[Advanced Topics](/guide/hono/08-advanced)** - RPC, streaming, WebSockets, best practices

## Quick Example

Here's a taste of what you'll learn:

```typescript
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { validator } from 'hono/validator'

const app = new Hono()

// Middleware
app.use('*', logger())
app.use('/api/*', cors())

// Routes
app.get('/', (c) => {
    return c.html('<h1>Welcome to Hono!</h1>')
})

// Route with parameters
app.get('/users/:id', (c) => {
    const id = c.req.param('id')
    return c.json({ id, name: 'John Doe' })
})

// POST with validation
app.post('/users',
    validator('json', (value, c) => {
        const { name, email } = value
        if (!name || !email) {
            return c.json({ error: 'Invalid input' }, 400)
        }
        return { name, email }
    }),
    (c) => {
        const data = c.req.valid('json')
        return c.json({ message: 'User created', data }, 201)
    }
)

// Error handling
app.onError((err, c) => {
    console.error(err)
    return c.json({ error: 'Internal Server Error' }, 500)
})

// 404 handling
app.notFound((c) => {
    return c.json({ error: 'Not Found' }, 404)
})

export default app
```

## Prerequisites

Before starting this tutorial, you should have:

- Basic knowledge of JavaScript/TypeScript
- Node.js 18+ (or Bun/Deno)
- A code editor (VS Code recommended)
- Basic understanding of HTTP and REST APIs

## What You'll Build

Throughout this tutorial, you'll build:

1. **REST API** - A complete CRUD API
2. **Authentication System** - JWT-based auth
3. **Validated Endpoints** - Input validation with Zod
4. **Edge-ready App** - Deploy to Cloudflare Workers

## Video Tutorials

::: tip Recommended Video Resources
Learn Hono through these excellent video tutorials from the community.
:::

### Free Courses

| Course | Creator | Description |
|--------|---------|-------------|
| [Hono.js Crash Course](https://www.youtube.com/watch?v=yPY_bFq4aIA) | Traversy Media | 45-minute crash course |
| [Hono Tutorial](https://www.youtube.com/watch?v=_WHoqGAT4mk) | Beyond Fireship | Build APIs with Hono |
| [Hono + Cloudflare Workers](https://www.youtube.com/watch?v=H7eVoGEgRlA) | James Q Quick | Deploy to the Edge |

### Official Resources

| Resource | Description |
|----------|-------------|
| [Hono Documentation](https://hono.dev/top) | Official Hono documentation |
| [Hono Examples](https://github.com/honojs/hono/tree/main/examples) | Official code examples |

### Topic-Specific Videos

| Topic | Video | Duration |
|-------|-------|----------|
| Cloudflare Workers | [Hono on Workers](https://www.youtube.com/watch?v=H7eVoGEgRlA) | ~20 min |
| Authentication | [JWT with Hono](https://www.youtube.com/watch?v=roMYi-xKZXY) | ~25 min |
| Zod Validation | [Hono + Zod](https://www.youtube.com/watch?v=GaP2Z79wiQw) | ~15 min |

Let's begin your Hono journey!

---

[Start with Introduction →](/guide/hono/01-introduction)
