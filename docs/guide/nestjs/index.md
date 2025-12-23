# NestJS Tutorial

::: info Official Documentation
This tutorial is based on the official NestJS documentation. For the most up-to-date information, visit: [https://docs.nestjs.com](https://docs.nestjs.com)
:::

Welcome to the comprehensive NestJS tutorial! Learn how to build scalable, maintainable server-side applications with NestJS.

## What is NestJS?

NestJS is a progressive Node.js framework for building efficient, reliable, and scalable server-side applications. It uses TypeScript by default and combines elements of Object-Oriented Programming (OOP), Functional Programming (FP), and Functional Reactive Programming (FRP).

```typescript
// A simple NestJS controller
import { Controller, Get } from '@nestjs/common';

@Controller('hello')
export class HelloController {
    @Get()
    sayHello(): string {
        return 'Hello, NestJS!';
    }
}
```

## Why NestJS?

| Feature | Description |
|---------|-------------|
| TypeScript First | Built with and fully supports TypeScript |
| Modular Architecture | Organized, maintainable code structure |
| Dependency Injection | Built-in DI container for loose coupling |
| Extensive Ecosystem | Support for databases, GraphQL, WebSockets, microservices |
| Testing Ready | Easy unit and e2e testing with Jest |
| Enterprise Ready | Scalable architecture for large applications |

## Tutorial Structure

### Beginner Level
- [Introduction](/guide/nestjs/01-introduction) - Installation, First Application, Project Structure
- [Controllers](/guide/nestjs/02-controllers) - Routing, Request Handling, Response
- [Providers & Services](/guide/nestjs/03-providers) - Dependency Injection, Services

### Intermediate Level
- [Modules](/guide/nestjs/04-modules) - Module Organization, Feature Modules
- [Middleware](/guide/nestjs/05-middleware) - Middleware, Guards, Interceptors
- [Pipes & Validation](/guide/nestjs/06-pipes) - Data Validation, Transformation

### Advanced Level
- [Database Integration](/guide/nestjs/07-database) - TypeORM, Prisma, MongoDB
- [Authentication](/guide/nestjs/08-authentication) - JWT, Passport, Auth Guards
- [Testing](/guide/nestjs/09-testing) - Unit Tests, E2E Tests, Mocking
- [Advanced Topics](/guide/nestjs/10-advanced) - Microservices, WebSockets, GraphQL

## Prerequisites

Before starting this tutorial, you should have:

- **Node.js** (v16 or higher) installed
- Basic knowledge of **TypeScript**
- Understanding of **REST APIs**
- Familiarity with **npm/yarn**
- A code editor (VS Code recommended)

::: tip Recommended Background
If you're new to TypeScript, check out our [TypeScript Tutorial](/guide/typescript/) first. Understanding decorators and classes is especially helpful for NestJS.
:::

## Quick Start

### Installation

```bash
# Install NestJS CLI globally
npm install -g @nestjs/cli

# Create a new project
nest new my-project

# Navigate to project
cd my-project

# Start development server
npm run start:dev
```

### Project Structure

```
my-project/
├── src/
│   ├── app.controller.ts    # Basic controller
│   ├── app.controller.spec.ts # Controller tests
│   ├── app.module.ts        # Root module
│   ├── app.service.ts       # Basic service
│   └── main.ts              # Application entry point
├── test/                    # E2E tests
├── nest-cli.json           # Nest CLI configuration
├── package.json
└── tsconfig.json           # TypeScript configuration
```

### Your First Endpoint

After creating a new project, you already have a working API:

```bash
# Start the server
npm run start:dev

# Test the endpoint
curl http://localhost:3000
# Output: Hello World!
```

## Core Concepts Overview

### 1. Controllers
Handle incoming requests and return responses to the client.

```typescript
@Controller('users')
export class UsersController {
    @Get()
    findAll(): string {
        return 'This returns all users';
    }
}
```

### 2. Providers (Services)
Handle business logic and can be injected into controllers.

```typescript
@Injectable()
export class UsersService {
    findAll(): User[] {
        return this.users;
    }
}
```

### 3. Modules
Organize the application into cohesive blocks of functionality.

```typescript
@Module({
    controllers: [UsersController],
    providers: [UsersService],
})
export class UsersModule {}
```

### 4. Middleware
Functions that have access to request/response objects.

```typescript
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        console.log(`Request: ${req.method} ${req.url}`);
        next();
    }
}
```

## NestJS vs Express

| Aspect | Express | NestJS |
|--------|---------|--------|
| Architecture | Minimal, flexible | Opinionated, structured |
| TypeScript | Optional | First-class support |
| Dependency Injection | Manual setup | Built-in |
| Testing | Manual setup | Built-in support |
| Learning Curve | Low | Medium |
| Scalability | Requires planning | Built-in patterns |

## Common Use Cases

NestJS is excellent for:

- **REST APIs** - Full-featured REST API development
- **GraphQL APIs** - Built-in GraphQL support
- **Microservices** - Native microservice patterns
- **WebSocket Apps** - Real-time applications
- **CLI Applications** - Command-line tools
- **Scheduled Tasks** - Cron jobs and task scheduling

## Development Tools

### NestJS CLI Commands

```bash
# Generate a new module
nest generate module users
# or shorthand
nest g mo users

# Generate a controller
nest g co users

# Generate a service
nest g s users

# Generate a complete CRUD resource
nest g resource users
```

### Useful Extensions (VS Code)

- **NestJS Files** - Quick file generation
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Thunder Client** - API testing

## What You'll Build

Throughout this tutorial, you'll build a complete RESTful API with:

- User authentication (JWT)
- CRUD operations
- Database integration
- Input validation
- Error handling
- Unit and E2E tests
- API documentation

## Video Tutorials

::: tip Recommended Video Resources
Learn NestJS through these excellent video tutorials from the community.
:::

### Free Courses

| Course | Creator | Description |
|--------|---------|-------------|
| [NestJS Crash Course](https://www.youtube.com/watch?v=wqhNoDE6pb4) | Traversy Media | 1.5-hour crash course |
| [NestJS Full Tutorial](https://www.youtube.com/watch?v=GHTA143_b-s) | freeCodeCamp | 3+ hour comprehensive course |
| [NestJS Tutorial](https://www.youtube.com/watch?v=0M8AYU_hPas) | Academind | 1-hour beginner tutorial |
| [NestJS in 100 Seconds](https://www.youtube.com/watch?v=0M8AYU_hPas) | Fireship | Quick 100-second explanation |

### Official Resources

| Resource | Description |
|----------|-------------|
| [NestJS Fundamentals](https://docs.nestjs.com/first-steps) | Official getting started guide |
| [NestJS Courses](https://courses.nestjs.com/) | Official NestJS courses |

### Topic-Specific Videos

| Topic | Video | Duration |
|-------|-------|----------|
| Authentication | [NestJS JWT Auth](https://www.youtube.com/watch?v=_L225zpUK0M) | ~45 min |
| Database (TypeORM) | [NestJS + TypeORM](https://www.youtube.com/watch?v=W1gvIw0GNl8) | ~30 min |
| GraphQL | [NestJS GraphQL](https://www.youtube.com/watch?v=geYvdbpo3cA) | ~40 min |
| Testing | [NestJS Testing](https://www.youtube.com/watch?v=dXOfOgFFKuY) | ~35 min |

Let's begin your NestJS journey!

---

[Start with Introduction →](/guide/nestjs/01-introduction)
