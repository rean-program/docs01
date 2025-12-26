# PostgreSQL Functions

PostgreSQL provides hundreds of built-in functions and allows you to create custom ones. This chapter covers essential built-in functions and how to write your own.

## String Functions

### Common String Operations

```sql
-- Length and case
SELECT
    LENGTH('Hello World') AS length,           -- 11
    UPPER('hello') AS upper,                   -- HELLO
    LOWER('HELLO') AS lower,                   -- hello
    INITCAP('hello world') AS title_case;      -- Hello World

-- Concatenation
SELECT
    'Hello' || ' ' || 'World' AS concat_op,    -- Hello World
    CONCAT('Hello', ' ', 'World') AS concat_fn, -- Hello World
    CONCAT_WS(', ', 'a', 'b', 'c') AS with_sep; -- a, b, c

-- Trimming whitespace
SELECT
    TRIM('  hello  ') AS trimmed,              -- hello
    LTRIM('  hello') AS left_trim,             -- hello
    RTRIM('hello  ') AS right_trim,            -- hello
    TRIM(BOTH 'x' FROM 'xxxhelloxxx') AS custom; -- hello
```

### Substring and Position

```sql
-- Extracting parts
SELECT
    SUBSTRING('Hello World' FROM 1 FOR 5) AS sub1,    -- Hello
    SUBSTRING('Hello World' FROM 7) AS sub2,           -- World
    LEFT('Hello World', 5) AS left_5,                  -- Hello
    RIGHT('Hello World', 5) AS right_5;                -- World

-- Finding positions
SELECT
    POSITION('World' IN 'Hello World') AS pos,         -- 7
    STRPOS('Hello World', 'World') AS strpos;          -- 7

-- Splitting strings
SELECT
    SPLIT_PART('a,b,c,d', ',', 2) AS part2,           -- b
    STRING_TO_ARRAY('a,b,c', ',') AS arr;              -- {a,b,c}
```

### Search and Replace

```sql
-- Replace text
SELECT
    REPLACE('Hello World', 'World', 'PostgreSQL') AS replaced,
    TRANSLATE('hello', 'helo', 'HELO') AS translated;  -- HELLO

-- Pattern matching with regex
SELECT
    REGEXP_REPLACE('abc123def456', '[0-9]+', 'X', 'g') AS no_nums,  -- abcXdefX
    REGEXP_MATCHES('abc123def456', '[0-9]+', 'g') AS matches;       -- {123}, {456}
```

### Practical String Examples

```sql
-- Format phone number
SELECT REGEXP_REPLACE('1234567890', '(\d{3})(\d{3})(\d{4})', '(\1) \2-\3');
-- Result: (123) 456-7890

-- Extract email domain
SELECT SPLIT_PART('user@example.com', '@', 2);
-- Result: example.com

-- Generate slug from title
SELECT LOWER(REGEXP_REPLACE(TRIM('  Hello World!  '), '[^a-zA-Z0-9]+', '-', 'g'));
-- Result: hello-world-
```

## Numeric Functions

### Basic Math

```sql
SELECT
    ABS(-15) AS absolute,           -- 15
    CEIL(4.2) AS ceiling,           -- 5
    FLOOR(4.8) AS floor_val,        -- 4
    ROUND(4.567, 2) AS rounded,     -- 4.57
    TRUNC(4.567, 2) AS truncated,   -- 4.56
    MOD(17, 5) AS modulo,           -- 2
    POWER(2, 10) AS power,          -- 1024
    SQRT(16) AS square_root;        -- 4
```

### Random Numbers

```sql
-- Random float between 0 and 1
SELECT RANDOM();

-- Random integer between 1 and 100
SELECT FLOOR(RANDOM() * 100) + 1;

-- Random selection from table
SELECT * FROM products ORDER BY RANDOM() LIMIT 1;

-- Generate random string
SELECT MD5(RANDOM()::TEXT);
```

### Statistical Functions

```sql
SELECT
    AVG(salary) AS average,
    STDDEV(salary) AS std_deviation,
    VARIANCE(salary) AS variance,
    PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY salary) AS median
FROM employees;
```

## Date and Time Functions

### Current Date/Time

