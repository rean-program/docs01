# PostgreSQL Data Types

PostgreSQL offers a rich variety of data types. Choosing the right type ensures data integrity, optimizes storage, and improves query performance. This chapter covers all essential data types with practical examples.

## Why Data Types Matter

```
┌─────────────────────────────────────────────────────────────────┐
│                   Importance of Data Types                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   ✅ Data Integrity    - Prevents invalid data from being stored│
│   ✅ Storage Efficiency - Uses appropriate amount of space      │
│   ✅ Query Performance  - Faster comparisons and calculations   │
│   ✅ Clear Intent       - Documents what data is expected       │
│                                                                  │
│   Example:                                                       │
│   email VARCHAR(255)  → Only text, max 255 characters           │
│   age INTEGER         → Only whole numbers                       │
│   price DECIMAL(10,2) → Numbers with 2 decimal places           │
│   is_active BOOLEAN   → Only true or false                      │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Numeric Types

### Integer Types

| Type | Storage | Range | Use Case |
|------|---------|-------|----------|
| `SMALLINT` | 2 bytes | -32,768 to 32,767 | Age, small counts |
| `INTEGER` | 4 bytes | -2.1 billion to 2.1 billion | Most integer needs |
| `BIGINT` | 8 bytes | -9.2 quintillion to 9.2 quintillion | Large IDs, big data |

```sql
-- Creating a table with integer types
CREATE TABLE product_inventory (
    id INTEGER PRIMARY KEY,
    quantity SMALLINT,           -- Small numbers
    views INTEGER,               -- Medium numbers
    total_sold BIGINT           -- Large numbers
);

-- SERIAL: Auto-incrementing integer
CREATE TABLE users (
    id SERIAL PRIMARY KEY,       -- Auto-generates: 1, 2, 3, ...
    name VARCHAR(100)
);

-- BIGSERIAL for large tables
CREATE TABLE events (
    id BIGSERIAL PRIMARY KEY,    -- For billions of rows
    event_name VARCHAR(200)
);
```

### Decimal Types

| Type | Description | Precision | Use Case |
|------|-------------|-----------|----------|
| `DECIMAL(p,s)` | Exact precision | User-defined | Money, precise calculations |
| `NUMERIC(p,s)` | Same as DECIMAL | User-defined | Same as DECIMAL |
| `REAL` | 4-byte floating point | 6 decimal digits | Scientific (approximate) |
| `DOUBLE PRECISION` | 8-byte floating point | 15 decimal digits | Scientific (approximate) |

```sql
-- DECIMAL/NUMERIC for money (exact precision)
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    price DECIMAL(10, 2),        -- Up to 99999999.99
    tax_rate DECIMAL(5, 4)       -- Up to 9.9999 (like 0.0825)
);

-- Insert examples
INSERT INTO products (name, price, tax_rate) VALUES
    ('Laptop', 999.99, 0.0825),
    ('Mouse', 29.50, 0.0825);

-- Precise calculations
SELECT
    name,
    price,
    price * tax_rate AS tax,
    price + (price * tax_rate) AS total
FROM products;
```

::: warning Avoid FLOAT for Money
Never use `REAL` or `DOUBLE PRECISION` for money! Floating-point numbers can have rounding errors.

```sql
-- BAD: Can cause rounding errors
price REAL  -- 0.1 + 0.2 might not equal 0.3

-- GOOD: Exact precision
price DECIMAL(10, 2)
```
:::

## Text Types

### Character Types

| Type | Description | Use Case |
|------|-------------|----------|
| `CHAR(n)` | Fixed length, padded with spaces | Fixed codes (country, status) |
| `VARCHAR(n)` | Variable length, max n characters | Most text fields |
| `TEXT` | Unlimited length | Long content |

```sql
CREATE TABLE articles (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200),          -- Up to 200 characters
    slug VARCHAR(100),           -- URL-friendly title
    status CHAR(1),              -- 'D'raft, 'P'ublished, 'A'rchived
    content TEXT,                -- Full article body
    summary VARCHAR(500)
);

