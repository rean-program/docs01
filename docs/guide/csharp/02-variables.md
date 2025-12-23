# Variables & Data Types

Learn about C# data types, variables, and how to work with different kinds of data.

::: info What You'll Learn
- Declaring and initializing variables
- Understanding value types vs reference types
- Working with strings and numbers
- Type conversion and casting
- Nullable types and null safety
:::

## What are Variables?

Variables are containers for storing data values. Think of them as labeled boxes where you can store information that your program needs to remember.

```
┌─────────────────────────────────────────────────────────────────┐
│                     Variable Declaration                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│     int age = 25;                                                │
│     ───  ───   ──                                                │
│      │    │    │                                                 │
│      │    │    └── Value (the data stored)                       │
│      │    └─────── Name (identifier - how you refer to it)       │
│      └──────────── Type (what kind of data it can hold)          │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Variable Naming Rules

```csharp
// Valid variable names
int age;              // Simple name
int studentAge;       // camelCase (recommended)
int _privateValue;    // Underscore prefix (for private fields)
int student2Age;      // Numbers allowed (not at start)

// Invalid variable names
// int 2ndPlace;      // Cannot start with number
// int my-age;        // No hyphens allowed
// int class;         // Cannot use reserved keywords
// int my age;        // No spaces allowed
```

::: tip Naming Convention
Use **camelCase** for local variables and parameters: `firstName`, `totalAmount`, `isActive`
Use **PascalCase** for properties and public members: `FirstName`, `TotalAmount`, `IsActive`
:::

## Value Types vs Reference Types

Understanding the difference between value types and reference types is crucial in C#.

```
┌─────────────────────────────────────────────────────────────────┐
│                    VALUE TYPES                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   Stack Memory                                                   │
│   ┌──────────────┐                                               │
│   │ age = 25     │  ← Value stored directly                      │
│   ├──────────────┤                                               │
│   │ price = 9.99 │  ← Value stored directly                      │
│   └──────────────┘                                               │
│                                                                  │
│   When you copy: int b = a;                                      │
│   → Creates an independent copy                                  │
│   → Changing 'b' does NOT affect 'a'                             │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                   REFERENCE TYPES                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   Stack Memory              Heap Memory                          │
│   ┌──────────────┐         ┌─────────────────────┐               │
│   │ name ────────│────────►│ "Alice"             │               │
│   └──────────────┘         └─────────────────────┘               │
│        │                                                         │
│        └── Reference (pointer) stored, not the actual data       │
│                                                                  │
│   When you copy: string b = a;                                   │
│   → Both point to same location (for objects)                    │
│   → Strings are special: immutable, behave like value types      │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Demonstration

```csharp
// Value Types - independent copies
int a = 10;
int b = a;      // Copy the value
b = 20;         // Change b
Console.WriteLine(a);  // Output: 10 (unchanged!)
Console.WriteLine(b);  // Output: 20

// Reference Types (arrays) - shared reference
int[] arr1 = { 1, 2, 3 };
int[] arr2 = arr1;     // Copy the reference
arr2[0] = 99;          // Modify through arr2
Console.WriteLine(arr1[0]);  // Output: 99 (changed!)
```

## Value Types

Value types directly contain their data and are stored on the stack.

### Integer Types

```csharp
// Signed integers (can be negative or positive)
sbyte  tinyNumber    = -128;              // -128 to 127
short  smallNumber   = -32768;            // -32,768 to 32,767
int    number        = -2147483648;       // ±2.1 billion (most common)
long   bigNumber     = -9223372036854775808L;  // ±9.2 quintillion

// Unsigned integers (positive only - larger positive range)
byte   positiveTiny  = 255;               // 0 to 255
ushort positiveSmall = 65535;             // 0 to 65,535
uint   positiveInt   = 4294967295;        // 0 to 4.2 billion
ulong  positiveLong  = 18446744073709551615UL;  // 0 to 18.4 quintillion
```

::: warning When to Use Each Type
- **`int`**: Default choice for most whole numbers
- **`long`**: When `int` is not big enough (file sizes, timestamps)
- **`byte`**: For raw data, image processing, network packets
- **`short`**: Rarely used, when memory is critical
:::

