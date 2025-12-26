# Advanced Queries

This chapter covers advanced SELECT queries, aggregations, subqueries, and Common Table Expressions (CTEs).

## Sample Database Setup

Let's create a sample database for our examples:

```sql
-- Create sample database
CREATE DATABASE SalesDB;
GO
USE SalesDB;
GO

-- Categories table
CREATE TABLE Categories (
    CategoryID INT PRIMARY KEY IDENTITY,
    CategoryName NVARCHAR(50) NOT NULL,
    Description NVARCHAR(200)
);

-- Products table
CREATE TABLE Products (
    ProductID INT PRIMARY KEY IDENTITY,
    ProductName NVARCHAR(100) NOT NULL,
    CategoryID INT REFERENCES Categories(CategoryID),
    UnitPrice DECIMAL(10,2) NOT NULL,
    UnitsInStock INT DEFAULT 0,
    Discontinued BIT DEFAULT 0
);

-- Customers table
CREATE TABLE Customers (
    CustomerID INT PRIMARY KEY IDENTITY,
    CompanyName NVARCHAR(100) NOT NULL,
    ContactName NVARCHAR(50),
    City NVARCHAR(50),
    Country NVARCHAR(50)
);

-- Orders table
CREATE TABLE Orders (
    OrderID INT PRIMARY KEY IDENTITY,
    CustomerID INT REFERENCES Customers(CustomerID),
    OrderDate DATE NOT NULL DEFAULT GETDATE(),
    ShipDate DATE,
    Status NVARCHAR(20) DEFAULT 'Pending'
);

-- OrderDetails table
CREATE TABLE OrderDetails (
    OrderDetailID INT PRIMARY KEY IDENTITY,
    OrderID INT REFERENCES Orders(OrderID),
    ProductID INT REFERENCES Products(ProductID),
    Quantity INT NOT NULL,
    UnitPrice DECIMAL(10,2) NOT NULL,
    Discount DECIMAL(4,2) DEFAULT 0
);

-- Insert sample data
INSERT INTO Categories VALUES
    ('Electronics', 'Electronic devices and accessories'),
    ('Clothing', 'Apparel and fashion items'),
    ('Books', 'Physical and digital books'),
    ('Home & Garden', 'Home improvement and garden supplies');

INSERT INTO Products (ProductName, CategoryID, UnitPrice, UnitsInStock) VALUES
    ('Laptop', 1, 999.99, 50),
    ('Smartphone', 1, 699.99, 100),
    ('Headphones', 1, 149.99, 200),
    ('T-Shirt', 2, 29.99, 500),
    ('Jeans', 2, 59.99, 300),
    ('Programming Book', 3, 49.99, 150),
    ('Garden Tools Set', 4, 89.99, 75);

INSERT INTO Customers (CompanyName, ContactName, City, Country) VALUES
    ('Tech Corp', 'John Smith', 'New York', 'USA'),
    ('Fashion Hub', 'Jane Doe', 'Los Angeles', 'USA'),
    ('Book World', 'Bob Johnson', 'London', 'UK'),
    ('Home Depot', 'Alice Brown', 'Toronto', 'Canada'),
    ('Global Trade', 'Charlie Wilson', 'Sydney', 'Australia');

INSERT INTO Orders (CustomerID, OrderDate, ShipDate, Status) VALUES
    (1, '2024-01-15', '2024-01-18', 'Delivered'),
    (1, '2024-02-20', '2024-02-23', 'Delivered'),
    (2, '2024-02-25', '2024-02-28', 'Delivered'),
    (3, '2024-03-01', '2024-03-05', 'Shipped'),
    (4, '2024-03-10', NULL, 'Pending'),
    (5, '2024-03-12', NULL, 'Pending');

INSERT INTO OrderDetails (OrderID, ProductID, Quantity, UnitPrice, Discount) VALUES
    (1, 1, 2, 999.99, 0.10),
    (1, 3, 3, 149.99, 0),
    (2, 2, 1, 699.99, 0.05),
    (3, 4, 10, 29.99, 0.15),
    (3, 5, 5, 59.99, 0.15),
    (4, 6, 3, 49.99, 0),
    (5, 7, 2, 89.99, 0),
    (6, 1, 1, 999.99, 0);
GO
```

