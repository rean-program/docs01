# Routing

Routing is how your app decides what to do when a user visits a URL. In this chapter, you'll learn all the ways to define routes in Hono.

## What is a Route?

A **route** connects a URL path to a function that handles it.

```typescript
// When someone visits /hello, run this function
app.get('/hello', (c) => {
    return c.text('Hello!')
})
```

Think of routes like a receptionist:
- User asks: "I want to go to /hello"
- Route says: "Ah yes, let me get that for you!" → Returns "Hello!"

## Basic Routes

### Simple Routes

```typescript
import { Hono } from 'hono'

const app = new Hono()

// Homepage
app.get('/', (c) => {
    return c.text('Welcome to the homepage!')
})

// About page
app.get('/about', (c) => {
    return c.text('About us page')
})

// Contact page
app.get('/contact', (c) => {
    return c.text('Contact us page')
})

export default app
```

**What happens:**
- Visit `/` → See "Welcome to the homepage!"
- Visit `/about` → See "About us page"
- Visit `/contact` → See "Contact us page"

### Different HTTP Methods

Each HTTP method has a purpose:

```typescript
// GET - Read/fetch data
// Example: Get a list of products
app.get('/products', (c) => {
    return c.json([
        { id: 1, name: 'Laptop', price: 999 },
        { id: 2, name: 'Phone', price: 699 }
    ])
})

// POST - Create new data
// Example: Add a new product
app.post('/products', async (c) => {
    const newProduct = await c.req.json()
    // Save to database...
    return c.json({ message: 'Product created!', product: newProduct }, 201)
})

// PUT - Update (replace) data
// Example: Update entire product
app.put('/products/1', async (c) => {
    const updatedProduct = await c.req.json()
    return c.json({ message: 'Product replaced!', product: updatedProduct })
})

// PATCH - Update (partial) data
// Example: Update just the price
app.patch('/products/1', async (c) => {
    const changes = await c.req.json()
    // changes = { price: 899 }
    return c.json({ message: 'Product updated!', changes })
})

// DELETE - Remove data
app.delete('/products/1', (c) => {
    return c.json({ message: 'Product deleted!' })
})
```

## Route Parameters

Route parameters let you capture values from the URL.

### Single Parameter

```typescript
// :id is a parameter - it captures any value
app.get('/users/:id', (c) => {
    const id = c.req.param('id')
    return c.json({ userId: id })
})
```

**Examples:**
| URL | `id` value |
|-----|-----------|
| `/users/1` | `'1'` |
| `/users/42` | `'42'` |
| `/users/john` | `'john'` |

### Multiple Parameters

```typescript
// Capture multiple values
app.get('/users/:userId/posts/:postId', (c) => {
    const userId = c.req.param('userId')
    const postId = c.req.param('postId')

    return c.json({
        userId: userId,
        postId: postId
    })
})

// Or get all at once
app.get('/users/:userId/posts/:postId', (c) => {
    const params = c.req.param()
    // params = { userId: '5', postId: '10' }

    return c.json(params)
})
```

**Examples:**
| URL | Result |
|-----|--------|
| `/users/5/posts/10` | `{ userId: '5', postId: '10' }` |
| `/users/john/posts/my-first-post` | `{ userId: 'john', postId: 'my-first-post' }` |

### Real-World Example: Blog API

```typescript
const app = new Hono()

// Get all posts
app.get('/posts', (c) => {
    return c.json([
        { id: 1, title: 'Hello World', author: 'john' },
        { id: 2, title: 'Learning Hono', author: 'jane' }
    ])
})

// Get a specific post
app.get('/posts/:id', (c) => {
    const postId = c.req.param('id')

    // Simulate finding post in database
    const post = {
        id: postId,
        title: 'Hello World',
        content: 'This is my first post!',
        author: 'john'
    }

    return c.json(post)
})

// Get all comments for a post
app.get('/posts/:postId/comments', (c) => {
    const postId = c.req.param('postId')

    return c.json({
        postId: postId,
        comments: [
            { id: 1, text: 'Great post!' },
            { id: 2, text: 'Thanks for sharing!' }
        ]
    })
})

// Get a specific comment on a post
app.get('/posts/:postId/comments/:commentId', (c) => {
    const { postId, commentId } = c.req.param()

    return c.json({
        postId,
        commentId,
        text: 'Great post!',
        author: 'reader123'
    })
})
```

