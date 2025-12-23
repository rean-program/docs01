# .NET Tutorial

::: info Official Documentation
This tutorial is based on official Microsoft .NET documentation. Visit: [.NET Documentation](https://learn.microsoft.com/en-us/dotnet/)
:::

Welcome to the .NET tutorial! .NET is a free, open-source, cross-platform framework for building modern applications.

## What is .NET?

```
┌─────────────────────────────────────────────────────────────┐
│                      .NET Platform                           │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│   ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│   │   Web    │  │ Desktop  │  │  Mobile  │  │  Cloud   │   │
│   │ ASP.NET  │  │WPF/WinUI │  │  .NET    │  │  Azure   │   │
│   │  Core    │  │  Blazor  │  │  MAUI    │  │Functions │   │
│   └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                    Base Class Library                        │
│         (Collections, IO, Networking, Security, etc.)        │
├─────────────────────────────────────────────────────────────┤
│                  .NET Runtime (CLR)                          │
│        (Garbage Collection, JIT, Type System)                │
├─────────────────────────────────────────────────────────────┤
│       Windows    │    macOS    │    Linux    │    More      │
└─────────────────────────────────────────────────────────────┘
```

## Why Learn .NET?

| Feature | Description |
|---------|-------------|
| **Cross-Platform** | Build and run on Windows, macOS, and Linux |
| **High Performance** | One of the fastest web frameworks available |
| **Versatile** | Web, desktop, mobile, cloud, IoT, AI/ML |
| **Enterprise Ready** | Powers major companies worldwide |
| **Great Tooling** | Visual Studio, VS Code, and CLI tools |
| **Large Ecosystem** | NuGet packages, community, and support |

## What You'll Learn

### Beginner
- [Getting Started](/guide/dotnet/01-introduction) - Setup and first project
- [Project Structure](/guide/dotnet/02-project-structure) - Understanding .NET projects
- [CLI Tools](/guide/dotnet/03-cli) - Using the dotnet command

### Intermediate
- [Dependency Injection](/guide/dotnet/04-dependency-injection) - DI fundamentals
- [Configuration](/guide/dotnet/05-configuration) - App settings and options
- [Logging](/guide/dotnet/06-logging) - Structured logging

### Advanced
- [Middleware](/guide/dotnet/07-middleware) - HTTP pipeline
- [Entity Framework](/guide/dotnet/08-entity-framework) - Database access
- [Testing](/guide/dotnet/09-testing) - Unit and integration tests
- [Deployment](/guide/dotnet/10-deployment) - Publishing applications

## Prerequisites

- ✅ Basic C# knowledge (see [C# Tutorial](/guide/csharp/))
- ✅ Command line familiarity
- ⭐ Optional: Understanding of web concepts

## Quick Preview

```csharp
// Minimal API in .NET
var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

app.MapGet("/", () => "Hello, World!");

app.MapGet("/api/users/{id}", (int id) =>
{
    return new { Id = id, Name = "John Doe" };
});

app.Run();
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
```

```bash [Linux]
# Ubuntu/Debian:
sudo apt-get update
sudo apt-get install -y dotnet-sdk-8.0
```
:::

### Verify Installation

```bash
dotnet --version
dotnet --list-sdks
```

### Create Your First Web API

```bash
# Create a new Web API project
dotnet new webapi -n MyFirstApi

# Navigate to project
cd MyFirstApi

# Run the application
dotnet run
```

## Project Types

| Template | Command | Description |
|----------|---------|-------------|
| Console | `dotnet new console` | Command-line application |
| Web API | `dotnet new webapi` | RESTful API service |
| MVC | `dotnet new mvc` | Model-View-Controller web app |
| Blazor | `dotnet new blazor` | Interactive web UI with C# |
| Worker | `dotnet new worker` | Background service |
| Class Library | `dotnet new classlib` | Reusable library |

## .NET Ecosystem

```
┌─────────────────────────────────────────────────────────────┐
│                     Application Types                        │
├─────────────┬─────────────┬─────────────┬──────────────────┤
│   ASP.NET   │   Blazor    │    MAUI     │     Console      │
│   Core      │   (WASM/    │   (Cross-   │    (CLI/         │
│   (APIs,    │   Server)   │   platform  │    Workers)      │
│   MVC)      │             │   Mobile)   │                  │
├─────────────┴─────────────┴─────────────┴──────────────────┤
│                       Libraries                              │
├──────────────────────────────────────────────────────────────┤
│  Entity Framework  │  Identity  │  SignalR  │  gRPC         │
│  (ORM)            │  (Auth)    │  (Realtime)│  (RPC)        │
└──────────────────────────────────────────────────────────────┘
```

## Video Tutorials

::: tip Recommended Video Resources
Learn .NET through these excellent tutorials.
:::

### Free Courses

| Course | Creator | Description |
|--------|---------|-------------|
| [.NET 8 Full Course](https://www.youtube.com/watch?v=AhAxLiGC7Pc) | Les Jackson | Complete ASP.NET Core tutorial |
| [.NET Web API Tutorial](https://www.youtube.com/watch?v=Mr6GKEbv8Ws) | Teddy Smith | Building Web APIs |
| [.NET Microservices](https://www.youtube.com/watch?v=DgVjEo3OGBI) | Les Jackson | Microservices architecture |

## Let's Begin!

Ready to start? Head over to [Getting Started](/guide/dotnet/01-introduction) to create your first .NET application!
