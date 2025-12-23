# Modules and Packages

Modules help organize code into reusable components. Packages group related modules together. This lesson covers how to create, import, and use modules effectively.

::: info What You'll Learn
- Import and use modules
- Create your own modules
- Understand packages and `__init__.py`
- Use the Python Standard Library
- Install and manage third-party packages
:::

## What are Modules?

```
┌─────────────────────────────────────────────────────────────────┐
│                    Module Organization                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   MODULE: A single .py file containing Python code              │
│                                                                  │
│   math.py ─────────┐                                            │
│   ├── Variables    │                                            │
│   ├── Functions    │ → import math                              │
│   ├── Classes      │                                            │
│   └── Constants    │                                            │
│   ─────────────────┘                                            │
│                                                                  │
│   PACKAGE: A directory containing modules                        │
│                                                                  │
│   mypackage/                                                     │
│   ├── __init__.py      ← Makes it a package                     │
│   ├── module1.py       ← from mypackage import module1          │
│   ├── module2.py       ← from mypackage import module2          │
│   └── subpackage/                                                │
│       ├── __init__.py                                            │
│       └── module3.py   ← from mypackage.subpackage import module3│
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Importing Modules

### Basic Import

```python
# Import entire module
import math
print(math.pi)          # 3.141592653589793
print(math.sqrt(16))    # 4.0

# Import with alias
import numpy as np
import pandas as pd

# Import specific items
from math import pi, sqrt
print(pi)               # 3.141592653589793
print(sqrt(16))         # 4.0

# Import all (not recommended)
from math import *
print(sin(0))           # Works but pollutes namespace
```

### Import Variations

```python
# Multiple imports on one line
import os, sys, json

# Import with alias
from datetime import datetime as dt
now = dt.now()

# Import from package
from collections import Counter, defaultdict
from typing import List, Dict, Optional

# Relative imports (inside packages)
from . import sibling_module
from .. import parent_module
from .subpackage import module
```

### Import Best Practices

```
┌─────────────────────────────────────────────────────────────────┐
│                    Import Organization                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   # 1. Standard library imports                                  │
│   import os                                                      │
│   import sys                                                     │
│   from datetime import datetime                                  │
│                                                                  │
│   # 2. Third-party imports                                       │
│   import numpy as np                                             │
│   import pandas as pd                                            │
│   from flask import Flask                                        │
│                                                                  │
│   # 3. Local/project imports                                     │
│   from myproject import utils                                    │
│   from myproject.models import User                              │
│                                                                  │
│   # Separate groups with blank lines                             │
│   # Alphabetize within groups                                    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Creating Modules

### Simple Module

```python
# mymodule.py
"""
My custom module.
This docstring describes what the module does.
"""

# Constants
VERSION = "1.0.0"
PI = 3.14159

# Functions
def greet(name):
    """Return a greeting message."""
    return f"Hello, {name}!"

def add(a, b):
    """Add two numbers."""
    return a + b

# Classes
class Calculator:
    """Simple calculator class."""

    def add(self, a, b):
        return a + b

    def subtract(self, a, b):
        return a - b

# Private (by convention)
_internal_value = 42

def _helper_function():
    """Internal helper (not exported with *)."""
    pass
```

### Using Your Module

```python
# In another file
import mymodule

print(mymodule.VERSION)           # 1.0.0
print(mymodule.greet("Alice"))    # Hello, Alice!

calc = mymodule.Calculator()
print(calc.add(3, 5))             # 8

# Or import specific items
from mymodule import greet, Calculator
print(greet("Bob"))
```

### Module `__name__`

```python
# mymodule.py
def main():
    print("Running as main program")

# This block runs only when file is executed directly
if __name__ == "__main__":
    main()
    # Won't run when imported!

# When imported:
# __name__ == "mymodule"

# When run directly:
# __name__ == "__main__"
```

## Packages

### Package Structure

```
mypackage/
├── __init__.py          # Package initialization
├── core.py              # Core functionality
├── utils.py             # Utility functions
├── models/              # Subpackage
│   ├── __init__.py
│   ├── user.py
│   └── product.py
└── tests/               # Test subpackage
    ├── __init__.py
    └── test_core.py
```

### `__init__.py`

```python
# mypackage/__init__.py
"""
MyPackage - A sample Python package.
"""

# Package metadata
__version__ = "1.0.0"
__author__ = "Your Name"

# Import commonly used items for easy access
from .core import main_function
from .utils import helper_function

# Define what gets exported with "from mypackage import *"
__all__ = ["main_function", "helper_function", "core", "utils"]

# Package initialization code
print("MyPackage loaded!")
```

```python
# Using the package
import mypackage
print(mypackage.__version__)
mypackage.main_function()

from mypackage import helper_function
from mypackage.models.user import User
```

### Relative Imports

```python
# Inside mypackage/models/user.py
from ..core import main_function      # Parent package
from ..utils import helper            # Sibling in parent
from . import product                 # Same directory
from .product import Product          # Specific class

# Relative imports only work inside packages!
```

