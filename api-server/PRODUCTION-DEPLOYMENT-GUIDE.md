# 🚀 WalGraph Enterprise API - Production Deployment Guide

## Overview
The WalGraph Enterprise API is now production-ready with **100% real SUI blockchain and Walrus decentralized storage integration**. This guide covers deployment to various cloud platforms and production configurations.

## ✅ Pre-Deployment Checklist

### **1. Environment Variables**
Ensure these are set in your production environment:

```bash
# Required for SUI Blockchain Integration
SUI_RECOVERY_PHRASE="your 24-word recovery phrase here"

# Required for Walrus Integration
WALRUS_PUBLISHER_URL="https://walrus-testnet-publisher.natsai.xyz"
WALRUS_AGGREGATOR_URL="https://walrus-testnet-aggregator.natsai.xyz"

# SUI Contract Addresses (Production)
SUI_PACKAGE_ID="0xe21c81834611d67b92751acb642d8b6587ce5da730cebace0d5f874015b92afa"
SUI_REGISTRY_ID="0xc09065c827a619ee2a3206017ddcd748ec89e4ac1520dbef57c2ef27e711d9fc"

# API Configuration
NODE_ENV="production"
PORT="3000"
API_KEY_SECRET="your-secure-api-key-secret"

# Rate Limiting
RATE_LIMIT_WINDOW_MS="900000"  # 15 minutes
RATE_LIMIT_MAX_REQUESTS="100"  # 100 requests per window

# Security
JWT_SECRET="your-secure-jwt-secret"
CORS_ORIGIN="https://yourdomain.com"
```

### **2. SUI Wallet Setup**
1. **Generate a production SUI wallet:**
   ```bash
   sui client new-address ed25519
   ```

2. **Fund the wallet with SUI tokens:**
   - For testnet: Use SUI faucet
   - For mainnet: Purchase SUI tokens

3. **Set the recovery phrase as environment variable:**
   ```bash
   export SUI_RECOVERY_PHRASE="your 24-word recovery phrase"
   ```

### **3. API Key Management**
Generate secure API keys for enterprise clients:
```bash
# Example API key generation
echo "enterprise-client-$(openssl rand -hex 16)" | base64
```

## 🏗️ Deployment Options

### **Option 1: Vercel (Recommended)**

#### **1. Install Vercel CLI**
```bash
npm install -g vercel
```

#### **2. Configure Vercel**
Create `vercel.json` in the `api-server` directory:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "src/app.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "src/app.ts"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

#### **3. Deploy**
```bash
cd api-server
vercel --prod
```

#### **4. Set Environment Variables**
```bash
vercel env add SUI_RECOVERY_PHRASE
vercel env add API_KEY_SECRET
vercel env add JWT_SECRET
# ... add all other environment variables
```

### **Option 2: Railway**

#### **1. Install Railway CLI**
```bash
npm install -g @railway/cli
```

#### **2. Deploy**
```bash
cd api-server
railway login
railway init
railway up
```

#### **3. Set Environment Variables**
```bash
railway variables set SUI_RECOVERY_PHRASE="your-recovery-phrase"
railway variables set API_KEY_SECRET="your-secret"
# ... add all other variables
```

### **Option 3: DigitalOcean App Platform**

#### **1. Create app.yaml**
```yaml
name: walgraph-enterprise-api
services:
  - name: api
    source_dir: /api-server
    github:
      repo: your-username/walgraph
      branch: main
    run_command: npm start
    environment_slug: node-js
    instance_count: 1
    instance_size_slug: basic-xxs
    envs:
      - key: NODE_ENV
        value: production
      - key: SUI_RECOVERY_PHRASE
        value: ${SUI_RECOVERY_PHRASE}
      - key: API_KEY_SECRET
        value: ${API_KEY_SECRET}
```

#### **2. Deploy**
```bash
doctl apps create --spec app.yaml
```

### **Option 4: AWS Elastic Beanstalk**

#### **1. Create Procfile**
```bash
# Procfile
web: npm start
```

#### **2. Create .ebextensions/environment.config**
```yaml
option_settings:
  aws:elasticbeanstalk:application:environment:
    NODE_ENV: production
    SUI_RECOVERY_PHRASE: your-recovery-phrase
    API_KEY_SECRET: your-secret
    JWT_SECRET: your-jwt-secret
```

#### **3. Deploy**
```bash
eb init
eb create production
eb deploy
```

### **Option 5: Docker Deployment**

#### **1. Create Dockerfile**
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
```

#### **2. Create docker-compose.yml**
```yaml
version: '3.8'
services:
  walgraph-api:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - SUI_RECOVERY_PHRASE=${SUI_RECOVERY_PHRASE}
      - API_KEY_SECRET=${API_KEY_SECRET}
      - JWT_SECRET=${JWT_SECRET}
    restart: unless-stopped
