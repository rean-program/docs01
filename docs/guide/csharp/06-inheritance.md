# Inheritance

Learn how to create class hierarchies and reuse code through inheritance in C#.

::: info What You'll Learn
- Creating base and derived classes
- Using the base keyword
- Method overriding
- Abstract classes
- Sealed classes
:::

## What is Inheritance?

Inheritance allows a class to inherit properties and methods from another class, promoting code reuse.

```
                    ┌─────────────┐
                    │   Animal    │  ← Base class
                    │  - Name     │
                    │  - Speak()  │
                    └──────┬──────┘
                           │
           ┌───────────────┼───────────────┐
           │               │               │
    ┌──────▼──────┐ ┌──────▼──────┐ ┌──────▼──────┐
    │     Dog     │ │     Cat     │ │    Bird     │
    │  - Breed    │ │  - Indoor   │ │  - CanFly   │
    │  - Bark()   │ │  - Meow()   │ │  - Fly()    │
    └─────────────┘ └─────────────┘ └─────────────┘
                          ↑
                    Derived classes
```

## Basic Inheritance

```csharp
// Base class
class Animal
{
    public string Name { get; set; }

    public void Eat()
    {
        Console.WriteLine($"{Name} is eating.");
    }

    public void Sleep()
    {
        Console.WriteLine($"{Name} is sleeping.");
    }
}

// Derived class
class Dog : Animal
{
    public string Breed { get; set; }

    public void Bark()
    {
        Console.WriteLine($"{Name} says: Woof!");
    }
}

// Usage
Dog dog = new Dog
{
    Name = "Buddy",
    Breed = "Golden Retriever"
};

dog.Eat();   // Inherited from Animal
dog.Sleep(); // Inherited from Animal
dog.Bark();  // Defined in Dog
```

## The base Keyword

```csharp
class Animal
{
    public string Name { get; set; }

    public Animal(string name)
    {
        Name = name;
        Console.WriteLine("Animal constructor called");
    }

    public void Describe()
    {
        Console.WriteLine($"This is {Name}");
    }
}

class Dog : Animal
{
    public string Breed { get; set; }

    // Call base constructor
    public Dog(string name, string breed) : base(name)
    {
        Breed = breed;
        Console.WriteLine("Dog constructor called");
    }

    public new void Describe()
    {
        base.Describe();  // Call base method
        Console.WriteLine($"Breed: {Breed}");
    }
}

Dog dog = new Dog("Buddy", "Labrador");
// Output:
// Animal constructor called
// Dog constructor called

dog.Describe();
// This is Buddy
// Breed: Labrador
```

## Method Overriding

```csharp
class Animal
{
    public string Name { get; set; }

    // Virtual allows overriding
    public virtual void Speak()
    {
        Console.WriteLine("Some sound");
    }
}

class Dog : Animal
{
    // Override changes behavior
    public override void Speak()
    {
        Console.WriteLine($"{Name} says: Woof!");
    }
}

class Cat : Animal
{
    public override void Speak()
    {
        Console.WriteLine($"{Name} says: Meow!");
    }
}

class Cow : Animal
{
    public override void Speak()
    {
        Console.WriteLine($"{Name} says: Moo!");
    }
}

// Polymorphism in action
Animal[] animals = {
    new Dog { Name = "Buddy" },
    new Cat { Name = "Whiskers" },
    new Cow { Name = "Bessie" }
};

foreach (Animal animal in animals)
{
    animal.Speak();  // Calls the appropriate override
}
// Buddy says: Woof!
// Whiskers says: Meow!
// Bessie says: Moo!
```

## Abstract Classes

```csharp
// Cannot be instantiated directly
abstract class Shape
{
    public string Color { get; set; }

    // Abstract method - must be implemented by derived classes
    public abstract double GetArea();

    // Regular method - can be inherited as-is
    public void Describe()
    {
        Console.WriteLine($"A {Color} shape with area {GetArea():F2}");
    }
}

class Rectangle : Shape
{
    public double Width { get; set; }
    public double Height { get; set; }

    public override double GetArea()
    {
        return Width * Height;
    }
}

class Circle : Shape
{
    public double Radius { get; set; }

    public override double GetArea()
    {
        return Math.PI * Radius * Radius;
    }
}

// Usage
// Shape shape = new Shape();  // Error! Cannot instantiate abstract class

Shape rect = new Rectangle { Color = "Blue", Width = 5, Height = 3 };
Shape circle = new Circle { Color = "Red", Radius = 4 };

rect.Describe();    // A Blue shape with area 15.00
circle.Describe();  // A Red shape with area 50.27
```

## Sealed Classes

```csharp
// Cannot be inherited
sealed class FinalClass
{
    public void DoSomething()
    {
        Console.WriteLine("Doing something");
    }
}

// class Derived : FinalClass { }  // Error! Cannot inherit from sealed

// Sealing a method
class Base
{
    public virtual void Method() { }
}

class Derived : Base
{
    // Seal this override - subclasses can't override further
    public sealed override void Method()
    {
        Console.WriteLine("Sealed implementation");
    }
}
```

