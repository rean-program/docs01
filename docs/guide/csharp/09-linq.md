# LINQ

Learn how to query and transform data elegantly with Language Integrated Query (LINQ).

::: info What You'll Learn
- LINQ query syntax and method syntax
- Common LINQ operations
- Filtering, projecting, and grouping data
- Working with different data sources
:::

## What is LINQ?

LINQ (Language Integrated Query) allows you to query data from various sources using a consistent syntax.

```
┌─────────────────────────────────────────────────────────┐
│                        LINQ                              │
├─────────────────────────────────────────────────────────┤
│                    Query Syntax                          │
│     from x in collection                                 │
│     where condition                                      │
│     select result                                        │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Collections   Databases   XML   JSON   Objects          │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

## Two Syntaxes

```csharp
var numbers = new List<int> { 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 };

// Query syntax (SQL-like)
var evenQuery = from n in numbers
                where n % 2 == 0
                select n;

// Method syntax (fluent/lambda)
var evenMethod = numbers.Where(n => n % 2 == 0);

// Both produce: 2, 4, 6, 8, 10
```

## Filtering with Where

```csharp
var products = new List<Product>
{
    new Product { Name = "Laptop", Price = 999, Category = "Electronics" },
    new Product { Name = "Shirt", Price = 29, Category = "Clothing" },
    new Product { Name = "Phone", Price = 699, Category = "Electronics" },
    new Product { Name = "Pants", Price = 49, Category = "Clothing" },
    new Product { Name = "Tablet", Price = 449, Category = "Electronics" }
};

// Single condition
var electronics = products.Where(p => p.Category == "Electronics");

// Multiple conditions
var affordableElectronics = products
    .Where(p => p.Category == "Electronics" && p.Price < 700);

// Query syntax
var query = from p in products
            where p.Category == "Electronics"
            where p.Price < 700
            select p;
```

## Projection with Select

```csharp
var numbers = new List<int> { 1, 2, 3, 4, 5 };

// Transform elements
var squared = numbers.Select(n => n * n);
// 1, 4, 9, 16, 25

// Project to different type
var products = new List<Product> { /* ... */ };

var names = products.Select(p => p.Name);
// "Laptop", "Shirt", ...

// Project to anonymous type
var summaries = products.Select(p => new
{
    p.Name,
    p.Price,
    IsExpensive = p.Price > 100
});

// Query syntax
var query = from p in products
            select new { p.Name, p.Price };
```

## Ordering

```csharp
var products = new List<Product> { /* ... */ };

// Ascending
var byPrice = products.OrderBy(p => p.Price);

// Descending
var byPriceDesc = products.OrderByDescending(p => p.Price);

// Multiple orderings
var ordered = products
    .OrderBy(p => p.Category)
    .ThenByDescending(p => p.Price);

// Query syntax
var query = from p in products
            orderby p.Category, p.Price descending
            select p;
```

## Grouping

```csharp
var products = new List<Product> { /* ... */ };

// Group by category
var byCategory = products.GroupBy(p => p.Category);

foreach (var group in byCategory)
{
    Console.WriteLine($"Category: {group.Key}");
    foreach (var product in group)
    {
        Console.WriteLine($"  - {product.Name}: ${product.Price}");
    }
}

// Query syntax
var query = from p in products
            group p by p.Category into g
            select new
            {
                Category = g.Key,
                Count = g.Count(),
                TotalValue = g.Sum(p => p.Price)
            };
```

## Aggregation Methods

```csharp
var numbers = new List<int> { 1, 2, 3, 4, 5 };

int count = numbers.Count();           // 5
int sum = numbers.Sum();               // 15
double avg = numbers.Average();        // 3.0
int min = numbers.Min();               // 1
int max = numbers.Max();               // 5

// With selector
var products = new List<Product> { /* ... */ };

decimal totalValue = products.Sum(p => p.Price);
decimal avgPrice = products.Average(p => p.Price);
decimal maxPrice = products.Max(p => p.Price);
string cheapest = products.MinBy(p => p.Price)?.Name;
```

## Element Operations

```csharp
var numbers = new List<int> { 1, 2, 3, 4, 5 };

// First/Last
int first = numbers.First();           // 1
int last = numbers.Last();             // 5

// With condition
int firstEven = numbers.First(n => n % 2 == 0);  // 2

// Safe versions (return default if not found)
int? firstOrDefault = numbers.FirstOrDefault(n => n > 10);  // 0 (default)

// Single (throws if not exactly one)
var products = new List<Product> { /* ... */ };
var laptop = products.Single(p => p.Name == "Laptop");

// ElementAt
int third = numbers.ElementAt(2);      // 3
```

## Set Operations

```csharp
var set1 = new List<int> { 1, 2, 3, 4, 5 };
var set2 = new List<int> { 4, 5, 6, 7, 8 };

// Distinct - remove duplicates
var unique = new List<int> { 1, 1, 2, 2, 3 }.Distinct();
// 1, 2, 3

// Union - combine unique elements
var union = set1.Union(set2);
// 1, 2, 3, 4, 5, 6, 7, 8

// Intersect - common elements
var common = set1.Intersect(set2);
// 4, 5

// Except - elements in first but not second
var diff = set1.Except(set2);
// 1, 2, 3
```

## Joining Data

```csharp
var customers = new List<Customer>
{
    new Customer { Id = 1, Name = "Alice" },
    new Customer { Id = 2, Name = "Bob" }
};

var orders = new List<Order>
{
    new Order { CustomerId = 1, Amount = 100 },
    new Order { CustomerId = 1, Amount = 150 },
    new Order { CustomerId = 2, Amount = 200 }
};

