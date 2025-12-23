# Authentication

Authentication is a critical part of most applications. This chapter covers implementing authentication in NestJS using JWT, Passport, and guards.

## Authentication Overview

NestJS supports multiple authentication strategies through Passport.js integration:

- **JWT (JSON Web Tokens)** - Stateless token-based auth
- **Local Strategy** - Username/password authentication
- **OAuth2** - Third-party authentication (Google, GitHub, etc.)
- **Session-based** - Traditional session authentication

## Setting Up JWT Authentication

### Installation

```bash
npm install @nestjs/passport @nestjs/jwt passport passport-jwt passport-local
npm install -D @types/passport-jwt @types/passport-local
npm install bcrypt
npm install -D @types/bcrypt
```

### Project Structure

```
src/
├── auth/
│   ├── auth.module.ts
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── strategies/
│   │   ├── jwt.strategy.ts
│   │   └── local.strategy.ts
│   ├── guards/
│   │   ├── jwt-auth.guard.ts
│   │   └── local-auth.guard.ts
│   ├── decorators/
│   │   ├── current-user.decorator.ts
│   │   └── public.decorator.ts
│   └── dto/
│       ├── login.dto.ts
│       └── register.dto.ts
└── users/
    ├── users.module.ts
    ├── users.service.ts
    └── entities/
        └── user.entity.ts
```

### Auth Module

```typescript
// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { UsersModule } from '../users/users.module';

@Module({
    imports: [
        UsersModule,
        PassportModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                secret: configService.get('JWT_SECRET'),
                signOptions: {
                    expiresIn: configService.get('JWT_EXPIRATION', '1h'),
                },
            }),
            inject: [ConfigService],
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, LocalStrategy, JwtStrategy],
    exports: [AuthService],
})
export class AuthModule {}
```

### Auth Service

```typescript
// src/auth/auth.service.ts
import {
    Injectable,
    UnauthorizedException,
    ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) {}

    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.usersService.findByEmail(email);

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const { password: _, ...result } = user;
        return result;
    }

    async login(user: any) {
        const payload = {
            email: user.email,
            sub: user.id,
            role: user.role,
        };

        return {
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
            },
            accessToken: this.jwtService.sign(payload),
            refreshToken: this.jwtService.sign(payload, { expiresIn: '7d' }),
        };
    }

    async register(registerDto: RegisterDto) {
        // Check if user exists
        const existingUser = await this.usersService.findByEmail(registerDto.email);

        if (existingUser) {
            throw new ConflictException('Email already registered');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(registerDto.password, 10);

        // Create user
        const user = await this.usersService.create({
            ...registerDto,
            password: hashedPassword,
        });

        // Return tokens
        return this.login(user);
    }

    async refreshToken(refreshToken: string) {
        try {
            const payload = this.jwtService.verify(refreshToken);
            const user = await this.usersService.findOne(payload.sub);

            if (!user) {
                throw new UnauthorizedException('Invalid token');
            }

            return this.login(user);
        } catch {
            throw new UnauthorizedException('Invalid refresh token');
        }
    }
}
```

### Local Strategy

```typescript
// src/auth/strategies/local.strategy.ts
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        super({
            usernameField: 'email', // Use email instead of username
        });
    }

    async validate(email: string, password: string): Promise<any> {
        const user = await this.authService.validateUser(email, password);

        if (!user) {
            throw new UnauthorizedException();
        }

        return user;
    }
}
```

### JWT Strategy

```typescript
// src/auth/strategies/jwt.strategy.ts
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private configService: ConfigService,
        private usersService: UsersService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get('JWT_SECRET'),
        });
    }

    async validate(payload: any) {
        const user = await this.usersService.findOne(payload.sub);

        if (!user) {
            throw new UnauthorizedException();
        }

        return {
            id: payload.sub,
            email: payload.email,
            role: payload.role,
        };
    }
}
```

### Auth Guards

```typescript
// src/auth/guards/local-auth.guard.ts
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}

// src/auth/guards/jwt-auth.guard.ts
import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(private reflector: Reflector) {
        super();
    }

    canActivate(context: ExecutionContext) {
        // Check if route is marked as public
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (isPublic) {
            return true;
        }

        return super.canActivate(context);
    }
}
```

### Custom Decorators

```typescript
// src/auth/decorators/public.decorator.ts
import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

// src/auth/decorators/current-user.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
    (data: string | undefined, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        const user = request.user;

        return data ? user?.[data] : user;
    },
);

// src/auth/decorators/roles.decorator.ts
import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
```

### DTOs

```typescript
// src/auth/dto/login.dto.ts
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(8)
    password: string;
}

// src/auth/dto/register.dto.ts
import { IsEmail, IsString, MinLength, MaxLength, Matches } from 'class-validator';

export class RegisterDto {
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
}
```

### Auth Controller

```typescript
// src/auth/auth.controller.ts
import {
    Controller,
    Post,
    Body,
    UseGuards,
    Get,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Public } from './decorators/public.decorator';
import { CurrentUser } from './decorators/current-user.decorator';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Public()
    @UseGuards(LocalAuthGuard)
    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@CurrentUser() user: any, @Body() loginDto: LoginDto) {
        return this.authService.login(user);
    }

    @Public()
    @Post('register')
    async register(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto);
    }

    @Public()
    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    async refresh(@Body('refreshToken') refreshToken: string) {
        return this.authService.refreshToken(refreshToken);
    }

    @Get('profile')
    getProfile(@CurrentUser() user: any) {
        return user;
    }
}
```

### Global JWT Guard

```typescript
// src/app.module.ts
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { AuthModule } from './auth/auth.module';

@Module({
    imports: [AuthModule],
    providers: [
        {
            provide: APP_GUARD,
            useClass: JwtAuthGuard,
        },
    ],
})
export class AppModule {}
```

## Role-Based Access Control (RBAC)

### Roles Guard

```typescript
// src/auth/guards/roles.guard.ts
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
            return true;
        }

        const { user } = context.switchToHttp().getRequest();
        return requiredRoles.some(role => user.role === role);
    }
}
```

### Using Roles

```typescript
// src/users/users.controller.ts
import { Controller, Get, Delete, Param, UseGuards } from '@nestjs/common';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';

@Controller('users')
@UseGuards(RolesGuard)
export class UsersController {
    @Get()
    @Roles('admin', 'user')
    findAll() {
        return this.usersService.findAll();
    }

    @Delete(':id')
    @Roles('admin') // Only admins can delete
    remove(@Param('id') id: string) {
        return this.usersService.remove(id);
    }
}
```

## OAuth2 Authentication

### Google OAuth

```bash
npm install passport-google-oauth20
npm install -D @types/passport-google-oauth20
```

```typescript
// src/auth/strategies/google.strategy.ts
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor(
        private configService: ConfigService,
        private authService: AuthService,
    ) {
        super({
            clientID: configService.get('GOOGLE_CLIENT_ID'),
            clientSecret: configService.get('GOOGLE_CLIENT_SECRET'),
            callbackURL: configService.get('GOOGLE_CALLBACK_URL'),
            scope: ['email', 'profile'],
        });
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: any,
        done: VerifyCallback,
    ): Promise<any> {
        const { name, emails, photos } = profile;

        const user = {
            email: emails[0].value,
            name: `${name.givenName} ${name.familyName}`,
            picture: photos[0].value,
            accessToken,
        };

        done(null, user);
    }
}

// src/auth/guards/google-auth.guard.ts
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {}
```

