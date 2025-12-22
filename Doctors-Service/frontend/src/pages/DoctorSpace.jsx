import React, { useState, useEffect } from 'react';
import { CalendarCheck, Info, Loader } from 'lucide-react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';
const PATIENTS_URL = 'http://100.83.82.128:5001';

function DoctorSpace() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false); // Changed to false initially

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/appointments`);
      setAppointments(response.data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusClass = (status) => {
    if (status === 'Confirmé' || status.toLowerCase().includes('confirm')) {
      return 'confirmed';
    }
    return 'pending';
  };

  return (
    <div className="page-container">
      <style>{`
        .page-container { padding: 40px; min-height: 100vh; }
        .page-title { font-size: 36px; font-weight: 900; color: #1e3a8a; margin-bottom: 30px; }
        .card { background: #ffffff; border-radius: 16px; padding: 35px; box-shadow: 0 15px 40px rgba(30, 58, 138, 0.08); border-top: 5px solid #06b6d4; }
        .rdv-item { display: flex; justify-content: space-between; align-items: center; padding: 18px 20px; border-radius: 10px; background: #f8fafc; border-left: 5px solid transparent; margin-bottom: 12px; transition: .3s; }
        .rdv-item:hover { border-left: 5px solid #06b6d4; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
        .time { font-size: 22px; font-weight: 800; color: #1e3a8a; width: 80px; }
        .patient { font-size: 18px; font-weight: 700; color: #1e293b; }
        .patient a { color: inherit; text-decoration: none; }
        .patient a:hover { color: #06b6d4; }
        .reason { font-size: 14px; color: #64748b; margin-top: 2px; }
        .doctor { font-size: 15px; font-weight: 600; color: #1e3a8a; }
        .status { padding: 6px 16px; border-radius: 20px; font-size: 13px; font-weight: 700; white-space: nowrap; text-transform: uppercase; letter-spacing: 0.5px; }
        .confirmed { background: #ecfdf5; color: #059669; border: 1px solid #a7f3d0; }
        .pending { background: #fef2f2; color: #ef4444; border: 1px solid #fecaca; }
        .skeleton { 
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: loading 1.5s infinite;
          border-radius: 10px;
          height: 70px;
          margin-bottom: 12px;
        }
        @keyframes loading {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        .inline-loader {
          display: inline-block;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>

      <div className="page-title">Espace Docteur</div>

      <div className="card">
        <h2 className="text-2xl font-extrabold mb-6 flex items-center text-gray-700">
          <CalendarCheck className="mr-3 text-2xl" style={{ color: '#06b6d4' }} />
          Rendez-vous du Jour 
          {loading ? (
            <Loader className="ml-3 w-5 h-5 inline-loader" style={{ color: '#06b6d4' }} />
          ) : (
            <span className="ml-2">({appointments.length})</span>
          )}
        </h2>

        {loading ? (
          // Skeleton loader - shows while fetching
          <>
            <div className="skeleton"></div>
            <div className="skeleton"></div>
            <div className="skeleton"></div>
          </>
        ) : appointments.length === 0 ? (
          <div className="rdv-item justify-center text-gray-500 font-medium">
            <Info className="w-5 h-5 mr-2" />
            Aucun rendez-vous trouvé pour aujourd'hui.
          </div>
        ) : (
          appointments.map((appt, index) => (
            <div key={index} className="rdv-item">
              <div className="time">{appt.time}</div>
              <div className="flex-grow mx-4">
                <div className="patient">
                  {appt.patient_id && appt.patient_id !== 'INCONNU' ? (
                    <a href={`${PATIENTS_URL}/patient/${appt.patient_id}`} target="_blank" rel="noopener noreferrer">
                      {appt.patient}
                    </a>
                  ) : (
                    <span style={{ color: '#64748b' }}>{appt.patient}</span>
                  )}
                </div>
                <div className="reason">{appt.reason}</div>
              </div>
              <div className="doctor mr-4">{appt.doctor_name}</div>
              <div className={`status ${getStatusClass(appt.status)}`}>{appt.status}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default DoctorSpace;