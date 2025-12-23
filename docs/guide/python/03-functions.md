# Functions

Functions are reusable blocks of code that perform specific tasks. They help organize code, reduce repetition, and make programs more readable.

::: info What You'll Learn
- Define and call functions
- Work with parameters and arguments
- Return values from functions
- Understand variable scope
- Use lambda functions
- Work with *args and **kwargs
:::

## What is a Function?

```
┌─────────────────────────────────────────────────────────────────┐
│                    Function Anatomy                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   def greet(name):              ← Function definition           │
│       """Say hello to someone"""  ← Docstring (documentation)   │
│       message = f"Hello, {name}!" ← Function body               │
│       return message              ← Return statement            │
│                                                                  │
│   result = greet("Alice")       ← Function call                 │
│   print(result)                 → Hello, Alice!                 │
│                                                                  │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │  INPUT        →    PROCESS      →      OUTPUT           │   │
│   │  "Alice"      →    greet()      →  "Hello, Alice!"      │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Defining Functions

### Basic Syntax

```python
# Simple function with no parameters
def say_hello():
    print("Hello, World!")

# Call the function
say_hello()  # Output: Hello, World!

# Function with parameters
def greet(name):
    print(f"Hello, {name}!")

greet("Alice")  # Output: Hello, Alice!
greet("Bob")    # Output: Hello, Bob!
```

### Docstrings

```python
def calculate_area(length, width):
    """
    Calculate the area of a rectangle.

    Args:
        length: The length of the rectangle
        width: The width of the rectangle

    Returns:
        The area of the rectangle

    Example:
        >>> calculate_area(5, 3)
        15
    """
    return length * width

# Access the docstring
print(calculate_area.__doc__)
help(calculate_area)
```

## Parameters and Arguments

```
┌─────────────────────────────────────────────────────────────────┐
│              Parameters vs Arguments                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   PARAMETERS: Variables in function definition                   │
│   ARGUMENTS:  Values passed when calling the function           │
│                                                                  │
│   def greet(name, greeting):     ← name, greeting = PARAMETERS  │
│       print(f"{greeting}, {name}!")                             │
│                                                                  │
│   greet("Alice", "Hello")        ← "Alice", "Hello" = ARGUMENTS │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Positional Arguments

```python
def describe_pet(animal, name):
    print(f"I have a {animal} named {name}")

# Order matters with positional arguments
describe_pet("dog", "Max")    # I have a dog named Max
describe_pet("Max", "dog")    # I have a Max named dog (wrong!)
```

### Keyword Arguments

```python
def describe_pet(animal, name):
    print(f"I have a {animal} named {name}")

# Order doesn't matter with keyword arguments
describe_pet(animal="dog", name="Max")  # I have a dog named Max
describe_pet(name="Max", animal="dog")  # I have a dog named Max

# Mix positional and keyword (positional must come first)
describe_pet("cat", name="Whiskers")    # I have a cat named Whiskers
```

### Default Parameters

```python
def greet(name, greeting="Hello"):
    print(f"{greeting}, {name}!")

greet("Alice")              # Hello, Alice!
greet("Bob", "Hi")          # Hi, Bob!
greet("Charlie", greeting="Hey")  # Hey, Charlie!

# Multiple defaults
def make_coffee(size="medium", milk=False, sugar=0):
    order = f"{size} coffee"
    if milk:
        order += " with milk"
    if sugar:
        order += f" and {sugar} sugar(s)"
    return order

print(make_coffee())                    # medium coffee
print(make_coffee("large", True, 2))    # large coffee with milk and 2 sugar(s)
print(make_coffee(sugar=1))             # medium coffee and 1 sugar(s)
```

::: warning Default Mutable Arguments
Never use mutable objects (lists, dicts) as default values!
```python
# ❌ BAD - The list is shared across all calls!
def add_item(item, items=[]):
    items.append(item)
    return items

print(add_item("a"))  # ['a']
print(add_item("b"))  # ['a', 'b'] - Unexpected!

# ✓ GOOD - Use None as default
def add_item(item, items=None):
    if items is None:
        items = []
    items.append(item)
    return items

print(add_item("a"))  # ['a']
print(add_item("b"))  # ['b'] - Correct!
```
:::

### *args - Variable Positional Arguments

