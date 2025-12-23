# Object-Oriented Programming

JavaScript supports object-oriented programming through prototypes and ES6 classes. This guide covers OOP concepts and patterns in JavaScript.

::: info What You'll Learn
- Understand the four pillars of OOP
- Create classes with constructors and methods
- Use private fields and getters/setters
- Implement inheritance with extends
- Apply common design patterns
:::

## OOP Concepts

```
┌─────────────────────────────────────────────────────────────────┐
│                 The Four Pillars of OOP                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────┐    ┌─────────────────┐                     │
│  │  ENCAPSULATION  │    │   ABSTRACTION   │                     │
│  ├─────────────────┤    ├─────────────────┤                     │
│  │ Bundle data +   │    │ Hide complexity │                     │
│  │ methods together│    │ Show only what's│                     │
│  │                 │    │ necessary       │                     │
│  │ class User {    │    │                 │                     │
│  │   #password;    │    │ car.start();    │                     │
│  │   login() {}    │    │ // Don't need   │                     │
│  │ }               │    │ // to know how  │                     │
│  └─────────────────┘    └─────────────────┘                     │
│                                                                  │
│  ┌─────────────────┐    ┌─────────────────┐                     │
│  │   INHERITANCE   │    │  POLYMORPHISM   │                     │
│  ├─────────────────┤    ├─────────────────┤                     │
│  │ Reuse code from │    │ Same interface, │                     │
│  │ parent class    │    │ different       │                     │
│  │                 │    │ behavior        │                     │
│  │ class Dog       │    │                 │                     │
│  │  extends Animal │    │ shapes.forEach( │                     │
│  │                 │    │  s => s.draw()) │                     │
│  └─────────────────┘    └─────────────────┘                     │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### The Four Pillars of OOP

1. **Encapsulation**: Bundling data and methods together
2. **Abstraction**: Hiding complex implementation details
3. **Inheritance**: Creating new classes based on existing ones
4. **Polymorphism**: Objects of different types responding to the same interface

## Constructor Functions

The traditional way to create objects before ES6:

```js
function Person(name, age) {
    this.name = name;
    this.age = age;
}

// Adding methods to prototype
Person.prototype.greet = function() {
    return `Hello, I'm ${this.name}`;
};

Person.prototype.getAge = function() {
    return this.age;
};

const person = new Person("John", 30);
console.log(person.greet()); // "Hello, I'm John"
```

## ES6 Classes

Modern, cleaner syntax for creating objects.

```
┌─────────────────────────────────────────────────────────────────┐
│                    Class Anatomy                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  class Person {                                                  │
│      │                                                           │
│      │    // Constructor - runs when creating new instance       │
│      ├─▶ constructor(name, age) {                               │
│      │       this.name = name;  ◀── Properties                  │
│      │       this.age = age;                                     │
│      │   }                                                       │
│      │                                                           │
│      │   // Method - behavior/action                             │
│      ├─▶ greet() {                                              │
│      │       return `Hello, I'm ${this.name}`;                   │
│      │   }                                                       │
│      │                                                           │
│      │   // Getter - computed property                           │
│      ├─▶ get birthYear() {                                      │
│      │       return new Date().getFullYear() - this.age;         │
│      │   }                                                       │
│  }                                                               │
│                                                                  │
│  const person = new Person("John", 30);                          │
│        │                                                         │
│        └─▶ "new" creates an instance of the class               │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

```js
class Person {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }

    greet() {
        return `Hello, I'm ${this.name}`;
    }

    getAge() {
        return this.age;
    }
}

const person = new Person("John", 30);
console.log(person.greet()); // "Hello, I'm John"
```

## Encapsulation

Bundling data with methods that operate on that data.

::: tip Public vs Private
| Access Level | Syntax | Accessible From |
|--------------|--------|-----------------|
| Public | `this.name` | Anywhere |
| Private | `#balance` | Only inside class |
| Getter | `get value()` | Read-only access |
| Setter | `set value(v)` | Controlled write access |
:::

