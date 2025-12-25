import axios from 'axios';

// Determine API base URL based on environment
const getApiBaseUrl = () => {
  // In Docker, use the backend service name
  if (process.env.NODE_ENV === 'production') {
    return 'http://rdv-backend:5005/api';
  }
  // In development, use localhost or proxy
  return process.env.REACT_APP_API_URL || 'http://localhost:5005/api';
};

const API_BASE_URL = getApiBaseUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
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
  // Get all patients - with fallback for different environments
  getPatients: async (patientsUrl) => {
    try {
      // Handle both Docker internal and external URLs
      const url = patientsUrl.startsWith('http://patients-backend')
        ? patientsUrl
        : patientsUrl.replace('http://localhost', 'http://patients-backend');
      
      const response = await axios.get(`${url}/api/patients`, { 
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
  
  // Get all doctors - with fallback for different environments
  getDoctors: async (doctorsUrl) => {
    try {
      // Handle both Docker internal and external URLs
      const url = doctorsUrl.startsWith('http://doctors-service')
        ? doctorsUrl
        : doctorsUrl.replace('http://localhost', 'http://doctors-service');
      
      const response = await axios.get(`${url}/api/doctors`, { 
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