# JavaScript Basics

Learn the fundamental building blocks of JavaScript programming.

::: info What You'll Learn
- How to declare and use variables
- Different data types in JavaScript
- Operators for calculations and comparisons
- Type conversion and checking
:::

## Variables

Variables are containers for storing data values. Think of them like labeled boxes where you put information.

### Visual Explanation

```
Variables are like labeled boxes:

┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│   "John"    │  │     25      │  │    true     │
├─────────────┤  ├─────────────┤  ├─────────────┤
│    name     │  │     age     │  │  isStudent  │
└─────────────┘  └─────────────┘  └─────────────┘
     ↑               ↑                  ↑
   String          Number            Boolean
```

### Three Ways to Declare Variables

| Keyword | Can Reassign? | Scope | When to Use |
|---------|---------------|-------|-------------|
| `const` | ❌ No | Block | **Default choice** - values that don't change |
| `let` | ✅ Yes | Block | Values that need to change |
| `var` | ✅ Yes | Function | **Avoid** - old way, can cause bugs |

### const (Modern - Recommended Default)

```js
// const = constant, the value cannot be changed
const PI = 3.14159;
const appName = "My App";
const maxUsers = 100;

// ❌ This will cause an error!
// PI = 3;  // TypeError: Assignment to constant variable
```

### let (Modern - Reassignable)

```js
// let = the value CAN be changed
let count = 0;
console.log(count);  // 0

count = 1;
console.log(count);  // 1

count = count + 1;
console.log(count);  // 2
```

### var (Legacy - Avoid)

```js
// var is the old way - avoid in modern JavaScript
var name = "John";
var age = 25;

// Why avoid var? It has confusing scope behavior!
```

::: tip Best Practice
**Use `const` by default.** Only use `let` when you know the value will change. Never use `var` in modern JavaScript.

```js
// ✅ Good pattern
const name = "Alice";        // Won't change
let score = 0;               // Will change during game

// ❌ Avoid
var oldStyle = "confusing";  // Don't use var
```
:::

### Naming Rules for Variables

```js
// ✅ Valid variable names
let userName = "John";       // camelCase (recommended)
let user_name = "John";      // snake_case (less common in JS)
let _private = "hidden";     // starts with underscore
let $element = document;     // starts with $
let user1 = "First user";    // can contain numbers

// ❌ Invalid variable names
// let 1user = "error";      // Cannot start with number
// let user-name = "error";  // Cannot contain hyphens
// let let = "error";        // Cannot use reserved words
```

## Data Types

JavaScript has 8 data types. Understanding them is crucial!

### Overview of Data Types

```
JavaScript Data Types
├── Primitive Types (simple values)
│   ├── String    → "Hello" (text)
│   ├── Number    → 42 (numbers)
│   ├── BigInt    → 9007199254740991n (huge numbers)
│   ├── Boolean   → true/false
│   ├── Undefined → undefined (not assigned)
│   ├── Null      → null (intentionally empty)
│   └── Symbol    → Symbol("id") (unique identifier)
│
└── Reference Type (complex values)
    └── Object    → {}, [], function() {}
```

### String (Text)

Strings are for text. You can use single quotes, double quotes, or backticks.

```js
// Three ways to create strings
let single = 'Hello';           // Single quotes
let double = "Hello";           // Double quotes
let backtick = `Hello`;         // Backticks (template literal)

// Template literals (backticks) allow embedding variables
let name = "Alice";
let greeting = `Hello, ${name}!`;  // "Hello, Alice!"

// Multiline strings (only with backticks)
let multiline = `
  This is line 1
  This is line 2
  This is line 3
`;
```

#### Common String Operations

```js
let text = "JavaScript";

// Length
console.log(text.length);          // 10

// Access characters
console.log(text[0]);              // "J" (first character)
console.log(text.charAt(0));       // "J" (same thing)

// Case conversion
console.log(text.toUpperCase());   // "JAVASCRIPT"
console.log(text.toLowerCase());   // "javascript"

// Finding text
console.log(text.indexOf("Script")); // 4 (position where "Script" starts)
console.log(text.includes("Java")); // true

// Extracting parts
console.log(text.slice(0, 4));     // "Java" (from 0 to 4, not including 4)
console.log(text.substring(4));    // "Script" (from position 4 to end)

// Replacing
console.log(text.replace("Java", "Type")); // "TypeScript"
```