## Python Standard Library

### Commonly Used Modules

| Module | Description | Example |
|--------|-------------|---------|
| `os` | OS interaction | `os.getcwd()`, `os.listdir()` |
| `sys` | System-specific | `sys.path`, `sys.argv` |
| `datetime` | Date and time | `datetime.now()` |
| `json` | JSON handling | `json.dumps()`, `json.loads()` |
| `re` | Regular expressions | `re.match()`, `re.search()` |
| `math` | Mathematics | `math.sqrt()`, `math.pi` |
| `random` | Random numbers | `random.randint()`, `random.choice()` |
| `collections` | Data structures | `Counter`, `defaultdict` |
| `itertools` | Iteration tools | `chain()`, `combinations()` |
| `functools` | Function tools | `reduce()`, `lru_cache` |
| `pathlib` | Path handling | `Path()` |
| `typing` | Type hints | `List`, `Dict`, `Optional` |

### os Module

```python
import os

# Working directory
print(os.getcwd())              # Current directory
os.chdir("/path/to/dir")        # Change directory

# Environment variables
print(os.environ.get("HOME"))
os.environ["MY_VAR"] = "value"

# File operations
os.mkdir("new_dir")             # Create directory
os.makedirs("a/b/c")            # Create nested dirs
os.remove("file.txt")           # Delete file
os.rmdir("empty_dir")           # Delete empty dir

# Path operations
print(os.path.join("a", "b", "c"))    # a/b/c
print(os.path.exists("file.txt"))
print(os.path.isfile("file.txt"))
print(os.path.isdir("folder"))

# List directory
for item in os.listdir("."):
    print(item)

# Walk directory tree
for root, dirs, files in os.walk("."):
    for file in files:
        print(os.path.join(root, file))
```

### datetime Module

```python
from datetime import datetime, date, time, timedelta

# Current date/time
now = datetime.now()
today = date.today()

print(now)                    # 2024-01-15 10:30:45.123456
print(today)                  # 2024-01-15

# Create specific date/time
dt = datetime(2024, 1, 15, 10, 30, 0)
d = date(2024, 1, 15)
t = time(10, 30, 0)

# Formatting
print(now.strftime("%Y-%m-%d %H:%M:%S"))  # 2024-01-15 10:30:45
print(now.strftime("%B %d, %Y"))          # January 15, 2024

# Parsing
dt = datetime.strptime("2024-01-15", "%Y-%m-%d")

# Arithmetic
tomorrow = today + timedelta(days=1)
next_week = today + timedelta(weeks=1)
duration = datetime(2024, 12, 31) - datetime(2024, 1, 1)
print(duration.days)  # 365

# Components
print(now.year, now.month, now.day)
print(now.hour, now.minute, now.second)
```

### collections Module

```python
from collections import Counter, defaultdict, namedtuple, deque

# Counter - count elements
words = ["apple", "banana", "apple", "cherry", "apple"]
counter = Counter(words)
print(counter)                    # Counter({'apple': 3, ...})
print(counter.most_common(2))     # [('apple', 3), ('banana', 1)]

# defaultdict - dict with default values
dd = defaultdict(list)
dd["fruits"].append("apple")      # No KeyError!
dd["fruits"].append("banana")
print(dd)                         # {'fruits': ['apple', 'banana']}

# namedtuple - tuple with named fields
Point = namedtuple("Point", ["x", "y"])
p = Point(10, 20)
print(p.x, p.y)                   # 10 20
print(p[0], p[1])                 # 10 20

# deque - double-ended queue
dq = deque([1, 2, 3])
dq.append(4)                      # Add right
dq.appendleft(0)                  # Add left
dq.pop()                          # Remove right
dq.popleft()                      # Remove left
```

### itertools Module

```python
from itertools import chain, combinations, permutations, cycle, count

# chain - combine iterables
list1 = [1, 2, 3]
list2 = [4, 5, 6]
combined = list(chain(list1, list2))  # [1, 2, 3, 4, 5, 6]

# combinations
items = ["a", "b", "c"]
combos = list(combinations(items, 2))
# [('a', 'b'), ('a', 'c'), ('b', 'c')]

# permutations
perms = list(permutations(items, 2))
# [('a', 'b'), ('a', 'c'), ('b', 'a'), ('b', 'c'), ('c', 'a'), ('c', 'b')]

# count - infinite counter
for i in count(10, 2):  # Start at 10, step 2
    if i > 20:
        break
    print(i)  # 10, 12, 14, 16, 18, 20

# cycle - infinite cycle
colors = cycle(["red", "green", "blue"])
for _ in range(6):
    print(next(colors))  # red, green, blue, red, green, blue
```

## Third-Party Packages

### pip - Package Installer

