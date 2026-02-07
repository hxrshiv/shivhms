#!/bin/bash

echo "🔍 Hospital Management System - Troubleshooting Guide"
echo "====================================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "Let's check what's happening..."
echo ""

# Check 1: Node.js
echo "1. Checking Node.js installation..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    echo -e "${GREEN}✓${NC} Node.js installed: $NODE_VERSION"
else
    echo -e "${RED}✗${NC} Node.js not found. Please install: brew install node"
    exit 1
fi

echo ""

# Check 2: PostgreSQL
echo "2. Checking PostgreSQL..."
if command -v psql &> /dev/null; then
    echo -e "${GREEN}✓${NC} PostgreSQL installed"
    
    # Check if running
    if brew services list | grep postgresql@14 | grep started &> /dev/null; then
        echo -e "${GREEN}✓${NC} PostgreSQL is running"
    else
        echo -e "${YELLOW}!${NC} PostgreSQL not running. Starting..."
        brew services start postgresql@14
    fi
else
    echo -e "${RED}✗${NC} PostgreSQL not found. Please install: brew install postgresql@14"
fi

echo ""

# Check 3: Port 5000 (Backend)
echo "3. Checking if backend is running (port 5000)..."
if lsof -i :5000 &> /dev/null; then
    echo -e "${GREEN}✓${NC} Backend is running on port 5000"
    lsof -i :5000
else
    echo -e "${RED}✗${NC} Backend is NOT running on port 5000"
    echo "   You need to start it: npm start"
fi

echo ""

# Check 4: Port 5173 (Frontend)
echo "4. Checking if frontend is running (port 5173)..."
if lsof -i :5173 &> /dev/null; then
    echo -e "${GREEN}✓${NC} Frontend is running on port 5173"
    lsof -i :5173
else
    echo -e "${RED}✗${NC} Frontend is NOT running on port 5173"
    echo "   You need to start it: cd frontend && npm run dev"
fi

echo ""

# Check 5: Dependencies
echo "5. Checking dependencies..."
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✓${NC} Backend node_modules exists"
else
    echo -e "${RED}✗${NC} Backend dependencies not installed"
    echo "   Run: npm install"
fi

if [ -d "frontend/node_modules" ]; then
    echo -e "${GREEN}✓${NC} Frontend node_modules exists"
else
    echo -e "${RED}✗${NC} Frontend dependencies not installed"
    echo "   Run: cd frontend && npm install"
fi

echo ""

# Check 6: Database
echo "6. Checking database..."
if psql -U postgres -d hospital_management -c "SELECT 1;" &> /dev/null; then
    echo -e "${GREEN}✓${NC} Database 'hospital_management' exists and is accessible"
else
    echo -e "${RED}✗${NC} Database issue detected"
    echo "   Run: psql postgres -c 'CREATE DATABASE hospital_management;'"
    echo "   Then: psql -U postgres -d hospital_management -f schema.sql"
fi

echo ""
echo "====================================================="
echo "Summary of Issues:"
echo ""

# Count issues
ISSUES=0

if ! lsof -i :5000 &> /dev/null; then
    echo -e "${RED}⚠${NC} Backend not running - This is required!"
    echo "   Solution: Open Terminal 1 and run: npm start"
    ISSUES=$((ISSUES+1))
    echo ""
fi

if ! lsof -i :5173 &> /dev/null; then
    echo -e "${RED}⚠${NC} Frontend not running - This is why http://localhost:5173 doesn't load!"
    echo "   Solution: Open Terminal 2 and run: cd frontend && npm run dev"
    ISSUES=$((ISSUES+1))
    echo ""
fi

if [ ! -d "node_modules" ]; then
    echo -e "${RED}⚠${NC} Backend dependencies missing"
    echo "   Solution: Run: npm install"
    ISSUES=$((ISSUES+1))
    echo ""
fi

if [ ! -d "frontend/node_modules" ]; then
    echo -e "${RED}⚠${NC} Frontend dependencies missing"
    echo "   Solution: Run: cd frontend && npm install"
    ISSUES=$((ISSUES+1))
    echo ""
fi

if [ $ISSUES -eq 0 ]; then
    echo -e "${GREEN}✓${NC} Everything looks good!"
    echo ""
    echo "Try opening: http://localhost:5173"
else
    echo ""
    echo "====================================================="
    echo "Quick Fix Steps:"
    echo "====================================================="
    echo ""
    echo "Step 1: Install dependencies (if not done)"
    echo "  npm install"
    echo "  cd frontend && npm install && cd .."
    echo ""
    echo "Step 2: Start Backend (Terminal 1)"
    echo "  npm start"
    echo ""
    echo "Step 3: Start Frontend (Terminal 2)"
    echo "  cd frontend"
    echo "  npm run dev"
    echo ""
    echo "Step 4: Open browser"
    echo "  http://localhost:5173"
    echo ""
fi

echo "====================================================="
