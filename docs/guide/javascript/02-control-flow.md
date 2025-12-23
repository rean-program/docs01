# Control Flow

Learn how to control the flow of your JavaScript programs using conditionals and loops.

::: info What You'll Learn
- How to make decisions with if/else statements
- How to handle multiple cases with switch
- How to repeat actions with loops
- How to control loop execution with break and continue
:::

## What is Control Flow?

Control flow determines the order in which code runs. Without it, code runs top to bottom. With control flow, you can make decisions and repeat actions.

```
Normal Flow:          With Control Flow:
────────────         ────────────────────
   Start                   Start
     │                       │
     ▼                       ▼
  Line 1               ┌──────────┐
     │                 │ Condition │
     ▼                 └─────┬────┘
  Line 2                Yes/  \No
     │                   /    \
     ▼                  ▼      ▼
  Line 3             Path A  Path B
     │                   \    /
     ▼                    \  /
    End                    ▼
                         End
```

## Conditional Statements

### if Statement

The most basic conditional - run code only if a condition is true.

```js
let age = 18;

if (age >= 18) {
    console.log("You are an adult");
}
// Output: "You are an adult"
```

#### Visual Flow

```
┌─────────────────┐
│   age >= 18?    │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
   Yes        No
    │         │
    ▼         │
 Print       Skip
 "Adult"      │
    │         │
    └────┬────┘
         ▼
      Continue
```

### if...else Statement

Handle both true and false cases.

```js
let temperature = 25;

if (temperature > 30) {
    console.log("It's hot outside! 🔥");
} else {
    console.log("The weather is nice! 😊");
}
// Output: "The weather is nice! 😊"
```

### if...else if...else Statement

Handle multiple conditions.

```js
let score = 85;

if (score >= 90) {
    console.log("Grade: A ⭐");
} else if (score >= 80) {
    console.log("Grade: B 👍");
} else if (score >= 70) {
    console.log("Grade: C 👌");
} else if (score >= 60) {
    console.log("Grade: D 😐");
} else {
    console.log("Grade: F 😢");
}
// Output: "Grade: B 👍"
```

#### Grade Flow Visualization

```
┌────────────────┐
│  score >= 90?  │──Yes──▶ Grade: A
└───────┬────────┘
        │No
        ▼
┌────────────────┐
│  score >= 80?  │──Yes──▶ Grade: B
└───────┬────────┘
        │No
        ▼
┌────────────────┐
│  score >= 70?  │──Yes──▶ Grade: C
└───────┬────────┘
        │No
        ▼
┌────────────────┐
│  score >= 60?  │──Yes──▶ Grade: D
└───────┬────────┘
        │No
        ▼
     Grade: F
```

### Nested if Statements

Conditions inside conditions.

```js
let age = 25;
let hasLicense = true;

if (age >= 18) {
    if (hasLicense) {
        console.log("You can drive! 🚗");
    } else {
        console.log("You need a license to drive 📝");
    }
} else {
    console.log("You are too young to drive 🚫");
}
```

::: tip Simplify Nested Conditions
Often you can use logical operators instead of nesting:

```js
// Instead of nested if...
if (age >= 18 && hasLicense) {
    console.log("You can drive!");
}
```
:::

## Switch Statement

Use `switch` when comparing a single value against multiple options. It's cleaner than many if-else statements.

```js
let day = 3;
let dayName;

switch (day) {
    case 1:
        dayName = "Monday";
        break;
    case 2:
        dayName = "Tuesday";
        break;
    case 3:
        dayName = "Wednesday";
        break;
    case 4:
        dayName = "Thursday";
        break;
    case 5:
        dayName = "Friday";
        break;
    case 6:
        dayName = "Saturday";
        break;
    case 7:
        dayName = "Sunday";
        break;
    default:
        dayName = "Invalid day";
}

console.log(dayName); // "Wednesday"
```

### How Switch Works