### Public Properties

```js
class User {
    constructor(name) {
        this.name = name;    // Public property
        this.createdAt = new Date();
    }
}

const user = new User("John");
console.log(user.name); // "John" - accessible
```

### Private Properties

```js
class BankAccount {
    #balance = 0;          // Private field
    #transactions = [];    // Private field

    constructor(initialBalance) {
        this.#balance = initialBalance;
    }

    deposit(amount) {
        if (amount > 0) {
            this.#balance += amount;
            this.#logTransaction("deposit", amount);
        }
    }

    withdraw(amount) {
        if (amount > 0 && amount <= this.#balance) {
            this.#balance -= amount;
            this.#logTransaction("withdraw", amount);
            return true;
        }
        return false;
    }

    getBalance() {
        return this.#balance;
    }

    // Private method
    #logTransaction(type, amount) {
        this.#transactions.push({ type, amount, date: new Date() });
    }
}

const account = new BankAccount(100);
account.deposit(50);
console.log(account.getBalance()); // 150
// console.log(account.#balance);  // SyntaxError
```

### Getters and Setters

```js
class Circle {
    #radius;

    constructor(radius) {
        this.radius = radius; // Uses setter
    }

    get radius() {
        return this.#radius;
    }

    set radius(value) {
        if (value < 0) {
            throw new Error("Radius cannot be negative");
        }
        this.#radius = value;
    }

    get diameter() {
        return this.#radius * 2;
    }

    get area() {
        return Math.PI * this.#radius ** 2;
    }

    get circumference() {
        return 2 * Math.PI * this.#radius;
    }
}

const circle = new Circle(5);
console.log(circle.radius);      // 5
console.log(circle.diameter);    // 10
console.log(circle.area);        // ~78.54
```

## Inheritance

Creating new classes based on existing ones.

```
┌─────────────────────────────────────────────────────────────────┐
│                  Inheritance Hierarchy                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│                    ┌─────────────┐                               │
│                    │   Animal    │  ◀── Parent/Base class       │
│                    │─────────────│                               │
│                    │ name        │                               │
│                    │ eat()       │                               │
│                    │ speak()     │                               │
│                    └──────┬──────┘                               │
│                           │                                      │
│              ┌────────────┼────────────┐                        │
│              │            │            │                         │
│              ▼            ▼            ▼                         │
│        ┌─────────┐  ┌─────────┐  ┌─────────┐                    │
│        │   Dog   │  │   Cat   │  │  Bird   │  ◀── Child classes │
│        │─────────│  │─────────│  │─────────│                    │
│        │ breed   │  │ indoor  │  │ canFly  │                    │
│        │ fetch() │  │ scratch │  │ fly()   │                    │
│        │ speak() │  │ speak() │  │ speak() │  ◀── Override      │
│        └─────────┘  └─────────┘  └─────────┘                    │
│                                                                  │
│  dog.eat();    ← inherited from Animal                           │
│  dog.speak();  ← Dog's own version ("bark")                     │
│  dog.fetch();  ← Dog's unique method                             │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Basic Inheritance

```js
class Animal {
    constructor(name) {
        this.name = name;
    }

    speak() {
        console.log(`${this.name} makes a sound`);
    }

    eat() {
        console.log(`${this.name} is eating`);
    }
}

class Dog extends Animal {
    constructor(name, breed) {
        super(name); // Call parent constructor
        this.breed = breed;
    }

    speak() {
        console.log(`${this.name} barks`);
    }

    fetch() {
        console.log(`${this.name} fetches the ball`);
    }
}

class Cat extends Animal {
    speak() {
        console.log(`${this.name} meows`);
    }

    scratch() {
        console.log(`${this.name} scratches`);
    }
}

const dog = new Dog("Rex", "German Shepherd");
const cat = new Cat("Whiskers");

