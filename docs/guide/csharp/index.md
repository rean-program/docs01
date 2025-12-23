# C# Tutorial

::: info Official Documentation
This tutorial is based on official Microsoft C# documentation. Visit: [C# Documentation](https://learn.microsoft.com/en-us/dotnet/csharp/)
:::

Welcome to the C# tutorial! C# (pronounced "C-sharp") is a modern, object-oriented programming language developed by Microsoft.

## What is C#?

```
┌─────────────────────────────────────────────────────────────┐
│                         C# Language                         │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   Type      │  │   Object-   │  │    Modern           │  │
│  │   Safety    │  │   Oriented  │  │    Features         │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
├─────────────────────────────────────────────────────────────┤
│                    .NET Runtime (CLR)                       │
├─────────────────────────────────────────────────────────────┤
│  Windows  │  macOS  │  Linux  │  iOS  │  Android  │  Web   │
└─────────────────────────────────────────────────────────────┘
```

## Why Learn C#?

| Feature | Description |
|---------|-------------|
| **Versatile** | Build web, desktop, mobile, games, and cloud applications |
| **Type-Safe** | Catch errors at compile time with strong typing |
| **Modern Syntax** | Clean, readable code with powerful features |
| **Enterprise Ready** | Battle-tested in large-scale applications |
| **Cross-Platform** | Run on Windows, macOS, Linux, and more |
| **Game Development** | Primary language for Unity game engine |

## What You'll Learn

### Beginner
- [Getting Started](/guide/csharp/01-introduction) - Setup and first program
- [Variables & Types](/guide/csharp/02-variables) - Data types and variables
- [Control Flow](/guide/csharp/03-control-flow) - Conditions and loops

### Intermediate
- [Methods](/guide/csharp/04-methods) - Functions and parameters
- [Classes & Objects](/guide/csharp/05-classes) - Object-oriented basics
- [Inheritance](/guide/csharp/06-inheritance) - Code reuse and polymorphism

### Advanced
- [Interfaces](/guide/csharp/07-interfaces) - Contracts and abstraction
- [Generics](/guide/csharp/08-generics) - Type-safe reusable code
- [LINQ](/guide/csharp/09-linq) - Language Integrated Query
- [Async Programming](/guide/csharp/10-async) - Asynchronous patterns

## Prerequisites

- ✅ Basic programming concepts
- ✅ Understanding of variables and functions
- ⭐ Optional: Experience with any C-style language

## Quick Preview

```csharp
using System;

// Hello World in C#
class Program
{
    static void Main()
    {
        Console.WriteLine("Hello, World!");

        // Variables and types
        string name = "Developer";
        int age = 25;
        bool isLearning = true;

        // String interpolation
        Console.WriteLine($"Hi {name}, you are {age} years old!");

        // Collections
        var languages = new List<string> { "C#", "Python", "JavaScript" };

        foreach (var lang in languages)
        {
            Console.WriteLine($"I know {lang}");
        }
    }
}
```

## Setting Up Your Environment

### Install .NET SDK

::: code-group
```bash [Windows]
# Download from https://dotnet.microsoft.com/download
# Or use winget:
winget install Microsoft.DotNet.SDK.8
```

```bash [macOS]
# Using Homebrew:
brew install dotnet-sdk

# Or download from https://dotnet.microsoft.com/download
```

```bash [Linux]
# Ubuntu/Debian:
sudo apt-get update
sudo apt-get install -y dotnet-sdk-8.0

# Fedora:
sudo dnf install dotnet-sdk-8.0
```
:::

### Verify Installation

```bash
dotnet --version
```

### Create Your First Project

```bash
# Create a new console application
dotnet new console -n MyFirstApp

# Navigate to project folder
cd MyFirstApp

# Run the application
dotnet run
```

## Project Structure

```
MyFirstApp/
├── MyFirstApp.csproj    # Project configuration
├── Program.cs           # Main entry point
├── obj/                 # Build objects
└── bin/                 # Compiled output
```

## Recommended IDEs

| IDE | Description |
|-----|-------------|
| **Visual Studio** | Full-featured IDE (Windows/Mac) |
| **VS Code** | Lightweight editor with C# extension |
| **JetBrains Rider** | Cross-platform professional IDE |

## Video Tutorials

::: tip Recommended Video Resources
Learn C# through these excellent tutorials.
:::

### Free Courses

| Course | Creator | Description |
|--------|---------|-------------|
| [C# Fundamentals](https://www.youtube.com/watch?v=GhQdlIFylQ8) | freeCodeCamp | Complete C# course for beginners |
| [C# Tutorial](https://www.youtube.com/watch?v=wxznTygnRfQ) | Bro Code | Full C# programming tutorial |
| [C# Full Course](https://www.youtube.com/watch?v=M5ugY7fWydE) | Caleb Curry | Comprehensive C# tutorial |

## Let's Begin!

Ready to start? Head over to [Getting Started](/guide/csharp/01-introduction) to write your first C# program!
