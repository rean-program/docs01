# Docker Networking

Docker networking enables containers to communicate with each other and the outside world. In this tutorial, you'll learn how Docker networking works and how to connect your containers.

## Understanding Docker Networks

By default, Docker creates isolated networks for containers:

```
┌─────────────────────────────────────────────────────────────┐
│              Docker Networking Overview                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   Host Machine                                              │
│   ┌─────────────────────────────────────────────────────┐  │
│   │                                                     │  │
│   │  ┌──────────┐  ┌──────────┐  ┌──────────┐         │  │
│   │  │Container │  │Container │  │Container │         │  │
│   │  │    1     │◄─┼──────────┼──┤    3     │         │  │
│   │  │          │  │    2     │  │          │         │  │
│   │  └──────────┘  └──────────┘  └──────────┘         │  │
│   │       │             │              │               │  │
│   │       └─────────────┴──────────────┘               │  │
│   │                     │                               │  │
│   │              Docker Network                         │  │
│   └─────────────────────┼───────────────────────────────┘  │
│                         │                                   │
│                         ▼                                   │
│                  Internet / Host                            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Network Drivers

Docker provides several network drivers:

```
1. bridge (default)
   ├── Containers on same host
   ├── Isolated network
   └── Port publishing required

2. host
   ├── Shares host network
   ├── No isolation
   └── Best performance

3. none
   ├── No networking
   ├── Complete isolation
   └── Manual configuration needed

4. overlay
   ├── Multi-host networking
   ├── Docker Swarm/Kubernetes
   └── Cross-server communication

5. macvlan
   ├── Assign MAC address
   ├── Appears as physical device
   └── Legacy app integration
```

## Bridge Network (Default)

The default network type for containers:

```bash
# Containers use bridge network by default
docker run -d --name web1 nginx
docker run -d --name web2 nginx

# Both are on the default bridge network
docker network inspect bridge
```

### How Bridge Networks Work

```
┌─────────────────────────────────────────────────────────────┐
│                  Bridge Network                              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   Host: 192.168.1.10                                        │
│   ┌─────────────────────────────────────────────────────┐  │
│   │  Docker Bridge: 172.17.0.1                          │  │
│   │                                                     │  │
│   │  ┌──────────────┐        ┌──────────────┐         │  │
│   │  │  Container   │        │  Container   │         │  │
│   │  │   nginx      │        │   postgres   │         │  │
│   │  │ 172.17.0.2   │◄──────►│ 172.17.0.3   │         │  │
│   │  └──────────────┘        └──────────────┘         │  │
│   │        ▲                        ▲                  │  │
│   └────────┼────────────────────────┼──────────────────┘  │
│            │                        │                      │
│            │   Port Mapping (-p)    │                      │
│            ▼                        ▼                      │
│   Host: 192.168.1.10:8080    Host: 192.168.1.10:5432      │
│            │                        │                      │
│            └────────────────────────┘                      │
│                      │                                     │
│                      ▼                                     │
│                  Internet                                  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Working with Networks

### Creating Networks

```bash
# Create a custom bridge network
docker network create my-network

# Create with specific subnet
docker network create \
  --driver bridge \
  --subnet 172.20.0.0/16 \
  --gateway 172.20.0.1 \
  my-custom-network

# Create with specific options
docker network create \
  --driver bridge \
  --opt "com.docker.network.bridge.name=my-bridge" \
  --opt "com.docker.network.driver.mtu=1200" \
  my-network
```

### Listing Networks

```bash
# List all networks
docker network ls

# Output:
NETWORK ID     NAME          DRIVER    SCOPE
abc123def456   bridge        bridge    local
def789ghi012   host          host      local
ghi012jkl345   none          null      local
jkl345mno678   my-network    bridge    local

# Filter networks
docker network ls --filter driver=bridge
docker network ls --filter name=my
```

### Inspecting Networks

