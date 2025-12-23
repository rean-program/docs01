# Web Storage

Web storage allows you to store data in the user's browser. This enables features like remembering preferences, caching data, and creating offline experiences.

## Storage Options Overview

| Storage Type | Capacity | Persistence | Accessible From |
|--------------|----------|-------------|-----------------|
| localStorage | ~5-10 MB | Permanent | Same origin |
| sessionStorage | ~5-10 MB | Tab session | Same origin/tab |
| Cookies | ~4 KB | Configurable | Server + client |
| IndexedDB | Large | Permanent | Same origin |

## localStorage

Stores data with no expiration. Data persists even after the browser is closed.

### Basic Operations

```javascript
// Store data
localStorage.setItem('username', 'john_doe');
localStorage.setItem('theme', 'dark');

// Retrieve data
const username = localStorage.getItem('username');
console.log(username); // 'john_doe'

// Remove specific item
localStorage.removeItem('username');

// Clear all data
localStorage.clear();

// Check number of items
console.log(localStorage.length);

// Get key by index
const firstKey = localStorage.key(0);
```

### Storing Objects

localStorage only stores strings. Use JSON for objects:

```javascript
// Store object
const user = {
    name: 'John Doe',
    email: 'john@example.com',
    preferences: {
        theme: 'dark',
        language: 'en'
    }
};

localStorage.setItem('user', JSON.stringify(user));

// Retrieve object
const storedUser = JSON.parse(localStorage.getItem('user'));
console.log(storedUser.name); // 'John Doe'

// Store array
const todos = ['Task 1', 'Task 2', 'Task 3'];
localStorage.setItem('todos', JSON.stringify(todos));

// Retrieve array
const storedTodos = JSON.parse(localStorage.getItem('todos'));
```

### Practical Examples

**Theme Preference:**
```javascript
// Save theme
function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
}

// Load saved theme on page load
function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
}

// Toggle theme
function toggleTheme() {
    const current = localStorage.getItem('theme') || 'light';
    setTheme(current === 'light' ? 'dark' : 'light');
}

// Initialize
loadTheme();
```

**Form Data Persistence:**
```javascript
const form = document.getElementById('myForm');

// Save form data as user types
form.addEventListener('input', (e) => {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    localStorage.setItem('formDraft', JSON.stringify(data));
});

// Restore form data on load
function restoreFormData() {
    const saved = localStorage.getItem('formDraft');
    if (saved) {
        const data = JSON.parse(saved);
        Object.keys(data).forEach(key => {
            const input = form.elements[key];
            if (input) input.value = data[key];
        });
    }
}

// Clear after successful submission
form.addEventListener('submit', () => {
    localStorage.removeItem('formDraft');
});
```

## sessionStorage

Same API as localStorage, but data only lasts for the session (tab).

```javascript
// Store session data
sessionStorage.setItem('pageViews', '1');

// Increment page views
let views = parseInt(sessionStorage.getItem('pageViews') || '0');
sessionStorage.setItem('pageViews', (views + 1).toString());

// Shopping cart for current session
const cart = { items: [], total: 0 };
sessionStorage.setItem('cart', JSON.stringify(cart));
```

### When to Use sessionStorage

- Temporary form data
- Multi-step wizards
- Shopping cart (if not persistent)
- One-time messages/alerts
- Session-specific preferences

## Cookies

Small pieces of data sent with every HTTP request.

### JavaScript Cookies

```javascript
// Set a cookie
document.cookie = 'username=john; expires=Fri, 31 Dec 2024 23:59:59 GMT; path=/';

// Set cookie with options
function setCookie(name, value, days) {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Strict`;
}

// Get a cookie
function getCookie(name) {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
        const [cookieName, cookieValue] = cookie.trim().split('=');
        if (cookieName === name) {
            return cookieValue;
        }
    }
    return null;
}

// Delete a cookie
function deleteCookie(name) {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
}

// Usage
setCookie('theme', 'dark', 365);
console.log(getCookie('theme')); // 'dark'
deleteCookie('theme');
```

### Cookie Options

| Option | Purpose |
|--------|---------|
| `expires` | Expiration date |
| `max-age` | Seconds until expiration |
| `path` | URL path scope |
| `domain` | Domain scope |
| `secure` | HTTPS only |
| `SameSite` | CSRF protection |
| `HttpOnly` | Server-only (can't set in JS) |

### When to Use Cookies

- Authentication tokens (HttpOnly)
- Server-side session IDs
- Tracking and analytics
- User preferences (small data)

## IndexedDB

A full database in the browser for large amounts of structured data.

### Basic Usage

```javascript
// Open database
const request = indexedDB.open('MyDatabase', 1);

// Create object store on upgrade
request.onupgradeneeded = (event) => {
    const db = event.target.result;
    const store = db.createObjectStore('users', { keyPath: 'id' });
    store.createIndex('email', 'email', { unique: true });
};