### Floating-Point Types

```csharp
// float: 7 digits precision - use 'f' suffix
float temperature = 36.6f;
float pi = 3.14159f;

// double: 15-16 digits precision - default for decimals
double preciseValue = 3.141592653589793;
double scientificNotation = 1.5e10;  // 15,000,000,000

// decimal: 28-29 digits precision - use 'm' suffix
decimal accountBalance = 1234567.89m;
decimal interestRate = 0.0325m;
```

### Type Comparison Table

| Type | Size | Range | Precision | Use Case |
|------|------|-------|-----------|----------|
| `byte` | 1 byte | 0 to 255 | - | Raw data, colors |
| `short` | 2 bytes | ±32,767 | - | Memory-constrained |
| `int` | 4 bytes | ±2.1 billion | - | **General integers** |
| `long` | 8 bytes | ±9.2 quintillion | - | Large numbers, IDs |
| `float` | 4 bytes | ±3.4 × 10³⁸ | 7 digits | Graphics, games |
| `double` | 8 bytes | ±1.7 × 10³⁰⁸ | 15-16 digits | **Scientific, general** |
| `decimal` | 16 bytes | ±7.9 × 10²⁸ | 28-29 digits | **Financial/money** |

::: danger Precision Warning
Never use `float` or `double` for money calculations!

```csharp
// Problem with double
double price = 0.1 + 0.2;
Console.WriteLine(price);  // 0.30000000000000004 ❌

// Use decimal for money
decimal money = 0.1m + 0.2m;
Console.WriteLine(money);  // 0.3 ✓
```
:::

### Boolean Type

Booleans represent true/false values and are essential for decision-making.

```csharp
bool isActive = true;
bool isComplete = false;

// Boolean expressions (evaluate to true or false)
int age = 25;
bool isAdult = age >= 18;           // true
bool isTeenager = age >= 13 && age <= 19;  // false
bool canVote = isAdult && !isComplete;     // true

// Comparison operators
bool equal = 5 == 5;        // true (equal to)
bool notEqual = 5 != 3;     // true (not equal to)
bool greater = 10 > 5;      // true (greater than)
bool less = 3 < 7;          // true (less than)
bool greaterOrEqual = 5 >= 5;  // true
bool lessOrEqual = 3 <= 3;     // true
```

### Character Type

Characters represent single Unicode characters.

```csharp
char letter = 'A';
char digit = '7';
char symbol = '@';
char unicode = '\u0041';     // 'A' in Unicode
char newLine = '\n';         // Escape sequence: new line
char tab = '\t';             // Escape sequence: tab
char quote = '\'';           // Escape sequence: single quote

// Characters are actually numbers (Unicode values)
char a = 'A';
int asciiValue = (int)a;     // 65
char nextLetter = (char)(a + 1);  // 'B'
```

## Reference Types

Reference types store a reference (address) to the actual data in memory.

### Strings

Strings are sequences of characters. Although they're reference types, they behave like value types because they're **immutable** (cannot be changed).

```csharp
// String declaration
string name = "Alice";
string greeting = "Hello, World!";
string empty = "";                    // Empty string
string nothing = null;                // Null (no value)

// String is immutable - modifications create new strings
string original = "Hello";
string modified = original.ToUpper(); // Creates new string "HELLO"
Console.WriteLine(original);          // Still "Hello"

// String length
int length = name.Length;  // 5

// Accessing characters
char firstChar = name[0];   // 'A'
char lastChar = name[^1];   // 'e' (C# 8+)
```

### String Creation Methods

```csharp
// Concatenation (joining strings)
string firstName = "John";
string lastName = "Doe";
string fullName = firstName + " " + lastName;  // "John Doe"

// String interpolation (recommended for readability)
int age = 30;
string message = $"Hello, {firstName}! You are {age} years old.";

// String formatting
string formatted = string.Format("Name: {0}, Age: {1}", firstName, age);

// Verbatim strings (ignore escape sequences)
string path = @"C:\Users\Documents\file.txt";

// Raw string literals (C# 11+)
string json = """
    {
        "name": "Alice",
        "age": 25
    }
    """;
```

