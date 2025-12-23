# Exception Handling

Exceptions are errors that occur during program execution. Python provides a robust system for handling these errors gracefully, preventing program crashes and providing meaningful feedback.

::: info What You'll Learn
- Understand what exceptions are
- Handle exceptions with try/except
- Use finally and else clauses
- Raise custom exceptions
- Create exception hierarchies
- Best practices for error handling
:::

## What are Exceptions?

```
┌─────────────────────────────────────────────────────────────────┐
│                    Exception Flow                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   Normal Execution          With Exception                       │
│   ─────────────────         ──────────────                       │
│                                                                  │
│   def divide(a, b):         def divide(a, b):                   │
│       result = a / b            try:                            │
│       return result                 result = a / b              │
│                                     return result               │
│   divide(10, 0)                 except ZeroDivisionError:       │
│        ↓                            return "Cannot divide by 0" │
│   💥 CRASH!                                                      │
│   ZeroDivisionError         divide(10, 0)                       │
│                                  ↓                               │
│                             "Cannot divide by 0"                │
│                             ✓ Program continues                  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Common Built-in Exceptions

| Exception | Description | Example |
|-----------|-------------|---------|
| `ValueError` | Invalid value | `int("abc")` |
| `TypeError` | Wrong type | `"2" + 2` |
| `IndexError` | Index out of range | `list[10]` |
| `KeyError` | Key not in dict | `dict["missing"]` |
| `FileNotFoundError` | File doesn't exist | `open("none.txt")` |
| `ZeroDivisionError` | Division by zero | `1 / 0` |
| `AttributeError` | Missing attribute | `"str".missing()` |
| `ImportError` | Import fails | `import nonexistent` |
| `NameError` | Variable not defined | `print(undefined)` |
| `StopIteration` | Iterator exhausted | `next(empty_iter)` |

```python
# Examples of common exceptions
int("hello")           # ValueError
"2" + 2                # TypeError
[1, 2, 3][10]          # IndexError
{"a": 1}["b"]          # KeyError
1 / 0                  # ZeroDivisionError
open("nonexistent.txt")  # FileNotFoundError
```

## Basic Exception Handling

### try/except

```python
# Basic try/except
try:
    result = 10 / 0
except ZeroDivisionError:
    print("Cannot divide by zero!")

# Catch multiple specific exceptions
try:
    value = int(input("Enter a number: "))
    result = 10 / value
except ValueError:
    print("Please enter a valid number!")
except ZeroDivisionError:
    print("Cannot divide by zero!")

# Catch multiple exceptions in one handler
try:
    # Some risky code
    pass
except (ValueError, TypeError) as e:
    print(f"Error: {e}")

# Catch any exception (use sparingly!)
try:
    # Some code
    pass
except Exception as e:
    print(f"An error occurred: {e}")
```

### Accessing Exception Information

```python
try:
    x = 1 / 0
except ZeroDivisionError as e:
    print(f"Error type: {type(e).__name__}")
    print(f"Error message: {e}")
    print(f"Error args: {e.args}")

# Output:
# Error type: ZeroDivisionError
# Error message: division by zero
# Error args: ('division by zero',)

# Getting full traceback
import traceback

try:
    x = 1 / 0
except ZeroDivisionError:
    traceback.print_exc()
    # Or get as string:
    tb_str = traceback.format_exc()
```

### else and finally

```python
def read_file(filename):
    try:
        file = open(filename, "r")
    except FileNotFoundError:
        print(f"File '{filename}' not found")
        return None
    else:
        # Runs only if no exception occurred
        content = file.read()
        print("File read successfully!")
        return content
    finally:
        # Always runs, even if exception occurred
        print("Cleanup: closing resources")
        try:
            file.close()
        except:
            pass

