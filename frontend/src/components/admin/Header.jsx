import React from 'react';
import { Bell, Mail, ChevronDown, Menu } from 'lucide-react';

export default function AdminHeader({ onMenuClick }) {
  const userName = localStorage.getItem("userName") || "Admin";

  return (
    <header className="h-16 md:h-20 bg-white border-b border-gray-100 px-4 md:px-8 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <button onClick={onMenuClick} className="p-2 -ml-2 text-gray-400 hover:bg-gray-50 rounded-lg lg:hidden">
            <Menu size={24} />
        </button>
        <div className="hidden sm:block">
            <h1 className="text-lg md:text-xl font-bold text-gray-900">Hello, {userName}</h1>
            <p className="text-[10px] md:text-xs text-gray-400 font-medium tracking-wide uppercase">Welcome back to your workspace</p>
        </div>
      </div>

      <div className="flex items-center gap-6 ml-auto">
        <div className="flex items-center gap-3">
            <button className="p-2.5 text-gray-400 hover:text-black hover:bg-gray-50 rounded-xl transition-all relative">
                <Bell size={20} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <button className="p-2.5 text-gray-400 hover:text-black hover:bg-gray-50 rounded-xl transition-all relative">
                <Mail size={20} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full border-2 border-white"></span>
            </button>
        </div>

        <div className="flex items-center gap-3 pl-6 border-l border-gray-100 cursor-pointer group">
          <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-[#7F56D9] font-bold text-sm">
            {userName.charAt(0)}
          </div>
          <div className="hidden lg:block text-left">
            <p className="text-sm font-bold text-gray-900 leading-none">{userName}</p>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Super Admin</p>
          </div>
          <ChevronDown size={14} className="text-gray-400" />
        </div>
      </div>
    </header>
  );
}
