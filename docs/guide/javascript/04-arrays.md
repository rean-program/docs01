# Arrays

Arrays are ordered collections of data. They are one of the most commonly used data structures in JavaScript.

::: info What You'll Learn
- How to create and access array elements
- Methods to add, remove, and modify elements
- Powerful array methods like map, filter, and reduce
- Array destructuring and spread operator
:::

## What is an Array?

An array is a **list** of items stored in order. Each item has an **index** (position number) starting from 0.

```
┌─────────────────────────────────────────────────────────────┐
│                       ARRAY ANATOMY                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   const fruits = ["apple", "banana", "orange", "mango"];    │
│                                                             │
│   Index:    0         1         2         3                 │
│           ┌─────┐   ┌─────┐   ┌─────┐   ┌─────┐            │
│           │apple│   │banana│  │orange│  │mango│            │
│           └─────┘   └─────┘   └─────┘   └─────┘            │
│                                                             │
│   fruits[0] → "apple"                                       │
│   fruits[3] → "mango"                                       │
│   fruits.length → 4                                         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Creating Arrays

```js
// Array literal (recommended) ✅
const fruits = ["apple", "banana", "orange"];

// Array constructor (less common)
const numbers = new Array(1, 2, 3, 4, 5);

// Empty array - fill it later
const empty = [];

// Mixed types (possible but usually avoided)
const mixed = [1, "hello", true, null, { name: "John" }];

// Array.from - create from array-like objects
const chars = Array.from("hello"); // ["h", "e", "l", "l", "o"]

// Array.of - create with specific values
const nums = Array.of(1, 2, 3); // [1, 2, 3]

// Fill with values
const fives = new Array(5).fill(0); // [0, 0, 0, 0, 0]
```

## Accessing Elements

```js
const fruits = ["apple", "banana", "orange", "mango"];

// By index (0-based)
console.log(fruits[0]);  // "apple" (first)
console.log(fruits[2]);  // "orange" (third)

// Last element
console.log(fruits[fruits.length - 1]); // "mango"

// Using at() method (ES2022) - supports negative index!
console.log(fruits.at(0));   // "apple"
console.log(fruits.at(-1));  // "mango" (last)
console.log(fruits.at(-2));  // "orange" (second to last)

// Out of bounds returns undefined
console.log(fruits[100]);  // undefined
console.log(fruits[-1]);   // undefined (use .at() for negative)
```

### Access Methods Comparison

| Method | Example | Result | Notes |
|--------|---------|--------|-------|
| `arr[0]` | `fruits[0]` | "apple" | Standard access |
| `arr[arr.length-1]` | `fruits[fruits.length-1]` | "mango" | Last element |
| `arr.at(0)` | `fruits.at(0)` | "apple" | Same as [0] |
| `arr.at(-1)` | `fruits.at(-1)` | "mango" | Last element (cleaner) |

## Modifying Arrays

### Adding Elements

```js
const arr = [1, 2, 3];

// push - Add to END
arr.push(4);
console.log(arr); // [1, 2, 3, 4]

arr.push(5, 6); // Add multiple
console.log(arr); // [1, 2, 3, 4, 5, 6]

// unshift - Add to BEGINNING
arr.unshift(0);
console.log(arr); // [0, 1, 2, 3, 4, 5, 6]

// splice - Add at SPECIFIC POSITION
// splice(startIndex, deleteCount, ...itemsToAdd)
arr.splice(2, 0, 1.5); // At index 2, delete 0, add 1.5
console.log(arr); // [0, 1, 1.5, 2, 3, 4, 5, 6]
```

### Visual Guide: push vs unshift

```
push (add to end):
┌───┬───┬───┐     push(4)    ┌───┬───┬───┬───┐
│ 1 │ 2 │ 3 │  ──────────▶  │ 1 │ 2 │ 3 │ 4 │
└───┴───┴───┘               └───┴───┴───┴───┘

unshift (add to beginning):
┌───┬───┬───┐   unshift(0)   ┌───┬───┬───┬───┐
│ 1 │ 2 │ 3 │  ──────────▶  │ 0 │ 1 │ 2 │ 3 │
└───┴───┴───┘               └───┴───┴───┴───┘
```

### Removing Elements

```js
const arr = [1, 2, 3, 4, 5];

