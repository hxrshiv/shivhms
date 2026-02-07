import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Calendar, Users, UserPlus, Activity } from 'lucide-react';
import {
  getDashboardStats,
  getTodayAppointments,
  searchPatients,
} from '../services/api';

export default function Dashboard() {
  const [stats, setStats] = useState({
    todayAppointments: 0,
    availableDoctors: 0,
    todayRegistrations: 0,
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await getDashboardStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    
    if (query.trim().length < 2) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    try {
      const response = await searchPatients(query);
      setSearchResults(response.data);
      setShowResults(true);
    } catch (error) {
      console.error('Error searching:', error);
    }
  };

  const handlePatientSelect = (patient) => {
    setShowResults(false);
    setSearchQuery('');
    // Navigate to patient details or open in modal
    console.log('Selected patient:', patient);
  };

  return (
    <div>
      <div className="dashboard-header">
        <h1>Front Office Dashboard</h1>
        <p>Welcome back! Here's what's happening today.</p>
      </div>

      {/* Search Bar */}
      <div className="search-section">
        <div className="search-bar">
          <Search className="search-icon" size={20} />
          <input
            type="text"
            className="search-input"
            placeholder="Search patients by name, phone number, or UHID..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            onBlur={() => setTimeout(() => setShowResults(false), 200)}
            onFocus={() => searchQuery && setShowResults(true)}
          />
          
          {showResults && searchResults.length > 0 && (
            <div className="search-results">
              {searchResults.map((patient) => (
                <div
                  key={patient.id}
                  className="search-result-item"
                  onClick={() => handlePatientSelect(patient)}
                >
                  <h4>{patient.patient_name}</h4>
                  <p>
                    UHID: {patient.uhid} | Phone: {patient.phone} | Age: {patient.age}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Dashboard Tiles */}
      <div className="dashboard-tiles">
        <div className="tile" onClick={() => navigate('/appointments')}>
          <div className="tile-header">
            <div className="tile-icon primary">
              <Calendar size={24} />
            </div>
          </div>
          <div className="tile-content">
            <h3>Today's Appointments</h3>
            <div className="value">{stats.todayAppointments}</div>
          </div>
        </div>

        <div className="tile">
          <div className="tile-header">
            <div className="tile-icon success">
              <Users size={24} />
            </div>
          </div>
          <div className="tile-content">
            <h3>Available Doctors</h3>
            <div className="value">{stats.availableDoctors}</div>
          </div>
        </div>

        <div className="tile">
          <div className="tile-header">
            <div className="tile-icon warning">
              <Activity size={24} />
            </div>
          </div>
          <div className="tile-content">
            <h3>Today's Registrations</h3>
            <div className="value">{stats.todayRegistrations}</div>
          </div>
        </div>

        <div
          className="tile"
          onClick={() => navigate('/register')}
          style={{ cursor: 'pointer', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}
        >
          <div className="tile-header">
            <div className="tile-icon" style={{ background: 'rgba(255,255,255,0.2)' }}>
              <UserPlus size={24} />
            </div>
          </div>
          <div className="tile-content">
            <h3 style={{ color: 'white' }}>New Registration</h3>
            <div className="value" style={{ color: 'white' }}>Click to Start</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="form-container" style={{ marginTop: '2rem' }}>
        <div className="form-header">
          <h2>Quick Actions</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <button
            className="btn btn-primary"
            onClick={() => navigate('/register')}
          >
            <UserPlus size={20} />
            New Patient Registration
          </button>
          <button
            className="btn btn-outline"
            onClick={() => navigate('/appointments')}
          >
            <Calendar size={20} />
            View Appointments
          </button>
          <button
            className="btn btn-outline"
            onClick={() => navigate('/reports')}
          >
            <Activity size={20} />
            View Reports
          </button>
        </div>
      </div>
    </div>
  );
}
