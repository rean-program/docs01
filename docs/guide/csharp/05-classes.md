# Classes & Objects

Learn the fundamentals of object-oriented programming with classes and objects in C#.

::: info What You'll Learn
- Creating classes and objects
- Fields, properties, and methods
- Constructors and initialization
- Access modifiers
- Static members
:::

## What are Classes and Objects?

A **class** is a blueprint for creating objects. An **object** is an instance of a class.

```
┌─────────────────────────────────────────────────────────┐
│                    Class: Car                            │
├─────────────────────────────────────────────────────────┤
│  Properties (Data):                                      │
│    - Brand                                               │
│    - Model                                               │
│    - Year                                                │
├─────────────────────────────────────────────────────────┤
│  Methods (Behavior):                                     │
│    - Start()                                             │
│    - Stop()                                              │
│    - Accelerate()                                        │
└─────────────────────────────────────────────────────────┘
           │                    │                    │
           ▼                    ▼                    ▼
    ┌───────────┐        ┌───────────┐        ┌───────────┐
    │ Object 1  │        │ Object 2  │        │ Object 3  │
    │ Toyota    │        │ Honda     │        │ Ford      │
    │ Camry     │        │ Civic     │        │ Mustang   │
    │ 2023      │        │ 2022      │        │ 2024      │
    └───────────┘        └───────────┘        └───────────┘
```

## Creating a Class

```csharp
// Define a class
class Person
{
    // Fields (private by default)
    private string name;
    private int age;

    // Properties (public access to private fields)
    public string Name
    {
        get { return name; }
        set { name = value; }
    }

    public int Age
    {
        get { return age; }
        set { age = value; }
    }

    // Method
    public void Introduce()
    {
        Console.WriteLine($"Hi, I'm {name} and I'm {age} years old.");
    }
}
```

## Creating Objects

```csharp
// Create an instance (object) of the class
Person person1 = new Person();
person1.Name = "Alice";
person1.Age = 28;
person1.Introduce();  // Hi, I'm Alice and I'm 28 years old.

// Another way to create and initialize
Person person2 = new Person
{
    Name = "Bob",
    Age = 32
};
person2.Introduce();
```

## Auto-Implemented Properties

```csharp
class Person
{
    // Short syntax - compiler creates the backing field
    public string Name { get; set; }
    public int Age { get; set; }

    // Read-only property
    public DateTime CreatedAt { get; } = DateTime.Now;

    // Property with different access levels
    public string Id { get; private set; }

    // Computed property (no setter)
    public bool IsAdult => Age >= 18;
}
```

## Constructors

### Default Constructor

```csharp
class Person
{
    public string Name { get; set; }
    public int Age { get; set; }

    // Constructor - runs when object is created
    public Person()
    {
        Name = "Unknown";
        Age = 0;
        Console.WriteLine("Person created!");
    }
}

Person p = new Person();  // "Person created!"
```

### Parameterized Constructor

```csharp
class Person
{
    public string Name { get; set; }
    public int Age { get; set; }

    // Constructor with parameters
    public Person(string name, int age)
    {
        Name = name;
        Age = age;
    }
}

Person p = new Person("Alice", 28);
```

### Constructor Overloading

```csharp
class Person
{
    public string Name { get; set; }
    public int Age { get; set; }
    public string Email { get; set; }

    // Multiple constructors
    public Person()
    {
        Name = "Unknown";
    }

    public Person(string name) : this()
    {
        Name = name;
    }

    public Person(string name, int age) : this(name)
    {
        Age = age;
    }

    public Person(string name, int age, string email) : this(name, age)
    {
        Email = email;
    }
}
```

### Primary Constructor (C# 12+)

```csharp
class Person(string name, int age)
{
    public string Name { get; } = name;
    public int Age { get; } = age;

    public void Introduce() => Console.WriteLine($"Hi, I'm {Name}");
}
```

## Access Modifiers

| Modifier | Description |
|----------|-------------|
| `public` | Accessible from anywhere |
| `private` | Only within the same class |
| `protected` | Within class and derived classes |
| `internal` | Within the same assembly |
| `protected internal` | Assembly or derived classes |
| `private protected` | Derived classes in same assembly |

```csharp
class BankAccount
{
    private decimal balance;        // Only this class
    public string AccountNumber { get; }  // Everyone
    protected string Pin { get; set; }    // This and subclasses

    public decimal GetBalance() => balance;  // Safe access
}
```

## Static Members