// pop - Remove from END
const last = arr.pop();
console.log(last); // 5
console.log(arr);  // [1, 2, 3, 4]

// shift - Remove from BEGINNING
const first = arr.shift();
console.log(first); // 1
console.log(arr);   // [2, 3, 4]

// splice - Remove at SPECIFIC POSITION
// splice(startIndex, deleteCount)
const removed = arr.splice(1, 1); // At index 1, delete 1 element
console.log(removed); // [3]
console.log(arr);     // [2, 4]
```

### Visual Guide: pop vs shift

```
pop (remove from end):
┌───┬───┬───┬───┐    pop()     ┌───┬───┬───┐
│ 1 │ 2 │ 3 │ 4 │  ────────▶  │ 1 │ 2 │ 3 │  returns: 4
└───┴───┴───┴───┘             └───┴───┴───┘

shift (remove from beginning):
┌───┬───┬───┬───┐   shift()    ┌───┬───┬───┐
│ 1 │ 2 │ 3 │ 4 │  ────────▶  │ 2 │ 3 │ 4 │  returns: 1
└───┴───┴───┴───┘             └───┴───┴───┘
```

### Replacing Elements

```js
const arr = [1, 2, 3, 4, 5];

// Direct assignment
arr[2] = 30;
console.log(arr); // [1, 2, 30, 4, 5]

// Using splice - replace multiple
arr.splice(1, 2, 20, 25); // At index 1, remove 2, add 20 and 25
console.log(arr); // [1, 20, 25, 4, 5]
```

### Method Summary Table

| Method | Action | Position | Returns | Mutates? |
|--------|--------|----------|---------|----------|
| `push()` | Add | End | New length | ✅ Yes |
| `unshift()` | Add | Beginning | New length | ✅ Yes |
| `pop()` | Remove | End | Removed item | ✅ Yes |
| `shift()` | Remove | Beginning | Removed item | ✅ Yes |
| `splice()` | Add/Remove | Anywhere | Removed items | ✅ Yes |

## Essential Array Methods

### forEach() - Do Something with Each Element

Executes a function for each element. **Does not return anything.**

```js
const numbers = [1, 2, 3];

numbers.forEach((num, index) => {
    console.log(`Index ${index}: ${num}`);
});
// Index 0: 1
// Index 1: 2
// Index 2: 3

// Practical example: update DOM elements
const listItems = document.querySelectorAll('li');
listItems.forEach((item, i) => {
    item.textContent = `Item ${i + 1}`;
});
```

### map() - Transform Each Element

Creates a **new array** by transforming each element.

```js
const numbers = [1, 2, 3, 4, 5];

// Double each number
const doubled = numbers.map(num => num * 2);
console.log(doubled); // [2, 4, 6, 8, 10]

// Original unchanged
console.log(numbers); // [1, 2, 3, 4, 5]

// Extract property from objects
const users = [
    { name: "Alice", age: 25 },
    { name: "Bob", age: 30 }
];

const names = users.map(user => user.name);
console.log(names); // ["Alice", "Bob"]

// Create new objects
const profiles = users.map(user => ({
    displayName: user.name.toUpperCase(),
    isAdult: user.age >= 18
}));
```

### Visual: How map() Works

```
map(n => n * 2)

Input:   [1]  [2]  [3]  [4]  [5]
          │    │    │    │    │
          ▼    ▼    ▼    ▼    ▼
       ×2    ×2   ×2   ×2   ×2
          │    │    │    │    │
          ▼    ▼    ▼    ▼    ▼
Output:  [2]  [4]  [6]  [8]  [10]

New array! Original unchanged.
```

### filter() - Keep Elements that Pass a Test

Creates a **new array** with elements that pass the test.

```js
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// Keep only even numbers
const evens = numbers.filter(num => num % 2 === 0);
console.log(evens); // [2, 4, 6, 8, 10]

// Keep numbers greater than 5
const big = numbers.filter(num => num > 5);
console.log(big); // [6, 7, 8, 9, 10]

// Filter objects
const users = [
    { name: "Alice", age: 25, active: true },
    { name: "Bob", age: 17, active: true },
    { name: "Charlie", age: 30, active: false }
];

