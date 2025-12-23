# Modules

Modules are the fundamental building blocks of NestJS applications. They help organize your application into cohesive blocks of functionality, making your code more maintainable and scalable.

## What is a Module?

A module is a class annotated with the `@Module()` decorator. The decorator provides metadata that NestJS uses to organize the application structure.

```
┌─────────────────────────────────────────────────────────────────┐
│                    MODULE ARCHITECTURE                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                    AppModule (Root)                      │    │
│  │                                                         │    │
│  │    imports: [UsersModule, ProductsModule, OrdersModule] │    │
│  └────────────────────────┬────────────────────────────────┘    │
│                           │                                      │
│      ┌────────────────────┼────────────────────┐                │
│      │                    │                    │                │
│      ▼                    ▼                    ▼                │
│  ┌─────────┐        ┌─────────┐        ┌─────────┐             │
│  │ Users   │        │Products │        │ Orders  │             │
│  │ Module  │        │ Module  │        │ Module  │             │
│  │         │        │         │        │         │             │
│  │Controller│       │Controller│       │Controller│             │
│  │Service  │        │Service  │        │Service  │             │
│  └─────────┘        └─────────┘        └─────────┘             │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

```typescript
import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
    imports: [],                    // Other modules this module depends on
    controllers: [UsersController], // Controllers in this module
    providers: [UsersService],      // Providers in this module
    exports: [UsersService],        // Providers to export
})
export class UsersModule {}
```

## Module Properties

| Property | Description | Example |
|----------|-------------|---------|
| `imports` | Other modules this module depends on | `[DatabaseModule, ConfigModule]` |
| `controllers` | Controllers that handle HTTP requests | `[UsersController]` |
| `providers` | Services, repositories, factories | `[UsersService, UsersRepository]` |
| `exports` | Providers to share with other modules | `[UsersService]` |

**Think of it like:**
- `imports` = "I need these modules"
- `providers` = "Here's what I have"
- `exports` = "Here's what I'll share"
- `controllers` = "Here's who handles requests"

## Creating a Module

### Using the CLI

```bash
# Generate a module
nest generate module users
# Shorthand
nest g mo users

# This creates:
# src/users/users.module.ts
```

### Manual Creation

```typescript
// src/users/users.module.ts
import { Module } from '@nestjs/common';

@Module({})
export class UsersModule {}
```

## The Root Module

Every NestJS application has at least one module: the root module (usually `AppModule`). This is the starting point NestJS uses to build the application graph.

```typescript
// src/app.module.ts
import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';

@Module({
    imports: [
        UsersModule,
        ProductsModule,
        OrdersModule,
    ],
})
export class AppModule {}
```

## Feature Modules

Feature modules organize code related to a specific feature, keeping code organized and establishing clear boundaries.

### Example: Users Feature Module

```
src/
└── users/
    ├── users.module.ts
    ├── users.controller.ts
    ├── users.service.ts
    ├── dto/
    │   ├── create-user.dto.ts
    │   └── update-user.dto.ts
    └── entities/
        └── user.entity.ts
```

```typescript
// src/users/users.module.ts
import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
    controllers: [UsersController],
    providers: [UsersService],
    exports: [UsersService], // Export for use in other modules
})
export class UsersModule {}
```

### Example: Products Feature Module

```typescript
// src/products/products.module.ts
import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

@Module({
    controllers: [ProductsController],
    providers: [ProductsService],
    exports: [ProductsService],
})
export class ProductsModule {}
```

## Shared Modules

Shared modules contain providers that are used across multiple modules. Every module in NestJS is a shared module by default once you export its providers.

```typescript
// src/shared/shared.module.ts
import { Module } from '@nestjs/common';
import { LoggerService } from './logger.service';
import { ConfigService } from './config.service';
import { HelperService } from './helper.service';

@Module({
    providers: [LoggerService, ConfigService, HelperService],
    exports: [LoggerService, ConfigService, HelperService],
})
export class SharedModule {}
```

Using the shared module:

```typescript
// src/users/users.module.ts
import { Module } from '@nestjs/common';
import { SharedModule } from '../shared/shared.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
    imports: [SharedModule], // Import shared module
    controllers: [UsersController],
    providers: [UsersService],
})
export class UsersModule {}
```

Now `UsersService` can inject `LoggerService`, `ConfigService`, or `HelperService`:

```typescript
// src/users/users.service.ts
import { Injectable } from '@nestjs/common';
import { LoggerService } from '../shared/logger.service';

