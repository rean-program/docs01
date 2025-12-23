# CLI Tools

Master the .NET command-line interface for efficient development.

::: info What You'll Learn
- Essential dotnet commands
- Building and running projects
- Managing packages and references
- Publishing applications
:::

## Basic Commands

### Getting Help

```bash
# General help
dotnet --help

# Help for specific command
dotnet new --help
dotnet build --help
```

### Version Information

```bash
# SDK version
dotnet --version

# Detailed information
dotnet --info

# List SDKs
dotnet --list-sdks

# List runtimes
dotnet --list-runtimes
```

## Creating Projects

### New Project

```bash
# Create with defaults
dotnet new console

# Specify name
dotnet new webapi -n MyApi

# Specify output directory
dotnet new mvc -n MyApp -o src/MyApp

# Specify language
dotnet new console -lang F#

# Use specific framework
dotnet new console --framework net7.0

# Don't restore packages
dotnet new webapi --no-restore
```

### List Templates

```bash
# All templates
dotnet new list

# Search templates
dotnet new list web

# Install new template
dotnet new install Blazorise.Templates

# Uninstall template
dotnet new uninstall Blazorise.Templates
```

## Building Projects

### Basic Build

```bash
# Build current project
dotnet build

# Build specific project
dotnet build MyApp.csproj

# Build solution
dotnet build MySolution.sln

# Build with configuration
dotnet build -c Release

# Build for specific framework
dotnet build -f net8.0

# Build with verbosity
dotnet build -v detailed
```

### Build Options

| Option | Description |
|--------|-------------|
| `-c, --configuration` | Debug or Release |
| `-f, --framework` | Target framework |
| `-o, --output` | Output directory |
| `-r, --runtime` | Target runtime (e.g., win-x64) |
| `-v, --verbosity` | q[uiet], m[inimal], n[ormal], d[etailed] |
| `--no-restore` | Skip package restore |

## Running Projects

### Basic Run

```bash
# Run project
dotnet run

# Run specific project
dotnet run --project src/MyApi/MyApi.csproj

# Run with configuration
dotnet run -c Release

# Pass arguments to the application
dotnet run -- arg1 arg2

# Run with specific launch profile
dotnet run --launch-profile "Development"
```

### Watch Mode

```bash
# Run with hot reload
dotnet watch run

# Watch and run tests
dotnet watch test

# Watch specific project
dotnet watch --project src/MyApi run
```

## Package Management

### Add Packages

```bash
# Add package
dotnet add package Newtonsoft.Json

# Add specific version
dotnet add package Serilog --version 3.1.1

# Add prerelease
dotnet add package MyPackage --prerelease

# Add to specific project
dotnet add src/MyApp package Newtonsoft.Json
```

### Remove and List Packages

```bash
# Remove package
dotnet remove package Newtonsoft.Json

# List packages
dotnet list package

# List outdated packages
dotnet list package --outdated

# List vulnerable packages
dotnet list package --vulnerable
```

### Restore Packages

```bash
# Restore packages
dotnet restore

# Restore for specific runtime
dotnet restore -r linux-x64

# Clear cache and restore
dotnet nuget locals all --clear
dotnet restore
```

## Project References

```bash
# Add reference
dotnet add reference ../MyLibrary/MyLibrary.csproj

# Remove reference
dotnet remove reference ../MyLibrary/MyLibrary.csproj

# List references
dotnet list reference
```

## Solution Management

```bash
# Create solution
dotnet new sln -n MySolution

# Add project to solution
dotnet sln add src/MyApp/MyApp.csproj

# Add multiple projects
dotnet sln add src/**/*.csproj

# Remove project
dotnet sln remove src/OldProject/OldProject.csproj

# List projects
dotnet sln list
```

## Testing

```bash
# Run all tests
dotnet test

# Run specific project
dotnet test tests/MyApp.Tests

# Run with filter
dotnet test --filter "FullyQualifiedName~UnitTests"

# Run with verbosity
dotnet test -v normal

# Generate code coverage
dotnet test --collect:"XPlat Code Coverage"

# Run in parallel
dotnet test --parallel
```

