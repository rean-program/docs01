# Classes

Learn Object-Oriented Programming with TypeScript classes.

::: info What You'll Learn
- How to create classes with typed properties and methods
- Access modifiers (public, private, protected)
- Inheritance and abstract classes
- Implementing interfaces with classes
:::

## Why Use Classes in TypeScript?

Classes provide a **blueprint** for creating objects with specific properties and behaviors. TypeScript adds type safety to make your classes more robust.

```
Think of a Class like a Cookie Cutter:

    🍪 Cookie Cutter (Class)          🍪🍪🍪 Cookies (Objects/Instances)
    ┌─────────────────────┐           ┌─────────┐ ┌─────────┐ ┌─────────┐
    │  Shape: Star        │    ───▶   │ Cookie1 │ │ Cookie2 │ │ Cookie3 │
    │  Size: 3 inches     │           │ (star)  │ │ (star)  │ │ (star)  │
    └─────────────────────┘           └─────────┘ └─────────┘ └─────────┘
```

## Basic Class

Here's how to define a simple class in TypeScript:

```typescript
class Person {
    name: string;      // Property declaration with type
    age: number;       // Property declaration with type

    // Constructor - runs when you create a new Person
    constructor(name: string, age: number) {
        this.name = name;
        this.age = age;
    }

    // Method - a function that belongs to the class
    greet(): string {
        return `Hello, I'm ${this.name}`;
    }
}

// Creating an instance (object) from the class
const person = new Person("John", 30);
console.log(person.greet()); // "Hello, I'm John"
console.log(person.name);    // "John"
console.log(person.age);     // 30
```

### Visual Breakdown

```
class Person {                    ← Class declaration
    name: string;                 ← Property with type
    age: number;                  ← Property with type

    constructor(                  ← Constructor (creates new instances)
        name: string,             ← Parameter types
        age: number
    ) {
        this.name = name;         ← Assign to instance property
        this.age = age;
    }

    greet(): string {             ← Method with return type
        return `Hello, I'm ${this.name}`;
    }
}
```

## Parameter Properties

TypeScript provides a shorthand for declaring and initializing properties:

```typescript
// ❌ Verbose way (lots of repetition)
class PersonVerbose {
    name: string;
    age: number;

    constructor(name: string, age: number) {
        this.name = name;
        this.age = age;
    }
}

// ✅ Shorthand way (parameter properties)
class Person {
    // Adding 'public' or 'private' before parameters
    // automatically creates and assigns properties!
    constructor(
        public name: string,
        public age: number,
        private ssn: string  // Private - not accessible outside
    ) {}  // Empty constructor body - work is done!
}

const person = new Person("John", 30, "123-45-6789");
console.log(person.name);  // ✅ "John"
console.log(person.age);   // ✅ 30
// console.log(person.ssn);  // ❌ Error: 'ssn' is private
```

::: tip When to Use Parameter Properties
Use parameter properties when:
- You're simply assigning constructor parameters to instance properties
- You want cleaner, more concise code
- The property and parameter have the same name
:::

## Access Modifiers

Access modifiers control who can access properties and methods:

```
┌────────────────────────────────────────────────────────────────┐
│ Access Modifier Comparison                                      │
├────────────────┬──────────────┬─────────────┬─────────────────┤
│ Modifier       │ Inside Class │ Subclasses  │ Outside Class   │
├────────────────┼──────────────┼─────────────┼─────────────────┤
│ public         │ ✅ Yes       │ ✅ Yes      │ ✅ Yes          │
│ protected      │ ✅ Yes       │ ✅ Yes      │ ❌ No           │
│ private        │ ✅ Yes       │ ❌ No       │ ❌ No           │
└────────────────┴──────────────┴─────────────┴─────────────────┘
```

### Public (default)

Properties and methods are `public` by default - accessible from anywhere:

```typescript
class Animal {
    public name: string;  // 'public' is optional (default)

    constructor(name: string) {
        this.name = name;
    }

    public speak(): void {  // 'public' is optional
        console.log(`${this.name} makes a sound`);
    }
}

const animal = new Animal("Dog");
console.log(animal.name);  // ✅ "Dog" - accessible
animal.speak();            // ✅ "Dog makes a sound"
```

### Private

`private` properties/methods are only accessible inside the class:

```typescript
class BankAccount {
    private balance: number = 0;  // Only accessible inside this class