## Aggregate Functions

### Basic Aggregates

```sql
-- COUNT: Number of rows
SELECT COUNT(*) AS TotalProducts FROM Products;
SELECT COUNT(ShipDate) AS ShippedOrders FROM Orders;  -- Excludes NULL
SELECT COUNT(DISTINCT CategoryID) AS CategoryCount FROM Products;

-- SUM: Total of numeric values
SELECT SUM(UnitsInStock) AS TotalInventory FROM Products;
SELECT SUM(Quantity * UnitPrice) AS TotalRevenue FROM OrderDetails;

-- AVG: Average value
SELECT AVG(UnitPrice) AS AvgPrice FROM Products;
SELECT AVG(CAST(Quantity AS DECIMAL)) AS AvgQuantity FROM OrderDetails;

-- MIN and MAX
SELECT
    MIN(UnitPrice) AS CheapestProduct,
    MAX(UnitPrice) AS MostExpensive
FROM Products;

SELECT
    MIN(OrderDate) AS FirstOrder,
    MAX(OrderDate) AS LastOrder
FROM Orders;
```

### STRING_AGG (Concatenate Strings)

```sql
-- Combine values into a comma-separated list
SELECT STRING_AGG(ProductName, ', ') AS AllProducts
FROM Products;

-- With ordering
SELECT STRING_AGG(ProductName, ', ') WITHIN GROUP (ORDER BY ProductName)
FROM Products;

-- Per category
SELECT
    c.CategoryName,
    STRING_AGG(p.ProductName, ', ') AS Products
FROM Categories c
LEFT JOIN Products p ON c.CategoryID = p.CategoryID
GROUP BY c.CategoryName;
```

## GROUP BY Clause

```
┌─────────────────────────────────────────────────────────────────┐
│                    How GROUP BY Works                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Original Data:                     After GROUP BY Category:     │
│  ──────────────                     ─────────────────────────   │
│  Product    | Category              Category    | Count | Sum   │
│  ──────────────────────             ─────────────────────────   │
│  Laptop     | Electronics   ───►    Electronics | 3     | 1849  │
│  Phone      | Electronics            Clothing   | 2     | 89    │
│  Headphones | Electronics            Books      | 1     | 49    │
│  T-Shirt    | Clothing                                           │
│  Jeans      | Clothing                                           │
│  Book       | Books                                              │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

```sql
-- Basic GROUP BY
SELECT
    CategoryID,
    COUNT(*) AS ProductCount,
    AVG(UnitPrice) AS AvgPrice
FROM Products
GROUP BY CategoryID;

-- GROUP BY with JOIN
SELECT
    c.CategoryName,
    COUNT(p.ProductID) AS ProductCount,
    SUM(p.UnitsInStock) AS TotalStock,
    AVG(p.UnitPrice) AS AvgPrice
FROM Categories c
LEFT JOIN Products p ON c.CategoryID = p.CategoryID
GROUP BY c.CategoryName
ORDER BY ProductCount DESC;

-- Multiple columns in GROUP BY
SELECT
    Country,
    City,
    COUNT(*) AS CustomerCount
FROM Customers
GROUP BY Country, City
ORDER BY Country, City;

-- GROUP BY with expressions
SELECT
    YEAR(OrderDate) AS OrderYear,
    MONTH(OrderDate) AS OrderMonth,
    COUNT(*) AS OrderCount
FROM Orders
GROUP BY YEAR(OrderDate), MONTH(OrderDate)
ORDER BY OrderYear, OrderMonth;
```

## HAVING Clause

`HAVING` filters groups (after GROUP BY), while `WHERE` filters rows (before GROUP BY).

```sql
-- HAVING to filter groups
SELECT
    CategoryID,
    COUNT(*) AS ProductCount,
    AVG(UnitPrice) AS AvgPrice