dog.speak(); // "Rex barks"
dog.eat();   // "Rex is eating" (inherited)
cat.speak(); // "Whiskers meows"
```

### Calling Parent Methods

```js
class Vehicle {
    constructor(brand) {
        this.brand = brand;
    }

    start() {
        return `${this.brand} starting...`;
    }
}

class Car extends Vehicle {
    constructor(brand, model) {
        super(brand);
        this.model = model;
    }

    start() {
        // Call parent method
        const parentMessage = super.start();
        return `${parentMessage} ${this.model} ready!`;
    }
}

const car = new Car("Toyota", "Camry");
console.log(car.start()); // "Toyota starting... Camry ready!"
```

### Multi-level Inheritance

```js
class Animal {
    eat() {
        return "eating";
    }
}

class Mammal extends Animal {
    breathe() {
        return "breathing";
    }
}

class Dog extends Mammal {
    bark() {
        return "barking";
    }
}

const dog = new Dog();
console.log(dog.eat());     // "eating"
console.log(dog.breathe()); // "breathing"
console.log(dog.bark());    // "barking"
```

## Static Members

Members that belong to the class itself, not instances.

```
┌─────────────────────────────────────────────────────────────────┐
│                Instance vs Static Members                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  class Counter {                                                 │
│      static count = 0;    ◀── Shared by ALL instances           │
│                                                                  │
│      constructor() {                                             │
│          this.id = ++Counter.count;  ◀── Instance property      │
│      }                                                           │
│                                                                  │
│      static getTotal() {  ◀── Called on class: Counter.getTotal │
│          return Counter.count;                                   │
│      }                                                           │
│                                                                  │
│      getId() {            ◀── Called on instance: obj.getId()   │
│          return this.id;                                         │
│      }                                                           │
│  }                                                               │
│                                                                  │
│  const a = new Counter();  // a.id = 1, Counter.count = 1       │
│  const b = new Counter();  // b.id = 2, Counter.count = 2       │
│  Counter.getTotal();       // 2                                  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

```js
class MathUtils {
    static PI = 3.14159;

    static add(a, b) {
        return a + b;
    }

    static multiply(a, b) {
        return a * b;
    }

    static #privateHelper() {
        return "private";
    }
}

console.log(MathUtils.PI);         // 3.14159
console.log(MathUtils.add(2, 3));  // 5
// console.log(MathUtils.#privateHelper()); // Error

class Counter {
    static #count = 0;

    constructor() {
        Counter.#count++;
    }

    static getCount() {
        return Counter.#count;
    }
}

new Counter();
new Counter();
console.log(Counter.getCount()); // 2
```

## Polymorphism

Same interface, different implementations:

```js
class Shape {
    getArea() {
        throw new Error("Method must be implemented");
    }

    getPerimeter() {
        throw new Error("Method must be implemented");
    }

    describe() {
        return `Area: ${this.getArea()}, Perimeter: ${this.getPerimeter()}`;
    }
}

class Rectangle extends Shape {
    constructor(width, height) {
        super();
        this.width = width;
        this.height = height;
    }

    getArea() {
        return this.width * this.height;
    }

    getPerimeter() {
        return 2 * (this.width + this.height);
    }
}

class Circle extends Shape {
    constructor(radius) {
        super();
        this.radius = radius;
    }

    getArea() {
        return Math.PI * this.radius ** 2;
    }

    getPerimeter() {
        return 2 * Math.PI * this.radius;
    }
}

// Polymorphic behavior
const shapes = [
    new Rectangle(4, 5),
    new Circle(3),
    new Rectangle(2, 8)
];

shapes.forEach(shape => {
    console.log(shape.describe());
});
```

## Composition over Inheritance

Favor composition for more flexible designs.

::: tip Inheritance vs Composition
| Inheritance | Composition |
|-------------|-------------|
| "is-a" relationship | "has-a" relationship |
| Dog IS an Animal | Car HAS an Engine |
| Tight coupling | Loose coupling |
| Less flexible | More flexible |
| One parent only | Multiple abilities |
:::

