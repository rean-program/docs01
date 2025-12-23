# Advanced Topics

This chapter covers advanced NestJS features including Microservices, WebSockets, GraphQL, and task scheduling.

## Microservices

NestJS provides native support for building microservices using various transport layers.

### Installation

```bash
npm install @nestjs/microservices
```

### TCP Transport

```typescript
// src/main.ts (Microservice)
import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.createMicroservice<MicroserviceOptions>(
        AppModule,
        {
            transport: Transport.TCP,
            options: {
                host: 'localhost',
                port: 3001,
            },
        },
    );
    await app.listen();
    console.log('Microservice is listening on port 3001');
}
bootstrap();
```

### Creating Message Patterns

```typescript
// src/users/users.controller.ts
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload, EventPattern } from '@nestjs/microservices';
import { UsersService } from './users.service';

@Controller()
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    // Request-Response pattern
    @MessagePattern({ cmd: 'get_user' })
    async getUser(@Payload() data: { id: number }) {
        return this.usersService.findOne(data.id);
    }

    @MessagePattern({ cmd: 'create_user' })
    async createUser(@Payload() data: CreateUserDto) {
        return this.usersService.create(data);
    }

    // Event-based pattern (fire and forget)
    @EventPattern('user_created')
    async handleUserCreated(@Payload() data: any) {
        console.log('User created event received:', data);
        // Handle the event (send email, update cache, etc.)
    }
}
```

### Client Proxy

```typescript
// src/app.module.ts
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
    imports: [
        ClientsModule.register([
            {
                name: 'USER_SERVICE',
                transport: Transport.TCP,
                options: {
                    host: 'localhost',
                    port: 3001,
                },
            },
        ]),
    ],
})
export class AppModule {}

// src/gateway/gateway.controller.ts
import { Controller, Get, Param, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Controller('users')
export class GatewayController {
    constructor(@Inject('USER_SERVICE') private client: ClientProxy) {}

    @Get(':id')
    async getUser(@Param('id') id: string) {
        // Request-Response
        const user = await firstValueFrom(
            this.client.send({ cmd: 'get_user' }, { id: +id }),
        );
        return user;
    }

    @Post()
    async createUser(@Body() createUserDto: CreateUserDto) {
        const user = await firstValueFrom(
            this.client.send({ cmd: 'create_user' }, createUserDto),
        );

        // Emit event
        this.client.emit('user_created', user);

        return user;
    }
}
```

### Redis Transport

```bash
npm install redis
```

```typescript
// Microservice
const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
        transport: Transport.REDIS,
        options: {
            host: 'localhost',
            port: 6379,
        },
    },
);

// Client
ClientsModule.register([
    {
        name: 'REDIS_SERVICE',
        transport: Transport.REDIS,
        options: {
            host: 'localhost',
            port: 6379,
        },
    },
]),
```

### RabbitMQ Transport

```bash
npm install amqplib amqp-connection-manager
```

```typescript
// Microservice
const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
        transport: Transport.RMQ,
        options: {
            urls: ['amqp://localhost:5672'],
            queue: 'users_queue',
            queueOptions: {
                durable: false,
            },
        },
    },
);
```

## WebSockets

### Installation

```bash
npm install @nestjs/websockets @nestjs/platform-socket.io
npm install socket.io
```

### Gateway Setup

```typescript
// src/events/events.gateway.ts
import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    OnGatewayInit,
    OnGatewayConnection,
    OnGatewayDisconnect,
    MessageBody,
    ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
    namespace: '/events',
})
export class EventsGateway
    implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
    @WebSocketServer()
    server: Server;

    private logger: Logger = new Logger('EventsGateway');

    afterInit(server: Server) {
        this.logger.log('WebSocket Gateway Initialized');
    }

    handleConnection(client: Socket) {
        this.logger.log(`Client connected: ${client.id}`);
    }

    handleDisconnect(client: Socket) {
        this.logger.log(`Client disconnected: ${client.id}`);
    }

    @SubscribeMessage('message')
    handleMessage(
        @MessageBody() data: { room: string; message: string },
        @ConnectedSocket() client: Socket,
    ): void {
        this.server.to(data.room).emit('message', {
            sender: client.id,
            message: data.message,
            timestamp: new Date(),
        });
    }

    @SubscribeMessage('joinRoom')
    handleJoinRoom(
        @MessageBody() room: string,
        @ConnectedSocket() client: Socket,
    ): void {
        client.join(room);
        client.emit('joinedRoom', room);
        this.server.to(room).emit('userJoined', {
            userId: client.id,
            room,
        });
    }

    @SubscribeMessage('leaveRoom')
    handleLeaveRoom(
        @MessageBody() room: string,
        @ConnectedSocket() client: Socket,
    ): void {
        client.leave(room);
        this.server.to(room).emit('userLeft', {
            userId: client.id,
            room,
        });
    }

    // Broadcast to all clients
    broadcastToAll(event: string, data: any): void {
        this.server.emit(event, data);
    }

    // Send to specific room
    sendToRoom(room: string, event: string, data: any): void {
        this.server.to(room).emit(event, data);
    }
}
```

