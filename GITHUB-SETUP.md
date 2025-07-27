# 🚀 WalGraph GitHub Repository Setup

This guide helps you set up the WalGraph repository on GitHub and deploy both the frontend and API server.

## 📋 Repository Structure

```
WalGraph/
├── 📁 WalGraph-frontend-app/     # 🎨 Visual Graph Editor (Next.js)
├── 📁 api-server/                # 🚀 Enterprise API Server (Express)
├── 📁 WalGraph-backend/          # 🔧 SUI Contracts & Walrus Integration
├── 📄 README.md                  # Main project documentation
├── 📄 DEPLOYMENT.md              # Comprehensive deployment guide
├── 📄 quick-start.sh             # Quick setup script
├── 📄 docker-compose.yml         # Local development with Docker
├── 📄 .github/workflows/         # GitHub Actions for CI/CD
└── 📄 GITHUB-SETUP.md            # This file
```

## 🚀 Quick Start

### 1. Clone and Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/WalGraph.git
cd WalGraph

# Run the quick start script
./quick-start.sh

# Or run specific commands:
./quick-start.sh setup    # Setup environment and install dependencies
./quick-start.sh dev      # Start development servers
./quick-start.sh deploy   # Deploy to Vercel
./quick-start.sh docker   # Deploy with Docker
```

### 2. Manual Setup

```bash
# Frontend Setup
cd WalGraph-frontend-app
npm install
cp .env.example .env.local  # Edit with your values
npm run dev

# API Server Setup
cd ../api-server
npm install
cp env.example .env         # Edit with your values
npm run dev
```

## 🌐 Deployment Options

### Frontend Editor
- **Vercel** (Recommended): `cd WalGraph-frontend-app && vercel`
- **Netlify**: `cd WalGraph-frontend-app && npx netlify deploy --prod`
- **Docker**: `cd WalGraph-frontend-app && docker build -t walgraph-frontend .`

### Enterprise API Server
- **Vercel**: `cd api-server && vercel`
- **Railway**: `cd api-server && railway up`
- **Heroku**: `cd api-server && heroku create && git push heroku main`
- **Docker**: `cd api-server && docker build -t walgraph-api .`

## 🔧 Environment Configuration

### Frontend (.env.local)
```bash
NEXT_PUBLIC_SUI_NETWORK=testnet
NEXT_PUBLIC_PACKAGE_ID=0xe21c81834611d67b92751acb642d8b6587ce5da730cebace0d5f874015b92afa
NEXT_PUBLIC_REGISTRY_ID=0xc09065c827a619ee2a3206017ddcd748ec89e4ac1520dbef57c2ef27e711d9fc
NEXT_PUBLIC_WALRUS_AGGREGATOR_URL=https://walrus-testnet-aggregator.natsai.xyz
NEXT_PUBLIC_WALRUS_PUBLISHER_URL=https://walrus-testnet-publisher.natsai.xyz
```

### API Server (.env)
```bash
# SUI Blockchain (REQUIRED)
SUI_RECOVERY_PHRASE="your 24-word recovery phrase"
SUI_PACKAGE_ID="0xe21c81834611d67b92751acb642d8b6587ce5da730cebace0d5f874015b92afa"
SUI_REGISTRY_ID="0xc09065c827a619ee2a3206017ddcd748ec89e4ac1520dbef57c2ef27e711d9fc"

# API Security (REQUIRED)
API_KEY_SECRET="your-secure-api-key-secret"
JWT_SECRET="your-secure-jwt-secret"

# Walrus Storage (REQUIRED)
WALRUS_PUBLISHER_URL="https://walrus-testnet-publisher.natsai.xyz"
WALRUS_AGGREGATOR_URL="https://walrus-testnet-aggregator.natsai.xyz"
```

## 🔑 GitHub Secrets Setup

For automated deployment with GitHub Actions, set up these secrets:

### Vercel Deployment
- `VERCEL_TOKEN`: Your Vercel API token
- `VERCEL_ORG_ID`: Your Vercel organization ID
- `VERCEL_FRONTEND_PROJECT_ID`: Frontend project ID
- `VERCEL_API_PROJECT_ID`: API server project ID

### Docker Hub (Optional)
- `DOCKER_USERNAME`: Your Docker Hub username
- `DOCKER_PASSWORD`: Your Docker Hub password

### How to Get Vercel Credentials

1. **Install Vercel CLI**: `npm i -g vercel`
2. **Login**: `vercel login`
3. **Get Token**: Go to https://vercel.com/account/tokens
4. **Get Project IDs**: Run `vercel ls` to see project IDs

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    WalGraph Platform                        │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐    ┌─────────────────┐                │
│  │   Frontend      │    │   Enterprise    │                │
│  │   Editor        │    │   API Server    │                │
│  │   (Port 3000)   │    │   (Port 3001)   │                │
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

## 🚀 Deployment Checklist

### Before Pushing to GitHub
- [ ] Environment variables configured
- [ ] All dependencies installed
- [ ] Builds working locally
- [ ] Tests passing
- [ ] Documentation updated
- [ ] README.md updated
- [ ] License file added

### After GitHub Setup
- [ ] GitHub repository created
- [ ] Code pushed to main branch
- [ ] GitHub Actions workflow configured
- [ ] Secrets added to repository
- [ ] Deployment tested
- [ ] Domain configured (if needed)

## 🔍 Testing Your Deployment

### Frontend Testing
```bash
# Test wallet connection
curl -X GET "https://your-frontend-domain.vercel.app"

# Test graph creation
# Open browser and create a test graph

# Test graph saving
# Save a graph and verify it appears on SUI blockchain
```

### API Server Testing
```bash
# Health check
curl -X GET "https://your-api-domain.vercel.app/health"

# API documentation
curl -X GET "https://your-api-domain.vercel.app/docs"

# Test API key authentication
curl -X GET "https://your-api-domain.vercel.app/api/v1/graphs" \
  -H "x-api-key: your_api_key_here"
```

## 🆘 Troubleshooting

### Common Issues

1. **Build Failures**
   - Check Node.js version (18+ required)
   - Verify all dependencies installed
   - Check environment variables

2. **Deployment Failures**
   - Verify GitHub secrets are set correctly
   - Check Vercel project configuration
   - Ensure environment variables are set in deployment platform

3. **Runtime Errors**
   - Check SUI wallet connection
   - Verify Walrus URLs are accessible
   - Ensure API keys are valid

### Support Resources

- **Documentation**: Check individual component READMEs
- **Issues**: Create GitHub issues for bugs
- **Discussions**: Use GitHub Discussions for questions
- **Wiki**: Check repository wiki for additional guides

## 📈 Next Steps

After successful deployment:

1. **Monitor Performance**: Set up monitoring and analytics
2. **Scale Infrastructure**: Configure auto-scaling if needed
3. **Security Audit**: Perform security review
4. **User Testing**: Gather feedback from users
5. **Feature Development**: Plan next features

---

**Ready to deploy?** Follow the quick start guide above and you'll have WalGraph running in no time! 🚀

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md). 