# Methods

Learn how to create reusable code blocks with methods in C#.

::: info What You'll Learn
- Defining and calling methods
- Parameters and return values
- Method overloading
- Optional and named parameters
- Expression-bodied methods
:::

## What are Methods?

Methods are blocks of code that perform a specific task. They help organize code and make it reusable.

```
┌─────────────────────────────────────────────────────────┐
│                    Method Structure                      │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  static int Add(int a, int b)                           │
│  ────── ─── ─── ────────────                            │
│    │     │   │       │                                  │
│    │     │   │       └── Parameters                     │
│    │     │   └────────── Method name                    │
│    │     └────────────── Return type                    │
│    └──────────────────── Modifier                       │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

## Basic Methods

### Void Methods (No Return Value)

```csharp
static void SayHello()
{
    Console.WriteLine("Hello, World!");
}

static void Greet(string name)
{
    Console.WriteLine($"Hello, {name}!");
}

// Calling the methods
SayHello();
Greet("Alice");
```

### Methods with Return Values

```csharp
static int Add(int a, int b)
{
    return a + b;
}

static double CalculateArea(double radius)
{
    return Math.PI * radius * radius;
}

// Using return values
int sum = Add(5, 3);
double area = CalculateArea(5.0);
Console.WriteLine($"Sum: {sum}, Area: {area:F2}");
```

## Parameters

### Value Parameters

```csharp
static void Double(int number)
{
    number *= 2;  // Only affects local copy
    Console.WriteLine($"Inside method: {number}");
}

int x = 10;
Double(x);
Console.WriteLine($"After method: {x}");  // Still 10
```

### Reference Parameters (ref)

```csharp
static void DoubleRef(ref int number)
{
    number *= 2;  // Modifies the original
}

int x = 10;
DoubleRef(ref x);
Console.WriteLine($"After method: {x}");  // Now 20
```

### Output Parameters (out)

```csharp
static void Divide(int a, int b, out int quotient, out int remainder)
{
    quotient = a / b;
    remainder = a % b;
}

Divide(17, 5, out int q, out int r);
Console.WriteLine($"17 / 5 = {q} remainder {r}");

// With TryParse pattern
static bool TryParseAge(string input, out int age)
{
    return int.TryParse(input, out age) && age >= 0 && age <= 150;
}
```

### In Parameters (readonly reference)

```csharp
// Large structs passed by reference but read-only
static double CalculateDistance(in Point p1, in Point p2)
{
    double dx = p2.X - p1.X;
    double dy = p2.Y - p1.Y;
    return Math.Sqrt(dx * dx + dy * dy);
}
```

## Optional Parameters

```csharp
static void PrintMessage(string message, int times = 1, bool uppercase = false)
{
    for (int i = 0; i < times; i++)
    {
        Console.WriteLine(uppercase ? message.ToUpper() : message);
    }
}

// Different ways to call
PrintMessage("Hello");                        // Uses defaults
PrintMessage("Hello", 3);                     // times = 3
PrintMessage("Hello", 2, true);               // All specified
PrintMessage("Hello", uppercase: true);       // Named parameter
```

## Named Parameters

```csharp
static void CreateUser(string name, int age, string email, bool isAdmin = false)
{
    Console.WriteLine($"Name: {name}, Age: {age}, Email: {email}, Admin: {isAdmin}");
}

// Named parameters allow any order
CreateUser(
    email: "alice@example.com",
    name: "Alice",
    age: 28
);

CreateUser("Bob", 30, "bob@example.com", isAdmin: true);
```

## Method Overloading

```csharp
// Same name, different parameters
static int Add(int a, int b)
{
    return a + b;
}

static double Add(double a, double b)
{
    return a + b;
}

static int Add(int a, int b, int c)
{
    return a + b + c;
}

static string Add(string a, string b)
{
    return a + b;
}