# The flow:
# try → except (if error) → finally
# try → else (if no error) → finally
```

```
┌─────────────────────────────────────────────────────────────────┐
│                try/except/else/finally Flow                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   try:                                                           │
│       risky_operation()                                          │
│           │                                                      │
│           ├── Exception? ──► except:                             │
│           │                      handle_error()                  │
│           │                          │                           │
│           └── No Exception? ──► else:                            │
│                                     success_code()               │
│                                         │                        │
│                                         ▼                        │
│                                     finally:                     │
│                                         cleanup()                │
│                                         │                        │
│                                         ▼                        │
│                                     Continue...                  │
│                                                                  │
│   Note: finally ALWAYS runs (even with return or break)         │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### finally Guarantees

```python
def demo_finally():
    try:
        print("In try")
        return "from try"
    finally:
        print("Finally runs!")  # This ALWAYS runs!

result = demo_finally()
# Output:
# In try
# Finally runs!
# result = "from try"

# finally runs even with exceptions
def demo_finally_exception():
    try:
        raise ValueError("error")
    finally:
        print("Finally still runs!")
```

## Raising Exceptions

### raise Statement

```python
# Raise built-in exception
def divide(a, b):
    if b == 0:
        raise ZeroDivisionError("Cannot divide by zero")
    return a / b

# Raise with custom message
def validate_age(age):
    if age < 0:
        raise ValueError(f"Age cannot be negative: {age}")
    if age > 150:
        raise ValueError(f"Age seems unrealistic: {age}")
    return age

# Re-raise current exception
try:
    value = int("invalid")
except ValueError:
    print("Logging error...")
    raise  # Re-raises the caught exception
```

### Exception Chaining

```python
# Chain exceptions to show cause
def fetch_data(url):
    try:
        # Simulate network error
        raise ConnectionError("Network unavailable")
    except ConnectionError as e:
        raise RuntimeError("Failed to fetch data") from e

try:
    fetch_data("http://example.com")
except RuntimeError as e:
    print(f"Error: {e}")
    print(f"Caused by: {e.__cause__}")

# Suppress original exception
try:
    raise ValueError("original")
except ValueError:
    raise TypeError("new") from None
```

## Custom Exceptions

### Creating Custom Exceptions

```python
# Simple custom exception
class CustomError(Exception):
    """Base exception for our application."""
    pass

# With custom attributes
class ValidationError(Exception):
    """Raised when validation fails."""

    def __init__(self, message, field=None, value=None):
        self.message = message
        self.field = field
        self.value = value
        super().__init__(self.message)

    def __str__(self):
        if self.field:
            return f"{self.field}: {self.message} (got: {self.value})"
        return self.message


# Using custom exception
def validate_email(email):
    if "@" not in email:
        raise ValidationError(
            "Invalid email format",
            field="email",
            value=email
        )
    return email

try:
    validate_email("invalid-email")
except ValidationError as e:
    print(e)  # email: Invalid email format (got: invalid-email)
```

### Exception Hierarchy

```python
# Create exception hierarchy
class AppError(Exception):
    """Base exception for the application."""
    pass

class DatabaseError(AppError):
    """Database-related errors."""
    pass

class ConnectionError(DatabaseError):
    """Database connection errors."""
    pass

class QueryError(DatabaseError):
    """Query execution errors."""
    pass

class ValidationError(AppError):
    """Data validation errors."""
    pass

class AuthenticationError(AppError):
    """Authentication failures."""
    pass


# Catching at different levels
try:
    raise QueryError("Invalid SQL syntax")
except ConnectionError:
    print("Connection issue")
except DatabaseError:
    print("Database issue")  # This catches QueryError
except AppError:
    print("Application error")
```

```
┌─────────────────────────────────────────────────────────────────┐
│                Exception Hierarchy Example                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│                       Exception                                  │
│                           │                                      │
│                       AppError                                   │
│                      /    |    \                                │
│                     /     |     \                               │
│          DatabaseError  ValidationError  AuthenticationError    │
│            /      \                                             │
│           /        \                                            │
│   ConnectionError  QueryError                                    │
│                                                                  │
│   except DatabaseError:  # Catches ConnectionError & QueryError │
│   except AppError:       # Catches all custom exceptions        │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Context Managers and Exceptions

### Using with Statement

```python
# with statement handles cleanup automatically
with open("file.txt", "r") as f:
    content = f.read()