@Injectable()
export class UsersService {
    constructor(private readonly logger: LoggerService) {}

    findAll() {
        this.logger.log('Finding all users');
        return [];
    }
}
```

## Module Re-exporting

A module can re-export modules it imports:

```typescript
// src/common/common.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '../config/config.module';
import { LoggerModule } from '../logger/logger.module';

@Module({
    imports: [ConfigModule, LoggerModule],
    exports: [ConfigModule, LoggerModule], // Re-export both modules
})
export class CommonModule {}
```

Now any module that imports `CommonModule` will have access to providers from both `ConfigModule` and `LoggerModule`.

## Dependency Injection Across Modules

One of the key patterns in NestJS is sharing providers between modules. Here's how it works:

```
┌─────────────────────────────────────────────────────────────────┐
│            SHARING PROVIDERS BETWEEN MODULES                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  DatabaseModule                    UsersModule                   │
│  ┌───────────────────┐            ┌───────────────────┐         │
│  │                   │            │                   │         │
│  │  providers:       │            │  imports:         │         │
│  │    [DbService]    │──export──►│    [DatabaseModule]│         │
│  │                   │            │                   │         │
│  │  exports:         │            │  providers:       │         │
│  │    [DbService]    │            │    [UsersService] │         │
│  │       ↑           │            │        │          │         │
│  │       │           │            │        ▼          │         │
│  │  Must export!     │            │  UsersService can │         │
│  │                   │            │  inject DbService │         │
│  └───────────────────┘            └───────────────────┘         │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Module A exports a provider

```typescript
// src/database/database.module.ts
import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';

@Module({
    providers: [DatabaseService],
    exports: [DatabaseService], // ← IMPORTANT: Make available to other modules
})
export class DatabaseModule {}
```

### Module B imports Module A

```typescript
// src/users/users.module.ts
import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { UsersService } from './users.service';

@Module({
    imports: [DatabaseModule], // ← Import DatabaseModule to access its exports
    providers: [UsersService],
})
export class UsersModule {}
```

### Service in Module B uses provider from Module A

```typescript
// src/users/users.service.ts
import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class UsersService {
    constructor(private readonly db: DatabaseService) {} // ← Now we can inject it!

    async findAll() {
        return this.db.query('SELECT * FROM users');
    }
}
```

**Common Mistake:**
```typescript
// ❌ Forgot to export - UsersModule can't inject DatabaseService!
@Module({
    providers: [DatabaseService],
    // exports: [DatabaseService],  ← Missing export!
})
export class DatabaseModule {}

// ❌ Forgot to import - UsersModule doesn't know about DatabaseModule!
@Module({
    // imports: [DatabaseModule],  ← Missing import!
    providers: [UsersService],
})
export class UsersModule {}
```

## Global Modules

If you need to import the same module everywhere, you can make it global using `@Global()`:

```typescript
// src/database/database.module.ts
import { Module, Global } from '@nestjs/common';
import { DatabaseService } from './database.service';

@Global() // Makes this module available everywhere
@Module({
    providers: [DatabaseService],
    exports: [DatabaseService],
})
export class DatabaseModule {}
```

Now `DatabaseService` is available in all modules without explicitly importing `DatabaseModule`:

```typescript
// src/app.module.ts
import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';

@Module({
    imports: [
        DatabaseModule, // Import once in root module
        UsersModule,
    ],
})
export class AppModule {}

// src/users/users.module.ts - No need to import DatabaseModule!
@Module({
    providers: [UsersService],
})
export class UsersModule {}
```

::: warning Use Global Modules Sparingly
Global modules should be used sparingly. Making everything global can make your application harder to understand and maintain. Reserve global modules for truly application-wide concerns like database connections, configuration, or logging.
:::

## Dynamic Modules

Dynamic modules allow you to create customizable modules that can be configured differently depending on where they're imported.

