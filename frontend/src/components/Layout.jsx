import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { Home, UserPlus, Calendar, FileText, LogOut } from 'lucide-react';
import { logout } from '../services/api';

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: Home },
    { path: '/register', label: 'New Registration', icon: UserPlus },
    { path: '/appointments', label: 'Appointments', icon: Calendar },
    { path: '/reports', label: 'Reports', icon: FileText },
  ];

  return (
    <div className="app-layout">
      <div className="sidebar">
        <div className="sidebar-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Hospital size={32} color="#2563eb" />
            <div>
              <h2>Hospital HMS</h2>
              <p>Front Office Module</p>
            </div>
          </div>
        </div>

        <nav className="nav-menu">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <div
                key={item.path}
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={() => navigate(item.path)}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </div>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div style={{ marginBottom: '1rem', padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: '0.5rem' }}>
            <div style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.25rem' }}>
              {user.full_name}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              {user.role}
            </div>
          </div>
          <div className="nav-item" onClick={handleLogout}>
            <LogOut size={20} />
            <span>Logout</span>
          </div>
        </div>
      </div>

      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
}
