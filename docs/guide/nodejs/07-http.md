# HTTP Module in Node.js

The `http` module is a core module that allows you to create web servers and make HTTP requests without any external dependencies. In this tutorial, you'll learn how to build servers and handle HTTP communication.

## Introduction to HTTP

```
┌─────────────────────────────────────────────────────────────┐
│                    HTTP Request/Response                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   Client (Browser)              Server (Node.js)            │
│   ┌─────────────┐              ┌─────────────┐             │
│   │             │   Request    │             │             │
│   │             │  ─────────►  │             │             │
│   │  GET /api   │              │   Process   │             │
│   │             │              │   Request   │             │
│   │             │   Response   │             │             │
│   │             │  ◄─────────  │             │             │
│   │  { data }   │              │   200 OK    │             │
│   └─────────────┘              └─────────────┘             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Creating a Basic Server

### Minimal Server

```javascript
const http = require('http');

// Create server
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hello, World!');
});

// Start listening
server.listen(3000, () => {
    console.log('Server running at http://localhost:3000/');
});
```

### Understanding Request and Response

```javascript
const http = require('http');

const server = http.createServer((req, res) => {
    // Request object (req) - incoming data
    console.log('Method:', req.method);           // GET, POST, etc.
    console.log('URL:', req.url);                 // /path?query=value
    console.log('Headers:', req.headers);         // { host: ..., user-agent: ... }

    // Response object (res) - outgoing data
    res.statusCode = 200;                         // Status code
    res.setHeader('Content-Type', 'text/html');   // Response header
    res.write('<h1>Hello</h1>');                  // Write body
    res.end('<p>World</p>');                      // End and send
});

server.listen(3000);
```

## Handling Different Routes

### Basic Router

```javascript
const http = require('http');

const server = http.createServer((req, res) => {
    const { method, url } = req;

    // Set default headers
    res.setHeader('Content-Type', 'application/json');

    // Route handling
    if (method === 'GET' && url === '/') {
        res.statusCode = 200;
        res.end(JSON.stringify({ message: 'Home page' }));
    }
    else if (method === 'GET' && url === '/about') {
        res.statusCode = 200;
        res.end(JSON.stringify({ message: 'About page' }));
    }
    else if (method === 'GET' && url === '/api/users') {
        res.statusCode = 200;
        res.end(JSON.stringify({
            users: [
                { id: 1, name: 'John' },
                { id: 2, name: 'Jane' }
            ]
        }));
    }
    else {
        res.statusCode = 404;
        res.end(JSON.stringify({ error: 'Not Found' }));
    }
});

server.listen(3000, () => {
    console.log('Server running at http://localhost:3000/');
});
```

### Router with URL Parsing

```javascript
const http = require('http');
const url = require('url');

const server = http.createServer((req, res) => {
    // Parse URL
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    const query = parsedUrl.query;

    console.log('Path:', pathname);   // /users
    console.log('Query:', query);     // { name: 'John', age: '25' }

    // Handle route with query params
    // GET /search?q=nodejs
    if (req.method === 'GET' && pathname === '/search') {
        const searchQuery = query.q || '';
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            query: searchQuery,
            results: [`Result for: ${searchQuery}`]
        }));
        return;
    }

    // Handle route with path params
    // GET /users/123
    const userMatch = pathname.match(/^\/users\/(\d+)$/);
    if (req.method === 'GET' && userMatch) {
        const userId = userMatch[1];
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ userId, name: `User ${userId}` }));
        return;
    }

    // 404
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not Found' }));
});

server.listen(3000);
```

## Handling Request Body

### Parsing JSON Body

```javascript
const http = require('http');

const server = http.createServer((req, res) => {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight
    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    if (req.method === 'POST' && req.url === '/api/users') {
        let body = '';

        // Collect data chunks
        req.on('data', (chunk) => {
            body += chunk.toString();
        });

        // Process complete body
        req.on('end', () => {
            try {
                const user = JSON.parse(body);
                console.log('Received user:', user);

                // Send response
                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    message: 'User created',
                    user: { id: Date.now(), ...user }
                }));
            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Invalid JSON' }));
            }
        });

        return;
    }

    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not Found' }));
});

