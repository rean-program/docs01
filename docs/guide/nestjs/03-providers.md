# Providers & Services

Providers are a fundamental concept in NestJS. They can be services, repositories, factories, helpers, and more. The main idea is that providers can be **injected** as dependencies, allowing objects to create various relationships with each other.

## What is a Provider?

A provider is simply a class annotated with an `@Injectable()` decorator. This decorator attaches metadata that tells NestJS this class can be managed by the NestJS IoC (Inversion of Control) container.

```
┌─────────────────────────────────────────────────────────────────┐
│                    PROVIDERS IN NESTJS                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  What can be a Provider?                                         │
│                                                                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │   Service   │  │ Repository  │  │   Factory   │             │
│  │             │  │             │  │             │             │
│  │ Business    │  │ Database    │  │ Creates     │             │
│  │ Logic       │  │ Operations  │  │ Objects     │             │
│  └─────────────┘  └─────────────┘  └─────────────┘             │
│                                                                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │   Helper    │  │   Guard     │  │  Anything   │             │
│  │             │  │             │  │  @Injectable│             │
│  │ Utility     │  │ Auth Check  │  │             │             │
│  │ Functions   │  │             │  │             │             │
│  └─────────────┘  └─────────────┘  └─────────────┘             │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

```typescript
import { Injectable } from '@nestjs/common';

@Injectable()  // ← This decorator makes it a provider
export class CatsService {
    private readonly cats: Cat[] = [];

    findAll(): Cat[] {
        return this.cats;
    }

    create(cat: Cat): void {
        this.cats.push(cat);
    }
}
```

**Key Point:** The `@Injectable()` decorator tells NestJS: "This class can be injected into other classes"

## Creating a Service

### Using the CLI

```bash
# Generate a service
nest generate service users
# Shorthand
nest g s users

# Generate without test file
nest g s users --no-spec

# Generate in a specific directory
nest g s users/services/user-profile
```

### Manual Creation

```typescript
// src/users/users.service.ts
import { Injectable } from '@nestjs/common';

interface User {
    id: number;
    name: string;
    email: string;
}

@Injectable()
export class UsersService {
    private users: User[] = [];

    create(user: Omit<User, 'id'>): User {
        const newUser = {
            id: this.users.length + 1,
            ...user,
        };
        this.users.push(newUser);
        return newUser;
    }

    findAll(): User[] {
        return this.users;
    }

    findOne(id: number): User | undefined {
        return this.users.find(user => user.id === id);
    }

    update(id: number, updateData: Partial<User>): User | undefined {
        const user = this.findOne(id);
        if (user) {
            Object.assign(user, updateData);
        }
        return user;
    }