## Optional Parameters

Use `?` to make a parameter optional:

```typescript
// :name is optional
app.get('/greet/:name?', (c) => {
    const name = c.req.param('name')

    if (name) {
        return c.text(`Hello, ${name}!`)
    }

    return c.text('Hello, stranger!')
})
```

**Examples:**
| URL | Response |
|-----|----------|
| `/greet/John` | "Hello, John!" |
| `/greet/` | "Hello, stranger!" |
| `/greet` | "Hello, stranger!" |

## Wildcard Routes

Use `*` to match anything:

```typescript
// Match any path starting with /files/
app.get('/files/*', (c) => {
    // c.req.path gives you the full path
    const fullPath = c.req.path
    // e.g., /files/documents/report.pdf

    return c.text(`Requested file: ${fullPath}`)
})
```

**Examples:**
| URL | Matches? |
|-----|----------|
| `/files/image.png` | ✅ Yes |
| `/files/docs/report.pdf` | ✅ Yes |
| `/files/a/b/c/d.txt` | ✅ Yes |
| `/other/file.txt` | ❌ No |

### Catch-All Route (404 Alternative)

```typescript
// Put this LAST - it catches everything else
app.get('*', (c) => {
    return c.text('Page not found!', 404)
})
```

## Route Patterns (Regex)

You can use patterns to restrict what values are accepted:

### Numbers Only

```typescript
// Only match if :id is a number
app.get('/users/:id{[0-9]+}', (c) => {
    const id = c.req.param('id')
    // id is guaranteed to be numeric

    return c.json({ userId: parseInt(id) })
})
```

**Examples:**
| URL | Matches? |
|-----|----------|
| `/users/123` | ✅ Yes |
| `/users/1` | ✅ Yes |
| `/users/abc` | ❌ No |
| `/users/12abc` | ❌ No |

### Letters Only

```typescript
// Only match alphabetic usernames
app.get('/profile/:username{[a-zA-Z]+}', (c) => {
    const username = c.req.param('username')
    return c.text(`Profile of ${username}`)
})
```

### Slug Pattern

```typescript
// Match URL-friendly slugs (letters, numbers, hyphens)
app.get('/articles/:slug{[a-z0-9-]+}', (c) => {
    const slug = c.req.param('slug')
    // Valid: "my-first-post", "hello-world-123"
    // Invalid: "My Post", "hello_world"

    return c.json({ slug })
})
```

### File Extension Pattern

```typescript
// Only match .pdf files
app.get('/documents/:name{.+\\.pdf}', (c) => {
    const name = c.req.param('name')
    return c.text(`Serving PDF: ${name}`)
})
```

## Route Groups

Organize related routes together using groups.

### Basic Grouping

```typescript
const app = new Hono()

// Create a group for API routes
const api = new Hono()

// Define routes on the group
api.get('/users', (c) => c.json({ users: [] }))
api.get('/posts', (c) => c.json({ posts: [] }))
api.get('/comments', (c) => c.json({ comments: [] }))

// Mount the group at /api
app.route('/api', api)

// Now we have:
// GET /api/users
// GET /api/posts
// GET /api/comments
```

### Multiple Groups

```typescript
const app = new Hono()

// Public routes (no auth needed)
const publicRoutes = new Hono()
publicRoutes.get('/', (c) => c.text('Homepage'))
publicRoutes.get('/about', (c) => c.text('About us'))
publicRoutes.get('/contact', (c) => c.text('Contact'))

// API routes
const apiRoutes = new Hono()
apiRoutes.get('/products', (c) => c.json([]))
apiRoutes.get('/categories', (c) => c.json([]))

// Admin routes
const adminRoutes = new Hono()
adminRoutes.get('/dashboard', (c) => c.text('Admin Dashboard'))
adminRoutes.get('/users', (c) => c.json([]))

// Mount all groups
app.route('/', publicRoutes)
app.route('/api', apiRoutes)
app.route('/admin', adminRoutes)

// Final routes:
// GET /           → Homepage
// GET /about      → About us
// GET /api/products → []
// GET /admin/dashboard → Admin Dashboard
```

