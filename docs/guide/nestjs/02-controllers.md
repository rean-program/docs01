# Controllers

Controllers are responsible for handling incoming requests and returning responses to the client. Think of controllers as the "front desk" of your API - they receive requests, decide what to do with them, and send back responses.

## What is a Controller?

A controller's purpose is to receive specific requests for the application. The routing mechanism controls which controller receives which requests. Each controller can have multiple routes, and different routes can perform different actions.

```
┌─────────────────────────────────────────────────────────────────┐
│                        REQUEST FLOW                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Client Request                                                  │
│       │                                                          │
│       ▼                                                          │
│  ┌─────────────────┐                                            │
│  │   Controller    │  ← Receives HTTP request                    │
│  │                 │  ← Extracts data (params, body, query)      │
│  │  @Get('/users') │  ← Calls appropriate service method         │
│  └────────┬────────┘  ← Returns response to client              │
│           │                                                      │
│           ▼                                                      │
│  ┌─────────────────┐                                            │
│  │    Service      │  ← Contains business logic                  │
│  │                 │  ← Handles data processing                  │
│  │  findAll()      │  ← Interacts with database                 │
│  └─────────────────┘                                            │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

```typescript
import { Controller, Get, Post } from '@nestjs/common';

@Controller('users')  // Base route: /users
export class UsersController {
    @Get()           // GET /users
    findAll(): string {
        return 'This action returns all users';
    }

    @Post()          // POST /users
    create(): string {
        return 'This action creates a user';
    }
}
```

**How the URL maps to methods:**

| HTTP Request | Decorator | Controller Method | Response |
|--------------|-----------|-------------------|----------|
| `GET /users` | `@Get()` | `findAll()` | "This action returns all users" |
| `POST /users` | `@Post()` | `create()` | "This action creates a user" |

## Creating a Controller

### Using the CLI

```bash
# Generate a controller
nest generate controller cats
# Shorthand
nest g co cats

# Generate without test file
nest g co cats --no-spec
```

This creates:
```
src/
└── cats/
    ├── cats.controller.ts
    └── cats.controller.spec.ts
```

### Manual Creation

```typescript
// src/cats/cats.controller.ts
import { Controller, Get } from '@nestjs/common';

@Controller('cats')
export class CatsController {
    @Get()
    findAll(): string {
        return 'This action returns all cats';
    }
}
```

Don't forget to register it in a module:

```typescript
// src/cats/cats.module.ts
import { Module } from '@nestjs/common';
import { CatsController } from './cats.controller';

@Module({
    controllers: [CatsController],
})
export class CatsModule {}
```

## Routing

### Basic Routes

```typescript
@Controller('products')
export class ProductsController {
    @Get()              // GET /products
    findAll() {}

    @Get('featured')    // GET /products/featured
    findFeatured() {}

    @Post()             // POST /products
    create() {}

    @Put()              // PUT /products
    update() {}

    @Delete()           // DELETE /products
    remove() {}

    @Patch()            // PATCH /products
    partialUpdate() {}
}
```

### Route Parameters

Route parameters allow you to capture dynamic values from the URL. They're defined with a colon (`:`) prefix.

```
URL Pattern: /users/:id
                    ↑
                    This is a parameter - it captures any value

Examples:
  /users/123     → id = "123"
  /users/abc     → id = "abc"
  /users/john    → id = "john"
```

```typescript
@Controller('users')
export class UsersController {
    // GET /users/123
    @Get(':id')
    findOne(@Param('id') id: string): string {
        return `This action returns user #${id}`;
    }

    // GET /users/123/posts/456
    @Get(':userId/posts/:postId')
    findUserPost(
        @Param('userId') userId: string,
        @Param('postId') postId: string,
    ): string {
        return `User ${userId}, Post ${postId}`;
    }

    // Get all parameters as an object
    @Get(':id/profile/:section')
    getProfile(@Param() params: { id: string; section: string }): string {
        return `User ${params.id}, Section ${params.section}`;
    }
}
```

**URL to Parameter Mapping:**

| URL | Route Pattern | Extracted Parameters |
|-----|---------------|---------------------|
| `/users/123` | `/users/:id` | `id = "123"` |
| `/users/abc/posts/456` | `/users/:userId/posts/:postId` | `userId = "abc"`, `postId = "456"` |
| `/users/5/profile/settings` | `/users/:id/profile/:section` | `id = "5"`, `section = "settings"` |

### Query Parameters

Query parameters are values passed after the `?` in the URL. They're commonly used for filtering, pagination, and search.

```
URL: /products?page=1&limit=10&sort=price
               ↑
               Query string starts after ?

