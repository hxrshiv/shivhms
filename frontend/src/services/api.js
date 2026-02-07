import axios from 'axios';

const API_URL = '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth
export const login = (username, password) =>
  api.post('/auth/login', { username, password });

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// Doctors
export const getDoctors = () => api.get('/doctors');

// Referring Doctors
export const getReferringDoctors = () => api.get('/referring-doctors');
export const createReferringDoctor = (data) =>
  api.post('/referring-doctors', data);

// Patients
export const searchPatients = (query) =>
  api.get('/patients/search', { params: { query } });

export const getPatient = (uhid) => api.get(`/patients/${uhid}`);

export const registerPatient = (data) => api.post('/patients/register', data);

// Dashboard
export const getDashboardStats = () => api.get('/dashboard/stats');
export const getTodayAppointments = () => api.get('/appointments/today');
export const getRecentRegistrations = () => api.get('/registrations/recent');

export default api;
