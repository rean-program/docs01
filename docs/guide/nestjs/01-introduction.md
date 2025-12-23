# Introduction to NestJS

NestJS is a framework for building efficient, scalable Node.js server-side applications. Think of it as "Angular for the backend" - it brings structure, organization, and best practices to your server-side code!

## What is NestJS?

NestJS is built on top of Express (or optionally Fastify) and provides an out-of-the-box application architecture that enables developers to create highly testable, scalable, loosely coupled, and easily maintainable applications.

```
┌─────────────────────────────────────────────────────────┐
│                     Your NestJS App                      │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │   Module    │  │   Module    │  │   Module    │     │
│  │  ┌───────┐  │  │  ┌───────┐  │  │  ┌───────┐  │     │
│  │  │Control│  │  │  │Control│  │  │  │Control│  │     │
│  │  └───────┘  │  │  └───────┘  │  │  └───────┘  │     │
│  │  ┌───────┐  │  │  ┌───────┐  │  │  ┌───────┐  │     │
│  │  │Service│  │  │  │Service│  │  │  │Service│  │     │
│  │  └───────┘  │  │  └───────┘  │  │  └───────┘  │     │
│  └─────────────┘  └─────────────┘  └─────────────┘     │
├─────────────────────────────────────────────────────────┤
│              Express / Fastify (HTTP Layer)              │
└─────────────────────────────────────────────────────────┘
```

### Why Choose NestJS?

| Feature | Express | NestJS | Benefit |
|---------|---------|--------|---------|
| Structure | You decide | Built-in | Less decision fatigue |
| TypeScript | Manual setup | Native | Type safety from start |
| Testing | Manual setup | Built-in | Easy to test |
| Documentation | Varies | Swagger built-in | Auto-generated APIs |
| Learning Curve | Easy | Moderate | Enterprise-ready patterns |

### Key Features

- **TypeScript Support** - First-class TypeScript support with full type safety
- **Modular Architecture** - Organize code into reusable, self-contained modules
- **Dependency Injection** - Built-in IoC container for managing dependencies
- **Decorators** - Use decorators for clean, declarative code
- **Platform Agnostic** - Works with Express or Fastify under the hood
- **Extensive Ecosystem** - Rich set of official and community packages

### NestJS vs Express: Code Comparison

**Express (unstructured):**
```typescript
// Everything in one file, no organization
const express = require('express');
const app = express();

let users = [];

app.get('/users', (req, res) => {
    res.json(users);
});

app.post('/users', (req, res) => {
    users.push(req.body);
    res.json(req.body);
});

app.listen(3000);
```

**NestJS (structured):**
```typescript
// Organized into Controllers, Services, and Modules
@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {}

    @Get()
    findAll() {
        return this.usersService.findAll();
    }

    @Post()
    create(@Body() user: CreateUserDto) {
        return this.usersService.create(user);
    }
}
```

## Installation

### Prerequisites

Before installing NestJS, make sure you have:

```bash
# Check Node.js version (v16+ required)
node --version

# Check npm version
npm --version
```

### Installing the CLI

The NestJS CLI is a command-line tool that helps you initialize, develop, and maintain your NestJS applications.

```bash
# Install NestJS CLI globally
npm install -g @nestjs/cli

# Verify installation
nest --version
```

### Creating a New Project

```bash
# Create a new project
nest new my-first-nestjs-app

# You'll be prompted to choose a package manager:
# ? Which package manager would you ❤️  to use?
#   npm
#   yarn
#   pnpm
```

The CLI will create a new directory with the following structure:

```
my-first-nestjs-app/
├── src/
│   ├── app.controller.spec.ts
│   ├── app.controller.ts
│   ├── app.module.ts
│   ├── app.service.ts
│   └── main.ts
├── test/
│   ├── app.e2e-spec.ts
│   └── jest-e2e.json
├── .eslintrc.js
├── .prettierrc
├── nest-cli.json
├── package.json
├── tsconfig.build.json
└── tsconfig.json
```