Breakdown:
  page = "1"
  limit = "10"
  sort = "price"
```

```typescript
@Controller('products')
export class ProductsController {
    // GET /products?page=1&limit=10
    @Get()
    findAll(
        @Query('page') page: string,
        @Query('limit') limit: string,
    ): string {
        return `Page: ${page}, Limit: ${limit}`;
    }

    // GET /products/search?q=phone&category=electronics
    @Get('search')
    search(
        @Query('q') query: string,
        @Query('category') category?: string,
    ): string {
        return `Searching for: ${query} in ${category || 'all categories'}`;
    }

    // Get all query params as an object
    @Get('filter')
    filter(@Query() query: Record<string, string>): string {
        return `Filters: ${JSON.stringify(query)}`;
    }
}
```

**Query Parameter Examples:**

| URL | Query Parameters | Values |
|-----|-----------------|--------|
| `/products?page=1&limit=10` | `page`, `limit` | `page="1"`, `limit="10"` |
| `/products/search?q=phone` | `q` | `q="phone"` |
| `/products?minPrice=100&maxPrice=500` | `minPrice`, `maxPrice` | `minPrice="100"`, `maxPrice="500"` |

::: tip Query vs Route Parameters
- **Route params** (`:id`): Required, part of the URL path → `/users/123`
- **Query params** (`?key=value`): Optional, after `?` → `/users?role=admin`

Use route params for resource identifiers, query params for filtering/sorting.
:::

### Route Wildcards

```typescript
@Controller('files')
export class FilesController {
    // Matches /files/ab_cd, /files/abcd, /files/ab123cd
    @Get('ab*cd')
    findWildcard(): string {
        return 'This route uses a wildcard';
    }

    // Matches any path under /files/
    @Get('*')
    catchAll(): string {
        return 'Catch all route';
    }
}
```

## Request Object

### Accessing the Full Request

```typescript
import { Controller, Get, Req } from '@nestjs/common';
import { Request } from 'express';

@Controller('info')
export class InfoController {
    @Get()
    getRequestInfo(@Req() request: Request): object {
        return {
            method: request.method,
            url: request.url,
            headers: request.headers,
            query: request.query,
            params: request.params,
            ip: request.ip,
        };
    }
}
```

### Common Request Decorators

| Decorator | Description | Express Equivalent |
|-----------|-------------|-------------------|
| `@Req()` | Full request object | `req` |
| `@Res()` | Full response object | `res` |
| `@Next()` | Next middleware function | `next` |
| `@Param(key?)` | Route parameters | `req.params` / `req.params[key]` |
| `@Query(key?)` | Query string | `req.query` / `req.query[key]` |
| `@Body(key?)` | Request body | `req.body` / `req.body[key]` |
| `@Headers(name?)` | Request headers | `req.headers` / `req.headers[name]` |
| `@Ip()` | Client IP address | `req.ip` |
| `@HostParam()` | Host parameters | `req.hosts` |
| `@Session()` | Session object | `req.session` |

### Request Headers

```typescript
@Controller('api')
export class ApiController {
    @Get()
    getWithHeaders(
        @Headers('authorization') auth: string,
        @Headers('user-agent') userAgent: string,
    ): object {
        return {
            authorization: auth,
            userAgent: userAgent,
        };
    }

    // Get all headers
    @Get('headers')
    getAllHeaders(@Headers() headers: Record<string, string>): object {
        return headers;
    }
}
```

## Request Body

The request body contains data sent by the client, typically in POST, PUT, or PATCH requests.

```
POST /users HTTP/1.1
Content-Type: application/json

{
    "name": "John Doe",
    "email": "john@example.com",
    "age": 30
}
↑
This is the request body - extracted with @Body()
```

### Handling POST/PUT Data

```typescript
import { Controller, Post, Put, Body } from '@nestjs/common';

// Define a DTO (Data Transfer Object)
// DTOs define the shape of data coming in
class CreateUserDto {
    name: string;
    email: string;
    age: number;
}

class UpdateUserDto {
    name?: string;    // Optional fields for partial updates
    email?: string;
    age?: number;
}

@Controller('users')
export class UsersController {
    // POST /users
    @Post()
    create(@Body() createUserDto: CreateUserDto): object {
        // createUserDto = { name: "John", email: "john@example.com", age: 30 }
        return {
            message: 'User created',
            data: createUserDto,
        };
    }

