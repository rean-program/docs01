# Objects

Objects are collections of key-value pairs. They are fundamental to JavaScript and used to represent complex data structures.

::: info What You'll Learn
- How to create and modify objects
- Accessing properties with dot and bracket notation
- Object destructuring and spread operator
- Built-in Object methods
- Getters, setters, and property descriptors
:::

## What is an Object?

An object is a collection of **properties**, where each property has a **key** (name) and a **value**.

```
┌─────────────────────────────────────────────────────────────┐
│                      OBJECT ANATOMY                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   const person = {                                          │
│       name: "John",     ← property (key: value)             │
│       age: 30,          ← property                          │
│       city: "NYC"       ← property                          │
│   };                                                        │
│                                                             │
│   ┌─────────┬─────────┬─────────┐                          │
│   │  name   │   age   │  city   │  ← keys                  │
│   ├─────────┼─────────┼─────────┤                          │
│   │ "John"  │   30    │ "NYC"   │  ← values                │
│   └─────────┴─────────┴─────────┘                          │
│                                                             │
│   person.name → "John"                                      │
│   person["age"] → 30                                        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Creating Objects

```js
// Object literal (most common and recommended) ✅
const person = {
    name: "John",
    age: 30,
    city: "New York"
};

// Object constructor (less common)
const car = new Object();
car.brand = "Toyota";
car.model = "Camry";

// Object.create() - specify prototype
const proto = { greet() { return "Hello"; } };
const obj = Object.create(proto);

// Empty object - add properties later
const empty = {};
empty.name = "Added later";
```

## Accessing Properties

Two ways to access object properties:

```js
const person = {
    name: "John",
    age: 30,
    "favorite color": "blue"  // Key with space needs quotes
};

// 1. Dot notation - cleaner, most common
console.log(person.name);  // "John"
console.log(person.age);   // 30

// 2. Bracket notation - more flexible
console.log(person["name"]);           // "John"
console.log(person["favorite color"]); // "blue" (required for keys with spaces)

// Dynamic property access (must use brackets)
const prop = "name";
console.log(person[prop]);  // "John"
console.log(person.prop);   // undefined (looks for literal "prop" key)

// Accessing non-existent property
console.log(person.email);  // undefined (no error)
```

### When to Use Which?

| Scenario | Use | Example |
|----------|-----|---------|
| Simple property name | Dot notation | `person.name` |
| Property name with spaces/special chars | Brackets | `person["favorite color"]` |
| Dynamic property name (variable) | Brackets | `person[variableName]` |
| Property name is a number | Brackets | `obj["123"]` |

## Modifying Objects

```js
const person = {
    name: "John",
    age: 30
};

// ADD new property
person.city = "New York";
person["country"] = "USA";

// MODIFY existing property
person.age = 31;

// DELETE property
delete person.city;

console.log(person);
// { name: "John", age: 31, country: "USA" }
```

### Visual: Object Modification

```
Initial:     After add:      After modify:    After delete:
┌────────┐   ┌────────┐      ┌────────┐       ┌────────┐
│name:   │   │name:   │      │name:   │       │name:   │
│"John"  │   │"John"  │      │"John"  │       │"John"  │
├────────┤   ├────────┤      ├────────┤       ├────────┤
│age: 30 │   │age: 30 │      │age: 31 │ ←mod  │age: 31 │
└────────┘   ├────────┤      ├────────┤       ├────────┤
             │city:   │ ←add │city:   │       │country:│
             │"NYC"   │      │"NYC"   │       │"USA"   │
             └────────┘      ├────────┤       └────────┘
                             │country:│        (city
                             │"USA"   │←add     deleted)
                             └────────┘
```

## Object Methods

Methods are functions stored as object properties.

```js
const calculator = {
    value: 0,

    // Method definition (shorthand syntax)
    add(n) {
        this.value += n;
        return this;  // Return this for chaining
    },

    subtract(n) {
        this.value -= n;
        return this;
    },

    multiply(n) {
        this.value *= n;
        return this;
    },

    getValue() {
        return this.value;
    },

    reset() {
        this.value = 0;
        return this;
    }
};

