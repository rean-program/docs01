# Dockerfile Basics

A Dockerfile is a text file containing instructions to build a Docker image. In this tutorial, you'll learn how to write Dockerfiles and build custom images for your applications.

## What is a Dockerfile?

A **Dockerfile** is a script with instructions that Docker uses to automatically build images. It's like a recipe that defines:
- Base image to start from
- Files to copy
- Commands to run
- How to start the application

```
┌─────────────────────────────────────────────────────────────┐
│              Dockerfile Build Process                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   Dockerfile              Docker Build           Image      │
│   ┌──────────┐           ┌──────────┐         ┌─────────┐  │
│   │ FROM     │           │          │         │  Layer  │  │
│   │ COPY     │   ═══►    │  Build   │  ═══►   │  Layer  │  │
│   │ RUN      │           │ Process  │         │  Layer  │  │
│   │ CMD      │           │          │         │  Layer  │  │
│   └──────────┘           └──────────┘         └─────────┘  │
│   Instructions            Executes             Final Image  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Basic Dockerfile Structure

```dockerfile
# Start from a base image
FROM node:20-alpine

# Set the working directory
WORKDIR /app

# Copy files
COPY package.json .

# Run commands
RUN npm install

# Copy application code
COPY . .

# Expose ports
EXPOSE 3000

# Define startup command
CMD ["node", "server.js"]
```

## Core Instructions

### FROM - Base Image

Every Dockerfile starts with `FROM`:

```dockerfile
# Official Node.js image
FROM node:20-alpine

# Python image
FROM python:3.11-slim

# Ubuntu base
FROM ubuntu:22.04

# Multi-stage build (advanced)
FROM node:20-alpine AS builder

# Scratch (empty image)
FROM scratch
```

**Best Practices:**
```dockerfile
# ✅ Good: Specific version
FROM node:20.10-alpine

# ❌ Bad: Latest tag (unpredictable)
FROM node:latest

# ✅ Better: Use Alpine for smaller size
FROM node:20-alpine  # ~120MB
# vs
FROM node:20         # ~900MB
```

### WORKDIR - Working Directory

Sets the working directory for subsequent instructions:

```dockerfile
# Set working directory
WORKDIR /app

# All paths are now relative to /app
COPY package.json .     # Copies to /app/package.json
RUN npm install         # Runs in /app

# You can use multiple WORKDIR
WORKDIR /app
WORKDIR frontend        # Now in /app/frontend
```

### COPY - Copy Files

Copy files from host to image:

```dockerfile
# Copy single file
COPY package.json .

# Copy multiple files
COPY package.json package-lock.json ./

# Copy directory
COPY src/ ./src/

# Copy everything (respects .dockerignore)
COPY . .

# Copy with ownership
COPY --chown=node:node . .
```

### ADD - Copy with Extra Features

Similar to COPY but with additional features:

```dockerfile
# Copy file (same as COPY)
ADD package.json .

# Extract tar automatically
ADD archive.tar.gz /app/

# Download from URL
ADD https://example.com/file.txt /app/
```

**When to use:**
```dockerfile
# ✅ Use COPY for local files
COPY . .

# ✅ Use ADD only for tar extraction
ADD app.tar.gz /app/

# ❌ Don't use ADD for URLs
# Use RUN wget or RUN curl instead
```

### RUN - Execute Commands

Run commands during image build:

```dockerfile
# Install packages
RUN apt-get update && apt-get install -y curl

# Run multiple commands
RUN npm install && \
    npm run build && \
    npm prune --production