```python
def sum_all(*numbers):
    """Accept any number of arguments"""
    total = 0
    for num in numbers:
        total += num
    return total

print(sum_all(1, 2))           # 3
print(sum_all(1, 2, 3, 4, 5))  # 15
print(sum_all())               # 0

# *args is a tuple
def show_args(*args):
    print(f"Type: {type(args)}")
    print(f"Values: {args}")

show_args(1, "hello", True)
# Type: <class 'tuple'>
# Values: (1, 'hello', True)
```

### **kwargs - Variable Keyword Arguments

```python
def print_info(**kwargs):
    """Accept any number of keyword arguments"""
    for key, value in kwargs.items():
        print(f"{key}: {value}")

print_info(name="Alice", age=25, city="NYC")
# name: Alice
# age: 25
# city: NYC

# **kwargs is a dictionary
def show_kwargs(**kwargs):
    print(f"Type: {type(kwargs)}")
    print(f"Values: {kwargs}")

show_kwargs(a=1, b=2)
# Type: <class 'dict'>
# Values: {'a': 1, 'b': 2}
```

### Combining All Parameter Types

```python
def complex_function(required, *args, default="value", **kwargs):
    print(f"Required: {required}")
    print(f"Args: {args}")
    print(f"Default: {default}")
    print(f"Kwargs: {kwargs}")

complex_function("must have", 1, 2, 3, default="custom", extra="data")
# Required: must have
# Args: (1, 2, 3)
# Default: custom
# Kwargs: {'extra': 'data'}
```

```
┌─────────────────────────────────────────────────────────────────┐
│                Parameter Order Rules                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   def func(positional, *args, keyword_only, **kwargs):          │
│            ──────────  ─────  ────────────  ────────            │
│                1         2          3           4               │
│                                                                  │
│   1. Regular positional parameters                              │
│   2. *args (catches extra positional args)                      │
│   3. Keyword-only parameters (after *args)                      │
│   4. **kwargs (catches extra keyword args)                      │
│                                                                  │
│   Example:                                                       │
│   def example(a, b, *args, c, d=10, **kwargs):                  │
│       pass                                                       │
│                                                                  │
│   example(1, 2, 3, 4, c=5, d=6, e=7, f=8)                       │
│   # a=1, b=2, args=(3,4), c=5, d=6, kwargs={'e':7, 'f':8}      │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Return Values

### Basic Return

```python
def add(a, b):
    return a + b

result = add(3, 5)
print(result)  # 8

# Without return, function returns None
def greet(name):
    print(f"Hello, {name}")

result = greet("Alice")  # Prints: Hello, Alice
print(result)            # None
```

### Multiple Return Values

```python
def get_min_max(numbers):
    return min(numbers), max(numbers)

# Returns a tuple
result = get_min_max([1, 5, 3, 9, 2])
print(result)  # (1, 9)

# Unpack directly
minimum, maximum = get_min_max([1, 5, 3, 9, 2])
print(f"Min: {minimum}, Max: {maximum}")  # Min: 1, Max: 9

# More complex example
def analyze_text(text):
    words = text.split()
    return {
        "char_count": len(text),
        "word_count": len(words),
        "avg_word_length": sum(len(w) for w in words) / len(words)
    }

stats = analyze_text("Hello World")
print(stats)  # {'char_count': 11, 'word_count': 2, 'avg_word_length': 5.0}
```

### Early Return

```python
def divide(a, b):
    if b == 0:
        return None  # Early return
    return a / b

print(divide(10, 2))  # 5.0
print(divide(10, 0))  # None

# Guard clauses
def process_user(user):
    if user is None:
        return "No user provided"
    if not user.get("active"):
        return "User is inactive"
    if user.get("age", 0) < 18:
        return "User is underage"

    # Main logic here
    return f"Processing {user['name']}"
