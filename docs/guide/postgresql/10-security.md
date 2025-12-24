# Security and User Management

Securing your PostgreSQL database is critical. This chapter covers user management, roles, permissions, and security best practices.

## PostgreSQL Security Model

```
┌─────────────────────────────────────────────────────────────────┐
│                   PostgreSQL Security Layers                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   Layer 1: Connection Security                                   │
│   ─────────────────────────────                                  │
│   • Host-based authentication (pg_hba.conf)                     │
│   • SSL/TLS encryption                                          │
│   • Firewall rules                                               │
│                                                                  │
│   Layer 2: Authentication                                        │
│   ───────────────────────                                        │
│   • Username/Password                                            │
│   • LDAP, GSSAPI, Certificate                                   │
│   • SCRAM-SHA-256 (recommended)                                 │
│                                                                  │
│   Layer 3: Authorization                                         │
│   ──────────────────────                                         │
│   • Roles and privileges                                         │
│   • Object permissions (tables, functions)                      │
│   • Row-level security                                           │
│                                                                  │
│   Layer 4: Data Protection                                       │
│   ────────────────────────                                       │
│   • Column encryption                                            │
│   • Data masking                                                 │
│   • Audit logging                                                │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Users and Roles

In PostgreSQL, users and roles are the same thing. A "user" is just a role with login privileges.

### Creating Roles

```sql
-- Create a basic role (cannot login by default)
CREATE ROLE developer;

-- Create a user (role that can login)
CREATE ROLE app_user WITH LOGIN PASSWORD 'secure_password';

-- Create user with more options
CREATE ROLE admin_user WITH
    LOGIN
    PASSWORD 'very_secure_password'
    SUPERUSER
    CREATEDB
    CREATEROLE
    VALID UNTIL '2025-12-31';

-- Create role using CREATE USER (shorthand for CREATE ROLE WITH LOGIN)
CREATE USER web_app WITH PASSWORD 'password123';
```

### Role Attributes

| Attribute | Description |
|-----------|-------------|
| `LOGIN` | Can connect to database |
| `SUPERUSER` | Bypasses all permission checks |
| `CREATEDB` | Can create databases |
| `CREATEROLE` | Can create other roles |
| `REPLICATION` | Can initiate streaming replication |
| `INHERIT` | Inherits privileges of member roles |
| `PASSWORD` | Sets authentication password |
| `VALID UNTIL` | Password expiration date |

### Modifying Roles

```sql
-- Change password
ALTER ROLE app_user WITH PASSWORD 'new_password';

-- Add/remove attributes
ALTER ROLE developer WITH LOGIN CREATEDB;
ALTER ROLE developer WITH NOLOGIN NOCREATEDB;

-- Rename role
ALTER ROLE old_name RENAME TO new_name;

-- Set password expiration
ALTER ROLE app_user VALID UNTIL '2024-12-31';
```

### Dropping Roles

```sql
-- Drop a role
DROP ROLE developer;

-- Drop if exists
DROP ROLE IF EXISTS developer;

-- Before dropping, reassign owned objects
REASSIGN OWNED BY developer TO admin;
DROP OWNED BY developer;
DROP ROLE developer;
```

### Viewing Roles

```sql
-- List all roles
\du

-- Or query the system catalog
SELECT rolname, rolsuper, rolinherit, rolcreaterole, rolcreatedb, rolcanlogin
FROM pg_roles;

-- Current user
SELECT current_user, session_user;
```

## Role Membership (Groups)

Roles can be members of other roles, creating a hierarchy.

```sql
-- Create group roles
CREATE ROLE readonly;
CREATE ROLE readwrite;
CREATE ROLE admin;

-- Add users to groups
GRANT readonly TO analyst_user;
GRANT readwrite TO developer_user;
GRANT admin TO admin_user;

-- Users can inherit group privileges
-- or explicitly switch to the role
SET ROLE admin;
RESET ROLE;

-- View role memberships
SELECT
    r.rolname AS role,
    m.rolname AS member
FROM pg_auth_members am
JOIN pg_roles r ON am.roleid = r.oid
JOIN pg_roles m ON am.member = m.oid;
```

## Privileges

### Database Privileges

```sql
-- Grant connect privilege
GRANT CONNECT ON DATABASE myapp TO app_user;

-- Grant all database privileges
GRANT ALL PRIVILEGES ON DATABASE myapp TO admin;

-- Revoke privileges
REVOKE CONNECT ON DATABASE myapp FROM public;
```

### Schema Privileges

```sql
-- Create schema
CREATE SCHEMA app;

-- Grant usage (see objects in schema)
GRANT USAGE ON SCHEMA app TO readonly;

-- Grant create (create objects in schema)
GRANT CREATE ON SCHEMA app TO developer;

-- Grant all
GRANT ALL ON SCHEMA app TO admin;
```

### Table Privileges

```sql
-- Grant specific privileges
GRANT SELECT ON users TO readonly;
GRANT SELECT, INSERT, UPDATE ON users TO readwrite;
GRANT ALL PRIVILEGES ON users TO admin;

