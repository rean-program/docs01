# Transactions and ACID

Transactions ensure data integrity by grouping operations that must succeed or fail together. This chapter explains ACID properties, transaction control, and concurrency handling.

## What is a Transaction?

A transaction is a sequence of operations treated as a single unit of work.

```
┌─────────────────────────────────────────────────────────────────┐
│                    Transaction Example                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   Bank Transfer: Move $100 from Account A to Account B          │
│                                                                  │
│   WITHOUT Transaction:                                           │
│   ────────────────────                                           │
│   1. Deduct $100 from A  ✓                                      │
│   2. System crashes! ⚠️                                          │
│   3. Add $100 to B       ✗ Never executed                       │
│                                                                  │
│   Result: $100 disappeared! 💸                                   │
│                                                                  │
│   ─────────────────────────────────────────────────────────────  │
│                                                                  │
│   WITH Transaction:                                              │
│   ─────────────────                                              │
│   BEGIN;                                                         │
│   1. Deduct $100 from A  ✓                                      │
│   2. System crashes! ⚠️                                          │
│   ROLLBACK (automatic)                                           │
│                                                                  │
│   Result: No money lost, transaction rolled back ✓              │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## ACID Properties

PostgreSQL guarantees ACID compliance:

```
┌─────────────────────────────────────────────────────────────────┐
│                       ACID Properties                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   A - Atomicity                                                  │
│   ─────────────                                                  │
│   All operations complete successfully, or none do.             │
│   No partial updates.                                            │
│                                                                  │
│   C - Consistency                                                │
│   ───────────────                                                │
│   Database moves from one valid state to another.               │
│   All constraints are maintained.                               │
│                                                                  │
│   I - Isolation                                                  │
│   ───────────                                                    │
│   Concurrent transactions don't interfere with each other.     │
│   Each transaction sees a consistent view.                      │
│                                                                  │
│   D - Durability                                                 │
│   ────────────                                                   │
│   Once committed, changes survive system failures.              │
│   Data is written to disk.                                       │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Basic Transaction Control

### BEGIN, COMMIT, ROLLBACK

```sql
-- Start a transaction
BEGIN;

-- Or use START TRANSACTION
START TRANSACTION;

-- Execute operations
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;

-- If everything is OK, commit
COMMIT;

-- If something went wrong, rollback
ROLLBACK;
```

### Auto-Commit Behavior

```sql
-- By default, each statement is its own transaction
UPDATE users SET name = 'John';  -- Auto-committed immediately

-- To group multiple statements, use explicit transaction
BEGIN;
UPDATE users SET name = 'John' WHERE id = 1;
UPDATE users SET name = 'Jane' WHERE id = 2;
COMMIT;  -- Both updates committed together
```

### Transaction Example: Bank Transfer

```sql
-- Create accounts table
CREATE TABLE accounts (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    balance DECIMAL(10, 2) CHECK (balance >= 0)
);

INSERT INTO accounts (name, balance) VALUES
    ('Alice', 1000.00),
    ('Bob', 500.00);

-- Safe transfer function
CREATE OR REPLACE FUNCTION transfer_money(
    from_account INTEGER,
    to_account INTEGER,
    amount DECIMAL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
BEGIN
    -- Start transaction (implicit in function)

    -- Check sufficient balance
    IF (SELECT balance FROM accounts WHERE id = from_account) < amount THEN
        RAISE EXCEPTION 'Insufficient funds';
    END IF;

    -- Deduct from sender
    UPDATE accounts
    SET balance = balance - amount
    WHERE id = from_account;

    -- Add to receiver
    UPDATE accounts
    SET balance = balance + amount
    WHERE id = to_account;

    RETURN TRUE;
EXCEPTION
    WHEN OTHERS THEN
        -- Transaction will be rolled back
        RAISE NOTICE 'Transfer failed: %', SQLERRM;
        RETURN FALSE;
END;
$$;

-- Use the function
SELECT transfer_money(1, 2, 100.00);  -- Transfer $100 from Alice to Bob
```

