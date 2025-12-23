# Strings

Strings are sequences of characters used to store and manipulate text. Python provides powerful tools for working with strings.

::: info What You'll Learn
- Create and format strings
- Access and slice string characters
- Use string methods for manipulation
- Format output with f-strings
- Work with regular expressions basics
:::

## Creating Strings

```python
# Single and double quotes
single = 'Hello, World!'
double = "Hello, World!"

# Multi-line strings
multi = """This is a
multi-line
string"""

multi2 = '''Also works
with single
quotes'''

# Raw strings (ignore escape sequences)
path = r"C:\Users\name\Documents"
regex = r"\d+\.\d+"

# Escape sequences
newline = "Line 1\nLine 2"
tab = "Column1\tColumn2"
quote = "He said \"Hello\""
backslash = "Path\\to\\file"
```

```
┌─────────────────────────────────────────────────────────────────┐
│                    Common Escape Sequences                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   Sequence    Description         Example                        │
│   ────────    ───────────         ───────                        │
│   \n          Newline             "Line1\nLine2"                 │
│   \t          Tab                 "Col1\tCol2"                   │
│   \\          Backslash           "C:\\path"                     │
│   \'          Single quote        'It\'s'                        │
│   \"          Double quote        "Say \"Hi\""                   │
│   \r          Carriage return     "Text\rNew"                    │
│   \b          Backspace           "AB\bC" → "AC"                 │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## String Indexing and Slicing

```
┌─────────────────────────────────────────────────────────────────┐
│                    String Indexing                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   text = "Python"                                                │
│                                                                  │
│   Index:     0     1     2     3     4     5                    │
│              │     │     │     │     │     │                    │
│            ┌───┬───┬───┬───┬───┬───┐                           │
│            │ P │ y │ t │ h │ o │ n │                           │
│            └───┴───┴───┴───┴───┴───┘                           │
│              │     │     │     │     │     │                    │
│   Negative: -6    -5    -4    -3    -2    -1                    │
│                                                                  │
│   text[0]  → 'P'      text[-1] → 'n'                            │
│   text[1]  → 'y'      text[-2] → 'o'                            │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

```python
text = "Python Programming"

# Single character access
print(text[0])      # P
print(text[-1])     # g
print(text[7])      # P

# Slicing [start:end:step]
print(text[0:6])    # Python
print(text[:6])     # Python (start defaults to 0)
print(text[7:])     # Programming (end defaults to len)
print(text[::2])    # Pto rgamn (every 2nd char)
print(text[::-1])   # gnimmargorP nohtyP (reversed)

# Strings are immutable!
# text[0] = 'J'  # TypeError!
```

## String Methods

### Case Methods

```python
text = "Hello, World!"

print(text.upper())       # HELLO, WORLD!
print(text.lower())       # hello, world!
print(text.capitalize())  # Hello, world!
print(text.title())       # Hello, World!
print(text.swapcase())    # hELLO, wORLD!

# Case checking
print("HELLO".isupper())  # True
print("hello".islower())  # True
print("Title".istitle())  # True
```

### Search and Find

```python
text = "Hello, World! Hello, Python!"

# Find position (returns -1 if not found)
print(text.find("Hello"))      # 0
print(text.find("Python"))     # 21
print(text.find("Java"))       # -1
print(text.rfind("Hello"))     # 14 (from right)

# Index (raises ValueError if not found)
print(text.index("World"))     # 7
# print(text.index("Java"))    # ValueError!

# Count occurrences
print(text.count("Hello"))     # 2
print(text.count("o"))         # 4

# Check content
print(text.startswith("Hello"))  # True
print(text.endswith("!"))        # True
print("Python" in text)          # True
```

### Modification Methods

```python
text = "  Hello, World!  "

# Strip whitespace
print(text.strip())        # "Hello, World!"
print(text.lstrip())       # "Hello, World!  "
print(text.rstrip())       # "  Hello, World!"

# Strip specific characters
print("...Hello...".strip("."))  # "Hello"

# Replace
msg = "Hello, World!"
print(msg.replace("World", "Python"))  # Hello, Python!
print(msg.replace("l", "L", 1))        # HeLlo, World! (limit to 1)

# Split and join
csv = "apple,banana,cherry"
fruits = csv.split(",")        # ['apple', 'banana', 'cherry']
print("-".join(fruits))        # apple-banana-cherry

words = "Hello World Python"
print(words.split())           # ['Hello', 'World', 'Python']
print(words.split(" ", 1))     # ['Hello', 'World Python']

# Lines
multiline = "Line 1\nLine 2\nLine 3"
lines = multiline.splitlines()  # ['Line 1', 'Line 2', 'Line 3']
```

