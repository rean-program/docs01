# Middleware, Guards & Interceptors

NestJS provides several mechanisms for handling cross-cutting concerns in your application. This chapter covers middleware, guards, interceptors, and exception filters.

## Request Lifecycle

Understanding the order of execution is crucial. Every request goes through multiple layers:

```
┌─────────────────────────────────────────────────────────────────┐
│                    REQUEST LIFECYCLE                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  📥 Incoming Request                                             │
│         │                                                        │
│         ▼                                                        │
│  ┌─────────────────┐                                            │
│  │   Middleware    │ ← Logging, CORS, Body parsing              │
│  └────────┬────────┘                                            │
│           ▼                                                      │
│  ┌─────────────────┐                                            │
│  │     Guards      │ ← Authentication, Authorization            │
│  └────────┬────────┘   (Can block request here!)                │
│           ▼                                                      │
│  ┌─────────────────┐                                            │
│  │ Interceptors ⬇️  │ ← Transform request, Start timing          │
│  └────────┬────────┘                                            │
│           ▼                                                      │
│  ┌─────────────────┐                                            │
│  │     Pipes       │ ← Validation, Transformation               │
│  └────────┬────────┘                                            │
│           ▼                                                      │
│  ┌─────────────────┐                                            │
│  │   Controller    │ ← Your route handler                       │
│  │     ↓           │                                            │
│  │   Service       │ ← Business logic                           │
│  └────────┬────────┘                                            │
│           ▼                                                      │
│  ┌─────────────────┐                                            │
│  │ Interceptors ⬆️  │ ← Transform response, End timing          │
│  └────────┬────────┘                                            │
│           ▼                                                      │
│  ┌─────────────────┐                                            │
│  │Exception Filters│ ← Handle errors (if any thrown)            │
│  └────────┬────────┘                                            │
│           ▼                                                      │
│  📤 Response                                                     │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Quick Reference:**

| Layer | Purpose | Can Stop Request? |
|-------|---------|-------------------|
| Middleware | Logging, CORS, body parsing | Yes (`res.end()`) |
| Guards | Auth check | Yes (return `false`) |
| Interceptors (pre) | Transform request | Yes (throw error) |
| Pipes | Validate/transform data | Yes (validation error) |
| Controller | Handle request | - |
| Interceptors (post) | Transform response | - |
| Exception Filters | Handle errors | Catches thrown errors |

## Middleware

Middleware functions have access to the request and response objects, and the `next()` function. They can execute code, modify request/response, end the request-response cycle, or call the next middleware.

### Creating Middleware

```typescript
// src/common/middleware/logger.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        const start = Date.now();

        console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);

        res.on('finish', () => {
            const duration = Date.now() - start;
            console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - ${res.statusCode} (${duration}ms)`);
        });

        next();
    }
}
```

### Applying Middleware

Middleware is applied in the module's `configure` method:

```typescript
// src/app.module.ts
import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { UsersModule } from './users/users.module';

@Module({
    imports: [UsersModule],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(LoggerMiddleware)
            .forRoutes('*'); // Apply to all routes
    }
}
```

### Middleware Configuration Options

```typescript
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(LoggerMiddleware)
            // Apply to specific routes
            .forRoutes('users')

            // Apply to specific methods
            .forRoutes({ path: 'users', method: RequestMethod.GET })

            // Apply to multiple routes
            .forRoutes(
                { path: 'users', method: RequestMethod.GET },
                { path: 'products', method: RequestMethod.ALL },
            )

            // Apply to a controller
            .forRoutes(UsersController)

            // Exclude specific routes
            .exclude(
                { path: 'users/login', method: RequestMethod.POST },
                { path: 'users/register', method: RequestMethod.POST },
            )
            .forRoutes(UsersController);
    }
}
```

### Multiple Middleware

```typescript
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(CorsMiddleware, LoggerMiddleware, AuthMiddleware)
            .forRoutes('*');
    }
}
```

### Functional Middleware

For simple middleware, you can use a function:

```typescript
// src/common/middleware/simple-logger.middleware.ts
import { Request, Response, NextFunction } from 'express';

export function simpleLogger(req: Request, res: Response, next: NextFunction) {
    console.log(`Request: ${req.method} ${req.url}`);
    next();
}

// Apply in module
consumer.apply(simpleLogger).forRoutes('*');
```

### Global Middleware

Apply middleware globally in `main.ts`:

```typescript
// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as helmet from 'helmet';
import * as compression from 'compression';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Global middleware
    app.use(helmet());
    app.use(compression());

    await app.listen(3000);
}
bootstrap();
```

### Common Middleware Examples

#### CORS Middleware

```typescript
@Injectable()
export class CorsMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

        if (req.method === 'OPTIONS') {
            return res.sendStatus(200);
        }
        next();
    }
}
```

#### Request ID Middleware

```typescript
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        const requestId = req.headers['x-request-id'] || uuidv4();
        req['requestId'] = requestId;
        res.setHeader('X-Request-Id', requestId);
        next();
    }
}
```

## Guards

Guards determine whether a request will be handled by the route handler. They are commonly used for authentication and authorization.

```
┌─────────────────────────────────────────────────────────────────┐
│                         GUARDS                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Request → Guard checks → ✅ Pass → Continue to Controller      │
│                         → ❌ Fail → Return 403 Forbidden        │
│                                                                  │
│  Common Use Cases:                                               │
│  • Authentication: Is the user logged in?                       │
│  • Authorization: Does the user have permission?                │
│  • Role-based access: Is the user an admin?                     │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Creating a Guard

```typescript
// src/common/guards/auth.guard.ts
import {
    Injectable,
    CanActivate,
    ExecutionContext,
    UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const token = request.headers.authorization;

        if (!token) {
            throw new UnauthorizedException('No token provided');
        }

        // Validate token (simplified example)
        try {
            const user = this.validateToken(token);
            request.user = user;
            return true;
        } catch {
            throw new UnauthorizedException('Invalid token');
        }
    }

    private validateToken(token: string): any {
        // Token validation logic
        return { id: 1, email: 'user@example.com' };
    }
}
```

### Applying Guards

#### Controller Level

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../common/guards/auth.guard';

@Controller('users')
@UseGuards(AuthGuard) // Apply to all routes in controller
export class UsersController {
    @Get()
    findAll() {
        return 'Protected route';
    }
}
```

#### Method Level

```typescript
@Controller('users')
export class UsersController {
    @Get()
    findAll() {
        return 'Public route';
    }

    @Get('profile')
    @UseGuards(AuthGuard) // Apply to single route
    getProfile() {
        return 'Protected route';
    }
}
```

#### Global Level

```typescript
// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AuthGuard } from './common/guards/auth.guard';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalGuards(new AuthGuard());
    await app.listen(3000);
}
bootstrap();

// Or with dependency injection support
// src/app.module.ts
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './common/guards/auth.guard';

@Module({
    providers: [
        {
            provide: APP_GUARD,
            useClass: AuthGuard,
        },
    ],
})
export class AppModule {}
```

### Role-Based Guard

```typescript
// src/common/decorators/roles.decorator.ts
import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);

// src/common/guards/roles.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!requiredRoles) {
            return true; // No roles required, allow access
        }

        const { user } = context.switchToHttp().getRequest();
        return requiredRoles.some(role => user.roles?.includes(role));
    }
}

// Usage in controller
@Controller('admin')
@UseGuards(AuthGuard, RolesGuard)
export class AdminController {
    @Get('dashboard')
    @Roles('admin')
    getDashboard() {
        return 'Admin dashboard';
    }

    @Get('reports')
    @Roles('admin', 'manager')
    getReports() {
        return 'Reports';
    }
}
```

## Interceptors

Interceptors can transform the result returned from a function, extend the basic function behavior, or completely override a function.

```
┌─────────────────────────────────────────────────────────────────┐
│                       INTERCEPTORS                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Request  →  Interceptor BEFORE  →  Controller  →  Interceptor AFTER  →  Response
│                  │                                       │
│                  │                                       │
│              • Log start time                      • Log end time
│              • Transform request                   • Transform response
│              • Check cache                         • Cache response
│                                                                  │
│  Key Feature: Interceptors wrap around the handler!            │
│                                                                  │
│  Common Use Cases:                                               │
│  • Logging request/response                                     │
│  • Transforming response structure                              │
│  • Caching                                                       │
│  • Timeout handling                                              │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Creating an Interceptor

```typescript
// src/common/interceptors/logging.interceptor.ts
import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const method = request.method;
        const url = request.url;
        const now = Date.now();

        console.log(`Before: ${method} ${url}`);

        return next.handle().pipe(
            tap(() => console.log(`After: ${method} ${url} - ${Date.now() - now}ms`)),
        );
    }
}
```

### Transform Response Interceptor

```typescript
// src/common/interceptors/transform.interceptor.ts
import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
    success: boolean;
    data: T;
    timestamp: string;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
    intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
        return next.handle().pipe(
            map(data => ({
                success: true,
                data,
                timestamp: new Date().toISOString(),
            })),
        );
    }
}
```

### Cache Interceptor

```typescript
// src/common/interceptors/cache.interceptor.ts
import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class CacheInterceptor implements NestInterceptor {
    private cache = new Map<string, any>();

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const key = request.url;

        // Only cache GET requests
        if (request.method !== 'GET') {
            return next.handle();
        }

        const cachedResponse = this.cache.get(key);
        if (cachedResponse) {
            console.log(`Cache hit for ${key}`);
            return of(cachedResponse);
        }

        return next.handle().pipe(
            tap(response => {
                console.log(`Caching response for ${key}`);
                this.cache.set(key, response);
                // Clear cache after 60 seconds
                setTimeout(() => this.cache.delete(key), 60000);
            }),
        );
    }
}
```

### Timeout Interceptor

```typescript
// src/common/interceptors/timeout.interceptor.ts
import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    RequestTimeoutException,
} from '@nestjs/common';
import { Observable, throwError, TimeoutError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';

@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            timeout(5000), // 5 second timeout
            catchError(err => {
                if (err instanceof TimeoutError) {
                    return throwError(() => new RequestTimeoutException());
                }
                return throwError(() => err);
            }),
        );
    }
}
```

### Applying Interceptors

```typescript
// Controller level
@Controller('users')
@UseInterceptors(LoggingInterceptor)
export class UsersController {}

