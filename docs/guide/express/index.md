# Express.js Tutorial

::: info Official Documentation
This tutorial is based on the official Express.js documentation. For the most up-to-date information, visit: [https://expressjs.com/](https://expressjs.com/)
:::

Express.js is a minimal and flexible Node.js web application framework that provides a robust set of features for building web and mobile applications. It's the de facto standard for Node.js web development.

## What You'll Learn

This tutorial series covers Express.js from basics to advanced topics:

### Beginner
- **Getting Started** - Installation, first server, basic concepts
- **Routing** - Route methods, parameters, query strings
- **Middleware** - Built-in, third-party, and custom middleware

### Intermediate
- **Request & Response** - Handling data, headers, and responses
- **Template Engines** - Dynamic HTML with EJS, Pug, Handlebars
- **Static Files** - Serving CSS, JavaScript, and images

### Advanced
- **Error Handling** - Custom error handlers and best practices
- **Authentication** - Sessions, JWT, and Passport.js
- **Database Integration** - MongoDB, PostgreSQL, and ORMs
- **Deployment** - Production best practices and hosting

## Prerequisites

Before starting this tutorial, you should have:

- Basic knowledge of JavaScript
- Node.js installed on your machine
- Familiarity with npm (Node Package Manager)
- Understanding of HTTP concepts

## Why Express.js?

| Feature | Benefit |
|---------|---------|
| **Minimal** | Unopinionated, gives you freedom to structure your app |
| **Fast** | Thin layer on top of Node.js, minimal overhead |
| **Flexible** | Huge ecosystem of middleware and plugins |
| **Popular** | Large community, extensive documentation |
| **Battle-tested** | Powers millions of applications worldwide |

## Quick Start

```bash
# Create a new project
mkdir my-express-app
cd my-express-app
npm init -y

# Install Express
npm install express
```

```javascript
// index.js
const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
```

```bash
# Run the server
node index.js
```

## Express.js Ecosystem

Express works seamlessly with:

- **Database**: MongoDB, PostgreSQL, MySQL, SQLite
- **ORMs**: Mongoose, Sequelize, Prisma, TypeORM
- **Authentication**: Passport.js, JWT, OAuth
- **Validation**: Joi, express-validator, Zod
- **Template Engines**: EJS, Pug, Handlebars
- **API Documentation**: Swagger, OpenAPI

## Video Tutorials

::: tip Recommended Video Resources
Learn Express.js through these excellent video tutorials from the community.
:::

### Free Courses

| Course | Creator | Description |
|--------|---------|-------------|
| [Express.js Full Course](https://www.youtube.com/watch?v=SccSCuHhOw0) | freeCodeCamp | 8-hour comprehensive course |
| [Express.js Crash Course](https://www.youtube.com/watch?v=L72fhGm1tfE) | Traversy Media | 1.5-hour crash course |
| [Express Tutorial](https://www.youtube.com/watch?v=pKd0Rpw7O48) | Programming with Mosh | 1-hour REST API tutorial |
| [Express in 100 Seconds](https://www.youtube.com/watch?v=CsBPLiX6GjE) | Fireship | Quick 100-second explanation |

### Official Resources

| Resource | Description |
|----------|-------------|
| [Express.js Guide](https://expressjs.com/en/guide/routing.html) | Official Express.js guide |
| [Express.js API](https://expressjs.com/en/4x/api.html) | Official API documentation |

### Topic-Specific Videos

| Topic | Video | Duration |
|-------|-------|----------|
| Middleware | [Express Middleware](https://www.youtube.com/watch?v=lY6icfhap2o) | ~15 min |
| Authentication | [JWT Auth in Express](https://www.youtube.com/watch?v=mbsmsi7l3r4) | ~30 min |
| REST API | [Build REST API](https://www.youtube.com/watch?v=-MTSQjw5DrM) | ~45 min |
| MongoDB + Express | [MERN Stack](https://www.youtube.com/watch?v=7CqJlxBYj-M) | ~2 hours |

Ready to dive in? Start with [Getting Started](/guide/express/01-introduction) to build your first Express application!
