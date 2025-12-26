# Indexes and Performance

Indexes are the key to fast database queries. This chapter explains how indexes work, when to use them, and how to analyze query performance.

## What is an Index?

An index is like a book's table of contents - it helps find data without scanning every page.

```
┌─────────────────────────────────────────────────────────────────┐
│                  Without Index vs With Index                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   WITHOUT INDEX (Sequential Scan)                                │
│   ─────────────────────────────────                              │
│                                                                  │
│   Looking for email = 'john@example.com'                        │
│                                                                  │
│   Row 1: alice@example.com  ✗ Not a match                       │
│   Row 2: bob@example.com    ✗ Not a match                       │
│   Row 3: carol@example.com  ✗ Not a match                       │
│   ...                                                            │
│   Row 999: john@example.com ✓ Found! (after scanning 999 rows)  │
│                                                                  │
│   Time: O(n) - must check every row                             │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   WITH INDEX (Index Scan)                                        │
│   ───────────────────────                                        │
│                                                                  │
│   email Index (B-tree):                                          │
│                                                                  │
│              [john...]                                           │
│             /        \                                           │
│    [alice...bob]  [john...mary]                                 │
│         │              │                                         │
│         └──────────────┘                                         │
│                 ↓                                                 │
│   Direct lookup: john@example.com → Row 999                     │
│                                                                  │
│   Time: O(log n) - much faster!                                 │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Creating Indexes

### Basic Index

```sql
-- Create index on a single column
CREATE INDEX idx_users_email ON users(email);

-- Create index on multiple columns
CREATE INDEX idx_orders_customer_date ON orders(customer_id, order_date);

-- Create unique index (also enforces uniqueness)
CREATE UNIQUE INDEX idx_users_username ON users(username);
```

### Index Types

PostgreSQL supports several index types:

| Type | Best For | Example |
|------|----------|---------|
| **B-tree** | Most queries (default) | `=`, `<`, `>`, `BETWEEN` |
| **Hash** | Equality comparisons | `=` only |
| **GiST** | Geometric, full-text | Spatial queries |
| **GIN** | Arrays, JSON, full-text | `@>`, `?`, `@@` |
| **BRIN** | Large sorted tables | Time-series data |

```sql
-- B-tree (default)
CREATE INDEX idx_products_price ON products(price);

-- Hash (only for equality)
CREATE INDEX idx_users_status ON users USING HASH(status);

-- GIN for JSON
CREATE INDEX idx_products_attrs ON products USING GIN(attributes);

-- GIN for arrays
CREATE INDEX idx_posts_tags ON posts USING GIN(tags);

-- GIN for full-text search
CREATE INDEX idx_articles_search ON articles USING GIN(to_tsvector('english', content));
```

### Partial Indexes

Index only a subset of rows:

```sql
-- Index only active users
CREATE INDEX idx_active_users ON users(email)
WHERE is_active = true;

-- Index only recent orders
CREATE INDEX idx_recent_orders ON orders(customer_id)
WHERE order_date > '2024-01-01';

-- Index only non-null values
CREATE INDEX idx_users_phone ON users(phone)
WHERE phone IS NOT NULL;
```

### Expression Indexes

Index on computed values:

```sql
-- Index on lowercase email
CREATE INDEX idx_users_email_lower ON users(LOWER(email));

-- Query uses the index
SELECT * FROM users WHERE LOWER(email) = 'john@example.com';

-- Index on date part
CREATE INDEX idx_orders_month ON orders(DATE_TRUNC('month', order_date));

-- Index on JSON field
CREATE INDEX idx_products_brand ON products((data->>'brand'));
```

## Viewing Indexes

```sql
-- List all indexes on a table
\di users

-- Get detailed index information
SELECT
    indexname,
    indexdef
FROM pg_indexes
WHERE tablename = 'users';

-- Index size
SELECT
    indexrelname AS index_name,
    pg_size_pretty(pg_relation_size(indexrelid)) AS size
FROM pg_stat_user_indexes
WHERE relname = 'users';
```

## EXPLAIN: Understanding Query Plans

EXPLAIN shows how PostgreSQL will execute a query.

### Basic EXPLAIN

```sql
-- Show query plan
EXPLAIN SELECT * FROM users WHERE email = 'john@example.com';

-- Show with actual execution stats
EXPLAIN ANALYZE SELECT * FROM users WHERE email = 'john@example.com';

