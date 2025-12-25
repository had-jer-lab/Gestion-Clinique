import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Calendar, UserCog, Home, ArrowLeft } from 'lucide-react';
import ManageDoctors from './pages/ManageDoctors';
import DoctorSpace from './pages/DoctorSpace';
import EditDoctor from './pages/EditDoctor';
import PatientDetail from './pages/PatientDetail';

function Sidebar() {
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path);
  };

  return (
    <aside className="sidebar bg-white w-64 p-4 flex flex-col h-screen fixed left-0 top-0 z-50 shadow-lg">
      <img 
        src="https://i.postimg.cc/BnDqVC0G/Gemini-Generated-Image-60401b60401b6040-removebg-preview.png" 
        className="logo-img w-48 mx-auto mb-5" 
        alt="Logo"
      />
      
      <nav className="flex-grow space-y-3">
        {/* Lien vers la page d'accueil principale (Auth Service) */}
        <a 
          href="http://localhost:5009/"
          className="sidebar-link flex items-center p-3 rounded-xl transition-all"
        >
          <Home className="w-5 h-5 mr-3" />
          Accueil Principal
        </a>

        {/* Gestion Médecins */}
        <Link 
          to="/manage-doctors" 
          className={`sidebar-link flex items-center p-3 rounded-xl transition-all ${
            isActive('/manage-doctors') || isActive('/doctor/') ? 'active' : ''
          }`}
        >
          <UserCog className="w-5 h-5 mr-3" />
          Gestion Médecins
        </Link>

        {/* Espace Docteur */}
        <Link 
          to="/doctor-space" 
          className={`sidebar-link flex items-center p-3 rounded-xl transition-all ${
            isActive('/doctor-space') ? 'active' : ''
          }`}
        >
          <Calendar className="w-5 h-5 mr-3" />
          Espace Docteur
        </Link>

        {/* Liens vers autres services */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-xs text-gray-500 uppercase font-semibold mb-3 px-3">Autres Services</p>
          
          <a 
            href="http://localhost:5001"
            className="sidebar-link flex items-center p-3 rounded-xl transition-all"
          >
            👥 Patients
          </a>

          <a 
            href="http://localhost:5005"
            className="sidebar-link flex items-center p-3 rounded-xl transition-all"
          >
            📅 Rendez-vous
          </a>
        </div>
      </nav>
    </aside>
  );
}

function App() {
  return (
    <Router>
      <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <Sidebar />
        
        <div 
          className="flex-grow transition-all duration-300"
          style={{ 
            marginLeft: '16rem',
            width: 'calc(100% - 16rem)'
          }}
        >
          <main className="p-8">
            <Routes>
              <Route path="/" element={<ManageDoctors />} />
              <Route path="/manage-doctors" element={<ManageDoctors />} />
              <Route path="/doctor-space" element={<DoctorSpace />} />
              <Route path="/doctor/add" element={<EditDoctor />} />
              <Route path="/doctor/edit/:id" element={<EditDoctor />} />
              <Route path="/patient/:id" element={<PatientDetail />} />
              
              {/* Route par défaut */}
              <Route path="*" element={<ManageDoctors />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;