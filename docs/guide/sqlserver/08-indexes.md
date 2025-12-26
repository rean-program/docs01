# Indexes and Performance

Indexes are the key to SQL Server performance. This chapter covers index types, creation, and query optimization.

## How Indexes Work

```
┌─────────────────────────────────────────────────────────────────┐
│                    Index Concept                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Without Index (Table Scan):                                     │
│  ───────────────────────────                                     │
│  Looking for "Smith" → Must read ALL rows                        │
│  ┌───┬───┬───┬───┬───┬───┬───┬───┬───┬───┐                      │
│  │ A │ B │ C │...│ S │...│...│...│ Y │ Z │  ← Read every row    │
│  └───┴───┴───┴───┴───┴───┴───┴───┴───┴───┘                      │
│                                                                  │
│  With Index (Index Seek):                                        │
│  ────────────────────────                                        │
│  Looking for "Smith" → Go directly to "S" section                │
│                                                                  │
│         ┌───────┐                                                │
│         │ Index │                                                │
│         │ Root  │                                                │
│         └───┬───┘                                                │
│       ┌─────┴─────┐                                              │
│       ▼           ▼                                              │
│   ┌───────┐   ┌───────┐                                         │
│   │ A-M   │   │ N-Z   │  ← Skip to N-Z                          │
│   └───────┘   └───┬───┘                                         │
│                   ▼                                              │
│               ┌───────┐                                          │
│               │ Smith │  ← Found directly!                       │
│               └───────┘                                          │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Index Types

### Clustered Index

- Determines physical order of data in table
- Only ONE per table
- Primary key creates clustered index by default
- Leaf level contains actual data rows

```sql
-- Primary key automatically creates clustered index
CREATE TABLE Employees (
    EmployeeID INT PRIMARY KEY,  -- Clustered index
    FirstName NVARCHAR(50),
    LastName NVARCHAR(50),
    Email NVARCHAR(100)
);

-- Explicitly create clustered index
CREATE CLUSTERED INDEX IX_Employees_LastName
ON Employees(LastName, FirstName);

-- Create table without clustered index (heap)
CREATE TABLE LogEntries (
    LogID INT IDENTITY,
    LogDate DATETIME2,
    Message NVARCHAR(MAX)
);

-- Add clustered index later
CREATE CLUSTERED INDEX IX_LogEntries_LogDate
ON LogEntries(LogDate);
```

### Non-Clustered Index

- Separate structure pointing to data
- Multiple per table (up to 999)
- Leaf level contains index key + row locator

```sql
-- Create non-clustered index
CREATE NONCLUSTERED INDEX IX_Employees_Email
ON Employees(Email);

-- Composite index (multiple columns)
CREATE NONCLUSTERED INDEX IX_Employees_Name
ON Employees(LastName, FirstName);

-- Include columns (not in key, but stored in leaf)
CREATE NONCLUSTERED INDEX IX_Employees_Email_Include
ON Employees(Email)
INCLUDE (FirstName, LastName);
```

### Clustered vs Non-Clustered

```
┌─────────────────────────────────────────────────────────────────┐
│               Clustered vs Non-Clustered Index                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Clustered Index                Non-Clustered Index              │
│  ───────────────                ────────────────────             │
│  • One per table                • Many per table (999)           │
│  • Data stored in index         • Points to data                │
│  • Larger (contains all data)   • Smaller (key + pointer)       │
│  • Best for range queries       • Best for selective queries    │
│  • Primary key default          • Foreign keys, lookups         │
│                                                                  │
│  Clustered Structure:           Non-Clustered Structure:         │
│                                                                  │
│    ┌─────────┐                    ┌─────────┐                   │
│    │  Root   │                    │  Root   │                   │
│    └────┬────┘                    └────┬────┘                   │
│         │                              │                         │
│    ┌────┴────┐                    ┌────┴────┐                   │
│    ▼         ▼                    ▼         ▼                   │
│  ┌───────┐ ┌───────┐           ┌───────┐ ┌───────┐              │
│  │ Data  │ │ Data  │           │Key+Ptr│ │Key+Ptr│              │
│  │ Rows  │ │ Rows  │           └───┬───┘ └───┬───┘              │
│  └───────┘ └───────┘               │         │                  │
│                                    ▼         ▼                  │
│                                  Actual    Actual               │
│                                  Data      Data                 │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Creating Effective Indexes

### Basic Index Creation

