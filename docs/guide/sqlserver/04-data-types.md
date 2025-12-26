# SQL Server Data Types

Understanding data types is crucial for designing efficient databases. This chapter covers all SQL Server data types and when to use them.

## Data Type Categories

```
┌─────────────────────────────────────────────────────────────────┐
│                   SQL Server Data Types                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Numeric              Character             Date/Time            │
│  ───────              ─────────             ─────────            │
│  • INT                • CHAR                • DATE               │
│  • BIGINT             • VARCHAR             • TIME               │
│  • DECIMAL            • NCHAR               • DATETIME           │
│  • FLOAT              • NVARCHAR            • DATETIME2          │
│  • BIT                • TEXT                • DATETIMEOFFSET     │
│                                                                  │
│  Binary               Special               Large Objects        │
│  ──────               ───────               ─────────────        │
│  • BINARY             • UNIQUEIDENTIFIER    • VARCHAR(MAX)       │
│  • VARBINARY          • XML                 • NVARCHAR(MAX)      │
│  • IMAGE              • JSON (NVARCHAR)     • VARBINARY(MAX)     │
│                       • GEOGRAPHY/GEOMETRY                       │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Numeric Data Types

### Integer Types

| Type | Storage | Range | Use Case |
|------|---------|-------|----------|
| **TINYINT** | 1 byte | 0 to 255 | Status codes, ages |
| **SMALLINT** | 2 bytes | -32,768 to 32,767 | Small counts |
| **INT** | 4 bytes | -2.1 billion to 2.1 billion | Most IDs, counts |
| **BIGINT** | 8 bytes | -9.2 quintillion to 9.2 quintillion | Large sequences |

```sql
-- Integer examples
CREATE TABLE NumberExamples (
    TinyValue TINYINT,          -- 0-255
    SmallValue SMALLINT,         -- ±32K
    IntValue INT,                -- ±2.1 billion
    BigValue BIGINT              -- ±9.2 quintillion
);

INSERT INTO NumberExamples VALUES (255, 32767, 2147483647, 9223372036854775807);

-- Check storage size
SELECT
    DATALENGTH(TinyValue) AS TinyBytes,    -- 1
    DATALENGTH(SmallValue) AS SmallBytes,  -- 2
    DATALENGTH(IntValue) AS IntBytes,      -- 4
    DATALENGTH(BigValue) AS BigBytes       -- 8
FROM NumberExamples;
```

::: tip Choosing Integer Types
- Use `INT` for most cases (primary keys, foreign keys, counts)
- Use `TINYINT` for small enumerations (status: 0-5)
- Use `BIGINT` only when you expect > 2 billion records
- Smaller types = faster performance + less storage
:::

### Decimal Types

| Type | Precision | Use Case |
|------|-----------|----------|
| **DECIMAL(p,s)** | Exact, user-defined | Money, measurements |
| **NUMERIC(p,s)** | Same as DECIMAL | Financial calculations |
| **MONEY** | 4 decimal places | Currency (legacy) |
| **SMALLMONEY** | 4 decimal places | Small currency |

```sql
-- DECIMAL(precision, scale)
-- precision = total digits (1-38)
-- scale = digits after decimal point

CREATE TABLE PriceExamples (
    -- DECIMAL(10,2) = up to 99,999,999.99
    Price DECIMAL(10,2),

    -- DECIMAL(18,4) = high precision
    ExactPrice DECIMAL(18,4),

    -- MONEY = ±922 trillion, 4 decimal places
    SalePrice MONEY,

    -- SMALLMONEY = ±214,748.3647
    Discount SMALLMONEY
);

INSERT INTO PriceExamples VALUES
    (1234.56, 1234.5678, 1234.5678, 10.99);

-- Always use DECIMAL for financial calculations
DECLARE @Price DECIMAL(10,2) = 19.99;
DECLARE @Quantity INT = 3;
DECLARE @TaxRate DECIMAL(5,4) = 0.0875;

SELECT
    @Price * @Quantity AS Subtotal,
    @Price * @Quantity * @TaxRate AS Tax,
    @Price * @Quantity * (1 + @TaxRate) AS Total;
```

::: warning Avoid MONEY for Calculations
`MONEY` can cause rounding errors in complex calculations. Use `DECIMAL` instead.
```sql
-- MONEY rounding issue
DECLARE @m1 MONEY = 1.00, @m2 MONEY = 3.00;
SELECT @m1/@m2*@m2;  -- Returns 0.9999, not 1.00!