// Method level
@Get()
@UseInterceptors(CacheInterceptor)
findAll() {}

// Global level (main.ts)
app.useGlobalInterceptors(new TransformInterceptor());

// Global level with DI (app.module.ts)
@Module({
    providers: [
        {
            provide: APP_INTERCEPTOR,
            useClass: TransformInterceptor,
        },
    ],
})
export class AppModule {}
```

## Exception Filters

Exception filters handle errors thrown from your application and transform them into appropriate HTTP responses.

### Built-in HTTP Exceptions

```typescript
import {
    BadRequestException,
    UnauthorizedException,
    ForbiddenException,
    NotFoundException,
    ConflictException,
    InternalServerErrorException,
} from '@nestjs/common';

@Get(':id')
findOne(@Param('id') id: string) {
    const user = this.usersService.findOne(id);
    if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
}
```

### Creating Custom Exception Filter

```typescript
// src/common/filters/http-exception.filter.ts
import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = exception.getStatus();
        const exceptionResponse = exception.getResponse();

        const error =
            typeof exceptionResponse === 'string'
                ? { message: exceptionResponse }
                : (exceptionResponse as object);

        response.status(status).json({
            success: false,
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            method: request.method,
            ...error,
        });
    }
}
```

### Catch All Exceptions Filter

```typescript
// src/common/filters/all-exceptions.filter.ts
import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        const status =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        const message =
            exception instanceof HttpException
                ? exception.message
                : 'Internal server error';

        // Log the error
        console.error('Exception:', exception);

        response.status(status).json({
            success: false,
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            message,
        });
    }
}
```

### Custom Exceptions

```typescript
// src/common/exceptions/business.exception.ts
import { HttpException, HttpStatus } from '@nestjs/common';