```
switch (day)
     │
     ▼
┌─────────────┐
│ day === 1?  │──Yes──▶ "Monday" ──▶ break ──▶ Exit
└──────┬──────┘
       │No
       ▼
┌─────────────┐
│ day === 2?  │──Yes──▶ "Tuesday" ──▶ break ──▶ Exit
└──────┬──────┘
       │No
       ▼
┌─────────────┐
│ day === 3?  │──Yes──▶ "Wednesday" ──▶ break ──▶ Exit ✓
└──────┬──────┘
       ...
```

### Switch with Multiple Cases

Group cases that share the same code.

```js
let fruit = "apple";

switch (fruit) {
    case "apple":
    case "pear":
    case "banana":
        console.log("This is a common fruit 🍎");
        break;
    case "dragon fruit":
    case "durian":
        console.log("This is an exotic fruit 🍈");
        break;
    default:
        console.log("Unknown fruit 🤔");
}
```

::: warning Don't Forget break!
Without `break`, execution "falls through" to the next case.

```js
let num = 1;

switch (num) {
    case 1:
        console.log("One");
        // No break! Falls through...
    case 2:
        console.log("Two");
        break;
    case 3:
        console.log("Three");
        break;
}
// Output:
// "One"
// "Two"  ← This also prints!
```
:::

## Loops

Loops let you repeat code multiple times.

### Loop Types Comparison

| Loop Type | Best For | When to Use |
|-----------|----------|-------------|
| `for` | Known iterations | When you know how many times to loop |
| `while` | Unknown iterations | When condition determines the end |
| `do...while` | At least once | When you need to run at least once |
| `for...of` | Arrays/Strings | Iterating over values |
| `for...in` | Objects | Iterating over properties |

### for Loop

The most common loop. Use when you know how many iterations you need.

```js
// Basic syntax
for (initialization; condition; update) {
    // code to repeat
}

// Count from 0 to 4
for (let i = 0; i < 5; i++) {
    console.log(i);
}
// Output: 0, 1, 2, 3, 4
```

#### for Loop Anatomy

```
for (let i = 0; i < 5; i++)
     ─────────  ─────  ───
         │        │     │
         │        │     └── Step 4: Update (after each iteration)
         │        │
         │        └── Step 2 & 3: Condition check (before each iteration)
         │
         └── Step 1: Initialize (runs once)

Execution Order:
1. Initialize: let i = 0
2. Check: i < 5? (true)
3. Run code block
4. Update: i++ (i becomes 1)
5. Check: i < 5? (true)
6. Run code block
7. Update: i++ (i becomes 2)
... continues until i < 5 is false
```

#### Common for Loop Patterns

```js
// Count backwards
for (let i = 5; i > 0; i--) {
    console.log(i);
}
// Output: 5, 4, 3, 2, 1

// Skip numbers (count by 2)
for (let i = 0; i <= 10; i += 2) {
    console.log(i);
}
// Output: 0, 2, 4, 6, 8, 10

// Loop through array
const fruits = ["apple", "banana", "orange"];
for (let i = 0; i < fruits.length; i++) {
    console.log(`${i}: ${fruits[i]}`);
}
// Output:
// 0: apple
// 1: banana
// 2: orange
```

### while Loop

Repeats while a condition is true. Use when you don't know the number of iterations.

```js
let count = 0;

while (count < 5) {
    console.log(count);
    count++;
}
// Output: 0, 1, 2, 3, 4
```

#### while Loop Flow

```
         ┌────────────────┐
         │  count < 5?    │◄────┐
         └───────┬────────┘     │
                 │              │
            Yes/  \No           │
             /    \             │
            ▼      ▼            │
       ┌────────┐  Exit         │
       │ Print  │               │
       │ count  │               │
       └────┬───┘               │
            │                   │
            ▼                   │
       ┌────────┐               │
       │count++ │───────────────┘
       └────────┘
```

#### Practical while Loop Example