```bash
# Install package
pip install package_name
pip install numpy pandas matplotlib

# Install specific version
pip install requests==2.28.0
pip install "requests>=2.25.0,<3.0.0"

# Install from requirements file
pip install -r requirements.txt

# Upgrade package
pip install --upgrade package_name

# Uninstall
pip uninstall package_name

# List installed
pip list
pip freeze

# Show package info
pip show requests
```

### requirements.txt

```
# requirements.txt
numpy==1.24.0
pandas>=2.0.0
requests>=2.25.0,<3.0.0
flask~=2.0.0
pytest
```

```bash
# Create requirements.txt
pip freeze > requirements.txt

# Install all requirements
pip install -r requirements.txt
```

### Virtual Environments

```bash
# Create virtual environment
python -m venv myenv

# Activate (Unix/Mac)
source myenv/bin/activate

# Activate (Windows)
myenv\Scripts\activate

# Deactivate
deactivate

# Install packages in virtual env
pip install requests

# Best practice: one venv per project
```

```
┌─────────────────────────────────────────────────────────────────┐
│                 Why Virtual Environments?                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   Without venv:                  With venv:                      │
│   ─────────────                  ──────────                      │
│                                                                  │
│   Project A needs                Project A (venv_a)              │
│   Django 3.0      ┐             └── Django 3.0 ✓                │
│                   │ CONFLICT!                                    │
│   Project B needs │             Project B (venv_b)               │
│   Django 4.0      ┘             └── Django 4.0 ✓                │
│                                                                  │
│   Virtual environments isolate project dependencies!             │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Module Search Path

```python
import sys

# Where Python looks for modules
for path in sys.path:
    print(path)

# Order:
# 1. Current directory
# 2. PYTHONPATH environment variable
# 3. Standard library
# 4. site-packages (third-party)

# Add custom path
sys.path.append("/my/custom/modules")

# Or use PYTHONPATH environment variable
# export PYTHONPATH=/my/custom/modules:$PYTHONPATH
```

## Exercises

### Exercise 1: Create a Utility Module

Create a utility module with common functions.

::: details Solution
```python
# utils.py
"""
Utility functions for common operations.
"""

import re
from datetime import datetime

__version__ = "1.0.0"
__all__ = ["slugify", "truncate", "format_date", "validate_email"]

def slugify(text):
    """Convert text to URL-friendly slug."""
    text = text.lower().strip()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[\s_-]+', '-', text)
    return text

def truncate(text, length=100, suffix="..."):
    """Truncate text to specified length."""
    if len(text) <= length:
        return text
    return text[:length - len(suffix)].rsplit(' ', 1)[0] + suffix

def format_date(dt=None, fmt="%Y-%m-%d"):
    """Format datetime object or current time."""
    if dt is None:
        dt = datetime.now()
    return dt.strftime(fmt)

def validate_email(email):
    """Validate email format."""
    pattern = r'^[\w\.-]+@[\w\.-]+\.\w+$'
    return bool(re.match(pattern, email))

if __name__ == "__main__":
    # Test when run directly
    print(slugify("Hello World! Test"))  # hello-world-test
    print(truncate("This is a long text", 10))  # This is...
    print(format_date())  # 2024-01-15
    print(validate_email("test@example.com"))  # True
```
:::

### Exercise 2: Create a Package

Create a simple math package.

::: details Solution
```python
# mathtools/__init__.py
"""Math tools package."""
from .basic import add, subtract, multiply, divide
from .advanced import power, sqrt, factorial

__version__ = "1.0.0"
__all__ = ["add", "subtract", "multiply", "divide",
           "power", "sqrt", "factorial"]

# mathtools/basic.py
"""Basic math operations."""

def add(a, b):
    return a + b

def subtract(a, b):
    return a - b

def multiply(a, b):
    return a * b

def divide(a, b):
    if b == 0:
        raise ValueError("Cannot divide by zero")
    return a / b

# mathtools/advanced.py
"""Advanced math operations."""
import math as _math

def power(base, exp):
    return base ** exp

def sqrt(n):
    if n < 0:
        raise ValueError("Cannot calculate sqrt of negative number")
    return _math.sqrt(n)

def factorial(n):
    if n < 0:
        raise ValueError("Factorial not defined for negative numbers")
    if n == 0 or n == 1:
        return 1
    return n * factorial(n - 1)

# Usage
# from mathtools import add, power
# print(add(3, 5))
# print(power(2, 10))
```
:::

### Exercise 3: Config Manager Module

Create a configuration management module.

::: details Solution
```python
# config.py
"""Configuration management module."""

import json
import os
from pathlib import Path
from typing import Any, Dict, Optional