## Savepoints

Savepoints allow partial rollbacks within a transaction.

```sql
BEGIN;

INSERT INTO orders (customer_id, total) VALUES (1, 100);
SAVEPOINT order_created;

INSERT INTO order_items (order_id, product_id) VALUES (1, 999);
-- Oops, product 999 doesn't exist!

ROLLBACK TO SAVEPOINT order_created;
-- Order is still there, only order_items rolled back

INSERT INTO order_items (order_id, product_id) VALUES (1, 1);
-- Correct product

COMMIT;
```

### Nested Savepoints

```sql
BEGIN;

UPDATE inventory SET quantity = quantity - 1 WHERE product_id = 1;
SAVEPOINT sp1;

UPDATE inventory SET quantity = quantity - 1 WHERE product_id = 2;
SAVEPOINT sp2;

UPDATE inventory SET quantity = quantity - 1 WHERE product_id = 3;
-- Something wrong here

ROLLBACK TO sp2;  -- Undo product 3 only
-- Products 1 and 2 changes are still pending

ROLLBACK TO sp1;  -- Undo product 2 as well
-- Only product 1 change is pending

COMMIT;  -- Commit product 1 change
```

## Isolation Levels

Isolation levels control how transactions interact with each other.

```
┌─────────────────────────────────────────────────────────────────┐
│                     Isolation Levels                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   Level              Dirty    Non-repeatable  Phantom           │
│                      Read     Read            Read              │
│   ─────              ─────    ──────────────  ───────           │
│                                                                  │
│   Read Uncommitted   Yes      Yes             Yes               │
│   Read Committed     No       Yes             Yes   ← Default   │
│   Repeatable Read    No       No              No*               │
│   Serializable       No       No              No                │
│                                                                  │
│   * PostgreSQL prevents phantom reads at Repeatable Read        │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Read Phenomena Explained

```sql
-- DIRTY READ: Reading uncommitted data (NOT possible in PostgreSQL)
-- Transaction A: UPDATE accounts SET balance = 0 WHERE id = 1; (no commit)
-- Transaction B: SELECT balance FROM accounts WHERE id = 1; -- Sees 0 (wrong!)

-- NON-REPEATABLE READ: Same query returns different results
-- Transaction A: SELECT balance FROM accounts WHERE id = 1; -- Returns 1000
-- Transaction B: UPDATE accounts SET balance = 500 WHERE id = 1; COMMIT;
-- Transaction A: SELECT balance FROM accounts WHERE id = 1; -- Returns 500 (changed!)

-- PHANTOM READ: New rows appear
-- Transaction A: SELECT COUNT(*) FROM orders WHERE status = 'pending'; -- Returns 5
-- Transaction B: INSERT INTO orders (status) VALUES ('pending'); COMMIT;
-- Transaction A: SELECT COUNT(*) FROM orders WHERE status = 'pending'; -- Returns 6 (new row!)
```

### Setting Isolation Level

```sql
-- Set for current transaction
BEGIN;
SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
-- ... operations ...
COMMIT;

-- Set for session
SET SESSION CHARACTERISTICS AS TRANSACTION ISOLATION LEVEL REPEATABLE READ;

-- Check current level
SHOW transaction_isolation;
```

### Read Committed (Default)

```sql
-- Each query sees only committed data at query start
BEGIN;
SET TRANSACTION ISOLATION LEVEL READ COMMITTED;

SELECT * FROM products WHERE price > 100;
-- Another transaction commits price changes

SELECT * FROM products WHERE price > 100;
-- May see different results (non-repeatable read)
COMMIT;
```

### Repeatable Read

```sql
-- Transaction sees a snapshot from transaction start
BEGIN;
SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;

SELECT * FROM products WHERE price > 100;  -- Returns 10 rows

-- Another transaction changes prices and commits

SELECT * FROM products WHERE price > 100;  -- Still returns same 10 rows
COMMIT;
```

### Serializable

```sql
-- Strictest level - transactions appear to run sequentially
BEGIN;
SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;