    remove(id: number): boolean {
        const index = this.users.findIndex(user => user.id === id);
        if (index !== -1) {
            this.users.splice(index, 1);
            return true;
        }
        return false;
    }
}
```

## Dependency Injection

Dependency Injection (DI) is a design pattern where classes receive their dependencies from external sources rather than creating them internally. It's one of the most powerful features of NestJS!

```
┌─────────────────────────────────────────────────────────────────┐
│              WITHOUT DEPENDENCY INJECTION                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  class UsersController {                                         │
│      private service: UsersService;                              │
│                                                                  │
│      constructor() {                                             │
│          // ❌ Controller creates its own dependency             │
│          this.service = new UsersService();                      │
│      }                                                           │
│  }                                                               │
│                                                                  │
│  Problems:                                                       │
│  • Hard to test (can't easily mock UsersService)                │
│  • Tightly coupled                                               │
│  • Controller knows HOW to create UsersService                  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│               WITH DEPENDENCY INJECTION                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  class UsersController {                                         │
│      // ✅ Dependency is injected from outside                   │
│      constructor(private service: UsersService) {}               │
│  }                                                               │
│                                                                  │
│  Benefits:                                                       │
│  • Easy to test (inject mock service)                           │
│  • Loosely coupled                                               │
│  • Controller doesn't know HOW to create UsersService           │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Constructor-Based Injection

The most common way to inject dependencies:

```typescript
import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
    // UsersService is automatically injected by NestJS
    constructor(private readonly usersService: UsersService) {}
    //          ↑ TypeScript shorthand: creates and assigns this.usersService

    @Get()
    findAll() {
        return this.usersService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.usersService.findOne(+id);
    }

    @Post()
    create(@Body() createUserDto: CreateUserDto) {
        return this.usersService.create(createUserDto);
    }
}
```

### How DI Works

```
┌─────────────────────────────────────────────────────────────────┐
│                   HOW DI WORKS STEP BY STEP                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. You register providers in a module                           │
│     @Module({ providers: [UsersService] })                       │
│                       ↓                                          │
│  2. NestJS creates IoC container with all providers              │
│     Container: { UsersService: instance }                        │
│                       ↓                                          │
│  3. When creating UsersController, NestJS checks constructor     │
│     constructor(private usersService: UsersService)              │
│                       ↓                                          │
│  4. NestJS looks up UsersService in container                    │
│     "Do I have UsersService? Yes!"                               │
│                       ↓                                          │
│  5. NestJS passes the instance to the controller                 │
│     new UsersController(usersServiceInstance)                    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

1. NestJS creates a container that holds all providers
2. When a class is instantiated, NestJS looks at its constructor parameters
3. For each parameter, NestJS finds the corresponding provider
4. The provider is instantiated (if not already) and passed to the constructor

```typescript
// Behind the scenes, NestJS does something like:
const usersService = new UsersService();
const usersController = new UsersController(usersService);
```

**Why is this powerful?**

| Scenario | Without DI | With DI |
|----------|-----------|---------|
| Unit Testing | Hard - need to mock internal creation | Easy - just pass mock |
| Swapping Implementations | Change every file that creates it | Change one module config |
| Adding Dependencies | Modify constructor in every place | Just add to constructor |

### Property-Based Injection

Less common, but useful in some cases:

```typescript
import { Injectable, Inject } from '@nestjs/common';

@Injectable()
export class HttpService {
    @Inject('CONFIG')
    private readonly config: ConfigOptions;
}
```

## Registering Providers

Providers must be registered in a module to be available for injection:

```typescript
// src/users/users.module.ts
import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
    controllers: [UsersController],
    providers: [UsersService],  // Register the service
    exports: [UsersService],    // Export to make available to other modules
})
export class UsersModule {}
```

## Provider Scopes

By default, providers are singletons (one instance shared across the entire application). You can change this behavior.

```
┌─────────────────────────────────────────────────────────────────┐
│                     PROVIDER SCOPES                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  SINGLETON (Default)                                             │
│  ┌─────────────────────────────────────────────────┐            │
│  │  One instance for the ENTIRE application        │            │
│  │                                                 │            │
│  │  Request 1 ──┐                                  │            │
│  │              │                                  │            │
│  │  Request 2 ──┼──► Same Instance                 │            │
│  │              │                                  │            │
│  │  Request 3 ──┘                                  │            │
│  └─────────────────────────────────────────────────┘            │
│                                                                  │
│  REQUEST                                                         │
│  ┌─────────────────────────────────────────────────┐            │
│  │  New instance for EACH request                  │            │
│  │                                                 │            │
│  │  Request 1 ────► Instance 1                     │            │
│  │  Request 2 ────► Instance 2                     │            │
│  │  Request 3 ────► Instance 3                     │            │
│  └─────────────────────────────────────────────────┘            │
│                                                                  │
│  TRANSIENT                                                       │
│  ┌─────────────────────────────────────────────────┐            │
│  │  New instance for EACH injection                │            │
│  │                                                 │            │
│  │  Controller A ────► Instance 1                  │            │
│  │  Controller B ────► Instance 2                  │            │
│  │  Service C    ────► Instance 3                  │            │
│  └─────────────────────────────────────────────────┘            │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Singleton (Default)

```typescript
@Injectable()  // Default scope is Singleton
export class CatsService {}

// Explicitly set singleton
@Injectable({ scope: Scope.DEFAULT })
export class CatsService {}
```

**When to use:** Almost always! Best for stateless services, database connections, configuration.

### Request Scope

A new instance is created for each incoming request:

```typescript
import { Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.REQUEST })
export class RequestScopedService {
    private requestId: string;

    constructor() {
        this.requestId = Math.random().toString(36).substring(7);
        console.log(`New instance created: ${this.requestId}`);
    }
}
```

**When to use:** When you need request-specific data (e.g., user session, request context).

### Transient Scope

A new instance is created each time it's injected:

```typescript
import { Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.TRANSIENT })
export class TransientService {
    constructor() {
        console.log('New transient instance created');
    }
}
```

**When to use:** When each consumer needs its own instance (rare).

### Scope Hierarchy

| Scope | Instance Per | Use Case |
|-------|-------------|----------|
| `DEFAULT` | Application (singleton) | Most services, DB connections |
| `REQUEST` | Request | User context, request logging |
| `TRANSIENT` | Injection | Stateful helpers, unique IDs |

::: warning Request Scope Performance
Request-scoped providers can impact performance because a new instance is created for each request. Use them only when necessary (e.g., when you need access to request-specific data).
:::

## Custom Providers

NestJS offers several ways to create custom providers for more complex scenarios.

```
┌─────────────────────────────────────────────────────────────────┐
│                    CUSTOM PROVIDER TYPES                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  useValue   → Inject a constant value or object                 │
│  useClass   → Inject a class (can be different from token)      │
│  useFactory → Create value dynamically with dependencies        │
│  useExisting→ Create an alias to another provider               │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Value Providers

Inject a constant value. Great for configuration, mock data, or constants:

```typescript
// Useful for configuration objects, mock data, or constants
const configProvider = {
    provide: 'CONFIG',           // ← Token (how you'll request it)
    useValue: {                  // ← The actual value
        apiUrl: 'https://api.example.com',
        timeout: 5000,
    },
};

@Module({
    providers: [configProvider],
})
export class AppModule {}

// Using the value
@Injectable()
export class ApiService {
    constructor(
        @Inject('CONFIG')  // ← Use the same token
        private config: { apiUrl: string; timeout: number }
    ) {}

    async fetch(endpoint: string) {
        return fetch(`${this.config.apiUrl}/${endpoint}`, {
            timeout: this.config.timeout,
        });
    }
}
```

**Common use cases:**

| Use Case | Example |
|----------|---------|
| Configuration | `{ provide: 'DATABASE_URL', useValue: 'postgres://...' }` |
| Feature Flags | `{ provide: 'FEATURES', useValue: { darkMode: true } }` |
| Mock Data (Testing) | `{ provide: UserService, useValue: mockUserService }` |

### Class Providers

Provide a different class implementation:

```typescript
// Interface
interface Logger {
    log(message: string): void;
}

// Development logger
class DevLogger implements Logger {
    log(message: string) {
        console.log(`[DEV] ${message}`);
    }
}

// Production logger
class ProdLogger implements Logger {
    log(message: string) {
        // Send to logging service
    }
}

// Choose implementation based on environment
@Module({
    providers: [
        {
            provide: 'LOGGER',
            useClass: process.env.NODE_ENV === 'production' ? ProdLogger : DevLogger,
        },
    ],
})
export class AppModule {}
```

### Factory Providers

Create providers dynamically:

```typescript
// Simple factory
const connectionFactory = {
    provide: 'CONNECTION',
    useFactory: () => {
        const connection = createConnection();
        return connection;
    },
};

// Factory with dependencies
const databaseProvider = {
    provide: 'DATABASE',
    useFactory: (configService: ConfigService) => {
        const dbConfig = configService.get('database');
        return new DatabaseConnection(dbConfig);
    },
    inject: [ConfigService],  // Dependencies to inject into factory
};

// Async factory
const asyncConnectionProvider = {
    provide: 'ASYNC_CONNECTION',
    useFactory: async (configService: ConfigService) => {
        const config = await configService.loadConfig();
        return createAsyncConnection(config);
    },
    inject: [ConfigService],
};