## Understanding the Project Structure

```
my-first-nestjs-app/
├── src/
│   ├── main.ts              ← Entry point (starts the server)
│   ├── app.module.ts        ← Root module (ties everything together)
│   ├── app.controller.ts    ← Handles HTTP requests
│   ├── app.service.ts       ← Business logic
│   └── app.controller.spec.ts ← Tests
├── test/                    ← E2E tests
├── package.json             ← Dependencies
└── tsconfig.json            ← TypeScript config
```

### The Three Core Concepts

```
┌──────────────────────────────────────────────────────────────┐
│                         MODULE                                │
│  ┌────────────────────────────────────────────────────────┐  │
│  │                                                        │  │
│  │   ┌─────────────┐         ┌─────────────────────┐     │  │
│  │   │ CONTROLLER  │ ──────► │      SERVICE        │     │  │
│  │   │             │         │                     │     │  │
│  │   │ • Routes    │         │ • Business Logic    │     │  │
│  │   │ • HTTP      │         │ • Database Access   │     │  │
│  │   │ • Validation│         │ • External APIs     │     │  │
│  │   └─────────────┘         └─────────────────────┘     │  │
│  │                                                        │  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
```

| Concept | Responsibility | Example |
|---------|----------------|---------|
| **Module** | Groups related code | `UsersModule` contains all user-related code |
| **Controller** | Handles HTTP requests | `GET /users` → `UsersController.findAll()` |
| **Service** | Business logic | Database queries, calculations, API calls |

### Entry Point: main.ts

The `main.ts` file is the entry point of your application. It uses `NestFactory` to create a Nest application instance.

```typescript
// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
    // Create the application instance
    const app = await NestFactory.create(AppModule);
    //           ↑ NestFactory creates an app from your root module

    // Start listening on port 3000
    await app.listen(3000);
    //        ↑ Opens port 3000 for HTTP requests

    console.log('Application is running on: http://localhost:3000');
}
bootstrap();  // ← Call the function to start everything
```

**What happens when the app starts:**
```
1. bootstrap() is called
        ↓
2. NestFactory.create(AppModule) - Creates app instance
        ↓
3. NestJS scans AppModule for controllers and providers
        ↓
4. Dependencies are injected (DI container)
        ↓
5. app.listen(3000) - Server starts accepting requests
        ↓
6. Ready! http://localhost:3000
```

**Key Points:**
- `NestFactory.create()` creates an application instance
- `AppModule` is the root module of the application
- `app.listen()` starts the HTTP server

### Root Module: app.module.ts

The `AppModule` is the root module that ties everything together.

```typescript
// src/app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
    imports: [],                   // Other modules this module depends on
    controllers: [AppController],  // Controllers in this module
    providers: [AppService],       // Services/providers in this module
})
export class AppModule {}
```

**Breaking it down:**
```typescript
@Module({
    imports: [],
    //  ↑ Import other modules here
    //    Example: imports: [UsersModule, ProductsModule]

    controllers: [AppController],
    //            ↑ Register controllers that handle HTTP requests

    providers: [AppService],
    //          ↑ Register services that contain business logic
})
export class AppModule {}
//           ↑ The class itself can be empty - the decorator does the work!
```

### Controller: app.controller.ts

Controllers handle incoming requests and return responses.

```typescript
// src/app.controller.ts
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()  // Base route: '/'
export class AppController {
    // Dependency injection - AppService is automatically injected
    constructor(private readonly appService: AppService) {}
    //          ↑ NestJS automatically creates and injects AppService

    @Get()  // HTTP GET request to '/'
    getHello(): string {
        return this.appService.getHello();
        //     ↑ Calls the service method
    }
}
```

