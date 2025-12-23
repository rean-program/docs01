# Configuration

Learn how to manage application settings and configuration in .NET.

::: info What You'll Learn
- Configuration sources
- Reading configuration values
- Options pattern
- Environment-specific settings
- Secrets management
:::

## Configuration Sources

.NET loads configuration from multiple sources in order:

```
┌─────────────────────────────────────────────────────────┐
│                  Configuration Sources                   │
│                  (Later overrides earlier)               │
├─────────────────────────────────────────────────────────┤
│  1. appsettings.json                                    │
│  2. appsettings.{Environment}.json                      │
│  3. User secrets (Development)                          │
│  4. Environment variables                               │
│  5. Command-line arguments                              │
└─────────────────────────────────────────────────────────┘
```

## appsettings.json

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*",
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=MyDb;..."
  },
  "AppSettings": {
    "ApplicationName": "My Application",
    "MaxItemsPerPage": 50,
    "EnableFeatureX": true,
    "SupportedLanguages": ["en", "es", "fr"]
  },
  "EmailSettings": {
    "SmtpServer": "smtp.example.com",
    "Port": 587,
    "SenderEmail": "noreply@example.com"
  }
}
```

## Environment-Specific Settings

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
  },
  "AppSettings": {
    "EnableFeatureX": false
  }
}
```

### appsettings.Production.json

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Warning"
    }
  },
  "AppSettings": {
    "MaxItemsPerPage": 100
  }
}
```

## Reading Configuration

### Basic Access

```csharp
var builder = WebApplication.CreateBuilder(args);

// Access configuration
IConfiguration config = builder.Configuration;

// Read values
string appName = config["AppSettings:ApplicationName"];
int maxItems = config.GetValue<int>("AppSettings:MaxItemsPerPage");
bool featureX = config.GetValue<bool>("AppSettings:EnableFeatureX");

// Connection strings
string connectionString = config.GetConnectionString("DefaultConnection");
```

### In Controllers/Services

```csharp
public class MyService
{
    private readonly IConfiguration _config;

    public MyService(IConfiguration config)
    {
        _config = config;
    }

    public void DoSomething()
    {
        var maxItems = _config.GetValue<int>("AppSettings:MaxItemsPerPage");
        var languages = _config.GetSection("AppSettings:SupportedLanguages")
                               .Get<string[]>();
    }
}
```

## Options Pattern (Recommended)

### Define Options Classes

```csharp
public class AppSettings
{
    public string ApplicationName { get; set; } = "";
    public int MaxItemsPerPage { get; set; }
    public bool EnableFeatureX { get; set; }
    public string[] SupportedLanguages { get; set; } = Array.Empty<string>();
}

public class EmailSettings
{
    public string SmtpServer { get; set; } = "";
    public int Port { get; set; }
    public string SenderEmail { get; set; } = "";
}
```

### Register Options

```csharp
var builder = WebApplication.CreateBuilder(args);

// Bind configuration sections to classes
builder.Services.Configure<AppSettings>(
    builder.Configuration.GetSection("AppSettings"));

builder.Services.Configure<EmailSettings>(
    builder.Configuration.GetSection("EmailSettings"));
```

### Use Options

```csharp
public class EmailService
{
    private readonly EmailSettings _settings;

    // IOptions<T> - read once at startup
    public EmailService(IOptions<EmailSettings> options)
    {
        _settings = options.Value;
    }

    public void SendEmail(string to, string subject, string body)
    {
        // Use _settings.SmtpServer, _settings.Port, etc.
    }
}

public class FeatureService
{
    private readonly IOptionsMonitor<AppSettings> _options;

    // IOptionsMonitor<T> - updates when config changes
    public FeatureService(IOptionsMonitor<AppSettings> options)
    {
        _options = options;
    }

    public bool IsFeatureEnabled()
    {
        return _options.CurrentValue.EnableFeatureX;
    }
}
```

### Options Interfaces

| Interface | Lifetime | Reloads |
|-----------|----------|---------|
| `IOptions<T>` | Singleton | No |
| `IOptionsSnapshot<T>` | Scoped | Yes (per request) |
| `IOptionsMonitor<T>` | Singleton | Yes (live) |

## Options Validation

```csharp
public class EmailSettings
{
    [Required]
    public string SmtpServer { get; set; } = "";

    [Range(1, 65535)]
    public int Port { get; set; }

    [Required, EmailAddress]
    public string SenderEmail { get; set; } = "";
}

// Register with validation
builder.Services.AddOptions<EmailSettings>()
    .Bind(builder.Configuration.GetSection("EmailSettings"))
    .ValidateDataAnnotations()
    .ValidateOnStart();  // Validate at startup