export class BusinessException extends HttpException {
    constructor(message: string, errorCode: string) {
        super(
            {
                message,
                errorCode,
                error: 'Business Error',
            },
            HttpStatus.UNPROCESSABLE_ENTITY,
        );
    }
}

// Usage
throw new BusinessException('Insufficient funds', 'INSUFFICIENT_FUNDS');
```

### Applying Exception Filters

```typescript
// Controller level
@Controller('users')
@UseFilters(HttpExceptionFilter)
export class UsersController {}

// Method level
@Get()
@UseFilters(new HttpExceptionFilter())
findAll() {}

// Global level (main.ts)
app.useGlobalFilters(new AllExceptionsFilter());

// Global level with DI (app.module.ts)
@Module({
    providers: [
        {
            provide: APP_FILTER,
            useClass: AllExceptionsFilter,
        },
    ],
})
export class AppModule {}
```

## Combining Everything

Here's an example showing all concepts working together:

```typescript
// src/app.module.ts
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR, APP_FILTER } from '@nestjs/core';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { AuthGuard } from './common/guards/auth.guard';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { UsersModule } from './users/users.module';

@Module({
    imports: [UsersModule],
    providers: [
        // Global guard
        {
            provide: APP_GUARD,
            useClass: AuthGuard,
        },
        // Global interceptor
        {
            provide: APP_INTERCEPTOR,
            useClass: TransformInterceptor,
        },
        // Global exception filter
        {
            provide: APP_FILTER,
            useClass: AllExceptionsFilter,
        },
    ],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(LoggerMiddleware).forRoutes('*');
    }
}
```

## Execution Order Summary

| Component | When Executed | Use Case |
|-----------|---------------|----------|
| Middleware | First, before guards | Logging, CORS, body parsing |
| Guards | After middleware | Authentication, authorization |
| Interceptors (pre) | After guards, before handler | Transform request, caching |
| Pipes | Before handler | Validation, transformation |
| Handler | Main business logic | Controller method |
| Interceptors (post) | After handler | Transform response |
| Exception Filters | When exception is thrown | Error handling |

## Best Practices

### 1. Use Guards for Authorization

```typescript
// ✅ Good - Guard for auth
@UseGuards(AuthGuard, RolesGuard)
@Roles('admin')
@Delete(':id')
remove(@Param('id') id: string) {}