```
┌─────────────────────────────────────────────────────────────────┐
│                 Composition Example                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Abilities (mixins):                                             │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐                          │
│  │ canSwim │  │ canFly  │  │ canWalk │                          │
│  └────┬────┘  └────┬────┘  └────┬────┘                          │
│       │            │            │                                │
│       └────────────┼────────────┘                                │
│                    │                                             │
│       ┌────────────┼────────────┐                               │
│       │            │            │                                │
│       ▼            ▼            ▼                                │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐                          │
│  │  Duck   │  │  Fish   │  │ Penguin │                          │
│  │ swim ✓  │  │ swim ✓  │  │ swim ✓  │                          │
│  │ fly ✓   │  │ fly ✗   │  │ fly ✗   │                          │
│  │ walk ✓  │  │ walk ✗  │  │ walk ✓  │                          │
│  └─────────┘  └─────────┘  └─────────┘                          │
│                                                                  │
│  Mix and match abilities as needed!                              │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

```js
// Mixins / Composition
const canSwim = {
    swim() {
        return `${this.name} is swimming`;
    }
};

const canFly = {
    fly() {
        return `${this.name} is flying`;
    }
};

const canWalk = {
    walk() {
        return `${this.name} is walking`;
    }
};

class Animal {
    constructor(name) {
        this.name = name;
    }
}

class Duck extends Animal {
    constructor(name) {
        super(name);
    }
}

// Compose abilities
Object.assign(Duck.prototype, canSwim, canFly, canWalk);

const duck = new Duck("Donald");
console.log(duck.swim()); // "Donald is swimming"
console.log(duck.fly());  // "Donald is flying"
console.log(duck.walk()); // "Donald is walking"
```

### Factory with Composition

```js
const createSwimmer = (state) => ({
    swim: () => `${state.name} swims`
});

const createFlyer = (state) => ({
    fly: () => `${state.name} flies`
});

const createWalker = (state) => ({
    walk: () => `${state.name} walks`
});

function createDuck(name) {
    const state = { name };

    return {
        ...state,
        ...createSwimmer(state),
        ...createFlyer(state),
        ...createWalker(state)
    };
}

function createPenguin(name) {
    const state = { name };

    return {
        ...state,
        ...createSwimmer(state),
        ...createWalker(state)
        // No flying for penguins
    };
}

const duck = createDuck("Donald");
const penguin = createPenguin("Pingu");

console.log(duck.fly());   // "Donald flies"
console.log(penguin.swim()); // "Pingu swims"
```

## Abstract Classes (Simulated)

JavaScript doesn't have true abstract classes, but we can simulate them:

```js
class AbstractVehicle {
    constructor() {
        if (new.target === AbstractVehicle) {
            throw new Error("Cannot instantiate abstract class");
        }
    }

    // Abstract methods
    start() {
        throw new Error("Method 'start' must be implemented");
    }

    stop() {
        throw new Error("Method 'stop' must be implemented");
    }

    // Concrete method
    honk() {
        return "Beep beep!";
    }
}

class Car extends AbstractVehicle {
    start() {
        return "Car engine starting...";
    }

    stop() {
        return "Car engine stopping...";
    }
}

// const vehicle = new AbstractVehicle(); // Error
const car = new Car();
console.log(car.start()); // "Car engine starting..."
console.log(car.honk());  // "Beep beep!"
```

## instanceof and Type Checking

```js
class Animal {}
class Dog extends Animal {}
class Cat extends Animal {}

const dog = new Dog();

console.log(dog instanceof Dog);    // true
console.log(dog instanceof Animal); // true
console.log(dog instanceof Cat);    // false
console.log(dog instanceof Object); // true

// Check constructor
console.log(dog.constructor === Dog);    // true
console.log(dog.constructor.name);       // "Dog"