// Method chaining
calculator.add(10).subtract(3).multiply(2);
console.log(calculator.getValue()); // 14

calculator.reset();
console.log(calculator.getValue()); // 0
```

### Understanding `this`

```js
const person = {
    name: "Alice",

    // Regular method - 'this' refers to the object
    greet() {
        console.log(`Hello, I'm ${this.name}`);
    },

    // Arrow function - 'this' is NOT the object!
    greetArrow: () => {
        console.log(`Hello, I'm ${this.name}`); // undefined!
    }
};

person.greet();      // "Hello, I'm Alice" ✅
person.greetArrow(); // "Hello, I'm undefined" ❌
```

::: warning Arrow Functions and this
Arrow functions don't have their own `this`. Use regular function syntax for object methods.
:::

## Shorthand Syntax (ES6)

### Property Shorthand

```js
const name = "John";
const age = 30;
const city = "NYC";

// OLD way - repetitive
const person1 = {
    name: name,
    age: age,
    city: city
};

// NEW way - shorthand when key matches variable name
const person2 = { name, age, city };

console.log(person2); // { name: "John", age: 30, city: "NYC" }
```

### Method Shorthand

```js
// OLD way
const obj1 = {
    greet: function() {
        return "Hello";
    }
};

// NEW way - concise method syntax
const obj2 = {
    greet() {
        return "Hello";
    }
};
```

### Computed Property Names

Create property names dynamically:

```js
const prefix = "user";
const prop = "name";

const obj = {
    [prop]: "John",                    // name: "John"
    [`${prefix}Id`]: 123,              // userId: 123
    [`${prefix}Active`]: true,         // userActive: true
    [`get${prop.charAt(0).toUpperCase() + prop.slice(1)}`]() {
        return this.name;              // getName() method
    }
};

console.log(obj);
// { name: "John", userId: 123, userActive: true, getName: [Function] }
console.log(obj.getName()); // "John"
```

## Object Destructuring

Extract properties into variables with a clean syntax.

```js
const person = {
    name: "John",
    age: 30,
    city: "New York",
    country: "USA"
};

// Basic destructuring
const { name, age } = person;
console.log(name, age); // "John" 30

// Renaming variables
const { name: fullName, age: years } = person;
console.log(fullName, years); // "John" 30

// Default values (for missing properties)
const { name: n, email = "none" } = person;
console.log(n, email); // "John" "none"

// Rest pattern (collect remaining)
const { name: userName, ...rest } = person;
console.log(userName); // "John"
console.log(rest);     // { age: 30, city: "New York", country: "USA" }
```

### Nested Destructuring

```js
const user = {
    id: 1,
    profile: {
        name: "Alice",
        email: "alice@example.com",
        address: {
            city: "Seattle",
            zip: "98101"
        }
    }
};

// Extract nested properties
const {
    profile: {
        name,
        email,
        address: { city }
    }
} = user;

console.log(name);  // "Alice"
console.log(email); // "alice@example.com"
console.log(city);  // "Seattle"
```

### Destructuring in Function Parameters

```js
// Without destructuring
function printUser1(user) {
    console.log(`${user.name}, ${user.age}`);
}

// With destructuring - cleaner!
function printUser2({ name, age, city = "Unknown" }) {
    console.log(`${name}, ${age}, from ${city}`);
}

printUser2({ name: "John", age: 30 });
// "John, 30, from Unknown"
```

## Spread Operator (...)

Copy and merge objects easily.

```js
const defaults = {
    theme: "light",
    fontSize: 14,
    language: "en"
};

const userPrefs = {
    theme: "dark",
    fontSize: 16
};

// Merge objects (later values override earlier)
const settings = { ...defaults, ...userPrefs };
console.log(settings);
// { theme: "dark", fontSize: 16, language: "en" }