### String Operations

```csharp
string text = "  Hello, World!  ";

// Case conversion
string upper = text.ToUpper();        // "  HELLO, WORLD!  "
string lower = text.ToLower();        // "  hello, world!  "

// Trimming whitespace
string trimmed = text.Trim();         // "Hello, World!"
string trimStart = text.TrimStart();  // "Hello, World!  "
string trimEnd = text.TrimEnd();      // "  Hello, World!"

// Searching
bool contains = text.Contains("World");       // true
bool startsWith = text.StartsWith("  Hello"); // true
bool endsWith = text.EndsWith("!  ");         // true
int index = text.IndexOf("World");            // 9
int lastIndex = text.LastIndexOf("o");        // 11

// Extracting substrings
string sub1 = "Hello, World!".Substring(0, 5);   // "Hello"
string sub2 = "Hello, World!".Substring(7);      // "World!"

// Replacing
string replaced = text.Replace("World", "C#");  // "  Hello, C#!  "

// Splitting
string csv = "apple,banana,cherry";
string[] fruits = csv.Split(',');  // ["apple", "banana", "cherry"]

// Joining
string joined = string.Join(" - ", fruits);  // "apple - banana - cherry"
```

### String Comparison

```csharp
string a = "hello";
string b = "Hello";

// Case-sensitive comparison
bool equal1 = a == b;                              // false
bool equal2 = a.Equals(b);                         // false

// Case-insensitive comparison
bool equalIgnoreCase = a.Equals(b, StringComparison.OrdinalIgnoreCase);  // true
bool equalIgnoreCase2 = string.Equals(a, b, StringComparison.OrdinalIgnoreCase);

// Null-safe comparison
string x = null;
string y = "test";
bool areEqual = string.Equals(x, y);  // false (no exception)
// bool crash = x.Equals(y);          // NullReferenceException!
```

### String Empty vs Null Check

```csharp
string empty = "";
string whitespace = "   ";
string nullStr = null;

// Different checks
bool isEmpty = string.IsNullOrEmpty(nullStr);       // true
bool isEmpty2 = string.IsNullOrEmpty(empty);        // true
bool isEmpty3 = string.IsNullOrEmpty(whitespace);   // false

bool isBlank = string.IsNullOrWhiteSpace(nullStr);      // true
bool isBlank2 = string.IsNullOrWhiteSpace(empty);       // true
bool isBlank3 = string.IsNullOrWhiteSpace(whitespace);  // true (!)
```

## Type Inference with var

The `var` keyword lets the compiler infer the type automatically.

```csharp
// Compiler infers the type from the right side
var number = 42;              // int
var price = 19.99;            // double (default for decimals)
var priceFloat = 19.99f;      // float (explicit with 'f')
var name = "Alice";           // string
var isActive = true;          // bool
var items = new List<int>();  // List<int>

// var MUST be initialized - the compiler needs to see a value
// var unknown;              // Error: requires initialization
// var result = null;        // Error: cannot determine type from null

// You can use explicit typing when clarity is needed
List<string> names = new List<string>();  // Explicit
var names2 = new List<string>();          // Inferred (same result)
```

::: tip When to Use var
- Use `var` when the type is obvious from the right side: `var user = new User();`
- Use explicit type when it improves readability: `Dictionary<string, List<int>> mapping = GetMapping();`
:::

## Constants and Read-only

```csharp
// Constants - compile-time constant, cannot be changed
const double Pi = 3.14159265359;
const int MaxUsers = 100;
const string AppName = "MyApp";

// Constants must be initialized with a literal or constant expression
const int SecondsPerDay = 60 * 60 * 24;  // OK - computed at compile time
// const DateTime StartDate = DateTime.Now;  // Error: not a constant

// Read-only - runtime constant, set once (in constructor or declaration)
public class Configuration
{
    public readonly string ConnectionString;
    public readonly DateTime CreatedAt = DateTime.Now;  // OK at runtime

    public Configuration(string connectionString)
    {
        ConnectionString = connectionString;  // Set in constructor
    }
}
```

