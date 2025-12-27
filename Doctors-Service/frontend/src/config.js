// src/config.js - Configuration centralisée pour le frontend

// Détection de l'environnement
const isProduction = import.meta.env.PROD;
const isDevelopment = import.meta.env.DEV;

// Configuration selon l'environnement
const API_URLS = {
  development: {
    DOCTORS: 'http://localhost:5000',
    PATIENTS: 'http://localhost:5001',
    RDV: 'http://localhost:5005',
    AUTH: 'http://localhost:5009'
  },
  production: {
    // En production Docker, utiliser les variables d'environnement ou les noms de services
    DOCTORS: import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://doctors-service:5000',
    PATIENTS: import.meta.env.VITE_PATIENTS_URL || 'http://patients-backend:5001',
    RDV: import.meta.env.VITE_RDV_URL || 'http://rdv-backend:5005',
    AUTH: import.meta.env.VITE_AUTH_URL || 'http://auth-service:5009'
  }
};

// Sélection de la config - utilise NGINX proxy en production
const getApiBaseUrl = () => {
  if (isDevelopment) {
    return API_URLS.development;
  }
  
  // En production avec Docker, on utilise le reverse proxy nginx ou les URLs relatives
  // Si on accède depuis le navigateur, on utilise l'origine actuelle
  const origin = window.location.origin;
  return {
    DOCTORS: `${origin}`,  // NGINX proxy vers doctors-service
    PATIENTS: 'http://localhost:5001',  // Accès externe
    RDV: 'http://localhost:5005',       // Accès externe
    AUTH: 'http://localhost:5009'       // Accès externe
  };
};

const activeConfig = getApiBaseUrl();

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