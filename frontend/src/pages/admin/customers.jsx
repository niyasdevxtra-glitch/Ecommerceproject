import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import API from '../../services/api';
import { User, Trash2, Shield, UserCheck, Edit2, X, Check } from 'lucide-react';

export default function AdminCustomers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({ role: '', status: '', password: '' });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await API.get('/admin/users');
      // Backend returns { message, userlist }
      setUsers(res.data.userlist || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (user) => {
    setEditingUser(user._id);
    setEditForm({ role: user.role, status: user.status || 'active', password: '' });
  };

  const handleUpdateUser = async (id) => {
    try {
      const payload = { role: editForm.role, status: editForm.status };
      if (editForm.password) payload.password = editForm.password;

      const res = await API.put(`/admin/users/${id}`, payload);
      if (res.data.success) {
        setEditingUser(null);
        fetchUsers();
      }
    } catch (err) {
      console.error("Error updating user:", err);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-gray-900">User Management</h2>
            <p className="text-sm text-gray-500 font-medium">Manage roles, credentials, and access levels</p>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">User Profile</th>
                  <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Role</th>
                  <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                  <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  <tr><td colSpan="4" className="px-8 py-16 text-center text-gray-400 font-bold italic">Scanning database for entities...</td></tr>
                ) : users.length === 0 ? (
                  <tr><td colSpan="4" className="px-8 py-16 text-center text-gray-400 font-bold italic">No users matching criteria.</td></tr>
                ) : users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50/30 transition-colors">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-[#7F56D9] flex items-center justify-center text-white font-black text-lg shadow-sm">
                          {user.username?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-black text-gray-900">{user.username}</p>
                          <p className="text-xs text-gray-400 font-medium">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      {editingUser === user._id ? (
                        <select 
                          value={editForm.role}
                          onChange={(e) => setEditForm({...editForm, role: e.target.value})}
                          className="bg-gray-50 border-none rounded-xl px-3 py-2 text-xs font-black uppercase tracking-widest text-[#7F56D9] outline-none"
                        >
                          <option value="user">USER</option>
                          <option value="admin">ADMIN</option>
                        </select>
                      ) : (
                        <span className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest ${user.role === 'admin' ? 'text-[#7F56D9]' : 'text-gray-400'}`}>
                          {user.role === 'admin' ? <Shield size={12} /> : <UserCheck size={12} />}
                          {user.role}
                        </span>
                      )}
                    </td>
                    <td className="px-8 py-5">
                    {editingUser === user._id ? (
                        <select 
                          value={editForm.status}
                          onChange={(e) => setEditForm({...editForm, status: e.target.value})}
                          className="bg-gray-50 border-none rounded-xl px-3 py-2 text-xs font-black uppercase tracking-widest outline-none"
                        >
                          <option value="active">ACTIVE</option>
                          <option value="inactive">INACTIVE</option>
                        </select>
                      ) : (
                        <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${user.status === 'active' || !user.status ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                          {user.status || 'active'}
                        </span>
                      )}
                    </td>
                    <td className="px-8 py-5 text-right">
                      {editingUser === user._id ? (
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => handleUpdateUser(user._id)}
                            className="p-2 bg-green-50 text-green-600 rounded-xl hover:bg-green-100 transition-all"
                          >
                            <Check size={18} />
                          </button>
                          <button 
                            onClick={() => setEditingUser(null)}
                            className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all"
                          >
                            <X size={18} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => handleEditClick(user)}
                            className="p-2 text-gray-300 hover:text-[#7F56D9] hover:bg-purple-50 rounded-xl transition-all"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
