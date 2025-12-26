# SQL Server Tutorial

Welcome to the comprehensive SQL Server tutorial! This guide will take you from complete beginner to confident SQL Server user, covering everything from installation to advanced database concepts using T-SQL.

::: tip What is SQL Server?
SQL Server is a **relational database management system (RDBMS)** developed by Microsoft. It stores, retrieves, and manages data using structured query language (SQL). Think of it as a powerful, organized filing system for your application's data that can handle millions of records while keeping everything secure and fast.
:::

## What You'll Learn

```
┌─────────────────────────────────────────────────────────────────┐
│                    SQL Server Learning Path                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Beginner          Intermediate           Advanced               │
│  ────────          ────────────           ────────               │
│  ┌─────────┐       ┌─────────────┐       ┌──────────────┐       │
│  │ Setup & │  ───► │ Queries &   │  ───► │ Performance  │       │
│  │ Basics  │       │ Joins       │       │ & Security   │       │
│  └─────────┘       └─────────────┘       └──────────────┘       │
│                                                                  │
│  • Installation    • Complex Queries     • Indexes              │
│  • T-SQL Basics    • JOINs               • Transactions         │
│  • Data Types      • Stored Procedures   • User Management      │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Tutorial Chapters

| Chapter | Topic | Description |
|---------|-------|-------------|
| 01 | [Introduction](./01-introduction.md) | What is SQL Server and why use it |
| 02 | [Installation](./02-installation.md) | Installing SQL Server on Windows, Docker, and Azure |
| 03 | [T-SQL Basics](./03-basics.md) | Creating databases, tables, and basic CRUD operations |
| 04 | [Data Types](./04-data-types.md) | Understanding SQL Server data types |
| 05 | [Queries](./05-queries.md) | SELECT statements, filtering, and aggregations |
| 06 | [JOINs](./06-joins.md) | Combining data from multiple tables |
| 07 | [Stored Procedures](./07-stored-procedures.md) | Creating reusable T-SQL code |
| 08 | [Indexes](./08-indexes.md) | Optimizing query performance |
| 09 | [Transactions](./09-transactions.md) | ACID properties and data integrity |
| 10 | [Security](./10-security.md) | Logins, users, roles, and permissions |

## Prerequisites

Before starting this tutorial, you should have:

- Basic understanding of computers and file systems
- A computer with Windows (recommended), macOS, or Linux
- Willingness to learn and practice

::: tip No Prior Database Experience Required
This tutorial is designed for complete beginners. We explain every concept from the ground up with practical examples using T-SQL (Transact-SQL).
:::

## Why SQL Server?

SQL Server is Microsoft's enterprise-grade relational database management system. It's widely used in:

- **Fortune 500 Companies** - Enterprise data management
- **Healthcare** - HIPAA-compliant patient data systems
- **Finance** - Banking and trading platforms
- **E-commerce** - Large-scale online retail systems
- **Government** - Secure public sector applications

### SQL Server vs Other Databases

| Feature | SQL Server | PostgreSQL | MySQL |
|---------|------------|------------|-------|
| **Vendor** | Microsoft | Open Source | Oracle |
| **License** | Commercial + Express (Free) | Free | Free + Commercial |
| **Platform** | Windows, Linux, Docker | All platforms | All platforms |
| **GUI Tool** | SSMS (Excellent) | pgAdmin | MySQL Workbench |
| **Enterprise Features** | Built-in | Extensions | Limited |
| **BI Integration** | Native (SSRS, SSIS) | Third-party | Third-party |
| **Azure Integration** | Native | Available | Available |

::: info When to Choose SQL Server
- **Windows/.NET environment** - Native integration with Microsoft stack
- **Enterprise requirements** - Built-in HA, DR, and security features
- **Business Intelligence** - Native SSRS, SSIS, SSAS integration
- **Azure cloud** - Seamless Azure SQL Database migration
:::

## SQL Server Editions

| Edition | Use Case | Limitations |
|---------|----------|-------------|
| **Express** | Learning, small apps | 10GB database, 1GB RAM |
| **Developer** | Development/testing | Free, full features |
| **Standard** | Medium businesses | Limited HA features |
| **Enterprise** | Large enterprises | Full features |
| **Azure SQL** | Cloud-native | Pay-as-you-go |

::: tip Start with Developer Edition
For learning, use **SQL Server Developer Edition** - it's free and includes all Enterprise features!
:::

## Quick Start

If you want to jump right in:

```sql
-- Connect to SQL Server using SSMS or Azure Data Studio
-- Then run these commands:

-- Check your SQL Server version
SELECT @@VERSION;

-- Create your first database
CREATE DATABASE MyFirstDB;
GO

-- Use the new database
USE MyFirstDB;
GO

-- Create a simple table
CREATE TABLE Employees (
    EmployeeID INT PRIMARY KEY IDENTITY(1,1),
    FirstName NVARCHAR(50) NOT NULL,
    LastName NVARCHAR(50) NOT NULL,
    Email NVARCHAR(100),
    HireDate DATE DEFAULT GETDATE()
);
GO

-- Insert sample data
INSERT INTO Employees (FirstName, LastName, Email)
VALUES
    ('John', 'Smith', 'john.smith@company.com'),
    ('Jane', 'Doe', 'jane.doe@company.com'),
    ('Bob', 'Johnson', 'bob.johnson@company.com');

-- Query the data
SELECT * FROM Employees;
```

## What is T-SQL?

T-SQL (Transact-SQL) is Microsoft's proprietary extension of SQL. It adds:

```
┌─────────────────────────────────────────────────────────────────┐
│                    T-SQL = SQL + Extensions                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Standard SQL              T-SQL Extensions                      │
│  ────────────              ────────────────                      │
│  • SELECT                  • Variables (@variable)               │
│  • INSERT                  • Control Flow (IF, WHILE)            │
│  • UPDATE                  • Error Handling (TRY...CATCH)        │
│  • DELETE                  • Stored Procedures                   │
│  • CREATE TABLE            • Functions (Scalar, Table-valued)    │
│  • JOINs                   • Triggers                            │
│                            • Temporary Tables (#temp)            │
│                            • Common Table Expressions (CTE)      │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Tools You'll Use

### SQL Server Management Studio (SSMS)
The primary tool for SQL Server on Windows:
- Query editor with IntelliSense
- Visual database design
- Performance monitoring
- Backup and restore management

### Azure Data Studio
Cross-platform modern tool:
- Works on Windows, macOS, Linux
- Jupyter notebook support
- Extensions marketplace
- Git integration

## SQL Server Architecture

Understanding how SQL Server works under the hood helps you write better queries and design efficient databases.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        SQL Server Architecture                           │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│   ┌──────────────────────────────────────────────────────────────────┐  │
│   │                     Protocol Layer                                │  │
│   │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐   │  │
│   │  │   TDS/TCP   │  │ Named Pipes │  │    Shared Memory        │   │  │
│   │  └─────────────┘  └─────────────┘  └─────────────────────────┘   │  │
│   └──────────────────────────────────────────────────────────────────┘  │
│                                    │                                     │
│                                    ▼                                     │
│   ┌──────────────────────────────────────────────────────────────────┐  │
│   │                     Relational Engine                             │  │
│   │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐   │  │
│   │  │   Parser    │─►│  Optimizer  │─►│   Query Executor        │   │  │
│   │  └─────────────┘  └─────────────┘  └─────────────────────────┘   │  │
│   └──────────────────────────────────────────────────────────────────┘  │
│                                    │                                     │
│                                    ▼                                     │
│   ┌──────────────────────────────────────────────────────────────────┐  │
│   │                     Storage Engine                                │  │
│   │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐   │  │
│   │  │Buffer Manager│  │Transaction │  │   Access Methods        │   │  │
│   │  │  (Memory)   │  │    Log      │  │   (B-Trees, Heaps)      │   │  │
│   │  └─────────────┘  └─────────────┘  └─────────────────────────┘   │  │
│   └──────────────────────────────────────────────────────────────────┘  │
│                                    │                                     │
│                                    ▼                                     │
│   ┌──────────────────────────────────────────────────────────────────┐  │
│   │                     Database Files                                │  │
│   │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐   │  │
│   │  │  .mdf       │  │   .ndf      │  │        .ldf             │   │  │
│   │  │ Primary Data│  │Secondary Data│  │   Transaction Log       │   │  │
│   │  └─────────────┘  └─────────────┘  └─────────────────────────┘   │  │
│   └──────────────────────────────────────────────────────────────────┘  │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### Key Components Explained

| Component           | Purpose                    | Why It Matters                                   |
| ------------------- | -------------------------- | ------------------------------------------------ |
| **Protocol Layer**  | Handles client connections | Allows apps to connect via TCP/IP, named pipes   |
| **Query Parser**    | Validates SQL syntax       | Catches errors before execution                  |
| **Query Optimizer** | Creates execution plans    | Finds the fastest way to run your query          |
| **Buffer Manager**  | Caches data in memory      | Reduces disk I/O for better performance          |
| **Transaction Log** | Records all changes        | Enables recovery and ACID compliance             |

## Key Concepts You'll Master

### 1. Databases and Schemas

```sql
-- A database is a container for your data
CREATE DATABASE CompanyDB;

-- Schemas organize objects within a database
CREATE SCHEMA Sales;
CREATE SCHEMA HR;

-- Tables belong to schemas
CREATE TABLE Sales.Orders (...);
CREATE TABLE HR.Employees (...);
```

### 2. Tables and Relationships

```
┌─────────────────────┐         ┌─────────────────────┐
│     Customers       │         │       Orders        │
├─────────────────────┤         ├─────────────────────┤
│ CustomerID (PK)     │◄────────│ CustomerID (FK)     │
│ FirstName           │    1:N  │ OrderID (PK)        │
│ LastName            │         │ OrderDate           │
│ Email               │         │ TotalAmount         │
└─────────────────────┘         └─────────────────────┘
        │
        │ 1:1
        ▼
┌─────────────────────┐
│  CustomerProfiles   │
├─────────────────────┤
│ CustomerID (PK, FK) │
│ Bio                 │
│ AvatarURL           │
└─────────────────────┘
```

### 3. CRUD Operations

The four fundamental database operations:

| Operation    | SQL Command | Example                                        |
| ------------ | ----------- | ---------------------------------------------- |
| **C**reate   | `INSERT`    | `INSERT INTO Users VALUES (...)`               |
| **R**ead     | `SELECT`    | `SELECT * FROM Users WHERE id = 1`             |
| **U**pdate   | `UPDATE`    | `UPDATE Users SET name = 'John' WHERE id = 1`  |
| **D**elete   | `DELETE`    | `DELETE FROM Users WHERE id = 1`               |

### 4. Constraints for Data Integrity

```sql
CREATE TABLE Products (
    ProductID INT PRIMARY KEY IDENTITY(1,1),     -- Auto-increment
    ProductName NVARCHAR(100) NOT NULL,          -- Required field
    Price DECIMAL(10,2) CHECK (Price > 0),       -- Must be positive
    CategoryID INT FOREIGN KEY
        REFERENCES Categories(CategoryID),        -- Referential integrity
    SKU VARCHAR(20) UNIQUE,                       -- No duplicates
    CreatedAt DATETIME DEFAULT GETDATE()         -- Default value
);
```

## SQL Server Services

SQL Server includes multiple services that work together:

| Service              | Description                               | Common Use                        |
| -------------------- | ----------------------------------------- | --------------------------------- |
| **Database Engine**  | Core service for data storage and queries | All database operations           |
| **SQL Server Agent** | Job scheduling and automation             | Backups, maintenance, ETL         |
| **SSIS**             | SQL Server Integration Services           | Data import/export, ETL pipelines |
| **SSRS**             | SQL Server Reporting Services             | Business reports and dashboards   |
| **SSAS**             | SQL Server Analysis Services              | OLAP cubes, data mining           |
| **Full-Text Search** | Advanced text searching                   | Document search, fuzzy matching   |

## Real-World Use Cases

### E-Commerce Platform

```sql
-- Track customer orders with inventory management
SELECT
    c.CustomerName,
    o.OrderDate,
    p.ProductName,
    oi.Quantity,
    (oi.Quantity * oi.UnitPrice) AS LineTotal
FROM Customers c
JOIN Orders o ON c.CustomerID = o.CustomerID
JOIN OrderItems oi ON o.OrderID = oi.OrderID
JOIN Products p ON oi.ProductID = p.ProductID
WHERE o.OrderDate >= DATEADD(MONTH, -1, GETDATE())
ORDER BY o.OrderDate DESC;
```

### Healthcare System

```sql
-- Patient appointment scheduling with HIPAA compliance
SELECT
    p.PatientID,
    -- Masked SSN for security
    'XXX-XX-' + RIGHT(p.SSN, 4) AS MaskedSSN,
    a.AppointmentDate,
    d.DoctorName,
    a.Purpose
FROM Patients p
JOIN Appointments a ON p.PatientID = a.PatientID
JOIN Doctors d ON a.DoctorID = d.DoctorID
WHERE a.AppointmentDate >= CAST(GETDATE() AS DATE);
```

### Financial Reporting

```sql
-- Monthly revenue summary with year-over-year comparison
WITH MonthlySales AS (
    SELECT
        YEAR(OrderDate) AS SalesYear,
        MONTH(OrderDate) AS SalesMonth,
        SUM(TotalAmount) AS Revenue
    FROM Orders
    WHERE OrderDate >= DATEADD(YEAR, -2, GETDATE())
    GROUP BY YEAR(OrderDate), MONTH(OrderDate)
)
SELECT
    curr.SalesYear,
    curr.SalesMonth,
    curr.Revenue AS CurrentRevenue,
    prev.Revenue AS PreviousYearRevenue,
    CAST((curr.Revenue - prev.Revenue) * 100.0 / prev.Revenue AS DECIMAL(5,2)) AS GrowthPercent
FROM MonthlySales curr
LEFT JOIN MonthlySales prev
    ON curr.SalesMonth = prev.SalesMonth
    AND curr.SalesYear = prev.SalesYear + 1
ORDER BY curr.SalesYear DESC, curr.SalesMonth DESC;
```

## Common T-SQL Patterns

### Error Handling

```sql
BEGIN TRY
    BEGIN TRANSACTION;

    -- Your database operations here
    INSERT INTO Orders (CustomerID, OrderDate) VALUES (1, GETDATE());

    COMMIT TRANSACTION;
END TRY
BEGIN CATCH
    IF @@TRANCOUNT > 0
        ROLLBACK TRANSACTION;

    -- Log the error
    INSERT INTO ErrorLog (ErrorMessage, ErrorDate)
    VALUES (ERROR_MESSAGE(), GETDATE());

    -- Re-throw the error
    THROW;
END CATCH;
```

### Pagination

```sql
-- Modern pagination using OFFSET-FETCH (SQL Server 2012+)
DECLARE @PageNumber INT = 2;
DECLARE @PageSize INT = 10;

SELECT ProductID, ProductName, Price
FROM Products
ORDER BY ProductName
OFFSET (@PageNumber - 1) * @PageSize ROWS
FETCH NEXT @PageSize ROWS ONLY;
```

### Dynamic SQL

```sql
-- Build queries dynamically (use with caution!)
DECLARE @TableName NVARCHAR(128) = N'Products';
DECLARE @SQL NVARCHAR(MAX);

SET @SQL = N'SELECT COUNT(*) FROM ' + QUOTENAME(@TableName);
EXEC sp_executesql @SQL;
```

## Performance Tips

::: warning Performance Best Practices

1. **Always use indexes** on columns used in WHERE, JOIN, and ORDER BY clauses
2. **Avoid SELECT *** - only retrieve columns you need
3. **Use parameterized queries** to enable plan caching and prevent SQL injection
4. **Monitor with Query Store** - built-in performance tracking (SQL Server 2016+)
5. **Update statistics regularly** - helps the optimizer make better decisions

:::

## Learning Resources

### Official Documentation

- [Microsoft SQL Server Documentation](https://docs.microsoft.com/sql)
- [T-SQL Reference](https://docs.microsoft.com/sql/t-sql/language-reference)
- [SQL Server Blog](https://cloudblogs.microsoft.com/sqlserver/)

### Practice Platforms

- **AdventureWorks** - Microsoft's sample database
- **WideWorldImporters** - Modern sample database
- **SQLZoo** - Interactive SQL tutorials
- **HackerRank SQL** - SQL coding challenges

### Certifications

| Certification | Focus                         | Level        |
| ------------- | ----------------------------- | ------------ |
| **DP-900**    | Azure Data Fundamentals       | Beginner     |
| **DP-300**    | Azure Database Administrator  | Intermediate |
| **DP-500**    | Azure Enterprise Data Analyst | Advanced     |

## What's Next?

After completing this tutorial, you'll be able to:

- ✅ Install and configure SQL Server
- ✅ Design normalized database schemas
- ✅ Write efficient T-SQL queries
- ✅ Create stored procedures and functions
- ✅ Implement proper security measures
- ✅ Optimize database performance
- ✅ Handle transactions safely
- ✅ Troubleshoot common issues

Ready to begin? Start with [Chapter 1: Introduction](./01-introduction.md)!