### Events Module

```typescript
// src/events/events.module.ts
import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';

@Module({
    providers: [EventsGateway],
    exports: [EventsGateway],
})
export class EventsModule {}
```

### Using Gateway in Services

```typescript
// src/notifications/notifications.service.ts
import { Injectable } from '@nestjs/common';
import { EventsGateway } from '../events/events.gateway';

@Injectable()
export class NotificationsService {
    constructor(private eventsGateway: EventsGateway) {}

    notifyUser(userId: string, notification: any) {
        this.eventsGateway.server
            .to(`user_${userId}`)
            .emit('notification', notification);
    }

    broadcastNotification(notification: any) {
        this.eventsGateway.broadcastToAll('notification', notification);
    }
}
```

### WebSocket with Authentication

```typescript
// src/events/events.gateway.ts
import { UseGuards } from '@nestjs/common';
import { WsJwtGuard } from '../auth/guards/ws-jwt.guard';

@WebSocketGateway()
@UseGuards(WsJwtGuard)
export class EventsGateway {
    // ...
}

// src/auth/guards/ws-jwt.guard.ts
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@Injectable()
export class WsJwtGuard implements CanActivate {
    constructor(private jwtService: JwtService) {}

    canActivate(context: ExecutionContext): boolean {
        const client: Socket = context.switchToWs().getClient();
        const token = client.handshake.auth.token;

        if (!token) {
            throw new WsException('Unauthorized');
        }

        try {
            const payload = this.jwtService.verify(token);
            client.data.user = payload;
            return true;
        } catch {
            throw new WsException('Invalid token');
        }
    }
}
```

## GraphQL

### Installation

```bash
npm install @nestjs/graphql @nestjs/apollo @apollo/server graphql
```

### Code-First Approach

```typescript
// src/app.module.ts
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';

@Module({
    imports: [
        GraphQLModule.forRoot<ApolloDriverConfig>({
            driver: ApolloDriver,
            autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
            sortSchema: true,
            playground: true,
        }),
    ],
})
export class AppModule {}
```

### Defining Types

```typescript
// src/users/entities/user.entity.ts
import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { Post } from '../../posts/entities/post.entity';

@ObjectType()
export class User {
    @Field(() => ID)
    id: number;

    @Field()
    name: string;

    @Field()
    email: string;

    @Field(() => Int, { nullable: true })
    age?: number;

    @Field(() => [Post], { nullable: true })
    posts?: Post[];

    @Field()
    createdAt: Date;
}
```

### Input Types and Args

```typescript
// src/users/dto/create-user.input.ts
import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, MinLength } from 'class-validator';

@InputType()
export class CreateUserInput {
    @Field()
    @MinLength(2)
    name: string;

    @Field()
    @IsEmail()
    email: string;

    @Field()
    @MinLength(8)
    password: string;
}

// src/users/dto/update-user.input.ts
import { InputType, Field, PartialType, ID } from '@nestjs/graphql';
import { CreateUserInput } from './create-user.input';

@InputType()
export class UpdateUserInput extends PartialType(CreateUserInput) {
    @Field(() => ID)
    id: number;
}
```

### Resolvers

