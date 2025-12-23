# Object-Oriented Programming

Object-Oriented Programming (OOP) is a programming paradigm that organizes code around objects and classes. Python is a fully object-oriented language.

::: info What You'll Learn
- Understand classes and objects
- Create and use class attributes and methods
- Implement inheritance and polymorphism
- Use encapsulation and abstraction
- Work with special methods (dunder methods)
:::

## Classes and Objects

```
┌─────────────────────────────────────────────────────────────────┐
│                Classes vs Objects                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   CLASS = Blueprint                OBJECT = Instance             │
│   ─────────────────                ──────────────────            │
│                                                                  │
│   class Dog:                       my_dog = Dog("Buddy", 3)      │
│       name                         my_dog.name = "Buddy"         │
│       age                          my_dog.age = 3                │
│       bark()                       my_dog.bark()                 │
│                                                                  │
│   ┌─────────────────┐             ┌─────────────────┐           │
│   │      Dog        │             │     my_dog      │           │
│   │   (Blueprint)   │ ──────────► │   (Instance)    │           │
│   │                 │  creates    │                 │           │
│   │  • name         │             │  name = "Buddy" │           │
│   │  • age          │             │  age = 3        │           │
│   │  • bark()       │             │  bark() ✓       │           │
│   └─────────────────┘             └─────────────────┘           │
│                                                                  │
│   One class can create many objects!                             │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Creating Classes

```python
class Dog:
    """A simple Dog class."""

    # Class attribute (shared by all instances)
    species = "Canis familiaris"

    # Constructor (initializer)
    def __init__(self, name, age):
        # Instance attributes (unique to each instance)
        self.name = name
        self.age = age

    # Instance method
    def bark(self):
        return f"{self.name} says Woof!"

    # Another instance method
    def description(self):
        return f"{self.name} is {self.age} years old"


# Creating objects (instances)
dog1 = Dog("Buddy", 3)
dog2 = Dog("Max", 5)

# Accessing attributes
print(dog1.name)           # Buddy
print(dog2.age)            # 5
print(dog1.species)        # Canis familiaris

# Calling methods
print(dog1.bark())         # Buddy says Woof!
print(dog2.description())  # Max is 5 years old
```

### The `self` Parameter

```python
class Person:
    def __init__(self, name):
        self.name = name  # self refers to the instance

    def greet(self):
        # self gives access to instance attributes
        return f"Hello, I'm {self.name}"

    def greet_other(self, other):
        return f"Hi {other.name}, I'm {self.name}"


alice = Person("Alice")
bob = Person("Bob")

print(alice.greet())              # Hello, I'm Alice
print(alice.greet_other(bob))     # Hi Bob, I'm Alice

# Behind the scenes:
# alice.greet() is equivalent to Person.greet(alice)
```

## Attributes

### Instance vs Class Attributes

```python
class Circle:
    # Class attribute
    pi = 3.14159

    def __init__(self, radius):
        # Instance attribute
        self.radius = radius

    def area(self):
        return Circle.pi * self.radius ** 2


c1 = Circle(5)
c2 = Circle(10)

# Instance attributes are unique
print(c1.radius)    # 5
print(c2.radius)    # 10

# Class attribute is shared
print(c1.pi)        # 3.14159
print(c2.pi)        # 3.14159
print(Circle.pi)    # 3.14159

# Changing class attribute affects all instances
Circle.pi = 3.14
print(c1.pi)        # 3.14
print(c2.pi)        # 3.14
```

### Property Decorator

```python
class Temperature:
    def __init__(self, celsius=0):
        self._celsius = celsius

    @property
    def celsius(self):
        """Get temperature in Celsius."""
        return self._celsius

    @celsius.setter
    def celsius(self, value):
        """Set temperature in Celsius."""
        if value < -273.15:
            raise ValueError("Temperature below absolute zero!")
        self._celsius = value

    @property
    def fahrenheit(self):
        """Get temperature in Fahrenheit (read-only)."""
        return self._celsius * 9/5 + 32


temp = Temperature(25)
print(temp.celsius)      # 25
print(temp.fahrenheit)   # 77.0

temp.celsius = 30        # Using setter
print(temp.celsius)      # 30

# temp.celsius = -300    # Raises ValueError!
# temp.fahrenheit = 100  # AttributeError (no setter)
```

## Methods

### Types of Methods

```python
class MyClass:
    class_attr = "I'm a class attribute"

    def __init__(self, value):
        self.instance_attr = value

    # Instance method - operates on instances
    def instance_method(self):
        return f"Instance: {self.instance_attr}"

    # Class method - operates on class
    @classmethod
    def class_method(cls):
        return f"Class: {cls.class_attr}"

    # Static method - independent utility
    @staticmethod
    def static_method(x, y):
        return x + y


obj = MyClass("hello")

# Instance method
print(obj.instance_method())     # Instance: hello

# Class method (can call on class or instance)
print(MyClass.class_method())    # Class: I'm a class attribute
print(obj.class_method())        # Class: I'm a class attribute

# Static method (can call on class or instance)
print(MyClass.static_method(3, 5))  # 8
print(obj.static_method(3, 5))      # 8
```

### Factory Methods with @classmethod

```python
class Date:
    def __init__(self, year, month, day):
        self.year = year
        self.month = month
        self.day = day

    @classmethod
    def from_string(cls, date_string):
        """Create Date from string 'YYYY-MM-DD'."""
        year, month, day = map(int, date_string.split("-"))
        return cls(year, month, day)

    @classmethod
    def today(cls):
        """Create Date for today."""
        from datetime import date
        today = date.today()
        return cls(today.year, today.month, today.day)

    def __str__(self):
        return f"{self.year}-{self.month:02d}-{self.day:02d}"


