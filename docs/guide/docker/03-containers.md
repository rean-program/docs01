# Docker Containers

Containers are where the magic happens - they're running instances of Docker images. In this tutorial, you'll learn how to create, manage, and interact with containers effectively.

## What is a Container?

A **container** is a runnable instance of an image. Think of it as a lightweight, isolated process that runs your application.

```
┌─────────────────────────────────────────────────────────────┐
│                  Image vs Container                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   Image (Template)              Container (Running)         │
│   ┌─────────────┐              ┌─────────────┐             │
│   │   Recipe    │              │   Cake      │             │
│   │   📄        │   ═══►       │   🍰        │             │
│   │  (Static)   │              │  (Active)   │             │
│   └─────────────┘              └─────────────┘             │
│                                                             │
│   One Image                     Multiple Containers         │
│   ┌─────────────┐              ┌───┐ ┌───┐ ┌───┐          │
│   │  nginx:     │              │ C1│ │ C2│ │ C3│          │
│   │  alpine     │   ═══►       └───┘ └───┘ └───┘          │
│   └─────────────┘              Running instances           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Container Lifecycle

Containers go through different states:

```
┌─────────────────────────────────────────────────────────────┐
│              Container Lifecycle                             │
└─────────────────────────────────────────────────────────────┘

       docker run / docker create
              │
              ▼
         ┌─────────┐
         │ Created │
         └─────────┘
              │
              │ docker start
              ▼
         ┌─────────┐
    ┌────│ Running │────┐
    │    └─────────┘    │
    │         │         │
    │ docker  │  docker │ docker
    │ pause   │  stop   │ kill
    │         │         │
    ▼         ▼         ▼
┌────────┐ ┌─────────┐ ┌────────┐
│ Paused │ │ Stopped │ │ Killed │
└────────┘ └─────────┘ └────────┘
    │         │         │
    └─────────┴─────────┘
              │
              │ docker rm
              ▼
         ┌─────────┐
         │ Deleted │
         └─────────┘
```

## Running Containers

### Basic Run Command

```bash
# Run a container
docker run nginx

# Run in background (detached mode)
docker run -d nginx

# Run with a name
docker run -d --name my-webserver nginx

# Run and remove when stopped
docker run --rm nginx
```

### Understanding `docker run`

```bash
docker run [OPTIONS] IMAGE [COMMAND] [ARG...]

Common OPTIONS:
  -d              # Detached mode (background)
  --name NAME     # Give container a name
  -p HOST:CONT    # Port mapping
  -e KEY=VALUE    # Environment variable
  -v HOST:CONT    # Volume mount
  --rm            # Remove container when it stops
  -it             # Interactive terminal
  --network NET   # Connect to network
```

### Interactive vs Detached Mode

```bash
# Interactive mode (-it)
# Use for: shells, debugging, interactive apps
docker run -it ubuntu bash

# You get a shell:
root@abc123:/# ls
root@abc123:/# pwd
root@abc123:/# exit

# Detached mode (-d)
# Use for: servers, long-running processes
docker run -d nginx

# Container runs in background
# Output: container ID
a1b2c3d4e5f6...
```

## Listing Containers

```bash
# List running containers
docker ps

# Output:
CONTAINER ID   IMAGE    COMMAND                  CREATED        STATUS        PORTS      NAMES
a1b2c3d4e5f6   nginx    "/docker-entrypoint.…"   2 minutes ago  Up 2 minutes  80/tcp     my-webserver

# List all containers (including stopped)
docker ps -a

# List last created container
docker ps -l

# List only container IDs
docker ps -q

# Custom format
docker ps --format "table {{.Names}}\t{{.Image}}\t{{.Status}}"
```

### Understanding the Output

```
CONTAINER ID   → Short unique ID (a1b2c3d4e5f6)
IMAGE          → Source image (nginx)
COMMAND        → Command running in container
CREATED        → When container was created
STATUS         → Current state (Up, Exited)
PORTS          → Port mappings
NAMES          → Container name (random if not specified)
```

## Port Mapping

Expose container ports to your host machine:

```bash
# Map port 8080 (host) to 80 (container)
docker run -d -p 8080:80 nginx

# Map multiple ports
docker run -d -p 8080:80 -p 8443:443 nginx

# Map to random host port
docker run -d -p 80 nginx

