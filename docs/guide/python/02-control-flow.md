# Control Flow

Control flow determines the order in which statements are executed. This lesson covers conditionals and loops.

::: info What You'll Learn
- Make decisions with `if`, `elif`, `else`
- Repeat code with `for` and `while` loops
- Control loop execution with `break` and `continue`
- Understand truthy and falsy values
- Use the match statement (Python 3.10+)
:::

## Conditionals

Conditionals allow your program to make decisions based on conditions.

```
┌─────────────────────────────────────────────────────────────────┐
│                    Conditional Flow                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│                    ┌──────────────┐                             │
│                    │  Condition   │                             │
│                    └──────┬───────┘                             │
│                           │                                      │
│              ┌────────────┴────────────┐                        │
│              │                         │                         │
│           True?                     False?                       │
│              │                         │                         │
│              ▼                         ▼                         │
│      ┌─────────────┐           ┌─────────────┐                  │
│      │ if block    │           │ else block  │                  │
│      │ executes    │           │ executes    │                  │
│      └─────────────┘           └─────────────┘                  │
│              │                         │                         │
│              └────────────┬────────────┘                        │
│                           ▼                                      │
│                    Continue...                                   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### if Statement

```python
age = 20

if age >= 18:
    print("You are an adult")
    print("You can vote")
```

### if-else Statement

```python
age = 15

if age >= 18:
    print("You are an adult")
else:
    print("You are a minor")
```

### if-elif-else Statement

```python
score = 85

if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
elif score >= 70:
    grade = "C"
elif score >= 60:
    grade = "D"
else:
    grade = "F"

print(f"Your grade is: {grade}")
```

::: tip Multiple Conditions Flow
```
┌───────────────────────────────────────────────────────────────┐
│                                                                │
│   if score >= 90:      ──▶  True? → grade = "A" → DONE       │
│                             False? ↓                           │
│   elif score >= 80:    ──▶  True? → grade = "B" → DONE       │
│                             False? ↓                           │
│   elif score >= 70:    ──▶  True? → grade = "C" → DONE       │
│                             False? ↓                           │
│   else:                ──▶  grade = "F" → DONE                │
│                                                                │
│   Python checks conditions TOP to BOTTOM, stops at first True  │
│                                                                │
└───────────────────────────────────────────────────────────────┘
```
:::

### Nested Conditionals

```python
age = 25
has_license = True

if age >= 18:
    if has_license:
        print("You can drive")
    else:
        print("You need a license first")
else:
    print("You're too young to drive")
```

### Conditional Expressions (Ternary)

```python
# Syntax: value_if_true if condition else value_if_false
age = 20
status = "adult" if age >= 18 else "minor"
print(status)  # adult

# Useful for simple assignments
max_value = a if a > b else b
abs_value = x if x >= 0 else -x
```

## Truthy and Falsy Values

In Python, all values have a boolean interpretation.

::: warning Falsy Values (evaluate to False)
| Value | Type | Note |
|-------|------|------|
| `False` | bool | Explicit False |
| `None` | NoneType | No value |
| `0` | int | Zero |
| `0.0` | float | Zero float |
| `""` | str | Empty string |
| `[]` | list | Empty list |
| `{}` | dict | Empty dict |
| `()` | tuple | Empty tuple |
| `set()` | set | Empty set |
:::

```python
# Everything else is truthy
if [1, 2, 3]:    # Non-empty list - truthy
    print("List has items")

if "":           # Empty string - falsy
    print("This won't print")

# Practical example
name = input("Enter name: ")
if name:  # Check if not empty
    print(f"Hello, {name}!")
else:
    print("No name entered")
```

## Loops

Loops allow you to repeat code multiple times.

### for Loop

The `for` loop iterates over a sequence (list, string, range, etc.).

```
┌─────────────────────────────────────────────────────────────────┐
│                    for Loop Anatomy                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   for fruit in ["apple", "banana", "cherry"]:                   │
│       │     │             │                                      │
│       │     │             └── Sequence to iterate over          │
│       │     └── Each item goes into this variable               │
│       └── Keyword                                                │
│                                                                  │
│   Iteration:                                                     │
│   ┌─────────────────────────────────────────────────────┐       │
│   │ Loop 1: fruit = "apple"  → print("apple")          │       │
│   │ Loop 2: fruit = "banana" → print("banana")         │       │
│   │ Loop 3: fruit = "cherry" → print("cherry")         │       │
│   │ Done!                                               │       │
│   └─────────────────────────────────────────────────────┘       │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

```python
# Loop through a list
fruits = ["apple", "banana", "cherry"]
for fruit in fruits:
    print(fruit)

# Loop through a string
for char in "Python":
    print(char)

# Loop through a range
for i in range(5):      # 0, 1, 2, 3, 4
    print(i)

for i in range(2, 6):   # 2, 3, 4, 5
    print(i)

for i in range(0, 10, 2):  # 0, 2, 4, 6, 8 (step by 2)
    print(i)

for i in range(5, 0, -1):  # 5, 4, 3, 2, 1 (countdown)
    print(i)
```

### enumerate()

Get both index and value when looping.

```python
fruits = ["apple", "banana", "cherry"]

# Without enumerate
for i in range(len(fruits)):
    print(f"{i}: {fruits[i]}")

# With enumerate (cleaner!)
for index, fruit in enumerate(fruits):
    print(f"{index}: {fruit}")

# Start from different index
for index, fruit in enumerate(fruits, start=1):
    print(f"{index}: {fruit}")  # 1: apple, 2: banana...
```

### zip()

Loop through multiple sequences together.

```python
names = ["Alice", "Bob", "Charlie"]
ages = [25, 30, 35]

for name, age in zip(names, ages):
    print(f"{name} is {age} years old")

# Works with multiple sequences
cities = ["NYC", "LA", "Chicago"]
for name, age, city in zip(names, ages, cities):
    print(f"{name}, {age}, from {city}")
```

### while Loop

The `while` loop repeats as long as a condition is True.

```
┌─────────────────────────────────────────────────────────────────┐
│                    while Loop Flow                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│            ┌─────────────────┐                                  │
│            │ Check condition │ ◀──────────────────────┐         │
│            └────────┬────────┘                        │         │
│                     │                                  │         │
│         ┌──────────┴──────────┐                       │         │
│         │                      │                       │         │
│       True                   False                     │         │
│         │                      │                       │         │
│         ▼                      ▼                       │         │
│   ┌───────────┐         ┌───────────┐                 │         │
│   │ Execute   │         │  Exit     │                 │         │
│   │ loop body │         │  loop     │                 │         │
│   └─────┬─────┘         └───────────┘                 │         │
│         │                                              │         │
│         └──────────────────────────────────────────────┘         │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

```python
# Basic while loop
count = 0
while count < 5:
    print(count)
    count += 1  # Don't forget to update!

# User input loop
while True:
    answer = input("Continue? (yes/no): ")
    if answer.lower() == "no":
        break
    print("Continuing...")

# Find a number
number = 1
while number % 7 != 0 or number < 50:
    number += 1
print(f"Found: {number}")  # 56
```

::: warning Infinite Loops
```python
# DANGER! This runs forever
while True:
    print("Help!")

# DANGER! Condition never changes
count = 0
while count < 5:
    print(count)
    # Forgot count += 1

# Always have an exit condition!
```
:::

### for vs while

| for | while |
|-----|-------|
| Known number of iterations | Unknown number of iterations |
| Iterating over sequences | Condition-based |
| Cleaner, less error-prone | More flexible |
| Example: process all items | Example: wait for user input |

## Loop Control

### break

Exit the loop immediately.

```python
# Find first even number
numbers = [1, 3, 5, 8, 9, 10]
for num in numbers:
    if num % 2 == 0:
        print(f"Found even number: {num}")
        break

# Search with early exit
target = 7
found = False
for i in range(100):
    if i == target:
        found = True
        break
```

### continue

Skip the current iteration and continue with the next.

```python
# Print only odd numbers
for i in range(10):
    if i % 2 == 0:
        continue
    print(i)  # 1, 3, 5, 7, 9

# Skip invalid entries
data = [10, -5, 20, -3, 15]
for value in data:
    if value < 0:
        continue
    print(f"Processing: {value}")
```

### else Clause

The `else` clause runs if the loop completes without `break`.

```python
# Search example
numbers = [1, 3, 5, 7, 9]
target = 4

for num in numbers:
    if num == target:
        print("Found!")
        break
else:
    print("Not found")  # This runs because no break

# Prime check
num = 17
for i in range(2, num):
    if num % i == 0:
        print(f"{num} is not prime")
        break
else:
    print(f"{num} is prime!")  # This runs
```

### pass

Placeholder that does nothing (useful for empty blocks).

```python
# Placeholder for future code
def my_function():
    pass  # TODO: implement this

# Empty loop (rare, but valid)
for i in range(10):
    pass

# Minimal class definition
class MyClass:
    pass
```

## Nested Loops

Loops inside loops.

```python
# Multiplication table
for i in range(1, 4):
    for j in range(1, 4):
        print(f"{i} × {j} = {i * j}")
    print("---")

# Grid pattern
for row in range(3):
    for col in range(4):
        print("*", end=" ")
    print()  # New line

# Output:
# * * * *
# * * * *
# * * * *
```

```
┌─────────────────────────────────────────────────────────────────┐
│                    Nested Loop Execution                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   for i in range(2):      # Outer loop                          │
│       for j in range(3):  # Inner loop (runs completely         │
│           print(i, j)     #  for each outer iteration)          │
│                                                                  │
│   Execution order:                                               │
│   ┌────────────────────────────────────────────┐                │
│   │ i=0: j=0 → j=1 → j=2 (inner completes)    │                │
│   │ i=1: j=0 → j=1 → j=2 (inner completes)    │                │
│   └────────────────────────────────────────────┘                │
│                                                                  │
│   Output: (0,0) (0,1) (0,2) (1,0) (1,1) (1,2)                   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Match Statement (Python 3.10+)

Pattern matching - similar to switch in other languages.

```python
def http_status(status):
    match status:
        case 200:
            return "OK"
        case 404:
            return "Not Found"
        case 500:
            return "Internal Server Error"
        case _:  # Default case (wildcard)
            return "Unknown"

print(http_status(200))  # OK
print(http_status(999))  # Unknown
```

### Pattern Matching with Conditions

```python
def check_value(value):
    match value:
        case 0:
            return "Zero"
        case n if n < 0:
            return "Negative"
        case n if n > 100:
            return "Large positive"
        case _:
            return "Positive"

# Matching data structures
def process_point(point):
    match point:
        case (0, 0):
            return "Origin"
        case (x, 0):
            return f"On X-axis at {x}"
        case (0, y):
            return f"On Y-axis at {y}"
        case (x, y):
            return f"Point at ({x}, {y})"
```

## List Comprehensions

A concise way to create lists using loops.

```python
# Traditional way
squares = []
for x in range(5):
    squares.append(x ** 2)

# List comprehension (same result, one line)
squares = [x ** 2 for x in range(5)]

# With condition
evens = [x for x in range(10) if x % 2 == 0]

# Nested comprehension
matrix = [[i * j for j in range(3)] for i in range(3)]
```

::: tip Comprehension Syntax
```python
[expression for item in iterable if condition]

# Examples:
[x * 2 for x in range(5)]           # [0, 2, 4, 6, 8]
[x for x in range(10) if x % 2 == 0] # [0, 2, 4, 6, 8]
[c.upper() for c in "hello"]         # ['H', 'E', 'L', 'L', 'O']
```
:::

## Common Mistakes

::: danger Avoid These Common Errors

### 1. Forgetting the Colon
```python
# ❌ WRONG
if x > 5
    print("Big")

# ✓ CORRECT
if x > 5:
    print("Big")
```

### 2. Using = Instead of ==
```python
# ❌ WRONG - This is assignment, not comparison!
if x = 5:    # SyntaxError

# ✓ CORRECT
if x == 5:
    print("Equal")
```

### 3. Infinite Loops
```python
# ❌ WRONG - Never terminates!
i = 0
while i < 10:
    print(i)
    # Forgot i += 1

# ✓ CORRECT
i = 0
while i < 10:
    print(i)
    i += 1
```

### 4. Off-by-One Errors
```python
# ❌ WRONG - Doesn't include 10
for i in range(10):  # 0 to 9

# ✓ CORRECT - If you want 1 to 10
for i in range(1, 11):  # 1 to 10
```

### 5. Modifying List While Iterating
```python
# ❌ WRONG - Can cause unexpected behavior
numbers = [1, 2, 3, 4, 5]
for num in numbers:
    if num % 2 == 0:
        numbers.remove(num)

# ✓ CORRECT - Create new list
numbers = [1, 2, 3, 4, 5]
numbers = [num for num in numbers if num % 2 != 0]
```
:::

## Python vs JavaScript

::: tip Coming from JavaScript?
| Feature | Python | JavaScript |
|---------|--------|------------|
| If statement | `if x > 5:` | `if (x > 5) {` |
| Else if | `elif` | `else if` |
| For loop | `for i in range(10):` | `for (let i = 0; i < 10; i++) {` |
| For-each | `for item in list:` | `for (const item of array) {` |
| While | `while x > 0:` | `while (x > 0) {` |
| Ternary | `a if cond else b` | `cond ? a : b` |
| Switch | `match value:` (3.10+) | `switch (value) {` |
| AND | `and` | `&&` |
| OR | `or` | `\|\|` |
| NOT | `not` | `!` |
:::

## Real-World Examples

### Example 1: User Authentication
```python
MAX_ATTEMPTS = 3
CORRECT_PASSWORD = "secret123"

attempts = 0
logged_in = False

while attempts < MAX_ATTEMPTS:
    password = input("Enter password: ")
    attempts += 1

    if password == CORRECT_PASSWORD:
        logged_in = True
        print("Login successful!")
        break
    else:
        remaining = MAX_ATTEMPTS - attempts
        if remaining > 0:
            print(f"Wrong password. {remaining} attempts remaining.")
        else:
            print("Account locked. Too many failed attempts.")

if logged_in:
    print("Welcome to the system!")
```

### Example 2: Menu System
```python
def show_menu():
    print("\n" + "=" * 30)
    print("       MAIN MENU")
    print("=" * 30)
    print("1. View Profile")
    print("2. Edit Settings")
    print("3. Help")
    print("4. Exit")
    print("=" * 30)

while True:
    show_menu()
    choice = input("Select option (1-4): ")

    match choice:
        case "1":
            print("\n📋 Displaying your profile...")
        case "2":
            print("\n⚙️ Opening settings...")
        case "3":
            print("\n❓ Help: Contact support@example.com")
        case "4":
            print("\n👋 Goodbye!")
            break
        case _:
            print("\n❌ Invalid option. Please try again.")
```

### Example 3: Data Validation
```python
def get_valid_age():
    """Get a valid age from user with validation."""
    while True:
        try:
            age = int(input("Enter your age: "))

            if age < 0:
                print("Age cannot be negative!")
            elif age > 150:
                print("Age seems unrealistic!")
            else:
                return age

        except ValueError:
            print("Please enter a valid number!")

def get_valid_email():
    """Get a valid email from user."""
    while True:
        email = input("Enter your email: ").strip()

        if not email:
            print("Email cannot be empty!")
        elif "@" not in email:
            print("Email must contain @!")
        elif "." not in email.split("@")[-1]:
            print("Invalid email domain!")
        else:
            return email

# Usage
age = get_valid_age()
email = get_valid_email()
print(f"\nAge: {age}, Email: {email}")
```

### Example 4: Shopping Cart with Discount
```python
cart = []
total = 0

print("Shopping Cart (type 'done' to checkout)")
print("-" * 40)

while True:
    item = input("Item name (or 'done'): ").strip()
    if item.lower() == 'done':
        break

    try:
        price = float(input(f"Price of {item}: $"))
        qty = int(input("Quantity: "))

        if price < 0 or qty < 1:
            print("Invalid price or quantity!")
            continue

        cart.append({"item": item, "price": price, "qty": qty})
        subtotal = price * qty
        total += subtotal
        print(f"Added: {item} x{qty} = ${subtotal:.2f}")
        print()

    except ValueError:
        print("Invalid input! Try again.\n")

# Checkout
print("\n" + "=" * 40)
print("CHECKOUT")
print("=" * 40)

for item in cart:
    line_total = item['price'] * item['qty']
    print(f"{item['item']:20} x{item['qty']:3} ${line_total:8.2f}")

print("-" * 40)
print(f"{'Subtotal:':24} ${total:8.2f}")

# Apply discount
if total >= 100:
    discount = total * 0.1
    print(f"{'Discount (10%):':24} -${discount:7.2f}")
    total -= discount

print(f"{'TOTAL:':24} ${total:8.2f}")
```

## Exercises

### Exercise 1: FizzBuzz
Print numbers 1-100. For multiples of 3, print "Fizz". For multiples of 5, print "Buzz". For multiples of both, print "FizzBuzz".

::: details Solution
```python
for i in range(1, 101):
    if i % 3 == 0 and i % 5 == 0:
        print("FizzBuzz")
    elif i % 3 == 0:
        print("Fizz")
    elif i % 5 == 0:
        print("Buzz")
    else:
        print(i)
```
:::

### Exercise 2: Prime Numbers
Print all prime numbers between 2 and 50.

::: details Solution
```python
for num in range(2, 51):
    is_prime = True
    for i in range(2, int(num ** 0.5) + 1):
        if num % i == 0:
            is_prime = False
            break
    if is_prime:
        print(num)
```
:::

### Exercise 3: Guess the Number
Create a number guessing game with limited attempts.

::: details Solution
```python
import random

secret = random.randint(1, 100)
attempts = 7

print("Guess the number between 1 and 100!")
print(f"You have {attempts} attempts.")

while attempts > 0:
    guess = int(input("Your guess: "))
    attempts -= 1

    if guess == secret:
        print("Congratulations! You won!")
        break
    elif guess < secret:
        print(f"Too low! {attempts} attempts left.")
    else:
        print(f"Too high! {attempts} attempts left.")
else:
    print(f"Game over! The number was {secret}.")
```
:::

### Exercise 4: Pyramid Pattern
Print a pyramid pattern with n rows.

::: details Solution
```python
n = int(input("Enter number of rows: "))

for i in range(1, n + 1):
    # Print spaces
    print(" " * (n - i), end="")
    # Print stars
    print("*" * (2 * i - 1))

# Output for n=5:
#     *
#    ***
#   *****
#  *******
# *********
```
:::

### Exercise 5: Factorial Calculator
Calculate factorial using a loop.

::: details Solution
```python
num = int(input("Enter a number: "))

if num < 0:
    print("Factorial not defined for negative numbers")
elif num == 0:
    print("0! = 1")
else:
    factorial = 1
    for i in range(1, num + 1):
        factorial *= i
    print(f"{num}! = {factorial}")
```
:::

### Exercise 6: Password Strength Checker
Check password strength based on criteria.

::: details Solution
```python
password = input("Enter password: ")

score = 0
feedback = []

# Check length
if len(password) >= 8:
    score += 1
else:
    feedback.append("At least 8 characters")

# Check for uppercase
if any(c.isupper() for c in password):
    score += 1
else:
    feedback.append("Add uppercase letter")

# Check for lowercase
if any(c.islower() for c in password):
    score += 1
else:
    feedback.append("Add lowercase letter")

# Check for digit
if any(c.isdigit() for c in password):
    score += 1
else:
    feedback.append("Add a number")

# Check for special character
special = "!@#$%^&*()_+-="
if any(c in special for c in password):
    score += 1
else:
    feedback.append("Add special character")

# Display result
print(f"\nStrength: {'█' * score}{'░' * (5 - score)} ({score}/5)")

if score < 3:
    print("Status: Weak 🔴")
elif score < 5:
    print("Status: Medium 🟡")
else:
    print("Status: Strong 🟢")

if feedback:
    print("\nSuggestions:")
    for item in feedback:
        print(f"  • {item}")
```
:::

## Quick Reference

::: tip Control Flow Cheat Sheet
```python
# Conditionals
if condition:
    # code
elif other_condition:
    # code
else:
    # code

# Ternary
result = "yes" if condition else "no"

# for loop
for item in sequence:
    # code

for i in range(start, stop, step):
    # code

for index, value in enumerate(sequence):
    # code

# while loop
while condition:
    # code

# Loop control
break      # Exit loop
continue   # Skip iteration
pass       # Do nothing

# List comprehension
[expr for item in sequence if condition]
```
:::

## Summary

| Concept | Description | Example |
|---------|-------------|---------|
| `if/elif/else` | Conditional branching | `if x > 0:` |
| `for` | Iterate over sequence | `for i in range(5):` |
| `while` | Loop while condition true | `while count < 10:` |
| `break` | Exit loop | `break` |
| `continue` | Skip iteration | `continue` |
| `enumerate()` | Index + value | `for i, v in enumerate(list):` |
| `zip()` | Combine sequences | `for a, b in zip(x, y):` |
| `match` | Pattern matching | `match value:` |

## Next Steps

Continue to [Functions](/guide/python/03-functions) to learn how to create reusable code blocks.