class Config:
    """Configuration manager with file and environment support."""

    def __init__(self, config_file: Optional[str] = None):
        self._config: Dict[str, Any] = {}
        if config_file:
            self.load_file(config_file)

    def load_file(self, filepath: str) -> None:
        """Load configuration from JSON file."""
        path = Path(filepath)
        if path.exists():
            with open(path) as f:
                self._config.update(json.load(f))

    def load_env(self, prefix: str = "") -> None:
        """Load configuration from environment variables."""
        for key, value in os.environ.items():
            if prefix and not key.startswith(prefix):
                continue
            config_key = key[len(prefix):].lower() if prefix else key.lower()
            self._config[config_key] = value

    def get(self, key: str, default: Any = None) -> Any:
        """Get configuration value with dot notation support."""
        keys = key.split(".")
        value = self._config
        for k in keys:
            if isinstance(value, dict) and k in value:
                value = value[k]
            else:
                return default
        return value

    def set(self, key: str, value: Any) -> None:
        """Set configuration value."""
        keys = key.split(".")
        config = self._config
        for k in keys[:-1]:
            config = config.setdefault(k, {})
        config[keys[-1]] = value

    def all(self) -> Dict[str, Any]:
        """Return all configuration."""
        return self._config.copy()

# Global instance
_config = Config()

def get(key: str, default: Any = None) -> Any:
    return _config.get(key, default)

def set(key: str, value: Any) -> None:
    _config.set(key, value)

def load_file(filepath: str) -> None:
    _config.load_file(filepath)

def load_env(prefix: str = "") -> None:
    _config.load_env(prefix)

if __name__ == "__main__":
    # Test
    set("database.host", "localhost")
    set("database.port", 5432)
    print(get("database.host"))
    print(get("database.port"))
```
:::

## Quick Reference

::: tip Modules Cheat Sheet
```python
# Import styles
import module
import module as alias
from module import func
from module import func as alias
from module import *  # Avoid!

# Package structure
mypackage/
├── __init__.py
├── module.py
└── subpackage/
    └── __init__.py

# __init__.py
__version__ = "1.0.0"
__all__ = ["func1", "func2"]
from .module import func1, func2

# Module check
if __name__ == "__main__":
    main()

# pip commands
pip install package
pip install -r requirements.txt
pip freeze > requirements.txt
pip uninstall package
pip list

# Virtual environment
python -m venv env
source env/bin/activate  # Unix
env\Scripts\activate     # Windows
deactivate
```
:::

## Common Mistakes

### ❌ WRONG: Circular imports

```python
# ❌ WRONG - module_a.py
from module_b import func_b

def func_a():
    return func_b()

# module_b.py
from module_a import func_a  # Circular import!

def func_b():
    return func_a()

# ✓ CORRECT - Restructure to avoid circular dependency
# Either move shared code to a third module, or import inside functions
def func_b():
    from module_a import func_a  # Import inside function
    return func_a()
```

### ❌ WRONG: Using `from module import *`

```python
# ❌ WRONG - Pollutes namespace, unclear what's imported
from math import *
from statistics import *

result = sqrt(16)  # Which module is this from?
mean([1, 2, 3])    # Overwritten if both have 'mean'?

# ✓ CORRECT - Be explicit
from math import sqrt, pi
from statistics import mean, median

# Or use qualified names
import math
import statistics

result = math.sqrt(16)
avg = statistics.mean([1, 2, 3])
```

### ❌ WRONG: Modifying sys.path permanently

```python
# ❌ WRONG - Modifies path for entire application
import sys
sys.path.append("/my/custom/path")  # Affects all imports

# ✓ CORRECT - Use proper package structure or virtual environment
# Or use context manager for temporary path changes
import contextlib

@contextlib.contextmanager
def add_path(path):
    import sys
    sys.path.insert(0, path)
    try:
        yield
    finally:
        sys.path.remove(path)

with add_path("/my/custom/path"):
    import my_module
```

### ❌ WRONG: Not using `__name__ == "__main__"`

```python
# ❌ WRONG - Code runs on import too
# mymodule.py
def main():
    print("Running main")

main()  # Runs when imported!

# ✓ CORRECT - Guard main code
def main():
    print("Running main")

if __name__ == "__main__":
    main()  # Only runs when executed directly
```

### ❌ WRONG: Hardcoding import paths

```python
# ❌ WRONG - Breaks when project structure changes
from src.utils.helpers import helper_func
from /absolute/path/module import func

# ✓ CORRECT - Use relative imports within packages
from .utils.helpers import helper_func
from ..common import shared_func

# Or configure package properly and use package imports
from mypackage.utils import helper_func
```

## Python vs JavaScript

| Concept | Python | JavaScript (ES6+) |
|---------|--------|-------------------|
| Import module | `import math` | `import * as math from 'math'` |
| Import specific | `from math import sqrt` | `import { sqrt } from 'math'` |
| Import with alias | `import numpy as np` | `import * as np from 'numpy'` |
| Import function alias | `from math import sqrt as s` | `import { sqrt as s } from 'math'` |
| Default export | N/A | `import func from 'module'` |
| Export | `__all__ = ['func']` | `export { func }` |
| Export default | N/A | `export default func` |
| Dynamic import | `importlib.import_module('m')` | `import('module')` |
| Conditional import | `if x: import y` | `if (x) await import('y')` |
| Module file | `.py` | `.js`, `.mjs` |
| Package marker | `__init__.py` | `package.json` |
| Package manager | `pip` | `npm`, `yarn`, `pnpm` |
| Virtual environment | `venv`, `virtualenv` | N/A (uses node_modules) |
| Requirements file | `requirements.txt` | `package.json` |
| Lock file | `requirements.txt` (pinned) | `package-lock.json` |

## Real-World Examples

### Example 1: Plugin System

```python
"""
A dynamic plugin system that loads plugins from a directory.
"""
import importlib
import importlib.util
from pathlib import Path
from typing import Dict, List, Any, Protocol
from abc import ABC, abstractmethod