```sql
-- Simple index
CREATE INDEX IX_Orders_CustomerID
ON Orders(CustomerID);

-- Unique index
CREATE UNIQUE INDEX IX_Products_ProductCode
ON Products(ProductCode);

-- Filtered index (partial index)
CREATE INDEX IX_Orders_Pending
ON Orders(OrderDate, CustomerID)
WHERE Status = 'Pending';

-- Descending order
CREATE INDEX IX_Products_Price_Desc
ON Products(UnitPrice DESC);
```

### Covering Index

A covering index includes all columns needed by a query, avoiding table lookups.

```sql
-- Query to optimize
SELECT FirstName, LastName, Email
FROM Employees
WHERE LastName = 'Smith';

-- Covering index (Email is included)
CREATE INDEX IX_Employees_LastName_Covering
ON Employees(LastName)
INCLUDE (FirstName, Email);

-- Now the query uses only the index, no table lookup needed
```

### Composite Index Column Order

Column order matters! Put most selective columns first.

```sql
-- Query patterns determine column order
-- Query 1: WHERE LastName = 'Smith' AND FirstName = 'John'
-- Query 2: WHERE LastName = 'Smith'
-- Query 3: WHERE FirstName = 'John'

-- This index helps Query 1 and Query 2
CREATE INDEX IX_Name ON Employees(LastName, FirstName);

-- Query 3 cannot use this index efficiently!
-- It would need: CREATE INDEX IX_FirstName ON Employees(FirstName);
```

```
┌─────────────────────────────────────────────────────────────────┐
│              Composite Index Column Order                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Index: (LastName, FirstName, HireDate)                         │
│                                                                  │
│  Query                              Can Use Index?               │
│  ─────                              ─────────────                │
│  WHERE LastName = 'Smith'           ✓ Yes (leftmost)            │
│                                                                  │
│  WHERE LastName = 'Smith'           ✓ Yes (first two)           │
│    AND FirstName = 'John'                                        │
│                                                                  │
│  WHERE LastName = 'Smith'           ✓ Yes (all three)           │
│    AND FirstName = 'John'                                        │
│    AND HireDate > '2023-01-01'                                  │
│                                                                  │
│  WHERE FirstName = 'John'           ✗ No (skipped LastName)     │
│                                                                  │
│  WHERE HireDate > '2023-01-01'      ✗ No (skipped first two)    │
│                                                                  │
│  WHERE LastName = 'Smith'           ✓ Partial (first column)    │
│    AND HireDate > '2023-01-01'      HireDate needs scan         │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Execution Plans

### Viewing Execution Plans

```sql
-- Enable execution plan display
SET SHOWPLAN_TEXT ON;
GO
SELECT * FROM Products WHERE CategoryID = 1;
GO
SET SHOWPLAN_TEXT OFF;
GO

-- Graphical plan (in SSMS)
-- Click "Include Actual Execution Plan" button (Ctrl+M)
-- Or use:
SET STATISTICS PROFILE ON;
GO
SELECT * FROM Products WHERE CategoryID = 1;
GO
SET STATISTICS PROFILE OFF;
```

### Reading Execution Plans

```
┌─────────────────────────────────────────────────────────────────┐
│              Key Execution Plan Operators                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Good (Efficient):                                               │
│  ─────────────────                                               │
│  • Index Seek       - Direct lookup using index                 │
│  • Clustered Index Seek - Direct data access                    │
│  • Index Scan (small table) - OK for small tables               │
│                                                                  │
│  Warning (May need optimization):                                │
│  ────────────────────────────────                                │
│  • Table Scan       - Reading entire table                      │
│  • Clustered Index Scan - Reading entire table                  │
│  • Key Lookup       - Extra lookup after index seek             │
│  • Sort             - May indicate missing index                │
│  • Hash Match       - Can be expensive for large data           │
│                                                                  │
│  Cost Percentage:                                                │
│  ────────────────                                                │
│  • Higher % = More expensive operation                          │
│  • Focus optimization on high-cost operations                   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Index Usage Statistics