// Copy object (shallow)
const copy = { ...defaults };

// Add/override while copying
const extended = {
    ...defaults,
    fontSize: 18,
    notifications: true
};
```

### Spread Order Matters

```
{ ...defaults, ...userPrefs }

defaults:     userPrefs:      result:
┌─────────┐   ┌─────────┐    ┌─────────┐
│theme:   │   │theme:   │    │theme:   │
│"light"  │   │"dark"   │───▶│"dark"   │ ← userPrefs wins
├─────────┤   ├─────────┤    ├─────────┤
│fontSize:│   │fontSize:│    │fontSize:│
│14       │   │16       │───▶│16       │ ← userPrefs wins
├─────────┤   └─────────┘    ├─────────┤
│language:│                  │language:│
│"en"     │─────────────────▶│"en"     │ ← only in defaults
└─────────┘                  └─────────┘
```

## Built-in Object Methods

### Object.keys(), Object.values(), Object.entries()

```js
const person = {
    name: "John",
    age: 30,
    city: "NYC"
};

// Get all keys
console.log(Object.keys(person));
// ["name", "age", "city"]

// Get all values
console.log(Object.values(person));
// ["John", 30, "NYC"]

// Get all key-value pairs as arrays
console.log(Object.entries(person));
// [["name", "John"], ["age", 30], ["city", "NYC"]]
```

### Using with Loops

```js
const scores = {
    math: 90,
    science: 85,
    english: 88
};

// Loop through keys
for (const subject of Object.keys(scores)) {
    console.log(subject);
}

// Loop through values
for (const score of Object.values(scores)) {
    console.log(score);
}

// Loop through entries (most useful!)
for (const [subject, score] of Object.entries(scores)) {
    console.log(`${subject}: ${score}`);
}

// Using with array methods
const total = Object.values(scores).reduce((sum, s) => sum + s, 0);
console.log(`Total: ${total}`); // Total: 263
```

### Object.assign()

```js
const target = { a: 1, b: 2 };
const source = { b: 3, c: 4 };

// Merge into target (modifies target!)
const result = Object.assign(target, source);
console.log(result); // { a: 1, b: 3, c: 4 }
console.log(target); // { a: 1, b: 3, c: 4 } - also modified!

// Clone without modifying
const clone = Object.assign({}, target);

// Modern alternative: spread operator
const clone2 = { ...target };
```

### Object.freeze() and Object.seal()

```js
// freeze - completely immutable
const frozen = Object.freeze({ name: "John", age: 30 });
frozen.name = "Jane";     // ❌ Silently fails
frozen.city = "NYC";      // ❌ Cannot add
delete frozen.age;        // ❌ Cannot delete
console.log(frozen);      // { name: "John", age: 30 }

// seal - can modify, but cannot add/delete
const sealed = Object.seal({ name: "John", age: 30 });
sealed.name = "Jane";     // ✅ Can modify existing
sealed.city = "NYC";      // ❌ Cannot add new
delete sealed.age;        // ❌ Cannot delete
console.log(sealed);      // { name: "Jane", age: 30 }
```

### Object.fromEntries()

Convert array of [key, value] pairs back to object.

```js
const entries = [
    ["name", "John"],
    ["age", 30],
    ["city", "NYC"]
];

const obj = Object.fromEntries(entries);
console.log(obj); // { name: "John", age: 30, city: "NYC" }

// Convert Map to Object
const map = new Map([["a", 1], ["b", 2]]);
const objFromMap = Object.fromEntries(map);
console.log(objFromMap); // { a: 1, b: 2 }

// Transform object (keys/values)
const prices = { apple: 1, banana: 0.5, orange: 0.75 };
const doubled = Object.fromEntries(
    Object.entries(prices).map(([fruit, price]) => [fruit, price * 2])
);
console.log(doubled); // { apple: 2, banana: 1, orange: 1.5 }
```

## Checking Properties

```js
const person = {
    name: "John",
    age: 30
};