```js
// Keep asking until valid input
let userInput = "";

while (userInput !== "quit") {
    userInput = prompt("Enter a command (or 'quit' to exit):");
    console.log(`You entered: ${userInput}`);
}
console.log("Goodbye!");
```

### do...while Loop

Runs at least once, then checks the condition.

```js
let count = 0;

do {
    console.log(count);
    count++;
} while (count < 5);
// Output: 0, 1, 2, 3, 4
```

#### Difference from while

```js
let x = 10;

// while: Might never run
while (x < 5) {
    console.log("while:", x);
}
// Nothing printed - condition false from start

// do...while: Always runs at least once
do {
    console.log("do-while:", x);
} while (x < 5);
// Output: "do-while: 10" - runs once even though x >= 5
```

```
while vs do...while:

while:                          do...while:
──────────────────             ──────────────────
Check condition FIRST          Run code FIRST
Then maybe run code            Then check condition

     ┌─────┐                        ┌─────┐
     │Check│                        │ Run │
     └──┬──┘                        └──┬──┘
    Yes/│\No                           │
       │ Exit                       ┌──┴──┐
    ┌──┴──┐                         │Check│
    │ Run │                         └──┬──┘
    └──┬──┘                        Yes/│\No
       │                              │ Exit
       └──(back to check)             │
                                      └──(back to run)
```

### for...of Loop

Iterates over values in arrays, strings, and other iterable objects.

```js
// Arrays
const fruits = ["apple", "banana", "orange"];
for (const fruit of fruits) {
    console.log(fruit);
}
// Output: apple, banana, orange

// Strings
const text = "Hello";
for (const char of text) {
    console.log(char);
}
// Output: H, e, l, l, o
```

### for...in Loop

Iterates over property names (keys) in objects.

```js
const person = {
    name: "John",
    age: 30,
    city: "New York"
};

for (const key in person) {
    console.log(`${key}: ${person[key]}`);
}
// Output:
// name: John
// age: 30
// city: New York
```

::: tip for...of vs for...in
```js
const arr = ["a", "b", "c"];

// for...of → values
for (const value of arr) {
    console.log(value);  // "a", "b", "c"
}

// for...in → indices/keys
for (const index in arr) {
    console.log(index);  // "0", "1", "2"
}
```

**Rule of thumb:**
- `for...of` → Arrays and strings (values)
- `for...in` → Objects (keys)
:::

## Loop Control

### break Statement

Exit the loop immediately.

```js
for (let i = 0; i < 10; i++) {
    if (i === 5) {
        break;  // Stop the loop!
    }
    console.log(i);
}
// Output: 0, 1, 2, 3, 4
// (stops before printing 5)
```

#### break Flow

```
for i = 0 to 9:
    ┌───────────────┐
    │   i === 5?    │
    └───────┬───────┘
        Yes/│\No
           │ │
    ┌──────┘ └──────┐
    │               │
    ▼               ▼
  EXIT           Print i
  LOOP           Continue
```

### continue Statement

Skip the current iteration and continue to the next.

```js
for (let i = 0; i < 5; i++) {
    if (i === 2) {
        continue;  // Skip this iteration
    }
    console.log(i);
}
// Output: 0, 1, 3, 4
// (2 is skipped)
```

### Labeled Statements

Control nested loops from inner loops.

```js
outer: for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
        if (i === 1 && j === 1) {
            break outer;  // Break out of BOTH loops
        }
        console.log(`i=${i}, j=${j}`);
    }
}
// Output:
// i=0, j=0
// i=0, j=1
// i=0, j=2
// i=1, j=0
// (stops at i=1, j=1)
```

## Truthy and Falsy Values

JavaScript automatically converts values to boolean in conditions.

### Falsy Values (Convert to false)

```js
// All of these are falsy
if (false)      // Boolean false
if (0)          // Number zero
if (-0)         // Negative zero
if (0n)         // BigInt zero
if ("")         // Empty string
if (null)       // Null
if (undefined)  // Undefined
if (NaN)        // Not a Number

// None of these will print
```

