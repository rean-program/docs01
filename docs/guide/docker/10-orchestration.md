# Docker Orchestration

Docker orchestration manages multiple containers across multiple hosts. In this tutorial, you'll learn about orchestration tools, Docker Swarm basics, and an introduction to Kubernetes.

## What is Container Orchestration?

**Container orchestration** automates the deployment, scaling, networking, and management of containerized applications.

```
┌─────────────────────────────────────────────────────────────┐
│         Without Orchestration vs With Orchestration          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   Manual (Single Host)          Orchestrated (Cluster)      │
│   ┌───────────────┐            ┌─────────────────────────┐ │
│   │   Server      │            │    Cluster Manager      │ │
│   │  ┌────────┐   │            │  • Auto-scaling         │ │
│   │  │  App   │   │            │  • Load balancing       │ │
│   │  │  App   │   │            │  • Self-healing         │ │
│   │  │  App   │   │            │  • Rolling updates      │ │
│   │  └────────┘   │            └─────────────────────────┘ │
│   └───────────────┘                      │                  │
│                                          ▼                  │
│   Manual Management           ┌─────┬─────┬─────┬─────┐   │
│   ❌ Hard to scale            │ S1  │ S2  │ S3  │ S4  │   │
│   ❌ No failover              │ App │ App │ App │ App │   │
│   ❌ Manual updates           │ App │ App │ App │ App │   │
│   ❌ Single point failure     └─────┴─────┴─────┴─────┘   │
│                                Automated Management ✅      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Why Orchestration?

| Challenge | Solution |
|-----------|----------|
| **Multiple Hosts** | Manage containers across servers |
| **High Availability** | Automatic failover and recovery |
| **Scaling** | Scale services up/down automatically |
| **Load Balancing** | Distribute traffic across containers |
| **Service Discovery** | Automatic DNS and networking |
| **Rolling Updates** | Zero-downtime deployments |
| **Resource Management** | Optimal resource allocation |

## Orchestration Tools

```
Popular Orchestration Platforms:

1. Docker Swarm
   ├── Built into Docker
   ├── Easy to setup
   ├── Good for small clusters
   └── Native Docker commands

2. Kubernetes (K8s)
   ├── Industry standard
   ├── Rich ecosystem
   ├── Complex but powerful
   └── Cloud-native

3. Amazon ECS
   ├── AWS native
   ├── Managed service
   └── AWS integration

4. Nomad
   ├── HashiCorp
   ├── Simple and flexible
   └── Multi-workload

5. Apache Mesos
   ├── Large scale
   ├── Data center OS
   └── Mature platform
```

## Docker Swarm

Docker Swarm is Docker's native orchestration solution.

### Swarm Concepts

```
┌─────────────────────────────────────────────────────────────┐
│                 Docker Swarm Architecture                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   ┌─────────────────────────────────────────────────────┐  │
│   │              Manager Nodes                          │  │
│   │  ┌──────────┐  ┌──────────┐  ┌──────────┐         │  │
│   │  │ Leader   │  │ Manager  │  │ Manager  │         │  │
│   │  │ (Raft)   │◄─┤          │◄─┤          │         │  │
│   │  └──────────┘  └──────────┘  └──────────┘         │  │
│   └─────────────────────┬───────────────────────────────┘  │
│                         │                                   │
│                         │ Orchestrates                      │
│                         ▼                                   │
│   ┌─────────────────────────────────────────────────────┐  │
│   │              Worker Nodes                           │  │
│   │  ┌──────────┐  ┌──────────┐  ┌──────────┐         │  │
│   │  │ Worker 1 │  │ Worker 2 │  │ Worker 3 │         │  │
│   │  │ Tasks    │  │ Tasks    │  │ Tasks    │         │  │
│   │  └──────────┘  └──────────┘  └──────────┘         │  │
│   └─────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Swarm Terminology

- **Node**: A Docker host participating in the swarm
- **Manager**: Node that manages the swarm
- **Worker**: Node that runs tasks
- **Service**: Definition of tasks to execute
- **Task**: A container running in the swarm
- **Stack**: Group of interrelated services

### Initializing a Swarm

