import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, X, CheckCircle, Plus } from 'lucide-react';
import {
  getDoctors,
  getReferringDoctors,
  registerPatient,
  createReferringDoctor,
} from '../services/api';

export default function PatientRegistration() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [referringDoctors, setReferringDoctors] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [registrationData, setRegistrationData] = useState(null);
  const [showNewReferringDoctor, setShowNewReferringDoctor] = useState(false);

  const [formData, setFormData] = useState({
    patient_name: '',
    dob: '',
    age: '',
    gender: 'Male',
    address: '',
    phone: '',
    aadhar_card: '',
    attender_name: '',
    attender_phone: '',
    doctor_id: '',
    referring_doctor_id: '',
  });

  const [newReferringDoctor, setNewReferringDoctor] = useState({
    name: '',
    hospital_clinic: '',
    phone: '',
    email: '',
    referral_fee: '250',
  });

  useEffect(() => {
    loadDoctors();
    loadReferringDoctors();
  }, []);

  const loadDoctors = async () => {
    try {
      const response = await getDoctors();
      setDoctors(response.data);
    } catch (error) {
      console.error('Error loading doctors:', error);
    }
  };

  const loadReferringDoctors = async () => {
    try {
      const response = await getReferringDoctors();
      setReferringDoctors(response.data);
    } catch (error) {
      console.error('Error loading referring doctors:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Auto-calculate age from DOB
    if (name === 'dob' && value) {
      const today = new Date();
      const birthDate = new Date(value);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      setFormData((prev) => ({ ...prev, age: age.toString() }));
    }
  };

  const handleNewReferringDoctorChange = (e) => {
    const { name, value } = e.target;
    setNewReferringDoctor((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateReferringDoctor = async () => {
    try {
      const response = await createReferringDoctor(newReferringDoctor);
      setReferringDoctors((prev) => [...prev, response.data]);
      setFormData((prev) => ({
        ...prev,
        referring_doctor_id: response.data.id.toString(),
      }));
      setShowNewReferringDoctor(false);
      setNewReferringDoctor({
        name: '',
        hospital_clinic: '',
        phone: '',
        email: '',
        referral_fee: '250',
      });
    } catch (error) {
      console.error('Error creating referring doctor:', error);
      alert('Failed to create referring doctor');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await registerPatient({
        ...formData,
        doctor_id: formData.doctor_id ? parseInt(formData.doctor_id) : null,
        referring_doctor_id: formData.referring_doctor_id
          ? parseInt(formData.referring_doctor_id)
          : null,
        age: parseInt(formData.age),
      });

      setRegistrationData(response.data.data);
      setShowSuccess(true);
    } catch (error) {
      console.error('Error registering patient:', error);
      alert('Failed to register patient. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleNewRegistration = () => {
    setShowSuccess(false);
    setRegistrationData(null);
    setFormData({
      patient_name: '',
      dob: '',
      age: '',
      gender: 'Male',
      address: '',
      phone: '',
      aadhar_card: '',
      attender_name: '',
      attender_phone: '',
      doctor_id: '',
      referring_doctor_id: '',
    });
  };

  if (showSuccess && registrationData) {
    return (
      <div className="modal-overlay">
        <div className="modal">
          <div className="modal-header">
            <h2>Registration Successful</h2>
            <button onClick={() => navigate('/dashboard')} style={{ border: 'none', background: 'none', cursor: 'pointer' }}>
              <X size={24} />
            </button>
          </div>
          <div className="modal-body">
            <div className="success-card">
              <div className="success-icon">
                <CheckCircle size={40} />
              </div>
              <h3>Patient Registered Successfully!</h3>
              <p>UHID has been generated and registration is complete.</p>

              {registrationData.qr_code && (
                <div className="qr-code-container">
                  <img src={registrationData.qr_code} alt="Patient QR Code" />
                  <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    Scan for patient details
                  </p>
                </div>
              )}

              <div className="patient-details">
                <div className="detail-row">
                  <span className="detail-label">UHID</span>
                  <span className="detail-value">{registrationData.uhid}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Patient Name</span>
                  <span className="detail-value">{registrationData.patient_name}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Age</span>
                  <span className="detail-value">{registrationData.age} years</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Phone</span>
                  <span className="detail-value">{registrationData.phone}</span>
                </div>
                {registrationData.doctor_name && (
                  <div className="detail-row">
                    <span className="detail-label">Consulting Doctor</span>
                    <span className="detail-value">{registrationData.doctor_name}</span>
                  </div>
                )}
                {registrationData.referring_doctor_name && (
                  <div className="detail-row">
                    <span className="detail-label">Referring Doctor</span>
                    <span className="detail-value">{registrationData.referring_doctor_name}</span>
                  </div>
                )}
                <div className="detail-row">
                  <span className="detail-label">Consulting Fee</span>
                  <span className="detail-value">₹{parseFloat(registrationData.consulting_fee).toFixed(2)}</span>
                </div>
                {registrationData.referral_fee > 0 && (
                  <div className="detail-row">
                    <span className="detail-label">Referral Fee</span>
                    <span className="detail-value">₹{parseFloat(registrationData.referral_fee).toFixed(2)}</span>
                  </div>
                )}
                <div className="detail-row" style={{ fontWeight: 'bold', fontSize: '1.125rem', borderTop: '2px solid var(--border)', paddingTop: '1rem', marginTop: '0.5rem' }}>
                  <span className="detail-label">Total Amount</span>
                  <span className="detail-value">₹{parseFloat(registrationData.total_amount).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-outline" onClick={() => navigate('/dashboard')}>
              Go to Dashboard
            </button>
            <button className="btn btn-primary" onClick={handleNewRegistration}>
              New Registration
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="dashboard-header">
        <h1>Patient Registration</h1>
        <p>Register new patient or create OP visit for existing patient</p>
      </div>

      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-header">
          <h2>Patient Information</h2>
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label className="form-label required">Patient Name</label>
            <input
              type="text"
              name="patient_name"
              className="form-input"
              value={formData.patient_name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label required">Date of Birth</label>
            <input
              type="date"
              name="dob"
              className="form-input"
              value={formData.dob}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label required">Age</label>
            <input
              type="number"
              name="age"
              className="form-input"
              value={formData.age}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label required">Gender</label>
            <select
              name="gender"
              className="form-select"
              value={formData.gender}
              onChange={handleInputChange}
              required
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label required">Phone Number</label>
            <input
              type="tel"
              name="phone"
              className="form-input"
              value={formData.phone}
              onChange={handleInputChange}
              pattern="[0-9]{10}"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Aadhar Card Number</label>
            <input
              type="text"
              name="aadhar_card"
              className="form-input"
              value={formData.aadhar_card}
              onChange={handleInputChange}
              pattern="[0-9]{12}"
              maxLength="12"
            />
          </div>

          <div className="form-group full-width">
            <label className="form-label">Address</label>
            <textarea
              name="address"
              className="form-textarea"
              value={formData.address}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="form-header" style={{ marginTop: '2rem' }}>
          <h2>Attender Information</h2>
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Attender Name</label>
            <input
              type="text"
              name="attender_name"
              className="form-input"
              value={formData.attender_name}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Attender Phone</label>
            <input
              type="tel"
              name="attender_phone"
              className="form-input"
              value={formData.attender_phone}
              onChange={handleInputChange}
              pattern="[0-9]{10}"
            />
          </div>
        </div>

        <div className="form-header" style={{ marginTop: '2rem' }}>
          <h2>Visit Information</h2>
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">OP Doctor</label>
            <select
              name="doctor_id"
              className="form-select"
              value={formData.doctor_id}
              onChange={handleInputChange}
            >
              <option value="">Select Doctor</option>
              {doctors.map((doctor) => (
                <option key={doctor.id} value={doctor.id}>
                  {doctor.name} - {doctor.specialization} (₹{doctor.consulting_fee})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Referring Doctor</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <select
                name="referring_doctor_id"
                className="form-select"
                value={formData.referring_doctor_id}
                onChange={handleInputChange}
                style={{ flex: 1 }}
              >
                <option value="">Select Referring Doctor</option>
                {referringDoctors.map((doctor) => (
                  <option key={doctor.id} value={doctor.id}>
                    {doctor.name} (₹{doctor.referral_fee})
                  </option>
                ))}
              </select>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setShowNewReferringDoctor(!showNewReferringDoctor)}
                title="Add New Referring Doctor"
              >
                <Plus size={20} />
              </button>
            </div>
          </div>
        </div>

        {showNewReferringDoctor && (
          <div style={{ background: 'var(--bg-tertiary)', padding: '1.5rem', borderRadius: '0.75rem', marginTop: '1rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>Add New Referring Doctor</h3>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label required">Name</label>
                <input
                  type="text"
                  name="name"
                  className="form-input"
                  value={newReferringDoctor.name}
                  onChange={handleNewReferringDoctorChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Hospital/Clinic</label>
                <input
                  type="text"
                  name="hospital_clinic"
                  className="form-input"
                  value={newReferringDoctor.hospital_clinic}
                  onChange={handleNewReferringDoctorChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  className="form-input"
                  value={newReferringDoctor.phone}
                  onChange={handleNewReferringDoctorChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  name="email"
                  className="form-input"
                  value={newReferringDoctor.email}
                  onChange={handleNewReferringDoctorChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Referral Fee (₹)</label>
                <input
                  type="number"
                  name="referral_fee"
                  className="form-input"
                  value={newReferringDoctor.referral_fee}
                  onChange={handleNewReferringDoctorChange}
                  step="0.01"
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowNewReferringDoctor(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-success"
                onClick={handleCreateReferringDoctor}
              >
                Create Referring Doctor
              </button>
            </div>
          </div>
        )}

        <div className="btn-group">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate('/dashboard')}
          >
            <X size={20} />
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            <Save size={20} />
            {loading ? 'Registering...' : 'Register Patient'}
          </button>
        </div>
      </form>
    </div>
  );
}
