# Validation

Input validation is crucial for building secure and reliable APIs. Hono provides built-in validation utilities and integrates seamlessly with popular validation libraries like Zod.

## Built-in Validator

### Basic Usage

```typescript
import { Hono } from 'hono'
import { validator } from 'hono/validator'

const app = new Hono()

app.post('/users',
    validator('json', (value, c) => {
        const { name, email } = value

        if (!name || typeof name !== 'string') {
            return c.json({ error: 'Name is required' }, 400)
        }

        if (!email || !email.includes('@')) {
            return c.json({ error: 'Valid email is required' }, 400)
        }

        // Return validated data
        return { name, email }
    }),
    (c) => {
        const data = c.req.valid('json')
        return c.json({ created: data }, 201)
    }
)
```

### Validation Targets

You can validate different parts of the request:

```typescript
// JSON body
validator('json', (value, c) => { ... })

// Form data
validator('form', (value, c) => { ... })

// Query parameters
validator('query', (value, c) => { ... })

// Route parameters
validator('param', (value, c) => { ... })

// Headers
validator('header', (value, c) => { ... })

// Cookies
validator('cookie', (value, c) => { ... })
```

### Multiple Validators

```typescript
app.get('/users/:id',
    // Validate route params
    validator('param', (value, c) => {
        const id = parseInt(value.id)
        if (isNaN(id)) {
            return c.json({ error: 'Invalid ID' }, 400)
        }
        return { id }
    }),
    // Validate query params
    validator('query', (value, c) => {
        const include = value.include?.split(',') || []
        return { include }
    }),
    (c) => {
        const { id } = c.req.valid('param')
        const { include } = c.req.valid('query')
        return c.json({ id, include })
    }
)
```

## Zod Integration

Zod is a TypeScript-first schema validation library that works perfectly with Hono.

### Installation

```bash
npm install zod @hono/zod-validator
```

### Basic Zod Validation

```typescript
import { Hono } from 'hono'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'

const app = new Hono()

// Define schema
const createUserSchema = z.object({
    name: z.string().min(1).max(100),
    email: z.string().email(),
    age: z.number().int().min(0).max(150).optional()
})

app.post('/users',
    zValidator('json', createUserSchema),
    (c) => {
        const data = c.req.valid('json')
        // data is typed as { name: string, email: string, age?: number }
        return c.json({ created: data }, 201)
    }
)
```

### Complex Schemas

```typescript
// Nested objects
const addressSchema = z.object({
    street: z.string(),
    city: z.string(),
    country: z.string(),
    zipCode: z.string().regex(/^\d{5}(-\d{4})?$/)
})

const userSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    address: addressSchema.optional(),
    tags: z.array(z.string()).default([])
})

// Union types
const paymentSchema = z.discriminatedUnion('type', [
    z.object({
        type: z.literal('credit_card'),
        cardNumber: z.string(),
        expiry: z.string()
    }),
    z.object({
        type: z.literal('bank_transfer'),
        accountNumber: z.string(),
        routingNumber: z.string()
    })
])

// Refinements
const passwordSchema = z.object({
    password: z.string().min(8),
    confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword']
})
```

### Validating Query Parameters

```typescript
const searchQuerySchema = z.object({
    q: z.string().optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    sort: z.enum(['asc', 'desc']).default('desc')
})

app.get('/search',
    zValidator('query', searchQuerySchema),
    (c) => {
        const { q, page, limit, sort } = c.req.valid('query')
        return c.json({ q, page, limit, sort })
    }
)
```

### Validating Route Parameters

```typescript
const idParamSchema = z.object({
    id: z.coerce.number().int().positive()
})

app.get('/users/:id',
    zValidator('param', idParamSchema),
    (c) => {
        const { id } = c.req.valid('param')
        return c.json({ userId: id })
    }
)
```

### Custom Error Handling