-- Grant on all tables in schema
GRANT SELECT ON ALL TABLES IN SCHEMA public TO readonly;

-- Grant with option to pass privilege to others
GRANT SELECT ON users TO lead_developer WITH GRANT OPTION;

-- Set default privileges for future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT SELECT ON TABLES TO readonly;
```

### Column-Level Privileges

```sql
-- Grant access to specific columns only
GRANT SELECT (id, name, email) ON users TO marketing;
GRANT UPDATE (status) ON orders TO support;

-- Useful for hiding sensitive data
-- Marketing can see name/email but not password_hash
```

### Function Privileges

```sql
-- Grant execute privilege
GRANT EXECUTE ON FUNCTION calculate_total(integer) TO app_user;

-- Grant on all functions in schema
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO app_role;
```

### Viewing Privileges

```sql
-- Table privileges
\dp users

-- Or query information_schema
SELECT grantee, privilege_type
FROM information_schema.role_table_grants
WHERE table_name = 'users';

-- All privileges for a user
SELECT * FROM information_schema.role_table_grants
WHERE grantee = 'app_user';
```

## Row-Level Security (RLS)

RLS allows you to control which rows users can see or modify.

### Enable RLS

```sql
-- Create table
CREATE TABLE documents (
    id SERIAL PRIMARY KEY,
    owner_id INTEGER,
    title TEXT,
    content TEXT,
    is_public BOOLEAN DEFAULT false
);

-- Enable RLS
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Force RLS for table owner too
ALTER TABLE documents FORCE ROW LEVEL SECURITY;
```

### Creating Policies

```sql
-- Policy: Users can see their own documents
CREATE POLICY user_documents ON documents
    FOR SELECT
    USING (owner_id = current_setting('app.user_id')::INTEGER);

-- Policy: Users can see public documents
CREATE POLICY public_documents ON documents
    FOR SELECT
    USING (is_public = true);

-- Policy: Users can only insert their own documents
CREATE POLICY insert_own ON documents
    FOR INSERT
    WITH CHECK (owner_id = current_setting('app.user_id')::INTEGER);

-- Policy: Users can update their own documents
CREATE POLICY update_own ON documents
    FOR UPDATE
    USING (owner_id = current_setting('app.user_id')::INTEGER)
    WITH CHECK (owner_id = current_setting('app.user_id')::INTEGER);

-- Policy: Users can delete their own documents
CREATE POLICY delete_own ON documents
    FOR DELETE
    USING (owner_id = current_setting('app.user_id')::INTEGER);
```

### Using RLS with Application

```sql
-- Set user context before queries
SET app.user_id = '123';

-- Now queries automatically filter
SELECT * FROM documents;  -- Only shows user 123's documents + public docs

-- In application code (e.g., Node.js):
-- await pool.query("SET app.user_id = $1", [userId]);
-- await pool.query("SELECT * FROM documents");
```

### Multi-Tenant RLS

```sql
-- Table with tenant_id
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER NOT NULL,
    name TEXT,
    price DECIMAL
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Tenant isolation policy
CREATE POLICY tenant_isolation ON products
    USING (tenant_id = current_setting('app.tenant_id')::INTEGER);

-- Usage
SET app.tenant_id = '42';
SELECT * FROM products;  -- Only sees tenant 42's products
```

## Connection Security

### pg_hba.conf

The `pg_hba.conf` file controls who can connect:

```
# TYPE  DATABASE  USER       ADDRESS         METHOD

# Local connections
local   all       all                        scram-sha-256

# IPv4 connections
host    all       all        127.0.0.1/32    scram-sha-256
host    myapp     app_user   192.168.1.0/24  scram-sha-256

# Reject all other connections
host    all       all        0.0.0.0/0       reject

# SSL required for remote connections
hostssl all       all        0.0.0.0/0       scram-sha-256
```

### Authentication Methods

| Method | Description | Use Case |
|--------|-------------|----------|
| `trust` | No password required | Development only! |
| `scram-sha-256` | Secure password auth | Recommended |
| `md5` | Legacy password auth | Backwards compatibility |
| `cert` | SSL certificate | High security |
| `ldap` | LDAP authentication | Enterprise |
| `reject` | Always reject | Block access |

### SSL/TLS Configuration

```sql
-- Check if SSL is enabled
SHOW ssl;

-- View SSL connection info
SELECT * FROM pg_stat_ssl;
```

In `postgresql.conf`:
```
ssl = on
ssl_cert_file = 'server.crt'
ssl_key_file = 'server.key'
ssl_ca_file = 'ca.crt'
```

## Security Best Practices

### 1. Use Strong Passwords

```sql
-- Enforce password policies with extensions
CREATE EXTENSION IF NOT EXISTS passwordcheck;

-- Use SCRAM-SHA-256 (default in PostgreSQL 14+)
SET password_encryption = 'scram-sha-256';
```

### 2. Principle of Least Privilege

```sql
-- Create application-specific roles
CREATE ROLE app_readonly;
GRANT CONNECT ON DATABASE myapp TO app_readonly;
GRANT USAGE ON SCHEMA public TO app_readonly;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO app_readonly;

