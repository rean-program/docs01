# Docker in Production

Running Docker in production requires careful planning and implementation of best practices. In this tutorial, you'll learn how to deploy, secure, and maintain Docker containers in production environments.

## Production vs Development

```
┌─────────────────────────────────────────────────────────────┐
│        Development vs Production                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   Development              Production                       │
│   ├── Fast iteration      ├── Stability                    │
│   ├── Debug tools          ├── Performance                  │
│   ├── Live reload          ├── Security                     │
│   ├── Bind mounts          ├── Monitoring                   │
│   └── Latest tags          └── Specific versions            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Production Checklist

```
Before Production:
✅ Use specific image tags (not :latest)
✅ Run as non-root user
✅ Implement health checks
✅ Set resource limits
✅ Use restart policies
✅ Enable logging
✅ Scan for vulnerabilities
✅ Test backup/restore
✅ Document deployment
✅ Setup monitoring
```

## Security Best Practices

### 1. Don't Run as Root

**❌ Bad:**
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY . .
# Running as root (default)
CMD ["node", "server.js"]
```

**✅ Good:**
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY . .

# Create and use non-root user
RUN addgroup -g 1001 -S appuser && \
    adduser -u 1001 -S appuser -G appuser && \
    chown -R appuser:appuser /app

USER appuser
CMD ["node", "server.js"]
```

### 2. Use Minimal Base Images

```dockerfile
# ❌ Full Ubuntu: ~200MB
FROM ubuntu:22.04

# ✅ Alpine: ~5MB
FROM alpine:3.18

# ✅ Distroless: Even smaller, no shell
FROM gcr.io/distroless/nodejs20-debian11
```

### 3. Scan for Vulnerabilities

```bash
# Scan with Docker Scout
docker scout quickview my-app:latest
docker scout cves my-app:latest

# Scan with Trivy
trivy image my-app:latest

# Scan with Snyk
snyk container test my-app:latest

# Automated scanning in CI/CD
docker scan my-app:latest
```

### 4. Use Secrets Properly

**❌ Bad:**
```dockerfile
# Never hardcode secrets!
ENV API_KEY=secret123
ENV DB_PASSWORD=password
```

**✅ Good:**
```bash
# Use environment variables at runtime
docker run -e API_KEY=$API_KEY my-app

# Use Docker secrets (Swarm)
echo "secret123" | docker secret create api_key -

# Use external secret managers
# - AWS Secrets Manager
# - HashiCorp Vault
# - Azure Key Vault
```

### 5. Read-Only Filesystem

```bash
# Run with read-only root filesystem
docker run -d \
  --read-only \
  --tmpfs /tmp \
  --tmpfs /app/logs \
  my-app
```

### 6. Security Options

```bash
# Drop capabilities
docker run -d \
  --cap-drop=ALL \
  --cap-add=NET_BIND_SERVICE \
  my-app

# Run with security options
docker run -d \
  --security-opt=no-new-privileges:true \
  --security-opt=seccomp=unconfined \
  my-app

# Use AppArmor or SELinux
docker run -d \
  --security-opt="apparmor=docker-default" \
  my-app
```

## Resource Management

### CPU Limits

```bash
# Limit CPU usage
docker run -d \
  --cpus="1.5" \
  --cpu-shares=512 \
  my-app

# In docker-compose.yml
services:
  app:
    image: my-app
    deploy:
      resources:
        limits:
          cpus: '1.5'
        reservations:
          cpus: '0.5'
```

### Memory Limits

```bash
# Set memory limits
docker run -d \
  --memory="512m" \
  --memory-reservation="256m" \
  --memory-swap="1g" \
  --oom-kill-disable=false \
  my-app

# In docker-compose.yml
services:
  app:
    image: my-app
    deploy:
      resources:
        limits:
          memory: 512M
        reservations:
          memory: 256M
```

### Storage Limits

```bash
# Limit storage
docker run -d \
  --storage-opt size=10G \
  my-app

# Set I/O limits
docker run -d \
  --device-read-bps /dev/sda:1mb \
  --device-write-bps /dev/sda:1mb \
  my-app
```

## Health Checks

### Dockerfile Health Check

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY . .

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node healthcheck.js

CMD ["node", "server.js"]
```

**healthcheck.js:**
```javascript
const http = require('http');

const options = {
  host: 'localhost',
  port: 3000,
  path: '/health',
  timeout: 2000
};

const request = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  process.exit(res.statusCode === 200 ? 0 : 1);
});

request.on('error', (err) => {
  console.log('ERROR:', err);
  process.exit(1);
});

request.end();
```

### Runtime Health Check

