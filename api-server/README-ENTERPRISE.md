# 🚀 WalGraph Enterprise API

Enterprise-grade decentralized graph database API built on SUI blockchain and Walrus protocol.

## 🌟 Features

### 🔐 Enterprise Security
- **API Key Authentication** - Secure API key-based access
- **JWT Authentication** - Token-based user authentication
- **Role-based Access Control** - Fine-grained permissions
- **Rate Limiting** - Multi-level rate limiting (API, user, organization)
- **Helmet Security** - Comprehensive security headers
- **CORS Protection** - Configurable cross-origin policies

### 📊 Graph Database Operations
- **CRUD Operations** - Create, read, update, delete graphs
- **Advanced Queries** - Cypher-like query language
- **Graph Analytics** - Centrality, clustering, path analysis
- **Bulk Operations** - Efficient batch processing
- **Real-time Updates** - WebSocket support for live data

### 🔗 Blockchain Integration
- **SUI Blockchain** - Metadata storage and access control
- **Smart Contracts** - Automated governance and permissions
- **Transaction History** - Complete audit trail
- **Decentralized Storage** - Walrus protocol integration

### 🏢 Enterprise Features
- **Multi-tenancy** - Organization-based data isolation
- **Billing Integration** - Stripe payment processing
- **File Upload** - AWS S3 integration
- **Email Notifications** - Automated alerts and reports
- **Monitoring** - Prometheus metrics and Sentry error tracking
- **API Documentation** - Interactive Swagger UI

## 🚀 Quick Start

### 1. Installation

```bash
# Clone the repository
git clone https://github.com/walgraph/enterprise-api.git
cd enterprise-api

# Install dependencies
npm install

# Copy environment file
cp env.example .env

# Edit environment variables
nano .env
```

### 2. Environment Configuration

Create a `.env` file with the following variables:

```env
# Required
NODE_ENV=development
PORT=3000
JWT_SECRET=your-super-secret-jwt-key-at-least-32-characters-long
API_KEY_SALT=your-api-key-salt-at-least-16-characters
SESSION_SECRET=your-session-secret-at-least-32-characters-long

# SUI Blockchain
SUI_NETWORK=testnet
SUI_PACKAGE_ID=0xe21c81834611d67b92751acb642d8b6587ce5da730cebace0d5f874015b92afa
SUI_REGISTRY_ID=0xc09065c827a619ee2a3206017ddcd748ec89e4ac1520dbef57c2ef27e711d9fc

# Walrus Protocol
WALRUS_PUBLISHER_URL=https://walrus-testnet-publisher.natsai.xyz
WALRUS_AGGREGATOR_URL=https://walrus-testnet-aggregator.natsai.xyz
```

### 3. Start the Server

```bash
# Development mode
npm run dev

# Production mode
npm run build
npm start
```

## 📚 API Documentation

### Interactive Documentation
Visit `http://localhost:3000/docs` for interactive API documentation.

### Authentication

#### API Key Authentication
```bash
curl -H "x-api-key: your-api-key" \
     http://localhost:3000/api/v1/graphs
```

#### JWT Authentication
```bash
curl -H "Authorization: Bearer your-jwt-token" \
     http://localhost:3000/api/v1/graphs
```

### Core Endpoints

#### Create Graph
```bash
curl -X POST http://localhost:3000/api/v1/graphs \
  -H "Content-Type: application/json" \
  -H "x-api-key: your-api-key" \
  -d '{
    "name": "Enterprise Network",
    "description": "Company relationship graph",
    "isPublic": false,
    "tags": ["enterprise", "network"],
    "nodes": [
      {
        "id": "company1",
        "type": "Company",
        "properties": {
          "name": "TechCorp",
          "industry": "Technology"
        }
      }
    ],
    "relationships": []
  }'
```

#### Get Graph
```bash
curl http://localhost:3000/api/v1/graphs/graph-id
```