// Active adult users
const activeAdults = users.filter(user => user.active && user.age >= 18);
console.log(activeAdults);
// [{ name: "Alice", age: 25, active: true }]
```

### Visual: How filter() Works

```
filter(n => n % 2 === 0)  // Keep even numbers

Input:  [1]  [2]  [3]  [4]  [5]  [6]
         │    │    │    │    │    │
         ▼    ▼    ▼    ▼    ▼    ▼
        odd even  odd even  odd even
         │    │    │    │    │    │
         ✗    ✓    ✗    ✓    ✗    ✓
              │         │         │
              ▼         ▼         ▼
Output:      [2]       [4]       [6]
```

### reduce() - Combine into Single Value

Reduces array to a **single value** by applying a function to each element.

```js
const numbers = [1, 2, 3, 4, 5];

// Sum all numbers
const sum = numbers.reduce((accumulator, current) => {
    return accumulator + current;
}, 0);  // 0 is the initial value

console.log(sum); // 15

// Shorter version
const sum2 = numbers.reduce((acc, num) => acc + num, 0);
```

### Visual: How reduce() Works

```
reduce((acc, num) => acc + num, 0)

Initial: acc = 0

Step 1: acc = 0 + 1 = 1
Step 2: acc = 1 + 2 = 3
Step 3: acc = 3 + 3 = 6
Step 4: acc = 6 + 4 = 10
Step 5: acc = 10 + 5 = 15

Result: 15
```

### More reduce() Examples

```js
// Find maximum value
const numbers = [5, 2, 8, 1, 9, 3];
const max = numbers.reduce((a, b) => a > b ? a : b);
console.log(max); // 9

// Count occurrences
const fruits = ["apple", "banana", "apple", "orange", "banana", "apple"];

const count = fruits.reduce((acc, fruit) => {
    acc[fruit] = (acc[fruit] || 0) + 1;
    return acc;
}, {});

console.log(count); // { apple: 3, banana: 2, orange: 1 }

// Flatten nested array
const nested = [[1, 2], [3, 4], [5, 6]];
const flat = nested.reduce((acc, arr) => acc.concat(arr), []);
console.log(flat); // [1, 2, 3, 4, 5, 6]
```

### find() and findIndex()

Find **first** matching element or its index.

```js
const users = [
    { id: 1, name: "Alice" },
    { id: 2, name: "Bob" },
    { id: 3, name: "Charlie" }
];

// find - returns element or undefined
const user = users.find(u => u.id === 2);
console.log(user); // { id: 2, name: "Bob" }

const notFound = users.find(u => u.id === 999);
console.log(notFound); // undefined

// findIndex - returns index or -1
const index = users.findIndex(u => u.id === 2);
console.log(index); // 1

const notFoundIndex = users.findIndex(u => u.id === 999);
console.log(notFoundIndex); // -1
```

### some() and every()

Test if elements pass a condition.

```js
const numbers = [1, 2, 3, 4, 5];

// some - at least ONE passes
console.log(numbers.some(n => n > 4));  // true (5 > 4)
console.log(numbers.some(n => n > 10)); // false

// every - ALL must pass
console.log(numbers.every(n => n > 0)); // true (all positive)
console.log(numbers.every(n => n > 3)); // false (1, 2, 3 fail)

// Practical examples
const users = [
    { name: "Alice", active: true },
    { name: "Bob", active: false }
];

const hasInactive = users.some(u => !u.active);
console.log(hasInactive); // true

const allActive = users.every(u => u.active);
console.log(allActive); // false
```

## Method Comparison Chart

```
┌────────────────────────────────────────────────────────────────┐
│              CHOOSING THE RIGHT ARRAY METHOD                   │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  WANT TO...              USE THIS          RETURNS             │
│  ─────────────────────   ─────────────    ─────────────────    │
│                                                                │
│  Do something            forEach()        undefined            │
│  for each element                                              │
│                                                                │
│  Transform each          map()            New array            │
│  element                                  (same length)        │
│                                                                │
│  Keep some               filter()         New array            │
│  elements                                 (maybe shorter)      │
│                                                                │
│  Combine into            reduce()         Single value         │
│  one value                                (any type)           │
│                                                                │
│  Find one                find()           Element or           │
│  element                                  undefined            │
│                                                                │
│  Find index of           findIndex()      Number               │
│  one element                              (-1 if not found)    │
│                                                                │
│  Check if any            some()           Boolean              │
│  element matches                          (true/false)         │
│                                                                │
│  Check if all            every()          Boolean              │
│  elements match                           (true/false)         │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