class PluginInterface(ABC):
    """Base class that all plugins must inherit from."""

    @property
    @abstractmethod
    def name(self) -> str:
        """Plugin name."""
        pass

    @property
    @abstractmethod
    def version(self) -> str:
        """Plugin version."""
        pass

    @abstractmethod
    def execute(self, *args, **kwargs) -> Any:
        """Execute plugin functionality."""
        pass


class PluginManager:
    """Manages discovery, loading, and execution of plugins."""

    def __init__(self, plugin_dir: str):
        self.plugin_dir = Path(plugin_dir)
        self.plugins: Dict[str, PluginInterface] = {}
        self._discovered: Dict[str, Path] = {}

    def discover(self) -> List[str]:
        """Discover available plugins in the plugin directory."""
        if not self.plugin_dir.exists():
            self.plugin_dir.mkdir(parents=True)
            return []

        self._discovered.clear()
        for py_file in self.plugin_dir.glob("*.py"):
            if py_file.name.startswith("_"):
                continue
            plugin_name = py_file.stem
            self._discovered[plugin_name] = py_file

        return list(self._discovered.keys())

    def load(self, plugin_name: str) -> bool:
        """Load a specific plugin by name."""
        if plugin_name not in self._discovered:
            print(f"Plugin '{plugin_name}' not found")
            return False

        if plugin_name in self.plugins:
            print(f"Plugin '{plugin_name}' already loaded")
            return True

        plugin_path = self._discovered[plugin_name]

        try:
            # Load module from file path
            spec = importlib.util.spec_from_file_location(
                plugin_name, plugin_path
            )
            module = importlib.util.module_from_spec(spec)
            spec.loader.exec_module(module)

            # Find plugin class
            for attr_name in dir(module):
                attr = getattr(module, attr_name)
                if (isinstance(attr, type) and
                    issubclass(attr, PluginInterface) and
                    attr is not PluginInterface):
                    self.plugins[plugin_name] = attr()
                    print(f"Loaded plugin: {plugin_name} v{self.plugins[plugin_name].version}")
                    return True

            print(f"No valid plugin class found in {plugin_name}")
            return False

        except Exception as e:
            print(f"Error loading plugin '{plugin_name}': {e}")
            return False

    def load_all(self) -> int:
        """Load all discovered plugins."""
        self.discover()
        loaded = 0
        for name in self._discovered:
            if self.load(name):
                loaded += 1
        return loaded

    def unload(self, plugin_name: str) -> bool:
        """Unload a plugin."""
        if plugin_name in self.plugins:
            del self.plugins[plugin_name]
            return True
        return False

    def execute(self, plugin_name: str, *args, **kwargs) -> Any:
        """Execute a plugin."""
        if plugin_name not in self.plugins:
            raise ValueError(f"Plugin '{plugin_name}' not loaded")
        return self.plugins[plugin_name].execute(*args, **kwargs)

    def list_plugins(self) -> List[Dict[str, str]]:
        """List all loaded plugins."""
        return [
            {"name": p.name, "version": p.version}
            for p in self.plugins.values()
        ]


# Example plugin file: plugins/hello_plugin.py
"""
from plugin_system import PluginInterface

class HelloPlugin(PluginInterface):
    @property
    def name(self) -> str:
        return "Hello Plugin"

    @property
    def version(self) -> str:
        return "1.0.0"

    def execute(self, name: str = "World") -> str:
        return f"Hello, {name}!"
"""

# Usage
manager = PluginManager("./plugins")
print(f"Discovered: {manager.discover()}")
manager.load_all()
print(f"Loaded plugins: {manager.list_plugins()}")
```

### Example 2: Dependency Injection Container

```python
"""
A simple dependency injection container for managing dependencies.
"""
from typing import Any, Callable, Dict, Type, TypeVar, get_type_hints
from functools import wraps
import inspect

T = TypeVar('T')

