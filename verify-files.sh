#!/bin/bash

echo "🔍 Hospital Management System - File Verification"
echo "=================================================="
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} $1"
        return 0
    else
        echo -e "${RED}✗${NC} $1 - MISSING!"
        return 1
    fi
}

check_dir() {
    if [ -d "$1" ]; then
        echo -e "${GREEN}✓${NC} $1/"
        return 0
    else
        echo -e "${RED}✗${NC} $1/ - MISSING!"
        return 1
    fi
}

echo "Checking Backend Files:"
echo "----------------------"
check_file "server.js"
check_file "package.json"
check_file "schema.sql"
check_file ".env"
check_file "setup-mac.sh"

echo ""
echo "Checking Frontend Structure:"
echo "---------------------------"
check_dir "frontend"
check_file "frontend/package.json"
check_file "frontend/vite.config.js"
check_file "frontend/index.html"

echo ""
echo "Checking Frontend Source Files:"
echo "-------------------------------"
check_dir "frontend/src"
check_file "frontend/src/main.jsx"
check_file "frontend/src/App.jsx"
check_file "frontend/src/index.css"

echo ""
check_dir "frontend/src/components"
check_file "frontend/src/components/Layout.jsx"

echo ""
check_dir "frontend/src/pages"
check_file "frontend/src/pages/Login.jsx"
check_file "frontend/src/pages/Dashboard.jsx"
check_file "frontend/src/pages/PatientRegistration.jsx"
check_file "frontend/src/pages/Appointments.jsx"
check_file "frontend/src/pages/Reports.jsx"

echo ""
check_dir "frontend/src/services"
check_file "frontend/src/services/api.js"

echo ""
echo "=================================================="
echo "Verification Complete!"
echo ""
echo "If all files show ✓, you're ready to proceed."
echo "If any files show ✗, please re-download the project."
echo "=================================================="
