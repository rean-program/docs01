# Docker Volumes

Containers are ephemeral - when deleted, their data is lost. Docker volumes solve this by providing persistent storage. In this tutorial, you'll learn how to manage data in Docker.

## The Problem with Container Storage

By default, data inside containers is temporary:

```
┌─────────────────────────────────────────────────────────────┐
│         Container Lifecycle and Data                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Create Container          Container Running                │
│  ┌──────────────┐         ┌──────────────┐                  │
│  │  Database    │         │  Database    │                  │
│  │  Container   │  ═══►   │  + Data      │                  │
│  └──────────────┘         │  + Logs      │                  │
│                           └──────────────┘                  │
│                                  │                           │
│                                  │  docker rm                │
│                                  ▼                           │
│                           ┌──────────────┐                  │
│                           │    Deleted   │                  │
│                           │   ❌ Data    │  ← Gone forever! │
│                           │   ❌ Logs    │                  │
│                           └──────────────┘                  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## What Are Docker Volumes?

**Volumes** are the preferred way to persist data in Docker. They're stored outside the container filesystem and survive container deletion.

```
┌─────────────────────────────────────────────────────────────┐
│              With Docker Volumes                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   Host System              Container                        │
│   ┌──────────────┐        ┌──────────────┐                 │
│   │   Volume     │◄═══════│  /data       │                 │
│   │   Storage    │        │  (mounted)   │                 │
│   │  (Persistent)│        │              │                 │
│   └──────────────┘        └──────────────┘                 │
│         │                        │                          │
│         │                   docker rm                       │
│         │                        │                          │
│         │                        ▼                          │
│         │                 ┌──────────────┐                 │
│         │                 │   Deleted    │                 │
│         │                 └──────────────┘                 │
│         │                                                   │
│         │                 New Container                     │
│         │                 ┌──────────────┐                 │
│         └═════════════════►  /data       │                 │
│                           │  (mounted)   │                 │
│                           └──────────────┘                 │
│                                                             │
│   ✅ Data persists across container replacements!          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Types of Mounts

Docker supports three types of mounts:

```
1. Volumes (Recommended)
   ├── Managed by Docker
   ├── Stored in Docker area
   ├── Can be shared between containers
   └── Easy to backup

2. Bind Mounts
   ├── Map host directory to container
   ├── Full host filesystem access
   ├── Good for development
   └── Less portable

3. tmpfs Mounts (Memory)
   ├── Stored in host memory
   ├── Never written to disk
   ├── Fast but temporary
   └── Good for secrets/cache
```

## Working with Volumes

### Creating Volumes

```bash
# Create a named volume
docker volume create my-data

# Create with specific driver
docker volume create --driver local my-data

# Create with options
docker volume create \
  --opt type=nfs \
  --opt device=:/path/to/dir \
  my-nfs-volume
```

### Listing Volumes

```bash
# List all volumes
docker volume ls

# Output:
DRIVER    VOLUME NAME
local     my-data
local     postgres-data
local     app-logs

# Filter volumes
docker volume ls --filter dangling=true
```

### Inspecting Volumes

```bash
# Get volume details
docker volume inspect my-data

# Output:
[
    {
        "CreatedAt": "2024-12-21T10:00:00Z",
        "Driver": "local",
        "Mountpoint": "/var/lib/docker/volumes/my-data/_data",
        "Name": "my-data",
        "Options": {},
        "Scope": "local"
    }
]

# Get specific information
docker volume inspect --format '{{.Mountpoint}}' my-data
```

### Using Volumes in Containers

```bash
# Run container with named volume
docker run -d \
  --name myapp \
  -v my-data:/data \
  nginx

# Anonymous volume (Docker creates it)
docker run -d \
  -v /data \
  nginx

# Multiple volumes
docker run -d \
  -v app-data:/app/data \
  -v app-logs:/app/logs \
  myapp

# Read-only volume
docker run -d \
  -v my-data:/data:ro \
  nginx
```

### Volume Syntax

```bash
# Named volume
-v volume-name:/container/path

# Anonymous volume
-v /container/path

# Read-only
-v volume-name:/container/path:ro

# With specific options
-v volume-name:/path:ro,nocopy
```

### Removing Volumes

```bash
# Remove a volume
docker volume rm my-data

# Remove multiple volumes
docker volume rm volume1 volume2 volume3

# Remove all unused volumes
docker volume prune

# Remove with force
docker volume rm -f my-data
```

## Bind Mounts

Map host directories to containers:

```bash
# Bind mount current directory
docker run -d \
  -v $(pwd):/app \
  node:20-alpine

# Bind mount specific directory
docker run -d \
  -v /Users/john/projects/myapp:/app \
  node:20-alpine

# Read-only bind mount
docker run -d \
  -v $(pwd):/app:ro \
  nginx

# Multiple bind mounts
docker run -d \
  -v $(pwd)/src:/app/src \
  -v $(pwd)/config:/app/config:ro \
  myapp
```

### Bind Mount Use Cases

```
Development:
├── Live code editing
├── See changes immediately
└── No need to rebuild image

Configuration:
├── Inject config files
├── Keep configs on host
└── Easy to update

Logs & Data:
├── Access from host
├── Easy backup
└── Analysis tools
```

## Volume vs Bind Mount Comparison

| Feature | Volumes | Bind Mounts |
|---------|---------|-------------|
| **Management** | Docker managed | Manual |
| **Location** | Docker area | Any host path |
| **Portability** | High | Low |
| **Performance** | Optimized | Depends on host |
| **Backup** | Easy with Docker | Manual |
| **Permissions** | Handled by Docker | Host filesystem |
| **Use Case** | Production data | Development |

## Practical Examples

### Example 1: PostgreSQL with Persistent Data

```bash
# Create volume for database
docker volume create postgres-data

# Run PostgreSQL with volume
docker run -d \
  --name my-postgres \
  -e POSTGRES_PASSWORD=secret \
  -v postgres-data:/var/lib/postgresql/data \
  -p 5432:5432 \
  postgres:15-alpine

# Data persists even if container is removed
docker rm -f my-postgres

# Recreate container with same data
docker run -d \
  --name my-postgres \
  -e POSTGRES_PASSWORD=secret \
  -v postgres-data:/var/lib/postgresql/data \
  -p 5432:5432 \
  postgres:15-alpine

# Database is still there! ✅
```

### Example 2: Node.js Development with Bind Mounts

```bash
# Project structure:
# my-node-app/
# ├── src/
# │   └── server.js
# ├── package.json
# └── Dockerfile

# Run with bind mount for live development
docker run -d \
  --name dev-app \
  -v $(pwd)/src:/app/src \
  -v $(pwd)/package.json:/app/package.json \
  -v node-modules:/app/node_modules \
  -p 3000:3000 \
  node:20-alpine \
  node /app/src/server.js

# Edit src/server.js on host
# Changes are reflected immediately in container!
```

### Example 3: Nginx with Custom Content

```bash
# Bind mount HTML directory
docker run -d \
  --name my-nginx \
  -v $(pwd)/html:/usr/share/nginx/html:ro \
  -v $(pwd)/nginx.conf:/etc/nginx/nginx.conf:ro \
  -p 8080:80 \
  nginx:alpine

# Update HTML files on host
# Nginx serves new content immediately
```

### Example 4: MongoDB with Backup

```bash
# Create volume
docker volume create mongo-data

# Run MongoDB
docker run -d \
  --name mongodb \
  -v mongo-data:/data/db \
  -p 27017:27017 \
  mongo:7

# Backup database
docker run --rm \
  -v mongo-data:/data/db \
  -v $(pwd)/backup:/backup \
  mongo:7 \
  sh -c 'mongodump --out /backup'

# Restore database
docker run --rm \
  -v mongo-data:/data/db \
  -v $(pwd)/backup:/backup \
  mongo:7 \
  sh -c 'mongorestore /backup'
```

## Sharing Volumes Between Containers

```bash
# Create shared volume
docker volume create shared-data

# Container 1: Write data
docker run -d \
  --name writer \
  -v shared-data:/data \
  alpine \
  sh -c 'while true; do echo "$(date)" >> /data/log.txt; sleep 5; done'

# Container 2: Read data
docker run -d \
  --name reader \
  -v shared-data:/data:ro \
  alpine \
  sh -c 'tail -f /data/log.txt'

# View logs from reader
docker logs -f reader
```

## Volume Drivers

Docker supports different storage backends:

```bash
# Local driver (default)
docker volume create --driver local my-volume

# NFS volume
docker volume create \
  --driver local \
  --opt type=nfs \
  --opt o=addr=192.168.1.1,rw \
  --opt device=:/path/to/dir \
  nfs-volume

# CIFS/SMB volume
docker volume create \
  --driver local \
  --opt type=cifs \
  --opt o=username=user,password=pass \
  --opt device=//192.168.1.1/share \
  cifs-volume
```

## Volume Backup and Restore

### Backup Volume