@Module({
    providers: [
        ConfigService,
        connectionFactory,
        databaseProvider,
        asyncConnectionProvider,
    ],
})
export class AppModule {}
```

### Alias Providers

Create an alias for an existing provider:

```typescript
@Module({
    providers: [
        UsersService,
        {
            provide: 'AliasedUsersService',
            useExisting: UsersService,
        },
    ],
})
export class UsersModule {}
```

## Injection Tokens

### String Tokens

```typescript
@Module({
    providers: [
        {
            provide: 'API_KEY',
            useValue: 'my-secret-api-key',
        },
    ],
})
export class AppModule {}

@Injectable()
export class ApiService {
    constructor(@Inject('API_KEY') private apiKey: string) {}
}
```

### Symbol Tokens

Better for avoiding naming collisions:

```typescript
// tokens.ts
export const DATABASE_CONNECTION = Symbol('DATABASE_CONNECTION');

// module
@Module({
    providers: [
        {
            provide: DATABASE_CONNECTION,
            useFactory: () => createConnection(),
        },
    ],
})
export class DatabaseModule {}

// service
@Injectable()
export class UserRepository {
    constructor(@Inject(DATABASE_CONNECTION) private connection: Connection) {}
}
```

### Class Tokens

Using the class itself as a token (most common):

```typescript
@Module({
    providers: [UsersService],  // Shorthand for { provide: UsersService, useClass: UsersService }
})
export class UsersModule {}
```

## Optional Dependencies

Mark a dependency as optional:

```typescript
import { Injectable, Optional, Inject } from '@nestjs/common';

@Injectable()
export class HttpService {
    constructor(
        @Optional() @Inject('HTTP_OPTIONS') private httpOptions?: HttpOptions,
    ) {
        this.httpOptions = httpOptions || { timeout: 3000 };
    }
}
```

## Circular Dependencies

Sometimes two providers depend on each other. NestJS provides `forwardRef()` to handle this:

```typescript
// users.service.ts
import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { PostsService } from './posts.service';

@Injectable()
export class UsersService {
    constructor(
        @Inject(forwardRef(() => PostsService))
        private postsService: PostsService,
    ) {}
}

// posts.service.ts
import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';

@Injectable()
export class PostsService {
    constructor(
        @Inject(forwardRef(() => UsersService))
        private usersService: UsersService,
    ) {}
}
```

::: warning Avoid Circular Dependencies
Circular dependencies often indicate a design problem. Consider refactoring your code to avoid them when possible.
:::

## Complete Service Example

Here's a complete example of a well-structured service:

```typescript
// src/products/products.service.ts
import {
    Injectable,
    NotFoundException,
    BadRequestException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
    private products: Product[] = [];
    private idCounter = 1;

    /**
     * Create a new product
     */
    create(createProductDto: CreateProductDto): Product {
        // Validate unique name
        const existingProduct = this.products.find(
            p => p.name.toLowerCase() === createProductDto.name.toLowerCase(),
        );

        if (existingProduct) {
            throw new BadRequestException('Product with this name already exists');
        }

        const product: Product = {
            id: this.idCounter++,
            ...createProductDto,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        this.products.push(product);
        return product;
    }

    /**
     * Find all products with optional filtering
     */
    findAll(options?: {
        category?: string;
        minPrice?: number;
        maxPrice?: number;
        search?: string;
    }): Product[] {
        let result = [...this.products];

        if (options?.category) {
            result = result.filter(p => p.category === options.category);
        }

        if (options?.minPrice !== undefined) {
            result = result.filter(p => p.price >= options.minPrice);
        }

        if (options?.maxPrice !== undefined) {
            result = result.filter(p => p.price <= options.maxPrice);
        }

        if (options?.search) {
            const searchLower = options.search.toLowerCase();
            result = result.filter(
                p =>
                    p.name.toLowerCase().includes(searchLower) ||
                    p.description?.toLowerCase().includes(searchLower),
            );
        }

        return result;
    }

    /**
     * Find one product by ID
     */
    findOne(id: number): Product {
        const product = this.products.find(p => p.id === id);

        if (!product) {
            throw new NotFoundException(`Product with ID ${id} not found`);
        }

        return product;
    }

    /**
     * Update a product
     */
    update(id: number, updateProductDto: UpdateProductDto): Product {
        const product = this.findOne(id);

        // Check for duplicate name if name is being updated
        if (updateProductDto.name) {
            const existingProduct = this.products.find(
                p =>
                    p.id !== id &&
                    p.name.toLowerCase() === updateProductDto.name.toLowerCase(),
            );

            if (existingProduct) {
                throw new BadRequestException('Product with this name already exists');
            }
        }

        Object.assign(product, updateProductDto, { updatedAt: new Date() });
        return product;
    }

    /**
     * Remove a product
     */
    remove(id: number): void {
        const index = this.products.findIndex(p => p.id === id);

        if (index === -1) {
            throw new NotFoundException(`Product with ID ${id} not found`);
        }

        this.products.splice(index, 1);
    }

    /**
     * Get products by category
     */
    findByCategory(category: string): Product[] {
        return this.products.filter(p => p.category === category);
    }

    /**
     * Get product count
     */
    count(): number {
        return this.products.length;
    }

    /**
     * Check if product exists
     */
    exists(id: number): boolean {
        return this.products.some(p => p.id === id);
    }
}
```

## Service with External Dependencies

Here's an example of a service that depends on other services:

```typescript
// src/orders/orders.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { ProductsService } from '../products/products.service';
import { UsersService } from '../users/users.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class OrdersService {
    constructor(
        private readonly productsService: ProductsService,
        private readonly usersService: UsersService,
        private readonly notificationsService: NotificationsService,
    ) {}

    async createOrder(userId: number, productIds: number[]) {
        // Verify user exists
        const user = this.usersService.findOne(userId);
        if (!user) {
            throw new BadRequestException('User not found');
        }

        // Verify all products exist and calculate total
        const products = productIds.map(id => this.productsService.findOne(id));
        const total = products.reduce((sum, p) => sum + p.price, 0);

        // Create order
        const order = {
            id: Date.now(),
            userId,
            products,
            total,
            status: 'pending',
            createdAt: new Date(),
        };

        // Send notification
        await this.notificationsService.sendOrderConfirmation(user.email, order);

        return order;
    }
}
```

## Best Practices

### 1. Single Responsibility

Each service should have one responsibility:

```typescript
// ❌ Bad - Too many responsibilities
@Injectable()
export class UserService {
    createUser() {}
    sendEmail() {}
    processPayment() {}
    generateReport() {}
}