server.listen(3000);
```

### Helper Function for Body Parsing

```javascript
function parseBody(req) {
    return new Promise((resolve, reject) => {
        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();

            // Limit body size (1MB)
            if (body.length > 1e6) {
                req.destroy();
                reject(new Error('Body too large'));
            }
        });

        req.on('end', () => {
            try {
                resolve(JSON.parse(body));
            } catch {
                resolve(body); // Return raw string if not JSON
            }
        });

        req.on('error', reject);
    });
}

// Usage
const server = http.createServer(async (req, res) => {
    if (req.method === 'POST') {
        try {
            const body = await parseBody(req);
            console.log('Body:', body);

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ received: body }));
        } catch (error) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: error.message }));
        }
    }
});
```

## HTTP Status Codes

```javascript
const HTTP_STATUS = {
    // Success
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,

    // Redirect
    MOVED_PERMANENTLY: 301,
    FOUND: 302,
    NOT_MODIFIED: 304,

    // Client Errors
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    METHOD_NOT_ALLOWED: 405,
    CONFLICT: 409,
    UNPROCESSABLE_ENTITY: 422,
    TOO_MANY_REQUESTS: 429,

    // Server Errors
    INTERNAL_SERVER_ERROR: 500,
    NOT_IMPLEMENTED: 501,
    BAD_GATEWAY: 502,
    SERVICE_UNAVAILABLE: 503
};

// Usage examples
res.writeHead(HTTP_STATUS.OK);
res.writeHead(HTTP_STATUS.CREATED);
res.writeHead(HTTP_STATUS.NOT_FOUND);
```

## Serving Static Files

```javascript
const http = require('http');
const fs = require('fs');
const path = require('path');

// MIME types
const MIME_TYPES = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
    // Build file path
    let filepath = path.join(__dirname, 'public', req.url);

    // Default to index.html
    if (req.url === '/') {
        filepath = path.join(__dirname, 'public', 'index.html');
    }

    // Get file extension
    const ext = path.extname(filepath);
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    // Read and serve file
    fs.readFile(filepath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 Not Found</h1>');
            } else {
                res.writeHead(500);
                res.end('Server Error');
            }
            return;
        }

        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content);
    });
});

server.listen(3000);
```

### Serving with Streams (Better for Large Files)

```javascript
const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
    const filepath = path.join(__dirname, 'public', req.url);
    const ext = path.extname(filepath);

    // Check if file exists
    fs.access(filepath, fs.constants.R_OK, (error) => {
        if (error) {
            res.writeHead(404);
            res.end('Not Found');
            return;
        }

        // Stream the file
        const stream = fs.createReadStream(filepath);

        stream.on('error', () => {
            res.writeHead(500);
            res.end('Server Error');
        });

        res.writeHead(200, {
            'Content-Type': MIME_TYPES[ext] || 'application/octet-stream'
        });

        stream.pipe(res);
    });
});

server.listen(3000);
```

## Making HTTP Requests

### GET Request

```javascript
const http = require('http');
const https = require('https');

function httpGet(url) {
    return new Promise((resolve, reject) => {
        // Choose http or https
        const client = url.startsWith('https') ? https : http;

        client.get(url, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                try {
                    resolve({
                        statusCode: res.statusCode,
                        headers: res.headers,
                        data: JSON.parse(data)
                    });
                } catch {
                    resolve({
                        statusCode: res.statusCode,
                        headers: res.headers,
                        data
                    });
                }
            });
        }).on('error', reject);
    });
}

// Usage
const response = await httpGet('https://jsonplaceholder.typicode.com/posts/1');
console.log(response.data);
```

### POST Request

```javascript
const http = require('http');
const https = require('https');