**How the request flows:**
```
Browser: GET http://localhost:3000/
                    ↓
        @Controller() matches '/'
                    ↓
        @Get() matches GET method
                    ↓
        getHello() is called
                    ↓
        appService.getHello() returns 'Hello World!'
                    ↓
Browser receives: 'Hello World!'
```

### Service: app.service.ts

Services contain business logic and can be injected into controllers.

```typescript
// src/app.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()  // Marks this class as a provider
//  ↑ This decorator tells NestJS: "This class can be injected"
export class AppService {
    getHello(): string {
        return 'Hello World!';
    }
}
```

**Why separate Controller and Service?**

| Controller | Service |
|------------|---------|
| Handles HTTP specifics | Contains business logic |
| Validates input | Accesses database |
| Returns responses | Calls external APIs |
| Thin layer | Where the real work happens |

```typescript
// Bad: Business logic in controller ❌
@Controller('users')
export class UsersController {
    @Get()
    async getUsers() {
        // Connecting to database in controller - bad practice!
        const users = await db.query('SELECT * FROM users');
        return users;
    }
}

// Good: Business logic in service ✅
@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {}

    @Get()
    async getUsers() {
        return this.usersService.findAll();  // Delegate to service
    }
}
```

## Running the Application

### Development Mode

```bash
# Navigate to project directory
cd my-first-nestjs-app

# Start in development mode (with hot reload)
npm run start:dev
```

You should see output like:

```
[Nest] 12345  - 01/01/2024, 12:00:00 PM     LOG [NestFactory] Starting Nest application...
[Nest] 12345  - 01/01/2024, 12:00:00 PM     LOG [InstanceLoader] AppModule dependencies initialized
[Nest] 12345  - 01/01/2024, 12:00:00 PM     LOG [RoutesResolver] AppController {/}: +3ms
[Nest] 12345  - 01/01/2024, 12:00:00 PM     LOG [RouterExplorer] Mapped {/, GET} route +1ms
[Nest] 12345  - 01/01/2024, 12:00:00 PM     LOG [NestApplication] Nest application successfully started
```

### Testing the Endpoint

Open your browser or use curl:

```bash
curl http://localhost:3000
# Output: Hello World!
```

### Available Scripts

```bash
# Development with hot reload
npm run start:dev

# Production mode
npm run start:prod

# Debug mode
npm run start:debug

# Run unit tests
npm run test

# Run e2e tests
npm run test:e2e

# Run tests with coverage
npm run test:cov

# Lint the code
npm run lint
```

## Creating Your First Custom Endpoint

Let's create a simple greeting endpoint that accepts a name parameter.

### Step 1: Update the Service

```typescript
// src/app.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
    getHello(): string {
        return 'Hello World!';
    }

    // Add a new method
    getGreeting(name: string): string {
        return `Hello, ${name}! Welcome to NestJS.`;
    }
}
```

### Step 2: Update the Controller

```typescript
// src/app.controller.ts
import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get()
    getHello(): string {
        return this.appService.getHello();
    }

    // Add a new route with a parameter
    @Get('greet/:name')
    getGreeting(@Param('name') name: string): string {
        return this.appService.getGreeting(name);
    }
}
```

### Step 3: Test the New Endpoint

```bash
curl http://localhost:3000/greet/John
# Output: Hello, John! Welcome to NestJS.
```

## Understanding Decorators

Decorators are special functions that add metadata to classes, methods, or parameters. NestJS reads this metadata to understand how to wire everything together.

```
┌─────────────────────────────────────────────────────────┐
│                    DECORATORS                           │
├─────────────────────────────────────────────────────────┤
│  @Controller('users')                                   │
│      ↓ tells NestJS: "This handles /users routes"       │
│                                                         │
│  @Get(':id')                                            │
│      ↓ tells NestJS: "This handles GET requests"        │
│                                                         │
│  @Param('id')                                           │
│      ↓ tells NestJS: "Extract 'id' from URL"            │
└─────────────────────────────────────────────────────────┘
```