    deposit(amount: number): void {
        if (amount > 0) {
            this.balance += amount;  // ✅ Can access inside class
        }
    }

    withdraw(amount: number): boolean {
        if (amount <= this.balance) {
            this.balance -= amount;
            return true;
        }
        return false;
    }

    getBalance(): number {
        return this.balance;  // Provide controlled access
    }
}

const account = new BankAccount();
account.deposit(100);
// account.balance;          // ❌ Error: 'balance' is private
console.log(account.getBalance()); // ✅ 100 (controlled access)
```

::: warning Why Use Private?
Private members protect your data from being accidentally modified:
- **Encapsulation**: Hide implementation details
- **Validation**: Force users to use methods that validate input
- **Flexibility**: Change internal implementation without breaking external code
:::

### Protected

`protected` is like `private` but also accessible in subclasses:

```typescript
class Animal {
    protected name: string;  // Accessible in this class AND subclasses

    constructor(name: string) {
        this.name = name;
    }
}

class Dog extends Animal {
    bark(): void {
        // ✅ Can access 'protected' in subclass
        console.log(`${this.name} barks!`);
    }
}

const dog = new Dog("Buddy");
dog.bark();    // ✅ "Buddy barks!"
// dog.name;   // ❌ Error: 'name' is protected (not from outside)
```

## Readonly Properties

Use `readonly` for properties that shouldn't change after creation:

```typescript
class Config {
    readonly apiUrl: string;        // Can only be set in constructor
    readonly timeout: number;

    constructor(apiUrl: string, timeout: number = 5000) {
        this.apiUrl = apiUrl;       // ✅ Setting in constructor is OK
        this.timeout = timeout;
    }

    updateUrl(url: string): void {
        // this.apiUrl = url;       // ❌ Error: cannot assign to 'readonly'
    }
}

const config = new Config("https://api.example.com");
console.log(config.apiUrl);         // ✅ Can read
// config.apiUrl = "other";         // ❌ Error: readonly
```

## Getters and Setters

Getters and setters let you control how properties are accessed and modified:

```typescript
class Circle {
    private _radius: number = 0;  // Private backing field

    // Getter - runs when you read 'radius'
    get radius(): number {
        return this._radius;
    }

    // Setter - runs when you assign to 'radius'
    set radius(value: number) {
        if (value < 0) {
            throw new Error("Radius cannot be negative");
        }
        this._radius = value;
    }

    // Read-only computed property (no setter)
    get area(): number {
        return Math.PI * this._radius ** 2;
    }

    get circumference(): number {
        return 2 * Math.PI * this._radius;
    }
}

const circle = new Circle();
circle.radius = 5;          // Calls setter - validates!
console.log(circle.radius); // Calls getter - returns 5
console.log(circle.area);   // 78.54... (computed property)
// circle.area = 100;       // ❌ Error: no setter (read-only)
// circle.radius = -1;      // ❌ Error: "Radius cannot be negative"
```

::: tip When to Use Getters/Setters
- **Validation**: Ensure values meet requirements before setting
- **Computed values**: Calculate properties on-the-fly
- **Lazy loading**: Load data only when first accessed
- **Logging/debugging**: Track when properties are accessed
:::

## Static Members

Static members belong to the **class itself**, not instances:

```typescript
class MathUtils {
    static readonly PI = 3.14159;  // Belongs to the class

    static add(a: number, b: number): number {
        return a + b;
    }

    static multiply(a: number, b: number): number {
        return a * b;
    }
}

// Access directly on the class (no 'new' needed!)
console.log(MathUtils.PI);           // 3.14159
console.log(MathUtils.add(2, 3));    // 5

// ❌ Cannot access on instances
// const utils = new MathUtils();
// utils.PI;  // Error
```

### Static vs Instance Members

```
┌────────────────────────────────────────────────────────────────┐
│ Static vs Instance Members                                      │
├─────────────────────────────┬──────────────────────────────────┤
│ Static Members              │ Instance Members                  │
├─────────────────────────────┼──────────────────────────────────┤
│ Belong to the class itself  │ Belong to each object            │
│ Access: ClassName.member    │ Access: object.member            │
│ Shared across all instances │ Unique to each instance          │
│ Don't need 'new'            │ Need 'new' to create object      │
├─────────────────────────────┼──────────────────────────────────┤
│ MathUtils.PI                │ const circle = new Circle();     │
│ MathUtils.add(1, 2)         │ circle.radius                    │
└─────────────────────────────┴──────────────────────────────────┘
```

## Inheritance

Classes can **extend** other classes to inherit properties and methods:

```typescript
// Base class (parent)
class Animal {
    constructor(public name: string) {}