### Padding and Alignment

```python
text = "Python"

# Padding
print(text.center(20))      # "       Python       "
print(text.center(20, "-")) # "-------Python-------"
print(text.ljust(20))       # "Python              "
print(text.rjust(20))       # "              Python"
print(text.zfill(10))       # "0000Python"

# Number padding
num = "42"
print(num.zfill(5))         # "00042"
```

### Validation Methods

```python
# Check string content
print("Hello".isalpha())      # True (only letters)
print("123".isdigit())        # True (only digits)
print("Hello123".isalnum())   # True (letters or digits)
print("   ".isspace())        # True (only whitespace)
print("hello".islower())      # True
print("HELLO".isupper())      # True
print("Hello World".istitle())  # True

# Numeric strings
print("123".isnumeric())      # True
print("123.45".isnumeric())   # False (has decimal)
print("-123".isnumeric())     # False (has minus)

# Check if valid identifier
print("variable_name".isidentifier())  # True
print("2variable".isidentifier())      # False
```

### String Methods Reference

| Method | Description | Example |
|--------|-------------|---------|
| `upper()` | Convert to uppercase | `"hi".upper()` → `"HI"` |
| `lower()` | Convert to lowercase | `"HI".lower()` → `"hi"` |
| `strip()` | Remove whitespace | `" hi ".strip()` → `"hi"` |
| `split()` | Split into list | `"a,b".split(",")` → `['a','b']` |
| `join()` | Join iterable | `"-".join(['a','b'])` → `"a-b"` |
| `replace()` | Replace substring | `"hi".replace("i","o")` → `"ho"` |
| `find()` | Find position | `"hello".find("l")` → `2` |
| `count()` | Count occurrences | `"hello".count("l")` → `2` |
| `startswith()` | Check prefix | `"hi".startswith("h")` → `True` |
| `endswith()` | Check suffix | `"hi".endswith("i")` → `True` |

## String Formatting

### f-strings (Recommended)

```python
name = "Alice"
age = 25
price = 19.99

# Basic f-string
print(f"Hello, {name}!")           # Hello, Alice!
print(f"{name} is {age} years old") # Alice is 25 years old

# Expressions in f-strings
print(f"2 + 2 = {2 + 2}")          # 2 + 2 = 4
print(f"Next year: {age + 1}")     # Next year: 26

# Method calls
print(f"Name: {name.upper()}")     # Name: ALICE

# Format specifiers
print(f"Price: ${price:.2f}")      # Price: $19.99
print(f"Number: {42:05d}")         # Number: 00042
print(f"Binary: {10:b}")           # Binary: 1010
print(f"Hex: {255:x}")             # Hex: ff

# Alignment
print(f"{'left':<10}")             # "left      "
print(f"{'right':>10}")            # "     right"
print(f"{'center':^10}")           # "  center  "

# Thousand separators
print(f"{1000000:,}")              # 1,000,000
print(f"{1000000:_}")              # 1_000_000
```

### Format Specifiers

```
┌─────────────────────────────────────────────────────────────────┐
│                    Format Specifier Syntax                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   {value:[[fill]align][sign][#][0][width][,][.precision][type]} │
│                                                                  │
│   Examples:                                                      │
│   {x:10}      → width 10                                        │
│   {x:>10}     → right align, width 10                           │
│   {x:0>10}    → right align, fill with 0, width 10              │
│   {x:,.2f}    → comma separator, 2 decimal float                │
│   {x:+.2f}    → always show sign, 2 decimal float               │
│                                                                  │
│   Type codes:                                                    │
│   d = integer        s = string       b = binary                │
│   f = float          e = scientific   x = hex                   │
│   % = percentage     c = character                              │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

```python
# Number formatting
num = 42
pi = 3.14159

print(f"{num:d}")         # 42 (integer)
print(f"{num:5d}")        # "   42" (width 5)
print(f"{num:05d}")       # "00042" (zero-padded)
print(f"{num:+d}")        # +42 (show sign)

print(f"{pi:f}")          # 3.141590
print(f"{pi:.2f}")        # 3.14 (2 decimals)
print(f"{pi:10.2f}")      # "      3.14" (width 10, 2 decimals)

print(f"{0.75:.0%}")      # 75% (percentage)
print(f"{0.75:.2%}")      # 75.00%