FROM Products
GROUP BY CategoryID
HAVING COUNT(*) > 1;  -- Only categories with multiple products

-- Combine WHERE and HAVING
SELECT
    c.CategoryName,
    COUNT(p.ProductID) AS ProductCount,
    AVG(p.UnitPrice) AS AvgPrice
FROM Categories c
INNER JOIN Products p ON c.CategoryID = p.CategoryID
WHERE p.Discontinued = 0  -- Filter rows before grouping
GROUP BY c.CategoryName
HAVING AVG(p.UnitPrice) > 50  -- Filter groups after grouping
ORDER BY AvgPrice DESC;

-- Complex HAVING conditions
SELECT
    CustomerID,
    COUNT(*) AS OrderCount,
    SUM(
        (SELECT SUM(Quantity * UnitPrice * (1 - Discount))
         FROM OrderDetails od
         WHERE od.OrderID = o.OrderID)
    ) AS TotalSpent
FROM Orders o
GROUP BY CustomerID
HAVING COUNT(*) >= 2 AND
       SUM(
           (SELECT SUM(Quantity * UnitPrice * (1 - Discount))
            FROM OrderDetails od
            WHERE od.OrderID = o.OrderID)
       ) > 500;
```

## Subqueries

### Subquery Types

```
┌─────────────────────────────────────────────────────────────────┐
│                      Subquery Types                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Scalar Subquery          Returns single value                   │
│  ────────────────         ─────────────────────                  │
│  SELECT (SELECT MAX(x))   Used in SELECT, WHERE                  │
│                                                                  │
│  Table Subquery           Returns table                          │
│  ──────────────           ─────────────                          │
│  FROM (SELECT ...)        Used in FROM clause                    │
│                                                                  │
│  Correlated Subquery      References outer query                 │
│  ───────────────────      ─────────────────────                  │
│  WHERE x = (SELECT...     Runs once per outer row                │
│              WHERE t.id)                                         │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Scalar Subqueries

```sql
-- Subquery in SELECT
SELECT
    ProductName,
    UnitPrice,
    (SELECT AVG(UnitPrice) FROM Products) AS AvgPrice,
    UnitPrice - (SELECT AVG(UnitPrice) FROM Products) AS Difference
FROM Products;

-- Subquery in WHERE
SELECT ProductName, UnitPrice
FROM Products
WHERE UnitPrice > (SELECT AVG(UnitPrice) FROM Products);

-- Products priced above their category average
SELECT p.ProductName, p.UnitPrice, c.CategoryName
FROM Products p
INNER JOIN Categories c ON p.CategoryID = c.CategoryID
WHERE p.UnitPrice > (
    SELECT AVG(p2.UnitPrice)
    FROM Products p2
    WHERE p2.CategoryID = p.CategoryID
);
```

### Subqueries with IN, EXISTS, ANY, ALL

```sql
-- IN with subquery
SELECT CustomerID, CompanyName
FROM Customers
WHERE CustomerID IN (
    SELECT DISTINCT CustomerID
    FROM Orders
    WHERE OrderDate >= '2024-02-01'
);

-- NOT IN
SELECT ProductName
FROM Products
WHERE ProductID NOT IN (
    SELECT DISTINCT ProductID
    FROM OrderDetails
);

-- EXISTS (more efficient than IN for large datasets)
SELECT c.CustomerID, c.CompanyName
FROM Customers c
WHERE EXISTS (
    SELECT 1
    FROM Orders o
    WHERE o.CustomerID = c.CustomerID
    AND o.Status = 'Pending'
);

-- NOT EXISTS
SELECT p.ProductName
FROM Products p
WHERE NOT EXISTS (
    SELECT 1
    FROM OrderDetails od
    WHERE od.ProductID = p.ProductID
);

-- ANY (some/any match)
SELECT ProductName, UnitPrice
FROM Products
WHERE UnitPrice > ANY (
    SELECT UnitPrice FROM Products WHERE CategoryID = 2
);

-- ALL (all must match)
SELECT ProductName, UnitPrice
FROM Products
WHERE UnitPrice > ALL (
    SELECT UnitPrice FROM Products WHERE CategoryID = 2
);
```

