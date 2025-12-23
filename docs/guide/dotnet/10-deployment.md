# Deployment

Learn how to publish and deploy your .NET applications to production.

::: info What You'll Learn
- Publishing applications
- Deployment options
- Docker containers
- Cloud deployment
- Production configuration
:::

## Publishing Applications

### Framework-Dependent Deployment (FDD)

Requires .NET runtime on target machine:

```bash
# Basic publish
dotnet publish -c Release

# Specify output directory
dotnet publish -c Release -o ./publish

# For specific runtime
dotnet publish -c Release -r linux-x64 --no-self-contained
```

### Self-Contained Deployment (SCD)

Includes .NET runtime:

```bash
# Self-contained for Windows
dotnet publish -c Release -r win-x64 --self-contained

# Self-contained for Linux
dotnet publish -c Release -r linux-x64 --self-contained

# Self-contained for macOS
dotnet publish -c Release -r osx-x64 --self-contained
```

### Single File Deployment

```bash
# Single executable (Windows)
dotnet publish -c Release -r win-x64 \
  --self-contained \
  -p:PublishSingleFile=true

# With trimming (smaller size)
dotnet publish -c Release -r win-x64 \
  --self-contained \
  -p:PublishSingleFile=true \
  -p:PublishTrimmed=true

# Ready to run (faster startup)
dotnet publish -c Release -r win-x64 \
  --self-contained \
  -p:PublishSingleFile=true \
  -p:PublishReadyToRun=true
```

## Runtime Identifiers (RID)

| RID | Platform |
|-----|----------|
| `win-x64` | Windows 64-bit |
| `win-x86` | Windows 32-bit |
| `linux-x64` | Linux 64-bit |
| `linux-arm64` | Linux ARM64 |
| `linux-musl-x64` | Alpine Linux |
| `osx-x64` | macOS Intel |
| `osx-arm64` | macOS Apple Silicon |

## Docker Deployment

### Basic Dockerfile

```dockerfile
# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy csproj and restore
COPY ["MyApp/MyApp.csproj", "MyApp/"]
RUN dotnet restore "MyApp/MyApp.csproj"

# Copy everything and build
COPY . .
WORKDIR /src/MyApp
RUN dotnet build -c Release -o /app/build

# Publish stage
FROM build AS publish
RUN dotnet publish -c Release -o /app/publish

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=publish /app/publish .
EXPOSE 8080
ENTRYPOINT ["dotnet", "MyApp.dll"]
```

### Optimized Dockerfile

```dockerfile
# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0-alpine AS build
WORKDIR /src

# Copy only project files first (better caching)
COPY *.sln .
COPY src/MyApp/*.csproj ./src/MyApp/
COPY tests/MyApp.Tests/*.csproj ./tests/MyApp.Tests/

RUN dotnet restore

# Copy everything else
COPY . .

# Build and test
RUN dotnet build -c Release --no-restore
RUN dotnet test -c Release --no-build --no-restore

# Publish
WORKDIR /src/src/MyApp
RUN dotnet publish -c Release -o /app/publish --no-restore

# Runtime stage (minimal image)
FROM mcr.microsoft.com/dotnet/aspnet:8.0-alpine AS final
WORKDIR /app

# Create non-root user
RUN adduser -D appuser
USER appuser

COPY --from=build /app/publish .
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080
ENTRYPOINT ["dotnet", "MyApp.dll"]
```

### Docker Compose

```yaml
version: '3.8'

services:
  api:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "5000:8080"
    environment:
      - ASPNETCORE_ENVIRONMENT=Production
      - ConnectionStrings__Default=Server=db;Database=MyApp;...
    depends_on:
      - db

  db:
    image: postgres:15
    environment:
      POSTGRES_PASSWORD: secret
      POSTGRES_DB: MyApp
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

### Build and Run

```bash
# Build image
docker build -t myapp .

# Run container
docker run -d -p 5000:8080 --name myapp-container myapp

# With environment variables
docker run -d -p 5000:8080 \
  -e ASPNETCORE_ENVIRONMENT=Production \
  -e ConnectionStrings__Default="..." \
  myapp