```bash
# Add health check at runtime
docker run -d \
  --health-cmd='curl -f http://localhost:3000/health || exit 1' \
  --health-interval=30s \
  --health-timeout=3s \
  --health-retries=3 \
  --health-start-period=40s \
  my-app

# Check health status
docker ps
docker inspect --format='{{.State.Health.Status}}' my-app
```

### Docker Compose Health Check

```yaml
version: '3.8'

services:
  app:
    image: my-app
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 3s
      retries: 3
      start_period: 40s
  
  db:
    image: postgres:15
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5
```

## Logging

### Configure Logging Drivers

```bash
# JSON file (default)
docker run -d \
  --log-driver json-file \
  --log-opt max-size=10m \
  --log-opt max-file=3 \
  my-app

# Syslog
docker run -d \
  --log-driver syslog \
  --log-opt syslog-address=tcp://192.168.1.100:514 \
  my-app

# Journald
docker run -d \
  --log-driver journald \
  my-app

# Fluentd
docker run -d \
  --log-driver fluentd \
  --log-opt fluentd-address=localhost:24224 \
  my-app
```

### Centralized Logging

**docker-compose.yml with ELK stack:**
```yaml
version: '3.8'

services:
  app:
    image: my-app
    logging:
      driver: "fluentd"
      options:
        fluentd-address: localhost:24224
        tag: app.logs
  
  fluentd:
    image: fluent/fluentd
    ports:
      - "24224:24224"
    volumes:
      - ./fluentd/conf:/fluentd/etc
  
  elasticsearch:
    image: elasticsearch:8.11.0
    environment:
      - discovery.type=single-node
    volumes:
      - es-data:/usr/share/elasticsearch/data
  
  kibana:
    image: kibana:8.11.0
    ports:
      - "5601:5601"
    depends_on:
      - elasticsearch

volumes:
  es-data:
```

## Monitoring

### Prometheus and Grafana

**docker-compose.yml:**
```yaml
version: '3.8'

services:
  app:
    image: my-app
    ports:
      - "3000:3000"
  
  prometheus:
    image: prom/prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus-data:/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
  
  grafana:
    image: grafana/grafana
    ports:
      - "3001:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
    volumes:
      - grafana-data:/var/lib/grafana
    depends_on:
      - prometheus
  
  cadvisor:
    image: gcr.io/cadvisor/cadvisor
    ports:
      - "8080:8080"
    volumes:
      - /:/rootfs:ro
      - /var/run:/var/run:ro
      - /sys:/sys:ro
      - /var/lib/docker/:/var/lib/docker:ro

volumes:
  prometheus-data:
  grafana-data:
```

**prometheus.yml:**
```yaml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']
  
  - job_name: 'app'
    static_configs:
      - targets: ['app:3000']
  
  - job_name: 'cadvisor'
    static_configs:
      - targets: ['cadvisor:8080']
```

### Container Metrics

```bash
# Real-time stats
docker stats

# Export metrics
docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}"

# Monitor specific container
docker stats my-app

# JSON output
docker stats --no-stream --format json
```

## Backup and Recovery

### Backup Volumes

```bash
# Backup a volume
docker run --rm \
  -v my-volume:/data \
  -v $(pwd):/backup \
  alpine \
  tar czf /backup/backup-$(date +%Y%m%d).tar.gz -C /data .

# Backup database
docker exec postgres pg_dump -U postgres mydb > backup.sql

# Backup with timestamp
docker exec postgres pg_dump -U postgres mydb | \
  gzip > backup-$(date +%Y%m%d-%H%M%S).sql.gz
```

### Restore Volumes

```bash
# Restore a volume
docker run --rm \
  -v my-volume:/data \
  -v $(pwd):/backup \
  alpine \
  tar xzf /backup/backup.tar.gz -C /data

# Restore database
docker exec -i postgres psql -U postgres mydb < backup.sql

# Restore compressed backup
gunzip < backup.sql.gz | docker exec -i postgres psql -U postgres mydb
```

### Automated Backups

```bash
#!/bin/bash
# backup.sh

BACKUP_DIR="/backups"
DATE=$(date +%Y%m%d-%H%M%S)

# Backup database
docker exec postgres pg_dump -U postgres mydb | \
  gzip > $BACKUP_DIR/db-$DATE.sql.gz

# Backup volumes
docker run --rm \
  -v app-data:/data \
  -v $BACKUP_DIR:/backup \
  alpine \
  tar czf /backup/volumes-$DATE.tar.gz -C /data .

# Keep only last 7 days
find $BACKUP_DIR -name "*.gz" -mtime +7 -delete

echo "Backup complete: $DATE"
```

**Crontab:**
```bash
# Run backup daily at 2 AM
0 2 * * * /path/to/backup.sh >> /var/log/backup.log 2>&1
```

## Zero-Downtime Deployments

### Blue-Green Deployment

