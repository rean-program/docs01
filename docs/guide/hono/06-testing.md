# Testing

Testing is essential for building reliable applications. Hono makes testing easy with its built-in test utilities that work with any test framework.

## Testing Setup

### Using Vitest

```bash
npm install -D vitest
```

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
        globals: true,
        environment: 'node'
    }
})
```

### Using Jest

```bash
npm install -D jest ts-jest @types/jest
```

```javascript
// jest.config.js
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['**/*.test.ts']
}
```

## Basic Testing

### Testing with app.request()

Hono provides a `request()` method for testing without starting a server:

```typescript
// app.ts
import { Hono } from 'hono'

const app = new Hono()

app.get('/', (c) => c.text('Hello Hono!'))
app.get('/json', (c) => c.json({ message: 'Hello' }))

export default app

// app.test.ts
import { describe, it, expect } from 'vitest'
import app from './app'

describe('App', () => {
    it('should return Hello Hono!', async () => {
        const res = await app.request('/')

        expect(res.status).toBe(200)
        expect(await res.text()).toBe('Hello Hono!')
    })

    it('should return JSON', async () => {
        const res = await app.request('/json')

        expect(res.status).toBe(200)
        expect(await res.json()).toEqual({ message: 'Hello' })
    })
})
```

### Testing Different HTTP Methods

```typescript
import { describe, it, expect } from 'vitest'
import app from './app'

describe('HTTP Methods', () => {
    it('GET request', async () => {
        const res = await app.request('/users')
        expect(res.status).toBe(200)
    })

    it('POST request', async () => {
        const res = await app.request('/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: 'John' })
        })
        expect(res.status).toBe(201)
    })

    it('PUT request', async () => {
        const res = await app.request('/users/1', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: 'Jane' })
        })
        expect(res.status).toBe(200)
    })

    it('DELETE request', async () => {
        const res = await app.request('/users/1', {
            method: 'DELETE'
        })
        expect(res.status).toBe(200)
    })
})
```

### Testing with Headers

```typescript
describe('Headers', () => {
    it('should accept custom headers', async () => {
        const res = await app.request('/protected', {
            headers: {
                'Authorization': 'Bearer token123',
                'X-Custom-Header': 'custom-value'
            }
        })
        expect(res.status).toBe(200)
    })

    it('should check response headers', async () => {
        const res = await app.request('/api/data')

        expect(res.headers.get('Content-Type')).toBe('application/json')
        expect(res.headers.get('X-Response-Time')).toBeDefined()
    })
})
```

### Testing Query Parameters

```typescript
describe('Query Parameters', () => {
    it('should handle query params', async () => {
        const res = await app.request('/search?q=hono&page=1')

        expect(res.status).toBe(200)
        const data = await res.json()
        expect(data.query).toBe('hono')
        expect(data.page).toBe(1)
    })

    it('should handle URLSearchParams', async () => {
        const params = new URLSearchParams({
            q: 'test',
            limit: '10'
        })

        const res = await app.request(`/search?${params}`)
        expect(res.status).toBe(200)
    })
})
```

## Testing JSON APIs

### Complete CRUD Testing

```typescript
// api.ts
import { Hono } from 'hono'

interface Todo {
    id: number
    title: string
    completed: boolean
}

const app = new Hono()
let todos: Todo[] = []
let nextId = 1

app.get('/todos', (c) => c.json(todos))

app.get('/todos/:id', (c) => {
    const id = parseInt(c.req.param('id'))
    const todo = todos.find(t => t.id === id)
    if (!todo) return c.json({ error: 'Not found' }, 404)
    return c.json(todo)
})

app.post('/todos', async (c) => {
    const body = await c.req.json<{ title: string }>()
    const todo: Todo = {
        id: nextId++,
        title: body.title,
        completed: false
    }
    todos.push(todo)
    return c.json(todo, 201)
})

app.put('/todos/:id', async (c) => {
    const id = parseInt(c.req.param('id'))
    const body = await c.req.json<Partial<Todo>>()
    const index = todos.findIndex(t => t.id === id)
    if (index === -1) return c.json({ error: 'Not found' }, 404)
    todos[index] = { ...todos[index], ...body }
    return c.json(todos[index])
})

app.delete('/todos/:id', (c) => {
    const id = parseInt(c.req.param('id'))
    const index = todos.findIndex(t => t.id === id)
    if (index === -1) return c.json({ error: 'Not found' }, 404)
    todos.splice(index, 1)
    return c.json({ deleted: true })
})

export { app, todos }
export const resetTodos = () => {
    todos.length = 0
    nextId = 1
}

// api.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { app, resetTodos } from './api'