```bash
# Inspect network details
docker network inspect my-network

# Output:
[
    {
        "Name": "my-network",
        "Driver": "bridge",
        "Subnet": "172.20.0.0/16",
        "Gateway": "172.20.0.1",
        "Containers": {
            "abc123...": {
                "Name": "web1",
                "IPv4Address": "172.20.0.2/16"
            }
        }
    }
]

# Get specific information
docker network inspect --format='{{range .Containers}}{{.Name}} {{end}}' my-network
```

### Connecting Containers to Networks

```bash
# Run container on specific network
docker run -d --name web --network my-network nginx

# Connect existing container to network
docker network connect my-network web

# Connect with alias
docker network connect --alias webserver my-network web

# Connect with specific IP
docker network connect --ip 172.20.0.10 my-network web

# Disconnect from network
docker network disconnect my-network web
```

### Removing Networks

```bash
# Remove a network
docker network rm my-network

# Remove multiple networks
docker network rm network1 network2

# Remove all unused networks
docker network prune
```

## Container Communication

### By Container Name (DNS)

Custom networks provide automatic DNS resolution:

```bash
# Create network
docker network create app-network

# Run database
docker run -d \
  --name postgres \
  --network app-network \
  -e POSTGRES_PASSWORD=secret \
  postgres:15-alpine

# Run web app (can connect using hostname "postgres")
docker run -d \
  --name web \
  --network app-network \
  -e DATABASE_URL=postgresql://postgres:5432/mydb \
  my-web-app

# Inside web container, you can:
# ping postgres
# curl http://postgres:5432
```

### Communication Example

```
┌─────────────────────────────────────────────────────────────┐
│              Container Communication                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   app-network                                               │
│   ┌─────────────────────────────────────────────────────┐  │
│   │                                                     │  │
│   │  ┌──────────────┐                                  │  │
│   │  │   Web App    │  connects to "postgres:5432"    │  │
│   │  │   (web)      │──────────┐                      │  │
│   │  └──────────────┘          │                      │  │
│   │                             │                      │  │
│   │                             ▼                      │  │
│   │                  ┌──────────────────┐             │  │
│   │                  │   PostgreSQL     │             │  │
│   │                  │   (postgres)     │             │  │
│   │                  └──────────────────┘             │  │
│   │                                                     │  │
│   │  DNS: postgres → 172.20.0.3                        │  │
│   │  DNS: web      → 172.20.0.2                        │  │
│   └─────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Default Bridge vs Custom Bridge

```bash
# ❌ Default bridge: NO DNS, must use IP
docker run -d --name web1 nginx
docker run -d --name web2 nginx
# web1 cannot ping web2 by name!

# ✅ Custom bridge: DNS enabled
docker network create my-net
docker run -d --name web1 --network my-net nginx
docker run -d --name web2 --network my-net nginx
# web1 CAN ping web2 by name! ✅
```

## Port Publishing

Expose container ports to the host:

```bash
# Publish single port
docker run -d -p 8080:80 nginx

# Publish multiple ports
docker run -d -p 8080:80 -p 8443:443 nginx

# Publish on specific interface
docker run -d -p 127.0.0.1:8080:80 nginx

# Publish all exposed ports to random ports
docker run -d -P nginx

# Check published ports
docker port nginx
```

### Port Mapping Patterns

```
-p 8080:80
   └┬─┘ └┬┘
    │    └─ Container port
    └────── Host port

-p 127.0.0.1:8080:80
   └─────┬────┘ └┬─┘ └┬┘
         │       │    └─ Container port
         │       └────── Host port
         └────────────── Host IP

-p 8080:80/tcp
   └┬─┘ └┬┘ └┬─┘
    │    │   └─ Protocol (tcp/udp)
    │    └───── Container port
    └────────── Host port
```

## Host Network

Share the host's network namespace:

```bash
# Use host network
docker run -d --network host nginx

