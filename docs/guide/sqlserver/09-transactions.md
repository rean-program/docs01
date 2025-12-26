# Transactions and Locking

Transactions ensure data integrity by grouping operations that must succeed or fail together. This chapter covers ACID properties, transaction management, and concurrency control.

## What is a Transaction?

A transaction is a unit of work that must be completed entirely or not at all.

```
┌─────────────────────────────────────────────────────────────────┐
│                    Transaction Example                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Bank Transfer: $100 from Account A to Account B                 │
│  ─────────────────────────────────────────────────               │
│                                                                  │
│  Transaction Start                                               │
│  │                                                               │
│  ├── Step 1: Deduct $100 from Account A                         │
│  │           Account A: $500 → $400                              │
│  │                                                               │
│  ├── Step 2: Add $100 to Account B                              │
│  │           Account B: $200 → $300                              │
│  │                                                               │
│  Transaction End (COMMIT)                                        │
│                                                                  │
│  If Step 2 fails, Step 1 must be undone (ROLLBACK)              │
│  Otherwise, money disappears!                                    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## ACID Properties

```
┌─────────────────────────────────────────────────────────────────┐
│                    ACID Properties                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  A - Atomicity                                                   │
│  ─────────────                                                   │
│  All operations succeed, or none do.                            │
│  "All or nothing"                                                │
│                                                                  │
│  C - Consistency                                                 │
│  ─────────────                                                   │
│  Database moves from one valid state to another.                │
│  Constraints are always enforced.                               │
│                                                                  │
│  I - Isolation                                                   │
│  ────────────                                                    │
│  Concurrent transactions don't interfere.                       │
│  Each transaction appears to run alone.                         │
│                                                                  │
│  D - Durability                                                  │
│  ────────────                                                    │
│  Committed changes survive system failures.                     │
│  Written to disk, not just memory.                              │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Transaction Basics

### Explicit Transactions

```sql
-- Basic transaction
BEGIN TRANSACTION;

    UPDATE Accounts SET Balance = Balance - 100 WHERE AccountID = 1;
    UPDATE Accounts SET Balance = Balance + 100 WHERE AccountID = 2;

COMMIT TRANSACTION;

-- With error handling
BEGIN TRY
    BEGIN TRANSACTION;

        UPDATE Accounts SET Balance = Balance - 100 WHERE AccountID = 1;

        -- Check for negative balance
        IF (SELECT Balance FROM Accounts WHERE AccountID = 1) < 0
        BEGIN
            RAISERROR('Insufficient funds', 16, 1);
        END

        UPDATE Accounts SET Balance = Balance + 100 WHERE AccountID = 2;

    COMMIT TRANSACTION;
    PRINT 'Transfer successful';
END TRY
BEGIN CATCH
    IF @@TRANCOUNT > 0
        ROLLBACK TRANSACTION;

    PRINT 'Transfer failed: ' + ERROR_MESSAGE();
END CATCH;
```

### Transaction Syntax Variations

```sql
-- Long form
BEGIN TRANSACTION;
COMMIT TRANSACTION;
ROLLBACK TRANSACTION;

-- Short form
BEGIN TRAN;
COMMIT TRAN;
ROLLBACK TRAN;

-- Shortest form
BEGIN TRAN;
COMMIT;
ROLLBACK;

-- Named transactions
BEGIN TRANSACTION TransferMoney;
-- operations
COMMIT TRANSACTION TransferMoney;
```

### Checking Transaction State

```sql
-- @@TRANCOUNT returns nesting level
SELECT @@TRANCOUNT AS TransactionLevel;  -- 0 = no transaction

BEGIN TRAN;
SELECT @@TRANCOUNT;  -- 1

BEGIN TRAN;
SELECT @@TRANCOUNT;  -- 2

COMMIT;
SELECT @@TRANCOUNT;  -- 1

COMMIT;
SELECT @@TRANCOUNT;  -- 0

-- XACT_STATE() returns transaction state
SELECT XACT_STATE() AS TransactionState;
-- 1 = Active, committable
-- 0 = No active transaction
-- -1 = Active, uncommittable (must rollback)
```

