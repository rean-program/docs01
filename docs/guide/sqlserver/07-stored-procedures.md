# Stored Procedures and Functions

Stored procedures and functions are reusable T-SQL code blocks stored in the database. This chapter covers creating, executing, and managing them.

## Why Use Stored Procedures?

```
┌─────────────────────────────────────────────────────────────────┐
│                  Benefits of Stored Procedures                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Performance                    Security                         │
│  ───────────                    ────────                         │
│  • Compiled and cached          • No direct table access         │
│  • Reduced network traffic      • Parameterized (no SQL injection│
│  • Execution plan reuse         • Grant EXECUTE, not SELECT      │
│                                                                  │
│  Maintainability                Consistency                      │
│  ───────────────                ───────────                      │
│  • Centralized business logic   • Same logic for all apps        │
│  • Easy to update               • Enforced data rules            │
│  • Version control friendly     • Standardized operations        │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Creating Stored Procedures

### Basic Syntax

```sql
CREATE PROCEDURE ProcedureName
AS
BEGIN
    -- T-SQL statements
END;
GO
```

### Simple Procedure

```sql
-- Create a simple procedure
CREATE PROCEDURE GetAllProducts
AS
BEGIN
    SET NOCOUNT ON;  -- Don't return row count message

    SELECT
        ProductID,
        ProductName,
        UnitPrice,
        UnitsInStock
    FROM Products
    ORDER BY ProductName;
END;
GO

-- Execute the procedure
EXEC GetAllProducts;
-- or
EXECUTE GetAllProducts;
-- or
GetAllProducts;  -- If it's the first statement in batch
```

### Procedure with Parameters

```sql
-- Input parameters
CREATE PROCEDURE GetProductsByCategory
    @CategoryID INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        ProductID,
        ProductName,
        UnitPrice,
        UnitsInStock
    FROM Products
    WHERE CategoryID = @CategoryID
    ORDER BY ProductName;
END;
GO

-- Execute with parameter
EXEC GetProductsByCategory @CategoryID = 1;
EXEC GetProductsByCategory 1;  -- Positional parameter
```

### Parameters with Default Values

```sql
CREATE PROCEDURE SearchProducts
    @SearchTerm NVARCHAR(100) = NULL,
    @MinPrice DECIMAL(10,2) = 0,
    @MaxPrice DECIMAL(10,2) = 999999,
    @CategoryID INT = NULL
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        p.ProductID,
        p.ProductName,
        c.CategoryName,
        p.UnitPrice,
        p.UnitsInStock
    FROM Products p
    INNER JOIN Categories c ON p.CategoryID = c.CategoryID
    WHERE
        (@SearchTerm IS NULL OR p.ProductName LIKE '%' + @SearchTerm + '%')
        AND p.UnitPrice BETWEEN @MinPrice AND @MaxPrice
        AND (@CategoryID IS NULL OR p.CategoryID = @CategoryID)
    ORDER BY p.ProductName;
END;
GO

-- Execute with various parameter combinations
EXEC SearchProducts;                                    -- All products
EXEC SearchProducts @SearchTerm = 'Laptop';             -- Search by name
EXEC SearchProducts @MinPrice = 50, @MaxPrice = 100;    -- Price range
EXEC SearchProducts @CategoryID = 1, @MinPrice = 500;   -- Category + price
```

### Output Parameters

```sql
CREATE PROCEDURE GetOrderStats
    @CustomerID INT,
    @OrderCount INT OUTPUT,
    @TotalAmount DECIMAL(12,2) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        @OrderCount = COUNT(*),
        @TotalAmount = ISNULL(SUM(
            (SELECT SUM(Quantity * UnitPrice * (1 - Discount))
             FROM OrderDetails od
             WHERE od.OrderID = o.OrderID)
        ), 0)
    FROM Orders o
    WHERE o.CustomerID = @CustomerID;
END;
GO

-- Execute with output parameters
DECLARE @Count INT, @Total DECIMAL(12,2);

EXEC GetOrderStats
    @CustomerID = 1,
    @OrderCount = @Count OUTPUT,
    @TotalAmount = @Total OUTPUT;

SELECT @Count AS OrderCount, @Total AS TotalAmount;
```

### Return Values

```sql
CREATE PROCEDURE InsertProduct
    @ProductName NVARCHAR(100),
    @CategoryID INT,
    @UnitPrice DECIMAL(10,2),
    @UnitsInStock INT = 0
AS
BEGIN
    SET NOCOUNT ON;

    -- Validate category exists
    IF NOT EXISTS (SELECT 1 FROM Categories WHERE CategoryID = @CategoryID)
    BEGIN
        RETURN -1;  -- Error: Category not found
    END

    -- Check for duplicate name
    IF EXISTS (SELECT 1 FROM Products WHERE ProductName = @ProductName)
    BEGIN
        RETURN -2;  -- Error: Duplicate name
    END

    -- Insert the product
    INSERT INTO Products (ProductName, CategoryID, UnitPrice, UnitsInStock)
    VALUES (@ProductName, @CategoryID, @UnitPrice, @UnitsInStock);

    RETURN SCOPE_IDENTITY();  -- Return new ProductID
END;
GO

-- Execute and check return value
DECLARE @Result INT;

EXEC @Result = InsertProduct
    @ProductName = 'New Product',
    @CategoryID = 1,
    @UnitPrice = 99.99;

SELECT
    CASE
        WHEN @Result = -1 THEN 'Error: Category not found'
        WHEN @Result = -2 THEN 'Error: Duplicate product name'
        ELSE 'Success: ProductID = ' + CAST(@Result AS VARCHAR)
    END AS Result;
```

## Error Handling with TRY...CATCH

```sql
CREATE PROCEDURE CreateOrder
    @CustomerID INT,
    @ProductID INT,
    @Quantity INT,
    @OrderID INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;  -- Rollback on error

    BEGIN TRY
        BEGIN TRANSACTION;

        -- Validate customer
        IF NOT EXISTS (SELECT 1 FROM Customers WHERE CustomerID = @CustomerID)
        BEGIN
            RAISERROR('Customer not found', 16, 1);
        END

        -- Get product details
        DECLARE @UnitPrice DECIMAL(10,2), @Stock INT;

        SELECT @UnitPrice = UnitPrice, @Stock = UnitsInStock
        FROM Products
        WHERE ProductID = @ProductID;

        IF @UnitPrice IS NULL
        BEGIN
            RAISERROR('Product not found', 16, 1);
        END

        IF @Stock < @Quantity
        BEGIN
            RAISERROR('Insufficient stock', 16, 1);
        END

        -- Create order
        INSERT INTO Orders (CustomerID, OrderDate, Status)
        VALUES (@CustomerID, GETDATE(), 'Pending');

        SET @OrderID = SCOPE_IDENTITY();

        -- Create order detail
        INSERT INTO OrderDetails (OrderID, ProductID, Quantity, UnitPrice)
        VALUES (@OrderID, @ProductID, @Quantity, @UnitPrice);

        -- Update stock
        UPDATE Products
        SET UnitsInStock = UnitsInStock - @Quantity
        WHERE ProductID = @ProductID;

        COMMIT TRANSACTION;

    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;

        -- Re-throw the error
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        DECLARE @ErrorSeverity INT = ERROR_SEVERITY();
        DECLARE @ErrorState INT = ERROR_STATE();

        RAISERROR(@ErrorMessage, @ErrorSeverity, @ErrorState);
    END CATCH
END;
GO

-- Execute
DECLARE @NewOrderID INT;

BEGIN TRY
    EXEC CreateOrder
        @CustomerID = 1,
        @ProductID = 1,
        @Quantity = 2,
        @OrderID = @NewOrderID OUTPUT;

    SELECT 'Order created: ' + CAST(@NewOrderID AS VARCHAR) AS Result;
END TRY
BEGIN CATCH
    SELECT ERROR_MESSAGE() AS Error;
END CATCH;
```

## Modifying Procedures

```sql
-- Alter existing procedure
ALTER PROCEDURE GetAllProducts
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        p.ProductID,
        p.ProductName,
        c.CategoryName,  -- Added category
        p.UnitPrice,
        p.UnitsInStock
    FROM Products p
    LEFT JOIN Categories c ON p.CategoryID = c.CategoryID
    ORDER BY p.ProductName;
END;
GO

-- Drop and recreate
DROP PROCEDURE IF EXISTS GetAllProducts;
GO

CREATE PROCEDURE GetAllProducts
-- ... new definition
```

## User-Defined Functions

### Scalar Functions

Return a single value.

```sql
-- Create scalar function
CREATE FUNCTION CalculateOrderTotal
(
    @OrderID INT
)
RETURNS DECIMAL(12,2)
AS
BEGIN
    DECLARE @Total DECIMAL(12,2);

    SELECT @Total = SUM(Quantity * UnitPrice * (1 - Discount))
    FROM OrderDetails
    WHERE OrderID = @OrderID;

    RETURN ISNULL(@Total, 0);
END;
GO

-- Use scalar function
SELECT
    OrderID,
    OrderDate,
    dbo.CalculateOrderTotal(OrderID) AS OrderTotal
FROM Orders;

-- In WHERE clause
SELECT *
FROM Orders
WHERE dbo.CalculateOrderTotal(OrderID) > 1000;
```

### Inline Table-Valued Functions

Return a table, single SELECT statement.

```sql
-- Create inline TVF
CREATE FUNCTION GetProductsByPriceRange
(
    @MinPrice DECIMAL(10,2),
    @MaxPrice DECIMAL(10,2)
)
RETURNS TABLE
AS
RETURN
(
    SELECT
        p.ProductID,
        p.ProductName,
        c.CategoryName,
        p.UnitPrice,
        p.UnitsInStock
    FROM Products p
    INNER JOIN Categories c ON p.CategoryID = c.CategoryID
    WHERE p.UnitPrice BETWEEN @MinPrice AND @MaxPrice
);
GO

-- Use inline TVF
SELECT * FROM GetProductsByPriceRange(50, 200);

-- Join with TVF
SELECT
    c.CompanyName,
    p.*
FROM Customers c
CROSS APPLY GetProductsByPriceRange(100, 500) p
WHERE c.Country = 'USA';
```

### Multi-Statement Table-Valued Functions

Return a table, multiple statements.

```sql
-- Create multi-statement TVF
CREATE FUNCTION GetCustomerOrderSummary
(
    @CustomerID INT
)
RETURNS @Summary TABLE
(
    OrderID INT,
    OrderDate DATE,
    ItemCount INT,
    OrderTotal DECIMAL(12,2),
    Status NVARCHAR(20)
)
AS
BEGIN
    INSERT INTO @Summary
    SELECT
        o.OrderID,
        o.OrderDate,
        COUNT(od.OrderDetailID) AS ItemCount,
        SUM(od.Quantity * od.UnitPrice * (1 - od.Discount)) AS OrderTotal,
        o.Status
    FROM Orders o
    INNER JOIN OrderDetails od ON o.OrderID = od.OrderID
    WHERE o.CustomerID = @CustomerID
    GROUP BY o.OrderID, o.OrderDate, o.Status;

    RETURN;
END;
GO

-- Use multi-statement TVF
SELECT * FROM GetCustomerOrderSummary(1);
```

### Function Comparison

```
┌─────────────────────────────────────────────────────────────────┐
│                    Function Types Comparison                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Type              Returns        Performance    Use Case        │
│  ────              ───────        ───────────    ────────        │
│  Scalar            Single value   Can be slow    Calculations    │
│                                   per row                        │
│                                                                  │
│  Inline TVF        Table          Best (inlined) Parameterized   │
│                                   into query     views           │
│                                                                  │
│  Multi-statement   Table          Slower (temp   Complex logic   │
│  TVF                              table)         multiple steps  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

::: tip Prefer Inline TVFs
Inline table-valued functions perform better because SQL Server can inline them into the query plan. Use multi-statement TVFs only when you need complex logic with multiple statements.
:::

## Dynamic SQL

### Using EXEC

```sql
CREATE PROCEDURE SearchProductsDynamic
    @TableName NVARCHAR(100),
    @SearchColumn NVARCHAR(100),
    @SearchValue NVARCHAR(100)
AS
BEGIN
    DECLARE @SQL NVARCHAR(MAX);

    -- Build dynamic SQL (be careful with SQL injection!)
    SET @SQL = N'SELECT * FROM ' + QUOTENAME(@TableName) +
               N' WHERE ' + QUOTENAME(@SearchColumn) + N' LIKE @Value';

    EXEC sp_executesql @SQL, N'@Value NVARCHAR(100)', @Value = '%' + @SearchValue + '%';
END;
GO
```

### Using sp_executesql (Recommended)

```sql
CREATE PROCEDURE GetPagedProducts
    @PageNumber INT = 1,
    @PageSize INT = 10,
    @SortColumn NVARCHAR(50) = 'ProductName',
    @SortDirection NVARCHAR(4) = 'ASC'
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @SQL NVARCHAR(MAX);
    DECLARE @Offset INT = (@PageNumber - 1) * @PageSize;

    -- Validate sort column (prevent SQL injection)
    IF @SortColumn NOT IN ('ProductName', 'UnitPrice', 'UnitsInStock', 'CategoryID')
        SET @SortColumn = 'ProductName';

    IF @SortDirection NOT IN ('ASC', 'DESC')
        SET @SortDirection = 'ASC';

    SET @SQL = N'
        SELECT
            ProductID,
            ProductName,
            UnitPrice,
            UnitsInStock
        FROM Products
        ORDER BY ' + QUOTENAME(@SortColumn) + ' ' + @SortDirection + '
        OFFSET @Offset ROWS
        FETCH NEXT @PageSize ROWS ONLY;

        SELECT COUNT(*) AS TotalCount FROM Products;';

    EXEC sp_executesql @SQL,
        N'@Offset INT, @PageSize INT',
        @Offset = @Offset,
        @PageSize = @PageSize;
END;
GO

-- Execute
EXEC GetPagedProducts @PageNumber = 2, @PageSize = 5, @SortColumn = 'UnitPrice', @SortDirection = 'DESC';
```

## Temporary Tables in Procedures

```sql
CREATE PROCEDURE GenerateSalesReport
    @StartDate DATE,
    @EndDate DATE
AS
BEGIN
    SET NOCOUNT ON;

    -- Create temp table
    CREATE TABLE #SalesData (
        CategoryName NVARCHAR(50),
        ProductName NVARCHAR(100),
        TotalQuantity INT,
        TotalRevenue DECIMAL(12,2)
    );

    -- Populate temp table
    INSERT INTO #SalesData
    SELECT
        c.CategoryName,
        p.ProductName,
        SUM(od.Quantity) AS TotalQuantity,
        SUM(od.Quantity * od.UnitPrice * (1 - od.Discount)) AS TotalRevenue
    FROM OrderDetails od
    INNER JOIN Products p ON od.ProductID = p.ProductID
    INNER JOIN Categories c ON p.CategoryID = c.CategoryID
    INNER JOIN Orders o ON od.OrderID = o.OrderID
    WHERE o.OrderDate BETWEEN @StartDate AND @EndDate
    GROUP BY c.CategoryName, p.ProductName;

    -- Return results
    SELECT * FROM #SalesData ORDER BY CategoryName, TotalRevenue DESC;

    -- Return summary
    SELECT
        CategoryName,
        SUM(TotalQuantity) AS CategoryQuantity,
        SUM(TotalRevenue) AS CategoryRevenue
    FROM #SalesData
    GROUP BY CategoryName
    ORDER BY CategoryRevenue DESC;

    -- Cleanup (optional, happens automatically)
    DROP TABLE #SalesData;
END;
GO
```

## Cursors

Use cursors sparingly - set-based operations are usually faster.

```sql
CREATE PROCEDURE ProcessOrders
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @OrderID INT;
    DECLARE @CustomerID INT;
    DECLARE @Total DECIMAL(12,2);

    -- Declare cursor
    DECLARE order_cursor CURSOR FOR
        SELECT OrderID, CustomerID
        FROM Orders
        WHERE Status = 'Pending';

    OPEN order_cursor;

    FETCH NEXT FROM order_cursor INTO @OrderID, @CustomerID;

    WHILE @@FETCH_STATUS = 0
    BEGIN
        -- Calculate order total
        SELECT @Total = SUM(Quantity * UnitPrice * (1 - Discount))
        FROM OrderDetails
        WHERE OrderID = @OrderID;

        -- Process the order (example: send notification)
        PRINT 'Processing Order ' + CAST(@OrderID AS VARCHAR) +
              ' for Customer ' + CAST(@CustomerID AS VARCHAR) +
              ' Total: $' + CAST(@Total AS VARCHAR);

        -- Move to next row
        FETCH NEXT FROM order_cursor INTO @OrderID, @CustomerID;
    END

    CLOSE order_cursor;
    DEALLOCATE order_cursor;
END;
GO
```

::: warning Avoid Cursors When Possible
Cursors process rows one at a time, which is slow. Most cursor operations can be rewritten as set-based operations or using WHILE loops with temporary tables.
:::

## System Stored Procedures

```sql
-- View procedure definition
EXEC sp_helptext 'GetAllProducts';

-- View procedure parameters
EXEC sp_help 'GetAllProducts';

-- List all procedures in database
SELECT name, create_date, modify_date
FROM sys.procedures
ORDER BY modify_date DESC;

-- View procedure dependencies
EXEC sp_depends 'GetAllProducts';

-- View database properties
EXEC sp_helpdb 'SalesDB';

-- View table structure
EXEC sp_columns 'Products';

-- View indexes on table
EXEC sp_helpindex 'Products';
```

## Best Practices

```
┌─────────────────────────────────────────────────────────────────┐
│                  Stored Procedure Best Practices                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Naming Conventions                                              │
│  ──────────────────                                              │
│  • Use prefix: usp_ (user stored procedure)                     │
│  • Be descriptive: usp_GetCustomerOrders                        │
│  • Avoid sp_ prefix (reserved for system)                       │
│                                                                  │
│  Performance                                                     │
│  ───────────                                                     │
│  • Always use SET NOCOUNT ON                                    │
│  • Avoid SELECT * - specify columns                             │
│  • Use parameters instead of literals                           │
│  • Consider WITH RECOMPILE for varying data                     │
│                                                                  │
│  Security                                                        │
│  ────────                                                        │
│  • Use parameterized queries (avoid SQL injection)              │
│  • Validate input parameters                                    │
│  • Use QUOTENAME() for dynamic object names                     │
│  • Grant EXECUTE, not direct table access                       │
│                                                                  │
│  Error Handling                                                  │
│  ──────────────                                                  │
│  • Always use TRY...CATCH                                       │
│  • Log errors to a table                                        │
│  • Use transactions for data modifications                      │
│  • Set appropriate XACT_ABORT setting                           │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Summary

In this chapter, you learned:

- Creating stored procedures with parameters
- Using OUTPUT parameters and RETURN values
- Error handling with TRY...CATCH
- Scalar functions vs Table-valued functions
- Dynamic SQL with sp_executesql
- Working with temporary tables
- Cursor usage (and when to avoid them)
- System stored procedures
- Best practices for naming and security

Ready to optimize your queries? Continue to [Chapter 8: Indexes](./08-indexes.md)!