## Chaining Methods

Combine multiple methods for powerful transformations.

```js
const users = [
    { name: "Alice", age: 25, score: 85 },
    { name: "Bob", age: 17, score: 92 },
    { name: "Charlie", age: 30, score: 78 },
    { name: "Diana", age: 22, score: 95 }
];

// Get names of adult users with score > 80, sorted by score
const topAdults = users
    .filter(u => u.age >= 18)           // Keep adults
    .filter(u => u.score > 80)          // Keep high scorers
    .sort((a, b) => b.score - a.score)  // Sort by score (desc)
    .map(u => u.name);                  // Get just names

console.log(topAdults); // ["Diana", "Alice"]

// Calculate average score of active users
const scores = [85, 92, 78, 95, 88];
const average = scores.reduce((sum, s) => sum + s, 0) / scores.length;
console.log(average); // 87.6
```

## Sorting

### sort() - Sort in Place

```js
// Strings - alphabetical by default
const fruits = ["banana", "apple", "orange"];
fruits.sort();
console.log(fruits); // ["apple", "banana", "orange"]

// ⚠️ Numbers - needs compare function!
const numbers = [10, 5, 40, 25, 1000, 1];

// WRONG - sorts as strings!
numbers.sort();
console.log(numbers); // [1, 10, 1000, 25, 40, 5] ❌

// CORRECT - provide compare function
numbers.sort((a, b) => a - b);  // Ascending
console.log(numbers); // [1, 5, 10, 25, 40, 1000] ✅

numbers.sort((a, b) => b - a);  // Descending
console.log(numbers); // [1000, 40, 25, 10, 5, 1]
```

### How Compare Function Works

```
sort((a, b) => a - b)

If result < 0:  a comes before b
If result > 0:  b comes before a
If result = 0:  order unchanged

Example: comparing 5 and 10
  5 - 10 = -5 (negative)
  So 5 comes before 10 (ascending order)
```

### Sort Objects by Property

```js
const users = [
    { name: "Charlie", age: 30 },
    { name: "Alice", age: 25 },
    { name: "Bob", age: 35 }
];

// Sort by age (ascending)
users.sort((a, b) => a.age - b.age);
// [Alice(25), Charlie(30), Bob(35)]

// Sort by name (alphabetical)
users.sort((a, b) => a.name.localeCompare(b.name));
// [Alice, Bob, Charlie]
```

## Spread Operator (...)

The spread operator expands an array into individual elements.

```js
// Copy array (shallow copy)
const original = [1, 2, 3];
const copy = [...original];
copy.push(4);
console.log(original); // [1, 2, 3] (unchanged)
console.log(copy);     // [1, 2, 3, 4]

// Merge arrays
const arr1 = [1, 2];
const arr2 = [3, 4];
const merged = [...arr1, ...arr2];
console.log(merged); // [1, 2, 3, 4]

// Add elements at specific positions
const middle = [0, ...original, 4];
console.log(middle); // [0, 1, 2, 3, 4]

// Use with functions that take multiple arguments
const numbers = [5, 2, 8, 1, 9];
console.log(Math.max(...numbers)); // 9
console.log(Math.min(...numbers)); // 1
```

## Destructuring

Extract values from arrays into variables.

```js
const arr = [1, 2, 3, 4, 5];

// Basic destructuring
const [first, second] = arr;
console.log(first, second); // 1, 2

// Skip elements
const [a, , c] = arr;  // Skip second element
console.log(a, c); // 1, 3

// Rest pattern - collect remaining
const [head, ...tail] = arr;
console.log(head); // 1
console.log(tail); // [2, 3, 4, 5]

// Default values
const [x = 10, y = 20] = [1];
console.log(x, y); // 1, 20

// Swap variables
let m = 1, n = 2;
[m, n] = [n, m];
console.log(m, n); // 2, 1

// Function return values
function getMinMax(arr) {
    return [Math.min(...arr), Math.max(...arr)];
}

const [min, max] = getMinMax([3, 1, 4, 1, 5]);
console.log(min, max); // 1, 5
```

