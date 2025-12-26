# Table Relationships and JOINs

JOINs allow you to combine data from multiple tables. This chapter covers all JOIN types, when to use each, and how to design proper table relationships.

## Why Use Multiple Tables?

Instead of storing all data in one table, we split it into related tables:

```
┌─────────────────────────────────────────────────────────────────┐
│              One Big Table (Bad Design)                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   order_id | customer_name | customer_email | product | price   │
│   ─────────────────────────────────────────────────────────────  │
│   1        | John Smith    | john@email.com | Laptop  | 999     │
│   2        | John Smith    | john@email.com | Mouse   | 29      │
│   3        | John Smith    | john@email.com | Keyboard| 79      │
│   4        | Jane Doe      | jane@email.com | Monitor | 299     │
│                                                                  │
│   Problems:                                                      │
│   • Data duplication (John's info repeated 3 times)             │
│   • Update anomalies (change email in one place, miss others)   │
│   • Wasted storage                                               │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│              Normalized Tables (Good Design)                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   customers                     orders                           │
│   ─────────                     ──────                           │
│   id | name      | email        id | customer_id | product |price│
│   1  | John Smith| john@...     1  | 1           | Laptop  | 999 │
│   2  | Jane Doe  | jane@...     2  | 1           | Mouse   | 29  │
│                                 3  | 1           | Keyboard| 79  │
│                                 4  | 2           | Monitor | 299 │
│                                                                  │
│   Benefits:                                                      │
│   • No duplication                                               │
│   • Update in one place                                          │
│   • Less storage                                                 │
│   • Data integrity                                               │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Sample Database Setup

```sql
-- Create tables for examples
CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE,
    city VARCHAR(100)
);

CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    price DECIMAL(10, 2),
    category VARCHAR(100)
);

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES customers(id),
    order_date DATE DEFAULT CURRENT_DATE,
    status VARCHAR(50) DEFAULT 'pending'
);

CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id),
    product_id INTEGER REFERENCES products(id),
    quantity INTEGER DEFAULT 1,
    unit_price DECIMAL(10, 2)
);

-- Insert sample data
INSERT INTO customers (name, email, city) VALUES
    ('Alice Johnson', 'alice@email.com', 'New York'),
    ('Bob Smith', 'bob@email.com', 'Los Angeles'),
    ('Carol Williams', 'carol@email.com', 'Chicago'),
    ('David Brown', 'david@email.com', 'Houston'),
    ('Eva Davis', 'eva@email.com', NULL);  -- Customer with no city

INSERT INTO products (name, price, category) VALUES
    ('Laptop', 999.99, 'Electronics'),
    ('Mouse', 29.99, 'Electronics'),
    ('Keyboard', 79.99, 'Electronics'),
    ('Desk Chair', 249.99, 'Furniture'),
    ('Monitor Stand', 49.99, 'Accessories'),
    ('USB Hub', 39.99, 'Electronics');  -- Product never ordered

INSERT INTO orders (customer_id, order_date, status) VALUES
    (1, '2024-01-15', 'completed'),
    (1, '2024-02-01', 'completed'),
    (2, '2024-01-20', 'shipped'),
    (3, '2024-02-10', 'pending'),
    (NULL, '2024-02-15', 'pending');  -- Order with no customer (guest)

INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES
    (1, 1, 1, 999.99),
    (1, 2, 2, 29.99),
    (2, 3, 1, 79.99),
    (2, 5, 1, 49.99),
    (3, 4, 1, 249.99),
    (4, 1, 1, 999.99),
    (4, 2, 1, 29.99);
```

## Types of JOINs

```
┌─────────────────────────────────────────────────────────────────┐
│                      JOIN Types Visual                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   INNER JOIN              LEFT JOIN               RIGHT JOIN     │
│   ──────────              ─────────               ──────────     │
│                                                                  │
│     ┌───┬───┐             ┌───┬───┐             ┌───┬───┐       │
│     │ A │░░░│             │ A │░░░│             │░░░│ B │       │
│     │   │░B░│             │   │░B░│             │░A░│   │       │
│     └───┴───┘             └───┴───┘             └───┴───┘       │
│         ▲                   ▲                       ▲            │
│       Only                All A                  All B           │
│     matching              + matching             + matching      │
│                                                                  │
│   FULL OUTER JOIN         CROSS JOIN                            │
│   ───────────────         ──────────                            │
│                                                                  │
│     ┌───┬───┐             A × B = Every                         │
│     │ A │ B │             combination                           │
│     │   │   │             of rows                               │
│     └───┴───┘                                                   │
│         ▲                                                        │
│     All rows                                                     │
│     from both                                                    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## INNER JOIN