print(f"{255:x}")         # ff (hexadecimal)
print(f"{255:X}")         # FF (uppercase hex)
print(f"{255:b}")         # 11111111 (binary)
print(f"{255:o}")         # 377 (octal)
```

### Other Formatting Methods

```python
# .format() method
print("Hello, {}!".format("World"))
print("{0} and {1}".format("spam", "eggs"))
print("{name} is {age}".format(name="Alice", age=25))

# % operator (old style)
print("Hello, %s!" % "World")
print("%s is %d years old" % ("Alice", 25))
print("Pi is %.2f" % 3.14159)

# Template strings
from string import Template
t = Template("$name is $age years old")
print(t.substitute(name="Alice", age=25))
```

## String Operations

### Concatenation and Repetition

```python
# Concatenation
first = "Hello"
second = "World"
combined = first + " " + second  # "Hello World"

# Repetition
line = "-" * 20    # "--------------------"
pattern = "ab" * 3  # "ababab"

# Building strings efficiently
parts = ["Hello", "World", "Python"]
result = " ".join(parts)  # "Hello World Python"

# Don't do this (inefficient):
s = ""
for word in parts:
    s += word + " "  # Creates new string each time!
```

### String Testing

```python
text = "Hello, World!"

# Length
print(len(text))              # 13

# Membership
print("World" in text)        # True
print("Python" not in text)   # True

# Comparison
print("apple" < "banana")     # True (alphabetical)
print("Apple" < "apple")      # True (uppercase first)
print("10" < "9")             # True (string comparison!)
print(int("10") < int("9"))   # False (numeric comparison)
```

## Working with Characters

```python
# Character code
print(ord('A'))        # 65
print(ord('a'))        # 97
print(ord('0'))        # 48

# Code to character
print(chr(65))         # 'A'
print(chr(97))         # 'a'
print(chr(9829))       # '♥'

# ASCII table range
for i in range(65, 91):
    print(chr(i), end=" ")  # A B C ... Z

# Unicode characters
print('\u00e9')        # é
print('\U0001F600')    # 😀
print('\N{SNOWMAN}')   # ☃
```

## Regular Expressions Basics

```python
import re

text = "Contact: john@email.com or jane@email.com"

# Search for pattern
match = re.search(r'\w+@\w+\.\w+', text)
if match:
    print(match.group())  # john@email.com

# Find all matches
emails = re.findall(r'\w+@\w+\.\w+', text)
print(emails)  # ['john@email.com', 'jane@email.com']

# Replace pattern
cleaned = re.sub(r'\w+@\w+\.\w+', '[EMAIL]', text)
print(cleaned)  # Contact: [EMAIL] or [EMAIL]

# Split by pattern
parts = re.split(r'[,;]\s*', "apple, banana; cherry")
print(parts)  # ['apple', 'banana', 'cherry']

# Common patterns
patterns = {
    r'\d+': 'One or more digits',
    r'\w+': 'One or more word characters',
    r'\s+': 'One or more whitespace',
    r'^...': 'Start of string',
    r'...$': 'End of string',
    r'[a-z]+': 'One or more lowercase letters',
    r'[A-Z]+': 'One or more uppercase letters',
}
```

## Exercises

### Exercise 1: Text Analyzer

Create a function that analyzes text statistics.

::: details Solution
```python
def analyze_text(text):
    """Analyze text and return statistics"""
    words = text.split()
    sentences = text.count('.') + text.count('!') + text.count('?')

    # Clean words for analysis
    clean_words = [w.strip('.,!?;:').lower() for w in words]

    return {
        "character_count": len(text),
        "word_count": len(words),
        "sentence_count": max(sentences, 1),
        "average_word_length": round(
            sum(len(w) for w in clean_words) / len(clean_words), 2
        ) if clean_words else 0,
        "unique_words": len(set(clean_words)),
        "longest_word": max(clean_words, key=len) if clean_words else "",
        "most_common": max(set(clean_words), key=clean_words.count) if clean_words else ""
    }

# Test
text = """Python is an amazing programming language.
Python is easy to learn. Many developers love Python!"""

stats = analyze_text(text)
for key, value in stats.items():
    print(f"{key}: {value}")
```
:::

### Exercise 2: String Formatter

Create a function that formats strings in various ways.

::: details Solution
```python
def format_text(text, style):
    """Format text according to style"""
    styles = {
        "upper": text.upper(),
        "lower": text.lower(),
        "title": text.title(),
        "capitalize": text.capitalize(),
        "reverse": text[::-1],
        "snake": text.lower().replace(" ", "_"),
        "kebab": text.lower().replace(" ", "-"),
        "camel": text[0].lower() + text.title().replace(" ", "")[1:],
        "pascal": text.title().replace(" ", ""),
    }

    return styles.get(style, f"Unknown style: {style}")

