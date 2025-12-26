# Security and Permissions

SQL Server provides comprehensive security features to protect your data. This chapter covers authentication, authorization, and security best practices.

## Security Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                SQL Server Security Layers                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Layer 1: Network Security                                       │
│  ─────────────────────────                                       │
│  • Firewall rules                                                │
│  • SSL/TLS encryption                                            │
│  • Network protocols                                             │
│                                                                  │
│  Layer 2: Authentication (Who are you?)                          │
│  ──────────────────────────────────────                          │
│  • Windows Authentication                                        │
│  • SQL Server Authentication                                     │
│  • Azure AD Authentication                                       │
│                                                                  │
│  Layer 3: Authorization (What can you do?)                       │
│  ─────────────────────────────────────────                       │
│  • Server-level permissions                                      │
│  • Database-level permissions                                    │
│  • Object-level permissions                                      │
│                                                                  │
│  Layer 4: Data Security                                          │
│  ──────────────────────                                          │
│  • Row-level security                                            │
│  • Dynamic data masking                                          │
│  • Always Encrypted                                              │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Authentication Modes

### Windows Authentication

Uses Windows/Active Directory credentials.

```sql
-- Create login from Windows account
CREATE LOGIN [DOMAIN\UserName] FROM WINDOWS;

-- Create login from Windows group
CREATE LOGIN [DOMAIN\DBAdmins] FROM WINDOWS;

-- Connect using Windows Authentication
-- Connection string:
-- Server=localhost;Database=MyDB;Trusted_Connection=True;
```

### SQL Server Authentication

Uses SQL Server-managed logins.

```sql
-- Create SQL login
CREATE LOGIN AppUser
WITH PASSWORD = 'StrongP@ssw0rd!',
     DEFAULT_DATABASE = SalesDB,
     CHECK_POLICY = ON,       -- Enforce Windows password policy
     CHECK_EXPIRATION = ON;   -- Password expiration

-- Alter login password
ALTER LOGIN AppUser WITH PASSWORD = 'NewP@ssw0rd!';

-- Disable/Enable login
ALTER LOGIN AppUser DISABLE;
ALTER LOGIN AppUser ENABLE;

-- Unlock locked account
ALTER LOGIN AppUser WITH CHECK_POLICY = OFF;
ALTER LOGIN AppUser WITH CHECK_POLICY = ON;

-- View all logins
SELECT name, type_desc, is_disabled, create_date
FROM sys.server_principals
WHERE type IN ('S', 'U', 'G')  -- SQL, Windows user, Windows group
ORDER BY name;
```

### Mixed Mode

Both Windows and SQL Server authentication.

```sql
-- Check current authentication mode
SELECT
    CASE SERVERPROPERTY('IsIntegratedSecurityOnly')
        WHEN 1 THEN 'Windows Authentication Only'
        WHEN 0 THEN 'Mixed Mode (Windows + SQL)'
    END AS AuthenticationMode;

-- Change authentication mode (requires SSMS or registry change + restart)
```

## Logins vs Users

```
┌─────────────────────────────────────────────────────────────────┐
│                  Logins vs Users                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Server Level                   Database Level                   │
│  ────────────                   ──────────────                   │
│                                                                  │
│  ┌──────────────┐              ┌──────────────┐                 │
│  │    LOGIN     │──────────────│     USER     │                 │
│  │  (AppUser)   │   maps to    │  (AppUser)   │                 │
│  └──────────────┘              └──────────────┘                 │
│        │                             │                           │
│        │                             │                           │
│  Server Roles              Database Roles                        │
│  • sysadmin                • db_owner                           │
│  • securityadmin           • db_datareader                      │
│  • serveradmin             • db_datawriter                      │
│                            • Custom roles                        │
│                                                                  │
│  One LOGIN can map to multiple USERS (one per database)         │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Creating Users

```sql
-- Create user for a login
USE SalesDB;
GO

CREATE USER AppUser FOR LOGIN AppUser;

-- Create user with default schema
CREATE USER AppUser FOR LOGIN AppUser
WITH DEFAULT_SCHEMA = Sales;

-- Create user without login (contained database)
CREATE USER ContainedUser WITH PASSWORD = 'StrongP@ss!';

-- View all users in database
SELECT name, type_desc, default_schema_name
FROM sys.database_principals
WHERE type IN ('S', 'U', 'G')
ORDER BY name;