#### Execute Query
```bash
curl -X POST http://localhost:3000/api/v1/graphs/graph-id/query \
  -H "Content-Type: application/json" \
  -H "x-api-key: your-api-key" \
  -d '{
    "query": "MATCH (c:Company) RETURN c",
    "limit": 10
  }'
```

#### Get Analytics
```bash
curl http://localhost:3000/api/v1/graphs/graph-id/analytics \
  -H "x-api-key: your-api-key"
```

## 🔧 Configuration

### Rate Limiting
Configure rate limits in your `.env` file:

```env
RATE_LIMIT_WINDOW_MS=900000    # 15 minutes
RATE_LIMIT_MAX_REQUESTS=100    # 100 requests per window
```

### CORS
Configure CORS origins:

```env
CORS_ORIGIN=https://yourdomain.com,https://app.yourdomain.com
```

### Database
Configure database connections:

```env
MONGODB_URI=mongodb://localhost:27017/walgraph
REDIS_URL=redis://localhost:6379
```

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                 Enterprise API                      │
│  Express.js + TypeScript + Security Middleware     │
└─────────────────────────────────────────────────────┘
                           │
┌─────────────────────────────────────────────────────┐
│                Authentication Layer                 │
│  API Keys + JWT + Role-based Access Control        │
└─────────────────────────────────────────────────────┘
                           │
┌─────────────────────────────────────────────────────┐
│                Rate Limiting Layer                  │
│  Redis-based + Multi-level Rate Limiting           │
└─────────────────────────────────────────────────────┘
                           │
┌─────────────────────────────────────────────────────┐
│                Business Logic Layer                 │
│  Graph Operations + Analytics + Queries            │
└─────────────────────────────────────────────────────┘
                           │
┌─────────────────────────────────────────────────────┐
│                Storage Layer                        │
│  SUI Blockchain + Walrus Protocol + Local Cache    │
└─────────────────────────────────────────────────────┘
```

## 🔒 Security Features

### API Key Management
- Generate secure API keys
- Key rotation and expiration
- Usage tracking and analytics

### JWT Authentication
- Secure token-based authentication
- Configurable expiration times
- Refresh token support

### Rate Limiting
- **API Level**: Global rate limiting
- **User Level**: Per-user rate limiting
- **Organization Level**: Per-organization rate limiting
- **Operation Level**: Specific operation rate limiting

### Data Protection
- Input validation and sanitization
- SQL injection prevention
- XSS protection
- CSRF protection

## 📊 Monitoring & Analytics

### Health Checks
```bash
curl http://localhost:3000/health
```

### Metrics
- Request/response times
- Error rates
- API usage statistics
- Graph operation metrics

### Logging
- Structured logging with Winston
- Request/response logging
- Error tracking with Sentry
- Audit trail for all operations

## 🚀 Deployment

### Docker Deployment
```bash
# Build image
docker build -t walgraph-api .

# Run container
docker run -p 3000:3000 --env-file .env walgraph-api
```

### Production Checklist
- [ ] Set `NODE_ENV=production`
- [ ] Configure secure JWT secret
- [ ] Set up SSL/TLS certificates
- [ ] Configure production database
- [ ] Set up monitoring and alerting
- [ ] Configure backup strategies
- [ ] Set up CI/CD pipeline

## 🔧 Development

### Running Tests
```bash
npm test
npm run test:watch
```

### Code Quality
```bash
npm run lint
npm run lint:fix
```

### Building
```bash
npm run build
```

## 📞 Support

### Documentation
- [API Documentation](http://localhost:3000/docs)
- [Graph Query Language Guide](./docs/query-language.md)
- [Authentication Guide](./docs/authentication.md)

### Contact
- **Email**: support@walgraph.dev
- **Website**: https://walgraph.dev
- **GitHub**: https://github.com/walgraph/enterprise-api

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

---

**WalGraph Enterprise API** - Powering the future of decentralized graph databases 🌊📊 