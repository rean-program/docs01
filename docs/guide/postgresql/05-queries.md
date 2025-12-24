# Advanced Queries

This chapter covers advanced SELECT query techniques including aggregations, grouping, subqueries, and common table expressions (CTEs). Master these to unlock PostgreSQL's full potential.

## Sample Data Setup

Let's create sample tables for practicing:

```sql
-- Create tables
CREATE TABLE departments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    budget DECIMAL(15, 2)
);

CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE,
    department_id INTEGER REFERENCES departments(id),
    salary DECIMAL(10, 2),
    hire_date DATE,
    manager_id INTEGER REFERENCES employees(id)
);

CREATE TABLE sales (
    id SERIAL PRIMARY KEY,
    employee_id INTEGER REFERENCES employees(id),
    amount DECIMAL(10, 2),
    sale_date DATE,
    product VARCHAR(100)
);

-- Insert sample data
INSERT INTO departments (name, budget) VALUES
    ('Engineering', 500000),
    ('Marketing', 200000),
    ('Sales', 300000),
    ('HR', 150000);

INSERT INTO employees (name, email, department_id, salary, hire_date, manager_id) VALUES
    ('Alice Chen', 'alice@company.com', 1, 120000, '2020-01-15', NULL),
    ('Bob Smith', 'bob@company.com', 1, 95000, '2021-03-20', 1),
    ('Carol Davis', 'carol@company.com', 1, 85000, '2022-06-10', 1),
    ('David Lee', 'david@company.com', 2, 75000, '2021-08-01', NULL),
    ('Eva Martinez', 'eva@company.com', 2, 65000, '2023-01-10', 4),
    ('Frank Wilson', 'frank@company.com', 3, 80000, '2020-05-20', NULL),
    ('Grace Kim', 'grace@company.com', 3, 70000, '2022-09-15', 6),
    ('Henry Brown', 'henry@company.com', 4, 60000, '2021-11-01', NULL);

INSERT INTO sales (employee_id, amount, sale_date, product) VALUES
    (6, 15000, '2024-01-05', 'Enterprise Plan'),
    (7, 8000, '2024-01-10', 'Pro Plan'),
    (6, 12000, '2024-01-15', 'Enterprise Plan'),
    (7, 5000, '2024-01-20', 'Basic Plan'),
    (6, 20000, '2024-02-01', 'Enterprise Plan'),
    (7, 10000, '2024-02-10', 'Pro Plan'),
    (6, 18000, '2024-02-15', 'Enterprise Plan'),
    (7, 7000, '2024-02-20', 'Pro Plan');
```

## Aggregate Functions

Aggregate functions compute a single result from multiple rows.

```
┌─────────────────────────────────────────────────────────────────┐
│                   Common Aggregate Functions                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   Function    Description              Example Result            │
│   ────────    ───────────              ──────────────            │
│                                                                  │
│   COUNT()     Number of rows           COUNT(*) → 8              │
│   SUM()       Total of values          SUM(salary) → 650000      │
│   AVG()       Average value            AVG(salary) → 81250       │
│   MIN()       Minimum value            MIN(salary) → 60000       │
│   MAX()       Maximum value            MAX(salary) → 120000      │
│   STRING_AGG  Concatenate strings      STRING_AGG(name,', ')     │
│   ARRAY_AGG   Collect into array       ARRAY_AGG(name)           │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Basic Aggregation

```sql
-- Count all employees
SELECT COUNT(*) AS total_employees FROM employees;

-- Count non-null values
SELECT COUNT(manager_id) AS employees_with_managers FROM employees;

-- Sum, Average, Min, Max
SELECT
    SUM(salary) AS total_payroll,
    AVG(salary) AS average_salary,
    MIN(salary) AS lowest_salary,
    MAX(salary) AS highest_salary
FROM employees;

-- Combine into a single row
SELECT
    COUNT(*) AS employee_count,
    ROUND(AVG(salary), 2) AS avg_salary,
    SUM(salary) AS total_cost
FROM employees
WHERE department_id = 1;
```

### String and Array Aggregation

```sql
-- Concatenate names into a string
SELECT STRING_AGG(name, ', ' ORDER BY name) AS all_employees
FROM employees;
-- Result: "Alice Chen, Bob Smith, Carol Davis, ..."

-- Collect into an array
SELECT ARRAY_AGG(name ORDER BY hire_date) AS employees_by_tenure
FROM employees;
-- Result: {"Alice Chen", "Frank Wilson", "Bob Smith", ...}

-- Aggregate per department
SELECT
    d.name AS department,
    STRING_AGG(e.name, ', ') AS team_members