```bash
# Method 1: Using tar
docker run --rm \
  -v my-data:/data \
  -v $(pwd):/backup \
  alpine \
  tar czf /backup/backup.tar.gz -C /data .

# Method 2: Copy files
docker run --rm \
  -v my-data:/data \
  -v $(pwd)/backup:/backup \
  alpine \
  cp -a /data/. /backup/

# Method 3: Database dump
docker exec postgres pg_dump dbname > backup.sql
```

### Restore Volume

```bash
# Method 1: Extract tar
docker run --rm \
  -v my-data:/data \
  -v $(pwd):/backup \
  alpine \
  tar xzf /backup/backup.tar.gz -C /data

# Method 2: Copy files
docker run --rm \
  -v my-data:/data \
  -v $(pwd)/backup:/backup \
  alpine \
  cp -a /backup/. /data/

# Method 3: Database restore
docker exec -i postgres psql dbname < backup.sql
```

## tmpfs Mounts (Memory Storage)

Store data in memory (never written to disk):

```bash
# Create tmpfs mount
docker run -d \
  --name app \
  --tmpfs /tmp:rw,noexec,nosuid,size=100m \
  myapp

# Multiple tmpfs mounts
docker run -d \
  --tmpfs /cache:size=100m \
  --tmpfs /tmp:rw,noexec \
  myapp

# Use case: Temporary secrets
docker run -d \
  --tmpfs /secrets:mode=700 \
  myapp
```

**When to use tmpfs:**
- Sensitive data (passwords, keys)
- Temporary cache
- Fast I/O needed
- Data doesn't need persistence

## Volume Inspection and Debugging

```bash
# List volumes with size
docker system df -v

# Find volumes used by a container
docker inspect -f '{{ json .Mounts }}' container-name | jq

# Access volume data directly
docker run --rm \
  -v my-volume:/data \
  alpine \
  ls -la /data

# Check volume permissions
docker run --rm \
  -v my-volume:/data \
  alpine \
  stat /data

# Find orphaned volumes
docker volume ls -f dangling=true
```

## Best Practices

::: tip 1. Use Named Volumes for Production
```bash
# ❌ Bad: Anonymous volume
docker run -v /data postgres

# ✅ Good: Named volume
docker run -v postgres-data:/data postgres
```
:::

::: tip 2. Use Bind Mounts for Development
```bash
# Development
docker run -v $(pwd):/app node:20-alpine

# Production
docker run -v app-data:/app/data node:20-alpine
```
:::

::: tip 3. Regular Backups
```bash
# Schedule regular backups
docker run --rm \
  -v my-data:/data:ro \
  -v $(pwd)/backups:/backup \
  alpine \
  tar czf /backup/backup-$(date +%Y%m%d).tar.gz -C /data .
```
:::

::: tip 4. Use Read-Only When Possible
```bash
# Read-only for config
docker run -v $(pwd)/config:/app/config:ro myapp

# Read-write for data
docker run -v app-data:/app/data:rw myapp
```
:::

::: tip 5. Clean Up Unused Volumes
```bash
# Remove unused volumes weekly
docker volume prune

# Check space before cleanup
docker system df -v
```
:::

## Troubleshooting

### Permission Issues

```bash
# Check volume permissions
docker run --rm -v my-volume:/data alpine ls -la /data

# Fix ownership
docker run --rm -v my-volume:/data alpine chown -R 1000:1000 /data

# Run as specific user
docker run --user 1000:1000 -v my-volume:/data myapp
```

### Volume Not Found

```bash
# List all volumes
docker volume ls

# Create if missing
docker volume create my-volume

# Check container mounts
docker inspect container-name | grep -A 10 Mounts
```

### Data Not Persisting

```bash
# Verify volume is mounted
docker inspect -f '{{ json .Mounts }}' container-name | jq

# Check if anonymous volume
docker volume ls -f dangling=true

# Use named volume instead
docker run -v named-volume:/data myapp
```

### Volume Full

```bash
# Check volume size
docker system df -v

# Clean up old data
docker run --rm -v my-volume:/data alpine \
  find /data -type f -mtime +30 -delete

# Increase volume size (driver-specific)
```

## Summary

You learned:
- ✅ Why volumes are needed for persistent data
- ✅ Types of mounts (volumes, bind mounts, tmpfs)
- ✅ Creating and managing volumes
- ✅ Using volumes in containers
- ✅ Sharing volumes between containers
- ✅ Backing up and restoring data
- ✅ Volume drivers and options
- ✅ Best practices for data persistence

::: tip 💡 Key Takeaway
Volumes persist data beyond container lifecycles. Use named volumes for production data, bind mounts for development, and always backup important data!
:::

Next: [Docker Networking](./06-networking.md) - Learn how containers communicate with each other!
