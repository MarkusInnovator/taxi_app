#!/bin/bash
# TaxiFlow - Development Startup Script

set -e

echo "🚕 TaxiFlow - Starting Development Environment"
echo "=============================================="

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Docker is not running. Please start Docker first.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Docker is running${NC}"

# Check if docker-compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}❌ docker-compose is not installed${NC}"
    exit 1
fi

echo -e "${GREEN}✅ docker-compose is installed${NC}"

# Stop any existing containers
echo -e "${BLUE}🛑 Stopping existing containers...${NC}"
docker-compose down 2>/dev/null || true

# Remove old volumes (optional - ask user)
read -p "Remove old database volumes? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}🗑️  Removing old volumes...${NC}"
    docker-compose down -v
fi

# Build and start services
echo -e "${BLUE}🏗️  Building and starting services...${NC}"
docker-compose up --build -d

# Wait for services to be healthy
echo -e "${BLUE}⏳ Waiting for services to start...${NC}"
sleep 5

# Check service health
echo -e "${BLUE}🔍 Checking service health...${NC}"

# Check database
if docker-compose exec -T db pg_isready -U postgres > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Database is ready${NC}"
else
    echo -e "${RED}❌ Database failed to start${NC}"
    exit 1
fi

# Check backend
if curl -f http://localhost:3000/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Backend is ready${NC}"
else
    echo -e "${YELLOW}⚠️  Backend is starting...${NC}"
    sleep 3
    if curl -f http://localhost:3000/health > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Backend is ready${NC}"
    else
        echo -e "${RED}❌ Backend failed to start${NC}"
        docker-compose logs backend
        exit 1
    fi
fi

# Check frontend
if curl -f http://localhost:5173 > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Frontend is ready${NC}"
else
    echo -e "${YELLOW}⚠️  Frontend is starting...${NC}"
    sleep 3
    if curl -f http://localhost:5173 > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Frontend is ready${NC}"
    else
        echo -e "${RED}❌ Frontend failed to start${NC}"
        docker-compose logs frontend
        exit 1
    fi
fi

echo ""
echo -e "${GREEN}🎉 All services are running!${NC}"
echo "=============================================="
echo -e "${BLUE}📱 Frontend:${NC} http://localhost:5173"
echo -e "${BLUE}🔧 Backend API:${NC} http://localhost:3000"
echo -e "${BLUE}🗄️  Database:${NC} postgresql://postgres:postgres@localhost:5432/taxiflow"
echo ""
echo -e "${YELLOW}📋 Demo Accounts:${NC}"
echo "  Customer: customer@taxi.com / customer123"
echo "  Driver:   driver@taxi.com / driver123"
echo "  Admin:    admin@taxi.com / admin123"
echo ""
echo -e "${BLUE}📊 View logs:${NC} docker-compose logs -f"
echo -e "${BLUE}🛑 Stop:${NC} docker-compose down"
echo "=============================================="