-- DECIMAL is accurate
DECLARE @d1 DECIMAL(10,4) = 1.00, @d2 DECIMAL(10,4) = 3.00;
SELECT @d1/@d2*@d2;  -- Returns 1.0000
```
:::

### Floating-Point Types

| Type | Storage | Precision | Use Case |
|------|---------|-----------|----------|
| **FLOAT** | 4 or 8 bytes | ~15 digits | Scientific data |
| **REAL** | 4 bytes | ~7 digits | Approximate values |

```sql
-- FLOAT for scientific calculations
CREATE TABLE ScientificData (
    Measurement FLOAT,        -- Default 53-bit precision
    LowPrecision FLOAT(24),   -- 7-digit precision
    HighPrecision FLOAT(53),  -- 15-digit precision
    RealValue REAL            -- Same as FLOAT(24)
);

-- Example: storing coordinates
INSERT INTO ScientificData VALUES
    (3.14159265358979, 3.141593, 3.14159265358979, 3.141593);
```

## Character Data Types

### Non-Unicode Types (ASCII)

| Type | Storage | Max Size | Use Case |
|------|---------|----------|----------|
| **CHAR(n)** | n bytes (fixed) | 8,000 | Fixed-length codes |
| **VARCHAR(n)** | Actual + 2 bytes | 8,000 | Variable text |
| **VARCHAR(MAX)** | Up to 2GB | 2GB | Large text |
| **TEXT** | Up to 2GB | 2GB | Legacy (deprecated) |

```sql
CREATE TABLE CharacterExamples (
    -- CHAR: Fixed-length, padded with spaces
    CountryCode CHAR(2),       -- Always 2 bytes ('US', 'UK')
    StateCode CHAR(3),         -- Always 3 bytes ('CA ', 'NY ')

    -- VARCHAR: Variable-length
    FirstName VARCHAR(50),     -- Up to 50 chars
    Description VARCHAR(500),  -- Up to 500 chars

    -- VARCHAR(MAX): Large text
    Biography VARCHAR(MAX)     -- Up to 2GB
);

-- CHAR pads with spaces
INSERT INTO CharacterExamples (CountryCode, StateCode)
VALUES ('US', 'CA');

SELECT
    CountryCode,
    LEN(CountryCode) AS Len,           -- 2
    DATALENGTH(CountryCode) AS Bytes,  -- 2
    StateCode,
    LEN(StateCode) AS Len,             -- 2 (trailing spaces ignored)
    DATALENGTH(StateCode) AS Bytes     -- 3 (includes padding)
FROM CharacterExamples;
```

### Unicode Types (International Characters)

| Type | Storage | Max Size | Use Case |
|------|---------|----------|----------|
| **NCHAR(n)** | n×2 bytes (fixed) | 4,000 | Fixed Unicode |
| **NVARCHAR(n)** | Actual×2 + 2 bytes | 4,000 | Variable Unicode |
| **NVARCHAR(MAX)** | Up to 2GB | 2GB | Large Unicode text |
| **NTEXT** | Up to 2GB | 2GB | Legacy (deprecated) |

```sql
-- NVARCHAR for international text
CREATE TABLE Customers (
    CustomerID INT PRIMARY KEY IDENTITY,
    -- Use NVARCHAR for names (international characters)
    FirstName NVARCHAR(50) NOT NULL,
    LastName NVARCHAR(50) NOT NULL,
    -- Use VARCHAR for English-only fields
    Email VARCHAR(255),
    -- Unicode string literal uses N prefix
    Country NVARCHAR(100)
);

-- Insert Unicode data (note the N prefix)
INSERT INTO Customers (FirstName, LastName, Email, Country)
VALUES
    (N'François', N'Müller', 'francois@email.com', N'Germany'),
    (N'田中', N'太郎', 'tanaka@email.jp', N'日本'),
    (N'محمد', N'الأحمد', 'mohammed@email.sa', N'المملكة العربية السعودية');

SELECT * FROM Customers;
```

```
┌─────────────────────────────────────────────────────────────────┐
│               VARCHAR vs NVARCHAR Decision                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Use VARCHAR when:              Use NVARCHAR when:               │
│  ─────────────────              ──────────────────               │
│  • English-only content         • International names            │
│  • Codes (US, USD, SKU123)      • User-generated content        │
│  • Email addresses              • Multiple languages             │
│  • URLs and paths               • Asian characters (中文, 日本語) │
│  • Technical identifiers        • Arabic, Hebrew text           │
│                                                                  │
│  Benefits:                      Benefits:                        │
│  • 50% less storage             • Full Unicode support          │
│  • Faster performance           • No character loss             │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Date and Time Types