## Common Patterns

### Remove Duplicates

```js
const arr = [1, 2, 2, 3, 3, 3, 4];

// Using Set (recommended)
const unique = [...new Set(arr)];
console.log(unique); // [1, 2, 3, 4]

// Using filter
const unique2 = arr.filter((item, index) => arr.indexOf(item) === index);
console.log(unique2); // [1, 2, 3, 4]
```

### Check if Array Contains Value

```js
const arr = [1, 2, 3, 4, 5];

// includes (preferred for simple values)
console.log(arr.includes(3)); // true
console.log(arr.includes(10)); // false

// indexOf (returns -1 if not found)
console.log(arr.indexOf(3) !== -1); // true

// some (for complex conditions)
const users = [{ id: 1 }, { id: 2 }];
console.log(users.some(u => u.id === 2)); // true
```

### Group By Property

```js
const products = [
    { name: "Apple", category: "fruit", price: 1 },
    { name: "Banana", category: "fruit", price: 0.5 },
    { name: "Carrot", category: "vegetable", price: 0.8 }
];

const grouped = products.reduce((acc, product) => {
    const key = product.category;
    if (!acc[key]) {
        acc[key] = [];
    }
    acc[key].push(product);
    return acc;
}, {});

console.log(grouped);
// {
//   fruit: [{ name: "Apple"... }, { name: "Banana"... }],
//   vegetable: [{ name: "Carrot"... }]
// }

// ES2024+: Object.groupBy() (when available)
// const grouped = Object.groupBy(products, p => p.category);
```

### Flatten Nested Arrays

```js
const nested = [1, [2, 3], [4, [5, 6]]];

// flat() - specify depth
console.log(nested.flat());    // [1, 2, 3, 4, [5, 6]]
console.log(nested.flat(2));   // [1, 2, 3, 4, 5, 6]
console.log(nested.flat(Infinity)); // [1, 2, 3, 4, 5, 6]

// flatMap() - map then flatten (depth 1)
const sentences = ["Hello World", "How are you"];
const words = sentences.flatMap(s => s.split(" "));
console.log(words); // ["Hello", "World", "How", "are", "you"]
```

## Exercises

### Exercise 1: Array Transformation

Given an array of numbers, return squares of only the even numbers.

::: details Solution
```js
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const result = numbers
    .filter(n => n % 2 === 0)  // Keep evens first
    .map(n => n * n);          // Then square

console.log(result); // [4, 16, 36, 64, 100]

// Or: square first, then filter even squares
const result2 = numbers
    .map(n => n * n)
    .filter(n => n % 2 === 0);

console.log(result2); // [4, 16, 36, 64, 100]
```
:::

### Exercise 2: Find Second Largest

Find the second largest number in an array.

::: details Solution
```js
function secondLargest(arr) {
    // Remove duplicates and sort descending
    const unique = [...new Set(arr)].sort((a, b) => b - a);
    return unique[1];
}

console.log(secondLargest([5, 2, 8, 1, 9])); // 8
console.log(secondLargest([5, 5, 5, 3]));    // 3

// More efficient (single pass):
function secondLargestEfficient(arr) {
    let first = -Infinity;
    let second = -Infinity;

    for (const num of arr) {
        if (num > first) {
            second = first;
            first = num;
        } else if (num > second && num !== first) {
            second = num;
        }
    }

    return second;
}
```
:::

### Exercise 3: Chunk Array

Split an array into chunks of specified size.

::: details Solution
```js
function chunk(arr, size) {
    const result = [];
    for (let i = 0; i < arr.length; i += size) {
        result.push(arr.slice(i, i + size));
    }
    return result;
}

console.log(chunk([1, 2, 3, 4, 5, 6, 7], 3));
// [[1, 2, 3], [4, 5, 6], [7]]

console.log(chunk([1, 2, 3, 4], 2));
// [[1, 2], [3, 4]]

// Using reduce
function chunkReduce(arr, size) {
    return arr.reduce((acc, _, i) => {
        if (i % size === 0) {
            acc.push(arr.slice(i, i + size));
        }
        return acc;
    }, []);
}
```
:::

