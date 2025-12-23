# Async Programming

Learn how to write asynchronous code in C# for responsive, scalable applications.

::: info What You'll Learn
- Understanding async/await
- Creating async methods
- Handling multiple async operations
- Error handling in async code
- Best practices
:::

## Why Async?

Async programming prevents blocking operations from freezing your application.

```
Synchronous (Blocking)           Asynchronous (Non-blocking)
─────────────────────           ───────────────────────────

Thread 1: ████████████           Thread 1: ██░░░░░░██
          (blocked)                       ↓       ↑
                                      Request  Response

          Can't do                    Free to do other work
          anything else               while waiting
```

## async and await Keywords

```csharp
// async method that returns a Task
async Task DownloadDataAsync()
{
    // await pauses here until complete, but doesn't block the thread
    string data = await GetDataFromServerAsync();
    Console.WriteLine(data);
}

// async method that returns a value
async Task<string> GetGreetingAsync(string name)
{
    await Task.Delay(1000);  // Simulate async operation
    return $"Hello, {name}!";
}

// Usage
string greeting = await GetGreetingAsync("Alice");
Console.WriteLine(greeting);
```

## Task and Task\<T\>

```csharp
// Task - async operation with no return value
Task DoWorkAsync()
{
    return Task.Run(() =>
    {
        // Do some work
        Thread.Sleep(1000);
    });
}

// Task<T> - async operation that returns a value
Task<int> CalculateAsync(int x, int y)
{
    return Task.Run(() =>
    {
        Thread.Sleep(1000);
        return x + y;
    });
}

// Using the tasks
await DoWorkAsync();
int result = await CalculateAsync(5, 3);
```

## Real-World Async Examples

### HTTP Requests

```csharp
using System.Net.Http;

class ApiService
{
    private readonly HttpClient httpClient = new HttpClient();

    public async Task<string> GetUserDataAsync(int userId)
    {
        string url = $"https://api.example.com/users/{userId}";

        HttpResponseMessage response = await httpClient.GetAsync(url);
        response.EnsureSuccessStatusCode();

        string json = await response.Content.ReadAsStringAsync();
        return json;
    }

    public async Task<User> GetUserAsync(int userId)
    {
        string json = await GetUserDataAsync(userId);
        return JsonSerializer.Deserialize<User>(json);
    }
}
```

### File Operations

```csharp
public async Task<string> ReadFileAsync(string path)
{
    return await File.ReadAllTextAsync(path);
}

public async Task WriteFileAsync(string path, string content)
{
    await File.WriteAllTextAsync(path, content);
}

public async Task CopyFileAsync(string source, string destination)
{
    string content = await File.ReadAllTextAsync(source);
    await File.WriteAllTextAsync(destination, content);
}
```

## Running Multiple Async Operations

### Sequential Execution

```csharp
async Task ProcessSequentialAsync()
{
    // One after another
    var result1 = await GetDataAsync("url1");
    var result2 = await GetDataAsync("url2");
    var result3 = await GetDataAsync("url3");

    // Total time: sum of all operations
}
```

### Parallel Execution with Task.WhenAll

```csharp
async Task ProcessParallelAsync()
{
    // Start all tasks
    Task<string> task1 = GetDataAsync("url1");
    Task<string> task2 = GetDataAsync("url2");
    Task<string> task3 = GetDataAsync("url3");

    // Wait for all to complete
    string[] results = await Task.WhenAll(task1, task2, task3);

    // Total time: longest operation
}
```

### First to Complete with Task.WhenAny

```csharp
async Task<string> GetFastestResponseAsync()
{
    Task<string> task1 = GetFromServer1Async();
    Task<string> task2 = GetFromServer2Async();
    Task<string> task3 = GetFromServer3Async();

    // Returns when ANY task completes
    Task<string> winner = await Task.WhenAny(task1, task2, task3);
    return await winner;
}
```

## Error Handling

### Try-Catch with Async

```csharp
async Task<string> SafeGetDataAsync(string url)
{
    try
    {
        return await httpClient.GetStringAsync(url);
    }
    catch (HttpRequestException ex)
    {
        Console.WriteLine($"HTTP Error: {ex.Message}");
        return null;
    }
    catch (TaskCanceledException)
    {
        Console.WriteLine("Request timed out");
        return null;
    }
}
```

### Handling Multiple Task Errors

```csharp
async Task ProcessWithErrorHandlingAsync()
{
    var tasks = new List<Task<string>>
    {
        GetDataAsync("url1"),
        GetDataAsync("url2"),
        GetDataAsync("url3")
    };

    try
    {
        string[] results = await Task.WhenAll(tasks);
    }
    catch (Exception)
    {
        // Handle individual task exceptions
        foreach (var task in tasks)
        {
            if (task.IsFaulted)
            {
                Console.WriteLine($"Error: {task.Exception?.InnerException?.Message}");
            }
            else if (task.IsCompletedSuccessfully)
            {
                Console.WriteLine($"Success: {task.Result}");
            }
        }
    }
}
```

## Cancellation

```csharp
async Task LongRunningOperationAsync(CancellationToken cancellationToken)
{
    for (int i = 0; i < 100; i++)
    {
        // Check for cancellation
        cancellationToken.ThrowIfCancellationRequested();

        await Task.Delay(100, cancellationToken);
        Console.WriteLine($"Step {i + 1} complete");
    }
}

// Usage
var cts = new CancellationTokenSource();

// Cancel after 2 seconds
cts.CancelAfter(TimeSpan.FromSeconds(2));

try
{
    await LongRunningOperationAsync(cts.Token);
}
catch (OperationCanceledException)
{
    Console.WriteLine("Operation was cancelled");
}
```

