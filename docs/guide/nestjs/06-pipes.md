# Pipes & Validation

Pipes are a powerful feature in NestJS that transform input data or validate it. They run before the route handler and can ensure that your application receives clean, validated data.

## What is a Pipe?

A pipe is a class annotated with the `@Injectable()` decorator that implements the `PipeTransform` interface. Pipes have two typical use cases:

1. **Transformation**: Transform input data to the desired form
2. **Validation**: Evaluate input data and throw an exception if invalid

```
┌─────────────────────────────────────────────────────────────────┐
│                         PIPES                                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Request Data → Pipe → Controller                               │
│                  │                                               │
│                  ├── Transform: "/users/123" → 123 (number)     │
│                  │                                               │
│                  └── Validate: { email: "invalid" } → ❌ Error  │
│                                                                  │
│  Two Main Purposes:                                              │
│  1. TRANSFORMATION: Convert data types                          │
│     "123" → 123                                                  │
│     "true" → true                                                │
│                                                                  │
│  2. VALIDATION: Check data is valid                             │
│     { email: "test@example.com" } → ✅ Pass                     │
│     { email: "not-an-email" } → ❌ BadRequestException          │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

```typescript
import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class ExamplePipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {
        // Transform or validate the value
        return value;
    }
}
```

## Built-in Pipes

NestJS provides several built-in pipes:

| Pipe | Description | Input → Output |
|------|-------------|----------------|
| `ValidationPipe` | Validates using class-validator | DTO → Validated DTO |
| `ParseIntPipe` | String to integer | `"123"` → `123` |
| `ParseFloatPipe` | String to float | `"3.14"` → `3.14` |
| `ParseBoolPipe` | String to boolean | `"true"` → `true` |
| `ParseArrayPipe` | String to array | `"1,2,3"` → `[1,2,3]` |
| `ParseUUIDPipe` | Validates UUID | `"uuid-here"` → validated |
| `ParseEnumPipe` | Validates enum | `"ACTIVE"` → `Status.ACTIVE` |
| `DefaultValuePipe` | Provides defaults | `undefined` → `default` |

### ParseIntPipe

```typescript
import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';

@Controller('users')
export class UsersController {
    // GET /users/123 -> id is number 123
    // GET /users/abc -> throws BadRequestException
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        console.log(typeof id); // 'number'
        return this.usersService.findOne(id);
    }
}
```

### Custom Error Messages

```typescript
@Get(':id')
findOne(
    @Param('id', new ParseIntPipe({
        errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE,
        exceptionFactory: () => new BadRequestException('ID must be a number'),
    }))
    id: number,
) {
    return this.usersService.findOne(id);
}
```

### ParseUUIDPipe

```typescript
import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';

@Controller('products')
export class ProductsController {
    // Validates UUID format
    @Get(':uuid')
    findOne(@Param('uuid', ParseUUIDPipe) uuid: string) {
        return this.productsService.findOne(uuid);
    }

    // Specify UUID version
    @Get('v4/:uuid')
    findOneV4(@Param('uuid', new ParseUUIDPipe({ version: '4' })) uuid: string) {
        return this.productsService.findOne(uuid);
    }
}
```

### DefaultValuePipe

```typescript
import { Controller, Get, Query, DefaultValuePipe, ParseIntPipe } from '@nestjs/common';

@Controller('products')
export class ProductsController {
    @Get()
    findAll(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    ) {
        return this.productsService.findAll({ page, limit });
    }
}
```

### ParseEnumPipe

```typescript
import { Controller, Get, Param, ParseEnumPipe } from '@nestjs/common';

enum UserRole {
    Admin = 'admin',
    User = 'user',
    Guest = 'guest',
}

@Controller('users')
export class UsersController {
    @Get('role/:role')
    findByRole(@Param('role', new ParseEnumPipe(UserRole)) role: UserRole) {
        return this.usersService.findByRole(role);
    }
}
```

### ParseArrayPipe

```typescript
import { Controller, Get, Query, ParseArrayPipe } from '@nestjs/common';

