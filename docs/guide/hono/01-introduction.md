# Introduction to Hono

Hono is an ultrafast, lightweight web framework built for the Edge. Think of it like Express.js but faster, smaller, and works everywhere!

## What is Hono?

**Hono** (炎 means "flame" in Japanese) is a web framework that helps you build APIs and web applications. It's:

- ⚡ **Super Fast** - One of the fastest frameworks available
- 📦 **Tiny** - Only ~14KB, no dependencies
- 🌍 **Works Everywhere** - Cloudflare Workers, Deno, Bun, Node.js, and more
- 🔷 **TypeScript First** - Built-in type safety

### Why Choose Hono?

| Framework | Bundle Size | Speed | TypeScript |
|-----------|-------------|-------|------------|
| **Hono** | ~14KB | ⭐⭐⭐⭐⭐ | Native |
| Express | ~200KB | ⭐⭐⭐ | Needs setup |
| Fastify | ~300KB | ⭐⭐⭐⭐ | Plugin |

## Installation

### Quick Start (Recommended)

The easiest way to start is using the create command:

```bash
# Create a new Hono project
npm create hono@latest my-app

# You'll see options like:
# ? Which template do you want to use?
#   cloudflare-workers
#   cloudflare-pages
#   deno
#   bun
#   nodejs
#   ...

# Navigate to your project
cd my-app

# Install dependencies
npm install

# Start development server
npm run dev
```

### Manual Installation

If you want to add Hono to an existing project:

```bash
# For npm
npm install hono

# For Bun
bun add hono

# For Deno (no install needed, import directly)
```

## Your First Hono App

Let's build a simple "Hello World" application step by step.

### Step 1: Create the App

```typescript
// src/index.ts
import { Hono } from 'hono'

// Create a new Hono application
const app = new Hono()

// That's it! You have an app ready to use
```

### Step 2: Add a Route

```typescript
// src/index.ts
import { Hono } from 'hono'

const app = new Hono()

// When someone visits the homepage, say hello!
app.get('/', (c) => {
    return c.text('Hello World!')
})

// Export the app
export default app
```

### Step 3: Run It!

```bash
npm run dev
# Server running at http://localhost:8787
```

Open your browser and go to `http://localhost:8787` - you'll see "Hello World!"

## Understanding the Code

Let's break down what each part does:

```typescript
import { Hono } from 'hono'
// ↑ Import the Hono framework

const app = new Hono()
// ↑ Create a new application instance

app.get('/', (c) => {
//   ↑ '/' means the homepage (root URL)
//       ↑ 'c' is the Context object (more on this later)
    return c.text('Hello World!')
    //     ↑ c.text() sends a plain text response
})

export default app
// ↑ Export so the server can use it
```

## The Context Object (c)

The `c` parameter is the **Context** object. It's your helper for handling requests and sending responses.

```typescript
app.get('/example', (c) => {
    // c gives you access to:
    // - c.req  → The incoming request
    // - c.text() → Send text response
    // - c.json() → Send JSON response
    // - c.html() → Send HTML response

    return c.text('Hello!')
})
```

## HTTP Methods

Hono supports all HTTP methods. Here's what each one is used for:

### GET - Retrieve Data

```typescript
// Get a list of users
app.get('/users', (c) => {
    return c.json([
        { id: 1, name: 'John' },
        { id: 2, name: 'Jane' }
    ])
})

// Get a single user
app.get('/users/1', (c) => {
    return c.json({ id: 1, name: 'John' })
})
```

### POST - Create Data

```typescript
// Create a new user
app.post('/users', async (c) => {
    // Get the data sent in the request
    const body = await c.req.json()

    console.log('Creating user:', body)
    // body might be: { name: 'Alice', email: 'alice@example.com' }

    return c.json({
        message: 'User created!',
        user: body
    }, 201)  // 201 = Created
})
```

### PUT - Update Data (Replace)

```typescript
// Update a user completely
app.put('/users/1', async (c) => {
    const body = await c.req.json()

    return c.json({
        message: 'User updated!',
        user: { id: 1, ...body }
    })
})
```

### PATCH - Update Data (Partial)

```typescript
// Update only some fields
app.patch('/users/1', async (c) => {
    const body = await c.req.json()
    // body might be: { name: 'Johnny' } (only name changed)

    return c.json({
        message: 'User partially updated!',
        changes: body
    })
})
```

