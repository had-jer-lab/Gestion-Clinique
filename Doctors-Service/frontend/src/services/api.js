// Configuration API
export const API_CONFIG = {
  USE_TAILSCALE: true,
  TAILSCALE_IPS: {
    auth_url: "http://100.119.228.76:5009",
    PATIENTS: "http://100.83.82.128:5001",
    DOCTORS: "http://100.95.250.126:5000",
    RDV: "http://100.125.192.97:5005"
  },
  LOCAL: {
    auth_url: "http://127.0.0.1:5009",
    PATIENTS: "http://127.0.0.1:5001",
    DOCTORS: "http://127.0.0.1:5000",
    RDV: "http://127.0.0.1:5005"
  }
};

export const getApiUrl = (service) => {
  const urls = API_CONFIG.USE_TAILSCALE ? API_CONFIG.TAILSCALE_IPS : API_CONFIG.LOCAL;
  return urls[service];
};

// Données mock
export const MOCK_DOCTORS = [
  { id: 101, name: "Brahimi", speciality: "Pédiatrie", status: "Disponible", patients: 450 },
  { id: 102, name: "Djaouadi", speciality: "Chirurgie Cardiaque", status: "En Consultation", patients: 120 },
  { id: 103, name: "Khaldi", speciality: "Neurologie", status: "Congé", patients: 320 },
  { id: 104, name: "Benali", speciality: "Médecine Générale", status: "Disponible", patients: 670 },
  { id: 105, name: "Haddad", speciality: "Dermatologie", status: "En Consultation", patients: 210 }
];

export const MOCK_APPOINTMENTS = [
  { id: 1, time: "09:00", date: "2025-01-20", patient: "Ali Mansouri", reason: "Contrôle de routine", doctor_id: 101, status: "Confirmé", patient_id: "P001" },
  { id: 2, time: "09:45", date: "2025-01-20", patient: "Fatima Zahraoui", reason: "Douleur thoracique", doctor_id: 102, status: "En attente", patient_id: "P002" },
  { id: 3, time: "10:30", date: "2025-01-21", patient: "Karim Bouzid", reason: "Éruption cutanée", doctor_id: 105, status: "Confirmé", patient_id: "P003" },
  { id: 4, time: "11:15", date: "2025-01-20", patient: "Amina Saidi", reason: "Fièvre et toux", doctor_id: 104, status: "Confirmé", patient_id: "P004" },
  { id: 5, time: "14:00", date: "2025-01-21", patient: "Omar El Idrissi", reason: "Mal de tête persistant", doctor_id: 104, status: "Confirmé", patient_id: "P005" }
];