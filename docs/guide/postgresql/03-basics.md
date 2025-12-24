# SQL Basics

This chapter covers the fundamental SQL commands you'll use every day: creating databases, tables, and performing basic CRUD (Create, Read, Update, Delete) operations.

## Understanding SQL

SQL (Structured Query Language) is how you communicate with PostgreSQL. Think of it as giving instructions to your database.

```
┌─────────────────────────────────────────────────────────────────┐
│                    SQL Command Categories                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   Category              Commands              Purpose            │
│   ────────              ────────              ───────            │
│                                                                  │
│   DDL (Data Definition) CREATE, ALTER, DROP   Structure          │
│   DML (Data Manipulation) INSERT, UPDATE, DELETE  Data          │
│   DQL (Data Query)      SELECT                Retrieval          │
│   DCL (Data Control)    GRANT, REVOKE         Permissions        │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Working with Databases

### Creating a Database

```sql
-- Create a simple database
CREATE DATABASE my_first_db;

-- Create with specific settings
CREATE DATABASE shop_db
    ENCODING 'UTF8'
    LC_COLLATE 'en_US.UTF-8'
    LC_CTYPE 'en_US.UTF-8';
```

### Listing Databases

```sql
-- In psql, use the shortcut
\l

-- Or use SQL query
SELECT datname FROM pg_database;
```

Output:
```
   datname
-------------
 postgres
 template0
 template1
 my_first_db
 shop_db
(5 rows)
```

### Connecting to a Database

```sql
-- In psql
\c my_first_db

-- Or when starting psql
-- psql -d my_first_db
```

### Deleting a Database

```sql
-- Drop (delete) a database
DROP DATABASE my_first_db;

-- Drop only if it exists (prevents error)
DROP DATABASE IF EXISTS my_first_db;
```

::: danger Warning
`DROP DATABASE` permanently deletes all data. This cannot be undone!
:::

## Working with Tables

### Understanding Table Structure

```
┌─────────────────────────────────────────────────────────────────┐
│                     Table: employees                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   Column        Data Type        Constraints                     │
│   ──────        ─────────        ───────────                     │
│                                                                  │
│   id            INTEGER          PRIMARY KEY                     │
│   name          VARCHAR(100)     NOT NULL                        │
│   email         VARCHAR(255)     UNIQUE                          │
│   salary        DECIMAL(10,2)                                    │
│   hire_date     DATE             DEFAULT CURRENT_DATE            │
│   is_active     BOOLEAN          DEFAULT true                    │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│                     Sample Data (Rows)                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   1 | John Smith | john@email.com | 50000.00 | 2024-01-15 | true │
│   2 | Jane Doe   | jane@email.com | 60000.00 | 2024-02-01 | true │
│   3 | Bob Wilson | bob@email.com  | 45000.00 | 2024-03-10 | false│
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Creating Tables

```sql
-- Basic table creation
CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE,
    salary DECIMAL(10, 2),
    hire_date DATE DEFAULT CURRENT_DATE,
    is_active BOOLEAN DEFAULT true
);

-- Table with foreign key relationship
CREATE TABLE departments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    budget DECIMAL(15, 2)
);

CREATE TABLE employees_v2 (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE,
    department_id INTEGER REFERENCES departments(id),
    salary DECIMAL(10, 2),
    hire_date DATE DEFAULT CURRENT_DATE
);
```

### Key Constraints Explained

| Constraint | Meaning | Example |
|------------|---------|---------|
| `PRIMARY KEY` | Unique identifier for each row | `id SERIAL PRIMARY KEY` |
| `NOT NULL` | Value cannot be empty | `name VARCHAR(100) NOT NULL` |
| `UNIQUE` | No duplicate values allowed | `email VARCHAR(255) UNIQUE` |
| `DEFAULT` | Auto-fill if not provided | `created_at TIMESTAMP DEFAULT NOW()` |
| `REFERENCES` | Links to another table | `user_id INTEGER REFERENCES users(id)` |
| `CHECK` | Value must meet condition | `age INTEGER CHECK (age >= 0)` |

### Viewing Table Structure

```sql
-- In psql
\d employees

-- Get detailed information
\d+ employees
```

Output:
```
                                      Table "public.employees"
   Column   |          Type          | Collation | Nullable |                Default
------------+------------------------+-----------+----------+---------------------------------------
 id         | integer                |           | not null | nextval('employees_id_seq'::regclass)
 name       | character varying(100) |           | not null |
 email      | character varying(255) |           |          |
 salary     | numeric(10,2)          |           |          |
 hire_date  | date                   |           |          | CURRENT_DATE
 is_active  | boolean                |           |          | true
Indexes:
    "employees_pkey" PRIMARY KEY, btree (id)
    "employees_email_key" UNIQUE CONSTRAINT, btree (email)
```

### Modifying Tables

