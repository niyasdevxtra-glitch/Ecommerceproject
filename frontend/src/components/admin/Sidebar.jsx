import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  ShoppingBag, 
  CreditCard, 
  ListOrdered, 
  Briefcase, 
  Settings, 
  LogOut,
  Layers,
  X
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const SIDEBAR_ITEMS = [
  { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/admin/dashboard' },
  { name: 'User Management', icon: <Users size={20} />, path: '/admin/customers' },
  { name: 'Products', icon: <ShoppingBag size={20} />, path: '/admin/products' },
  { name: 'Categories', icon: <Layers size={20} />, path: '/admin/categories' },
  { name: 'Payments', icon: <CreditCard size={20} />, path: '/admin/payments' },
  { name: 'Orders', icon: <ListOrdered size={20} />, path: '/admin/orders' },
  { name: 'Banners', icon: <Briefcase size={20} />, path: '/admin/banners' },
];

export default function AdminSidebar({ onClose }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="w-full h-full bg-white border-r border-gray-100 flex flex-col">
      <div className="p-6">
        <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
                <span className="text-2xl font-black tracking-tighter text-black">PIXEL</span>
                <span className="w-1.5 h-1.5 bg-accent rounded-full mb-1"></span>
            </div>
            {onClose && (
                <button onClick={onClose} className="lg:hidden p-2 text-gray-400 hover:bg-gray-50 rounded-lg">
                    <X size={20} />
                </button>
            )}
        </div>

        <nav className="space-y-1">
          {SIDEBAR_ITEMS.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                location.pathname === item.path 
                  ? 'bg-[#7F56D9] text-white shadow-lg shadow-purple-200' 
                  : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              {item.icon}
              {item.name}
            </Link>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-6">
        <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 w-full text-sm font-semibold text-red-500 hover:bg-red-50 rounded-xl transition-all">
          <LogOut size={20} />
          Log Out
        </button>
      </div>
    </aside>
  );
}