## Nullable Types

By default, value types cannot be null. Use `?` to make them nullable.

```csharp
// Non-nullable value types
int age = 25;
// age = null;  // Error: cannot assign null to int

// Nullable value types (use ? suffix)
int? nullableAge = null;
int? anotherAge = 30;
double? nullablePrice = null;
bool? nullableBool = null;

// Check for null
if (nullableAge.HasValue)
{
    Console.WriteLine($"Age: {nullableAge.Value}");
}
else
{
    Console.WriteLine("Age not set");
}

// Shorter null check
if (nullableAge != null)
{
    Console.WriteLine($"Age: {nullableAge}");  // Implicit .Value
}
```

### Null-Coalescing Operators

```csharp
int? nullableValue = null;

// ?? - Null-coalescing operator (provide default value)
int value1 = nullableValue ?? 0;        // 0 (since nullableValue is null)
int value2 = nullableValue ?? -1;       // -1

// ??= - Null-coalescing assignment (assign if null)
nullableValue ??= 100;  // Now nullableValue is 100
Console.WriteLine(nullableValue);  // 100

// Chaining null-coalescing
int? a = null;
int? b = null;
int? c = 5;
int result = a ?? b ?? c ?? 0;  // 5 (first non-null value)
```

### Null-Conditional Operators

```csharp
string? name = null;

// ?. - Null-conditional access (returns null if left side is null)
int? length = name?.Length;  // null (no exception!)

// Without ?. this would throw NullReferenceException
// int length2 = name.Length;  // Error if name is null!

// Combine with ?? for a default value
int safeLength = name?.Length ?? 0;  // 0

// Works with method calls
string? upper = name?.ToUpper();  // null

// Chain multiple ?. operators
string? city = user?.Address?.City?.ToUpper();
```

## Type Conversion

### Implicit Conversion (Safe - No Data Loss)

```csharp
// Smaller types automatically convert to larger types
byte b = 100;
int i = b;          // byte → int (safe)
long l = i;         // int → long (safe)
float f = l;        // long → float (safe)
double d = f;       // float → double (safe)

// Conversion hierarchy
// byte → short → int → long → float → double
//                 ↓
//               decimal (special case)
```

### Explicit Conversion (Casting - Possible Data Loss)

```csharp
// Larger types require explicit cast to smaller types
double myDouble = 9.78;
int myInt = (int)myDouble;  // 9 (decimal part truncated!)

long bigNumber = 3000000000;  // 3 billion
int smaller = (int)bigNumber;  // Overflow! Unpredictable result

// Safe casting with checked (throws exception on overflow)
try
{
    int safeSmaller = checked((int)bigNumber);
}
catch (OverflowException)
{
    Console.WriteLine("Number too large for int!");
}
```

### Parse and TryParse

```csharp
// Parse - throws exception if invalid
string validNumber = "123";
int number = int.Parse(validNumber);      // 123
double price = double.Parse("19.99");     // 19.99

// Parse can fail!
try
{
    int invalid = int.Parse("abc");  // FormatException!
}
catch (FormatException)
{
    Console.WriteLine("Invalid number format");
}

// TryParse - safe, returns bool indicating success
string input = "abc";
if (int.TryParse(input, out int result))
{
    Console.WriteLine($"Parsed: {result}");
}
else
{
    Console.WriteLine("Invalid number - no exception thrown!");
}

// TryParse with different types
bool success1 = double.TryParse("3.14", out double pi);      // true
bool success2 = bool.TryParse("true", out bool flag);        // true
bool success3 = DateTime.TryParse("2024-01-15", out DateTime date);
```

### Convert Class

