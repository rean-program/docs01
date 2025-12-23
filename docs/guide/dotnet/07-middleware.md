# Middleware

Learn how to build and use middleware in the ASP.NET Core request pipeline.

::: info What You'll Learn
- Understanding the middleware pipeline
- Built-in middleware
- Creating custom middleware
- Middleware ordering
- Branching the pipeline
:::

## What is Middleware?

Middleware are components that process HTTP requests and responses in a pipeline.

```
Request → [Middleware 1] → [Middleware 2] → [Middleware 3] → Endpoint
                ↓               ↓               ↓               ↓
Response ← [Middleware 1] ← [Middleware 2] ← [Middleware 3] ← Endpoint
```

Each middleware can:
- Process the incoming request
- Call the next middleware
- Process the outgoing response
- Short-circuit the pipeline

## Basic Pipeline

```csharp
var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

// Middleware are added in order
app.UseExceptionHandler("/error");  // 1. Handle exceptions
app.UseHsts();                       // 2. HTTP Strict Transport Security
app.UseHttpsRedirection();           // 3. Redirect HTTP to HTTPS
app.UseStaticFiles();                // 4. Serve static files
app.UseRouting();                    // 5. Match routes
app.UseAuthentication();             // 6. Authenticate user
app.UseAuthorization();              // 7. Authorize user
app.MapControllers();                // 8. Execute endpoint

app.Run();
```

## Recommended Middleware Order

```
1. Exception Handling     (wrap everything)
2. HSTS                   (security headers)
3. HTTPS Redirection      (force HTTPS)
4. Static Files           (serve files, may short-circuit)
5. Routing                (match routes)
6. CORS                   (cross-origin requests)
7. Authentication         (identify user)
8. Authorization          (check permissions)
9. Custom Middleware      (your logic)
10. Endpoints             (handle request)
```

## Built-in Middleware

### Common Middleware

```csharp
var app = builder.Build();

// Exception handling
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}
else
{
    app.UseExceptionHandler("/error");
}

// Security
app.UseHsts();
app.UseHttpsRedirection();

// Static files
app.UseStaticFiles();
app.UseDefaultFiles();

// Routing
app.UseRouting();

// CORS
app.UseCors("AllowAll");

// Authentication & Authorization
app.UseAuthentication();
app.UseAuthorization();

// Response caching
app.UseResponseCaching();

// Response compression
app.UseResponseCompression();
```

## Creating Custom Middleware

### Inline Middleware (Use/Run/Map)

```csharp
var app = builder.Build();

// Use - calls next middleware
app.Use(async (context, next) =>
{
    Console.WriteLine($"Before: {context.Request.Path}");

    await next();  // Call next middleware

    Console.WriteLine($"After: {context.Response.StatusCode}");
});

// Run - terminal (doesn't call next)
app.Run(async context =>
{
    await context.Response.WriteAsync("Hello from Run!");
});
```

### Map - Branch by Path

```csharp
app.Map("/api", apiApp =>
{
    apiApp.Use(async (context, next) =>
    {
        // Only runs for /api/* requests
        context.Response.Headers.Append("X-API-Version", "1.0");
        await next();
    });
});

app.MapWhen(
    context => context.Request.Query.ContainsKey("debug"),
    debugApp =>
    {
        debugApp.Run(async context =>
        {
            await context.Response.WriteAsync("Debug mode!");
        });
    });
```

### Middleware Class

```csharp
public class RequestTimingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<RequestTimingMiddleware> _logger;

    public RequestTimingMiddleware(
        RequestDelegate next,
        ILogger<RequestTimingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        var stopwatch = Stopwatch.StartNew();

        // Add timing header
        context.Response.OnStarting(() =>
        {
            context.Response.Headers.Append(
                "X-Response-Time",
                $"{stopwatch.ElapsedMilliseconds}ms");
            return Task.CompletedTask;
        });

        try
        {
            await _next(context);
        }
        finally
        {
            stopwatch.Stop();
            _logger.LogInformation(
                "Request {Method} {Path} completed in {ElapsedMs}ms",
                context.Request.Method,
                context.Request.Path,
                stopwatch.ElapsedMilliseconds);
        }
    }
}

// Extension method for clean registration
public static class RequestTimingMiddlewareExtensions
{
    public static IApplicationBuilder UseRequestTiming(
        this IApplicationBuilder builder)
    {
        return builder.UseMiddleware<RequestTimingMiddleware>();
    }
}

// Usage
app.UseRequestTiming();
```

### Middleware with Dependencies