-- Map login to user
ALTER USER AppUser WITH LOGIN = AppUser;

-- Drop user
DROP USER IF EXISTS AppUser;
```

## Server Roles

### Fixed Server Roles

| Role | Description |
|------|-------------|
| **sysadmin** | Full control over SQL Server |
| **serveradmin** | Configure server settings |
| **securityadmin** | Manage logins and permissions |
| **processadmin** | Manage SQL Server processes |
| **setupadmin** | Manage linked servers |
| **bulkadmin** | Execute BULK INSERT |
| **diskadmin** | Manage disk files |
| **dbcreator** | Create and alter databases |
| **public** | Default role for all logins |

```sql
-- Add login to server role
ALTER SERVER ROLE sysadmin ADD MEMBER AppUser;

-- Remove from server role
ALTER SERVER ROLE sysadmin DROP MEMBER AppUser;

-- View server role members
SELECT
    r.name AS RoleName,
    m.name AS MemberName
FROM sys.server_role_members rm
INNER JOIN sys.server_principals r ON rm.role_principal_id = r.principal_id
INNER JOIN sys.server_principals m ON rm.member_principal_id = m.principal_id
ORDER BY r.name, m.name;

-- Check if login has sysadmin
SELECT IS_SRVROLEMEMBER('sysadmin', 'AppUser') AS IsSysAdmin;
```

### Custom Server Roles (SQL Server 2012+)

```sql
-- Create custom server role
CREATE SERVER ROLE AuditViewers;

-- Grant permissions to server role
GRANT VIEW SERVER STATE TO AuditViewers;
GRANT VIEW ANY DATABASE TO AuditViewers;

-- Add members
ALTER SERVER ROLE AuditViewers ADD MEMBER AppUser;
```

## Database Roles

### Fixed Database Roles

| Role | Description |
|------|-------------|
| **db_owner** | Full control over database |
| **db_securityadmin** | Manage roles and permissions |
| **db_accessadmin** | Manage user access |
| **db_backupoperator** | Backup the database |
| **db_ddladmin** | Run DDL commands |
| **db_datawriter** | INSERT, UPDATE, DELETE |
| **db_datareader** | SELECT from all tables |
| **db_denydatawriter** | Cannot modify data |
| **db_denydatareader** | Cannot read data |
| **public** | Default role for all users |

```sql
USE SalesDB;
GO

-- Add user to database role
ALTER ROLE db_datareader ADD MEMBER AppUser;
ALTER ROLE db_datawriter ADD MEMBER AppUser;

-- Remove from role
ALTER ROLE db_datawriter DROP MEMBER AppUser;

-- View database role members
SELECT
    r.name AS RoleName,
    m.name AS MemberName
FROM sys.database_role_members rm
INNER JOIN sys.database_principals r ON rm.role_principal_id = r.principal_id
INNER JOIN sys.database_principals m ON rm.member_principal_id = m.principal_id
ORDER BY r.name, m.name;
```

### Custom Database Roles

```sql
-- Create custom role
CREATE ROLE SalesTeam;

-- Grant permissions to role
GRANT SELECT, INSERT, UPDATE ON Sales.Orders TO SalesTeam;
GRANT SELECT ON Sales.Products TO SalesTeam;
GRANT EXECUTE ON Sales.CreateOrder TO SalesTeam;

-- Add users to role
ALTER ROLE SalesTeam ADD MEMBER SalesUser1;
ALTER ROLE SalesTeam ADD MEMBER SalesUser2;

-- Drop role (remove members first)
ALTER ROLE SalesTeam DROP MEMBER SalesUser1;
DROP ROLE SalesTeam;
```

## Object Permissions

### Permission Types

```
┌─────────────────────────────────────────────────────────────────┐
│                    Permission Types                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Table/View Permissions:                                         │
│  ───────────────────────                                         │
│  SELECT, INSERT, UPDATE, DELETE                                  │
│  REFERENCES (for foreign keys)                                   │
│                                                                  │
│  Stored Procedure/Function Permissions:                          │
│  ───────────────────────────────────────                         │
│  EXECUTE                                                         │
│                                                                  │
│  Schema Permissions:                                             │
│  ───────────────────                                             │
│  SELECT, INSERT, UPDATE, DELETE, EXECUTE on all objects         │
│                                                                  │
│  Database Permissions:                                           │
│  ─────────────────────                                           │
│  CREATE TABLE, CREATE PROCEDURE, BACKUP DATABASE, etc.          │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### GRANT, DENY, REVOKE

