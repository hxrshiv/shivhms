import { FileText } from 'lucide-react';

export default function Reports() {
  return (
    <div>
      <div className="dashboard-header">
        <h1>Reports</h1>
        <p>View daily registrations, revenue reports, and patient statistics</p>
      </div>

      <div className="form-container">
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <FileText size={64} color="var(--text-secondary)" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ marginBottom: '0.5rem' }}>Reports Module</h3>
          <p style={{ color: 'var(--text-secondary)' }}>
            This feature will display registration reports, revenue analytics, and patient visit statistics.
          </p>
        </div>
      </div>
    </div>
  );
}
