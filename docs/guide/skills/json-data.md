# JSON & Data Formats

JSON (JavaScript Object Notation) is the most common data format for web applications. Understanding how to work with JSON and other data formats is essential for modern web development.

## What is JSON?

JSON is a lightweight text format for storing and transporting data. It's human-readable and easy to parse.

```json
{
    "name": "John Doe",
    "age": 30,
    "email": "john@example.com",
    "isActive": true,
    "address": {
        "street": "123 Main St",
        "city": "New York"
    },
    "hobbies": ["reading", "coding", "gaming"]
}
```

## JSON Syntax Rules

### Data Types

| Type | Example |
|------|---------|
| String | `"hello"` |
| Number | `42`, `3.14`, `-10` |
| Boolean | `true`, `false` |
| Null | `null` |
| Object | `{ "key": "value" }` |
| Array | `[1, 2, 3]` |

### Syntax Rules

```json
{
    "strings": "Must use double quotes",
    "numbers": 42,
    "decimals": 3.14159,
    "negative": -10,
    "boolean": true,
    "nullValue": null,
    "array": [1, 2, 3],
    "nested": {
        "object": "value"
    }
}
```

**Important:**
- Keys must be strings in double quotes
- No trailing commas
- No comments allowed
- No single quotes
- No undefined values

```javascript
// ❌ Invalid JSON
{
    name: "John",           // Keys need quotes
    'age': 30,              // Single quotes not allowed
    "active": true,         // Trailing comma
    // comment              // Comments not allowed
}

// ✅ Valid JSON
{
    "name": "John",
    "age": 30,
    "active": true
}
```

## JSON in JavaScript

### JSON.stringify()

Convert JavaScript objects to JSON strings:

```javascript
const user = {
    name: 'John Doe',
    age: 30,
    hobbies: ['reading', 'coding']
};

// Basic conversion
const json = JSON.stringify(user);
// '{"name":"John Doe","age":30,"hobbies":["reading","coding"]}'

// Pretty print with indentation
const prettyJson = JSON.stringify(user, null, 2);
/*
{
  "name": "John Doe",
  "age": 30,
  "hobbies": [
    "reading",
    "coding"
  ]
}
*/

// With replacer function (filter/transform)
const filtered = JSON.stringify(user, (key, value) => {
    if (key === 'age') return undefined; // Exclude age
    return value;
});
// '{"name":"John Doe","hobbies":["reading","coding"]}'

// With replacer array (whitelist)
const partial = JSON.stringify(user, ['name', 'age']);
// '{"name":"John Doe","age":30}'
```

### JSON.parse()

Convert JSON strings to JavaScript objects:

```javascript
const json = '{"name":"John","age":30}';

// Basic parsing
const user = JSON.parse(json);
console.log(user.name); // 'John'

// With reviver function (transform values)
const data = JSON.parse(json, (key, value) => {
    if (key === 'age') return value + 1;
    return value;
});
console.log(data.age); // 31

// Parse dates
const jsonWithDate = '{"created":"2024-01-15T10:30:00Z"}';
const parsed = JSON.parse(jsonWithDate, (key, value) => {
    if (key === 'created') return new Date(value);
    return value;
});
console.log(parsed.created instanceof Date); // true
```

### Error Handling

```javascript
function safeJSONParse(text, fallback = null) {
    try {
        return JSON.parse(text);
    } catch (error) {
        console.error('JSON parse error:', error.message);
        return fallback;
    }
}

// Usage
const data = safeJSONParse('invalid json', {});
const config = safeJSONParse(localStorage.getItem('config'), { theme: 'light' });
```

## Working with APIs

### Fetching JSON

```javascript
async function fetchData() {
    try {
        const response = await fetch('https://api.example.com/users');

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
}
```

### Sending JSON

```javascript
async function createUser(userData) {
    const response = await fetch('https://api.example.com/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    });

    return response.json();
}

// Usage
createUser({
    name: 'John Doe',
    email: 'john@example.com'
});
```

## Common JSON Patterns

### Nested Objects

```javascript
const company = {
    name: 'Tech Corp',
    employees: [
        {
            id: 1,
            name: 'Alice',
            department: {
                name: 'Engineering',
                floor: 3
            }
        },
        {
            id: 2,
            name: 'Bob',
            department: {
                name: 'Design',
                floor: 2
            }
        }
    ]
};

// Accessing nested data
const aliceDept = company.employees[0].department.name;

// Safe access with optional chaining
const floor = company.employees?.[0]?.department?.floor;
```

### Transforming Data

```javascript
// API response
const apiResponse = {
    users: [
        { id: 1, first_name: 'John', last_name: 'Doe' },
        { id: 2, first_name: 'Jane', last_name: 'Smith' }
    ]
};

// Transform to desired format
const users = apiResponse.users.map(user => ({
    id: user.id,
    fullName: `${user.first_name} ${user.last_name}`,
    displayName: user.first_name
}));
```

### Deep Cloning

```javascript
// Simple deep clone (limitations: no functions, dates, etc.)
const clone = JSON.parse(JSON.stringify(original));

// Better: structuredClone (modern browsers)
const deepClone = structuredClone(original);
```