| Type | Storage | Range | Precision | Use Case |
|------|---------|-------|-----------|----------|
| **DATE** | 3 bytes | 0001-9999 | Day | Birth dates |
| **TIME** | 3-5 bytes | 00:00:00.0000000 | 100ns | Time only |
| **DATETIME** | 8 bytes | 1753-9999 | 3.33ms | Legacy |
| **DATETIME2** | 6-8 bytes | 0001-9999 | 100ns | Preferred |
| **DATETIMEOFFSET** | 10 bytes | 0001-9999 | 100ns + TZ | Time zones |
| **SMALLDATETIME** | 4 bytes | 1900-2079 | 1 minute | Approximate |

```sql
CREATE TABLE DateTimeExamples (
    -- DATE: Date only (no time)
    BirthDate DATE,

    -- TIME: Time only (no date)
    OpenTime TIME,
    CloseTime TIME(0),  -- No fractional seconds

    -- DATETIME: Legacy type
    CreatedAt DATETIME,

    -- DATETIME2: Preferred for new code
    ModifiedAt DATETIME2,
    PreciseTime DATETIME2(7),  -- Maximum precision

    -- DATETIMEOFFSET: With timezone
    EventTime DATETIMEOFFSET,

    -- SMALLDATETIME: Low precision
    ApproxTime SMALLDATETIME
);

-- Insert examples
INSERT INTO DateTimeExamples VALUES (
    '2024-03-15',                           -- DATE
    '09:00:00',                             -- TIME
    '17:00:00',                             -- TIME(0)
    '2024-03-15 10:30:00',                  -- DATETIME
    SYSDATETIME(),                          -- DATETIME2
    SYSDATETIME(),                          -- DATETIME2(7)
    SYSDATETIMEOFFSET(),                    -- DATETIMEOFFSET
    '2024-03-15 10:30:00'                   -- SMALLDATETIME
);

-- Current date/time functions
SELECT
    GETDATE() AS DateTime,              -- DATETIME
    SYSDATETIME() AS DateTime2,         -- DATETIME2
    SYSDATETIMEOFFSET() AS WithOffset,  -- DATETIMEOFFSET
    GETUTCDATE() AS UTC_DateTime,       -- DATETIME in UTC
    SYSUTCDATETIME() AS UTC_DateTime2;  -- DATETIME2 in UTC
```

### Date Functions

```sql
-- Extract date parts
DECLARE @dt DATETIME2 = '2024-03-15 14:30:45.123';

SELECT
    YEAR(@dt) AS Year,           -- 2024
    MONTH(@dt) AS Month,         -- 3
    DAY(@dt) AS Day,             -- 15
    DATEPART(HOUR, @dt) AS Hour, -- 14
    DATEPART(MINUTE, @dt) AS Minute,
    DATEPART(WEEKDAY, @dt) AS Weekday,
    DATENAME(MONTH, @dt) AS MonthName,  -- March
    DATENAME(WEEKDAY, @dt) AS DayName;  -- Friday

-- Date calculations
SELECT
    DATEADD(DAY, 7, @dt) AS PlusWeek,
    DATEADD(MONTH, 1, @dt) AS PlusMonth,
    DATEADD(YEAR, -1, @dt) AS LastYear,
    DATEDIFF(DAY, '2024-01-01', @dt) AS DaysSinceNewYear,
    DATEDIFF(YEAR, '1990-05-15', GETDATE()) AS Age,
    EOMONTH(@dt) AS EndOfMonth,
    EOMONTH(@dt, 1) AS EndOfNextMonth;

-- Format dates
SELECT
    FORMAT(@dt, 'yyyy-MM-dd') AS ISO,           -- 2024-03-15
    FORMAT(@dt, 'MM/dd/yyyy') AS US,            -- 03/15/2024
    FORMAT(@dt, 'dd-MMM-yyyy') AS Custom,       -- 15-Mar-2024
    FORMAT(@dt, 'dddd, MMMM d, yyyy') AS Long;  -- Friday, March 15, 2024
```

## Binary Data Types

