# Database Integration

NestJS supports multiple database solutions. This chapter covers the most popular options: TypeORM, Prisma, and Mongoose for MongoDB.

```
┌─────────────────────────────────────────────────────────────────┐
│                  DATABASE OPTIONS IN NESTJS                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │   TypeORM   │  │   Prisma    │  │  Mongoose   │             │
│  │             │  │             │  │             │             │
│  │ PostgreSQL  │  │ PostgreSQL  │  │  MongoDB    │             │
│  │ MySQL       │  │ MySQL       │  │             │             │
│  │ SQLite      │  │ SQLite      │  │             │             │
│  │ SQL Server  │  │ SQL Server  │  │             │             │
│  └─────────────┘  └─────────────┘  └─────────────┘             │
│                                                                  │
│  Which to choose?                                                │
│  • TypeORM: Most features, good for complex SQL                 │
│  • Prisma: Modern, type-safe, great developer experience        │
│  • Mongoose: MongoDB only, schema-based                         │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## TypeORM Integration

TypeORM is a powerful ORM that supports many databases including PostgreSQL, MySQL, SQLite, and more.

### Installation

```bash
# Install TypeORM and database driver
npm install @nestjs/typeorm typeorm

# For PostgreSQL
npm install pg

# For MySQL
npm install mysql2

# For SQLite
npm install better-sqlite3
```

### Configuration

```typescript
// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: 'localhost',
            port: 5432,
            username: 'postgres',
            password: 'password',
            database: 'myapp',
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            synchronize: true, // Don't use in production!
        }),
    ],
})
export class AppModule {}
```

### Async Configuration

```typescript
// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
    imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                type: 'postgres',
                host: configService.get('DB_HOST'),
                port: configService.get('DB_PORT'),
                username: configService.get('DB_USERNAME'),
                password: configService.get('DB_PASSWORD'),
                database: configService.get('DB_NAME'),
                entities: [__dirname + '/**/*.entity{.ts,.js}'],
                synchronize: configService.get('NODE_ENV') !== 'production',
            }),
            inject: [ConfigService],
        }),
    ],
})
export class AppModule {}
```

### Creating Entities

```typescript
// src/users/entities/user.entity.ts
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
    BeforeInsert,
} from 'typeorm';
import { Post } from '../../posts/entities/post.entity';
import * as bcrypt from 'bcrypt';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 100 })
    name: string;

    @Column({ unique: true })
    email: string;

    @Column({ select: false }) // Don't include in queries by default
    password: string;

    @Column({ default: true })
    isActive: boolean;

    @Column({ type: 'enum', enum: ['user', 'admin'], default: 'user' })
    role: string;

    @OneToMany(() => Post, post => post.author)
    posts: Post[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @BeforeInsert()
    async hashPassword() {
        if (this.password) {
            this.password = await bcrypt.hash(this.password, 10);
        }
    }
}

// src/posts/entities/post.entity.ts
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('posts')
export class Post {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column('text')
    content: string;

    @Column({ default: false })
    published: boolean;

    @ManyToOne(() => User, user => user.posts)
    author: User;

    @Column()
    authorId: number;