### Number

JavaScript has one number type for both integers and decimals.

```js
// All of these are "number" type
let integer = 42;
let decimal = 3.14;
let negative = -10;
let million = 1_000_000;  // Underscore for readability (same as 1000000)

// Special number values
let infinity = Infinity;
let negInfinity = -Infinity;
let notANumber = NaN;  // Result of invalid math operations

// Examples of NaN
console.log("hello" / 2);     // NaN
console.log(Math.sqrt(-1));   // NaN
```

#### Common Number Operations

```js
let num = 3.14159;

// Rounding
console.log(Math.round(num));    // 3 (nearest integer)
console.log(Math.floor(num));    // 3 (round down)
console.log(Math.ceil(num));     // 4 (round up)
console.log(num.toFixed(2));     // "3.14" (string with 2 decimals)

// Other Math operations
console.log(Math.abs(-5));       // 5 (absolute value)
console.log(Math.max(1, 5, 3));  // 5 (maximum)
console.log(Math.min(1, 5, 3));  // 1 (minimum)
console.log(Math.random());      // 0.123... (random 0-1)
console.log(Math.pow(2, 3));     // 8 (2 to the power of 3)
console.log(Math.sqrt(16));      // 4 (square root)
```

### BigInt

For numbers larger than `Number.MAX_SAFE_INTEGER` (9007199254740991).

```js
// Add 'n' at the end to create a BigInt
let bigNumber = 9007199254740991n;
let anotherBig = BigInt("9007199254740992");

// BigInt math
console.log(bigNumber + 1n);  // 9007199254740992n

// ⚠️ Cannot mix BigInt and Number
// console.log(bigNumber + 1);  // Error!
```

### Boolean

Booleans represent `true` or `false` - perfect for yes/no decisions.

```js
let isLoggedIn = true;
let hasPermission = false;
let isAdult = age >= 18;  // true if age is 18 or more

// Used in conditions
if (isLoggedIn) {
    console.log("Welcome back!");
}
```

### Undefined vs Null

These are often confused but have different meanings:

```js
// Undefined = "I don't have a value yet"
let notDefined;
console.log(notDefined);  // undefined

// Null = "I intentionally have no value"
let empty = null;
console.log(empty);  // null
```

```
┌─────────────────────────────────────────────────────────────┐
│                   undefined vs null                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   undefined                        null                     │
│   ──────────                      ─────                     │
│   "No value assigned"             "Intentionally empty"     │
│                                                             │
│   let x;                          let x = null;             │
│   console.log(x); // undefined    console.log(x); // null   │
│                                                             │
│   Automatic                       Manual                    │
│   (JS assigns this)               (You assign this)         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Symbol

Symbols create unique identifiers. Used for special object properties.

```js
// Each Symbol is unique
let id1 = Symbol("id");
let id2 = Symbol("id");

console.log(id1 === id2);  // false (they're different!)

// Used for object properties that won't conflict
const SECRET_KEY = Symbol("secret");
let user = {
    name: "John",
    [SECRET_KEY]: "hidden value"
};
```

### Object (Reference Type)

Objects store collections of related data. Arrays and functions are also objects!

```js
// Object literal
let person = {
    name: "John",
    age: 30,
    isStudent: false
};

// Accessing properties
console.log(person.name);      // "John" (dot notation)
console.log(person["age"]);    // 30 (bracket notation)

// Array (special type of object)
let fruits = ["apple", "banana", "orange"];
console.log(fruits[0]);  // "apple"

// Function (also an object!)
function greet(name) {
    return "Hello, " + name;
}
```

## Type Checking

Use `typeof` to check what type a value is:

```js
console.log(typeof "Hello");     // "string"
console.log(typeof 42);          // "number"
console.log(typeof 42n);         // "bigint"
console.log(typeof true);        // "boolean"
console.log(typeof undefined);   // "undefined"
console.log(typeof Symbol("x")); // "symbol"
console.log(typeof {});          // "object"
console.log(typeof []);          // "object"  ← Arrays are objects!
console.log(typeof function(){}); // "function"