function httpPost(url, data) {
    return new Promise((resolve, reject) => {
        const parsedUrl = new URL(url);
        const client = parsedUrl.protocol === 'https:' ? https : http;
        const postData = JSON.stringify(data);

        const options = {
            hostname: parsedUrl.hostname,
            port: parsedUrl.port,
            path: parsedUrl.pathname,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            }
        };

        const req = client.request(options, (res) => {
            let responseData = '';

            res.on('data', (chunk) => {
                responseData += chunk;
            });

            res.on('end', () => {
                try {
                    resolve({
                        statusCode: res.statusCode,
                        data: JSON.parse(responseData)
                    });
                } catch {
                    resolve({
                        statusCode: res.statusCode,
                        data: responseData
                    });
                }
            });
        });

        req.on('error', reject);

        // Write body
        req.write(postData);
        req.end();
    });
}

// Usage
const response = await httpPost('https://jsonplaceholder.typicode.com/posts', {
    title: 'Hello',
    body: 'World',
    userId: 1
});
console.log(response.data);
```

## Building a REST API Server

```javascript
const http = require('http');
const url = require('url');

// In-memory database
let users = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Doe', email: 'jane@example.com' }
];
let nextId = 3;

// Helper functions
function sendJSON(res, statusCode, data) {
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
}

function parseBody(req) {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            try {
                resolve(body ? JSON.parse(body) : {});
            } catch {
                reject(new Error('Invalid JSON'));
            }
        });
        req.on('error', reject);
    });
}

// Server
const server = http.createServer(async (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    const method = req.method;

    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    try {
        // GET /api/users - List all users
        if (method === 'GET' && pathname === '/api/users') {
            return sendJSON(res, 200, { users });
        }

        // GET /api/users/:id - Get one user
        const getUserMatch = pathname.match(/^\/api\/users\/(\d+)$/);
        if (method === 'GET' && getUserMatch) {
            const id = parseInt(getUserMatch[1]);
            const user = users.find(u => u.id === id);

            if (!user) {
                return sendJSON(res, 404, { error: 'User not found' });
            }
            return sendJSON(res, 200, { user });
        }

        // POST /api/users - Create user
        if (method === 'POST' && pathname === '/api/users') {
            const body = await parseBody(req);

            if (!body.name || !body.email) {
                return sendJSON(res, 400, { error: 'Name and email required' });
            }

            const newUser = {
                id: nextId++,
                name: body.name,
                email: body.email
            };
            users.push(newUser);

            return sendJSON(res, 201, { user: newUser });
        }

        // PUT /api/users/:id - Update user
        const putUserMatch = pathname.match(/^\/api\/users\/(\d+)$/);
        if (method === 'PUT' && putUserMatch) {
            const id = parseInt(putUserMatch[1]);
            const index = users.findIndex(u => u.id === id);

            if (index === -1) {
                return sendJSON(res, 404, { error: 'User not found' });
            }

            const body = await parseBody(req);
            users[index] = { ...users[index], ...body };

            return sendJSON(res, 200, { user: users[index] });
        }

        // DELETE /api/users/:id - Delete user
        const deleteUserMatch = pathname.match(/^\/api\/users\/(\d+)$/);
        if (method === 'DELETE' && deleteUserMatch) {
            const id = parseInt(deleteUserMatch[1]);
            const index = users.findIndex(u => u.id === id);

            if (index === -1) {
                return sendJSON(res, 404, { error: 'User not found' });
            }

            users.splice(index, 1);
            return sendJSON(res, 200, { message: 'User deleted' });
        }

        // 404 for unknown routes
        sendJSON(res, 404, { error: 'Not Found' });

    } catch (error) {
        console.error('Error:', error);
        sendJSON(res, 500, { error: 'Internal Server Error' });
    }
});

server.listen(3000, () => {
    console.log('API server running at http://localhost:3000/');
});
```

## Server Events

```javascript
const http = require('http');

const server = http.createServer((req, res) => {
    res.end('Hello');
});

// Server events
server.on('listening', () => {
    const addr = server.address();
    console.log(`Server listening on ${addr.address}:${addr.port}`);
});

server.on('connection', (socket) => {
    console.log('New connection from:', socket.remoteAddress);
});

server.on('request', (req, res) => {
    console.log(`${req.method} ${req.url}`);
});