# Map specific IP
docker run -d -p 127.0.0.1:8080:80 nginx

# Map all exposed ports to random ports
docker run -d -P nginx
```

### Port Mapping Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    Port Mapping                              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   Your Computer                    Container                │
│                                                             │
│   Browser                          Nginx                    │
│      │                              │                       │
│      │ http://localhost:8080        │                       │
│      │                              │                       │
│      ▼                              ▼                       │
│   ┌──────────┐                   ┌──────────┐              │
│   │ Port     │  ═══════════►     │ Port     │              │
│   │  8080    │     Mapped        │   80     │              │
│   └──────────┘                   └──────────┘              │
│                                                             │
│   -p 8080:80                                                │
│      └┬─┘ └┬─┘                                              │
│       │    └─ Container port                                │
│       └────── Host port                                     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Environment Variables

Pass configuration to containers:

```bash
# Set single environment variable
docker run -e API_KEY=secret123 my-app

# Set multiple variables
docker run \
  -e NODE_ENV=production \
  -e API_KEY=secret123 \
  -e DATABASE_URL=postgres://localhost/db \
  my-app

# Load from file
docker run --env-file .env my-app

# .env file content:
NODE_ENV=production
API_KEY=secret123
DATABASE_URL=postgres://localhost/db
```

### Common Use Cases

```bash
# Database container
docker run -d \
  --name postgres \
  -e POSTGRES_USER=admin \
  -e POSTGRES_PASSWORD=secret \
  -e POSTGRES_DB=myapp \
  postgres:15

# Node.js application
docker run -d \
  --name api \
  -e NODE_ENV=production \
  -e PORT=3000 \
  -p 3000:3000 \
  my-node-app

# Redis with custom config
docker run -d \
  --name redis \
  -e REDIS_PASSWORD=secure123 \
  -p 6379:6379 \
  redis:7-alpine
```

## Container Management

### Starting and Stopping

```bash
# Start a stopped container
docker start my-webserver

# Start multiple containers
docker start container1 container2 container3

# Stop a running container (graceful)
docker stop my-webserver

# Stop with timeout
docker stop -t 30 my-webserver  # Wait 30 seconds

# Force stop (kill immediately)
docker kill my-webserver

# Restart a container
docker restart my-webserver
```

### Pausing and Unpausing

```bash
# Pause a running container (freeze processes)
docker pause my-webserver

# Unpause
docker unpause my-webserver
```

When to use pause:
- Temporarily free up resources
- Take filesystem snapshot
- Debug running container

## Removing Containers

```bash
# Remove a stopped container
docker rm my-webserver

# Force remove (even if running)
docker rm -f my-webserver

# Remove multiple containers
docker rm container1 container2 container3

# Remove all stopped containers
docker container prune

# Remove container when it stops (--rm flag)
docker run --rm nginx
```

### Cleanup Commands

```bash
# Remove all stopped containers
docker container prune

# Remove all containers (running and stopped)
docker rm -f $(docker ps -aq)

# Remove containers older than 24 hours
docker container prune --filter "until=24h"
```

## Executing Commands in Containers

### docker exec

Run commands in running containers:

```bash
# Execute a command
docker exec my-webserver ls /usr/share/nginx/html

# Interactive shell
docker exec -it my-webserver bash

# Run as specific user
docker exec -u root my-webserver whoami

# Execute with environment variables
docker exec -e VAR=value my-webserver printenv VAR

# Execute in specific directory
docker exec -w /app my-webserver ls
```

### Common Use Cases

```bash
# Check logs inside container
docker exec my-webserver cat /var/log/nginx/access.log

# Install debugging tools
docker exec my-webserver apt-get update
docker exec my-webserver apt-get install -y vim

# Test network connectivity
docker exec my-webserver ping -c 3 google.com

# View processes
docker exec my-webserver ps aux

# Check disk usage
docker exec my-webserver df -h
```

## Viewing Container Output

### Logs

```bash
# View container logs
docker logs my-webserver

# Follow logs (live stream)
docker logs -f my-webserver

# Show timestamps
docker logs -t my-webserver

# Show last 100 lines
docker logs --tail 100 my-webserver

# Show logs since timestamp
docker logs --since 2024-12-21T10:00:00 my-webserver

# Show logs from last 10 minutes
docker logs --since 10m my-webserver
```

### Real-time Stats

```bash
# Show real-time container statistics
docker stats

