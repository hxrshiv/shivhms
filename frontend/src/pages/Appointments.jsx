import { Calendar } from 'lucide-react';

export default function Appointments() {
  return (
    <div>
      <div className="dashboard-header">
        <h1>Appointments</h1>
        <p>Manage and view patient appointments</p>
      </div>

      <div className="form-container">
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <Calendar size={64} color="var(--text-secondary)" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ marginBottom: '0.5rem' }}>Appointments Module</h3>
          <p style={{ color: 'var(--text-secondary)' }}>
            This feature will display today's appointments, upcoming schedules, and allow booking new appointments.
          </p>
        </div>
      </div>
    </div>
  );
}
