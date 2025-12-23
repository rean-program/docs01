# Testing

Testing is crucial for maintaining code quality and preventing regressions. NestJS provides excellent testing support with Jest out of the box.

## Testing Overview

NestJS supports different types of testing:

| Type | Description | Location |
|------|-------------|----------|
| Unit Tests | Test individual components in isolation | `*.spec.ts` |
| Integration Tests | Test how components work together | `*.spec.ts` |
| E2E Tests | Test the entire application flow | `test/*.e2e-spec.ts` |

## Setting Up Testing

NestJS projects come with Jest pre-configured. The configuration is in `package.json` or `jest.config.js`:

```json
// package.json
{
    "jest": {
        "moduleFileExtensions": ["js", "json", "ts"],
        "rootDir": "src",
        "testRegex": ".*\\.spec\\.ts$",
        "transform": {
            "^.+\\.(t|j)s$": "ts-jest"
        },
        "collectCoverageFrom": ["**/*.(t|j)s"],
        "coverageDirectory": "../coverage",
        "testEnvironment": "node"
    }
}
```

### Running Tests

```bash
# Run all unit tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:cov

# Run e2e tests
npm run test:e2e
```

## Unit Testing

### Testing Services

```typescript
// src/users/users.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

describe('UsersService', () => {
    let service: UsersService;
    let repository: Repository<User>;

    const mockUser = {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        password: 'hashedPassword',
        role: 'user',
        createdAt: new Date(),
    };

    const mockRepository = {
        create: jest.fn(),
        save: jest.fn(),
        find: jest.fn(),
        findOne: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UsersService,
                {
                    provide: getRepositoryToken(User),
                    useValue: mockRepository,
                },
            ],
        }).compile();

        service = module.get<UsersService>(UsersService);
        repository = module.get<Repository<User>>(getRepositoryToken(User));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('create', () => {
        it('should create a new user', async () => {
            const createUserDto = {
                name: 'John Doe',
                email: 'john@example.com',
                password: 'password123',
            };

            mockRepository.create.mockReturnValue(mockUser);
            mockRepository.save.mockResolvedValue(mockUser);

            const result = await service.create(createUserDto);

            expect(mockRepository.create).toHaveBeenCalledWith(createUserDto);
            expect(mockRepository.save).toHaveBeenCalled();
            expect(result).toEqual(mockUser);
        });
    });

    describe('findAll', () => {
        it('should return an array of users', async () => {
            const users = [mockUser];
            mockRepository.find.mockResolvedValue(users);

            const result = await service.findAll();

            expect(result).toEqual(users);
            expect(mockRepository.find).toHaveBeenCalled();
        });
    });

    describe('findOne', () => {
        it('should return a user by id', async () => {
            mockRepository.findOne.mockResolvedValue(mockUser);

            const result = await service.findOne(1);

            expect(result).toEqual(mockUser);
            expect(mockRepository.findOne).toHaveBeenCalledWith({
                where: { id: 1 },
            });
        });

        it('should throw NotFoundException if user not found', async () => {
            mockRepository.findOne.mockResolvedValue(null);

            await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
        });
    });

    describe('update', () => {
        it('should update a user', async () => {
            const updateUserDto = { name: 'Jane Doe' };
            const updatedUser = { ...mockUser, ...updateUserDto };

            mockRepository.findOne.mockResolvedValue(mockUser);
            mockRepository.save.mockResolvedValue(updatedUser);

            const result = await service.update(1, updateUserDto);

            expect(result.name).toEqual('Jane Doe');
        });
    });

    describe('remove', () => {
        it('should delete a user', async () => {
            mockRepository.delete.mockResolvedValue({ affected: 1 });

            await service.remove(1);

            expect(mockRepository.delete).toHaveBeenCalledWith(1);
        });

        it('should throw NotFoundException if user not found', async () => {
            mockRepository.delete.mockResolvedValue({ affected: 0 });

            await expect(service.remove(999)).rejects.toThrow(NotFoundException);
        });
    });
});
```

### Testing Controllers