| Type | Max Size | Use Case |
|------|----------|----------|
| **BINARY(n)** | 8,000 bytes | Fixed-length binary |
| **VARBINARY(n)** | 8,000 bytes | Variable binary |
| **VARBINARY(MAX)** | 2GB | Files, images |
| **IMAGE** | 2GB | Legacy (deprecated) |

```sql
CREATE TABLE Documents (
    DocumentID INT PRIMARY KEY IDENTITY,
    FileName NVARCHAR(255),
    ContentType VARCHAR(100),
    FileContent VARBINARY(MAX),
    FileHash BINARY(32),  -- SHA-256 hash
    UploadedAt DATETIME2 DEFAULT SYSDATETIME()
);

-- Insert binary data
INSERT INTO Documents (FileName, ContentType, FileHash)
VALUES ('report.pdf', 'application/pdf', HASHBYTES('SHA2_256', 'file content'));

-- Calculate hash
SELECT
    FileName,
    FileHash,
    CONVERT(VARCHAR(64), FileHash, 2) AS HashHex
FROM Documents;
```

## Special Data Types

### UNIQUEIDENTIFIER (GUID)

```sql
-- GUID for globally unique IDs
CREATE TABLE Sessions (
    SessionID UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    UserID INT,
    CreatedAt DATETIME2 DEFAULT SYSDATETIME()
);

-- Insert with auto-generated GUID
INSERT INTO Sessions (UserID) VALUES (1);

-- Insert with specific GUID
INSERT INTO Sessions (SessionID, UserID)
VALUES ('A1234567-89AB-CDEF-0123-456789ABCDEF', 2);

-- Generate GUID in T-SQL
SELECT
    NEWID() AS RandomGUID,
    NEWSEQUENTIALID() AS SequentialGUID;  -- Only in DEFAULT
```

### XML

```sql
-- Store XML data
CREATE TABLE Configurations (
    ConfigID INT PRIMARY KEY IDENTITY,
    Settings XML
);

INSERT INTO Configurations (Settings)
VALUES ('
<config>
    <database>
        <server>localhost</server>
        <port>1433</port>
    </database>
    <features>
        <logging enabled="true"/>
        <caching enabled="false"/>
    </features>
</config>
');

-- Query XML data
SELECT
    Settings.value('(/config/database/server)[1]', 'VARCHAR(100)') AS Server,
    Settings.value('(/config/database/port)[1]', 'INT') AS Port,
    Settings.exist('/config/features/logging[@enabled="true"]') AS LoggingEnabled
FROM Configurations;
```

### JSON (stored in NVARCHAR)

```sql
-- Store JSON data
CREATE TABLE Products (
    ProductID INT PRIMARY KEY IDENTITY,
    ProductName NVARCHAR(100),
    Attributes NVARCHAR(MAX)  -- JSON stored as string
);

INSERT INTO Products (ProductName, Attributes)
VALUES ('Laptop', '{
    "brand": "Dell",
    "specs": {
        "cpu": "Intel i7",
        "ram": "16GB",
        "storage": "512GB SSD"
    },
    "colors": ["Silver", "Black", "Blue"]
}');

-- Query JSON data
SELECT
    ProductName,
    JSON_VALUE(Attributes, '$.brand') AS Brand,
    JSON_VALUE(Attributes, '$.specs.cpu') AS CPU,
    JSON_VALUE(Attributes, '$.specs.ram') AS RAM,
    JSON_QUERY(Attributes, '$.colors') AS Colors
FROM Products;

-- Check if valid JSON
SELECT
    ProductName,
    ISJSON(Attributes) AS IsValidJSON
FROM Products;

-- Modify JSON
UPDATE Products
SET Attributes = JSON_MODIFY(Attributes, '$.specs.ram', '32GB')
WHERE ProductID = 1;
```

### Geography and Geometry

```sql
-- Spatial data types
CREATE TABLE Locations (
    LocationID INT PRIMARY KEY IDENTITY,
    LocationName NVARCHAR(100),
    Coordinates GEOGRAPHY,
    Area GEOMETRY
);

-- Insert geographic point
INSERT INTO Locations (LocationName, Coordinates)
VALUES
    ('New York', GEOGRAPHY::Point(40.7128, -74.0060, 4326)),
    ('Los Angeles', GEOGRAPHY::Point(34.0522, -118.2437, 4326));

-- Calculate distance between points
SELECT
    a.LocationName AS From_City,
    b.LocationName AS To_City,
    a.Coordinates.STDistance(b.Coordinates) / 1000 AS DistanceKM
FROM Locations a
CROSS JOIN Locations b
WHERE a.LocationID < b.LocationID;
```