    move(distance: number): void {
        console.log(`${this.name} moved ${distance} meters`);
    }
}

// Derived class (child) - inherits from Animal
class Dog extends Animal {
    constructor(name: string, public breed: string) {
        super(name);  // Call parent constructor FIRST
    }

    // New method specific to Dog
    bark(): void {
        console.log("Woof!");
    }

    // Override parent method
    move(distance: number): void {
        console.log("Running...");
        super.move(distance);  // Call parent's move()
    }
}

const dog = new Dog("Buddy", "Golden Retriever");
dog.bark();      // "Woof!" (Dog's method)
dog.move(10);    // "Running..." then "Buddy moved 10 meters"
console.log(dog.name);   // ✅ "Buddy" (inherited from Animal)
console.log(dog.breed);  // ✅ "Golden Retriever" (Dog's property)
```

### Inheritance Rules

```
Animal (Base Class)
    │
    ├── name: string        ← Inherited by Dog
    ├── move(): void        ← Can be overridden
    │
    └───────▶ Dog (Derived Class)
                  │
                  ├── breed: string    ← Dog's own property
                  ├── bark(): void     ← Dog's own method
                  └── move(): void     ← Overrides Animal's move
```

::: warning super() is Required
When extending a class, you MUST call `super()` in the constructor before using `this`:

```typescript
class Child extends Parent {
    constructor() {
        super();           // ✅ Must call super() first!
        this.value = 42;   // Now you can use 'this'
    }
}
```
:::

## Abstract Classes

Abstract classes are blueprints that **cannot be instantiated directly** - they must be extended:

```typescript
// Abstract class - cannot create with 'new'
abstract class Shape {
    // Abstract methods - MUST be implemented by subclasses
    abstract getArea(): number;
    abstract getPerimeter(): number;

    // Concrete method - inherited as-is
    describe(): string {
        return `Area: ${this.getArea()}, Perimeter: ${this.getPerimeter()}`;
    }
}

class Rectangle extends Shape {
    constructor(
        private width: number,
        private height: number
    ) {
        super();
    }

    // Must implement abstract methods
    getArea(): number {
        return this.width * this.height;
    }

    getPerimeter(): number {
        return 2 * (this.width + this.height);
    }
}

class Circle extends Shape {
    constructor(private radius: number) {
        super();
    }

    getArea(): number {
        return Math.PI * this.radius ** 2;
    }

    getPerimeter(): number {
        return 2 * Math.PI * this.radius;
    }
}

// const shape = new Shape();  // ❌ Error: cannot instantiate abstract class
const rect = new Rectangle(10, 5);
console.log(rect.describe()); // "Area: 50, Perimeter: 30"
```

### When to Use Abstract Classes

| Use Case | Explanation |
|----------|-------------|
| Shared behavior | When classes share some implementation but differ in others |
| Enforcing structure | Force subclasses to implement specific methods |
| Template pattern | Define algorithm skeleton, let subclasses fill in details |

## Implementing Interfaces

Classes can implement interfaces to guarantee they have certain properties/methods:

```typescript
interface Printable {
    print(): void;
}

interface Serializable {
    serialize(): string;
    deserialize(data: string): void;
}

// Class implements multiple interfaces
class Document implements Printable, Serializable {
    constructor(public content: string) {}

    print(): void {
        console.log(this.content);
    }

    serialize(): string {
        return JSON.stringify({ content: this.content });
    }

    deserialize(data: string): void {
        const parsed = JSON.parse(data);
        this.content = parsed.content;
    }
}
```

### Interface vs Abstract Class

```
┌─────────────────────────────────────────────────────────────────┐
│ Interface vs Abstract Class                                      │
├──────────────────────────────┬──────────────────────────────────┤
│ Interface                    │ Abstract Class                    │
├──────────────────────────────┼──────────────────────────────────┤
│ Only declares structure      │ Can have implementation           │
│ Multiple interfaces allowed  │ Only one parent class             │
│ No runtime cost             │ Exists at runtime                 │
│ Use for "can do" contracts  │ Use for "is a" relationships     │
├──────────────────────────────┼──────────────────────────────────┤
│ interface Flyable {          │ abstract class Bird {             │
│   fly(): void;               │   abstract fly(): void;           │
│ }                            │   eat() { ... }                   │
│                              │ }                                  │
└──────────────────────────────┴──────────────────────────────────┘
```

## Generic Classes

Classes can use generics to work with multiple types:

```typescript
class Stack<T> {
    private items: T[] = [];