class Container:
    """Simple dependency injection container."""

    def __init__(self):
        self._services: Dict[Type, Any] = {}
        self._factories: Dict[Type, Callable] = {}
        self._singletons: Dict[Type, Any] = {}

    def register(self, interface: Type[T], implementation: Type[T] = None,
                 singleton: bool = False) -> None:
        """Register a service."""
        impl = implementation or interface

        if singleton:
            self._factories[interface] = lambda: self._get_singleton(interface, impl)
        else:
            self._factories[interface] = lambda: self._create_instance(impl)

    def register_instance(self, interface: Type[T], instance: T) -> None:
        """Register an existing instance."""
        self._services[interface] = instance

    def register_factory(self, interface: Type[T],
                         factory: Callable[[], T]) -> None:
        """Register a factory function."""
        self._factories[interface] = factory

    def _get_singleton(self, interface: Type, impl: Type) -> Any:
        """Get or create singleton instance."""
        if interface not in self._singletons:
            self._singletons[interface] = self._create_instance(impl)
        return self._singletons[interface]

    def _create_instance(self, cls: Type) -> Any:
        """Create instance with dependency injection."""
        hints = get_type_hints(cls.__init__) if hasattr(cls, '__init__') else {}

        # Get constructor parameters
        sig = inspect.signature(cls.__init__)
        kwargs = {}

        for param_name, param in sig.parameters.items():
            if param_name == 'self':
                continue

            param_type = hints.get(param_name)
            if param_type and param_type in self._factories:
                kwargs[param_name] = self.resolve(param_type)
            elif param_type and param_type in self._services:
                kwargs[param_name] = self._services[param_type]
            elif param.default is not inspect.Parameter.empty:
                kwargs[param_name] = param.default

        return cls(**kwargs)

    def resolve(self, interface: Type[T]) -> T:
        """Resolve a service."""
        if interface in self._services:
            return self._services[interface]

        if interface in self._factories:
            return self._factories[interface]()

        raise ValueError(f"Service not registered: {interface}")

    def inject(self, func: Callable) -> Callable:
        """Decorator to inject dependencies into function."""
        hints = get_type_hints(func)

        @wraps(func)
        def wrapper(*args, **kwargs):
            sig = inspect.signature(func)
            for param_name, param in sig.parameters.items():
                if param_name in kwargs:
                    continue
                param_type = hints.get(param_name)
                if param_type:
                    try:
                        kwargs[param_name] = self.resolve(param_type)
                    except ValueError:
                        pass
            return func(*args, **kwargs)

        return wrapper


# Example usage
from abc import ABC, abstractmethod

# Define interfaces
class ILogger(ABC):
    @abstractmethod
    def log(self, message: str) -> None:
        pass

class IDatabase(ABC):
    @abstractmethod
    def query(self, sql: str) -> list:
        pass

# Implementations
class ConsoleLogger(ILogger):
    def log(self, message: str) -> None:
        print(f"[LOG] {message}")

class MockDatabase(IDatabase):
    def __init__(self, logger: ILogger):
        self.logger = logger

    def query(self, sql: str) -> list:
        self.logger.log(f"Executing: {sql}")
        return [{"id": 1, "name": "Test"}]

class UserService:
    def __init__(self, db: IDatabase, logger: ILogger):
        self.db = db
        self.logger = logger

    def get_users(self) -> list:
        self.logger.log("Getting users")
        return self.db.query("SELECT * FROM users")


# Setup container
container = Container()
container.register(ILogger, ConsoleLogger, singleton=True)
container.register(IDatabase, MockDatabase)
container.register(UserService)

# Resolve and use
user_service = container.resolve(UserService)
users = user_service.get_users()
print(f"Users: {users}")
```

### Example 3: Command Line Application Framework

```python
"""
A mini CLI framework similar to Click/Typer.
"""
import sys
import inspect
from typing import Callable, Dict, List, Any, Optional, get_type_hints
from dataclasses import dataclass, field

@dataclass
class Command:
    """Represents a CLI command."""
    name: str
    func: Callable
    help: str = ""
    options: Dict[str, Any] = field(default_factory=dict)


