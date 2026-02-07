import express from 'express';
import cors from 'cors';
import pg from 'pg';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import QRCode from 'qrcode';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;
const app = express();
const PORT = process.env.PORT || 5000;

// Database connection
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'hospital_management',
  password: process.env.DB_PASSWORD || 'postgres',
  port: process.env.DB_PORT || 5432,
});

// Middleware
app.use(cors());
app.use(express.json());

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Auth Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access denied' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Generate UHID
function generateUHID() {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `HOS${year}${month}${random}`;
}

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const result = await pool.query(
      'SELECT * FROM users WHERE username = $1 AND is_active = true',
      [username]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        full_name: user.full_name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all doctors
app.get('/api/doctors', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM doctors WHERE is_available = true ORDER BY name'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching doctors:', error);
    res.status(500).json({ error: 'Failed to fetch doctors' });
  }
});

// Get all referring doctors
app.get('/api/referring-doctors', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM referring_doctors ORDER BY name'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching referring doctors:', error);
    res.status(500).json({ error: 'Failed to fetch referring doctors' });
  }
});

// Create new referring doctor
app.post('/api/referring-doctors', authenticateToken, async (req, res) => {
  try {
    const { name, hospital_clinic, phone, email, referral_fee } = req.body;

    const result = await pool.query(
      `INSERT INTO referring_doctors (name, hospital_clinic, phone, email, referral_fee) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [name, hospital_clinic, phone, email, referral_fee || 250.00]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating referring doctor:', error);
    res.status(500).json({ error: 'Failed to create referring doctor' });
  }
});

// Search patients
app.get('/api/patients/search', authenticateToken, async (req, res) => {
  try {
    const { query } = req.query;

    if (!query || query.trim().length < 2) {
      return res.json([]);
    }

    const result = await pool.query(
      `SELECT * FROM patients 
       WHERE LOWER(patient_name) LIKE LOWER($1) 
       OR phone LIKE $1 
       OR uhid LIKE UPPER($1)
       ORDER BY registration_date DESC
       LIMIT 20`,
      [`%${query}%`]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error searching patients:', error);
    res.status(500).json({ error: 'Failed to search patients' });
  }
});

// Get patient by UHID
app.get('/api/patients/:uhid', authenticateToken, async (req, res) => {
  try {
    const { uhid } = req.params;

    const result = await pool.query(
      'SELECT * FROM patients WHERE uhid = $1',
      [uhid]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching patient:', error);
    res.status(500).json({ error: 'Failed to fetch patient' });
  }
});

// Register new patient
app.post('/api/patients/register', authenticateToken, async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    const {
      patient_name,
      dob,
      age,
      gender,
      address,
      phone,
      aadhar_card,
      attender_name,
      attender_phone,
      doctor_id,
      referring_doctor_id,
    } = req.body;

    // Check if patient already exists by phone
    const existingPatient = await client.query(
      'SELECT * FROM patients WHERE phone = $1',
      [phone]
    );

    let patient;
    let isNewPatient = true;

    if (existingPatient.rows.length > 0) {
      // Existing patient
      patient = existingPatient.rows[0];
      isNewPatient = false;
    } else {
      // Generate UHID
      let uhid;
      let isUnique = false;
      
      while (!isUnique) {
        uhid = generateUHID();
        const checkUhid = await client.query(
          'SELECT uhid FROM patients WHERE uhid = $1',
          [uhid]
        );
        if (checkUhid.rows.length === 0) {
          isUnique = true;
        }
      }

      // Generate QR Code
      const qrData = JSON.stringify({
        uhid,
        name: patient_name,
        phone,
      });
      const qrCode = await QRCode.toDataURL(qrData);

      // Insert new patient
      const patientResult = await client.query(
        `INSERT INTO patients 
         (uhid, patient_name, dob, age, gender, address, phone, aadhar_card, 
          attender_name, attender_phone, created_by, qr_code)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
         RETURNING *`,
        [
          uhid,
          patient_name,
          dob,
          age,
          gender,
          address,
          phone,
          aadhar_card,
          attender_name,
          attender_phone,
          req.user.id,
          qrCode,
        ]
      );

      patient = patientResult.rows[0];
    }

    // Get doctor and referring doctor fees
    let consulting_fee = 300.00;
    let referral_fee = 0.00;

    if (doctor_id) {
      const doctorResult = await client.query(
        'SELECT consulting_fee FROM doctors WHERE id = $1',
        [doctor_id]
      );
      if (doctorResult.rows.length > 0) {
        consulting_fee = doctorResult.rows[0].consulting_fee;
      }
    }

    if (referring_doctor_id) {
      const refDoctorResult = await client.query(
        'SELECT referral_fee FROM referring_doctors WHERE id = $1',
        [referring_doctor_id]
      );
      if (refDoctorResult.rows.length > 0) {
        referral_fee = refDoctorResult.rows[0].referral_fee;
      }
    }

    const total_amount = parseFloat(consulting_fee) + parseFloat(referral_fee);

    // Create registration record
    const registrationResult = await client.query(
      `INSERT INTO patient_registrations 
       (patient_id, uhid, doctor_id, referring_doctor_id, consulting_fee, 
        referral_fee, total_amount, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        patient.id,
        patient.uhid,
        doctor_id || null,
        referring_doctor_id || null,
        consulting_fee,
        referral_fee,
        total_amount,
        req.user.id,
      ]
    );

    await client.query('COMMIT');

    // Fetch complete data with doctor details
    const completeData = await pool.query(
      `SELECT 
        p.*,
        pr.id as registration_id,
        pr.consulting_fee,
        pr.referral_fee,
        pr.total_amount,
        pr.registration_date,
        d.name as doctor_name,
        d.specialization,
        rd.name as referring_doctor_name
       FROM patients p
       LEFT JOIN patient_registrations pr ON p.id = pr.patient_id
       LEFT JOIN doctors d ON pr.doctor_id = d.id
       LEFT JOIN referring_doctors rd ON pr.referring_doctor_id = rd.id
       WHERE pr.id = $1`,
      [registrationResult.rows[0].id]
    );

    res.status(201).json({
      success: true,
      isNewPatient,
      data: completeData.rows[0],
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error registering patient:', error);
    res.status(500).json({ error: 'Failed to register patient' });
  } finally {
    client.release();
  }
});

// Get today's appointments
app.get('/api/appointments/today', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
        a.*,
        p.patient_name,
        p.phone,
        p.uhid,
        d.name as doctor_name,
        d.specialization
       FROM appointments a
       JOIN patients p ON a.patient_id = p.id
       JOIN doctors d ON a.doctor_id = d.id
       WHERE a.appointment_date = CURRENT_DATE
       ORDER BY a.appointment_time`,
      []
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching today appointments:', error);
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
});

// Get dashboard stats
app.get('/api/dashboard/stats', authenticateToken, async (req, res) => {
  try {
    const todayAppointments = await pool.query(
      `SELECT COUNT(*) as count FROM appointments 
       WHERE appointment_date = CURRENT_DATE AND status = 'scheduled'`
    );

    const availableDoctors = await pool.query(
      `SELECT COUNT(*) as count FROM doctors WHERE is_available = true`
    );

    const todayRegistrations = await pool.query(
      `SELECT COUNT(*) as count FROM patient_registrations 
       WHERE DATE(registration_date) = CURRENT_DATE`
    );

    res.json({
      todayAppointments: parseInt(todayAppointments.rows[0].count),
      availableDoctors: parseInt(availableDoctors.rows[0].count),
      todayRegistrations: parseInt(todayRegistrations.rows[0].count),
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// Get recent registrations
app.get('/api/registrations/recent', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
        pr.*,
        p.patient_name,
        p.phone,
        p.uhid,
        d.name as doctor_name,
        rd.name as referring_doctor_name
       FROM patient_registrations pr
       JOIN patients p ON pr.patient_id = p.id
       LEFT JOIN doctors d ON pr.doctor_id = d.id
       LEFT JOIN referring_doctors rd ON pr.referring_doctor_id = rd.id
       WHERE DATE(pr.registration_date) = CURRENT_DATE
       ORDER BY pr.registration_date DESC
       LIMIT 10`
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching recent registrations:', error);
    res.status(500).json({ error: 'Failed to fetch registrations' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Hospital Management System API' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API: http://localhost:${PORT}/api`);
});