    @CreateDateColumn()
    createdAt: Date;
}
```

### Repository Pattern

```typescript
// src/users/users.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    controllers: [UsersController],
    providers: [UsersService],
    exports: [UsersService],
})
export class UsersModule {}
```

```typescript
// src/users/users.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) {}

    async create(createUserDto: CreateUserDto): Promise<User> {
        const user = this.usersRepository.create(createUserDto);
        return this.usersRepository.save(user);
    }

    async findAll(): Promise<User[]> {
        return this.usersRepository.find({
            relations: ['posts'],
        });
    }

    async findOne(id: number): Promise<User> {
        const user = await this.usersRepository.findOne({
            where: { id },
            relations: ['posts'],
        });

        if (!user) {
            throw new NotFoundException(`User #${id} not found`);
        }

        return user;
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.usersRepository.findOne({
            where: { email },
            select: ['id', 'email', 'password', 'name', 'role'],
        });
    }

    async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
        const user = await this.findOne(id);
        Object.assign(user, updateUserDto);
        return this.usersRepository.save(user);
    }

    async remove(id: number): Promise<void> {
        const result = await this.usersRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`User #${id} not found`);
        }
    }
}
```

### Query Builder

```typescript
@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) {}

    async findWithFilters(filters: {
        role?: string;
        isActive?: boolean;
        search?: string;
        page?: number;
        limit?: number;
    }): Promise<{ users: User[]; total: number }> {
        const { role, isActive, search, page = 1, limit = 10 } = filters;

        const queryBuilder = this.usersRepository
            .createQueryBuilder('user')
            .leftJoinAndSelect('user.posts', 'posts');

        if (role) {
            queryBuilder.andWhere('user.role = :role', { role });
        }

        if (isActive !== undefined) {
            queryBuilder.andWhere('user.isActive = :isActive', { isActive });
        }

        if (search) {
            queryBuilder.andWhere(
                '(user.name ILIKE :search OR user.email ILIKE :search)',
                { search: `%${search}%` },
            );
        }

        const [users, total] = await queryBuilder
            .orderBy('user.createdAt', 'DESC')
            .skip((page - 1) * limit)
            .take(limit)
            .getManyAndCount();

        return { users, total };
    }

    async getUserStats(): Promise<any> {
        return this.usersRepository
            .createQueryBuilder('user')
            .select('user.role', 'role')
            .addSelect('COUNT(*)', 'count')
            .groupBy('user.role')
            .getRawMany();
    }
}
```

### Transactions

```typescript
import { DataSource } from 'typeorm';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        private dataSource: DataSource,
    ) {}

    async createWithTransaction(createUserDto: CreateUserDto): Promise<User> {
        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const user = queryRunner.manager.create(User, createUserDto);
            await queryRunner.manager.save(user);

            // Create related entities
            const profile = queryRunner.manager.create(Profile, {
                userId: user.id,
            });
            await queryRunner.manager.save(profile);

            await queryRunner.commitTransaction();
            return user;
        } catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        } finally {
            await queryRunner.release();
        }
    }
}
```

## Prisma Integration

Prisma is a modern ORM with excellent TypeScript support and an intuitive data model.

### Installation

```bash
npm install prisma --save-dev
npm install @prisma/client

# Initialize Prisma
npx prisma init
```

### Schema Definition

```prisma
// prisma/schema.prisma
generator client {
    provider = "prisma-client-js"
}

datasource db {
    provider = "postgresql"
    url      = env("DATABASE_URL")
}

model User {
    id        Int      @id @default(autoincrement())
    email     String   @unique
    name      String
    password  String
    role      Role     @default(USER)
    isActive  Boolean  @default(true)
    posts     Post[]
    profile   Profile?
    createdAt DateTime @default(now())
    updatedAt DateTime @updatedAt
}

model Profile {
    id     Int     @id @default(autoincrement())
    bio    String?
    avatar String?
    user   User    @relation(fields: [userId], references: [id])
    userId Int     @unique
}

model Post {
    id        Int      @id @default(autoincrement())
    title     String
    content   String
    published Boolean  @default(false)
    author    User     @relation(fields: [authorId], references: [id])
    authorId  Int
    createdAt DateTime @default(now())
}

enum Role {
    USER
    ADMIN
}
```

### Prisma Service

```typescript
// src/prisma/prisma.service.ts
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    async onModuleInit() {
        await this.$connect();
    }

    async onModuleDestroy() {
        await this.$disconnect();
    }
}