FROM departments d
JOIN employees e ON d.id = e.department_id
GROUP BY d.id, d.name;
```

## GROUP BY

GROUP BY divides rows into groups and applies aggregate functions to each group.

```
┌─────────────────────────────────────────────────────────────────┐
│                    How GROUP BY Works                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   Original Data:                   After GROUP BY department:    │
│   ─────────────                    ─────────────────────────     │
│                                                                  │
│   Name    Dept     Salary          Dept          Count  Sum      │
│   Alice   Eng      120000    ───►  Engineering   3      300000   │
│   Bob     Eng       95000          Marketing     2      140000   │
│   Carol   Eng       85000          Sales         2      150000   │
│   David   Mkt       75000          HR            1       60000   │
│   Eva     Mkt       65000                                        │
│   Frank   Sales     80000                                        │
│   Grace   Sales     70000                                        │
│   Henry   HR        60000                                        │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Basic GROUP BY

```sql
-- Count employees per department
SELECT
    department_id,
    COUNT(*) AS employee_count
FROM employees
GROUP BY department_id;

-- With department names (using JOIN)
SELECT
    d.name AS department,
    COUNT(e.id) AS employee_count,
    SUM(e.salary) AS total_salary,
    ROUND(AVG(e.salary), 2) AS avg_salary
FROM departments d
LEFT JOIN employees e ON d.id = e.department_id
GROUP BY d.id, d.name
ORDER BY total_salary DESC;
```

### Multiple Grouping Columns

```sql
-- Group by year and month
SELECT
    EXTRACT(YEAR FROM sale_date) AS year,
    EXTRACT(MONTH FROM sale_date) AS month,
    COUNT(*) AS sale_count,
    SUM(amount) AS total_sales
FROM sales
GROUP BY
    EXTRACT(YEAR FROM sale_date),
    EXTRACT(MONTH FROM sale_date)
ORDER BY year, month;

-- Group by product and employee
SELECT
    product,
    e.name AS salesperson,
    COUNT(*) AS times_sold,
    SUM(s.amount) AS total_revenue
FROM sales s
JOIN employees e ON s.employee_id = e.id
GROUP BY product, e.name
ORDER BY product, total_revenue DESC;
```

## HAVING

HAVING filters groups after aggregation (WHERE filters rows before aggregation).

```sql
-- Departments with more than 1 employee
SELECT
    d.name AS department,
    COUNT(*) AS employee_count
FROM departments d
JOIN employees e ON d.id = e.department_id
GROUP BY d.id, d.name
HAVING COUNT(*) > 1;

-- Products with total sales over $20,000
SELECT
    product,
    SUM(amount) AS total_sales
FROM sales
GROUP BY product
HAVING SUM(amount) > 20000;

-- Employees with average sale over $10,000
SELECT
    e.name,
    ROUND(AVG(s.amount), 2) AS avg_sale,
    COUNT(*) AS sale_count
FROM employees e
JOIN sales s ON e.id = s.employee_id
GROUP BY e.id, e.name
HAVING AVG(s.amount) > 10000;
```

### WHERE vs HAVING

```sql
-- WHERE filters rows BEFORE grouping
SELECT department_id, AVG(salary)
FROM employees
WHERE salary > 70000           -- Filter individual rows first
GROUP BY department_id;

-- HAVING filters groups AFTER aggregation
SELECT department_id, AVG(salary)
FROM employees
GROUP BY department_id
HAVING AVG(salary) > 80000;    -- Filter aggregated results

-- Combined: Both WHERE and HAVING
SELECT
    d.name,
    COUNT(*) AS senior_count,
    AVG(e.salary) AS avg_salary
FROM departments d
JOIN employees e ON d.id = e.department_id
WHERE e.hire_date < '2022-01-01'    -- Only employees hired before 2022
GROUP BY d.id, d.name
HAVING COUNT(*) >= 2;                -- Departments with 2+ such employees
```

## Subqueries

A subquery is a query nested inside another query.

### Scalar Subqueries (Return Single Value)

```sql
-- Employees earning above average
SELECT name, salary
FROM employees
WHERE salary > (SELECT AVG(salary) FROM employees);

-- Employee count compared to company average
SELECT
    d.name,
    COUNT(*) AS dept_count,
    (SELECT COUNT(*) FROM employees) AS total_count,
    ROUND(
        COUNT(*) * 100.0 / (SELECT COUNT(*) FROM employees),
        1
    ) AS percentage
FROM departments d
JOIN employees e ON d.id = e.department_id
GROUP BY d.id, d.name;
```

### Column Subqueries (Return List of Values)

```sql
-- Employees in departments with budget over 200k
SELECT name, department_id
FROM employees
WHERE department_id IN (
    SELECT id FROM departments WHERE budget > 200000
);

-- Employees who have made sales
SELECT name
FROM employees
WHERE id IN (SELECT DISTINCT employee_id FROM sales);

-- Employees who haven't made sales
SELECT name
FROM employees
WHERE id NOT IN (
    SELECT DISTINCT employee_id FROM sales WHERE employee_id IS NOT NULL
);
```