# Different ways to create Date objects
d1 = Date(2024, 1, 15)
d2 = Date.from_string("2024-06-20")
d3 = Date.today()

print(d1)  # 2024-01-15
print(d2)  # 2024-06-20
```

## Inheritance

```
┌─────────────────────────────────────────────────────────────────┐
│                    Inheritance Hierarchy                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│                      ┌─────────────┐                            │
│                      │   Animal    │  ← Parent/Base class       │
│                      │  ─────────  │                            │
│                      │  name       │                            │
│                      │  speak()    │                            │
│                      └─────────────┘                            │
│                             │                                    │
│              ┌──────────────┼──────────────┐                    │
│              │              │              │                    │
│              ▼              ▼              ▼                    │
│       ┌──────────┐   ┌──────────┐   ┌──────────┐               │
│       │   Dog    │   │   Cat    │   │   Bird   │ ← Child       │
│       │  ──────  │   │  ──────  │   │  ──────  │   classes     │
│       │  bark()  │   │  meow()  │   │  fly()   │               │
│       │  speak() │   │  speak() │   │  speak() │               │
│       └──────────┘   └──────────┘   └──────────┘               │
│                                                                  │
│   Child classes inherit attributes and methods from parent      │
│   Child classes can override parent methods                     │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Basic Inheritance

```python
class Animal:
    """Base class for animals."""

    def __init__(self, name):
        self.name = name

    def speak(self):
        raise NotImplementedError("Subclass must implement")

    def description(self):
        return f"I am {self.name}"


class Dog(Animal):
    """Dog class inheriting from Animal."""

    def __init__(self, name, breed):
        super().__init__(name)  # Call parent constructor
        self.breed = breed

    def speak(self):
        return f"{self.name} says Woof!"

    def fetch(self):
        return f"{self.name} is fetching the ball"


class Cat(Animal):
    """Cat class inheriting from Animal."""

    def speak(self):
        return f"{self.name} says Meow!"

    def scratch(self):
        return f"{self.name} is scratching"


# Using inheritance
dog = Dog("Buddy", "Golden Retriever")
cat = Cat("Whiskers")

print(dog.name)           # Buddy (inherited)
print(dog.breed)          # Golden Retriever (new attribute)
print(dog.speak())        # Buddy says Woof! (overridden)
print(dog.description())  # I am Buddy (inherited)
print(dog.fetch())        # Buddy is fetching the ball (new method)

print(cat.speak())        # Whiskers says Meow!
```

### Multiple Inheritance

```python
class Flyable:
    def fly(self):
        return "Flying high!"

class Swimmable:
    def swim(self):
        return "Swimming fast!"

class Duck(Animal, Flyable, Swimmable):
    def speak(self):
        return f"{self.name} says Quack!"


donald = Duck("Donald")
print(donald.speak())  # Donald says Quack!
print(donald.fly())    # Flying high!
print(donald.swim())   # Swimming fast!

# Method Resolution Order (MRO)
print(Duck.__mro__)
# (Duck, Animal, Flyable, Swimmable, object)
```

### super() Function

```python
class Parent:
    def __init__(self, name):
        self.name = name

    def greet(self):
        return f"Hello from {self.name}"


class Child(Parent):
    def __init__(self, name, age):
        super().__init__(name)  # Call parent's __init__
        self.age = age

    def greet(self):
        parent_greeting = super().greet()  # Call parent's method
        return f"{parent_greeting}, I am {self.age} years old"


child = Child("Alice", 10)
print(child.greet())  # Hello from Alice, I am 10 years old
```

## Encapsulation

```python
class BankAccount:
    """Bank account with encapsulation."""

    def __init__(self, owner, balance=0):
        self.owner = owner           # Public
        self._balance = balance      # Protected (convention)
        self.__pin = "1234"         # Private (name mangling)

    @property
    def balance(self):
        """Get balance (read-only from outside)."""
        return self._balance

    def deposit(self, amount):
        """Deposit money."""
        if amount > 0:
            self._balance += amount
            return True
        return False

    def withdraw(self, amount):
        """Withdraw money."""
        if 0 < amount <= self._balance:
            self._balance -= amount
            return True
        return False

    def _validate_pin(self, pin):
        """Protected method."""
        return pin == self.__pin

    def __process_transaction(self):
        """Private method (name mangled)."""
        pass


account = BankAccount("Alice", 1000)

# Public access
print(account.owner)        # Alice
print(account.balance)      # 1000 (via property)

# Protected (accessible but shouldn't be)
print(account._balance)     # 1000 (works but not recommended)

# Private (name mangled)
# print(account.__pin)      # AttributeError!
print(account._BankAccount__pin)  # 1234 (name mangling)
```

```
┌─────────────────────────────────────────────────────────────────┐
│                    Access Modifiers                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   Convention          Meaning           Example                  │
│   ──────────          ───────           ───────                  │
│   name                Public            self.name                │
│   _name               Protected         self._balance            │
│   __name              Private           self.__pin               │
│                                                                  │
│   Note: Python doesn't enforce these - they're conventions!     │
│   Private names use "name mangling" (_ClassName__name)          │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Polymorphism

```python
class Shape:
    def area(self):
        raise NotImplementedError

    def perimeter(self):
        raise NotImplementedError


class Rectangle(Shape):
    def __init__(self, width, height):
        self.width = width
        self.height = height

    def area(self):
        return self.width * self.height

    def perimeter(self):
        return 2 * (self.width + self.height)