```csharp
// Convert class provides type conversion methods
string str = "456";
int num = Convert.ToInt32(str);           // 456
double dbl = Convert.ToDouble("3.14");    // 3.14
bool boolean = Convert.ToBoolean("true"); // true
byte b = Convert.ToByte(255);             // 255

// Convert handles null differently than Parse
string? nullString = null;
int fromNull = Convert.ToInt32(nullString);  // 0 (not exception!)
// int fromNullParse = int.Parse(nullString);  // Exception!

// Number to string
int age = 25;
string ageStr = age.ToString();           // "25"
string formatted = age.ToString("D4");    // "0025" (4 digits)
double price = 19.99;
string priceStr = price.ToString("C");    // "$19.99" (currency)
string priceF2 = price.ToString("F2");    // "19.99" (2 decimals)
```

## Working with Numbers

### Arithmetic Operators

```csharp
int a = 10, b = 3;

int sum = a + b;        // 13 (addition)
int diff = a - b;       // 7 (subtraction)
int product = a * b;    // 30 (multiplication)
int quotient = a / b;   // 3 (integer division - truncates!)
int remainder = a % b;  // 1 (modulo - remainder)

// Integer division vs floating-point division
Console.WriteLine(10 / 3);        // 3 (integer division)
Console.WriteLine(10.0 / 3);      // 3.333... (floating-point)
Console.WriteLine((double)10 / 3); // 3.333... (cast then divide)

// Compound assignment operators
int x = 10;
x += 5;   // x = x + 5  → 15
x -= 3;   // x = x - 3  → 12
x *= 2;   // x = x * 2  → 24
x /= 4;   // x = x / 4  → 6
x %= 4;   // x = x % 4  → 2

// Increment and decrement
int count = 0;
count++;    // count = 1 (increment)
count--;    // count = 0 (decrement)
++count;    // count = 1 (prefix increment)

// Difference: prefix vs postfix
int n = 5;
Console.WriteLine(n++);  // Prints 5, then n becomes 6
Console.WriteLine(++n);  // n becomes 7, then prints 7
```

### Math Class

```csharp
// Basic operations
Math.Abs(-4.7);         // 4.7 (absolute value)
Math.Max(5, 10);        // 10 (maximum)
Math.Min(5, 10);        // 5 (minimum)

// Rounding
Math.Round(4.5);        // 4 (banker's rounding - to even)
Math.Round(4.6);        // 5
Math.Round(4.567, 2);   // 4.57 (2 decimal places)
Math.Ceiling(4.1);      // 5 (round up)
Math.Floor(4.9);        // 4 (round down)
Math.Truncate(4.9);     // 4 (remove decimals)

// Power and roots
Math.Pow(2, 3);         // 8 (2³)
Math.Sqrt(16);          // 4 (square root)
Math.Cbrt(27);          // 3 (cube root)

// Logarithms and exponentials
Math.Log(10);           // 2.302... (natural log)
Math.Log10(100);        // 2 (base 10 log)
Math.Exp(1);            // 2.718... (e¹)

// Trigonometry (radians)
Math.Sin(Math.PI / 2);  // 1
Math.Cos(0);            // 1
Math.Tan(Math.PI / 4);  // 1

// Constants
double pi = Math.PI;    // 3.14159265358979
double e = Math.E;      // 2.71828182845905

// Clamp (limit value to range)
Math.Clamp(15, 0, 10);  // 10 (clamp 15 to range 0-10)
Math.Clamp(-5, 0, 10);  // 0
Math.Clamp(5, 0, 10);   // 5
```

## Default Values

```csharp
// Value types have default values
int defaultInt = default;           // 0
bool defaultBool = default;         // false
double defaultDouble = default;     // 0.0
char defaultChar = default;         // '\0' (null character)
DateTime defaultDate = default;     // 01/01/0001 00:00:00

// Reference types default to null
string? defaultString = default;    // null
object? defaultObject = default;    // null
int[]? defaultArray = default;      // null

// Using default in generic contexts
T GetDefault<T>() => default!;

// Default value expressions
var x = default(int);               // 0
var y = default(string);            // null
```

## Complete Examples

### Example 1: User Profile