```sql
-- Add a new column
ALTER TABLE employees ADD COLUMN phone VARCHAR(20);

-- Remove a column
ALTER TABLE employees DROP COLUMN phone;

-- Rename a column
ALTER TABLE employees RENAME COLUMN name TO full_name;

-- Change column type
ALTER TABLE employees ALTER COLUMN salary TYPE DECIMAL(12, 2);

-- Add a constraint
ALTER TABLE employees ADD CONSTRAINT salary_positive CHECK (salary > 0);

-- Rename a table
ALTER TABLE employees RENAME TO staff;
```

### Deleting Tables

```sql
-- Drop a table
DROP TABLE employees;

-- Drop if exists
DROP TABLE IF EXISTS employees;

-- Drop with dependencies (use carefully!)
DROP TABLE employees CASCADE;
```

## CRUD Operations

CRUD stands for Create, Read, Update, Delete - the four basic operations for data.

### CREATE: Inserting Data

```sql
-- Insert a single row
INSERT INTO employees (name, email, salary)
VALUES ('John Smith', 'john@example.com', 50000);

-- Insert with all columns
INSERT INTO employees (name, email, salary, hire_date, is_active)
VALUES ('Jane Doe', 'jane@example.com', 60000, '2024-01-15', true);

-- Insert multiple rows at once
INSERT INTO employees (name, email, salary) VALUES
    ('Alice Johnson', 'alice@example.com', 55000),
    ('Bob Wilson', 'bob@example.com', 48000),
    ('Carol Brown', 'carol@example.com', 52000);

-- Insert and return the new row
INSERT INTO employees (name, email, salary)
VALUES ('David Lee', 'david@example.com', 58000)
RETURNING *;

-- Insert and get only the ID
INSERT INTO employees (name, email, salary)
VALUES ('Eva Martinez', 'eva@example.com', 62000)
RETURNING id;
```

### READ: Selecting Data

```sql
-- Select all columns, all rows
SELECT * FROM employees;

-- Select specific columns
SELECT name, email, salary FROM employees;

-- Select with alias (rename columns in output)
SELECT
    name AS employee_name,
    salary AS annual_salary,
    salary / 12 AS monthly_salary
FROM employees;

-- Select distinct values
SELECT DISTINCT department_id FROM employees;

-- Count rows
SELECT COUNT(*) FROM employees;
```

Example output:
```
 id |     name      |       email        |  salary  | hire_date  | is_active
----+---------------+--------------------+----------+------------+-----------
  1 | John Smith    | john@example.com   | 50000.00 | 2024-01-20 | t
  2 | Jane Doe      | jane@example.com   | 60000.00 | 2024-01-15 | t
  3 | Alice Johnson | alice@example.com  | 55000.00 | 2024-01-20 | t
(3 rows)
```

### UPDATE: Modifying Data

```sql
-- Update a single row
UPDATE employees
SET salary = 55000
WHERE id = 1;

-- Update multiple columns
UPDATE employees
SET
    salary = 65000,
    is_active = true
WHERE email = 'jane@example.com';

-- Update based on condition
UPDATE employees
SET salary = salary * 1.10  -- 10% raise
WHERE hire_date < '2024-01-01';

-- Update all rows (be careful!)
UPDATE employees
SET is_active = true;

-- Update and return modified rows
UPDATE employees
SET salary = salary * 1.05
WHERE department_id = 1
RETURNING name, salary;
```

::: warning Always Use WHERE
Without a `WHERE` clause, `UPDATE` affects ALL rows in the table!
:::

### DELETE: Removing Data

```sql
-- Delete a specific row
DELETE FROM employees
WHERE id = 5;

-- Delete multiple rows
DELETE FROM employees
WHERE is_active = false;

-- Delete based on condition
DELETE FROM employees
WHERE hire_date < '2020-01-01';

-- Delete all rows (but keep table)
DELETE FROM employees;

-- Delete and return what was removed
DELETE FROM employees
WHERE id = 10
RETURNING *;

-- Faster way to delete all rows
TRUNCATE TABLE employees;
```

::: danger Critical Warning
`DELETE` without `WHERE` removes ALL data from the table!
Always verify your `WHERE` clause before executing.
:::

## Filtering with WHERE

The `WHERE` clause filters which rows are affected by your query.

### Comparison Operators

```sql
-- Equal to
SELECT * FROM employees WHERE department_id = 1;

-- Not equal to
SELECT * FROM employees WHERE status != 'inactive';
SELECT * FROM employees WHERE status <> 'inactive';  -- Same as above

-- Greater than / Less than
SELECT * FROM employees WHERE salary > 50000;
SELECT * FROM employees WHERE salary < 50000;

-- Greater/Less than or equal
SELECT * FROM employees WHERE salary >= 50000;
SELECT * FROM employees WHERE hire_date <= '2024-01-01';

-- Between (inclusive)
SELECT * FROM employees WHERE salary BETWEEN 40000 AND 60000;

-- In a list
SELECT * FROM employees WHERE department_id IN (1, 2, 3);

-- Like (pattern matching)
SELECT * FROM employees WHERE name LIKE 'John%';     -- Starts with John
SELECT * FROM employees WHERE email LIKE '%@gmail.com'; -- Ends with @gmail.com
SELECT * FROM employees WHERE name LIKE '%son%';     -- Contains 'son'

-- Case-insensitive pattern matching
SELECT * FROM employees WHERE name ILIKE 'john%';

-- NULL checks
SELECT * FROM employees WHERE phone IS NULL;
SELECT * FROM employees WHERE phone IS NOT NULL;
```

