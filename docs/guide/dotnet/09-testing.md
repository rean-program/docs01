# Testing

Learn how to write unit tests and integration tests for .NET applications.

::: info What You'll Learn
- Setting up test projects
- Unit testing with xUnit
- Mocking dependencies
- Integration testing
- Testing best practices
:::

## Test Project Setup

### Create Test Project

```bash
# Create xUnit test project
dotnet new xunit -n MyApp.Tests

# Add to solution
dotnet sln add MyApp.Tests

# Add reference to project under test
dotnet add MyApp.Tests reference src/MyApp

# Add testing packages
dotnet add MyApp.Tests package Moq
dotnet add MyApp.Tests package FluentAssertions
```

## Unit Testing with xUnit

### Basic Test Structure

```csharp
public class CalculatorTests
{
    [Fact]
    public void Add_TwoNumbers_ReturnsSum()
    {
        // Arrange
        var calculator = new Calculator();

        // Act
        var result = calculator.Add(2, 3);

        // Assert
        Assert.Equal(5, result);
    }

    [Theory]
    [InlineData(1, 2, 3)]
    [InlineData(0, 0, 0)]
    [InlineData(-1, 1, 0)]
    public void Add_VariousInputs_ReturnsCorrectSum(int a, int b, int expected)
    {
        var calculator = new Calculator();
        var result = calculator.Add(a, b);
        Assert.Equal(expected, result);
    }
}
```

### Test Attributes

| Attribute | Description |
|-----------|-------------|
| `[Fact]` | Single test case |
| `[Theory]` | Parameterized test |
| `[InlineData]` | Inline test data |
| `[ClassData]` | Test data from class |
| `[MemberData]` | Test data from member |
| `[Skip]` | Skip test with reason |

### Theory with Complex Data

```csharp
public class UserValidatorTests
{
    [Theory]
    [MemberData(nameof(GetValidUserData))]
    public void Validate_ValidUser_ReturnsTrue(User user)
    {
        var validator = new UserValidator();
        var result = validator.Validate(user);
        Assert.True(result.IsValid);
    }

    public static IEnumerable<object[]> GetValidUserData()
    {
        yield return new object[]
        {
            new User { Name = "Alice", Email = "alice@example.com" }
        };
        yield return new object[]
        {
            new User { Name = "Bob", Email = "bob@test.com" }
        };
    }
}
```

## FluentAssertions

```csharp
using FluentAssertions;

public class UserServiceTests
{
    [Fact]
    public void GetUser_ExistingUser_ReturnsUser()
    {
        var service = new UserService();
        var user = service.GetById(1);

        // FluentAssertions provides readable assertions
        user.Should().NotBeNull();
        user.Name.Should().Be("Alice");
        user.Age.Should().BeGreaterThan(0);
        user.Email.Should().Contain("@");
    }

    [Fact]
    public void GetUsers_ReturnsOrderedList()
    {
        var service = new UserService();
        var users = service.GetAll();

        users.Should().HaveCount(3);
        users.Should().BeInAscendingOrder(u => u.Name);
        users.Should().OnlyContain(u => u.IsActive);
    }

    [Fact]
    public void CreateUser_InvalidEmail_ThrowsException()
    {
        var service = new UserService();

        Action act = () => service.Create("Alice", "invalid-email");

        act.Should().Throw<ValidationException>()
           .WithMessage("*email*");
    }
}
```

## Mocking with Moq

### Basic Mocking

```csharp
public class OrderServiceTests
{
    [Fact]
    public async Task CreateOrder_ValidOrder_SendsEmail()
    {
        // Arrange
        var mockEmailService = new Mock<IEmailService>();
        var mockRepository = new Mock<IOrderRepository>();

        mockRepository
            .Setup(r => r.AddAsync(It.IsAny<Order>()))
            .ReturnsAsync((Order o) => { o.Id = 1; return o; });

        var service = new OrderService(
            mockRepository.Object,
            mockEmailService.Object);

        var order = new Order { CustomerId = 1, Total = 100 };

        // Act
        await service.CreateAsync(order);

        // Assert
        mockEmailService.Verify(
            e => e.SendOrderConfirmationAsync(It.IsAny<string>(), It.Is<Order>(o => o.Id == 1)),
            Times.Once);
    }
}
```

### Advanced Mocking

```csharp
public class ProductServiceTests
{
    private readonly Mock<IProductRepository> _mockRepo;
    private readonly Mock<ILogger<ProductService>> _mockLogger;
    private readonly ProductService _service;

    public ProductServiceTests()
    {
        _mockRepo = new Mock<IProductRepository>();
        _mockLogger = new Mock<ILogger<ProductService>>();
        _service = new ProductService(_mockRepo.Object, _mockLogger.Object);
    }

    [Fact]
    public async Task GetProducts_WithFilter_CallsRepositoryWithFilter()
    {
        // Setup with callback to capture arguments
        string? capturedCategory = null;
        _mockRepo
            .Setup(r => r.GetByCategoryAsync(It.IsAny<string>()))
            .Callback<string>(cat => capturedCategory = cat)
            .ReturnsAsync(new List<Product>());

        await _service.GetProductsByCategoryAsync("Electronics");

        capturedCategory.Should().Be("Electronics");
    }

    [Fact]
    public async Task GetProducts_RepositoryThrows_LogsError()
    {
        _mockRepo
            .Setup(r => r.GetAllAsync())
            .ThrowsAsync(new DatabaseException("Connection failed"));

        Func<Task> act = () => _service.GetAllAsync();

        await act.Should().ThrowAsync<ServiceException>();

        _mockLogger.Verify(
            x => x.Log(
                LogLevel.Error,
                It.IsAny<EventId>(),
                It.Is<It.IsAnyType>((v, t) => true),
                It.IsAny<Exception>(),
                It.Is<Func<It.IsAnyType, Exception?, string>>((v, t) => true)),
            Times.Once);
    }
}
```