@Controller('products')
export class ProductsController {
    // GET /products?ids=1,2,3
    @Get()
    findByIds(
        @Query('ids', new ParseArrayPipe({ items: Number, separator: ',' }))
        ids: number[],
    ) {
        return this.productsService.findByIds(ids);
    }
}
```

## Validation with class-validator

The most common use case for pipes is validation. NestJS integrates seamlessly with `class-validator` and `class-transformer`.

### Installation

```bash
npm install class-validator class-transformer
```

### Setting Up ValidationPipe

```typescript
// src/main.ts
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.useGlobalPipes(new ValidationPipe({
        whitelist: true,           // Strip non-whitelisted properties
        forbidNonWhitelisted: true, // Throw error for non-whitelisted properties
        transform: true,            // Auto-transform payloads to DTO instances
        transformOptions: {
            enableImplicitConversion: true, // Auto-convert primitive types
        },
    }));

    await app.listen(3000);
}
bootstrap();
```

### Creating DTOs with Validation

```typescript
// src/users/dto/create-user.dto.ts
import {
    IsString,
    IsEmail,
    IsNumber,
    IsOptional,
    MinLength,
    MaxLength,
    Min,
    Max,
    IsEnum,
    IsArray,
    ValidateNested,
    IsNotEmpty,
    Matches,
} from 'class-validator';
import { Type } from 'class-transformer';

enum UserRole {
    Admin = 'admin',
    User = 'user',
}

class AddressDto {
    @IsString()
    @IsNotEmpty()
    street: string;

    @IsString()
    @IsNotEmpty()
    city: string;

    @IsString()
    @IsNotEmpty()
    country: string;

    @IsString()
    @IsOptional()
    zipCode?: string;
}

export class CreateUserDto {
    @IsString()
    @MinLength(2)
    @MaxLength(50)
    name: string;

    @IsEmail()
    email: string;

    @IsString()
    @MinLength(8)
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
        message: 'Password must contain uppercase, lowercase and number',
    })
    password: string;

    @IsNumber()
    @Min(0)
    @Max(150)
    @IsOptional()
    age?: number;

    @IsEnum(UserRole)
    @IsOptional()
    role?: UserRole;

    @ValidateNested()
    @Type(() => AddressDto)
    @IsOptional()
    address?: AddressDto;

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    tags?: string[];
}
```

### Update DTO with Partial Validation

```typescript
// src/users/dto/update-user.dto.ts
import { PartialType, OmitType, PickType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

// All properties from CreateUserDto are optional
export class UpdateUserDto extends PartialType(CreateUserDto) {}

// Omit specific properties
export class UpdateProfileDto extends OmitType(CreateUserDto, ['password', 'role']) {}

// Pick only specific properties
export class UpdatePasswordDto extends PickType(CreateUserDto, ['password']) {}
```

### Using DTOs in Controllers

```typescript
// src/users/users.controller.ts
import { Controller, Post, Put, Body, Param, ParseIntPipe } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post()
    create(@Body() createUserDto: CreateUserDto) {
        // createUserDto is already validated and transformed
        return this.usersService.create(createUserDto);
    }

    @Put(':id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateUserDto: UpdateUserDto,
    ) {
        return this.usersService.update(id, updateUserDto);
    }
}
```

## Common Validation Decorators

### String Validators

```typescript
import {
    IsString,
    IsNotEmpty,
    MinLength,
    MaxLength,
    Contains,
    IsAlpha,
    IsAlphanumeric,
    IsLowercase,
    IsUppercase,
    Matches,
    IsUUID,
    IsJSON,
    IsUrl,
} from 'class-validator';

class StringValidationDto {
    @IsString()
    @IsNotEmpty()
    text: string;

    @MinLength(5)
    @MaxLength(100)
    description: string;

    @Contains('hello')
    greeting: string;

    @IsAlpha()
    name: string;

    @Matches(/^[a-zA-Z0-9_-]+$/)
    username: string;

    @IsUUID()
    id: string;

    @IsUrl()
    website: string;
}
```

### Number Validators

```typescript
import {
    IsNumber,
    IsInt,
    IsPositive,
    IsNegative,
    Min,
    Max,
    IsDivisibleBy,
} from 'class-validator';

class NumberValidationDto {
    @IsNumber()
    value: number;

    @IsInt()
    count: number;

    @IsPositive()
    price: number;

    @Min(0)
    @Max(100)
    percentage: number;

    @IsDivisibleBy(5)
    quantity: number;
}
```

### Date Validators

```typescript
import { IsDate, MinDate, MaxDate } from 'class-validator';
import { Type } from 'class-transformer';

class DateValidationDto {
    @IsDate()
    @Type(() => Date)
    createdAt: Date;

    @IsDate()
    @MinDate(new Date())
    @Type(() => Date)
    scheduledDate: Date;

    @IsDate()
    @MaxDate(new Date())
    @Type(() => Date)
    birthDate: Date;
}
```

### Array Validators

```typescript
import {
    IsArray,
    ArrayMinSize,
    ArrayMaxSize,
    ArrayUnique,
    ArrayContains,
    ArrayNotEmpty,
} from 'class-validator';

