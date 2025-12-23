# Python Tutorial

::: info Official Documentation
This tutorial is based on Python official documentation. For the most up-to-date information, visit: [https://docs.python.org/3/](https://docs.python.org/3/)
:::

Welcome to the comprehensive Python tutorial! This guide will take you from beginner to advanced level.

## What is Python?

Python is a versatile, high-level programming language known for its simplicity and readability. It's used in web development, data science, AI/ML, automation, and much more.

```
┌─────────────────────────────────────────────────────────────────┐
│                    🐍 Why Python?                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   READABLE            VERSATILE           POWERFUL               │
│   ────────            ─────────           ────────               │
│                                                                  │
│   📖 Code reads      🌐 Web apps         🚀 Used by             │
│   like English       📊 Data Science     Google, Netflix,       │
│                      🤖 AI/ML            Instagram, Spotify     │
│   Easy to learn      🔧 Automation                              │
│   and understand     🎮 Game Dev         Large ecosystem        │
│                                          of libraries           │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### What Can Python Do?

| Use Case | Examples | Popular Libraries |
|----------|----------|-------------------|
| **Web Development** | APIs, websites | Django, Flask, FastAPI |
| **Data Science** | Analysis, visualization | Pandas, NumPy, Matplotlib |
| **Machine Learning** | AI models, predictions | TensorFlow, PyTorch, scikit-learn |
| **Automation** | Scripts, bots | Selenium, BeautifulSoup |
| **Desktop Apps** | GUI applications | Tkinter, PyQt |
| **DevOps** | Infrastructure, CI/CD | Ansible, Fabric |

### Simple Example

```python
# This is Python - simple and readable!
print("Hello, Python!")

# Variables are easy
name = "Alice"
age = 25

# No semicolons, no type declarations needed
if age >= 18:
    print(f"{name} is an adult")
else:
    print(f"{name} is a minor")

# Lists are powerful
fruits = ["apple", "banana", "cherry"]
for fruit in fruits:
    print(f"I like {fruit}")
```

## Tutorial Structure

This tutorial is organized into three levels to help you learn progressively:

### 🟢 Beginner Level (Start Here!)

| Lesson | Topic | What You'll Learn |
|--------|-------|-------------------|
| [01 - Basics](/guide/python/01-basics) | Variables & Data Types | How to store and work with information |
| [02 - Control Flow](/guide/python/02-control-flow) | Conditionals & Loops | How to make decisions and repeat actions |
| [03 - Functions](/guide/python/03-functions) | Functions & Scope | How to create reusable code blocks |

### 🟡 Intermediate Level

| Lesson | Topic | What You'll Learn |
|--------|-------|-------------------|
| [04 - Data Structures](/guide/python/04-data-structures) | Lists, Tuples, Dicts | How to work with collections of data |
| [05 - Strings](/guide/python/05-strings) | String Manipulation | How to work with text effectively |
| [06 - File I/O](/guide/python/06-file-io) | File Handling | How to read and write files |

### 🔴 Advanced Level

| Lesson | Topic | What You'll Learn |
|--------|-------|-------------------|
| [07 - Modules](/guide/python/07-modules) | Modules & Packages | How to organize and reuse code |
| [08 - OOP](/guide/python/08-oop) | Object-Oriented Programming | How to build with classes and objects |
| [09 - Exceptions](/guide/python/09-exceptions) | Error Handling | How to handle errors gracefully |
| [10 - Advanced](/guide/python/10-advanced) | Advanced Topics | Decorators, generators, and more |

## Getting Started

### Installing Python

::: code-group

```bash [Windows]
# Download from python.org or use winget
winget install Python.Python.3.12
```

```bash [macOS]
# Using Homebrew
brew install python@3.12
```

```bash [Linux]
# Ubuntu/Debian
sudo apt update
sudo apt install python3.12
```

:::

### Verify Installation

```bash
python --version
# or
python3 --version
```

### Running Python Code

```
┌─────────────────────────────────────────────────────────────────┐
│                  4 Ways to Run Python                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. INTERACTIVE MODE (REPL)                                      │
│     $ python                                                     │
│     >>> print("Hello")                                           │
│     Hello                                                        │
│                                                                  │
│  2. RUN A SCRIPT                                                 │
│     $ python my_script.py                                        │
│                                                                  │
│  3. IDE (VS Code, PyCharm)                                       │
│     Click "Run" or press F5                                      │
│                                                                  │
│  4. JUPYTER NOTEBOOK                                             │
│     Great for learning and data science                          │
│     $ jupyter notebook                                           │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Quick Reference

::: tip Python Cheat Sheet
```python
# Variables
name = "Python"        # String
age = 30               # Integer
price = 19.99          # Float
is_active = True       # Boolean

# Lists
items = [1, 2, 3]
items.append(4)

# Dictionary
person = {"name": "Alice", "age": 25}
print(person["name"])

# Functions
def greet(name):
    return f"Hello, {name}!"

# Conditionals
if age >= 18:
    print("Adult")
elif age >= 13:
    print("Teen")
else:
    print("Child")

# Loops
for i in range(5):
    print(i)

while count > 0:
    count -= 1
```
:::

## Python vs Other Languages

| Feature | Python | JavaScript | Java |
|---------|--------|------------|------|
| Typing | Dynamic | Dynamic | Static |
| Syntax | Clean, indented | Braces `{}` | Braces `{}` |
| Semicolons | Not required | Optional | Required |
| Learning curve | Easy | Medium | Steep |
| Use cases | General purpose | Web | Enterprise |

## Video Tutorials

::: tip Recommended Video Resources
Learn Python through these excellent video tutorials from the community.
:::

### Free Courses

| Course | Creator | Description |
|--------|---------|-------------|
| [Python Full Course](https://www.youtube.com/watch?v=rfscVS0vtbw) | freeCodeCamp | 4+ hour comprehensive course |
| [Python Tutorial for Beginners](https://www.youtube.com/watch?v=_uQrJ0TkZlc) | Programming with Mosh | 6-hour complete course |
| [Python Crash Course](https://www.youtube.com/watch?v=JJmcL1N2KQs) | Traversy Media | 1-hour crash course |
| [Python in 100 Seconds](https://www.youtube.com/watch?v=x7X9w_GIm1s) | Fireship | Quick 100-second explanation |

### Official Resources

| Resource | Description |
|----------|-------------|
| [Python.org Tutorial](https://docs.python.org/3/tutorial/) | Official Python tutorial |
| [Real Python](https://realpython.com/) | High-quality Python tutorials |

### Topic-Specific Videos

| Topic | Video | Duration |
|-------|-------|----------|
| OOP in Python | [Python OOP Tutorial](https://www.youtube.com/watch?v=JeznW_7DlB0) | ~1 hour |
| File Handling | [Python File I/O](https://www.youtube.com/watch?v=Uh2ebFW8OYM) | ~20 min |
| Web Scraping | [Python Web Scraping](https://www.youtube.com/watch?v=XVv6mJpFOb0) | ~1.5 hours |
| Data Analysis | [Pandas Tutorial](https://www.youtube.com/watch?v=vmEHCJofslg) | ~1 hour |

## Next Steps

Ready to start learning? Head to [Python Basics](/guide/python/01-basics) to begin your journey!

::: info Prerequisites
- No prior programming experience required
- Basic computer skills
- A text editor or IDE (VS Code recommended)
:::
