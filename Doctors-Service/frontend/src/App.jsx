import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Calendar, UserCog, Home } from 'lucide-react';
import HomePage from './components/HomePage';
import ManageDoctors from './pages/ManageDoctors';
import DoctorSpace from './pages/DoctorSpace';
import EditDoctor from './pages/EditDoctor';
import PatientDetail from './pages/PatientDetail';

function Sidebar() {
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path);
  };

  // Ne pas afficher la sidebar sur la page d'accueil
  if (location.pathname === '/') {
    return null;
  }

  return (
    <aside className="sidebar bg-white w-64 p-4 flex flex-col h-screen fixed left-0 top-0 z-50 shadow-lg">
      <img 
        src="https://i.postimg.cc/BnDqVC0G/Gemini-Generated-Image-60401b60401b6040-removebg-preview.png" 
        className="logo-img w-48 mx-auto mb-5" 
        alt="Logo"
      />
      
      <nav className="flex-grow space-y-3">
        {/* Lien vers l'accueil */}
        <Link 
          to="/" 
          className={`sidebar-link flex items-center p-3 rounded-xl transition-all ${
            location.pathname === '/' ? 'active' : ''
          }`}
        >
          <Home className="w-5 h-5 mr-3" />
          Accueil
        </Link>

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
      </nav>
    </aside>
  );
}

// Composant wrapper pour appliquer le style correct
function LayoutWrapper({ children }) {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Sidebar />
      
      {/* Contenu principal avec marge conditionnelle */}
      <div 
        className="flex-grow transition-all duration-300"
        style={{ 
          marginLeft: isHomePage ? '0' : '16rem', // 256px = w-64
          width: isHomePage ? '100%' : 'calc(100% - 16rem)'
        }}
      >
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <LayoutWrapper>
        <Routes>
          {/* Page d'accueil (SANS sidebar) */}
          <Route path="/" element={<HomePage />} />
          
          {/* Pages avec sidebar */}
          <Route path="/manage-doctors" element={<ManageDoctors />} />
          <Route path="/doctor-space" element={<DoctorSpace />} />
          <Route path="/doctor/add" element={<EditDoctor />} />
          <Route path="/doctor/edit/:id" element={<EditDoctor />} />
          <Route path="/patient/:id" element={<PatientDetail />} />
          
          {/* Route par défaut */}
          <Route path="*" element={<HomePage />} />
        </Routes>
      </LayoutWrapper>
    </Router>
  );
}

export default App;