```bash
# Initialize swarm (on manager node)
docker swarm init

# Output:
Swarm initialized: current node (abc123) is now a manager.
To add a worker to this swarm, run:
    docker swarm join --token SWMTKN-1-xxx... 192.168.1.100:2377

# Initialize with specific IP
docker swarm init --advertise-addr 192.168.1.100

# Get join token for workers
docker swarm join-token worker

# Get join token for managers
docker swarm join-token manager
```

### Adding Nodes

```bash
# On worker node - join swarm
docker swarm join \
  --token SWMTKN-1-xxx... \
  192.168.1.100:2377

# List nodes (on manager)
docker node ls

# Output:
ID           HOSTNAME    STATUS    AVAILABILITY    MANAGER STATUS
abc123 *     manager1    Ready     Active          Leader
def456       worker1     Ready     Active
ghi789       worker2     Ready     Active
```

### Creating Services

```bash
# Create a service
docker service create \
  --name web \
  --replicas 3 \
  --publish 80:80 \
  nginx:alpine

# List services
docker service ls

# Output:
ID          NAME    MODE        REPLICAS    IMAGE
abc123def   web     replicated  3/3         nginx:alpine

# List tasks in a service
docker service ps web

# Output:
ID       NAME    IMAGE          NODE      DESIRED STATE    CURRENT STATE
xyz1     web.1   nginx:alpine   worker1   Running          Running 2 minutes
xyz2     web.2   nginx:alpine   worker2   Running          Running 2 minutes
xyz3     web.3   nginx:alpine   manager1  Running          Running 2 minutes
```

### Scaling Services

```bash
# Scale a service
docker service scale web=5

# Scale multiple services
docker service scale web=5 api=10

# Auto-scale based on load (requires external tools)
```

### Updating Services

```bash
# Update service image
docker service update --image nginx:latest web

# Rolling update with parallelism and delay
docker service update \
  --image nginx:1.24 \
  --update-parallelism 2 \
  --update-delay 10s \
  web

# Update environment variable
docker service update \
  --env-add NODE_ENV=production \
  web

# Rollback to previous version
docker service rollback web
```

### Service Configuration

```bash
# Create service with full options
docker service create \
  --name api \
  --replicas 3 \
  --publish 3000:3000 \
  --env NODE_ENV=production \
  --env DATABASE_URL=postgres://db:5432/mydb \
  --mount type=volume,source=app-data,target=/app/data \
  --network app-network \
  --constraint 'node.role==worker' \
  --restart-condition on-failure \
  --restart-max-attempts 3 \
  --update-parallelism 1 \
  --update-delay 10s \
  --limit-cpu 0.5 \
  --limit-memory 512M \
  my-api:latest
```

## Docker Stack

Deploy multi-service applications with Docker Stack.

### Stack File

**docker-stack.yml:**
```yaml
version: '3.8'

services:
  web:
    image: nginx:alpine
    ports:
      - "80:80"
    deploy:
      replicas: 3
      update_config:
        parallelism: 1
        delay: 10s
      restart_policy:
        condition: on-failure
        max_attempts: 3
      resources:
        limits:
          cpus: '0.5'
          memory: 256M
    networks:
      - frontend
  
  api:
    image: my-api:latest
    deploy:
      replicas: 5
      placement:
        constraints:
          - node.role==worker
      update_config:
        parallelism: 2
        delay: 10s
      restart_policy:
        condition: on-failure
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://db:5432/mydb
    networks:
      - frontend
      - backend
  
  db:
    image: postgres:15-alpine
    deploy:
      replicas: 1
      placement:
        constraints:
          - node.role==manager
      restart_policy:
        condition: on-failure
    environment:
      - POSTGRES_PASSWORD_FILE=/run/secrets/db_password
    secrets:
      - db_password
    volumes:
      - db-data:/var/lib/postgresql/data
    networks:
      - backend

volumes:
  db-data:

networks:
  frontend:
  backend:

secrets:
  db_password:
    external: true
```

### Stack Commands

```bash
# Deploy stack
docker stack deploy -c docker-stack.yml myapp

# List stacks
docker stack ls

# List services in stack
docker stack services myapp

# List tasks in stack
docker stack ps myapp

# Remove stack
docker stack rm myapp
```

### Using Secrets

```bash
# Create secret
echo "mypassword" | docker secret create db_password -

# List secrets
docker secret ls

# Inspect secret
docker secret inspect db_password

# Remove secret
docker secret rm db_password

# Create from file
docker secret create db_password /path/to/password.txt
```