```sql
-- Find missing indexes
SELECT
    CONVERT(DECIMAL(18,2), migs.avg_total_user_cost * migs.avg_user_impact *
            (migs.user_seeks + migs.user_scans)) AS improvement_measure,
    'CREATE INDEX [IX_' + OBJECT_NAME(mid.object_id) + '_' +
        REPLACE(REPLACE(mid.equality_columns, ', ', '_'), '[', '') + ']' +
        ' ON ' + mid.statement +
        ' (' + ISNULL(mid.equality_columns, '') +
        CASE WHEN mid.inequality_columns IS NOT NULL
             THEN ',' + mid.inequality_columns ELSE '' END + ')' +
        ISNULL(' INCLUDE (' + mid.included_columns + ')', '') AS create_index_statement
FROM sys.dm_db_missing_index_groups mig
INNER JOIN sys.dm_db_missing_index_group_stats migs
    ON migs.group_handle = mig.index_group_handle
INNER JOIN sys.dm_db_missing_index_details mid
    ON mig.index_handle = mid.index_handle
ORDER BY improvement_measure DESC;

-- Find unused indexes
SELECT
    OBJECT_NAME(i.object_id) AS TableName,
    i.name AS IndexName,
    i.type_desc,
    ius.user_seeks,
    ius.user_scans,
    ius.user_lookups,
    ius.user_updates
FROM sys.indexes i
LEFT JOIN sys.dm_db_index_usage_stats ius
    ON i.object_id = ius.object_id AND i.index_id = ius.index_id
WHERE OBJECTPROPERTY(i.object_id, 'IsUserTable') = 1
    AND i.name IS NOT NULL
    AND (ius.user_seeks = 0 AND ius.user_scans = 0 AND ius.user_lookups = 0)
ORDER BY ius.user_updates DESC;

-- Index fragmentation
SELECT
    OBJECT_NAME(ips.object_id) AS TableName,
    i.name AS IndexName,
    ips.index_type_desc,
    ips.avg_fragmentation_in_percent,
    ips.page_count
FROM sys.dm_db_index_physical_stats(DB_ID(), NULL, NULL, NULL, 'LIMITED') ips
INNER JOIN sys.indexes i ON ips.object_id = i.object_id AND ips.index_id = i.index_id
WHERE ips.avg_fragmentation_in_percent > 10
ORDER BY ips.avg_fragmentation_in_percent DESC;
```

## Index Maintenance

### Rebuilding Indexes

```sql
-- Rebuild single index
ALTER INDEX IX_Products_CategoryID ON Products REBUILD;

-- Rebuild all indexes on table
ALTER INDEX ALL ON Products REBUILD;

-- Rebuild with options
ALTER INDEX IX_Products_CategoryID ON Products
REBUILD WITH (
    ONLINE = ON,           -- Keep table available
    FILLFACTOR = 80,       -- Leave 20% free space
    SORT_IN_TEMPDB = ON    -- Use tempdb for sorting
);

-- Reorganize (less intensive than rebuild)
ALTER INDEX IX_Products_CategoryID ON Products REORGANIZE;
```

### Maintenance Guidelines

```
┌─────────────────────────────────────────────────────────────────┐
│              Index Maintenance Guidelines                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Fragmentation Level    Action                                   │
│  ───────────────────    ──────                                   │
│  < 10%                  No action needed                         │
│  10% - 30%              REORGANIZE                               │
│  > 30%                  REBUILD                                  │
│                                                                  │
│  REORGANIZE vs REBUILD:                                          │
│  ──────────────────────                                          │
│  REORGANIZE:                                                     │
│  • Always online                                                 │
│  • Less resource intensive                                       │
│  • Only defragments leaf level                                  │
│  • Good for regular maintenance                                  │
│                                                                  │
│  REBUILD:                                                        │
│  • Can be online (Enterprise) or offline                        │
│  • More resource intensive                                       │
│  • Completely rebuilds index                                     │
│  • Updates statistics                                            │
│  • Use for high fragmentation                                    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Query Optimization

### Common Performance Issues

```sql
-- Issue 1: Functions on indexed columns prevent index use
-- BAD
SELECT * FROM Orders WHERE YEAR(OrderDate) = 2024;

-- GOOD
SELECT * FROM Orders
WHERE OrderDate >= '2024-01-01' AND OrderDate < '2025-01-01';

-- Issue 2: Implicit conversions
-- BAD (Phone is VARCHAR, but comparing with INT)
SELECT * FROM Customers WHERE Phone = 5551234;

-- GOOD
SELECT * FROM Customers WHERE Phone = '5551234';

-- Issue 3: LIKE with leading wildcard
-- BAD (cannot use index)
SELECT * FROM Products WHERE ProductName LIKE '%Phone%';

-- BETTER (can use index)
SELECT * FROM Products WHERE ProductName LIKE 'Phone%';