```typescript
// src/auth/auth.controller.ts
@Controller('auth')
export class AuthController {
    @Public()
    @Get('google')
    @UseGuards(GoogleAuthGuard)
    googleAuth() {}

    @Public()
    @Get('google/callback')
    @UseGuards(GoogleAuthGuard)
    async googleAuthRedirect(@CurrentUser() user: any, @Res() res: Response) {
        const tokens = await this.authService.socialLogin(user);
        // Redirect to frontend with tokens
        res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${tokens.accessToken}`);
    }
}
```

## Password Reset

### Password Reset Service

```typescript
// src/auth/auth.service.ts
@Injectable()
export class AuthService {
    async forgotPassword(email: string) {
        const user = await this.usersService.findByEmail(email);

        if (!user) {
            // Don't reveal if user exists
            return { message: 'If email exists, reset link will be sent' };
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

        await this.usersService.setResetToken(user.id, resetToken, resetTokenExpiry);

        // Send email
        await this.mailService.sendPasswordReset(email, resetToken);

        return { message: 'If email exists, reset link will be sent' };
    }

    async resetPassword(token: string, newPassword: string) {
        const user = await this.usersService.findByResetToken(token);

        if (!user || user.resetTokenExpiry < new Date()) {
            throw new BadRequestException('Invalid or expired reset token');
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await this.usersService.updatePassword(user.id, hashedPassword);
        await this.usersService.clearResetToken(user.id);

        return { message: 'Password reset successfully' };
    }
}
```

### Password Reset DTOs

```typescript
// src/auth/dto/forgot-password.dto.ts
import { IsEmail } from 'class-validator';

export class ForgotPasswordDto {
    @IsEmail()
    email: string;
}

// src/auth/dto/reset-password.dto.ts
import { IsString, MinLength, Matches } from 'class-validator';

export class ResetPasswordDto {
    @IsString()
    token: string;

    @IsString()
    @MinLength(8)
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    password: string;
}
```

## Best Practices

### 1. Never Store Plain Passwords

```typescript
// ✅ Good
const hashedPassword = await bcrypt.hash(password, 10);
await this.usersService.create({ ...dto, password: hashedPassword });

// ❌ Bad
await this.usersService.create({ ...dto, password });
```

### 2. Use Environment Variables for Secrets

```env
JWT_SECRET=your-super-secret-key-here
JWT_EXPIRATION=1h
```

### 3. Implement Rate Limiting

```typescript
// src/main.ts
import { rateLimit } from 'express-rate-limit';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.use(
        '/auth',
        rateLimit({
            windowMs: 15 * 60 * 1000, // 15 minutes
            max: 5, // 5 requests per window
            message: 'Too many login attempts, please try again later',
        }),
    );

    await app.listen(3000);
}
```

### 4. Secure Cookies for Tokens

```typescript
@Post('login')
async login(@CurrentUser() user: any, @Res() res: Response) {
    const tokens = await this.authService.login(user);

    res.cookie('accessToken', tokens.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 3600000, // 1 hour
    });

    return res.json({ user: tokens.user });
}
```

### 5. Validate Token on Every Request

```typescript
// JWT Strategy already does this by verifying the token
// Additionally check if user still exists and is active
async validate(payload: any) {
    const user = await this.usersService.findOne(payload.sub);

    if (!user || !user.isActive) {
        throw new UnauthorizedException('User not found or inactive');
    }

    return user;
}
```

## Complete Auth Flow Example

```typescript
// Test the authentication flow

// 1. Register
POST /auth/register
{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "Password123"
}

// Response
{
    "user": {
        "id": 1,
        "email": "john@example.com",
        "name": "John Doe",
        "role": "user"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}

// 2. Login
POST /auth/login
{
    "email": "john@example.com",
    "password": "Password123"
}

// 3. Access Protected Route
GET /auth/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...

// 4. Refresh Token
POST /auth/refresh
{
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

## Summary

In this chapter, you learned:

- JWT authentication setup
- Passport strategies (Local, JWT, Google)
- Creating auth guards
- Role-based access control
- Password reset flow
- OAuth2 integration
- Security best practices

## What's Next?

In the next chapter, we'll learn about [Testing](/guide/nestjs/09-testing) and understand:
- Unit testing with Jest
- E2E testing
- Mocking dependencies
- Test coverage

---

[Previous: Database Integration](/guide/nestjs/07-database) | [Next: Testing →](/guide/nestjs/09-testing)