-- Examples
INSERT INTO articles (title, slug, status, content, summary)
VALUES (
    'Getting Started with PostgreSQL',
    'getting-started-postgresql',
    'P',
    'This is the full article content that can be very long...',
    'A quick introduction to PostgreSQL basics.'
);
```

### Text Operations

```sql
-- String functions
SELECT
    UPPER(name) AS uppercase,
    LOWER(email) AS lowercase,
    LENGTH(name) AS name_length,
    CONCAT(first_name, ' ', last_name) AS full_name,
    SUBSTRING(phone FROM 1 FOR 3) AS area_code
FROM users;

-- Pattern matching
SELECT * FROM users WHERE email LIKE '%@gmail.com';
SELECT * FROM users WHERE name ILIKE 'john%';  -- Case insensitive
```

## Date and Time Types

### Available Types

| Type | Storage | Description | Example |
|------|---------|-------------|---------|
| `DATE` | 4 bytes | Date only | '2024-01-15' |
| `TIME` | 8 bytes | Time only | '14:30:00' |
| `TIMESTAMP` | 8 bytes | Date and time | '2024-01-15 14:30:00' |
| `TIMESTAMPTZ` | 8 bytes | With timezone | '2024-01-15 14:30:00+07' |
| `INTERVAL` | 16 bytes | Time duration | '1 year 2 months' |

```sql
CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200),
    event_date DATE,
    start_time TIME,
    created_at TIMESTAMP DEFAULT NOW(),
    scheduled_at TIMESTAMPTZ,
    duration INTERVAL
);

-- Insert with various date/time formats
INSERT INTO events (name, event_date, start_time, scheduled_at, duration)
VALUES (
    'Team Meeting',
    '2024-03-15',
    '09:00:00',
    '2024-03-15 09:00:00+07:00',
    '2 hours'
);

-- Date arithmetic
SELECT
    event_date,
    event_date + INTERVAL '1 week' AS next_week,
    event_date - INTERVAL '1 month' AS last_month,
    scheduled_at + duration AS end_time,
    AGE(event_date, CURRENT_DATE) AS days_until
FROM events;
```

### Common Date Functions

```sql
-- Current date/time
SELECT
    CURRENT_DATE,                     -- 2024-01-15
    CURRENT_TIME,                     -- 14:30:00.123456
    CURRENT_TIMESTAMP,                -- 2024-01-15 14:30:00.123456
    NOW();                            -- Same as CURRENT_TIMESTAMP

-- Extract parts
SELECT
    EXTRACT(YEAR FROM created_at) AS year,
    EXTRACT(MONTH FROM created_at) AS month,
    EXTRACT(DAY FROM created_at) AS day,
    EXTRACT(HOUR FROM created_at) AS hour,
    EXTRACT(DOW FROM created_at) AS day_of_week  -- 0=Sunday
FROM events;

-- Format dates
SELECT
    TO_CHAR(created_at, 'YYYY-MM-DD') AS iso_date,
    TO_CHAR(created_at, 'Month DD, YYYY') AS pretty_date,
    TO_CHAR(created_at, 'HH12:MI AM') AS time_12hr
FROM events;

-- Date truncation
SELECT
    DATE_TRUNC('month', created_at) AS month_start,
    DATE_TRUNC('year', created_at) AS year_start,
    DATE_TRUNC('hour', created_at) AS hour_start
FROM events;
```

::: tip Use TIMESTAMPTZ
Always use `TIMESTAMPTZ` instead of `TIMESTAMP` for real applications. It handles timezone conversions automatically and prevents timezone-related bugs.

```sql
-- PostgreSQL converts to/from UTC automatically
SET timezone = 'Asia/Phnom_Penh';
SELECT '2024-01-15 09:00:00+00'::timestamptz;
-- Shows: 2024-01-15 16:00:00+07
```
:::

## Boolean Type

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE,
    is_active BOOLEAN DEFAULT true,
    is_admin BOOLEAN DEFAULT false,
    email_verified BOOLEAN DEFAULT false
);

-- Boolean values: true, false, NULL
INSERT INTO users (email, is_active, is_admin, email_verified)
VALUES
    ('admin@example.com', true, true, true),
    ('user@example.com', true, false, false),
    ('inactive@example.com', false, false, true);

-- Querying booleans
SELECT * FROM users WHERE is_active;           -- Same as is_active = true
SELECT * FROM users WHERE NOT is_admin;        -- Same as is_admin = false
SELECT * FROM users WHERE is_active AND email_verified;
```