// Compiler chooses based on arguments
Console.WriteLine(Add(5, 3));           // int version: 8
Console.WriteLine(Add(5.5, 3.3));       // double version: 8.8
Console.WriteLine(Add(1, 2, 3));        // three-int version: 6
Console.WriteLine(Add("Hello", "World"));  // string version
```

## Expression-Bodied Methods

```csharp
// Short syntax for simple methods
static int Square(int x) => x * x;

static string GetGreeting(string name) => $"Hello, {name}!";

static bool IsEven(int number) => number % 2 == 0;

static void PrintDouble(int x) => Console.WriteLine(x * 2);
```

## Params Keyword

```csharp
// Accept variable number of arguments
static int Sum(params int[] numbers)
{
    int total = 0;
    foreach (int num in numbers)
    {
        total += num;
    }
    return total;
}

// Call with any number of arguments
Console.WriteLine(Sum(1, 2));           // 3
Console.WriteLine(Sum(1, 2, 3, 4, 5));  // 15
Console.WriteLine(Sum());               // 0

// Can also pass an array
int[] values = { 10, 20, 30 };
Console.WriteLine(Sum(values));         // 60
```

## Local Functions

```csharp
static int Factorial(int n)
{
    // Local function - only visible inside this method
    int Calculate(int x)
    {
        if (x <= 1) return 1;
        return x * Calculate(x - 1);
    }

    if (n < 0)
        throw new ArgumentException("Must be non-negative");

    return Calculate(n);
}
```

## Static vs Instance Methods

```csharp
class Calculator
{
    private int memory = 0;

    // Instance method - needs an object
    public void Store(int value)
    {
        memory = value;
    }

    public int Recall()
    {
        return memory;
    }

    // Static method - called on the class
    public static int Add(int a, int b)
    {
        return a + b;
    }
}

// Usage
Calculator calc = new Calculator();
calc.Store(42);                    // Instance method
int stored = calc.Recall();        // Instance method

int sum = Calculator.Add(5, 3);    // Static method
```

## Complete Example

```csharp
using System;

class Program
{
    static void Main()
    {
        Console.WriteLine("=== Temperature Converter ===\n");

        // Using methods to organize code
        while (true)
        {
            DisplayMenu();
            string choice = Console.ReadLine();

            if (choice == "3")
            {
                Console.WriteLine("Goodbye!");
                break;
            }

            Console.Write("Enter temperature: ");
            if (!double.TryParse(Console.ReadLine(), out double temp))
            {
                Console.WriteLine("Invalid number!\n");
                continue;
            }

            double result = choice switch
            {
                "1" => CelsiusToFahrenheit(temp),
                "2" => FahrenheitToCelsius(temp),
                _ => double.NaN
            };

            if (double.IsNaN(result))
            {
                Console.WriteLine("Invalid choice!\n");
                continue;
            }

            string fromUnit = choice == "1" ? "C" : "F";
            string toUnit = choice == "1" ? "F" : "C";

            Console.WriteLine($"{temp:F1}°{fromUnit} = {result:F1}°{toUnit}\n");
        }
    }

    static void DisplayMenu()
    {
        Console.WriteLine("1. Celsius to Fahrenheit");
        Console.WriteLine("2. Fahrenheit to Celsius");
        Console.WriteLine("3. Exit");
        Console.Write("Choose option: ");
    }

    static double CelsiusToFahrenheit(double celsius)
        => celsius * 9 / 5 + 32;

    static double FahrenheitToCelsius(double fahrenheit)
        => (fahrenheit - 32) * 5 / 9;
}
```

## Best Practices

::: tip Method Design
- Keep methods short and focused (single responsibility)
- Use meaningful names that describe what the method does
- Limit parameters (consider using a class if too many)
- Return early to reduce nesting
:::

::: warning Common Mistakes
- Modifying value type parameters expecting changes outside
- Forgetting `return` statement in non-void methods
- Too many optional parameters (use a class instead)
:::

## Summary

You've learned:
- Creating and calling methods
- Value, reference, and output parameters
- Optional and named parameters
- Method overloading
- Expression-bodied methods
- Params keyword for variable arguments

## Next Steps

Continue to [Classes & Objects](/guide/csharp/05-classes) to learn object-oriented programming!