Returns only rows that have matching values in both tables.

```sql
-- Basic INNER JOIN syntax
SELECT columns
FROM table1
INNER JOIN table2 ON table1.column = table2.column;

-- Get orders with customer names
SELECT
    o.id AS order_id,
    c.name AS customer_name,
    o.order_date,
    o.status
FROM orders o
INNER JOIN customers c ON o.customer_id = c.id;
```

Result:
```
 order_id | customer_name   | order_date | status
----------+-----------------+------------+-----------
        1 | Alice Johnson   | 2024-01-15 | completed
        2 | Alice Johnson   | 2024-02-01 | completed
        3 | Bob Smith       | 2024-01-20 | shipped
        4 | Carol Williams  | 2024-02-10 | pending
```

Notice: Order #5 (with NULL customer_id) is not included because there's no match.

### Joining Multiple Tables

```sql
-- Order details with customer and product info
SELECT
    c.name AS customer,
    o.order_date,
    p.name AS product,
    oi.quantity,
    oi.unit_price,
    (oi.quantity * oi.unit_price) AS line_total
FROM orders o
INNER JOIN customers c ON o.customer_id = c.id
INNER JOIN order_items oi ON o.id = oi.order_id
INNER JOIN products p ON oi.product_id = p.id
ORDER BY o.order_date, o.id;
```

## LEFT JOIN (LEFT OUTER JOIN)

Returns all rows from the left table, plus matching rows from the right table. Non-matching rows get NULL values.

```sql
-- All customers, including those with no orders
SELECT
    c.name AS customer,
    c.email,
    o.id AS order_id,
    o.order_date
FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id
ORDER BY c.name;
```

Result:
```
 customer        | email            | order_id | order_date
-----------------+------------------+----------+------------
 Alice Johnson   | alice@email.com  |        1 | 2024-01-15
 Alice Johnson   | alice@email.com  |        2 | 2024-02-01
 Bob Smith       | bob@email.com    |        3 | 2024-01-20
 Carol Williams  | carol@email.com  |        4 | 2024-02-10
 David Brown     | david@email.com  |   NULL   | NULL
 Eva Davis       | eva@email.com    |   NULL   | NULL
```

### Finding Records Without Matches

```sql
-- Customers who have never ordered
SELECT c.name, c.email
FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id
WHERE o.id IS NULL;

-- Products that have never been ordered
SELECT p.name, p.price
FROM products p
LEFT JOIN order_items oi ON p.id = oi.product_id
WHERE oi.id IS NULL;
```

## RIGHT JOIN (RIGHT OUTER JOIN)

Returns all rows from the right table, plus matching rows from the left table.

```sql
-- All orders, including guest orders (no customer)
SELECT
    o.id AS order_id,
    o.order_date,
    c.name AS customer_name
FROM customers c
RIGHT JOIN orders o ON c.id = o.customer_id
ORDER BY o.id;
```

Result:
```
 order_id | order_date | customer_name
----------+------------+----------------
        1 | 2024-01-15 | Alice Johnson
        2 | 2024-02-01 | Alice Johnson
        3 | 2024-01-20 | Bob Smith
        4 | 2024-02-10 | Carol Williams
        5 | 2024-02-15 | NULL
```

::: tip LEFT JOIN vs RIGHT JOIN
Most developers prefer LEFT JOIN because it reads more naturally (main table on the left). You can always rewrite a RIGHT JOIN as a LEFT JOIN by swapping the tables.

```sql
-- These are equivalent:
SELECT * FROM A RIGHT JOIN B ON ...
SELECT * FROM B LEFT JOIN A ON ...
```
:::

## FULL OUTER JOIN

Returns all rows from both tables, with NULL where there's no match.

```sql
-- All customers and all orders, showing unmatched on both sides
SELECT
    c.name AS customer,
    o.id AS order_id,
    o.order_date
FROM customers c
FULL OUTER JOIN orders o ON c.id = o.customer_id
ORDER BY c.name, o.id;
```

Result:
```
 customer        | order_id | order_date
-----------------+----------+------------
 Alice Johnson   |        1 | 2024-01-15
 Alice Johnson   |        2 | 2024-02-01
 Bob Smith       |        3 | 2024-01-20
 Carol Williams  |        4 | 2024-02-10
 David Brown     |   NULL   | NULL
 Eva Davis       |   NULL   | NULL
 NULL            |        5 | 2024-02-15
```

## CROSS JOIN

Returns every combination of rows from both tables (Cartesian product).

