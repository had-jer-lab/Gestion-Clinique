import axios from 'axios';

// استخدام window.location.hostname للحصول على الـ hostname الحالي
const getApiBaseUrl = () => {
  const hostname = window.location.hostname;
  // في حالة Development (localhost/127.0.0.1)
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return process.env.REACT_APP_API_URL || 'http://localhost:5005/api';
  }
  // في حالة Production/Docker - استخدام نفس الـ hostname مع port 5005
  return `http://${hostname}:5005/api`;
};

const API_BASE_URL = getApiBaseUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Add response interceptor for better error handling
api.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error.response || error.message);
    return Promise.reject(error);
  }
);

// ========================
// RENDEZ-VOUS API
// ========================

export const rdvAPI = {
  // Get all appointments
  getAll: () => api.get('/rdv'),
  
  // Get specific appointment
  getById: (id) => api.get(`/rdv/${id}`),
  
  // Create new appointment
  create: (data) => api.post('/rdv', data),
  
  // Update appointment
  update: (id, data) => api.put(`/rdv/${id}`, data),
  
  // Delete appointment
  delete: (id) => api.delete(`/rdv/${id}`),
  
  // Get today's appointments
  getToday: () => api.get('/rdv/today'),
  
  // Get last appointment for patient
  getLastByPatient: (patientId) => api.get(`/rdv/patient/${patientId}/last`),
};

// ========================
// FACTURES API
// ========================

export const facturesAPI = {
  // Get all invoices
  getAll: () => api.get('/factures'),
  
  // Get specific invoice
  getById: (id) => api.get(`/factures/${id}`),
  
  // Create new invoice
  create: (data) => api.post('/factures', data),
  
  // Update invoice
  update: (id, data) => api.put(`/factures/${id}`, data),
  
  // Delete invoice
  delete: (id) => api.delete(`/factures/${id}`),
  
  // Get invoices by patient
  getByPatient: (patientId) => api.get(`/factures/patient/${patientId}`),
};

// ========================
// STATS API
// ========================

export const statsAPI = {
  // Get current year stats
  getCurrent: () => api.get('/stats'),
  
  // Get historical stats
  getHistorique: () => api.get('/stats/historique'),
};

// ========================
// CONFIG API
// ========================

export const configAPI = {
  // Get external service URLs
  getConfig: () => api.get('/config'),
};

// ========================
// EXTERNAL SERVICES API
// ========================

export const externalAPI = {
  // Get all patients - استخدام hostname ديناميكي
  getPatients: async (patientsUrl) => {
    try {
      const hostname = window.location.hostname;
      const url = (hostname === 'localhost' || hostname === '127.0.0.1')
        ? 'http://localhost:5001/api/patients'
        : `http://${hostname}:5001/api/patients`;
      
      const response = await axios.get(url, { 
        timeout: 5000,
        headers: {
          'Accept': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch patients:', error.message);
      return [];
    }
  },
  
  // Get all doctors - استخدام hostname ديناميكي
  getDoctors: async (doctorsUrl) => {
    try {
      const hostname = window.location.hostname;
      const url = (hostname === 'localhost' || hostname === '127.0.0.1')
        ? 'http://localhost:5000/api/doctors'
        : `http://${hostname}:5000/api/doctors`;
      
      const response = await axios.get(url, { 
        timeout: 5000,
        headers: {
          'Accept': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch doctors:', error.message);
      return [];
    }
  },
};

export default api;