## Async Streams (IAsyncEnumerable)

```csharp
// Produce items asynchronously
async IAsyncEnumerable<int> GenerateNumbersAsync()
{
    for (int i = 1; i <= 10; i++)
    {
        await Task.Delay(500);  // Simulate async work
        yield return i;
    }
}

// Consume async stream
async Task ConsumeNumbersAsync()
{
    await foreach (int number in GenerateNumbersAsync())
    {
        Console.WriteLine(number);
    }
}
```

## ValueTask for Performance

```csharp
// Use ValueTask when result might be available synchronously
ValueTask<int> GetCachedValueAsync(int key)
{
    if (cache.TryGetValue(key, out int value))
    {
        // Return synchronously - no allocation
        return new ValueTask<int>(value);
    }

    // Fall back to async operation
    return new ValueTask<int>(FetchValueAsync(key));
}
```

## Common Patterns

### Async Initialization

```csharp
class DataService
{
    private List<Data> cachedData;
    private readonly SemaphoreSlim initLock = new SemaphoreSlim(1, 1);
    private bool isInitialized;

    public async Task<List<Data>> GetDataAsync()
    {
        if (!isInitialized)
        {
            await initLock.WaitAsync();
            try
            {
                if (!isInitialized)
                {
                    cachedData = await LoadDataFromDatabaseAsync();
                    isInitialized = true;
                }
            }
            finally
            {
                initLock.Release();
            }
        }
        return cachedData;
    }
}
```

### Retry Pattern

```csharp
async Task<T> RetryAsync<T>(Func<Task<T>> operation, int maxRetries = 3)
{
    for (int i = 0; i < maxRetries; i++)
    {
        try
        {
            return await operation();
        }
        catch (Exception ex) when (i < maxRetries - 1)
        {
            Console.WriteLine($"Attempt {i + 1} failed: {ex.Message}");
            await Task.Delay(TimeSpan.FromSeconds(Math.Pow(2, i)));  // Exponential backoff
        }
    }

    // Final attempt - let exception propagate
    return await operation();
}

// Usage
var data = await RetryAsync(() => httpClient.GetStringAsync(url));
```

## Complete Example

```csharp
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;

class WeatherService
{
    private readonly HttpClient httpClient = new HttpClient();
    private readonly Dictionary<string, WeatherData> cache = new();

    public async Task<WeatherData> GetWeatherAsync(
        string city,
        CancellationToken cancellationToken = default)
    {
        // Check cache
        if (cache.TryGetValue(city, out var cached))
        {
            Console.WriteLine($"Cache hit for {city}");
            return cached;
        }

        Console.WriteLine($"Fetching weather for {city}...");

        try
        {
            string url = $"https://api.weather.example/v1/{city}";

            using var response = await httpClient.GetAsync(url, cancellationToken);
            response.EnsureSuccessStatusCode();

            string json = await response.Content.ReadAsStringAsync(cancellationToken);
            var weather = JsonSerializer.Deserialize<WeatherData>(json);

            // Cache the result
            cache[city] = weather;
            return weather;
        }
        catch (HttpRequestException ex)
        {
            Console.WriteLine($"Failed to get weather: {ex.Message}");
            throw;
        }
    }

    public async Task<Dictionary<string, WeatherData>> GetMultipleCitiesAsync(
        IEnumerable<string> cities,
        CancellationToken cancellationToken = default)
    {
        var tasks = new Dictionary<string, Task<WeatherData>>();

        foreach (var city in cities)
        {
            tasks[city] = GetWeatherAsync(city, cancellationToken);
        }

        await Task.WhenAll(tasks.Values);

        var results = new Dictionary<string, WeatherData>();
        foreach (var (city, task) in tasks)
        {
            if (task.IsCompletedSuccessfully)
            {
                results[city] = task.Result;
            }
        }

        return results;
    }
}

class WeatherData
{
    public string City { get; set; }
    public double Temperature { get; set; }
    public string Condition { get; set; }
}

class Program
{
    static async Task Main()
    {
        var service = new WeatherService();
        var cts = new CancellationTokenSource(TimeSpan.FromSeconds(30));

        try
        {
            var cities = new[] { "London", "Paris", "Tokyo", "New York" };

            Console.WriteLine("Fetching weather for multiple cities...\n");

            var results = await service.GetMultipleCitiesAsync(cities, cts.Token);

            Console.WriteLine("\n=== Weather Report ===");
            foreach (var (city, weather) in results)
            {
                Console.WriteLine($"{city}: {weather.Temperature}°C, {weather.Condition}");
            }
        }
        catch (OperationCanceledException)
        {
            Console.WriteLine("Operation timed out");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error: {ex.Message}");
        }
    }
}
```

## Best Practices

::: tip Do's
- Always use `await` with async methods
- Use `ConfigureAwait(false)` in libraries
- Pass `CancellationToken` for long operations
- Use `Task.WhenAll` for parallel operations
- Dispose of `HttpClient` properly (or use `IHttpClientFactory`)
:::

::: warning Don'ts
- Don't use `.Result` or `.Wait()` (causes deadlocks)
- Don't use `async void` except for event handlers
- Don't ignore returned Tasks
- Don't mix blocking and async code
:::

## Summary

You've learned:
- Using async/await for non-blocking code
- Task and Task\<T\> for async operations
- Running multiple async operations
- Error handling and cancellation
- Async streams with IAsyncEnumerable
- Common async patterns

## Congratulations!

You've completed the C# tutorial! You now have a solid foundation in:
- Variables, types, and control flow
- Methods and object-oriented programming
- Interfaces and generics
- LINQ and async programming

Continue practicing and building projects to master C#!
