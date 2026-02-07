-- Hospital Management System Database Schema

-- Users and Authentication
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(200) NOT NULL,
    role VARCHAR(50) NOT NULL, -- admin, front_office, doctor, pharmacy, lab, accounts, hr
    email VARCHAR(100),
    phone VARCHAR(20),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Doctors
CREATE TABLE IF NOT EXISTS doctors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    specialization VARCHAR(100),
    qualification VARCHAR(200),
    phone VARCHAR(20),
    email VARCHAR(100),
    consulting_fee DECIMAL(10,2) DEFAULT 300.00,
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Referring Doctors
CREATE TABLE IF NOT EXISTS referring_doctors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    hospital_clinic VARCHAR(200),
    phone VARCHAR(20),
    email VARCHAR(100),
    referral_fee DECIMAL(10,2) DEFAULT 250.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Patients
CREATE TABLE IF NOT EXISTS patients (
    id SERIAL PRIMARY KEY,
    uhid VARCHAR(20) UNIQUE NOT NULL,
    patient_name VARCHAR(200) NOT NULL,
    dob DATE NOT NULL,
    age INTEGER,
    gender VARCHAR(10),
    address TEXT,
    phone VARCHAR(20) NOT NULL,
    aadhar_card VARCHAR(12),
    attender_name VARCHAR(200),
    attender_phone VARCHAR(20),
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES users(id),
    qr_code TEXT
);

-- Patient Registrations (OP Visits)
CREATE TABLE IF NOT EXISTS patient_registrations (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER REFERENCES patients(id) NOT NULL,
    uhid VARCHAR(20) NOT NULL,
    visit_type VARCHAR(20) DEFAULT 'OP', -- OP, IP, Daycare
    doctor_id INTEGER REFERENCES doctors(id),
    referring_doctor_id INTEGER REFERENCES referring_doctors(id),
    consulting_fee DECIMAL(10,2) DEFAULT 300.00,
    referral_fee DECIMAL(10,2) DEFAULT 0.00,
    total_amount DECIMAL(10,2),
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'registered', -- registered, consulted, completed
    created_by INTEGER REFERENCES users(id)
);

-- Appointments
CREATE TABLE IF NOT EXISTS appointments (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER REFERENCES patients(id) NOT NULL,
    uhid VARCHAR(20) NOT NULL,
    doctor_id INTEGER REFERENCES doctors(id) NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time TIME,
    status VARCHAR(20) DEFAULT 'scheduled', -- scheduled, completed, cancelled, no_show
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default admin user (password: admin123)
INSERT INTO users (username, password, full_name, role, email) 
VALUES ('admin', '$2a$10$N9qo8uLOickgx2ZMRZoMye.IjzHUKp4sXYK5FvYVOBGEOp8zxY7Ju', 'System Administrator', 'admin', 'admin@hospital.com')
ON CONFLICT (username) DO NOTHING;

-- Insert sample doctors
INSERT INTO doctors (name, specialization, qualification, phone, consulting_fee) VALUES
('Dr. Rajesh Kumar', 'General Medicine', 'MBBS, MD', '9876543210', 300.00),
('Dr. Priya Sharma', 'Pediatrics', 'MBBS, DCH', '9876543211', 400.00),
('Dr. Amit Patel', 'Cardiology', 'MBBS, DM Cardiology', '9876543212', 600.00),
('Dr. Sneha Reddy', 'Gynecology', 'MBBS, MS', '9876543213', 500.00),
('Dr. Vikram Singh', 'Orthopedics', 'MBBS, MS Ortho', '9876543214', 500.00)
ON CONFLICT DO NOTHING;

-- Insert sample referring doctors
INSERT INTO referring_doctors (name, hospital_clinic, phone, referral_fee) VALUES
('Dr. Suresh Menon', 'City Clinic', '9876543220', 250.00),
('Dr. Lakshmi Iyer', 'Health Care Center', '9876543221', 250.00),
('Dr. Ramesh Gupta', 'Community Hospital', '9876543222', 250.00)
ON CONFLICT DO NOTHING;

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_patients_uhid ON patients(uhid);
CREATE INDEX IF NOT EXISTS idx_patients_phone ON patients(phone);
CREATE INDEX IF NOT EXISTS idx_patients_name ON patients(patient_name);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_registrations_date ON patient_registrations(registration_date);