// Custom type checking
class TypedArray {
    static [Symbol.hasInstance](instance) {
        return Array.isArray(instance);
    }
}

console.log([] instanceof TypedArray); // true
```

## Prototype Chain

Understanding how inheritance works under the hood:

```js
class Animal {
    eat() {
        return "eating";
    }
}

class Dog extends Animal {
    bark() {
        return "barking";
    }
}

const dog = new Dog();

// Prototype chain
console.log(dog.__proto__ === Dog.prototype);           // true
console.log(Dog.prototype.__proto__ === Animal.prototype); // true
console.log(Animal.prototype.__proto__ === Object.prototype); // true

// Check prototype
console.log(Object.getPrototypeOf(dog) === Dog.prototype); // true

// Check if property is own or inherited
console.log(dog.hasOwnProperty("bark")); // false (on prototype)
dog.name = "Rex";
console.log(dog.hasOwnProperty("name")); // true (own property)
```

## Design Patterns

Common solutions to recurring problems.

::: tip Common OOP Design Patterns
| Pattern | Purpose | Use Case |
|---------|---------|----------|
| Singleton | One instance only | Database connection |
| Factory | Create objects | User types (admin, guest) |
| Observer | Event notification | State changes |
| Decorator | Add behavior | Extend functionality |
:::

### Singleton

```js
class Database {
    static #instance = null;

    constructor() {
        if (Database.#instance) {
            return Database.#instance;
        }
        Database.#instance = this;
        this.connection = null;
    }

    connect(url) {
        this.connection = url;
        console.log(`Connected to ${url}`);
    }

    static getInstance() {
        if (!Database.#instance) {
            Database.#instance = new Database();
        }
        return Database.#instance;
    }
}

const db1 = Database.getInstance();
const db2 = Database.getInstance();
console.log(db1 === db2); // true
```

### Factory

```js
class UserFactory {
    static createUser(type, data) {
        switch (type) {
            case "admin":
                return new AdminUser(data);
            case "regular":
                return new RegularUser(data);
            case "guest":
                return new GuestUser(data);
            default:
                throw new Error("Unknown user type");
        }
    }
}

class AdminUser {
    constructor({ name }) {
        this.name = name;
        this.role = "admin";
        this.permissions = ["read", "write", "delete"];
    }
}

class RegularUser {
    constructor({ name }) {
        this.name = name;
        this.role = "regular";
        this.permissions = ["read", "write"];
    }
}

class GuestUser {
    constructor({ name }) {
        this.name = name || "Guest";
        this.role = "guest";
        this.permissions = ["read"];
    }
}

const admin = UserFactory.createUser("admin", { name: "John" });
const guest = UserFactory.createUser("guest", {});
```

### Observer

```js
class EventEmitter {
    #listeners = new Map();

    on(event, callback) {
        if (!this.#listeners.has(event)) {
            this.#listeners.set(event, []);
        }
        this.#listeners.get(event).push(callback);
    }

    off(event, callback) {
        const callbacks = this.#listeners.get(event);
        if (callbacks) {
            const index = callbacks.indexOf(callback);
            if (index > -1) {
                callbacks.splice(index, 1);
            }
        }
    }

    emit(event, ...args) {
        const callbacks = this.#listeners.get(event);
        if (callbacks) {
            callbacks.forEach(callback => callback(...args));
        }
    }
}

class Store extends EventEmitter {
    #state = {};

    setState(newState) {
        this.#state = { ...this.#state, ...newState };
        this.emit("stateChange", this.#state);
    }

    getState() {
        return this.#state;
    }
}

const store = new Store();
store.on("stateChange", (state) => {
    console.log("State changed:", state);
});
store.setState({ count: 1 });
store.setState({ count: 2 });
```

## Exercises

### Exercise 1: Shape Hierarchy
Create a shape hierarchy with proper inheritance.

::: details Solution
```js
class Shape {
    constructor(color = "black") {
        this.color = color;
    }

