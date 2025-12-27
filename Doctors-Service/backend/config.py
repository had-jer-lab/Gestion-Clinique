import os

# ===================================================
# Configuration partagée pour le microservice Doctors
# ===================================================

# Détection automatique de l'environnement
USE_DOCKER = os.getenv('USE_DOCKER', 'false').lower() == 'true'

# URLs en développement local
LOCAL_URLS = {
    "AUTH": "http://127.0.0.1:5009",
    "PATIENTS": "http://127.0.0.1:5001",
    "DOCTORS": "http://127.0.0.1:5000",
    "RDV": "http://127.0.0.1:5005",
}

# URLs avec Docker (noms de conteneurs)
DOCKER_URLS = {
    "AUTH": "http://auth-service:5009",
    "PATIENTS": "http://patients-backend:5001",
    "DOCTORS": "http://doctors-service:5000",
    "RDV": "http://rdv-backend:5005",
}

# Sélection de la configuration selon l'environnement
if USE_DOCKER:
    print("🐳 Mode DOCKER activé")
    AUTH_URL = os.getenv('AUTH_URL', DOCKER_URLS["AUTH"])
    PATIENTS_URL = os.getenv('PATIENTS_URL', DOCKER_URLS["PATIENTS"])
    DOCTORS_URL = os.getenv('DOCTORS_URL', DOCKER_URLS["DOCTORS"])
    RDV_URL = os.getenv('RDV_URL', DOCKER_URLS["RDV"])
else:
    print("💻 Mode DÉVELOPPEMENT LOCAL activé")
    AUTH_URL = LOCAL_URLS["AUTH"]
    PATIENTS_URL = LOCAL_URLS["PATIENTS"]
    DOCTORS_URL = LOCAL_URLS["DOCTORS"]
    RDV_URL = LOCAL_URLS["RDV"]

print(f"📍 Configuration chargée:")
print(f"   - AUTH_URL: {AUTH_URL}")
print(f"   - PATIENTS_URL: {PATIENTS_URL}")
print(f"   - DOCTORS_URL: {DOCTORS_URL}")
print(f"   - RDV_URL: {RDV_URL}")