# Interfaces

Learn how to define contracts and achieve abstraction using interfaces in C#.

::: info What You'll Learn
- Defining and implementing interfaces
- Multiple interface implementation
- Interface inheritance
- Default interface methods
- Common .NET interfaces
:::

## What are Interfaces?

An interface defines a contract that classes must follow. It specifies what a class should do, not how.

```
┌─────────────────────────────────────────────────────────┐
│                 Interface: IPlayable                     │
├─────────────────────────────────────────────────────────┤
│  void Play()                                             │
│  void Pause()                                            │
│  void Stop()                                             │
└───────────────────────┬─────────────────────────────────┘
                        │
                        │ implements
        ┌───────────────┼───────────────┐
        │               │               │
 ┌──────▼──────┐ ┌──────▼──────┐ ┌──────▼──────┐
 │ MusicPlayer │ │ VideoPlayer │ │   Podcast   │
 └─────────────┘ └─────────────┘ └─────────────┘
     All must implement Play(), Pause(), Stop()
```

## Defining an Interface

```csharp
// Interface names start with 'I' by convention
interface IAnimal
{
    // Properties (no implementation)
    string Name { get; set; }

    // Methods (no implementation)
    void Speak();
    void Move();
}
```

## Implementing an Interface

```csharp
interface IAnimal
{
    string Name { get; set; }
    void Speak();
    void Move();
}

class Dog : IAnimal
{
    public string Name { get; set; }

    public void Speak()
    {
        Console.WriteLine($"{Name} says: Woof!");
    }

    public void Move()
    {
        Console.WriteLine($"{Name} runs on four legs.");
    }
}

class Bird : IAnimal
{
    public string Name { get; set; }

    public void Speak()
    {
        Console.WriteLine($"{Name} says: Tweet!");
    }

    public void Move()
    {
        Console.WriteLine($"{Name} flies through the air.");
    }
}

// Usage with polymorphism
IAnimal[] animals = { new Dog { Name = "Buddy" }, new Bird { Name = "Tweety" } };

foreach (IAnimal animal in animals)
{
    animal.Speak();
    animal.Move();
}
```

## Multiple Interface Implementation

```csharp
interface ISwimmable
{
    void Swim();
}

interface IFlyable
{
    void Fly();
}

interface IWalkable
{
    void Walk();
}

// A class can implement multiple interfaces
class Duck : ISwimmable, IFlyable, IWalkable
{
    public string Name { get; set; }

    public void Swim()
    {
        Console.WriteLine($"{Name} is swimming.");
    }

    public void Fly()
    {
        Console.WriteLine($"{Name} is flying.");
    }

    public void Walk()
    {
        Console.WriteLine($"{Name} is walking.");
    }
}

// Can be used as any of its interfaces
Duck duck = new Duck { Name = "Donald" };

ISwimmable swimmer = duck;
swimmer.Swim();

IFlyable flyer = duck;
flyer.Fly();
```

## Interface vs Abstract Class