```

#### **3. Deploy**
```bash
docker-compose up -d
```

## 🔧 Production Configuration

### **1. PM2 Process Manager**
```bash
# Install PM2
npm install -g pm2

# Create ecosystem.config.js
module.exports = {
  apps: [{
    name: 'walgraph-enterprise-api',
    script: 'dist/app.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
};

# Start with PM2
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup
```

### **2. Nginx Reverse Proxy**
```nginx
server {
    listen 80;
    server_name api.walgraph.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### **3. SSL Certificate (Let's Encrypt)**
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d api.walgraph.com
```

## 📊 Monitoring & Logging

### **1. Application Monitoring**
```bash
# Install monitoring tools
npm install -g clinic
npm install -g 0x

# Monitor performance
clinic doctor -- node dist/app.js
```

### **2. Log Management**
```bash
# Install Winston for logging
npm install winston

# Configure logging in src/config/logger.ts
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

export default logger;
```

### **3. Health Checks**
```bash
# Add health check endpoint
curl https://api.walgraph.com/health

# Expected response:
{
  "status": "ok",
  "timestamp": "2025-07-27T16:01:46.487Z",
  "version": "1.0.0",
  "environment": "production",
  "services": {
    "sui": "connected",
    "walrus": "connected",
    "database": "connected"
  }
}
```

## 🔒 Security Hardening

### **1. API Key Security**
```typescript
// Implement API key rotation
const API_KEY_ROTATION_DAYS = 90;

// Implement rate limiting per API key
const rateLimitConfig = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP'
};
```

### **2. CORS Configuration**
```typescript
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'https://walgraph.com',
  credentials: true,
  optionsSuccessStatus: 200
};
```

### **3. Input Validation**
```typescript
// Enhanced validation schemas
const createGraphSchema = z.object({
  name: z.string().min(1).max(255).regex(/^[a-zA-Z0-9\s\-_]+$/),
  description: z.string().min(1).max(1000),
  // ... other validations
});
```

## 📈 Scaling Considerations

### **1. Horizontal Scaling**
- Use load balancers for multiple instances
- Implement Redis for session storage
- Use database clustering for high availability

### **2. Caching Strategy**
```typescript
// Implement Redis caching
import Redis from 'ioredis';

const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD
});

// Cache frequently accessed graphs
const cacheGraph = async (graphId: string, data: any) => {
  await redis.setex(`graph:${graphId}`, 3600, JSON.stringify(data));
};
```

### **3. Database Optimization**
- Implement connection pooling
- Use read replicas for analytics queries
- Implement query optimization

## 🚀 Go-Live Checklist

### **Pre-Launch**
- [ ] All environment variables configured
- [ ] SUI wallet funded with sufficient tokens
- [ ] SSL certificates installed
- [ ] Domain DNS configured
- [ ] Monitoring tools set up
- [ ] Backup strategy implemented
- [ ] Security audit completed

### **Launch Day**
- [ ] Deploy to production environment
- [ ] Run smoke tests
- [ ] Verify SUI blockchain connectivity
- [ ] Verify Walrus storage connectivity
- [ ] Test all API endpoints
- [ ] Monitor error rates
- [ ] Check performance metrics

### **Post-Launch**
- [ ] Monitor API usage
- [ ] Track SUI transaction costs
- [ ] Monitor Walrus storage usage
- [ ] Collect user feedback
- [ ] Plan scaling strategy

## 📞 Support & Maintenance

### **1. Error Monitoring**
```bash
# Set up error tracking
npm install @sentry/node

# Configure Sentry
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV
});
```

### **2. Backup Strategy**
- Regular database backups
- SUI wallet backup (recovery phrase)
- Configuration backups
- Log file rotation

### **3. Update Strategy**
- Automated dependency updates
- Security patch management
- Feature release planning
- Rollback procedures

## 🎯 Production URLs

### **API Endpoints**
- **Base URL:** `https://api.walgraph.com`
- **Health Check:** `https://api.walgraph.com/health`
- **Documentation:** `https://api.walgraph.com/docs`
- **Graph Operations:** `https://api.walgraph.com/api/v1/graphs`

### **Monitoring**
- **Status Page:** `https://status.walgraph.com`
- **Metrics Dashboard:** `https://metrics.walgraph.com`
- **Logs:** `https://logs.walgraph.com`

## 🏆 Success Metrics

### **Technical Metrics**
- API response time < 200ms
- 99.9% uptime
- < 0.1% error rate
- SUI transaction success rate > 99%

### **Business Metrics**
- Number of active enterprise clients
- Total graphs created
- API usage volume
- Customer satisfaction score

---

## 🚀 Ready for Production!

The WalGraph Enterprise API is now **production-ready** with:
- ✅ **100% real SUI blockchain integration**
- ✅ **100% real Walrus decentralized storage**
- ✅ **No fallback modes or mock data**
- ✅ **Enterprise-grade security**
- ✅ **Scalable architecture**
- ✅ **Comprehensive monitoring**

**Deploy with confidence!** 🎉 