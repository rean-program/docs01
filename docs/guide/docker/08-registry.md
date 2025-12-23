# Docker Registry

Docker registries store and distribute Docker images. In this tutorial, you'll learn how to work with Docker Hub, create private registries, and implement effective image distribution strategies.

## What is a Docker Registry?

A **Docker registry** is a storage and distribution system for Docker images. It's like GitHub for Docker images.

```
┌─────────────────────────────────────────────────────────────┐
│              Docker Registry Workflow                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   Developer          Registry (Hub)        Production       │
│   ┌────────┐        ┌──────────┐         ┌────────┐       │
│   │ Build  │        │  Docker  │         │  Pull  │       │
│   │ Image  │─push──►│   Hub    │─pull───►│  Run   │       │
│   └────────┘        └──────────┘         └────────┘       │
│                                                             │
│   Local              Cloud Storage        Server            │
│   Development        (Public/Private)     Deployment        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Types of Registries

```
1. Docker Hub (Public)
   ├── Free public images
   ├── Official images
   └── One free private repo

2. Docker Hub (Private)
   ├── Unlimited private repos
   ├── Team management
   └── Paid plans

3. Self-Hosted
   ├── Docker Registry
   ├── Harbor
   └── Nexus Repository

4. Cloud Registries
   ├── AWS ECR
   ├── Google GCR
   └── Azure ACR
```

## Docker Hub

### Creating a Docker Hub Account

1. Visit [hub.docker.com](https://hub.docker.com)
2. Sign up for free account
3. Verify your email
4. Log in to Docker Hub

### Logging In

```bash
# Login to Docker Hub
docker login

# You'll be prompted:
# Username: your-username
# Password: your-password

# Login successful:
# Login Succeeded

# Login with username
docker login -u your-username

# Login to specific registry
docker login registry.example.com
```

### Tagging Images for Docker Hub

```bash
# Tag format: username/repository:tag
docker tag my-app:latest yourusername/my-app:latest

# Tag with version
docker tag my-app:latest yourusername/my-app:1.0.0

# Multiple tags
docker tag my-app:latest yourusername/my-app:latest
docker tag my-app:latest yourusername/my-app:1.0.0
docker tag my-app:latest yourusername/my-app:stable
```

### Pushing Images

```bash
# Push to Docker Hub
docker push yourusername/my-app:latest

# Push all tags
docker push yourusername/my-app:1.0.0
docker push yourusername/my-app:latest

# Push process:
# The push refers to repository [docker.io/yourusername/my-app]
# abc123: Pushed
# def456: Pushed
# latest: digest: sha256:... size: 1234
```

### Pulling Images

```bash
# Pull your image
docker pull yourusername/my-app:latest

# Pull specific version
docker pull yourusername/my-app:1.0.0

# Pull from different registry
docker pull registry.example.com/my-app:latest
```

## Image Tagging Strategies

### Semantic Versioning

```bash
# Major.Minor.Patch
docker tag my-app yourusername/my-app:1.0.0    # Specific version
docker tag my-app yourusername/my-app:1.0      # Minor version
docker tag my-app yourusername/my-app:1        # Major version
docker tag my-app yourusername/my-app:latest   # Latest release

# Example: Version 1.2.3
docker push yourusername/my-app:1.2.3
docker push yourusername/my-app:1.2
docker push yourusername/my-app:1
docker push yourusername/my-app:latest
```

### Environment-Based Tags

```bash
# Environment tags
docker tag my-app yourusername/my-app:dev
docker tag my-app yourusername/my-app:staging
docker tag my-app yourusername/my-app:production

# With version and environment
docker tag my-app yourusername/my-app:1.0.0-dev
docker tag my-app yourusername/my-app:1.0.0-prod
```

### Git-Based Tags

```bash
# Use Git commit SHA
GIT_SHA=$(git rev-parse --short HEAD)
docker tag my-app yourusername/my-app:$GIT_SHA