### Nested Groups (API Versioning)

```typescript
const app = new Hono()

// Version 1 API
const v1 = new Hono()
v1.get('/users', (c) => c.json({ version: 1, users: ['old format'] }))
v1.get('/products', (c) => c.json({ version: 1, products: [] }))

// Version 2 API (improved!)
const v2 = new Hono()
v2.get('/users', (c) => c.json({
    version: 2,
    data: { users: ['new format'] },
    meta: { total: 1 }
}))
v2.get('/products', (c) => c.json({
    version: 2,
    data: { products: [] },
    meta: { total: 0 }
}))

// Mount versions
app.route('/api/v1', v1)
app.route('/api/v2', v2)

// Routes:
// GET /api/v1/users → old format
// GET /api/v2/users → new format with meta
```

### Using basePath

An alternative way to set a prefix for all routes:

```typescript
// All routes start with /api
const app = new Hono().basePath('/api')

app.get('/users', (c) => c.json([]))     // GET /api/users
app.get('/posts', (c) => c.json([]))     // GET /api/posts
app.get('/health', (c) => c.text('OK'))  // GET /api/health

export default app
```

## Route Chaining

You can chain multiple methods together:

```typescript
const app = new Hono()

// Chain methods for the same path
app
    .get('/resource', (c) => c.json({ method: 'GET - List all' }))
    .post('/resource', (c) => c.json({ method: 'POST - Create new' }))

// Or for a single resource with ID
app
    .get('/resource/:id', (c) => c.json({ method: 'GET - Read one' }))
    .put('/resource/:id', (c) => c.json({ method: 'PUT - Update one' }))
    .delete('/resource/:id', (c) => c.json({ method: 'DELETE - Remove one' }))
```

## Route Priority

**Important:** Routes are matched in the order they are defined. Put specific routes before general ones!

### ❌ Wrong Order

```typescript
// This is WRONG!
app.get('/users/:id', (c) => {
    return c.json({ type: 'user by id' })
})

app.get('/users/me', (c) => {
    return c.json({ type: 'current user' })
})

// Problem: /users/me matches /users/:id first!
// id = 'me'
```

### ✅ Correct Order

```typescript
// This is CORRECT!

// Specific routes first
app.get('/users/me', (c) => {
    return c.json({ type: 'current user' })
})

app.get('/users/new', (c) => {
    return c.text('Create new user form')
})

// Generic routes after
app.get('/users/:id', (c) => {
    return c.json({ type: 'user by id', id: c.req.param('id') })
})

// Results:
// /users/me   → { type: 'current user' }
// /users/new  → Create new user form
// /users/123  → { type: 'user by id', id: '123' }
```

## Handle All Methods

### Using `all()`

```typescript
// Handle any HTTP method
app.all('/api/webhook', async (c) => {
    const method = c.req.method

    return c.json({
        message: 'Webhook received',
        method: method,
        timestamp: new Date().toISOString()
    })
})
```

### Using `on()`

```typescript
// Handle specific methods
app.on('GET', '/resource', (c) => c.text('GET request'))

// Handle multiple methods
app.on(['GET', 'POST'], '/resource', (c) => {
    return c.json({ method: c.req.method })
})
```

## Complete Example: E-commerce API

Let's build a complete e-commerce API to practice routing:

```typescript
import { Hono } from 'hono'

const app = new Hono()

// ============ PRODUCTS ============
const products = new Hono()

// List all products
// GET /api/products
// GET /api/products?category=electronics&min_price=100
products.get('/', (c) => {
    const category = c.req.query('category')
    const minPrice = c.req.query('min_price')
    const maxPrice = c.req.query('max_price')

    return c.json({
        filters: { category, minPrice, maxPrice },
        products: [
            { id: 1, name: 'Laptop', category: 'electronics', price: 999 },
            { id: 2, name: 'Shirt', category: 'clothing', price: 29 }
        ]
    })
})

// Get featured products
// GET /api/products/featured
products.get('/featured', (c) => {
    return c.json({
        featured: [
            { id: 1, name: 'Laptop', featured: true }
        ]
    })
})

// Get products on sale
// GET /api/products/sale
products.get('/sale', (c) => {
    return c.json({
        onSale: [
            { id: 2, name: 'Shirt', originalPrice: 49, salePrice: 29 }
        ]
    })
})

// Get single product (must be after specific routes!)
// GET /api/products/123
products.get('/:id{[0-9]+}', (c) => {
    const id = c.req.param('id')
    return c.json({
        id: parseInt(id),
        name: 'Product Name',
        price: 99.99,
        description: 'Product description here'
    })
})

// Get product reviews
// GET /api/products/123/reviews
products.get('/:id{[0-9]+}/reviews', (c) => {
    const productId = c.req.param('id')
    return c.json({
        productId,
        reviews: [
            { user: 'john', rating: 5, comment: 'Great!' },
            { user: 'jane', rating: 4, comment: 'Good product' }
        ]
    })
})

// Create product
// POST /api/products
products.post('/', async (c) => {
    const body = await c.req.json()
    return c.json({
        message: 'Product created',
        product: { id: 999, ...body }
    }, 201)
})

// Update product
// PUT /api/products/123
products.put('/:id{[0-9]+}', async (c) => {
    const id = c.req.param('id')
    const body = await c.req.json()
    return c.json({
        message: 'Product updated',
        product: { id: parseInt(id), ...body }
    })
})

// Delete product
// DELETE /api/products/123
products.delete('/:id{[0-9]+}', (c) => {
    const id = c.req.param('id')
    return c.json({ message: `Product ${id} deleted` })
})

// ============ CATEGORIES ============
const categories = new Hono()

categories.get('/', (c) => {
    return c.json([
        { id: 1, name: 'Electronics', slug: 'electronics' },
        { id: 2, name: 'Clothing', slug: 'clothing' }
    ])
})

categories.get('/:slug', (c) => {
    const slug = c.req.param('slug')
    return c.json({
        category: slug,
        products: []
    })
})

// ============ CART ============
const cart = new Hono()

cart.get('/', (c) => {
    return c.json({
        items: [],
        total: 0
    })
})

cart.post('/add', async (c) => {
    const { productId, quantity } = await c.req.json()
    return c.json({
        message: 'Added to cart',
        productId,
        quantity
    })
})

cart.delete('/item/:productId', (c) => {
    const productId = c.req.param('productId')
    return c.json({ message: `Removed product ${productId} from cart` })
})

// ============ MOUNT ALL ROUTES ============
app.route('/api/products', products)
app.route('/api/categories', categories)
app.route('/api/cart', cart)

// Homepage
app.get('/', (c) => {
    return c.json({
        name: 'E-commerce API',
        endpoints: {
            products: '/api/products',
            categories: '/api/categories',
            cart: '/api/cart'
        }
    })
})

// 404 handler
app.notFound((c) => {
    return c.json({
        error: 'Not Found',
        path: c.req.path
    }, 404)
})

export default app
```

## Summary

In this chapter, you learned:

- ✅ Basic routing with different HTTP methods
- ✅ Route parameters (`:id`, `:name`)
- ✅ Optional parameters (`:name?`)
- ✅ Wildcards (`*`) for catch-all routes
- ✅ Route patterns with regex (`{[0-9]+}`)
- ✅ Route groups for organization
- ✅ API versioning with nested groups
- ✅ Route priority (specific before generic!)
- ✅ Building a complete API structure

## What's Next?

In the next chapter, we'll learn about [Middleware](/guide/hono/03-middleware):
- What middleware is and why it's useful
- Built-in middleware (logging, CORS, auth)
- Creating custom middleware
- Middleware execution order

---

[Previous: Introduction](/guide/hono/01-introduction) | [Next: Middleware →](/guide/hono/03-middleware)