## Savepoints

Savepoints allow partial rollbacks within a transaction.

```sql
BEGIN TRANSACTION;

    INSERT INTO Orders (CustomerID, OrderDate)
    VALUES (1, GETDATE());

    SAVE TRANSACTION OrderCreated;  -- Savepoint

    INSERT INTO OrderDetails (OrderID, ProductID, Quantity)
    VALUES (SCOPE_IDENTITY(), 1, 10);

    -- Something goes wrong with this detail
    IF (SELECT UnitsInStock FROM Products WHERE ProductID = 1) < 10
    BEGIN
        -- Rollback only to savepoint, keep the order
        ROLLBACK TRANSACTION OrderCreated;
        PRINT 'Order detail rolled back, but order kept';
    END

COMMIT TRANSACTION;
```

```
┌─────────────────────────────────────────────────────────────────┐
│                    Savepoint Behavior                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  BEGIN TRAN                                                      │
│      │                                                           │
│      ├── INSERT Order ──────────────────────────────────────┐   │
│      │                                                       │   │
│      ├── SAVE TRANSACTION SP1 ◄──────────────────────────┐  │   │
│      │                                                    │  │   │
│      ├── INSERT Detail 1                                  │  │   │
│      │                                                    │  │   │
│      ├── ROLLBACK TRAN SP1 ──► Undoes back to SP1 ───────┘  │   │
│      │                         (Detail 1 undone)             │   │
│      │                                                       │   │
│      ├── INSERT Detail 2 (alternative)                       │   │
│      │                                                       │   │
│  COMMIT ──────────────────► Commits Order + Detail 2 ────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Isolation Levels

Isolation levels control how transactions interact with each other.

### Concurrency Problems

```
┌─────────────────────────────────────────────────────────────────┐
│                  Concurrency Problems                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Dirty Read                                                      │
│  ──────────                                                      │
│  T1: UPDATE Products SET Price = 100  (not committed)           │
│  T2: SELECT Price FROM Products  → Reads 100 (dirty data)       │
│  T1: ROLLBACK                    → Price is back to original    │
│  T2 used incorrect data!                                        │
│                                                                  │
│  Non-Repeatable Read                                             │
│  ───────────────────                                             │
│  T1: SELECT Price → 50                                          │
│  T2: UPDATE Price = 75; COMMIT                                  │
│  T1: SELECT Price → 75  (different value!)                      │
│                                                                  │
│  Phantom Read                                                    │
│  ────────────                                                    │
│  T1: SELECT COUNT(*) WHERE Price > 50 → 10 rows                 │
│  T2: INSERT new product with Price = 100; COMMIT                │
│  T1: SELECT COUNT(*) WHERE Price > 50 → 11 rows (phantom!)      │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### SQL Server Isolation Levels

| Level | Dirty Read | Non-Repeatable | Phantom | Locks |
|-------|------------|----------------|---------|-------|
| READ UNCOMMITTED | Possible | Possible | Possible | None |
| READ COMMITTED | No | Possible | Possible | Shared (short) |
| REPEATABLE READ | No | No | Possible | Shared (held) |
| SERIALIZABLE | No | No | No | Range locks |
| SNAPSHOT | No | No | No | Row versioning |

### Setting Isolation Levels

```sql
-- Set for current session
SET TRANSACTION ISOLATION LEVEL READ COMMITTED;
-- or
SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;
SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;
SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
SET TRANSACTION ISOLATION LEVEL SNAPSHOT;

-- Check current level
SELECT
    CASE transaction_isolation_level
        WHEN 0 THEN 'Unspecified'
        WHEN 1 THEN 'ReadUncommitted'
        WHEN 2 THEN 'ReadCommitted'
        WHEN 3 THEN 'RepeatableRead'
        WHEN 4 THEN 'Serializable'
        WHEN 5 THEN 'Snapshot'
    END AS IsolationLevel
FROM sys.dm_exec_sessions
WHERE session_id = @@SPID;
```