# Use Git branch
GIT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
docker tag my-app yourusername/my-app:$GIT_BRANCH

# Use Git tag
GIT_TAG=$(git describe --tags --abbrev=0)
docker tag my-app yourusername/my-app:$GIT_TAG
```

### Date-Based Tags

```bash
# Date-based versioning
DATE=$(date +%Y%m%d)
docker tag my-app yourusername/my-app:$DATE

# With time
DATETIME=$(date +%Y%m%d-%H%M%S)
docker tag my-app yourusername/my-app:$DATETIME
```

## Complete Workflow Example

### Building and Pushing

```bash
# 1. Build your image
docker build -t my-app .

# 2. Test locally
docker run --rm my-app npm test

# 3. Tag for Docker Hub
docker tag my-app yourusername/my-app:1.0.0
docker tag my-app yourusername/my-app:latest

# 4. Login to Docker Hub
docker login

# 5. Push to Docker Hub
docker push yourusername/my-app:1.0.0
docker push yourusername/my-app:latest

# 6. Pull on production server
docker pull yourusername/my-app:1.0.0
docker run -d -p 80:3000 yourusername/my-app:1.0.0
```

## Private Docker Registry

### Running Your Own Registry

```bash
# Run a local registry
docker run -d \
  -p 5000:5000 \
  --name registry \
  --restart=always \
  -v registry-data:/var/lib/registry \
  registry:2

# Tag for private registry
docker tag my-app localhost:5000/my-app:latest

# Push to private registry
docker push localhost:5000/my-app:latest

# Pull from private registry
docker pull localhost:5000/my-app:latest
```

### Secured Private Registry

```bash
# Create authentication
mkdir -p auth
docker run --rm \
  --entrypoint htpasswd \
  httpd:2 -Bbn username password > auth/htpasswd

# Run registry with authentication
docker run -d \
  -p 5000:5000 \
  --name registry \
  --restart=always \
  -v registry-data:/var/lib/registry \
  -v $(pwd)/auth:/auth \
  -e "REGISTRY_AUTH=htpasswd" \
  -e "REGISTRY_AUTH_HTPASSWD_REALM=Registry Realm" \
  -e "REGISTRY_AUTH_HTPASSWD_PATH=/auth/htpasswd" \
  registry:2

# Login to private registry
docker login localhost:5000
```

### Registry with TLS

```bash
# Generate self-signed certificate
mkdir -p certs
openssl req -newkey rsa:4096 -nodes -sha256 \
  -keyout certs/domain.key -x509 -days 365 \
  -out certs/domain.crt

# Run registry with TLS
docker run -d \
  -p 443:5000 \
  --name registry \
  --restart=always \
  -v registry-data:/var/lib/registry \
  -v $(pwd)/certs:/certs \
  -e REGISTRY_HTTP_ADDR=0.0.0.0:5000 \
  -e REGISTRY_HTTP_TLS_CERTIFICATE=/certs/domain.crt \
  -e REGISTRY_HTTP_TLS_KEY=/certs/domain.key \
  registry:2
```

## Docker Registry API

### Query Registry

```bash
# List repositories
curl -X GET http://localhost:5000/v2/_catalog

# List tags for a repository
curl -X GET http://localhost:5000/v2/my-app/tags/list

# Get image manifest
curl -X GET http://localhost:5000/v2/my-app/manifests/latest

# Delete image (enable deletion first)
curl -X DELETE http://localhost:5000/v2/my-app/manifests/sha256:...
```

## Multi-Architecture Images

Build images for multiple platforms:

```bash
# Create builder
docker buildx create --name mybuilder --use

# Build for multiple platforms
docker buildx build \
  --platform linux/amd64,linux/arm64,linux/arm/v7 \
  -t yourusername/my-app:latest \
  --push \
  .