# File is closed even if exception occurs

# Multiple context managers
with open("input.txt") as infile, open("output.txt", "w") as outfile:
    outfile.write(infile.read())

# Custom context manager
class ManagedResource:
    def __enter__(self):
        print("Acquiring resource")
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        print("Releasing resource")
        if exc_type is not None:
            print(f"Exception occurred: {exc_val}")
        return False  # Don't suppress exceptions

with ManagedResource() as resource:
    print("Using resource")
    # raise ValueError("test")  # Would be handled by __exit__
```

### contextlib Module

```python
from contextlib import contextmanager

@contextmanager
def managed_file(filename, mode):
    """Context manager for file handling."""
    try:
        f = open(filename, mode)
        yield f
    finally:
        f.close()

with managed_file("test.txt", "w") as f:
    f.write("Hello!")

# Suppress specific exceptions
from contextlib import suppress

with suppress(FileNotFoundError):
    os.remove("nonexistent.txt")
# No error raised, continues normally
```

## Best Practices

### Do's and Don'ts

```python
# ❌ DON'T: Catch all exceptions blindly
try:
    do_something()
except:
    pass  # Silently ignoring ALL errors

# ✓ DO: Catch specific exceptions
try:
    do_something()
except ValueError as e:
    logger.error(f"Invalid value: {e}")
    raise

# ❌ DON'T: Use exceptions for flow control
try:
    value = my_dict[key]
except KeyError:
    value = default

# ✓ DO: Use EAFP (Easier to Ask for Forgiveness)
value = my_dict.get(key, default)

# ❌ DON'T: Catch and re-raise without context
try:
    process_data()
except Exception:
    raise Exception("Failed")  # Lost original error

# ✓ DO: Chain exceptions
try:
    process_data()
except Exception as e:
    raise ProcessingError("Failed to process") from e
```

### EAFP vs LBYL

```python
# LBYL: Look Before You Leap
# Check conditions before acting
def get_value_lbyl(dictionary, key):
    if key in dictionary:
        return dictionary[key]
    return None

# EAFP: Easier to Ask for Forgiveness than Permission
# Try the action, handle failure
def get_value_eafp(dictionary, key):
    try:
        return dictionary[key]
    except KeyError:
        return None

# Python generally prefers EAFP
# It's often faster and handles race conditions better
```

### Logging Exceptions

```python
import logging

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

def risky_operation():
    try:
        result = 1 / 0
    except ZeroDivisionError:
        logger.exception("Division failed!")  # Logs full traceback
        raise

# Or with more control
try:
    risky_operation()
except Exception as e:
    logger.error(f"Operation failed: {e}", exc_info=True)
```

## Practical Patterns

### Retry Pattern

```python
import time
from functools import wraps

def retry(max_attempts=3, delay=1, exceptions=(Exception,)):
    """Decorator to retry function on failure."""
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            last_exception = None
            for attempt in range(max_attempts):
                try:
                    return func(*args, **kwargs)
                except exceptions as e:
                    last_exception = e
                    if attempt < max_attempts - 1:
                        print(f"Attempt {attempt + 1} failed, retrying...")
                        time.sleep(delay)
            raise last_exception
        return wrapper
    return decorator

@retry(max_attempts=3, delay=0.5, exceptions=(ConnectionError,))
def fetch_data(url):
    # Simulate unreliable connection
    import random
    if random.random() < 0.7:
        raise ConnectionError("Network error")
    return "data"
```

### Validation Pattern

```python
class Validator:
    """Collect multiple validation errors."""

    def __init__(self):
        self.errors = []

    def validate_required(self, value, field):
        if not value:
            self.errors.append(f"{field} is required")

    def validate_length(self, value, field, min_len=None, max_len=None):
        if min_len and len(value) < min_len:
            self.errors.append(f"{field} must be at least {min_len} characters")
        if max_len and len(value) > max_len:
            self.errors.append(f"{field} must be at most {max_len} characters")

    def validate_email(self, value, field):
        if "@" not in value:
            self.errors.append(f"{field} is not a valid email")

    def raise_if_errors(self):
        if self.errors:
            raise ValidationError("; ".join(self.errors))