class ArrayValidationDto {
    @IsArray()
    @ArrayNotEmpty()
    @ArrayMinSize(1)
    @ArrayMaxSize(10)
    items: string[];

    @IsArray()
    @ArrayUnique()
    uniqueItems: number[];

    @IsArray()
    @ArrayContains(['admin'])
    roles: string[];
}
```

### Conditional Validation

```typescript
import { ValidateIf, IsNotEmpty, IsEmail } from 'class-validator';

class ConditionalDto {
    @IsNotEmpty()
    contactMethod: 'email' | 'phone';

    // Only validate email if contactMethod is 'email'
    @ValidateIf(o => o.contactMethod === 'email')
    @IsEmail()
    email: string;

    // Only validate phone if contactMethod is 'phone'
    @ValidateIf(o => o.contactMethod === 'phone')
    @IsNotEmpty()
    phone: string;
}
```

## Custom Validation Decorators

### Creating Custom Decorator

```typescript
// src/common/validators/is-unique.validator.ts
import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ async: true })
export class IsUniqueConstraint implements ValidatorConstraintInterface {
    async validate(value: any, args: ValidationArguments) {
        // Check if value is unique in database
        // This is simplified - you'd inject a service here
        return true;
    }

    defaultMessage(args: ValidationArguments) {
        return `${args.property} must be unique`;
    }
}

export function IsUnique(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsUniqueConstraint,
        });
    };
}

// Usage
class CreateUserDto {
    @IsUnique({ message: 'Email already exists' })
    @IsEmail()
    email: string;
}
```

### Custom Validator with Parameters

```typescript
// src/common/validators/match.validator.ts
import {
    registerDecorator,
    ValidationOptions,
    ValidationArguments,
} from 'class-validator';

export function Match(property: string, validationOptions?: ValidationOptions) {
    return (object: any, propertyName: string) => {
        registerDecorator({
            name: 'match',
            target: object.constructor,
            propertyName,
            constraints: [property],
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments) {
                    const [relatedPropertyName] = args.constraints;
                    const relatedValue = (args.object as any)[relatedPropertyName];
                    return value === relatedValue;
                },
                defaultMessage(args: ValidationArguments) {
                    const [relatedPropertyName] = args.constraints;
                    return `${propertyName} must match ${relatedPropertyName}`;
                },
            },
        });
    };
}

// Usage
class RegisterDto {
    @IsString()
    @MinLength(8)
    password: string;

    @Match('password', { message: 'Passwords do not match' })
    confirmPassword: string;
}
```

## Creating Custom Pipes

### Simple Transformation Pipe

```typescript
// src/common/pipes/parse-date.pipe.ts
import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParseDatePipe implements PipeTransform<string, Date> {
    transform(value: string): Date {
        const date = new Date(value);

        if (isNaN(date.getTime())) {
            throw new BadRequestException('Invalid date format');
        }

        return date;
    }
}

// Usage
@Get('events')
findByDate(@Query('date', ParseDatePipe) date: Date) {
    return this.eventsService.findByDate(date);
}
```

### Validation Pipe with Schema

```typescript
// src/common/pipes/joi-validation.pipe.ts
import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import * as Joi from 'joi';

@Injectable()
export class JoiValidationPipe implements PipeTransform {
    constructor(private schema: Joi.ObjectSchema) {}

    transform(value: any) {
        const { error, value: validatedValue } = this.schema.validate(value);

        if (error) {
            throw new BadRequestException(`Validation failed: ${error.message}`);
        }

        return validatedValue;
    }
}

// Usage
const createUserSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    age: Joi.number().min(0).max(150).optional(),
});

@Post()
@UsePipes(new JoiValidationPipe(createUserSchema))
create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
}
```

### Trim and Sanitize Pipe

```typescript
// src/common/pipes/trim.pipe.ts
import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class TrimPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {
        if (typeof value === 'string') {
            return value.trim();
        }

        if (typeof value === 'object' && value !== null) {
            return this.trimObject(value);
        }

        return value;
    }

    private trimObject(obj: Record<string, any>): Record<string, any> {
        const result: Record<string, any> = {};

        for (const key of Object.keys(obj)) {
            const value = obj[key];
            if (typeof value === 'string') {
                result[key] = value.trim();
            } else if (typeof value === 'object' && value !== null) {
                result[key] = this.trimObject(value);
            } else {
                result[key] = value;
            }
        }

        return result;
    }
}
```

## Data Transformation with class-transformer

### Basic Transformations

```typescript
import { Expose, Exclude, Transform, Type } from 'class-transformer';

class UserResponseDto {
    @Expose()
    id: number;

    @Expose()
    name: string;

