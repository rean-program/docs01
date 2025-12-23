# Advanced Patterns

Learn best practices and advanced TypeScript patterns.

::: info What You'll Learn
- Strict type checking configuration
- Type guards and assertion functions
- Branded types for type safety
- Common design patterns in TypeScript
- Advanced type utilities
:::

## Strict Type Checking

Enable all strict options for maximum type safety:

```json
// tsconfig.json
{
    "compilerOptions": {
        "strict": true,
        // Individual options enabled by "strict":
        "noImplicitAny": true,
        "noImplicitThis": true,
        "strictNullChecks": true,
        "strictFunctionTypes": true,
        "strictBindCallApply": true,
        "strictPropertyInitialization": true,
        "alwaysStrict": true,
        "useUnknownInCatchVariables": true
    }
}
```

### What Each Option Does

| Option | What It Prevents |
|--------|-----------------|
| `noImplicitAny` | Variables without explicit types becoming `any` |
| `strictNullChecks` | `null`/`undefined` from being assigned to other types |
| `strictFunctionTypes` | Incorrect function parameter types |
| `strictPropertyInitialization` | Class properties without initialization |
| `useUnknownInCatchVariables` | Catch clause errors being `any` |

## Type Guards

Type guards help TypeScript **narrow types** based on runtime checks:

### Built-in Type Guards

```typescript
function process(value: string | number | null) {
    // typeof guard
    if (typeof value === "string") {
        return value.toUpperCase();  // ✅ TypeScript knows it's string
    }

    // typeof guard
    if (typeof value === "number") {
        return value.toFixed(2);  // ✅ TypeScript knows it's number
    }

    // Truthiness check
    if (value) {
        return value;  // Won't reach here, but narrows out null
    }

    return "default";
}
```

### instanceof Guard

```typescript
class Dog {
    bark() { console.log("Woof!"); }
}

class Cat {
    meow() { console.log("Meow!"); }
}

function makeSound(animal: Dog | Cat) {
    if (animal instanceof Dog) {
        animal.bark();  // ✅ TypeScript knows it's Dog
    } else {
        animal.meow();  // ✅ TypeScript knows it's Cat
    }
}
```

### in Operator Guard

```typescript
interface Fish {
    swim(): void;
}

interface Bird {
    fly(): void;
}

function move(animal: Fish | Bird) {
    if ("swim" in animal) {
        animal.swim();  // ✅ TypeScript knows it has swim
    } else {
        animal.fly();   // ✅ TypeScript knows it's Bird
    }
}
```

### Custom Type Guard (Type Predicate)

Create your own type guards with `value is Type`:

```typescript
// Type predicate function
function isString(value: unknown): value is string {
    return typeof value === "string";
}

function isNumber(value: unknown): value is number {
    return typeof value === "number";
}

// Usage
function processValue(value: unknown) {
    if (isString(value)) {
        return value.toUpperCase();  // ✅ TypeScript knows it's string
    }
    if (isNumber(value)) {
        return value.toFixed(2);     // ✅ TypeScript knows it's number
    }
    return String(value);
}
```

### Object Type Guards

```typescript
interface User {
    type: "user";
    name: string;
    email: string;
}

interface Admin {
    type: "admin";
    name: string;
    permissions: string[];
}

// Type guard using discriminant
function isAdmin(person: User | Admin): person is Admin {
    return person.type === "admin";
}

function greet(person: User | Admin) {
    console.log(`Hello, ${person.name}`);

    if (isAdmin(person)) {
        console.log(`Permissions: ${person.permissions.join(", ")}`);
    } else {
        console.log(`Email: ${person.email}`);
    }
}
```

## Assertion Functions

Assert that a condition is true, or throw an error:

```typescript
// Assert value is defined
function assertDefined<T>(
    value: T,
    message = "Value is undefined"
): asserts value is NonNullable<T> {
    if (value === undefined || value === null) {
        throw new Error(message);
    }
}

// Assert condition is true
function assert(
    condition: boolean,
    message = "Assertion failed"
): asserts condition {
    if (!condition) {
        throw new Error(message);
    }
}

// Usage
function processUser(user: User | null) {
    assertDefined(user, "User is required");
    // After assertion, TypeScript knows user is not null
    console.log(user.name);  // ✅ No error!
}

function divide(a: number, b: number): number {
    assert(b !== 0, "Cannot divide by zero");
    return a / b;  // ✅ TypeScript knows b is not 0
}
```

## Branded Types

Create **distinct types** from primitives to prevent mixing them up:

```typescript
// Brand type definition
type Brand<T, B> = T & { __brand: B };

// Create branded types
type UserId = Brand<string, "UserId">;
type OrderId = Brand<string, "OrderId">;
type Email = Brand<string, "Email">;

// Constructor functions (validate and create)
function createUserId(id: string): UserId {
    if (!id.startsWith("user_")) {
        throw new Error("Invalid user ID format");
    }
    return id as UserId;
}

function createOrderId(id: string): OrderId {
    if (!id.startsWith("order_")) {
        throw new Error("Invalid order ID format");
    }
    return id as OrderId;
}

function createEmail(email: string): Email {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new Error("Invalid email format");
    }
    return email as Email;
}

// Type-safe functions
function getUser(id: UserId): User {
    // Implementation
    return { id, name: "John" };
}

function getOrder(id: OrderId): Order {
    // Implementation
    return { id, total: 100 };
}

// Usage
const userId = createUserId("user_123");
const orderId = createOrderId("order_456");

getUser(userId);     // ✅ OK
// getUser(orderId); // ❌ Error: OrderId is not assignable to UserId

// Even though both are strings, TypeScript treats them differently!
```

### Visual Guide to Branded Types

```
Without Branding:               With Branding:
┌────────────────────┐          ┌────────────────────┐
│ userId: string     │          │ userId: UserId     │
│ orderId: string    │          │ orderId: OrderId   │
│                    │          │                    │
│ Both are string!   │          │ Different types!   │
│ Easy to mix up!    │          │ Can't mix them!    │
└────────────────────┘          └────────────────────┘
```

## Builder Pattern

Create fluent APIs with type safety:

```typescript
class QueryBuilder<T> {
    private query: Partial<T> = {};
    private conditions: string[] = [];
    private selectedFields: (keyof T)[] = [];

    where<K extends keyof T>(key: K, value: T[K]): this {
        this.query[key] = value;
        this.conditions.push(`${String(key)} = ?`);
        return this;
    }

    select<K extends keyof T>(...keys: K[]): this {
        this.selectedFields = keys;
        return this;
    }

    orderBy<K extends keyof T>(key: K, direction: "ASC" | "DESC" = "ASC"): this {
        this.conditions.push(`ORDER BY ${String(key)} ${direction}`);
        return this;
    }

    limit(count: number): this {
        this.conditions.push(`LIMIT ${count}`);
        return this;
    }

    build(): { query: Partial<T>; sql: string } {
        const fields = this.selectedFields.length > 0
            ? this.selectedFields.join(", ")
            : "*";

        return {
            query: this.query,
            sql: `SELECT ${fields} WHERE ${this.conditions.join(" AND ")}`
        };
    }
}

// Usage
interface User {
    id: number;
    name: string;
    email: string;
    age: number;
}

const result = new QueryBuilder<User>()
    .select("id", "name", "email")
    .where("name", "John")
    .where("age", 30)
    .orderBy("name", "ASC")
    .limit(10)
    .build();

console.log(result.sql);
// SELECT id, name, email WHERE name = ? AND age = ? ORDER BY name ASC LIMIT 10
```

## Result Type Pattern

Handle errors explicitly without exceptions:

```typescript
// Result type definition
type Result<T, E = Error> =
    | { success: true; value: T }
    | { success: false; error: E };

// Helper functions
function ok<T>(value: T): Result<T, never> {
    return { success: true, value };
}

function err<E>(error: E): Result<never, E> {
    return { success: false, error };
}

// Example usage
function parseJson<T>(json: string): Result<T, string> {
    try {
        return ok(JSON.parse(json));
    } catch {
        return err("Invalid JSON");
    }
}

function divide(a: number, b: number): Result<number, string> {
    if (b === 0) {
        return err("Cannot divide by zero");
    }
    return ok(a / b);
}

// Usage
const jsonResult = parseJson<{ name: string }>('{"name": "John"}');
if (jsonResult.success) {
    console.log(jsonResult.value.name);  // ✅ TypeScript knows value exists
} else {
    console.error(jsonResult.error);     // ✅ TypeScript knows error exists
}

// Chain results
function calculate(a: string, b: string): Result<number, string> {
    const numA = parseJson<number>(a);
    if (!numA.success) return numA;

    const numB = parseJson<number>(b);
    if (!numB.success) return numB;

    return divide(numA.value, numB.value);
}
```

## State Machine Pattern

Enforce valid state transitions with types:

```typescript
// Define states
type OrderState = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";

// Define valid transitions
type StateTransitions = {
    pending: "confirmed" | "cancelled";
    confirmed: "shipped" | "cancelled";
    shipped: "delivered";
    delivered: never;
    cancelled: never;
};

// Get valid next states for a given state
type ValidTransition<S extends OrderState> = StateTransitions[S];

// Order interface with state-aware methods
interface Order<S extends OrderState = OrderState> {
    id: string;
    state: S;
    transition<N extends ValidTransition<S>>(newState: N): Order<N>;
}

// Create order function
function createOrder(id: string): Order<"pending"> {
    const order: Order<"pending"> = {
        id,
        state: "pending",
        transition(newState) {
            return {
                ...order,
                state: newState,
                transition: order.transition
            } as any;
        }
    };
    return order;
}

// Usage - TypeScript enforces valid transitions!
const order = createOrder("123");
// order.state is "pending"

const confirmed = order.transition("confirmed");
// confirmed.state is "confirmed"

const shipped = confirmed.transition("shipped");
// shipped.state is "shipped"

const delivered = shipped.transition("delivered");
// delivered.state is "delivered"

// ❌ These would be errors:
// order.transition("delivered");     // Can't go from pending to delivered
// delivered.transition("pending");   // Can't transition from delivered
```

## Discriminated Unions

Use a common property to distinguish between types:

```typescript
// Each type has a unique 'type' property
interface LoadingState {
    type: "loading";
}

interface SuccessState<T> {
    type: "success";
    data: T;
}

interface ErrorState {
    type: "error";
    message: string;
}

type AsyncState<T> = LoadingState | SuccessState<T> | ErrorState;

// TypeScript narrows based on 'type'
function renderState<T>(state: AsyncState<T>): string {
    switch (state.type) {
        case "loading":
            return "Loading...";
        case "success":
            return `Data: ${JSON.stringify(state.data)}`;
        case "error":
            return `Error: ${state.message}`;
    }
}

// Usage
const loading: AsyncState<string> = { type: "loading" };
const success: AsyncState<string> = { type: "success", data: "Hello" };
const error: AsyncState<string> = { type: "error", message: "Failed" };

console.log(renderState(loading)); // "Loading..."
console.log(renderState(success)); // "Data: "Hello""
console.log(renderState(error));   // "Error: Failed"
```

## Exhaustive Type Checking

Ensure all cases are handled:

```typescript
// Helper function that should never be called
function assertNever(value: never): never {
    throw new Error(`Unexpected value: ${value}`);
}

type Action =
    | { type: "ADD"; payload: number }
    | { type: "SUBTRACT"; payload: number }
    | { type: "MULTIPLY"; payload: number }
    | { type: "RESET" };

function reducer(state: number, action: Action): number {
    switch (action.type) {
        case "ADD":
            return state + action.payload;
        case "SUBTRACT":
            return state - action.payload;
        case "MULTIPLY":
            return state * action.payload;
        case "RESET":
            return 0;
        default:
            // If we add a new action type and forget to handle it,
            // TypeScript will error here!
            return assertNever(action);
    }
}
```

## Type-Safe Event Emitter

```typescript
// Define your events
interface EventMap {
    userLogin: { userId: string; timestamp: Date };
    userLogout: { userId: string };
    pageView: { path: string; referrer?: string };
    error: { message: string; stack?: string };
}

type EventCallback<T> = (data: T) => void;

class TypedEventEmitter<Events extends Record<string, unknown>> {
    private listeners = new Map<keyof Events, Set<EventCallback<any>>>();

    on<K extends keyof Events>(
        event: K,
        callback: EventCallback<Events[K]>
    ): () => void {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, new Set());
        }
        this.listeners.get(event)!.add(callback);

        // Return unsubscribe function
        return () => this.off(event, callback);
    }

    off<K extends keyof Events>(
        event: K,
        callback: EventCallback<Events[K]>
    ): void {
        this.listeners.get(event)?.delete(callback);
    }

    emit<K extends keyof Events>(event: K, data: Events[K]): void {
        this.listeners.get(event)?.forEach(callback => callback(data));
    }

    once<K extends keyof Events>(
        event: K,
        callback: EventCallback<Events[K]>
    ): void {
        const unsubscribe = this.on(event, (data) => {
            unsubscribe();
            callback(data);
        });
    }
}

// Usage - fully type-safe!
const emitter = new TypedEventEmitter<EventMap>();

// ✅ TypeScript knows the event data structure
emitter.on("userLogin", ({ userId, timestamp }) => {
    console.log(`User ${userId} logged in at ${timestamp}`);
});

emitter.on("pageView", ({ path, referrer }) => {
    console.log(`Page viewed: ${path}`);
    if (referrer) console.log(`Referrer: ${referrer}`);
});

// ✅ TypeScript validates emit data
emitter.emit("userLogin", {
    userId: "123",
    timestamp: new Date()
});

// ❌ Error: Missing required property
// emitter.emit("userLogin", { userId: "123" });

// ❌ Error: Wrong event name
// emitter.emit("userLoginn", { userId: "123" });
```

