# Installing PostgreSQL

This chapter covers how to install PostgreSQL on Windows, macOS, and Linux. We'll also explore using Docker and cloud-hosted options.

## Installation Options Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                   Installation Methods                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   Method              Best For                  Difficulty       │
│   ──────              ────────                  ──────────       │
│                                                                  │
│   Native Install      Production systems        ⭐⭐              │
│   Docker              Development/Testing       ⭐                │
│   Cloud Hosted        Managed solutions         ⭐                │
│   Package Manager     Quick setup               ⭐                │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Installing on macOS

### Option 1: Homebrew (Recommended)

Homebrew is the easiest way to install PostgreSQL on macOS.

**Step 1: Install Homebrew (if not already installed)**

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

**Step 2: Install PostgreSQL**

```bash
# Install the latest version of PostgreSQL
brew install postgresql@16

# Add PostgreSQL to your PATH
echo 'export PATH="/opt/homebrew/opt/postgresql@16/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

**Step 3: Start PostgreSQL**

```bash
# Start PostgreSQL as a background service
brew services start postgresql@16

# Check if it's running
brew services list
```

**Step 4: Verify Installation**

```bash
# Check PostgreSQL version
psql --version
# Output: psql (PostgreSQL) 16.x

# Connect to the default database
psql postgres
```

::: tip Success Indicator
If you see `postgres=#` prompt, PostgreSQL is installed and running correctly!
:::

### Option 2: Postgres.app

A simple, native macOS app with a nice interface.

