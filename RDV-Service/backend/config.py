import os

# Check if running in Docker
USE_DOCKER = os.getenv('USE_DOCKER', 'false').lower() in ['true', '1', 'yes']

if USE_DOCKER:
    # Docker service names - استخدام الأسماء الصحيحة من docker-compose
    AUTH_URL = os.getenv('AUTH_URL', 'http://auth-service:5009')
    PATIENTS_URL = os.getenv('PATIENTS_URL', 'http://patients-backend:5001')
    DOCTORS_URL = os.getenv('DOCTORS_URL', 'http://doctors-service:5000')
    RDV_URL = 'http://rdv-backend:5005'
else:
    # Local development with localhost
    AUTH_URL = os.getenv('AUTH_URL', 'http://localhost:5009')
    PATIENTS_URL = os.getenv('PATIENTS_URL', 'http://localhost:5001')
    DOCTORS_URL = os.getenv('DOCTORS_URL', 'http://localhost:5000')
    RDV_URL = os.getenv('RDV_URL', 'http://localhost:5005')

# Port configuration
PORTS = {
    "RDV": 5005
}

# Database configuration
DATABASE_URI = os.getenv('DATABASE_URI', 'sqlite:///clinique.db')
SECRET_KEY = os.getenv('SECRET_KEY', 'clinique2025')

# Print configuration for debugging
print(f"🚀 RDV-Service Configuration:")
print(f"  - USE_DOCKER: {USE_DOCKER}")
print(f"  - AUTH_URL: {AUTH_URL}")
print(f"  - PATIENTS_URL: {PATIENTS_URL}")
print(f"  - DOCTORS_URL: {DOCTORS_URL}")
print(f"  - RDV_URL: {RDV_URL}")