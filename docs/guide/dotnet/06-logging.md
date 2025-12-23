# Logging

Learn how to implement structured logging in your .NET applications.

::: info What You'll Learn
- Built-in logging framework
- Log levels and categories
- Structured logging
- Third-party logging providers
- Best practices
:::

## Built-in Logging

.NET includes a built-in logging framework that's automatically configured.

```csharp
var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

app.MapGet("/", (ILogger<Program> logger) =>
{
    logger.LogInformation("Hello endpoint was called");
    return "Hello, World!";
});

app.Run();
```

## Log Levels

| Level | Method | Description |
|-------|--------|-------------|
| Trace | `LogTrace` | Most detailed, for debugging |
| Debug | `LogDebug` | Development information |
| Information | `LogInformation` | General flow of application |
| Warning | `LogWarning` | Abnormal or unexpected events |
| Error | `LogError` | Errors and exceptions |
| Critical | `LogCritical` | Failures requiring attention |

```csharp
public class OrderService
{
    private readonly ILogger<OrderService> _logger;

    public OrderService(ILogger<OrderService> logger)
    {
        _logger = logger;
    }

    public async Task ProcessOrder(Order order)
    {
        _logger.LogTrace("Starting order processing");
        _logger.LogDebug("Order details: {OrderId}", order.Id);
        _logger.LogInformation("Processing order {OrderId} for {Customer}",
            order.Id, order.CustomerName);

        if (order.Items.Count == 0)
        {
            _logger.LogWarning("Order {OrderId} has no items", order.Id);
        }

        try
        {
            await SaveOrder(order);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to save order {OrderId}", order.Id);
            throw;
        }

        _logger.LogInformation("Order {OrderId} processed successfully", order.Id);
    }
}
```

## Configuring Log Levels

### appsettings.json

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning",
      "Microsoft.EntityFrameworkCore": "Warning",
      "MyApp.Services": "Debug"
    },
    "Console": {
      "LogLevel": {
        "Default": "Information"
      }
    }
  }
}
```

### Environment-Specific

```json
// appsettings.Development.json
{
  "Logging": {
    "LogLevel": {
      "Default": "Debug",
      "Microsoft.EntityFrameworkCore.Database.Command": "Information"
    }
  }
}
```

## Structured Logging

### Message Templates

```csharp
// Good - structured data
_logger.LogInformation(
    "User {UserId} ordered {ItemCount} items for {Total:C}",
    userId, itemCount, total);

// Avoid - string interpolation
_logger.LogInformation(
    $"User {userId} ordered {itemCount} items for {total:C}");
```

### Why Structured Logging?

```
Structured (Searchable):
┌────────────────────────────────────────────────────────┐
│ Message: "User {UserId} ordered {ItemCount} items"     │
│ Properties:                                            │
│   - UserId: 12345                                      │
│   - ItemCount: 3                                       │
│   - Total: 99.99                                       │
└────────────────────────────────────────────────────────┘

// Query in log aggregator:
// WHERE UserId = 12345 AND ItemCount > 2
```

## Log Scopes

```csharp
public class OrderProcessor
{
    private readonly ILogger<OrderProcessor> _logger;

    public async Task ProcessOrders(IEnumerable<Order> orders)
    {
        using (_logger.BeginScope("BatchId: {BatchId}", Guid.NewGuid()))
        {
            foreach (var order in orders)
            {
                using (_logger.BeginScope(new Dictionary<string, object>
                {
                    ["OrderId"] = order.Id,
                    ["CustomerId"] = order.CustomerId
                }))
                {
                    _logger.LogInformation("Processing order");
                    // All logs here include BatchId, OrderId, CustomerId
                }
            }
        }
    }
}
```

## Logging Providers

### Built-in Providers

```csharp
var builder = WebApplication.CreateBuilder(args);

// Configure logging providers
builder.Logging.ClearProviders();
builder.Logging.AddConsole();
builder.Logging.AddDebug();
builder.Logging.AddEventLog();        // Windows only
builder.Logging.AddEventSourceLogger();
```

### Serilog

Popular structured logging library:

```bash
dotnet add package Serilog.AspNetCore
dotnet add package Serilog.Sinks.Console
dotnet add package Serilog.Sinks.File
```

```csharp
using Serilog;

var builder = WebApplication.CreateBuilder(args);

// Configure Serilog
builder.Host.UseSerilog((context, config) =>
{
    config
        .ReadFrom.Configuration(context.Configuration)
        .Enrich.FromLogContext()
        .Enrich.WithMachineName()
        .Enrich.WithThreadId()
        .WriteTo.Console(outputTemplate:
            "[{Timestamp:HH:mm:ss} {Level:u3}] {Message:lj}{NewLine}{Exception}")
        .WriteTo.File("logs/app-.log",
            rollingInterval: RollingInterval.Day,
            retainedFileCountLimit: 7);
});

var app = builder.Build();

// Request logging middleware
app.UseSerilogRequestLogging();