```sql
-- GRANT: Give permission
GRANT SELECT ON Products TO AppUser;
GRANT SELECT, INSERT, UPDATE ON Orders TO SalesTeam;
GRANT EXECUTE ON dbo.CreateOrder TO SalesTeam;

-- Grant on schema (all objects in schema)
GRANT SELECT ON SCHEMA::Sales TO ReportUser;

-- Grant with grant option (user can grant to others)
GRANT SELECT ON Products TO TeamLead WITH GRANT OPTION;

-- DENY: Explicitly block permission (overrides GRANT)
DENY DELETE ON Products TO AppUser;
DENY SELECT ON SensitiveData TO PublicRole;

-- REVOKE: Remove GRANT or DENY
REVOKE SELECT ON Products FROM AppUser;
REVOKE DELETE ON Products FROM AppUser;

-- Column-level permissions
GRANT SELECT ON Employees(EmployeeID, FirstName, LastName) TO HRUser;
DENY SELECT ON Employees(Salary) TO HRUser;
```

### View Effective Permissions

```sql
-- Check your own permissions
SELECT * FROM fn_my_permissions('Products', 'OBJECT');

-- Check another user's permissions
EXECUTE AS USER = 'AppUser';
SELECT * FROM fn_my_permissions('Products', 'OBJECT');
REVERT;

-- Check database-level permissions
SELECT * FROM fn_my_permissions(NULL, 'DATABASE');

-- View all permissions in database
SELECT
    pr.name AS Principal,
    pr.type_desc AS PrincipalType,
    pe.permission_name,
    pe.state_desc AS PermissionState,
    OBJECT_NAME(pe.major_id) AS ObjectName
FROM sys.database_permissions pe
INNER JOIN sys.database_principals pr ON pe.grantee_principal_id = pr.principal_id
WHERE OBJECT_NAME(pe.major_id) IS NOT NULL
ORDER BY pr.name, OBJECT_NAME(pe.major_id);
```

## Schemas for Security

Schemas help organize objects and simplify permissions.

```sql
-- Create schemas
CREATE SCHEMA Sales AUTHORIZATION dbo;
CREATE SCHEMA HR AUTHORIZATION dbo;
CREATE SCHEMA Reports AUTHORIZATION dbo;

-- Create objects in schema
CREATE TABLE Sales.Orders (...);
CREATE TABLE HR.Employees (...);
CREATE PROCEDURE Reports.GetSalesSummary AS ...;

-- Grant schema-level permissions
GRANT SELECT, INSERT, UPDATE ON SCHEMA::Sales TO SalesTeam;
GRANT SELECT ON SCHEMA::Reports TO ReportUsers;
GRANT SELECT ON SCHEMA::HR TO HRTeam;

-- Set default schema for user
ALTER USER SalesUser WITH DEFAULT_SCHEMA = Sales;
```

## Row-Level Security

Control access to specific rows based on user context.

```sql
-- Create table
CREATE TABLE Sales.CustomerData (
    CustomerID INT PRIMARY KEY,
    CustomerName NVARCHAR(100),
    Region NVARCHAR(50),
    Revenue DECIMAL(12,2)
);

-- Create function for RLS policy
CREATE FUNCTION Sales.fn_SecurityPredicate(@Region NVARCHAR(50))
RETURNS TABLE
WITH SCHEMABINDING
AS
RETURN
    SELECT 1 AS result
    WHERE @Region = USER_NAME()
       OR USER_NAME() = 'dbo'
       OR IS_MEMBER('SalesManagers') = 1;
GO

-- Create security policy
CREATE SECURITY POLICY Sales.RegionPolicy
ADD FILTER PREDICATE Sales.fn_SecurityPredicate(Region) ON Sales.CustomerData,
ADD BLOCK PREDICATE Sales.fn_SecurityPredicate(Region) ON Sales.CustomerData
WITH (STATE = ON);

-- Now users only see rows matching their region
-- User 'East' only sees rows WHERE Region = 'East'
-- User 'West' only sees rows WHERE Region = 'West'
-- SalesManagers see all rows
```

## Dynamic Data Masking

Hide sensitive data from unauthorized users.

