import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Plus, Edit, Trash2 } from 'lucide-react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

function ManageDoctors() {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/doctors`);
      setDoctors(response.data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce médecin ?')) {
      return;
    }

    setDeletingId(id);
    try {
      await axios.delete(`${API_URL}/doctors/${id}`);
      setDoctors(doctors.filter(d => d.id !== id));
    } catch (error) {
      console.error('Error deleting doctor:', error);
      alert('Erreur lors de la suppression du médecin');
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (id) => {
    navigate(`/doctor/edit/${id}`);
  };

  const handleAdd = () => {
    navigate('/doctor/add');
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Disponible':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'En Consultation':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Congé':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="p-8">
      <style>{`
        .skeleton-row {
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: loading 1.5s infinite;
          border-radius: 8px;
          height: 60px;
        }
        @keyframes loading {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center">
          <Users className="mr-3 text-teal-500" />
          Liste des Médecins ({doctors.length})
        </h1>
        <button
          onClick={handleAdd}
          className="flex items-center px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors shadow-md"
        >
          <Plus className="w-5 h-5 mr-2" />
          Ajouter un Médecin
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nom
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Spécialité
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statut
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Patients
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              // Skeleton loading rows
              <>
                <tr><td colSpan="5" className="px-6 py-4"><div className="skeleton-row"></div></td></tr>
                <tr><td colSpan="5" className="px-6 py-4"><div className="skeleton-row"></div></td></tr>
                <tr><td colSpan="5" className="px-6 py-4"><div className="skeleton-row"></div></td></tr>
              </>
            ) : doctors.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                  Aucun médecin trouvé. Cliquez sur "Ajouter un Médecin" pour commencer.
                </td>
              </tr>
            ) : (
              doctors.map((doctor) => (
                <tr key={doctor.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-teal-100 rounded-full flex items-center justify-center">
                        <span className="text-teal-600 font-semibold">
                          {doctor.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          Dr. {doctor.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{doctor.speciality}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getStatusBadgeClass(doctor.status)}`}>
                      {doctor.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {doctor.patients || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEdit(doctor.id)}
                      className="text-teal-600 hover:text-teal-900 mr-4 inline-flex items-center"
                      title="Modifier"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Modifier
                    </button>
                    <button
                      onClick={() => handleDelete(doctor.id)}
                      disabled={deletingId === doctor.id}
                      className="text-red-600 hover:text-red-900 inline-flex items-center disabled:opacity-50"
                      title="Supprimer"
                    >
                      {deletingId === doctor.id ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600 mr-1"></div>
                          Suppression...
                        </>
                      ) : (
                        <>
                          <Trash2 className="w-4 h-4 mr-1" />
                          Supprimer
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ManageDoctors;