    @Expose()
    email: string;

    @Exclude() // Hide password in response
    password: string;

    @Transform(({ value }) => value.toISOString())
    createdAt: Date;

    @Type(() => AddressDto)
    address: AddressDto;
}
```

### Transform on Input

```typescript
import { Transform } from 'class-transformer';
import { IsString, IsEmail } from 'class-validator';

class CreateUserDto {
    @IsString()
    @Transform(({ value }) => value.trim().toLowerCase())
    username: string;

    @IsEmail()
    @Transform(({ value }) => value.toLowerCase())
    email: string;

    @Transform(({ value }) => value ? new Date(value) : null)
    birthDate: Date;
}
```

### Serialization in Controllers

```typescript
import {
    Controller,
    Get,
    UseInterceptors,
    ClassSerializerInterceptor,
    SerializeOptions,
} from '@nestjs/common';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
    @Get()
    @SerializeOptions({ groups: ['user'] })
    findAll() {
        return this.usersService.findAll();
    }

    @Get('admin')
    @SerializeOptions({ groups: ['admin'] })
    findAllAdmin() {
        return this.usersService.findAll();
    }
}

// Entity with groups
class User {
    @Expose({ groups: ['user', 'admin'] })
    id: number;

    @Expose({ groups: ['user', 'admin'] })
    name: string;

    @Expose({ groups: ['admin'] }) // Only visible to admin
    email: string;

    @Exclude()
    password: string;
}
```

## Validation Pipe Options

```typescript
app.useGlobalPipes(new ValidationPipe({
    // Remove non-decorated properties
    whitelist: true,

    // Throw error for non-whitelisted properties
    forbidNonWhitelisted: true,

    // Auto-transform to DTO class instance
    transform: true,

    // Transform primitive types (string to number, etc.)
    transformOptions: {
        enableImplicitConversion: true,
    },

    // Disable detailed error messages in production
    disableErrorMessages: process.env.NODE_ENV === 'production',

    // Custom error factory
    exceptionFactory: (errors) => {
        const messages = errors.map(error => ({
            field: error.property,
            errors: Object.values(error.constraints || {}),
        }));
        return new BadRequestException({
            statusCode: 400,
            message: 'Validation failed',
            errors: messages,
        });
    },

    // Validate nested objects
    validateCustomDecorators: true,

    // Stop at first error
    stopAtFirstError: true,
}));
```

## Complete Validation Example

```typescript
// src/products/dto/create-product.dto.ts
import {
    IsString,
    IsNumber,
    IsOptional,
    IsPositive,
    IsArray,
    ValidateNested,
    IsEnum,
    Min,
    MaxLength,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';

enum ProductCategory {
    Electronics = 'electronics',
    Clothing = 'clothing',
    Books = 'books',
}

class ProductVariantDto {
    @IsString()
    @MaxLength(50)
    name: string;

    @IsNumber()
    @IsPositive()
    price: number;

    @IsNumber()
    @Min(0)
    stock: number;
}

export class CreateProductDto {
    @IsString()
    @MaxLength(100)
    @Transform(({ value }) => value.trim())
    name: string;

    @IsString()
    @IsOptional()
    @MaxLength(1000)
    description?: string;

    @IsNumber({ maxDecimalPlaces: 2 })
    @IsPositive()
    price: number;

    @IsEnum(ProductCategory)
    category: ProductCategory;

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    tags?: string[];

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ProductVariantDto)
    @IsOptional()
    variants?: ProductVariantDto[];
}

// src/products/products.controller.ts
@Controller('products')
export class ProductsController {
    @Post()
    create(@Body() createProductDto: CreateProductDto) {
        // All data is validated and transformed
        return this.productsService.create(createProductDto);
    }

    @Get()
    findAll(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
        @Query('category', new ParseEnumPipe(ProductCategory, { optional: true }))
        category?: ProductCategory,
    ) {
        return this.productsService.findAll({ page, limit, category });
    }
}
```

## Summary

In this chapter, you learned:

- Built-in pipes for parsing and transformation
- Setting up global validation with ValidationPipe
- Creating DTOs with class-validator decorators
- Common validation decorators for different data types
- Creating custom validation decorators
- Building custom pipes
- Data transformation with class-transformer
- Validation pipe configuration options

## What's Next?

In the next chapter, we'll learn about [Database Integration](/guide/nestjs/07-database) and understand:
- TypeORM integration
- Prisma ORM setup
- MongoDB with Mongoose
- Database migrations and seeding

---

[Previous: Middleware](/guide/nestjs/05-middleware) | [Next: Database Integration →](/guide/nestjs/07-database)
