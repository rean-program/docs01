# PostgreSQL Tutorial

Welcome to the comprehensive PostgreSQL tutorial! This guide will take you from complete beginner to confident PostgreSQL user, covering everything from installation to advanced database concepts.

## What You'll Learn

```
┌─────────────────────────────────────────────────────────────────┐
│                    PostgreSQL Learning Path                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Beginner          Intermediate           Advanced               │
│  ────────          ────────────           ────────               │
│  ┌─────────┐       ┌─────────────┐       ┌──────────────┐       │
│  │ Setup & │  ───► │ Queries &   │  ───► │ Performance  │       │
│  │ Basics  │       │ Joins       │       │ & Security   │       │
│  └─────────┘       └─────────────┘       └──────────────┘       │
│                                                                  │
│  • Installation    • Complex Queries     • Indexes              │
│  • SQL Basics      • JOINs               • Transactions         │
│  • Data Types      • Functions           • User Management      │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Tutorial Chapters

| Chapter | Topic | Description |
|---------|-------|-------------|
| 01 | [Introduction](./01-introduction.md) | What is PostgreSQL and why use it |
| 02 | [Installation](./02-installation.md) | Installing PostgreSQL on any platform |
| 03 | [SQL Basics](./03-basics.md) | Creating databases, tables, and basic operations |
| 04 | [Data Types](./04-data-types.md) | Understanding PostgreSQL data types |
| 05 | [Queries](./05-queries.md) | SELECT statements and filtering data |
| 06 | [JOINs](./06-joins.md) | Combining data from multiple tables |
| 07 | [Functions](./07-functions.md) | Built-in and custom functions |
| 08 | [Indexes](./08-indexes.md) | Optimizing query performance |
| 09 | [Transactions](./09-transactions.md) | ACID properties and data integrity |
| 10 | [Security](./10-security.md) | Users, roles, and permissions |

## Prerequisites

Before starting this tutorial, you should have:

- Basic understanding of computers and file systems
- A computer with Windows, macOS, or Linux
- Willingness to learn and practice

::: tip No Prior Database Experience Required
This tutorial is designed for complete beginners. We explain every concept from the ground up with practical examples.
:::

## Why PostgreSQL?

PostgreSQL is one of the most popular and powerful open-source relational database systems in the world. It's used by:

- **Instagram** - Stores billions of user photos and data
- **Spotify** - Manages music metadata and user preferences
- **Netflix** - Handles streaming service data
- **Uber** - Powers location and trip data
- **Apple** - Uses PostgreSQL in various services

## Quick Start

If you want to jump right in:

```bash
# Install PostgreSQL (macOS with Homebrew)
brew install postgresql@16

# Start PostgreSQL service
brew services start postgresql@16

# Connect to PostgreSQL
psql postgres

# Create your first database
CREATE DATABASE my_first_db;
```

Ready to begin? Start with [Chapter 1: Introduction](./01-introduction.md)!