-- More detailed output
EXPLAIN (ANALYZE, BUFFERS, FORMAT TEXT)
SELECT * FROM users WHERE email = 'john@example.com';
```

### Reading Query Plans

```sql
EXPLAIN ANALYZE
SELECT * FROM orders o
JOIN customers c ON o.customer_id = c.id
WHERE o.order_date > '2024-01-01';
```

Output:
```
Hash Join  (cost=1.09..2.19 rows=5 width=72) (actual time=0.025..0.028 rows=4 loops=1)
  Hash Cond: (o.customer_id = c.id)
  ->  Seq Scan on orders o  (cost=0.00..1.06 rows=5 width=44) (actual time=0.006..0.007 rows=5 loops=1)
        Filter: (order_date > '2024-01-01'::date)
  ->  Hash  (cost=1.05..1.05 rows=5 width=28) (actual time=0.009..0.009 rows=5 loops=1)
        ->  Seq Scan on customers c  (cost=0.00..1.05 rows=5 width=28)
Planning Time: 0.124 ms
Execution Time: 0.050 ms
```

### Key Terms in Query Plans

```
┌─────────────────────────────────────────────────────────────────┐
│                   Query Plan Components                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   Term                Meaning                                    │
│   ────                ───────                                    │
│                                                                  │
│   Seq Scan            Full table scan (no index used)           │
│   Index Scan          Uses index, fetches rows                  │
│   Index Only Scan     Uses index only (fastest)                 │
│   Bitmap Index Scan   Uses index, then sorts results            │
│   Hash Join           Builds hash table for joining             │
│   Nested Loop         Loop through each row (small tables)      │
│   Sort                Sorts results                              │
│                                                                  │
│   cost=X..Y           Estimated startup and total cost          │
│   rows=N              Estimated row count                        │
│   actual time=X..Y    Real execution time (with ANALYZE)        │
│   loops=N             Number of times operation ran             │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## When to Create Indexes

### Good Candidates for Indexes

```sql
-- Primary keys (automatic)
CREATE TABLE users (
    id SERIAL PRIMARY KEY  -- Index created automatically
);

-- Foreign keys (should add manually)
CREATE INDEX idx_orders_customer_id ON orders(customer_id);

-- Columns used in WHERE clauses
CREATE INDEX idx_users_status ON users(status);

-- Columns used in ORDER BY
CREATE INDEX idx_products_created ON products(created_at DESC);

-- Columns used in JOIN conditions
CREATE INDEX idx_order_items_order_id ON order_items(order_id);

-- Columns with high selectivity (many unique values)
CREATE INDEX idx_users_email ON users(email);
```

### When NOT to Create Indexes

::: warning Avoid Indexes On:

1. **Small tables** - Sequential scan is faster
2. **Columns with low selectivity** - e.g., boolean, status with few values
3. **Frequently updated columns** - Index maintenance is expensive
4. **Columns rarely used in queries**
5. **Tables with heavy write load** - Every INSERT/UPDATE updates indexes
:::

## Composite Indexes

Indexes on multiple columns:

```sql
-- Order matters!
CREATE INDEX idx_orders_customer_date ON orders(customer_id, order_date);

-- These queries USE the index:
SELECT * FROM orders WHERE customer_id = 1;
SELECT * FROM orders WHERE customer_id = 1 AND order_date > '2024-01-01';
SELECT * FROM orders WHERE customer_id = 1 ORDER BY order_date;

-- These queries may NOT use the index efficiently:
SELECT * FROM orders WHERE order_date > '2024-01-01';  -- Missing leading column
```

::: tip Column Order in Composite Indexes
Put the most selective (most filtered) column first, or the column used in equality comparisons before range comparisons.

```sql
-- Good: equality column first
CREATE INDEX idx_orders ON orders(status, order_date);
-- Query: WHERE status = 'pending' AND order_date > '2024-01-01'

-- Less optimal
CREATE INDEX idx_orders ON orders(order_date, status);
```
:::

## Index Maintenance

### Rebuilding Indexes

```sql
-- Rebuild a specific index
REINDEX INDEX idx_users_email;

-- Rebuild all indexes on a table
REINDEX TABLE users;

-- Rebuild all indexes in database
REINDEX DATABASE myapp;

-- Rebuild without locking (PostgreSQL 12+)
REINDEX INDEX CONCURRENTLY idx_users_email;
```

### Checking Index Health

```sql
-- Index usage statistics
SELECT
    relname AS table_name,
    indexrelname AS index_name,
    idx_scan AS times_used,
    idx_tup_read AS rows_read,
    idx_tup_fetch AS rows_fetched
FROM pg_stat_user_indexes
ORDER BY idx_scan DESC;

-- Find unused indexes
SELECT
    relname AS table_name,
    indexrelname AS index_name,
    pg_size_pretty(pg_relation_size(indexrelid)) AS size
FROM pg_stat_user_indexes
WHERE idx_scan = 0
ORDER BY pg_relation_size(indexrelid) DESC;
```