    push(item: T): void {
        this.items.push(item);
    }

    pop(): T | undefined {
        return this.items.pop();
    }

    peek(): T | undefined {
        return this.items[this.items.length - 1];
    }

    isEmpty(): boolean {
        return this.items.length === 0;
    }

    size(): number {
        return this.items.length;
    }
}

// Stack of numbers
const numberStack = new Stack<number>();
numberStack.push(1);
numberStack.push(2);
console.log(numberStack.pop()); // 2

// Stack of strings
const stringStack = new Stack<string>();
stringStack.push("hello");
stringStack.push("world");
console.log(stringStack.pop()); // "world"
```

## Method Chaining with `this`

Return `this` to enable fluent method chaining:

```typescript
class QueryBuilder {
    private query: string = "";

    select(fields: string): this {
        this.query += `SELECT ${fields} `;
        return this;
    }

    from(table: string): this {
        this.query += `FROM ${table} `;
        return this;
    }

    where(condition: string): this {
        this.query += `WHERE ${condition} `;
        return this;
    }

    build(): string {
        return this.query.trim();
    }
}

// Fluent API - chain methods together
const query = new QueryBuilder()
    .select("name, email")
    .from("users")
    .where("age > 18")
    .build();

console.log(query);
// "SELECT name, email FROM users WHERE age > 18"
```

## Practice Exercise

Let's build a task management system using classes:

```typescript
enum TaskStatus {
    Todo = "TODO",
    InProgress = "IN_PROGRESS",
    Done = "DONE"
}

enum Priority {
    Low = 1,
    Medium = 2,
    High = 3
}

interface Task {
    id: string;
    title: string;
    description?: string;
    status: TaskStatus;
    priority: Priority;
    createdAt: Date;
    completedAt?: Date;
}

abstract class TaskManager {
    protected tasks: Map<string, Task> = new Map();

    // Abstract method - subclasses must implement
    abstract generateId(): string;

    addTask(title: string, priority: Priority = Priority.Medium): Task {
        const task: Task = {
            id: this.generateId(),
            title,
            status: TaskStatus.Todo,
            priority,
            createdAt: new Date()
        };
        this.tasks.set(task.id, task);
        return task;
    }

    getTask(id: string): Task | undefined {
        return this.tasks.get(id);
    }

    updateStatus(id: string, status: TaskStatus): boolean {
        const task = this.tasks.get(id);
        if (!task) return false;

        task.status = status;
        if (status === TaskStatus.Done) {
            task.completedAt = new Date();
        }
        return true;
    }

    deleteTask(id: string): boolean {
        return this.tasks.delete(id);
    }

    getAllTasks(): Task[] {
        return Array.from(this.tasks.values());
    }

    getTasksByStatus(status: TaskStatus): Task[] {
        return this.getAllTasks().filter(t => t.status === status);
    }

    getTasksByPriority(priority: Priority): Task[] {
        return this.getAllTasks().filter(t => t.priority === priority);
    }
}

// Simple counter-based ID generator
class SimpleTaskManager extends TaskManager {
    private counter = 0;

    generateId(): string {
        return `task-${++this.counter}`;
    }
}

// UUID-based ID generator
class UUIDTaskManager extends TaskManager {
    generateId(): string {
        return crypto.randomUUID();
    }
}

// Usage
const manager = new SimpleTaskManager();

const task1 = manager.addTask("Learn TypeScript", Priority.High);
const task2 = manager.addTask("Build a project", Priority.Medium);

manager.updateStatus(task1.id, TaskStatus.InProgress);
console.log(manager.getTasksByStatus(TaskStatus.InProgress));
// [{ id: 'task-1', title: 'Learn TypeScript', ... }]
```

## Summary

| Concept | Use Case |
|---------|----------|
| **public** | Default - accessible everywhere |
| **private** | Hide internal implementation |
| **protected** | Share with subclasses only |
| **readonly** | Prevent modification after creation |
| **static** | Class-level properties/methods |
| **abstract** | Blueprint for other classes |
| **extends** | Inherit from a parent class |
| **implements** | Guarantee interface compliance |

---

[Next: Generics →](/guide/typescript/05-generics)