# Test
text = "hello world python"
for style in ["upper", "lower", "title", "snake", "kebab", "camel", "pascal"]:
    print(f"{style}: {format_text(text, style)}")
```
:::

### Exercise 3: Password Validator

Create a function that validates password strength.

::: details Solution
```python
def validate_password(password):
    """Validate password and return feedback"""
    checks = {
        "length": len(password) >= 8,
        "uppercase": any(c.isupper() for c in password),
        "lowercase": any(c.islower() for c in password),
        "digit": any(c.isdigit() for c in password),
        "special": any(c in "!@#$%^&*()_+-=" for c in password),
    }

    passed = sum(checks.values())
    strength = (
        "Very Weak" if passed <= 1 else
        "Weak" if passed <= 2 else
        "Medium" if passed <= 3 else
        "Strong" if passed <= 4 else
        "Very Strong"
    )

    feedback = []
    if not checks["length"]:
        feedback.append("Use at least 8 characters")
    if not checks["uppercase"]:
        feedback.append("Add uppercase letters")
    if not checks["lowercase"]:
        feedback.append("Add lowercase letters")
    if not checks["digit"]:
        feedback.append("Add numbers")
    if not checks["special"]:
        feedback.append("Add special characters (!@#$%^&*)")

    return {
        "valid": all(checks.values()),
        "strength": strength,
        "score": f"{passed}/5",
        "feedback": feedback
    }

# Test
passwords = ["password", "Password1", "P@ssw0rd!", "abc", "MyS3cur3P@ss!"]
for pwd in passwords:
    result = validate_password(pwd)
    print(f"\n{pwd}:")
    print(f"  Strength: {result['strength']} ({result['score']})")
    if result['feedback']:
        print(f"  Feedback: {', '.join(result['feedback'])}")
```
:::

## Quick Reference

::: tip Strings Cheat Sheet
```python
# Creating strings
s = "Hello"
s = 'Hello'
s = """Multi
line"""
s = r"raw\string"

# Access and slice
s[0]          # First character
s[-1]         # Last character
s[1:4]        # Slice
s[::-1]       # Reverse

# Common methods
s.upper()     # HELLO
s.lower()     # hello
s.strip()     # Remove whitespace
s.split()     # Split to list
"-".join(lst) # Join list
s.replace(old, new)
s.find(sub)   # Find index
s.count(sub)  # Count occurrences
s.startswith(prefix)
s.endswith(suffix)

# Formatting (f-strings)
f"Hello, {name}"
f"{num:05d}"      # Zero-padded
f"{price:.2f}"    # 2 decimals
f"{text:>10}"     # Right align
f"{num:,}"        # Thousands separator

# Checking
s.isalpha()   # Only letters
s.isdigit()   # Only digits
s.isalnum()   # Letters or digits
s.isspace()   # Only whitespace
"sub" in s    # Contains
```
:::

## Common Mistakes

### ❌ WRONG: Modifying strings directly

```python
# ❌ WRONG - Strings are immutable
text = "Hello"
text[0] = "J"  # TypeError!

# ✓ CORRECT - Create a new string
text = "Hello"
text = "J" + text[1:]  # "Jello"
# Or use replace
text = text.replace("H", "J")
```

### ❌ WRONG: Inefficient string concatenation

```python
# ❌ WRONG - Creates new string each iteration
result = ""
for word in ["Hello", "World", "Python"]:
    result += word + " "  # Slow for large lists

# ✓ CORRECT - Use join()
words = ["Hello", "World", "Python"]
result = " ".join(words)  # Much faster
```

### ❌ WRONG: Forgetting string methods return new strings

```python
# ❌ WRONG - Ignoring return value
text = "  hello  "
text.strip()  # Returns new string, doesn't modify original
print(text)   # Still "  hello  "

# ✓ CORRECT - Assign the result
text = "  hello  "
text = text.strip()
print(text)   # "hello"
```

### ❌ WRONG: Using + for complex string formatting

```python
# ❌ WRONG - Hard to read
name = "Alice"
age = 25
city = "NYC"
msg = "Name: " + name + ", Age: " + str(age) + ", City: " + city

# ✓ CORRECT - Use f-strings
msg = f"Name: {name}, Age: {age}, City: {city}"
```

### ❌ WRONG: Not handling encoding properly

```python
# ❌ WRONG - May fail with non-ASCII
with open("file.txt", "r") as f:
    content = f.read()  # UnicodeDecodeError possible