class Circle(Shape):
    def __init__(self, radius):
        self.radius = radius

    def area(self):
        return 3.14159 * self.radius ** 2

    def perimeter(self):
        return 2 * 3.14159 * self.radius


# Polymorphism in action
shapes = [
    Rectangle(10, 5),
    Circle(7),
    Rectangle(3, 3)
]

# Same method call, different behavior
for shape in shapes:
    print(f"Area: {shape.area():.2f}, Perimeter: {shape.perimeter():.2f}")
```

## Special Methods (Dunder Methods)

### Common Special Methods

| Method | Description | Usage |
|--------|-------------|-------|
| `__init__` | Constructor | `obj = Class()` |
| `__str__` | String representation | `str(obj)`, `print(obj)` |
| `__repr__` | Developer representation | `repr(obj)` |
| `__len__` | Length | `len(obj)` |
| `__eq__` | Equality | `obj1 == obj2` |
| `__lt__` | Less than | `obj1 < obj2` |
| `__add__` | Addition | `obj1 + obj2` |
| `__getitem__` | Index access | `obj[key]` |
| `__iter__` | Iteration | `for x in obj` |
| `__call__` | Callable | `obj()` |

### Implementing Special Methods

```python
class Vector:
    """A 2D vector class with operator overloading."""

    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __str__(self):
        """Human-readable string."""
        return f"Vector({self.x}, {self.y})"

    def __repr__(self):
        """Developer representation."""
        return f"Vector({self.x!r}, {self.y!r})"

    def __eq__(self, other):
        """Equality comparison."""
        if not isinstance(other, Vector):
            return False
        return self.x == other.x and self.y == other.y

    def __add__(self, other):
        """Addition operator."""
        return Vector(self.x + other.x, self.y + other.y)

    def __sub__(self, other):
        """Subtraction operator."""
        return Vector(self.x - other.x, self.y - other.y)

    def __mul__(self, scalar):
        """Scalar multiplication."""
        return Vector(self.x * scalar, self.y * scalar)

    def __abs__(self):
        """Magnitude (length)."""
        return (self.x ** 2 + self.y ** 2) ** 0.5

    def __bool__(self):
        """Truth value."""
        return self.x != 0 or self.y != 0


v1 = Vector(3, 4)
v2 = Vector(1, 2)

print(v1)           # Vector(3, 4)
print(v1 + v2)      # Vector(4, 6)
print(v1 - v2)      # Vector(2, 2)
print(v1 * 3)       # Vector(9, 12)
print(abs(v1))      # 5.0
print(v1 == v2)     # False
print(bool(v1))     # True
```

### Making Objects Iterable

```python
class Countdown:
    """Iterable countdown class."""

    def __init__(self, start):
        self.start = start

    def __iter__(self):
        """Return iterator (self in this case)."""
        self.current = self.start
        return self

    def __next__(self):
        """Return next value."""
        if self.current < 0:
            raise StopIteration
        value = self.current
        self.current -= 1
        return value


# Use in for loop
for num in Countdown(5):
    print(num)  # 5, 4, 3, 2, 1, 0

# Convert to list
print(list(Countdown(3)))  # [3, 2, 1, 0]
```

## Abstract Classes

```python
from abc import ABC, abstractmethod

class Shape(ABC):
    """Abstract base class for shapes."""

    @abstractmethod
    def area(self):
        """Calculate area - must be implemented."""
        pass

    @abstractmethod
    def perimeter(self):
        """Calculate perimeter - must be implemented."""
        pass

    def description(self):
        """Concrete method - can be inherited."""
        return f"A shape with area {self.area()}"


class Rectangle(Shape):
    def __init__(self, width, height):
        self.width = width
        self.height = height

    def area(self):
        return self.width * self.height

    def perimeter(self):
        return 2 * (self.width + self.height)


# shape = Shape()  # TypeError: Can't instantiate abstract class
rect = Rectangle(10, 5)
print(rect.area())        # 50
print(rect.description()) # A shape with area 50
```

## Data Classes (Python 3.7+)

```python
from dataclasses import dataclass, field
from typing import List

@dataclass
class Person:
    """Person data class with automatic methods."""
    name: str
    age: int
    email: str = ""
    hobbies: List[str] = field(default_factory=list)

    def greet(self):
        return f"Hello, I'm {self.name}"


# Automatically generates __init__, __repr__, __eq__
p1 = Person("Alice", 25, "alice@email.com")
p2 = Person("Alice", 25, "alice@email.com")

print(p1)           # Person(name='Alice', age=25, ...)
print(p1 == p2)     # True
print(p1.greet())   # Hello, I'm Alice

# With frozen=True for immutable
@dataclass(frozen=True)
class Point:
    x: float
    y: float

p = Point(3.0, 4.0)
# p.x = 5.0  # FrozenInstanceError!
```

## Exercises

### Exercise 1: Create a Library System

Create classes for a simple library system.

::: details Solution
```python
from datetime import datetime, timedelta

class Book:
    def __init__(self, title, author, isbn):
        self.title = title
        self.author = author
        self.isbn = isbn
        self.is_borrowed = False
        self.due_date = None

    def __str__(self):
        status = "Available" if not self.is_borrowed else f"Due: {self.due_date}"
        return f"'{self.title}' by {self.author} [{status}]"

class Member:
    def __init__(self, name, member_id):
        self.name = name
        self.member_id = member_id
        self.borrowed_books = []

    def borrow_book(self, book, days=14):
        if book.is_borrowed:
            return False
        book.is_borrowed = True
        book.due_date = datetime.now() + timedelta(days=days)
        self.borrowed_books.append(book)
        return True

    def return_book(self, book):
        if book not in self.borrowed_books:
            return False
        book.is_borrowed = False
        book.due_date = None
        self.borrowed_books.remove(book)
        return True