```sql
-- Create table with masked columns
CREATE TABLE Customers (
    CustomerID INT PRIMARY KEY,
    FirstName NVARCHAR(50),
    LastName NVARCHAR(50),
    -- Mask email (show first letter and domain)
    Email NVARCHAR(100) MASKED WITH (FUNCTION = 'email()'),
    -- Mask phone (show last 4 digits)
    Phone NVARCHAR(20) MASKED WITH (FUNCTION = 'partial(0, "XXX-XXX-", 4)'),
    -- Mask SSN completely
    SSN CHAR(11) MASKED WITH (FUNCTION = 'default()'),
    -- Mask credit card (show last 4)
    CreditCard NVARCHAR(20) MASKED WITH (FUNCTION = 'partial(0, "XXXX-XXXX-XXXX-", 4)')
);

-- Add mask to existing column
ALTER TABLE Customers
ALTER COLUMN Salary ADD MASKED WITH (FUNCTION = 'default()');

-- Grant unmask permission
GRANT UNMASK TO HRManager;

-- View masked data (regular user)
SELECT FirstName, Email, Phone, SSN FROM Customers;
-- Result: John, jXXX@XXXX.com, XXX-XXX-1234, XXXX, XXXX-XXXX-XXXX-5678

-- View unmasked data (user with UNMASK)
SELECT FirstName, Email, Phone, SSN FROM Customers;
-- Result: John, john@email.com, 555-123-1234, 123-45-6789, 4111-1111-1111-5678
```

## Encryption

### Transparent Data Encryption (TDE)

Encrypts database files at rest.

```sql
-- Create master key in master database
USE master;
GO
CREATE MASTER KEY ENCRYPTION BY PASSWORD = 'StrongP@ss!';

-- Create certificate
CREATE CERTIFICATE TDECert WITH SUBJECT = 'TDE Certificate';

-- Create database encryption key
USE SalesDB;
GO
CREATE DATABASE ENCRYPTION KEY
WITH ALGORITHM = AES_256
ENCRYPTION BY SERVER CERTIFICATE TDECert;

-- Enable TDE
ALTER DATABASE SalesDB SET ENCRYPTION ON;

-- Check encryption status
SELECT
    DB_NAME(database_id) AS DatabaseName,
    encryption_state,
    CASE encryption_state
        WHEN 0 THEN 'No encryption'
        WHEN 1 THEN 'Unencrypted'
        WHEN 2 THEN 'Encryption in progress'
        WHEN 3 THEN 'Encrypted'
        WHEN 4 THEN 'Key change in progress'
        WHEN 5 THEN 'Decryption in progress'
    END AS EncryptionStateDesc
FROM sys.dm_database_encryption_keys;
```

### Always Encrypted

Encrypts data in the application, SQL Server never sees plaintext.

```sql
-- Create column master key (points to certificate in Windows cert store)
CREATE COLUMN MASTER KEY CMK_Auto1
WITH (
    KEY_STORE_PROVIDER_NAME = 'MSSQL_CERTIFICATE_STORE',
    KEY_PATH = 'CurrentUser/My/certificate_thumbprint'
);

-- Create column encryption key
CREATE COLUMN ENCRYPTION KEY CEK_Auto1
WITH VALUES (
    COLUMN_MASTER_KEY = CMK_Auto1,
    ALGORITHM = 'RSA_OAEP',
    ENCRYPTED_VALUE = 0x... -- generated value
);

-- Create table with encrypted columns
CREATE TABLE Patients (
    PatientID INT PRIMARY KEY,
    FirstName NVARCHAR(50),
    LastName NVARCHAR(50),
    SSN CHAR(11) ENCRYPTED WITH (
        COLUMN_ENCRYPTION_KEY = CEK_Auto1,
        ENCRYPTION_TYPE = DETERMINISTIC,  -- Allows equality comparisons
        ALGORITHM = 'AEAD_AES_256_CBC_HMAC_SHA_256'
    ),
    DateOfBirth DATE ENCRYPTED WITH (
        COLUMN_ENCRYPTION_KEY = CEK_Auto1,
        ENCRYPTION_TYPE = RANDOMIZED,  -- More secure, no comparisons
        ALGORITHM = 'AEAD_AES_256_CBC_HMAC_SHA_256'
    )
);
```

## Auditing

### SQL Server Audit