### Truthy Values (Convert to true)

```js
// All of these are truthy
if (true)       console.log("true");           // ✓
if (1)          console.log("1");              // ✓
if (-1)         console.log("-1");             // ✓
if ("hello")    console.log("string");         // ✓
if ("0")        console.log("'0' string");     // ✓ (non-empty string!)
if ([])         console.log("empty array");    // ✓ (exists!)
if ({})         console.log("empty object");   // ✓ (exists!)
if (function(){}) console.log("function");     // ✓
```

### Visual Reference

```
┌─────────────────────────────────────────────────────────────┐
│                    FALSY VALUES                             │
│      (These become false in boolean context)                │
├─────────────────────────────────────────────────────────────┤
│  false    0    -0    0n    ""    null    undefined    NaN   │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    TRUTHY VALUES                            │
│       (Everything else becomes true)                        │
├─────────────────────────────────────────────────────────────┤
│  true   1   -1   "hello"   "0"   []   {}   function(){}    │
│                                                             │
│  ⚠️ Common gotcha: "0", "false", [], {} are all TRUTHY!    │
└─────────────────────────────────────────────────────────────┘
```

### Practical Examples

```js
// Check if array has items
const items = [];
if (items.length) {
    console.log("Array has items");
} else {
    console.log("Array is empty");  // This runs
}

// Check if variable exists and has value
let userName = "";
if (userName) {
    console.log(`Hello, ${userName}`);
} else {
    console.log("Please enter your name");  // This runs
}

// Default value pattern
const input = "";
const name = input || "Guest";  // "Guest" (because "" is falsy)
```

## Short-Circuit Evaluation

Logical operators can do more than just return true/false.

### Logical AND (&&)

Returns the first falsy value, or the last value if all are truthy.

```js
// Returns first falsy value
console.log(false && "hello");  // false
console.log(0 && "hello");      // 0
console.log("" && "hello");     // ""

// If all truthy, returns last value
console.log(true && "hello");   // "hello"
console.log("hi" && "hello");   // "hello"
console.log(1 && 2 && 3);       // 3

// Practical use: conditional execution
const isLoggedIn = true;
isLoggedIn && console.log("Welcome!");  // Prints "Welcome!"

const isAdmin = false;
isAdmin && console.log("Admin panel");  // Nothing printed
```

### Logical OR (||)

Returns the first truthy value, or the last value if all are falsy.

```js
// Returns first truthy value
console.log("hello" || false);  // "hello"
console.log(0 || "default");    // "default"
console.log("" || "fallback");  // "fallback"

// Practical use: default values
const userInput = "";
const name = userInput || "Guest";  // "Guest"

const port = process.env.PORT || 3000;  // 3000 if PORT not set
```

### Nullish Coalescing (??)

Returns right side only if left is `null` or `undefined` (not other falsy values).

```js
// Only null and undefined trigger the fallback
console.log(null ?? "default");      // "default"
console.log(undefined ?? "default"); // "default"

// Other falsy values DON'T trigger fallback
console.log(0 ?? "default");         // 0
console.log("" ?? "default");        // ""
console.log(false ?? "default");     // false

// Practical use: preserve intentional falsy values
const count = 0;
const result1 = count || 10;   // 10 (0 is falsy, || uses fallback)
const result2 = count ?? 10;   // 0 (?? keeps 0 because it's not null/undefined)
```

### Comparison Table

| Expression | `\|\|` Result | `??` Result |
|------------|---------------|-------------|
| `null \|\| "default"` | "default" | "default" |
| `undefined \|\| "default"` | "default" | "default" |
| `0 \|\| "default"` | "default" | **0** |
| `"" \|\| "default"` | "default" | **""** |
| `false \|\| "default"` | "default" | **false** |

## Exercises

### Exercise 1: FizzBuzz

Print numbers 1-20. For multiples of 3 print "Fizz", for multiples of 5 print "Buzz", for multiples of both print "FizzBuzz".