### Dropping Unused Indexes

```sql
-- Check if index is used
SELECT idx_scan FROM pg_stat_user_indexes
WHERE indexrelname = 'idx_users_old';

-- Drop if unused
DROP INDEX idx_users_old;

-- Drop without locking
DROP INDEX CONCURRENTLY idx_users_old;
```

## Query Optimization Tips

### 1. Use Covering Indexes

```sql
-- Include all needed columns in the index
CREATE INDEX idx_orders_covering ON orders(customer_id)
INCLUDE (order_date, total);

-- Query can use "Index Only Scan"
SELECT order_date, total FROM orders WHERE customer_id = 1;
```

### 2. Avoid Functions on Indexed Columns

```sql
-- BAD: Function prevents index usage
SELECT * FROM users WHERE LOWER(email) = 'john@example.com';

-- GOOD: Create expression index
CREATE INDEX idx_users_email_lower ON users(LOWER(email));
-- Now the query uses the index
```

### 3. Use LIMIT for Large Results

```sql
-- Without LIMIT (may be slow)
SELECT * FROM logs ORDER BY created_at DESC;

-- With LIMIT (much faster)
SELECT * FROM logs ORDER BY created_at DESC LIMIT 100;
```

### 4. Analyze Table Statistics

```sql
-- Update table statistics
ANALYZE users;

-- Check when last analyzed
SELECT
    relname,
    last_analyze,
    last_autoanalyze
FROM pg_stat_user_tables;

-- Enable auto-analyze (usually on by default)
ALTER TABLE users SET (autovacuum_analyze_threshold = 50);
```

## Common Performance Issues

### Problem: Seq Scan on Large Table

```sql
-- Before: Slow sequential scan
EXPLAIN SELECT * FROM orders WHERE customer_id = 123;
-- "Seq Scan on orders (cost=0.00..1234.00 rows=1000000)"

-- Solution: Add index
CREATE INDEX idx_orders_customer ON orders(customer_id);

-- After: Fast index scan
EXPLAIN SELECT * FROM orders WHERE customer_id = 123;
-- "Index Scan using idx_orders_customer (cost=0.42..8.44 rows=10)"
```

### Problem: Slow JOIN

```sql
-- Before: Nested loop on large tables
EXPLAIN ANALYZE
SELECT * FROM orders o
JOIN order_items oi ON o.id = oi.order_id;

-- Solution: Index foreign key
CREATE INDEX idx_order_items_order ON order_items(order_id);

-- After: Hash join using index
```

### Problem: Slow ORDER BY

```sql
-- Before: Sort in memory
EXPLAIN SELECT * FROM products ORDER BY created_at DESC;
-- "Sort (cost=...)"

-- Solution: Index for sorting
CREATE INDEX idx_products_created ON products(created_at DESC);

-- After: Uses index, no sort needed
-- "Index Scan Backward using idx_products_created"
```

## Practical Example: Optimizing an E-Commerce Query

```sql
-- Original slow query
SELECT
    p.name,
    p.price,
    c.name AS category,
    COUNT(oi.id) AS times_sold
FROM products p
JOIN categories c ON p.category_id = c.id
LEFT JOIN order_items oi ON p.id = oi.product_id
WHERE p.is_active = true
  AND p.price BETWEEN 50 AND 200
GROUP BY p.id, p.name, p.price, c.name
ORDER BY times_sold DESC
LIMIT 10;

-- Step 1: Analyze the query
EXPLAIN ANALYZE [query above];

-- Step 2: Add necessary indexes
CREATE INDEX idx_products_active_price ON products(is_active, price)
WHERE is_active = true;

CREATE INDEX idx_order_items_product ON order_items(product_id);

CREATE INDEX idx_products_category ON products(category_id);

-- Step 3: Verify improvement
EXPLAIN ANALYZE [query above];
```

## Reading EXPLAIN Output Like a Pro

```sql
EXPLAIN (ANALYZE, BUFFERS, FORMAT TEXT)
SELECT * FROM orders WHERE customer_id = 123;
```

### Key Metrics to Watch