class Library:
    def __init__(self, name):
        self.name = name
        self.books = []
        self.members = []

    def add_book(self, book):
        self.books.append(book)

    def add_member(self, member):
        self.members.append(member)

    def find_book(self, title):
        for book in self.books:
            if title.lower() in book.title.lower():
                return book
        return None

    def available_books(self):
        return [b for b in self.books if not b.is_borrowed]

# Test
library = Library("City Library")
library.add_book(Book("1984", "George Orwell", "123"))
library.add_book(Book("Brave New World", "Aldous Huxley", "456"))

member = Member("Alice", "M001")
library.add_member(member)

book = library.find_book("1984")
member.borrow_book(book)
print(book)  # '1984' by George Orwell [Due: ...]
```
:::

### Exercise 2: Create a Shape Hierarchy

Create a hierarchy of geometric shapes.

::: details Solution
```python
from abc import ABC, abstractmethod
import math

class Shape(ABC):
    @abstractmethod
    def area(self) -> float:
        pass

    @abstractmethod
    def perimeter(self) -> float:
        pass

    def __str__(self):
        return f"{self.__class__.__name__}(area={self.area():.2f})"

class Rectangle(Shape):
    def __init__(self, width, height):
        self.width = width
        self.height = height

    def area(self):
        return self.width * self.height

    def perimeter(self):
        return 2 * (self.width + self.height)

class Square(Rectangle):
    def __init__(self, side):
        super().__init__(side, side)

class Circle(Shape):
    def __init__(self, radius):
        self.radius = radius

    def area(self):
        return math.pi * self.radius ** 2

    def perimeter(self):
        return 2 * math.pi * self.radius

class Triangle(Shape):
    def __init__(self, a, b, c):
        self.a, self.b, self.c = a, b, c

    def area(self):
        s = self.perimeter() / 2
        return math.sqrt(s * (s-self.a) * (s-self.b) * (s-self.c))

    def perimeter(self):
        return self.a + self.b + self.c

# Test
shapes = [Rectangle(10, 5), Square(4), Circle(3), Triangle(3, 4, 5)]
for shape in shapes:
    print(f"{shape}: perimeter={shape.perimeter():.2f}")
```
:::

## Quick Reference

::: tip OOP Cheat Sheet
```python
# Class definition
class MyClass:
    class_attr = "shared"

    def __init__(self, value):
        self.instance_attr = value

    def method(self):
        return self.instance_attr

    @classmethod
    def class_method(cls):
        return cls.class_attr

    @staticmethod
    def static_method():
        return "independent"

    @property
    def prop(self):
        return self._value

# Inheritance
class Child(Parent):
    def __init__(self, value):
        super().__init__(value)

# Multiple inheritance
class Child(Parent1, Parent2):
    pass

# Abstract class
from abc import ABC, abstractmethod
class Abstract(ABC):
    @abstractmethod
    def must_implement(self):
        pass

# Data class
from dataclasses import dataclass
@dataclass
class Data:
    name: str
    value: int = 0
```
:::

## Common Mistakes

### ❌ WRONG: Forgetting to call parent's __init__

```python
# ❌ WRONG - Parent attributes not initialized
class Parent:
    def __init__(self, name):
        self.name = name

class Child(Parent):
    def __init__(self, name, age):
        self.age = age  # Forgot to call parent's __init__!

child = Child("Alice", 10)
print(child.name)  # AttributeError!

# ✓ CORRECT - Always call parent's __init__
class Child(Parent):
    def __init__(self, name, age):
        super().__init__(name)  # Call parent's __init__
        self.age = age
```

### ❌ WRONG: Mutable default arguments in classes

```python
# ❌ WRONG - All instances share the same list!
class Team:
    def __init__(self, members=[]):
        self.members = members

team1 = Team()
team1.members.append("Alice")
team2 = Team()
print(team2.members)  # ['Alice'] - shared with team1!

# ✓ CORRECT - Use None and create new list
class Team:
    def __init__(self, members=None):
        self.members = members if members is not None else []
```

### ❌ WRONG: Using class attributes when instance attributes are needed

```python
# ❌ WRONG - All instances share the same list
class Student:
    grades = []  # Class attribute, shared!

s1 = Student()
s1.grades.append(90)
s2 = Student()
print(s2.grades)  # [90] - shared with s1!

# ✓ CORRECT - Use instance attributes
class Student:
    def __init__(self):
        self.grades = []  # Instance attribute, unique
```

### ❌ WRONG: Not understanding method resolution order (MRO)

```python
# ❌ WRONG - Diamond problem confusion
class A:
    def greet(self):
        print("A")

class B(A):
    def greet(self):
        print("B")
        A.greet(self)  # Hardcoded call to A

class C(A):
    def greet(self):
        print("C")
        A.greet(self)  # Hardcoded call to A

class D(B, C):
    def greet(self):
        print("D")
        B.greet(self)
        C.greet(self)  # A.greet called twice!

# ✓ CORRECT - Use super() for proper MRO
class B(A):
    def greet(self):
        print("B")
        super().greet()

class C(A):
    def greet(self):
        print("C")
        super().greet()

class D(B, C):
    def greet(self):
        print("D")
        super().greet()  # Follows MRO: D -> B -> C -> A
```

### ❌ WRONG: Overriding __eq__ without __hash__

```python
# ❌ WRONG - Object becomes unhashable
class Person:
    def __init__(self, name):
        self.name = name

    def __eq__(self, other):
        return self.name == other.name
    # Missing __hash__!