## UUID Type

UUID (Universally Unique Identifier) is perfect for distributed systems or when you don't want sequential IDs.

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE sessions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ
);

-- Insert (UUID generated automatically)
INSERT INTO sessions (user_id, expires_at)
VALUES (1, NOW() + INTERVAL '24 hours')
RETURNING id;

-- Result: id = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'
```

## JSON Types

PostgreSQL has excellent JSON support with two types:

| Type | Description | Use Case |
|------|-------------|----------|
| `JSON` | Stores as text, validates on insert | Infrequent access |
| `JSONB` | Binary format, supports indexing | Frequent queries (recommended) |

```sql
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200),
    attributes JSONB,
    metadata JSON
);

-- Insert JSON data
INSERT INTO products (name, attributes, metadata) VALUES
(
    'Gaming Laptop',
    '{
        "brand": "TechPro",
        "specs": {
            "cpu": "Intel i9",
            "ram": "32GB",
            "storage": "1TB SSD"
        },
        "colors": ["black", "silver"],
        "in_stock": true,
        "price": 1299.99
    }',
    '{"created_by": "admin", "version": 1}'
);
```

### Querying JSON Data

```sql
-- Access JSON fields
SELECT
    name,
    attributes->>'brand' AS brand,              -- Get as text
    attributes->'specs'->>'cpu' AS cpu,         -- Nested access
    attributes->'specs' AS all_specs,           -- Get as JSON
    attributes->'colors'->0 AS first_color      -- Array access
FROM products;

-- Filter by JSON values
SELECT * FROM products
WHERE attributes->>'brand' = 'TechPro';

SELECT * FROM products
WHERE (attributes->'specs'->>'ram')::integer >= 16;

-- Check if key exists
SELECT * FROM products
WHERE attributes ? 'colors';

-- Check if value is in array
SELECT * FROM products
WHERE attributes->'colors' ? 'black';

-- Update JSON fields
UPDATE products
SET attributes = jsonb_set(attributes, '{price}', '1199.99')
WHERE id = 1;

-- Add new key
UPDATE products
SET attributes = attributes || '{"warranty": "2 years"}'::jsonb
WHERE id = 1;
```

::: tip JSONB vs JSON
Always prefer `JSONB` over `JSON`:
- JSONB is faster for queries
- JSONB supports indexing
- JSONB removes duplicate keys and whitespace
- JSON only validates and stores as text
:::

## Array Types

PostgreSQL supports arrays of any data type.

```sql
CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200),
    tags TEXT[],
    ratings INTEGER[],
    view_history TIMESTAMP[]
);

-- Insert arrays
INSERT INTO posts (title, tags, ratings) VALUES
    ('PostgreSQL Tips', ARRAY['database', 'postgresql', 'tutorial'], ARRAY[5, 4, 5, 5]),
    ('Web Development', '{"html", "css", "javascript"}', '{4, 3, 5}');

-- Query arrays
SELECT
    title,
    tags[1] AS first_tag,           -- Arrays are 1-indexed
    array_length(tags, 1) AS tag_count,
    'postgresql' = ANY(tags) AS has_postgresql_tag
FROM posts;

-- Filter by array contents
SELECT * FROM posts WHERE 'database' = ANY(tags);
SELECT * FROM posts WHERE tags @> ARRAY['postgresql'];  -- Contains

-- Array functions
SELECT
    array_append(tags, 'new_tag') AS with_new_tag,
    array_remove(tags, 'tutorial') AS without_tutorial,
    array_cat(tags, ARRAY['extra1', 'extra2']) AS combined
FROM posts;

