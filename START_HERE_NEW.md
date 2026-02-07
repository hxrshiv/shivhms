# 🏥 Hospital Management System - START HERE

## ⚠️ IMPORTANT: Download Instructions

**Before you begin, make sure you have downloaded the ENTIRE folder:**

1. Download the complete `hospital-management-system` folder
2. Extract it to your preferred location (e.g., Desktop, Documents)
3. The folder should contain both:
   - Backend files (server.js, package.json, schema.sql, etc.)
   - **frontend/** folder with all React code

## ✅ Step 1: Verify You Have All Files

Open Terminal, navigate to the project folder and run:

```bash
cd ~/Downloads/hospital-management-system  # or wherever you extracted it
chmod +x verify-files.sh
./verify-files.sh
```

**All files should show ✓ (green checkmark)**

If any files show ✗ (red X), you need to re-download the complete project folder.

---

## 📋 Step 2: Prerequisites

Install required software (if not already installed):

```bash
# Install Homebrew (if needed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Node.js
brew install node

# Verify Node.js installation
node --version  # Should be v18 or higher

# Install PostgreSQL
brew install postgresql@14
brew services start postgresql@14

# Verify PostgreSQL
psql postgres -c "SELECT version();"
```

---

## 🚀 Step 3: Run Automated Setup

```bash
chmod +x setup-mac.sh
./setup-mac.sh
```

This will:
- ✅ Create the database
- ✅ Import schema and sample data
- ✅ Install backend dependencies
- ✅ Install **frontend dependencies** (this is crucial!)

**Wait for "✅ Setup complete!" message**

---

## 💻 Step 4: Start the Application

**Open TWO Terminal windows/tabs:**

### Terminal 1 - Backend:
```bash
cd ~/Downloads/hospital-management-system  # your project location
npm start
```
✅ Wait for: **"Server running on port 5000"**

### Terminal 2 - Frontend:
```bash
cd ~/Downloads/hospital-management-system  # your project location
cd frontend
npm run dev
```
✅ Wait for: **"Local: http://localhost:5173"**

---

## 🌐 Step 5: Access the Application

Open your browser: **http://localhost:5173**

**Default Login:**
- Username: `admin`
- Password: `admin123`

---

## 🎯 What to Try First

1. **Dashboard** - View overview with statistics tiles
2. **Search Bar** - Try searching (type any name, phone, or UHID)
3. **New Registration** - Click purple tile or "New Registration"
4. **Register Patient** - Fill form, select doctor, see QR code success window

---

## 🔧 Common Issues & Solutions

### ❌ "frontend folder not found" or "npm run dev fails"

**Solution 1: Verify frontend exists**
```bash
ls -la frontend/
```

If you see "No such file or directory", you need to re-download the complete project.

**Solution 2: Reinstall frontend dependencies**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
cd ..
```

---

### ❌ Database Connection Error

```bash
# Check if PostgreSQL is running
brew services list

# If not running, start it
brew services start postgresql@14

# Recreate database
psql postgres -c "DROP DATABASE IF EXISTS hospital_management;"
psql postgres -c "CREATE DATABASE hospital_management;"
psql -U postgres -d hospital_management -f schema.sql
```

---

### ❌ Port Already in Use

```bash
# Kill process on port 5000 (backend)
lsof -i :5000
kill -9 <PID>

# Kill process on port 5173 (frontend)
lsof -i :5173
kill -9 <PID>
```

---

### ❌ "Module not found" errors

```bash
# Reinstall all dependencies
npm install
cd frontend
npm install
cd ..

# Then restart both servers
```

---

## 📁 Expected Project Structure

When you run `ls -la`, you should see:

```
hospital-management-system/
├── .env
├── README.md
├── QUICK_START.md
├── PROJECT_SUMMARY.md
├── server.js              ← Backend server
├── package.json           ← Backend dependencies
├── schema.sql            ← Database schema
├── setup-mac.sh          ← Setup script
├── verify-files.sh       ← Verification script
└── frontend/             ← ⚠️ THIS MUST EXIST!
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── services/
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── package.json
    ├── vite.config.js
    └── index.html
```

---

## 🆘 Manual Setup (If Automated Fails)

```bash
# 1. Create database
psql postgres -c "CREATE DATABASE hospital_management;"
psql -U postgres -d hospital_management -f schema.sql

# 2. Install backend
npm install

# 3. Install frontend
cd frontend
npm install
cd ..

# 4. Start backend (Terminal 1)
npm start

# 5. Start frontend (Terminal 2)
cd frontend && npm run dev
```

---

## 📞 Still Having Issues?

**Checklist:**
- [ ] Node.js v18+ installed? (`node --version`)
- [ ] PostgreSQL running? (`brew services list`)
- [ ] In correct directory? (`pwd` should show project path)
- [ ] frontend/ folder exists? (`ls frontend/`)
- [ ] Dependencies installed? (both root and frontend/)
- [ ] Both terminals running? (backend + frontend)

**If frontend folder is genuinely missing, you need to re-download the complete project folder from the file I provided.**

---

## ✨ Quick Test

Once running, try this:
1. Login (admin/admin123)
2. Click "New Registration"
3. Fill: Name: "Test Patient", Phone: "9999999999", DOB: any date
4. Select any doctor
5. Click "Register Patient"
6. You should see success modal with UHID and QR code!

---

**For detailed documentation, see README.md**