// ⚠️ Historical bug in JavaScript:
console.log(typeof null);        // "object" (should be "null")
```

### How to Check for Arrays and Null

```js
// Check if something is an array
let arr = [1, 2, 3];
console.log(Array.isArray(arr));  // true

// Check for null specifically
let value = null;
console.log(value === null);  // true
```

## Operators

Operators let you perform operations on values.

### Arithmetic Operators

```js
let a = 10;
let b = 3;

console.log(a + b);   // 13 (Addition)
console.log(a - b);   // 7  (Subtraction)
console.log(a * b);   // 30 (Multiplication)
console.log(a / b);   // 3.333... (Division)
console.log(a % b);   // 1  (Modulus - remainder)
console.log(a ** b);  // 1000 (Exponentiation - 10³)
```

```
Arithmetic Operators Visual Guide:

Addition (+)      Subtraction (-)     Multiplication (*)
10 + 3 = 13       10 - 3 = 7          10 * 3 = 30

Division (/)      Modulus (%)         Exponent (**)
10 / 3 = 3.33     10 % 3 = 1          10 ** 3 = 1000
                  (remainder)          (10 × 10 × 10)
```

### Increment and Decrement

```js
let count = 5;

// Increment (add 1)
count++;        // count is now 6
console.log(count);

// Decrement (subtract 1)
count--;        // count is now 5
console.log(count);

// Pre vs Post increment
let x = 5;
console.log(x++);   // 5 (returns old value, then increments)
console.log(x);     // 6

let y = 5;
console.log(++y);   // 6 (increments first, then returns)
console.log(y);     // 6
```

### Assignment Operators

Shortcuts for updating variables:

```js
let x = 10;

x += 5;   // Same as: x = x + 5   → x is now 15
x -= 3;   // Same as: x = x - 3   → x is now 12
x *= 2;   // Same as: x = x * 2   → x is now 24
x /= 4;   // Same as: x = x / 4   → x is now 6
x %= 4;   // Same as: x = x % 4   → x is now 2
x **= 3;  // Same as: x = x ** 3  → x is now 8
```

### Comparison Operators

Compare values and return `true` or `false`:

```js
let a = 5;
let b = "5";

// Equality (with type coercion - converts types)
console.log(a == b);    // true (5 equals "5" after conversion)

// Strict Equality (no type coercion - recommended!)
console.log(a === b);   // false (number is not string)

// Inequality
console.log(a != b);    // false
console.log(a !== b);   // true (strict - recommended!)

// Relational
console.log(a > 3);     // true
console.log(a < 3);     // false
console.log(a >= 5);    // true
console.log(a <= 5);    // true
```

::: warning Always Use Strict Equality
Use `===` and `!==` instead of `==` and `!=` to avoid unexpected type conversion bugs.

```js
// ⚠️ Confusing behavior with ==
console.log(0 == "");     // true (both become 0)
console.log(0 == false);  // true (both become 0)
console.log(null == undefined); // true

// ✅ Clear behavior with ===
console.log(0 === "");    // false
console.log(0 === false); // false
console.log(null === undefined); // false
```
:::

### Logical Operators

Combine multiple conditions:

```js
let age = 25;
let hasLicense = true;

// AND (&&) - Both must be true
console.log(age >= 18 && hasLicense);  // true

// OR (||) - At least one must be true
console.log(age >= 18 || hasLicense);  // true

// NOT (!) - Inverts the boolean
console.log(!hasLicense);  // false
console.log(!false);       // true
```

```
Logical Operators Truth Table:

AND (&&)                    OR (||)                     NOT (!)
─────────────────          ─────────────────          ──────────
true  && true  = true      true  || true  = true      !true  = false
true  && false = false     true  || false = true      !false = true
false && true  = false     false || true  = true
false && false = false     false || false = false
```

### Ternary Operator

A shorthand for simple if-else:

```js
// Syntax: condition ? valueIfTrue : valueIfFalse

let age = 20;
let status = age >= 18 ? "Adult" : "Minor";
console.log(status);  // "Adult"

// Same as:
let status2;
if (age >= 18) {
    status2 = "Adult";
} else {
    status2 = "Minor";
}
```

### String Concatenation

```js
let firstName = "John";
let lastName = "Doe";

// Method 1: + operator
let fullName = firstName + " " + lastName;
console.log(fullName);  // "John Doe"

// Method 2: Template literals (recommended!)
let greeting = `Hello, ${firstName} ${lastName}!`;
console.log(greeting);  // "Hello, John Doe!"

// ⚠️ Be careful with + and numbers
console.log("5" + 3);   // "53" (string concatenation)
console.log(5 + 3);     // 8 (number addition)
console.log(5 + "3");   // "53" (string wins!)
```

## Type Conversion

Sometimes you need to convert between types.

### To String

```js
let num = 42;

// Method 1: String() function
let str1 = String(num);       // "42"

// Method 2: toString() method
let str2 = num.toString();    // "42"

// Method 3: Concatenation (implicit)
let str3 = num + "";          // "42"

// Converting other types
String(true);       // "true"
String(false);      // "false"
String(null);       // "null"
String(undefined);  // "undefined"
```

### To Number

```js
let str = "42";

// Method 1: Number() function
let num1 = Number(str);       // 42

// Method 2: parseInt() / parseFloat()
let num2 = parseInt("42");    // 42
let num3 = parseFloat("3.14"); // 3.14
let num4 = parseInt("42px");  // 42 (stops at non-number)

// Method 3: Unary plus (shorthand)
let num5 = +"42";             // 42

// Converting other types
Number(true);       // 1
Number(false);      // 0
Number(null);       // 0
Number(undefined);  // NaN
Number("hello");    // NaN (Not a Number)
```

### To Boolean

```js
// Explicit conversion
Boolean(1);         // true
Boolean(0);         // false
Boolean("hello");   // true
Boolean("");        // false

// Double NOT shorthand (!! converts to boolean)
!!1;        // true
!!"hello";  // true
!!0;        // false
!!"";       // false
```

### Falsy and Truthy Values

```
┌─────────────────────────────────────────────────────────────┐
│                    Falsy Values                             │
│  (These convert to false in boolean context)                │
├─────────────────────────────────────────────────────────────┤
│  false          The boolean false                           │
│  0              The number zero                             │
│  -0             Negative zero                               │
│  0n             BigInt zero                                 │
│  ""             Empty string                                │
│  null           No value                                    │
│  undefined      Not defined                                 │
│  NaN            Not a Number                                │
└─────────────────────────────────────────────────────────────┘

Everything else is TRUTHY (converts to true):
✅ "hello", "0", "false" (non-empty strings)
✅ 1, -1, 3.14 (non-zero numbers)
✅ [], {} (empty array and object - they exist!)
✅ function(){} (functions)
```

## Exercises

### Exercise 1: Variable Declaration

Declare variables for your name, age, and whether you're a student.

::: details Solution
```js
const name = "Alice";        // Won't change
let age = 25;                // Might change (birthday!)
const isStudent = true;      // Won't change (for now)

console.log(`Name: ${name}`);
console.log(`Age: ${age}`);
console.log(`Is Student: ${isStudent}`);

// Using template literal for a sentence
console.log(`${name} is ${age} years old and ${isStudent ? "is" : "is not"} a student.`);
```
:::

### Exercise 2: Temperature Converter

Convert Celsius to Fahrenheit using the formula: F = (C × 9/5) + 32

::: details Solution
```js
const celsius = 25;
const fahrenheit = (celsius * 9/5) + 32;

console.log(`${celsius}°C = ${fahrenheit}°F`);
// Output: 25°C = 77°F

// Bonus: Create a function
function celsiusToFahrenheit(c) {
    return (c * 9/5) + 32;
}

console.log(celsiusToFahrenheit(0));   // 32
console.log(celsiusToFahrenheit(100)); // 212
```
:::

### Exercise 3: Swap Variables

Swap the values of two variables.

::: details Solution
```js
let a = 5;
let b = 10;

