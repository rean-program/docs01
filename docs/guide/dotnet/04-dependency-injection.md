# Dependency Injection

Learn how to use .NET's built-in dependency injection container for loosely coupled code.

::: info What You'll Learn
- Understanding dependency injection
- Registering services
- Service lifetimes
- Injecting dependencies
- Best practices
:::

## What is Dependency Injection?

Dependency Injection (DI) is a design pattern where dependencies are "injected" rather than created directly.

```
Without DI                        With DI
──────────                        ───────

class OrderService               class OrderService
{                                {
    private EmailService email;      private IEmailService email;

    OrderService()                   OrderService(IEmailService email)
    {                                {
        email = new EmailService();      this.email = email;
    }                                }
}                                }

❌ Tightly coupled               ✅ Loosely coupled
❌ Hard to test                  ✅ Easy to test
❌ Hard to change                ✅ Easy to change
```

## Service Registration

### Basic Registration

```csharp
var builder = WebApplication.CreateBuilder(args);

// Register services
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddTransient<IEmailService, EmailService>();
builder.Services.AddSingleton<ICacheService, MemoryCacheService>();

var app = builder.Build();
```

### Service Lifetimes

| Lifetime | Description | Use Case |
|----------|-------------|----------|
| **Singleton** | One instance for app lifetime | Caching, Configuration |
| **Scoped** | One instance per request | Database contexts, Repositories |
| **Transient** | New instance every time | Lightweight, stateless services |

```csharp
// Singleton - same instance always
builder.Services.AddSingleton<ICacheService, MemoryCacheService>();

// Scoped - same instance within a request
builder.Services.AddScoped<IDbContext, AppDbContext>();

// Transient - new instance every injection
builder.Services.AddTransient<IValidator, DataValidator>();
```

### Lifetime Visualization

```
Request 1                    Request 2
─────────                    ─────────

Singleton:  [────────────────────────────────────]
            Same instance across all requests

Scoped:     [──────────────]  [──────────────────]
            New instance      New instance

Transient:  [─] [─] [─] [─]  [─] [─] [─] [─]
            New each time     New each time
```

## Injecting Dependencies

### Constructor Injection (Recommended)

```csharp
public class OrderService : IOrderService
{
    private readonly IUserRepository _userRepository;
    private readonly IEmailService _emailService;
    private readonly ILogger<OrderService> _logger;

    public OrderService(
        IUserRepository userRepository,
        IEmailService emailService,
        ILogger<OrderService> logger)
    {
        _userRepository = userRepository;
        _emailService = emailService;
        _logger = logger;
    }

    public async Task CreateOrder(Order order)
    {
        var user = await _userRepository.GetByIdAsync(order.UserId);
        _logger.LogInformation("Creating order for {User}", user.Email);
        await _emailService.SendOrderConfirmation(user.Email, order);
    }
}
```

### Method Injection

```csharp
// In Minimal APIs
app.MapGet("/users/{id}", async (
    int id,
    IUserService userService,    // Injected automatically
    ILogger<Program> logger) =>
{
    logger.LogInformation("Getting user {Id}", id);
    return await userService.GetByIdAsync(id);
});
```

### Property Injection (Less Common)

```csharp
public class MyService
{
    [FromServices]
    public ILogger<MyService> Logger { get; set; }
}
```

## Registration Patterns

### Interface to Implementation

```csharp
// Basic registration
builder.Services.AddScoped<IUserService, UserService>();

// Multiple implementations
builder.Services.AddScoped<INotificationService, EmailNotificationService>();
builder.Services.AddScoped<INotificationService, SmsNotificationService>();

// Resolve all implementations
public class NotificationManager
{
    private readonly IEnumerable<INotificationService> _services;

    public NotificationManager(IEnumerable<INotificationService> services)
    {
        _services = services;
    }

    public async Task NotifyAll(string message)
    {
        foreach (var service in _services)
        {
            await service.SendAsync(message);
        }
    }
}
```

### Factory Pattern

```csharp
// Register with factory
builder.Services.AddScoped<IDbConnection>(provider =>
{
    var config = provider.GetRequiredService<IConfiguration>();
    var connectionString = config.GetConnectionString("Default");
    return new SqlConnection(connectionString);
});

// Factory with conditions
builder.Services.AddScoped<IPaymentService>(provider =>
{
    var config = provider.GetRequiredService<IConfiguration>();
    var useStripe = config.GetValue<bool>("UseStripe");

    return useStripe
        ? new StripePaymentService()
        : new PayPalPaymentService();
});
```

### Keyed Services (.NET 8+)

```csharp
// Register with keys
builder.Services.AddKeyedScoped<ICache, RedisCache>("redis");
builder.Services.AddKeyedScoped<ICache, MemoryCache>("memory");

// Inject by key
public class CacheService
{
    public CacheService(
        [FromKeyedServices("redis")] ICache redisCache,
        [FromKeyedServices("memory")] ICache memoryCache)
    {
        // ...
    }
}
```