### Class Decorators

```typescript
@Controller('users')   // Defines a controller with base route '/users'
@Module({...})         // Defines a module
@Injectable()          // Marks a class as injectable (service/provider)
```

**Examples:**
```typescript
@Controller('products')  // Route: /products
export class ProductsController {}

@Controller('api/v1/users')  // Route: /api/v1/users
export class UsersController {}

@Controller()  // Route: / (root)
export class AppController {}
```

### Method Decorators

```typescript
@Get()          // HTTP GET
@Post()         // HTTP POST
@Put()          // HTTP PUT
@Patch()        // HTTP PATCH
@Delete()       // HTTP DELETE
@All()          // All HTTP methods
```

**Complete Example:**
```typescript
@Controller('products')
export class ProductsController {
    @Get()              // GET /products
    findAll() {}

    @Get(':id')         // GET /products/123
    findOne() {}

    @Post()             // POST /products
    create() {}

    @Put(':id')         // PUT /products/123
    update() {}

    @Patch(':id')       // PATCH /products/123
    partialUpdate() {}

    @Delete(':id')      // DELETE /products/123
    remove() {}
}
```

| HTTP Method | Decorator | Use Case | Example |
|-------------|-----------|----------|---------|
| GET | `@Get()` | Read data | Get all users |
| GET | `@Get(':id')` | Read one item | Get user by ID |
| POST | `@Post()` | Create new data | Create new user |
| PUT | `@Put(':id')` | Replace entire resource | Update all user fields |
| PATCH | `@Patch(':id')` | Update partially | Update just email |
| DELETE | `@Delete(':id')` | Remove data | Delete a user |

### Parameter Decorators

```typescript
@Param('id')    // Route parameter
@Query('name')  // Query string parameter
@Body()         // Request body
@Headers()      // Request headers
@Req()          // Request object
@Res()          // Response object
```

**Detailed Examples:**

```typescript
@Controller('users')
export class UsersController {
    // URL: GET /users/123
    @Get(':id')
    findOne(@Param('id') id: string) {
        // id = '123'
        return `User ${id}`;
    }

    // URL: GET /users?page=2&limit=10
    @Get()
    findAll(
        @Query('page') page: string,    // page = '2'
        @Query('limit') limit: string,  // limit = '10'
    ) {
        return `Page ${page}, Limit ${limit}`;
    }

    // URL: POST /users with body: { "name": "John", "email": "john@test.com" }
    @Post()
    create(@Body() body: any) {
        // body = { name: 'John', email: 'john@test.com' }
        return body;
    }

    // Get specific field from body
    @Post('quick')
    quickCreate(@Body('name') name: string) {
        // name = 'John'
        return `Created ${name}`;
    }

    // Get a header value
    @Get('auth')
    checkAuth(@Headers('authorization') auth: string) {
        // auth = 'Bearer abc123...'
        return `Token: ${auth}`;
    }
}
```

**Quick Reference Table:**

| Decorator | Source | Example URL/Data | Extracted Value |
|-----------|--------|------------------|-----------------|
| `@Param('id')` | URL path | `/users/123` | `'123'` |
| `@Query('page')` | Query string | `/users?page=2` | `'2'` |
| `@Body()` | Request body | `{ "name": "John" }` | `{ name: 'John' }` |
| `@Body('name')` | Body field | `{ "name": "John" }` | `'John'` |
| `@Headers('auth')` | HTTP header | `Authorization: Bearer x` | `'Bearer x'` |

## Configuration Best Practices

### Adding a Port Configuration

```typescript
// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Use environment variable or default to 3000
    const port = process.env.PORT || 3000;

    await app.listen(port);
    console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();
```

### Enabling CORS

```typescript
// src/main.ts
async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Enable CORS
    app.enableCors();

    // Or with options
    app.enableCors({
        origin: 'http://localhost:4200',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
    });

    await app.listen(3000);
}
bootstrap();
```