```typescript
// src/users/users.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UsersController', () => {
    let controller: UsersController;
    let service: UsersService;

    const mockUser = {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        role: 'user',
    };

    const mockUsersService = {
        create: jest.fn(),
        findAll: jest.fn(),
        findOne: jest.fn(),
        update: jest.fn(),
        remove: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UsersController],
            providers: [
                {
                    provide: UsersService,
                    useValue: mockUsersService,
                },
            ],
        }).compile();

        controller = module.get<UsersController>(UsersController);
        service = module.get<UsersService>(UsersService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('create', () => {
        it('should create a user', async () => {
            const createUserDto: CreateUserDto = {
                name: 'John Doe',
                email: 'john@example.com',
                password: 'password123',
            };

            mockUsersService.create.mockResolvedValue(mockUser);

            const result = await controller.create(createUserDto);

            expect(result).toEqual(mockUser);
            expect(service.create).toHaveBeenCalledWith(createUserDto);
        });
    });

    describe('findAll', () => {
        it('should return an array of users', async () => {
            const users = [mockUser];
            mockUsersService.findAll.mockResolvedValue(users);

            const result = await controller.findAll();

            expect(result).toEqual(users);
        });
    });

    describe('findOne', () => {
        it('should return a user', async () => {
            mockUsersService.findOne.mockResolvedValue(mockUser);

            const result = await controller.findOne('1');

            expect(result).toEqual(mockUser);
            expect(service.findOne).toHaveBeenCalledWith(1);
        });
    });

    describe('update', () => {
        it('should update a user', async () => {
            const updateUserDto: UpdateUserDto = { name: 'Jane Doe' };
            const updatedUser = { ...mockUser, ...updateUserDto };

            mockUsersService.update.mockResolvedValue(updatedUser);

            const result = await controller.update('1', updateUserDto);

            expect(result.name).toEqual('Jane Doe');
        });
    });

    describe('remove', () => {
        it('should delete a user', async () => {
            mockUsersService.remove.mockResolvedValue(undefined);

            await controller.remove('1');

            expect(service.remove).toHaveBeenCalledWith(1);
        });
    });
});
```

### Testing Guards

```typescript
// src/auth/guards/jwt-auth.guard.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtAuthGuard } from './jwt-auth.guard';

describe('JwtAuthGuard', () => {
    let guard: JwtAuthGuard;
    let reflector: Reflector;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                JwtAuthGuard,
                {
                    provide: Reflector,
                    useValue: {
                        getAllAndOverride: jest.fn(),
                    },
                },
            ],
        }).compile();

        guard = module.get<JwtAuthGuard>(JwtAuthGuard);
        reflector = module.get<Reflector>(Reflector);
    });

    it('should be defined', () => {
        expect(guard).toBeDefined();
    });

    it('should allow public routes', () => {
        const context = {
            getHandler: jest.fn(),
            getClass: jest.fn(),
            switchToHttp: jest.fn().mockReturnValue({
                getRequest: jest.fn().mockReturnValue({}),
            }),
        } as unknown as ExecutionContext;

        jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(true);

        expect(guard.canActivate(context)).toBe(true);
    });
});
```

### Testing Pipes

```typescript
// src/common/pipes/parse-int.pipe.spec.ts
import { BadRequestException } from '@nestjs/common';
import { CustomParseIntPipe } from './parse-int.pipe';

describe('CustomParseIntPipe', () => {
    let pipe: CustomParseIntPipe;

    beforeEach(() => {
        pipe = new CustomParseIntPipe();
    });

    it('should transform string to number', () => {
        expect(pipe.transform('123')).toBe(123);
    });

    it('should throw BadRequestException for non-numeric string', () => {
        expect(() => pipe.transform('abc')).toThrow(BadRequestException);
    });

    it('should throw BadRequestException for empty string', () => {
        expect(() => pipe.transform('')).toThrow(BadRequestException);
    });
});
```

## Integration Testing

### Testing with Database