::: details Solution
```js
for (let i = 1; i <= 20; i++) {
    if (i % 3 === 0 && i % 5 === 0) {
        console.log("FizzBuzz");
    } else if (i % 3 === 0) {
        console.log("Fizz");
    } else if (i % 5 === 0) {
        console.log("Buzz");
    } else {
        console.log(i);
    }
}

// Output: 1, 2, Fizz, 4, Buzz, Fizz, 7, 8, Fizz, Buzz,
//         11, Fizz, 13, 14, FizzBuzz, 16, 17, Fizz, 19, Buzz
```
:::

### Exercise 2: Find Prime Numbers

Print all prime numbers between 1 and 50.

::: details Solution
```js
for (let num = 2; num <= 50; num++) {
    let isPrime = true;

    // Check if num is divisible by any number from 2 to sqrt(num)
    for (let i = 2; i <= Math.sqrt(num); i++) {
        if (num % i === 0) {
            isPrime = false;
            break;  // No need to check further
        }
    }

    if (isPrime) {
        console.log(num);
    }
}

// Output: 2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47
```
:::

### Exercise 3: Pyramid Pattern

Create a pyramid pattern with 5 rows.

::: details Solution
```js
const rows = 5;

for (let i = 1; i <= rows; i++) {
    // Create spaces before stars
    const spaces = " ".repeat(rows - i);
    // Create stars (2*i - 1 gives: 1, 3, 5, 7, 9)
    const stars = "*".repeat(2 * i - 1);

    console.log(spaces + stars);
}

/*
Output:
    *
   ***
  *****
 *******
*********
*/
```
:::

### Exercise 4: Multiplication Table

Print a 10x10 multiplication table.

::: details Solution
```js
// Print header
let header = "   |";
for (let i = 1; i <= 10; i++) {
    header += i.toString().padStart(4);
}
console.log(header);
console.log("-".repeat(45));

// Print table
for (let row = 1; row <= 10; row++) {
    let line = row.toString().padStart(2) + " |";
    for (let col = 1; col <= 10; col++) {
        line += (row * col).toString().padStart(4);
    }
    console.log(line);
}

/*
Output:
   |   1   2   3   4   5   6   7   8   9  10
---------------------------------------------
 1 |   1   2   3   4   5   6   7   8   9  10
 2 |   2   4   6   8  10  12  14  16  18  20
 3 |   3   6   9  12  15  18  21  24  27  30
... etc
*/
```
:::

### Exercise 5: Guess the Number Game

Create a simple number guessing game.

::: details Solution
```js
const secretNumber = Math.floor(Math.random() * 100) + 1;
let attempts = 0;
let guess;

console.log("I'm thinking of a number between 1 and 100...");

while (guess !== secretNumber) {
    // In a real browser, use: guess = parseInt(prompt("Your guess:"));
    // For Node.js, you'd use readline module
    guess = parseInt(prompt("Enter your guess (1-100):"));
    attempts++;

    if (guess < secretNumber) {
        console.log("Too low! Try again.");
    } else if (guess > secretNumber) {
        console.log("Too high! Try again.");
    } else {
        console.log(`Congratulations! You found it in ${attempts} attempts!`);
    }
}
```
:::

## Summary

| Concept | Key Points |
|---------|------------|
| **if/else** | Basic decision making; use `else if` for multiple conditions |
| **switch** | Clean alternative for multiple value comparisons; don't forget `break` |
| **for** | Best when you know the number of iterations |
| **while** | Best when condition determines when to stop |
| **do...while** | Runs at least once before checking condition |
| **for...of** | Iterate over array/string values |
| **for...in** | Iterate over object keys |
| **break** | Exit loop immediately |
| **continue** | Skip to next iteration |
| **Truthy/Falsy** | 8 falsy values; everything else is truthy |
| **Short-circuit** | `\|\|` for defaults, `??` for null/undefined only |

## Next Steps

Continue to [Functions](/guide/javascript/03-functions) to learn about creating reusable code blocks.