```

## Variable Scope

```
┌─────────────────────────────────────────────────────────────────┐
│                    Variable Scope                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │  GLOBAL SCOPE                                            │   │
│   │  x = "global"                                            │   │
│   │                                                          │   │
│   │  ┌─────────────────────────────────────────────────┐    │   │
│   │  │  LOCAL SCOPE (function)                          │    │   │
│   │  │  y = "local"                                     │    │   │
│   │  │                                                  │    │   │
│   │  │  ┌─────────────────────────────────────────┐    │    │   │
│   │  │  │  ENCLOSED SCOPE (nested function)       │    │    │   │
│   │  │  │  z = "enclosed"                         │    │    │   │
│   │  │  └─────────────────────────────────────────┘    │    │   │
│   │  │                                                  │    │   │
│   │  └─────────────────────────────────────────────────┘    │   │
│   │                                                          │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│   LEGB Rule: Local → Enclosed → Global → Built-in               │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Local vs Global

```python
# Global variable
message = "Hello, Global!"

def greet():
    # Local variable (shadows global)
    message = "Hello, Local!"
    print(message)

greet()         # Hello, Local!
print(message)  # Hello, Global!
```

### The `global` Keyword

```python
counter = 0

def increment():
    global counter  # Access the global variable
    counter += 1

print(counter)  # 0
increment()
print(counter)  # 1
increment()
print(counter)  # 2
```

### The `nonlocal` Keyword

```python
def outer():
    count = 0

    def inner():
        nonlocal count  # Access the enclosing scope
        count += 1
        return count

    return inner

counter = outer()
print(counter())  # 1
print(counter())  # 2
print(counter())  # 3
```

::: tip Best Practices for Scope
| Practice | Description |
|----------|-------------|
| Minimize globals | Use function parameters instead |
| Don't shadow | Avoid using same names at different scopes |
| Use `global` sparingly | It makes code harder to understand |
| Prefer returns | Return values instead of modifying globals |
:::

## Lambda Functions

Lambda functions are small, anonymous functions defined in a single line.

```
┌─────────────────────────────────────────────────────────────────┐
│                    Lambda Syntax                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   lambda arguments: expression                                   │
│          ─────────  ──────────                                  │
│          inputs     single expression (automatically returned)  │
│                                                                  │
│   Regular function:          Lambda equivalent:                  │
│   def add(x, y):             add = lambda x, y: x + y           │
│       return x + y                                               │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Basic Lambda

```python
# Simple lambda
square = lambda x: x ** 2
print(square(5))  # 25

# Multiple arguments
add = lambda x, y: x + y
print(add(3, 5))  # 8

# With default values
greet = lambda name, greeting="Hello": f"{greeting}, {name}!"
print(greet("Alice"))       # Hello, Alice!
print(greet("Bob", "Hi"))   # Hi, Bob!
```

### Lambda with Built-in Functions

```python
# sorted() with key
students = [
    {"name": "Alice", "grade": 85},
    {"name": "Bob", "grade": 92},
    {"name": "Charlie", "grade": 78}
]

# Sort by grade
by_grade = sorted(students, key=lambda s: s["grade"])
print([s["name"] for s in by_grade])  # ['Charlie', 'Alice', 'Bob']

# Sort by grade (descending)
by_grade_desc = sorted(students, key=lambda s: s["grade"], reverse=True)
print([s["name"] for s in by_grade_desc])  # ['Bob', 'Alice', 'Charlie']

# filter()
numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
evens = list(filter(lambda x: x % 2 == 0, numbers))
print(evens)  # [2, 4, 6, 8, 10]

# map()
squares = list(map(lambda x: x ** 2, numbers))
print(squares)  # [1, 4, 9, 16, 25, 36, 49, 64, 81, 100]

# reduce() (from functools)
from functools import reduce
product = reduce(lambda x, y: x * y, [1, 2, 3, 4, 5])
print(product)  # 120
```

### When to Use Lambda

```python
# ✓ Good use: Short, one-time operations
points = [(1, 2), (3, 1), (5, 4)]
sorted_points = sorted(points, key=lambda p: p[1])

# ✗ Bad use: Complex logic
# Don't do this:
complex_lambda = lambda x: x if x > 0 else (-x if x < -10 else 0)

# Do this instead:
def process_number(x):
    if x > 0:
        return x
    elif x < -10:
        return -x
    else:
        return 0
```

## Higher-Order Functions

Functions that take other functions as arguments or return functions.

### Functions as Arguments

```python
def apply_operation(numbers, operation):
    """Apply an operation to each number"""
    return [operation(n) for n in numbers]

def double(x):
    return x * 2

def square(x):
    return x ** 2

