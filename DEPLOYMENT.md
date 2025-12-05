# 🚀 TaxiFlow - Production Deployment Guide

## 📋 Pre-Deployment Checklist

- [ ] PostgreSQL database provisioned
- [ ] Environment variables configured
- [ ] SSL certificates ready (for HTTPS)
- [ ] Domain name configured
- [ ] Backup strategy in place
- [ ] Monitoring tools setup
- [ ] CI/CD pipeline tested

## 🌐 Deployment Options

### Option 1: Docker Compose (Recommended for VPS)

**Best for:** VPS (DigitalOcean, Linode, AWS EC2)

#### 1. Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo apt install docker-compose -y

# Create app user
sudo useradd -m -s /bin/bash taxiflow
sudo usermod -aG docker taxiflow
```

#### 2. Deploy Application

```bash
# Switch to app user
sudo su - taxiflow

# Clone repository
git clone https://github.com/YOUR_USERNAME/taxi_app.git
cd taxi_app

# Create production environment file
cat > .env.production << EOF
# Database
POSTGRES_DB=taxiflow_prod
POSTGRES_USER=taxiflow
POSTGRES_PASSWORD=$(openssl rand -base64 32)

# Backend
NODE_ENV=production
JWT_SECRET=$(openssl rand -base64 64)
PORT=3000

# Frontend
VITE_API_URL=https://api.yourdomain.com
EOF

# Start services
docker-compose up -d

# Check logs
docker-compose logs -f
```

#### 3. Setup Nginx Reverse Proxy

```bash
# Install Nginx
sudo apt install nginx -y

# Create Nginx configuration
sudo nano /etc/nginx/sites-available/taxiflow
```

```nginx
# Backend API
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# Frontend
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:5173;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/taxiflow /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### 4. Setup SSL with Let's Encrypt

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get certificates
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com -d api.yourdomain.com

# Auto-renewal
sudo certbot renew --dry-run
```

### Option 2: Heroku

#### Backend Deployment

```bash
# Install Heroku CLI
curl https://cli-assets.heroku.com/install.sh | sh

# Login
heroku login

# Create app
heroku create taxiflow-backend

# Add PostgreSQL
heroku addons:create heroku-postgresql:mini

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=$(openssl rand -base64 64)
heroku config:set PORT=3000

# Deploy
git subtree push --prefix backend heroku main

# Run migrations
heroku run npm run db:migrate

# View logs
heroku logs --tail
```

#### Frontend Deployment

```bash
# Create frontend app
heroku create taxiflow-frontend

# Set build pack
heroku buildpacks:set heroku/nodejs

# Set environment
heroku config:set VITE_API_URL=https://taxiflow-backend.herokuapp.com

# Deploy
git subtree push --prefix frontend heroku main
```

### Option 3: AWS (Elastic Beanstalk)

#### Backend on Elastic Beanstalk

```bash
# Install EB CLI
pip install awsebcli

# Initialize
cd backend
eb init -p node.js taxiflow-backend

# Create environment
eb create taxiflow-backend-prod

# Set environment variables
eb setenv NODE_ENV=production
eb setenv JWT_SECRET=your-secret-here
eb setenv DB_HOST=your-rds-endpoint

# Deploy
eb deploy

# View logs
eb logs
```

#### Frontend on S3 + CloudFront

```bash
# Build frontend
cd frontend
npm run build

# Upload to S3
aws s3 sync dist/ s3://taxiflow-frontend --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
```

### Option 4: Kubernetes

```yaml
# backend-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: taxiflow-backend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: backend
  template:
    metadata:
      labels:
        app: backend
    spec:
      containers:
      - name: backend
        image: your-registry/taxiflow-backend:latest
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "production"
        - name: JWT_SECRET
          valueFrom:
            secretKeyRef:
              name: taxiflow-secrets
              key: jwt-secret
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: taxiflow-secrets
              key: database-url
---
apiVersion: v1
kind: Service
metadata:
  name: backend-service
spec:
  selector:
    app: backend
  ports:
  - port: 80
    targetPort: 3000
  type: LoadBalancer
```

```bash
# Apply configuration
kubectl apply -f backend-deployment.yaml
kubectl apply -f frontend-deployment.yaml

# Check status
kubectl get pods
kubectl get services
```

## 🗄️ Database Setup

### PostgreSQL on AWS RDS

```bash
# Create RDS instance
aws rds create-db-instance \
  --db-instance-identifier taxiflow-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --master-username taxiflow \
  --master-user-password YOUR_PASSWORD \
  --allocated-storage 20

# Get endpoint
aws rds describe-db-instances \
  --db-instance-identifier taxiflow-db \
  --query 'DBInstances[0].Endpoint.Address'
```

### Managed PostgreSQL (DigitalOcean)

1. Create database cluster in DO dashboard
2. Download CA certificate
3. Configure connection string:
```
postgres://user:password@host:25060/database?sslmode=require
```

## 🔐 Security Hardening

### 1. Environment Variables

```bash
# Generate secure secrets
JWT_SECRET=$(openssl rand -base64 64)
DB_PASSWORD=$(openssl rand -base64 32)

# Never commit .env files
echo ".env*" >> .gitignore
```

### 2. Firewall Rules

```bash
# UFW (Ubuntu)
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

### 3. Database Security

```sql
-- Create restricted user
CREATE USER taxiflow WITH PASSWORD 'secure_password';
GRANT CONNECT ON DATABASE taxiflow_prod TO taxiflow;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO taxiflow;

-- Disable remote root access
ALTER USER postgres WITH PASSWORD 'new_secure_password';
```