## Docker Swarm Networking

### Overlay Networks

```bash
# Create overlay network
docker network create \
  --driver overlay \
  --attachable \
  my-overlay-network

# Create service on overlay network
docker service create \
  --name web \
  --network my-overlay-network \
  nginx:alpine
```

### Load Balancing

```
┌─────────────────────────────────────────────────────────────┐
│              Swarm Load Balancing                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   External Request → Port 80                                │
│                  │                                          │
│                  ▼                                          │
│   ┌─────────────────────────────────────────────────────┐  │
│   │         Ingress Load Balancer (Routing Mesh)        │  │
│   └─────────────────┬───────────────┬───────────────────┘  │
│                     │               │                       │
│                     ▼               ▼                       │
│            ┌─────────────┐   ┌─────────────┐               │
│            │   Node 1    │   │   Node 2    │               │
│            │  ┌────────┐ │   │  ┌────────┐ │               │
│            │  │  web.1 │ │   │  │  web.2 │ │               │
│            │  └────────┘ │   │  └────────┘ │               │
│            └─────────────┘   └─────────────┘               │
│                                                             │
│   Traffic is automatically distributed! ✅                  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Kubernetes Introduction

Kubernetes (K8s) is the industry-standard orchestration platform.

### Kubernetes vs Docker Swarm

| Feature | Docker Swarm | Kubernetes |
|---------|--------------|------------|
| **Setup** | Easy | Complex |
| **Learning Curve** | Gentle | Steep |
| **Scaling** | Good | Excellent |
| **Community** | Smaller | Huge |
| **Ecosystem** | Limited | Rich |
| **Cloud Support** | Basic | Extensive |
| **Use Case** | Small/medium | Any scale |

### Kubernetes Architecture

```
┌─────────────────────────────────────────────────────────────┐
│            Kubernetes Architecture                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   Control Plane (Master)                                    │
│   ┌─────────────────────────────────────────────────────┐  │
│   │  API Server  │  Scheduler  │  Controller Manager    │  │
│   │              │  etcd (State Storage)                 │  │
│   └─────────────────────┬───────────────────────────────┘  │
│                         │                                   │
│                         ▼                                   │
│   ┌─────────────────────────────────────────────────────┐  │
│   │              Worker Nodes                           │  │
│   │  ┌─────────────┐  ┌─────────────┐  ┌──────────┐   │  │
│   │  │   Node 1    │  │   Node 2    │  │  Node 3  │   │  │
│   │  │   kubelet   │  │   kubelet   │  │  kubelet │   │  │
│   │  │  ┌────┐     │  │  ┌────┐     │  │  ┌────┐  │   │  │
│   │  │  │Pod │Pod  │  │  │Pod │Pod  │  │  │Pod │  │   │  │
│   │  │  └────┘     │  │  └────┘     │  │  └────┘  │   │  │
│   │  └─────────────┘  └─────────────┘  └──────────┘   │  │
│   └─────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Basic Kubernetes Concepts

- **Pod**: Smallest deployable unit (one or more containers)
- **Deployment**: Manages replica sets and updates
- **Service**: Exposes pods to network
- **Namespace**: Virtual cluster for isolation
- **ConfigMap**: Configuration data
- **Secret**: Sensitive data storage

### Simple Kubernetes Example

**deployment.yaml:**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:alpine
        ports:
        - containerPort: 80
        resources:
          limits:
            cpu: "0.5"
            memory: "256Mi"
---
apiVersion: v1
kind: Service
metadata:
  name: nginx-service
spec:
  type: LoadBalancer
  selector:
    app: nginx
  ports:
  - port: 80
    targetPort: 80
```

**Commands:**
```bash
# Apply configuration
kubectl apply -f deployment.yaml

# Get deployments
kubectl get deployments

# Get pods
kubectl get pods

# Get services
kubectl get services

# Scale deployment
kubectl scale deployment nginx-deployment --replicas=5

# Update image
kubectl set image deployment/nginx-deployment nginx=nginx:latest

# Delete deployment
kubectl delete deployment nginx-deployment
```

## Choosing an Orchestrator

```
Choose Docker Swarm if:
✅ Small to medium clusters (< 100 nodes)
✅ Simple setup required
✅ Team familiar with Docker
✅ Quick prototyping
✅ Minimal management overhead