### Table Subqueries (Return Multiple Rows and Columns)

```sql
-- Top earner per department
SELECT name, salary, department_id
FROM employees e
WHERE salary = (
    SELECT MAX(salary)
    FROM employees
    WHERE department_id = e.department_id
);

-- Using subquery as a table
SELECT
    dept_stats.department,
    dept_stats.avg_salary,
    e.name AS highest_earner
FROM (
    SELECT
        department_id,
        d.name AS department,
        AVG(e.salary) AS avg_salary,
        MAX(e.salary) AS max_salary
    FROM employees e
    JOIN departments d ON e.department_id = d.id
    GROUP BY department_id, d.name
) AS dept_stats
JOIN employees e ON e.department_id = dept_stats.department_id
    AND e.salary = dept_stats.max_salary;
```

### EXISTS Subqueries

```sql
-- Departments that have at least one employee
SELECT name
FROM departments d
WHERE EXISTS (
    SELECT 1 FROM employees WHERE department_id = d.id
);

-- Departments with no employees
SELECT name
FROM departments d
WHERE NOT EXISTS (
    SELECT 1 FROM employees WHERE department_id = d.id
);

-- Employees who are managers
SELECT name
FROM employees e
WHERE EXISTS (
    SELECT 1 FROM employees WHERE manager_id = e.id
);
```

## Common Table Expressions (CTEs)

CTEs make complex queries more readable by breaking them into named steps.

```
┌─────────────────────────────────────────────────────────────────┐
│                      CTE Structure                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   WITH cte_name AS (                                            │
│       -- Define the CTE query here                              │
│       SELECT ...                                                 │
│   ),                                                             │
│   another_cte AS (                                              │
│       -- Can reference previous CTEs                            │
│       SELECT ... FROM cte_name ...                              │
│   )                                                              │
│   -- Main query uses the CTEs                                   │
│   SELECT * FROM cte_name                                        │
│   JOIN another_cte ON ...                                       │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Basic CTE

```sql
-- Calculate department statistics
WITH dept_stats AS (
    SELECT
        department_id,
        COUNT(*) AS employee_count,
        AVG(salary) AS avg_salary
    FROM employees
    GROUP BY department_id
)
SELECT
    d.name,
    ds.employee_count,
    ROUND(ds.avg_salary, 2) AS avg_salary
FROM departments d
JOIN dept_stats ds ON d.id = ds.department_id
ORDER BY ds.avg_salary DESC;
```

### Multiple CTEs

```sql
-- Complex report using multiple CTEs
WITH
-- CTE 1: Department summary
dept_summary AS (
    SELECT
        d.id,
        d.name,
        d.budget,
        COUNT(e.id) AS headcount,
        COALESCE(SUM(e.salary), 0) AS total_salary
    FROM departments d
    LEFT JOIN employees e ON d.id = e.department_id
    GROUP BY d.id, d.name, d.budget
),
-- CTE 2: Sales summary per employee
sales_summary AS (
    SELECT
        employee_id,
        COUNT(*) AS sale_count,
        SUM(amount) AS total_sales
    FROM sales
    GROUP BY employee_id
),
-- CTE 3: Top performers
top_performers AS (
    SELECT
        e.id,
        e.name,
        e.department_id,
        COALESCE(ss.total_sales, 0) AS total_sales
    FROM employees e
    LEFT JOIN sales_summary ss ON e.id = ss.employee_id
    WHERE ss.total_sales IS NOT NULL
)
-- Main query: Department report with top performer
SELECT
    ds.name AS department,
    ds.headcount,
    ds.total_salary,
    ds.budget - ds.total_salary AS remaining_budget,
    tp.name AS top_performer,
    tp.total_sales
FROM dept_summary ds
LEFT JOIN top_performers tp ON ds.id = tp.department_id
ORDER BY ds.name;
```

### Recursive CTEs

Recursive CTEs are perfect for hierarchical data like org charts or categories.

```sql
-- Build organization hierarchy
WITH RECURSIVE org_chart AS (
    -- Base case: Top-level employees (no manager)
    SELECT
        id,
        name,
        manager_id,
        1 AS level,
        name AS path
    FROM employees
    WHERE manager_id IS NULL

    UNION ALL

    -- Recursive case: Employees with managers
    SELECT
        e.id,
        e.name,
        e.manager_id,
        oc.level + 1,
        oc.path || ' → ' || e.name
    FROM employees e
    JOIN org_chart oc ON e.manager_id = oc.id
)
SELECT
    REPEAT('  ', level - 1) || name AS employee,
    level,
    path
FROM org_chart
ORDER BY path;
```

Output:
```
        employee         | level |              path