describe('Todo API', () => {
    beforeEach(() => {
        resetTodos()
    })

    describe('GET /todos', () => {
        it('should return empty array initially', async () => {
            const res = await app.request('/todos')

            expect(res.status).toBe(200)
            expect(await res.json()).toEqual([])
        })
    })

    describe('POST /todos', () => {
        it('should create a todo', async () => {
            const res = await app.request('/todos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: 'Test todo' })
            })

            expect(res.status).toBe(201)
            const todo = await res.json()
            expect(todo.id).toBe(1)
            expect(todo.title).toBe('Test todo')
            expect(todo.completed).toBe(false)
        })
    })

    describe('GET /todos/:id', () => {
        it('should return a todo by id', async () => {
            // Create a todo first
            await app.request('/todos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: 'Test' })
            })

            const res = await app.request('/todos/1')

            expect(res.status).toBe(200)
            const todo = await res.json()
            expect(todo.id).toBe(1)
        })

        it('should return 404 for non-existent todo', async () => {
            const res = await app.request('/todos/999')

            expect(res.status).toBe(404)
        })
    })

    describe('PUT /todos/:id', () => {
        it('should update a todo', async () => {
            await app.request('/todos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: 'Original' })
            })

            const res = await app.request('/todos/1', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: 'Updated', completed: true })
            })

            expect(res.status).toBe(200)
            const todo = await res.json()
            expect(todo.title).toBe('Updated')
            expect(todo.completed).toBe(true)
        })
    })

    describe('DELETE /todos/:id', () => {
        it('should delete a todo', async () => {
            await app.request('/todos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: 'To delete' })
            })

            const res = await app.request('/todos/1', { method: 'DELETE' })

            expect(res.status).toBe(200)

            // Verify deletion
            const getRes = await app.request('/todos/1')
            expect(getRes.status).toBe(404)
        })
    })
})
```

## Testing Middleware

### Testing Custom Middleware

```typescript
// middleware.ts
import { createMiddleware } from 'hono/factory'

export const authMiddleware = createMiddleware(async (c, next) => {
    const token = c.req.header('Authorization')?.replace('Bearer ', '')

    if (!token) {
        return c.json({ error: 'Unauthorized' }, 401)
    }

    if (token !== 'valid-token') {
        return c.json({ error: 'Invalid token' }, 403)
    }

    c.set('userId', '123')
    await next()
})

// middleware.test.ts
import { describe, it, expect } from 'vitest'
import { Hono } from 'hono'
import { authMiddleware } from './middleware'

describe('Auth Middleware', () => {
    const app = new Hono()
    app.use('/protected/*', authMiddleware)
    app.get('/protected/data', (c) => {
        return c.json({ userId: c.get('userId') })
    })

    it('should reject requests without token', async () => {
        const res = await app.request('/protected/data')

        expect(res.status).toBe(401)
        expect(await res.json()).toEqual({ error: 'Unauthorized' })
    })

    it('should reject invalid tokens', async () => {
        const res = await app.request('/protected/data', {
            headers: { 'Authorization': 'Bearer invalid' }
        })

        expect(res.status).toBe(403)
        expect(await res.json()).toEqual({ error: 'Invalid token' })
    })

    it('should allow valid tokens', async () => {
        const res = await app.request('/protected/data', {
            headers: { 'Authorization': 'Bearer valid-token' }
        })

        expect(res.status).toBe(200)
        expect(await res.json()).toEqual({ userId: '123' })
    })
})
```

### Testing Error Handlers

```typescript
import { describe, it, expect } from 'vitest'
import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'

describe('Error Handling', () => {
    const app = new Hono()

    app.get('/error', () => {
        throw new Error('Something went wrong')
    })

    app.get('/http-error', () => {
        throw new HTTPException(400, { message: 'Bad Request' })
    })

    app.onError((err, c) => {
        if (err instanceof HTTPException) {
            return c.json({ error: err.message }, err.status)
        }
        return c.json({ error: 'Internal Server Error' }, 500)
    })

    app.notFound((c) => {
        return c.json({ error: 'Not Found' }, 404)
    })

    it('should handle general errors', async () => {
        const res = await app.request('/error')

        expect(res.status).toBe(500)
        expect(await res.json()).toEqual({ error: 'Internal Server Error' })
    })

    it('should handle HTTPException', async () => {
        const res = await app.request('/http-error')

        expect(res.status).toBe(400)
        expect(await res.json()).toEqual({ error: 'Bad Request' })
    })

    it('should handle 404', async () => {
        const res = await app.request('/non-existent')

        expect(res.status).toBe(404)
        expect(await res.json()).toEqual({ error: 'Not Found' })
    })
})
```

## Testing with Mocks

### Mocking External Services

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Hono } from 'hono'

// Service to mock
const emailService = {
    send: async (to: string, subject: string) => {
        // Real implementation
    }
}

// App using the service
const createApp = (service: typeof emailService) => {
    const app = new Hono()

    app.post('/notify', async (c) => {
        const { email, message } = await c.req.json()
        await service.send(email, message)
        return c.json({ sent: true })
    })

    return app
}

describe('Email Notification', () => {
    const mockEmailService = {
        send: vi.fn()
    }

    const app = createApp(mockEmailService)

    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('should send email notification', async () => {
        mockEmailService.send.mockResolvedValue(undefined)

        const res = await app.request('/notify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'test@example.com',
                message: 'Hello'
            })
        })

        expect(res.status).toBe(200)
        expect(mockEmailService.send).toHaveBeenCalledWith(
            'test@example.com',
            'Hello'
        )
    })
})
```