    getArea() {
        throw new Error("Must implement getArea");
    }

    toString() {
        return `${this.constructor.name} (${this.color})`;
    }
}

class Rectangle extends Shape {
    constructor(width, height, color) {
        super(color);
        this.width = width;
        this.height = height;
    }

    getArea() {
        return this.width * this.height;
    }
}

class Square extends Rectangle {
    constructor(side, color) {
        super(side, side, color);
    }
}

class Circle extends Shape {
    constructor(radius, color) {
        super(color);
        this.radius = radius;
    }

    getArea() {
        return Math.PI * this.radius ** 2;
    }
}

const shapes = [
    new Rectangle(4, 5, "red"),
    new Square(4, "blue"),
    new Circle(3, "green")
];

shapes.forEach(shape => {
    console.log(`${shape.toString()}: Area = ${shape.getArea().toFixed(2)}`);
});
```
:::

### Exercise 2: Todo List with OOP
Create a todo list using OOP principles.

::: details Solution
```js
class TodoItem {
    #id;
    #text;
    #completed;
    #createdAt;

    constructor(text) {
        this.#id = Date.now().toString(36);
        this.#text = text;
        this.#completed = false;
        this.#createdAt = new Date();
    }

    get id() { return this.#id; }
    get text() { return this.#text; }
    get completed() { return this.#completed; }
    get createdAt() { return this.#createdAt; }

    toggle() {
        this.#completed = !this.#completed;
    }

    toJSON() {
        return {
            id: this.#id,
            text: this.#text,
            completed: this.#completed,
            createdAt: this.#createdAt
        };
    }
}

class TodoList extends EventEmitter {
    #items = [];

    add(text) {
        const item = new TodoItem(text);
        this.#items.push(item);
        this.emit("add", item);
        return item;
    }

    remove(id) {
        const index = this.#items.findIndex(item => item.id === id);
        if (index > -1) {
            const [removed] = this.#items.splice(index, 1);
            this.emit("remove", removed);
            return removed;
        }
        return null;
    }

    toggle(id) {
        const item = this.#items.find(item => item.id === id);
        if (item) {
            item.toggle();
            this.emit("toggle", item);
        }
        return item;
    }

    get all() {
        return [...this.#items];
    }

    get pending() {
        return this.#items.filter(item => !item.completed);
    }

    get completed() {
        return this.#items.filter(item => item.completed);
    }
}

const todos = new TodoList();
todos.on("add", item => console.log("Added:", item.text));
todos.add("Learn JavaScript");
todos.add("Build a project");
```
:::

## Quick Reference

::: tip OOP Cheat Sheet
```js
// Class definition
class Animal {
    #privateField;           // Private

    constructor(name) {      // Constructor
        this.name = name;    // Public property
    }

    speak() {}               // Instance method

    get info() {}            // Getter
    set info(v) {}           // Setter

    static count = 0;        // Static property
    static create() {}       // Static method
}

// Inheritance
class Dog extends Animal {
    constructor(name, breed) {
        super(name);         // Call parent constructor
        this.breed = breed;
    }

    speak() {                // Override parent method
        super.speak();       // Call parent method
    }
}

// Instance check
dog instanceof Animal        // true
```
:::

## Summary

| Concept | Description | Syntax |
|---------|-------------|--------|
| Class | Blueprint for objects | `class Name {}` |
| Constructor | Initialize instance | `constructor() {}` |
| Private fields | Internal only | `#field` |
| Getters/Setters | Controlled access | `get/set prop()` |
| Inheritance | Extend classes | `extends` |
| Super | Access parent | `super.method()` |
| Static | Class-level | `static method()` |
| Composition | Mix abilities | `Object.assign()` |

## Next Steps

Continue to [Advanced Patterns](/guide/javascript/10-advanced) to learn about advanced JavaScript patterns and techniques.
