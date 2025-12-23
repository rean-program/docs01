# Docker Images

Docker images are the foundation of containers. In this tutorial, you'll learn what images are, how to find and download them, and how to manage them effectively.

## What is a Docker Image?

A Docker **image** is a lightweight, standalone, executable package that contains everything needed to run a piece of software:

- Application code
- Runtime (Node.js, Python, Java, etc.)
- System libraries
- System tools
- Configuration files
- Environment variables

```
┌─────────────────────────────────────────────────────────────┐
│                 Think of an Image as...                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   🍰 A Recipe/Template        📀 A Class (in OOP)           │
│   ├─ Ingredients             ├─ Properties                 │
│   ├─ Instructions            ├─ Methods                     │
│   └─ Creates: Cake           └─ Creates: Objects            │
│                                                             │
│   📦 A Docker Image                                         │
│   ├─ Base OS                                               │
│   ├─ Dependencies                                          │
│   ├─ Application code                                      │
│   └─ Creates: Containers (running instances)               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Image Layers

Docker images are built in **layers**, like a stack of pancakes. Each layer represents a set of file system changes.

```
┌─────────────────────────────────────────┐
│      Docker Image: node-app             │
├─────────────────────────────────────────┤
│                                         │
│   Layer 4: CMD ["node", "app.js"]      │  ← Start command
│   ─────────────────────────────────     │
│   Layer 3: COPY . /app                  │  ← Your code
│   ─────────────────────────────────     │
│   Layer 2: RUN npm install             │  ← Dependencies
│   ─────────────────────────────────     │
│   Layer 1: FROM node:20-alpine         │  ← Base image
│   ─────────────────────────────────     │
│                                         │
└─────────────────────────────────────────┘
```

### Why Layers Matter

```
Benefits of Layers:
├── 🚀 Efficiency
│   └── Shared layers = less storage
│
├── ⚡ Speed
│   └── Cached layers = faster builds
│
└── 💾 Storage
    └── Reusable layers = save space

Example:
  Image A (Node app) ───┐
                        ├─── Share "node:20" layer
  Image B (Node app) ───┘
```

## Docker Hub

**Docker Hub** is the world's largest repository of container images. It's like GitHub for Docker images.

```
┌─────────────────────────────────────────────────────────────┐
│                     Docker Hub                               │
│                   hub.docker.com                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   📦 Official Images        🏢 Verified Publishers          │
│   ├─ nginx                  ├─ microsoft/dotnet            │
│   ├─ node                   ├─ google/cloud-sdk            │
│   ├─ postgres               └─ amazon/aws-cli              │
│   ├─ python                                                │
│   └─ redis                  👤 Community Images             │
│                             └─ millions of user images      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Image Naming Convention

```
registry/username/repository:tag
   │        │         │        │
   │        │         │        └─ Version (default: latest)
   │        │         └────────── Image name
   │        └──────────────────── User/Organization
   └───────────────────────────── Docker Hub (default)

Examples:
  nginx:latest              → Official nginx, latest version
  nginx:1.24-alpine        → Nginx 1.24 on Alpine Linux
  node:20                   → Official Node.js version 20
  postgres:15.3            → PostgreSQL version 15.3
  myusername/myapp:v1.0    → User image with tag
```

## Finding Images

### Searching on Docker Hub

**Method 1: Web Interface**