numbers = [1, 2, 3, 4, 5]
print(apply_operation(numbers, double))  # [2, 4, 6, 8, 10]
print(apply_operation(numbers, square))  # [1, 4, 9, 16, 25]
```

### Functions Returning Functions

```python
def multiplier(factor):
    """Return a function that multiplies by factor"""
    def multiply(x):
        return x * factor
    return multiply

double = multiplier(2)
triple = multiplier(3)

print(double(5))  # 10
print(triple(5))  # 15

# Practical example: Creating formatters
def make_formatter(prefix, suffix):
    def formatter(text):
        return f"{prefix}{text}{suffix}"
    return formatter

html_bold = make_formatter("<b>", "</b>")
html_italic = make_formatter("<i>", "</i>")

print(html_bold("Hello"))    # <b>Hello</b>
print(html_italic("World"))  # <i>World</i>
```

## Built-in Functions

Python has many useful built-in functions:

| Function | Description | Example |
|----------|-------------|---------|
| `len()` | Length of object | `len([1,2,3])` → `3` |
| `range()` | Generate number sequence | `range(5)` → `0,1,2,3,4` |
| `sum()` | Sum of iterable | `sum([1,2,3])` → `6` |
| `min()` | Minimum value | `min([3,1,2])` → `1` |
| `max()` | Maximum value | `max([3,1,2])` → `3` |
| `abs()` | Absolute value | `abs(-5)` → `5` |
| `round()` | Round number | `round(3.7)` → `4` |
| `sorted()` | Sorted list | `sorted([3,1,2])` → `[1,2,3]` |
| `reversed()` | Reversed iterator | `list(reversed([1,2,3]))` → `[3,2,1]` |
| `enumerate()` | Index and value | `enumerate(['a','b'])` |
| `zip()` | Combine iterables | `zip([1,2], ['a','b'])` |
| `map()` | Apply function | `map(str, [1,2,3])` |
| `filter()` | Filter elements | `filter(bool, [0,1,2])` |
| `any()` | Any truthy | `any([False, True])` → `True` |
| `all()` | All truthy | `all([True, True])` → `True` |

```python
# Practical examples
numbers = [1, 2, 3, 4, 5]

# enumerate - get index and value
for i, num in enumerate(numbers):
    print(f"Index {i}: {num}")

# zip - combine lists
names = ["Alice", "Bob", "Charlie"]
ages = [25, 30, 35]
for name, age in zip(names, ages):
    print(f"{name} is {age}")

# any/all
values = [True, False, True]
print(any(values))  # True (at least one True)
print(all(values))  # False (not all True)
```

## Common Mistakes

::: danger Avoid These Common Errors

### 1. Mutable Default Arguments
```python
# ❌ WRONG - List is shared across calls!
def add_item(item, items=[]):
    items.append(item)
    return items

print(add_item("a"))  # ['a']
print(add_item("b"))  # ['a', 'b'] - Unexpected!

# ✓ CORRECT - Use None as default
def add_item(item, items=None):
    if items is None:
        items = []
    items.append(item)
    return items
```

### 2. Forgetting Return Statement
```python
# ❌ WRONG - Returns None implicitly
def add(a, b):
    result = a + b  # No return!

print(add(2, 3))  # None

# ✓ CORRECT
def add(a, b):
    return a + b
```

### 3. Modifying Global Variables
```python
# ❌ WRONG - UnboundLocalError
counter = 0
def increment():
    counter += 1  # Error!

# ✓ CORRECT - Use global keyword
def increment():
    global counter
    counter += 1

# ✓ BETTER - Avoid globals, use parameters
def increment(counter):
    return counter + 1
```

### 4. Wrong Argument Order
```python
# ❌ WRONG - Positional after keyword
def greet(name, greeting="Hello"):
    pass

greet(greeting="Hi", "Alice")  # SyntaxError!

# ✓ CORRECT
greet("Alice", greeting="Hi")
```

### 5. Not Handling All Cases
```python
# ❌ WRONG - May return None implicitly
def get_grade(score):
    if score >= 90:
        return "A"
    elif score >= 80:
        return "B"
    # What about other scores?

# ✓ CORRECT - Always return something
def get_grade(score):
    if score >= 90:
        return "A"
    elif score >= 80:
        return "B"
    elif score >= 70:
        return "C"
    else:
        return "F"