```sql
-- Create server audit
CREATE SERVER AUDIT SecurityAudit
TO FILE (
    FILEPATH = 'C:\SQLAudit\',
    MAXSIZE = 100 MB,
    MAX_FILES = 10
)
WITH (ON_FAILURE = CONTINUE);

-- Enable the audit
ALTER SERVER AUDIT SecurityAudit WITH (STATE = ON);

-- Create database audit specification
USE SalesDB;
GO
CREATE DATABASE AUDIT SPECIFICATION SalesDBSpec
FOR SERVER AUDIT SecurityAudit
ADD (SELECT, INSERT, UPDATE, DELETE ON Sales.Orders BY public),
ADD (EXECUTE ON SCHEMA::Sales BY public)
WITH (STATE = ON);

-- Create server audit specification (login events)
CREATE SERVER AUDIT SPECIFICATION LoginAudit
FOR SERVER AUDIT SecurityAudit
ADD (FAILED_LOGIN_GROUP),
ADD (SUCCESSFUL_LOGIN_GROUP),
ADD (LOGIN_CHANGE_PASSWORD_GROUP)
WITH (STATE = ON);

-- View audit logs
SELECT * FROM fn_get_audit_file('C:\SQLAudit\*.sqlaudit', NULL, NULL);
```

## Security Best Practices

```
┌─────────────────────────────────────────────────────────────────┐
│                  Security Best Practices                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Authentication:                                                 │
│  ───────────────                                                 │
│  • Prefer Windows Authentication over SQL Auth                  │
│  • Use strong password policies                                 │
│  • Disable SA account or use strong password                   │
│  • Use managed service accounts for services                    │
│                                                                  │
│  Authorization:                                                  │
│  ──────────────                                                  │
│  • Follow principle of least privilege                          │
│  • Use roles instead of granting to users directly             │
│  • Grant EXECUTE on procedures, not SELECT on tables           │
│  • Use schemas to organize and secure objects                   │
│  • Avoid using sysadmin except for true admins                 │
│                                                                  │
│  Data Protection:                                                │
│  ────────────────                                                │
│  • Enable TDE for databases at rest                             │
│  • Use Always Encrypted for sensitive columns                  │
│  • Implement dynamic data masking for non-admins               │
│  • Use row-level security for multi-tenant data                │
│                                                                  │
│  Monitoring:                                                     │
│  ──────────                                                      │
│  • Enable SQL Server Audit                                      │
│  • Monitor failed login attempts                                │
│  • Review permissions regularly                                  │
│  • Keep SQL Server patched                                      │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Security Checklist

```sql
-- 1. Check for weak passwords (SQL logins with simple passwords)
SELECT name FROM sys.sql_logins WHERE PWDCOMPARE('password', password_hash) = 1;
SELECT name FROM sys.sql_logins WHERE PWDCOMPARE('123456', password_hash) = 1;

-- 2. Check for orphaned users
SELECT dp.name AS UserName
FROM sys.database_principals dp
LEFT JOIN sys.server_principals sp ON dp.sid = sp.sid
WHERE dp.type IN ('S', 'U') AND sp.sid IS NULL AND dp.name NOT IN ('dbo', 'guest');

-- 3. Check for users with excessive permissions
SELECT
    pr.name,
    pe.permission_name,
    pe.state_desc
FROM sys.database_principals pr
INNER JOIN sys.database_permissions pe ON pr.principal_id = pe.grantee_principal_id
WHERE pe.permission_name IN ('CONTROL', 'ALTER ANY USER', 'ALTER ANY ROLE');

-- 4. Check public role permissions
SELECT
    permission_name,
    OBJECT_NAME(major_id) AS ObjectName
FROM sys.database_permissions
WHERE grantee_principal_id = DATABASE_PRINCIPAL_ID('public')
AND permission_name <> 'CONNECT';

-- 5. Check for xp_cmdshell enabled
SELECT name, value_in_use
FROM sys.configurations
WHERE name = 'xp_cmdshell';
```

## Summary

In this chapter, you learned:

- SQL Server security layers and architecture
- Authentication modes: Windows vs SQL Server
- Logins (server) vs Users (database)
- Server and database roles
- GRANT, DENY, REVOKE permissions
- Row-level security for data filtering
- Dynamic data masking for sensitive data
- Encryption: TDE and Always Encrypted
- Auditing capabilities
- Security best practices

Congratulations! You've completed the SQL Server tutorial series. You now have a solid foundation in SQL Server development.

## What's Next?

- Practice with real-world projects
- Explore advanced topics: Replication, Always On, SSIS
- Consider Microsoft certifications
- Join SQL Server community forums