# Output:
CONTAINER ID   NAME          CPU %   MEM USAGE / LIMIT    MEM %    NET I/O
a1b2c3d4e5f6   my-webserver  0.01%   5.2MB / 7.6GB       0.07%    1.2kB / 0B

# Stats for specific container
docker stats my-webserver

# Show all containers (including stopped)
docker stats --all

# No stream (single snapshot)
docker stats --no-stream
```

## Inspecting Containers

Get detailed information:

```bash
# Inspect container
docker inspect my-webserver

# Get specific information
docker inspect --format='{{.State.Status}}' my-webserver
# Output: running

# Get IP address
docker inspect --format='{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' my-webserver

# Get all environment variables
docker inspect --format='{{range .Config.Env}}{{println .}}{{end}}' my-webserver

# Get mounted volumes
docker inspect --format='{{json .Mounts}}' my-webserver | jq
```

### Useful Inspect Queries

```bash
# Container's IP address
docker inspect -f '{{.NetworkSettings.IPAddress}}' my-webserver

# Container's start time
docker inspect -f '{{.State.StartedAt}}' my-webserver

# Container's image
docker inspect -f '{{.Config.Image}}' my-webserver

# Container's working directory
docker inspect -f '{{.Config.WorkingDir}}' my-webserver

# All port mappings
docker inspect -f '{{json .NetworkSettings.Ports}}' my-webserver | jq
```

## Copying Files

Transfer files between host and container:

```bash
# Copy from container to host
docker cp my-webserver:/var/log/nginx/access.log ./logs/

# Copy from host to container
docker cp ./config.conf my-webserver:/etc/nginx/

# Copy directory
docker cp ./html my-webserver:/usr/share/nginx/

# Copy with preserved permissions
docker cp --archive my-webserver:/app/data ./backup/
```

### Practical Examples

```bash
# Backup database
docker cp postgres:/var/lib/postgresql/data ./backup/

# Deploy new config
docker cp nginx.conf my-webserver:/etc/nginx/
docker restart my-webserver

# Extract logs
docker cp my-app:/var/log/app.log ./logs/app-$(date +%Y%m%d).log
```

## Container Resources

### Limiting Resources

```bash
# Limit memory
docker run -d --memory="512m" nginx

# Limit CPU
docker run -d --cpus="1.5" nginx

# Limit both
docker run -d \
  --memory="1g" \
  --cpus="2" \
  nginx

# Set CPU priority
docker run -d --cpu-shares=512 nginx

# Limit I/O
docker run -d --device-write-bps /dev/sda:1mb nginx
```

### Updating Running Containers

```bash
# Update memory limit
docker update --memory="1g" my-webserver

# Update CPU limit
docker update --cpus="2" my-webserver

# Update restart policy
docker update --restart=always my-webserver
```

## Restart Policies

Control what happens when containers stop:

```bash
# Never restart (default)
docker run --restart=no nginx

# Always restart
docker run -d --restart=always nginx

# Restart unless manually stopped
docker run -d --restart=unless-stopped nginx

# Restart on failure (max 3 attempts)
docker run -d --restart=on-failure:3 nginx
```

### Restart Policy Comparison

```
no                    → Never restart
                        Use: One-time tasks

always                → Always restart
                        Use: Critical services

unless-stopped        → Restart unless manually stopped
                        Use: Most production services ✅

on-failure[:max]      → Restart only on error
                        Use: Jobs that may fail
```

## Practical Examples

### Example 1: Run a Web Application

```bash
# Run Node.js application
docker run -d \
  --name my-app \
  --restart=unless-stopped \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e DATABASE_URL=postgres://db:5432/myapp \
  -v $(pwd)/logs:/app/logs \
  my-node-app:latest

# Check if it's running
docker ps

# View logs
docker logs -f my-app

# Access shell for debugging
docker exec -it my-app sh
```

### Example 2: Development Database

```bash
# Run PostgreSQL for development
docker run -d \
  --name dev-postgres \
  --restart=unless-stopped \
  -e POSTGRES_USER=devuser \
  -e POSTGRES_PASSWORD=devpass \
  -e POSTGRES_DB=myapp_dev \
  -p 5432:5432 \
  -v pgdata:/var/lib/postgresql/data \
  postgres:15-alpine

# Connect to database
docker exec -it dev-postgres psql -U devuser -d myapp_dev

