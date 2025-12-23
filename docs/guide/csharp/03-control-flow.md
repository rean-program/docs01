# Control Flow

Learn how to control the flow of your C# programs using conditions and loops.

::: info What You'll Learn
- Making decisions with if/else statements
- Using switch expressions and pattern matching
- Repeating code with loops
- Breaking and continuing loops
- Best practices for control flow
:::

## Understanding Control Flow

Control flow determines the order in which statements execute in your program. Without control flow, code runs sequentially from top to bottom.

```
┌─────────────────────────────────────────────────────────────────┐
│                    CONTROL FLOW TYPES                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   Sequential          Conditional          Loops                 │
│   ──────────          ───────────          ─────                 │
│       │                   │                  │                   │
│       ▼                   ▼                 ┌┴┐                  │
│       │               ┌───┴───┐            ┌┘ └┐                 │
│       ▼               ▼       ▼            │   │                 │
│       │               │       │            └─┬─┘                 │
│       ▼               └───┬───┘              │                   │
│       │                   │                  ▼                   │
│                                                                  │
│   Statement 1        if/switch          while/for               │
│   Statement 2        True/False         Repeat                  │
│   Statement 3        branches           until done              │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Conditional Statements

### If Statement

The simplest form of decision-making.

```csharp
int age = 18;

// Single statement - braces optional (but recommended)
if (age >= 18)
    Console.WriteLine("You are an adult");

// Multiple statements - braces required
if (age >= 18)
{
    Console.WriteLine("You are an adult");
    Console.WriteLine("You can vote!");
}
```

::: tip Best Practice
Always use braces `{ }` even for single statements. It prevents bugs when adding code later.
:::

### If-Else Statement

```csharp
int score = 75;

if (score >= 60)
{
    Console.WriteLine("You passed!");
}
else
{
    Console.WriteLine("You failed.");
}
```

### If-Else If-Else Chain

For multiple conditions, use else-if chains.

```csharp
int score = 85;

if (score >= 90)
{
    Console.WriteLine("Grade: A");
}
else if (score >= 80)
{
    Console.WriteLine("Grade: B");
}
else if (score >= 70)
{
    Console.WriteLine("Grade: C");
}
else if (score >= 60)
{
    Console.WriteLine("Grade: D");
}
else
{
    Console.WriteLine("Grade: F");
}
```

### Flow Diagram

```
           ┌─────────────┐
           │   Start     │
           └──────┬──────┘
                  │
           ┌──────▼──────┐
           │ score >= 90 │──── Yes ──→ Grade: A ──┐
           └──────┬──────┘                        │
                  │ No                            │
           ┌──────▼──────┐                        │
           │ score >= 80 │──── Yes ──→ Grade: B ──┤
           └──────┬──────┘                        │
                  │ No                            │
           ┌──────▼──────┐                        │
           │ score >= 70 │──── Yes ──→ Grade: C ──┤
           └──────┬──────┘                        │
                  │ No                            │
           ┌──────▼──────┐                        │
           │ score >= 60 │──── Yes ──→ Grade: D ──┤
           └──────┬──────┘                        │
                  │ No                            ▼
                  └───────────→ Grade: F ──→  ┌──────┐
                                              │  End │
                                              └──────┘
```

### Nested If Statements

```csharp
int age = 25;
bool hasLicense = true;
bool hasCar = true;

if (age >= 18)
{
    if (hasLicense)
    {
        if (hasCar)
        {
            Console.WriteLine("You can drive your car!");
        }
        else
        {
            Console.WriteLine("You need to get a car.");
        }
    }
    else
    {
        Console.WriteLine("You need to get a license first.");
    }
}
else
{
    Console.WriteLine("You must be 18 or older.");
}

// Better: Flatten with logical operators
if (age >= 18 && hasLicense && hasCar)
{
    Console.WriteLine("You can drive your car!");
}
```

::: warning Avoid Deep Nesting
Deeply nested if statements are hard to read. Use logical operators or early returns to flatten the structure.
:::

## Comparison Operators

| Operator | Description | Example | Result |
|----------|-------------|---------|--------|
| `==` | Equal to | `5 == 5` | `true` |
| `!=` | Not equal to | `5 != 3` | `true` |
| `>` | Greater than | `10 > 5` | `true` |
| `<` | Less than | `3 < 7` | `true` |
| `>=` | Greater or equal | `5 >= 5` | `true` |
| `<=` | Less or equal | `3 <= 3` | `true` |

### Comparing Different Types

```csharp
// Comparing strings
string name = "Alice";
bool isAlice = name == "Alice";     // true
bool isAlice2 = name.Equals("alice", StringComparison.OrdinalIgnoreCase);