### Mocking Environment Bindings

```typescript
import { describe, it, expect } from 'vitest'
import { Hono } from 'hono'

type Bindings = {
    DATABASE_URL: string
    KV: {
        get: (key: string) => Promise<string | null>
        put: (key: string, value: string) => Promise<void>
    }
}

const app = new Hono<{ Bindings: Bindings }>()

app.get('/config', (c) => {
    return c.json({ dbUrl: c.env.DATABASE_URL })
})

app.get('/cache/:key', async (c) => {
    const key = c.req.param('key')
    const value = await c.env.KV.get(key)
    if (!value) return c.json({ error: 'Not found' }, 404)
    return c.json({ key, value })
})

describe('Environment Bindings', () => {
    const mockEnv: Bindings = {
        DATABASE_URL: 'postgres://localhost/test',
        KV: {
            get: async (key) => key === 'existing' ? 'value' : null,
            put: async () => {}
        }
    }

    it('should access environment variables', async () => {
        const res = await app.request('/config', {}, mockEnv)

        expect(res.status).toBe(200)
        expect(await res.json()).toEqual({
            dbUrl: 'postgres://localhost/test'
        })
    })

    it('should access KV storage', async () => {
        const res = await app.request('/cache/existing', {}, mockEnv)

        expect(res.status).toBe(200)
        expect(await res.json()).toEqual({
            key: 'existing',
            value: 'value'
        })
    })
})
```

## Testing Validation

```typescript
import { describe, it, expect } from 'vitest'
import { Hono } from 'hono'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'

const schema = z.object({
    name: z.string().min(1),
    email: z.string().email()
})

const app = new Hono()

app.post('/users',
    zValidator('json', schema, (result, c) => {
        if (!result.success) {
            return c.json({ errors: result.error.flatten() }, 400)
        }
    }),
    (c) => {
        const data = c.req.valid('json')
        return c.json({ created: data }, 201)
    }
)

describe('Validation', () => {
    it('should accept valid data', async () => {
        const res = await app.request('/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'John',
                email: 'john@example.com'
            })
        })

        expect(res.status).toBe(201)
    })

    it('should reject invalid email', async () => {
        const res = await app.request('/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'John',
                email: 'invalid-email'
            })
        })

        expect(res.status).toBe(400)
        const data = await res.json()
        expect(data.errors.fieldErrors.email).toBeDefined()
    })

    it('should reject missing name', async () => {
        const res = await app.request('/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'john@example.com'
            })
        })

        expect(res.status).toBe(400)
    })
})
```

## Integration Testing

### Testing Full Request Flow

```typescript
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import app from './app'

describe('Integration Tests', () => {
    let authToken: string
    let createdUserId: number

    it('should register a new user', async () => {
        const res = await app.request('/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'test@example.com',
                password: 'password123'
            })
        })

        expect(res.status).toBe(201)
        const data = await res.json()
        expect(data.user.email).toBe('test@example.com')
    })

    it('should login and get token', async () => {
        const res = await app.request('/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'test@example.com',
                password: 'password123'
            })
        })

        expect(res.status).toBe(200)
        const data = await res.json()
        expect(data.token).toBeDefined()
        authToken = data.token
    })

    it('should access protected route with token', async () => {
        const res = await app.request('/users/me', {
            headers: { 'Authorization': `Bearer ${authToken}` }
        })

        expect(res.status).toBe(200)
        const data = await res.json()
        expect(data.email).toBe('test@example.com')
    })

    it('should create a resource', async () => {
        const res = await app.request('/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({
                title: 'Test Post',
                content: 'This is a test'
            })
        })

        expect(res.status).toBe(201)
        const data = await res.json()
        expect(data.title).toBe('Test Post')
    })
})
```

## Summary

In this chapter, you learned:

- Setting up testing with Vitest or Jest
- Using `app.request()` for testing
- Testing HTTP methods, headers, and query params
- Testing CRUD operations
- Testing middleware and error handlers
- Mocking external services and bindings
- Validation testing
- Integration testing

## What's Next?

In the next chapter, we'll explore [Deployment](/guide/hono/07-deployment) and learn:
- Deploying to Cloudflare Workers
- Deploying to other platforms
- Environment configuration
- Production best practices

---

[Previous: Validation](/guide/hono/05-validation) | [Next: Deployment →](/guide/hono/07-deployment)