// src/prisma/prisma.module.ts
import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()
@Module({
    providers: [PrismaService],
    exports: [PrismaService],
})
export class PrismaModule {}
```

### Using Prisma in Services

```typescript
// src/users/users.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) {}

    async create(createUserDto: CreateUserDto) {
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

        return this.prisma.user.create({
            data: {
                ...createUserDto,
                password: hashedPassword,
            },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                createdAt: true,
            },
        });
    }

    async findAll(params: {
        skip?: number;
        take?: number;
        where?: Prisma.UserWhereInput;
        orderBy?: Prisma.UserOrderByWithRelationInput;
    }) {
        const { skip, take, where, orderBy } = params;

        return this.prisma.user.findMany({
            skip,
            take,
            where,
            orderBy,
            include: {
                posts: true,
                profile: true,
            },
        });
    }

    async findOne(id: number) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            include: {
                posts: true,
                profile: true,
            },
        });

        if (!user) {
            throw new NotFoundException(`User #${id} not found`);
        }

        return user;
    }

    async update(id: number, updateUserDto: UpdateUserDto) {
        try {
            return await this.prisma.user.update({
                where: { id },
                data: updateUserDto,
            });
        } catch (error) {
            if (error.code === 'P2025') {
                throw new NotFoundException(`User #${id} not found`);
            }
            throw error;
        }
    }

    async remove(id: number) {
        try {
            return await this.prisma.user.delete({
                where: { id },
            });
        } catch (error) {
            if (error.code === 'P2025') {
                throw new NotFoundException(`User #${id} not found`);
            }
            throw error;
        }
    }
}
```

### Prisma Transactions

```typescript
async createUserWithProfile(data: CreateUserWithProfileDto) {
    return this.prisma.$transaction(async (tx) => {
        const user = await tx.user.create({
            data: {
                email: data.email,
                name: data.name,
                password: await bcrypt.hash(data.password, 10),
            },
        });

        const profile = await tx.profile.create({
            data: {
                userId: user.id,
                bio: data.bio,
            },
        });

        return { user, profile };
    });
}
```

### Prisma Migrations

```bash
# Create a migration
npx prisma migrate dev --name init

# Apply migrations in production
npx prisma migrate deploy

# Generate Prisma Client
npx prisma generate

# Open Prisma Studio (GUI)
npx prisma studio
```

## MongoDB with Mongoose

For MongoDB, NestJS provides integration with Mongoose ODM.

### Installation

```bash
npm install @nestjs/mongoose mongoose
```

### Configuration

```typescript
// src/app.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
    imports: [
        MongooseModule.forRoot('mongodb://localhost/myapp'),
    ],
})
export class AppModule {}

// Async configuration
@Module({
    imports: [
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                uri: configService.get('MONGODB_URI'),
            }),
            inject: [ConfigService],
        }),
    ],
})
export class AppModule {}
```

### Creating Schemas

```typescript
// src/users/schemas/user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true, select: false })
    password: string;

    @Prop({ default: true })
    isActive: boolean;

    @Prop({ type: String, enum: ['user', 'admin'], default: 'user' })
    role: string;

    @Prop({ type: [{ type: Types.ObjectId, ref: 'Post' }] })
    posts: Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);

// Add index
UserSchema.index({ email: 1 });

// Add virtual
UserSchema.virtual('fullName').get(function() {
    return `${this.name}`;
});

// Pre-save hook
UserSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        const bcrypt = require('bcrypt');
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});
```

### Using Mongoose in Services

```typescript
// src/users/users.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    ],
    controllers: [UsersController],
    providers: [UsersService],
    exports: [UsersService],
})
export class UsersModule {}