# ✓ CORRECT - Specify encoding
with open("file.txt", "r", encoding="utf-8") as f:
    content = f.read()
```

## Python vs JavaScript

| Operation | Python | JavaScript |
|-----------|--------|------------|
| Create string | `s = "hello"` or `s = 'hello'` | `let s = "hello"` or `let s = 'hello'` |
| Multi-line | `"""multi\nline"""` | `` `multi\nline` `` |
| String length | `len(s)` | `s.length` |
| Concatenate | `s1 + s2` or `f"{s1}{s2}"` | `s1 + s2` or `` `${s1}${s2}` `` |
| Uppercase | `s.upper()` | `s.toUpperCase()` |
| Lowercase | `s.lower()` | `s.toLowerCase()` |
| Find substring | `s.find("sub")` (returns -1) | `s.indexOf("sub")` (returns -1) |
| Contains | `"sub" in s` | `s.includes("sub")` |
| Split | `s.split(",")` | `s.split(",")` |
| Join | `",".join(list)` | `array.join(",")` |
| Replace | `s.replace("a", "b")` | `s.replace("a", "b")` |
| Replace all | `s.replace("a", "b")` (replaces all) | `s.replaceAll("a", "b")` |
| Strip/Trim | `s.strip()` | `s.trim()` |
| Starts with | `s.startswith("pre")` | `s.startsWith("pre")` |
| Ends with | `s.endswith("suf")` | `s.endsWith("suf")` |
| Slice | `s[1:4]` | `s.slice(1, 4)` |
| Character at | `s[0]` | `s[0]` or `s.charAt(0)` |
| Repeat | `s * 3` | `s.repeat(3)` |
| Format | `f"Hello {name}"` | `` `Hello ${name}` `` |

## Real-World Examples

### Example 1: URL Slug Generator

```python
import re

class SlugGenerator:
    """Generate URL-friendly slugs from text."""

    def __init__(self, max_length=50):
        self.max_length = max_length

    def generate(self, text):
        """Convert text to URL slug."""
        # Convert to lowercase
        slug = text.lower()

        # Replace accented characters
        replacements = {
            'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u',
            'ñ': 'n', 'ü': 'u', 'ä': 'a', 'ö': 'o'
        }
        for char, replacement in replacements.items():
            slug = slug.replace(char, replacement)

        # Remove special characters, keep alphanumeric and spaces
        slug = re.sub(r'[^a-z0-9\s-]', '', slug)

        # Replace spaces and multiple hyphens with single hyphen
        slug = re.sub(r'[\s_-]+', '-', slug)

        # Remove leading/trailing hyphens
        slug = slug.strip('-')

        # Truncate to max length without cutting words
        if len(slug) > self.max_length:
            slug = slug[:self.max_length].rsplit('-', 1)[0]

        return slug

    def generate_unique(self, text, existing_slugs):
        """Generate unique slug by adding number suffix if needed."""
        base_slug = self.generate(text)
        slug = base_slug
        counter = 1

        while slug in existing_slugs:
            slug = f"{base_slug}-{counter}"
            counter += 1

        return slug


# Usage
generator = SlugGenerator(max_length=30)

titles = [
    "Hello World! This is a Test",
    "Python Programming 101",
    "Café & Restaurant Guide",
    "Hello World! This is a Test"  # Duplicate
]

existing = set()
for title in titles:
    slug = generator.generate_unique(title, existing)
    existing.add(slug)
    print(f"{title[:30]:<30} → {slug}")

# Output:
# Hello World! This is a Test   → hello-world-this-is-a-test
# Python Programming 101        → python-programming-101
# Café & Restaurant Guide       → cafe-restaurant-guide
# Hello World! This is a Test   → hello-world-this-is-a-test-1
```

### Example 2: Log Message Parser

```python
import re
from datetime import datetime
from dataclasses import dataclass
from typing import Optional, List

@dataclass
class LogEntry:
    timestamp: datetime
    level: str
    message: str
    source: Optional[str] = None

    def __str__(self):
        return f"[{self.timestamp}] {self.level}: {self.message}"