### Isolation Level Examples

```sql
-- READ UNCOMMITTED (dirty reads allowed)
SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;
SELECT * FROM Products;  -- Can read uncommitted data

-- Same effect with NOLOCK hint
SELECT * FROM Products WITH (NOLOCK);

-- READ COMMITTED (default in SQL Server)
SET TRANSACTION ISOLATION LEVEL READ COMMITTED;
BEGIN TRAN;
    SELECT * FROM Products WHERE ProductID = 1;
    -- Shared lock released immediately after read
COMMIT;

-- REPEATABLE READ (locks held until end of transaction)
SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;
BEGIN TRAN;
    SELECT * FROM Products WHERE ProductID = 1;
    -- Shared lock held until COMMIT/ROLLBACK
    -- Other transactions cannot modify this row
COMMIT;

-- SERIALIZABLE (range locks, prevents phantoms)
SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
BEGIN TRAN;
    SELECT * FROM Products WHERE Price > 100;
    -- Range lock on Price > 100
    -- Other transactions cannot insert rows in this range
COMMIT;
```

### Snapshot Isolation

```sql
-- Enable snapshot isolation on database (one-time)
ALTER DATABASE SalesDB SET ALLOW_SNAPSHOT_ISOLATION ON;

-- Use snapshot isolation
SET TRANSACTION ISOLATION LEVEL SNAPSHOT;
BEGIN TRAN;
    SELECT * FROM Products;  -- Reads version at transaction start
    -- Even if other transactions modify data,
    -- this transaction sees the original version
COMMIT;

-- Enable read committed snapshot (different feature)
ALTER DATABASE SalesDB SET READ_COMMITTED_SNAPSHOT ON;
-- Now READ COMMITTED uses row versioning instead of locks
```

## Locking

### Lock Types

```
┌─────────────────────────────────────────────────────────────────┐
│                    Lock Types                                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Lock Type      Abbreviation  Description                        │
│  ─────────      ────────────  ───────────                        │
│  Shared (S)     S             Reading data                       │
│  Exclusive (X)  X             Modifying data                     │
│  Update (U)     U             Intent to update                   │
│  Intent (I)     IS, IX, IU    Higher-level intent locks         │
│  Schema (Sch)   Sch-S, Sch-M  Schema operations                 │
│                                                                  │
│  Lock Compatibility:                                             │
│  ───────────────────                                             │
│                                                                  │
│              Requested Lock                                      │
│              S     U     X                                       │
│  Held   S    ✓     ✓     ✗                                      │
│  Lock   U    ✓     ✗     ✗                                      │
│         X    ✗     ✗     ✗                                      │
│                                                                  │
│  ✓ = Compatible (can coexist)                                   │
│  ✗ = Conflict (must wait)                                       │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Viewing Locks

```sql
-- View current locks
SELECT
    request_session_id AS SessionID,
    resource_type,
    resource_database_id,
    resource_associated_entity_id,
    request_mode AS LockType,
    request_status AS Status
FROM sys.dm_tran_locks
WHERE resource_database_id = DB_ID();

-- View locks with object names
SELECT
    L.request_session_id AS SessionID,
    DB_NAME(L.resource_database_id) AS DatabaseName,
    OBJECT_NAME(P.object_id) AS TableName,
    L.resource_type,
    L.request_mode,
    L.request_status
FROM sys.dm_tran_locks L
LEFT JOIN sys.partitions P ON L.resource_associated_entity_id = P.hobt_id
WHERE L.resource_database_id = DB_ID();

-- View blocking chains
SELECT
    blocking.session_id AS BlockingSession,
    blocked.session_id AS BlockedSession,
    blocked.wait_type,
    blocked.wait_time,
    blocked.wait_resource
FROM sys.dm_exec_requests blocked
INNER JOIN sys.dm_exec_sessions blocking
    ON blocked.blocking_session_id = blocking.session_id;
```

### Lock Hints

```sql
-- NOLOCK (read uncommitted)
SELECT * FROM Products WITH (NOLOCK);

-- ROWLOCK (force row-level locks)
UPDATE Products WITH (ROWLOCK)
SET UnitsInStock = UnitsInStock - 1
WHERE ProductID = 1;

-- TABLOCK (table-level lock)
SELECT * FROM Products WITH (TABLOCK);

-- UPDLOCK (update lock for later modification)
SELECT * FROM Products WITH (UPDLOCK)
WHERE ProductID = 1;

-- HOLDLOCK (hold shared locks until end of transaction)
SELECT * FROM Products WITH (HOLDLOCK)
WHERE CategoryID = 1;

-- XLOCK (exclusive lock)
SELECT * FROM Products WITH (XLOCK)
WHERE ProductID = 1;
```

## Deadlocks

A deadlock occurs when two transactions are waiting for each other's locks.

```
┌─────────────────────────────────────────────────────────────────┐
│                    Deadlock Scenario                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Transaction 1                  Transaction 2                    │
│  ─────────────                  ─────────────                    │
│                                                                  │
│  BEGIN TRAN                     BEGIN TRAN                       │
│  │                              │                                │
│  ├─ Lock Table A ─────────┐     ├─ Lock Table B ─────────┐      │
│  │  (exclusive)           │     │  (exclusive)           │      │
│  │                        │     │                        │      │
│  ├─ Request Lock B ◄──────┼─────┼── Holding Lock B       │      │
│  │  (waiting...)          │     │                        │      │
│  │                        └─────┼── Request Lock A ◄─────┘      │
│  │                              │  (waiting...)                 │
│  │          ▲                   │         │                     │
│  │          │    DEADLOCK!      │         │                     │
│  │          └───────────────────┴─────────┘                     │
│  │                                                               │
│  SQL Server detects and kills one transaction (victim)          │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Handling Deadlocks

```sql
-- Set deadlock priority (lower = more likely to be victim)
SET DEADLOCK_PRIORITY LOW;    -- or -10 to -5
SET DEADLOCK_PRIORITY NORMAL; -- or -5 to 5 (default 0)
SET DEADLOCK_PRIORITY HIGH;   -- or 5 to 10

-- Retry logic for deadlock victims
DECLARE @RetryCount INT = 0;
DECLARE @MaxRetries INT = 3;

WHILE @RetryCount < @MaxRetries
BEGIN
    BEGIN TRY
        BEGIN TRANSACTION;

            -- Your operations here
            UPDATE Products SET UnitsInStock = UnitsInStock - 1 WHERE ProductID = 1;
            UPDATE Inventory SET LastUpdated = GETDATE() WHERE ProductID = 1;

        COMMIT TRANSACTION;
        BREAK;  -- Success, exit loop
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;

        IF ERROR_NUMBER() = 1205  -- Deadlock victim
        BEGIN
            SET @RetryCount = @RetryCount + 1;
            IF @RetryCount < @MaxRetries
            BEGIN
                WAITFOR DELAY '00:00:00.100';  -- Wait 100ms before retry
                CONTINUE;
            END
        END

        -- Re-throw non-deadlock errors
        THROW;
    END CATCH
END;
```

### Preventing Deadlocks

```sql
-- 1. Access tables in consistent order
-- Always: Products → OrderDetails → Orders (not random order)

-- Transaction 1
BEGIN TRAN;
    UPDATE Products SET ...;
    UPDATE OrderDetails SET ...;
COMMIT;

-- Transaction 2 (same order)
BEGIN TRAN;
    UPDATE Products SET ...;
    UPDATE OrderDetails SET ...;
COMMIT;

-- 2. Keep transactions short
BEGIN TRAN;
    -- Do only database operations here
    -- Move calculations outside transaction
COMMIT;

-- 3. Use lower isolation levels when possible
SET TRANSACTION ISOLATION LEVEL READ COMMITTED;

-- 4. Use snapshot isolation to avoid read-write conflicts
SET TRANSACTION ISOLATION LEVEL SNAPSHOT;
```

## Practical Examples

### Order Processing Transaction