## Extension Methods

### Organize Registration

```csharp
// ServiceCollectionExtensions.cs
public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddApplicationServices(
        this IServiceCollection services)
    {
        services.AddScoped<IUserService, UserService>();
        services.AddScoped<IOrderService, OrderService>();
        services.AddScoped<IProductService, ProductService>();

        return services;
    }

    public static IServiceCollection AddInfrastructureServices(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        services.AddDbContext<AppDbContext>(options =>
            options.UseSqlServer(
                configuration.GetConnectionString("Default")));

        services.AddScoped<IEmailService, SmtpEmailService>();

        return services;
    }
}

// Program.cs - clean registration
builder.Services.AddApplicationServices();
builder.Services.AddInfrastructureServices(builder.Configuration);
```

## Using IServiceProvider

```csharp
// Resolve service manually (use sparingly)
public class ServiceFactory
{
    private readonly IServiceProvider _provider;

    public ServiceFactory(IServiceProvider provider)
    {
        _provider = provider;
    }

    public T CreateService<T>() where T : notnull
    {
        return _provider.GetRequiredService<T>();
    }
}

// In Minimal APIs
app.MapGet("/manual", (IServiceProvider sp) =>
{
    var service = sp.GetRequiredService<IUserService>();
    return service.GetAll();
});
```

## Scoped Services in Background Tasks

```csharp
public class BackgroundWorker : BackgroundService
{
    private readonly IServiceScopeFactory _scopeFactory;

    public BackgroundWorker(IServiceScopeFactory scopeFactory)
    {
        _scopeFactory = scopeFactory;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            // Create scope for scoped services
            using var scope = _scopeFactory.CreateScope();
            var dbContext = scope.ServiceProvider
                .GetRequiredService<AppDbContext>();

            // Use dbContext...

            await Task.Delay(TimeSpan.FromMinutes(1), stoppingToken);
        }
    }
}
```

## Complete Example

```csharp
// Interfaces
public interface IUserRepository
{
    Task<User?> GetByIdAsync(int id);
    Task<IEnumerable<User>> GetAllAsync();
    Task CreateAsync(User user);
}

public interface IEmailService
{
    Task SendWelcomeEmailAsync(string email, string name);
}

public interface IUserService
{
    Task<User?> GetByIdAsync(int id);
    Task<IEnumerable<User>> GetAllAsync();
    Task CreateAsync(CreateUserRequest request);
}

// Implementations
public class UserRepository : IUserRepository
{
    private readonly AppDbContext _context;

    public UserRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<User?> GetByIdAsync(int id)
        => await _context.Users.FindAsync(id);

    public async Task<IEnumerable<User>> GetAllAsync()
        => await _context.Users.ToListAsync();

    public async Task CreateAsync(User user)
    {
        _context.Users.Add(user);
        await _context.SaveChangesAsync();
    }
}

public class EmailService : IEmailService
{
    private readonly ILogger<EmailService> _logger;

    public EmailService(ILogger<EmailService> logger)
    {
        _logger = logger;
    }

    public async Task SendWelcomeEmailAsync(string email, string name)
    {
        _logger.LogInformation("Sending welcome email to {Email}", email);
        // Send email...
        await Task.CompletedTask;
    }
}

public class UserService : IUserService
{
    private readonly IUserRepository _repository;
    private readonly IEmailService _emailService;
    private readonly ILogger<UserService> _logger;

    public UserService(
        IUserRepository repository,
        IEmailService emailService,
        ILogger<UserService> logger)
    {
        _repository = repository;
        _emailService = emailService;
        _logger = logger;
    }

    public Task<User?> GetByIdAsync(int id)
        => _repository.GetByIdAsync(id);

    public Task<IEnumerable<User>> GetAllAsync()
        => _repository.GetAllAsync();

    public async Task CreateAsync(CreateUserRequest request)
    {
        var user = new User { Name = request.Name, Email = request.Email };
        await _repository.CreateAsync(user);

        _logger.LogInformation("Created user {Id}", user.Id);
        await _emailService.SendWelcomeEmailAsync(user.Email, user.Name);
    }
}

// Program.cs
var builder = WebApplication.CreateBuilder(args);

// Register services
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("Default")));

builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddTransient<IEmailService, EmailService>();

var app = builder.Build();

// Use services in endpoints
app.MapGet("/users", async (IUserService service)
    => await service.GetAllAsync());

app.MapGet("/users/{id}", async (int id, IUserService service)
    => await service.GetByIdAsync(id));

app.MapPost("/users", async (CreateUserRequest request, IUserService service) =>
{
    await service.CreateAsync(request);
    return Results.Created();
});

app.Run();
```

## Summary

You've learned:
- DI concepts and benefits
- Service registration methods
- Service lifetimes (Singleton, Scoped, Transient)
- Injection patterns
- Extension methods for organization
- Handling scoped services in background tasks

## Next Steps

Continue to [Configuration](/guide/dotnet/05-configuration) to learn about app settings!
