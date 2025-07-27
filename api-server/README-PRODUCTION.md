# 🚀 WalGraph Enterprise API - Production Ready

## Overview
The WalGraph Enterprise API is a **production-ready, decentralized graph database as a service** built on SUI blockchain and Walrus protocol. It provides enterprise-grade APIs for creating, querying, and analyzing graph data with **100% real blockchain integration**.

## ✨ Features

- ✅ **Real SUI Blockchain Integration** - No fallback modes
- ✅ **Real Walrus Decentralized Storage** - No local storage
- ✅ **Enterprise API Key Authentication**
- ✅ **Rate Limiting & Security**
- ✅ **Graph Query Engine**
- ✅ **Analytics & Insights**
- ✅ **Swagger API Documentation**
- ✅ **Production Deployment Ready**

## 🚀 Quick Deploy

### **Option 1: Vercel (Recommended)**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd api-server
vercel --prod

# Set environment variables
vercel env add SUI_RECOVERY_PHRASE
vercel env add API_KEY_SECRET
vercel env add JWT_SECRET
```

### **Option 2: Docker**
```bash
# Build and run
cd api-server
docker build -t walgraph-api .
docker run -p 3000:3000 -e SUI_RECOVERY_PHRASE="your-phrase" walgraph-api
```

### **Option 3: Docker Compose**
```bash
# Set environment variables in .env file
cd api-server
docker-compose up -d
```

### **Option 4: PM2**
```bash
# Use deployment script
cd api-server
./deploy.sh pm2
```

## 🔧 Environment Variables

Create a `.env` file with these required variables:

```bash
# SUI Blockchain (REQUIRED)
SUI_RECOVERY_PHRASE="your 24-word recovery phrase"

# API Security (REQUIRED)
API_KEY_SECRET="your-secure-api-key-secret"
JWT_SECRET="your-secure-jwt-secret"

# Walrus Storage (REQUIRED)
WALRUS_PUBLISHER_URL="https://walrus-testnet-publisher.natsai.xyz"
WALRUS_AGGREGATOR_URL="https://walrus-testnet-aggregator.natsai.xyz"

# SUI Contracts (REQUIRED)
SUI_PACKAGE_ID="0xe21c81834611d67b92751acb642d8b6587ce5da730cebace0d5f874015b92afa"
SUI_REGISTRY_ID="0xc09065c827a619ee2a3206017ddcd748ec89e4ac1520dbef57c2ef27e711d9fc"

# API Configuration
NODE_ENV="production"
PORT="3000"
```

## 📚 API Documentation

Once deployed, visit:
- **API Docs:** `https://your-domain.com/docs`
- **Health Check:** `https://your-domain.com/health`

## 🔑 API Key Setup

Generate API keys for enterprise clients:

```bash
# Example API key
enterprise-client-abc123def456
```

Use in requests:
```bash
curl -H "x-api-key: enterprise-client-abc123def456" \
  https://your-domain.com/api/v1/graphs
```

## 📊 Usage Examples

### **Create a Graph**
```bash
curl -X POST https://your-domain.com/api/v1/graphs \
  -H "Content-Type: application/json" \
  -H "x-api-key: your-api-key" \
  -d '{
    "name": "Enterprise Network",
    "description": "Company relationship network",
    "nodes": [
      {
        "id": "company-1",
        "type": "Company",
        "properties": {"name": "Tech Corp", "industry": "Technology"}
      }
    ],
    "relationships": []
  }'
```

### **Query a Graph**
```bash
curl -X POST https://your-domain.com/api/v1/graphs/GRAPH_ID/query \
  -H "Content-Type: application/json" \
  -H "x-api-key: your-api-key" \
  -d '{
    "query": "MATCH (c:Company) WHERE c.industry = 'Technology' RETURN c"
  }'
```

### **Get Analytics**
```bash
curl https://your-domain.com/api/v1/graphs/GRAPH_ID/analytics \
  -H "x-api-key: your-api-key"
```

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Enterprise    │    │   WalGraph      │    │   SUI           │
│   Application   │───▶│   API Server    │───▶│   Blockchain    │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │   Walrus        │
                       │   Storage       │
                       │                 │
                       └─────────────────┘
```

## 🔒 Security Features

- **API Key Authentication** - Secure enterprise access
- **Rate Limiting** - Prevent abuse
- **Input Validation** - Zod schema validation
- **CORS Protection** - Configurable origins
- **Helmet Security** - HTTP security headers
- **No Fallback Modes** - 100% real blockchain

## 📈 Monitoring

### **Health Check**
```bash
curl https://your-domain.com/health
```

Expected response:
```json
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

### **Metrics**
- API response times
- SUI transaction success rates
- Walrus storage usage
- Error rates and types

## 🚨 Error Handling

The API provides clear error messages:

```json
{
  "success": false,
  "error": "SUI_RECOVERY_PHRASE environment variable is REQUIRED. No fallback mode available.",
  "code": "MISSING_ENV_VAR"
}
```

## 🔄 Deployment Scripts

Use the included deployment script:

```bash
# Local deployment
./deploy.sh local

# Vercel deployment
./deploy.sh vercel

# Docker deployment
./deploy.sh docker

# PM2 deployment
./deploy.sh pm2
```

## 📋 Production Checklist

- [ ] Environment variables configured
- [ ] SUI wallet funded with tokens
- [ ] SSL certificates installed
- [ ] Domain DNS configured
- [ ] Monitoring tools set up
- [ ] Backup strategy implemented
- [ ] Security audit completed

## 🎯 Enterprise Use Cases

### **CRM Systems**
- Customer relationship mapping
- Sales pipeline tracking
- Account hierarchy management

### **Supply Chain Management**
- Supplier network analysis
- Risk assessment
- Compliance tracking

### **Knowledge Management**
- Document relationships
- Expert network mapping
- Information discovery

### **Fraud Detection**
- Transaction pattern analysis
- Entity relationship mapping
- Anomaly detection

## 🏆 Success Metrics

### **Technical**
- API response time < 200ms
- 99.9% uptime
- < 0.1% error rate
- SUI transaction success rate > 99%

### **Business**
- Number of active enterprise clients
- Total graphs created
- API usage volume
- Customer satisfaction score

## 📞 Support

- **Documentation:** `/docs` endpoint
- **Health Check:** `/health` endpoint
- **Error Logs:** Check application logs
- **SUI Explorer:** Verify blockchain transactions
- **Walrus Explorer:** Verify data storage

## 🚀 Ready for Production!

The WalGraph Enterprise API is **production-ready** with:
- ✅ **100% real SUI blockchain integration**
- ✅ **100% real Walrus decentralized storage**
- ✅ **No fallback modes or mock data**
- ✅ **Enterprise-grade security**
- ✅ **Scalable architecture**
- ✅ **Comprehensive monitoring**

**Deploy with confidence!** 🎉

---

**Built with ❤️ by the WalGraph Team** 