```csharp
using System;

class UserProfile
{
    static void Main()
    {
        // Collect user information
        Console.Write("Enter your name: ");
        string name = Console.ReadLine() ?? "Unknown";

        Console.Write("Enter your age: ");
        int age = int.TryParse(Console.ReadLine(), out int parsedAge)
            ? parsedAge
            : 0;

        Console.Write("Enter your height in meters: ");
        double height = double.TryParse(Console.ReadLine(), out double parsedHeight)
            ? parsedHeight
            : 0.0;

        Console.Write("Are you a student? (true/false): ");
        bool isStudent = bool.TryParse(Console.ReadLine(), out bool parsedStudent)
            && parsedStudent;

        // Calculate derived values
        int birthYear = DateTime.Now.Year - age;
        string ageGroup = age switch
        {
            < 13 => "Child",
            < 20 => "Teenager",
            < 60 => "Adult",
            _ => "Senior"
        };

        // Display profile
        Console.WriteLine("\n╔══════════════════════════════════╗");
        Console.WriteLine("║         USER PROFILE             ║");
        Console.WriteLine("╠══════════════════════════════════╣");
        Console.WriteLine($"║ Name:      {name,-22} ║");
        Console.WriteLine($"║ Age:       {age,-22} ║");
        Console.WriteLine($"║ Height:    {height:F2}m{"",-18} ║");
        Console.WriteLine($"║ Student:   {isStudent,-22} ║");
        Console.WriteLine($"║ Birth Year: {birthYear,-21} ║");
        Console.WriteLine($"║ Category:  {ageGroup,-22} ║");
        Console.WriteLine("╚══════════════════════════════════╝");
    }
}
```

### Example 2: Shopping Cart Calculator

```csharp
using System;

class ShoppingCart
{
    static void Main()
    {
        // Product prices (use decimal for money!)
        decimal shirtPrice = 29.99m;
        decimal pantsPrice = 49.99m;
        decimal shoesPrice = 89.99m;

        // Quantities
        int shirtQty = 2;
        int pantsQty = 1;
        int shoesQty = 1;

        // Calculate totals
        decimal shirtTotal = shirtPrice * shirtQty;
        decimal pantsTotal = pantsPrice * pantsQty;
        decimal shoesTotal = shoesPrice * shoesQty;
        decimal subtotal = shirtTotal + pantsTotal + shoesTotal;

        // Apply discount
        decimal discountPercent = 10m;
        decimal discountAmount = subtotal * (discountPercent / 100);

        // Calculate tax
        decimal taxRate = 8.5m;
        decimal taxableAmount = subtotal - discountAmount;
        decimal taxAmount = taxableAmount * (taxRate / 100);

        // Final total
        decimal grandTotal = taxableAmount + taxAmount;

        // Display receipt
        Console.WriteLine("═══════════════════════════════════════");
        Console.WriteLine("            SHOPPING RECEIPT           ");
        Console.WriteLine("═══════════════════════════════════════");
        Console.WriteLine($"{"Item",-15} {"Qty",5} {"Price",10} {"Total",10}");
        Console.WriteLine("───────────────────────────────────────");
        Console.WriteLine($"{"Shirt",-15} {shirtQty,5} {shirtPrice,10:C} {shirtTotal,10:C}");
        Console.WriteLine($"{"Pants",-15} {pantsQty,5} {pantsPrice,10:C} {pantsTotal,10:C}");
        Console.WriteLine($"{"Shoes",-15} {shoesQty,5} {shoesPrice,10:C} {shoesTotal,10:C}");
        Console.WriteLine("───────────────────────────────────────");
        Console.WriteLine($"{"Subtotal:",-27} {subtotal,12:C}");
        Console.WriteLine($"{"Discount (" + discountPercent + "%):",-27} {-discountAmount,12:C}");
        Console.WriteLine($"{"Tax (" + taxRate + "%):",-27} {taxAmount,12:C}");
        Console.WriteLine("═══════════════════════════════════════");
        Console.WriteLine($"{"TOTAL:",-27} {grandTotal,12:C}");
        Console.WriteLine("═══════════════════════════════════════");
    }
}
```

### Example 3: Temperature Converter