app.Run();
```

### Serilog Configuration in appsettings.json

```json
{
  "Serilog": {
    "MinimumLevel": {
      "Default": "Information",
      "Override": {
        "Microsoft.AspNetCore": "Warning",
        "System": "Warning"
      }
    },
    "WriteTo": [
      {
        "Name": "Console"
      },
      {
        "Name": "File",
        "Args": {
          "path": "logs/app-.log",
          "rollingInterval": "Day"
        }
      }
    ],
    "Enrich": ["FromLogContext", "WithMachineName", "WithThreadId"]
  }
}
```

## High-Performance Logging

### LoggerMessage Attribute (.NET 6+)

```csharp
public partial class OrderService
{
    private readonly ILogger<OrderService> _logger;

    public OrderService(ILogger<OrderService> logger)
    {
        _logger = logger;
    }

    [LoggerMessage(
        EventId = 1001,
        Level = LogLevel.Information,
        Message = "Processing order {OrderId} for customer {CustomerId}")]
    partial void LogOrderProcessing(int orderId, int customerId);

    [LoggerMessage(
        EventId = 1002,
        Level = LogLevel.Error,
        Message = "Failed to process order {OrderId}")]
    partial void LogOrderFailed(int orderId, Exception ex);

    public void ProcessOrder(Order order)
    {
        LogOrderProcessing(order.Id, order.CustomerId);

        try
        {
            // Process...
        }
        catch (Exception ex)
        {
            LogOrderFailed(order.Id, ex);
            throw;
        }
    }
}
```

### Traditional High-Performance Pattern

```csharp
public class OrderService
{
    private static readonly Action<ILogger, int, int, Exception?> _logOrderProcessing =
        LoggerMessage.Define<int, int>(
            LogLevel.Information,
            new EventId(1001, nameof(ProcessOrder)),
            "Processing order {OrderId} for customer {CustomerId}");

    private readonly ILogger<OrderService> _logger;

    public void ProcessOrder(Order order)
    {
        _logOrderProcessing(_logger, order.Id, order.CustomerId, null);
    }
}
```

## Exception Logging

```csharp
try
{
    await ProcessPayment(order);
}
catch (PaymentException ex)
{
    // Include exception as first parameter
    _logger.LogError(ex,
        "Payment failed for order {OrderId}. Amount: {Amount}",
        order.Id, order.Total);

    throw;
}
catch (Exception ex)
{
    _logger.LogCritical(ex,
        "Unexpected error processing order {OrderId}",
        order.Id);

    throw;
}
```

## Complete Example

```csharp
using Serilog;

var builder = WebApplication.CreateBuilder(args);

// Configure Serilog
Log.Logger = new LoggerConfiguration()
    .ReadFrom.Configuration(builder.Configuration)
    .Enrich.FromLogContext()
    .CreateLogger();

builder.Host.UseSerilog();

builder.Services.AddScoped<IOrderService, OrderService>();

var app = builder.Build();

app.UseSerilogRequestLogging(options =>
{
    options.EnrichDiagnosticContext = (diagnosticContext, httpContext) =>
    {
        diagnosticContext.Set("RequestHost", httpContext.Request.Host.Value);
        diagnosticContext.Set("UserAgent", httpContext.Request.Headers["User-Agent"]);
    };
});

app.MapPost("/orders", async (
    Order order,
    IOrderService orderService,
    ILogger<Program> logger) =>
{
    using (logger.BeginScope(new Dictionary<string, object>
    {
        ["OrderId"] = order.Id,
        ["CustomerId"] = order.CustomerId
    }))
    {
        logger.LogInformation("Received order request");

        try
        {
            await orderService.ProcessAsync(order);
            logger.LogInformation("Order completed successfully");
            return Results.Ok(new { order.Id, Status = "Processed" });
        }
        catch (ValidationException ex)
        {
            logger.LogWarning(ex, "Order validation failed");
            return Results.BadRequest(new { Error = ex.Message });
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Order processing failed");
            return Results.StatusCode(500);
        }
    }
});

try
{
    Log.Information("Starting application");
    app.Run();
}
catch (Exception ex)
{
    Log.Fatal(ex, "Application terminated unexpectedly");
}
finally
{
    Log.CloseAndFlush();
}

// Service with logging
public class OrderService : IOrderService
{
    private readonly ILogger<OrderService> _logger;

    public OrderService(ILogger<OrderService> logger)
    {
        _logger = logger;
    }

    public async Task ProcessAsync(Order order)
    {
        _logger.LogDebug("Validating order with {ItemCount} items", order.Items.Count);

        if (order.Items.Count == 0)
        {
            _logger.LogWarning("Order has no items");
            throw new ValidationException("Order must have at least one item");
        }

        _logger.LogInformation("Processing payment of {Amount:C}", order.Total);
        await Task.Delay(100); // Simulate processing

        _logger.LogInformation("Order processed, sending confirmation email");
    }
}
```

## Best Practices

::: tip Do's
- Use structured logging with message templates
- Include relevant context (IDs, operation names)
- Log at appropriate levels
- Use scopes for correlation
- Include exception objects, not just messages
:::

::: warning Don'ts
- Don't log sensitive data (passwords, tokens, PII)
- Don't use string interpolation in log messages
- Don't log too much in production (performance)
- Don't ignore log levels in configuration
:::

## Summary

You've learned:
- Built-in logging framework
- Log levels and when to use them
- Structured logging with templates
- Configuring logging providers
- Using Serilog for advanced logging
- High-performance logging patterns

## Next Steps

Continue to [Middleware](/guide/dotnet/07-middleware) to learn about the HTTP pipeline!