request.onsuccess = (event) => {
    const db = event.target.result;

    // Add data
    const transaction = db.transaction(['users'], 'readwrite');
    const store = transaction.objectStore('users');

    store.add({
        id: 1,
        name: 'John Doe',
        email: 'john@example.com'
    });

    // Read data
    const getRequest = store.get(1);
    getRequest.onsuccess = () => {
        console.log(getRequest.result);
    };
};

request.onerror = (event) => {
    console.error('Database error:', event.target.error);
};
```

### Simplified with idb Library

```javascript
import { openDB } from 'idb';

// Open database
const db = await openDB('MyDatabase', 1, {
    upgrade(db) {
        db.createObjectStore('users', { keyPath: 'id' });
    }
});

// Add data
await db.add('users', { id: 1, name: 'John' });

// Get data
const user = await db.get('users', 1);

// Get all
const allUsers = await db.getAll('users');

// Update
await db.put('users', { id: 1, name: 'John Doe' });

// Delete
await db.delete('users', 1);
```

### When to Use IndexedDB

- Offline applications
- Large datasets
- Complex data structures
- File/blob storage
- Caching API responses

## Storage Events

Listen for storage changes across tabs:

```javascript
// Fires when localStorage changes in another tab
window.addEventListener('storage', (event) => {
    console.log('Key:', event.key);
    console.log('Old value:', event.oldValue);
    console.log('New value:', event.newValue);
    console.log('URL:', event.url);

    // React to changes
    if (event.key === 'theme') {
        applyTheme(event.newValue);
    }
});
```

## Storage Wrapper Class

```javascript
class Storage {
    constructor(storage = localStorage) {
        this.storage = storage;
    }

    set(key, value, expiresIn = null) {
        const item = {
            value,
            timestamp: Date.now(),
            expiresIn
        };
        this.storage.setItem(key, JSON.stringify(item));
    }

    get(key) {
        const item = this.storage.getItem(key);
        if (!item) return null;

        const parsed = JSON.parse(item);

        // Check expiration
        if (parsed.expiresIn) {
            const elapsed = Date.now() - parsed.timestamp;
            if (elapsed > parsed.expiresIn) {
                this.remove(key);
                return null;
            }
        }

        return parsed.value;
    }

    remove(key) {
        this.storage.removeItem(key);
    }

    clear() {
        this.storage.clear();
    }

    has(key) {
        return this.get(key) !== null;
    }
}

// Usage
const store = new Storage();

// Store with 1 hour expiration
store.set('cache', { data: 'value' }, 60 * 60 * 1000);

// Get value (returns null if expired)
const cached = store.get('cache');
```

## Security Considerations

### What NOT to Store

```javascript
// ❌ Never store sensitive data
localStorage.setItem('password', 'secret123');
localStorage.setItem('creditCard', '1234-5678-9012-3456');
localStorage.setItem('ssn', '123-45-6789');

// ✅ Store non-sensitive preferences
localStorage.setItem('theme', 'dark');
localStorage.setItem('language', 'en');
```

### XSS Vulnerability

```javascript
// ❌ Vulnerable to XSS
const userData = localStorage.getItem('user');
document.innerHTML = userData; // If userData contains script, it executes

// ✅ Always sanitize
import DOMPurify from 'dompurify';
document.innerHTML = DOMPurify.sanitize(userData);
```

### Best Practices

- Don't store sensitive information
- Validate data when reading
- Set reasonable expiration times
- Handle storage quota errors
- Encrypt sensitive preferences

## Storage Quota

```javascript
// Check available storage
if (navigator.storage && navigator.storage.estimate) {
    const estimate = await navigator.storage.estimate();
    console.log(`Quota: ${estimate.quota}`);
    console.log(`Usage: ${estimate.usage}`);
    console.log(`Available: ${estimate.quota - estimate.usage}`);
}

// Handle quota exceeded
try {
    localStorage.setItem('largeData', hugeString);
} catch (e) {
    if (e.name === 'QuotaExceededError') {
        console.error('Storage quota exceeded');
        // Clear old data or notify user
    }
}
```

## Comparison Summary

| Feature | localStorage | sessionStorage | Cookies | IndexedDB |
|---------|--------------|----------------|---------|-----------|
| Capacity | ~5-10 MB | ~5-10 MB | ~4 KB | Large |
| Expiration | Never | Tab close | Configurable | Never |
| Sent to server | No | No | Yes | No |
| Sync/Async | Sync | Sync | Sync | Async |
| Data types | Strings | Strings | Strings | Any |

## Summary

- **localStorage**: Persistent key-value storage
- **sessionStorage**: Temporary session data
- **Cookies**: Small data sent to server
- **IndexedDB**: Large structured data
- Always sanitize data and handle errors
- Don't store sensitive information

## Next Steps

Learn about [Working with Forms](/guide/skills/forms) to handle user input effectively.