1. Download from [postgresapp.com](https://postgresapp.com/)
2. Move to Applications folder
3. Open and click "Initialize"
4. Add to PATH:

```bash
sudo mkdir -p /etc/paths.d && echo /Applications/Postgres.app/Contents/Versions/latest/bin | sudo tee /etc/paths.d/postgresapp
```

## Installing on Windows

### Option 1: Official Installer (Recommended)

**Step 1: Download Installer**

Visit [postgresql.org/download/windows](https://www.postgresql.org/download/windows/) and download the installer.

**Step 2: Run the Installer**

```
┌─────────────────────────────────────────────────────────────────┐
│              PostgreSQL Installation Wizard                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   1. Welcome Screen                                              │
│      └── Click "Next"                                            │
│                                                                  │
│   2. Installation Directory                                      │
│      └── Keep default: C:\Program Files\PostgreSQL\16           │
│                                                                  │
│   3. Select Components                                           │
│      └── ☑ PostgreSQL Server                                    │
│      └── ☑ pgAdmin 4 (GUI tool)                                 │
│      └── ☑ Stack Builder                                        │
│      └── ☑ Command Line Tools                                   │
│                                                                  │
│   4. Data Directory                                              │
│      └── Keep default: C:\Program Files\PostgreSQL\16\data      │
│                                                                  │
│   5. Password                                                    │
│      └── Set a strong password for 'postgres' user              │
│      └── ⚠️  REMEMBER THIS PASSWORD!                            │
│                                                                  │
│   6. Port                                                        │
│      └── Keep default: 5432                                      │
│                                                                  │
│   7. Locale                                                      │
│      └── Keep default or select your locale                     │
│                                                                  │
│   8. Install                                                     │
│      └── Click "Next" and wait for installation                 │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Step 3: Add to System PATH**

1. Open System Properties → Advanced → Environment Variables
2. Under System variables, find `Path`
3. Add: `C:\Program Files\PostgreSQL\16\bin`

**Step 4: Verify Installation**

Open Command Prompt or PowerShell:

```powershell
# Check version
psql --version

# Connect to PostgreSQL
psql -U postgres
# Enter the password you set during installation
```

### Option 2: Windows Subsystem for Linux (WSL)

If you use WSL, follow the Linux installation instructions below.

## Installing on Linux

### Ubuntu / Debian

```bash
# Update package list
sudo apt update

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib

# PostgreSQL starts automatically, but you can verify:
sudo systemctl status postgresql

# Switch to postgres user and access psql
sudo -u postgres psql
```

### Fedora / RHEL / CentOS

```bash
# Install PostgreSQL
sudo dnf install postgresql-server postgresql-contrib

# Initialize the database
sudo postgresql-setup --initdb

# Start and enable PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Access psql
sudo -u postgres psql
```

### Arch Linux

```bash
# Install PostgreSQL
sudo pacman -S postgresql

# Switch to postgres user and initialize
sudo -iu postgres
initdb -D /var/lib/postgres/data

# Exit back to regular user
exit

# Start PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

## Installing with Docker (All Platforms)

Docker provides the easiest and most consistent way to run PostgreSQL across all platforms.

### Step 1: Install Docker

Download Docker Desktop from [docker.com](https://www.docker.com/products/docker-desktop/)

### Step 2: Run PostgreSQL Container

```bash
# Pull and run PostgreSQL
docker run --name my-postgres \
  -e POSTGRES_PASSWORD=mysecretpassword \
  -e POSTGRES_USER=myuser \
  -e POSTGRES_DB=mydb \
  -p 5432:5432 \
  -d postgres:16

# Check if container is running
docker ps
```

### Step 3: Connect to PostgreSQL

```bash
# Connect using psql inside the container
docker exec -it my-postgres psql -U myuser -d mydb

# Or connect from your host machine
psql -h localhost -U myuser -d mydb
```

### Docker Compose (Recommended for Development)

Create a `docker-compose.yml` file:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16
    container_name: postgres_dev
    environment:
      POSTGRES_USER: developer
      POSTGRES_PASSWORD: devpassword
      POSTGRES_DB: development
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

volumes:
  postgres_data:
```

Run with:

```bash
# Start PostgreSQL
docker-compose up -d

# Stop PostgreSQL
docker-compose down

# Stop and remove data
docker-compose down -v
```

::: tip Why Use Docker?
- **Consistent environment** across all team members
- **Easy cleanup** - just remove the container
- **Version switching** - run multiple versions simultaneously
- **Isolation** - doesn't affect your system
:::

## Cloud Hosting Options

For production applications, consider managed PostgreSQL services:

| Provider | Service Name | Free Tier |
|----------|-------------|-----------|
| **Neon** | Neon PostgreSQL | Yes - Generous |
| **Supabase** | Supabase | Yes |
| **Railway** | Railway | Yes - Limited |
| **AWS** | Amazon RDS | 12 months free |
| **Google Cloud** | Cloud SQL | Trial credits |
| **Azure** | Azure Database | Trial credits |
| **DigitalOcean** | Managed Databases | No |

### Quick Start with Neon (Free)

1. Sign up at [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string:

```bash
# Connection string format
postgresql://user:password@host/database

# Connect using psql
psql "postgresql://user:password@ep-cool-name-123.us-east-2.aws.neon.tech/neondb"
```

## Verifying Your Installation

After installation, verify everything works:

```bash
# 1. Check psql version
psql --version
```

```sql
-- 2. Connect to PostgreSQL
psql postgres

-- 3. Check server version
SELECT version();

-- 4. List databases
\l

-- 5. Create a test database
CREATE DATABASE test_db;

-- 6. Connect to test database
\c test_db

-- 7. Create a test table
CREATE TABLE test_table (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW()
);

-- 8. Insert test data
INSERT INTO test_table (name) VALUES ('Hello PostgreSQL!');

-- 9. Query the data
SELECT * FROM test_table;

-- 10. Clean up
DROP DATABASE test_db;

-- 11. Exit psql
\q
```

Expected output:

```
 id |       name        |         created_at
----+-------------------+----------------------------
  1 | Hello PostgreSQL! | 2024-01-15 10:30:00.123456
(1 row)
```

## Common Connection Settings

```
┌─────────────────────────────────────────────────────────────────┐
│                 Default Connection Settings                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   Setting          Default Value         Description            │
│   ───────          ─────────────         ───────────            │
│                                                                  │
│   Host             localhost             Server address          │
│   Port             5432                  TCP port                │
│   Database         postgres              Default database        │
│   Username         postgres              Superuser account       │
│   Password         (varies)              Set during install      │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Connection String Format

```
postgresql://[user]:[password]@[host]:[port]/[database]

# Examples:
postgresql://postgres:mypassword@localhost:5432/myapp
postgresql://admin:secret@db.example.com:5432/production
```

## Essential psql Commands

Once connected, these commands help you navigate:

| Command | Description |
|---------|-------------|
| `\l` | List all databases |
| `\c dbname` | Connect to a database |
| `\dt` | List tables in current database |
| `\d tablename` | Describe a table structure |
| `\du` | List users/roles |
| `\q` | Quit psql |
| `\?` | Show help for psql commands |
| `\h` | Show help for SQL commands |

## Troubleshooting

### Cannot Connect to Server

::: warning Connection Refused
If you get "connection refused":
1. Check if PostgreSQL is running: `brew services list` (macOS) or `systemctl status postgresql` (Linux)
2. Verify port 5432 is not blocked
3. Check if another app is using port 5432
:::

### Authentication Failed

::: warning Password Issues
If authentication fails:
1. Check you're using the correct username/password
2. On Linux, check `/etc/postgresql/16/main/pg_hba.conf`
3. Try connecting as the postgres user first
:::

### Permission Denied

```bash
# Linux: If you get permission denied
sudo -u postgres psql

# Or create a user matching your system username
sudo -u postgres createuser --interactive
```

## Summary

In this chapter, you learned:

- **macOS installation** using Homebrew or Postgres.app
- **Windows installation** using the official installer
- **Linux installation** on Ubuntu, Fedora, and Arch
- **Docker installation** for any platform
- **Cloud options** for managed PostgreSQL
- **How to verify** your installation works
- **Basic psql commands** to navigate PostgreSQL

## What's Next?

Now that PostgreSQL is installed and running, let's learn the basics of creating databases and tables!

👉 Continue to [Chapter 3: SQL Basics](./03-basics.md)