console.log(`Before: a = ${a}, b = ${b}`);

// Method 1: Using a temporary variable
let temp = a;
a = b;
b = temp;

// Method 2: Using destructuring (ES6+) - simpler!
// [a, b] = [b, a];

console.log(`After: a = ${a}, b = ${b}`);
// Output: After: a = 10, b = 5
```
:::

### Exercise 4: Type Checking

Create variables of each type and check them with typeof.

::: details Solution
```js
const myString = "Hello";
const myNumber = 42;
const myBoolean = true;
const myNull = null;
let myUndefined;
const myObject = { key: "value" };
const myArray = [1, 2, 3];
const myFunction = function() {};

console.log(typeof myString);    // "string"
console.log(typeof myNumber);    // "number"
console.log(typeof myBoolean);   // "boolean"
console.log(typeof myNull);      // "object" (JS bug!)
console.log(typeof myUndefined); // "undefined"
console.log(typeof myObject);    // "object"
console.log(typeof myArray);     // "object"
console.log(typeof myFunction);  // "function"

// Better checks
console.log(myNull === null);        // true
console.log(Array.isArray(myArray)); // true
```
:::

## Common Mistakes and Pitfalls

::: danger Common Beginner Mistakes
Learn from these frequently made errors to write better code from the start.
:::

### 1. Using `==` Instead of `===`

```js
// ❌ Dangerous - unexpected type coercion
console.log(1 == "1");     // true
console.log(0 == false);   // true
console.log(null == undefined); // true

// ✅ Safe - strict comparison
console.log(1 === "1");    // false
console.log(0 === false);  // false
console.log(null === undefined); // false
```

### 2. Forgetting `const` or `let`

```js
// ❌ Creates global variable (implicit global)
myVariable = "oops";

// ✅ Properly declared
const myVariable = "correct";
```

### 3. Confusing Reference vs Value

```js
// Primitives are copied by value
let a = 5;
let b = a;
b = 10;
console.log(a); // 5 (unchanged)

// Objects are copied by reference
const obj1 = { name: "John" };
const obj2 = obj1;
obj2.name = "Jane";
console.log(obj1.name); // "Jane" (changed!)

// To copy an object
const obj3 = { ...obj1 }; // Shallow copy
```

### 4. NaN Comparisons

```js
// ❌ NaN is never equal to anything, including itself!
console.log(NaN === NaN); // false

// ✅ Use Number.isNaN() or isNaN()
console.log(Number.isNaN(NaN)); // true
console.log(isNaN("hello"));    // true (converts to NaN first)
console.log(Number.isNaN("hello")); // false (stricter)
```

### 5. Floating Point Precision

```js
// ❌ Floating point math can be imprecise
console.log(0.1 + 0.2 === 0.3); // false!
console.log(0.1 + 0.2);         // 0.30000000000000004

// ✅ Use toFixed() or compare with tolerance
console.log((0.1 + 0.2).toFixed(1) === "0.3"); // true
console.log(Math.abs((0.1 + 0.2) - 0.3) < 0.0001); // true
```

## Debugging Tips

::: tip How to Debug JavaScript
1. **Use `console.log()`** - Print values to understand what's happening
2. **Use `typeof`** - Check data types when confused
3. **Browser DevTools** - Use the debugger and breakpoints
4. **Read error messages** - They often tell you exactly what's wrong
:::

```js
// Debugging techniques
const data = getUserData();

// Log the value
console.log("data:", data);

// Log with label
console.log({ data }); // Shows { data: ... }

// Check type
console.log("type:", typeof data);

// Pretty print objects
console.log(JSON.stringify(data, null, 2));

// Table format for arrays
console.table([{ a: 1 }, { a: 2 }]);

