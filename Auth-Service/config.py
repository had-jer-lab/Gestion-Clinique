// ===================================================
// Configuration partagée pour tous les microservices
// ===================================================

// Détection automatique de l'environnement
const isDevelopment = window.location.hostname === 'localhost' || 
                      window.location.hostname === '127.0.0.1';

// URLs des services en développement (localhost)
const DEV_URLS = {
  AUTH: 'http://localhost:5009',
  PATIENTS: 'http://localhost:5001',
  DOCTORS: 'http://localhost:5000',
  DOCTORS_FRONTEND: 'http://localhost:3000',
  RDV: 'http://localhost:5005'
};

// URLs des services avec Tailscale
const TAILSCALE_URLS = {
  AUTH: 'http://100.119.228.76:5009',
  PATIENTS: 'http://100.83.82.128:5001',
  DOCTORS: 'http://100.95.250.126:5000',
  DOCTORS_FRONTEND: 'http://100.95.250.126:3000',
  RDV: 'http://100.125.192.97:5005'
};

// URLs des services avec Docker
const DOCKER_URLS = {
  AUTH: 'http://auth-service:5009',
  PATIENTS: 'http://patients-service:5001',
  DOCTORS: 'http://doctors-service:5000',
  DOCTORS_FRONTEND: 'http://doctors-frontend:3000',
  RDV: 'http://rdv-backend:5005'
};

// Sélection de la configuration selon l'environnement
let ACTIVE_URLS = DEV_URLS;

// Vous pouvez changer ceci manuellement selon votre environnement
const ENVIRONMENT = 'development'; // 'development' | 'tailscale' | 'docker'

switch(ENVIRONMENT) {
  case 'tailscale':
    ACTIVE_URLS = TAILSCALE_URLS;
    break;
  case 'docker':
    ACTIVE_URLS = DOCKER_URLS;
    break;
  default:
    ACTIVE_URLS = DEV_URLS;
}

// Export de la configuration
export const CONFIG = {
  ENVIRONMENT,
  URLS: ACTIVE_URLS,
  
  // Helper functions
  getServiceUrl: (serviceName) => {
    return ACTIVE_URLS[serviceName.toUpperCase()] || ACTIVE_URLS.AUTH;
  },
  
  // Navigation helpers
  goToService: (serviceName) => {
    const url = ACTIVE_URLS[serviceName.toUpperCase()];
    if (url) {
      window.location.href = url;
    } else {
      console.error(`Service ${serviceName} not found`);
    }
  },
  
  goToHome: () => {
    window.location.href = ACTIVE_URLS.AUTH;
  }
};

export default CONFIG;