SELECT SUM(balance) FROM accounts;
UPDATE accounts SET balance = balance + 100 WHERE id = 1;

COMMIT;  -- May fail if conflicts with another serializable transaction
```

::: warning Serializable Transactions May Fail
With SERIALIZABLE, PostgreSQL may abort a transaction with "could not serialize access" error. Your application must be prepared to retry.

```sql
-- Handle serialization failure
DO $$
DECLARE
    retries INTEGER := 0;
BEGIN
    LOOP
        BEGIN
            -- Your transaction here
            PERFORM some_operation();
            EXIT;  -- Success, exit loop
        EXCEPTION
            WHEN serialization_failure THEN
                retries := retries + 1;
                IF retries > 3 THEN
                    RAISE;
                END IF;
                -- Wait and retry
        END;
    END LOOP;
END;
$$;
```
:::

## Locking

PostgreSQL uses various locks to manage concurrent access.

### Row-Level Locks

```sql
-- SELECT FOR UPDATE: Lock rows for update
BEGIN;
SELECT * FROM accounts WHERE id = 1 FOR UPDATE;
-- Row is locked, other transactions must wait
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
COMMIT;
-- Lock released

-- SELECT FOR SHARE: Lock rows for reading
SELECT * FROM products WHERE id = 1 FOR SHARE;
-- Others can read but not update

-- SKIP LOCKED: Skip locked rows (useful for job queues)
SELECT * FROM jobs
WHERE status = 'pending'
ORDER BY created_at
LIMIT 1
FOR UPDATE SKIP LOCKED;

-- NOWAIT: Fail immediately if lock not available
SELECT * FROM accounts WHERE id = 1 FOR UPDATE NOWAIT;
-- Raises error if row is locked
```

### Advisory Locks

Application-defined locks (not tied to database objects):

```sql
-- Session-level advisory lock
SELECT pg_advisory_lock(12345);  -- Lock with ID 12345
-- Do exclusive work
SELECT pg_advisory_unlock(12345);

-- Transaction-level advisory lock (auto-released at commit)
SELECT pg_advisory_xact_lock(12345);

-- Try to acquire lock (non-blocking)
SELECT pg_try_advisory_lock(12345);  -- Returns true/false

-- Example: Prevent duplicate cron jobs
DO $$
BEGIN
    IF pg_try_advisory_lock(hashtext('daily_cleanup')) THEN
        -- Run cleanup
        PERFORM daily_cleanup();
        PERFORM pg_advisory_unlock(hashtext('daily_cleanup'));
    ELSE
        RAISE NOTICE 'Cleanup already running';
    END IF;
END;
$$;
```

## Deadlocks

A deadlock occurs when two transactions wait for each other.

```
┌─────────────────────────────────────────────────────────────────┐
│                       Deadlock Example                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   Transaction A                    Transaction B                 │
│   ─────────────                    ─────────────                 │
│                                                                  │
│   BEGIN;                           BEGIN;                        │
│   UPDATE accounts                  UPDATE accounts               │
│   SET balance = 100                SET balance = 200             │
│   WHERE id = 1;                    WHERE id = 2;                 │
│   -- Locks row 1                   -- Locks row 2                │
│                                                                  │
│   UPDATE accounts                  UPDATE accounts               │
│   SET balance = 200                SET balance = 100             │
│   WHERE id = 2;                    WHERE id = 1;                 │
│   -- Waits for row 2 ⏳            -- Waits for row 1 ⏳         │
│                                                                  │
│   DEADLOCK! ⚠️                                                   │
│   PostgreSQL detects and aborts one transaction                 │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Preventing Deadlocks

```sql
-- Strategy 1: Lock rows in consistent order
BEGIN;
SELECT * FROM accounts WHERE id IN (1, 2) ORDER BY id FOR UPDATE;
-- Both transactions lock in same order (1, then 2)
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;
COMMIT;

-- Strategy 2: Use shorter transactions
-- Don't hold locks while doing slow operations

-- Strategy 3: Use lock timeout
SET lock_timeout = '5s';  -- Fail after 5 seconds
```

