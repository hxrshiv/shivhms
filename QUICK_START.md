# Quick Start Guide - Hospital Management System

## 🚀 Fastest Way to Get Started on Mac

### Option 1: Automated Setup (Recommended)

```bash
# Make the setup script executable
chmod +x setup-mac.sh

# Run the automated setup
./setup-mac.sh
```

### Option 2: Manual Setup

#### 1. Install Prerequisites

```bash
# Install Homebrew (if not installed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Node.js
brew install node

# Install PostgreSQL
brew install postgresql@14
brew services start postgresql@14
```

#### 2. Setup Database

```bash
# Create database
psql postgres -c "CREATE DATABASE hospital_management;"

# Import schema
psql -U postgres -d hospital_management -f schema.sql
```

#### 3. Install Dependencies

```bash
# Backend
npm install

# Frontend
cd frontend
npm install
cd ..
```

#### 4. Start the Application

**Terminal 1 - Backend:**
```bash
npm start
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

#### 5. Access the Application

Open your browser and go to: **http://localhost:5173**

**Login Credentials:**
- Username: `admin`
- Password: `admin123`

---

## 📋 What You Can Do

### 1. Dashboard
- View today's statistics
- See available doctors
- Track registrations
- Search existing patients

### 2. New Patient Registration
- Fill patient details (Name, DOB, Age, Phone, etc.)
- Add Aadhar card number
- Add attender information
- Select OP doctor
- Choose or create referring doctor
- **System automatically calculates fees:**
  - Consulting Fee: ₹300 (default)
  - Referral Fee: ₹250 (if referring doctor selected)

### 3. Success Window
After registration, you'll see:
- ✅ Generated UHID
- 📱 QR Code for quick patient identification
- 📋 Complete patient details preview
- 💰 Fee breakdown with total amount

### 4. Patient Search
Use the Google-style search bar to find patients by:
- Patient name
- Phone number
- UHID

---

## 🎯 Key Features

- **User-Friendly UI**: Minimal clicks, intuitive design
- **Automatic Age Calculation**: From date of birth
- **Dynamic Fee Calculation**: Based on selected doctors
- **QR Code Generation**: For each patient UHID
- **Real-time Search**: Instant results as you type
- **Role-Based Access**: Secure authentication system

---

## 📊 Sample Data

The system comes pre-loaded with:

**5 Doctors:**
1. Dr. Rajesh Kumar - General Medicine (₹300)
2. Dr. Priya Sharma - Pediatrics (₹400)
3. Dr. Amit Patel - Cardiology (₹600)
4. Dr. Sneha Reddy - Gynecology (₹500)
5. Dr. Vikram Singh - Orthopedics (₹500)

**3 Referring Doctors:**
1. Dr. Suresh Menon - City Clinic
2. Dr. Lakshmi Iyer - Health Care Center
3. Dr. Ramesh Gupta - Community Hospital

---

## 🔧 Common Issues

### PostgreSQL Not Starting
```bash
brew services restart postgresql@14
```

### Port Already in Use
```bash
# Kill process on port 5000
lsof -i :5000
kill -9 <PID>

# Kill process on port 5173
lsof -i :5173
kill -9 <PID>
```

### Database Connection Error
Check your `.env` file settings:
```env
DB_USER=postgres
DB_HOST=localhost
DB_NAME=hospital_management
DB_PASSWORD=postgres
DB_PORT=5432
```

---

## 📱 Next Steps

After successful setup, you can:

1. **Register your first patient**
   - Go to "New Registration"
   - Fill in the form
   - See the UHID and QR code generation

2. **Explore the dashboard**
   - View statistics
   - Use the search function
   - Navigate between modules

3. **Customize settings**
   - Add more doctors
   - Create referring doctors
   - Adjust fees as needed

---

## 🏗️ Future Modules (Coming Soon)

- Inpatient Management
- Day Care
- Pharmacy
- Laboratory
- Accounts & Billing (with GST)
- HR Management
- Reports & Analytics

---

## 💡 Tips

- Use the search bar to quickly find existing patients before creating duplicates
- The system auto-detects existing patients by phone number
- QR codes can be printed on patient cards for quick check-in
- All fees are configurable per doctor
- The system maintains complete audit trails

---

## 📞 Support

If you encounter any issues:
1. Check the main README.md for detailed troubleshooting
2. Verify all prerequisites are installed
3. Check PostgreSQL is running
4. Ensure ports 5000 and 5173 are available

---

**Happy Hospital Management! 🏥**