### Exercise 4: Intersection and Difference

Find common elements and differences between two arrays.

::: details Solution
```js
function intersection(arr1, arr2) {
    return arr1.filter(item => arr2.includes(item));
}

function difference(arr1, arr2) {
    return arr1.filter(item => !arr2.includes(item));
}

const a = [1, 2, 3, 4, 5];
const b = [4, 5, 6, 7, 8];

console.log(intersection(a, b)); // [4, 5]
console.log(difference(a, b));   // [1, 2, 3]
console.log(difference(b, a));   // [6, 7, 8]

// Symmetric difference (elements in either but not both)
function symmetricDifference(arr1, arr2) {
    return [
        ...arr1.filter(x => !arr2.includes(x)),
        ...arr2.filter(x => !arr1.includes(x))
    ];
}

console.log(symmetricDifference(a, b)); // [1, 2, 3, 6, 7, 8]
```
:::

## Common Mistakes and Pitfalls

::: danger Avoid These Array Mistakes
:::

### 1. Modifying Arrays During Iteration

```js
const numbers = [1, 2, 3, 4, 5];

// ❌ Modifying array while looping causes issues
for (let i = 0; i < numbers.length; i++) {
    if (numbers[i] % 2 === 0) {
        numbers.splice(i, 1); // Removes element, shifts indices!
    }
}
console.log(numbers); // [1, 3, 5] - but 4 was skipped!

// ✅ Use filter instead
const odds = [1, 2, 3, 4, 5].filter(n => n % 2 !== 0);

// ✅ Or iterate backwards
for (let i = numbers.length - 1; i >= 0; i--) {
    if (numbers[i] % 2 === 0) {
        numbers.splice(i, 1);
    }
}
```

### 2. Forgetting That sort() Mutates

```js
const original = [3, 1, 4, 1, 5];

// ❌ Mutates the original array
const sorted = original.sort((a, b) => a - b);
console.log(original); // [1, 1, 3, 4, 5] - changed!

// ✅ Create a copy first
const safeSorted = [...original].sort((a, b) => a - b);
// Or use toSorted() (ES2023)
const safeSorted2 = original.toSorted((a, b) => a - b);
```

### 3. Using indexOf for Objects

```js
const users = [{ id: 1 }, { id: 2 }, { id: 3 }];
const searchUser = { id: 2 };

// ❌ indexOf compares by reference, not value
console.log(users.indexOf(searchUser)); // -1 (not found)

// ✅ Use findIndex for objects
console.log(users.findIndex(u => u.id === 2)); // 1
```

### 4. Empty Slots vs Undefined

```js
// Empty slots (sparse array)
const sparse = [1, , 3]; // Has empty slot at index 1
console.log(sparse.length); // 3
console.log(1 in sparse); // false

// forEach skips empty slots
sparse.forEach(x => console.log(x)); // 1, 3

// ✅ Explicitly use undefined if needed
const explicit = [1, undefined, 3];
explicit.forEach(x => console.log(x)); // 1, undefined, 3
```

### 5. Wrong Return in map/filter

```js
const numbers = [1, 2, 3];

// ❌ Forgetting return in map
const doubled = numbers.map(n => { n * 2 }); // [undefined, undefined, undefined]

// ✅ Return explicitly or use implicit return
const doubledFixed = numbers.map(n => { return n * 2 });
const doubledBest = numbers.map(n => n * 2);

// ❌ Returning non-boolean in filter
const evenWrong = numbers.filter(n => n % 2); // [1, 3] - opposite of expected!

// ✅ Return explicit boolean
const evenCorrect = numbers.filter(n => n % 2 === 0); // [2]
```

## Interview Questions

::: details Q: What's the difference between map() and forEach()?
**Answer:**

| Feature | `map()` | `forEach()` |
|---------|---------|-------------|
| Returns | New array | `undefined` |
| Purpose | Transform data | Side effects |
| Chainable | Yes | No |
| Can break early | No | No |

```js
const numbers = [1, 2, 3];

// map - transforms and returns new array
const doubled = numbers.map(n => n * 2); // [2, 4, 6]

// forEach - just iterates, returns undefined
const result = numbers.forEach(n => console.log(n)); // undefined
```