```csharp
class Counter
{
    // Static field - shared by all instances
    private static int count = 0;

    // Instance field - unique to each object
    public int Id { get; }

    public Counter()
    {
        count++;
        Id = count;
    }

    // Static property
    public static int TotalCount => count;

    // Static method
    public static void Reset()
    {
        count = 0;
    }
}

var c1 = new Counter();  // Id = 1
var c2 = new Counter();  // Id = 2
var c3 = new Counter();  // Id = 3

Console.WriteLine(Counter.TotalCount);  // 3
Counter.Reset();
Console.WriteLine(Counter.TotalCount);  // 0
```

### Static Classes

```csharp
// Cannot be instantiated
static class MathHelper
{
    public static double Pi => 3.14159;

    public static int Square(int x) => x * x;

    public static int Max(int a, int b) => a > b ? a : b;
}

// Usage
int result = MathHelper.Square(5);  // 25
```

## The this Keyword

```csharp
class Rectangle
{
    private int width;
    private int height;

    public Rectangle(int width, int height)
    {
        // 'this' distinguishes field from parameter
        this.width = width;
        this.height = height;
    }

    // Method chaining with 'this'
    public Rectangle SetWidth(int width)
    {
        this.width = width;
        return this;
    }

    public Rectangle SetHeight(int height)
    {
        this.height = height;
        return this;
    }

    public int Area() => width * height;
}

// Method chaining
var rect = new Rectangle(0, 0)
    .SetWidth(10)
    .SetHeight(5);
Console.WriteLine(rect.Area());  // 50
```

## Complete Example

```csharp
using System;
using System.Collections.Generic;

class BankAccount
{
    // Static counter for account numbers
    private static int nextAccountNumber = 1000;

    // Properties
    public string AccountNumber { get; }
    public string Owner { get; }
    public decimal Balance { get; private set; }

    // Transaction history
    private List<string> transactions = new List<string>();

    // Constructor
    public BankAccount(string owner, decimal initialDeposit = 0)
    {
        AccountNumber = $"ACC{nextAccountNumber++}";
        Owner = owner;
        Balance = initialDeposit;

        if (initialDeposit > 0)
        {
            RecordTransaction($"Initial deposit: ${initialDeposit:F2}");
        }
    }

    // Methods
    public void Deposit(decimal amount)
    {
        if (amount <= 0)
        {
            Console.WriteLine("Deposit amount must be positive.");
            return;
        }

        Balance += amount;
        RecordTransaction($"Deposit: +${amount:F2}");
        Console.WriteLine($"Deposited ${amount:F2}. New balance: ${Balance:F2}");
    }

    public bool Withdraw(decimal amount)
    {
        if (amount <= 0)
        {
            Console.WriteLine("Withdrawal amount must be positive.");
            return false;
        }

        if (amount > Balance)
        {
            Console.WriteLine("Insufficient funds.");
            return false;
        }

        Balance -= amount;
        RecordTransaction($"Withdrawal: -${amount:F2}");
        Console.WriteLine($"Withdrew ${amount:F2}. New balance: ${Balance:F2}");
        return true;
    }

    public void PrintStatement()
    {
        Console.WriteLine($"\n=== Account Statement ===");
        Console.WriteLine($"Account: {AccountNumber}");
        Console.WriteLine($"Owner: {Owner}");
        Console.WriteLine($"Current Balance: ${Balance:F2}");
        Console.WriteLine("\nTransactions:");
        foreach (var transaction in transactions)
        {
            Console.WriteLine($"  {transaction}");
        }
    }

    private void RecordTransaction(string description)
    {
        transactions.Add($"{DateTime.Now:g} - {description}");
    }

    // Static method
    public static int GetTotalAccounts() => nextAccountNumber - 1000;
}

class Program
{
    static void Main()
    {
        // Create accounts
        var account1 = new BankAccount("Alice", 1000);
        var account2 = new BankAccount("Bob", 500);

        // Perform operations
        account1.Deposit(250);
        account1.Withdraw(100);
        account1.Withdraw(2000);  // Will fail

        account2.Deposit(150);

        // Print statements
        account1.PrintStatement();
        account2.PrintStatement();

        Console.WriteLine($"\nTotal accounts created: {BankAccount.GetTotalAccounts()}");
    }
}
```

## Summary

You've learned:
- Creating classes and objects
- Fields and auto-implemented properties
- Constructors and initialization
- Access modifiers for encapsulation
- Static members and classes
- The `this` keyword

## Next Steps

Continue to [Inheritance](/guide/csharp/06-inheritance) to learn about code reuse and polymorphism!
