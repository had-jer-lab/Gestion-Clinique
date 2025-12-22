// frontend/components/Sidebar.jsx
import { Link, useLocation } from 'react-router-dom';
import { Users, Calendar, Stethoscope } from 'lucide-react';
import './Sidebar.css'; // تأكد من استيراد ملف CSS

function Sidebar() {
  const location = useLocation();

  const menuItems = [
    { path: '/gestion-medecins', label: 'Gestion Médecins', icon: Users },
    { path: '/espace-docteur', label: 'Espace Docteur', icon: Calendar }
  ];

  return (
    // هنا نستخدم فقط فئة 'sidebar' لتقليل التكرار
    <aside className="sidebar w-64 bg-white flex flex-col h-full sticky top-0">
      <div className="h-16 flex items-center justify-center border-b border-gray-200">
        <div className="flex items-center gap-2">
          {/* اللون التركواز هو اللون الأصلي للرمز في base.html */}
          <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center"> 
            <Stethoscope className="w-6 h-6 text-white" />
          </div>
          <span className="font-bold text-xl text-gray-800">MediCare</span>
        </div>
      </div>

      <nav className="flex-1 py-6 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              // نستخدم الفئات المخصصة في CSS مع التنسيق الشرطي
              className={`sidebar-link flex items-center gap-3 ${isActive ? 'active' : ''}`}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

export default Sidebar;