```bash
#!/bin/bash
# blue-green-deploy.sh

NEW_VERSION="1.1.0"
OLD_CONTAINER="app-blue"
NEW_CONTAINER="app-green"

# Start new version
docker run -d \
  --name $NEW_CONTAINER \
  -p 3001:3000 \
  my-app:$NEW_VERSION

# Wait for health check
sleep 10

# Health check
if curl -f http://localhost:3001/health; then
  # Switch traffic (update load balancer)
  # ...
  
  # Stop old container
  docker stop $OLD_CONTAINER
  docker rm $OLD_CONTAINER
  
  echo "Deployment successful!"
else
  # Rollback
  docker stop $NEW_CONTAINER
  docker rm $NEW_CONTAINER
  echo "Deployment failed, rolled back"
  exit 1
fi
```

### Rolling Updates

```bash
# Scale up with new version
docker service update --image my-app:1.1.0 my-app-service

# Or with docker-compose
docker-compose up -d --no-deps --build app
```

## Production Docker Compose

```yaml
version: '3.8'

services:
  app:
    image: my-app:${VERSION:-latest}
    restart: unless-stopped
    deploy:
      replicas: 3
      resources:
        limits:
          cpus: '1'
          memory: 512M
        reservations:
          cpus: '0.5'
          memory: 256M
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 3s
      retries: 3
      start_period: 40s
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
    networks:
      - app-network
  
  nginx:
    image: nginx:alpine
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/ssl:ro
    depends_on:
      - app
    networks:
      - app-network
  
  db:
    image: postgres:15-alpine
    restart: unless-stopped
    environment:
      - POSTGRES_PASSWORD=${DB_PASSWORD}
    volumes:
      - db-data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - app-network

volumes:
  db-data:

networks:
  app-network:
    driver: bridge
```

## Disaster Recovery

### Recovery Plan

```
Disaster Recovery Checklist:
1. ✅ Regular backups (daily)
2. ✅ Test restores (weekly)
3. ✅ Off-site backup storage
4. ✅ Documented procedures
5. ✅ Contact information
6. ✅ Rollback procedures
7. ✅ Recovery time objective (RTO)
8. ✅ Recovery point objective (RPO)
```

### Quick Recovery Script

```bash
#!/bin/bash
# recover.sh

echo "Starting disaster recovery..."

# Stop all containers
docker-compose down

# Restore latest backup
LATEST_BACKUP=$(ls -t /backups/db-*.sql.gz | head -1)
gunzip < $LATEST_BACKUP | docker exec -i postgres psql -U postgres mydb

# Restore volumes
LATEST_VOLUME=$(ls -t /backups/volumes-*.tar.gz | head -1)
docker run --rm \
  -v app-data:/data \
  -v /backups:/backup \
  alpine \
  tar xzf /backup/$(basename $LATEST_VOLUME) -C /data

# Start services
docker-compose up -d

# Verify
sleep 10
curl -f http://localhost/health && echo "Recovery successful!" || echo "Recovery failed!"
```

## Performance Optimization

### Image Optimization

```dockerfile
# Multi-stage build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Minimal production image
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./
USER node
CMD ["node", "dist/server.js"]
```

### Build Cache

```bash
# Use BuildKit for better caching
DOCKER_BUILDKIT=1 docker build -t my-app .

# Cache from registry
docker build \
  --cache-from my-app:latest \
  -t my-app:1.1.0 \
  .
```

### Runtime Performance

```bash
# Use host network for performance
docker run --network host my-app

# Allocate more resources
docker run \
  --cpus="2" \
  --memory="2g" \
  my-app

# Use tmpfs for temporary data
docker run \
  --tmpfs /tmp:rw,noexec,nosuid,size=100m \
  my-app
```

## Best Practices Summary

::: tip 1. Security First
- Run as non-root
- Scan images regularly
- Use secrets properly
- Keep images updated
:::

::: tip 2. Resource Management
- Set CPU and memory limits
- Monitor resource usage
- Plan for scaling
:::

::: tip 3. Reliability
- Implement health checks
- Use restart policies
- Test failure scenarios
:::

::: tip 4. Observability
- Centralized logging
- Metrics collection
- Alerting system
:::

::: tip 5. Automation
- CI/CD pipelines
- Automated backups
- Infrastructure as code
:::

## Summary

You learned:
- ✅ Production vs development differences
- ✅ Security best practices
- ✅ Resource management
- ✅ Health checks and monitoring
- ✅ Logging strategies
- ✅ Backup and recovery
- ✅ Zero-downtime deployments
- ✅ Performance optimization

::: tip 💡 Key Takeaway
Production Docker requires security, reliability, and observability. Use specific versions, implement health checks, set resource limits, maintain backups, and monitor everything!
:::

Next: [Docker Orchestration](./10-orchestration.md) - Learn to manage container clusters at scale!
