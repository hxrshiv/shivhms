# Hospital Management System - Front Office Module

A comprehensive hospital management system built with React (Vite), Node.js, Express, and PostgreSQL. This module handles patient registration, appointments, doctor management, and billing with Indian tax law compliance.

## Features

### Front Office Module
- ✅ Patient Registration with UHID generation
- ✅ Aadhar card integration
- ✅ OP Doctor selection from dropdown
- ✅ Referring doctor management (select or create new)
- ✅ Automatic fee calculation (Consulting: ₹300, Referral: ₹250)
- ✅ QR code generation for patient UHID
- ✅ Google-style search for patients (name, phone, UHID)
- ✅ Dashboard with real-time statistics
- ✅ Today's appointments overview
- ✅ Available doctors tracking
- ✅ Registration success window with preview

### Technical Features
- User authentication with JWT
- Role-based access control
- Responsive modern UI/UX
- PostgreSQL database backend
- RESTful API architecture
- QR code generation for patient identification

## Tech Stack

**Frontend:**
- React 18 with Vite
- React Router for navigation
- Axios for API calls
- Lucide React for icons
- Modern CSS with custom variables

**Backend:**
- Node.js with Express
- PostgreSQL database
- JWT authentication
- bcryptjs for password hashing
- QRCode generation

## Prerequisites for Mac

1. **Node.js** (v18 or higher)
   ```bash
   # Install using Homebrew
   brew install node
   ```

2. **PostgreSQL** (v14 or higher)
   ```bash
   # Install using Homebrew
   brew install postgresql@14
   
   # Start PostgreSQL service
   brew services start postgresql@14
   ```

3. **Git** (usually pre-installed on Mac)
   ```bash
   git --version
   ```

## Installation Guide

### Step 1: Database Setup

1. Start PostgreSQL (if not already running):
   ```bash
   brew services start postgresql@14
   ```

2. Create the database:
   ```bash
   # Connect to PostgreSQL
   psql postgres
   
   # Inside psql, run:
   CREATE DATABASE hospital_management;
   
   # Create a user (optional, or use default 'postgres')
   CREATE USER hospital_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE hospital_management TO hospital_user;
   
   # Exit psql
   \q
   ```

3. Import the schema:
   ```bash
   psql -U postgres -d hospital_management -f schema.sql
   ```

### Step 2: Backend Setup

1. Install backend dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables:
   - Edit the `.env` file with your database credentials:
   ```env
   DB_USER=postgres
   DB_HOST=localhost
   DB_NAME=hospital_management
   DB_PASSWORD=your_password
   DB_PORT=5432
   PORT=5000
   JWT_SECRET=your-super-secret-jwt-key-change-this
   ```

3. Start the backend server:
   ```bash
   npm start
   ```
   
   The API will be available at `http://localhost:5000`

### Step 3: Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install frontend dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   
   The application will be available at `http://localhost:5173`

## Default Login Credentials

```
Username: admin
Password: admin123
```

## Usage Guide

### Patient Registration

1. Click on "New Registration" tile or button
2. Fill in patient details:
   - **Required:** Name, DOB, Age, Gender, Phone
   - **Optional:** Address, Aadhar Card, Attender details
3. Select OP Doctor from dropdown
4. Select or create referring doctor
5. System automatically calculates fees:
   - Consulting fee: Based on selected doctor (default ₹300)
   - Referral fee: If referring doctor selected (default ₹250)
6. Click "Register Patient"
7. Success window shows:
   - Generated UHID with QR code
   - Patient details preview
   - Fee breakdown
   - Total amount

### Search Patients

1. Use the large search bar on dashboard
2. Search by:
   - Patient name (partial match)
   - Phone number
   - UHID
3. Results appear in real-time
4. Click on result to view details

### Dashboard Overview

The dashboard displays:
- **Today's Appointments:** Count of scheduled appointments
- **Available Doctors:** Number of active doctors
- **Today's Registrations:** New patient registrations today
- **Quick Actions:** Fast access to common tasks

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login

### Doctors
- `GET /api/doctors` - Get all available doctors
- `GET /api/referring-doctors` - Get all referring doctors
- `POST /api/referring-doctors` - Create new referring doctor

### Patients
- `GET /api/patients/search?query=` - Search patients
- `GET /api/patients/:uhid` - Get patient by UHID
- `POST /api/patients/register` - Register new patient

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/appointments/today` - Get today's appointments
- `GET /api/registrations/recent` - Get recent registrations

## Database Schema

### Main Tables
- **users** - System users and authentication
- **doctors** - Hospital doctors with specializations
- **referring_doctors** - External referring doctors
- **patients** - Patient master data with UHID
- **patient_registrations** - OP/IP visit records
- **appointments** - Scheduled appointments

## Project Structure

```
hospital-management-system/
├── backend/
│   ├── server.js              # Express server
│   ├── package.json           # Backend dependencies
│   ├── schema.sql             # Database schema
│   └── .env                   # Environment variables
├── frontend/
│   ├── src/
│   │   ├── components/        # React components
│   │   │   └── Layout.jsx
│   │   ├── pages/            # Page components
│   │   │   ├── Login.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── PatientRegistration.jsx
│   │   │   ├── Appointments.jsx
│   │   │   └── Reports.jsx
│   │   ├── services/         # API services
│   │   │   └── api.js
│   │   ├── App.jsx           # Main app component
│   │   ├── main.jsx          # Entry point
│   │   └── index.css         # Global styles
│   ├── package.json          # Frontend dependencies
│   ├── vite.config.js        # Vite configuration
│   └── index.html            # HTML template
└── README.md                 # This file
```

## Development

### Running in Development Mode

1. **Backend** (Terminal 1):
   ```bash
   npm start
   ```

2. **Frontend** (Terminal 2):
   ```bash
   cd frontend
   npm run dev
   ```

### Building for Production

1. **Frontend Build:**
   ```bash
   cd frontend
   npm run build
   ```
   Build files will be in `frontend/dist/`

2. **Backend Production:**
   - Use process manager like PM2
   - Set NODE_ENV=production
   - Configure proper database credentials

## Troubleshooting

### PostgreSQL Connection Issues
```bash
# Check if PostgreSQL is running
brew services list

# Restart PostgreSQL
brew services restart postgresql@14

# Check PostgreSQL logs
tail -f /usr/local/var/log/postgresql@14.log
```

### Port Already in Use
```bash
# Find process using port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>
```

### Database Permission Issues
```bash
# Connect to PostgreSQL as superuser
psql postgres

# Grant permissions
GRANT ALL PRIVILEGES ON DATABASE hospital_management TO postgres;
```

## Future Enhancements

- [ ] Inpatient management module
- [ ] Day care management
- [ ] Pharmacy integration
- [ ] Laboratory module
- [ ] Billing and accounts with GST
- [ ] HR management
- [ ] Inventory management
- [ ] Report generation with charts
- [ ] WhatsApp/SMS notifications
- [ ] Online appointment booking
- [ ] EMR/EHR integration
- [ ] Insurance claim management

## Security Notes

1. Change the JWT_SECRET in production
2. Use strong database passwords
3. Enable HTTPS in production
4. Implement rate limiting
5. Add input validation and sanitization
6. Regular security audits
7. Keep dependencies updated

## Support

For issues and questions:
1. Check the troubleshooting section
2. Review API documentation
3. Check database logs
4. Verify environment variables

## License

This project is for educational and hospital management purposes.

## Contributors

Built for comprehensive hospital management with focus on Indian healthcare requirements and tax compliance.