class LogParser:
    """Parse log messages with various formats."""

    # Common log format patterns
    PATTERNS = {
        'standard': r'\[(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})\] \[(\w+)\] (.+)',
        'simple': r'(\w+): (.+)',
        'with_source': r'\[(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})\] \[(\w+)\] \[(\w+)\] (.+)'
    }

    def parse_line(self, line: str) -> Optional[LogEntry]:
        """Parse a single log line."""
        line = line.strip()

        # Try with source pattern first
        match = re.match(self.PATTERNS['with_source'], line)
        if match:
            return LogEntry(
                timestamp=datetime.strptime(match.group(1), "%Y-%m-%d %H:%M:%S"),
                level=match.group(2),
                source=match.group(3),
                message=match.group(4)
            )

        # Try standard pattern
        match = re.match(self.PATTERNS['standard'], line)
        if match:
            return LogEntry(
                timestamp=datetime.strptime(match.group(1), "%Y-%m-%d %H:%M:%S"),
                level=match.group(2),
                message=match.group(3)
            )

        return None

    def parse_file(self, content: str) -> List[LogEntry]:
        """Parse multiple log lines."""
        entries = []
        for line in content.splitlines():
            entry = self.parse_line(line)
            if entry:
                entries.append(entry)
        return entries

    def filter_by_level(self, entries: List[LogEntry], level: str) -> List[LogEntry]:
        """Filter entries by log level."""
        return [e for e in entries if e.level.upper() == level.upper()]

    def search(self, entries: List[LogEntry], keyword: str) -> List[LogEntry]:
        """Search entries for keyword."""
        keyword = keyword.lower()
        return [e for e in entries if keyword in e.message.lower()]


# Usage
log_content = """
[2024-01-15 10:30:00] [INFO] Application started
[2024-01-15 10:30:05] [DEBUG] Loading configuration from config.json
[2024-01-15 10:30:10] [INFO] [Database] Connected to PostgreSQL
[2024-01-15 10:30:15] [WARNING] High memory usage detected: 85%
[2024-01-15 10:30:20] [ERROR] Failed to process request: timeout
[2024-01-15 10:30:25] [INFO] Request completed successfully
"""

parser = LogParser()
entries = parser.parse_file(log_content)

print("All entries:")
for entry in entries:
    print(f"  {entry}")

print("\nErrors only:")
errors = parser.filter_by_level(entries, "ERROR")
for entry in errors:
    print(f"  {entry}")

print("\nSearch 'database':")
db_entries = parser.search(entries, "database")
for entry in db_entries:
    print(f"  {entry}")
```

### Example 3: Template Engine

```python
import re
from typing import Dict, Any, Callable

class SimpleTemplateEngine:
    """A simple template engine with variable substitution and filters."""

    def __init__(self):
        self.filters: Dict[str, Callable] = {
            'upper': str.upper,
            'lower': str.lower,
            'title': str.title,
            'strip': str.strip,
            'capitalize': str.capitalize,
            'reverse': lambda s: s[::-1],
            'length': lambda s: str(len(s)),
            'default': lambda s, default='': s if s else default,
        }

    def add_filter(self, name: str, func: Callable):
        """Add a custom filter."""
        self.filters[name] = func

    def render(self, template: str, context: Dict[str, Any]) -> str:
        """Render template with given context."""
        result = template

        # Handle conditional blocks: {% if var %}...{% endif %}
        result = self._process_conditionals(result, context)

        # Handle loops: {% for item in items %}...{% endfor %}
        result = self._process_loops(result, context)

        # Handle variable substitution: {{ var }} or {{ var|filter }}
        result = self._process_variables(result, context)

        return result

    def _process_variables(self, template: str, context: Dict[str, Any]) -> str:
        """Process variable substitutions."""
        pattern = r'\{\{\s*(\w+)(?:\|(\w+)(?::([^}]+))?)?\s*\}\}'

        def replace(match):
            var_name = match.group(1)
            filter_name = match.group(2)
            filter_arg = match.group(3)

            value = str(context.get(var_name, ''))

            if filter_name and filter_name in self.filters:
                if filter_arg:
                    value = self.filters[filter_name](value, filter_arg)
                else:
                    value = self.filters[filter_name](value)

            return value

        return re.sub(pattern, replace, template)

    def _process_conditionals(self, template: str, context: Dict[str, Any]) -> str:
        """Process conditional blocks."""
        pattern = r'\{%\s*if\s+(\w+)\s*%\}(.*?)\{%\s*endif\s*%\}'

        def replace(match):
            var_name = match.group(1)
            content = match.group(2)

            if context.get(var_name):
                return content
            return ''

        return re.sub(pattern, replace, template, flags=re.DOTALL)

    def _process_loops(self, template: str, context: Dict[str, Any]) -> str:
        """Process loop blocks."""
        pattern = r'\{%\s*for\s+(\w+)\s+in\s+(\w+)\s*%\}(.*?)\{%\s*endfor\s*%\}'

        def replace(match):
            item_name = match.group(1)
            list_name = match.group(2)
            content = match.group(3)

            items = context.get(list_name, [])
            result = []

            for item in items:
                item_context = {**context, item_name: item}
                result.append(self._process_variables(content, item_context))

            return ''.join(result)

        return re.sub(pattern, replace, template, flags=re.DOTALL)