### Derived Tables (Subquery in FROM)

```sql
-- Subquery as derived table
SELECT
    CategoryName,
    AvgPrice,
    ProductCount
FROM (
    SELECT
        c.CategoryName,
        AVG(p.UnitPrice) AS AvgPrice,
        COUNT(*) AS ProductCount
    FROM Categories c
    INNER JOIN Products p ON c.CategoryID = p.CategoryID
    GROUP BY c.CategoryName
) AS CategoryStats
WHERE ProductCount > 1
ORDER BY AvgPrice DESC;

-- Multiple derived tables
SELECT
    s.CategoryName,
    s.TotalRevenue,
    p.ProductCount
FROM (
    SELECT
        c.CategoryName,
        SUM(od.Quantity * od.UnitPrice) AS TotalRevenue
    FROM OrderDetails od
    INNER JOIN Products p ON od.ProductID = p.ProductID
    INNER JOIN Categories c ON p.CategoryID = c.CategoryID
    GROUP BY c.CategoryName
) AS s
INNER JOIN (
    SELECT
        c.CategoryName,
        COUNT(*) AS ProductCount
    FROM Products p
    INNER JOIN Categories c ON p.CategoryID = c.CategoryID
    GROUP BY c.CategoryName
) AS p ON s.CategoryName = p.CategoryName
ORDER BY TotalRevenue DESC;
```

## Common Table Expressions (CTE)

CTEs make complex queries more readable:

```
┌─────────────────────────────────────────────────────────────────┐
│                    CTE Advantages                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Without CTE (Hard to read):                                     │
│  ───────────────────────────                                     │
│  SELECT * FROM (SELECT * FROM (SELECT * FROM t) a) b             │
│                                                                  │
│  With CTE (Easy to read):                                        │
│  ────────────────────────                                        │
│  WITH                                                            │
│      First AS (SELECT * FROM t),                                 │
│      Second AS (SELECT * FROM First)                             │
│  SELECT * FROM Second                                            │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Basic CTE

```sql
-- Simple CTE
WITH CategoryStats AS (
    SELECT
        c.CategoryID,
        c.CategoryName,
        COUNT(p.ProductID) AS ProductCount,
        AVG(p.UnitPrice) AS AvgPrice
    FROM Categories c
    LEFT JOIN Products p ON c.CategoryID = p.CategoryID
    GROUP BY c.CategoryID, c.CategoryName
)
SELECT *
FROM CategoryStats
WHERE ProductCount > 0
ORDER BY AvgPrice DESC;

-- Multiple CTEs
WITH
OrderTotals AS (
    SELECT
        OrderID,
        SUM(Quantity * UnitPrice * (1 - Discount)) AS OrderTotal
    FROM OrderDetails
    GROUP BY OrderID
),
CustomerOrders AS (
    SELECT
        c.CustomerID,
        c.CompanyName,
        COUNT(o.OrderID) AS OrderCount,
        SUM(ot.OrderTotal) AS TotalSpent
    FROM Customers c
    INNER JOIN Orders o ON c.CustomerID = o.CustomerID
    INNER JOIN OrderTotals ot ON o.OrderID = ot.OrderID
    GROUP BY c.CustomerID, c.CompanyName
)
SELECT *
FROM CustomerOrders
ORDER BY TotalSpent DESC;
```

### Recursive CTE

Useful for hierarchical data:

```sql
-- Create employee hierarchy table
CREATE TABLE EmployeeHierarchy (
    EmployeeID INT PRIMARY KEY,
    EmployeeName NVARCHAR(50),
    ManagerID INT,
    FOREIGN KEY (ManagerID) REFERENCES EmployeeHierarchy(EmployeeID)
);