```
┌─────────────────────────────────────────────────────────────────┐
│                     DYNAMIC MODULES                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Static Module:                                                  │
│    @Module({ ... })                                              │
│    Same configuration everywhere                                 │
│                                                                  │
│  Dynamic Module:                                                 │
│    ConfigModule.forRoot({ folder: './config' })                 │
│    Different configuration per usage!                            │
│                                                                  │
│  Common patterns:                                                │
│    • forRoot()     - One-time setup in AppModule                │
│    • forRootAsync()- Async setup (needs other providers)        │
│    • forFeature()  - Per-feature configuration                  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Basic Dynamic Module

```typescript
// src/config/config.module.ts
import { Module, DynamicModule } from '@nestjs/common';
import { ConfigService } from './config.service';

@Module({})
export class ConfigModule {
    static forRoot(options: { folder: string }): DynamicModule {
        return {
            module: ConfigModule,
            providers: [
                {
                    provide: 'CONFIG_OPTIONS',
                    useValue: options,
                },
                ConfigService,
            ],
            exports: [ConfigService],
        };
    }
}
```

```typescript
// src/config/config.service.ts
import { Injectable, Inject } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ConfigService {
    private config: Record<string, any>;

    constructor(@Inject('CONFIG_OPTIONS') private options: { folder: string }) {
        const configPath = path.join(process.cwd(), options.folder, 'config.json');
        this.config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    }

    get(key: string): any {
        return this.config[key];
    }
}
```

Using the dynamic module:

```typescript
// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';

@Module({
    imports: [
        ConfigModule.forRoot({ folder: './config' }),
    ],
})
export class AppModule {}
```

### forRoot vs forRootAsync

Use `forRootAsync` when configuration depends on other providers:

```typescript
// src/database/database.module.ts
import { Module, DynamicModule } from '@nestjs/common';
import { DatabaseService } from './database.service';

interface DatabaseOptions {
    host: string;
    port: number;
    database: string;
}

interface DatabaseAsyncOptions {
    imports?: any[];
    useFactory: (...args: any[]) => Promise<DatabaseOptions> | DatabaseOptions;
    inject?: any[];
}

@Module({})
export class DatabaseModule {
    // Synchronous configuration
    static forRoot(options: DatabaseOptions): DynamicModule {
        return {
            module: DatabaseModule,
            providers: [
                {
                    provide: 'DATABASE_OPTIONS',
                    useValue: options,
                },
                DatabaseService,
            ],
            exports: [DatabaseService],
        };
    }

    // Asynchronous configuration
    static forRootAsync(options: DatabaseAsyncOptions): DynamicModule {
        return {
            module: DatabaseModule,
            imports: options.imports || [],
            providers: [
                {
                    provide: 'DATABASE_OPTIONS',
                    useFactory: options.useFactory,
                    inject: options.inject || [],
                },
                DatabaseService,
            ],
            exports: [DatabaseService],
        };
    }
}
```

Using async configuration:

```typescript
// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';

@Module({
    imports: [
        ConfigModule.forRoot(),
        DatabaseModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                host: configService.get('DB_HOST'),
                port: configService.get('DB_PORT'),
                database: configService.get('DB_NAME'),
            }),
            inject: [ConfigService],
        }),
    ],
})
export class AppModule {}
```

### forFeature Pattern

Often used for registering entities or features specific to a module:

```typescript
// src/typeorm/typeorm.module.ts
import { Module, DynamicModule } from '@nestjs/common';
import { TypeOrmCoreModule } from './typeorm-core.module';

@Module({})
export class TypeOrmModule {
    // Called once in AppModule
    static forRoot(options: TypeOrmOptions): DynamicModule {
        return {
            module: TypeOrmModule,
            imports: [TypeOrmCoreModule.forRoot(options)],
        };
    }

    // Called in feature modules
    static forFeature(entities: any[]): DynamicModule {
        return {
            module: TypeOrmModule,
            providers: entities.map(entity => ({
                provide: `${entity.name}Repository`,
                useFactory: (connection) => connection.getRepository(entity),
                inject: ['DATABASE_CONNECTION'],
            })),
            exports: entities.map(entity => `${entity.name}Repository`),
        };
    }
}
```

Using forFeature:

```typescript
// src/users/users.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '../typeorm/typeorm.module';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    providers: [UsersService],
})
export class UsersModule {}
```

## Circular Module Dependencies

Sometimes modules need to depend on each other. Use `forwardRef()` to handle this:

```typescript
// src/users/users.module.ts
import { Module, forwardRef } from '@nestjs/common';
import { PostsModule } from '../posts/posts.module';
import { UsersService } from './users.service';