```sql
-- All possible combinations
SELECT
    c.name AS customer,
    p.name AS product
FROM customers c
CROSS JOIN products p
LIMIT 10;

-- Useful for generating date ranges or all combinations
SELECT
    d.date,
    p.name AS product
FROM (
    SELECT generate_series('2024-01-01'::date, '2024-01-07'::date, '1 day') AS date
) d
CROSS JOIN products p;
```

::: warning Be Careful with CROSS JOIN
CROSS JOIN can produce huge result sets:
- 1,000 rows × 1,000 rows = 1,000,000 rows!
- Always use LIMIT when testing
:::

## Self JOIN

Joining a table to itself - useful for hierarchical data.

```sql
-- Employees table with manager relationship
CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    manager_id INTEGER REFERENCES employees(id)
);

INSERT INTO employees (name, manager_id) VALUES
    ('CEO', NULL),
    ('VP Engineering', 1),
    ('VP Sales', 1),
    ('Dev Lead', 2),
    ('Senior Dev', 4),
    ('Junior Dev', 4),
    ('Sales Manager', 3);

-- List employees with their managers
SELECT
    e.name AS employee,
    m.name AS manager
FROM employees e
LEFT JOIN employees m ON e.manager_id = m.id
ORDER BY e.id;
```

Result:
```
 employee       | manager
----------------+----------------
 CEO            | NULL
 VP Engineering | CEO
 VP Sales       | CEO
 Dev Lead       | VP Engineering
 Senior Dev     | Dev Lead
 Junior Dev     | Dev Lead
 Sales Manager  | VP Sales
```

## JOIN Conditions

### Multiple Conditions

```sql
-- Join on multiple columns
SELECT *
FROM order_items oi
JOIN products p ON oi.product_id = p.id
    AND oi.unit_price = p.price;  -- Only if price hasn't changed

-- Join with additional filters
SELECT c.name, o.order_date
FROM customers c
JOIN orders o ON c.id = o.customer_id
    AND o.status = 'completed';   -- Only completed orders
```

### Non-Equality Joins

```sql
-- Range join: Find applicable discounts
CREATE TABLE discounts (
    id SERIAL PRIMARY KEY,
    min_amount DECIMAL(10, 2),
    max_amount DECIMAL(10, 2),
    discount_percent DECIMAL(5, 2)
);

INSERT INTO discounts (min_amount, max_amount, discount_percent) VALUES
    (0, 99.99, 0),
    (100, 499.99, 5),
    (500, 999.99, 10),
    (1000, 999999, 15);

-- Find discount for each order
SELECT
    o.id AS order_id,
    SUM(oi.quantity * oi.unit_price) AS order_total,
    d.discount_percent
FROM orders o
JOIN order_items oi ON o.id = oi.order_id
JOIN discounts d ON SUM(oi.quantity * oi.unit_price)
    BETWEEN d.min_amount AND d.max_amount
GROUP BY o.id, d.discount_percent;
```

## Practical Examples

### E-Commerce Order Summary

```sql
-- Complete order report
SELECT
    o.id AS order_id,
    c.name AS customer,
    o.order_date,
    o.status,
    COUNT(oi.id) AS item_count,
    SUM(oi.quantity) AS total_items,
    SUM(oi.quantity * oi.unit_price) AS order_total
FROM orders o
LEFT JOIN customers c ON o.customer_id = c.id
LEFT JOIN order_items oi ON o.id = oi.order_id
GROUP BY o.id, c.name, o.order_date, o.status
ORDER BY o.order_date DESC;
```

### Customer Purchase History

```sql
-- What each customer has bought
SELECT
    c.name AS customer,
    STRING_AGG(DISTINCT p.name, ', ' ORDER BY p.name) AS products_purchased,
    COUNT(DISTINCT o.id) AS order_count,
    SUM(oi.quantity * oi.unit_price) AS lifetime_value
FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id
LEFT JOIN order_items oi ON o.id = oi.order_id
LEFT JOIN products p ON oi.product_id = p.id
GROUP BY c.id, c.name
ORDER BY lifetime_value DESC NULLS LAST;
```

### Product Performance Report

```sql
-- Product sales analysis
SELECT
    p.name AS product,
    p.category,
    COALESCE(SUM(oi.quantity), 0) AS units_sold,
    COALESCE(SUM(oi.quantity * oi.unit_price), 0) AS revenue,
    COUNT(DISTINCT o.customer_id) AS unique_customers
FROM products p
LEFT JOIN order_items oi ON p.id = oi.product_id
LEFT JOIN orders o ON oi.order_id = o.id
GROUP BY p.id, p.name, p.category
ORDER BY revenue DESC;
```