// 'in' operator - checks property exists (including inherited)
console.log("name" in person);      // true
console.log("city" in person);      // false
console.log("toString" in person);  // true (inherited from Object)

// hasOwnProperty - only own properties
console.log(person.hasOwnProperty("name"));      // true
console.log(person.hasOwnProperty("toString")); // false

// Object.hasOwn (modern, ES2022)
console.log(Object.hasOwn(person, "name")); // true
```

### Optional Chaining (?.)

Safely access nested properties without errors.

```js
const user = {
    profile: {
        name: "John",
        address: {
            city: "NYC"
        }
    }
};

// Without optional chaining - might crash!
// console.log(user.settings.theme); // ❌ Error!

// With optional chaining - safe
console.log(user.profile?.name);          // "John"
console.log(user.settings?.theme);        // undefined (no error!)
console.log(user.profile?.address?.city); // "NYC"
console.log(user.profile?.phone?.number); // undefined

// With nullish coalescing for defaults
const theme = user.settings?.theme ?? "light";
console.log(theme); // "light"

// Optional chaining with methods
const result = user.profile?.getName?.();
// undefined if getName doesn't exist, otherwise calls it
```

## Getters and Setters

Computed properties that look like regular properties.

```js
const person = {
    firstName: "John",
    lastName: "Doe",
    birthYear: 1990,

    // Getter - computed property
    get fullName() {
        return `${this.firstName} ${this.lastName}`;
    },

    // Setter - validate/transform when setting
    set fullName(value) {
        const parts = value.split(" ");
        this.firstName = parts[0];
        this.lastName = parts[1] || "";
    },

    // Getter only (read-only computed value)
    get age() {
        return new Date().getFullYear() - this.birthYear;
    }
};

// Use like regular properties
console.log(person.fullName); // "John Doe" (calls getter)

person.fullName = "Jane Smith"; // Calls setter
console.log(person.firstName);  // "Jane"
console.log(person.lastName);   // "Smith"

console.log(person.age); // Calculated from birthYear
```

### Practical Getter/Setter Example

```js
const temperature = {
    _celsius: 0,  // Convention: _ prefix for "private"

    get celsius() {
        return this._celsius;
    },

    set celsius(value) {
        if (value < -273.15) {
            throw new Error("Temperature below absolute zero!");
        }
        this._celsius = value;
    },

    get fahrenheit() {
        return (this._celsius * 9/5) + 32;
    },

    set fahrenheit(value) {
        this._celsius = (value - 32) * 5/9;
    }
};

temperature.celsius = 25;
console.log(temperature.fahrenheit); // 77

temperature.fahrenheit = 100;
console.log(temperature.celsius); // 37.78
```

## Common Patterns

### Factory Function

Create multiple objects with the same structure.

```js
function createUser(name, age, role = "user") {
    return {
        name,
        age,
        role,
        createdAt: new Date(),

        greet() {
            return `Hi, I'm ${this.name}`;
        },

        isAdmin() {
            return this.role === "admin";
        }
    };
}

const user1 = createUser("Alice", 25);
const user2 = createUser("Bob", 30, "admin");

console.log(user1.greet()); // "Hi, I'm Alice"
console.log(user2.isAdmin()); // true
```

### Object Composition

Combine behaviors from multiple sources.

```js
// Define behaviors
const canWalk = {
    walk() {
        return `${this.name} is walking`;
    }
};

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

// Compose objects with specific abilities
function createDuck(name) {
    return Object.assign({ name }, canWalk, canSwim);
}

function createBird(name) {
    return Object.assign({ name }, canWalk, canFly);
}

const duck = createDuck("Donald");
console.log(duck.walk()); // "Donald is walking"
console.log(duck.swim()); // "Donald is swimming"