## Other Data Formats

### CSV (Comma-Separated Values)

```javascript
// Parse CSV
function parseCSV(csv) {
    const lines = csv.trim().split('\n');
    const headers = lines[0].split(',');

    return lines.slice(1).map(line => {
        const values = line.split(',');
        return headers.reduce((obj, header, i) => {
            obj[header.trim()] = values[i]?.trim();
            return obj;
        }, {});
    });
}

const csv = `name,age,city
John,30,New York
Jane,25,Los Angeles`;

const data = parseCSV(csv);
// [{ name: 'John', age: '30', city: 'New York' }, ...]

// Convert to CSV
function toCSV(data) {
    if (!data.length) return '';

    const headers = Object.keys(data[0]);
    const rows = data.map(obj =>
        headers.map(h => obj[h]).join(',')
    );

    return [headers.join(','), ...rows].join('\n');
}
```

### XML

```javascript
// Parse XML
const xmlString = `
<users>
    <user id="1">
        <name>John</name>
        <email>john@example.com</email>
    </user>
</users>
`;

const parser = new DOMParser();
const xmlDoc = parser.parseFromString(xmlString, 'text/xml');

// Access data
const name = xmlDoc.querySelector('user name').textContent;
const userId = xmlDoc.querySelector('user').getAttribute('id');

// Convert XML to JSON
function xmlToJson(xml) {
    const users = xml.querySelectorAll('user');
    return Array.from(users).map(user => ({
        id: user.getAttribute('id'),
        name: user.querySelector('name').textContent,
        email: user.querySelector('email').textContent
    }));
}
```

### FormData

```javascript
// From form element
const form = document.getElementById('myForm');
const formData = new FormData(form);

// Manual creation
const data = new FormData();
data.append('name', 'John');
data.append('file', fileInput.files[0]);

// Convert to object
const obj = Object.fromEntries(formData);

// Convert to JSON
const json = JSON.stringify(Object.fromEntries(formData));
```

### URL Search Params

```javascript
// Parse query string
const params = new URLSearchParams('name=John&age=30');
console.log(params.get('name')); // 'John'

// Build query string
const searchParams = new URLSearchParams({
    query: 'javascript',
    page: 1,
    limit: 10
});
console.log(searchParams.toString());
// 'query=javascript&page=1&limit=10'

// Append to URL
const url = new URL('https://api.example.com/search');
url.search = searchParams;
console.log(url.href);
// 'https://api.example.com/search?query=javascript&page=1&limit=10'
```

## Data Validation

### Type Checking

```javascript
function validateUser(data) {
    const errors = [];

    if (typeof data.name !== 'string' || data.name.length < 1) {
        errors.push('Name is required');
    }

    if (typeof data.age !== 'number' || data.age < 0) {
        errors.push('Age must be a positive number');
    }

    if (!Array.isArray(data.hobbies)) {
        errors.push('Hobbies must be an array');
    }

    return {
        valid: errors.length === 0,
        errors
    };
}
```

### Schema Validation

```javascript
// Simple schema validation
const userSchema = {
    name: { type: 'string', required: true, minLength: 2 },
    email: { type: 'string', required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
    age: { type: 'number', min: 0, max: 150 }
};

function validate(data, schema) {
    const errors = {};

    for (const [field, rules] of Object.entries(schema)) {
        const value = data[field];

        if (rules.required && (value === undefined || value === '')) {
            errors[field] = `${field} is required`;
            continue;
        }

        if (value !== undefined) {
            if (rules.type && typeof value !== rules.type) {
                errors[field] = `${field} must be a ${rules.type}`;
            }

            if (rules.minLength && value.length < rules.minLength) {
                errors[field] = `${field} must be at least ${rules.minLength} characters`;
            }

            if (rules.pattern && !rules.pattern.test(value)) {
                errors[field] = `${field} format is invalid`;
            }

            if (rules.min !== undefined && value < rules.min) {
                errors[field] = `${field} must be at least ${rules.min}`;
            }
        }
    }

    return {
        valid: Object.keys(errors).length === 0,
        errors
    };
}
```

## JSON Configuration Files

### package.json

```json
{
    "name": "my-project",
    "version": "1.0.0",
    "scripts": {
        "start": "node index.js",
        "dev": "nodemon index.js"
    },
    "dependencies": {
        "express": "^4.18.2"
    }
}
```

### tsconfig.json

```json
{
    "compilerOptions": {
        "target": "ES2020",
        "module": "commonjs",
        "strict": true
    },
    "include": ["src/**/*"]
}
```

### .prettierrc

```json
{
    "semi": true,
    "singleQuote": true,
    "tabWidth": 2
}
```

## Summary

- JSON is the standard data format for web APIs
- Use `JSON.stringify()` to convert to JSON
- Use `JSON.parse()` to convert from JSON
- Always handle parsing errors
- Validate data before using it
- Know when to use other formats (CSV, XML, FormData)

## Next Steps

Learn about [Regular Expressions](/guide/skills/regex) to validate and manipulate string data.
