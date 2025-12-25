import React, { useState, useEffect } from 'react';
import { CalendarCheck, Info, Loader, Clock, User, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { API_URL, PATIENTS_URL } from '../config';
//const API_URL = 'http://localhost:5000/api';
//const PATIENTS_URL = 'http://100.83.82.128:5001';

function DoctorSpace() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);

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

  const getStatusConfig = (status) => {
    if (status === 'Confirmé' || status.toLowerCase().includes('confirm')) {
      return {
        className: 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border-green-200',
        icon: CheckCircle,
        iconColor: '#10b981'
      };
    }
    return {
      className: 'bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-700 border-amber-200',
      icon: AlertCircle,
      iconColor: '#f59e0b'
    };
  };

  return (
    <div className="min-h-screen p-8" style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%)' }}>
      <style>{`
        .appointment-card {
          background: white;
          border-radius: 16px;
          padding: 20px 24px;
          margin-bottom: 14px;
          border: 1px solid rgba(226, 232, 240, 0.6);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .appointment-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
          border-color: #06b6d4;
        }

        .time-badge {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: linear-gradient(135deg, #0891b2 0%, #06b6d4 100%);
          color: white;
          padding: 12px 20px;
          border-radius: 12px;
          font-size: 20px;
          font-weight: 800;
          min-width: 120px;
          box-shadow: 0 4px 12px rgba(6, 182, 212, 0.25);
        }

        .patient-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .patient-name {
          font-size: 17px;
          font-weight: 700;
          color: #0f172a;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .patient-name a {
          color: inherit;
          text-decoration: none;
          transition: color 0.2s;
        }

        .patient-name a:hover {
          color: #06b6d4;
        }

        .reason-text {
          font-size: 14px;
          color: #64748b;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .doctor-info {
          font-size: 15px;
          font-weight: 600;
          color: #0891b2;
          padding: 8px 16px;
          background: linear-gradient(135deg, #ecfeff 0%, #cffafe 100%);
          border-radius: 10px;
          border: 1px solid #a5f3fc;
        }

        .status-badge {
          padding: 8px 18px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border: 2px solid;
          display: flex;
          align-items: center;
          gap: 6px;
          min-width: 140px;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }

        .skeleton {
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: loading 1.5s infinite;
          border-radius: 16px;
          height: 90px;
          margin-bottom: 14px;
        }

        @keyframes loading {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .page-header {
          background: white;
          border-radius: 20px;
          padding: 32px;
          margin-bottom: 32px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
          border: 1px solid rgba(226, 232, 240, 0.6);
        }

        .header-title {
          font-size: 36px;
          font-weight: 900;
          background: linear-gradient(135deg, #0891b2 0%, #06b6d4 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .appointments-count {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
          color: white;
          padding: 8px 20px;
          border-radius: 20px;
          font-size: 16px;
          font-weight: 700;
          box-shadow: 0 4px 12px rgba(6, 182, 212, 0.25);
        }

        .empty-state {
          background: white;
          border-radius: 20px;
          padding: 80px 40px;
          text-align: center;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
          border: 2px dashed #cbd5e1;
        }

        .empty-state-icon {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 24px;
        }
      `}</style>

      <div className="page-header">
        <h1 className="header-title">
          <CalendarCheck size={40} style={{ color: '#06b6d4' }} />
          Espace Docteur
        </h1>
        <p style={{ fontSize: '16px', color: '#64748b', marginTop: '8px' }}>
          Gérez vos rendez-vous du jour en temps réel
        </p>
      </div>

      <div style={{ 
        background: 'white', 
        borderRadius: '20px', 
        padding: '32px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
        border: '1px solid rgba(226, 232, 240, 0.6)'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '28px',
          paddingBottom: '20px',
          borderBottom: '2px solid #f1f5f9'
        }}>
          <h2 style={{ 
            fontSize: '24px', 
            fontWeight: '800', 
            color: '#0f172a',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <Clock size={24} style={{ color: '#06b6d4' }} />
            Rendez-vous du Jour
          </h2>
          {loading ? (
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              color: '#06b6d4',
              fontSize: '14px',
              fontWeight: '600'
            }}>
              <Loader 
                size={20} 
                style={{ animation: 'spin 1s linear infinite' }} 
              />
              Chargement...
            </div>
          ) : (
            <span className="appointments-count">
              <CalendarCheck size={18} />
              {appointments.length} Rendez-vous
            </span>
          )}
        </div>

        {loading ? (
          <>
            <div className="skeleton"></div>
            <div className="skeleton"></div>
            <div className="skeleton"></div>
          </>
        ) : appointments.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <Info size={40} style={{ color: '#94a3b8' }} />
            </div>
            <h3 style={{ 
              fontSize: '20px', 
              fontWeight: '700', 
              color: '#475569',
              marginBottom: '8px'
            }}>
              Aucun rendez-vous prévu
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '15px' }}>
              Il n'y a pas de rendez-vous programmés pour aujourd'hui.
            </p>
          </div>
        ) : (
          appointments.map((appt, index) => {
            const statusConfig = getStatusConfig(appt.status);
            const StatusIcon = statusConfig.icon;

            return (
              <div key={index} className="appointment-card">
                <div className="time-badge">
                  <Clock size={20} />
                  {appt.time}
                </div>

                <div className="patient-info">
                  <div className="patient-name">
                    <User size={18} style={{ color: '#06b6d4' }} />
                    {appt.patient_id && appt.patient_id !== 'INCONNU' ? (
                      <a 
                        href={`${PATIENTS_URL}/patient/${appt.patient_id}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        {appt.patient}
                      </a>
                    ) : (
                      <span style={{ color: '#64748b' }}>{appt.patient}</span>
                    )}
                  </div>
                  <div className="reason-text">
                    <FileText size={16} style={{ color: '#94a3b8' }} />
                    {appt.reason}
                  </div>
                </div>

                <div className="doctor-info">
                  {appt.doctor_name}
                </div>

                <div className={`status-badge ${statusConfig.className}`}>
                  <StatusIcon size={16} style={{ color: statusConfig.iconColor }} />
                  {appt.status}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default DoctorSpace;