class CLI:
    """Simple CLI application framework."""

    def __init__(self, name: str = "app", description: str = ""):
        self.name = name
        self.description = description
        self.commands: Dict[str, Command] = {}
        self._default_command: Optional[str] = None

    def command(self, name: str = None, help: str = ""):
        """Decorator to register a command."""
        def decorator(func: Callable) -> Callable:
            cmd_name = name or func.__name__
            self.commands[cmd_name] = Command(
                name=cmd_name,
                func=func,
                help=help or func.__doc__ or "",
            )
            return func
        return decorator

    def default(self, func: Callable) -> Callable:
        """Set default command."""
        self._default_command = func.__name__
        return self.command()(func)

    def _parse_args(self, args: List[str], func: Callable) -> Dict[str, Any]:
        """Parse command line arguments."""
        hints = get_type_hints(func)
        sig = inspect.signature(func)
        kwargs = {}

        # Get defaults from signature
        for param_name, param in sig.parameters.items():
            if param.default is not inspect.Parameter.empty:
                kwargs[param_name] = param.default

        # Parse arguments
        i = 0
        positional_params = [
            name for name, p in sig.parameters.items()
            if p.default is inspect.Parameter.empty
        ]
        positional_index = 0

        while i < len(args):
            arg = args[i]

            if arg.startswith("--"):
                # Named argument
                key = arg[2:].replace("-", "_")
                if i + 1 < len(args) and not args[i + 1].startswith("-"):
                    value = args[i + 1]
                    i += 1
                else:
                    value = True

                # Type conversion
                if key in hints:
                    if hints[key] == bool:
                        value = value.lower() in ("true", "1", "yes") if isinstance(value, str) else value
                    elif hints[key] == int:
                        value = int(value)
                    elif hints[key] == float:
                        value = float(value)

                kwargs[key] = value

            elif arg.startswith("-"):
                # Short argument (flag)
                key = arg[1:]
                kwargs[key] = True

            else:
                # Positional argument
                if positional_index < len(positional_params):
                    param_name = positional_params[positional_index]
                    kwargs[param_name] = arg
                    positional_index += 1

            i += 1

        return kwargs

    def _show_help(self):
        """Show help message."""
        print(f"\n{self.name}")
        if self.description:
            print(f"  {self.description}")
        print("\nCommands:")
        for name, cmd in self.commands.items():
            print(f"  {name:15} {cmd.help}")
        print(f"\nRun '{self.name} <command> --help' for command help.")

    def _show_command_help(self, cmd: Command):
        """Show help for specific command."""
        print(f"\n{cmd.name}: {cmd.help}")
        sig = inspect.signature(cmd.func)
        hints = get_type_hints(cmd.func)

        if sig.parameters:
            print("\nArguments:")
            for name, param in sig.parameters.items():
                type_name = hints.get(name, Any).__name__ if name in hints else "any"
                default = f" (default: {param.default})" if param.default is not inspect.Parameter.empty else ""
                print(f"  --{name.replace('_', '-'):15} {type_name}{default}")

    def run(self, args: List[str] = None):
        """Run the CLI application."""
        args = args if args is not None else sys.argv[1:]

        if not args:
            if self._default_command:
                args = [self._default_command]
            else:
                self._show_help()
                return

        cmd_name = args[0]
        cmd_args = args[1:]

        if cmd_name in ("--help", "-h"):
            self._show_help()
            return

        if cmd_name not in self.commands:
            print(f"Unknown command: {cmd_name}")
            self._show_help()
            return

        cmd = self.commands[cmd_name]

        if "--help" in cmd_args or "-h" in cmd_args:
            self._show_command_help(cmd)
            return

        try:
            kwargs = self._parse_args(cmd_args, cmd.func)
            result = cmd.func(**kwargs)
            if result is not None:
                print(result)
        except Exception as e:
            print(f"Error: {e}")


# Example usage
cli = CLI("myapp", "A sample CLI application")

@cli.command(help="Greet someone")
def greet(name: str, times: int = 1, loud: bool = False):
    """Greet someone by name."""
    message = f"Hello, {name}!"
    if loud:
        message = message.upper()
    for _ in range(times):
        print(message)

@cli.command(help="Add two numbers")
def add(a: float, b: float) -> float:
    """Add two numbers together."""
    return a + b

@cli.command(help="List items")
def list_items(count: int = 5):
    """List some items."""
    for i in range(count):
        print(f"Item {i + 1}")

if __name__ == "__main__":
    # cli.run()  # Use command line args
    # Or test directly:
    cli.run(["greet", "World", "--times", "2", "--loud"])
    cli.run(["add", "10", "20"])
```

## Additional Exercises

### Exercise 4: Auto-Import System

Create a system that automatically imports all modules from a directory.

::: details Solution
```python
import importlib
import pkgutil
from pathlib import Path
from typing import Dict, Any, List

def auto_import(package_path: str, package_name: str = None) -> Dict[str, Any]:
    """
    Automatically import all modules from a package directory.

    Args:
        package_path: Path to the package directory
        package_name: Name to use for the package (default: directory name)

    Returns:
        Dictionary mapping module names to module objects
    """
    path = Path(package_path)
    if not path.exists():
        raise ValueError(f"Path does not exist: {package_path}")

    package_name = package_name or path.name
    modules = {}

    # Add path to sys.path temporarily
    import sys
    parent_path = str(path.parent)
    if parent_path not in sys.path:
        sys.path.insert(0, parent_path)

    try:
        # Import the package
        package = importlib.import_module(package_name)

        # Iterate over all modules in the package
        for importer, modname, ispkg in pkgutil.walk_packages(
            path=[str(path)],
            prefix=f"{package_name}."
        ):
            try:
                module = importlib.import_module(modname)
                modules[modname] = module
                print(f"Imported: {modname}")
            except ImportError as e:
                print(f"Failed to import {modname}: {e}")

    finally:
        # Clean up sys.path
        if parent_path in sys.path:
            sys.path.remove(parent_path)

    return modules


def collect_classes(modules: Dict[str, Any], base_class: type = None) -> List[type]:
    """
    Collect all classes from imported modules.

    Args:
        modules: Dictionary of imported modules
        base_class: Optional base class to filter by

    Returns:
        List of class objects
    """
    classes = []

    for module in modules.values():
        for name in dir(module):
            obj = getattr(module, name)
            if isinstance(obj, type):
                if base_class is None or issubclass(obj, base_class):
                    if obj is not base_class:
                        classes.append(obj)

    return classes