-- Unnest: Convert array to rows
SELECT id, title, unnest(tags) AS tag FROM posts;
```

## Enum Types

Enums ensure values come from a predefined list.

```sql
-- Create enum type
CREATE TYPE order_status AS ENUM (
    'pending',
    'processing',
    'shipped',
    'delivered',
    'cancelled'
);

CREATE TYPE priority_level AS ENUM ('low', 'medium', 'high', 'critical');

-- Use in table
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER,
    status order_status DEFAULT 'pending',
    priority priority_level DEFAULT 'medium',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert (only valid enum values allowed)
INSERT INTO orders (customer_id, status, priority)
VALUES (1, 'processing', 'high');

-- Invalid value causes error
-- INSERT INTO orders (status) VALUES ('invalid'); -- Error!

-- Query
SELECT * FROM orders WHERE status = 'pending';
SELECT * FROM orders WHERE priority IN ('high', 'critical');

-- Add new value to enum
ALTER TYPE order_status ADD VALUE 'refunded' AFTER 'cancelled';
```

## Network Types

PostgreSQL has specialized types for network data.

```sql
CREATE TABLE server_logs (
    id SERIAL PRIMARY KEY,
    client_ip INET,
    server_network CIDR,
    mac_address MACADDR,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO server_logs (client_ip, server_network, mac_address)
VALUES (
    '192.168.1.100',
    '192.168.1.0/24',
    '08:00:2b:01:02:03'
);

-- Network operations
SELECT
    client_ip,
    host(client_ip) AS ip_text,
    client_ip << '192.168.0.0/16' AS is_private,  -- Is contained in
    network(server_network) AS network_address
FROM server_logs;
```

## Special Types

### Money Type

```sql
CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    amount MONEY,
    currency CHAR(3) DEFAULT 'USD'
);

INSERT INTO transactions (amount) VALUES ('$1,234.56');

SELECT
    amount,
    amount::numeric AS as_number
FROM transactions;
```

### Geometric Types

```sql
CREATE TABLE locations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    coordinates POINT,
    boundary POLYGON
);

INSERT INTO locations (name, coordinates)
VALUES ('Office', POINT(11.5564, 104.9282));

-- Calculate distance
SELECT
    a.name,
    b.name,
    a.coordinates <-> b.coordinates AS distance
FROM locations a, locations b
WHERE a.id != b.id;
```

## Type Conversion

```sql
-- Explicit casting
SELECT
    '100'::INTEGER,
    '3.14'::DECIMAL,
    '2024-01-15'::DATE,
    'true'::BOOLEAN,
    123::TEXT;

-- Using CAST
SELECT CAST('100' AS INTEGER);

-- Common conversions
SELECT
    price::TEXT || ' USD' AS price_text,
    created_at::DATE AS date_only,
    (views::DECIMAL / 1000)::DECIMAL(10,1) AS views_k
FROM products;
```

## Summary

| Category | Types | Use Case |
|----------|-------|----------|
| **Numbers** | INTEGER, BIGINT, DECIMAL | Counts, IDs, money |
| **Text** | VARCHAR, TEXT | Names, content |
| **Date/Time** | DATE, TIMESTAMPTZ, INTERVAL | Scheduling, logs |
| **Boolean** | BOOLEAN | Flags, toggles |
| **UUID** | UUID | Distributed IDs |
| **JSON** | JSONB | Flexible data |
| **Arrays** | type[] | Multiple values |
| **Enum** | Custom | Limited choices |

## Common Type Conversion Pitfalls

### Silent Truncation

```sql
-- VARCHAR truncates without warning in some modes
CREATE TABLE test (name VARCHAR(5));
INSERT INTO test VALUES ('Hello World');  -- Error: value too long!

-- TEXT has no limit
CREATE TABLE test2 (name TEXT);
INSERT INTO test2 VALUES ('Hello World');  -- Works fine
```

### Numeric Precision Loss

```sql
-- REAL/FLOAT loses precision
SELECT 0.1::REAL + 0.2::REAL = 0.3::REAL;  -- false!
SELECT 0.1::REAL + 0.2::REAL;               -- 0.30000001192092896