```sql
SELECT
    CURRENT_DATE,                    -- 2024-01-15
    CURRENT_TIME,                    -- 14:30:00.123456
    CURRENT_TIMESTAMP,               -- 2024-01-15 14:30:00.123456+00
    NOW(),                           -- Same as CURRENT_TIMESTAMP
    LOCALTIME,                       -- Time without timezone
    LOCALTIMESTAMP;                  -- Timestamp without timezone
```

### Date Arithmetic

```sql
-- Add/subtract intervals
SELECT
    NOW() + INTERVAL '1 day' AS tomorrow,
    NOW() - INTERVAL '1 week' AS last_week,
    NOW() + INTERVAL '1 month 2 days' AS future,
    CURRENT_DATE + 30 AS thirty_days;

-- Difference between dates
SELECT
    AGE('2024-06-15', '2024-01-01') AS age_diff,      -- 5 mons 14 days
    '2024-06-15'::DATE - '2024-01-01'::DATE AS days;  -- 166
```

### Extracting Date Parts

```sql
SELECT
    EXTRACT(YEAR FROM NOW()) AS year,
    EXTRACT(MONTH FROM NOW()) AS month,
    EXTRACT(DAY FROM NOW()) AS day,
    EXTRACT(DOW FROM NOW()) AS day_of_week,   -- 0=Sunday
    EXTRACT(DOY FROM NOW()) AS day_of_year,
    EXTRACT(WEEK FROM NOW()) AS week_number,
    EXTRACT(HOUR FROM NOW()) AS hour,
    EXTRACT(EPOCH FROM NOW()) AS unix_timestamp;

-- Shorthand
SELECT
    DATE_PART('year', NOW()) AS year,
    DATE_PART('month', NOW()) AS month;
```

### Date Formatting

```sql
-- Format dates to strings
SELECT
    TO_CHAR(NOW(), 'YYYY-MM-DD') AS iso_date,
    TO_CHAR(NOW(), 'DD/MM/YYYY') AS euro_date,
    TO_CHAR(NOW(), 'Month DD, YYYY') AS pretty,
    TO_CHAR(NOW(), 'Day') AS day_name,
    TO_CHAR(NOW(), 'HH12:MI:SS AM') AS time_12hr,
    TO_CHAR(NOW(), 'HH24:MI:SS') AS time_24hr;

-- Parse strings to dates
SELECT
    TO_DATE('2024-01-15', 'YYYY-MM-DD') AS parsed_date,
    TO_TIMESTAMP('2024-01-15 14:30:00', 'YYYY-MM-DD HH24:MI:SS') AS parsed_ts;
```

### Date Truncation

```sql
-- Truncate to start of period
SELECT
    DATE_TRUNC('year', NOW()) AS year_start,
    DATE_TRUNC('month', NOW()) AS month_start,
    DATE_TRUNC('week', NOW()) AS week_start,
    DATE_TRUNC('day', NOW()) AS day_start,
    DATE_TRUNC('hour', NOW()) AS hour_start;
```

### Practical Date Examples

```sql
-- Monthly report
SELECT
    DATE_TRUNC('month', order_date) AS month,
    COUNT(*) AS order_count,
    SUM(total) AS revenue
FROM orders
GROUP BY DATE_TRUNC('month', order_date)
ORDER BY month;

-- Orders from last 7 days
SELECT * FROM orders
WHERE order_date >= CURRENT_DATE - INTERVAL '7 days';

-- Age calculation
SELECT
    name,
    birth_date,
    EXTRACT(YEAR FROM AGE(birth_date)) AS age
FROM users;
```

## Conditional Functions

### CASE Expressions

```sql
-- Simple CASE
SELECT
    name,
    salary,
    CASE
        WHEN salary >= 100000 THEN 'Senior'
        WHEN salary >= 70000 THEN 'Mid-Level'
        WHEN salary >= 40000 THEN 'Junior'
        ELSE 'Entry'
    END AS level
FROM employees;

-- CASE with aggregation
SELECT
    COUNT(*) AS total,
    COUNT(CASE WHEN status = 'completed' THEN 1 END) AS completed,
    COUNT(CASE WHEN status = 'pending' THEN 1 END) AS pending
FROM orders;
```