```typescript
// src/users/users.integration.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';

describe('Users Integration', () => {
    let module: TestingModule;
    let service: UsersService;
    let controller: UsersController;

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [
                TypeOrmModule.forRoot({
                    type: 'sqlite',
                    database: ':memory:',
                    entities: [User],
                    synchronize: true,
                }),
                TypeOrmModule.forFeature([User]),
            ],
            controllers: [UsersController],
            providers: [UsersService],
        }).compile();

        service = module.get<UsersService>(UsersService);
        controller = module.get<UsersController>(UsersController);
    });

    afterAll(async () => {
        await module.close();
    });

    it('should create and retrieve a user', async () => {
        const createUserDto = {
            name: 'John Doe',
            email: 'john@example.com',
            password: 'password123',
        };

        const created = await service.create(createUserDto);
        expect(created.id).toBeDefined();

        const found = await service.findOne(created.id);
        expect(found.email).toEqual(createUserDto.email);
    });
});
```

## E2E Testing

### Basic E2E Test

```typescript
// test/app.e2e-spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('AppController (e2e)', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new ValidationPipe());
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    it('/ (GET)', () => {
        return request(app.getHttpServer())
            .get('/')
            .expect(200)
            .expect('Hello World!');
    });
});
```

### Complete E2E Test Suite