## Publishing

### Basic Publish

```bash
# Publish to default location
dotnet publish

# Publish with configuration
dotnet publish -c Release

# Publish to specific directory
dotnet publish -o ./publish

# Self-contained deployment
dotnet publish -c Release -r win-x64 --self-contained

# Framework-dependent deployment
dotnet publish -c Release -r win-x64 --no-self-contained
```

### Single File Publish

```bash
# Single executable
dotnet publish -c Release -r win-x64 \
  --self-contained \
  -p:PublishSingleFile=true

# With trimming (reduce size)
dotnet publish -c Release -r win-x64 \
  --self-contained \
  -p:PublishSingleFile=true \
  -p:PublishTrimmed=true
```

### Runtime Identifiers (RID)

| RID | Platform |
|-----|----------|
| `win-x64` | Windows 64-bit |
| `win-x86` | Windows 32-bit |
| `linux-x64` | Linux 64-bit |
| `linux-arm64` | Linux ARM64 |
| `osx-x64` | macOS Intel |
| `osx-arm64` | macOS Apple Silicon |

## Tool Management

### Global Tools

```bash
# Install global tool
dotnet tool install -g dotnet-ef

# Update tool
dotnet tool update -g dotnet-ef

# List tools
dotnet tool list -g

# Uninstall tool
dotnet tool uninstall -g dotnet-ef

# Run tool
dotnet ef migrations add InitialCreate
```

### Local Tools

```bash
# Create tool manifest
dotnet new tool-manifest

# Install local tool
dotnet tool install dotnet-ef

# Restore tools
dotnet tool restore

# Run local tool
dotnet tool run dotnet-ef
```

## NuGet Commands

```bash
# Push package to NuGet
dotnet nuget push MyPackage.1.0.0.nupkg \
  --api-key YOUR_API_KEY \
  --source https://api.nuget.org/v3/index.json

# Add NuGet source
dotnet nuget add source https://pkgs.dev.azure.com/... \
  -n MyFeed -u user -p password

# List sources
dotnet nuget list source

# Clear cache
dotnet nuget locals all --clear
```

## Environment Variables

```bash
# Set environment for run
ASPNETCORE_ENVIRONMENT=Development dotnet run

# Or on Windows
set ASPNETCORE_ENVIRONMENT=Development
dotnet run
```

## Useful Aliases

Add to your shell profile:

```bash
# Bash/Zsh aliases
alias dn='dotnet new'
alias db='dotnet build'
alias dr='dotnet run'
alias dt='dotnet test'
alias dw='dotnet watch run'
alias dp='dotnet publish -c Release'
alias da='dotnet add package'
```

## Complete Example Workflow

```bash
# Create solution
mkdir MyProject && cd MyProject
dotnet new sln

# Create API and test projects
dotnet new webapi -n MyProject.Api -o src/MyProject.Api
dotnet new xunit -n MyProject.Tests -o tests/MyProject.Tests

# Add to solution
dotnet sln add src/MyProject.Api
dotnet sln add tests/MyProject.Tests

# Add reference
dotnet add tests/MyProject.Tests reference src/MyProject.Api

# Add packages
dotnet add src/MyProject.Api package Serilog.AspNetCore
dotnet add tests/MyProject.Tests package Moq

# Restore and build
dotnet restore
dotnet build

# Run tests
dotnet test

# Run API in watch mode
dotnet watch --project src/MyProject.Api run

# Publish for production
dotnet publish src/MyProject.Api -c Release -o ./publish
```

## Summary

You've learned:
- Creating and managing projects
- Building and running applications
- Managing packages and references
- Testing and publishing
- Global and local tools
- NuGet commands

## Next Steps

Continue to [Dependency Injection](/guide/dotnet/04-dependency-injection) to learn about DI in .NET!
