import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

function EditDoctor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    name: '',
    speciality: '',
    status: 'Disponible',
    patients: 0
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEditMode) {
      fetchDoctor();
    }
  }, [id]);

  const fetchDoctor = async () => {
    try {
      const response = await axios.get(`${API_URL}/doctors/${id}`);
      setFormData(response.data);
    } catch (error) {
      console.error('Error fetching doctor:', error);
      setError('Erreur lors du chargement du médecin');
      setTimeout(() => navigate('/manage-doctors'), 2000);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'patients' ? parseInt(value) || 0 : value
    }));
    setError(''); // Clear error on change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    
    // Validation supplémentaire
    if (!formData.name || !formData.name.trim()) {
      setError('Le nom du médecin est obligatoire');
      setSaving(false);
      return;
    }

    if (!formData.speciality || !formData.speciality.trim()) {
      setError('La spécialité est obligatoire');
      setSaving(false);
      return;
    }
    
    try {
      console.log('=== DÉBUT DE LA REQUÊTE ===');
      console.log('Mode:', isEditMode ? 'ÉDITION' : 'AJOUT');
      console.log('URL:', isEditMode ? `${API_URL}/doctors/${id}` : `${API_URL}/doctors`);
      console.log('Données envoyées:', formData);
      
      let response;
      if (isEditMode) {
        response = await axios.put(`${API_URL}/doctors/${id}`, formData, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
      } else {
        response = await axios.post(`${API_URL}/doctors`, formData, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
      }
      
      console.log('=== SUCCÈS ===');
      console.log('Réponse:', response.data);
      
      // Petit délai pour que l'utilisateur voie le succès
      setTimeout(() => {
        navigate('/manage-doctors');
      }, 500);
      
    } catch (error) {
      console.error('=== ERREUR ===');
      console.error('Error complet:', error);
      console.error('Error response:', error.response);
      console.error('Error response data:', error.response?.data);
      console.error('Error response status:', error.response?.status);
      
      let errorMessage = 'Erreur lors de la sauvegarde du médecin';
      
      if (error.response) {
        // Le serveur a répondu avec un code d'erreur
        errorMessage = error.response.data?.error || errorMessage;
      } else if (error.request) {
        // La requête a été envoyée mais pas de réponse
        errorMessage = 'Impossible de contacter le serveur (port 5000). Vérifiez que Flask est démarré.';
      } else {
        // Erreur lors de la configuration de la requête
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      setSaving(false);
    }
  };

  const handleCancel = (e) => {
    e.preventDefault();
    navigate('/manage-doctors');
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-2xl mt-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        {isEditMode ? `Modifier Dr. ${formData.name || '...'}` : 'Ajouter un nouveau Médecin'}
      </h2>

      {/* Error Alert */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          <p className="font-semibold">❌ {error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Nom du Médecin *
          </label>
          <input
            type="text"
            name="name"
            id="name"
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500"
            value={formData.name}
            onChange={handleChange}
            placeholder="Ex: Benali"
            disabled={saving}
          />
        </div>

        <div>
          <label htmlFor="speciality" className="block text-sm font-medium text-gray-700">
            Spécialité *
          </label>
          <input
            type="text"
            name="speciality"
            id="speciality"
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500"
            value={formData.speciality}
            onChange={handleChange}
            placeholder="Ex: Médecine Générale"
            disabled={saving}
          />
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">
            Statut Actuel
          </label>
          <select
            name="status"
            id="status"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-white focus:outline-none focus:ring-teal-500 focus:border-teal-500"
            value={formData.status}
            onChange={handleChange}
            disabled={saving}
          >
            <option value="Disponible">Disponible</option>
            <option value="En Consultation">En Consultation</option>
            <option value="Congé">Congé</option>
          </select>
        </div>

        {isEditMode && (
          <div>
            <label htmlFor="patients" className="block text-sm font-medium text-gray-700">
              Patients (Total)
            </label>
            <input
              type="number"
              name="patients"
              id="patients"
              min="0"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500"
              value={formData.patients}
              onChange={handleChange}
              placeholder="0"
              disabled={saving}
            />
          </div>
        )}

        <div className="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            onClick={handleCancel}
            disabled={saving}
            className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={saving}
            className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-slate-800 bg-teal-400 hover:bg-teal-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-slate-800 mr-2"></div>
                Sauvegarde...
              </>
            ) : (
              'Sauvegarder'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditDoctor;