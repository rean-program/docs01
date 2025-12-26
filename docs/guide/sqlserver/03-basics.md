# T-SQL Basics

This chapter covers the fundamentals of T-SQL (Transact-SQL), Microsoft's extension of SQL used in SQL Server.

## Understanding T-SQL

T-SQL adds procedural programming capabilities to standard SQL:

```
┌─────────────────────────────────────────────────────────────────┐
│                    T-SQL = SQL + Extensions                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Standard SQL (DDL & DML)         T-SQL Extensions               │
│  ────────────────────────         ────────────────               │
│  • CREATE, ALTER, DROP            • Variables (@var)             │
│  • SELECT, INSERT                 • Control Flow (IF, WHILE)     │
│  • UPDATE, DELETE                 • TRY...CATCH                  │
│  • JOIN, WHERE, ORDER BY          • Stored Procedures            │
│                                   • User-Defined Functions       │
│                                   • Temp Tables (#temp)          │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Database Operations

### Creating a Database

```sql
-- Create a new database
CREATE DATABASE CompanyDB;
GO

-- Create with specific settings
CREATE DATABASE SalesDB
ON PRIMARY
(
    NAME = 'SalesDB_Data',
    FILENAME = 'C:\SQLData\SalesDB.mdf',
    SIZE = 100MB,
    MAXSIZE = 1GB,
    FILEGROWTH = 10MB
)
LOG ON
(
    NAME = 'SalesDB_Log',
    FILENAME = 'C:\SQLData\SalesDB.ldf',
    SIZE = 50MB,
    MAXSIZE = 500MB,
    FILEGROWTH = 5MB
);
GO
```

::: info What is GO?
`GO` is a batch separator in SQL Server. It tells the server to execute all statements before it as a batch. It's not a T-SQL statement but a command recognized by SQL Server tools.
:::

### Using a Database

```sql
-- Switch to a database
USE CompanyDB;
GO

-- Check current database
SELECT DB_NAME() AS CurrentDatabase;
```

### Modifying and Deleting Databases

```sql
-- Rename a database
ALTER DATABASE CompanyDB MODIFY NAME = NewCompanyDB;
GO

-- Delete a database (be careful!)
DROP DATABASE IF EXISTS TestDB;
GO
```

## Table Operations

### Creating Tables

```sql
USE CompanyDB;
GO

-- Create Departments table
CREATE TABLE Departments (
    DepartmentID INT PRIMARY KEY IDENTITY(1,1),
    DepartmentName NVARCHAR(100) NOT NULL,
    Location NVARCHAR(100),
    Budget DECIMAL(12,2),
    CreatedAt DATETIME2 DEFAULT SYSDATETIME()
);

-- Create Employees table with foreign key
CREATE TABLE Employees (
    EmployeeID INT PRIMARY KEY IDENTITY(1,1),
    FirstName NVARCHAR(50) NOT NULL,
    LastName NVARCHAR(50) NOT NULL,
    Email NVARCHAR(100) UNIQUE,
    Phone NVARCHAR(20),
    HireDate DATE NOT NULL,
    Salary DECIMAL(10,2),
    DepartmentID INT,
    ManagerID INT,
    IsActive BIT DEFAULT 1,
    CONSTRAINT FK_Employees_Departments
        FOREIGN KEY (DepartmentID)
        REFERENCES Departments(DepartmentID),
    CONSTRAINT FK_Employees_Manager
        FOREIGN KEY (ManagerID)
        REFERENCES Employees(EmployeeID)
);
GO
```

### Table Structure Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    Table Relationships                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────┐         ┌─────────────────────────────┐    │
│  │   Departments   │         │        Employees            │    │
│  ├─────────────────┤         ├─────────────────────────────┤    │
│  │ DepartmentID PK │◄────────│ DepartmentID FK             │    │
│  │ DepartmentName  │         │ EmployeeID PK               │    │
│  │ Location        │         │ FirstName                   │    │
│  │ Budget          │         │ LastName                    │    │
│  │ CreatedAt       │         │ Email (UNIQUE)              │    │
│  └─────────────────┘         │ Salary                      │    │
│                              │ ManagerID FK ───────────────┼──┐ │
│                              │ IsActive                    │  │ │
│                              └─────────────────────────────┘  │ │
│                                        ▲                       │ │
│                                        └───────────────────────┘ │
│                                        (Self-referencing)        │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### IDENTITY Column

The `IDENTITY` property auto-generates unique numbers:

```sql
-- IDENTITY(seed, increment)
-- IDENTITY(1,1) means: start at 1, increment by 1

CREATE TABLE Products (
    ProductID INT PRIMARY KEY IDENTITY(1,1),  -- 1, 2, 3, 4...
    ProductCode INT IDENTITY(1000,10),        -- 1000, 1010, 1020...
    ProductName NVARCHAR(100)
);

-- Get the last inserted identity value
INSERT INTO Products (ProductName) VALUES ('Laptop');
SELECT SCOPE_IDENTITY() AS NewProductID;
```

### Modifying Tables

```sql
-- Add a column
ALTER TABLE Employees
ADD DateOfBirth DATE;

-- Modify a column
ALTER TABLE Employees
ALTER COLUMN Phone NVARCHAR(30);

-- Drop a column
ALTER TABLE Employees
DROP COLUMN DateOfBirth;

-- Add a constraint
ALTER TABLE Employees
ADD CONSTRAINT CHK_Salary CHECK (Salary >= 0);

-- Drop a constraint
ALTER TABLE Employees
DROP CONSTRAINT CHK_Salary;
```

## CRUD Operations

CRUD = **C**reate, **R**ead, **U**pdate, **D**elete

### INSERT - Creating Data

```sql
-- Insert single row
INSERT INTO Departments (DepartmentName, Location, Budget)
VALUES ('Engineering', 'Building A', 500000.00);

-- Insert multiple rows
INSERT INTO Departments (DepartmentName, Location, Budget)
VALUES
    ('Marketing', 'Building B', 300000.00),
    ('Human Resources', 'Building A', 200000.00),
    ('Finance', 'Building C', 400000.00);

-- Insert with all columns (not recommended)
INSERT INTO Employees
VALUES ('John', 'Smith', 'john.smith@company.com', '555-0101',
        '2023-01-15', 75000.00, 1, NULL, 1);

-- Insert with specific columns (recommended)
INSERT INTO Employees (FirstName, LastName, Email, HireDate, DepartmentID)
VALUES ('Jane', 'Doe', 'jane.doe@company.com', '2023-03-20', 1);

-- Insert from another table
INSERT INTO ArchivedEmployees
SELECT * FROM Employees WHERE IsActive = 0;
```

### SELECT - Reading Data

```sql
-- Select all columns
SELECT * FROM Employees;

-- Select specific columns
SELECT FirstName, LastName, Email FROM Employees;

-- Select with alias
SELECT
    FirstName AS [First Name],
    LastName AS [Last Name],
    Salary AS [Annual Salary]
FROM Employees;

-- Select with calculated column
SELECT
    FirstName,
    LastName,
    Salary,
    Salary * 12 AS AnnualSalary,
    Salary / 160 AS HourlyRate
FROM Employees;

-- Select distinct values
SELECT DISTINCT DepartmentID FROM Employees;

-- Select top N rows
SELECT TOP 5 * FROM Employees ORDER BY Salary DESC;

-- Select with percentage
SELECT TOP 10 PERCENT * FROM Employees ORDER BY HireDate;
```

### UPDATE - Modifying Data

```sql
-- Update single column
UPDATE Employees
SET Salary = 80000
WHERE EmployeeID = 1;

-- Update multiple columns
UPDATE Employees
SET
    Salary = Salary * 1.10,  -- 10% raise
    Email = 'john.smith.new@company.com'
WHERE EmployeeID = 1;

-- Update with condition
UPDATE Employees
SET Salary = Salary * 1.05
WHERE DepartmentID = 1 AND HireDate < '2023-01-01';

-- Update based on another table
UPDATE e
SET e.DepartmentID = d.DepartmentID
FROM Employees e
INNER JOIN Departments d ON d.DepartmentName = 'Engineering'
WHERE e.LastName = 'Smith';
```

::: warning Always Use WHERE Clause
Without a `WHERE` clause, `UPDATE` modifies ALL rows in the table!
```sql
-- DANGEROUS: Updates every employee!
UPDATE Employees SET Salary = 0;
```
:::

### DELETE - Removing Data

```sql
-- Delete specific rows
DELETE FROM Employees
WHERE EmployeeID = 5;

-- Delete with condition
DELETE FROM Employees
WHERE DepartmentID IS NULL AND HireDate < '2020-01-01';

-- Delete all rows (keeps table structure)
DELETE FROM Employees;

