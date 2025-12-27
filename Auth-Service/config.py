import os

# ===================================================
# Configuration partagée pour tous les microservices
# ===================================================

# Détection de l'environnement
USE_DOCKER = os.getenv('USE_DOCKER', 'false').lower() == 'true'

# URLs des services en développement (localhost)
DEV_URLS = {
    'AUTH': 'http://localhost:5009',
    'PATIENTS': 'http://localhost:5001',
    'DOCTORS': 'http://localhost:5000',
    'DOCTORS_FRONTEND': 'http://localhost:3000',
    'RDV': 'http://localhost:5005'
}

# URLs des services avec Docker (noms de conteneurs)
DOCKER_URLS = {
    'AUTH': 'http://auth-service:5009',
    'PATIENTS': 'http://patients-backend:5001',
    'DOCTORS': 'http://doctors-service:5000',
    'DOCTORS_FRONTEND': 'http://doctors-frontend:3000',
    'RDV': 'http://rdv-backend:5005'
}

# Sélection automatique selon l'environnement
ACTIVE_URLS = DOCKER_URLS if USE_DOCKER else DEV_URLS

# Export des URLs pour utilisation dans l'application
AUTH_URL = ACTIVE_URLS['AUTH']
PATIENTS_URL = ACTIVE_URLS['PATIENTS']
DOCTORS_URL = ACTIVE_URLS['DOCTORS']
DOCTORS_FRONTEND_URL = ACTIVE_URLS['DOCTORS_FRONTEND']
RDV_URL = ACTIVE_URLS['RDV']

# Configuration de la base de données
DATABASE_URI = os.getenv('DATABASE_URI', 'sqlite:///instance/base.db')
SECRET_KEY = os.getenv('SECRET_KEY', 'clinique2025')

print(f"🔧 Configuration chargée - Mode: {'DOCKER' if USE_DOCKER else 'DEVELOPMENT'}")
print(f"📍 AUTH_URL: {AUTH_URL}")
print(f"📍 PATIENTS_URL: {PATIENTS_URL}")
print(f"📍 DOCTORS_URL: {DOCTORS_URL}")
print(f"📍 RDV_URL: {RDV_URL}")