### DELETE - Remove Data

```typescript
// Delete a user
app.delete('/users/1', (c) => {
    return c.json({ message: 'User deleted!' })
})
```

## Response Types

Hono makes it easy to send different types of responses:

### Plain Text

```typescript
app.get('/hello', (c) => {
    return c.text('Hello, World!')
})
// Response: Hello, World!
```

### JSON (Most Common for APIs)

```typescript
app.get('/api/user', (c) => {
    return c.json({
        id: 1,
        name: 'John Doe',
        email: 'john@example.com'
    })
})
// Response: {"id":1,"name":"John Doe","email":"john@example.com"}
```

### JSON with Status Code

```typescript
// Success - Created (201)
app.post('/api/users', (c) => {
    return c.json({ message: 'Created!' }, 201)
})

// Error - Not Found (404)
app.get('/api/missing', (c) => {
    return c.json({ error: 'Not found' }, 404)
})

// Error - Bad Request (400)
app.post('/api/validate', (c) => {
    return c.json({ error: 'Invalid data' }, 400)
})
```

### HTML

```typescript
app.get('/page', (c) => {
    return c.html(`
        <!DOCTYPE html>
        <html>
            <head>
                <title>My Page</title>
            </head>
            <body>
                <h1>Welcome!</h1>
                <p>This is an HTML page from Hono</p>
            </body>
        </html>
    `)
})
```

### Redirect

```typescript
// Temporary redirect (302)
app.get('/old-page', (c) => {
    return c.redirect('/new-page')
})

// Permanent redirect (301)
app.get('/legacy', (c) => {
    return c.redirect('/modern', 301)
})
```

## Reading Request Data

### URL Parameters

```typescript
// URL: /users/123
app.get('/users/:id', (c) => {
    const id = c.req.param('id')  // '123'
    return c.json({ userId: id })
})

// Multiple parameters
// URL: /posts/5/comments/10
app.get('/posts/:postId/comments/:commentId', (c) => {
    const postId = c.req.param('postId')      // '5'
    const commentId = c.req.param('commentId') // '10'
    return c.json({ postId, commentId })
})
```

### Query Parameters

```typescript
// URL: /search?q=hono&page=2
app.get('/search', (c) => {
    const query = c.req.query('q')     // 'hono'
    const page = c.req.query('page')   // '2'

    return c.json({
        searchQuery: query,
        page: page
    })
})
```

### Request Body (JSON)

```typescript
app.post('/login', async (c) => {
    // Get JSON data from the request body
    const body = await c.req.json()

    // body = { email: 'user@example.com', password: '123456' }
    const { email, password } = body

    return c.json({
        message: `Login attempt for ${email}`
    })
})
```

### Request Headers

```typescript
app.get('/check-auth', (c) => {
    // Get the Authorization header
    const auth = c.req.header('Authorization')
    // auth = 'Bearer abc123...'

    // Get User-Agent
    const userAgent = c.req.header('User-Agent')

    return c.json({
        hasAuth: !!auth,
        browser: userAgent
    })
})
```

## Complete Example: Todo API

Let's build a complete Todo API to practice everything:

```typescript
import { Hono } from 'hono'

const app = new Hono()

// Our "database" (just an array for now)
interface Todo {
    id: number
    title: string
    completed: boolean
    createdAt: string
}

let todos: Todo[] = [
    { id: 1, title: 'Learn Hono', completed: false, createdAt: '2024-01-01' },
    { id: 2, title: 'Build an API', completed: false, createdAt: '2024-01-02' }
]
let nextId = 3

// Homepage - show API info
app.get('/', (c) => {
    return c.json({
        name: 'Todo API',
        version: '1.0.0',
        endpoints: {
            'GET /todos': 'List all todos',
            'GET /todos/:id': 'Get one todo',
            'POST /todos': 'Create a todo',
            'PUT /todos/:id': 'Update a todo',
            'DELETE /todos/:id': 'Delete a todo'
        }
    })
})

// GET /todos - List all todos
app.get('/todos', (c) => {
    // Check for filter query parameter
    const completed = c.req.query('completed')

    if (completed === 'true') {
        return c.json(todos.filter(t => t.completed))
    }
    if (completed === 'false') {
        return c.json(todos.filter(t => !t.completed))
    }

    return c.json(todos)
})

// GET /todos/:id - Get one todo
app.get('/todos/:id', (c) => {
    const id = parseInt(c.req.param('id'))
    const todo = todos.find(t => t.id === id)

    if (!todo) {
        return c.json({ error: 'Todo not found' }, 404)
    }

    return c.json(todo)
})

// POST /todos - Create a new todo
app.post('/todos', async (c) => {
    const body = await c.req.json<{ title: string }>()

    // Validate: title is required
    if (!body.title || body.title.trim() === '') {
        return c.json({ error: 'Title is required' }, 400)
    }

    // Create the new todo
    const newTodo: Todo = {
        id: nextId++,
        title: body.title.trim(),
        completed: false,
        createdAt: new Date().toISOString()
    }

    todos.push(newTodo)

    return c.json(newTodo, 201)
})

// PUT /todos/:id - Update a todo
app.put('/todos/:id', async (c) => {
    const id = parseInt(c.req.param('id'))
    const body = await c.req.json<{ title?: string; completed?: boolean }>()

    // Find the todo
    const todoIndex = todos.findIndex(t => t.id === id)

    if (todoIndex === -1) {
        return c.json({ error: 'Todo not found' }, 404)
    }

    // Update fields
    if (body.title !== undefined) {
        todos[todoIndex].title = body.title
    }
    if (body.completed !== undefined) {
        todos[todoIndex].completed = body.completed
    }

    return c.json(todos[todoIndex])
})

// DELETE /todos/:id - Delete a todo
app.delete('/todos/:id', (c) => {
    const id = parseInt(c.req.param('id'))

    const todoIndex = todos.findIndex(t => t.id === id)

    if (todoIndex === -1) {
        return c.json({ error: 'Todo not found' }, 404)
    }

    // Remove from array
    todos.splice(todoIndex, 1)

    return c.json({ message: 'Todo deleted successfully' })
})

// Handle 404 for unknown routes
app.notFound((c) => {
    return c.json({ error: 'Route not found' }, 404)
})

export default app
```

## Testing Your API

Use curl or any API client to test:

```bash
# Get all todos
curl http://localhost:8787/todos

# Get only completed todos
curl http://localhost:8787/todos?completed=true

# Get one todo
curl http://localhost:8787/todos/1

# Create a new todo
curl -X POST http://localhost:8787/todos \
  -H "Content-Type: application/json" \
  -d '{"title": "Learn more Hono"}'

# Mark todo as completed
curl -X PUT http://localhost:8787/todos/1 \
  -H "Content-Type: application/json" \
  -d '{"completed": true}'

# Delete a todo
curl -X DELETE http://localhost:8787/todos/1
```

## Common Patterns

### Error Handling Pattern

```typescript
app.get('/users/:id', (c) => {
    const id = c.req.param('id')

    // Validate ID
    if (isNaN(parseInt(id))) {
        return c.json({ error: 'Invalid ID format' }, 400)
    }

    // Find user
    const user = findUserById(id)

    if (!user) {
        return c.json({ error: 'User not found' }, 404)
    }

    return c.json(user)
})
```

### Response Wrapper Pattern

```typescript
// Success response
const success = (c, data, status = 200) => {
    return c.json({ success: true, data }, status)
}

// Error response
const error = (c, message, status = 400) => {
    return c.json({ success: false, error: message }, status)
}

// Usage
app.get('/users/:id', (c) => {
    const user = findUser(c.req.param('id'))

    if (!user) {
        return error(c, 'User not found', 404)
    }

    return success(c, user)
})
```

## Summary

In this chapter, you learned:

- ✅ What Hono is and why it's awesome
- ✅ How to install and set up Hono
- ✅ Creating routes with GET, POST, PUT, DELETE
- ✅ Sending different response types (text, JSON, HTML)
- ✅ Reading URL parameters, query strings, and request body
- ✅ Building a complete Todo API

## What's Next?

In the next chapter, we'll dive deeper into [Routing](/guide/hono/02-routing) and learn:
- Route parameters in detail
- Route groups and organization
- Wildcards and patterns
- Best practices for structuring routes

---

[Next: Routing →](/guide/hono/02-routing)