# With && for better caching
RUN apt-get update && \
    apt-get install -y \
        curl \
        git \
        vim && \
    rm -rf /var/lib/apt/lists/*
```

### CMD - Default Command

Define the default command to run:

```dockerfile
# Exec form (preferred)
CMD ["node", "server.js"]

# Shell form
CMD node server.js

# With parameters
CMD ["python", "app.py", "--port", "8000"]
```

**Only the last CMD is used:**
```dockerfile
CMD ["echo", "First"]   # Ignored
CMD ["echo", "Second"]  # Ignored
CMD ["echo", "Third"]   # This one runs
```

### ENTRYPOINT - Fixed Command

Similar to CMD but harder to override:

```dockerfile
# Define the executable
ENTRYPOINT ["node"]

# Can be combined with CMD for default args
ENTRYPOINT ["node"]
CMD ["server.js"]

# Run: docker run myapp
# Executes: node server.js

# Run: docker run myapp app.js
# Executes: node app.js
```

**CMD vs ENTRYPOINT:**
```dockerfile
# Using CMD (easily overridden)
CMD ["nginx", "-g", "daemon off;"]
# docker run myapp bash  → runs bash

# Using ENTRYPOINT (fixed command)
ENTRYPOINT ["nginx", "-g", "daemon off;"]
# docker run myapp bash  → runs nginx with "bash" as arg

# Combination (flexible)
ENTRYPOINT ["nginx"]
CMD ["-g", "daemon off;"]
# docker run myapp  → nginx -g daemon off;
# docker run myapp -h  → nginx -h
```

### EXPOSE - Document Ports

Document which ports the application uses:

```dockerfile
# Single port
EXPOSE 3000

# Multiple ports
EXPOSE 80 443

# With protocol
EXPOSE 8080/tcp
EXPOSE 8080/udp
```

**Note:** EXPOSE doesn't actually publish ports - it's documentation. Use `-p` flag when running:
```bash
docker run -p 3000:3000 myapp
```

### ENV - Environment Variables

Set environment variables:

```dockerfile
# Set single variable
ENV NODE_ENV=production

# Set multiple variables
ENV NODE_ENV=production \
    PORT=3000 \
    API_URL=https://api.example.com

# Use variables
ENV APP_HOME=/app
WORKDIR $APP_HOME
```

### ARG - Build Arguments

Define build-time variables:

```dockerfile
# Define argument with default
ARG NODE_VERSION=20
FROM node:${NODE_VERSION}-alpine

ARG PORT=3000
EXPOSE $PORT

# Multiple args
ARG APP_NAME
ARG APP_VERSION=1.0.0
LABEL app.name=${APP_NAME} app.version=${APP_VERSION}
```

**Using build args:**
```bash
# Use default values
docker build -t myapp .

# Override at build time
docker build \
  --build-arg NODE_VERSION=18 \
  --build-arg PORT=8080 \
  -t myapp .
```

**ARG vs ENV:**
```dockerfile
# ARG: Available only during build
ARG BUILD_DATE=2024-12-21

# ENV: Available during build AND runtime
ENV NODE_ENV=production

# ARG values can be used to set ENV
ARG API_URL
ENV API_URL=$API_URL
```

## Building Your First Image

### Simple Node.js Application

**File structure:**
```
my-node-app/
├── Dockerfile
├── package.json
├── package-lock.json
└── server.js
```

**server.js:**
```javascript
const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello from Docker!\n');
});

server.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

**package.json:**
```json
{
  "name": "my-node-app",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {}
}
```

**Dockerfile:**
```dockerfile
# Use Node.js LTS version
FROM node:20-alpine

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application code
COPY . .

# Expose the port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
```

### Building the Image

```bash
# Build image
docker build -t my-node-app .

# Build process output:
[+] Building 12.5s (10/10) FINISHED
 => [1/5] FROM node:20-alpine
 => [2/5] WORKDIR /app
 => [3/5] COPY package*.json ./
 => [4/5] RUN npm install
 => [5/5] COPY . .
 => exporting to image

# Verify image was created
docker images my-node-app

# Run the container
docker run -d -p 3000:3000 --name myapp my-node-app

# Test it
curl http://localhost:3000
```

### Build Command Options

```bash
# Basic build
docker build -t myapp .

# Tag with version
docker build -t myapp:1.0.0 .

# Multiple tags
docker build -t myapp:1.0.0 -t myapp:latest .

# Specify Dockerfile location
docker build -f path/to/Dockerfile -t myapp .

# Build with build args
docker build --build-arg NODE_ENV=production -t myapp .

# No cache (fresh build)
docker build --no-cache -t myapp .

# Show build output
docker build --progress=plain -t myapp .

# Build for different platform
docker build --platform linux/amd64 -t myapp .
```

## Advanced Dockerfile Example

**Multi-stage Python Application:**

```dockerfile
# Stage 1: Build dependencies
FROM python:3.11-slim AS builder

WORKDIR /app

# Install build dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends gcc && \
    rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir --user -r requirements.txt

# Stage 2: Runtime
FROM python:3.11-slim

WORKDIR /app

# Copy installed packages from builder
COPY --from=builder /root/.local /root/.local

# Add local packages to PATH
ENV PATH=/root/.local/bin:$PATH

# Copy application code
COPY . .

# Create non-root user
RUN useradd -m appuser && chown -R appuser /app
USER appuser

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s \
  CMD python -c "import requests; requests.get('http://localhost:8000/health')"

# Expose port
EXPOSE 8000

# Run application
CMD ["python", "app.py"]
```

## The .dockerignore File

Exclude files from the build context:

**.dockerignore:**
```
# Git files
.git
.gitignore

# Dependencies
node_modules/
__pycache__/
*.pyc

# IDE
.vscode/
.idea/
*.swp

# Documentation
README.md
docs/

# Environment
.env
.env.local
*.log

# Build artifacts
dist/
build/
*.tar.gz

# Testing
coverage/
.pytest_cache/
test/
*.test.js
```

**Why .dockerignore matters:**
```
Without .dockerignore:
├── Context: 500 MB (includes node_modules)
└── Build time: 45 seconds

With .dockerignore:
├── Context: 2 MB (excludes unnecessary files)
└── Build time: 8 seconds ✅
```

## Layer Caching

Docker caches layers to speed up builds:

```dockerfile
# ❌ Bad: Changes to any file rebuilds everything
FROM node:20-alpine
WORKDIR /app
COPY . .                    # ← Changes break cache
RUN npm install            # ← Reinstalls everything
CMD ["npm", "start"]

# ✅ Good: Dependencies cached separately
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./      # ← Only changes if package.json changes
RUN npm install           # ← Cached unless above changes
COPY . .                   # ← Source code changes don't affect cache above
CMD ["npm", "start"]
```

**Caching Strategy:**
```
Build 1 (fresh):
├── Layer 1: FROM node:20-alpine     → Build (2s)
├── Layer 2: WORKDIR /app            → Build (0.1s)
├── Layer 3: COPY package*.json      → Build (0.1s)
├── Layer 4: RUN npm install         → Build (30s)
├── Layer 5: COPY . .                → Build (0.5s)
└── Total: 32.7s

Build 2 (code change):
├── Layer 1-4: ✅ Cached              → 0s
├── Layer 5: COPY . .                → Build (0.5s)
└── Total: 0.5s  🚀
```

## Best Practices

### 1. Use Specific Base Images

```dockerfile
# ❌ Bad: Unpredictable
FROM node:latest

# ✅ Good: Explicit version
FROM node:20.10-alpine
```

### 2. Minimize Layers

```dockerfile
# ❌ Bad: Multiple RUN commands
RUN apt-get update
RUN apt-get install -y curl
RUN apt-get install -y git

# ✅ Good: Combined in one layer
RUN apt-get update && \
    apt-get install -y \
        curl \
        git && \
    rm -rf /var/lib/apt/lists/*
```

### 3. Order Instructions by Change Frequency

```dockerfile
# ✅ Good: Least to most frequently changed
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./         # Changes rarely
RUN npm install              # Changes rarely
COPY . .                      # Changes often
CMD ["npm", "start"]         # Never changes
```

### 4. Use .dockerignore

```dockerfile
# Include .dockerignore to exclude:
# - node_modules/
# - .git/
# - build artifacts
# - logs
```

### 5. Don't Run as Root

```dockerfile
# Create and use non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Or use existing user
USER node  # For Node.js images
```

### 6. Use Multi-stage Builds

```dockerfile
# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY package*.json ./
RUN npm install --production
CMD ["node", "dist/server.js"]
```

### 7. Add Health Checks

```dockerfile
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1
```

### 8. Use Specific COPY

```dockerfile
# ❌ Bad: Copies everything
COPY . .

# ✅ Good: Copy only what's needed
COPY src/ ./src/
COPY package*.json ./
```

## Common Patterns

### Node.js Application

```dockerfile
FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy app
COPY . .

# Non-root user
USER node

EXPOSE 3000

CMD ["node", "server.js"]
```

### Python Application

```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy app
COPY . .

# Non-root user
RUN useradd -m appuser
USER appuser

EXPOSE 8000

CMD ["python", "app.py"]
```

### Go Application (Multi-stage)

```dockerfile
# Build stage
FROM golang:1.21-alpine AS builder
WORKDIR /app
COPY go.* ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 go build -o main .

# Run stage
FROM alpine:latest
RUN apk --no-cache add ca-certificates
WORKDIR /root/
COPY --from=builder /app/main .
EXPOSE 8080
CMD ["./main"]
```

## Debugging Dockerfile Builds

```bash
# Build with verbose output
docker build --progress=plain --no-cache -t myapp .

# Inspect intermediate layers
docker build -t myapp .
docker run -it <layer-id> sh

# Build up to specific stage
docker build --target builder -t myapp:builder .

# See build history
docker history myapp
```

## Summary

You learned:
- ✅ What Dockerfiles are and their purpose
- ✅ Core Dockerfile instructions (FROM, RUN, COPY, CMD, etc.)
- ✅ Building Docker images from Dockerfiles
- ✅ Using .dockerignore to optimize builds
- ✅ Layer caching strategies
- ✅ Best practices for writing Dockerfiles
- ✅ Common patterns for different languages
- ✅ Multi-stage builds for optimization

::: tip 💡 Key Takeaway
Dockerfiles are recipes for building images. Order instructions by change frequency, use specific base images, leverage layer caching, and create multi-stage builds for smaller production images!
:::

Next: [Docker Volumes](./05-volumes.md) - Learn to persist data beyond container lifecycles!