**Use `map`** when you need to transform data.
**Use `forEach`** when you just need to do something with each element.
:::

::: details Q: How does reduce() work?
**Answer:**
`reduce()` iterates through an array and accumulates values into a single result.

```js
array.reduce((accumulator, currentValue, index, array) => {
    // return new accumulator value
}, initialValue);
```

```js
// Sum
[1, 2, 3, 4].reduce((sum, n) => sum + n, 0); // 10

// Max
[3, 1, 4, 1, 5].reduce((max, n) => n > max ? n : max, -Infinity); // 5

// Group by
const people = [
    { name: 'Alice', age: 25 },
    { name: 'Bob', age: 30 },
    { name: 'Charlie', age: 25 }
];

const byAge = people.reduce((groups, person) => {
    const age = person.age;
    groups[age] = groups[age] || [];
    groups[age].push(person);
    return groups;
}, {});
// { 25: [{name: 'Alice'...}, {name: 'Charlie'...}], 30: [{name: 'Bob'...}] }
```
:::

::: details Q: How do you remove duplicates from an array?
**Answer:**

```js
const arr = [1, 2, 2, 3, 3, 3, 4];

// Method 1: Set (simplest)
const unique1 = [...new Set(arr)]; // [1, 2, 3, 4]

// Method 2: filter with indexOf
const unique2 = arr.filter((item, index) => arr.indexOf(item) === index);

// Method 3: reduce
const unique3 = arr.reduce((acc, item) => {
    if (!acc.includes(item)) acc.push(item);
    return acc;
}, []);

// For objects, use a key
const users = [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
    { id: 1, name: 'Alice' }
];

const uniqueUsers = users.filter((user, index, self) =>
    index === self.findIndex(u => u.id === user.id)
);
```
:::

## Real-World Examples

### Shopping Cart Operations

```js
const cart = [
    { id: 1, name: "Laptop", price: 999.99, quantity: 1 },
    { id: 2, name: "Mouse", price: 29.99, quantity: 2 },
    { id: 3, name: "Keyboard", price: 79.99, quantity: 1 },
];

// Calculate total
function getCartTotal(items) {
    return items.reduce((total, item) => {
        return total + (item.price * item.quantity);
    }, 0);
}

// Add item (immutable)
function addItem(items, newItem) {
    const existingIndex = items.findIndex(i => i.id === newItem.id);

    if (existingIndex >= 0) {
        return items.map((item, index) =>
            index === existingIndex
                ? { ...item, quantity: item.quantity + newItem.quantity }
                : item
        );
    }

    return [...items, newItem];
}

// Remove item (immutable)
function removeItem(items, itemId) {
    return items.filter(item => item.id !== itemId);
}

// Update quantity (immutable)
function updateQuantity(items, itemId, quantity) {
    if (quantity <= 0) {
        return removeItem(items, itemId);
    }

    return items.map(item =>
        item.id === itemId
            ? { ...item, quantity }
            : item
    );
}

// Get cart summary
function getCartSummary(items) {
    return {
        itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
        uniqueItems: items.length,
        subtotal: getCartTotal(items),
        items: items.map(({ name, quantity, price }) => ({
            name,
            quantity,
            lineTotal: (price * quantity).toFixed(2)
        }))
    };
}

console.log(getCartSummary(cart));
```

### Data Transformation Pipeline

```js
const rawData = [
    { id: 1, name: "Alice", department: "Engineering", salary: 85000, active: true },
    { id: 2, name: "Bob", department: "Marketing", salary: 65000, active: true },
    { id: 3, name: "Charlie", department: "Engineering", salary: 95000, active: false },
    { id: 4, name: "Diana", department: "Engineering", salary: 90000, active: true },
    { id: 5, name: "Eve", department: "Marketing", salary: 70000, active: true },
];

// Pipeline: Get active engineering employees sorted by salary
const result = rawData
    .filter(emp => emp.active)
    .filter(emp => emp.department === "Engineering")
    .sort((a, b) => b.salary - a.salary)
    .map(({ id, name, salary }) => ({ id, name, salary }));

// Group employees by department with stats
function getDepartmentStats(employees) {
    return employees
        .filter(emp => emp.active)
        .reduce((stats, emp) => {
            const dept = emp.department;

            if (!stats[dept]) {
                stats[dept] = {
                    count: 0,
                    totalSalary: 0,
                    employees: []
                };
            }

            stats[dept].count++;
            stats[dept].totalSalary += emp.salary;
            stats[dept].employees.push(emp.name);
            stats[dept].avgSalary = stats[dept].totalSalary / stats[dept].count;

            return stats;
        }, {});
}

console.log(getDepartmentStats(rawData));
```