// Join
var customerOrders = customers.Join(
    orders,
    c => c.Id,
    o => o.CustomerId,
    (c, o) => new { c.Name, o.Amount }
);

// Query syntax
var query = from c in customers
            join o in orders on c.Id equals o.CustomerId
            select new { c.Name, o.Amount };

// GroupJoin (left join with grouping)
var customerWithOrders = customers.GroupJoin(
    orders,
    c => c.Id,
    o => o.CustomerId,
    (c, orderGroup) => new
    {
        c.Name,
        TotalOrders = orderGroup.Count(),
        TotalAmount = orderGroup.Sum(o => o.Amount)
    }
);
```

## Quantifier Operations

```csharp
var numbers = new List<int> { 1, 2, 3, 4, 5 };

// Any - at least one matches
bool hasEven = numbers.Any(n => n % 2 == 0);        // true
bool hasNegative = numbers.Any(n => n < 0);         // false

// All - all match
bool allPositive = numbers.All(n => n > 0);         // true
bool allEven = numbers.All(n => n % 2 == 0);        // false

// Contains
bool hasThree = numbers.Contains(3);                 // true
```

## Partitioning

```csharp
var numbers = Enumerable.Range(1, 10);  // 1 to 10

// Take - first N elements
var firstThree = numbers.Take(3);       // 1, 2, 3

// Skip - skip first N elements
var skipThree = numbers.Skip(3);        // 4, 5, 6, 7, 8, 9, 10

// TakeWhile - take while condition is true
var takeWhile = numbers.TakeWhile(n => n < 5);  // 1, 2, 3, 4

// SkipWhile - skip while condition is true
var skipWhile = numbers.SkipWhile(n => n < 5);  // 5, 6, 7, 8, 9, 10

// Pagination
int page = 2;
int pageSize = 3;
var paginated = numbers
    .Skip((page - 1) * pageSize)
    .Take(pageSize);  // 4, 5, 6
```

## Deferred Execution

```csharp
var numbers = new List<int> { 1, 2, 3 };

// Query is NOT executed here
var query = numbers.Where(n => n > 1);

// Add more items
numbers.Add(4);
numbers.Add(5);

// Query executes NOW with all current items
foreach (var n in query)
{
    Console.WriteLine(n);  // 2, 3, 4, 5
}

// Force immediate execution
var immediate = numbers.Where(n => n > 1).ToList();
numbers.Add(6);  // Won't affect 'immediate'
```

## Complete Example

```csharp
using System;
using System.Collections.Generic;
using System.Linq;

class Student
{
    public int Id { get; set; }
    public string Name { get; set; }
    public int Grade { get; set; }
    public List<int> Scores { get; set; }
}

class Program
{
    static void Main()
    {
        var students = new List<Student>
        {
            new Student { Id = 1, Name = "Alice", Grade = 10, Scores = new List<int> { 85, 90, 78 } },
            new Student { Id = 2, Name = "Bob", Grade = 10, Scores = new List<int> { 92, 88, 95 } },
            new Student { Id = 3, Name = "Carol", Grade = 11, Scores = new List<int> { 76, 82, 79 } },
            new Student { Id = 4, Name = "David", Grade = 11, Scores = new List<int> { 95, 97, 93 } },
            new Student { Id = 5, Name = "Eve", Grade = 10, Scores = new List<int> { 88, 85, 90 } }
        };

        // 1. Students with average score above 85
        Console.WriteLine("=== High Achievers (Avg > 85) ===");
        var highAchievers = students
            .Where(s => s.Scores.Average() > 85)
            .OrderByDescending(s => s.Scores.Average());

        foreach (var student in highAchievers)
        {
            Console.WriteLine($"{student.Name}: {student.Scores.Average():F1}");
        }

        // 2. Group by grade with statistics
        Console.WriteLine("\n=== Statistics by Grade ===");
        var byGrade = students
            .GroupBy(s => s.Grade)
            .Select(g => new
            {
                Grade = g.Key,
                Count = g.Count(),
                AvgScore = g.Average(s => s.Scores.Average()),
                TopStudent = g.OrderByDescending(s => s.Scores.Average()).First().Name
            })
            .OrderBy(x => x.Grade);

        foreach (var grade in byGrade)
        {
            Console.WriteLine($"Grade {grade.Grade}:");
            Console.WriteLine($"  Students: {grade.Count}");
            Console.WriteLine($"  Average: {grade.AvgScore:F1}");
            Console.WriteLine($"  Top Student: {grade.TopStudent}");
        }

        // 3. Flatten all scores
        Console.WriteLine("\n=== All Scores Analysis ===");
        var allScores = students.SelectMany(s => s.Scores);
        Console.WriteLine($"Total Scores: {allScores.Count()}");
        Console.WriteLine($"Overall Average: {allScores.Average():F1}");
        Console.WriteLine($"Highest Score: {allScores.Max()}");
        Console.WriteLine($"Lowest Score: {allScores.Min()}");

        // 4. Query syntax example
        Console.WriteLine("\n=== Grade 10 Honor Roll ===");
        var honorRoll = from s in students
                        where s.Grade == 10
                        let avg = s.Scores.Average()
                        where avg >= 85
                        orderby avg descending
                        select new { s.Name, Average = avg };

        foreach (var student in honorRoll)
        {
            Console.WriteLine($"{student.Name}: {student.Average:F1}");
        }
    }
}
```

## Summary

You've learned:
- Query syntax vs method syntax
- Filtering with Where
- Projection with Select
- Ordering, grouping, and aggregation
- Joining data from multiple sources
- Set operations and partitioning
- Deferred execution

## Next Steps

Continue to [Async Programming](/guide/csharp/10-async) to learn about asynchronous patterns!
