# Project Structure

Learn how .NET projects are organized and how to structure your applications.

::: info What You'll Learn
- Understanding project files (.csproj)
- Solution files (.sln)
- Folder conventions
- Multi-project solutions
:::

## Project File (.csproj)

Every .NET project has a `.csproj` file that defines the project configuration.

### Basic Console Project

```xml
<Project Sdk="Microsoft.NET.Sdk">

  <PropertyGroup>
    <OutputType>Exe</OutputType>
    <TargetFramework>net8.0</TargetFramework>
    <Nullable>enable</Nullable>
    <ImplicitUsings>enable</ImplicitUsings>
  </PropertyGroup>

</Project>
```

### Web API Project

```xml
<Project Sdk="Microsoft.NET.Sdk.Web">

  <PropertyGroup>
    <TargetFramework>net8.0</TargetFramework>
    <Nullable>enable</Nullable>
    <ImplicitUsings>enable</ImplicitUsings>
  </PropertyGroup>

  <ItemGroup>
    <PackageReference Include="Swashbuckle.AspNetCore" Version="6.5.0" />
  </ItemGroup>

</Project>
```

## Common Project Settings

```xml
<PropertyGroup>
  <!-- Target framework(s) -->
  <TargetFramework>net8.0</TargetFramework>
  <!-- Or multiple: <TargetFrameworks>net8.0;net7.0</TargetFrameworks> -->

  <!-- Output type -->
  <OutputType>Exe</OutputType>  <!-- or Library -->

  <!-- Enable nullable reference types -->
  <Nullable>enable</Nullable>

  <!-- Enable implicit usings -->
  <ImplicitUsings>enable</ImplicitUsings>

  <!-- Assembly information -->
  <AssemblyName>MyApp</AssemblyName>
  <RootNamespace>MyCompany.MyApp</RootNamespace>
  <Version>1.0.0</Version>

  <!-- Treat warnings as errors -->
  <TreatWarningsAsErrors>true</TreatWarningsAsErrors>
</PropertyGroup>
```

## NuGet Package References

```xml
<ItemGroup>
  <!-- Add packages -->
  <PackageReference Include="Newtonsoft.Json" Version="13.0.3" />
  <PackageReference Include="Serilog" Version="3.1.1" />

  <!-- Package with specific settings -->
  <PackageReference Include="Microsoft.EntityFrameworkCore"
                    Version="8.0.0"
                    PrivateAssets="All" />
</ItemGroup>
```

### Managing Packages via CLI

```bash
# Add a package
dotnet add package Newtonsoft.Json

# Add specific version
dotnet add package Newtonsoft.Json --version 13.0.3

# Remove a package
dotnet remove package Newtonsoft.Json

# List packages
dotnet list package

# Update packages
dotnet add package Newtonsoft.Json  # Gets latest
```

## Project References

```xml
<ItemGroup>
  <!-- Reference another project -->
  <ProjectReference Include="..\MyLibrary\MyLibrary.csproj" />
</ItemGroup>
```

### Adding Project References via CLI

```bash
# Add reference to another project
dotnet add reference ../MyLibrary/MyLibrary.csproj

# Remove reference
dotnet remove reference ../MyLibrary/MyLibrary.csproj

# List references
dotnet list reference
```

## Solution Files (.sln)

Solutions group multiple projects together.

```bash
# Create a solution
dotnet new sln -n MySolution

# Add projects to solution
dotnet sln add src/MyApi/MyApi.csproj
dotnet sln add src/MyLibrary/MyLibrary.csproj
dotnet sln add tests/MyApi.Tests/MyApi.Tests.csproj

# List projects in solution
dotnet sln list

# Build entire solution
dotnet build MySolution.sln
```

## Recommended Folder Structure

### Simple Project

```
MyApp/
├── MyApp.csproj
├── Program.cs
├── appsettings.json
├── appsettings.Development.json
├── Models/
│   └── User.cs
├── Services/
│   └── UserService.cs
└── Controllers/
    └── UsersController.cs
```

### Multi-Project Solution