```sql
CREATE PROCEDURE ProcessOrder
    @CustomerID INT,
    @ProductID INT,
    @Quantity INT
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;

    DECLARE @OrderID INT;
    DECLARE @UnitPrice DECIMAL(10,2);
    DECLARE @Stock INT;

    BEGIN TRY
        BEGIN TRANSACTION;

        -- Lock the product row for update
        SELECT @UnitPrice = UnitPrice, @Stock = UnitsInStock
        FROM Products WITH (UPDLOCK, ROWLOCK)
        WHERE ProductID = @ProductID;

        -- Validate stock
        IF @Stock < @Quantity
        BEGIN
            RAISERROR('Insufficient stock. Available: %d', 16, 1, @Stock);
        END

        -- Create order
        INSERT INTO Orders (CustomerID, OrderDate, Status)
        VALUES (@CustomerID, GETDATE(), 'Processing');

        SET @OrderID = SCOPE_IDENTITY();

        -- Create order detail
        INSERT INTO OrderDetails (OrderID, ProductID, Quantity, UnitPrice)
        VALUES (@OrderID, @ProductID, @Quantity, @UnitPrice);

        -- Update stock
        UPDATE Products
        SET UnitsInStock = UnitsInStock - @Quantity
        WHERE ProductID = @ProductID;

        -- Update order status
        UPDATE Orders SET Status = 'Confirmed' WHERE OrderID = @OrderID;

        COMMIT TRANSACTION;

        SELECT @OrderID AS NewOrderID, 'Order processed successfully' AS Message;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;

        SELECT
            ERROR_NUMBER() AS ErrorNumber,
            ERROR_MESSAGE() AS ErrorMessage;
    END CATCH
END;
GO
```

### Bank Transfer Transaction

```sql
CREATE PROCEDURE TransferFunds
    @FromAccountID INT,
    @ToAccountID INT,
    @Amount DECIMAL(12,2)
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;

    BEGIN TRY
        BEGIN TRANSACTION;

        -- Lock accounts in consistent order (lower ID first) to prevent deadlocks
        DECLARE @FirstAccount INT = CASE WHEN @FromAccountID < @ToAccountID
                                         THEN @FromAccountID ELSE @ToAccountID END;
        DECLARE @SecondAccount INT = CASE WHEN @FromAccountID < @ToAccountID
                                          THEN @ToAccountID ELSE @FromAccountID END;

        -- Get exclusive locks in order
        DECLARE @Balance1 DECIMAL(12,2), @Balance2 DECIMAL(12,2);

        SELECT @Balance1 = Balance
        FROM Accounts WITH (XLOCK, ROWLOCK)
        WHERE AccountID = @FirstAccount;

        SELECT @Balance2 = Balance
        FROM Accounts WITH (XLOCK, ROWLOCK)
        WHERE AccountID = @SecondAccount;

        -- Check balance
        IF (SELECT Balance FROM Accounts WHERE AccountID = @FromAccountID) < @Amount
        BEGIN
            RAISERROR('Insufficient funds', 16, 1);
        END

        -- Perform transfer
        UPDATE Accounts SET Balance = Balance - @Amount WHERE AccountID = @FromAccountID;
        UPDATE Accounts SET Balance = Balance + @Amount WHERE AccountID = @ToAccountID;

        -- Log the transaction
        INSERT INTO TransactionLog (FromAccount, ToAccount, Amount, TransactionDate)
        VALUES (@FromAccountID, @ToAccountID, @Amount, GETDATE());

        COMMIT TRANSACTION;

        SELECT 'Transfer successful' AS Result;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;

        SELECT ERROR_MESSAGE() AS Error;
    END CATCH
END;
GO
```

## Summary

In this chapter, you learned:

- ACID properties: Atomicity, Consistency, Isolation, Durability
- Transaction syntax: BEGIN, COMMIT, ROLLBACK
- Savepoints for partial rollbacks
- Isolation levels and their trade-offs
- Lock types and compatibility
- Deadlock detection and prevention
- Practical transaction patterns

Ready to learn about security? Continue to [Chapter 10: Security](./10-security.md)!
