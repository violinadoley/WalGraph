#!/bin/bash

echo "🚀 Setting up WalGraph Enterprise API Environment..."

# Create .env file with proper values
cat > .env << EOF
# WalGraph Enterprise API Environment Variables

# Application
NODE_ENV=development
PORT=3000

# Database
MONGODB_URI=mongodb://localhost:27017/walgraph
REDIS_URL=redis://localhost:6379

# JWT Authentication
JWT_SECRET=walgraph-enterprise-jwt-secret-key-2024-super-secure-32-chars
JWT_EXPIRES_IN=24h

# API Keys
API_KEY_SALT=walgraph-api-salt-16-chars

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# SUI Blockchain
SUI_NETWORK=testnet
SUI_PACKAGE_ID=0xe21c81834611d67b92751acb642d8b6587ce5da730cebace0d5f874015b92afa
SUI_REGISTRY_ID=0xc09065c827a619ee2a3206017ddcd748ec89e4ac1520dbef57c2ef27e711d9fc

# Walrus Protocol
WALRUS_PUBLISHER_URL=https://walrus-testnet-publisher.natsai.xyz
WALRUS_AGGREGATOR_URL=https://walrus-testnet-aggregator.natsai.xyz

# AWS S3 (Optional - for file uploads)
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=us-east-1
AWS_S3_BUCKET=

# Stripe (Optional - for billing)
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# Email (Optional - for notifications)
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=

# Monitoring (Optional)
SENTRY_DSN=
LOG_LEVEL=info

# CORS
CORS_ORIGIN=*

# Security
SESSION_SECRET=walgraph-session-secret-32-chars-long-2024-secure
COOKIE_SECURE=false
EOF

echo "✅ Environment file created successfully!"
echo "📝 Edit .env file to customize settings for your environment" 