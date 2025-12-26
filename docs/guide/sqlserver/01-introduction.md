# Introduction to SQL Server

## What is SQL Server?

SQL Server is a **relational database management system (RDBMS)** developed by Microsoft. It stores and retrieves data requested by applications, making it a critical component in enterprise software systems.

```
┌─────────────────────────────────────────────────────────────────┐
│                    How SQL Server Works                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   Application Layer                                              │
│   ─────────────────                                              │
│   ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐           │
│   │  Web    │  │ Desktop │  │  API    │  │ Mobile  │           │
│   │  App    │  │   App   │  │ Service │  │   App   │           │
│   └────┬────┘  └────┬────┘  └────┬────┘  └────┬────┘           │
│        │            │            │            │                  │
│        └────────────┴─────┬──────┴────────────┘                  │
│                           │                                      │
│                           ▼                                      │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │              SQL Server Database Engine                  │   │
│   │  ┌─────────────┐  ┌──────────────┐  ┌───────────────┐   │   │
│   │  │   Query     │  │   Storage    │  │   Security    │   │   │
│   │  │  Processor  │  │    Engine    │  │    Layer      │   │   │
│   │  └─────────────┘  └──────────────┘  └───────────────┘   │   │
│   └─────────────────────────────────────────────────────────┘   │
│                           │                                      │
│                           ▼                                      │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │                    Data Files                            │   │
│   │              (.mdf, .ndf, .ldf files)                    │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Key Concepts

### Database
A **database** is a container that holds related tables, views, stored procedures, and other objects. One SQL Server instance can host multiple databases.

```sql
-- List all databases on the server
SELECT name, database_id, create_date
FROM sys.databases;
```

### Table
A **table** is where data is stored in rows and columns, similar to a spreadsheet.

```sql
-- Example: Customers table
CREATE TABLE Customers (
    CustomerID INT PRIMARY KEY,
    Name NVARCHAR(100),
    Email NVARCHAR(255),
    CreatedAt DATETIME DEFAULT GETDATE()
);
```

### Schema
A **schema** is a namespace that groups related database objects. The default schema is `dbo` (database owner).

```
┌─────────────────────────────────────────────────────────────────┐
│                      Database: CompanyDB                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   Schema: dbo (default)        Schema: Sales        Schema: HR  │
│   ────────────────────         ─────────────        ──────────  │
│   • Users                      • Orders             • Employees │
│   • Settings                   • Products           • Salaries  │
│   • Logs                       • Customers          • Departments│
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

```sql
-- Access table with schema
SELECT * FROM dbo.Customers;
SELECT * FROM Sales.Orders;
SELECT * FROM HR.Employees;
```

## SQL Server Architecture

### Instance
An **instance** is a single installation of SQL Server. You can have multiple instances on one machine.

```
┌─────────────────────────────────────────────────────────────────┐
│                    SQL Server Instances                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Server: MYCOMPUTER                                              │
│  ─────────────────                                               │
│                                                                  │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │ Default Instance│  │ Named Instance  │  │ Named Instance  │  │
│  │   (MSSQLSERVER) │  │  (SQLEXPRESS)   │  │    (DEVDB)      │  │
│  ├─────────────────┤  ├─────────────────┤  ├─────────────────┤  │
│  │ • ProductionDB  │  │ • TestDB        │  │ • DevDB         │  │
│  │ • ReportingDB   │  │ • SandboxDB     │  │ • FeatureDB     │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘  │
│                                                                  │
│  Connection Strings:                                             │
│  • MYCOMPUTER (default)                                          │
│  • MYCOMPUTER\SQLEXPRESS                                         │
│  • MYCOMPUTER\DEVDB                                              │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### System Databases

SQL Server has four system databases that are essential for operation:

| Database | Purpose |
|----------|---------|
| **master** | Core configuration, logins, server settings |
| **model** | Template for new databases |
| **msdb** | SQL Server Agent jobs, backups, alerts |
| **tempdb** | Temporary tables, query processing |

::: warning Never Modify System Databases Directly
System databases contain critical configuration. Always use official tools and commands to make changes.
:::

## SQL Server Components

```
┌─────────────────────────────────────────────────────────────────┐
│                    SQL Server Components                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Core Database Engine                                            │
│  ────────────────────                                            │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  • Storage Engine - Data storage and retrieval            │  │
│  │  • Query Processor - Parse, optimize, execute queries     │  │
│  │  • Buffer Manager - Memory management                     │  │
│  │  • Transaction Manager - ACID compliance                  │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│  Additional Services                                             │
│  ───────────────────                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │    SSIS     │  │    SSRS     │  │    SSAS     │              │
│  │ Integration │  │  Reporting  │  │  Analysis   │              │
│  │  Services   │  │  Services   │  │  Services   │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
│                                                                  │
│  • SSIS: ETL (Extract, Transform, Load) data pipelines          │
│  • SSRS: Generate and distribute reports                        │
│  • SSAS: OLAP cubes and data mining                             │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## SQL Server History