# Usage
engine = SimpleTemplateEngine()

# Add custom filter
engine.add_filter('truncate', lambda s, length='10': s[:int(length)] + '...' if len(s) > int(length) else s)

template = """
Hello, {{ name|title }}!

{% if is_premium %}
You are a PREMIUM member!
{% endif %}

Your items:
{% for item in items %}- {{ item|upper }}
{% endfor %}

Contact: {{ email|default:N/A }}
Bio: {{ bio|truncate:20 }}
"""

context = {
    'name': 'john doe',
    'is_premium': True,
    'items': ['apple', 'banana', 'cherry'],
    'email': '',
    'bio': 'This is a long biography that should be truncated'
}

result = engine.render(template, context)
print(result)
```

## Additional Exercises

### Exercise 4: Email Template Generator

Create a function that generates personalized email templates.

::: details Solution
```python
def generate_email(template, recipients):
    """
    Generate personalized emails from template.

    Template placeholders: {name}, {company}, {product}, etc.
    """
    emails = []

    for recipient in recipients:
        email = template
        for key, value in recipient.items():
            placeholder = "{" + key + "}"
            email = email.replace(placeholder, str(value))

        # Check for unreplaced placeholders
        import re
        missing = re.findall(r'\{(\w+)\}', email)
        if missing:
            print(f"Warning: Missing values for {recipient.get('name', 'unknown')}: {missing}")

        emails.append({
            'to': recipient.get('email', ''),
            'subject': f"Hello {recipient.get('name', 'Customer')}",
            'body': email
        })

    return emails


# Test
template = """
Dear {name},

Thank you for your interest in {product}!

As a {membership} member, you're eligible for a {discount}% discount.

Best regards,
{company} Team
"""

recipients = [
    {'name': 'Alice', 'email': 'alice@email.com', 'product': 'Python Course',
     'membership': 'Gold', 'discount': 20, 'company': 'TechCorp'},
    {'name': 'Bob', 'email': 'bob@email.com', 'product': 'JavaScript Course',
     'membership': 'Silver', 'discount': 10, 'company': 'TechCorp'},
]

emails = generate_email(template, recipients)
for email in emails:
    print(f"To: {email['to']}")
    print(f"Subject: {email['subject']}")
    print(f"Body:\n{email['body']}")
    print("-" * 40)
```
:::

### Exercise 5: Markdown Parser

Create a simple markdown to HTML converter.

::: details Solution
```python
import re

def markdown_to_html(markdown):
    """Convert basic markdown to HTML."""
    html = markdown

    # Headers
    html = re.sub(r'^### (.+)$', r'<h3>\1</h3>', html, flags=re.MULTILINE)
    html = re.sub(r'^## (.+)$', r'<h2>\1</h2>', html, flags=re.MULTILINE)
    html = re.sub(r'^# (.+)$', r'<h1>\1</h1>', html, flags=re.MULTILINE)

    # Bold and italic
    html = re.sub(r'\*\*\*(.+?)\*\*\*', r'<strong><em>\1</em></strong>', html)
    html = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', html)
    html = re.sub(r'\*(.+?)\*', r'<em>\1</em>', html)

    # Code blocks
    html = re.sub(r'```(\w+)?\n(.*?)```',
                  r'<pre><code class="\1">\2</code></pre>',
                  html, flags=re.DOTALL)

    # Inline code
    html = re.sub(r'`([^`]+)`', r'<code>\1</code>', html)

    # Links
    html = re.sub(r'\[([^\]]+)\]\(([^\)]+)\)', r'<a href="\2">\1</a>', html)

    # Images
    html = re.sub(r'!\[([^\]]*)\]\(([^\)]+)\)', r'<img src="\2" alt="\1">', html)

    # Unordered lists
    def process_ul(match):
        items = match.group(0).strip().split('\n')
        items_html = '\n'.join(f'<li>{item[2:]}</li>' for item in items)
        return f'<ul>\n{items_html}\n</ul>'

    html = re.sub(r'(^- .+$\n?)+', process_ul, html, flags=re.MULTILINE)

    # Paragraphs (simple approach)
    lines = html.split('\n\n')
    processed = []
    for line in lines:
        if not line.startswith('<'):
            processed.append(f'<p>{line}</p>')
        else:
            processed.append(line)
    html = '\n\n'.join(processed)

    return html


