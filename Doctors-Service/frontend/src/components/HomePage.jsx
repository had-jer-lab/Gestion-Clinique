import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Users, 
  UserCheck, 
  BarChart3, 
  Shield, 
  FileText, 
  MessageSquare, 
  HeartPulse,
  Activity,
  ClipboardList
} from 'lucide-react';

function HomePage() {
  const navigate = useNavigate();

  const mainFeatures = [
    {
      title: 'Gestion des Médecins',
      description: 'Gérez les médecins, leurs spécialités et disponibilités',
      icon: UserCheck,
      color: '#06b6d4',
      path: '/manage-doctors'
    },
    {
      title: 'Gestion des Rendez-vous',
      description: 'Planifiez et suivez tous les rendez-vous médicaux',
      icon: Calendar,
      color: '#10b981',
      path: '/doctor-space'
    },
    {
      title: 'Gestion des Patients',
      description: 'Historique médical et informations des patients',
      icon: Users,
      color: '#f59e0b',
      path: '#'
    }
  ];

  const engagements = [
    {
      title: 'Sécurité des données',
      description: 'Vos données médicales sont protégées par cryptage avancé',
      icon: Shield
    },
    {
      title: 'Accès aux spécialistes',
      description: 'Connectez-vous avec des médecins qualifiés rapidement',
      icon: HeartPulse
    },
    {
      title: 'Suivi personnalisé',
      description: 'Suivez votre santé avec des outils adaptés à vos besoins',
      icon: Activity
    },
    {
      title: 'Recommandations ciblées',
      description: 'Recevez des conseils personnalisés basés sur votre historique',
      icon: ClipboardList
    },
    {
      title: 'Communication simplifiée',
      description: 'Échangez facilement avec votre équipe médicale',
      icon: MessageSquare
    },
    {
      title: 'Support réactif',
      description: 'Notre équipe est disponible 24/7 pour vous assister',
      icon: FileText
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Hero Section */}
      <div 
        className="relative bg-cover bg-center h-96 flex items-center justify-center"
        style={{
          backgroundImage: 'linear-gradient(rgba(15, 23, 42, 0.7), rgba(15, 23, 42, 0.7)), url("https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200")',
        }}
      >
        <div className="text-center text-white px-4 max-w-4xl">
          <h1 className="text-5xl font-extrabold mb-6">
            Simplifiez la Gestion de Votre Clinique
          </h1>
          <p className="text-xl mb-8 text-slate-200">
            Une plateforme complète pour gérer vos médecins, patients, rendez-vous et suivre votre activité en temps réel.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <button
              onClick={() => navigate('/manage-doctors')}
              className="bg-cyan-500 hover:bg-cyan-600 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Commencer Maintenant
            </button>
            <button
              onClick={() => navigate('/doctor-space')}
              className="bg-white hover:bg-slate-100 text-slate-800 px-8 py-3 rounded-lg font-semibold text-lg transition-all shadow-lg hover:shadow-xl transform hover:scale-105 border-2 border-white"
            >
              Explorer les RDV
            </button>
          </div>
        </div>
      </div>

      {/* Main Features Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {mainFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                onClick={() => navigate(feature.path)}
                className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer group hover:-translate-y-2 border-t-4"
                style={{ borderTopColor: feature.color }}
              >
                <div 
                  className="w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"
                  style={{ backgroundColor: feature.color + '20' }}
                >
                  <Icon size={32} style={{ color: feature.color }} />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Engagements Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-extrabold text-center text-slate-800 mb-12">
            Nos Engagements
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {engagements.map((engagement, index) => {
              const Icon = engagement.icon;
              return (
                <div
                  key={index}
                  className="bg-slate-50 rounded-xl p-6 hover:bg-cyan-50 transition-all duration-300 border border-slate-200 hover:border-cyan-300 hover:shadow-lg"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="w-14 h-14 bg-cyan-100 rounded-full flex items-center justify-center mb-4">
                      <Icon size={28} className="text-cyan-600" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 mb-2">
                      {engagement.title}
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      {engagement.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Dashboard Preview Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-cyan-500 to-blue-600 rounded-3xl p-12 text-white text-center shadow-2xl">
          <BarChart3 size={64} className="mx-auto mb-6" />
          <h2 className="text-4xl font-extrabold mb-4">
            Tableau de Bord Complet
          </h2>
          <p className="text-xl mb-8 text-cyan-50 max-w-2xl mx-auto">
            Visualisez toutes vos statistiques en temps réel : patients, revenus, rendez-vous et bien plus encore.
          </p>
          <button
            onClick={() => navigate('/')}
            className="bg-white text-cyan-600 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-slate-100 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Voir le Tableau de Bord
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-400">
            © 2025 Gestion Médicale - Tous droits réservés
          </p>
          <p className="text-slate-500 text-sm mt-2">
            Simplifiant la gestion des cliniques médicales
          </p>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;