-- Issue 4: OR conditions
-- BAD (may cause table scan)
SELECT * FROM Orders WHERE CustomerID = 1 OR Status = 'Pending';

-- BETTER (two index seeks with UNION)
SELECT * FROM Orders WHERE CustomerID = 1
UNION
SELECT * FROM Orders WHERE Status = 'Pending' AND CustomerID <> 1;
```

### Query Hints

```sql
-- Force index use
SELECT *
FROM Products WITH (INDEX(IX_Products_CategoryID))
WHERE CategoryID = 1;

-- Force table scan (for testing)
SELECT *
FROM Products WITH (INDEX(0))
WHERE CategoryID = 1;

-- Use OPTION hints
SELECT *
FROM Products
WHERE CategoryID = 1
OPTION (RECOMPILE);  -- Force new plan

SELECT *
FROM Products p
INNER JOIN Categories c ON p.CategoryID = c.CategoryID
OPTION (HASH JOIN);  -- Force hash join
```

## Special Index Types

### Columnstore Index

Best for analytics and data warehousing.

```sql
-- Create columnstore index
CREATE COLUMNSTORE INDEX IX_Sales_Columnstore
ON SalesHistory (OrderDate, ProductID, Quantity, Revenue);

-- Clustered columnstore (entire table in columnar format)
CREATE CLUSTERED COLUMNSTORE INDEX IX_Archive_CCI
ON ArchiveTable;

-- Query benefits from columnstore
SELECT
    YEAR(OrderDate) AS Year,
    ProductID,
    SUM(Quantity) AS TotalQuantity,
    SUM(Revenue) AS TotalRevenue
FROM SalesHistory
GROUP BY YEAR(OrderDate), ProductID;
```

### Full-Text Index

For searching text content.

```sql
-- Create full-text catalog
CREATE FULLTEXT CATALOG ProductCatalog AS DEFAULT;

-- Create full-text index
CREATE FULLTEXT INDEX ON Products(ProductName, Description)
KEY INDEX PK_Products
ON ProductCatalog;

-- Full-text search queries
SELECT ProductName, Description
FROM Products
WHERE CONTAINS(Description, 'laptop OR computer');

SELECT ProductName, Description
FROM Products
WHERE FREETEXT(Description, 'portable computing device');
```

### Spatial Index

For geographic data.

```sql
-- Create spatial index
CREATE SPATIAL INDEX IX_Locations_Geo
ON Locations(GeoLocation)
USING GEOGRAPHY_GRID;

-- Query using spatial index
DECLARE @point GEOGRAPHY = GEOGRAPHY::Point(40.7128, -74.0060, 4326);

SELECT LocationName, GeoLocation.STDistance(@point) AS DistanceMeters
FROM Locations
WHERE GeoLocation.STDistance(@point) < 10000  -- Within 10km
ORDER BY GeoLocation.STDistance(@point);
```

## Best Practices Summary

```
┌─────────────────────────────────────────────────────────────────┐
│                  Indexing Best Practices                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  DO:                                                             │
│  ───                                                             │
│  • Index foreign key columns                                    │
│  • Index columns used in WHERE, JOIN, ORDER BY                  │
│  • Use covering indexes for frequently run queries              │
│  • Monitor and maintain indexes regularly                       │
│  • Consider filtered indexes for partial data                   │
│  • Test index changes on non-production first                   │
│                                                                  │
│  DON'T:                                                          │
│  ─────                                                           │
│  • Over-index (too many indexes slow writes)                    │
│  • Index small tables (table scan is fine)                      │
│  • Index columns with low selectivity (e.g., Gender)            │
│  • Ignore index maintenance                                      │
│  • Use functions on indexed columns in WHERE                    │
│  • Forget to update statistics                                   │
│                                                                  │
│  Review Regularly:                                               │
│  ────────────────                                                │
│  • Missing index DMVs                                            │
│  • Unused index DMVs                                             │
│  • Index fragmentation                                           │
│  • Query execution plans                                         │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Summary

In this chapter, you learned:

- Clustered vs Non-clustered indexes
- How to create effective indexes
- Covering indexes and INCLUDE columns
- Reading execution plans
- Index maintenance (rebuild vs reorganize)
- Query optimization techniques
- Special index types: columnstore, full-text, spatial
- Best practices for indexing

Ready to learn about transactions? Continue to [Chapter 9: Transactions](./09-transactions.md)!