```
:::

## Python vs JavaScript

::: tip Coming from JavaScript?
| Feature | Python | JavaScript |
|---------|--------|------------|
| Define function | `def func():` | `function func() {` |
| Arrow function | `lambda x: x * 2` | `x => x * 2` |
| Default params | `def f(x=10):` | `function f(x = 10) {` |
| Rest params | `def f(*args):` | `function f(...args) {` |
| Spread | `f(*list)` | `f(...array)` |
| Return | `return value` | `return value` |
| No return | Returns `None` | Returns `undefined` |
| Docstring | `"""docs"""` | JSDoc comments |
| First-class | Yes | Yes |
| Closures | Yes | Yes |
:::

## Real-World Examples

### Example 1: User Registration
```python
def validate_username(username):
    """Validate username requirements."""
    if not username:
        return False, "Username is required"
    if len(username) < 3:
        return False, "Username must be at least 3 characters"
    if len(username) > 20:
        return False, "Username must be at most 20 characters"
    if not username.isalnum():
        return False, "Username can only contain letters and numbers"
    return True, "Valid username"

def validate_email(email):
    """Simple email validation."""
    if not email:
        return False, "Email is required"
    if "@" not in email or "." not in email:
        return False, "Invalid email format"
    return True, "Valid email"

def validate_password(password):
    """Validate password strength."""
    errors = []
    if len(password) < 8:
        errors.append("At least 8 characters")
    if not any(c.isupper() for c in password):
        errors.append("At least one uppercase letter")
    if not any(c.islower() for c in password):
        errors.append("At least one lowercase letter")
    if not any(c.isdigit() for c in password):
        errors.append("At least one number")

    if errors:
        return False, errors
    return True, "Strong password"

def register_user(username, email, password):
    """Register a new user with validation."""
    validations = [
        ("Username", *validate_username(username)),
        ("Email", *validate_email(email)),
        ("Password", *validate_password(password)),
    ]

    errors = []
    for field, is_valid, message in validations:
        if not is_valid:
            if isinstance(message, list):
                errors.extend([f"{field}: {m}" for m in message])
            else:
                errors.append(f"{field}: {message}")

    if errors:
        return {"success": False, "errors": errors}

    return {
        "success": True,
        "user": {"username": username, "email": email}
    }

# Test
result = register_user("jo", "invalid", "weak")
print(result)
```

### Example 2: Data Processing Pipeline
```python
def clean_data(data):
    """Remove None values and strip strings."""
    return [item.strip() if isinstance(item, str) else item
            for item in data if item is not None]

def transform_data(data, transformer):
    """Apply transformation to each item."""
    return [transformer(item) for item in data]

def filter_data(data, predicate):
    """Filter items based on predicate."""
    return [item for item in data if predicate(item)]

def aggregate_data(data, aggregator, initial=0):
    """Aggregate data using provided function."""
    result = initial
    for item in data:
        result = aggregator(result, item)
    return result

def process_pipeline(data, *operations):
    """Process data through multiple operations."""
    result = data
    for operation in operations:
        result = operation(result)
    return result

# Usage
raw_data = [" apple ", None, "  banana  ", "cherry", None, "  date  "]

result = process_pipeline(
    raw_data,
    clean_data,
    lambda d: transform_data(d, str.upper),
    lambda d: filter_data(d, lambda x: len(x) > 5),
)

print(result)  # ['BANANA', 'CHERRY']
```

### Example 3: API Response Handler
```python
def create_response(success, data=None, error=None, status_code=200):
    """Create a standardized API response."""
    response = {
        "success": success,
        "status_code": status_code,
        "data": data,
        "error": error
    }
    return response

def success_response(data, status_code=200):
    """Create a success response."""
    return create_response(True, data=data, status_code=status_code)

def error_response(message, status_code=400):
    """Create an error response."""
    return create_response(False, error=message, status_code=status_code)

def handle_request(handler):
    """Decorator to handle exceptions in request handlers."""
    def wrapper(*args, **kwargs):
        try:
            result = handler(*args, **kwargs)
            return success_response(result)
        except ValueError as e:
            return error_response(str(e), 400)
        except PermissionError as e:
            return error_response(str(e), 403)
        except Exception as e:
            return error_response("Internal server error", 500)
    return wrapper

@handle_request
def get_user(user_id):
    """Get user by ID."""
    if user_id <= 0:
        raise ValueError("Invalid user ID")
    # Simulate database lookup
    return {"id": user_id, "name": "Alice", "email": "alice@example.com"}

# Test
print(get_user(1))
print(get_user(-1))
```

## Exercises

### Exercise 1: Calculator Function

Create a calculator function that takes two numbers and an operator.

::: details Solution
```python
def calculator(a, b, operator="+"):
    """
    Perform calculation based on operator.

    Args:
        a: First number
        b: Second number
        operator: +, -, *, / (default: +)

    Returns:
        Result of the operation
    """
    operations = {
        "+": lambda x, y: x + y,
        "-": lambda x, y: x - y,
        "*": lambda x, y: x * y,
        "/": lambda x, y: x / y if y != 0 else "Error: Division by zero"
    }

    if operator not in operations:
        return f"Error: Unknown operator '{operator}'"

    return operations[operator](a, b)

# Test
print(calculator(10, 5, "+"))  # 15
print(calculator(10, 5, "-"))  # 5
print(calculator(10, 5, "*"))  # 50
print(calculator(10, 5, "/"))  # 2.0
print(calculator(10, 0, "/"))  # Error: Division by zero
```
:::

### Exercise 2: Word Counter

Create a function that analyzes text and returns word statistics.

::: details Solution
```python
def analyze_text(text):
    """
    Analyze text and return statistics.

    Args:
        text: String to analyze

    Returns:
        Dictionary with text statistics
    """
    if not text:
        return {"error": "Empty text"}

    words = text.split()
    word_lengths = [len(word) for word in words]

    return {
        "total_chars": len(text),
        "total_words": len(words),
        "unique_words": len(set(words.lower() for words in words)),
        "avg_word_length": round(sum(word_lengths) / len(words), 2),
        "longest_word": max(words, key=len),
        "shortest_word": min(words, key=len)
    }

# Test
text = "Python is a powerful programming language Python is also fun"
stats = analyze_text(text)
for key, value in stats.items():
    print(f"{key}: {value}")
```
:::

### Exercise 3: Decorator Function

Create a function that measures execution time of other functions.

::: details Solution
```python
import time

def timer(func):
    """Decorator to measure function execution time"""
    def wrapper(*args, **kwargs):
        start = time.time()
        result = func(*args, **kwargs)
        end = time.time()
        print(f"{func.__name__} took {end - start:.4f} seconds")
        return result
    return wrapper

# Using the decorator
@timer
def slow_function(n):
    """Simulate a slow operation"""
    total = 0
    for i in range(n):
        total += i ** 2
    return total

# Test
result = slow_function(1000000)
print(f"Result: {result}")
```
:::

## Quick Reference

::: tip Functions Cheat Sheet
```python
# Basic function
def greet(name):
    return f"Hello, {name}!"

# Default parameters
def greet(name, greeting="Hello"):
    return f"{greeting}, {name}!"

# *args (variable positional)
def sum_all(*numbers):
    return sum(numbers)

# **kwargs (variable keyword)
def print_info(**kwargs):
    for k, v in kwargs.items():
        print(f"{k}: {v}")

# Lambda
square = lambda x: x ** 2

# Multiple return
def min_max(nums):
    return min(nums), max(nums)

# Global variable
global counter

# Nonlocal (in nested function)
nonlocal count

# Docstring
def func():
    """Description of function"""
    pass
```
:::

## Summary

| Concept | Description | Example |
|---------|-------------|---------|
| Function | Reusable code block | `def greet(): pass` |
| Parameters | Variables in definition | `def add(a, b):` |
| Arguments | Values when calling | `add(3, 5)` |
| Default params | Preset values | `def f(x=10):` |
| *args | Variable positional | `def f(*args):` |
| **kwargs | Variable keyword | `def f(**kwargs):` |
| Return | Send value back | `return result` |
| Lambda | Anonymous function | `lambda x: x * 2` |
| Scope | Variable visibility | Local, Global, Enclosing |

## Next Steps

Continue to [Data Structures](/guide/python/04-data-structures) to learn about lists, tuples, and dictionaries.