// ❌ Bad - Auth logic in controller
@Delete(':id')
remove(@Param('id') id: string, @Req() req: Request) {
    if (!req.user || !req.user.roles.includes('admin')) {
        throw new ForbiddenException();
    }
}
```

### 2. Use Interceptors for Response Transformation

```typescript
// ✅ Good - Interceptor for consistent response
@UseInterceptors(TransformInterceptor)
@Get()
findAll() {
    return this.service.findAll();
}
// Response: { success: true, data: [...], timestamp: '...' }

// ❌ Bad - Manual wrapping in each method
@Get()
findAll() {
    const data = this.service.findAll();
    return { success: true, data, timestamp: new Date().toISOString() };
}
```

### 3. Use Exception Filters for Error Handling

```typescript
// ✅ Good - Exception filter handles errors consistently
throw new NotFoundException('User not found');

// ❌ Bad - Manual error response in controller
@Get(':id')
findOne(@Param('id') id: string, @Res() res: Response) {
    const user = this.service.findOne(id);
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    return res.json(user);
}
```

## Summary

In this chapter, you learned:

- The request lifecycle in NestJS
- Creating and applying middleware
- Guards for authentication and authorization
- Interceptors for request/response transformation
- Exception filters for error handling
- Best practices for each component

## What's Next?

In the next chapter, we'll learn about [Pipes & Validation](/guide/nestjs/06-pipes) and understand:
- Built-in pipes
- Custom validation pipes
- Data transformation
- Using class-validator and class-transformer

---

[Previous: Modules](/guide/nestjs/04-modules) | [Next: Pipes & Validation →](/guide/nestjs/06-pipes)