### COALESCE and NULLIF

```sql
-- COALESCE: Return first non-null value
SELECT
    COALESCE(phone, email, 'No contact') AS contact
FROM customers;

-- Practical: Default values
SELECT
    name,
    COALESCE(nickname, name) AS display_name,
    COALESCE(bio, 'No bio provided') AS biography
FROM users;

-- NULLIF: Return NULL if values are equal
SELECT NULLIF(10, 10);  -- NULL
SELECT NULLIF(10, 5);   -- 10

-- Prevent division by zero
SELECT total / NULLIF(count, 0) AS average
FROM stats;
```

### GREATEST and LEAST

```sql
SELECT
    GREATEST(10, 20, 5, 15) AS max_val,   -- 20
    LEAST(10, 20, 5, 15) AS min_val;      -- 5

-- Practical: Ensure minimum order amount
SELECT
    order_id,
    GREATEST(subtotal, 10.00) AS amount  -- Minimum $10
FROM orders;
```

## JSON Functions

### Creating JSON

```sql
-- Build JSON objects
SELECT
    JSON_BUILD_OBJECT(
        'name', 'John',
        'age', 30,
        'active', true
    ) AS json_obj;
-- {"name": "John", "age": 30, "active": true}

-- Build JSON arrays
SELECT JSON_BUILD_ARRAY(1, 2, 'three', true) AS json_arr;
-- [1, 2, "three", true]

-- Convert row to JSON
SELECT ROW_TO_JSON(employees) FROM employees LIMIT 1;

-- Aggregate rows to JSON array
SELECT JSON_AGG(ROW_TO_JSON(e))
FROM (SELECT id, name FROM employees) e;
```

### Querying JSON

```sql
-- Sample data
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name TEXT,
    data JSONB
);

INSERT INTO products (name, data) VALUES
('Laptop', '{"brand": "Dell", "specs": {"ram": 16, "storage": 512}}');

-- Access JSON fields
SELECT
    data->>'brand' AS brand,                    -- Dell (as text)
    data->'specs' AS specs,                     -- {"ram": 16, "storage": 512}
    data->'specs'->>'ram' AS ram,               -- 16 (as text)
    (data->'specs'->>'ram')::INTEGER AS ram_int -- 16 (as integer)
FROM products;

-- Check for key existence
SELECT * FROM products WHERE data ? 'brand';

-- Path queries
SELECT data #>> '{specs, ram}' FROM products;  -- 16
```

### Modifying JSON

```sql
-- Add/update field
UPDATE products
SET data = data || '{"warranty": "2 years"}'::jsonb
WHERE id = 1;

-- Set nested value
UPDATE products
SET data = jsonb_set(data, '{specs, ram}', '32')
WHERE id = 1;

-- Remove field
UPDATE products
SET data = data - 'warranty'
WHERE id = 1;
```

## Array Functions

```sql
-- Create arrays
SELECT ARRAY[1, 2, 3, 4, 5] AS arr;
SELECT ARRAY_AGG(name) FROM employees;

-- Array operations
SELECT
    ARRAY_LENGTH(ARRAY[1,2,3], 1) AS len,      -- 3
    ARRAY_APPEND(ARRAY[1,2], 3) AS appended,   -- {1,2,3}
    ARRAY_PREPEND(0, ARRAY[1,2]) AS prepended, -- {0,1,2}
    ARRAY_CAT(ARRAY[1,2], ARRAY[3,4]) AS concat, -- {1,2,3,4}
    ARRAY_REMOVE(ARRAY[1,2,2,3], 2) AS removed; -- {1,3}

-- Check membership
SELECT 2 = ANY(ARRAY[1,2,3]) AS contains_2;    -- true
SELECT ARRAY[1,2] <@ ARRAY[1,2,3,4] AS is_subset; -- true

-- Unnest: Convert array to rows
SELECT UNNEST(ARRAY['a', 'b', 'c']) AS letter;
```

## Creating Custom Functions

### Basic Function Syntax

```sql
CREATE OR REPLACE FUNCTION function_name(parameters)
RETURNS return_type
LANGUAGE plpgsql  -- or sql
AS $$
BEGIN
    -- Function body
    RETURN result;
END;
$$;
```

