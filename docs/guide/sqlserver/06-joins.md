# JOINs in SQL Server

JOINs combine rows from two or more tables based on related columns. This chapter covers all JOIN types with practical examples.

## Understanding Relationships

```
┌─────────────────────────────────────────────────────────────────┐
│                    Table Relationships                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  One-to-One (1:1)              One-to-Many (1:N)                │
│  ────────────────              ─────────────────                 │
│  ┌────────┐   ┌────────┐       ┌────────┐   ┌────────┐         │
│  │ User   │───│Profile │       │Customer│───│ Orders │         │
│  └────────┘   └────────┘       └────────┘   └────────┘         │
│  One user has                  One customer has                 │
│  one profile                   many orders                      │
│                                                                  │
│  Many-to-Many (N:M)                                              │
│  ──────────────────                                              │
│  ┌────────┐   ┌──────────┐   ┌────────┐                        │
│  │Students│───│Enrollment│───│ Courses│                        │
│  └────────┘   └──────────┘   └────────┘                        │
│  Students can enroll in many courses                            │
│  Courses can have many students                                 │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Sample Data Setup

```sql
-- Use the SalesDB from previous chapter
USE SalesDB;
GO

-- Verify sample data exists
SELECT 'Products' AS TableName, COUNT(*) AS Records FROM Products
UNION ALL
SELECT 'Categories', COUNT(*) FROM Categories
UNION ALL
SELECT 'Customers', COUNT(*) FROM Customers
UNION ALL
SELECT 'Orders', COUNT(*) FROM Orders
UNION ALL
SELECT 'OrderDetails', COUNT(*) FROM OrderDetails;
```

## JOIN Types Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    JOIN Types Comparison                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  INNER JOIN          LEFT JOIN           RIGHT JOIN             │
│  ──────────          ─────────           ──────────             │
│    ┌───┐               ┌───┐               ┌───┐                │
│   ┌┴───┴┐             ┌┴───┴┐             ┌┴───┴┐               │
│  │ A│████│B │         │█████│███│B │     │ A│███│█████│         │
│  │  │████│  │         │█████│███│  │     │  │███│█████│         │
│   └┬───┬┘             └┬───┬┘             └┬───┬┘               │
│    └───┘               └───┘               └───┘                │
│  Only matching       All from A +         All from B +          │
│  rows                matching B           matching A            │
│                                                                  │
│  FULL OUTER JOIN     CROSS JOIN                                  │
│  ───────────────     ──────────                                  │
│    ┌───┐             A × B = Cartesian product                  │
│   ┌┴───┴┐            Every row in A                             │
│  │█████│█████│        paired with every                         │
│  │█████│█████│        row in B                                   │
│   └┬───┬┘                                                        │
│    └───┘                                                         │
│  All rows from                                                   │
│  both tables                                                     │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## INNER JOIN

Returns only rows that have matching values in both tables.

```sql
-- Basic INNER JOIN
SELECT
    p.ProductName,
    c.CategoryName,
    p.UnitPrice
FROM Products p
INNER JOIN Categories c ON p.CategoryID = c.CategoryID;

-- INNER JOIN with multiple conditions
SELECT
    o.OrderID,
    c.CompanyName,
    o.OrderDate,
    o.Status
FROM Orders o
INNER JOIN Customers c ON o.CustomerID = c.CustomerID
WHERE o.Status = 'Pending';

-- Multiple INNER JOINs
SELECT
    o.OrderID,
    c.CompanyName,
    p.ProductName,
    od.Quantity,
    od.UnitPrice,
    od.Quantity * od.UnitPrice * (1 - od.Discount) AS LineTotal
FROM Orders o
INNER JOIN Customers c ON o.CustomerID = c.CustomerID
INNER JOIN OrderDetails od ON o.OrderID = od.OrderID
INNER JOIN Products p ON od.ProductID = p.ProductID
ORDER BY o.OrderID;
```

### INNER JOIN Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    INNER JOIN Example                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Products                      Categories                        │
│  ────────────────────          ────────────────────              │
│  ID│Name     │CatID            ID│Name                           │
│  ──┼─────────┼─────            ──┼────────────                   │
│  1 │Laptop   │ 1    ──────────►1 │Electronics                   │
│  2 │Phone    │ 1    ──────────►1 │Electronics                   │
│  3 │T-Shirt  │ 2    ──────────►2 │Clothing                      │
│  4 │Unknown  │NULL   ✗ Not      3 │Books (no products)          │
│                     included                                     │
│                                                                  │
│  Result (only matching rows):                                    │
│  ────────────────────────────                                    │
│  ProductName │ CategoryName                                      │
│  ────────────┼─────────────                                      │
│  Laptop      │ Electronics                                       │
│  Phone       │ Electronics                                       │
│  T-Shirt     │ Clothing                                          │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## LEFT JOIN (LEFT OUTER JOIN)

Returns all rows from the left table, with matching rows from the right table (NULL if no match).

```sql
-- LEFT JOIN: All products, with category if available
SELECT
    p.ProductName,
    c.CategoryName,
    p.UnitPrice
FROM Products p
LEFT JOIN Categories c ON p.CategoryID = c.CategoryID;

-- Find products without a category
SELECT
    p.ProductName,
    p.CategoryID
FROM Products p
LEFT JOIN Categories c ON p.CategoryID = c.CategoryID
WHERE c.CategoryID IS NULL;

-- LEFT JOIN with aggregation
SELECT
    c.CategoryName,
    COUNT(p.ProductID) AS ProductCount,
    ISNULL(SUM(p.UnitsInStock), 0) AS TotalStock
FROM Categories c
LEFT JOIN Products p ON c.CategoryID = p.CategoryID
GROUP BY c.CategoryName
ORDER BY ProductCount DESC;
```

### Finding Orphan Records

```sql
-- Customers who never placed an order
SELECT
    c.CustomerID,
    c.CompanyName,
    c.ContactName
FROM Customers c
LEFT JOIN Orders o ON c.CustomerID = o.CustomerID
WHERE o.OrderID IS NULL;

-- Products never ordered
SELECT
    p.ProductID,
    p.ProductName,
    p.UnitPrice
FROM Products p
LEFT JOIN OrderDetails od ON p.ProductID = od.ProductID
WHERE od.OrderDetailID IS NULL;
```

## RIGHT JOIN (RIGHT OUTER JOIN)

Returns all rows from the right table, with matching rows from the left table.

```sql
-- RIGHT JOIN: All categories, with products if available
SELECT
    p.ProductName,
    c.CategoryName
FROM Products p
RIGHT JOIN Categories c ON p.CategoryID = c.CategoryID;

-- Equivalent to LEFT JOIN with tables swapped
SELECT
    p.ProductName,
    c.CategoryName
FROM Categories c
LEFT JOIN Products p ON c.CategoryID = p.CategoryID;
```

::: tip LEFT JOIN is More Common
Most developers prefer LEFT JOIN over RIGHT JOIN for readability. You can always rewrite a RIGHT JOIN as a LEFT JOIN by swapping the table order.
:::

## FULL OUTER JOIN

Returns all rows from both tables, with NULL where there's no match.

```sql
-- FULL OUTER JOIN: All products and all categories
SELECT
    p.ProductName,
    c.CategoryName
FROM Products p
FULL OUTER JOIN Categories c ON p.CategoryID = c.CategoryID;

-- Find unmatched rows from either side
SELECT
    p.ProductName,
    c.CategoryName,
    CASE
        WHEN p.ProductID IS NULL THEN 'Category has no products'
        WHEN c.CategoryID IS NULL THEN 'Product has no category'
        ELSE 'Matched'
    END AS MatchStatus
FROM Products p
FULL OUTER JOIN Categories c ON p.CategoryID = c.CategoryID
WHERE p.ProductID IS NULL OR c.CategoryID IS NULL;
```

## CROSS JOIN

Returns the Cartesian product of both tables (every row paired with every other row).

```sql
-- CROSS JOIN: All combinations
SELECT
    p.ProductName,
    c.CategoryName
FROM Products p
CROSS JOIN Categories c;

-- Practical use: Generate date ranges
WITH DateRange AS (
    SELECT CAST('2024-01-01' AS DATE) AS Date
    UNION ALL
    SELECT DATEADD(DAY, 1, Date)
    FROM DateRange
    WHERE Date < '2024-01-07'
)
SELECT
    d.Date,
    p.ProductName
FROM DateRange d
CROSS JOIN Products p
WHERE p.ProductID <= 3;

-- Generate size/color combinations
CREATE TABLE Sizes (Size NVARCHAR(10));
CREATE TABLE Colors (Color NVARCHAR(20));

INSERT INTO Sizes VALUES ('Small'), ('Medium'), ('Large');
INSERT INTO Colors VALUES ('Red'), ('Blue'), ('Green');

SELECT
    s.Size,
    c.Color,
    s.Size + '-' + c.Color AS SKU
