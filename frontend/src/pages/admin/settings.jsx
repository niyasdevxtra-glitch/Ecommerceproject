import React from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { Settings, Shield, Bell, Globe, Palette } from 'lucide-react';

export default function AdminSettings() {
  const settingsGroups = [
    { title: 'General', icon: <Globe size={20} />, desc: 'Site title, logo, and metadata' },
    { title: 'Security', icon: <Shield size={20} />, desc: 'Authentication and API keys' },
    { title: 'Appearance', icon: <Palette size={20} />, desc: 'Theme colors and typography' },
    { title: 'Notifications', icon: <Bell size={20} />, desc: 'Email and push notification alerts' },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-black text-gray-900">System Settings</h2>
          <p className="text-sm text-gray-500 font-medium">Configure your platform behavior and branding</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {settingsGroups.map((group) => (
                <div key={group.title} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer group">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gray-50 text-gray-400 rounded-2xl flex items-center justify-center group-hover:bg-[#7F56D9] group-hover:text-white transition-all">
                            {group.icon}
                        </div>
                        <div className="flex-1">
                            <h3 className="font-black text-gray-900">{group.title}</h3>
                            <p className="text-xs text-gray-500 font-medium mt-1 uppercase tracking-tight">{group.desc}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>

        <div className="bg-[#7F56D9]/5 border border-[#7F56D9]/10 p-8 rounded-3xl">
            <h4 className="text-sm font-black text-[#7F56D9] uppercase tracking-widest mb-2">Advanced Control</h4>
            <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600 font-medium">Site maintenance mode is currently <span className="text-green-600 font-black">OFF</span></p>
                <div className="w-12 h-6 bg-gray-200 rounded-full relative shadow-inner">
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                </div>
            </div>
        </div>
      </div>
    </AdminLayout>
  );
}