### Simple SQL Functions

```sql
-- Function to calculate tax
CREATE OR REPLACE FUNCTION calculate_tax(amount DECIMAL, rate DECIMAL DEFAULT 0.1)
RETURNS DECIMAL
LANGUAGE SQL
AS $$
    SELECT amount * rate;
$$;

-- Usage
SELECT calculate_tax(100);        -- 10.00
SELECT calculate_tax(100, 0.15);  -- 15.00

-- Function to get full name
CREATE OR REPLACE FUNCTION full_name(first_name TEXT, last_name TEXT)
RETURNS TEXT
LANGUAGE SQL
AS $$
    SELECT INITCAP(first_name) || ' ' || INITCAP(last_name);
$$;

SELECT full_name('john', 'DOE');  -- John Doe
```

### PL/pgSQL Functions

```sql
-- Function with logic
CREATE OR REPLACE FUNCTION get_price_category(price DECIMAL)
RETURNS TEXT
LANGUAGE plpgsql
AS $$
BEGIN
    IF price < 50 THEN
        RETURN 'Budget';
    ELSIF price < 200 THEN
        RETURN 'Mid-Range';
    ELSIF price < 1000 THEN
        RETURN 'Premium';
    ELSE
        RETURN 'Luxury';
    END IF;
END;
$$;

SELECT name, price, get_price_category(price)
FROM products;
```

### Functions Returning Tables

```sql
-- Return multiple rows
CREATE OR REPLACE FUNCTION get_top_customers(limit_count INTEGER DEFAULT 5)
RETURNS TABLE(
    customer_name TEXT,
    total_orders BIGINT,
    total_spent DECIMAL
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        c.name,
        COUNT(o.id),
        COALESCE(SUM(oi.quantity * oi.unit_price), 0)
    FROM customers c
    LEFT JOIN orders o ON c.id = o.customer_id
    LEFT JOIN order_items oi ON o.id = oi.order_id
    GROUP BY c.id, c.name
    ORDER BY COALESCE(SUM(oi.quantity * oi.unit_price), 0) DESC
    LIMIT limit_count;
END;
$$;

-- Usage
SELECT * FROM get_top_customers(10);
```

### Functions with Loops

```sql
-- Generate date range
CREATE OR REPLACE FUNCTION generate_date_range(
    start_date DATE,
    end_date DATE
)
RETURNS TABLE(date_value DATE)
LANGUAGE plpgsql
AS $$
DECLARE
    current_date DATE := start_date;
BEGIN
    WHILE current_date <= end_date LOOP
        date_value := current_date;
        RETURN NEXT;
        current_date := current_date + INTERVAL '1 day';
    END LOOP;
END;
$$;

SELECT * FROM generate_date_range('2024-01-01', '2024-01-07');
```

### Error Handling

```sql
CREATE OR REPLACE FUNCTION safe_divide(a DECIMAL, b DECIMAL)
RETURNS DECIMAL
LANGUAGE plpgsql
AS $$
BEGIN
    IF b = 0 THEN
        RAISE EXCEPTION 'Division by zero is not allowed';
    END IF;
    RETURN a / b;
EXCEPTION
    WHEN division_by_zero THEN
        RAISE NOTICE 'Caught division by zero';
        RETURN NULL;
END;
$$;
```

## Real-World Function Examples

### Slug Generator

```sql
CREATE OR REPLACE FUNCTION generate_slug(title TEXT)
RETURNS TEXT
LANGUAGE SQL
IMMUTABLE
AS $$
    SELECT LOWER(
        REGEXP_REPLACE(
            REGEXP_REPLACE(
                TRIM(title),
                '[^a-zA-Z0-9\s-]', '', 'g'  -- Remove special chars
            ),
            '\s+', '-', 'g'  -- Replace spaces with hyphens
        )
    );
$$;

-- Usage
SELECT generate_slug('Hello World! This is a Test');
-- Result: 'hello-world-this-is-a-test'
```

### Audit Trigger Function