const eagle = createBird("Eddie");
console.log(eagle.walk()); // "Eddie is walking"
console.log(eagle.fly());  // "Eddie is flying"
```

### Namespace Pattern

Group related functions together.

```js
const Utils = {
    string: {
        capitalize(str) {
            return str.charAt(0).toUpperCase() + str.slice(1);
        },
        truncate(str, length) {
            return str.length > length ? str.slice(0, length) + "..." : str;
        }
    },
    number: {
        clamp(num, min, max) {
            return Math.min(Math.max(num, min), max);
        },
        random(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
    }
};

console.log(Utils.string.capitalize("hello")); // "Hello"
console.log(Utils.number.random(1, 10)); // Random number 1-10
```

## Exercises

### Exercise 1: Deep Clone

Create a function that deeply clones an object.

::: details Solution
```js
function deepClone(obj) {
    // Handle null and non-objects
    if (obj === null || typeof obj !== "object") {
        return obj;
    }

    // Handle arrays
    if (Array.isArray(obj)) {
        return obj.map(item => deepClone(item));
    }

    // Handle objects
    const clone = {};
    for (const key of Object.keys(obj)) {
        clone[key] = deepClone(obj[key]);
    }
    return clone;
}

// Test
const original = {
    name: "John",
    address: {
        city: "NYC",
        coords: [40.7, -74.0]
    }
};

const copy = deepClone(original);
copy.address.city = "LA";
copy.address.coords[0] = 34.0;

console.log(original.address.city); // "NYC" (unchanged)
console.log(copy.address.city);     // "LA"

// Modern alternative:
const modernClone = structuredClone(original);
```
:::

### Exercise 2: Object Difference

Find properties that differ between two objects.

::: details Solution
```js
function objectDiff(obj1, obj2) {
    const diff = {};
    const allKeys = new Set([
        ...Object.keys(obj1),
        ...Object.keys(obj2)
    ]);

    for (const key of allKeys) {
        if (obj1[key] !== obj2[key]) {
            diff[key] = {
                before: obj1[key],
                after: obj2[key]
            };
        }
    }

    return diff;
}

const before = { name: "John", age: 30, city: "NYC" };
const after = { name: "John", age: 31, country: "USA" };

console.log(objectDiff(before, after));
// {
//   age: { before: 30, after: 31 },
//   city: { before: "NYC", after: undefined },
//   country: { before: undefined, after: "USA" }
// }
```
:::

### Exercise 3: Path Access

Access nested object properties using a string path.

::: details Solution
```js
function get(obj, path, defaultValue = undefined) {
    const keys = path.split(".");
    let result = obj;

    for (const key of keys) {
        if (result == null) {
            return defaultValue;
        }
        result = result[key];
    }

    return result ?? defaultValue;
}

function set(obj, path, value) {
    const keys = path.split(".");
    const lastKey = keys.pop();
    let current = obj;

    for (const key of keys) {
        if (!(key in current) || typeof current[key] !== "object") {
            current[key] = {};
        }
        current = current[key];
    }

    current[lastKey] = value;
    return obj;
}

const data = {
    user: {
        profile: {
            name: "John"
        }
    }
};

console.log(get(data, "user.profile.name")); // "John"
console.log(get(data, "user.settings.theme", "light")); // "light"

set(data, "user.profile.age", 30);
console.log(data.user.profile.age); // 30
```
:::

## Summary

| Concept | Description | Example |
|---------|-------------|---------|
| **Create** | Object literal | `{ key: value }` |
| **Access** | Dot or bracket | `obj.key` or `obj["key"]` |
| **Destructure** | Extract properties | `const { a, b } = obj` |
| **Spread** | Copy/merge | `{ ...obj1, ...obj2 }` |
| **Keys/Values/Entries** | Get arrays | `Object.keys(obj)` |
| **Optional chaining** | Safe access | `obj?.nested?.prop` |
| **Freeze** | Make immutable | `Object.freeze(obj)` |
| **Getters/Setters** | Computed properties | `get name() {}` |

## Next Steps

Continue to [DOM Manipulation](/guide/javascript/06-dom) to learn how to interact with web pages.