## Practical Examples

### Order Processing with Transaction

```sql
CREATE OR REPLACE FUNCTION process_order(
    p_customer_id INTEGER,
    p_items JSONB  -- [{product_id: 1, quantity: 2}, ...]
)
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
DECLARE
    v_order_id INTEGER;
    v_item JSONB;
    v_product_id INTEGER;
    v_quantity INTEGER;
    v_price DECIMAL;
    v_stock INTEGER;
BEGIN
    -- Create order
    INSERT INTO orders (customer_id, status, created_at)
    VALUES (p_customer_id, 'pending', NOW())
    RETURNING id INTO v_order_id;

    -- Process each item
    FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
    LOOP
        v_product_id := (v_item->>'product_id')::INTEGER;
        v_quantity := (v_item->>'quantity')::INTEGER;

        -- Lock product row and check stock
        SELECT price, stock INTO v_price, v_stock
        FROM products
        WHERE id = v_product_id
        FOR UPDATE;

        IF v_stock < v_quantity THEN
            RAISE EXCEPTION 'Insufficient stock for product %', v_product_id;
        END IF;

        -- Reduce stock
        UPDATE products
        SET stock = stock - v_quantity
        WHERE id = v_product_id;

        -- Add order item
        INSERT INTO order_items (order_id, product_id, quantity, unit_price)
        VALUES (v_order_id, v_product_id, v_quantity, v_price);
    END LOOP;

    -- Update order total
    UPDATE orders
    SET total = (
        SELECT SUM(quantity * unit_price)
        FROM order_items
        WHERE order_id = v_order_id
    )
    WHERE id = v_order_id;

    RETURN v_order_id;
EXCEPTION
    WHEN OTHERS THEN
        RAISE;  -- Transaction will be rolled back
END;
$$;

-- Usage
SELECT process_order(
    1,
    '[{"product_id": 1, "quantity": 2}, {"product_id": 2, "quantity": 1}]'::jsonb
);
```

### Job Queue with SKIP LOCKED

```sql
-- Create jobs table
CREATE TABLE jobs (
    id SERIAL PRIMARY KEY,
    payload JSONB,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ
);

-- Worker function to claim and process a job
CREATE OR REPLACE FUNCTION claim_job()
RETURNS TABLE(job_id INTEGER, job_payload JSONB)
LANGUAGE plpgsql
AS $$
DECLARE
    v_job_id INTEGER;
    v_payload JSONB;
BEGIN
    -- Get and lock one pending job
    SELECT id, payload INTO v_job_id, v_payload
    FROM jobs
    WHERE status = 'pending'
    ORDER BY created_at
    LIMIT 1
    FOR UPDATE SKIP LOCKED;

    IF v_job_id IS NOT NULL THEN
        -- Mark as processing
        UPDATE jobs
        SET status = 'processing', started_at = NOW()
        WHERE id = v_job_id;

        job_id := v_job_id;
        job_payload := v_payload;
        RETURN NEXT;
    END IF;
END;
$$;

-- Usage (multiple workers can run this concurrently)
SELECT * FROM claim_job();
```

## Common Transaction Mistakes

### Mistake 1: Holding Transactions Open Too Long

```sql
-- BAD: Long-running transaction blocks other operations
BEGIN;
SELECT * FROM orders WHERE id = 1 FOR UPDATE;
-- User goes to lunch...
-- Other transactions waiting for row 1 are blocked!
COMMIT;

-- GOOD: Keep transactions short
BEGIN;
SELECT * FROM orders WHERE id = 1 FOR UPDATE;
UPDATE orders SET status = 'shipped' WHERE id = 1;
COMMIT;  -- Release locks immediately
```

### Mistake 2: Not Handling Serialization Failures

```sql
-- BAD: Assumes transaction always succeeds
BEGIN;
SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
COMMIT;  -- May fail with serialization_failure!

-- GOOD: Application code with retry logic
-- Python example:
-- for attempt in range(3):
--     try:
--         cursor.execute("BEGIN; SET TRANSACTION ...")
--         cursor.execute("UPDATE ...")
--         cursor.execute("COMMIT")
--         break
--     except psycopg2.errors.SerializationFailure:
--         cursor.execute("ROLLBACK")
--         continue
```