```typescript
// test/users.e2e-spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../src/users/entities/user.entity';

describe('Users (e2e)', () => {
    let app: INestApplication;
    let authToken: string;
    let createdUserId: number;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new ValidationPipe({
            whitelist: true,
            transform: true,
        }));

        await app.init();

        // Create a test user and get auth token
        const registerResponse = await request(app.getHttpServer())
            .post('/auth/register')
            .send({
                name: 'Test User',
                email: 'test@example.com',
                password: 'Password123',
            });

        authToken = registerResponse.body.accessToken;
    });

    afterAll(async () => {
        // Clean up test data
        const userRepository = app.get(getRepositoryToken(User));
        await userRepository.delete({});
        await app.close();
    });

    describe('POST /users', () => {
        it('should create a new user', async () => {
            const response = await request(app.getHttpServer())
                .post('/users')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    name: 'John Doe',
                    email: 'john@example.com',
                    password: 'Password123',
                })
                .expect(201);

            expect(response.body).toHaveProperty('id');
            expect(response.body.email).toEqual('john@example.com');
            createdUserId = response.body.id;
        });

        it('should return 400 for invalid data', async () => {
            await request(app.getHttpServer())
                .post('/users')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    name: '',
                    email: 'invalid-email',
                    password: '123',
                })
                .expect(400);
        });

        it('should return 401 without auth token', async () => {
            await request(app.getHttpServer())
                .post('/users')
                .send({
                    name: 'John Doe',
                    email: 'john2@example.com',
                    password: 'Password123',
                })
                .expect(401);
        });
    });

    describe('GET /users', () => {
        it('should return array of users', async () => {
            const response = await request(app.getHttpServer())
                .get('/users')
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200);

            expect(Array.isArray(response.body)).toBe(true);
        });
    });

    describe('GET /users/:id', () => {
        it('should return a user', async () => {
            const response = await request(app.getHttpServer())
                .get(`/users/${createdUserId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200);

            expect(response.body.id).toEqual(createdUserId);
        });

        it('should return 404 for non-existent user', async () => {
            await request(app.getHttpServer())
                .get('/users/99999')
                .set('Authorization', `Bearer ${authToken}`)
                .expect(404);
        });
    });

    describe('PATCH /users/:id', () => {
        it('should update a user', async () => {
            const response = await request(app.getHttpServer())
                .patch(`/users/${createdUserId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({ name: 'Jane Doe' })
                .expect(200);

            expect(response.body.name).toEqual('Jane Doe');
        });
    });

    describe('DELETE /users/:id', () => {
        it('should delete a user', async () => {
            await request(app.getHttpServer())
                .delete(`/users/${createdUserId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200);

            // Verify deletion
            await request(app.getHttpServer())
                .get(`/users/${createdUserId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .expect(404);
        });
    });
});
```

## Mocking

### Mocking Services

```typescript
const mockUsersService = {
    create: jest.fn().mockResolvedValue(mockUser),
    findAll: jest.fn().mockResolvedValue([mockUser]),
    findOne: jest.fn().mockResolvedValue(mockUser),
    update: jest.fn().mockResolvedValue(mockUser),
    remove: jest.fn().mockResolvedValue(undefined),
};
```

### Mocking External Services

```typescript
// src/email/email.service.spec.ts
describe('EmailService', () => {
    let service: EmailService;

    const mockTransporter = {
        sendMail: jest.fn().mockResolvedValue({ messageId: '123' }),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                EmailService,
                {
                    provide: 'MAIL_TRANSPORTER',
                    useValue: mockTransporter,
                },
            ],
        }).compile();

        service = module.get<EmailService>(EmailService);
    });

    it('should send email', async () => {
        await service.sendEmail('test@example.com', 'Subject', 'Body');

        expect(mockTransporter.sendMail).toHaveBeenCalledWith({
            to: 'test@example.com',
            subject: 'Subject',
            text: 'Body',
        });
    });
});
```

### Mocking with Factory

```typescript
// test/mocks/users.service.mock.ts
export const mockUsersServiceFactory = () => ({
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
});

// Usage
const module: TestingModule = await Test.createTestingModule({
    providers: [
        {
            provide: UsersService,
            useFactory: mockUsersServiceFactory,
        },
    ],
}).compile();
```

## Test Coverage

### Running Coverage

```bash
npm run test:cov
```

### Coverage Configuration

```json
// package.json
{
    "jest": {
        "collectCoverageFrom": [
            "**/*.(t|j)s",
            "!**/*.module.ts",
            "!**/main.ts",
            "!**/*.dto.ts",
            "!**/*.entity.ts"
        ],
        "coverageThreshold": {
            "global": {
                "branches": 80,
                "functions": 80,
                "lines": 80,
                "statements": 80
            }
        }
    }
}
```

## Best Practices

### 1. Test Isolation

```typescript
// Each test should be independent
beforeEach(() => {
    jest.clearAllMocks();
});

afterEach(() => {
    // Clean up any state
});
```

### 2. Arrange-Act-Assert Pattern

```typescript
it('should create a user', async () => {
    // Arrange
    const createUserDto = { name: 'John', email: 'john@example.com' };
    mockService.create.mockResolvedValue({ id: 1, ...createUserDto });

    // Act
    const result = await controller.create(createUserDto);

    // Assert
    expect(result.id).toBeDefined();
    expect(result.name).toEqual('John');
});
```

### 3. Test Edge Cases

```typescript
describe('findOne', () => {
    it('should return user when found', async () => {});
    it('should throw NotFoundException when not found', async () => {});
    it('should handle invalid id format', async () => {});
});
```

### 4. Use Descriptive Test Names

```typescript
// ✅ Good
it('should throw NotFoundException when user with given id does not exist', async () => {});

// ❌ Bad
it('test1', async () => {});
```

### 5. Test Public API Only

```typescript
// Test the public interface, not implementation details
// ✅ Good - Tests behavior
it('should return created user with id', async () => {
    const result = await service.create(dto);
    expect(result.id).toBeDefined();
});

// ❌ Bad - Tests implementation
it('should call repository.save', async () => {
    await service.create(dto);
    expect(repository.save).toHaveBeenCalled();
});
```

## Summary

In this chapter, you learned:

- Setting up testing in NestJS
- Writing unit tests for services and controllers
- Creating integration tests
- Writing E2E tests
- Mocking dependencies
- Test coverage configuration
- Testing best practices

## What's Next?

In the next chapter, we'll learn about [Advanced Topics](/guide/nestjs/10-advanced) including:
- Microservices
- WebSockets
- GraphQL
- Task scheduling

---

[Previous: Authentication](/guide/nestjs/08-authentication) | [Next: Advanced Topics →](/guide/nestjs/10-advanced)