```typescript
import { zValidator } from '@hono/zod-validator'

const schema = z.object({
    email: z.string().email()
})

app.post('/subscribe',
    zValidator('json', schema, (result, c) => {
        if (!result.success) {
            return c.json({
                error: 'Validation failed',
                details: result.error.flatten()
            }, 400)
        }
    }),
    (c) => {
        const { email } = c.req.valid('json')
        return c.json({ subscribed: email })
    }
)
```

### Reusable Validators

```typescript
// validators/user.ts
import { z } from 'zod'

export const createUserSchema = z.object({
    name: z.string().min(1).max(100),
    email: z.string().email(),
    password: z.string().min(8)
})

export const updateUserSchema = createUserSchema.partial()

export const userIdSchema = z.object({
    id: z.coerce.number().int().positive()
})

// routes/users.ts
import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { createUserSchema, updateUserSchema, userIdSchema } from '../validators/user'

const users = new Hono()

users.post('/',
    zValidator('json', createUserSchema),
    (c) => { /* ... */ }
)

users.put('/:id',
    zValidator('param', userIdSchema),
    zValidator('json', updateUserSchema),
    (c) => { /* ... */ }
)

export default users
```

## Other Validation Libraries

### Valibot

```bash
npm install valibot @hono/valibot-validator
```

```typescript
import { Hono } from 'hono'
import * as v from 'valibot'
import { vValidator } from '@hono/valibot-validator'

const app = new Hono()

const schema = v.object({
    name: v.string([v.minLength(1)]),
    email: v.string([v.email()])
})

app.post('/users',
    vValidator('json', schema),
    (c) => {
        const data = c.req.valid('json')
        return c.json({ created: data })
    }
)
```

### TypeBox

```bash
npm install @sinclair/typebox @hono/typebox-validator
```

```typescript
import { Hono } from 'hono'
import { Type } from '@sinclair/typebox'
import { tbValidator } from '@hono/typebox-validator'

const app = new Hono()

const schema = Type.Object({
    name: Type.String({ minLength: 1 }),
    email: Type.String({ format: 'email' })
})

app.post('/users',
    tbValidator('json', schema),
    (c) => {
        const data = c.req.valid('json')
        return c.json({ created: data })
    }
)
```

## Custom Validation Middleware

### Creating Custom Validators

```typescript
import { createMiddleware } from 'hono/factory'
import { HTTPException } from 'hono/http-exception'

interface ValidationError {
    field: string
    message: string
}

const validateBody = <T>(validate: (body: unknown) => T | ValidationError[]) => {
    return createMiddleware(async (c, next) => {
        const body = await c.req.json()
        const result = validate(body)

        if (Array.isArray(result)) {
            throw new HTTPException(400, {
                message: JSON.stringify({ errors: result })
            })
        }

        c.set('validatedBody', result)
        await next()
    })
}

// Usage
const validateUser = validateBody((body: any) => {
    const errors: ValidationError[] = []

    if (!body.name || body.name.length < 1) {
        errors.push({ field: 'name', message: 'Name is required' })
    }

    if (!body.email || !body.email.includes('@')) {
        errors.push({ field: 'email', message: 'Valid email required' })
    }

    if (errors.length > 0) return errors

    return { name: body.name, email: body.email }
})

app.post('/users', validateUser, (c) => {
    const data = c.get('validatedBody')
    return c.json({ created: data })
})
```

### File Upload Validation

```typescript
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']

app.post('/upload', async (c) => {
    const body = await c.req.parseBody()
    const file = body['file'] as File

    if (!file) {
        return c.json({ error: 'File is required' }, 400)
    }

    if (file.size > MAX_FILE_SIZE) {
        return c.json({ error: 'File too large (max 5MB)' }, 400)
    }

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        return c.json({ error: 'Invalid file type' }, 400)
    }

    return c.json({
        filename: file.name,
        size: file.size,
        type: file.type
    })
})
```

## Complete Example