### Mistake 3: Forgetting to Handle Errors

```sql
-- BAD: Error leaves transaction in bad state
BEGIN;
INSERT INTO orders (customer_id) VALUES (999);  -- FK violation!
-- Transaction is now aborted, all subsequent commands fail
UPDATE inventory SET stock = stock - 1;  -- This fails too!
COMMIT;  -- Also fails!

-- GOOD: Use savepoints or proper error handling
BEGIN;
SAVEPOINT before_insert;
INSERT INTO orders (customer_id) VALUES (999);  -- FK violation!
-- Catch error in application, rollback to savepoint
ROLLBACK TO before_insert;
-- Continue with other operations
COMMIT;
```

## Application Integration Patterns

### Connection Pooling with Transactions

```javascript
// Node.js with pg-pool
const pool = new Pool({ max: 20 });

async function transferMoney(fromId, toId, amount) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Lock both accounts in consistent order to prevent deadlock
    const ids = [fromId, toId].sort();
    await client.query(
      'SELECT * FROM accounts WHERE id = ANY($1) ORDER BY id FOR UPDATE',
      [ids]
    );

    await client.query(
      'UPDATE accounts SET balance = balance - $1 WHERE id = $2',
      [amount, fromId]
    );
    await client.query(
      'UPDATE accounts SET balance = balance + $1 WHERE id = $2',
      [amount, toId]
    );

    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();  // Return to pool
  }
}
```

### Optimistic Locking Pattern

```sql
-- Add version column to table
ALTER TABLE products ADD COLUMN version INTEGER DEFAULT 1;

-- Read with version
SELECT id, name, price, version FROM products WHERE id = 1;
-- Returns: id=1, name='Widget', price=10.00, version=5

-- Update only if version matches
UPDATE products
SET price = 12.00, version = version + 1
WHERE id = 1 AND version = 5;

-- Check if update succeeded
-- If affected rows = 0, someone else modified the record
-- Retry or show conflict to user
```

### Idempotent Operations

```sql
-- Use unique constraint for idempotency
CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    idempotency_key UUID UNIQUE,  -- Client provides this
    amount DECIMAL,
    status VARCHAR(20),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert only if key doesn't exist
INSERT INTO payments (idempotency_key, amount, status)
VALUES ('550e8400-e29b-41d4-a716-446655440000', 100.00, 'pending')
ON CONFLICT (idempotency_key) DO NOTHING
RETURNING *;

-- If returns nothing, payment already exists - fetch it instead
SELECT * FROM payments WHERE idempotency_key = '550e8400-...';
```

## Summary

| Concept | Description |
| ------- | ----------- |
| **Transaction** | Group of operations that succeed or fail together |
| **ACID** | Atomicity, Consistency, Isolation, Durability |
| **COMMIT** | Save all changes permanently |
| **ROLLBACK** | Undo all changes since BEGIN |
| **Savepoint** | Checkpoint for partial rollback |
| **Isolation Level** | How transactions see each other's changes |
| **Locking** | Prevent concurrent modifications |
| **Deadlock** | Circular wait - PostgreSQL detects and resolves |

## Quick Reference

```sql
-- Basic transaction
BEGIN;
-- operations
COMMIT;  -- or ROLLBACK;

-- Savepoint
SAVEPOINT sp1;
ROLLBACK TO sp1;

-- Isolation level
SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;

-- Row locking
SELECT * FROM table FOR UPDATE;
SELECT * FROM table FOR UPDATE SKIP LOCKED;

-- Advisory lock
SELECT pg_advisory_lock(123);
SELECT pg_advisory_unlock(123);
```

## What's Next?

Finally, let's learn how to secure your PostgreSQL database with proper user management and permissions!

👉 Continue to [Chapter 10: Security](./10-security.md)