@Module({
    imports: [forwardRef(() => PostsModule)],
    providers: [UsersService],
    exports: [UsersService],
})
export class UsersModule {}

// src/posts/posts.module.ts
import { Module, forwardRef } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { PostsService } from './posts.service';

@Module({
    imports: [forwardRef(() => UsersModule)],
    providers: [PostsService],
    exports: [PostsService],
})
export class PostsModule {}
```

::: warning Avoid Circular Dependencies
Circular dependencies between modules often indicate a design issue. Consider extracting shared functionality into a separate module.
:::

## Module Organization Best Practices

### 1. Feature-Based Structure

```
src/
├── app.module.ts
├── common/                 # Shared utilities
│   ├── common.module.ts
│   ├── decorators/
│   ├── filters/
│   ├── guards/
│   └── pipes/
├── config/                 # Configuration
│   ├── config.module.ts
│   └── config.service.ts
├── database/              # Database connection
│   ├── database.module.ts
│   └── database.service.ts
├── users/                 # User feature
│   ├── users.module.ts
│   ├── users.controller.ts
│   ├── users.service.ts
│   ├── dto/
│   └── entities/
├── products/              # Product feature
│   ├── products.module.ts
│   ├── products.controller.ts
│   ├── products.service.ts
│   ├── dto/
│   └── entities/
└── orders/                # Order feature
    ├── orders.module.ts
    ├── orders.controller.ts
    ├── orders.service.ts
    ├── dto/
    └── entities/
```

### 2. Keep Modules Focused

```typescript
// ❌ Bad - Module does too much
@Module({
    controllers: [
        UsersController,
        AuthController,
        ProfileController,
        SettingsController,
    ],
    providers: [
        UsersService,
        AuthService,
        ProfileService,
        SettingsService,
        EmailService,
        SmsService,
    ],
})
export class UsersModule {}

// ✅ Good - Separate modules by feature
@Module({
    imports: [AuthModule, ProfileModule, SettingsModule],
    controllers: [UsersController],
    providers: [UsersService],
})
export class UsersModule {}
```

### 3. Export Only What's Needed

```typescript
// ❌ Bad - Exporting internal implementation
@Module({
    providers: [UsersService, UserValidator, UserMapper],
    exports: [UsersService, UserValidator, UserMapper], // Too much exposure
})
export class UsersModule {}

// ✅ Good - Export only public API
@Module({
    providers: [UsersService, UserValidator, UserMapper],
    exports: [UsersService], // Only export the main service
})
export class UsersModule {}
```

## Complete Module Example

Here's a complete example showing multiple modules working together:

```typescript
// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';

@Module({
    imports: [
        // Global configuration
        ConfigModule.forRoot({ isGlobal: true }),

        // Database connection
        DatabaseModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (config) => ({
                host: config.get('DB_HOST'),
                port: config.get('DB_PORT'),
            }),
            inject: [ConfigService],
        }),

        // Feature modules
        AuthModule,
        UsersModule,
        ProductsModule,
    ],
})
export class AppModule {}
```

```typescript
// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
    imports: [
        UsersModule, // Import UsersModule to use UsersService
        JwtModule.register({
            secret: 'your-secret-key',
            signOptions: { expiresIn: '1h' },
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy],
    exports: [AuthService], // Export for other modules if needed
})
export class AuthModule {}
```

## Summary

In this chapter, you learned:

- What modules are and their properties
- How to create feature modules
- Shared modules and re-exporting
- Global modules and when to use them
- Dynamic modules with `forRoot` and `forRootAsync`
- Handling circular module dependencies
- Best practices for module organization

## What's Next?

In the next chapter, we'll learn about [Middleware](/guide/nestjs/05-middleware) and understand:
- Creating and applying middleware
- Guards for authorization
- Interceptors for transforming responses
- Exception filters for error handling

---

[Previous: Providers & Services](/guide/nestjs/03-providers) | [Next: Middleware →](/guide/nestjs/05-middleware)