    // PUT /users/123
    @Put(':id')
    update(
        @Param('id') id: string,
        @Body() updateUserDto: UpdateUserDto,
    ): object {
        return {
            message: `User ${id} updated`,
            data: updateUserDto,
        };
    }

    // Access specific body properties
    @Post('quick')
    quickCreate(
        @Body('name') name: string,    // Extract just the 'name' field
        @Body('email') email: string,  // Extract just the 'email' field
    ): object {
        return { name, email };
    }
}
```

**Testing with curl:**

```bash
# Create a user (POST with body)
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"name": "John", "email": "john@test.com", "age": 25}'

# Update a user (PUT with body)
curl -X PUT http://localhost:3000/users/123 \
  -H "Content-Type: application/json" \
  -d '{"name": "John Updated"}'

# Quick create (extracts specific fields)
curl -X POST http://localhost:3000/users/quick \
  -H "Content-Type: application/json" \
  -d '{"name": "Jane", "email": "jane@test.com", "extra": "ignored"}'
```

**@Body() Usage:**

| Usage | Request Body | Extracted Value |
|-------|-------------|-----------------|
| `@Body()` | `{"name":"John","age":30}` | `{name:"John",age:30}` |
| `@Body('name')` | `{"name":"John","age":30}` | `"John"` |
| `@Body('age')` | `{"name":"John","age":30}` | `30` |

### File Upload

```typescript
import {
    Controller,
    Post,
    UseInterceptors,
    UploadedFile,
    UploadedFiles,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

@Controller('upload')
export class UploadController {
    // Single file upload
    @Post('single')
    @UseInterceptors(FileInterceptor('file'))
    uploadFile(@UploadedFile() file: Express.Multer.File): object {
        return {
            filename: file.originalname,
            size: file.size,
            mimetype: file.mimetype,
        };
    }

    // Multiple files upload
    @Post('multiple')
    @UseInterceptors(FilesInterceptor('files', 10)) // Max 10 files
    uploadFiles(@UploadedFiles() files: Express.Multer.File[]): object {
        return {
            count: files.length,
            files: files.map(f => ({
                filename: f.originalname,
                size: f.size,
            })),
        };
    }
}
```

## Response Handling

NestJS automatically handles response serialization. Just return your data and NestJS does the rest!

```
┌─────────────────────────────────────────────────────────────┐
│                   RESPONSE FLOW                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Controller Method Returns:                                  │
│       │                                                      │
│       ├── Object/Array → JSON response (Content-Type: JSON) │
│       │   return { id: 1 }  →  {"id":1}                     │
│       │                                                      │
│       ├── String → Text response (Content-Type: text/html)  │
│       │   return "Hello"  →  Hello                          │
│       │                                                      │
│       └── Promise/Observable → Waits, then processes        │
│           return Promise.resolve({})  →  {}                 │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Standard Approach (Recommended)

NestJS automatically serializes the return value to JSON:

```typescript
@Controller('products')
export class ProductsController {
    // Returns JSON automatically
    @Get()
    findAll(): object[] {
        return [
            { id: 1, name: 'Product 1' },
            { id: 2, name: 'Product 2' },
        ];
    }

    // Returns string
    @Get('hello')
    hello(): string {
        return 'Hello World';
    }

    // Returns a Promise
    @Get('async')
    async findAsync(): Promise<object> {
        return { async: true };
    }
}
```

**Response Examples:**

| Return Value | HTTP Response |
|-------------|---------------|
| `return { id: 1, name: "Test" }` | `{"id":1,"name":"Test"}` with `Content-Type: application/json` |
| `return "Hello"` | `Hello` with `Content-Type: text/html` |
| `return [1, 2, 3]` | `[1,2,3]` with `Content-Type: application/json` |

### HTTP Status Codes

By default, NestJS uses these status codes:
- `GET` → 200 (OK)
- `POST` → 201 (Created)
- `DELETE` → 200 (OK)

You can customize with `@HttpCode()`:

```typescript
import {
    Controller,
    Get,
    Post,
    Delete,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';

@Controller('items')
export class ItemsController {
    // POST defaults to 201, change to 200
    @Post()
    @HttpCode(200)
    create(): object {
        return { created: true };
    }

    // Use HttpStatus enum for clarity
    @Post('accepted')
    @HttpCode(HttpStatus.ACCEPTED) // 202
    createAccepted(): object {
        return { status: 'accepted' };
    }

    // DELETE with 204 No Content
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT) // 204
    remove(): void {
        // No return value
    }
}
```

**Common HTTP Status Codes:**

| Code | HttpStatus Enum | Meaning | When to Use |
|------|-----------------|---------|-------------|
| 200 | `HttpStatus.OK` | Success | General success |
| 201 | `HttpStatus.CREATED` | Created | Resource created |
| 204 | `HttpStatus.NO_CONTENT` | No Content | Successful delete |
| 400 | `HttpStatus.BAD_REQUEST` | Bad Request | Invalid input |
| 401 | `HttpStatus.UNAUTHORIZED` | Unauthorized | Not logged in |
| 403 | `HttpStatus.FORBIDDEN` | Forbidden | No permission |
| 404 | `HttpStatus.NOT_FOUND` | Not Found | Resource not found |
| 500 | `HttpStatus.INTERNAL_SERVER_ERROR` | Server Error | Unexpected error |

### Custom Response Headers

```typescript
import { Controller, Get, Header, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller('data')
export class DataController {
    // Using @Header decorator
    @Get('cached')
    @Header('Cache-Control', 'max-age=3600')
    @Header('X-Custom-Header', 'custom-value')
    getCached(): object {
        return { cached: true };
    }

    // Using @Res() for more control
    @Get('custom')
    getCustom(@Res() res: Response): void {
        res
            .status(200)
            .header('X-Powered-By', 'NestJS')
            .json({ custom: true });
    }
}
```

### Redirects

```typescript
import { Controller, Get, Redirect, Query } from '@nestjs/common';

@Controller('redirect')
export class RedirectController {
    // Static redirect
    @Get()
    @Redirect('https://nestjs.com', 301)
    redirectToNest(): void {}

    // Dynamic redirect
    @Get('docs')
    @Redirect('https://docs.nestjs.com', 302)
    redirectToDocs(@Query('version') version: string) {
        if (version === 'v9') {
            return { url: 'https://docs.nestjs.com/v9' };
        }
        // Returns to default if no return
    }

    // Conditional redirect
    @Get('dynamic')
    dynamicRedirect(@Query('to') to: string) {
        const urls: Record<string, string> = {
            google: 'https://google.com',
            github: 'https://github.com',
        };
        return {
            url: urls[to] || 'https://nestjs.com',
            statusCode: 302,
        };
    }
}
```

## Asynchronous Operations

### Using Promises

```typescript
@Controller('async')
export class AsyncController {
    @Get('promise')
    async findAll(): Promise<object[]> {
        // Simulate async operation
        await new Promise(resolve => setTimeout(resolve, 1000));
        return [{ id: 1 }, { id: 2 }];
    }

    @Get('fetch')
    async fetchData(): Promise<object> {
        const response = await fetch('https://api.example.com/data');
        return response.json();
    }
}
```

### Using Observables (RxJS)

```typescript
import { Controller, Get } from '@nestjs/common';
import { Observable, of, delay } from 'rxjs';

@Controller('rxjs')
export class RxjsController {
    @Get()
    findAll(): Observable<object[]> {
        return of([{ id: 1 }, { id: 2 }]).pipe(delay(1000));
    }
}
```

## Subdomain Routing

```typescript
@Controller({ host: 'admin.example.com' })
export class AdminController {
    @Get()
    index(): string {
        return 'Admin panel';
    }
}

// With host parameter
@Controller({ host: ':account.example.com' })
export class AccountController {
    @Get()
    getInfo(@HostParam('account') account: string): string {
        return `Account: ${account}`;
    }
}
```

## Request Scope

By default, controllers are singletons. You can change this:

```typescript
import { Controller, Scope } from '@nestjs/common';

// Request-scoped controller (new instance per request)
@Controller({
    path: 'users',
    scope: Scope.REQUEST,
})
export class UsersController {
    constructor() {
        console.log('New instance created');
    }
}
```

## Complete CRUD Example

Here's a complete example of a CRUD controller:

```typescript
import {
    Controller,
    Get,
    Post,
    Put,
    Patch,
    Delete,
    Param,
    Query,
    Body,
    HttpCode,
    HttpStatus,
    ParseIntPipe,
    NotFoundException,
} from '@nestjs/common';

// DTOs
class CreateProductDto {
    name: string;
    price: number;
    description?: string;
    category: string;
}

class UpdateProductDto {
    name?: string;
    price?: number;
    description?: string;
    category?: string;
}

class ProductQueryDto {
    page?: number;
    limit?: number;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
}

// Mock Product type
interface Product {
    id: number;
    name: string;
    price: number;
    description?: string;
    category: string;
}

@Controller('products')
export class ProductsController {
    // In-memory storage (replace with service in real app)
    private products: Product[] = [
        { id: 1, name: 'Laptop', price: 999, category: 'electronics' },
        { id: 2, name: 'Phone', price: 699, category: 'electronics' },
    ];

    // GET /products
    @Get()
    findAll(@Query() query: ProductQueryDto): Product[] {
        let result = [...this.products];

        if (query.category) {
            result = result.filter(p => p.category === query.category);
        }

        if (query.minPrice) {
            result = result.filter(p => p.price >= query.minPrice);
        }

        if (query.maxPrice) {
            result = result.filter(p => p.price <= query.maxPrice);
        }

        // Pagination
        const page = query.page || 1;
        const limit = query.limit || 10;
        const start = (page - 1) * limit;

        return result.slice(start, start + limit);
    }

    // GET /products/123
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number): Product {
        const product = this.products.find(p => p.id === id);
        if (!product) {
            throw new NotFoundException(`Product with ID ${id} not found`);
        }
        return product;
    }

    // POST /products
    @Post()
    @HttpCode(HttpStatus.CREATED)
    create(@Body() createProductDto: CreateProductDto): Product {
        const newProduct: Product = {
            id: this.products.length + 1,
            ...createProductDto,
        };
        this.products.push(newProduct);
        return newProduct;
    }

    // PUT /products/123 (full update)
    @Put(':id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateProductDto: UpdateProductDto,
    ): Product {
        const index = this.products.findIndex(p => p.id === id);
        if (index === -1) {
            throw new NotFoundException(`Product with ID ${id} not found`);
        }

        this.products[index] = {
            ...this.products[index],
            ...updateProductDto,
        };

        return this.products[index];
    }

    // PATCH /products/123 (partial update)
    @Patch(':id')
    partialUpdate(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateProductDto: UpdateProductDto,
    ): Product {
        return this.update(id, updateProductDto);
    }

    // DELETE /products/123
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    remove(@Param('id', ParseIntPipe) id: number): void {
        const index = this.products.findIndex(p => p.id === id);
        if (index === -1) {
            throw new NotFoundException(`Product with ID ${id} not found`);
        }
        this.products.splice(index, 1);
    }
}
```

## Best Practices

### 1. Keep Controllers Thin

Controllers should only handle HTTP-related logic. Business logic belongs in services:

```typescript
// ❌ Bad - Business logic in controller
@Controller('orders')
export class OrdersController {
    @Post()
    create(@Body() dto: CreateOrderDto) {
        // Calculate total, validate inventory, process payment...
        // Too much logic!
    }
}

// ✅ Good - Delegate to service
@Controller('orders')
export class OrdersController {
    constructor(private ordersService: OrdersService) {}

    @Post()
    create(@Body() dto: CreateOrderDto) {
        return this.ordersService.create(dto);
    }
}
```

### 2. Use DTOs for Request Data

```typescript
// Define clear DTOs
class CreateUserDto {
    readonly name: string;
    readonly email: string;
    readonly password: string;
}

@Controller('users')
export class UsersController {
    @Post()
    create(@Body() createUserDto: CreateUserDto) {
        return this.usersService.create(createUserDto);
    }
}
```

### 3. Handle Errors Properly

```typescript
import { NotFoundException, BadRequestException } from '@nestjs/common';

@Controller('users')
export class UsersController {
    @Get(':id')
    findOne(@Param('id') id: string) {
        const user = this.usersService.findOne(id);
        if (!user) {
            throw new NotFoundException(`User #${id} not found`);
        }
        return user;
    }
}
```

## Summary

In this chapter, you learned:

- How to create and configure controllers
- Route parameters and query strings
- Handling different HTTP methods
- Working with request body and headers
- Returning responses with custom status codes
- Asynchronous operations in controllers
- Complete CRUD implementation

## What's Next?

In the next chapter, we'll learn about [Providers & Services](/guide/nestjs/03-providers) and understand:
- Creating and using services
- Dependency injection in NestJS
- Provider scopes
- Custom providers

---

[Previous: Introduction](/guide/nestjs/01-introduction) | [Next: Providers & Services →](/guide/nestjs/03-providers)