## Dependency Injection Container

Type-safe DI container:

```typescript
type Constructor<T = unknown> = new (...args: any[]) => T;

class Container {
    private instances = new Map<Constructor, unknown>();
    private factories = new Map<Constructor, () => unknown>();

    register<T>(token: Constructor<T>, factory: () => T): void {
        this.factories.set(token, factory);
    }

    registerSingleton<T>(token: Constructor<T>, factory: () => T): void {
        this.register(token, () => {
            if (!this.instances.has(token)) {
                this.instances.set(token, factory());
            }
            return this.instances.get(token) as T;
        });
    }

    resolve<T>(token: Constructor<T>): T {
        const factory = this.factories.get(token);
        if (!factory) {
            throw new Error(`No provider for ${token.name}`);
        }
        return factory() as T;
    }
}

// Usage
class Logger {
    log(message: string) {
        console.log(`[LOG] ${message}`);
    }
}

class Database {
    constructor(private logger: Logger) {}

    query(sql: string) {
        this.logger.log(`Executing: ${sql}`);
        return [];
    }
}

class UserService {
    constructor(
        private db: Database,
        private logger: Logger
    ) {}

    getUsers() {
        this.logger.log("Getting users");
        return this.db.query("SELECT * FROM users");
    }
}

// Configure container
const container = new Container();
container.registerSingleton(Logger, () => new Logger());
container.registerSingleton(Database, () =>
    new Database(container.resolve(Logger))
);
container.register(UserService, () =>
    new UserService(
        container.resolve(Database),
        container.resolve(Logger)
    )
);

// Resolve dependencies
const userService = container.resolve(UserService);
userService.getUsers();
```

## Advanced Utility Types

```typescript
// Deep partial - make all nested properties optional
type DeepPartial<T> = T extends object
    ? { [P in keyof T]?: DeepPartial<T[P]> }
    : T;

// Deep readonly - make all nested properties readonly
type DeepReadonly<T> = T extends object
    ? { readonly [P in keyof T]: DeepReadonly<T[P]> }
    : T;

// Deep required - make all nested properties required
type DeepRequired<T> = T extends object
    ? { [P in keyof T]-?: DeepRequired<T[P]> }
    : T;

// Get all paths in an object (dot notation)
type Paths<T, D extends number = 10> = [D] extends [never]
    ? never
    : T extends object
    ? {
          [K in keyof T]-?: K extends string | number
              ? `${K}` | Join<K, Paths<T[K], Prev[D]>>
              : never;
      }[keyof T]
    : never;

type Prev = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
type Join<K, P> = K extends string | number
    ? P extends string | number
        ? `${K}.${P}`
        : never
    : never;

// Mutable - remove readonly from all properties
type Mutable<T> = {
    -readonly [P in keyof T]: T[P];
};

// Optional keys - get keys that are optional
type OptionalKeys<T> = {
    [K in keyof T]-?: {} extends Pick<T, K> ? K : never;
}[keyof T];

// Required keys - get keys that are required
type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Pick<T, K> ? never : K;
}[keyof T];
```

## Summary

| Pattern | Purpose |
|---------|---------|
| Type Guards | Narrow types at runtime |
| Assertion Functions | Assert conditions or throw |
| Branded Types | Prevent mixing similar types |
| Builder Pattern | Fluent, type-safe APIs |
| Result Type | Explicit error handling |
| State Machine | Valid state transitions only |
| Discriminated Unions | Type narrowing by property |
| Exhaustive Checking | Ensure all cases handled |

### Best Practices

1. **Enable strict mode** - Catches more errors at compile time
2. **Prefer unknown over any** - Forces type checking
3. **Use branded types** - Prevent accidental type mixing
4. **Handle all cases** - Use exhaustive type checking
5. **Document with types** - Types are better than comments
6. **Keep types simple** - Complex types are hard to understand

---

Congratulations! You've completed the TypeScript tutorial. Continue practicing these patterns in your projects to master TypeScript.

[← Back to TypeScript Index](/guide/typescript/)