```csharp
using System;

class TemperatureConverter
{
    static void Main()
    {
        Console.WriteLine("Temperature Converter");
        Console.WriteLine("=====================");
        Console.Write("Enter temperature: ");

        if (!double.TryParse(Console.ReadLine(), out double temp))
        {
            Console.WriteLine("Invalid temperature!");
            return;
        }

        Console.Write("Enter unit (C/F/K): ");
        char unit = char.ToUpper(Console.ReadKey().KeyChar);
        Console.WriteLine();

        // Convert to all units
        double celsius, fahrenheit, kelvin;

        switch (unit)
        {
            case 'C':
                celsius = temp;
                fahrenheit = (temp * 9 / 5) + 32;
                kelvin = temp + 273.15;
                break;
            case 'F':
                celsius = (temp - 32) * 5 / 9;
                fahrenheit = temp;
                kelvin = celsius + 273.15;
                break;
            case 'K':
                celsius = temp - 273.15;
                fahrenheit = (celsius * 9 / 5) + 32;
                kelvin = temp;
                break;
            default:
                Console.WriteLine("Unknown unit!");
                return;
        }

        // Display results
        Console.WriteLine($"\n{temp}°{unit} equals:");
        Console.WriteLine($"  Celsius:    {celsius:F2}°C");
        Console.WriteLine($"  Fahrenheit: {fahrenheit:F2}°F");
        Console.WriteLine($"  Kelvin:     {kelvin:F2}K");

        // Add description
        string description = celsius switch
        {
            < -20 => "Extremely cold!",
            < 0 => "Freezing",
            < 10 => "Cold",
            < 20 => "Cool",
            < 25 => "Comfortable",
            < 30 => "Warm",
            < 35 => "Hot",
            _ => "Extremely hot!"
        };
        Console.WriteLine($"\nCondition: {description}");
    }
}
```

## Quick Reference Card

```
┌────────────────────────────────────────────────────────────────┐
│                    C# TYPES QUICK REFERENCE                     │
├────────────────────────────────────────────────────────────────┤
│ INTEGERS                                                        │
│   int age = 25;              // Most common                     │
│   long bigNum = 123456789L;  // Large numbers                   │
│   byte small = 255;          // 0-255                           │
│                                                                 │
│ DECIMALS                                                        │
│   double x = 3.14;           // Scientific (default)            │
│   float y = 3.14f;           // Graphics/games                  │
│   decimal z = 3.14m;         // Money/financial                 │
│                                                                 │
│ OTHER VALUE TYPES                                               │
│   bool flag = true;          // true or false                   │
│   char letter = 'A';         // Single character                │
│                                                                 │
│ STRINGS                                                         │
│   string name = "Alice";     // Text                            │
│   string msg = $"Hi {name}"; // Interpolation                   │
│   string path = @"C:\test";  // Verbatim (no escaping)          │
│                                                                 │
│ NULLABLE                                                        │
│   int? x = null;             // Nullable value type             │
│   x ?? 0                     // Default if null                 │
│   x?.Method()                // Null-conditional                │
│                                                                 │
│ TYPE INFERENCE                                                  │
│   var x = 42;                // Compiler infers type            │
│                                                                 │
│ CONSTANTS                                                       │
│   const int MAX = 100;       // Compile-time constant           │
│   readonly int x = 5;        // Runtime constant                │
│                                                                 │
│ CONVERSION                                                      │
│   (int)3.14                  // Cast (explicit)                 │
│   int.Parse("42")            // Parse (throws on error)         │
│   int.TryParse(s, out x)     // Safe parse (returns bool)       │
│   Convert.ToInt32("42")      // Convert class                   │
└────────────────────────────────────────────────────────────────┘
```

## Summary

You've learned:
- **Variables** are containers for storing data with specific types
- **Value types** (int, double, bool) store data directly on the stack
- **Reference types** (string, arrays, objects) store references to heap memory
- **Strings** are immutable and have many built-in methods
- **Nullable types** (`int?`) allow value types to represent "no value"
- **Type conversion** can be implicit (safe) or explicit (casting)
- **Constants** (`const`) are compile-time, **readonly** is runtime
- Use **decimal** for money, **double** for science, **int** for whole numbers

## Next Steps

Continue to [Control Flow](/guide/csharp/03-control-flow) to learn about conditions and loops!