// Comparing objects (reference equality)
object a = new object();
object b = a;
object c = new object();

bool sameRef = a == b;    // true (same reference)
bool diffRef = a == c;    // false (different objects)

// Comparing nullable types
int? x = null;
int? y = 5;

bool isNull = x == null;   // true
bool isValue = y == 5;     // true
```

## Logical Operators

```csharp
bool hasLicense = true;
int age = 20;
bool isVIP = false;

// AND (&&) - both must be true
if (age >= 18 && hasLicense)
{
    Console.WriteLine("You can drive");
}

// OR (||) - at least one must be true
if (age < 13 || age > 65)
{
    Console.WriteLine("Discount available");
}

// NOT (!) - inverts the boolean
if (!hasLicense)
{
    Console.WriteLine("You need a license");
}

// Combined operators
if ((age >= 18 && hasLicense) || isVIP)
{
    Console.WriteLine("Access granted");
}
```

### Short-Circuit Evaluation

C# uses short-circuit evaluation for `&&` and `||`:

```csharp
// && stops if first is false (no need to check second)
string? name = null;
if (name != null && name.Length > 0)  // Safe! Won't crash
{
    Console.WriteLine(name);
}

// || stops if first is true (no need to check second)
if (IsQuickCheck() || IsSlowCheck())  // If quick is true, slow won't run
{
    Console.WriteLine("Passed!");
}
```

### Logical Operator Table

| Expression | `A = true, B = true` | `A = true, B = false` | `A = false, B = true` | `A = false, B = false` |
|------------|---------------------|----------------------|----------------------|------------------------|
| `A && B` | true | false | false | false |
| `A \|\| B` | true | true | true | false |
| `!A` | false | false | true | true |

## Ternary Operator

A concise way to write simple if-else statements.

```csharp
int age = 20;

// Shorthand for if-else
string status = age >= 18 ? "Adult" : "Minor";

// Equivalent if-else
string status2;
if (age >= 18)
{
    status2 = "Adult";
}
else
{
    status2 = "Minor";
}

// Can be used in expressions
Console.WriteLine($"Status: {(age >= 18 ? "Adult" : "Minor")}");

// Can assign different types (with common base)
object result = condition ? "text" : 123;  // Error: incompatible types
object result2 = condition ? (object)"text" : 123;  // OK with cast
```

### Nested Ternary (Use Sparingly)

```csharp
// Readable nested ternary (properly formatted)
string category =
    age < 13  ? "Child" :
    age < 20  ? "Teen" :
    age < 65  ? "Adult" :
                "Senior";

// Better: Use switch expression for multiple conditions
string category2 = age switch
{
    < 13 => "Child",
    < 20 => "Teen",
    < 65 => "Adult",
    _ => "Senior"
};
```

::: warning
Avoid deeply nested ternary operators. They're hard to read. Use switch expressions instead.
:::

## Switch Statement

The classic switch for multiple discrete values.

```csharp
int day = 3;

switch (day)
{
    case 1:
        Console.WriteLine("Monday");
        break;
    case 2:
        Console.WriteLine("Tuesday");
        break;
    case 3:
        Console.WriteLine("Wednesday");
        break;
    case 4:
        Console.WriteLine("Thursday");
        break;
    case 5:
        Console.WriteLine("Friday");
        break;
    case 6:
    case 7:  // Fall-through for multiple cases
        Console.WriteLine("Weekend!");
        break;
    default:
        Console.WriteLine("Invalid day");
        break;
}
```

### Switch with Strings

```csharp
string command = "start";

switch (command.ToLower())
{
    case "start":
        Console.WriteLine("Starting...");
        break;
    case "stop":
        Console.WriteLine("Stopping...");
        break;
    case "restart":
        Console.WriteLine("Restarting...");
        break;
    default:
        Console.WriteLine($"Unknown command: {command}");
        break;
}
```

### Switch Expression (C# 8+)

Modern, more concise syntax that returns a value.

```csharp
int day = 3;

string dayName = day switch
{
    1 => "Monday",
    2 => "Tuesday",
    3 => "Wednesday",
    4 => "Thursday",
    5 => "Friday",
    6 or 7 => "Weekend",   // Combined cases
    _ => "Invalid"          // Default (discard pattern)
};