def register_user(username, email, password):
    v = Validator()
    v.validate_required(username, "Username")
    v.validate_length(username, "Username", min_len=3, max_len=20)
    v.validate_required(email, "Email")
    v.validate_email(email, "Email")
    v.validate_required(password, "Password")
    v.validate_length(password, "Password", min_len=8)
    v.raise_if_errors()

    return {"username": username, "email": email}
```

## Exercises

### Exercise 1: Safe Calculator

Create a calculator that handles all errors gracefully.

::: details Solution
```python
class CalculatorError(Exception):
    """Base calculator exception."""
    pass

class DivisionByZeroError(CalculatorError):
    """Raised when dividing by zero."""
    pass

class InvalidOperationError(CalculatorError):
    """Raised for unknown operations."""
    pass

class Calculator:
    def calculate(self, a, b, operation):
        """Perform calculation with error handling."""
        try:
            a = float(a)
            b = float(b)
        except ValueError as e:
            raise CalculatorError(f"Invalid number: {e}")

        operations = {
            '+': lambda x, y: x + y,
            '-': lambda x, y: x - y,
            '*': lambda x, y: x * y,
            '/': self._divide,
            '**': lambda x, y: x ** y,
        }

        if operation not in operations:
            raise InvalidOperationError(f"Unknown operation: {operation}")

        try:
            return operations[operation](a, b)
        except OverflowError:
            raise CalculatorError("Result too large")

    def _divide(self, a, b):
        if b == 0:
            raise DivisionByZeroError("Cannot divide by zero")
        return a / b


def main():
    calc = Calculator()
    while True:
        try:
            expr = input("Enter expression (e.g., '10 + 5'): ").strip()
            if expr.lower() == 'quit':
                break

            parts = expr.split()
            if len(parts) != 3:
                print("Format: number operator number")
                continue

            a, op, b = parts
            result = calc.calculate(a, b, op)
            print(f"Result: {result}")

        except CalculatorError as e:
            print(f"Error: {e}")
        except KeyboardInterrupt:
            print("\nGoodbye!")
            break

if __name__ == "__main__":
    main()
```
:::

### Exercise 2: File Processor with Error Handling

Create a file processor that handles various error scenarios.

::: details Solution
```python
import json
from pathlib import Path

class FileProcessorError(Exception):
    """Base exception for file processor."""
    pass

class FileReadError(FileProcessorError):
    """Error reading file."""
    pass

class FileWriteError(FileProcessorError):
    """Error writing file."""
    pass

class ParseError(FileProcessorError):
    """Error parsing file content."""
    pass

class FileProcessor:
    def read_json(self, filepath):
        """Read and parse JSON file."""
        try:
            with open(filepath, 'r') as f:
                return json.load(f)
        except FileNotFoundError:
            raise FileReadError(f"File not found: {filepath}")
        except PermissionError:
            raise FileReadError(f"Permission denied: {filepath}")
        except json.JSONDecodeError as e:
            raise ParseError(f"Invalid JSON in {filepath}: {e}")

    def write_json(self, filepath, data):
        """Write data to JSON file."""
        try:
            # Create directory if needed
            Path(filepath).parent.mkdir(parents=True, exist_ok=True)
            with open(filepath, 'w') as f:
                json.dump(data, f, indent=2)
        except PermissionError:
            raise FileWriteError(f"Permission denied: {filepath}")
        except TypeError as e:
            raise FileWriteError(f"Data not serializable: {e}")

    def process_files(self, input_files, output_file):
        """Process multiple files, collecting errors."""
        results = []
        errors = []

        for filepath in input_files:
            try:
                data = self.read_json(filepath)
                results.append({"file": filepath, "data": data})
            except FileProcessorError as e:
                errors.append({"file": filepath, "error": str(e)})

        if results:
            try:
                self.write_json(output_file, {
                    "processed": len(results),
                    "results": results,
                    "errors": errors
                })
            except FileWriteError as e:
                errors.append({"file": output_file, "error": str(e)})

        return {"success": len(results), "failed": len(errors), "errors": errors}