# Backup database
docker exec dev-postgres pg_dump -U devuser myapp_dev > backup.sql

# Restore database
docker exec -i dev-postgres psql -U devuser myapp_dev < backup.sql
```

### Example 3: Redis Cache

```bash
# Run Redis
docker run -d \
  --name redis-cache \
  --restart=always \
  -p 6379:6379 \
  -v redis-data:/data \
  redis:7-alpine redis-server --appendonly yes

# Connect to Redis CLI
docker exec -it redis-cache redis-cli

# Monitor Redis commands
docker exec -it redis-cache redis-cli MONITOR

# Check Redis info
docker exec redis-cache redis-cli INFO
```

### Example 4: Nginx Reverse Proxy

```bash
# Create config directory
mkdir -p nginx-config

# Run Nginx
docker run -d \
  --name nginx-proxy \
  --restart=unless-stopped \
  -p 80:80 \
  -p 443:443 \
  -v $(pwd)/nginx-config:/etc/nginx/conf.d:ro \
  -v $(pwd)/ssl:/etc/nginx/ssl:ro \
  nginx:alpine

# Reload configuration
docker exec nginx-proxy nginx -s reload

# Test configuration
docker exec nginx-proxy nginx -t
```

## Troubleshooting

### Container Won't Start

```bash
# Check container logs
docker logs my-webserver

# Check exit code
docker inspect --format='{{.State.ExitCode}}' my-webserver

# Common exit codes:
# 0   → Success
# 1   → Application error
# 137 → Killed (OOM or SIGKILL)
# 139 → Segmentation fault
# 143 → Terminated (SIGTERM)
```

### Container is Slow

```bash
# Check resource usage
docker stats my-webserver

# Check processes inside
docker exec my-webserver ps aux

# Check disk I/O
docker exec my-webserver df -h

# Increase resources
docker update --memory="2g" --cpus="2" my-webserver
```

### Can't Connect to Container

```bash
# Check if container is running
docker ps

# Check port mappings
docker port my-webserver

# Check container IP
docker inspect --format='{{.NetworkSettings.IPAddress}}' my-webserver

# Test network connectivity
docker exec my-webserver ping -c 3 google.com

# Check firewall rules
# (host-specific command)
```

### Container Keeps Restarting

```bash
# Check restart count
docker inspect --format='{{.RestartCount}}' my-webserver

# View logs
docker logs --tail 100 my-webserver

# Check exit code
docker inspect --format='{{.State.ExitCode}}' my-webserver

# Disable restart policy temporarily
docker update --restart=no my-webserver
```

## Best Practices

::: tip 1. Name Your Containers
Always use `--name` for easier management:
```bash
# ❌ Bad: Random name
docker run -d nginx

# ✅ Good: Descriptive name
docker run -d --name api-server nginx
```
:::

::: tip 2. Use Restart Policies
Set appropriate restart behavior:
```bash
# Production services
docker run -d --restart=unless-stopped nginx

# Development (don't auto-restart)
docker run -d --restart=no nginx
```
:::

::: tip 3. Clean Up Regularly
Remove stopped containers:
```bash
# Remove on stop
docker run --rm nginx

# Clean up periodically
docker container prune
```
:::

::: tip 4. Limit Resources
Prevent containers from hogging resources:
```bash
docker run -d \
  --memory="512m" \
  --cpus="1" \
  nginx
```
:::

::: tip 5. Use Health Checks
Monitor container health (covered in Dockerfile tutorial):
```bash
docker run -d \
  --health-cmd='curl -f http://localhost/ || exit 1' \
  --health-interval=30s \
  nginx
```
:::

## Summary

You learned:
- ✅ What containers are and their lifecycle
- ✅ Running containers (interactive and detached)
- ✅ Port mapping and networking basics
- ✅ Using environment variables
- ✅ Managing containers (start, stop, restart, remove)
- ✅ Executing commands inside containers
- ✅ Viewing logs and statistics
- ✅ Copying files between host and container
- ✅ Resource limits and restart policies
- ✅ Troubleshooting common issues

::: tip 💡 Key Takeaway
Containers are running instances of images. Master basic container operations, use meaningful names, set restart policies, and monitor logs to effectively manage your containerized applications!
:::

Next: [Dockerfile Basics](./04-dockerfile.md) - Learn to build your own custom Docker images!
