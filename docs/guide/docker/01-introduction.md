# Introduction to Docker

Docker revolutionized application deployment by introducing containerization. In this tutorial, you'll learn what Docker is, how it works, and install it on your machine.

## What is Docker?

Docker is a **containerization platform** that packages applications with all their dependencies into standardized units called **containers**. Think of it as a lightweight, portable box that contains everything your application needs to run.

```
┌─────────────────────────────────────────────────────────────┐
│               Real-World Analogy: Shipping                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   Before Containers           With Containers               │
│                                                             │
│   ┌─────────────────┐        ┌─────────────────┐           │
│   │ Different boxes │        │ Standard boxes  │           │
│   │ Various sizes   │        │ All same size   │           │
│   │ Hard to stack   │  ═►    │ Easy to stack   │           │
│   │ Slow loading    │        │ Fast loading    │           │
│   └─────────────────┘        └─────────────────┘           │
│                                                             │
│   Docker does the same for applications! 📦                │
└─────────────────────────────────────────────────────────────┘
```

## The Problem Docker Solves

### "Works on My Machine" Syndrome

Have you experienced this?

```
Developer's Machine ✅       Tester's Machine ❌       Production ❌
┌─────────────────┐         ┌─────────────────┐      ┌─────────────────┐
│ Node.js 20.x    │         │ Node.js 18.x    │      │ Node.js 16.x    │
│ MongoDB 7.0     │         │ MongoDB 6.0     │      │ MongoDB 5.0     │
│ Ubuntu 22.04    │         │ Windows 11      │      │ CentOS 7        │
└─────────────────┘         └─────────────────┘      └─────────────────┘
     Works!                     Breaks!                   Crashes!
```

Docker solves this by:
1. **Packaging** your app with exact dependencies
2. **Guaranteeing** it runs the same everywhere
3. **Eliminating** environment-related bugs

## Docker vs Virtual Machines

Understanding the difference is crucial:

```
┌─────────────────────────────────────────────────────────────┐
│               Virtual Machines (VMs)                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   ┌─────────┐  ┌─────────┐  ┌─────────┐                    │
│   │  App A  │  │  App B  │  │  App C  │                    │
│   ├─────────┤  ├─────────┤  ├─────────┤                    │
│   │  Bins/  │  │  Bins/  │  │  Bins/  │                    │
│   │  Libs   │  │  Libs   │  │  Libs   │                    │
│   ├─────────┤  ├─────────┤  ├─────────┤                    │
│   │ Guest   │  │ Guest   │  │ Guest   │                    │
│   │   OS    │  │   OS    │  │   OS    │  ← Each VM has    │
│   └─────────┘  └─────────┘  └─────────┘    full OS!       │
│   ─────────────────────────────────────                    │
│         Hypervisor (VMware, VirtualBox)                     │
│   ─────────────────────────────────────                    │
│         Host Operating System                               │
│   ─────────────────────────────────────                    │
│         Physical Hardware                                   │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                    Docker Containers                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   ┌─────────┐  ┌─────────┐  ┌─────────┐                    │
│   │  App A  │  │  App B  │  │  App C  │                    │
│   ├─────────┤  ├─────────┤  ├─────────┤                    │
│   │  Bins/  │  │  Bins/  │  │  Bins/  │                    │
│   │  Libs   │  │  Libs   │  │  Libs   │                    │
│   └─────────┘  └─────────┘  └─────────┘  ← No Guest OS!    │
│   ─────────────────────────────────────                    │
│              Docker Engine                                  │
│   ─────────────────────────────────────                    │
│         Host Operating System                               │
│   ─────────────────────────────────────                    │
│         Physical Hardware                                   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Comparison Table

| Feature | Virtual Machines | Docker Containers |
|---------|-----------------|-------------------|
| **Size** | Gigabytes (GB) | Megabytes (MB) |
| **Startup Time** | Minutes | Seconds |
| **Performance** | Slower (overhead) | Near-native speed |
| **Isolation** | Complete (hardware level) | Process-level |
| **Resource Usage** | Heavy | Lightweight |
| **Portability** | Limited | Highly portable |
| **OS** | Each VM needs full OS | Shares host OS kernel |

## Core Docker Concepts

### 1. Images

A Docker **image** is a blueprint or template for creating containers. It's like a recipe that contains:
- Application code
- Runtime environment
- System tools
- Libraries
- Configuration files

```
┌─────────────────────────────────────────┐
│          Docker Image (Recipe)           │
├─────────────────────────────────────────┤
│                                         │
│   Layer 4: Your App Code               │
│   Layer 3: npm install                  │
│   Layer 2: Node.js Runtime              │
│   Layer 1: Base OS (Ubuntu/Alpine)      │
│                                         │
└─────────────────────────────────────────┘
```

### 2. Containers

A **container** is a running instance of an image. It's an isolated, executable package.

```
     Image                    Containers
    (Recipe)                 (Running Apps)
       │
       ├──────► Container 1 (running)
       │
       ├──────► Container 2 (running)
       │
       └──────► Container 3 (stopped)