-- DECIMAL maintains precision
SELECT 0.1::DECIMAL + 0.2::DECIMAL = 0.3::DECIMAL;  -- true
```

### Date/Time Pitfalls

```sql
-- TIMESTAMP vs TIMESTAMPTZ
SET timezone = 'America/New_York';

-- Without timezone (dangerous!)
SELECT '2024-01-15 12:00:00'::TIMESTAMP;
-- Returns: 2024-01-15 12:00:00 (no timezone info)

-- With timezone (recommended)
SELECT '2024-01-15 12:00:00'::TIMESTAMPTZ;
-- Returns: 2024-01-15 12:00:00-05 (includes timezone)
```

### JSON vs JSONB Gotchas

```sql
-- JSON preserves everything (including duplicates)
SELECT '{"a": 1, "a": 2}'::JSON;  -- {"a": 1, "a": 2}

-- JSONB removes duplicates (keeps last value)
SELECT '{"a": 1, "a": 2}'::JSONB;  -- {"a": 2}

-- JSONB doesn't preserve key order
SELECT '{"z": 1, "a": 2}'::JSONB;  -- {"a": 2, "z": 1}
```

## Real-World Type Selection Guide

```
┌─────────────────────────────────────────────────────────────────┐
│                   Type Selection Decision Tree                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   Storing Money?                                                 │
│   └── YES → DECIMAL(19,4) or NUMERIC(19,4)                      │
│                                                                  │
│   Storing IDs?                                                   │
│   └── Distributed System → UUID                                 │
│   └── Single Database → SERIAL/BIGSERIAL                        │
│                                                                  │
│   Storing Dates/Times?                                           │
│   └── Date only → DATE                                          │
│   └── With time → TIMESTAMPTZ (always!)                         │
│   └── Duration → INTERVAL                                        │
│                                                                  │
│   Storing Text?                                                  │
│   └── Fixed length (country codes) → CHAR(n)                    │
│   └── Known max length → VARCHAR(n)                             │
│   └── Unknown/variable length → TEXT                            │
│                                                                  │
│   Storing Flexible Data?                                         │
│   └── Need to query it → JSONB                                  │
│   └── Just store/retrieve → JSON                                │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## PostgreSQL-Specific Types Worth Knowing

### Range Types

```sql
-- Built-in range types for intervals
CREATE TABLE reservations (
    id SERIAL PRIMARY KEY,
    room_id INTEGER,
    during TSTZRANGE,  -- Timestamp range
    EXCLUDE USING GIST (room_id WITH =, during WITH &&)  -- No overlaps!
);

-- Insert a reservation
INSERT INTO reservations (room_id, during) VALUES
    (1, '[2024-01-15 14:00, 2024-01-15 16:00)');

-- Query overlapping reservations
SELECT * FROM reservations
WHERE during && '[2024-01-15 15:00, 2024-01-15 17:00)';
```

### Domain Types (Custom Validation)

```sql
-- Create a domain for email validation
CREATE DOMAIN email AS VARCHAR(255)
CHECK (VALUE ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

-- Use in table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    user_email email NOT NULL  -- Automatically validates!
);

-- This works
INSERT INTO users (user_email) VALUES ('test@example.com');

-- This fails with validation error
INSERT INTO users (user_email) VALUES ('invalid-email');
```

## Best Practices

::: tip Choosing Data Types

1. **Use the smallest type that fits** - SMALLINT vs BIGINT
2. **Use DECIMAL for money** - Never FLOAT
3. **Use TIMESTAMPTZ over TIMESTAMP** - Timezone awareness
4. **Use JSONB over JSON** - Better performance
5. **Use ENUM for fixed choices** - Prevents invalid values
6. **Consider arrays for simple lists** - Avoids extra tables
7. **Use domains for reusable validation** - Email, phone, etc.
:::

## What's Next?

Now that you understand data types, let's learn advanced querying techniques!

👉 Continue to [Chapter 5: Queries](./05-queries.md)