| Feature | Interface | Abstract Class |
|---------|-----------|----------------|
| Multiple inheritance | Yes | No |
| Fields | No | Yes |
| Constructors | No | Yes |
| Access modifiers | Public only* | Any |
| Implementation | Default methods (C# 8+) | Full methods |
| Use case | Capability/behavior | "Is-a" relationship |

```csharp
// Interface = "can do"
interface IComparable { }  // Can be compared
interface IEnumerable { }  // Can be enumerated
interface IDisposable { }  // Can be disposed

// Abstract class = "is a"
abstract class Animal { }   // Is an animal
abstract class Shape { }    // Is a shape
abstract class Vehicle { }  // Is a vehicle
```

## Interface Inheritance

```csharp
interface IReadable
{
    string Read();
}

interface IWritable
{
    void Write(string content);
}

// Interface can inherit from other interfaces
interface IReadWritable : IReadable, IWritable
{
    void Clear();
}

class Document : IReadWritable
{
    private string content = "";

    public string Read() => content;

    public void Write(string content)
    {
        this.content = content;
    }

    public void Clear()
    {
        content = "";
    }
}
```

## Default Interface Methods (C# 8+)

```csharp
interface ILogger
{
    void Log(string message);

    // Default implementation
    void LogError(string message)
    {
        Log($"ERROR: {message}");
    }

    void LogWarning(string message)
    {
        Log($"WARNING: {message}");
    }
}

class ConsoleLogger : ILogger
{
    public void Log(string message)
    {
        Console.WriteLine($"[{DateTime.Now:HH:mm:ss}] {message}");
    }

    // Uses default LogError and LogWarning
}

class FileLogger : ILogger
{
    public void Log(string message)
    {
        File.AppendAllText("log.txt", $"{message}\n");
    }

    // Can override default implementation
    public void LogError(string message)
    {
        Log($"!!! ERROR !!! {message}");
    }
}
```

## Explicit Interface Implementation

```csharp
interface IAmericanSpelling
{
    string GetColor();
}

interface IBritishSpelling
{
    string GetColor();  // Same method name
}

class ColorPicker : IAmericanSpelling, IBritishSpelling
{
    // Explicit implementation - must be called through interface
    string IAmericanSpelling.GetColor()
    {
        return "Color";
    }

    string IBritishSpelling.GetColor()
    {
        return "Colour";
    }
}

// Usage
ColorPicker picker = new ColorPicker();
// picker.GetColor();  // Error! No public GetColor

IAmericanSpelling american = picker;
Console.WriteLine(american.GetColor());  // "Color"

IBritishSpelling british = picker;
Console.WriteLine(british.GetColor());   // "Colour"
```

## Common .NET Interfaces

### IDisposable

```csharp
class DatabaseConnection : IDisposable
{
    private bool disposed = false;

    public void Open()
    {
        Console.WriteLine("Connection opened");
    }

    public void Dispose()
    {
        if (!disposed)
        {
            Console.WriteLine("Connection closed");
            disposed = true;
        }
    }
}

// Using statement ensures Dispose is called
using (var connection = new DatabaseConnection())
{
    connection.Open();
    // Do work...
}  // Dispose called automatically
```

### IComparable

```csharp
class Person : IComparable<Person>
{
    public string Name { get; set; }
    public int Age { get; set; }

    public int CompareTo(Person other)
    {
        return Age.CompareTo(other.Age);
    }
}

var people = new List<Person>
{
    new Person { Name = "Alice", Age = 30 },
    new Person { Name = "Bob", Age = 25 },
    new Person { Name = "Carol", Age = 35 }
};

people.Sort();  // Sorts by age using CompareTo
```

### IEnumerable

```csharp
class NumberRange : IEnumerable<int>
{
    private int start;
    private int end;

    public NumberRange(int start, int end)
    {
        this.start = start;
        this.end = end;
    }

    public IEnumerator<int> GetEnumerator()
    {
        for (int i = start; i <= end; i++)
        {
            yield return i;
        }
    }

    IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();
}

// Can use in foreach
var range = new NumberRange(1, 5);
foreach (int num in range)
{
    Console.WriteLine(num);  // 1, 2, 3, 4, 5
}
```

## Complete Example

```csharp
using System;
using System.Collections.Generic;

interface IPayable
{
    decimal CalculatePay();
}

interface ITaxable
{
    decimal TaxRate { get; }
    decimal CalculateTax();
}

interface IEmployee : IPayable, ITaxable
{
    string Name { get; }
    string EmployeeId { get; }
    void DisplayPayStub();
}

class SalariedEmployee : IEmployee
{
    public string Name { get; }
    public string EmployeeId { get; }
    public decimal AnnualSalary { get; }
    public decimal TaxRate => 0.25m;

    public SalariedEmployee(string name, string id, decimal salary)
    {
        Name = name;
        EmployeeId = id;
        AnnualSalary = salary;
    }

    public decimal CalculatePay() => AnnualSalary / 12;

    public decimal CalculateTax() => CalculatePay() * TaxRate;

    public void DisplayPayStub()
    {
        Console.WriteLine($"=== Pay Stub ===");
        Console.WriteLine($"Employee: {Name} ({EmployeeId})");
        Console.WriteLine($"Gross Pay: ${CalculatePay():N2}");
        Console.WriteLine($"Tax ({TaxRate:P0}): ${CalculateTax():N2}");
        Console.WriteLine($"Net Pay: ${CalculatePay() - CalculateTax():N2}");
    }
}

class Contractor : IPayable
{
    public string Name { get; }
    public decimal HourlyRate { get; }
    public int HoursWorked { get; set; }

    public Contractor(string name, decimal rate)
    {
        Name = name;
        HourlyRate = rate;
    }

    public decimal CalculatePay() => HourlyRate * HoursWorked;
}

class PayrollSystem
{
    public void ProcessPayroll(List<IPayable> payables)
    {
        Console.WriteLine("\n=== Payroll Processing ===\n");

        decimal total = 0;
        foreach (var payable in payables)
        {
            decimal pay = payable.CalculatePay();
            total += pay;

            if (payable is IEmployee emp)
            {
                emp.DisplayPayStub();
                Console.WriteLine();
            }
            else if (payable is Contractor c)
            {
                Console.WriteLine($"Contractor: {c.Name}");
                Console.WriteLine($"Payment: ${pay:N2}\n");
            }
        }

        Console.WriteLine($"Total Payroll: ${total:N2}");
    }
}

class Program
{
    static void Main()
    {
        var payables = new List<IPayable>
        {
            new SalariedEmployee("Alice Johnson", "EMP001", 72000),
            new SalariedEmployee("Bob Smith", "EMP002", 65000),
            new Contractor("Carol Consulting", 75) { HoursWorked = 40 }
        };

        var payroll = new PayrollSystem();
        payroll.ProcessPayroll(payables);
    }
}
```

## Summary

You've learned:
- Defining and implementing interfaces
- Multiple interface implementation
- Interface inheritance
- Default interface methods
- Explicit interface implementation
- Common .NET interfaces (IDisposable, IComparable, IEnumerable)

## Next Steps

Continue to [Generics](/guide/csharp/08-generics) to learn about type-safe reusable code!
