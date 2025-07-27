# 🚀 WalGraph Enterprise API

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8+-blue.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![SUI](https://img.shields.io/badge/SUI-Blockchain-purple.svg)](https://sui.io/)
[![Walrus](https://img.shields.io/badge/Walrus-Storage-orange.svg)](https://walrus.xyz/)

> **Enterprise-grade decentralized graph database API** built on SUI blockchain and Walrus protocol

## 🌟 Features

- ✅ **Real SUI Blockchain Integration** - No fallback modes
- ✅ **Real Walrus Decentralized Storage** - No local storage
- ✅ **Enterprise API Key Authentication**
- ✅ **Rate Limiting & Security**
- ✅ **Graph Query Engine**
- ✅ **Analytics & Insights**
- ✅ **Swagger API Documentation**
- ✅ **Production Deployment Ready**

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm 8+
- SUI wallet with testnet tokens

### Installation

```bash
# Clone the repository
git clone https://github.com/walgraph/enterprise-api.git
cd enterprise-api

# Install dependencies
npm install

# Set up environment variables
cp env.example .env
# Edit .env with your configuration
```

### Environment Variables

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
NODE_ENV="development"
PORT="3000"
```

### Development

```bash
# Start development server
npm run dev

# The API will be available at:
# - API: http://localhost:3000
# - Documentation: http://localhost:3000/docs
# - Health Check: http://localhost:3000/health
```

### Production

```bash
# Build the application
npm run build

# Start production server
npm start
```

## 📚 API Documentation

Once running, visit:
- **API Docs:** `http://localhost:3000/docs`
- **Health Check:** `http://localhost:3000/health`

## 🔑 API Key Setup

Generate API keys for enterprise clients:

```bash
# Example API key
enterprise-client-abc123def456
```

Use in requests:
```bash
curl -H "x-api-key: enterprise-client-abc123def456" \
  http://localhost:3000/api/v1/graphs
```

## 📊 Usage Examples

### Create a Graph

```bash
curl -X POST http://localhost:3000/api/v1/graphs \
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

### Query a Graph

```bash
curl -X POST http://localhost:3000/api/v1/graphs/GRAPH_ID/query \
  -H "Content-Type: application/json" \
  -H "x-api-key: your-api-key" \
  -d '{
    "query": "MATCH (c:Company) WHERE c.industry = 'Technology' RETURN c"
  }'
```

### Get Analytics

```bash
curl http://localhost:3000/api/v1/graphs/GRAPH_ID/analytics \
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

## 🚀 Deployment

### Docker

```bash
# Build and run with Docker
docker build -t walgraph-api .
docker run -p 3000:3000 -e SUI_RECOVERY_PHRASE="your-phrase" walgraph-api
```

### Docker Compose

```bash
# Set environment variables in .env file
docker-compose up -d
```

### Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

### PM2

```bash
# Use deployment script
./deploy.sh pm2
```

For detailed deployment instructions, see [PRODUCTION-DEPLOYMENT-GUIDE.md](PRODUCTION-DEPLOYMENT-GUIDE.md).

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch
```

## 📈 Monitoring

### Health Check

```bash
curl http://localhost:3000/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2025-07-27T16:01:46.487Z",
  "version": "1.0.0",
  "environment": "development",
  "services": {
    "sui": "connected",
    "walrus": "connected",
    "database": "connected"
  }
}
```

## 🎯 Enterprise Use Cases

### CRM Systems
- Customer relationship mapping
- Sales pipeline tracking
- Account hierarchy management

### Supply Chain Management
- Supplier network analysis
- Risk assessment
- Compliance tracking

### Knowledge Management
- Document relationships
- Expert network mapping
- Information discovery

### Fraud Detection
- Transaction pattern analysis
- Entity relationship mapping
- Anomaly detection

## 🏆 Success Metrics

### Technical
- API response time < 200ms
- 99.9% uptime
- < 0.1% error rate
- SUI transaction success rate > 99%

### Business
- Number of active enterprise clients
- Total graphs created
- API usage volume
- Customer satisfaction score

## 🚨 Error Handling

The API provides clear error messages:

```json
{
  "success": false,
  "error": "SUI_RECOVERY_PHRASE environment variable is REQUIRED. No fallback mode available.",
  "code": "MISSING_ENV_VAR"
}
```

## 📋 Development

### Project Structure

```
api-server/
├── src/
│   ├── config/          # Configuration files
│   ├── middleware/      # Express middleware
│   ├── routes/          # API routes
│   │   └── enterprise/  # Enterprise API routes
│   └── services/        # Business logic services
├── bin/                 # Server entry point
├── public/              # Static files
├── dist/                # Build output (generated)
└── docs/                # Documentation
```

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm test             # Run tests
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run clean        # Clean build directory
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

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