-- Application uses this limited role
CREATE USER web_backend WITH PASSWORD 'xxx';
GRANT app_readonly TO web_backend;
```

### 3. Revoke Default Privileges

```sql
-- Revoke public access to new databases
REVOKE ALL ON DATABASE myapp FROM public;

-- Revoke public schema access
REVOKE ALL ON SCHEMA public FROM public;
GRANT USAGE ON SCHEMA public TO app_role;
```

### 4. Separate Superuser from Application

```sql
-- NEVER use superuser for applications
-- Create dedicated application user
CREATE USER app_user WITH PASSWORD 'xxx';
GRANT app_role TO app_user;

-- Keep superuser for administration only
```

### 5. Audit Logging

```sql
-- Enable logging in postgresql.conf
-- log_statement = 'ddl'  -- or 'all' for everything
-- log_connections = on
-- log_disconnections = on

-- Or use pgAudit extension for detailed auditing
CREATE EXTENSION pgaudit;

-- Configure in postgresql.conf
-- pgaudit.log = 'write, ddl'
```

### 6. Regular Security Audits

```sql
-- Find superusers
SELECT rolname FROM pg_roles WHERE rolsuper = true;

-- Find users with CREATEDB
SELECT rolname FROM pg_roles WHERE rolcreatedb = true;

-- Find roles with no password expiration
SELECT rolname FROM pg_roles
WHERE rolcanlogin = true AND rolvaliduntil IS NULL;

-- Find tables accessible to public
SELECT schemaname, tablename, tableowner
FROM pg_tables
WHERE has_table_privilege('public', schemaname || '.' || tablename, 'SELECT');
```

## Practical Examples

### Complete Application Setup

```sql
-- 1. Create database
CREATE DATABASE myapp;

-- 2. Connect to new database
\c myapp

-- 3. Create schema
CREATE SCHEMA app;

-- 4. Revoke default privileges
REVOKE ALL ON SCHEMA public FROM public;
REVOKE ALL ON DATABASE myapp FROM public;

-- 5. Create roles
CREATE ROLE app_readonly;
CREATE ROLE app_readwrite;
CREATE ROLE app_admin;

-- 6. Grant schema access
GRANT USAGE ON SCHEMA app TO app_readonly;
GRANT USAGE, CREATE ON SCHEMA app TO app_readwrite;
GRANT ALL ON SCHEMA app TO app_admin;

-- 7. Grant table privileges
GRANT SELECT ON ALL TABLES IN SCHEMA app TO app_readonly;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA app TO app_readwrite;
GRANT ALL ON ALL TABLES IN SCHEMA app TO app_admin;

-- 8. Set default privileges for future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA app
GRANT SELECT ON TABLES TO app_readonly;

ALTER DEFAULT PRIVILEGES IN SCHEMA app
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO app_readwrite;

-- 9. Create application users
CREATE USER api_service WITH PASSWORD 'secure_api_password';
CREATE USER analytics_user WITH PASSWORD 'secure_analytics_password';
CREATE USER admin_user WITH PASSWORD 'secure_admin_password';

-- 10. Assign roles
GRANT app_readwrite TO api_service;
GRANT app_readonly TO analytics_user;
GRANT app_admin TO admin_user;
```

### Connection from Application

```javascript
// Node.js example with proper security
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,        // app-specific user, not superuser
  password: process.env.DB_PASSWORD, // from environment, not hardcoded
  ssl: {
    rejectUnauthorized: true,
    ca: fs.readFileSync('./ca-certificate.crt')
  }
});

// Use parameterized queries to prevent SQL injection
const result = await pool.query(
  'SELECT * FROM users WHERE email = $1',
  [userEmail]  // Never concatenate user input!
);
```

## Summary

| Topic | Key Points |
|-------|------------|
| **Roles** | Users are roles with LOGIN; use groups for organization |
| **Privileges** | Grant minimum required permissions |
| **RLS** | Row-level security for multi-tenant or user-specific data |
| **Authentication** | Use SCRAM-SHA-256; configure pg_hba.conf |
| **SSL** | Always use SSL for remote connections |
| **Best Practices** | Least privilege, no public access, audit regularly |

## Quick Reference

```sql
-- Create user
CREATE USER username WITH PASSWORD 'password';

-- Create role (group)
CREATE ROLE rolename;

-- Grant role membership
GRANT role TO user;

-- Grant privileges
GRANT SELECT ON table TO role;
GRANT ALL ON SCHEMA schema TO role;

-- Row-level security
ALTER TABLE table ENABLE ROW LEVEL SECURITY;
CREATE POLICY name ON table USING (condition);

-- View privileges
\du     -- List roles
\dp     -- Table privileges
```

## Congratulations!

You've completed the PostgreSQL tutorial! You now have a solid foundation in:

- Database and table management
- Data types and queries
- JOINs and relationships
- Functions and procedures
- Performance optimization
- Transactions and ACID
- Security and access control

Keep practicing, and refer back to these chapters as needed. Happy querying!