# Test
processor = FileProcessor()
result = processor.process_files(
    ["file1.json", "file2.json", "nonexistent.json"],
    "output.json"
)
print(result)
```
:::

## Common Mistakes

### ❌ WRONG: Bare except clause

```python
# ❌ WRONG - Catches everything, including KeyboardInterrupt!
try:
    user_input = input("Enter a number: ")
    result = int(user_input)
except:  # Too broad!
    print("Error occurred")

# ✓ CORRECT - Be specific about what you catch
try:
    user_input = input("Enter a number: ")
    result = int(user_input)
except ValueError:
    print("Please enter a valid number")

# Or at minimum, use Exception (not BaseException)
except Exception as e:
    print(f"Error: {e}")
```

### ❌ WRONG: Silencing exceptions without handling

```python
# ❌ WRONG - Swallowing exceptions hides bugs
try:
    process_data(data)
except Exception:
    pass  # Silent failure!

# ✓ CORRECT - At least log the error
import logging

try:
    process_data(data)
except Exception as e:
    logging.error(f"Failed to process data: {e}")
    # Then handle appropriately (retry, return default, re-raise, etc.)
```

### ❌ WRONG: Using exceptions for flow control

```python
# ❌ WRONG - Using exceptions instead of conditions
def get_item(items, index):
    try:
        return items[index]
    except IndexError:
        return None  # Using exception as normal flow

# ✓ CORRECT - Check condition first
def get_item(items, index):
    if 0 <= index < len(items):
        return items[index]
    return None
```

### ❌ WRONG: Catching and re-raising without context

```python
# ❌ WRONG - Loses original traceback
try:
    process_file(filename)
except IOError:
    raise RuntimeError("Failed to process file")

# ✓ CORRECT - Chain exceptions to preserve context
try:
    process_file(filename)
except IOError as e:
    raise RuntimeError(f"Failed to process {filename}") from e
```

### ❌ WRONG: Too broad exception handling

```python
# ❌ WRONG - Catches unrelated errors
try:
    result = calculate_total(items)
    save_to_database(result)
    send_email_notification(result)
except Exception as e:
    print(f"Error: {e}")  # Which operation failed?

# ✓ CORRECT - Handle each operation separately
try:
    result = calculate_total(items)
except ValueError as e:
    print(f"Calculation error: {e}")
    return

try:
    save_to_database(result)
except DatabaseError as e:
    print(f"Database error: {e}")
    return