```
┌─────────────────────────────────────────────────────────────────┐
│                   EXPLAIN Output Explained                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   Index Scan using idx_orders_customer (cost=0.29..8.31 rows=1) │
│                                         ▲          ▲        ▲   │
│                                         │          │        │   │
│   Startup cost ─────────────────────────┘          │        │   │
│   Total cost ──────────────────────────────────────┘        │   │
│   Estimated rows ───────────────────────────────────────────┘   │
│                                                                  │
│   (actual time=0.025..0.026 rows=1 loops=1)                     │
│              ▲           ▲        ▲       ▲                     │
│              │           │        │       │                     │
│   Actual startup ────────┘        │       │                     │
│   Actual total ───────────────────┘       │                     │
│   Actual rows returned ───────────────────┘                     │
│   Number of executions ────────────────────                     │
│                                                                  │
│   Buffers: shared hit=3 read=1                                  │
│                    ▲        ▲                                    │
│   Pages from cache ┘        └── Pages from disk (slow!)         │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Red Flags in Query Plans

```sql
-- Bad signs to look for:

-- 1. Seq Scan on large tables
Seq Scan on orders (rows=1000000)  -- Should use index!

-- 2. High actual vs estimated rows
(cost=... rows=10) (actual rows=100000)  -- Bad statistics!
-- Fix: ANALYZE orders;

-- 3. Many disk reads
Buffers: shared read=10000  -- Needs more memory or better query

-- 4. Nested Loop on large tables
Nested Loop (actual time=0.1..5000.0 rows=1000000)
-- Consider Hash Join or index
```

## Index Selection Flowchart

```
┌─────────────────────────────────────────────────────────────────┐
│                   Which Index Type to Use?                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   Query Pattern                      Recommended Index           │
│   ─────────────                      ─────────────────           │
│                                                                  │
│   = , < , > , BETWEEN               B-tree (default)            │
│   LIKE 'prefix%'                    B-tree                      │
│   LIKE '%suffix'                    GIN with pg_trgm            │
│                                                                  │
│   JSON containment (@>)             GIN                         │
│   Array operations (&&, @>)         GIN                         │
│   Full-text search (@@)             GIN                         │
│                                                                  │
│   Geometry/Geography                GiST or SP-GiST             │
│   Range types (&&)                  GiST                        │
│   Nearest neighbor (<->)            GiST                        │
│                                                                  │
│   Large sorted tables               BRIN (much smaller!)        │
│   Time-series data                  BRIN                        │
│                                                                  │
│   Only equality (=)                 Hash (rarely better)        │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Index Maintenance Checklist

```sql
-- 1. Find unused indexes (candidates for removal)
SELECT
    schemaname || '.' || relname AS table,
    indexrelname AS index,
    pg_size_pretty(pg_relation_size(i.indexrelid)) AS size,
    idx_scan AS scans
FROM pg_stat_user_indexes i
JOIN pg_index USING (indexrelid)
WHERE NOT indisunique  -- Keep unique constraints
  AND idx_scan = 0
  AND pg_relation_size(i.indexrelid) > 1024 * 1024  -- > 1MB
ORDER BY pg_relation_size(i.indexrelid) DESC;

-- 2. Find missing indexes (high seq scans)
SELECT
    schemaname || '.' || relname AS table,
    seq_scan,
    seq_tup_read,
    idx_scan,
    n_live_tup AS rows
FROM pg_stat_user_tables
WHERE seq_scan > idx_scan
  AND n_live_tup > 10000
ORDER BY seq_tup_read DESC
LIMIT 10;

-- 3. Check index bloat
SELECT
    schemaname || '.' || tablename AS table,
    indexname,
    pg_size_pretty(pg_relation_size(indexname::regclass)) AS size
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY pg_relation_size(indexname::regclass) DESC;
```

## Summary

| Topic | Key Points |
| ----- | ---------- |
| **What** | Indexes speed up data retrieval |
| **When** | WHERE, JOIN, ORDER BY columns |
| **Types** | B-tree (default), GIN (JSON/arrays), GiST (geo) |
| **Avoid** | Small tables, low selectivity, write-heavy columns |
| **Analyze** | Use EXPLAIN ANALYZE to check plans |
| **Maintain** | Monitor usage, rebuild when needed |

## Quick Reference

```sql
-- Create index
CREATE INDEX idx_name ON table(column);

-- Partial index
CREATE INDEX idx_name ON table(column) WHERE condition;

-- Expression index
CREATE INDEX idx_name ON table(LOWER(column));

-- Composite index
CREATE INDEX idx_name ON table(col1, col2);

-- Check query plan
EXPLAIN ANALYZE SELECT ...;

-- View index usage
SELECT * FROM pg_stat_user_indexes;

-- Drop index
DROP INDEX idx_name;
```

## What's Next?

Now let's learn about transactions and how PostgreSQL ensures data integrity!

👉 Continue to [Chapter 9: Transactions](./09-transactions.md)
