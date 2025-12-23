# Generics

Learn how to write type-safe, reusable code with generics in C#.

::: info What You'll Learn
- Creating generic classes and methods
- Generic constraints
- Generic interfaces
- Built-in generic collections
- Covariance and contravariance
:::

## What are Generics?

Generics allow you to write code that works with any type while maintaining type safety.

```
Without Generics                 With Generics
─────────────────                ─────────────

IntList                          List<T>
StringList          →            - Works with any type
ObjectList                       - Type-safe
                                 - No casting needed
```

## Generic Methods

```csharp
// Non-generic - works only with int
void PrintInt(int value)
{
    Console.WriteLine(value);
}

// Generic - works with any type
void Print<T>(T value)
{
    Console.WriteLine(value);
}

// Usage
Print<int>(42);          // 42
Print<string>("Hello");  // Hello
Print<double>(3.14);     // 3.14

// Type inference
Print(42);               // Compiler infers int
Print("Hello");          // Compiler infers string
```

### Generic Method Examples

```csharp
// Swap two values
void Swap<T>(ref T a, ref T b)
{
    T temp = a;
    a = b;
    b = temp;
}

int x = 1, y = 2;
Swap(ref x, ref y);  // x = 2, y = 1

string s1 = "hello", s2 = "world";
Swap(ref s1, ref s2);  // s1 = "world", s2 = "hello"

// Find maximum
T Max<T>(T a, T b) where T : IComparable<T>
{
    return a.CompareTo(b) > 0 ? a : b;
}

Console.WriteLine(Max(5, 3));      // 5
Console.WriteLine(Max("z", "a"));  // z
```

## Generic Classes

```csharp
// Generic class
class Box<T>
{
    private T item;

    public void Store(T item)
    {
        this.item = item;
    }

    public T Retrieve()
    {
        return item;
    }

    public bool HasItem => item != null;
}

// Usage
Box<int> intBox = new Box<int>();
intBox.Store(42);
int number = intBox.Retrieve();  // No casting needed

Box<string> stringBox = new Box<string>();
stringBox.Store("Hello");
string text = stringBox.Retrieve();
```

### Multiple Type Parameters

```csharp
class Pair<TFirst, TSecond>
{
    public TFirst First { get; set; }
    public TSecond Second { get; set; }

    public Pair(TFirst first, TSecond second)
    {
        First = first;
        Second = second;
    }

    public override string ToString()
    {
        return $"({First}, {Second})";
    }
}

var pair1 = new Pair<string, int>("Age", 25);
var pair2 = new Pair<int, double>(1, 3.14);

Console.WriteLine(pair1);  // (Age, 25)
Console.WriteLine(pair2);  // (1, 3.14)
```

## Generic Constraints

Constraints restrict what types can be used with generics.

```csharp
// Must be a reference type
class Repository<T> where T : class
{
    public void Save(T entity) { }
}

// Must be a value type
class Calculator<T> where T : struct
{
    // T is guaranteed to be non-nullable value type
}

// Must have parameterless constructor
class Factory<T> where T : new()
{
    public T Create() => new T();
}

// Must implement interface
class Sorter<T> where T : IComparable<T>
{
    public T FindMax(T[] items)
    {
        T max = items[0];
        foreach (T item in items)
        {
            if (item.CompareTo(max) > 0)
                max = item;
        }
        return max;
    }
}

// Must inherit from class
class AnimalShelter<T> where T : Animal
{
    public void Adopt(T animal) { }
}

// Multiple constraints
class DataProcessor<T> where T : class, IComparable<T>, new()
{
    // T must be: reference type, comparable, have default constructor
}
```

### Constraint Summary

| Constraint | Description |
|------------|-------------|
| `where T : class` | Reference type |
| `where T : struct` | Value type |
| `where T : new()` | Has parameterless constructor |
| `where T : BaseClass` | Inherits from class |
| `where T : IInterface` | Implements interface |
| `where T : notnull` | Non-nullable type |
| `where T : U` | T is or derives from U |

## Generic Interfaces

```csharp
interface IRepository<T>
{
    T GetById(int id);
    IEnumerable<T> GetAll();
    void Add(T entity);
    void Update(T entity);
    void Delete(int id);
}

class UserRepository : IRepository<User>
{
    private List<User> users = new List<User>();

    public User GetById(int id) => users.FirstOrDefault(u => u.Id == id);

    public IEnumerable<User> GetAll() => users;

    public void Add(User entity) => users.Add(entity);

    public void Update(User entity)
    {
        var existing = GetById(entity.Id);
        if (existing != null)
        {
            existing.Name = entity.Name;
        }
    }

    public void Delete(int id) => users.RemoveAll(u => u.Id == id);
}
```

## Built-in Generic Collections