```

## Python vs JavaScript

| Concept | Python | JavaScript |
|---------|--------|------------|
| Try block | `try:` | `try {` |
| Catch | `except Error:` | `catch (error) {` |
| Finally | `finally:` | `finally {` |
| Throw | `raise Exception()` | `throw new Error()` |
| Custom exception | `class MyError(Exception)` | `class MyError extends Error` |
| Error message | `str(e)` or `e.args[0]` | `error.message` |
| Stack trace | `traceback.format_exc()` | `error.stack` |
| Catch specific | `except ValueError:` | N/A (check instanceof) |
| Catch multiple | `except (A, B):` | N/A (use if/else) |
| Re-raise | `raise` | `throw error` |
| Chain exception | `raise X from e` | N/A (set cause manually) |
| Else clause | `else:` (no exception) | N/A |
| Assert | `assert condition` | N/A (use libraries) |
| Warning | `warnings.warn()` | `console.warn()` |

## Real-World Examples

### Example 1: Robust API Client with Retry

```python
import time
import logging
from typing import Optional, Dict, Any, Callable, TypeVar
from functools import wraps
from dataclasses import dataclass
from enum import Enum

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

T = TypeVar('T')


class APIErrorCode(Enum):
    NETWORK_ERROR = "NETWORK_ERROR"
    TIMEOUT = "TIMEOUT"
    RATE_LIMITED = "RATE_LIMITED"
    UNAUTHORIZED = "UNAUTHORIZED"
    NOT_FOUND = "NOT_FOUND"
    SERVER_ERROR = "SERVER_ERROR"


@dataclass
class APIError(Exception):
    """Custom API exception with structured error information."""
    code: APIErrorCode
    message: str
    status_code: Optional[int] = None
    retry_after: Optional[int] = None

    def __str__(self):
        return f"[{self.code.value}] {self.message}"

    @property
    def is_retryable(self) -> bool:
        return self.code in {
            APIErrorCode.NETWORK_ERROR,
            APIErrorCode.TIMEOUT,
            APIErrorCode.RATE_LIMITED,
            APIErrorCode.SERVER_ERROR,
        }


def retry_on_failure(max_attempts: int = 3, delay: float = 1.0, backoff: float = 2.0):
    """Decorator that retries function on specified exceptions."""
    def decorator(func: Callable[..., T]) -> Callable[..., T]:
        @wraps(func)
        def wrapper(*args, **kwargs) -> T:
            last_exception = None
            current_delay = delay

            for attempt in range(1, max_attempts + 1):
                try:
                    return func(*args, **kwargs)
                except APIError as e:
                    last_exception = e
                    if not e.is_retryable:
                        raise

                    if e.retry_after:
                        current_delay = e.retry_after

                    if attempt < max_attempts:
                        logger.warning(f"Attempt {attempt} failed. Retrying in {current_delay}s")
                        time.sleep(current_delay)
                        current_delay *= backoff

            raise last_exception
        return wrapper
    return decorator


class APIClient:
    """API client with comprehensive error handling."""

    def __init__(self, base_url: str, api_key: str):
        self.base_url = base_url
        self.api_key = api_key

    @retry_on_failure(max_attempts=3, delay=1.0)
    def get(self, endpoint: str) -> Dict[str, Any]:
        """GET request with automatic retry."""
        import random
        # Simulate various scenarios
        if random.random() < 0.3:
            raise APIError(APIErrorCode.TIMEOUT, "Request timed out", 408)
        return {"status": "success", "endpoint": endpoint}


# Usage
client = APIClient("https://api.example.com", "key123")
try:
    result = client.get("/users/123")
    print(f"Success: {result}")
except APIError as e:
    print(f"API error: {e}")
```

### Example 2: Validation Framework

```python
from typing import List, Dict, Any
from dataclasses import dataclass
from enum import Enum, auto


class ValidationSeverity(Enum):
    ERROR = auto()
    WARNING = auto()


@dataclass
class ValidationError:
    field: str
    message: str
    code: str
    severity: ValidationSeverity = ValidationSeverity.ERROR


class ValidationException(Exception):
    """Exception containing multiple validation errors."""

    def __init__(self, errors: List[ValidationError]):
        self.errors = errors
        super().__init__(f"Validation failed with {len(errors)} error(s)")

    def __str__(self):
        return "\n".join(f"  - {e.field}: {e.message}" for e in self.errors)


class Validator:
    """Fluent validation builder."""

    def __init__(self):
        self._errors: List[ValidationError] = []
        self._field: str = ""
        self._value: Any = None

    def field(self, name: str, value: Any) -> 'Validator':
        self._field = name
        self._value = value
        return self

    def required(self) -> 'Validator':
        if not self._value:
            self._errors.append(ValidationError(
                self._field, "is required", "REQUIRED"
            ))
        return self

    def min_length(self, length: int) -> 'Validator':
        if self._value and len(str(self._value)) < length:
            self._errors.append(ValidationError(
                self._field, f"must be at least {length} characters", "MIN_LENGTH"
            ))
        return self

    def email(self) -> 'Validator':
        if self._value and "@" not in str(self._value):
            self._errors.append(ValidationError(
                self._field, "must be a valid email", "EMAIL"
            ))
        return self

    def raise_if_invalid(self):
        if self._errors:
            raise ValidationException(self._errors)


# Usage
def register_user(data: Dict[str, Any]):
    v = Validator()
    (v.field("username", data.get("username")).required().min_length(3)
      .field("email", data.get("email")).required().email()
      .field("password", data.get("password")).required().min_length(8))
    v.raise_if_invalid()
    return data


try:
    register_user({"username": "ab", "email": "invalid", "password": "123"})
except ValidationException as e:
    print(f"Validation errors:\n{e}")
```

### Example 3: Circuit Breaker Pattern

```python
from datetime import datetime, timedelta
from enum import Enum, auto
import threading


class CircuitState(Enum):
    CLOSED = auto()      # Normal operation
    OPEN = auto()        # Failing, reject calls
    HALF_OPEN = auto()   # Testing recovery


class CircuitOpenError(Exception):
    def __init__(self, retry_after: timedelta):
        self.retry_after = retry_after
        super().__init__(f"Circuit open. Retry after {retry_after.seconds}s")


class CircuitBreaker:
    """Circuit breaker for handling cascading failures."""

    def __init__(self, failure_threshold: int = 5, recovery_timeout: int = 30):
        self.failure_threshold = failure_threshold
        self.recovery_timeout = timedelta(seconds=recovery_timeout)
        self._state = CircuitState.CLOSED
        self._failures = 0
        self._last_failure = None
        self._lock = threading.Lock()

    @property
    def state(self) -> CircuitState:
        with self._lock:
            if self._state == CircuitState.OPEN:
                if datetime.now() - self._last_failure > self.recovery_timeout:
                    self._state = CircuitState.HALF_OPEN
            return self._state

    def call(self, func, *args, **kwargs):
        if self.state == CircuitState.OPEN:
            raise CircuitOpenError(self.recovery_timeout)

        try:
            result = func(*args, **kwargs)
            self._record_success()
            return result
        except Exception as e:
            self._record_failure()
            raise

    def _record_success(self):
        with self._lock:
            self._failures = 0
            self._state = CircuitState.CLOSED

    def _record_failure(self):
        with self._lock:
            self._failures += 1
            self._last_failure = datetime.now()
            if self._failures >= self.failure_threshold:
                self._state = CircuitState.OPEN


# Usage
circuit = CircuitBreaker(failure_threshold=3, recovery_timeout=10)

def unreliable_service():
    import random
    if random.random() < 0.7:
        raise ConnectionError("Service unavailable")
    return "Success!"

for i in range(10):
    try:
        result = circuit.call(unreliable_service)
        print(f"Call {i+1}: {result}")
    except CircuitOpenError as e:
        print(f"Call {i+1}: {e}")
    except ConnectionError as e:
        print(f"Call {i+1}: Failed - {e}")
```

## Quick Reference

::: tip Exception Handling Cheat Sheet
```python
# Basic try/except
try:
    risky_code()
except SpecificError:
    handle_error()

# Multiple exceptions
except (TypeError, ValueError) as e:
    handle_error(e)

# All exceptions (use sparingly)
except Exception as e:
    handle_error(e)

# else (no exception)
try:
    code()
except Error:
    handle()
else:
    on_success()

# finally (always runs)
finally:
    cleanup()

# Raise exception
raise ValueError("message")

# Re-raise
except Error:
    raise

# Chain exceptions
raise NewError() from original_error

# Custom exception
class MyError(Exception):
    pass

# Context manager
with resource as r:
    use(r)  # cleanup automatic
```
:::

## Summary

| Concept | Description | Example |
|---------|-------------|---------|
| try/except | Handle errors | `try: ... except: ...` |
| else | Run if no error | `else: success()` |
| finally | Always run | `finally: cleanup()` |
| raise | Throw exception | `raise ValueError()` |
| Custom | Own exceptions | `class MyError(Exception)` |
| Chaining | Link exceptions | `raise X from Y` |
| Context | Auto cleanup | `with open() as f:` |

## Next Steps

Continue to [Advanced Topics](/guide/python/10-advanced) to learn about decorators, generators, and more advanced Python features.