One image → Multiple containers
```

### 3. Docker Engine

The core of Docker that makes everything work:

```
┌─────────────────────────────────────────┐
│          Docker Engine                   │
├─────────────────────────────────────────┤
│                                         │
│   ┌──────────────────────────────┐     │
│   │      Docker CLI              │     │
│   │  (Command-line interface)    │     │
│   └──────────────────────────────┘     │
│              │                          │
│              ▼                          │
│   ┌──────────────────────────────┐     │
│   │      Docker Daemon           │     │
│   │  (Background service)        │     │
│   │  • Builds images             │     │
│   │  • Runs containers           │     │
│   │  • Manages resources         │     │
│   └──────────────────────────────┘     │
│              │                          │
│              ▼                          │
│   ┌──────────────────────────────┐     │
│   │  containerd & runc           │     │
│   │  (Container runtime)         │     │
│   └──────────────────────────────┘     │
│                                         │
└─────────────────────────────────────────┘
```

## Installing Docker

### For macOS

**Option 1: Docker Desktop (Recommended)**

1. Visit [docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop/)
2. Download Docker Desktop for Mac
3. Open the `.dmg` file and drag Docker to Applications
4. Launch Docker from Applications
5. Wait for Docker to start (whale icon in menu bar)

**Option 2: Homebrew**

```bash
# Install Docker Desktop via Homebrew
brew install --cask docker

# Launch Docker
open /Applications/Docker.app
```

### For Windows

**Requirements**: Windows 10/11 (64-bit) with WSL 2

1. Visit [docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop/)
2. Download Docker Desktop for Windows
3. Run the installer
4. Enable WSL 2 when prompted
5. Restart your computer
6. Launch Docker Desktop

### For Linux (Ubuntu/Debian)

```bash
# Update package index
sudo apt-get update

# Install dependencies
sudo apt-get install -y \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg \
    lsb-release

# Add Docker's official GPG key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Set up stable repository
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker Engine
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Add your user to docker group (avoid using sudo)
sudo usermod -aG docker $USER

# Log out and back in for group changes to take effect
```

## Verifying Installation

After installation, verify Docker is working:

```bash
# Check Docker version
docker --version
# Output: Docker version 24.x.x, build xxxxx

# Check detailed information
docker version

# Run a test container
docker run hello-world
```

You should see output like:

```
Hello from Docker!
This message shows that your installation appears to be working correctly.

To generate this message, Docker took the following steps:
 1. The Docker client contacted the Docker daemon.
 2. The Docker daemon pulled the "hello-world" image from Docker Hub.
 3. The Docker daemon created a new container from that image.
 4. The Docker daemon streamed that output to the Docker client.
```

## Docker Architecture

Understanding how Docker components work together:

```
┌─────────────────────────────────────────────────────────────┐
│                 Your Computer                                │
│                                                             │
│   You type commands                                         │
│         │                                                   │
│         ▼                                                   │
│   ┌──────────────┐                                          │
│   │ Docker CLI   │                                          │
│   └──────────────┘                                          │
│         │                                                   │
│         │ (REST API)                                        │
│         ▼                                                   │
│   ┌─────────────────────────────────────────┐              │
│   │         Docker Daemon                    │              │
│   │                                          │              │
│   │  ┌──────────┐  ┌──────────┐            │              │
│   │  │ Images   │  │Containers│            │              │
│   │  └──────────┘  └──────────┘            │              │
│   │                                          │              │
│   │  ┌──────────┐  ┌──────────┐            │              │
│   │  │ Volumes  │  │ Networks │            │              │
│   │  └──────────┘  └──────────┘            │              │
│   └─────────────────────────────────────────┘              │
│         │                                                   │
│         │ (Downloads images)                                │
│         ▼                                                   │
│   ┌──────────────┐                                          │
│   │ Docker Hub   │ ◄── Registry in the cloud               │
│   └──────────────┘                                          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Basic Docker Commands