```csharp
// List<T> - dynamic array
List<int> numbers = new List<int> { 1, 2, 3 };
numbers.Add(4);
numbers.Remove(2);
int first = numbers[0];

// Dictionary<TKey, TValue> - key-value pairs
Dictionary<string, int> ages = new Dictionary<string, int>
{
    ["Alice"] = 25,
    ["Bob"] = 30
};
ages["Carol"] = 28;
int aliceAge = ages["Alice"];

// Queue<T> - FIFO
Queue<string> queue = new Queue<string>();
queue.Enqueue("First");
queue.Enqueue("Second");
string next = queue.Dequeue();  // "First"

// Stack<T> - LIFO
Stack<int> stack = new Stack<int>();
stack.Push(1);
stack.Push(2);
int top = stack.Pop();  // 2

// HashSet<T> - unique values
HashSet<int> set = new HashSet<int> { 1, 2, 3 };
set.Add(2);  // Ignored, already exists
bool hasTwo = set.Contains(2);  // true
```

## Generic Delegates

```csharp
// Built-in generic delegates
Action<string> print = Console.WriteLine;
print("Hello");

Func<int, int, int> add = (a, b) => a + b;
int sum = add(5, 3);  // 8

Predicate<int> isPositive = n => n > 0;
bool result = isPositive(5);  // true

// Custom generic delegate
delegate TResult Transform<T, TResult>(T input);

Transform<string, int> getLength = s => s.Length;
int length = getLength("Hello");  // 5
```

## Covariance and Contravariance

```csharp
// Covariance (out) - can use more derived type
interface IProducer<out T>
{
    T Produce();
}

class AnimalProducer : IProducer<Animal>
{
    public Animal Produce() => new Animal();
}

class DogProducer : IProducer<Dog>
{
    public Dog Produce() => new Dog();
}

// Dog is more derived than Animal
IProducer<Animal> producer = new DogProducer();  // OK with 'out'

// Contravariance (in) - can use less derived type
interface IConsumer<in T>
{
    void Consume(T item);
}

class AnimalConsumer : IConsumer<Animal>
{
    public void Consume(Animal animal) { }
}

// Animal is less derived than Dog
IConsumer<Dog> consumer = new AnimalConsumer();  // OK with 'in'
```

## Complete Example

```csharp
using System;
using System.Collections.Generic;
using System.Linq;

// Generic entity base
abstract class Entity
{
    public int Id { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.Now;
}

// Concrete entities
class Product : Entity
{
    public string Name { get; set; }
    public decimal Price { get; set; }
}

class Customer : Entity
{
    public string Name { get; set; }
    public string Email { get; set; }
}

// Generic repository
class Repository<T> where T : Entity
{
    private List<T> items = new List<T>();
    private int nextId = 1;

    public void Add(T item)
    {
        item.Id = nextId++;
        items.Add(item);
    }

    public T GetById(int id) => items.FirstOrDefault(x => x.Id == id);

    public IEnumerable<T> GetAll() => items;

    public IEnumerable<T> Find(Predicate<T> predicate)
        => items.Where(x => predicate(x));

    public void Remove(int id) => items.RemoveAll(x => x.Id == id);

    public int Count => items.Count;
}

// Generic service
class DataService<T> where T : Entity
{
    private readonly Repository<T> repository;

    public DataService(Repository<T> repository)
    {
        this.repository = repository;
    }

    public void Create(T item)
    {
        repository.Add(item);
        Console.WriteLine($"Created {typeof(T).Name} with ID {item.Id}");
    }

    public T Read(int id) => repository.GetById(id);

    public IEnumerable<T> ReadAll() => repository.GetAll();
}

class Program
{
    static void Main()
    {
        // Product service
        var productRepo = new Repository<Product>();
        var productService = new DataService<Product>(productRepo);

        productService.Create(new Product { Name = "Laptop", Price = 999.99m });
        productService.Create(new Product { Name = "Mouse", Price = 29.99m });
        productService.Create(new Product { Name = "Keyboard", Price = 79.99m });

        Console.WriteLine("\nProducts:");
        foreach (var product in productService.ReadAll())
        {
            Console.WriteLine($"  {product.Id}: {product.Name} - ${product.Price}");
        }

        // Customer service
        var customerRepo = new Repository<Customer>();
        var customerService = new DataService<Customer>(customerRepo);

        customerService.Create(new Customer { Name = "Alice", Email = "alice@example.com" });
        customerService.Create(new Customer { Name = "Bob", Email = "bob@example.com" });

        Console.WriteLine("\nCustomers:");
        foreach (var customer in customerService.ReadAll())
        {
            Console.WriteLine($"  {customer.Id}: {customer.Name} ({customer.Email})");
        }

        // Using Find with predicate
        var expensiveProducts = productRepo.Find(p => p.Price > 50);
        Console.WriteLine("\nExpensive Products (>$50):");
        foreach (var product in expensiveProducts)
        {
            Console.WriteLine($"  {product.Name} - ${product.Price}");
        }
    }
}
```

## Summary

You've learned:
- Creating generic methods and classes
- Using multiple type parameters
- Applying constraints to generics
- Generic interfaces and delegates
- Built-in generic collections
- Covariance and contravariance

## Next Steps

Continue to [LINQ](/guide/csharp/09-linq) to learn about querying data elegantly!
