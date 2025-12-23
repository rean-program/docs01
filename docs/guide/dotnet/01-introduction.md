# Getting Started with .NET

Learn how to set up your .NET development environment and create your first application.

::: info What You'll Learn
- Installing the .NET SDK
- Understanding .NET versions
- Creating different project types
- Running and debugging applications
:::

## What is .NET?

.NET is a free, open-source, cross-platform framework created by Microsoft. It provides:

```
┌─────────────────────────────────────────────────────────┐
│                    .NET Components                       │
├─────────────────────────────────────────────────────────┤
│  Runtime (CLR)        │  Manages memory, executes code  │
│  Base Class Library   │  Common functionality           │
│  SDK                  │  Tools for development          │
│  Languages            │  C#, F#, VB.NET                 │
└─────────────────────────────────────────────────────────┘
```

## Installing .NET

### Download the SDK

Visit [dotnet.microsoft.com/download](https://dotnet.microsoft.com/download) or use package managers:

::: code-group
```bash [Windows]
winget install Microsoft.DotNet.SDK.8
```

```bash [macOS]
brew install dotnet-sdk
```

```bash [Linux (Ubuntu)]
sudo apt-get update
sudo apt-get install -y dotnet-sdk-8.0
```
:::

### Verify Installation

```bash
# Check version
dotnet --version

# List installed SDKs
dotnet --list-sdks

# List installed runtimes
dotnet --list-runtimes

# Get help
dotnet --help
```

## Your First Console App

### Create the Project

```bash
# Create a new console application
dotnet new console -n HelloWorld

# Navigate to the project
cd HelloWorld
```

### Examine the Code

```csharp
// Program.cs
Console.WriteLine("Hello, World!");
```

### Run the Application

```bash
dotnet run
```

Output:
```
Hello, World!
```

## Your First Web API

### Create the Project

```bash
# Create a Web API
dotnet new webapi -n MyApi

cd MyApi
```

### Examine the Code

```csharp
// Program.cs
var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Sample endpoint
var summaries = new[]
{
    "Freezing", "Bracing", "Chilly", "Cool", "Mild",
    "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
};

app.MapGet("/weatherforecast", () =>
{
    var forecast = Enumerable.Range(1, 5).Select(index =>
        new WeatherForecast
        (
            DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            Random.Shared.Next(-20, 55),
            summaries[Random.Shared.Next(summaries.Length)]
        ))
        .ToArray();
    return forecast;
})
.WithName("GetWeatherForecast")
.WithOpenApi();

app.Run();

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}
```

### Run the API

```bash
dotnet run
```

Visit `https://localhost:5001/swagger` to see the API documentation.

## Project Templates

```bash
# List all available templates
dotnet new list

# Common templates
dotnet new console      # Console application
dotnet new webapi       # ASP.NET Core Web API
dotnet new mvc          # ASP.NET Core MVC
dotnet new blazor       # Blazor Web App
dotnet new worker       # Worker Service
dotnet new classlib     # Class library
dotnet new xunit        # xUnit test project
dotnet new gitignore    # .gitignore file
```

## Common CLI Commands

| Command | Description |
|---------|-------------|
| `dotnet new` | Create a new project |
| `dotnet build` | Build the project |
| `dotnet run` | Build and run |
| `dotnet test` | Run tests |
| `dotnet publish` | Publish for deployment |
| `dotnet add package` | Add NuGet package |
| `dotnet restore` | Restore dependencies |
| `dotnet clean` | Clean build outputs |

## Development Tools

### Visual Studio (Windows/Mac)

Full-featured IDE with:
- IntelliSense
- Debugger
- Designer tools
- Git integration

### Visual Studio Code

Lightweight editor with C# extension:

```bash
# Install C# Dev Kit extension
code --install-extension ms-dotnettools.csdevkit
```

### JetBrains Rider

Cross-platform professional IDE with:
- Advanced refactoring
- Code analysis
- Database tools

## Hot Reload

.NET supports hot reload for faster development:

```bash
# Run with hot reload
dotnet watch run
```

Changes to code are automatically applied without restarting.

## Complete Example

```csharp
// Program.cs - Simple API with multiple endpoints
var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

// Simple endpoints
app.MapGet("/", () => "Welcome to my API!");

app.MapGet("/hello/{name}", (string name) =>
    $"Hello, {name}!");

app.MapGet("/api/time", () => new
{
    CurrentTime = DateTime.Now,
    TimeZone = TimeZoneInfo.Local.DisplayName
});

// Todo API
var todos = new List<Todo>();

app.MapGet("/api/todos", () => todos);

app.MapGet("/api/todos/{id}", (int id) =>
    todos.FirstOrDefault(t => t.Id == id) is Todo todo
        ? Results.Ok(todo)
        : Results.NotFound());

app.MapPost("/api/todos", (Todo todo) =>
{
    todo.Id = todos.Count + 1;
    todos.Add(todo);
    return Results.Created($"/api/todos/{todo.Id}", todo);
});

app.MapDelete("/api/todos/{id}", (int id) =>
{
    var todo = todos.FirstOrDefault(t => t.Id == id);
    if (todo is null) return Results.NotFound();

    todos.Remove(todo);
    return Results.NoContent();
});

app.Run();

record Todo
{
    public int Id { get; set; }
    public string Title { get; set; } = "";
    public bool IsComplete { get; set; }
}
```

## Summary

You've learned:
- Installing and verifying .NET SDK
- Creating console and web API projects
- Running applications with `dotnet run`
- Common CLI commands
- Development tool options

## Next Steps

Continue to [Project Structure](/guide/dotnet/02-project-structure) to understand .NET project organization!