Let's try some basic commands:

```bash
# Get Docker information
docker info

# List all images on your system
docker images

# List running containers
docker ps

# List all containers (running and stopped)
docker ps -a

# Get help
docker --help
docker run --help
```

## Your First Docker Container

Let's run a simple web server:

```bash
# Run nginx web server
docker run -d -p 8080:80 --name my-nginx nginx

# What this does:
# -d              : Run in detached mode (background)
# -p 8080:80      : Map port 8080 (host) to 80 (container)
# --name my-nginx : Give container a friendly name
# nginx           : The image to use
```

Open your browser to `http://localhost:8080` - you'll see the Nginx welcome page!

```bash
# Check the running container
docker ps

# View container logs
docker logs my-nginx

# Stop the container
docker stop my-nginx

# Start it again
docker start my-nginx

# Remove the container
docker stop my-nginx
docker rm my-nginx
```

## How It All Works

When you ran that nginx container:

```
1. Docker CLI sends command to Docker Daemon
         │
         ▼
2. Daemon checks if nginx image exists locally
         │
         ├─── Yes? Use it
         │
         └─── No? Download from Docker Hub
         │
         ▼
3. Create container from image
         │
         ▼
4. Allocate network interface
         │
         ▼
5. Set up port forwarding (8080 → 80)
         │
         ▼
6. Start the container
         │
         ▼
7. Nginx runs inside container 🎉
```

## Common Use Cases

### Development Environment

```bash
# Run a PostgreSQL database
docker run -d \
  --name dev-postgres \
  -e POSTGRES_PASSWORD=secret \
  -p 5432:5432 \
  postgres

# Now you have PostgreSQL without installing it!
```

### Testing Different Versions

```bash
# Test with Python 3.9
docker run -it python:3.9 python --version

# Test with Python 3.11
docker run -it python:3.11 python --version

# No conflicts between versions!
```

## Best Practices

::: tip 1. One Container = One Process
Each container should run a single process or service. Don't try to run your entire application stack in one container.
:::

::: tip 2. Containers Are Ephemeral
Treat containers as temporary. They can be stopped and destroyed at any time. Use volumes for persistent data.
:::

::: tip 3. Use Official Images
Start with official images from Docker Hub. They're maintained, secure, and well-documented.
:::

::: tip 4. Keep Containers Small
Smaller containers are faster to download, build, and deploy. Use Alpine Linux when possible.
:::

## Troubleshooting

### Docker Daemon Not Running

```bash
# Check if Docker is running
docker ps

# If you see "Cannot connect to the Docker daemon"
# macOS/Windows: Start Docker Desktop
# Linux: sudo systemctl start docker
```

### Permission Denied (Linux)

```bash
# Add your user to docker group
sudo usermod -aG docker $USER

# Log out and back in
# Or run: newgrp docker
```

### Port Already in Use

```bash
# Check what's using the port
lsof -i :8080  # macOS/Linux
netstat -ano | findstr :8080  # Windows

# Use a different port
docker run -p 8081:80 nginx
```

## What's Next?

Now that you understand Docker basics and have it installed, you're ready to:

1. **[Learn about Docker Images](./02-images.md)** - Understand how images work and manage them
2. **Explore Docker Hub** - Discover thousands of pre-built images
3. **Build your own containers** - Start containerizing your applications

## Summary

You learned:
- ✅ What Docker is and the problems it solves
- ✅ Difference between Docker and Virtual Machines
- ✅ Core concepts: Images, Containers, Docker Engine
- ✅ How to install Docker on your system
- ✅ Basic Docker commands
- ✅ Running your first container

::: tip 💡 Key Takeaway
Docker packages applications with dependencies into containers that run consistently anywhere. It's faster and more efficient than virtual machines!
:::

Ready to dive deeper? Let's explore [Docker Images](./02-images.md) next!