# Test
markdown = """
# Welcome to Python

This is a **bold** statement with *italic* text.

## Features

- Easy to learn
- Powerful libraries
- Great community

### Code Example

```python
def hello():
    print("Hello, World!")
```

Use `print()` to output text.

Visit [Python.org](https://python.org) for more info.

![Python Logo](https://python.org/logo.png)
"""

html = markdown_to_html(markdown)
print(html)
```
:::

### Exercise 6: CSV to JSON Converter

Create a function that converts CSV data to JSON format.

::: details Solution
```python
import json
from typing import List, Dict, Any

def csv_to_json(csv_string: str,
                delimiter: str = ',',
                has_header: bool = True,
                type_inference: bool = True) -> List[Dict[str, Any]]:
    """
    Convert CSV string to list of dictionaries (JSON-like structure).

    Args:
        csv_string: CSV data as string
        delimiter: Field delimiter
        has_header: Whether first row is header
        type_inference: Attempt to convert types (int, float, bool)
    """
    lines = csv_string.strip().split('\n')

    if not lines:
        return []

    def parse_value(value: str) -> Any:
        """Attempt to parse value to appropriate type."""
        value = value.strip()

        if not type_inference:
            return value

        # Try boolean
        if value.lower() in ('true', 'yes'):
            return True
        if value.lower() in ('false', 'no'):
            return False

        # Try integer
        try:
            return int(value)
        except ValueError:
            pass

        # Try float
        try:
            return float(value)
        except ValueError:
            pass

        # Return as string
        return value

    def parse_line(line: str) -> List[str]:
        """Parse CSV line handling quoted fields."""
        result = []
        current = ''
        in_quotes = False

        for char in line:
            if char == '"':
                in_quotes = not in_quotes
            elif char == delimiter and not in_quotes:
                result.append(current.strip())
                current = ''
            else:
                current += char

        result.append(current.strip())
        return result

    # Parse all lines
    rows = [parse_line(line) for line in lines]

    if has_header:
        headers = rows[0]
        data_rows = rows[1:]
    else:
        # Generate column names
        headers = [f'column_{i}' for i in range(len(rows[0]))]
        data_rows = rows

    # Convert to list of dictionaries
    result = []
    for row in data_rows:
        if len(row) != len(headers):
            continue  # Skip malformed rows

        record = {}
        for header, value in zip(headers, row):
            record[header] = parse_value(value)
        result.append(record)

    return result


def json_to_csv(data: List[Dict], delimiter: str = ',') -> str:
    """Convert list of dictionaries to CSV string."""
    if not data:
        return ''

    # Get all unique headers
    headers = []
    for record in data:
        for key in record.keys():
            if key not in headers:
                headers.append(key)

    lines = [delimiter.join(headers)]

    for record in data:
        values = []
        for header in headers:
            value = str(record.get(header, ''))
            # Quote if contains delimiter or quotes
            if delimiter in value or '"' in value:
                value = '"' + value.replace('"', '""') + '"'
            values.append(value)
        lines.append(delimiter.join(values))

    return '\n'.join(lines)


# Test
csv_data = """name,age,city,is_active
Alice,25,New York,true
Bob,30,Los Angeles,false
Charlie,35,Chicago,yes
"Smith, John",28,"San Francisco",true
"""

# Convert CSV to JSON
json_data = csv_to_json(csv_data)
print("CSV to JSON:")
print(json.dumps(json_data, indent=2))

# Convert back to CSV
csv_output = json_to_csv(json_data)
print("\nJSON to CSV:")
print(csv_output)
```
:::

## Summary

| Operation | Method/Syntax | Example |
|-----------|---------------|---------|
| Create | `"text"` or `'text'` | `s = "Hello"` |
| Index | `s[i]` | `s[0]` → first char |
| Slice | `s[start:end]` | `s[1:4]` |
| Length | `len(s)` | `len("Hi")` → 2 |
| Concatenate | `+` | `"a" + "b"` → `"ab"` |
| Repeat | `*` | `"ab" * 3` → `"ababab"` |
| Format | f-string | `f"{name}"` |
| Search | `in`, `find()` | `"a" in s` |
| Replace | `replace()` | `s.replace("a", "b")` |

## Next Steps

Continue to [File I/O](/guide/python/06-file-io) to learn how to read and write files in Python.
