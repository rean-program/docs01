# Deployment

Hono runs on multiple platforms, making deployment flexible. This chapter covers deploying your Hono application to various environments.

## Cloudflare Workers

Cloudflare Workers is the most popular deployment target for Hono, offering edge computing with low latency worldwide.

### Project Setup

```bash
npm create hono@latest my-app
# Select "cloudflare-workers"
cd my-app
```

### Configuration

```toml
# wrangler.toml
name = "my-hono-app"
main = "src/index.ts"
compatibility_date = "2024-01-01"

# Environment variables
[vars]
API_KEY = "your-api-key"

# KV namespace binding
[[kv_namespaces]]
binding = "MY_KV"
id = "your-kv-namespace-id"

# D1 database binding
[[d1_databases]]
binding = "DB"
database_name = "my-database"
database_id = "your-database-id"

# R2 bucket binding
[[r2_buckets]]
binding = "BUCKET"
bucket_name = "my-bucket"
```

### App Configuration

```typescript
// src/index.ts
import { Hono } from 'hono'

type Bindings = {
    API_KEY: string
    MY_KV: KVNamespace
    DB: D1Database
    BUCKET: R2Bucket
}

const app = new Hono<{ Bindings: Bindings }>()

app.get('/', (c) => {
    return c.text('Hello from Cloudflare Workers!')
})

// Using KV
app.get('/kv/:key', async (c) => {
    const key = c.req.param('key')
    const value = await c.env.MY_KV.get(key)
    return c.json({ key, value })
})

// Using D1
app.get('/users', async (c) => {
    const { results } = await c.env.DB
        .prepare('SELECT * FROM users')
        .all()
    return c.json(results)
})

export default app
```

### Deployment Commands

```bash
# Development
npm run dev
# or
wrangler dev

# Deploy to production
npm run deploy
# or
wrangler deploy

# Deploy to specific environment
wrangler deploy --env production
```

### Multiple Environments

```toml
# wrangler.toml

# Shared configuration
name = "my-app"
main = "src/index.ts"

# Development environment
[env.dev]
vars = { ENVIRONMENT = "development" }

# Staging environment
[env.staging]
vars = { ENVIRONMENT = "staging" }

# Production environment
[env.production]
vars = { ENVIRONMENT = "production" }
routes = [
    { pattern = "api.example.com/*", zone_name = "example.com" }
]
```

## Cloudflare Pages

Deploy as a full-stack application with Cloudflare Pages.

### Setup

```bash
npm create hono@latest my-app
# Select "cloudflare-pages"
```

### Functions Directory Structure

```
my-app/
├── public/           # Static assets
├── functions/
│   └── api/
│       └── [[route]].ts  # Catch-all route
├── package.json
└── wrangler.toml
```

### API Route Handler

```typescript
// functions/api/[[route]].ts
import { Hono } from 'hono'
import { handle } from 'hono/cloudflare-pages'

const app = new Hono().basePath('/api')

app.get('/hello', (c) => c.json({ message: 'Hello!' }))

export const onRequest = handle(app)
```

### Deployment

```bash
# Via Wrangler
wrangler pages deploy ./public

# Or connect GitHub repo to Cloudflare Pages dashboard
```

## Bun

Bun provides excellent performance for Hono applications.

### Setup

```bash
bun create hono my-app
cd my-app
bun install
```

### App Configuration

```typescript
// src/index.ts
import { Hono } from 'hono'

const app = new Hono()

app.get('/', (c) => c.text('Hello Bun!'))

export default {
    port: 3000,
    fetch: app.fetch
}
```

### Running

```bash
# Development
bun run --hot src/index.ts

# Production
bun run src/index.ts
```

### Docker Deployment

```dockerfile
# Dockerfile
FROM oven/bun:1 as builder
WORKDIR /app
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile

FROM oven/bun:1
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY . .

EXPOSE 3000
CMD ["bun", "run", "src/index.ts"]
```

## Node.js

### Setup

```bash
npm create hono@latest my-app
# Select "nodejs"
cd my-app
npm install
```

### App Configuration

```typescript
// src/index.ts
import { Hono } from 'hono'
import { serve } from '@hono/node-server'

const app = new Hono()

app.get('/', (c) => c.text('Hello Node.js!'))

const port = parseInt(process.env.PORT || '3000')

console.log(`Server running on port ${port}`)

serve({
    fetch: app.fetch,
    port
})
```

### PM2 Deployment

```javascript
// ecosystem.config.js
module.exports = {
    apps: [{
        name: 'hono-app',
        script: 'dist/index.js',
        instances: 'max',
        exec_mode: 'cluster',
        env: {
            NODE_ENV: 'production',
            PORT: 3000
        }
    }]
}
```

```bash
# Build
npm run build

# Start with PM2
pm2 start ecosystem.config.js
```

### Docker Deployment

```dockerfile
# Dockerfile
FROM node:20-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./

EXPOSE 3000
CMD ["node", "dist/index.js"]
```

## Deno

### Setup

```bash
npm create hono@latest my-app
# Select "deno"
```

### App Configuration

```typescript
// main.ts
import { Hono } from 'https://deno.land/x/hono/mod.ts'

const app = new Hono()

app.get('/', (c) => c.text('Hello Deno!'))

Deno.serve(app.fetch)
```

### Deno Deploy

```bash
# Install deployctl
deno install -A --no-check -r -f https://deno.land/x/deploy/deployctl.ts

# Deploy
deployctl deploy --project=my-project main.ts
```