// ✅ Good - Single responsibility
@Injectable()
export class UserService {
    createUser() {}
    findUser() {}
    updateUser() {}
}

@Injectable()
export class EmailService {
    sendEmail() {}
}

@Injectable()
export class PaymentService {
    processPayment() {}
}
```

### 2. Use Interfaces for Abstraction

```typescript
// Define interface
export interface IUserRepository {
    findById(id: number): Promise<User>;
    save(user: User): Promise<User>;
}

// Implement interface
@Injectable()
export class UserRepository implements IUserRepository {
    async findById(id: number): Promise<User> {
        // Implementation
    }

    async save(user: User): Promise<User> {
        // Implementation
    }
}
```

### 3. Handle Errors in Services

```typescript
@Injectable()
export class UsersService {
    findOne(id: number): User {
        const user = this.users.find(u => u.id === id);
        if (!user) {
            throw new NotFoundException(`User #${id} not found`);
        }
        return user;
    }
}
```

### 4. Keep Services Stateless When Possible

```typescript
// ✅ Stateless service (preferred)
@Injectable()
export class CalculatorService {
    add(a: number, b: number): number {
        return a + b;
    }
}

// ⚠️ Stateful service (use carefully)
@Injectable()
export class CounterService {
    private count = 0;

    increment(): number {
        return ++this.count;
    }
}
```

## Summary

In this chapter, you learned:

- What providers and services are in NestJS
- How dependency injection works
- Different provider scopes (singleton, request, transient)
- Custom providers (value, class, factory, alias)
- Injection tokens (string, symbol, class)
- Handling optional and circular dependencies
- Best practices for creating services

## What's Next?

In the next chapter, we'll learn about [Modules](/guide/nestjs/04-modules) and understand:
- Module organization
- Feature modules
- Shared modules
- Dynamic modules

---

[Previous: Controllers](/guide/nestjs/02-controllers) | [Next: Modules →](/guide/nestjs/04-modules)
