# Getting Started with C#

Learn how to set up your development environment and write your first C# program.

::: info What You'll Learn
- Installing the .NET SDK
- Creating your first C# project
- Understanding the basic program structure
- Running and debugging C# code
:::

## What is C#?

C# is a modern, object-oriented programming language developed by Microsoft. It runs on the .NET platform and is used to build:

```
┌─────────────────────────────────────────────────────────┐
│                    C# Applications                       │
├──────────────┬──────────────┬──────────────┬───────────┤
│  Web Apps    │  Desktop     │   Mobile     │   Games   │
│  (ASP.NET)   │  (WPF/WinUI) │  (MAUI)      │  (Unity)  │
├──────────────┴──────────────┴──────────────┴───────────┤
│                     Cloud Services                       │
│              (Azure Functions, Microservices)            │
└─────────────────────────────────────────────────────────┘
```

## Setting Up Your Environment

### Step 1: Install .NET SDK

Download and install the .NET SDK from [dotnet.microsoft.com](https://dotnet.microsoft.com/download).

### Step 2: Verify Installation

```bash
dotnet --version
```

You should see a version number like `8.0.100` or higher.

### Step 3: Install an IDE

Choose one of these options:

| IDE | Best For |
|-----|----------|
| Visual Studio | Full-featured development |
| VS Code + C# Extension | Lightweight editing |
| JetBrains Rider | Cross-platform professional use |

## Your First C# Program

### Create a New Project

```bash
# Create a new console application
dotnet new console -n HelloWorld

# Navigate to the project
cd HelloWorld
```

### Understanding the Code

Open `Program.cs`:

```csharp
// This is the simplest C# program
Console.WriteLine("Hello, World!");
```

In older versions or with explicit structure:

```csharp
using System;

namespace HelloWorld
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("Hello, World!");
        }
    }
}
```

### Code Breakdown

```
┌─────────────────────────────────────────────────────────┐
│  using System;           // Import namespaces           │
├─────────────────────────────────────────────────────────┤
│  namespace HelloWorld    // Organize code               │
│  {                                                      │
│      class Program       // Container for code          │
│      {                                                  │
│          static void Main()  // Entry point             │
│          {                                              │
│              // Your code here                          │
│          }                                              │
│      }                                                  │
│  }                                                      │
└─────────────────────────────────────────────────────────┘
```

## Running Your Program

```bash
# Run the application
dotnet run
```

Output:
```
Hello, World!
```

## Basic Input and Output

### Output to Console

```csharp
// Simple output
Console.WriteLine("This prints a line");
Console.Write("This stays on the same line");

// String interpolation
string name = "Alice";
Console.WriteLine($"Hello, {name}!");

// Formatted output
int age = 25;
Console.WriteLine("Name: {0}, Age: {1}", name, age);
```

### Reading Input

```csharp
// Read a line of text
Console.Write("Enter your name: ");
string name = Console.ReadLine();

Console.WriteLine($"Hello, {name}!");

// Read a number
Console.Write("Enter your age: ");
int age = int.Parse(Console.ReadLine());

Console.WriteLine($"You are {age} years old");
```

## Comments in C#

```csharp
// This is a single-line comment

/* This is a
   multi-line comment */

/// <summary>
/// This is a documentation comment
/// Used by tools to generate documentation
/// </summary>
```

## Complete Example

```csharp
using System;

class Program
{
    static void Main()
    {
        // Welcome message
        Console.WriteLine("Welcome to C#!");
        Console.WriteLine("================");

        // Get user input
        Console.Write("What is your name? ");
        string name = Console.ReadLine();

        Console.Write("How old are you? ");
        string ageInput = Console.ReadLine();
        int age = int.Parse(ageInput);

        // Calculate birth year
        int birthYear = DateTime.Now.Year - age;

        // Display results
        Console.WriteLine();
        Console.WriteLine($"Hello, {name}!");
        Console.WriteLine($"You were born around {birthYear}");
        Console.WriteLine("Thanks for trying C#!");
    }
}
```

## Project File Structure

After creating a project, you'll have:

```
HelloWorld/
├── HelloWorld.csproj    # Project configuration (XML)
├── Program.cs           # Your source code
├── obj/                 # Intermediate build files
└── bin/                 # Compiled output
    └── Debug/
        └── net8.0/
            └── HelloWorld.dll
```

### The .csproj File

```xml
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <OutputType>Exe</OutputType>
    <TargetFramework>net8.0</TargetFramework>
    <Nullable>enable</Nullable>
  </PropertyGroup>
</Project>
```

## Common Commands

| Command | Description |
|---------|-------------|
| `dotnet new console` | Create console app |
| `dotnet run` | Build and run |
| `dotnet build` | Build only |
| `dotnet clean` | Clean build files |
| `dotnet restore` | Restore packages |

## Best Practices

::: tip Naming Conventions
- **Classes**: PascalCase (`MyClass`)
- **Methods**: PascalCase (`DoSomething`)
- **Variables**: camelCase (`myVariable`)
- **Constants**: PascalCase (`MaxValue`)
:::

::: warning Common Mistakes
- Forgetting semicolons at the end of statements
- Case sensitivity: `Console` not `console`
- Not handling null input from `Console.ReadLine()`
:::

## Summary

You've learned how to:
- Install and set up the .NET SDK
- Create a new C# console project
- Write and run your first program
- Use basic input and output
- Understand the project structure

## Next Steps

Ready to learn about variables and data types? Continue to [Variables & Types](/guide/csharp/02-variables)!