## Data Type Conversion

### Implicit vs Explicit Conversion

```
┌─────────────────────────────────────────────────────────────────┐
│              Data Type Conversion Hierarchy                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Automatic (Implicit) Conversion:                                │
│  ────────────────────────────────                                │
│                                                                  │
│  TINYINT → SMALLINT → INT → BIGINT → DECIMAL → FLOAT            │
│                                                                  │
│  DATE → DATETIME → DATETIME2                                    │
│                                                                  │
│  CHAR → VARCHAR                                                  │
│                                                                  │
│                                                                  │
│  Explicit Conversion Required:                                   │
│  ────────────────────────────                                    │
│                                                                  │
│  VARCHAR ↔ INT (use CAST or CONVERT)                            │
│  VARCHAR ↔ DATE (use CAST or CONVERT)                           │
│  BINARY ↔ VARCHAR (use CONVERT with style)                      │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### CAST and CONVERT

```sql
-- CAST: ANSI standard
SELECT
    CAST(123 AS VARCHAR(10)) AS IntToString,
    CAST('456' AS INT) AS StringToInt,
    CAST('2024-03-15' AS DATE) AS StringToDate,
    CAST(123.456 AS INT) AS DecimalToInt,
    CAST(GETDATE() AS DATE) AS DateTimeToDate;

-- CONVERT: SQL Server specific (with format styles)
SELECT
    CONVERT(VARCHAR(10), 123) AS IntToString,
    CONVERT(INT, '456') AS StringToInt,
    CONVERT(DATE, '03/15/2024', 101) AS USDateToDate,
    CONVERT(VARCHAR(10), GETDATE(), 120) AS DateToISO;

-- Date format styles
DECLARE @dt DATETIME = GETDATE();
SELECT
    CONVERT(VARCHAR, @dt, 101) AS [MM/DD/YYYY],     -- 03/15/2024
    CONVERT(VARCHAR, @dt, 103) AS [DD/MM/YYYY],     -- 15/03/2024
    CONVERT(VARCHAR, @dt, 104) AS [DD.MM.YYYY],     -- 15.03.2024
    CONVERT(VARCHAR, @dt, 120) AS [YYYY-MM-DD HH:MI:SS],
    CONVERT(VARCHAR, @dt, 126) AS [ISO8601];

-- TRY_CAST and TRY_CONVERT (safe conversion)
SELECT
    TRY_CAST('abc' AS INT) AS SafeResult,  -- Returns NULL instead of error
    TRY_CONVERT(DATE, 'invalid') AS SafeDate;  -- Returns NULL
```

## Choosing the Right Data Type

```
┌─────────────────────────────────────────────────────────────────┐
│               Data Type Selection Guide                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  For IDs and Keys:                                               │
│  • Primary keys: INT IDENTITY or BIGINT IDENTITY                │
│  • Distributed systems: UNIQUEIDENTIFIER                        │
│                                                                  │
│  For Money:                                                      │
│  • Use DECIMAL(19,4) for currency                               │
│  • Never use FLOAT for money!                                   │
│                                                                  │
│  For Text:                                                       │
│  • English only: VARCHAR                                        │
│  • International: NVARCHAR                                      │
│  • Fixed codes: CHAR or NCHAR                                   │
│                                                                  │
│  For Dates:                                                      │
│  • Date only: DATE                                              │
│  • Date + Time: DATETIME2                                       │
│  • With timezone: DATETIMEOFFSET                                │
│                                                                  │
│  For Boolean:                                                    │
│  • Use BIT (0 = false, 1 = true)                                │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Summary

In this chapter, you learned:

- Integer types: TINYINT, SMALLINT, INT, BIGINT
- Decimal types: DECIMAL, NUMERIC (avoid MONEY for calculations)
- Character types: VARCHAR vs NVARCHAR (use N for international text)
- Date/Time types: DATE, TIME, DATETIME2 (preferred), DATETIMEOFFSET
- Special types: UNIQUEIDENTIFIER, XML, JSON, Geography
- Type conversion with CAST, CONVERT, and TRY_ variants

Ready to write more complex queries? Continue to [Chapter 5: Queries](./05-queries.md)!