### 4. Rate Limiting

```javascript
// backend/src/index.js
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP'
});

app.use('/api/', limiter);
```

### 5. Helmet.js (Security Headers)

```javascript
import helmet from 'helmet';
app.use(helmet());
```

## 📊 Monitoring & Logging

### PM2 Process Manager

```bash
# Install PM2
npm install -g pm2

# Start backend
cd backend
pm2 start src/index.js --name taxiflow-backend

# Monitor
pm2 monit

# Logs
pm2 logs taxiflow-backend

# Restart on reboot
pm2 startup
pm2 save
```

### Log Aggregation (Papertrail)

```bash
# Install remote_syslog2
wget https://github.com/papertrail/remote_syslog2/releases/download/v0.20/remote_syslog_linux_amd64.tar.gz
tar xzf remote_syslog_linux_amd64.tar.gz

# Configure
cat > /etc/log_files.yml << EOF
files:
  - /var/log/nginx/*.log
  - /home/taxiflow/taxi_app/backend/logs/*.log
destination:
  host: logs.papertrailapp.com
  port: YOUR_PORT
  protocol: tls
EOF

# Start
sudo remote_syslog
```

### Application Monitoring (New Relic)

```bash
# Install agent
npm install newrelic

# Create newrelic.js
cat > backend/newrelic.js << EOF
exports.config = {
  app_name: ['TaxiFlow Backend'],
  license_key: 'YOUR_LICENSE_KEY',
  logging: {
    level: 'info'
  }
}
EOF

# Require in index.js
// require('newrelic'); // Add at top
```

### Health Check Endpoint Monitoring

```bash
# Setup uptime monitoring with UptimeRobot
curl -X POST https://api.uptimerobot.com/v2/newMonitor \
  -H "Content-Type: application/json" \
  -d '{
    "api_key": "YOUR_API_KEY",
    "friendly_name": "TaxiFlow Backend",
    "url": "https://api.yourdomain.com/health",
    "type": 1,
    "interval": 300
  }'
```

## 🔄 CI/CD Pipeline (GitHub Actions + Production)

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            cd /home/taxiflow/taxi_app
            git pull origin main
            docker-compose down
            docker-compose up -d --build
            docker-compose exec backend npm run db:migrate
```

## 💾 Backup Strategy

### Automated PostgreSQL Backups

```bash
#!/bin/bash
# /home/taxiflow/backup.sh

BACKUP_DIR="/home/taxiflow/backups"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/taxiflow_$DATE.sql"

# Create backup
docker-compose exec -T db pg_dump -U postgres taxiflow > $BACKUP_FILE

# Compress
gzip $BACKUP_FILE

# Upload to S3 (optional)
aws s3 cp ${BACKUP_FILE}.gz s3://your-backup-bucket/

# Delete old backups (keep 30 days)
find $BACKUP_DIR -name "*.sql.gz" -mtime +30 -delete

# Add to crontab
# 0 2 * * * /home/taxiflow/backup.sh
```

### Database Restore

```bash
# From local file
gunzip taxiflow_20241205.sql.gz
docker-compose exec -T db psql -U postgres taxiflow < taxiflow_20241205.sql

# From S3
aws s3 cp s3://your-backup-bucket/taxiflow_20241205.sql.gz .
gunzip taxiflow_20241205.sql.gz
docker-compose exec -T db psql -U postgres taxiflow < taxiflow_20241205.sql
```

## 🔍 Troubleshooting Production Issues

### Check Service Status

```bash
# Docker services
docker-compose ps
docker-compose logs backend
docker-compose logs frontend

# Nginx
sudo systemctl status nginx
sudo nginx -t

# Database
docker-compose exec db psql -U postgres -d taxiflow -c "\dt"
```

### Common Issues

**Issue: 502 Bad Gateway**
```bash
# Check if backend is running
curl http://localhost:3000/health

# Check Nginx logs
sudo tail -f /var/log/nginx/error.log

# Restart backend
docker-compose restart backend
```

**Issue: Database connection failed**
```bash
# Check DB status
docker-compose exec db pg_isready -U postgres

# Check connection from backend
docker-compose exec backend psql -h db -U postgres -d taxiflow

# Restart database
docker-compose restart db
```

**Issue: Out of memory**
```bash
# Check memory usage
free -h
docker stats

# Limit container memory in docker-compose.yml
services:
  backend:
    mem_limit: 512m
```

## 📈 Performance Optimization

### Nginx Caching

```nginx
# Add to server block
location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### Database Connection Pooling

```javascript
// Adjust pool size based on traffic
const pool = new Pool({
  max: 50,  // Increase for high traffic
  min: 10,  // Minimum connections
  idle: 10000
});
```

### CDN Integration (Cloudflare)

1. Add domain to Cloudflare
2. Enable caching for static assets
3. Enable DDoS protection
4. Setup page rules for API

## 🎯 Post-Deployment Checklist

- [ ] All services running
- [ ] SSL certificates valid
- [ ] Database migrations applied
- [ ] Health checks passing
- [ ] Monitoring alerts configured
- [ ] Backups scheduled
- [ ] DNS configured correctly
- [ ] Load testing completed
- [ ] Error tracking configured
- [ ] Documentation updated

## 📞 Emergency Contacts

- **Hosting Provider:** support@provider.com
- **Database Admin:** dba@company.com
- **DevOps Team:** devops@company.com

---

**Deployment successful! 🚀 Monitor your application closely in the first 24 hours.**