FROM Sizes s
CROSS JOIN Colors c
ORDER BY s.Size, c.Color;
```

## Self JOIN

A table joined to itself, useful for hierarchical or comparative data.

```sql
-- Employee hierarchy (from previous chapter)
SELECT
    e.EmployeeName AS Employee,
    m.EmployeeName AS Manager
FROM EmployeeHierarchy e
LEFT JOIN EmployeeHierarchy m ON e.ManagerID = m.EmployeeID;

-- Find employees at the same level
SELECT
    e1.EmployeeName AS Employee1,
    e2.EmployeeName AS Employee2,
    m.EmployeeName AS SharedManager
FROM EmployeeHierarchy e1
INNER JOIN EmployeeHierarchy e2
    ON e1.ManagerID = e2.ManagerID
    AND e1.EmployeeID < e2.EmployeeID  -- Avoid duplicates
LEFT JOIN EmployeeHierarchy m ON e1.ManagerID = m.EmployeeID;

-- Compare products in same category
SELECT
    p1.ProductName AS Product1,
    p2.ProductName AS Product2,
    p1.UnitPrice AS Price1,
    p2.UnitPrice AS Price2,
    ABS(p1.UnitPrice - p2.UnitPrice) AS PriceDifference
FROM Products p1
INNER JOIN Products p2
    ON p1.CategoryID = p2.CategoryID
    AND p1.ProductID < p2.ProductID
ORDER BY PriceDifference DESC;
```

## Multiple Table JOINs

```sql
-- Join 5 tables for complete order information
SELECT
    o.OrderID,
    c.CompanyName AS Customer,
    c.Country,
    p.ProductName,
    cat.CategoryName AS Category,
    od.Quantity,
    od.UnitPrice,
    od.Discount,
    od.Quantity * od.UnitPrice * (1 - od.Discount) AS LineTotal,
    o.OrderDate,
    o.Status
FROM Orders o
INNER JOIN Customers c ON o.CustomerID = c.CustomerID
INNER JOIN OrderDetails od ON o.OrderID = od.OrderID
INNER JOIN Products p ON od.ProductID = p.ProductID
INNER JOIN Categories cat ON p.CategoryID = cat.CategoryID
ORDER BY o.OrderID, p.ProductName;

-- Order summary with totals
SELECT
    o.OrderID,
    c.CompanyName,
    o.OrderDate,
    COUNT(od.OrderDetailID) AS LineItems,
    SUM(od.Quantity) AS TotalQuantity,
    SUM(od.Quantity * od.UnitPrice * (1 - od.Discount)) AS OrderTotal
FROM Orders o
INNER JOIN Customers c ON o.CustomerID = c.CustomerID
INNER JOIN OrderDetails od ON o.OrderID = od.OrderID
GROUP BY o.OrderID, c.CompanyName, o.OrderDate
ORDER BY OrderTotal DESC;
```

## JOIN with Subqueries

```sql
-- JOIN with derived table
SELECT
    c.CompanyName,
    o.TotalOrders,
    o.TotalSpent
FROM Customers c
INNER JOIN (
    SELECT
        CustomerID,
        COUNT(*) AS TotalOrders,
        SUM(OrderTotal) AS TotalSpent
    FROM Orders o
    INNER JOIN (
        SELECT OrderID, SUM(Quantity * UnitPrice) AS OrderTotal
        FROM OrderDetails
        GROUP BY OrderID
    ) od ON o.OrderID = od.OrderID
    GROUP BY CustomerID
) o ON c.CustomerID = o.CustomerID
ORDER BY TotalSpent DESC;

-- Same with CTE (more readable)
WITH OrderTotals AS (
    SELECT OrderID, SUM(Quantity * UnitPrice) AS OrderTotal
    FROM OrderDetails
    GROUP BY OrderID
),
CustomerStats AS (
    SELECT
        o.CustomerID,
        COUNT(*) AS TotalOrders,
        SUM(ot.OrderTotal) AS TotalSpent
    FROM Orders o
    INNER JOIN OrderTotals ot ON o.OrderID = ot.OrderID
    GROUP BY o.CustomerID
)
SELECT
    c.CompanyName,
    cs.TotalOrders,
    cs.TotalSpent
FROM Customers c
INNER JOIN CustomerStats cs ON c.CustomerID = cs.CustomerID
ORDER BY TotalSpent DESC;
```

## APPLY Operators

### CROSS APPLY

Like INNER JOIN but works with table-valued functions and correlated subqueries.

```sql
-- Get top 2 products per category
SELECT
    c.CategoryName,
    p.ProductName,
    p.UnitPrice
FROM Categories c
CROSS APPLY (
    SELECT TOP 2 ProductName, UnitPrice
    FROM Products
    WHERE CategoryID = c.CategoryID
    ORDER BY UnitPrice DESC
) p;

-- Calculate running totals per order
SELECT
    o.OrderID,
    o.OrderDate,
    rt.RunningTotal
FROM Orders o
CROSS APPLY (
    SELECT SUM(Quantity * UnitPrice) AS RunningTotal
    FROM OrderDetails
    WHERE OrderID <= o.OrderID
) rt;
```

### OUTER APPLY

Like LEFT JOIN but works with table-valued functions.

```sql
-- Get top product per category (including categories with no products)
SELECT
    c.CategoryName,
    p.ProductName,
    p.UnitPrice
FROM Categories c
OUTER APPLY (
    SELECT TOP 1 ProductName, UnitPrice
    FROM Products
    WHERE CategoryID = c.CategoryID
    ORDER BY UnitPrice DESC
) p;
```

## JOIN Performance Tips

```
┌─────────────────────────────────────────────────────────────────┐
│                    JOIN Optimization Tips                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. Index your JOIN columns                                      │
│     CREATE INDEX IX_Orders_CustomerID ON Orders(CustomerID);    │
│                                                                  │
│  2. Use the smallest result set first                            │
│     Filter with WHERE before JOIN when possible                 │
│                                                                  │
│  3. Avoid functions on JOIN columns                              │
│     BAD:  ON YEAR(a.Date) = YEAR(b.Date)                        │
│     GOOD: ON a.Date >= b.StartDate AND a.Date < b.EndDate       │
│                                                                  │
│  4. Use EXISTS instead of IN for large datasets                  │
│     EXISTS stops at first match; IN checks all                  │
│                                                                  │
│  5. Avoid SELECT * - specify needed columns only                │
│                                                                  │
│  6. Check execution plans for warnings                          │
│     Look for Table Scans, Missing Index hints                   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

```sql
-- Create indexes for JOIN columns
CREATE INDEX IX_Products_CategoryID ON Products(CategoryID);
CREATE INDEX IX_Orders_CustomerID ON Orders(CustomerID);
CREATE INDEX IX_OrderDetails_OrderID ON OrderDetails(OrderID);
CREATE INDEX IX_OrderDetails_ProductID ON OrderDetails(ProductID);

-- Use query hints when needed
SELECT c.CompanyName, COUNT(o.OrderID) AS OrderCount
FROM Customers c
INNER JOIN Orders o WITH (INDEX(IX_Orders_CustomerID))
    ON c.CustomerID = o.CustomerID
GROUP BY c.CompanyName;
```

## Common JOIN Patterns

### Report Query Pattern

```sql
-- Sales report by category and customer
SELECT
    cat.CategoryName,
    c.CompanyName,
    YEAR(o.OrderDate) AS Year,
    MONTH(o.OrderDate) AS Month,
    SUM(od.Quantity) AS UnitsSold,
    SUM(od.Quantity * od.UnitPrice * (1 - od.Discount)) AS Revenue
FROM Categories cat
INNER JOIN Products p ON cat.CategoryID = p.CategoryID
INNER JOIN OrderDetails od ON p.ProductID = od.ProductID
INNER JOIN Orders o ON od.OrderID = o.OrderID
INNER JOIN Customers c ON o.CustomerID = c.CustomerID
GROUP BY cat.CategoryName, c.CompanyName, YEAR(o.OrderDate), MONTH(o.OrderDate)
ORDER BY cat.CategoryName, Year, Month, Revenue DESC;
```

### Finding Gaps Pattern

```sql
-- Find categories with no recent orders
SELECT c.CategoryName
FROM Categories c
WHERE NOT EXISTS (
    SELECT 1
    FROM Products p
    INNER JOIN OrderDetails od ON p.ProductID = od.ProductID
    INNER JOIN Orders o ON od.OrderID = o.OrderID
    WHERE p.CategoryID = c.CategoryID
    AND o.OrderDate >= DATEADD(MONTH, -3, GETDATE())
);
```

## Summary

In this chapter, you learned:

- INNER JOIN: Only matching rows
- LEFT/RIGHT JOIN: All from one side, matching from other
- FULL OUTER JOIN: All rows from both tables
- CROSS JOIN: Cartesian product
- Self JOIN: Table joined to itself
- Multiple table JOINs for complex queries
- CROSS APPLY and OUTER APPLY
- Performance optimization for JOINs

Ready to learn about stored procedures? Continue to [Chapter 7: Stored Procedures](./07-stored-procedures.md)!