```csharp
public class ApiKeyMiddleware
{
    private readonly RequestDelegate _next;

    public ApiKeyMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    // Dependencies injected per-request
    public async Task InvokeAsync(
        HttpContext context,
        IApiKeyValidator validator,
        ILogger<ApiKeyMiddleware> logger)
    {
        var apiKey = context.Request.Headers["X-API-Key"].FirstOrDefault();

        if (string.IsNullOrEmpty(apiKey))
        {
            logger.LogWarning("Missing API key");
            context.Response.StatusCode = 401;
            await context.Response.WriteAsync("API key required");
            return;
        }

        if (!await validator.IsValidAsync(apiKey))
        {
            logger.LogWarning("Invalid API key: {ApiKey}", apiKey);
            context.Response.StatusCode = 403;
            await context.Response.WriteAsync("Invalid API key");
            return;
        }

        await _next(context);
    }
}
```

## Request/Response Modification

### Modifying Requests

```csharp
public class RequestModifierMiddleware
{
    private readonly RequestDelegate _next;

    public RequestModifierMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        // Add correlation ID
        if (!context.Request.Headers.ContainsKey("X-Correlation-Id"))
        {
            context.Request.Headers.Append(
                "X-Correlation-Id",
                Guid.NewGuid().ToString());
        }

        // Read and modify body (advanced)
        context.Request.EnableBuffering();

        await _next(context);
    }
}
```

### Modifying Responses

```csharp
public class ResponseModifierMiddleware
{
    private readonly RequestDelegate _next;

    public ResponseModifierMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        // Capture the original response stream
        var originalBody = context.Response.Body;

        using var memoryStream = new MemoryStream();
        context.Response.Body = memoryStream;

        await _next(context);

        // Modify response before sending
        memoryStream.Seek(0, SeekOrigin.Begin);
        var responseBody = await new StreamReader(memoryStream).ReadToEndAsync();

        // Add wrapper
        var modifiedResponse = $"{{\"data\": {responseBody}}}";

        context.Response.Body = originalBody;
        context.Response.ContentLength = Encoding.UTF8.GetByteCount(modifiedResponse);
        await context.Response.WriteAsync(modifiedResponse);
    }
}
```

## Exception Handling Middleware

```csharp
public class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;

    public ExceptionHandlingMiddleware(
        RequestDelegate next,
        ILogger<ExceptionHandlingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (ValidationException ex)
        {
            _logger.LogWarning(ex, "Validation error");
            context.Response.StatusCode = 400;
            await WriteErrorResponse(context, "Validation Error", ex.Message);
        }
        catch (NotFoundException ex)
        {
            _logger.LogWarning(ex, "Resource not found");
            context.Response.StatusCode = 404;
            await WriteErrorResponse(context, "Not Found", ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unhandled exception");
            context.Response.StatusCode = 500;
            await WriteErrorResponse(context, "Internal Error", "An error occurred");
        }
    }

    private static async Task WriteErrorResponse(
        HttpContext context,
        string title,
        string detail)
    {
        context.Response.ContentType = "application/json";
        await context.Response.WriteAsJsonAsync(new
        {
            Title = title,
            Detail = detail,
            Status = context.Response.StatusCode
        });
    }
}
```

## Complete Example

```csharp
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddScoped<IApiKeyValidator, ApiKeyValidator>();

var app = builder.Build();

// Exception handling (first)
app.UseMiddleware<ExceptionHandlingMiddleware>();

// Request timing
app.UseRequestTiming();

// Custom correlation ID
app.Use(async (context, next) =>
{
    var correlationId = context.Request.Headers["X-Correlation-Id"]
        .FirstOrDefault() ?? Guid.NewGuid().ToString();

    context.Items["CorrelationId"] = correlationId;
    context.Response.Headers.Append("X-Correlation-Id", correlationId);

    await next();
});

// API key validation for /api routes
app.MapWhen(
    context => context.Request.Path.StartsWithSegments("/api"),
    apiApp =>
    {
        apiApp.UseMiddleware<ApiKeyMiddleware>();

        apiApp.UseRouting();
        apiApp.UseEndpoints(endpoints =>
        {
            endpoints.MapGet("/api/data", () => new { Message = "Protected data" });
        });
    });

// Public routes
app.MapGet("/", () => "Welcome!");
app.MapGet("/health", () => Results.Ok(new { Status = "Healthy" }));

app.Run();

// Middleware implementations
public class RequestTimingMiddleware { /* ... */ }
public class ApiKeyMiddleware { /* ... */ }
public class ExceptionHandlingMiddleware { /* ... */ }
```

## Summary

You've learned:
- How the middleware pipeline works
- Built-in middleware and their order
- Creating inline middleware with Use/Run/Map
- Creating middleware classes
- Request/response modification
- Exception handling middleware

## Next Steps

Continue to [Entity Framework](/guide/dotnet/08-entity-framework) to learn about database access!
