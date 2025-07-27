#!/bin/bash

# WalGraph Enterprise API Deployment Script
# This script handles production deployment

set -e

echo "🚀 Starting WalGraph Enterprise API Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required environment variables are set
check_env_vars() {
    print_status "Checking environment variables..."
    
    required_vars=(
        "SUI_RECOVERY_PHRASE"
        "API_KEY_SECRET"
        "JWT_SECRET"
        "WALRUS_PUBLISHER_URL"
        "WALRUS_AGGREGATOR_URL"
        "SUI_PACKAGE_ID"
        "SUI_REGISTRY_ID"
    )
    
    missing_vars=()
    
    for var in "${required_vars[@]}"; do
        if [ -z "${!var}" ]; then
            missing_vars+=("$var")
        fi
    done
    
    if [ ${#missing_vars[@]} -ne 0 ]; then
        print_error "Missing required environment variables:"
        for var in "${missing_vars[@]}"; do
            echo "  - $var"
        done
        exit 1
    fi
    
    print_status "All required environment variables are set"
}

# Install dependencies
install_dependencies() {
    print_status "Installing dependencies..."
    npm ci --only=production
}

# Build the application
build_app() {
    print_status "Building application..."
    npm run build
    
    if [ $? -eq 0 ]; then
        print_status "Build completed successfully"
    else
        print_error "Build failed"
        exit 1
    fi
}

# Run tests
run_tests() {
    print_status "Running tests..."
    npm test
    
    if [ $? -eq 0 ]; then
        print_status "All tests passed"
    else
        print_error "Tests failed"
        exit 1
    fi
}

# Health check
health_check() {
    print_status "Performing health check..."
    
    # Wait for the server to start
    sleep 5
    
    # Check if the server is responding
    if curl -f http://localhost:3000/health > /dev/null 2>&1; then
        print_status "Health check passed"
    else
        print_error "Health check failed"
        exit 1
    fi
}

# Deploy to Vercel
deploy_vercel() {
    print_status "Deploying to Vercel..."
    
    if command -v vercel &> /dev/null; then
        vercel --prod
        print_status "Vercel deployment completed"
    else
        print_error "Vercel CLI not found. Please install it first: npm install -g vercel"
        exit 1
    fi
}

# Deploy with Docker
deploy_docker() {
    print_status "Deploying with Docker..."
    
    # Build Docker image
    docker build -t walgraph-api .
    
    # Stop existing container
    docker stop walgraph-api 2>/dev/null || true
    docker rm walgraph-api 2>/dev/null || true
    
    # Run new container
    docker run -d \
        --name walgraph-api \
        --restart unless-stopped \
        -p 3000:3000 \
        -e NODE_ENV=production \
        -e SUI_RECOVERY_PHRASE="$SUI_RECOVERY_PHRASE" \
        -e API_KEY_SECRET="$API_KEY_SECRET" \
        -e JWT_SECRET="$JWT_SECRET" \
        -e WALRUS_PUBLISHER_URL="$WALRUS_PUBLISHER_URL" \
        -e WALRUS_AGGREGATOR_URL="$WALRUS_AGGREGATOR_URL" \
        -e SUI_PACKAGE_ID="$SUI_PACKAGE_ID" \
        -e SUI_REGISTRY_ID="$SUI_REGISTRY_ID" \
        walgraph-api
    
    print_status "Docker deployment completed"
}

# Deploy with Docker Compose
deploy_docker_compose() {
    print_status "Deploying with Docker Compose..."
    
    docker-compose up -d --build
    
    print_status "Docker Compose deployment completed"
}

# Deploy with PM2
deploy_pm2() {
    print_status "Deploying with PM2..."
    
    # Install PM2 if not installed
    if ! command -v pm2 &> /dev/null; then
        npm install -g pm2
    fi
    
    # Create ecosystem file
    cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'walgraph-enterprise-api',
    script: 'dist/app.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
      SUI_RECOVERY_PHRASE: '$SUI_RECOVERY_PHRASE',
      API_KEY_SECRET: '$API_KEY_SECRET',
      JWT_SECRET: '$JWT_SECRET',
      WALRUS_PUBLISHER_URL: '$WALRUS_PUBLISHER_URL',
      WALRUS_AGGREGATOR_URL: '$WALRUS_AGGREGATOR_URL',
      SUI_PACKAGE_ID: '$SUI_PACKAGE_ID',
      SUI_REGISTRY_ID: '$SUI_REGISTRY_ID'
    }
  }]
};
EOF
    
    # Start with PM2
    pm2 start ecosystem.config.js
    pm2 save
    pm2 startup
    
    print_status "PM2 deployment completed"
}

# Main deployment function
main() {
    local deployment_type=${1:-"local"}
    
    print_status "Starting deployment type: $deployment_type"
    
    # Check environment variables
    check_env_vars
    
    # Install dependencies
    install_dependencies
    
    # Build application
    build_app
    
    # Run tests
    run_tests
    
    # Deploy based on type
    case $deployment_type in
        "vercel")
            deploy_vercel
            ;;
        "docker")
            deploy_docker
            ;;
        "docker-compose")
            deploy_docker_compose
            ;;
        "pm2")
            deploy_pm2
            ;;
        "local")
            print_status "Starting local development server..."
            npm start &
            health_check
            print_status "Local deployment completed"
            ;;
        *)
            print_error "Unknown deployment type: $deployment_type"
            print_status "Available options: vercel, docker, docker-compose, pm2, local"
            exit 1
            ;;
    esac
    
    print_status "Deployment completed successfully! 🎉"
}

# Check if script is being sourced or executed
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi 