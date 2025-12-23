# APIs & Data Fetching

APIs (Application Programming Interfaces) allow your frontend to communicate with servers and external services. Understanding how to fetch and work with data is essential for modern web development.

## What is an API?

An API is a set of rules that allows different software applications to communicate. Web APIs typically use HTTP requests to send and receive data.

```
Frontend (Browser)  ←→  API  ←→  Backend/Database
        │                              │
        └──── Request data ────────────┘
        └──── Receive response ────────┘
```

## REST APIs

REST (Representational State Transfer) is the most common API architecture.

### HTTP Methods

| Method | Purpose | Example |
|--------|---------|---------|
| `GET` | Read data | Get all users |
| `POST` | Create data | Create new user |
| `PUT` | Update (full) | Replace user data |
| `PATCH` | Update (partial) | Update user email |
| `DELETE` | Delete data | Remove user |

### URL Structure

```
https://api.example.com/v1/users/123?status=active
│        │              │  │    │   │
│        │              │  │    │   └── Query parameter
│        │              │  │    └── Resource ID
│        │              │  └── Resource
│        │              └── API version
│        └── Domain
└── Protocol
```

## Fetch API

The modern way to make HTTP requests in JavaScript.

### Basic GET Request

```javascript
// Simple fetch
fetch('https://api.example.com/users')
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));

// Using async/await (recommended)
async function getUsers() {
    try {
        const response = await fetch('https://api.example.com/users');

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const users = await response.json();
        console.log(users);
        return users;
    } catch (error) {
        console.error('Failed to fetch users:', error);
    }
}
```

### POST Request

```javascript
async function createUser(userData) {
    try {
        const response = await fetch('https://api.example.com/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const newUser = await response.json();
        return newUser;
    } catch (error) {
        console.error('Failed to create user:', error);
    }
}

// Usage
createUser({
    name: 'John Doe',
    email: 'john@example.com'
});
```

### PUT/PATCH Request

```javascript
async function updateUser(id, updates) {
    const response = await fetch(`https://api.example.com/users/${id}`, {
        method: 'PATCH',  // or 'PUT' for full replacement
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
    });

    return response.json();
}

// Usage
updateUser(123, { email: 'newemail@example.com' });
```

### DELETE Request

```javascript
async function deleteUser(id) {
    const response = await fetch(`https://api.example.com/users/${id}`, {
        method: 'DELETE',
    });

    if (response.ok) {
        console.log('User deleted successfully');
    }
}
```

## Request Headers

Headers provide additional information with requests.

```javascript
const response = await fetch('https://api.example.com/data', {
    headers: {
        // Content type
        'Content-Type': 'application/json',

        // Authentication
        'Authorization': 'Bearer your-token-here',

        // Custom headers
        'X-API-Key': 'your-api-key',

        // Accept specific format
        'Accept': 'application/json',
    },
});
```

### Common Headers

| Header | Purpose |
|--------|---------|
| `Content-Type` | Format of request body |
| `Accept` | Desired response format |
| `Authorization` | Authentication credentials |
| `X-API-Key` | API key authentication |
| `Cache-Control` | Caching behavior |

## Response Handling

### Response Object

```javascript
const response = await fetch(url);

// Response properties
console.log(response.status);     // 200, 404, 500, etc.
console.log(response.ok);         // true if status 200-299
console.log(response.statusText); // 'OK', 'Not Found', etc.
console.log(response.headers);    // Response headers

// Parse response body
const json = await response.json();   // Parse as JSON
const text = await response.text();   // Parse as text
const blob = await response.blob();   // Parse as binary
```

### HTTP Status Codes

| Code | Meaning |
|------|---------|
| `200` | OK - Success |
| `201` | Created - Resource created |
| `204` | No Content - Success, no body |
| `400` | Bad Request - Invalid data |
| `401` | Unauthorized - Auth required |
| `403` | Forbidden - No permission |
| `404` | Not Found - Resource missing |
| `500` | Server Error - Backend issue |

### Error Handling

```javascript
async function fetchWithErrorHandling(url) {
    try {
        const response = await fetch(url);

        // Check for HTTP errors
        if (!response.ok) {
            // Try to get error message from response
            const errorData = await response.json().catch(() => ({}));

            throw new Error(
                errorData.message || `HTTP ${response.status}: ${response.statusText}`
            );
        }

        return await response.json();
    } catch (error) {
        // Network errors or JSON parsing errors
        if (error.name === 'TypeError') {
            throw new Error('Network error - check your connection');
        }
        throw error;
    }
}
```

## Working with JSON

### Parsing JSON

```javascript
// Response to JavaScript object
const data = await response.json();

// String to JavaScript object
const obj = JSON.parse('{"name": "John"}');

// JavaScript object to string
const str = JSON.stringify({ name: 'John' });

// Pretty print
const pretty = JSON.stringify(obj, null, 2);
```

### Common JSON Patterns

```javascript
// Array of objects
const users = [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' }
];

// Nested objects
const user = {
    id: 1,
    name: 'Alice',
    address: {
        city: 'New York',
        country: 'USA'
    },
    tags: ['admin', 'active']
};
```

## Query Parameters

```javascript
// Manual construction
const url = 'https://api.example.com/users?page=1&limit=10&status=active';

// Using URLSearchParams
const params = new URLSearchParams({
    page: 1,
    limit: 10,
    status: 'active'
});
const url = `https://api.example.com/users?${params}`;

// Add/modify params
params.append('sort', 'name');
params.set('page', 2);
params.delete('status');
```

## Authentication

### API Key

```javascript
// In header
fetch(url, {
    headers: {
        'X-API-Key': 'your-api-key'
    }
});

// In query parameter
fetch(`${url}?api_key=your-api-key`);
```

### Bearer Token (JWT)

```javascript
const token = localStorage.getItem('authToken');

fetch(url, {
    headers: {
        'Authorization': `Bearer ${token}`
    }
});
```

### Basic Authentication

```javascript
const username = 'user';
const password = 'pass';
const encoded = btoa(`${username}:${password}`);

fetch(url, {
    headers: {
        'Authorization': `Basic ${encoded}`
    }
});
```

## CORS (Cross-Origin Resource Sharing)

CORS is a security feature that restricts cross-origin requests.

### Common CORS Error

```
Access to fetch at 'https://api.example.com' from origin
'http://localhost:3000' has been blocked by CORS policy
```

### Solutions

1. **Server-side fix** (best): Configure server to allow your origin
2. **Proxy in development**: Route requests through your dev server
3. **CORS proxy** (temporary): Use a proxy service

```javascript
// Vite proxy configuration (vite.config.js)
export default {
    server: {
        proxy: {
            '/api': {
                target: 'https://api.example.com',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, '')
            }
        }
    }
}
```

## Practical Examples

### Fetching and Displaying Data

```javascript
async function loadUsers() {
    const container = document.getElementById('users');
    container.innerHTML = '<p>Loading...</p>';

    try {
        const response = await fetch('https://api.example.com/users');
        const users = await response.json();

        container.innerHTML = users.map(user => `
            <div class="user-card">
                <h3>${user.name}</h3>
                <p>${user.email}</p>
            </div>
        `).join('');
    } catch (error) {
        container.innerHTML = `<p class="error">Failed to load users</p>`;
    }
}
```

### Form Submission

```javascript
const form = document.getElementById('contactForm');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    try {
        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            alert('Message sent!');
            form.reset();
        } else {
            throw new Error('Failed to send');
        }
    } catch (error) {
        alert('Error: ' + error.message);
    }
});
```

### Search with Debouncing

```javascript
let debounceTimer;

async function search(query) {
    clearTimeout(debounceTimer);

    debounceTimer = setTimeout(async () => {
        if (query.length < 2) return;

        const response = await fetch(
            `/api/search?q=${encodeURIComponent(query)}`
        );
        const results = await response.json();

        displayResults(results);
    }, 300); // Wait 300ms after last keystroke
}

document.getElementById('searchInput')
    .addEventListener('input', (e) => search(e.target.value));
```

## Free Practice APIs

| API | URL | Description |
|-----|-----|-------------|
| JSONPlaceholder | jsonplaceholder.typicode.com | Fake data for testing |
| PokeAPI | pokeapi.co | Pokemon data |
| OpenWeather | openweathermap.org | Weather data |
| REST Countries | restcountries.com | Country information |
| The Dog API | thedogapi.com | Dog images and breeds |

```javascript
// JSONPlaceholder example
const posts = await fetch('https://jsonplaceholder.typicode.com/posts')
    .then(res => res.json());
```

## Summary

- APIs allow frontend and backend communication
- Use `fetch()` with async/await for requests
- Always handle errors gracefully
- Set appropriate headers for authentication
- Parse JSON responses correctly
- Be aware of CORS restrictions
- Practice with free public APIs

## Next Steps

Learn about [Package Managers](/guide/environment/package-managers) to manage your project dependencies.