Console.WriteLine(dayName);  // "Wednesday"
```

### Pattern Matching in Switch

C# 8+ enables powerful pattern matching.

```csharp
object value = 42;

string result = value switch
{
    int n when n < 0 => "Negative number",
    int n when n == 0 => "Zero",
    int n when n > 0 && n < 100 => $"Small positive: {n}",
    int n => $"Large positive: {n}",
    string s when string.IsNullOrEmpty(s) => "Empty string",
    string s => $"String: {s}",
    null => "Null value",
    _ => $"Unknown type: {value.GetType().Name}"
};
```

### Type Pattern Matching

```csharp
void ProcessValue(object obj)
{
    switch (obj)
    {
        case int i:
            Console.WriteLine($"Integer: {i * 2}");
            break;
        case string s:
            Console.WriteLine($"String length: {s.Length}");
            break;
        case double d when d > 0:
            Console.WriteLine($"Positive double: {d}");
            break;
        case null:
            Console.WriteLine("Null received");
            break;
        default:
            Console.WriteLine($"Other type: {obj.GetType()}");
            break;
    }
}
```

### Property Pattern (C# 8+)

```csharp
record Person(string Name, int Age, string Country);

string GetDiscount(Person person) => person switch
{
    { Age: < 18 } => "Youth discount",
    { Age: > 65 } => "Senior discount",
    { Country: "USA", Age: >= 21 } => "US adult rate",
    { Country: "Japan" } => "Japan rate",
    _ => "Standard rate"
};

// Usage
var alice = new Person("Alice", 25, "USA");
Console.WriteLine(GetDiscount(alice));  // "US adult rate"
```

### Tuple Pattern

```csharp
string GetQuadrant(int x, int y) => (x, y) switch
{
    (0, 0) => "Origin",
    (> 0, > 0) => "Quadrant I",
    (< 0, > 0) => "Quadrant II",
    (< 0, < 0) => "Quadrant III",
    (> 0, < 0) => "Quadrant IV",
    (0, _) => "On Y-axis",
    (_, 0) => "On X-axis"
};

Console.WriteLine(GetQuadrant(3, 4));   // "Quadrant I"
Console.WriteLine(GetQuadrant(-1, 5));  // "Quadrant II"
Console.WriteLine(GetQuadrant(0, 0));   // "Origin"
```

## Loops

### For Loop

Best when you know the number of iterations.

```csharp
// Count from 0 to 4
for (int i = 0; i < 5; i++)
{
    Console.WriteLine($"Iteration: {i}");
}

// Count backwards
for (int i = 10; i >= 0; i--)
{
    Console.WriteLine(i);
}

// Step by 2
for (int i = 0; i <= 10; i += 2)
{
    Console.WriteLine(i);  // 0, 2, 4, 6, 8, 10
}

// Multiple variables
for (int i = 0, j = 10; i < j; i++, j--)
{
    Console.WriteLine($"i={i}, j={j}");
}
```

### For Loop Structure

```
    for (int i = 0;  i < 5;    i++)
         ─────────  ──────    ────
             │         │        │
             │         │        └── Increment (after each iteration)
             │         └─────────── Condition (checked before each iteration)
             └───────────────────── Initialization (runs once at start)

    Execution order:
    1. Initialization  →  runs once
    2. Condition       →  checked before each iteration
    3. Body            →  runs if condition is true
    4. Increment       →  runs after body
    5. Back to step 2
```

### While Loop

Best when the number of iterations is unknown.

```csharp
int count = 0;

while (count < 5)
{
    Console.WriteLine($"Count: {count}");
    count++;
}

// Reading until valid input
string input = "";
while (string.IsNullOrEmpty(input))
{
    Console.Write("Enter your name: ");
    input = Console.ReadLine() ?? "";
}

// Infinite loop (use with break)
while (true)
{
    Console.Write("Enter 'quit' to exit: ");
    if (Console.ReadLine() == "quit")
        break;
}
```

### Do-While Loop

Executes at least once, then checks condition.

```csharp
int count = 0;

do
{
    Console.WriteLine($"Count: {count}");
    count++;
} while (count < 5);