```typescript
import { Hono } from 'hono'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'
import { HTTPException } from 'hono/http-exception'

const app = new Hono()

// Schemas
const createPostSchema = z.object({
    title: z.string().min(1).max(200),
    content: z.string().min(1),
    tags: z.array(z.string()).max(5).default([]),
    published: z.boolean().default(false)
})

const updatePostSchema = createPostSchema.partial()

const postIdSchema = z.object({
    id: z.coerce.number().int().positive()
})

const listPostsQuerySchema = z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().min(1).max(50).default(10),
    tag: z.string().optional(),
    published: z.coerce.boolean().optional()
})

// Custom error handler for Zod
const handleZodError = (result: any, c: any) => {
    if (!result.success) {
        const errors = result.error.issues.map((issue: any) => ({
            path: issue.path.join('.'),
            message: issue.message
        }))

        return c.json({
            error: 'Validation failed',
            details: errors
        }, 400)
    }
}

// In-memory store
interface Post {
    id: number
    title: string
    content: string
    tags: string[]
    published: boolean
    createdAt: string
    updatedAt: string
}

let posts: Post[] = []
let nextId = 1

// Routes
app.get('/posts',
    zValidator('query', listPostsQuerySchema, handleZodError),
    (c) => {
        const { page, limit, tag, published } = c.req.valid('query')

        let result = [...posts]

        // Filter by tag
        if (tag) {
            result = result.filter(p => p.tags.includes(tag))
        }

        // Filter by published status
        if (published !== undefined) {
            result = result.filter(p => p.published === published)
        }

        // Paginate
        const start = (page - 1) * limit
        const paginatedPosts = result.slice(start, start + limit)

        return c.json({
            posts: paginatedPosts,
            pagination: {
                page,
                limit,
                total: result.length,
                totalPages: Math.ceil(result.length / limit)
            }
        })
    }
)

app.get('/posts/:id',
    zValidator('param', postIdSchema, handleZodError),
    (c) => {
        const { id } = c.req.valid('param')
        const post = posts.find(p => p.id === id)

        if (!post) {
            throw new HTTPException(404, { message: 'Post not found' })
        }

        return c.json(post)
    }
)

app.post('/posts',
    zValidator('json', createPostSchema, handleZodError),
    (c) => {
        const data = c.req.valid('json')
        const now = new Date().toISOString()

        const post: Post = {
            id: nextId++,
            ...data,
            createdAt: now,
            updatedAt: now
        }

        posts.push(post)

        return c.json(post, 201)
    }
)

app.put('/posts/:id',
    zValidator('param', postIdSchema, handleZodError),
    zValidator('json', updatePostSchema, handleZodError),
    (c) => {
        const { id } = c.req.valid('param')
        const data = c.req.valid('json')

        const index = posts.findIndex(p => p.id === id)
        if (index === -1) {
            throw new HTTPException(404, { message: 'Post not found' })
        }

        posts[index] = {
            ...posts[index],
            ...data,
            updatedAt: new Date().toISOString()
        }

        return c.json(posts[index])
    }
)

app.delete('/posts/:id',
    zValidator('param', postIdSchema, handleZodError),
    (c) => {
        const { id } = c.req.valid('param')

        const index = posts.findIndex(p => p.id === id)
        if (index === -1) {
            throw new HTTPException(404, { message: 'Post not found' })
        }

        posts.splice(index, 1)

        return c.json({ deleted: true })
    }
)

// Global error handler
app.onError((err, c) => {
    if (err instanceof HTTPException) {
        return c.json({ error: err.message }, err.status)
    }

    console.error(err)
    return c.json({ error: 'Internal Server Error' }, 500)
})

export default app
```

## Summary

In this chapter, you learned:

- Using Hono's built-in validator
- Validating different request parts (json, query, params, etc.)
- Integrating Zod for schema validation
- Creating complex validation schemas
- Custom error handling
- Building reusable validators
- Using other validation libraries (Valibot, TypeBox)

## What's Next?

In the next chapter, we'll explore [Testing](/guide/hono/06-testing) and learn:
- Unit testing with Hono
- Integration testing
- Testing middleware
- Mocking and fixtures

---

[Previous: Context API](/guide/hono/04-context) | [Next: Testing →](/guide/hono/06-testing)
