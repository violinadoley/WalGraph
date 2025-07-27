#!/bin/bash

# WalGraph Platform Quick Start Script
# This script helps you set up and deploy the WalGraph platform

set -e

echo "🚀 WalGraph Platform Quick Start"
echo "================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if Node.js is installed
check_node() {
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18+ first."
        exit 1
    fi
    
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        print_error "Node.js version 18+ is required. Current version: $(node -v)"
        exit 1
    fi
    
    print_status "Node.js $(node -v) is installed"
}

# Check if npm is installed
check_npm() {
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm 8+ first."
        exit 1
    fi
    
    print_status "npm $(npm -v) is installed"
}

# Setup environment variables
setup_env() {
    print_info "Setting up environment variables..."
    
    # Frontend environment
    if [ ! -f "WalGraph-frontend-app/.env.local" ]; then
        print_info "Creating frontend environment file..."
        cat > WalGraph-frontend-app/.env.local << EOF
# SUI Blockchain Configuration
NEXT_PUBLIC_SUI_NETWORK=testnet
NEXT_PUBLIC_PACKAGE_ID=0xe21c81834611d67b92751acb642d8b6587ce5da730cebace0d5f874015b92afa
NEXT_PUBLIC_REGISTRY_ID=0xc09065c827a619ee2a3206017ddcd748ec89e4ac1520dbef57c2ef27e711d9fc

# Walrus Storage Configuration
NEXT_PUBLIC_WALRUS_AGGREGATOR_URL=https://walrus-testnet-aggregator.natsai.xyz
NEXT_PUBLIC_WALRUS_PUBLISHER_URL=https://walrus-testnet-publisher.natsai.xyz
EOF
        print_status "Frontend environment file created"
    else
        print_warning "Frontend environment file already exists"
    fi
    
    # API server environment
    if [ ! -f "api-server/.env" ]; then
        print_info "Creating API server environment file..."
        cp api-server/env.example api-server/.env
        print_warning "Please edit api-server/.env with your actual values:"
        print_warning "  - SUI_RECOVERY_PHRASE (your 24-word recovery phrase)"
        print_warning "  - API_KEY_SECRET (your secure API key secret)"
        print_warning "  - JWT_SECRET (your secure JWT secret)"
    else
        print_warning "API server environment file already exists"
    fi
}

# Install dependencies
install_deps() {
    print_info "Installing dependencies..."
    
    # Frontend dependencies
    print_info "Installing frontend dependencies..."
    cd WalGraph-frontend-app
    npm install
    cd ..
    print_status "Frontend dependencies installed"
    
    # API server dependencies
    print_info "Installing API server dependencies..."
    cd api-server
    npm install
    cd ..
    print_status "API server dependencies installed"
}

# Build applications
build_apps() {
    print_info "Building applications..."
    
    # Build frontend
    print_info "Building frontend..."
    cd WalGraph-frontend-app
    npm run build
    cd ..
    print_status "Frontend built successfully"
    
    # Build API server
    print_info "Building API server..."
    cd api-server
    npm run build
    cd ..
    print_status "API server built successfully"
}

# Start development servers
start_dev() {
    print_info "Starting development servers..."
    
    # Start API server in background
    print_info "Starting API server on port 3001..."
    cd api-server
    npm run dev &
    API_PID=$!
    cd ..
    
    # Wait a moment for API server to start
    sleep 3
    
    # Start frontend
    print_info "Starting frontend on port 3000..."
    cd WalGraph-frontend-app
    npm run dev &
    FRONTEND_PID=$!
    cd ..
    
    print_status "Development servers started!"
    print_info "Frontend: http://localhost:3000"
    print_info "API Server: http://localhost:3001"
    print_info "API Docs: http://localhost:3001/docs"
    
    # Function to handle cleanup
    cleanup() {
        print_info "Stopping development servers..."
        kill $API_PID 2>/dev/null || true
        kill $FRONTEND_PID 2>/dev/null || true
        print_status "Development servers stopped"
        exit 0
    }
    
    # Set up signal handlers
    trap cleanup SIGINT SIGTERM
    
    # Wait for user to stop
    print_info "Press Ctrl+C to stop the servers"
    wait
}

# Deploy to Vercel
deploy_vercel() {
    print_info "Deploying to Vercel..."
    
    # Check if Vercel CLI is installed
    if ! command -v vercel &> /dev/null; then
        print_info "Installing Vercel CLI..."
        npm install -g vercel
    fi
    
    # Deploy frontend
    print_info "Deploying frontend to Vercel..."
    cd WalGraph-frontend-app
    vercel --prod
    cd ..
    
    # Deploy API server
    print_info "Deploying API server to Vercel..."
    cd api-server
    vercel --prod
    cd ..
    
    print_status "Deployment completed!"
}

# Deploy with Docker
deploy_docker() {
    print_info "Deploying with Docker..."
    
    # Check if Docker is installed
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    # Check if Docker Compose is installed
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    # Build and start services
    print_info "Building and starting Docker services..."
    docker-compose up --build -d
    
    print_status "Docker deployment completed!"
    print_info "Frontend: http://localhost:3000"
    print_info "API Server: http://localhost:3001"
}

# Main menu
show_menu() {
    echo ""
    echo "What would you like to do?"
    echo "1) Setup environment and install dependencies"
    echo "2) Start development servers"
    echo "3) Deploy to Vercel"
    echo "4) Deploy with Docker"
    echo "5) Full setup and start development"
    echo "6) Exit"
    echo ""
    read -p "Enter your choice (1-6): " choice
    
    case $choice in
        1)
            check_node
            check_npm
            setup_env
            install_deps
            build_apps
            print_status "Setup completed!"
            ;;
        2)
            start_dev
            ;;
        3)
            deploy_vercel
            ;;
        4)
            deploy_docker
            ;;
        5)
            check_node
            check_npm
            setup_env
            install_deps
            build_apps
            start_dev
            ;;
        6)
            print_info "Goodbye!"
            exit 0
            ;;
        *)
            print_error "Invalid choice. Please try again."
            show_menu
            ;;
    esac
}

# Check if script is run with arguments
if [ $# -eq 0 ]; then
    show_menu
else
    case $1 in
        "setup")
            check_node
            check_npm
            setup_env
            install_deps
            build_apps
            ;;
        "dev")
            start_dev
            ;;
        "deploy")
            deploy_vercel
            ;;
        "docker")
            deploy_docker
            ;;
        *)
            print_error "Unknown command: $1"
            print_info "Available commands: setup, dev, deploy, docker"
            exit 1
            ;;
    esac
fi 