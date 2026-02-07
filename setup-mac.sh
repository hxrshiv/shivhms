#!/bin/bash

echo "🏥 Hospital Management System - Setup for Mac"
echo "=============================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Homebrew is installed
echo "Checking prerequisites..."
if ! command -v brew &> /dev/null; then
    echo -e "${RED}❌ Homebrew not found${NC}"
    echo ""
    echo "Please install Homebrew first:"
    echo '/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"'
    exit 1
fi
echo -e "${GREEN}✅ Homebrew found${NC}"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}📦 Installing Node.js...${NC}"
    brew install node
else
    echo -e "${GREEN}✅ Node.js installed ($(node -v))${NC}"
fi

# Check if npm is available
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm not found. Please install Node.js properly${NC}"
    exit 1
fi
echo -e "${GREEN}✅ npm available ($(npm -v))${NC}"

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo -e "${YELLOW}📦 Installing PostgreSQL...${NC}"
    brew install postgresql@14
fi
echo -e "${GREEN}✅ PostgreSQL installed${NC}"

# Start PostgreSQL
echo ""
echo "🔧 Starting PostgreSQL..."
brew services start postgresql@14
sleep 3  # Wait for PostgreSQL to start

# Check if PostgreSQL is running
if brew services list | grep postgresql@14 | grep started > /dev/null; then
    echo -e "${GREEN}✅ PostgreSQL is running${NC}"
else
    echo -e "${YELLOW}⚠️  PostgreSQL may not be running. Trying to start...${NC}"
    brew services restart postgresql@14
    sleep 3
fi

echo ""
echo "🗄️  Setting up database..."

# Try to create database (using createdb which doesn't need password)
if createdb hospital_management 2>/dev/null; then
    echo -e "${GREEN}✅ Database created${NC}"
else
    echo -e "${YELLOW}⚠️  Database might already exist (this is OK)${NC}"
fi

# Import schema
echo "📥 Importing database schema..."
if psql -d hospital_management -f schema.sql > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Schema imported successfully${NC}"
else
    echo -e "${YELLOW}⚠️  Schema import had warnings (this is usually OK if database already exists)${NC}"
fi

echo ""
echo "📦 Installing backend dependencies..."
if npm install; then
    echo -e "${GREEN}✅ Backend dependencies installed${NC}"
else
    echo -e "${RED}❌ Failed to install backend dependencies${NC}"
    exit 1
fi

echo ""
echo "📦 Installing frontend dependencies..."
cd frontend
if npm install; then
    echo -e "${GREEN}✅ Frontend dependencies installed${NC}"
else
    echo -e "${RED}❌ Failed to install frontend dependencies${NC}"
    exit 1
fi
cd ..

echo ""
echo -e "${GREEN}=================================================="
echo "✅ Setup Complete!"
echo "==================================================${NC}"
echo ""
echo "To start the application, open TWO terminal windows:"
echo ""
echo -e "${YELLOW}Terminal 1 - Backend:${NC}"
echo "   cd $(pwd)"
echo "   npm start"
echo ""
echo -e "${YELLOW}Terminal 2 - Frontend:${NC}"
echo "   cd $(pwd)/frontend"
echo "   npm run dev"
echo ""
echo "Then open your browser to: http://localhost:5173"
echo ""
echo -e "${GREEN}Default login credentials:${NC}"
echo "   Username: admin"
echo "   Password: admin123"
echo ""
echo "=================================================="
echo ""
echo "📖 For detailed instructions, see INSTALLATION.md"
echo ""
