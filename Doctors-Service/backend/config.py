import os

# ===================================================
# Configuration partagée pour le microservice Doctors
# ===================================================

# Détection automatique de l'environnement
USE_DOCKER = os.getenv('USE_DOCKER', 'false').lower() == 'true'
USE_TAILSCALE = os.getenv('USE_TAILSCALE', 'false').lower() == 'true'

# URLs des services avec Tailscale
TAILSCALE_IPS = {
    "AUTH": "http://100.119.228.76:5009",
    "PATIENTS": "http://100.83.82.128:5001",
    "DOCTORS": "http://100.95.250.126:5000",
    "RDV": "http://100.125.192.97:5005",
}

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
    AUTH_URL = DOCKER_URLS["AUTH"]
    PATIENTS_URL = DOCKER_URLS["PATIENTS"]
    DOCTORS_URL = DOCKER_URLS["DOCTORS"]
    RDV_URL = DOCKER_URLS["RDV"]
elif USE_TAILSCALE:
    print("🔗 Mode TAILSCALE activé")
    AUTH_URL = TAILSCALE_IPS["AUTH"]
    PATIENTS_URL = TAILSCALE_IPS["PATIENTS"]
    DOCTORS_URL = TAILSCALE_IPS["DOCTORS"]
    RDV_URL = TAILSCALE_IPS["RDV"]
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