# Container uses host's network directly
# No port mapping needed!
# Container sees: lo, eth0, etc. from host
```

### When to Use Host Network

```
✅ Good for:
├── Maximum network performance
├── Many ports needed
└── Host network tools access

❌ Avoid:
├── Running multiple instances
├── Port conflicts possible
└── Less isolation
```

## Multi-Container Applications

### Example: Web App + Database + Redis

```bash
# Create network
docker network create app-tier

# Run PostgreSQL
docker run -d \
  --name postgres \
  --network app-tier \
  -e POSTGRES_PASSWORD=secret \
  -v pgdata:/var/lib/postgresql/data \
  postgres:15-alpine

# Run Redis
docker run -d \
  --name redis \
  --network app-tier \
  -v redis-data:/data \
  redis:7-alpine

# Run application
docker run -d \
  --name api \
  --network app-tier \
  -e DATABASE_URL=postgres://postgres:5432/mydb \
  -e REDIS_URL=redis://redis:6379 \
  -p 3000:3000 \
  my-api

# All containers can communicate by name!
```

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                  Multi-Container App                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   app-tier network                                          │
│   ┌─────────────────────────────────────────────────────┐  │
│   │                                                     │  │
│   │  ┌──────────┐     ┌────────────┐    ┌─────────┐   │  │
│   │  │   API    │────►│ PostgreSQL │    │  Redis  │   │  │
│   │  │  Server  │     │  Database  │    │  Cache  │   │  │
│   │  │  :3000   │◄────│   :5432    │◄───│  :6379  │   │  │
│   │  └──────────┘     └────────────┘    └─────────┘   │  │
│   │       │                                             │  │
│   └───────┼─────────────────────────────────────────────┘  │
│           │                                                 │
│           │ Port 3000 published                             │
│           ▼                                                 │
│   Host: localhost:3000                                      │
│           │                                                 │
│           ▼                                                 │
│   External Clients                                          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Network Aliases

Assign multiple DNS names to containers:

```bash
# Create with alias
docker run -d \
  --name web \
  --network my-net \
  --network-alias webserver \
  --network-alias api \
  nginx

# Now accessible as:
# - web
# - webserver
# - api

# Add alias to existing container
docker network connect --alias backend my-net web
```

## Connecting to Multiple Networks

Containers can be on multiple networks:

```bash
# Create networks
docker network create frontend
docker network create backend

# Database on backend only
docker run -d \
  --name db \
  --network backend \
  postgres:15-alpine

# API on both networks
docker run -d \
  --name api \
  --network backend \
  my-api

docker network connect frontend api

# Web on frontend only
docker run -d \
  --name web \
  --network frontend \
  -p 80:80 \
  my-web-app
```

### Multi-Network Architecture

```
┌─────────────────────────────────────────────────────────────┐
│              Multi-Network Setup                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   Frontend Network                                          │
│   ┌─────────────────────────────────┐                      │
│   │  ┌────────┐      ┌────────┐    │                      │
│   │  │  Web   │─────►│  API   │    │                      │
│   │  └────────┘      └────────┘    │                      │
│   │                       │         │                      │
│   └───────────────────────┼─────────┘                      │
│                           │                                 │
│   Backend Network         │                                 │
│   ┌───────────────────────┼─────────┐                      │
│   │                   ┌────────┐    │                      │
│   │                   │  API   │───►│                      │
│   │                   └────────┘    │                      │
│   │                       │         │                      │
│   │                       ▼         │                      │
│   │                  ┌──────────┐   │                      │
│   │                  │ Database │   │                      │
│   │                  └──────────┘   │                      │
│   └─────────────────────────────────┘                      │
│                                                             │
│   Web can't access Database directly! ✅ Security          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Network Security

### Isolate Services