// Menu example - always shows at least once
int choice;
do
{
    Console.WriteLine("\n1. New Game");
    Console.WriteLine("2. Load Game");
    Console.WriteLine("3. Exit");
    Console.Write("Choice: ");

    int.TryParse(Console.ReadLine(), out choice);

    switch (choice)
    {
        case 1: Console.WriteLine("Starting new game..."); break;
        case 2: Console.WriteLine("Loading game..."); break;
        case 3: Console.WriteLine("Goodbye!"); break;
        default: Console.WriteLine("Invalid choice!"); break;
    }
} while (choice != 3);
```

### While vs Do-While

```
    While Loop              Do-While Loop
    ──────────              ─────────────

    ┌──────────┐            ┌──────────┐
    │ Condition│            │  Execute │
    │  Check   │            │   Body   │
    └────┬─────┘            └────┬─────┘
         │                       │
    ┌────▼─────┐            ┌────▼─────┐
    │  Execute │            │ Condition│
    │   Body   │            │  Check   │
    └────┬─────┘            └────┬─────┘
         │                       │
         ▼                       ▼
    May run 0 times         Runs at least 1 time
```

### Foreach Loop

Best for iterating over collections.

```csharp
string[] fruits = { "Apple", "Banana", "Cherry" };

foreach (string fruit in fruits)
{
    Console.WriteLine(fruit);
}

// Works with any IEnumerable
var numbers = new List<int> { 1, 2, 3, 4, 5 };

foreach (var num in numbers)
{
    Console.WriteLine(num * 2);
}

// With index (using LINQ)
foreach (var (fruit, index) in fruits.Select((f, i) => (f, i)))
{
    Console.WriteLine($"{index}: {fruit}");
}

// Dictionary iteration
var ages = new Dictionary<string, int>
{
    ["Alice"] = 25,
    ["Bob"] = 30
};

foreach (var (name, age) in ages)
{
    Console.WriteLine($"{name} is {age} years old");
}
```

::: warning Foreach Limitation
You cannot modify the collection while iterating with foreach. Use a for loop or create a copy if you need to modify.

```csharp
// This will throw an exception!
foreach (var item in list)
{
    if (condition)
        list.Remove(item);  // Error!
}

// Instead, use this:
for (int i = list.Count - 1; i >= 0; i--)
{
    if (condition)
        list.RemoveAt(i);  // OK
}
```
:::

## Loop Control

### Break Statement

Exits the loop immediately.

```csharp
// Exit the loop early
for (int i = 0; i < 10; i++)
{
    if (i == 5)
    {
        break;  // Exit when i is 5
    }
    Console.WriteLine(i);
}
// Output: 0, 1, 2, 3, 4

// Break in nested loops (only breaks inner loop)
for (int i = 0; i < 3; i++)
{
    for (int j = 0; j < 3; j++)
    {
        if (j == 1) break;  // Only breaks inner loop
        Console.WriteLine($"i={i}, j={j}");
    }
}
// i=0, j=0
// i=1, j=0
// i=2, j=0
```

### Continue Statement

Skips to the next iteration.

```csharp
// Skip even numbers
for (int i = 0; i < 10; i++)
{
    if (i % 2 == 0)
    {
        continue;  // Skip even numbers
    }
    Console.WriteLine(i);
}
// Output: 1, 3, 5, 7, 9

// Skip invalid items
foreach (var item in items)
{
    if (item == null)
        continue;  // Skip null items

    ProcessItem(item);
}
```

### Return Statement in Loops

```csharp
// Return immediately when found
int? FindFirst(int[] numbers, int target)
{
    foreach (var num in numbers)
    {
        if (num == target)
            return num;  // Exit method immediately
    }
    return null;  // Not found
}
```

## Nested Loops

```csharp
// Multiplication table
Console.WriteLine("Multiplication Table:\n");

for (int i = 1; i <= 10; i++)
{
    for (int j = 1; j <= 10; j++)
    {
        Console.Write($"{i * j,4}");
    }
    Console.WriteLine();
}

// Pattern printing
int rows = 5;
for (int i = 1; i <= rows; i++)
{
    for (int j = 1; j <= i; j++)
    {
        Console.Write("* ");
    }
    Console.WriteLine();
}
// Output:
// *
// * *
// * * *
// * * * *
// * * * * *
```

### Breaking Out of Nested Loops

```csharp
// Method 1: Use a flag
bool found = false;
for (int i = 0; i < 10 && !found; i++)
{
    for (int j = 0; j < 10 && !found; j++)
    {
        if (matrix[i, j] == target)
        {
            Console.WriteLine($"Found at {i}, {j}");
            found = true;
        }
    }
}