Choose Kubernetes if:
✅ Large scale deployments
✅ Complex requirements
✅ Rich ecosystem needed
✅ Cloud-native applications
✅ Long-term investment
✅ Industry standard required
```

## Orchestration Best Practices

::: tip 1. High Availability
Run multiple manager/master nodes:
```bash
# Swarm: 3 or 5 managers (odd number)
# Kubernetes: 3 masters minimum
```
:::

::: tip 2. Resource Planning
Set resource limits:
```yaml
resources:
  limits:
    cpus: '0.5'
    memory: 512M
  reservations:
    cpus: '0.25'
    memory: 256M
```
:::

::: tip 3. Health Checks
Always implement health checks:
```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost/health"]
  interval: 30s
  timeout: 3s
  retries: 3
```
:::

::: tip 4. Rolling Updates
Use gradual rollouts:
```yaml
update_config:
  parallelism: 2
  delay: 10s
  failure_action: rollback
```
:::

::: tip 5. Monitoring
Monitor cluster health:
- Node status
- Service health
- Resource usage
- Network traffic
:::

## Practical Example: Complete Swarm Stack

**production-stack.yml:**
```yaml
version: '3.8'

services:
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    deploy:
      replicas: 2
      update_config:
        parallelism: 1
        delay: 10s
      restart_policy:
        condition: on-failure
    configs:
      - source: nginx_config
        target: /etc/nginx/nginx.conf
    networks:
      - frontend
  
  api:
    image: my-registry.com/api:1.0.0
    deploy:
      replicas: 5
      placement:
        constraints:
          - node.role==worker
      update_config:
        parallelism: 2
        delay: 10s
        failure_action: rollback
      restart_policy:
        condition: on-failure
        max_attempts: 3
      resources:
        limits:
          cpus: '1'
          memory: 512M
        reservations:
          cpus: '0.5'
          memory: 256M
    environment:
      - NODE_ENV=production
    secrets:
      - db_password
      - api_key
    networks:
      - frontend
      - backend
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 3s
      retries: 3
  
  db:
    image: postgres:15-alpine
    deploy:
      replicas: 1
      placement:
        constraints:
          - node.role==manager
      restart_policy:
        condition: on-failure
    environment:
      POSTGRES_PASSWORD_FILE: /run/secrets/db_password
    secrets:
      - db_password
    volumes:
      - db-data:/var/lib/postgresql/data
    networks:
      - backend
  
  redis:
    image: redis:7-alpine
    deploy:
      replicas: 1
      restart_policy:
        condition: on-failure
    command: redis-server --appendonly yes
    volumes:
      - redis-data:/data
    networks:
      - backend

volumes:
  db-data:
  redis-data:

networks:
  frontend:
    driver: overlay
  backend:
    driver: overlay

configs:
  nginx_config:
    file: ./nginx.conf

secrets:
  db_password:
    external: true
  api_key:
    external: true
```

**Deploy:**
```bash
# Create secrets
echo "dbpassword123" | docker secret create db_password -
echo "apikey456" | docker secret create api_key -

# Deploy stack
docker stack deploy -c production-stack.yml myapp

# Monitor deployment
watch docker stack ps myapp

# Check services
docker stack services myapp

# View logs
docker service logs myapp_api
```

## Summary

You learned:
- ✅ What container orchestration is and why it matters
- ✅ Docker Swarm basics and architecture
- ✅ Creating and managing services
- ✅ Deploying multi-service applications with stacks
- ✅ Using secrets and configs
- ✅ Introduction to Kubernetes
- ✅ Choosing the right orchestrator
- ✅ Orchestration best practices

::: tip 💡 Key Takeaway
Container orchestration automates deployment, scaling, and management of containerized applications. Docker Swarm is simple and built-in, while Kubernetes is powerful and industry-standard. Choose based on your scale and requirements!
:::

## Next Steps

You've completed the Docker tutorial series! Here's what to do next:

1. **Practice**: Build and deploy your own applications
2. **Explore**: Try different orchestrators and tools
3. **Learn More**: 
   - Kubernetes in depth
   - Service meshes (Istio, Linkerd)
   - CI/CD with Docker
   - Container security
4. **Community**: Join Docker and Kubernetes communities
5. **Certifications**: Consider Docker or Kubernetes certifications

**Congratulations!** 🎉 You now have a solid foundation in Docker and container orchestration!