// Custom validation
builder.Services.AddOptions<AppSettings>()
    .Bind(builder.Configuration.GetSection("AppSettings"))
    .Validate(settings =>
    {
        return settings.MaxItemsPerPage > 0 &&
               settings.MaxItemsPerPage <= 1000;
    }, "MaxItemsPerPage must be between 1 and 1000");
```

## Environment Variables

### Setting Environment Variables

```bash
# Linux/macOS
export ConnectionStrings__DefaultConnection="Server=..."
export AppSettings__MaxItemsPerPage=100

# Windows
set ConnectionStrings__DefaultConnection=Server=...
set AppSettings__MaxItemsPerPage=100

# Docker
docker run -e ConnectionStrings__DefaultConnection="..." myapp
```

### Naming Convention

```
JSON Path                    → Environment Variable
───────────                    ────────────────────
ConnectionStrings:Default    → ConnectionStrings__Default
AppSettings:MaxItemsPerPage  → AppSettings__MaxItemsPerPage
Nested:Deep:Value           → Nested__Deep__Value
```

## User Secrets (Development)

```bash
# Initialize user secrets
dotnet user-secrets init

# Set secrets
dotnet user-secrets set "EmailSettings:ApiKey" "super-secret-key"
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Server=..."

# List secrets
dotnet user-secrets list

# Remove secret
dotnet user-secrets remove "EmailSettings:ApiKey"

# Clear all
dotnet user-secrets clear
```

Secrets are stored in:
- **Windows**: `%APPDATA%\Microsoft\UserSecrets\<user_secrets_id>\secrets.json`
- **macOS/Linux**: `~/.microsoft/usersecrets/<user_secrets_id>/secrets.json`

## Command-Line Arguments

```bash
# Pass configuration via command line
dotnet run --AppSettings:MaxItemsPerPage=100 --Logging:LogLevel:Default=Debug
```

## Configuration Providers

### Adding Custom Providers

```csharp
var builder = WebApplication.CreateBuilder(args);

// Add additional configuration sources
builder.Configuration
    .AddJsonFile("custom-settings.json", optional: true)
    .AddEnvironmentVariables("MYAPP_")
    .AddCommandLine(args);
```

### Azure Key Vault

```csharp
builder.Configuration.AddAzureKeyVault(
    new Uri($"https://{vaultName}.vault.azure.net/"),
    new DefaultAzureCredential());
```

## Complete Example

```csharp
// Options classes
public class DatabaseSettings
{
    public string ConnectionString { get; set; } = "";
    public int CommandTimeout { get; set; } = 30;
    public bool EnableLogging { get; set; }
}

public class JwtSettings
{
    [Required]
    public string Secret { get; set; } = "";

    [Required]
    public string Issuer { get; set; } = "";

    [Required]
    public string Audience { get; set; } = "";

    [Range(1, 1440)]
    public int ExpirationMinutes { get; set; } = 60;
}

// Program.cs
var builder = WebApplication.CreateBuilder(args);

// Configure options with validation
builder.Services.AddOptions<DatabaseSettings>()
    .Bind(builder.Configuration.GetSection("Database"))
    .ValidateDataAnnotations();

builder.Services.AddOptions<JwtSettings>()
    .Bind(builder.Configuration.GetSection("Jwt"))
    .ValidateDataAnnotations()
    .ValidateOnStart();

// Register services that use options
builder.Services.AddScoped<IAuthService, AuthService>();

var app = builder.Build();

app.MapGet("/settings", (IOptions<DatabaseSettings> dbSettings) =>
{
    return new
    {
        Timeout = dbSettings.Value.CommandTimeout,
        LoggingEnabled = dbSettings.Value.EnableLogging
    };
});

app.Run();

// AuthService using options
public class AuthService : IAuthService
{
    private readonly JwtSettings _jwtSettings;

    public AuthService(IOptions<JwtSettings> jwtOptions)
    {
        _jwtSettings = jwtOptions.Value;
    }

    public string GenerateToken(User user)
    {
        // Use _jwtSettings.Secret, _jwtSettings.Issuer, etc.
        return "token";
    }
}
```

### appsettings.json for the example

```json
{
  "Database": {
    "ConnectionString": "Server=localhost;Database=MyDb;",
    "CommandTimeout": 30,
    "EnableLogging": true
  },
  "Jwt": {
    "Secret": "your-secret-key-here-min-32-chars!!",
    "Issuer": "MyApp",
    "Audience": "MyAppUsers",
    "ExpirationMinutes": 60
  }
}
```

## Summary

You've learned:
- Configuration sources and priority
- Reading configuration values
- Using the Options pattern
- Environment-specific settings
- User secrets for development
- Configuration validation

## Next Steps

Continue to [Logging](/guide/dotnet/06-logging) to learn about structured logging!