-- Faster way to delete all rows (resets IDENTITY)
TRUNCATE TABLE Employees;
```

```
┌─────────────────────────────────────────────────────────────────┐
│               DELETE vs TRUNCATE vs DROP                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  DELETE FROM table              TRUNCATE TABLE table             │
│  ─────────────────              ────────────────────             │
│  • Removes specific rows        • Removes ALL rows               │
│  • WHERE clause allowed         • No WHERE clause                │
│  • Logged (slower)              • Minimally logged (faster)      │
│  • Keeps IDENTITY value         • Resets IDENTITY to seed        │
│  • Triggers fire                • Triggers don't fire            │
│  • Can rollback                 • Can rollback                   │
│                                                                  │
│  DROP TABLE table                                                │
│  ───────────────                                                 │
│  • Removes table completely                                      │
│  • Structure and data gone                                       │
│  • Cannot rollback easily                                        │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Filtering Data with WHERE

```sql
-- Comparison operators
SELECT * FROM Employees WHERE Salary > 50000;
SELECT * FROM Employees WHERE Salary >= 50000;
SELECT * FROM Employees WHERE Salary < 50000;
SELECT * FROM Employees WHERE Salary <= 50000;
SELECT * FROM Employees WHERE Salary = 50000;
SELECT * FROM Employees WHERE Salary <> 50000;  -- Not equal
SELECT * FROM Employees WHERE Salary != 50000;  -- Not equal (alternative)

-- Logical operators
SELECT * FROM Employees
WHERE DepartmentID = 1 AND Salary > 50000;

SELECT * FROM Employees
WHERE DepartmentID = 1 OR DepartmentID = 2;

SELECT * FROM Employees
WHERE NOT IsActive = 1;

-- BETWEEN (inclusive)
SELECT * FROM Employees
WHERE Salary BETWEEN 40000 AND 60000;

SELECT * FROM Employees
WHERE HireDate BETWEEN '2023-01-01' AND '2023-12-31';

-- IN (list of values)
SELECT * FROM Employees
WHERE DepartmentID IN (1, 2, 3);

SELECT * FROM Employees
WHERE LastName IN ('Smith', 'Johnson', 'Williams');

-- LIKE (pattern matching)
SELECT * FROM Employees WHERE FirstName LIKE 'J%';      -- Starts with J
SELECT * FROM Employees WHERE LastName LIKE '%son';     -- Ends with son
SELECT * FROM Employees WHERE Email LIKE '%@gmail%';    -- Contains @gmail
SELECT * FROM Employees WHERE FirstName LIKE 'J___';    -- J + exactly 3 chars
SELECT * FROM Employees WHERE Phone LIKE '[0-9][0-9][0-9]-[0-9][0-9][0-9][0-9]';

-- IS NULL / IS NOT NULL
SELECT * FROM Employees WHERE ManagerID IS NULL;
SELECT * FROM Employees WHERE Email IS NOT NULL;
```

### LIKE Pattern Wildcards

| Wildcard | Meaning | Example |
|----------|---------|---------|
| `%` | Any string of characters | `'J%'` matches 'John', 'Jane' |
| `_` | Single character | `'J_n'` matches 'Jon', 'Jan' |
| `[]` | Single char in range | `'[A-C]%'` matches 'Apple', 'Banana' |
| `[^]` | Single char NOT in range | `'[^A-C]%'` excludes A, B, C |

## Sorting with ORDER BY

```sql
-- Sort ascending (default)
SELECT * FROM Employees ORDER BY LastName;
SELECT * FROM Employees ORDER BY LastName ASC;

-- Sort descending
SELECT * FROM Employees ORDER BY Salary DESC;

-- Sort by multiple columns
SELECT * FROM Employees
ORDER BY DepartmentID ASC, Salary DESC;

-- Sort by column position
SELECT FirstName, LastName, Salary FROM Employees
ORDER BY 3 DESC;  -- Sort by 3rd column (Salary)

-- Sort with NULL handling
SELECT * FROM Employees
ORDER BY ManagerID;  -- NULLs appear first

-- Sort with CASE
SELECT * FROM Employees
ORDER BY
    CASE WHEN IsActive = 1 THEN 0 ELSE 1 END,
    LastName;
```

## Working with NULL

NULL represents missing or unknown data:

```sql
-- NULL comparisons
SELECT * FROM Employees WHERE ManagerID = NULL;      -- WRONG! Returns nothing
SELECT * FROM Employees WHERE ManagerID IS NULL;     -- CORRECT

-- ISNULL function (replace NULL with a value)
SELECT
    FirstName,
    LastName,
    ISNULL(Phone, 'No Phone') AS Phone
FROM Employees;

-- COALESCE (returns first non-NULL value)
SELECT
    FirstName,
    COALESCE(Phone, Email, 'No Contact') AS Contact
FROM Employees;

-- NULLIF (returns NULL if values are equal)
SELECT
    ProductName,
    NULLIF(Discount, 0) AS Discount  -- Returns NULL if Discount is 0
FROM Products;
```

## Practical Example: Employee Database

Let's build a complete example:

```sql
-- Create the database
CREATE DATABASE HRSystem;
GO

USE HRSystem;
GO

-- Create Departments table
CREATE TABLE Departments (
    DepartmentID INT PRIMARY KEY IDENTITY(1,1),
    DepartmentName NVARCHAR(100) NOT NULL UNIQUE,
    Location NVARCHAR(100),
    Budget DECIMAL(12,2) CHECK (Budget >= 0)
);

-- Create Employees table
CREATE TABLE Employees (
    EmployeeID INT PRIMARY KEY IDENTITY(1,1),
    EmployeeNumber AS ('EMP' + RIGHT('00000' + CAST(EmployeeID AS VARCHAR(5)), 5)) PERSISTED,
    FirstName NVARCHAR(50) NOT NULL,
    LastName NVARCHAR(50) NOT NULL,
    Email NVARCHAR(100) NOT NULL UNIQUE,
    Phone NVARCHAR(20),
    HireDate DATE NOT NULL DEFAULT GETDATE(),
    Salary DECIMAL(10,2) CHECK (Salary >= 0),
    DepartmentID INT REFERENCES Departments(DepartmentID),
    IsActive BIT DEFAULT 1
);
GO

-- Insert sample departments
INSERT INTO Departments (DepartmentName, Location, Budget)
VALUES
    ('Engineering', 'Floor 3', 1000000.00),
    ('Marketing', 'Floor 2', 500000.00),
    ('Human Resources', 'Floor 1', 300000.00),
    ('Finance', 'Floor 1', 600000.00);

-- Insert sample employees
INSERT INTO Employees (FirstName, LastName, Email, Phone, HireDate, Salary, DepartmentID)
VALUES
    ('John', 'Smith', 'john.smith@company.com', '555-0101', '2020-01-15', 85000.00, 1),
    ('Jane', 'Doe', 'jane.doe@company.com', '555-0102', '2020-03-20', 92000.00, 1),
    ('Bob', 'Johnson', 'bob.johnson@company.com', '555-0103', '2021-06-01', 65000.00, 2),
    ('Alice', 'Williams', 'alice.williams@company.com', '555-0104', '2021-09-15', 78000.00, 3),
    ('Charlie', 'Brown', 'charlie.brown@company.com', NULL, '2022-02-01', 72000.00, 4),
    ('Diana', 'Miller', 'diana.miller@company.com', '555-0106', '2022-08-10', 88000.00, 1),
    ('Edward', 'Davis', 'edward.davis@company.com', '555-0107', '2023-01-05', 55000.00, 2);

-- Query examples
-- Find all engineers earning over $80k
SELECT FirstName, LastName, Salary
FROM Employees
WHERE DepartmentID = 1 AND Salary > 80000
ORDER BY Salary DESC;

-- Find employees hired in 2022
SELECT EmployeeNumber, FirstName, LastName, HireDate
FROM Employees
WHERE YEAR(HireDate) = 2022
ORDER BY HireDate;

-- Get employee count by department
SELECT
    d.DepartmentName,
    COUNT(*) AS EmployeeCount,
    AVG(e.Salary) AS AvgSalary
FROM Employees e
INNER JOIN Departments d ON e.DepartmentID = d.DepartmentID
GROUP BY d.DepartmentName;
```

## Summary

In this chapter, you learned:

- How to create, use, and delete databases
- How to create and modify tables with constraints
- CRUD operations: INSERT, SELECT, UPDATE, DELETE
- Filtering data with WHERE and comparison operators
- Pattern matching with LIKE
- Sorting with ORDER BY
- Handling NULL values

Ready to learn about data types? Continue to [Chapter 4: Data Types](./04-data-types.md)!
