# 🚀 WalGraph - Decentralized Graph Database Platform

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8+-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14+-black.svg)](https://nextjs.org/)
[![SUI](https://img.shields.io/badge/SUI-Blockchain-purple.svg)](https://sui.io/)
[![Walrus](https://img.shields.io/badge/Walrus-Storage-orange.svg)](https://walrus.xyz/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> **Complete decentralized graph database platform** built on SUI blockchain and Walrus protocol

## 🌟 Overview

WalGraph is a comprehensive platform that provides both **visual graph editing** and **enterprise API access** for decentralized graph databases. Built on SUI blockchain for metadata and access control, and Walrus protocol for decentralized storage.

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    WalGraph Platform                        │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐    ┌─────────────────┐                │
│  │   Frontend      │    │   Enterprise    │                │
│  │   Editor        │    │   API Server    │                │
│  │                 │    │                 │                │
│  └─────────────────┘    └─────────────────┘                │
│           │                       │                        │
│           └───────────────────────┼────────────────────────┘
│                                   │
│  ┌─────────────────────────────────┼────────────────────────┐
│  │           SUI Blockchain        │                        │
│  │  • Graph Metadata              │                        │
│  │  • Access Control              │                        │
│  │  • Smart Contracts             │                        │
│  └─────────────────────────────────┼────────────────────────┘
│                                   │
│  ┌─────────────────────────────────┼────────────────────────┐
│  │         Walrus Protocol         │                        │
│  │  • Decentralized Storage        │                        │
│  │  • Graph Data                   │                        │
│  │  • Blob Management              │                        │
│  └─────────────────────────────────┼────────────────────────┘
└─────────────────────────────────────────────────────────────┘
```

## 📦 Project Structure

```
WalGraph/
├── api-server/                    # 🚀 Enterprise API Server
│   ├── src/                       # TypeScript source code
│   ├── bin/                       # Server entry point
│   ├── README.md                  # API documentation
│   ├── Dockerfile                 # Container configuration
│   └── deploy.sh                  # Deployment script
│
├── WalGraph-frontend-app/         # 🎨 Visual Graph Editor
│   ├── src/                       # Next.js application
│   ├── public/                    # Static assets
│   ├── sources/                   # SUI smart contracts
│   └── README.md                  # Frontend documentation
│
└── WalGraph-backend/              # 🔧 Backend Services
    ├── sui_contracts/             # SUI smart contracts
    ├── walrus-verification/       # Walrus integration
    └── README.md                  # Backend documentation
```

## 🚀 Quick Start

### Prerequisites

- **Node.js 18+**
- **npm 8+**
- **SUI CLI** (for blockchain interactions)
- **SUI wallet with testnet tokens**

### 1. Frontend Editor (Visual Graph Creation)

```bash
# Navigate to frontend
cd WalGraph-frontend-app

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Start development server
npm run dev

# Open http://localhost:3000
```

### 2. Enterprise API Server

```bash
# Navigate to API server
cd api-server

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Start development server
npm run dev

# API will be available at http://localhost:3001
```

# Set up environment variables
cp env.example .env
# Edit .env with your configuration

# Start development server
npm run dev

# API available at http://localhost:3000
# Documentation at http://localhost:3000/docs
```

### 3. Backend Services

```bash
# Navigate to backend
cd WalGraph-backend

# Deploy SUI contracts
cd sui_contracts
sui move build
sui move deploy

# Set up Walrus verification
cd ../walrus-verification
# Follow README.md instructions
```

## 🔧 Environment Setup

### Frontend (.env.local)
```bash
NEXT_PUBLIC_SUI_NETWORK=testnet
NEXT_PUBLIC_WALRUS_PUBLISHER_URL=https://walrus-testnet-publisher.natsai.xyz
NEXT_PUBLIC_WALRUS_AGGREGATOR_URL=https://walrus-testnet-aggregator.natsai.xyz
```

### API Server (.env)
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
```

## 🚀 Deployment

### Quick Deploy Options

#### Frontend Editor
- **Vercel** (Recommended): `cd WalGraph-frontend-app && vercel`
- **Netlify**: `cd WalGraph-frontend-app && npx netlify deploy --prod`
- **Docker**: `cd WalGraph-frontend-app && docker build -t walgraph-frontend .`

#### Enterprise API Server
- **Vercel**: `cd api-server && vercel`
- **Railway**: `cd api-server && railway up`
- **Heroku**: `cd api-server && heroku create && git push heroku main`
- **Docker**: `cd api-server && docker build -t walgraph-api .`

### 📖 Detailed Deployment Guide

For comprehensive deployment instructions, environment configuration, and troubleshooting, see [DEPLOYMENT.md](./DEPLOYMENT.md).

## 🎯 Features

### Frontend Editor
- ✅ **Visual Graph Creation** - Drag-and-drop interface
- ✅ **Real-time Collaboration** - Multi-user editing
- ✅ **SUI Wallet Integration** - Blockchain transactions
- ✅ **Walrus Storage** - Decentralized data storage
- ✅ **Graph Visualization** - D3.js powered rendering
- ✅ **Export/Import** - Multiple format support

### Enterprise API
- ✅ **RESTful API** - Graph CRUD operations
- ✅ **Query Engine** - Cypher-like syntax
- ✅ **Analytics** - Graph insights and metrics
- ✅ **Authentication** - API key management
- ✅ **Rate Limiting** - Enterprise-grade protection
- ✅ **Real Blockchain** - No fallback modes

### Backend Services
- ✅ **SUI Smart Contracts** - Graph metadata management
- ✅ **Walrus Integration** - Decentralized storage
- ✅ **Access Control** - Permission management
- ✅ **Verification** - Data integrity checks

## 🔒 Security Features

- **100% Real Blockchain** - No fallback modes or mock data
- **API Key Authentication** - Secure enterprise access
- **Rate Limiting** - Prevent abuse
- **Input Validation** - Comprehensive validation
- **CORS Protection** - Configurable origins
- **Helmet Security** - HTTP security headers

## 🚀 Deployment

### Frontend (Vercel)
```bash
cd WalGraph-frontend-app
vercel --prod
```

### API Server (Multiple Options)
```bash
cd api-server

# Vercel
vercel --prod

# Docker
docker build -t walgraph-api .
docker run -p 3000:3000 walgraph-api

# PM2
./deploy.sh pm2
```

### Backend (SUI Network)
```bash
cd WalGraph-backend/sui_contracts
sui move deploy --network testnet
```

## 📚 Documentation

- **[Frontend Guide](WalGraph-frontend-app/README.md)** - Visual editor documentation
- **[API Documentation](api-server/README.md)** - Enterprise API guide
- **[Backend Guide](WalGraph-backend/README.md)** - Smart contracts and services
- **[Production Deployment](api-server/PRODUCTION-DEPLOYMENT-GUIDE.md)** - Deployment guide

## 🧪 Testing

### Frontend
```bash
cd WalGraph-frontend-app
npm test
```

### API Server
```bash
cd api-server
npm test
```

### Integration Tests
```bash
# Test full integration
curl -X POST http://localhost:3000/api/v1/graphs \
  -H "Content-Type: application/json" \
  -H "x-api-key: your-api-key" \
  -d '{"name": "Test Graph", "description": "Test"}'
```

## 🎯 Use Cases

### Enterprise Applications
- **CRM Systems** - Customer relationship mapping
- **Supply Chain** - Network analysis and tracking
- **Knowledge Management** - Document relationships
- **Fraud Detection** - Pattern analysis

### Research & Development
- **Data Visualization** - Complex relationship mapping
- **Network Analysis** - Social and business networks
- **Academic Research** - Graph-based studies

## 🏆 Success Metrics

### Technical
- API response time < 200ms
- 99.9% uptime
- < 0.1% error rate
- SUI transaction success rate > 99%

### Business
- Number of active users
- Total graphs created
- API usage volume
- Customer satisfaction

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

- **Documentation:** Each component has its own README
- **API Docs:** Available at `/docs` endpoint when server is running
- **Issues:** Use GitHub Issues for bug reports
- **Discussions:** Use GitHub Discussions for questions

## 🚀 Ready for Production!

WalGraph is **production-ready** with:
- ✅ **100% real SUI blockchain integration**
- ✅ **100% real Walrus decentralized storage**
- ✅ **No fallback modes or mock data**
- ✅ **Enterprise-grade security**
- ✅ **Scalable architecture**
- ✅ **Comprehensive documentation**

**Deploy with confidence!** 🎉

---

**Built with ❤️ by the WalGraph Team** 