```sql
-- Create audit table
CREATE TABLE audit_log (
    id SERIAL PRIMARY KEY,
    table_name TEXT,
    operation TEXT,
    old_data JSONB,
    new_data JSONB,
    changed_by TEXT DEFAULT current_user,
    changed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create trigger function
CREATE OR REPLACE FUNCTION audit_trigger()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        INSERT INTO audit_log (table_name, operation, old_data)
        VALUES (TG_TABLE_NAME, TG_OP, row_to_json(OLD)::jsonb);
        RETURN OLD;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO audit_log (table_name, operation, old_data, new_data)
        VALUES (TG_TABLE_NAME, TG_OP, row_to_json(OLD)::jsonb, row_to_json(NEW)::jsonb);
        RETURN NEW;
    ELSIF TG_OP = 'INSERT' THEN
        INSERT INTO audit_log (table_name, operation, new_data)
        VALUES (TG_TABLE_NAME, TG_OP, row_to_json(NEW)::jsonb);
        RETURN NEW;
    END IF;
END;
$$;

-- Apply to a table
CREATE TRIGGER users_audit
AFTER INSERT OR UPDATE OR DELETE ON users
FOR EACH ROW EXECUTE FUNCTION audit_trigger();
```

### Updated_at Trigger

```sql
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- Apply to any table with updated_at column
CREATE TRIGGER set_updated_at
BEFORE UPDATE ON products
FOR EACH ROW EXECUTE FUNCTION update_modified_column();
```

### Search Function with Ranking

```sql
CREATE OR REPLACE FUNCTION search_articles(search_query TEXT)
RETURNS TABLE(
    id INTEGER,
    title TEXT,
    excerpt TEXT,
    relevance REAL
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        a.id,
        a.title,
        LEFT(a.content, 200) || '...' AS excerpt,
        ts_rank(
            to_tsvector('english', a.title || ' ' || a.content),
            plainto_tsquery('english', search_query)
        ) AS relevance
    FROM articles a
    WHERE to_tsvector('english', a.title || ' ' || a.content)
        @@ plainto_tsquery('english', search_query)
    ORDER BY relevance DESC
    LIMIT 20;
END;
$$;

-- Usage
SELECT * FROM search_articles('postgresql tutorial');
```

## Function Best Practices

::: tip When to Use Functions

1. **Reusable logic** - Complex calculations used in multiple places
2. **Data validation** - Custom constraints beyond CHECK
3. **Audit trails** - Automatic logging with triggers
4. **API abstraction** - Hide complex queries behind simple interfaces
5. **Security** - Execute with definer rights (SECURITY DEFINER)
:::

::: warning Function Pitfalls

1. **Avoid SELECT *** in functions - breaks if schema changes
2. **Use IMMUTABLE/STABLE/VOLATILE** correctly for optimization
3. **Handle NULL inputs** - unexpected NULLs cause issues
4. **Test error handling** - use EXCEPTION blocks wisely
5. **Consider performance** - PL/pgSQL is slower than pure SQL
:::

```sql
-- Function volatility categories:
-- IMMUTABLE: Always returns same result for same inputs (can be cached)
-- STABLE: Returns same result within single query (current_timestamp)
-- VOLATILE: Can return different results (random(), sequences)

CREATE OR REPLACE FUNCTION calculate_tax(amount DECIMAL)
RETURNS DECIMAL
LANGUAGE SQL
IMMUTABLE  -- Safe to cache, no side effects
AS $$
    SELECT amount * 0.10;
$$;
```

## Summary

| Category | Key Functions |
| -------- | ------------- |
| **String** | LENGTH, UPPER, LOWER, SUBSTRING, CONCAT, REPLACE |
| **Numeric** | ROUND, CEIL, FLOOR, ABS, MOD, RANDOM |
| **Date/Time** | NOW, EXTRACT, DATE_TRUNC, AGE, TO_CHAR |
| **Conditional** | CASE, COALESCE, NULLIF, GREATEST, LEAST |
| **JSON** | JSON_BUILD_OBJECT, ->, ->>, jsonb_set |
| **Array** | ARRAY_AGG, UNNEST, ANY, ARRAY_LENGTH |
| **Custom** | CREATE FUNCTION, triggers, RETURNS TABLE |

## What's Next?

Now let's learn how to optimize query performance with indexes!

👉 Continue to [Chapter 8: Indexes](./08-indexes.md)