// Group related logs
console.group("User Data");
console.log("Name:", data.name);
console.log("Age:", data.age);
console.groupEnd();
```

## Interview Questions

::: details Q: What's the difference between `null` and `undefined`?
**Answer:**
- `undefined` means a variable has been declared but not assigned a value
- `null` is an intentional assignment indicating "no value"
- `typeof undefined` returns `"undefined"`
- `typeof null` returns `"object"` (historical bug in JavaScript)

```js
let x;           // undefined (not assigned)
let y = null;    // null (intentionally empty)
```
:::

::: details Q: What is hoisting?
**Answer:**
Hoisting is JavaScript's behavior of moving declarations to the top of their scope.
- `var` declarations are hoisted and initialized to `undefined`
- `let` and `const` are hoisted but not initialized (Temporal Dead Zone)
- Function declarations are fully hoisted (can call before definition)

```js
console.log(x); // undefined (var is hoisted)
var x = 5;

console.log(y); // ReferenceError (TDZ)
let y = 5;

sayHi(); // Works! (function declaration hoisted)
function sayHi() {
    console.log("Hi!");
}
```
:::

::: details Q: What are primitive vs reference types?
**Answer:**
- **Primitives** (String, Number, Boolean, etc.): Stored by value, immutable, copied when assigned
- **Reference types** (Objects, Arrays): Stored by reference, mutable, share same memory when assigned

```js
// Primitive - copied by value
let a = 10;
let b = a;
b = 20;
console.log(a); // 10 (unchanged)

// Reference - copied by reference
let arr1 = [1, 2, 3];
let arr2 = arr1;
arr2.push(4);
console.log(arr1); // [1, 2, 3, 4] (changed!)
```
:::

## Real-World Examples

### Form Validation

```js
function validateEmail(email) {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
}

function validateAge(age) {
    const ageNum = Number(age);
    return !isNaN(ageNum) && ageNum >= 0 && ageNum <= 120;
}

function validateForm(data) {
    const errors = [];

    if (!data.name || data.name.trim().length === 0) {
        errors.push("Name is required");
    }

    if (!validateEmail(data.email)) {
        errors.push("Invalid email format");
    }

    if (!validateAge(data.age)) {
        errors.push("Age must be a number between 0 and 120");
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}

// Usage
const result = validateForm({
    name: "John",
    email: "john@example.com",
    age: 25
});

console.log(result); // { isValid: true, errors: [] }
```

### Price Calculator

```js
const TAX_RATE = 0.08;
const DISCOUNT_THRESHOLD = 100;
const DISCOUNT_RATE = 0.10;

function calculateTotal(items) {
    // Calculate subtotal
    const subtotal = items.reduce((sum, item) => {
        return sum + (item.price * item.quantity);
    }, 0);

    // Apply discount if threshold met
    const discount = subtotal >= DISCOUNT_THRESHOLD
        ? subtotal * DISCOUNT_RATE
        : 0;

    const afterDiscount = subtotal - discount;

    // Calculate tax
    const tax = afterDiscount * TAX_RATE;

    // Final total
    const total = afterDiscount + tax;

    return {
        subtotal: subtotal.toFixed(2),
        discount: discount.toFixed(2),
        tax: tax.toFixed(2),
        total: total.toFixed(2)
    };
}

// Usage
const cart = [
    { name: "Book", price: 29.99, quantity: 2 },
    { name: "Pen", price: 4.99, quantity: 5 }
];

console.log(calculateTotal(cart));
// { subtotal: "84.93", discount: "0.00", tax: "6.79", total: "91.72" }
```

## Summary

| Concept | Key Points |
|---------|------------|
| **Variables** | Use `const` by default, `let` when reassignment needed, avoid `var` |
| **Data Types** | 8 types: String, Number, BigInt, Boolean, Undefined, Null, Symbol, Object |
| **Type Checking** | Use `typeof` for most types, `Array.isArray()` for arrays, `=== null` for null |
| **Operators** | Arithmetic (`+`, `-`, `*`, `/`, `%`, `**`), Comparison (`===`, `!==`), Logical (`&&`, `\|\|`, `!`) |
| **Type Conversion** | `String()`, `Number()`, `Boolean()` or implicit conversion |
| **Best Practice** | Always use `===` for comparisons |

## Next Steps

Continue to [Control Flow](/guide/javascript/02-control-flow) to learn about conditionals and loops.