// Method 2: Extract to a method and return
(int row, int col)? FindInMatrix(int[,] matrix, int target)
{
    for (int i = 0; i < matrix.GetLength(0); i++)
    {
        for (int j = 0; j < matrix.GetLength(1); j++)
        {
            if (matrix[i, j] == target)
                return (i, j);
        }
    }
    return null;
}

// Method 3: Use goto (generally discouraged)
for (int i = 0; i < 10; i++)
{
    for (int j = 0; j < 10; j++)
    {
        if (condition)
            goto EndLoops;
    }
}
EndLoops:
Console.WriteLine("Exited all loops");
```

## Infinite Loops

```csharp
// Using while(true) - most common
while (true)
{
    // Server loop, game loop, etc.
    ProcessRequests();

    if (shouldStop)
        break;
}

// Using for(;;) - equivalent
for (;;)
{
    // Loop forever
}

// Common pattern: Event loop
while (true)
{
    var input = GetUserInput();

    switch (input)
    {
        case "quit":
            return;  // Exit method
        case "help":
            ShowHelp();
            break;
        default:
            ProcessCommand(input);
            break;
    }
}
```

## Complete Examples

### Example 1: Number Guessing Game

```csharp
using System;

class GuessingGame
{
    static void Main()
    {
        Console.WriteLine("╔════════════════════════════════════╗");
        Console.WriteLine("║     NUMBER GUESSING GAME           ║");
        Console.WriteLine("╚════════════════════════════════════╝\n");

        Random random = new Random();
        int secretNumber = random.Next(1, 101);
        int attempts = 0;
        int maxAttempts = 7;
        bool won = false;

        Console.WriteLine("I'm thinking of a number between 1 and 100.");
        Console.WriteLine($"You have {maxAttempts} attempts.\n");

        while (attempts < maxAttempts && !won)
        {
            attempts++;
            Console.Write($"Attempt {attempts}/{maxAttempts}: ");

            if (!int.TryParse(Console.ReadLine(), out int guess))
            {
                Console.WriteLine("⚠ Please enter a valid number.\n");
                attempts--;
                continue;
            }

            if (guess < 1 || guess > 100)
            {
                Console.WriteLine("⚠ Number must be between 1 and 100.\n");
                attempts--;
                continue;
            }

            if (guess == secretNumber)
            {
                won = true;
                string rating = attempts switch
                {
                    1 => "🏆 INCREDIBLE! First try!",
                    <= 3 => "🌟 Excellent!",
                    <= 5 => "👍 Good job!",
                    _ => "😅 Close one!"
                };
                Console.WriteLine($"\n✓ Correct! The number was {secretNumber}.");
                Console.WriteLine($"  You got it in {attempts} attempts. {rating}");
            }
            else
            {
                int diff = Math.Abs(guess - secretNumber);
                string hint = diff switch
                {
                    > 30 => "Way",
                    > 15 => "Pretty",
                    > 5 => "A bit",
                    _ => "Very close, but"
                };

                if (guess < secretNumber)
                    Console.WriteLine($"↑ {hint} too low!\n");
                else
                    Console.WriteLine($"↓ {hint} too high!\n");
            }
        }

        if (!won)
        {
            Console.WriteLine($"\n✗ Game over! The number was {secretNumber}.");
        }
    }
}
```

### Example 2: Menu-Driven Calculator

```csharp
using System;