## AWS Lambda

### Setup

```bash
npm create hono@latest my-app
# Select "aws-lambda"
```

### Handler Configuration

```typescript
// src/index.ts
import { Hono } from 'hono'
import { handle } from 'hono/aws-lambda'

const app = new Hono()

app.get('/', (c) => c.text('Hello Lambda!'))

export const handler = handle(app)
```

### SAM Template

```yaml
# template.yaml
AWSTemplateFormatVersion: '2010-09-09'
Transform: AWS::Serverless-2016-10-31

Globals:
  Function:
    Timeout: 30
    Runtime: nodejs20.x

Resources:
  HonoFunction:
    Type: AWS::Serverless::Function
    Properties:
      Handler: dist/index.handler
      CodeUri: ./
      Events:
        Api:
          Type: HttpApi
          Properties:
            Path: /{proxy+}
            Method: ANY

Outputs:
  ApiUrl:
    Value: !Sub 'https://${ServerlessHttpApi}.execute-api.${AWS::Region}.amazonaws.com'
```

### Deployment

```bash
# Build
npm run build

# Deploy with SAM
sam build
sam deploy --guided
```

## Vercel

### Setup

```bash
npm create hono@latest my-app
# Select "vercel"
```

### Configuration

```json
// vercel.json
{
    "rewrites": [
        { "source": "/api/(.*)", "destination": "/api" }
    ]
}
```

### API Handler

```typescript
// api/index.ts
import { Hono } from 'hono'
import { handle } from 'hono/vercel'

const app = new Hono().basePath('/api')

app.get('/hello', (c) => c.json({ message: 'Hello Vercel!' }))

export const GET = handle(app)
export const POST = handle(app)
```

### Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

## Netlify

### Edge Functions

```typescript
// netlify/edge-functions/api.ts
import { Hono } from 'hono'

const app = new Hono()

app.get('/api/*', (c) => {
    return c.json({ message: 'Hello Netlify Edge!' })
})

export default app.fetch
```

### Configuration

```toml
# netlify.toml
[[edge_functions]]
path = "/api/*"
function = "api"
```

## Environment Variables

### Cloudflare Workers

```toml
# wrangler.toml
[vars]
API_KEY = "value"

# For secrets
# wrangler secret put SECRET_KEY
```

### Node.js

```typescript
// Use dotenv
import 'dotenv/config'

const apiKey = process.env.API_KEY
```

### Best Practices

```typescript
// config.ts
interface Config {
    apiKey: string
    databaseUrl: string
    environment: 'development' | 'staging' | 'production'
}

export const getConfig = (env: Record<string, string>): Config => {
    const config: Config = {
        apiKey: env.API_KEY || '',
        databaseUrl: env.DATABASE_URL || '',
        environment: (env.ENVIRONMENT as Config['environment']) || 'development'
    }

    // Validate required config
    if (!config.apiKey) {
        throw new Error('API_KEY is required')
    }

    return config
}

// Usage in Cloudflare Workers
app.get('/config', (c) => {
    const config = getConfig(c.env)
    return c.json({ environment: config.environment })
})
```

## Production Checklist

### Security

```typescript
import { Hono } from 'hono'
import { secureHeaders } from 'hono/secure-headers'
import { cors } from 'hono/cors'

const app = new Hono()

// Security headers
app.use('*', secureHeaders())

// CORS configuration
app.use('/api/*', cors({
    origin: ['https://example.com'],
    credentials: true
}))

// Rate limiting (custom implementation)
const rateLimit = new Map()

app.use('/api/*', async (c, next) => {
    const ip = c.req.header('cf-connecting-ip') || 'unknown'
    const now = Date.now()
    const windowMs = 60000 // 1 minute
    const max = 100 // requests per window

    const record = rateLimit.get(ip) || { count: 0, start: now }

    if (now - record.start > windowMs) {
        record.count = 1
        record.start = now
    } else {
        record.count++
    }

    rateLimit.set(ip, record)

    if (record.count > max) {
        return c.json({ error: 'Too many requests' }, 429)
    }

    await next()
})
```

### Error Handling

```typescript
import { HTTPException } from 'hono/http-exception'

app.onError((err, c) => {
    // Log error (use proper logging service in production)
    console.error({
        error: err.message,
        stack: err.stack,
        path: c.req.path,
        method: c.req.method
    })

    if (err instanceof HTTPException) {
        return c.json({ error: err.message }, err.status)
    }

    // Don't expose internal errors in production
    return c.json({ error: 'Internal Server Error' }, 500)
})
```

### Health Checks

```typescript
app.get('/health', (c) => {
    return c.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: process.env.VERSION || '1.0.0'
    })
})

app.get('/ready', async (c) => {
    // Check dependencies
    try {
        // Check database connection
        // await db.query('SELECT 1')

        return c.json({ status: 'ready' })
    } catch (error) {
        return c.json({ status: 'not ready' }, 503)
    }
})
```

## Summary

In this chapter, you learned:

- Deploying to Cloudflare Workers and Pages
- Deploying with Bun and Node.js
- AWS Lambda deployment
- Vercel and Netlify deployment
- Environment variable management
- Production security practices
- Health checks and monitoring

## What's Next?

In the next chapter, we'll explore [Advanced Topics](/guide/hono/08-advanced) including:
- RPC (Remote Procedure Call)
- Streaming responses
- WebSockets
- Best practices and patterns

---

[Previous: Testing](/guide/hono/06-testing) | [Next: Advanced Topics →](/guide/hono/08-advanced)