# Docker Compose
docker-compose up -d
```

## Cloud Deployment

### Azure App Service

```bash
# Login to Azure
az login

# Create resource group
az group create --name myapp-rg --location eastus

# Create App Service plan
az appservice plan create \
  --name myapp-plan \
  --resource-group myapp-rg \
  --sku B1 \
  --is-linux

# Create web app
az webapp create \
  --name myapp-webapp \
  --resource-group myapp-rg \
  --plan myapp-plan \
  --runtime "DOTNET|8.0"

# Deploy from local
dotnet publish -c Release
az webapp deploy \
  --resource-group myapp-rg \
  --name myapp-webapp \
  --src-path ./publish
```

### AWS Elastic Beanstalk

```bash
# Initialize EB CLI
eb init myapp --platform "64bit Amazon Linux 2023 v3.0.0 running .NET 8"

# Create environment
eb create myapp-env

# Deploy
eb deploy
```

### Azure Container Apps

```bash
# Create container app
az containerapp create \
  --name myapp \
  --resource-group myapp-rg \
  --environment myapp-env \
  --image myregistry.azurecr.io/myapp:latest \
  --target-port 8080 \
  --ingress external
```

## Production Configuration

### appsettings.Production.json

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Warning",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "myapp.com;*.myapp.com"
}
```

### Program.cs for Production

```csharp
var builder = WebApplication.CreateBuilder(args);

// Production-specific configuration
if (builder.Environment.IsProduction())
{
    builder.Services.AddApplicationInsightsTelemetry();
    builder.Services.AddHealthChecks()
        .AddSqlServer(builder.Configuration.GetConnectionString("Default")!);
}

var app = builder.Build();

if (app.Environment.IsProduction())
{
    app.UseExceptionHandler("/error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseHealthChecks("/health");

app.Run();
```

## Health Checks

```csharp
builder.Services.AddHealthChecks()
    .AddCheck("self", () => HealthCheckResult.Healthy())
    .AddSqlServer(
        connectionString: builder.Configuration.GetConnectionString("Default")!,
        name: "database")
    .AddRedis(
        redisConnectionString: builder.Configuration["Redis:ConnectionString"]!,
        name: "redis");

app.MapHealthChecks("/health", new HealthCheckOptions
{
    ResponseWriter = async (context, report) =>
    {
        context.Response.ContentType = "application/json";
        var result = JsonSerializer.Serialize(new
        {
            status = report.Status.ToString(),
            checks = report.Entries.Select(e => new
            {
                name = e.Key,
                status = e.Value.Status.ToString(),
                description = e.Value.Description
            })
        });
        await context.Response.WriteAsync(result);
    }
});
```

## Environment Variables

```bash
# Set environment
export ASPNETCORE_ENVIRONMENT=Production

# Connection strings
export ConnectionStrings__Default="Server=..."

# Custom settings
export AppSettings__ApiKey="..."

# Docker
docker run -e ASPNETCORE_ENVIRONMENT=Production \
           -e ConnectionStrings__Default="..." \
           myapp
```

## Deployment Checklist

::: tip Production Checklist
- [ ] Set `ASPNETCORE_ENVIRONMENT=Production`
- [ ] Configure HTTPS/TLS
- [ ] Set up health checks
- [ ] Configure logging and monitoring
- [ ] Use secrets management (not appsettings)
- [ ] Enable response compression
- [ ] Configure CORS properly
- [ ] Set appropriate timeouts
- [ ] Configure rate limiting
- [ ] Set up backups
:::

## Summary

You've learned:
- Publishing options (FDD, SCD, Single File)
- Docker containerization
- Cloud deployment (Azure, AWS)
- Production configuration
- Health checks
- Environment management

## Congratulations!

You've completed the .NET tutorial! You now have a solid foundation in:
- .NET project structure and CLI
- Dependency injection and configuration
- Middleware and Entity Framework
- Testing and deployment

Continue building projects to master .NET development!