Visit [hub.docker.com](https://hub.docker.com) and search for images.

**Method 2: Command Line**

```bash
# Search for images
docker search nginx

# Output:
NAME                    DESCRIPTION                     STARS    OFFICIAL
nginx                   Official build of Nginx.        19000    [OK]
nginx/nginx-ingress     NGINX Ingress Controller        200      
bitnami/nginx           Bitnami nginx Docker Image      150      
```

### Understanding Image Tags

Look for these important tags:

```bash
# Official Node.js image tags
node:20               # Node.js 20, full Debian-based
node:20-alpine        # Node.js 20, Alpine Linux (smaller!)
node:20-slim          # Node.js 20, minimal Debian
node:lts              # Latest LTS version
node:latest           # Latest version (use with caution!)

# Size comparison:
node:20        → ~900 MB
node:20-slim   → ~200 MB  
node:20-alpine → ~120 MB  ✅ Recommended for production
```

## Pulling Images

### Basic Pull Command

```bash
# Pull an image from Docker Hub
docker pull nginx

# Pull a specific version
docker pull nginx:1.24-alpine

# Pull from a specific registry
docker pull mcr.microsoft.com/dotnet/sdk:7.0
```

### What Happens During Pull?

```
$ docker pull nginx:alpine

Using default tag: alpine
alpine: Pulling from library/nginx

Step-by-step:
┌─────────────────────────────────────────┐
│ 1. Docker checks local images           │
│    ├─ Found? Use it                     │
│    └─ Not found? Download               │
└─────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│ 2. Connect to Docker Hub                │
└─────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│ 3. Download layers                      │
│    c1e0a30e1c8a: Pull complete          │
│    ad2fb1f8d5ed: Pull complete          │
│    8f617aeb5c9e: Pull complete          │
└─────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│ 4. Verify image                         │
│    Status: Downloaded newer image       │
└─────────────────────────────────────────┘
```

## Listing Images

```bash
# List all local images
docker images

# Output:
REPOSITORY    TAG        IMAGE ID       CREATED        SIZE
nginx         alpine     a99a39d070bf   2 days ago     42MB
node          20-alpine  f0c2f5a1b23e   1 week ago     118MB
postgres      15         8a3ef5a6d9c4   2 weeks ago    379MB

# List images with more details
docker images --no-trunc

# Filter images
docker images nginx
docker images "node:*"

# Show image sizes
docker images --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}"
```

## Inspecting Images

Get detailed information about an image:

```bash
# Inspect an image
docker inspect nginx:alpine

# Get specific information
docker inspect --format='{{.Architecture}}' nginx:alpine
# Output: amd64

docker inspect --format='{{.Os}}' nginx:alpine
# Output: linux

# View image history (layers)
docker history nginx:alpine
```

### Understanding Image History

```bash
$ docker history nginx:alpine

IMAGE          CREATED BY                                      SIZE
a99a39d070bf   CMD ["nginx" "-g" "daemon off;"]                0B
<missing>      EXPOSE 80                                       0B
<missing>      COPY nginx.conf /etc/nginx/nginx.conf           2KB
<missing>      RUN apk add --no-cache nginx                    15MB
<missing>      FROM alpine:3.18                                7MB

Total: 22MB
```

## Image Management Commands

### Removing Images

```bash
# Remove an image
docker rmi nginx:alpine

# Remove by image ID
docker rmi a99a39d070bf

# Force remove (even if container is using it)
docker rmi -f nginx:alpine

# Remove multiple images
docker rmi nginx:alpine node:20-alpine postgres:15

# Remove unused images
docker image prune

# Remove all unused images (not just dangling)
docker image prune -a
```

### Dangling Images

Dangling images are layers that have no relationship to tagged images:

```bash
# List dangling images
docker images -f "dangling=true"

# Output:
REPOSITORY    TAG       IMAGE ID       CREATED        SIZE
<none>        <none>    abc123def456   2 hours ago    120MB
<none>        <none>    def789ghi012   1 day ago      85MB

# Remove all dangling images
docker image prune

# This frees up space!
```

## Tagging Images

Tags help organize and version your images:

```bash
# Tag an image
docker tag nginx:alpine my-nginx:v1.0

# Create multiple tags for the same image
docker tag nginx:alpine my-nginx:latest
docker tag nginx:alpine my-nginx:production

# List tags
docker images my-nginx

# Output:
REPOSITORY    TAG          IMAGE ID       SIZE
my-nginx      v1.0         a99a39d070bf   42MB
my-nginx      latest       a99a39d070bf   42MB
my-nginx      production   a99a39d070bf   42MB
```

### Tagging Best Practices

```
Good Tagging Strategy:
├── Semantic Versioning
│   ├── myapp:1.0.0       (specific version)
│   ├── myapp:1.0         (minor version)
│   └── myapp:1           (major version)
│
├── Environment
│   ├── myapp:dev
│   ├── myapp:staging
│   └── myapp:production
│
└── Date-based
    └── myapp:2024-12-21

❌ Avoid: Using only "latest" tag
✅ Use: Specific version tags
```

## Exporting and Importing Images

### Saving Images to Files

```bash
# Save an image to a tar file
docker save nginx:alpine > nginx-alpine.tar

# Save with compression
docker save nginx:alpine | gzip > nginx-alpine.tar.gz

# Save multiple images
docker save -o my-images.tar nginx:alpine node:20-alpine
```

### Loading Images

```bash
# Load an image from a tar file
docker load < nginx-alpine.tar

# Load with verbose output
docker load -i nginx-alpine.tar

# Load compressed image
gunzip -c nginx-alpine.tar.gz | docker load
```

### Use Cases

```
When to Save/Load Images:
├── 🔒 Air-gapped systems (no internet)
├── 📦 Distributing custom images
├── 💾 Backup important images
└── 🚀 CI/CD pipelines
```

## Image Sizes and Optimization

### Understanding Image Sizes

```bash
# Check image sizes
docker images --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}"

# Example comparison:
ubuntu:22.04        → 77MB
ubuntu:latest       → 77MB
alpine:3.18         → 7MB    ✅ Smallest
alpine:latest       → 7MB
debian:12           → 124MB
```

### Size Optimization Tips

```
Choosing Base Images:

Full OS (Ubuntu/Debian)
├── Pros: All tools available, familiar
└── Cons: Large size (100-500 MB)
      │
      ▼
Slim Variants
├── Pros: Smaller, most tools included
└── Cons: Missing some packages
      │
      ▼
Alpine Linux
├── Pros: Tiny (5-10 MB), secure
└── Cons: Uses musl libc (compatibility)
      │
      ▼
Distroless / Scratch
├── Pros: Minimal attack surface
└── Cons: No shell, hard to debug
```

## Working with Official Images

### Popular Official Images

```bash
# Web Servers
docker pull nginx
docker pull httpd
docker pull caddy

# Programming Languages
docker pull node:20-alpine
docker pull python:3.11-slim
docker pull golang:1.21-alpine

# Databases
docker pull postgres:15
docker pull mysql:8
docker pull mongodb:7
docker pull redis:7-alpine

# Other Services
docker pull rabbitmq:3-management
docker pull elasticsearch:8.11.0
```

### Running Official Images

```bash
# Run a web server
docker run -d -p 8080:80 nginx:alpine

# Run a database
docker run -d \
  --name my-postgres \
  -e POSTGRES_PASSWORD=secret \
  -p 5432:5432 \
  postgres:15

# Run Redis
docker run -d --name my-redis -p 6379:6379 redis:7-alpine

# Run with persistent data
docker run -d \
  --name my-mysql \
  -e MYSQL_ROOT_PASSWORD=secret \
  -v mysql-data:/var/lib/mysql \
  -p 3306:3306 \
  mysql:8
```

## Multi-Architecture Images

Modern images support multiple CPU architectures:

```
┌─────────────────────────────────────────┐
│      Multi-Architecture Support          │
├─────────────────────────────────────────┤
│                                         │
│   Same image name works on:             │
│   ├── x86_64 (Intel/AMD)                │
│   ├── ARM64 (Apple Silicon, Raspberry)  │
│   ├── ARM/v7 (Older ARM devices)        │
│   └── s390x (IBM mainframes)            │
│                                         │
│   Docker automatically pulls            │
│   the right version for your CPU!       │
│                                         │
└─────────────────────────────────────────┘
```

```bash
# Check image architecture
docker inspect --format='{{.Architecture}}' nginx:alpine

# On Apple Silicon Mac: arm64
# On Intel Mac/PC: amd64

# Pull specific architecture
docker pull --platform linux/amd64 nginx:alpine
docker pull --platform linux/arm64 nginx:alpine
```

## Practical Examples

### Example 1: Setting Up a Development Database

```bash
# Pull PostgreSQL image
docker pull postgres:15-alpine

# Run with environment variables
docker run -d \
  --name dev-db \
  -e POSTGRES_USER=devuser \
  -e POSTGRES_PASSWORD=devpass \
  -e POSTGRES_DB=myapp \
  -p 5432:5432 \
  -v pgdata:/var/lib/postgresql/data \
  postgres:15-alpine

# Connect from your app: localhost:5432
```

### Example 2: Testing Different Python Versions

```bash
# Pull different Python versions
docker pull python:3.9-alpine
docker pull python:3.10-alpine
docker pull python:3.11-alpine

# Test your code with Python 3.9
docker run --rm -v $(pwd):/app python:3.9-alpine python /app/test.py

# Test with Python 3.11
docker run --rm -v $(pwd):/app python:3.11-alpine python /app/test.py
```

### Example 3: Quick Web Server

```bash
# Pull and run nginx
docker pull nginx:alpine
docker run -d -p 8080:80 --name webserver nginx:alpine

# Replace default page
docker run -d -p 8080:80 \
  -v $(pwd)/html:/usr/share/nginx/html:ro \
  nginx:alpine
```

## Troubleshooting

### Image Pull Failures

```bash
# If pull fails, check:
1. Internet connection
2. Docker daemon is running
3. Correct image name

# Use verbose output
docker pull --debug nginx:alpine

# Pull from a different registry
docker pull gcr.io/google-containers/nginx
```

### Storage Issues

```bash
# Check disk space used by Docker
docker system df

# Output:
TYPE            TOTAL   ACTIVE   SIZE      RECLAIMABLE
Images          10      5        2.5GB     1.2GB (48%)
Containers      5       2        100MB     50MB (50%)
Local Volumes   3       1        500MB     300MB (60%)

# Clean up everything
docker system prune -a

# This removes:
# - Stopped containers
# - Unused networks
# - Dangling images
# - Build cache
```

## Best Practices

::: tip 1. Use Specific Tags
Always specify image versions instead of using `latest`:
```bash
# ❌ Bad: Version can change
docker pull node:latest

# ✅ Good: Explicit version
docker pull node:20.10-alpine
```
:::

::: tip 2. Prefer Alpine Images
Use Alpine-based images for smaller size:
```bash
# node:20 = 900MB
# node:20-alpine = 120MB ✅
docker pull node:20-alpine
```
:::

::: tip 3. Regularly Update Images
Keep your images up-to-date for security:
```bash
# Pull latest version
docker pull nginx:alpine

# Update all images
docker images | grep -v REPOSITORY | awk '{print $1":"$2}' | xargs -L1 docker pull
```
:::

::: tip 4. Clean Up Regularly
Remove unused images to save space:
```bash
# Weekly cleanup
docker image prune -a
```
:::

## Summary

You learned:
- ✅ What Docker images are and how they work
- ✅ Understanding image layers
- ✅ Finding and pulling images from Docker Hub
- ✅ Managing images (list, inspect, remove)
- ✅ Tagging and versioning strategies
- ✅ Exporting and importing images
- ✅ Optimizing image sizes
- ✅ Working with official images

::: tip 💡 Key Takeaway
Docker images are blueprints for containers. Use official images when possible, specify versions with tags, and prefer Alpine-based images for smaller sizes!
:::

Next up: [Docker Containers](./03-containers.md) - Learn to create and manage running containers!