INSERT INTO EmployeeHierarchy VALUES
    (1, 'CEO', NULL),
    (2, 'VP Sales', 1),
    (3, 'VP Engineering', 1),
    (4, 'Sales Manager', 2),
    (5, 'Engineer Lead', 3),
    (6, 'Salesperson', 4),
    (7, 'Developer', 5);

-- Recursive CTE to show hierarchy
WITH EmployeeTree AS (
    -- Anchor member: Top-level employees (no manager)
    SELECT
        EmployeeID,
        EmployeeName,
        ManagerID,
        0 AS Level,
        CAST(EmployeeName AS NVARCHAR(500)) AS Path
    FROM EmployeeHierarchy
    WHERE ManagerID IS NULL

    UNION ALL

    -- Recursive member: Employees with managers
    SELECT
        e.EmployeeID,
        e.EmployeeName,
        e.ManagerID,
        et.Level + 1,
        CAST(et.Path + ' > ' + e.EmployeeName AS NVARCHAR(500))
    FROM EmployeeHierarchy e
    INNER JOIN EmployeeTree et ON e.ManagerID = et.EmployeeID
)
SELECT
    EmployeeID,
    REPLICATE('  ', Level) + EmployeeName AS EmployeeName,
    Level,
    Path
FROM EmployeeTree
ORDER BY Path;
```

Output:
```
EmployeeID  EmployeeName          Level  Path
1           CEO                   0      CEO
2             VP Sales            1      CEO > VP Sales
4               Sales Manager     2      CEO > VP Sales > Sales Manager
6                 Salesperson     3      CEO > VP Sales > Sales Manager > Salesperson
3             VP Engineering      1      CEO > VP Engineering
5               Engineer Lead     2      CEO > VP Engineering > Engineer Lead
7                 Developer       3      CEO > VP Engineering > Engineer Lead > Developer
```

## Window Functions

Window functions perform calculations across rows related to the current row:

```
┌─────────────────────────────────────────────────────────────────┐
│                    Window Functions                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Aggregate Window         Ranking              Value              │
│  ────────────────         ───────              ─────              │
│  • SUM() OVER()           • ROW_NUMBER()       • LEAD()           │
│  • AVG() OVER()           • RANK()             • LAG()            │
│  • COUNT() OVER()         • DENSE_RANK()       • FIRST_VALUE()    │
│  • MIN() OVER()           • NTILE()            • LAST_VALUE()     │
│  • MAX() OVER()                                                   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### ROW_NUMBER, RANK, DENSE_RANK

```sql
-- ROW_NUMBER: Unique sequential number
SELECT
    ProductName,
    CategoryID,
    UnitPrice,
    ROW_NUMBER() OVER (ORDER BY UnitPrice DESC) AS RowNum,
    ROW_NUMBER() OVER (PARTITION BY CategoryID ORDER BY UnitPrice DESC) AS CategoryRowNum
FROM Products;

-- RANK vs DENSE_RANK
SELECT
    ProductName,
    UnitPrice,
    RANK() OVER (ORDER BY UnitPrice DESC) AS Rank,        -- 1,2,2,4
    DENSE_RANK() OVER (ORDER BY UnitPrice DESC) AS DenseRank  -- 1,2,2,3
FROM Products;

-- NTILE: Divide into groups
SELECT
    ProductName,
    UnitPrice,
    NTILE(4) OVER (ORDER BY UnitPrice DESC) AS PriceQuartile
FROM Products;
```

### Running Totals and Moving Averages