server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
        console.error('Port is already in use');
    } else {
        console.error('Server error:', error);
    }
});

server.on('close', () => {
    console.log('Server closed');
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('Shutting down gracefully...');
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});

server.listen(3000);
```

## HTTPS Server

```javascript
const https = require('https');
const fs = require('fs');

// SSL/TLS options
const options = {
    key: fs.readFileSync('server-key.pem'),
    cert: fs.readFileSync('server-cert.pem')
};

const server = https.createServer(options, (req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Secure Hello!');
});

server.listen(443, () => {
    console.log('HTTPS server running on port 443');
});
```

### Generate Self-Signed Certificate (Development)

```bash
# Generate private key and certificate
openssl req -x509 -newkey rsa:4096 -keyout server-key.pem -out server-cert.pem -days 365 -nodes
```

## Practical Example: Simple API Gateway

```javascript
const http = require('http');
const https = require('https');

class APIGateway {
    constructor(port = 8000) {
        this.port = port;
        this.routes = new Map();
        this.middleware = [];
    }

    use(fn) {
        this.middleware.push(fn);
    }

    proxy(path, target) {
        this.routes.set(path, target);
    }

    async handleRequest(req, res) {
        // Run middleware
        for (const mw of this.middleware) {
            await mw(req, res);
        }

        // Find matching route
        const pathname = req.url.split('?')[0];
        let targetUrl = null;

        for (const [path, target] of this.routes) {
            if (pathname.startsWith(path)) {
                const remainingPath = pathname.slice(path.length);
                targetUrl = target + remainingPath;
                break;
            }
        }

        if (!targetUrl) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Not Found' }));
            return;
        }

        // Proxy request
        this.proxyRequest(req, res, targetUrl);
    }

    proxyRequest(clientReq, clientRes, targetUrl) {
        const parsed = new URL(targetUrl);
        const client = parsed.protocol === 'https:' ? https : http;

        const options = {
            hostname: parsed.hostname,
            port: parsed.port,
            path: parsed.pathname + parsed.search,
            method: clientReq.method,
            headers: {
                ...clientReq.headers,
                host: parsed.host
            }
        };

        const proxyReq = client.request(options, (proxyRes) => {
            clientRes.writeHead(proxyRes.statusCode, proxyRes.headers);
            proxyRes.pipe(clientRes);
        });

        proxyReq.on('error', (error) => {
            console.error('Proxy error:', error);
            clientRes.writeHead(502, { 'Content-Type': 'application/json' });
            clientRes.end(JSON.stringify({ error: 'Bad Gateway' }));
        });

        clientReq.pipe(proxyReq);
    }

    start() {
        const server = http.createServer((req, res) => {
            this.handleRequest(req, res);
        });

        server.listen(this.port, () => {
            console.log(`API Gateway running on port ${this.port}`);
        });
    }
}

// Usage
const gateway = new APIGateway(8000);

// Logging middleware
gateway.use((req, res) => {
    console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
});

// Route to different services
gateway.proxy('/api/users', 'http://localhost:3001');
gateway.proxy('/api/products', 'http://localhost:3002');
gateway.proxy('/api/orders', 'http://localhost:3003');

gateway.start();
```

## Summary

| Concept | Description |
|---------|-------------|
| **http.createServer()** | Creates an HTTP server |
| **req** | Incoming request object |
| **res** | Outgoing response object |
| **res.writeHead()** | Set status and headers |
| **res.write()** | Write response body |
| **res.end()** | End response |
| **http.get()** | Make GET request |
| **http.request()** | Make any HTTP request |

### When to Use Raw HTTP Module

- Learning how HTTP works
- Simple scripts or utilities
- Building custom frameworks
- Minimal dependencies requirement

### When to Use Frameworks (Express, Hono, etc.)

- Production applications
- Complex routing needs
- Middleware ecosystem
- Faster development

## What's Next?

In the next chapter, we'll explore [NPM & Packages](/guide/nodejs/08-npm) - how to manage dependencies and create your own packages.

---

[Next: NPM & Packages →](/guide/nodejs/08-npm)