# Verify multi-arch image
docker buildx imagetools inspect yourusername/my-app:latest
```

### Multi-Stage Build for Size Optimization

```dockerfile
# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY package*.json ./
RUN npm ci --production
USER node
EXPOSE 3000
CMD ["node", "dist/server.js"]
```

## Cloud Registries

### AWS Elastic Container Registry (ECR)

```bash
# Login to ECR
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin \
  123456789012.dkr.ecr.us-east-1.amazonaws.com

# Tag for ECR
docker tag my-app:latest \
  123456789012.dkr.ecr.us-east-1.amazonaws.com/my-app:latest

# Push to ECR
docker push \
  123456789012.dkr.ecr.us-east-1.amazonaws.com/my-app:latest
```

### Google Container Registry (GCR)

```bash
# Configure authentication
gcloud auth configure-docker

# Tag for GCR
docker tag my-app:latest gcr.io/my-project/my-app:latest

# Push to GCR
docker push gcr.io/my-project/my-app:latest
```

### Azure Container Registry (ACR)

```bash
# Login to ACR
az acr login --name myregistry

# Tag for ACR
docker tag my-app:latest myregistry.azurecr.io/my-app:latest

# Push to ACR
docker push myregistry.azurecr.io/my-app:latest
```

## CI/CD Integration

### GitHub Actions

**.github/workflows/docker.yml:**
```yaml
name: Docker Build and Push

