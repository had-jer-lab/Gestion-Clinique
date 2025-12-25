import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config';
//const API_URL = 'http://localhost:5000/api';

function PatientDetail() {
  const { id } = useParams();
  const [patientData, setPatientData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPatientData();
  }, [id]);

  const fetchPatientData = async () => {
    try {
      const response = await axios.get(`${API_URL}/patient/${id}`);
      setPatientData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching patient data:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Chargement...</div>;
  }

  if (!patientData) {
    return <div className="text-center py-8">Patient non trouvé</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white p-8 rounded-xl shadow-xl mb-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Détails du Patient</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">ID Patient</p>
            <p className="text-lg font-semibold">{patientData.patient.id}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Nom</p>
            <p className="text-lg font-semibold">
              {typeof patientData.patient === 'string' ? patientData.patient : patientData.patient.nom || 'N/A'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PatientDetail;