### Setting a Global Prefix

```typescript
// src/main.ts
async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // All routes will be prefixed with /api
    app.setGlobalPrefix('api');

    await app.listen(3000);
}
bootstrap();
```

Now your routes would be:
- `http://localhost:3000/api`
- `http://localhost:3000/api/greet/John`

## NestJS CLI Commands

The CLI provides helpful commands for generating code:

```bash
# Generate a new module
nest generate module users
# Shorthand: nest g mo users

# Generate a new controller
nest generate controller users
# Shorthand: nest g co users

# Generate a new service
nest generate service users
# Shorthand: nest g s users

# Generate a complete CRUD resource
nest generate resource products
# Shorthand: nest g res products

# Generate a guard
nest g guard auth

# Generate a middleware
nest g mi logger

# Generate a pipe
nest g pi validation

# Generate an interceptor
nest g in transform
```

**CLI Commands Quick Reference:**

| Command | Shorthand | What It Creates |
|---------|-----------|-----------------|
| `nest g module users` | `nest g mo users` | A new module |
| `nest g controller users` | `nest g co users` | A new controller |
| `nest g service users` | `nest g s users` | A new service |
| `nest g resource users` | `nest g res users` | Full CRUD (module + controller + service) |
| `nest g guard auth` | `nest g gu auth` | An authentication guard |
| `nest g middleware logger` | `nest g mi logger` | A middleware |
| `nest g pipe validation` | `nest g pi validation` | A validation pipe |
| `nest g interceptor transform` | `nest g in transform` | An interceptor |

::: tip Generator Options
Add `--no-spec` to skip generating test files:
```bash
nest g co users --no-spec
```

Add `--flat` to avoid creating a subfolder:
```bash
nest g co users --flat  # Creates in current directory
```
:::

## Exercise: Create a Simple API

Let's practice by creating a simple tasks API.

### Step 1: Generate the Resource

```bash
nest g mo tasks
nest g co tasks
nest g s tasks
```

### Step 2: Define the Service

```typescript
// src/tasks/tasks.service.ts
import { Injectable } from '@nestjs/common';

export interface Task {
    id: number;
    title: string;
    completed: boolean;
}

@Injectable()
export class TasksService {
    private tasks: Task[] = [
        { id: 1, title: 'Learn NestJS', completed: false },
        { id: 2, title: 'Build an API', completed: false },
    ];

    findAll(): Task[] {
        return this.tasks;
    }

    findOne(id: number): Task | undefined {
        return this.tasks.find(task => task.id === id);
    }

    create(title: string): Task {
        const newTask: Task = {
            id: this.tasks.length + 1,
            title,
            completed: false,
        };
        this.tasks.push(newTask);
        return newTask;
    }
}
```

### Step 3: Define the Controller

```typescript
// src/tasks/tasks.controller.ts
import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { TasksService, Task } from './tasks.service';

@Controller('tasks')
export class TasksController {
    constructor(private readonly tasksService: TasksService) {}

    @Get()
    findAll(): Task[] {
        return this.tasksService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string): Task | undefined {
        return this.tasksService.findOne(parseInt(id));
    }

    @Post()
    create(@Body('title') title: string): Task {
        return this.tasksService.create(title);
    }
}
```

### Step 4: Update the Module

```typescript
// src/tasks/tasks.module.ts
import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

@Module({
    controllers: [TasksController],
    providers: [TasksService],
})
export class TasksModule {}
```

### Step 5: Import in App Module

```typescript
// src/app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TasksModule } from './tasks/tasks.module';

@Module({
    imports: [TasksModule],  // Add TasksModule here
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
```

### Step 6: Test the API

```bash
# Get all tasks
curl http://localhost:3000/tasks

# Get a specific task
curl http://localhost:3000/tasks/1

# Create a new task
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Learn Decorators"}'
```

**Expected Results:**