on:
  push:
    branches: [ main ]
    tags: [ 'v*' ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Docker meta
        id: meta
        uses: docker/metadata-action@v4
        with:
          images: yourusername/my-app
          tags: |
            type=ref,event=branch
            type=semver,pattern={{version}}
            type=semver,pattern={{major}}.{{minor}}
      
      - name: Login to Docker Hub
        uses: docker/login-action@v2
        with:
          username: ${{ secrets.DOCKERHUB_USERNAME }}
          password: ${{ secrets.DOCKERHUB_TOKEN }}
      
      - name: Build and push
        uses: docker/build-push-action@v4
        with:
          context: .
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
```

### GitLab CI

**.gitlab-ci.yml:**
```yaml
stages:
  - build
  - push

build:
  stage: build
  image: docker:latest
  services:
    - docker:dind
  script:
    - docker build -t $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA .
    - docker tag $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA $CI_REGISTRY_IMAGE:latest
  only:
    - main

push:
  stage: push
  image: docker:latest
  services:
    - docker:dind
  before_script:
    - docker login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD $CI_REGISTRY
  script:
    - docker push $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA
    - docker push $CI_REGISTRY_IMAGE:latest
  only:
    - main
```

## Registry Management

### Cleanup Old Images

```bash
# List all images
docker images

# Remove old versions
docker rmi yourusername/my-app:old-version

# Remove untagged images
docker image prune -a

# Remove images older than 30 days
docker image prune -a --filter "until=720h"
```

### Registry Storage Management

```bash
# Check registry storage
docker exec registry du -sh /var/lib/registry

# Enable garbage collection
docker exec registry bin/registry garbage-collect /etc/docker/registry/config.yml

# Run registry with deletion enabled
docker run -d \
  -p 5000:5000 \
  --name registry \
  -e REGISTRY_STORAGE_DELETE_ENABLED=true \
  -v registry-data:/var/lib/registry \
  registry:2
```

## Security Best Practices

::: tip 1. Use Official Images
```bash
# ✅ Good: Official base image
FROM node:20-alpine

# ❌ Bad: Unknown base image
FROM random-user/node:latest
```
:::

::: tip 2. Scan Images for Vulnerabilities
```bash
# Scan with Docker Scout
docker scout quickview yourusername/my-app:latest

# Scan with Trivy
trivy image yourusername/my-app:latest
```
:::

::: tip 3. Sign Images
```bash
# Enable Docker Content Trust
export DOCKER_CONTENT_TRUST=1

# Push signed image
docker push yourusername/my-app:latest
```
:::

::: tip 4. Use Private Registries for Sensitive Apps
```bash
# Don't push to public registry
# Use private Docker Hub repo or self-hosted registry
```
:::

::: tip 5. Implement Access Control
```bash
# Use authentication
# Limit who can push/pull
# Audit access logs
```
:::

## Image Size Optimization

### Reduce Image Size

```dockerfile
# ❌ Bad: Large image (900MB)
FROM node:20
WORKDIR /app
COPY . .
RUN npm install
CMD ["npm", "start"]

# ✅ Good: Optimized (120MB)
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY . .

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app .
USER node
CMD ["node", "server.js"]
```

### Layer Optimization

```dockerfile
# ❌ Bad: Many layers
RUN apt-get update
RUN apt-get install -y curl
RUN apt-get install -y git
RUN apt-get clean

# ✅ Good: Single layer
RUN apt-get update && \
    apt-get install -y curl git && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*
```

## Practical Examples

### Example 1: Automated Build Pipeline

```bash
#!/bin/bash
# build-and-push.sh

# Variables
APP_NAME="my-app"
DOCKER_USER="yourusername"
VERSION=$(git describe --tags --abbrev=0)
GIT_SHA=$(git rev-parse --short HEAD)

# Build image
echo "Building image..."
docker build -t $APP_NAME:$VERSION .

# Tag images
docker tag $APP_NAME:$VERSION $DOCKER_USER/$APP_NAME:$VERSION
docker tag $APP_NAME:$VERSION $DOCKER_USER/$APP_NAME:latest
docker tag $APP_NAME:$VERSION $DOCKER_USER/$APP_NAME:$GIT_SHA

# Login
echo "Logging in to Docker Hub..."
echo $DOCKER_PASSWORD | docker login -u $DOCKER_USER --password-stdin

# Push images
echo "Pushing images..."
docker push $DOCKER_USER/$APP_NAME:$VERSION
docker push $DOCKER_USER/$APP_NAME:latest
docker push $DOCKER_USER/$APP_NAME:$GIT_SHA

echo "Build and push complete!"
```

### Example 2: Pull and Deploy

```bash
#!/bin/bash
# deploy.sh

APP_NAME="my-app"
DOCKER_USER="yourusername"
VERSION="1.0.0"

# Pull latest image
echo "Pulling image..."
docker pull $DOCKER_USER/$APP_NAME:$VERSION

# Stop old container
echo "Stopping old container..."
docker stop $APP_NAME 2>/dev/null || true
docker rm $APP_NAME 2>/dev/null || true

# Run new container
echo "Starting new container..."
docker run -d \
  --name $APP_NAME \
  --restart unless-stopped \
  -p 80:3000 \
  -e NODE_ENV=production \
  $DOCKER_USER/$APP_NAME:$VERSION

echo "Deployment complete!"
```

## Troubleshooting

### Authentication Issues

```bash
# Clear old credentials
docker logout

# Login again
docker login

# Check credentials
cat ~/.docker/config.json
```

### Push/Pull Failures

```bash
# Check network connectivity
ping hub.docker.com

# Check image size
docker images

# Retry with verbose output
docker push --debug yourusername/my-app:latest
```

### Registry Storage Full

```bash
# Clean up images
docker image prune -a

# Garbage collect registry
docker exec registry bin/registry garbage-collect /etc/docker/registry/config.yml

# Increase storage
```

## Summary

You learned:
- ✅ What Docker registries are and their types
- ✅ Working with Docker Hub
- ✅ Image tagging strategies
- ✅ Setting up private registries
- ✅ Multi-architecture images
- ✅ CI/CD integration
- ✅ Registry management and cleanup
- ✅ Security best practices

::: tip 💡 Key Takeaway
Docker registries centralize image storage and distribution. Use semantic versioning for tags, implement CI/CD pipelines for automated builds, secure private registries, and optimize image sizes for efficient distribution!
:::

Next: [Docker in Production](./09-production.md) - Learn best practices for running Docker in production!