## Integration Testing

### WebApplicationFactory

```csharp
public class ApiIntegrationTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly WebApplicationFactory<Program> _factory;
    private readonly HttpClient _client;

    public ApiIntegrationTests(WebApplicationFactory<Program> factory)
    {
        _factory = factory;
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task GetUsers_ReturnsSuccessAndCorrectContentType()
    {
        var response = await _client.GetAsync("/api/users");

        response.EnsureSuccessStatusCode();
        response.Content.Headers.ContentType?.ToString()
            .Should().Be("application/json; charset=utf-8");
    }

    [Fact]
    public async Task CreateUser_ValidUser_ReturnsCreated()
    {
        var user = new { Name = "Test User", Email = "test@example.com" };
        var content = new StringContent(
            JsonSerializer.Serialize(user),
            Encoding.UTF8,
            "application/json");

        var response = await _client.PostAsync("/api/users", content);

        response.StatusCode.Should().Be(HttpStatusCode.Created);
    }
}
```

### Custom WebApplicationFactory

```csharp
public class CustomWebApplicationFactory : WebApplicationFactory<Program>
{
    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.ConfigureServices(services =>
        {
            // Remove real database
            var descriptor = services.SingleOrDefault(
                d => d.ServiceType == typeof(DbContextOptions<AppDbContext>));

            if (descriptor != null)
                services.Remove(descriptor);

            // Add in-memory database
            services.AddDbContext<AppDbContext>(options =>
            {
                options.UseInMemoryDatabase("TestDb");
            });

            // Build service provider
            var sp = services.BuildServiceProvider();

            // Seed test data
            using var scope = sp.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            db.Database.EnsureCreated();
            SeedTestData(db);
        });
    }

    private void SeedTestData(AppDbContext context)
    {
        context.Users.AddRange(
            new User { Name = "Test User 1", Email = "user1@test.com" },
            new User { Name = "Test User 2", Email = "user2@test.com" }
        );
        context.SaveChanges();
    }
}

public class UserApiTests : IClassFixture<CustomWebApplicationFactory>
{
    private readonly HttpClient _client;

    public UserApiTests(CustomWebApplicationFactory factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task GetUsers_ReturnsSeededUsers()
    {
        var response = await _client.GetAsync("/api/users");
        var users = await response.Content.ReadFromJsonAsync<List<User>>();

        users.Should().HaveCount(2);
    }
}
```

## Testing async Code

```csharp
public class AsyncServiceTests
{
    [Fact]
    public async Task ProcessAsync_CompletesSuccessfully()
    {
        var service = new AsyncService();

        var result = await service.ProcessAsync("data");

        result.Should().NotBeNull();
    }

    [Fact]
    public async Task ProcessAsync_Timeout_ThrowsException()
    {
        var service = new SlowService();

        Func<Task> act = async () =>
        {
            using var cts = new CancellationTokenSource(TimeSpan.FromMilliseconds(100));
            await service.ProcessAsync(cts.Token);
        };

        await act.Should().ThrowAsync<OperationCanceledException>();
    }
}
```

## Test Fixtures

```csharp
public class DatabaseFixture : IDisposable
{
    public AppDbContext Context { get; }

    public DatabaseFixture()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        Context = new AppDbContext(options);
        SeedData();
    }

    private void SeedData()
    {
        Context.Users.Add(new User { Name = "Test", Email = "test@test.com" });
        Context.SaveChanges();
    }

    public void Dispose()
    {
        Context.Dispose();
    }
}

public class UserRepositoryTests : IClassFixture<DatabaseFixture>
{
    private readonly DatabaseFixture _fixture;

    public UserRepositoryTests(DatabaseFixture fixture)
    {
        _fixture = fixture;
    }

    [Fact]
    public async Task GetAll_ReturnsUsers()
    {
        var repository = new UserRepository(_fixture.Context);

        var users = await repository.GetAllAsync();

        users.Should().NotBeEmpty();
    }
}
```

## Running Tests

```bash
# Run all tests
dotnet test

# Run with verbosity
dotnet test -v normal

# Run specific test class
dotnet test --filter "FullyQualifiedName~UserServiceTests"

# Run tests with coverage
dotnet test --collect:"XPlat Code Coverage"

# Run in parallel
dotnet test --parallel
```

## Summary

You've learned:
- Setting up test projects
- Writing unit tests with xUnit
- Using FluentAssertions
- Mocking with Moq
- Integration testing with WebApplicationFactory
- Testing async code
- Test fixtures and data

## Next Steps

Continue to [Deployment](/guide/dotnet/10-deployment) to learn about publishing applications!
