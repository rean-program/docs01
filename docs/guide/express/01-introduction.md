# Getting Started with Express.js

Express.js is a fast, unopinionated, minimalist web framework for Node.js. In this tutorial, you'll learn how to set up your first Express application.

## Installation

### Prerequisites

Make sure you have Node.js installed:

```bash
node --version  # Should be v14 or higher
npm --version
```

### Creating a New Project

```bash
# Create project directory
mkdir express-tutorial
cd express-tutorial

# Initialize package.json
npm init -y

# Install Express
npm install express
```

## Your First Express Server

Create a file called `index.js`:

```javascript
const express = require('express');
const app = express();
const port = 3000;

// Define a route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
```

Run your server:

```bash
node index.js
```

Visit `http://localhost:3000` in your browser to see "Hello World!".

## Understanding the Code

Let's break down what each part does:

### 1. Import Express

```javascript
const express = require('express');
```

This imports the Express module.

### 2. Create an Application

```javascript
const app = express();
```

This creates an Express application instance. The `app` object has methods for:
- Routing HTTP requests
- Configuring middleware
- Rendering HTML views
- Registering template engines

### 3. Define Routes

```javascript
app.get('/', (req, res) => {
  res.send('Hello World!');
});
```

- `app.get()` - Handles GET requests
- `'/'` - The URL path
- `req` - Request object (incoming data)
- `res` - Response object (outgoing data)
- `res.send()` - Sends a response to the client

### 4. Start Listening

```javascript
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
```

This starts the server on the specified port.

## HTTP Methods

Express provides methods for all HTTP verbs:

```javascript
// GET - Retrieve data
app.get('/users', (req, res) => {
  res.send('Get all users');
});

// POST - Create data
app.post('/users', (req, res) => {
  res.send('Create a user');
});

// PUT - Update data (full replacement)
app.put('/users/:id', (req, res) => {
  res.send('Update user');
});

// PATCH - Update data (partial)
app.patch('/users/:id', (req, res) => {
  res.send('Partial update');
});

// DELETE - Remove data
app.delete('/users/:id', (req, res) => {
  res.send('Delete user');
});
```

## Response Methods

Express provides several ways to send responses:

```javascript
// Send string
res.send('Hello');

// Send JSON
res.json({ message: 'Hello', status: 'success' });

// Send status code
res.sendStatus(200); // OK
res.sendStatus(404); // Not Found

// Send status with message
res.status(201).json({ message: 'Created' });

// Redirect
res.redirect('/login');

// Send file
res.sendFile('/path/to/file.pdf');

// Download file
res.download('/path/to/file.pdf');
```

## Using ES Modules

You can use modern ES module syntax:

```json
// package.json
{
  "type": "module"
}
```

```javascript
// index.js
import express from 'express';

const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
```

## Development with Nodemon

Nodemon automatically restarts your server when files change:

```bash
# Install nodemon
npm install --save-dev nodemon
```

Update `package.json`:

```json
{
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js"
  }
}
```

Now run with:

```bash
npm run dev
```

## Project Structure

For larger applications, organize your code:

```
express-tutorial/
├── node_modules/
├── src/
│   ├── routes/
│   │   └── index.js
│   ├── controllers/
│   │   └── userController.js
│   ├── middleware/
│   │   └── auth.js
│   └── app.js
├── package.json
└── index.js
```

## Environment Variables

Use environment variables for configuration:

```bash
npm install dotenv
```

Create `.env` file:

```env
PORT=3000
NODE_ENV=development
```

Load in your app:

```javascript
require('dotenv').config();

const port = process.env.PORT || 3000;
const env = process.env.NODE_ENV;

app.listen(port, () => {
  console.log(`Server running in ${env} mode on port ${port}`);
});
```

::: warning
Never commit `.env` files to version control. Add them to `.gitignore`.
:::

## Summary

In this tutorial, you learned:

- How to install Express.js
- Creating a basic server
- HTTP methods (GET, POST, PUT, DELETE)
- Different response methods
- Using ES modules
- Development workflow with nodemon
- Environment variables

Next, we'll explore [Routing](/guide/express/02-routing) in depth.