| Request | Response |
|---------|----------|
| `GET /tasks` | `[{"id":1,"title":"Learn NestJS","completed":false},{"id":2,"title":"Build an API","completed":false}]` |
| `GET /tasks/1` | `{"id":1,"title":"Learn NestJS","completed":false}` |
| `POST /tasks` with `{"title":"New task"}` | `{"id":3,"title":"New task","completed":false}` |
| `GET /tasks/999` | `undefined` (we'll fix this with proper error handling later) |

## Dependency Injection Explained

One of the most powerful features of NestJS is **Dependency Injection (DI)**. Let's understand it with a simple example:

### Without Dependency Injection (Bad)

```typescript
// You manually create instances - hard to test!
class UsersController {
    private usersService: UsersService;

    constructor() {
        this.usersService = new UsersService();  // ❌ Tightly coupled
        // What if UsersService needs a database connection?
        // You'd have to create that too!
    }
}
```

### With Dependency Injection (Good)

```typescript
// NestJS creates and injects dependencies for you
@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {}
    //          ↑ NestJS automatically creates and injects this ✅
}
```

**Why is DI better?**

```
┌─────────────────────────────────────────────────────────────┐
│                     WITHOUT DI                               │
├─────────────────────────────────────────────────────────────┤
│  Controller                                                  │
│      └── creates → Service                                   │
│                       └── creates → Database                 │
│                                       └── creates → Config   │
│                                                              │
│  Problem: Controller knows how to create EVERYTHING          │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                       WITH DI                                │
├─────────────────────────────────────────────────────────────┤
│  NestJS IoC Container                                        │
│      │                                                       │
│      ├── creates → Config                                    │
│      ├── creates → Database (using Config)                   │
│      ├── creates → Service (using Database)                  │
│      └── creates → Controller (using Service)                │
│                                                              │
│  Benefit: Each class only knows what IT needs                │
└─────────────────────────────────────────────────────────────┘
```

| Without DI | With DI |
|------------|---------|
| Hard to test | Easy to mock dependencies |
| Tightly coupled | Loosely coupled |
| Manual wiring | Automatic wiring |
| Hard to swap implementations | Easy to swap |

## Common Mistakes to Avoid

### 1. Forgetting to add to module

```typescript
// ❌ Service won't work - not registered!
@Injectable()
export class UsersService {}

// ✅ Must add to providers array
@Module({
    providers: [UsersService],  // Don't forget this!
})
export class UsersModule {}
```

### 2. Circular dependencies

```typescript
// ❌ A needs B, B needs A - won't work!
@Injectable()
export class ServiceA {
    constructor(private serviceB: ServiceB) {}
}

@Injectable()
export class ServiceB {
    constructor(private serviceA: ServiceA) {}
}

// ✅ Use forwardRef() to break the cycle
@Injectable()
export class ServiceA {
    constructor(
        @Inject(forwardRef(() => ServiceB))
        private serviceB: ServiceB
    ) {}
}
```

### 3. Not importing modules

```typescript
// ❌ Can't use UsersService from another module!
@Module({
    imports: [],  // UsersModule not imported
    providers: [OrdersService],
})
export class OrdersModule {}

// ✅ Import the module that exports the service
@Module({
    imports: [UsersModule],  // Now OrdersService can use UsersService
    providers: [OrdersService],
})
export class OrdersModule {}
```

## Summary

In this chapter, you learned:

- What NestJS is and its key features
- How to install the NestJS CLI and create a new project
- The structure of a NestJS application
- How to run the application in development mode
- Basic decorators for controllers, services, and routes
- How to create custom endpoints
- CLI commands for generating code

## What's Next?

In the next chapter, we'll dive deeper into [Controllers](/guide/nestjs/02-controllers) and learn about:
- Route parameters and query strings
- Request and response objects
- HTTP status codes
- Route wildcards and patterns

---

[Next: Controllers →](/guide/nestjs/02-controllers)