## Protected Members

```csharp
class Animal
{
    // Private - only this class
    private int id;

    // Protected - this class and subclasses
    protected string species;

    // Public - everyone
    public string Name { get; set; }

    protected void SetSpecies(string s)
    {
        species = s;
    }
}

class Dog : Animal
{
    public Dog()
    {
        // Can access protected members
        species = "Canis familiaris";
        SetSpecies("Dog");

        // Cannot access private members
        // id = 1;  // Error!
    }
}
```

## Type Checking and Casting

```csharp
Animal animal = new Dog { Name = "Buddy" };

// Check type with 'is'
if (animal is Dog)
{
    Console.WriteLine("It's a dog!");
}

// Pattern matching with 'is'
if (animal is Dog dog)
{
    dog.Bark();  // Can use as Dog
}

// Cast with 'as' (returns null if fails)
Dog? maybeDog = animal as Dog;
if (maybeDog != null)
{
    maybeDog.Bark();
}

// Direct cast (throws if fails)
Dog definitelyDog = (Dog)animal;

// Switch pattern matching
string description = animal switch
{
    Dog d => $"Dog named {d.Name}",
    Cat c => $"Cat named {c.Name}",
    _ => "Unknown animal"
};
```

## Complete Example

```csharp
using System;
using System.Collections.Generic;

abstract class Employee
{
    public string Name { get; set; }
    public string Id { get; }
    protected decimal baseSalary;

    private static int nextId = 1;

    public Employee(string name, decimal baseSalary)
    {
        Name = name;
        this.baseSalary = baseSalary;
        Id = $"EMP{nextId++:D4}";
    }

    public abstract decimal CalculateSalary();

    public virtual void DisplayInfo()
    {
        Console.WriteLine($"ID: {Id}");
        Console.WriteLine($"Name: {Name}");
        Console.WriteLine($"Salary: ${CalculateSalary():N2}");
    }
}

class FullTimeEmployee : Employee
{
    public int VacationDays { get; set; }

    public FullTimeEmployee(string name, decimal salary)
        : base(name, salary)
    {
        VacationDays = 20;
    }

    public override decimal CalculateSalary()
    {
        return baseSalary;
    }

    public override void DisplayInfo()
    {
        base.DisplayInfo();
        Console.WriteLine($"Type: Full-Time");
        Console.WriteLine($"Vacation Days: {VacationDays}");
    }
}

class HourlyEmployee : Employee
{
    public decimal HourlyRate { get; set; }
    public int HoursWorked { get; set; }

    public HourlyEmployee(string name, decimal hourlyRate)
        : base(name, 0)
    {
        HourlyRate = hourlyRate;
    }

    public override decimal CalculateSalary()
    {
        decimal regularPay = Math.Min(HoursWorked, 40) * HourlyRate;
        decimal overtimePay = Math.Max(0, HoursWorked - 40) * HourlyRate * 1.5m;
        return regularPay + overtimePay;
    }

    public override void DisplayInfo()
    {
        Console.WriteLine($"ID: {Id}");
        Console.WriteLine($"Name: {Name}");
        Console.WriteLine($"Type: Hourly");
        Console.WriteLine($"Rate: ${HourlyRate}/hour");
        Console.WriteLine($"Hours: {HoursWorked}");
        Console.WriteLine($"Salary: ${CalculateSalary():N2}");
    }
}

class Manager : FullTimeEmployee
{
    public List<Employee> Team { get; } = new List<Employee>();
    public decimal Bonus { get; set; }

    public Manager(string name, decimal salary, decimal bonus)
        : base(name, salary)
    {
        Bonus = bonus;
        VacationDays = 25;  // Managers get more vacation
    }

    public override decimal CalculateSalary()
    {
        return base.CalculateSalary() + Bonus;
    }

    public void AddTeamMember(Employee emp)
    {
        Team.Add(emp);
    }

    public override void DisplayInfo()
    {
        base.DisplayInfo();
        Console.WriteLine($"Bonus: ${Bonus:N2}");
        Console.WriteLine($"Team Size: {Team.Count}");
    }
}

class Program
{
    static void Main()
    {
        var employees = new List<Employee>
        {
            new FullTimeEmployee("Alice Johnson", 75000),
            new HourlyEmployee("Bob Smith", 25) { HoursWorked = 45 },
            new Manager("Carol Williams", 95000, 15000)
        };

        Console.WriteLine("=== Employee Report ===\n");

        decimal totalPayroll = 0;
        foreach (var emp in employees)
        {
            emp.DisplayInfo();
            Console.WriteLine();
            totalPayroll += emp.CalculateSalary();
        }

        Console.WriteLine($"Total Payroll: ${totalPayroll:N2}");
    }
}
```

## Summary

You've learned:
- Creating base and derived classes
- Using constructors with inheritance
- Virtual and override for polymorphism
- Abstract classes and methods
- Sealed classes and methods
- Type checking and casting

## Next Steps

Continue to [Interfaces](/guide/csharp/07-interfaces) to learn about contracts and abstraction!