// src/users/users.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name)
        private userModel: Model<UserDocument>,
    ) {}

    async create(createUserDto: CreateUserDto): Promise<User> {
        const createdUser = new this.userModel(createUserDto);
        return createdUser.save();
    }

    async findAll(): Promise<User[]> {
        return this.userModel.find().populate('posts').exec();
    }

    async findOne(id: string): Promise<User> {
        const user = await this.userModel.findById(id).populate('posts').exec();

        if (!user) {
            throw new NotFoundException(`User #${id} not found`);
        }

        return user;
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.userModel.findOne({ email }).select('+password').exec();
    }

    async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
        const user = await this.userModel
            .findByIdAndUpdate(id, updateUserDto, { new: true })
            .exec();

        if (!user) {
            throw new NotFoundException(`User #${id} not found`);
        }

        return user;
    }

    async remove(id: string): Promise<void> {
        const result = await this.userModel.findByIdAndDelete(id).exec();

        if (!result) {
            throw new NotFoundException(`User #${id} not found`);
        }
    }

    async findWithFilters(filters: any): Promise<User[]> {
        const query = this.userModel.find();

        if (filters.role) {
            query.where('role').equals(filters.role);
        }

        if (filters.isActive !== undefined) {
            query.where('isActive').equals(filters.isActive);
        }

        if (filters.search) {
            query.or([
                { name: new RegExp(filters.search, 'i') },
                { email: new RegExp(filters.search, 'i') },
            ]);
        }

        return query
            .skip((filters.page - 1) * filters.limit)
            .limit(filters.limit)
            .sort({ createdAt: -1 })
            .exec();
    }
}
```

## Database Seeding

### TypeORM Seeding

```typescript
// src/database/seeds/user.seed.ts
import { DataSource } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import * as bcrypt from 'bcrypt';

export async function seedUsers(dataSource: DataSource) {
    const userRepository = dataSource.getRepository(User);

    const users = [
        {
            name: 'Admin User',
            email: 'admin@example.com',
            password: await bcrypt.hash('password123', 10),
            role: 'admin',
        },
        {
            name: 'Regular User',
            email: 'user@example.com',
            password: await bcrypt.hash('password123', 10),
            role: 'user',
        },
    ];

    for (const userData of users) {
        const exists = await userRepository.findOne({
            where: { email: userData.email },
        });

        if (!exists) {
            const user = userRepository.create(userData);
            await userRepository.save(user);
        }
    }

    console.log('Users seeded successfully');
}
```

### Prisma Seeding

```typescript
// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    const adminPassword = await bcrypt.hash('password123', 10);
    const userPassword = await bcrypt.hash('password123', 10);

    const admin = await prisma.user.upsert({
        where: { email: 'admin@example.com' },
        update: {},
        create: {
            email: 'admin@example.com',
            name: 'Admin User',
            password: adminPassword,
            role: 'ADMIN',
        },
    });

    const user = await prisma.user.upsert({
        where: { email: 'user@example.com' },
        update: {},
        create: {
            email: 'user@example.com',
            name: 'Regular User',
            password: userPassword,
            role: 'USER',
        },
    });

    console.log({ admin, user });
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
```

Add to `package.json`:
```json
{
    "prisma": {
        "seed": "ts-node prisma/seed.ts"
    }
}
```

Run: `npx prisma db seed`

## Best Practices

### 1. Use Repositories/Services Layer

```typescript
// ✅ Good - Service handles database logic
@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) {}

    findOne(id: number) {
        return this.prisma.user.findUnique({ where: { id } });
    }
}

// ❌ Bad - Controller directly accesses database
@Controller('users')
export class UsersController {
    constructor(private prisma: PrismaService) {}

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.prisma.user.findUnique({ where: { id: +id } });
    }
}
```

### 2. Handle Database Errors

```typescript
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';

@Injectable()
export class UsersService {
    async create(data: CreateUserDto) {
        try {
            return await this.prisma.user.create({ data });
        } catch (error) {
            if (error.code === 'P2002') {
                throw new ConflictException('Email already exists');
            }
            throw error;
        }
    }
}
```

### 3. Use Environment Variables

```typescript
// .env
DATABASE_URL="postgresql://user:password@localhost:5432/mydb"

// config
TypeOrmModule.forRoot({
    url: process.env.DATABASE_URL,
    // ...
})
```

## Summary

In this chapter, you learned:

- TypeORM integration with entities and repositories
- Prisma ORM setup and usage
- MongoDB with Mongoose
- Query building and transactions
- Database seeding
- Best practices for database operations

## What's Next?

In the next chapter, we'll learn about [Authentication](/guide/nestjs/08-authentication) and understand:
- JWT authentication
- Passport integration
- Auth guards
- Session management

---

[Previous: Pipes & Validation](/guide/nestjs/06-pipes) | [Next: Authentication →](/guide/nestjs/08-authentication)
