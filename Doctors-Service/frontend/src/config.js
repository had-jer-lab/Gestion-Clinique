// src/config.js - Configuration centralisée pour le frontend

// Détection automatique de l'environnement
const isDevelopment = window.location.hostname === 'localhost' || 
                      window.location.hostname === '127.0.0.1';

// Configuration selon l'environnement
const API_URLS = {
  development: {
    DOCTORS: 'http://localhost:5000',
    PATIENTS: 'http://localhost:5001',
    RDV: 'http://localhost:5005',
    AUTH: 'http://localhost:5009'
  },
  production: {
    // En production Docker, utiliser les noms de services
    DOCTORS: window.location.origin,  // Utilise le domaine actuel
    PATIENTS: 'http://patients-backend:5001',
    RDV: 'http://rdv-backend:5005',
    AUTH: 'http://auth-service:5009'
  }
};

// Sélection de la config
const activeConfig = isDevelopment ? API_URLS.development : API_URLS.production;

// Export
export const API_URL = activeConfig.DOCTORS + '/api';
export const PATIENTS_URL = activeConfig.PATIENTS;
export const RDV_URL = activeConfig.RDV;
export const AUTH_URL = activeConfig.AUTH;

console.log('🔧 Frontend Config loaded:', {
  environment: isDevelopment ? 'DEVELOPMENT' : 'PRODUCTION',
  API_URL,
  PATIENTS_URL,
  RDV_URL,
  AUTH_URL
});

export default {
  API_URL,
  PATIENTS_URL,
  RDV_URL,
  AUTH_URL
};