```typescript
// src/users/users.resolver.ts
import { Resolver, Query, Mutation, Args, ID, ResolveField, Parent } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { PostsService } from '../posts/posts.service';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Resolver(() => User)
export class UsersResolver {
    constructor(
        private usersService: UsersService,
        private postsService: PostsService,
    ) {}

    @Query(() => [User], { name: 'users' })
    @UseGuards(GqlAuthGuard)
    findAll() {
        return this.usersService.findAll();
    }

    @Query(() => User, { name: 'user' })
    @UseGuards(GqlAuthGuard)
    findOne(@Args('id', { type: () => ID }) id: number) {
        return this.usersService.findOne(id);
    }

    @Query(() => User, { name: 'me' })
    @UseGuards(GqlAuthGuard)
    getMe(@CurrentUser() user: User) {
        return this.usersService.findOne(user.id);
    }

    @Mutation(() => User)
    createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
        return this.usersService.create(createUserInput);
    }

    @Mutation(() => User)
    @UseGuards(GqlAuthGuard)
    updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
        return this.usersService.update(updateUserInput.id, updateUserInput);
    }

    @Mutation(() => Boolean)
    @UseGuards(GqlAuthGuard)
    removeUser(@Args('id', { type: () => ID }) id: number) {
        return this.usersService.remove(id);
    }

    // Field resolver for posts
    @ResolveField()
    posts(@Parent() user: User) {
        return this.postsService.findByUserId(user.id);
    }
}
```

### GraphQL Auth Guard

```typescript
// src/auth/guards/gql-auth.guard.ts
import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GqlAuthGuard extends AuthGuard('jwt') {
    getRequest(context: ExecutionContext) {
        const ctx = GqlExecutionContext.create(context);
        return ctx.getContext().req;
    }
}
```

### Subscriptions

```typescript
// src/app.module.ts
GraphQLModule.forRoot<ApolloDriverConfig>({
    driver: ApolloDriver,
    autoSchemaFile: true,
    subscriptions: {
        'graphql-ws': true,
    },
}),

// src/posts/posts.resolver.ts
import { Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';

const pubSub = new PubSub();

@Resolver(() => Post)
export class PostsResolver {
    @Mutation(() => Post)
    async createPost(@Args('input') input: CreatePostInput) {
        const post = await this.postsService.create(input);
        pubSub.publish('postCreated', { postCreated: post });
        return post;
    }

    @Subscription(() => Post)
    postCreated() {
        return pubSub.asyncIterator('postCreated');
    }
}
```

## Task Scheduling

### Installation

```bash
npm install @nestjs/schedule
```

### Setup

```typescript
// src/app.module.ts
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
    imports: [ScheduleModule.forRoot()],
})
export class AppModule {}
```

### Cron Jobs

```typescript
// src/tasks/tasks.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression, Interval, Timeout } from '@nestjs/schedule';

@Injectable()
export class TasksService {
    private readonly logger = new Logger(TasksService.name);

    // Run every 10 seconds
    @Cron('*/10 * * * * *')
    handleCron() {
        this.logger.debug('Called every 10 seconds');
    }

    // Using CronExpression enum
    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    handleDailyCleanup() {
        this.logger.debug('Running daily cleanup');
        // Clean up old data, send daily reports, etc.
    }

    // Run every Monday at 9 AM
    @Cron('0 9 * * 1')
    sendWeeklyReport() {
        this.logger.debug('Sending weekly report');
    }

    // Interval - Run every 30 seconds
    @Interval(30000)
    handleInterval() {
        this.logger.debug('Called every 30 seconds');
    }

    // Timeout - Run once after 5 seconds
    @Timeout(5000)
    handleTimeout() {
        this.logger.debug('Called once after 5 seconds');
    }
}
```

### Dynamic Scheduling

```typescript
// src/tasks/tasks.service.ts
import { Injectable } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';

@Injectable()
export class TasksService {
    constructor(private schedulerRegistry: SchedulerRegistry) {}

    addCronJob(name: string, cronTime: string, callback: () => void) {
        const job = new CronJob(cronTime, callback);
        this.schedulerRegistry.addCronJob(name, job);
        job.start();
    }

    deleteCronJob(name: string) {
        this.schedulerRegistry.deleteCronJob(name);
    }

    getCronJobs() {
        const jobs = this.schedulerRegistry.getCronJobs();
        jobs.forEach((value, key) => {
            console.log(`Job: ${key}, Next: ${value.nextDate()}`);
        });
    }

    // Example: Schedule a one-time job
    scheduleNotification(userId: number, message: string, date: Date) {
        const jobName = `notification_${userId}_${Date.now()}`;

        this.addCronJob(jobName, date.toISOString(), () => {
            // Send notification
            console.log(`Sending notification to user ${userId}: ${message}`);
            // Clean up the job after execution
            this.deleteCronJob(jobName);
        });
    }
}
```

## Queue Processing

### Installation

```bash
npm install @nestjs/bull bull
npm install -D @types/bull
```

### Queue Setup

