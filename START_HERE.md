# 🚀 START HERE - Hospital Management System

## The Easiest Way to Get Started (3 Steps)

### Step 1: Run Setup (One Time Only)

Open Terminal and navigate to this folder, then run:

```bash
chmod +x setup-mac.sh
./setup-mac.sh
```

This will:
- ✅ Install PostgreSQL and Node.js (if needed)
- ✅ Create the database
- ✅ Install all dependencies
- ✅ Set everything up

**Wait for it to complete!** It should say "Setup Complete!" at the end.

---

### Step 2: Start the Backend Server

Open a **NEW Terminal window** and run:

```bash
./start-backend.sh
```

You should see: "Server running on port 5000"

**Keep this terminal open!**

---

### Step 3: Start the Frontend

Open **ANOTHER Terminal window** and run:

```bash
./start-frontend.sh
```

You should see: "Local: http://localhost:5173/"

**Keep this terminal open too!**

---

### Step 4: Open Your Browser

Go to: **http://localhost:5173**

Login with:
- **Username:** `admin`
- **Password:** `admin123`

---

## 🎉 That's It!

You should now see the Hospital Management System dashboard.

---

## 🛑 To Stop the Application

- In each terminal window, press `Ctrl+C`

---

## 🔄 To Restart

Just run the start scripts again:
```bash
# Terminal 1
./start-backend.sh

# Terminal 2
./start-frontend.sh
```

---

## 🐛 Having Issues?

### If setup fails:

1. **Make sure you have Homebrew installed:**
   ```bash
   brew --version
   ```
   If not: `/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"`

2. **Check if PostgreSQL is running:**
   ```bash
   brew services list | grep postgresql
   ```
   Should say "started". If not:
   ```bash
   brew services start postgresql@14
   ```

3. **Manually install dependencies:**
   ```bash
   # Backend
   npm install
   
   # Frontend
   cd frontend
   npm install
   cd ..
   ```

### If the frontend doesn't start:

Make sure you're in the project folder and frontend directory exists:
```bash
ls -la frontend/
```

You should see:
- package.json
- src/
- index.html
- vite.config.js

If files are missing, the frontend wasn't copied correctly.

### If backend can't connect to database:

```bash
# Create database manually
createdb hospital_management

# Import schema
psql -d hospital_management -f schema.sql
```

### If login doesn't work:

Check that backend is running (Terminal 1 should show "Server running on port 5000")

---

## 📖 Want More Details?

- **INSTALLATION.md** - Detailed step-by-step installation guide
- **README.md** - Complete documentation
- **PROJECT_SUMMARY.md** - Overview of what's included

---

## 💡 Quick Tips

- **Always keep both terminal windows open** while using the app
- Frontend changes reload automatically
- Backend changes need a restart (Ctrl+C, then `./start-backend.sh`)
- Default port: Backend=5000, Frontend=5173
- Database name: hospital_management

---

## ✅ What You Can Do Now

1. **Register a new patient** - Click "New Registration"
2. **Search for patients** - Use the search bar
3. **View dashboard** - See today's statistics
4. **Select doctors** - Choose from dropdown
5. **Add referring doctors** - Create new or select existing

---

**Need help? Check INSTALLATION.md for troubleshooting!**