def collect_functions(modules: Dict[str, Any], prefix: str = None) -> Dict[str, callable]:
    """
    Collect all functions from imported modules.

    Args:
        modules: Dictionary of imported modules
        prefix: Optional prefix to filter function names

    Returns:
        Dictionary mapping function names to functions
    """
    import inspect
    functions = {}

    for module in modules.values():
        for name in dir(module):
            if name.startswith('_'):
                continue
            if prefix and not name.startswith(prefix):
                continue

            obj = getattr(module, name)
            if inspect.isfunction(obj):
                functions[name] = obj

    return functions


# Example usage
# modules = auto_import("./my_package")
# classes = collect_classes(modules, base_class=MyBaseClass)
# functions = collect_functions(modules, prefix="handle_")
```
:::

### Exercise 5: Module Hot Reloading

Create a system for hot-reloading modules during development.

::: details Solution
```python
import importlib
import sys
import time
from pathlib import Path
from typing import Dict, Callable, Any, Optional
from dataclasses import dataclass

@dataclass
class ModuleInfo:
    module: Any
    path: Path
    last_modified: float


class HotReloader:
    """
    Hot reload modules when they change on disk.
    Useful for development.
    """

    def __init__(self):
        self._modules: Dict[str, ModuleInfo] = {}
        self._callbacks: Dict[str, Callable] = {}

    def watch(self, module_name: str, callback: Callable = None) -> Any:
        """
        Start watching a module for changes.

        Args:
            module_name: Name of module to watch
            callback: Optional callback when module reloads

        Returns:
            The imported module
        """
        module = importlib.import_module(module_name)

        # Get module file path
        if hasattr(module, '__file__') and module.__file__:
            path = Path(module.__file__)
            self._modules[module_name] = ModuleInfo(
                module=module,
                path=path,
                last_modified=path.stat().st_mtime
            )
            if callback:
                self._callbacks[module_name] = callback

        return module

    def check_and_reload(self) -> list:
        """
        Check all watched modules and reload if changed.

        Returns:
            List of reloaded module names
        """
        reloaded = []

        for name, info in self._modules.items():
            if not info.path.exists():
                continue

            current_mtime = info.path.stat().st_mtime
            if current_mtime > info.last_modified:
                try:
                    # Reload the module
                    reloaded_module = importlib.reload(info.module)

                    # Update info
                    info.module = reloaded_module
                    info.last_modified = current_mtime

                    # Call callback if registered
                    if name in self._callbacks:
                        self._callbacks[name](reloaded_module)

                    reloaded.append(name)
                    print(f"Reloaded: {name}")

                except Exception as e:
                    print(f"Failed to reload {name}: {e}")

        return reloaded

    def unwatch(self, module_name: str):
        """Stop watching a module."""
        self._modules.pop(module_name, None)
        self._callbacks.pop(module_name, None)

    def start_watching(self, interval: float = 1.0):
        """
        Start continuous watching loop.

        Args:
            interval: Check interval in seconds
        """
        print(f"Watching {len(self._modules)} modules for changes...")
        try:
            while True:
                self.check_and_reload()
                time.sleep(interval)
        except KeyboardInterrupt:
            print("\nStopped watching.")


class ModuleProxy:
    """
    Proxy object that always returns the latest version of a module.
    """

    def __init__(self, reloader: HotReloader, module_name: str):
        object.__setattr__(self, '_reloader', reloader)
        object.__setattr__(self, '_module_name', module_name)

    def __getattr__(self, name: str):
        module = self._reloader._modules[self._module_name].module
        return getattr(module, name)

    def __setattr__(self, name: str, value: Any):
        module = self._reloader._modules[self._module_name].module
        setattr(module, name, value)


# Usage example
"""
# main.py
reloader = HotReloader()

# Watch a module
def on_reload(module):
    print(f"Module reloaded! New version loaded.")

my_module = reloader.watch('my_module', callback=on_reload)

# Use proxy for always-fresh access
proxy = ModuleProxy(reloader, 'my_module')

# In development loop
while True:
    reloader.check_and_reload()
    result = proxy.some_function()  # Always uses latest version
    time.sleep(1)
"""
```
:::

## Summary

| Concept | Description | Example |
|---------|-------------|---------|
| Module | Single .py file | `import math` |
| Package | Directory with `__init__.py` | `from pkg import mod` |
| Import | Load module | `import os` |
| From import | Import specific | `from os import path` |
| Alias | Rename import | `import numpy as np` |
| `__name__` | Module name | `if __name__ == "__main__"` |
| pip | Package installer | `pip install requests` |
| venv | Virtual environment | `python -m venv env` |

## Next Steps

Continue to [OOP](/guide/python/08-oop) to learn about object-oriented programming in Python.