```bash
# Public network (exposed services)
docker network create public

# Private network (internal services)
docker network create private

# Public web server
docker run -d \
  --name nginx \
  --network public \
  -p 80:80 \
  nginx

# Private database
docker run -d \
  --name db \
  --network private \
  postgres:15-alpine

# App bridge between them
docker run -d \
  --name app \
  --network private \
  my-app

docker network connect public app
```

## Practical Examples

### Example 1: WordPress with MySQL

```bash
# Create network
docker network create wordpress-net

# Run MySQL
docker run -d \
  --name wordpress-db \
  --network wordpress-net \
  -e MYSQL_ROOT_PASSWORD=rootpass \
  -e MYSQL_DATABASE=wordpress \
  -e MYSQL_USER=wpuser \
  -e MYSQL_PASSWORD=wppass \
  -v wordpress-db:/var/lib/mysql \
  mysql:8

# Run WordPress
docker run -d \
  --name wordpress \
  --network wordpress-net \
  -e WORDPRESS_DB_HOST=wordpress-db \
  -e WORDPRESS_DB_USER=wpuser \
  -e WORDPRESS_DB_PASSWORD=wppass \
  -e WORDPRESS_DB_NAME=wordpress \
  -p 8080:80 \
  -v wordpress-data:/var/www/html \
  wordpress:latest

# Access: http://localhost:8080
```

### Example 2: Microservices Architecture

```bash
# Create network
docker network create microservices

# Service discovery / API Gateway
docker run -d \
  --name api-gateway \
  --network microservices \
  -p 80:80 \
  my-gateway

# User service
docker run -d \
  --name user-service \
  --network microservices \
  --network-alias users \
  my-user-service

# Product service
docker run -d \
  --name product-service \
  --network microservices \
  --network-alias products \
  my-product-service

# Order service
docker run -d \
  --name order-service \
  --network microservices \
  --network-alias orders \
  my-order-service

# Each service can call others by name:
# - http://users/api/...
# - http://products/api/...
# - http://orders/api/...
```

## Troubleshooting

### Check Container Connectivity

```bash
# Test network connectivity
docker exec container1 ping container2

# Test DNS resolution
docker exec container1 nslookup container2

# Check if port is open
docker exec container1 nc -zv container2 5432

# View network interfaces
docker exec container1 ip addr

# Test HTTP endpoint
docker exec container1 curl http://container2:80
```

### Debug Network Issues

```bash
# Install tools in container
docker exec -it container sh
apk add --no-cache curl netcat-openbsd bind-tools

# Check routing
ip route

# Test specific port
nc -zv hostname 5432

# DNS lookup
nslookup hostname

# Trace route
traceroute hostname
```

## Best Practices

::: tip 1. Use Custom Bridge Networks
```bash
# ❌ Bad: Default bridge (no DNS)
docker run -d nginx

# ✅ Good: Custom network (DNS enabled)
docker network create my-net
docker run -d --network my-net nginx
```
:::

::: tip 2. Organize by Application
```bash
# Create network per application
docker network create wordpress-net
docker network create nextcloud-net

# Keep services isolated
```
:::

::: tip 3. Use Network Aliases
```bash
# Multiple DNS names for flexibility
docker run -d \
  --network my-net \
  --network-alias api \
  --network-alias backend \
  my-service
```
:::

::: tip 4. Implement Network Segmentation
```bash
# Frontend network for public services
# Backend network for databases
# Services bridge where needed
```
:::

## Summary

You learned:
- ✅ Docker network drivers and types
- ✅ Creating and managing networks
- ✅ Container communication via DNS
- ✅ Port publishing strategies
- ✅ Multi-network architectures
- ✅ Network security and isolation
- ✅ Troubleshooting network issues

::: tip 💡 Key Takeaway
Custom bridge networks provide automatic DNS resolution, enabling containers to communicate by name. Organize services by application, use network segmentation for security, and leverage aliases for flexibility!
:::

Next: [Docker Compose](./07-compose.md) - Manage multi-container applications with ease!