```
MySolution/
├── MySolution.sln
├── src/
│   ├── MyApp.Api/
│   │   ├── MyApp.Api.csproj
│   │   ├── Program.cs
│   │   ├── Controllers/
│   │   └── appsettings.json
│   ├── MyApp.Core/
│   │   ├── MyApp.Core.csproj
│   │   ├── Entities/
│   │   ├── Interfaces/
│   │   └── Services/
│   └── MyApp.Infrastructure/
│       ├── MyApp.Infrastructure.csproj
│       ├── Data/
│       └── Repositories/
├── tests/
│   ├── MyApp.UnitTests/
│   │   └── MyApp.UnitTests.csproj
│   └── MyApp.IntegrationTests/
│       └── MyApp.IntegrationTests.csproj
└── docs/
    └── README.md
```

## Clean Architecture Structure

```
┌─────────────────────────────────────────────────────────┐
│                    Presentation                          │
│                  (API, MVC, Blazor)                      │
├─────────────────────────────────────────────────────────┤
│                    Application                           │
│            (Use Cases, DTOs, Interfaces)                 │
├─────────────────────────────────────────────────────────┤
│                      Domain                              │
│            (Entities, Value Objects, Enums)              │
├─────────────────────────────────────────────────────────┤
│                   Infrastructure                         │
│          (Database, External Services, Files)            │
└─────────────────────────────────────────────────────────┘
```

### Project Dependencies

```
MyApp.Api           →  MyApp.Application
                    →  MyApp.Infrastructure

MyApp.Application   →  MyApp.Domain

MyApp.Infrastructure →  MyApp.Application
                     →  MyApp.Domain

MyApp.Domain        →  (no dependencies)
```

## Configuration Files

### appsettings.json

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=MyDb;..."
  },
  "AppSettings": {
    "ApiKey": "your-api-key",
    "MaxItemsPerPage": 50
  }
}
```

### appsettings.Development.json

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Debug"
    }
  },
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=MyDb_Dev;..."
  }
}
```

## Global.json

Pin SDK version for a solution:

```json
{
  "sdk": {
    "version": "8.0.100",
    "rollForward": "latestMinor"
  }
}
```

## Directory.Build.props

Share settings across all projects:

```xml
<!-- In solution root: Directory.Build.props -->
<Project>
  <PropertyGroup>
    <TargetFramework>net8.0</TargetFramework>
    <Nullable>enable</Nullable>
    <ImplicitUsings>enable</ImplicitUsings>
    <TreatWarningsAsErrors>true</TreatWarningsAsErrors>
  </PropertyGroup>

  <ItemGroup>
    <PackageReference Include="Microsoft.Extensions.Logging" Version="8.0.0" />
  </ItemGroup>
</Project>
```

## Complete Example: Creating a Solution

```bash
# Create solution
mkdir MySolution && cd MySolution
dotnet new sln

# Create projects
mkdir -p src tests

# API project
dotnet new webapi -n MyApp.Api -o src/MyApp.Api

# Core library
dotnet new classlib -n MyApp.Core -o src/MyApp.Core

# Infrastructure library
dotnet new classlib -n MyApp.Infrastructure -o src/MyApp.Infrastructure

# Test project
dotnet new xunit -n MyApp.Tests -o tests/MyApp.Tests

# Add to solution
dotnet sln add src/MyApp.Api
dotnet sln add src/MyApp.Core
dotnet sln add src/MyApp.Infrastructure
dotnet sln add tests/MyApp.Tests

# Add references
dotnet add src/MyApp.Api reference src/MyApp.Core
dotnet add src/MyApp.Api reference src/MyApp.Infrastructure
dotnet add src/MyApp.Infrastructure reference src/MyApp.Core
dotnet add tests/MyApp.Tests reference src/MyApp.Core
dotnet add tests/MyApp.Tests reference src/MyApp.Api

# Build solution
dotnet build

# Run tests
dotnet test
```

## Summary

You've learned:
- Project file (.csproj) structure
- Managing NuGet packages
- Creating and managing solutions
- Recommended folder structures
- Configuration files
- Shared build properties

## Next Steps

Continue to [CLI Tools](/guide/dotnet/03-cli) to master the dotnet command!