## JOIN Performance Tips

::: tip Best Practices

1. **Always use indexes on JOIN columns**
   ```sql
   CREATE INDEX idx_orders_customer_id ON orders(customer_id);
   CREATE INDEX idx_order_items_order_id ON order_items(order_id);
   ```

2. **Filter early with WHERE**
   ```sql
   -- Good: Filter before join
   SELECT * FROM orders o
   JOIN customers c ON o.customer_id = c.id
   WHERE o.order_date > '2024-01-01';
   ```

3. **Select only needed columns**
   ```sql
   -- Good: Specific columns
   SELECT c.name, o.order_date FROM ...

   -- Bad: All columns
   SELECT * FROM ...
   ```

4. **Use EXPLAIN to analyze**
   ```sql
   EXPLAIN ANALYZE
   SELECT ... FROM ... JOIN ...;
   ```
:::

## Common JOIN Mistakes

### Mistake 1: Missing JOIN Condition (Accidental CROSS JOIN)

```sql
-- WRONG: Missing ON clause creates cartesian product!
SELECT * FROM customers, orders;  -- Returns customers × orders rows!

-- CORRECT: Always specify join condition
SELECT * FROM customers c
JOIN orders o ON c.id = o.customer_id;
```

### Mistake 2: Wrong Table in WHERE After LEFT JOIN

```sql
-- WRONG: This effectively converts to INNER JOIN
SELECT c.name, o.order_date
FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id
WHERE o.status = 'completed';  -- Filters out customers with no orders!

-- CORRECT: Include NULL check or move to ON clause
SELECT c.name, o.order_date
FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id
    AND o.status = 'completed';  -- Move condition to ON
```

### Mistake 3: Joining on Wrong Column Types

```sql
-- SLOW: Implicit type conversion
SELECT * FROM users u
JOIN orders o ON u.id = o.user_id::INTEGER;  -- user_id is VARCHAR

-- FAST: Same types, no conversion needed
SELECT * FROM users u
JOIN orders o ON u.id = o.user_id;  -- Both are INTEGER
```

### Mistake 4: N+1 Query Problem

```sql
-- BAD: Running separate queries in a loop (application code)
-- For each customer: SELECT * FROM orders WHERE customer_id = ?

-- GOOD: Single JOIN query
SELECT c.*, o.*
FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id;
```

## Advanced JOIN Patterns

### LATERAL JOIN (Row-by-Row Processing)

```sql
-- Get the 3 most recent orders for each customer
SELECT c.name, recent_orders.*
FROM customers c
CROSS JOIN LATERAL (
    SELECT order_date, total
    FROM orders
    WHERE customer_id = c.id
    ORDER BY order_date DESC
    LIMIT 3
) AS recent_orders;
```

### JOIN with Aggregation

```sql
-- Join on aggregated subquery
SELECT c.name, order_stats.total_orders, order_stats.total_spent
FROM customers c
JOIN (
    SELECT
        customer_id,
        COUNT(*) AS total_orders,
        SUM(total) AS total_spent
    FROM orders
    GROUP BY customer_id
) AS order_stats ON c.id = order_stats.customer_id;
```

## Summary

| JOIN Type | Description | Use Case |
| --------- | ----------- | -------- |
| **INNER** | Only matching rows | Related data that must exist |
| **LEFT** | All left + matching right | Main table with optional data |
| **RIGHT** | All right + matching left | Rarely used (use LEFT instead) |
| **FULL OUTER** | All from both tables | Compare two datasets |
| **CROSS** | All combinations | Generate combinations |
| **SELF** | Table to itself | Hierarchical data |
| **LATERAL** | Row-by-row subquery | Top N per group |

## Quick Reference

```sql
-- INNER JOIN
SELECT * FROM A JOIN B ON A.id = B.a_id;

-- LEFT JOIN (include unmatched from A)
SELECT * FROM A LEFT JOIN B ON A.id = B.a_id;

-- Find unmatched records
SELECT * FROM A LEFT JOIN B ON A.id = B.a_id WHERE B.id IS NULL;

-- Multiple tables
SELECT * FROM A
JOIN B ON A.id = B.a_id
JOIN C ON B.id = C.b_id;

-- Self join
SELECT * FROM A a1 JOIN A a2 ON a1.parent_id = a2.id;
```

## What's Next?

Now let's explore PostgreSQL's powerful built-in functions and learn to create our own!

👉 Continue to [Chapter 7: Functions](./07-functions.md)