### Logical Operators

```sql
-- AND: Both conditions must be true
SELECT * FROM employees
WHERE department_id = 1 AND salary > 50000;

-- OR: Either condition can be true
SELECT * FROM employees
WHERE department_id = 1 OR department_id = 2;

-- NOT: Reverses the condition
SELECT * FROM employees
WHERE NOT is_active;

-- Combining operators (use parentheses for clarity)
SELECT * FROM employees
WHERE (department_id = 1 OR department_id = 2)
  AND salary > 50000
  AND is_active = true;
```

## Sorting with ORDER BY

```sql
-- Sort ascending (default)
SELECT * FROM employees ORDER BY name;
SELECT * FROM employees ORDER BY name ASC;

-- Sort descending
SELECT * FROM employees ORDER BY salary DESC;

-- Sort by multiple columns
SELECT * FROM employees
ORDER BY department_id ASC, salary DESC;

-- Sort with NULL handling
SELECT * FROM employees
ORDER BY phone NULLS LAST;  -- NULLs at the end

SELECT * FROM employees
ORDER BY phone NULLS FIRST; -- NULLs at the beginning
```

## Limiting Results

```sql
-- Get first 10 rows
SELECT * FROM employees LIMIT 10;

-- Skip first 10, get next 10 (pagination)
SELECT * FROM employees LIMIT 10 OFFSET 10;

-- Practical pagination example
-- Page 1: LIMIT 10 OFFSET 0
-- Page 2: LIMIT 10 OFFSET 10
-- Page 3: LIMIT 10 OFFSET 20
-- Formula: OFFSET = (page_number - 1) * page_size
```

## Practical Example: Building a Simple App

Let's create a complete example - a simple task management system:

```sql
-- Create the database
CREATE DATABASE task_manager;
\c task_manager

-- Create users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create tasks table
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    status VARCHAR(20) DEFAULT 'pending',
    priority INTEGER DEFAULT 1,
    due_date DATE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Insert sample users
INSERT INTO users (username, email) VALUES
    ('alice', 'alice@example.com'),
    ('bob', 'bob@example.com'),
    ('carol', 'carol@example.com');

-- Insert sample tasks
INSERT INTO tasks (user_id, title, description, status, priority, due_date) VALUES
    (1, 'Complete project proposal', 'Write the Q1 project proposal', 'in_progress', 3, '2024-02-01'),
    (1, 'Review code changes', 'Review PRs from team members', 'pending', 2, '2024-01-25'),
    (2, 'Update documentation', 'Update API documentation', 'pending', 1, '2024-01-30'),
    (2, 'Fix login bug', 'Users cannot login with special characters', 'completed', 3, '2024-01-20'),
    (3, 'Design new landing page', 'Create mockups for the new landing page', 'in_progress', 2, '2024-02-15');

-- Query: Get all tasks for a user
SELECT t.*, u.username
FROM tasks t
JOIN users u ON t.user_id = u.id
WHERE u.username = 'alice';

-- Query: Get high priority pending tasks
SELECT title, due_date, priority
FROM tasks
WHERE status = 'pending' AND priority >= 2
ORDER BY due_date ASC;

-- Query: Count tasks by status
SELECT status, COUNT(*) as count
FROM tasks
GROUP BY status;

-- Update: Mark a task as completed
UPDATE tasks
SET status = 'completed', updated_at = NOW()
WHERE id = 2;

-- Delete: Remove completed tasks older than 30 days
DELETE FROM tasks
WHERE status = 'completed'
  AND updated_at < NOW() - INTERVAL '30 days';
```

## Summary

In this chapter, you learned:

- **Database operations**: CREATE, DROP, and switching databases
- **Table operations**: CREATE TABLE, ALTER TABLE, DROP TABLE
- **Constraints**: PRIMARY KEY, NOT NULL, UNIQUE, DEFAULT, REFERENCES
- **CRUD operations**:
  - CREATE (INSERT)
  - READ (SELECT)
  - UPDATE
  - DELETE
- **Filtering**: WHERE clause with comparison and logical operators
- **Sorting**: ORDER BY with ASC/DESC
- **Pagination**: LIMIT and OFFSET

## Quick Reference

```sql
-- Database
CREATE DATABASE dbname;
DROP DATABASE dbname;
\c dbname

-- Table
CREATE TABLE tablename (column definitions);
DROP TABLE tablename;
\d tablename

-- Data
INSERT INTO table (cols) VALUES (vals);
SELECT cols FROM table WHERE condition;
UPDATE table SET col = val WHERE condition;
DELETE FROM table WHERE condition;
```

## What's Next?

Now that you know the basics, let's dive deeper into PostgreSQL's rich data types!

👉 Continue to [Chapter 4: Data Types](./04-data-types.md)