| Version | Year | Key Features |
|---------|------|--------------|
| SQL Server 7.0 | 1998 | Complete rewrite, modern architecture |
| SQL Server 2000 | 2000 | XML support, user-defined functions |
| SQL Server 2005 | 2005 | CLR integration, SSIS, SSRS |
| SQL Server 2008 | 2008 | Spatial data, FILESTREAM |
| SQL Server 2012 | 2012 | AlwaysOn, columnstore indexes |
| SQL Server 2014 | 2014 | In-memory OLTP |
| SQL Server 2016 | 2016 | JSON support, temporal tables |
| SQL Server 2017 | 2017 | Linux support, graph databases |
| SQL Server 2019 | 2019 | Big Data Clusters, UTF-8 |
| SQL Server 2022 | 2022 | Azure integration, ledger tables |

## Use Cases for SQL Server

### Enterprise Applications

```
┌─────────────────────────────────────────────────────────────────┐
│                    Enterprise Use Cases                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  E-Commerce Platform                                             │
│  ───────────────────                                             │
│  Products ──┬── Orders ──┬── Customers                          │
│             │            │                                       │
│             └── Inventory└── Payments                           │
│                                                                  │
│  Healthcare System                                               │
│  ─────────────────                                               │
│  Patients ──┬── Appointments ──┬── Medical Records              │
│             │                  │                                 │
│             └── Prescriptions ─┴── Insurance Claims             │
│                                                                  │
│  Financial Application                                           │
│  ─────────────────────                                           │
│  Accounts ──┬── Transactions ──┬── Audit Logs                   │
│             │                  │                                 │
│             └── Statements    ─┴── Compliance Reports           │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Real-World Example: E-Commerce Database

```sql
-- Create the Products table
CREATE TABLE Products (
    ProductID INT PRIMARY KEY IDENTITY(1,1),
    ProductName NVARCHAR(100) NOT NULL,
    Description NVARCHAR(500),
    Price DECIMAL(10,2) NOT NULL,
    StockQuantity INT DEFAULT 0,
    CategoryID INT,
    CreatedAt DATETIME2 DEFAULT SYSDATETIME()
);

-- Create the Customers table
CREATE TABLE Customers (
    CustomerID INT PRIMARY KEY IDENTITY(1,1),
    FirstName NVARCHAR(50) NOT NULL,
    LastName NVARCHAR(50) NOT NULL,
    Email NVARCHAR(255) UNIQUE NOT NULL,
    Phone NVARCHAR(20),
    RegistrationDate DATE DEFAULT GETDATE()
);

-- Create the Orders table
CREATE TABLE Orders (
    OrderID INT PRIMARY KEY IDENTITY(1,1),
    CustomerID INT FOREIGN KEY REFERENCES Customers(CustomerID),
    OrderDate DATETIME2 DEFAULT SYSDATETIME(),
    TotalAmount DECIMAL(12,2),
    Status NVARCHAR(20) DEFAULT 'Pending'
);
```

## SQL Server vs Competitors

| Feature | SQL Server | Oracle | PostgreSQL | MySQL |
|---------|------------|--------|------------|-------|
| **Cost** | Express (Free), Commercial | Commercial | Free | Free |
| **Platform** | Windows, Linux | All | All | All |
| **ACID Compliant** | Yes | Yes | Yes | Yes (InnoDB) |
| **JSON Support** | Good | Good | Excellent | Good |
| **Replication** | Built-in | Built-in | Built-in | Built-in |
| **Clustering** | AlwaysOn | RAC | Patroni | MySQL Cluster |
| **IDE** | SSMS (Excellent) | SQL Developer | pgAdmin | Workbench |

## When to Use SQL Server

::: tip Best For
- **Microsoft ecosystem** - .NET, Azure, Windows Server
- **Enterprise applications** - Built-in compliance and security
- **Business Intelligence** - Native SSRS, SSIS, Power BI integration
- **Hybrid cloud** - Seamless Azure SQL Database sync
:::

::: warning Consider Alternatives When
- **Budget is limited** - PostgreSQL is fully free
- **Unix/Linux only** - PostgreSQL or MySQL may be more natural
- **Simple applications** - SQLite might be sufficient
- **NoSQL requirements** - Consider MongoDB or CosmosDB
:::

## Summary

In this chapter, you learned:

- SQL Server is Microsoft's enterprise relational database system
- Databases contain tables, views, stored procedures, and other objects
- SQL Server uses T-SQL (Transact-SQL) for queries
- Key components include the Database Engine, SSIS, SSRS, and SSAS
- SQL Server is ideal for enterprise applications in the Microsoft ecosystem

Ready to install SQL Server? Continue to [Chapter 2: Installation](./02-installation.md)!