```sql
-- Running total
SELECT
    OrderID,
    OrderDate,
    (SELECT SUM(Quantity * UnitPrice)
     FROM OrderDetails od
     WHERE od.OrderID = o.OrderID) AS OrderTotal,
    SUM(
        (SELECT SUM(Quantity * UnitPrice)
         FROM OrderDetails od
         WHERE od.OrderID = o.OrderID)
    ) OVER (ORDER BY OrderDate) AS RunningTotal
FROM Orders o
ORDER BY OrderDate;

-- Running total with ROWS clause
SELECT
    od.OrderDetailID,
    od.OrderID,
    od.Quantity * od.UnitPrice AS LineTotal,
    SUM(od.Quantity * od.UnitPrice) OVER (
        ORDER BY od.OrderDetailID
        ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
    ) AS RunningTotal
FROM OrderDetails od;

-- Moving average (3-row window)
SELECT
    ProductID,
    OrderDate,
    Quantity,
    AVG(CAST(Quantity AS DECIMAL)) OVER (
        PARTITION BY ProductID
        ORDER BY OrderDate
        ROWS BETWEEN 2 PRECEDING AND CURRENT ROW
    ) AS MovingAvg3
FROM OrderDetails od
INNER JOIN Orders o ON od.OrderID = o.OrderID;
```

### LAG and LEAD

```sql
-- Compare with previous/next row
SELECT
    o.OrderID,
    o.OrderDate,
    o.CustomerID,
    LAG(o.OrderDate) OVER (
        PARTITION BY o.CustomerID ORDER BY o.OrderDate
    ) AS PreviousOrderDate,
    LEAD(o.OrderDate) OVER (
        PARTITION BY o.CustomerID ORDER BY o.OrderDate
    ) AS NextOrderDate,
    DATEDIFF(DAY,
        LAG(o.OrderDate) OVER (PARTITION BY o.CustomerID ORDER BY o.OrderDate),
        o.OrderDate
    ) AS DaysSinceLastOrder
FROM Orders o
ORDER BY o.CustomerID, o.OrderDate;
```

## PIVOT and UNPIVOT

### PIVOT (Rows to Columns)

```sql
-- Create sample sales data
CREATE TABLE MonthlySales (
    Year INT,
    Month NVARCHAR(20),
    Revenue DECIMAL(10,2)
);

INSERT INTO MonthlySales VALUES
    (2024, 'January', 10000),
    (2024, 'February', 12000),
    (2024, 'March', 15000),
    (2023, 'January', 8000),
    (2023, 'February', 9000),
    (2023, 'March', 11000);

-- PIVOT: Convert months to columns
SELECT Year, [January], [February], [March]
FROM (
    SELECT Year, Month, Revenue
    FROM MonthlySales
) AS SourceTable
PIVOT (
    SUM(Revenue)
    FOR Month IN ([January], [February], [March])
) AS PivotTable;
```

Result:
```
Year    January   February  March
2023    8000      9000      11000
2024    10000     12000     15000
```

### UNPIVOT (Columns to Rows)

```sql
-- UNPIVOT: Convert columns back to rows
CREATE TABLE QuarterlyReport (
    Year INT,
    Q1 DECIMAL(10,2),
    Q2 DECIMAL(10,2),
    Q3 DECIMAL(10,2),
    Q4 DECIMAL(10,2)
);

INSERT INTO QuarterlyReport VALUES
    (2023, 25000, 30000, 28000, 35000),
    (2024, 32000, 38000, 40000, 45000);

SELECT Year, Quarter, Revenue
FROM QuarterlyReport
UNPIVOT (
    Revenue FOR Quarter IN (Q1, Q2, Q3, Q4)
) AS UnpivotTable;
```

## Summary

In this chapter, you learned:

- Aggregate functions: COUNT, SUM, AVG, MIN, MAX, STRING_AGG
- GROUP BY and HAVING for grouping data
- Subqueries: scalar, table, correlated
- IN, EXISTS, ANY, ALL operators
- Common Table Expressions (CTEs) including recursive CTEs
- Window functions: ROW_NUMBER, RANK, running totals
- LAG, LEAD for accessing adjacent rows
- PIVOT and UNPIVOT for reshaping data

Ready to learn about combining tables? Continue to [Chapter 6: JOINs](./06-joins.md)!