person = Person("Alice")
{person}  # TypeError: unhashable type

# ✓ CORRECT - Implement __hash__ with __eq__
class Person:
    def __init__(self, name):
        self.name = name

    def __eq__(self, other):
        return isinstance(other, Person) and self.name == other.name

    def __hash__(self):
        return hash(self.name)
```

## Python vs JavaScript

| Concept | Python | JavaScript |
|---------|--------|------------|
| Class definition | `class Dog:` | `class Dog {` |
| Constructor | `def __init__(self):` | `constructor() {` |
| Instance attribute | `self.name = name` | `this.name = name` |
| Instance method | `def bark(self):` | `bark() {` |
| Static method | `@staticmethod` | `static method() {` |
| Class method | `@classmethod` | N/A (use static) |
| Inheritance | `class Child(Parent):` | `class Child extends Parent {` |
| Call parent | `super().__init__()` | `super()` |
| Private (convention) | `self._private` | `#private` (ES2020) |
| Property getter | `@property` | `get prop() {` |
| Property setter | `@prop.setter` | `set prop(v) {` |
| Abstract class | `ABC`, `@abstractmethod` | N/A (use interfaces) |
| Multiple inheritance | `class C(A, B):` | N/A (mixins via Object.assign) |
| Check instance | `isinstance(obj, Class)` | `obj instanceof Class` |
| Get class | `type(obj)` or `obj.__class__` | `obj.constructor` |
| Method overriding | Implicit | Implicit |
| Operator overloading | `__add__`, `__eq__`, etc. | N/A (limited) |

## Real-World Examples

### Example 1: E-commerce Product System

```python
from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from datetime import datetime
from typing import List, Optional, Dict
from decimal import Decimal
from enum import Enum, auto

class ProductStatus(Enum):
    DRAFT = auto()
    ACTIVE = auto()
    OUT_OF_STOCK = auto()
    DISCONTINUED = auto()


@dataclass
class Review:
    user_id: str
    rating: int  # 1-5
    comment: str
    created_at: datetime = field(default_factory=datetime.now)


class Product(ABC):
    """Abstract base class for all products."""

    def __init__(self, id: str, name: str, price: Decimal, description: str = ""):
        self._id = id
        self._name = name
        self._price = price
        self._description = description
        self._status = ProductStatus.DRAFT
        self._reviews: List[Review] = []
        self._created_at = datetime.now()

    @property
    def id(self) -> str:
        return self._id

    @property
    def name(self) -> str:
        return self._name

    @name.setter
    def name(self, value: str):
        if not value or len(value) < 2:
            raise ValueError("Name must be at least 2 characters")
        self._name = value

    @property
    def price(self) -> Decimal:
        return self._price

    @price.setter
    def price(self, value: Decimal):
        if value < 0:
            raise ValueError("Price cannot be negative")
        self._price = value

    @property
    def status(self) -> ProductStatus:
        return self._status

    @property
    def average_rating(self) -> float:
        if not self._reviews:
            return 0.0
        return sum(r.rating for r in self._reviews) / len(self._reviews)

    def add_review(self, user_id: str, rating: int, comment: str):
        if not 1 <= rating <= 5:
            raise ValueError("Rating must be between 1 and 5")
        self._reviews.append(Review(user_id, rating, comment))

    def activate(self):
        self._status = ProductStatus.ACTIVE

    def deactivate(self):
        self._status = ProductStatus.DISCONTINUED

    @abstractmethod
    def calculate_shipping_weight(self) -> float:
        """Calculate shipping weight in kg."""
        pass

    @abstractmethod
    def get_details(self) -> Dict:
        """Get product-specific details."""
        pass

    def to_dict(self) -> Dict:
        return {
            "id": self._id,
            "name": self._name,
            "price": str(self._price),
            "status": self._status.name,
            "average_rating": self.average_rating,
            "review_count": len(self._reviews),
            "details": self.get_details(),
        }


class PhysicalProduct(Product):
    """Product that requires shipping."""

    def __init__(self, id: str, name: str, price: Decimal,
                 weight: float, dimensions: tuple, **kwargs):
        super().__init__(id, name, price, **kwargs)
        self._weight = weight  # kg
        self._dimensions = dimensions  # (length, width, height) in cm
        self._stock = 0

    @property
    def stock(self) -> int:
        return self._stock

    def add_stock(self, quantity: int):
        if quantity < 0:
            raise ValueError("Quantity must be positive")
        self._stock += quantity
        if self._stock > 0 and self._status == ProductStatus.OUT_OF_STOCK:
            self._status = ProductStatus.ACTIVE

    def remove_stock(self, quantity: int) -> bool:
        if quantity > self._stock:
            return False
        self._stock -= quantity
        if self._stock == 0:
            self._status = ProductStatus.OUT_OF_STOCK
        return True

    def calculate_shipping_weight(self) -> float:
        # Add 10% for packaging
        return self._weight * 1.1

    def get_details(self) -> Dict:
        return {
            "type": "physical",
            "weight": self._weight,
            "dimensions": self._dimensions,
            "stock": self._stock,
        }


class DigitalProduct(Product):
    """Product that is delivered digitally."""

    def __init__(self, id: str, name: str, price: Decimal,
                 file_size_mb: float, download_limit: int = -1, **kwargs):
        super().__init__(id, name, price, **kwargs)
        self._file_size_mb = file_size_mb
        self._download_limit = download_limit  # -1 for unlimited

    def calculate_shipping_weight(self) -> float:
        return 0.0  # No physical shipping

    def get_details(self) -> Dict:
        return {
            "type": "digital",
            "file_size_mb": self._file_size_mb,
            "download_limit": self._download_limit,
        }


class SubscriptionProduct(Product):
    """Product with recurring billing."""

    def __init__(self, id: str, name: str, price: Decimal,
                 billing_period_days: int, trial_days: int = 0, **kwargs):
        super().__init__(id, name, price, **kwargs)
        self._billing_period_days = billing_period_days
        self._trial_days = trial_days

    def calculate_shipping_weight(self) -> float:
        return 0.0

    def get_details(self) -> Dict:
        return {
            "type": "subscription",
            "billing_period_days": self._billing_period_days,
            "trial_days": self._trial_days,
            "monthly_price": str(self._price * 30 / self._billing_period_days),
        }


# Usage
physical = PhysicalProduct(
    "PROD001", "Laptop", Decimal("999.99"),
    weight=2.5, dimensions=(35, 25, 2)
)
physical.add_stock(50)
physical.activate()
physical.add_review("user123", 5, "Great laptop!")
print(physical.to_dict())

digital = DigitalProduct(
    "PROD002", "Python Course", Decimal("49.99"),
    file_size_mb=500, download_limit=5
)
digital.activate()
print(digital.to_dict())

subscription = SubscriptionProduct(
    "PROD003", "Premium Plan", Decimal("9.99"),
    billing_period_days=30, trial_days=14
)
subscription.activate()
print(subscription.to_dict())
```

### Example 2: Event System with Observer Pattern

```python
from abc import ABC, abstractmethod
from typing import Callable, Dict, List, Any, Optional
from dataclasses import dataclass, field
from datetime import datetime
from enum import Enum, auto
import weakref

class EventPriority(Enum):
    LOW = 1
    NORMAL = 2
    HIGH = 3
    CRITICAL = 4


@dataclass
class Event:
    """Base event class."""
    name: str
    data: Dict[str, Any] = field(default_factory=dict)
    timestamp: datetime = field(default_factory=datetime.now)
    _propagation_stopped: bool = field(default=False, repr=False)

    def stop_propagation(self):
        self._propagation_stopped = True

    @property
    def is_propagation_stopped(self) -> bool:
        return self._propagation_stopped


class EventListener(ABC):
    """Abstract base class for event listeners."""

    @abstractmethod
    def handle(self, event: Event) -> None:
        pass

    @property
    def priority(self) -> EventPriority:
        return EventPriority.NORMAL


class EventEmitter:
    """Event emitter with support for listeners and handlers."""

    def __init__(self):
        self._listeners: Dict[str, List[tuple]] = {}
        self._once_listeners: Dict[str, List[tuple]] = {}

    def on(self, event_name: str, handler: Callable[[Event], None],
           priority: EventPriority = EventPriority.NORMAL) -> 'EventEmitter':
        """Register a persistent event handler."""
        if event_name not in self._listeners:
            self._listeners[event_name] = []
        self._listeners[event_name].append((handler, priority))
        self._sort_listeners(event_name)
        return self

    def once(self, event_name: str, handler: Callable[[Event], None],
             priority: EventPriority = EventPriority.NORMAL) -> 'EventEmitter':
        """Register a one-time event handler."""
        if event_name not in self._once_listeners:
            self._once_listeners[event_name] = []
        self._once_listeners[event_name].append((handler, priority))
        return self

    def off(self, event_name: str, handler: Callable = None) -> 'EventEmitter':
        """Remove event handlers."""
        if handler is None:
            self._listeners.pop(event_name, None)
            self._once_listeners.pop(event_name, None)
        else:
            if event_name in self._listeners:
                self._listeners[event_name] = [
                    (h, p) for h, p in self._listeners[event_name]
                    if h != handler
                ]
        return self

    def emit(self, event_name: str, data: Dict[str, Any] = None) -> Event:
        """Emit an event."""
        event = Event(name=event_name, data=data or {})

        # Get all handlers sorted by priority
        handlers = []
        if event_name in self._listeners:
            handlers.extend(self._listeners[event_name])
        if event_name in self._once_listeners:
            handlers.extend(self._once_listeners.pop(event_name, []))

        handlers.sort(key=lambda x: x[1].value, reverse=True)

        # Execute handlers
        for handler, _ in handlers:
            if event.is_propagation_stopped:
                break
            try:
                handler(event)
            except Exception as e:
                print(f"Error in event handler: {e}")

        return event

    def _sort_listeners(self, event_name: str):
        if event_name in self._listeners:
            self._listeners[event_name].sort(
                key=lambda x: x[1].value, reverse=True
            )


class Observable:
    """Mixin class to make any class observable."""

    def __init__(self):
        self._emitter = EventEmitter()
        self._observers: List[weakref.ref] = []

    def add_observer(self, observer: 'Observer') -> None:
        self._observers.append(weakref.ref(observer))

    def remove_observer(self, observer: 'Observer') -> None:
        self._observers = [
            ref for ref in self._observers
            if ref() is not None and ref() != observer
        ]

    def notify_observers(self, event_name: str, data: Dict = None):
        # Clean up dead references
        self._observers = [ref for ref in self._observers if ref() is not None]

        for ref in self._observers:
            observer = ref()
            if observer:
                observer.update(self, event_name, data or {})


class Observer(ABC):
    """Abstract observer class."""

    @abstractmethod
    def update(self, subject: Observable, event_name: str, data: Dict) -> None:
        pass


# Example: Stock price monitoring
class Stock(Observable):
    def __init__(self, symbol: str, price: float):
        super().__init__()
        self.symbol = symbol
        self._price = price

    @property
    def price(self) -> float:
        return self._price

    @price.setter
    def price(self, value: float):
        old_price = self._price
        self._price = value
        change = value - old_price
        self.notify_observers("price_changed", {
            "symbol": self.symbol,
            "old_price": old_price,
            "new_price": value,
            "change": change,
            "change_percent": (change / old_price) * 100 if old_price else 0
        })


class PriceAlert(Observer):
    def __init__(self, name: str, threshold_percent: float):
        self.name = name
        self.threshold_percent = threshold_percent

    def update(self, subject: Observable, event_name: str, data: Dict):
        if event_name == "price_changed":
            if abs(data["change_percent"]) >= self.threshold_percent:
                direction = "up" if data["change"] > 0 else "down"
                print(f"[{self.name}] ALERT: {data['symbol']} is {direction} "
                      f"{abs(data['change_percent']):.2f}%!")


# Usage
stock = Stock("AAPL", 150.0)

alert_5 = PriceAlert("5% Alert", 5.0)
alert_10 = PriceAlert("10% Alert", 10.0)

stock.add_observer(alert_5)
stock.add_observer(alert_10)

stock.price = 157.0  # 5% Alert triggers
stock.price = 175.0  # Both alerts trigger
```

### Example 3: Repository Pattern for Data Access

```python
from abc import ABC, abstractmethod
from typing import TypeVar, Generic, List, Optional, Dict, Any
from dataclasses import dataclass, field, asdict
from datetime import datetime
import json
from pathlib import Path

T = TypeVar('T')

@dataclass
class Entity:
    """Base entity class."""
    id: Optional[str] = None
    created_at: datetime = field(default_factory=datetime.now)
    updated_at: datetime = field(default_factory=datetime.now)


class Repository(ABC, Generic[T]):
    """Abstract repository interface."""

    @abstractmethod
    def find_by_id(self, id: str) -> Optional[T]:
        pass

    @abstractmethod
    def find_all(self) -> List[T]:
        pass

    @abstractmethod
    def save(self, entity: T) -> T:
        pass

    @abstractmethod
    def delete(self, id: str) -> bool:
        pass

    @abstractmethod
    def exists(self, id: str) -> bool:
        pass


class InMemoryRepository(Repository[T]):
    """In-memory repository implementation."""

    def __init__(self):
        self._storage: Dict[str, T] = {}
        self._id_counter = 0

    def _generate_id(self) -> str:
        self._id_counter += 1
        return str(self._id_counter)

    def find_by_id(self, id: str) -> Optional[T]:
        return self._storage.get(id)

    def find_all(self) -> List[T]:
        return list(self._storage.values())

    def save(self, entity: T) -> T:
        if entity.id is None:
            entity.id = self._generate_id()
        entity.updated_at = datetime.now()
        self._storage[entity.id] = entity
        return entity

    def delete(self, id: str) -> bool:
        if id in self._storage:
            del self._storage[id]
            return True
        return False

    def exists(self, id: str) -> bool:
        return id in self._storage


class FileRepository(Repository[T]):
    """File-based repository implementation."""

    def __init__(self, file_path: str, entity_class: type):
        self._file_path = Path(file_path)
        self._entity_class = entity_class
        self._ensure_file()

    def _ensure_file(self):
        if not self._file_path.exists():
            self._file_path.parent.mkdir(parents=True, exist_ok=True)
            self._save_data({})

    def _load_data(self) -> Dict[str, Dict]:
        with open(self._file_path, 'r') as f:
            return json.load(f)

    def _save_data(self, data: Dict):
        with open(self._file_path, 'w') as f:
            json.dump(data, f, indent=2, default=str)

    def _to_entity(self, data: Dict) -> T:
        # Convert datetime strings back to datetime objects
        if 'created_at' in data and isinstance(data['created_at'], str):
            data['created_at'] = datetime.fromisoformat(data['created_at'])
        if 'updated_at' in data and isinstance(data['updated_at'], str):
            data['updated_at'] = datetime.fromisoformat(data['updated_at'])
        return self._entity_class(**data)

    def find_by_id(self, id: str) -> Optional[T]:
        data = self._load_data()
        if id in data:
            return self._to_entity(data[id])
        return None

    def find_all(self) -> List[T]:
        data = self._load_data()
        return [self._to_entity(item) for item in data.values()]

    def save(self, entity: T) -> T:
        data = self._load_data()
        if entity.id is None:
            entity.id = str(len(data) + 1)
        entity.updated_at = datetime.now()
        data[entity.id] = asdict(entity)
        self._save_data(data)
        return entity

    def delete(self, id: str) -> bool:
        data = self._load_data()
        if id in data:
            del data[id]
            self._save_data(data)
            return True
        return False

    def exists(self, id: str) -> bool:
        data = self._load_data()
        return id in data


# Example: User entity and repository
@dataclass
class User(Entity):
    username: str = ""
    email: str = ""
    role: str = "user"


class UserRepository(InMemoryRepository[User]):
    """User-specific repository with additional methods."""

    def find_by_username(self, username: str) -> Optional[User]:
        for user in self._storage.values():
            if user.username == username:
                return user
        return None

    def find_by_email(self, email: str) -> Optional[User]:
        for user in self._storage.values():
            if user.email == email:
                return user
        return None

    def find_by_role(self, role: str) -> List[User]:
        return [u for u in self._storage.values() if u.role == role]


# Usage
repo = UserRepository()

# Create users
user1 = repo.save(User(username="alice", email="alice@email.com", role="admin"))
user2 = repo.save(User(username="bob", email="bob@email.com"))
user3 = repo.save(User(username="charlie", email="charlie@email.com"))

print(f"All users: {len(repo.find_all())}")
print(f"Admin: {repo.find_by_username('alice')}")
print(f"Admins: {repo.find_by_role('admin')}")

# Update user
user2.role = "moderator"
repo.save(user2)
print(f"Bob updated: {repo.find_by_id(user2.id)}")

# Delete user
repo.delete(user3.id)
print(f"After delete: {len(repo.find_all())}")
```

## Additional Exercises

### Exercise 3: State Machine

Create a state machine implementation for order processing.

::: details Solution
```python
from abc import ABC, abstractmethod
from typing import Dict, List, Optional, Callable
from dataclasses import dataclass
from datetime import datetime
from enum import Enum, auto

class OrderState(Enum):
    PENDING = auto()
    CONFIRMED = auto()
    PROCESSING = auto()
    SHIPPED = auto()
    DELIVERED = auto()
    CANCELLED = auto()


class StateTransitionError(Exception):
    pass


@dataclass
class StateTransition:
    from_state: OrderState
    to_state: OrderState
    timestamp: datetime
    reason: str = ""


class OrderStateMachine:
    """State machine for order processing."""

    # Define allowed transitions
    TRANSITIONS: Dict[OrderState, List[OrderState]] = {
        OrderState.PENDING: [OrderState.CONFIRMED, OrderState.CANCELLED],
        OrderState.CONFIRMED: [OrderState.PROCESSING, OrderState.CANCELLED],
        OrderState.PROCESSING: [OrderState.SHIPPED, OrderState.CANCELLED],
        OrderState.SHIPPED: [OrderState.DELIVERED],
        OrderState.DELIVERED: [],
        OrderState.CANCELLED: [],
    }

    def __init__(self, initial_state: OrderState = OrderState.PENDING):
        self._state = initial_state
        self._history: List[StateTransition] = []
        self._callbacks: Dict[OrderState, List[Callable]] = {}

    @property
    def state(self) -> OrderState:
        return self._state

    @property
    def history(self) -> List[StateTransition]:
        return self._history.copy()

    def can_transition_to(self, new_state: OrderState) -> bool:
        return new_state in self.TRANSITIONS.get(self._state, [])

    def transition_to(self, new_state: OrderState, reason: str = "") -> bool:
        if not self.can_transition_to(new_state):
            raise StateTransitionError(
                f"Cannot transition from {self._state.name} to {new_state.name}"
            )

        old_state = self._state
        self._state = new_state

        # Record transition
        self._history.append(StateTransition(
            from_state=old_state,
            to_state=new_state,
            timestamp=datetime.now(),
            reason=reason
        ))

        # Execute callbacks
        for callback in self._callbacks.get(new_state, []):
            callback(old_state, new_state)

        return True

    def on_enter(self, state: OrderState, callback: Callable):
        if state not in self._callbacks:
            self._callbacks[state] = []
        self._callbacks[state].append(callback)


class Order:
    """Order with state machine."""

    def __init__(self, order_id: str, customer_id: str, items: List[Dict]):
        self.order_id = order_id
        self.customer_id = customer_id
        self.items = items
        self._state_machine = OrderStateMachine()

        # Register callbacks
        self._state_machine.on_enter(OrderState.CONFIRMED, self._on_confirmed)
        self._state_machine.on_enter(OrderState.SHIPPED, self._on_shipped)

    @property
    def state(self) -> OrderState:
        return self._state_machine.state

    def confirm(self) -> bool:
        return self._state_machine.transition_to(
            OrderState.CONFIRMED, "Payment received"
        )

    def process(self) -> bool:
        return self._state_machine.transition_to(
            OrderState.PROCESSING, "Started packing"
        )

    def ship(self, tracking_number: str) -> bool:
        self.tracking_number = tracking_number
        return self._state_machine.transition_to(
            OrderState.SHIPPED, f"Tracking: {tracking_number}"
        )

    def deliver(self) -> bool:
        return self._state_machine.transition_to(
            OrderState.DELIVERED, "Package delivered"
        )

    def cancel(self, reason: str) -> bool:
        return self._state_machine.transition_to(
            OrderState.CANCELLED, reason
        )

    def _on_confirmed(self, old_state, new_state):
        print(f"Order {self.order_id}: Sending confirmation email...")

    def _on_shipped(self, old_state, new_state):
        print(f"Order {self.order_id}: Sending shipping notification...")


# Usage
order = Order("ORD001", "CUST001", [{"product": "Widget", "qty": 2}])

print(f"Initial state: {order.state.name}")
order.confirm()
print(f"After confirm: {order.state.name}")
order.process()
order.ship("TRACK123")
order.deliver()

print("\nTransition history:")
for t in order._state_machine.history:
    print(f"  {t.from_state.name} -> {t.to_state.name}: {t.reason}")
```
:::

## Summary

| Concept | Description | Example |
|---------|-------------|---------|
| Class | Blueprint for objects | `class Dog:` |
| Object | Instance of class | `dog = Dog()` |
| `__init__` | Constructor | `def __init__(self):` |
| Inheritance | Extend classes | `class Child(Parent):` |
| `super()` | Call parent method | `super().__init__()` |
| Encapsulation | Hide implementation | `self._protected` |
| Polymorphism | Same interface, different behavior | Method overriding |
| Abstract | Cannot instantiate | `ABC`, `@abstractmethod` |

## Next Steps

Continue to [Exceptions](/guide/python/09-exceptions) to learn about error handling in Python.