class Calculator
{
    static void Main()
    {
        bool running = true;

        while (running)
        {
            Console.WriteLine("\n╔════════════════════════╗");
            Console.WriteLine("║     CALCULATOR         ║");
            Console.WriteLine("╠════════════════════════╣");
            Console.WriteLine("║  1. Add                ║");
            Console.WriteLine("║  2. Subtract           ║");
            Console.WriteLine("║  3. Multiply           ║");
            Console.WriteLine("║  4. Divide             ║");
            Console.WriteLine("║  5. Power              ║");
            Console.WriteLine("║  6. Square Root        ║");
            Console.WriteLine("║  0. Exit               ║");
            Console.WriteLine("╚════════════════════════╝");
            Console.Write("\nChoice: ");

            if (!int.TryParse(Console.ReadLine(), out int choice))
            {
                Console.WriteLine("Invalid input!");
                continue;
            }

            if (choice == 0)
            {
                Console.WriteLine("Goodbye!");
                running = false;
                continue;
            }

            if (choice < 1 || choice > 6)
            {
                Console.WriteLine("Invalid option!");
                continue;
            }

            // Get first number
            Console.Write("Enter first number: ");
            if (!double.TryParse(Console.ReadLine(), out double a))
            {
                Console.WriteLine("Invalid number!");
                continue;
            }

            // Get second number (except for sqrt)
            double b = 0;
            if (choice != 6)
            {
                Console.Write("Enter second number: ");
                if (!double.TryParse(Console.ReadLine(), out b))
                {
                    Console.WriteLine("Invalid number!");
                    continue;
                }
            }

            // Calculate result
            double result = choice switch
            {
                1 => a + b,
                2 => a - b,
                3 => a * b,
                4 when b != 0 => a / b,
                4 => double.NaN,  // Division by zero
                5 => Math.Pow(a, b),
                6 when a >= 0 => Math.Sqrt(a),
                6 => double.NaN,  // Negative sqrt
                _ => double.NaN
            };

            // Display result
            string operation = choice switch
            {
                1 => $"{a} + {b}",
                2 => $"{a} - {b}",
                3 => $"{a} × {b}",
                4 => $"{a} ÷ {b}",
                5 => $"{a} ^ {b}",
                6 => $"√{a}",
                _ => "Unknown"
            };

            if (double.IsNaN(result))
            {
                Console.WriteLine("Error: Invalid operation!");
            }
            else
            {
                Console.WriteLine($"\n  {operation} = {result:G10}");
            }
        }
    }
}
```

### Example 3: FizzBuzz with Patterns

```csharp
using System;

class FizzBuzz
{
    static void Main()
    {
        Console.WriteLine("FizzBuzz (1-100)\n");

        for (int i = 1; i <= 100; i++)
        {
            string result = (i % 3, i % 5) switch
            {
                (0, 0) => "FizzBuzz",
                (0, _) => "Fizz",
                (_, 0) => "Buzz",
                _ => i.ToString()
            };

            // Color output
            ConsoleColor color = result switch
            {
                "FizzBuzz" => ConsoleColor.Magenta,
                "Fizz" => ConsoleColor.Green,
                "Buzz" => ConsoleColor.Cyan,
                _ => ConsoleColor.Gray
            };

            Console.ForegroundColor = color;
            Console.Write($"{result,10}");
            Console.ResetColor();

            if (i % 10 == 0)
                Console.WriteLine();
        }
    }
}
```

## Quick Reference

```
┌────────────────────────────────────────────────────────────────┐
│                  CONTROL FLOW QUICK REFERENCE                   │
├────────────────────────────────────────────────────────────────┤
│ CONDITIONALS                                                    │
│   if (x > 0) { }                  // Simple condition           │
│   if (x > 0) { } else { }         // If-else                    │
│   x > 0 ? "yes" : "no"            // Ternary operator           │
│                                                                 │
│ SWITCH                                                          │
│   switch (x) { case 1: break; }   // Classic switch             │
│   x switch { 1 => "one", _ => "" }  // Switch expression        │
│                                                                 │
│ LOOPS                                                           │
│   for (int i = 0; i < n; i++)     // Known iterations           │
│   while (condition) { }           // Unknown iterations         │
│   do { } while (condition);       // At least once              │
│   foreach (var x in collection)   // Iterate collection         │
│                                                                 │
│ LOOP CONTROL                                                    │
│   break;                          // Exit loop                  │
│   continue;                       // Skip to next iteration     │
│   return;                         // Exit method                │
│                                                                 │
│ LOGICAL OPERATORS                                               │
│   &&                              // AND (short-circuit)        │
│   ||                              // OR (short-circuit)         │
│   !                               // NOT                        │
│                                                                 │
│ PATTERNS (C# 8+)                                                │
│   is int n when n > 0             // Type + condition           │
│   { Property: value }             // Property pattern           │
│   (x, y)                          // Tuple pattern              │
│   < 0 or > 100                    // Relational pattern         │
└────────────────────────────────────────────────────────────────┘
```

## Summary

You've learned:
- **If/else statements** for making decisions
- **Comparison operators** (`==`, `!=`, `<`, `>`, `<=`, `>=`)
- **Logical operators** (`&&`, `||`, `!`) with short-circuit evaluation
- **Ternary operator** for concise conditionals
- **Switch statements and expressions** for multiple conditions
- **Pattern matching** for powerful type and value checking
- **For loops** for known iteration counts
- **While/do-while loops** for unknown iteration counts
- **Foreach loops** for iterating collections
- **Break and continue** for loop control

## Next Steps

Continue to [Methods](/guide/csharp/04-methods) to learn about creating reusable code blocks!