-------------------------+-------+--------------------------------
 Alice Chen              |     1 | Alice Chen
   Bob Smith             |     2 | Alice Chen → Bob Smith
   Carol Davis           |     2 | Alice Chen → Carol Davis
 David Lee               |     1 | David Lee
   Eva Martinez          |     2 | David Lee → Eva Martinez
 Frank Wilson            |     1 | Frank Wilson
   Grace Kim             |     2 | Frank Wilson → Grace Kim
 Henry Brown             |     1 | Henry Brown
```

## Window Functions

Window functions perform calculations across related rows without collapsing them.

```
┌─────────────────────────────────────────────────────────────────┐
│                    Window Functions                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   GROUP BY                         Window Functions              │
│   ────────                         ────────────────              │
│                                                                  │
│   Collapses rows ───►              Keeps all rows                │
│   One result per group             Adds computed column          │
│                                                                  │
│   id  salary  dept                 id  salary  dept   rank       │
│   ──────────────────               ──────────────────────────    │
│   Eng: AVG = 100000                1   120000  Eng    1          │
│   Mkt: AVG = 70000                 2    95000  Eng    2          │
│                                    3    85000  Eng    3          │
│                                    4    75000  Mkt    1          │
│                                    5    65000  Mkt    2          │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### ROW_NUMBER, RANK, DENSE_RANK

```sql
-- Rank employees by salary within department
SELECT
    name,
    department_id,
    salary,
    ROW_NUMBER() OVER (PARTITION BY department_id ORDER BY salary DESC) AS row_num,
    RANK() OVER (PARTITION BY department_id ORDER BY salary DESC) AS rank,
    DENSE_RANK() OVER (PARTITION BY department_id ORDER BY salary DESC) AS dense_rank
FROM employees;

-- Get top 2 earners per department
SELECT * FROM (
    SELECT
        name,
        department_id,
        salary,
        ROW_NUMBER() OVER (
            PARTITION BY department_id
            ORDER BY salary DESC
        ) AS rank
    FROM employees
) ranked
WHERE rank <= 2;
```

### Running Totals and Moving Averages

```sql
-- Running total of sales
SELECT
    sale_date,
    amount,
    SUM(amount) OVER (ORDER BY sale_date) AS running_total
FROM sales;

-- Sales with cumulative and moving average
SELECT
    sale_date,
    amount,
    SUM(amount) OVER (ORDER BY sale_date) AS cumulative_total,
    ROUND(
        AVG(amount) OVER (
            ORDER BY sale_date
            ROWS BETWEEN 2 PRECEDING AND CURRENT ROW
        ), 2
    ) AS moving_avg_3
FROM sales;
```

### LAG and LEAD

```sql
-- Compare each sale to previous sale
SELECT
    sale_date,
    amount,
    LAG(amount) OVER (ORDER BY sale_date) AS previous_sale,
    amount - LAG(amount) OVER (ORDER BY sale_date) AS difference
FROM sales;

-- Compare to next sale
SELECT
    sale_date,
    amount,
    LEAD(amount) OVER (ORDER BY sale_date) AS next_sale
FROM sales;
```

### FIRST_VALUE, LAST_VALUE, NTH_VALUE

```sql
-- Compare each employee to department's highest earner
SELECT
    name,
    salary,
    FIRST_VALUE(name) OVER (
        PARTITION BY department_id
        ORDER BY salary DESC
    ) AS top_earner,
    FIRST_VALUE(salary) OVER (
        PARTITION BY department_id
        ORDER BY salary DESC
    ) AS top_salary,
    salary - FIRST_VALUE(salary) OVER (
        PARTITION BY department_id
        ORDER BY salary DESC
    ) AS diff_from_top
FROM employees;
```

## Summary

In this chapter, you learned:

- **Aggregate Functions**: COUNT, SUM, AVG, MIN, MAX, STRING_AGG
- **GROUP BY**: Grouping rows and applying aggregates
- **HAVING**: Filtering groups after aggregation
- **Subqueries**: Nested queries for complex logic
- **CTEs**: Named subqueries for readable code
- **Recursive CTEs**: Handling hierarchical data
- **Window Functions**: Calculations across related rows

## Quick Reference

```sql
-- Aggregation
SELECT COUNT(*), SUM(col), AVG(col) FROM table GROUP BY group_col;

-- Filtering groups
SELECT col, COUNT(*) FROM table GROUP BY col HAVING COUNT(*) > 5;

-- Subquery
SELECT * FROM table WHERE col > (SELECT AVG(col) FROM table);

-- CTE
WITH cte AS (SELECT ...) SELECT * FROM cte;

-- Window function
SELECT col, SUM(col) OVER (PARTITION BY group ORDER BY sort) FROM table;
```

## What's Next?

Now let's learn how to combine data from multiple tables with JOINs!

👉 Continue to [Chapter 6: JOINs](./06-joins.md)