```typescript
// src/app.module.ts
import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';

@Module({
    imports: [
        BullModule.forRoot({
            redis: {
                host: 'localhost',
                port: 6379,
            },
        }),
        BullModule.registerQueue({
            name: 'email',
        }),
    ],
})
export class AppModule {}
```

### Queue Producer

```typescript
// src/email/email.service.ts
import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class EmailService {
    constructor(@InjectQueue('email') private emailQueue: Queue) {}

    async sendEmail(to: string, subject: string, body: string) {
        await this.emailQueue.add('send', {
            to,
            subject,
            body,
        });
    }

    async sendBulkEmails(emails: Array<{ to: string; subject: string; body: string }>) {
        const jobs = emails.map(email =>
            this.emailQueue.add('send', email, {
                attempts: 3,
                backoff: {
                    type: 'exponential',
                    delay: 1000,
                },
            }),
        );
        await Promise.all(jobs);
    }
}
```

### Queue Consumer

```typescript
// src/email/email.processor.ts
import { Process, Processor, OnQueueActive, OnQueueCompleted, OnQueueFailed } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';

@Processor('email')
export class EmailProcessor {
    private readonly logger = new Logger(EmailProcessor.name);

    @Process('send')
    async handleSendEmail(job: Job<{ to: string; subject: string; body: string }>) {
        this.logger.debug(`Processing email job ${job.id}`);

        const { to, subject, body } = job.data;

        // Simulate sending email
        await this.sendEmailImpl(to, subject, body);

        return { sent: true };
    }

    private async sendEmailImpl(to: string, subject: string, body: string) {
        // Actual email sending logic
        await new Promise(resolve => setTimeout(resolve, 1000));
        this.logger.log(`Email sent to ${to}`);
    }

    @OnQueueActive()
    onActive(job: Job) {
        this.logger.debug(`Processing job ${job.id} of type ${job.name}`);
    }

    @OnQueueCompleted()
    onCompleted(job: Job, result: any) {
        this.logger.debug(`Job ${job.id} completed with result: ${JSON.stringify(result)}`);
    }

    @OnQueueFailed()
    onFailed(job: Job, error: Error) {
        this.logger.error(`Job ${job.id} failed: ${error.message}`);
    }
}
```

## Caching

### Installation

```bash
npm install @nestjs/cache-manager cache-manager
```

### Setup

```typescript
// src/app.module.ts
import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
    imports: [
        CacheModule.register({
            ttl: 60000, // milliseconds
            max: 100,   // maximum items in cache
            isGlobal: true,
        }),
    ],
})
export class AppModule {}
```

### Using Cache

```typescript
// src/users/users.service.ts
import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class UsersService {
    constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

    async findOne(id: number): Promise<User> {
        const cacheKey = `user_${id}`;

        // Try cache first
        const cached = await this.cacheManager.get<User>(cacheKey);
        if (cached) {
            return cached;
        }

        // Fetch from database
        const user = await this.usersRepository.findOne({ where: { id } });

        // Store in cache
        await this.cacheManager.set(cacheKey, user, 60000);

        return user;
    }

    async update(id: number, data: UpdateUserDto): Promise<User> {
        const user = await this.usersRepository.save({ id, ...data });

        // Invalidate cache
        await this.cacheManager.del(`user_${id}`);

        return user;
    }
}
```

### Cache Interceptor

```typescript
import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { CacheInterceptor, CacheTTL, CacheKey } from '@nestjs/cache-manager';

@Controller('products')
@UseInterceptors(CacheInterceptor)
export class ProductsController {
    @Get()
    @CacheTTL(30000) // 30 seconds
    @CacheKey('all_products')
    findAll() {
        return this.productsService.findAll();
    }
}
```

## Summary

In this chapter, you learned:

- Building microservices with different transports
- Real-time communication with WebSockets
- GraphQL API development
- Task scheduling with cron jobs
- Queue processing with Bull
- Caching strategies

## What's Next?

Congratulations! You've completed the NestJS tutorial series. Here are some next steps:

- Build a real-world project using these concepts
- Explore additional NestJS packages (Swagger, CQRS, etc.)
- Learn about deployment and DevOps
- Contribute to the NestJS community

## Additional Resources

- [Official NestJS Documentation](https://docs.nestjs.com)
- [NestJS GitHub Repository](https://github.com/nestjs/nest)
- [NestJS Discord Community](https://discord.gg/nestjs)

---

[Previous: Testing](/guide/nestjs/09-testing) | [Back to Index →](/guide/nestjs/)
