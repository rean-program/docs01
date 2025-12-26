# Installing SQL Server

This chapter covers installing SQL Server on Windows, Docker, and connecting via various tools.

## Installation Options Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                  SQL Server Installation Options                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Local Installation                     Cloud Options            │
│  ──────────────────                     ─────────────            │
│  ┌─────────────────┐                   ┌─────────────────┐      │
│  │    Windows      │                   │   Azure SQL     │      │
│  │  (Recommended)  │                   │   Database      │      │
│  └─────────────────┘                   └─────────────────┘      │
│  ┌─────────────────┐                   ┌─────────────────┐      │
│  │    Docker       │                   │   Azure SQL     │      │
│  │ (Cross-platform)│                   │ Managed Instance│      │
│  └─────────────────┘                   └─────────────────┘      │
│  ┌─────────────────┐                   ┌─────────────────┐      │
│  │    Linux        │                   │   AWS RDS for   │      │
│  │ (Ubuntu/RHEL)   │                   │   SQL Server    │      │
│  └─────────────────┘                   └─────────────────┘      │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Option 1: Windows Installation (Recommended)

### Step 1: Download SQL Server

1. Visit the [SQL Server Downloads](https://www.microsoft.com/sql-server/sql-server-downloads) page
2. Choose your edition:
   - **Developer** - Free, full features (for development only)
   - **Express** - Free, limited features (for small applications)

### Step 2: Run the Installer

```
┌─────────────────────────────────────────────────────────────────┐
│                SQL Server Installation Center                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Installation Type:                                              │
│  ─────────────────                                               │
│                                                                  │
│  ○ Basic          - Quick install with default settings         │
│                     (Recommended for beginners)                  │
│                                                                  │
│  ○ Custom         - Choose features and locations               │
│                     (For specific requirements)                  │
│                                                                  │
│  ○ Download Media - Download for offline installation           │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Step 3: Basic Installation

For beginners, choose **Basic** installation:

1. Accept the license terms
2. Choose installation location (default is fine)
3. Click **Install**
4. Wait for installation to complete (10-20 minutes)

### Step 4: Note the Connection String

After installation, you'll see a summary:

```
┌─────────────────────────────────────────────────────────────────┐
│               Installation Complete!                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Instance Name:     MSSQLSERVER (default)                        │
│  Connection String: localhost                                    │
│  SA Password:       (You set this during install)                │
│                                                                  │
│  Next Steps:                                                     │
│  • Install SSMS (SQL Server Management Studio)                   │
│  • Connect and start creating databases                          │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

::: tip Save Your Connection Details
Write down your instance name and SA password. You'll need them to connect!
:::

## Option 2: Docker Installation (Cross-Platform)

Docker is the best option for macOS and Linux users.

### Prerequisites

1. Install [Docker Desktop](https://www.docker.com/products/docker-desktop)
2. Allocate at least 4GB RAM to Docker

### Step 1: Pull the SQL Server Image

```bash
# Pull the latest SQL Server 2022 image
docker pull mcr.microsoft.com/mssql/server:2022-latest
```

### Step 2: Run SQL Server Container

```bash
# Run SQL Server container
docker run -e "ACCEPT_EULA=Y" \
  -e "MSSQL_SA_PASSWORD=YourStrong@Passw0rd" \
  -p 1433:1433 \
  --name sqlserver \
  --hostname sqlserver \
  -d mcr.microsoft.com/mssql/server:2022-latest
```

::: warning Password Requirements
SA password must be at least 8 characters and contain:
- Uppercase letters
- Lowercase letters
- Numbers
- Special characters
:::

### Step 3: Verify Container is Running

```bash
# Check container status
docker ps

# View logs if needed
docker logs sqlserver
```

### Step 4: Connect to SQL Server

```bash
# Connect using sqlcmd inside the container
docker exec -it sqlserver /opt/mssql-tools18/bin/sqlcmd \
  -S localhost -U SA -P "YourStrong@Passw0rd" -C

# Or connect from host machine
sqlcmd -S localhost,1433 -U SA -P "YourStrong@Passw0rd"
```

### Docker Commands Reference

```bash
# Start the container
docker start sqlserver

# Stop the container
docker stop sqlserver

# Remove the container
docker rm sqlserver

# View container logs
docker logs sqlserver

# Execute commands inside container
docker exec -it sqlserver bash
```

### Docker Compose (Recommended for Development)

Create a `docker-compose.yml` file:

```yaml
version: '3.8'

services:
  sqlserver:
    image: mcr.microsoft.com/mssql/server:2022-latest
    container_name: sqlserver
    hostname: sqlserver
    environment:
      - ACCEPT_EULA=Y
      - MSSQL_SA_PASSWORD=YourStrong@Passw0rd
      - MSSQL_PID=Developer
    ports:
      - "1433:1433"
    volumes:
      - sqlserver_data:/var/opt/mssql
    restart: unless-stopped

volumes:
  sqlserver_data:
```

Run with:
```bash
docker-compose up -d
```

## Option 3: Linux Installation (Ubuntu)

### Step 1: Add Microsoft Repository

```bash
# Import the public repository GPG keys
curl https://packages.microsoft.com/keys/microsoft.asc | sudo apt-key add -

# Register the Microsoft SQL Server Ubuntu repository
curl https://packages.microsoft.com/config/ubuntu/22.04/mssql-server-2022.list | \
  sudo tee /etc/apt/sources.list.d/mssql-server.list
```

### Step 2: Install SQL Server

```bash
# Update apt and install SQL Server
sudo apt-get update
sudo apt-get install -y mssql-server
```

### Step 3: Configure SQL Server

```bash
# Run the setup script
sudo /opt/mssql/bin/mssql-conf setup
```

Follow the prompts:
1. Select edition (Developer for learning)
2. Accept license terms
3. Set SA password

### Step 4: Verify Installation

```bash
# Check SQL Server status
systemctl status mssql-server

# Enable SQL Server to start on boot
sudo systemctl enable mssql-server
```

## Installing Management Tools

### SQL Server Management Studio (SSMS) - Windows Only

1. Download [SSMS](https://docs.microsoft.com/sql/ssms/download-sql-server-management-studio-ssms)
2. Run the installer
3. Complete installation (no configuration needed)

```
┌─────────────────────────────────────────────────────────────────┐
│                SSMS Features                                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  • Object Explorer - Browse databases, tables, views            │
│  • Query Editor - Write and execute T-SQL                       │
│  • IntelliSense - Auto-complete for SQL                         │
│  • Execution Plans - Visual query analysis                      │
│  • Database Diagrams - Visual relationships                     │
│  • Import/Export Wizard - Data migration                        │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Azure Data Studio (Cross-Platform)

1. Download [Azure Data Studio](https://docs.microsoft.com/sql/azure-data-studio/download)
2. Available for Windows, macOS, and Linux
3. Modern interface with extensions support

```
┌─────────────────────────────────────────────────────────────────┐
│              Azure Data Studio Features                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  • Cross-platform (Windows, macOS, Linux)                       │
│  • Modern VS Code-like interface                                │
│  • Jupyter Notebook integration                                  │
│  • Git integration                                               │
│  • Extensions marketplace                                        │
│  • Built-in terminal                                             │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Connecting to SQL Server

### Using SSMS

1. Open SQL Server Management Studio
2. Enter connection details:

```
┌─────────────────────────────────────────────────────────────────┐
│                  Connect to Server                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Server type:        Database Engine                             │
│                                                                  │
│  Server name:        localhost                                   │
│                      (or SERVERNAME\INSTANCENAME)                │
│                                                                  │
│  Authentication:     ○ Windows Authentication                   │
│                      ● SQL Server Authentication                 │
│                                                                  │
│  Login:              sa                                          │
│  Password:           ********                                    │
│                                                                  │
│  [ ] Remember password                                           │
│                                                                  │
│                          [Connect] [Cancel]                      │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Using Azure Data Studio

1. Open Azure Data Studio
2. Click **New Connection**
3. Fill in connection details
4. Click **Connect**

### Using Command Line (sqlcmd)

```bash
# Basic connection
sqlcmd -S localhost -U sa -P YourPassword

# Connect to named instance
sqlcmd -S localhost\SQLEXPRESS -U sa -P YourPassword

# Connect with Windows Authentication
sqlcmd -S localhost -E
```

### Connection String Examples

```
┌─────────────────────────────────────────────────────────────────┐
│                  Connection String Formats                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ADO.NET:                                                        │
│  Server=localhost;Database=MyDB;User Id=sa;Password=xxx;         │
│                                                                  │
│  ODBC:                                                           │
│  Driver={ODBC Driver 18 for SQL Server};Server=localhost;        │
│  Database=MyDB;Uid=sa;Pwd=xxx;                                   │
│                                                                  │
│  JDBC:                                                           │
│  jdbc:sqlserver://localhost:1433;                                │
│  databaseName=MyDB;user=sa;password=xxx;                         │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Verify Installation

After connecting, run these queries to verify:

```sql
-- Check SQL Server version
SELECT @@VERSION;

-- Check server name
SELECT @@SERVERNAME;

-- List all databases
SELECT name FROM sys.databases;

-- Check current database
SELECT DB_NAME();
```

Expected output:

```
Microsoft SQL Server 2022 (RTM) - 16.0.1000.6 (X64)
    Oct 8 2022 05:58:25
    Copyright (C) 2022 Microsoft Corporation
    Developer Edition (64-bit) on Windows Server 2019 Standard 10.0
```

## Create Your First Database

```sql
-- Create a new database
CREATE DATABASE LearningDB;
GO

-- Switch to the new database
USE LearningDB;
GO

-- Create a simple table
CREATE TABLE Students (
    StudentID INT PRIMARY KEY IDENTITY(1,1),
    FirstName NVARCHAR(50) NOT NULL,
    LastName NVARCHAR(50) NOT NULL,
    Email NVARCHAR(100),
    EnrollmentDate DATE DEFAULT GETDATE()
);
GO

-- Insert some test data
INSERT INTO Students (FirstName, LastName, Email)
VALUES
    ('John', 'Doe', 'john.doe@email.com'),
    ('Jane', 'Smith', 'jane.smith@email.com'),
    ('Bob', 'Johnson', 'bob.johnson@email.com');

-- Query the data
SELECT * FROM Students;
```

## Troubleshooting Common Issues

### Cannot Connect to SQL Server

```
┌─────────────────────────────────────────────────────────────────┐
│                  Connection Troubleshooting                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Issue: Cannot connect to localhost                              │
│  ─────────────────────────────────────                           │
│  1. Check SQL Server service is running                          │
│     - Windows: services.msc → SQL Server (MSSQLSERVER)          │
│     - Linux: systemctl status mssql-server                       │
│     - Docker: docker ps                                          │
│                                                                  │
│  2. Check TCP/IP is enabled                                      │
│     - Open SQL Server Configuration Manager                      │
│     - SQL Server Network Configuration → Protocols              │
│     - Enable TCP/IP                                              │
│                                                                  │
│  3. Check firewall allows port 1433                              │
│     - Windows Firewall → Allow SQL Server                        │
│                                                                  │
│  4. Verify correct instance name                                 │
│     - Default: localhost                                         │
│     - Named: localhost\INSTANCENAME                              │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### SQL Server Service Won't Start

```bash
# Check Windows Event Log
# Event Viewer → Windows Logs → Application

# Check SQL Server error log
# C:\Program Files\Microsoft SQL Server\MSSQL16.MSSQLSERVER\MSSQL\Log\ERRORLOG
```

### Docker Container Exits Immediately

```bash
# Check logs
docker logs sqlserver

# Common issues:
# - Password doesn't meet complexity requirements
# - Not enough memory (need 2GB minimum)
# - EULA not accepted
```

## Summary

In this chapter, you learned:

- How to install SQL Server on Windows (recommended for beginners)
- How to run SQL Server in Docker (best for macOS/Linux)
- How to install on Linux directly
- How to install and use SSMS and Azure Data Studio
- How to connect to SQL Server
- How to verify your installation
- Common troubleshooting steps

Ready to start writing SQL? Continue to [Chapter 3: T-SQL Basics](./03-basics.md)!