### Pagination Helper

```js
function paginate(array, pageSize, pageNumber) {
    const startIndex = (pageNumber - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    return {
        data: array.slice(startIndex, endIndex),
        pagination: {
            currentPage: pageNumber,
            pageSize,
            totalItems: array.length,
            totalPages: Math.ceil(array.length / pageSize),
            hasNextPage: endIndex < array.length,
            hasPrevPage: pageNumber > 1,
        }
    };
}

// Usage
const allItems = Array.from({ length: 95 }, (_, i) => ({
    id: i + 1,
    name: `Item ${i + 1}`
}));

const page1 = paginate(allItems, 10, 1);
console.log(page1);
// {
//   data: [{id: 1, name: "Item 1"}, ...], // 10 items
//   pagination: {
//     currentPage: 1,
//     pageSize: 10,
//     totalItems: 95,
//     totalPages: 10,
//     hasNextPage: true,
//     hasPrevPage: false
//   }
// }
```

### Search and Filter System

```js
function createSearchFilter(items, searchableFields) {
    return function search(query, filters = {}) {
        let results = [...items];

        // Text search across multiple fields
        if (query) {
            const lowerQuery = query.toLowerCase();
            results = results.filter(item =>
                searchableFields.some(field => {
                    const value = item[field];
                    return value && String(value).toLowerCase().includes(lowerQuery);
                })
            );
        }

        // Apply filters
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                if (Array.isArray(value)) {
                    results = results.filter(item => value.includes(item[key]));
                } else if (typeof value === 'object') {
                    // Range filter { min, max }
                    if (value.min !== undefined) {
                        results = results.filter(item => item[key] >= value.min);
                    }
                    if (value.max !== undefined) {
                        results = results.filter(item => item[key] <= value.max);
                    }
                } else {
                    results = results.filter(item => item[key] === value);
                }
            }
        });

        return results;
    };
}

// Usage
const products = [
    { id: 1, name: "iPhone 15", category: "phones", price: 999, brand: "Apple" },
    { id: 2, name: "Galaxy S24", category: "phones", price: 899, brand: "Samsung" },
    { id: 3, name: "MacBook Pro", category: "laptops", price: 1999, brand: "Apple" },
    { id: 4, name: "ThinkPad", category: "laptops", price: 1299, brand: "Lenovo" },
];

const searchProducts = createSearchFilter(products, ['name', 'brand']);

// Search for "apple"
console.log(searchProducts('apple'));
// [{id: 1, name: "iPhone 15"...}, {id: 3, name: "MacBook Pro"...}]

// Search with filters
console.log(searchProducts('', {
    category: 'phones',
    price: { max: 950 }
}));
// [{id: 2, name: "Galaxy S24"...}]
```

## Summary

| Concept | Key Points |
|---------|------------|
| **Creating** | Use `[]` literal; `Array.from()` for array-like |
| **Accessing** | Index starts at 0; use `.at(-1)` for last |
| **Adding** | `push()` end, `unshift()` beginning |
| **Removing** | `pop()` end, `shift()` beginning |
| **Transform** | `map()` for transformation, returns new array |
| **Filter** | `filter()` keeps matching elements |
| **Reduce** | `reduce()` combines into single value |
| **Search** | `find()` element, `findIndex()` index |
| **Test** | `some()` any match, `every()` all match |
| **Sort** | Use compare function for numbers! |
| **Spread** | `[...arr]` copy, `[...a, ...b]` merge |
| **Destructure** | `[first, ...rest] = arr` |

## Next Steps

Continue to [Objects](/guide/javascript/05-objects) to learn about working with key-value data structures.
