# Python Basics

This lesson covers the fundamentals of Python: variables, data types, and basic operations.

::: info What You'll Learn
- Understand Python syntax and conventions
- Create and use variables
- Work with different data types
- Perform operations on data
- Get input from users
:::

## Python Syntax

Python is known for its clean, readable syntax. Unlike many languages, Python uses indentation to define code blocks.

```
┌─────────────────────────────────────────────────────────────────┐
│                    Python Syntax Rules                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ✓ Indentation matters (use 4 spaces)                           │
│  ✓ No semicolons needed at end of lines                         │
│  ✓ No curly braces for code blocks                              │
│  ✓ Case sensitive (name ≠ Name ≠ NAME)                          │
│  ✓ Use # for comments                                           │
│                                                                  │
│  Example:                                                        │
│  ┌────────────────────────────────────────┐                     │
│  │ if age >= 18:        ← colon starts block                   │
│  │     print("Adult")   ← indentation defines block            │
│  │     can_vote = True  ← same indentation = same block        │
│  │ print("Done")        ← back to original level               │
│  └────────────────────────────────────────┘                     │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Your First Python Program

```python
# This is a comment - Python ignores it
print("Hello, World!")  # This prints text to the screen
```

### Comments

```python
# Single line comment

"""
This is a
multi-line comment
(actually a docstring)
"""

# Comments are important for:
# - Explaining your code
# - Making notes for yourself
# - Temporarily disabling code
```

## Variables

Variables are containers for storing data values. Python has no command for declaring a variable - it's created when you assign a value.

```
┌─────────────────────────────────────────────────────────────────┐
│                    Variables as Labeled Boxes                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   name = "Alice"                                                 │
│                                                                  │
│   ┌─────────────┐                                               │
│   │   "Alice"   │  ← The VALUE stored inside                    │
│   └─────────────┘                                               │
│         │                                                        │
│       name       ← The LABEL (variable name)                     │
│                                                                  │
│   You can change what's in the box:                              │
│   name = "Bob"   → Now the box contains "Bob"                    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Creating Variables

```python
# Variables are created when you assign a value
name = "Alice"          # String
age = 25                # Integer
height = 5.9            # Float
is_student = True       # Boolean

# No type declaration needed!
# Python figures out the type automatically

# You can check the type
print(type(name))       # <class 'str'>
print(type(age))        # <class 'int'>
```

### Variable Naming Rules

```python
# ✓ Valid variable names
name = "Alice"
_private = "hidden"
user_name = "bob"
userName = "bob"        # camelCase works but not preferred
user2 = "charlie"
MAX_SIZE = 100          # UPPER_CASE for constants

# ✗ Invalid variable names
# 2user = "error"       # Cannot start with number
# user-name = "error"   # No hyphens
# user name = "error"   # No spaces
# class = "error"       # Cannot use reserved words
```

::: tip Python Naming Conventions
| Type | Convention | Example |
|------|------------|---------|
| Variables | `snake_case` | `user_name` |
| Constants | `UPPER_SNAKE_CASE` | `MAX_SIZE` |
| Functions | `snake_case` | `calculate_total` |
| Classes | `PascalCase` | `UserAccount` |
| Private | `_leading_underscore` | `_internal_value` |
:::

### Multiple Assignment

```python
# Assign same value to multiple variables
x = y = z = 0

# Assign multiple values at once
a, b, c = 1, 2, 3

# Swap variables (no temp needed!)
x, y = 10, 20
x, y = y, x  # Now x=20, y=10
```

## Data Types

Python has several built-in data types.

```
┌─────────────────────────────────────────────────────────────────┐
│                    Python Data Types                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   NUMERIC                    TEXT                               │
│   ───────                    ────                               │
│   int    → 42, -10, 0        str → "Hello", 'World'            │
│   float  → 3.14, -0.5                                           │
│   complex → 3+4j                                                │
│                                                                  │
│   BOOLEAN                    NONE                               │
│   ───────                    ────                               │
│   bool   → True, False       NoneType → None                    │
│                                                                  │
│   SEQUENCES                  MAPPINGS                           │
│   ─────────                  ────────                           │
│   list   → [1, 2, 3]         dict → {"a": 1, "b": 2}           │
│   tuple  → (1, 2, 3)                                            │
│   range  → range(10)                                            │
│                                                                  │
│   SETS                                                          │
│   ────                                                          │
│   set    → {1, 2, 3}                                            │
│   frozenset                                                      │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Numbers

```python
# Integers - whole numbers
age = 25
year = 2024
negative = -10
big_number = 1_000_000  # Underscores for readability

# Floats - decimal numbers
price = 19.99
pi = 3.14159
scientific = 2.5e6     # 2.5 × 10^6 = 2,500,000

# Complex numbers (rarely used in basic programming)
complex_num = 3 + 4j
```

### Strings

```python
# Strings - text in quotes
single = 'Hello'
double = "World"
multi_line = """This is a
multi-line
string"""

# String with quotes inside
message = "He said 'Hello'"
message2 = 'She said "Hi"'
escaped = "He said \"Hello\""

# f-strings (formatted strings) - Python 3.6+
name = "Alice"
age = 25
greeting = f"Hello, {name}! You are {age} years old."
print(greeting)  # Hello, Alice! You are 25 years old.

# String operations
text = "Python"
print(len(text))        # 6 (length)
print(text.upper())     # PYTHON
print(text.lower())     # python
print(text[0])          # P (first character)
print(text[-1])         # n (last character)
print(text[0:3])        # Pyt (slicing)
```

### Booleans

```python
# Booleans - True or False
is_active = True
is_admin = False

# Comparison results are booleans
print(5 > 3)    # True
print(5 == 3)   # False
print(5 != 3)   # True

# Truthy and Falsy values
# Falsy: False, 0, 0.0, "", [], {}, None
# Truthy: Everything else

print(bool(0))      # False
print(bool(1))      # True
print(bool(""))     # False
print(bool("Hi"))   # True
print(bool([]))     # False
print(bool([1]))    # True
```

### None

```python
# None represents "no value" or "nothing"
result = None

# Check for None
if result is None:
    print("No result yet")

# Common use: default function parameters
def greet(name=None):
    if name is None:
        return "Hello, stranger!"
    return f"Hello, {name}!"
```

## Type Conversion

Convert between data types using built-in functions.

::: tip Type Conversion Functions
| Function | Converts to | Example |
|----------|-------------|---------|
| `int()` | Integer | `int("42")` → `42` |
| `float()` | Float | `float("3.14")` → `3.14` |
| `str()` | String | `str(42)` → `"42"` |
| `bool()` | Boolean | `bool(1)` → `True` |
| `list()` | List | `list("abc")` → `['a', 'b', 'c']` |
:::

```python
# String to number
age_str = "25"
age_int = int(age_str)      # 25
price_str = "19.99"
price_float = float(price_str)  # 19.99

# Number to string
age = 25
age_str = str(age)          # "25"

# Float to int (truncates, doesn't round)
price = 19.99
price_int = int(price)      # 19

# Be careful with invalid conversions!
# int("hello")  # ValueError!
# int("3.14")   # ValueError! (use float first)
```

## Operators

### Arithmetic Operators

```python
# Basic math
a, b = 10, 3

print(a + b)    # 13  (addition)
print(a - b)    # 7   (subtraction)
print(a * b)    # 30  (multiplication)
print(a / b)    # 3.333... (division - always returns float)
print(a // b)   # 3   (floor division - rounds down)
print(a % b)    # 1   (modulus - remainder)
print(a ** b)   # 1000 (exponent - 10^3)
```

```
┌─────────────────────────────────────────────────────────────────┐
│                    Division Types                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   10 / 3  = 3.333...  (True division - always float)            │
│   10 // 3 = 3         (Floor division - rounds DOWN)            │
│   10 % 3  = 1         (Modulus - remainder only)                │
│                                                                  │
│   Negative floor division:                                       │
│   -10 // 3 = -4       (rounds toward negative infinity)         │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Comparison Operators

```python
a, b = 10, 5

print(a == b)   # False (equal)
print(a != b)   # True  (not equal)
print(a > b)    # True  (greater than)
print(a < b)    # False (less than)
print(a >= b)   # True  (greater or equal)
print(a <= b)   # False (less or equal)

# Chained comparisons (Python special!)
x = 5
print(1 < x < 10)  # True (same as: 1 < x and x < 10)
```

### Logical Operators

```python
a, b = True, False

print(a and b)  # False (both must be True)
print(a or b)   # True  (at least one True)
print(not a)    # False (opposite)

# Short-circuit evaluation
# Python stops evaluating as soon as result is known
x = 5
print(x > 0 and x < 10)  # True
print(x < 0 or x > 3)    # True (stops at x > 3)
```

### Assignment Operators

```python
x = 10

x += 5    # x = x + 5  → 15
x -= 3    # x = x - 3  → 12
x *= 2    # x = x * 2  → 24
x /= 4    # x = x / 4  → 6.0
x //= 2   # x = x // 2 → 3.0
x %= 2    # x = x % 2  → 1.0
x **= 3   # x = x ** 3 → 1.0
```

### Identity and Membership Operators

```python
# Identity: is, is not (checks if same object)
a = [1, 2, 3]
b = [1, 2, 3]
c = a

print(a == b)      # True (same values)
print(a is b)      # False (different objects)
print(a is c)      # True (same object)

# Membership: in, not in
fruits = ["apple", "banana", "cherry"]
print("apple" in fruits)      # True
print("mango" not in fruits)  # True

text = "Hello, World!"
print("World" in text)        # True
```

## User Input

```python
# Get input from user (always returns string)
name = input("What is your name? ")
print(f"Hello, {name}!")

# Convert input to number
age = int(input("How old are you? "))
print(f"In 10 years, you'll be {age + 10}")

# Handle potential errors
try:
    age = int(input("Enter your age: "))
except ValueError:
    print("Please enter a valid number!")
```

## Print Function

```python
# Basic print
print("Hello, World!")

# Multiple values
print("Name:", "Alice", "Age:", 25)

# Custom separator
print("a", "b", "c", sep="-")  # a-b-c

# Custom end character
print("Hello", end=" ")
print("World")  # Hello World (same line)

# Formatted output
name = "Alice"
age = 25
print(f"{name} is {age} years old")

# Padding and alignment
print(f"{name:>10}")   # Right align, width 10
print(f"{name:<10}")   # Left align, width 10
print(f"{name:^10}")   # Center, width 10
print(f"{age:05d}")    # Zero-padded: 00025
print(f"{3.14159:.2f}") # 2 decimal places: 3.14
```

## Common Mistakes

::: danger Avoid These Common Errors

### 1. Using `=` instead of `==`
```python
# ❌ WRONG - This assigns, not compares!
if x = 5:    # SyntaxError!
    print("x is 5")

# ✓ CORRECT
if x == 5:
    print("x is 5")
```

### 2. Forgetting Quotes for Strings
```python
# ❌ WRONG
name = Alice    # NameError: name 'Alice' is not defined

# ✓ CORRECT
name = "Alice"
```

### 3. Case Sensitivity
```python
# ❌ WRONG
Print("Hello")  # NameError
TRUE            # NameError
NONE            # NameError

# ✓ CORRECT
print("Hello")
True
None
```

### 4. Indentation Errors
```python
# ❌ WRONG
if True:
print("Hello")  # IndentationError

# ✓ CORRECT
if True:
    print("Hello")
```

### 5. Integer Division Confusion
```python
# Python 3 behavior
print(5 / 2)   # 2.5 (true division)
print(5 // 2)  # 2 (floor division)

# If you want integer result, use //
```
:::

## Python vs JavaScript

::: tip Coming from JavaScript?
| Feature | Python | JavaScript |
|---------|--------|------------|
| Variable declaration | `name = "Alice"` | `let name = "Alice"` |
| Constants | `MAX = 100` (convention) | `const MAX = 100` |
| Print | `print("Hello")` | `console.log("Hello")` |
| String format | `f"Hello {name}"` | `` `Hello ${name}` `` |
| Boolean | `True` / `False` | `true` / `false` |
| Null value | `None` | `null` / `undefined` |
| Type check | `type(x)` | `typeof x` |
| Comments | `# comment` | `// comment` |
| Equality | `==` (value) | `===` (strict) |
| List/Array | `[1, 2, 3]` | `[1, 2, 3]` |
| Dictionary/Object | `{"a": 1}` | `{a: 1}` |
:::

## Real-World Examples

### Example 1: User Profile
```python
# Creating a user profile
username = "john_doe"
email = "john@example.com"
age = 28
is_verified = True
account_balance = 1250.50

# Display profile
print("=" * 40)
print(f"{'USER PROFILE':^40}")
print("=" * 40)
print(f"Username:  {username}")
print(f"Email:     {email}")
print(f"Age:       {age}")
print(f"Verified:  {'Yes' if is_verified else 'No'}")
print(f"Balance:   ${account_balance:,.2f}")
print("=" * 40)
```

### Example 2: Shopping Cart Total
```python
# Calculate shopping cart
item1_price = 29.99
item1_qty = 2

item2_price = 15.50
item2_qty = 3

item3_price = 8.99
item3_qty = 1

# Calculate totals
subtotal = (item1_price * item1_qty +
            item2_price * item2_qty +
            item3_price * item3_qty)
tax_rate = 0.08
tax = subtotal * tax_rate
total = subtotal + tax

print(f"Subtotal: ${subtotal:.2f}")
print(f"Tax (8%): ${tax:.2f}")
print(f"Total:    ${total:.2f}")
```

### Example 3: BMI Calculator
```python
# Body Mass Index Calculator
weight_kg = float(input("Enter weight in kg: "))
height_m = float(input("Enter height in meters: "))

bmi = weight_kg / (height_m ** 2)

print(f"\nYour BMI: {bmi:.1f}")
print("Category: ", end="")

if bmi < 18.5:
    print("Underweight")
elif bmi < 25:
    print("Normal weight")
elif bmi < 30:
    print("Overweight")
else:
    print("Obese")
```

## Exercises

### Exercise 1: Personal Info
Create variables for your name, age, and favorite color, then print a sentence using them.

::: details Solution
```python
name = "Alice"
age = 25
favorite_color = "blue"

print(f"My name is {name}, I am {age} years old, and my favorite color is {favorite_color}.")
```
:::

### Exercise 2: Temperature Converter
Convert Celsius to Fahrenheit: F = C × 9/5 + 32

::: details Solution
```python
celsius = float(input("Enter temperature in Celsius: "))
fahrenheit = celsius * 9/5 + 32
print(f"{celsius}°C = {fahrenheit}°F")
```
:::

### Exercise 3: Simple Calculator
Get two numbers from the user and perform all basic operations.

::: details Solution
```python
num1 = float(input("Enter first number: "))
num2 = float(input("Enter second number: "))

print(f"{num1} + {num2} = {num1 + num2}")
print(f"{num1} - {num2} = {num1 - num2}")
print(f"{num1} × {num2} = {num1 * num2}")
if num2 != 0:
    print(f"{num1} ÷ {num2} = {num1 / num2}")
else:
    print("Cannot divide by zero!")
```
:::

### Exercise 4: Tip Calculator
Create a tip calculator that takes the bill amount and tip percentage.

::: details Solution
```python
bill = float(input("Enter bill amount: $"))
tip_percent = float(input("Enter tip percentage: "))

tip_amount = bill * (tip_percent / 100)
total = bill + tip_amount

print(f"\nBill:      ${bill:.2f}")
print(f"Tip ({tip_percent}%): ${tip_amount:.2f}")
print(f"Total:     ${total:.2f}")
```
:::

### Exercise 5: Time Converter
Convert seconds to hours, minutes, and seconds.

::: details Solution
```python
total_seconds = int(input("Enter total seconds: "))

hours = total_seconds // 3600
remaining = total_seconds % 3600
minutes = remaining // 60
seconds = remaining % 60

print(f"{total_seconds} seconds = {hours}h {minutes}m {seconds}s")
```
:::

### Exercise 6: Area Calculator
Calculate the area of different shapes based on user choice.

::: details Solution
```python
print("Area Calculator")
print("1. Circle")
print("2. Rectangle")
print("3. Triangle")

choice = input("Choose shape (1-3): ")

if choice == "1":
    radius = float(input("Enter radius: "))
    area = 3.14159 * radius ** 2
    print(f"Circle area: {area:.2f}")
elif choice == "2":
    length = float(input("Enter length: "))
    width = float(input("Enter width: "))
    area = length * width
    print(f"Rectangle area: {area:.2f}")
elif choice == "3":
    base = float(input("Enter base: "))
    height = float(input("Enter height: "))
    area = 0.5 * base * height
    print(f"Triangle area: {area:.2f}")
else:
    print("Invalid choice!")
```
:::

## Quick Reference

::: tip Python Basics Cheat Sheet
```python
# Variables
name = "Alice"         # String
age = 25               # Integer
price = 19.99          # Float
is_active = True       # Boolean
nothing = None         # None

# Type checking
type(variable)         # Get type
isinstance(x, int)     # Check type

# Type conversion
int("42")              # String to int
float("3.14")          # String to float
str(42)                # Number to string
bool(0)                # To boolean

# Operators
+ - * / // % **        # Arithmetic
== != < > <= >=        # Comparison
and or not             # Logical
is is not              # Identity
in not in              # Membership

# Input/Output
print("Hello")
name = input("Name: ")
```
:::

## Summary

| Concept | Description | Example |
|---------|-------------|---------|
| Variables | Named containers for data | `name = "Alice"` |
| Integers | Whole numbers | `age = 25` |
| Floats | Decimal numbers | `price = 19.99` |
| Strings | Text | `"Hello"` or `'Hello'` |
| Booleans | True or False | `is_active = True` |
| None | No value | `result = None` |
| f-strings | Formatted strings | `f"Hello, {name}"` |

## Next Steps

Continue to [Control Flow](/guide/python/02-control-flow) to learn about conditionals and loops.
