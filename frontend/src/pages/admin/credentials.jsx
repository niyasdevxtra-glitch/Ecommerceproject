import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import API from '../../services/api';
import { KeyRound, Shield, User, Check, X, RefreshCw, AlertCircle } from 'lucide-react';

export default function AdminCredentials() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ email: '', newPassword: '', role: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    try {
      const res = await API.get('/admin/users');
      setUsers(res.data.userlist || []);
    } catch (err) {
      setError('Failed to load users.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleEditClick = (user) => {
    setEditingId(user._id);
    setForm({ email: user.email, newPassword: '', role: user.role });
    setMessage('');
    setError('');
  };

  const handleSave = async (id) => {
    try {
      const payload = { email: form.email, role: form.role };
      if (form.newPassword) payload.password = form.newPassword;

      const res = await API.put(`/admin/users/${id}`, payload);
      if (res.data.success) {
        setMessage(`Credentials updated for user.`);
        setEditingId(null);
        fetchUsers();
      }
    } catch (err) {
      setError('Failed to update credentials.');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-black text-gray-900">User Credentials</h2>
          <p className="text-sm text-gray-500 font-medium">Reset passwords and manage login access for all users</p>
        </div>

        {message && (
          <div className="p-4 rounded-2xl bg-green-50 text-green-700 font-bold border border-green-100 flex items-center gap-2">
            <Check size={16} /> {message}
          </div>
        )}
        {error && (
          <div className="p-4 rounded-2xl bg-red-50 text-red-600 font-bold border border-red-100 flex items-center gap-2">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">User</th>
                  <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Email / Login</th>
                  <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">New Password</th>
                  <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Role</th>
                  <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Save</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  <tr><td colSpan="5" className="px-8 py-16 text-center text-gray-400 font-bold italic">Loading credentials...</td></tr>
                ) : users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50/30 transition-colors">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-500 to-[#7F56D9] flex items-center justify-center text-white font-black shadow-sm">
                          {user.username?.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm font-black text-gray-900">{user.username}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      {editingId === user._id ? (
                        <input
                          type="email"
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          className="w-full bg-gray-50 border-none p-3 rounded-xl text-sm font-bold focus:ring-2 focus:ring-[#7F56D9]/20 outline-none"
                        />
                      ) : (
                        <span className="text-sm text-gray-500 font-medium">{user.email}</span>
                      )}
                    </td>
                    <td className="px-8 py-5">
                      {editingId === user._id ? (
                        <input
                          type="password"
                          placeholder="New password..."
                          value={form.newPassword}
                          onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
                          className="w-full bg-gray-50 border-none p-3 rounded-xl text-sm font-bold focus:ring-2 focus:ring-[#7F56D9]/20 outline-none"
                        />
                      ) : (
                        <span className="text-xs text-gray-300 font-black tracking-widest">••••••••</span>
                      )}
                    </td>
                    <td className="px-8 py-5">
                      {editingId === user._id ? (
                        <select
                          value={form.role}
                          onChange={(e) => setForm({ ...form, role: e.target.value })}
                          className="bg-gray-50 border-none rounded-xl px-3 py-2 text-xs font-black uppercase tracking-widest text-[#7F56D9] outline-none"
                        >
                          <option value="user">USER</option>
                          <option value="admin">ADMIN</option>
                        </select>
                      ) : (
                        <span className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest ${user.role === 'admin' ? 'text-[#7F56D9]' : 'text-gray-400'}`}>
                          {user.role === 'admin' ? <Shield size={12} /> : <User size={12} />}
                          {user.role}
                        </span>
                      )}
                    </td>
                    <td className="px-8 py-5 text-right">
                      {editingId === user._id ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleSave(user._id)}
                            className="p-2 bg-green-50 text-green-600 rounded-xl hover:bg-green-100 transition-all"
                          >
                            <Check size={18} />
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="p-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-all"
                          >
                            <X size={18} />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleEditClick(user)}
                          className="flex items-center gap-2 px-4 py-2 bg-purple-50 text-[#7F56D9] rounded-xl text-xs font-black hover:bg-[#7F56D9] hover:text-white transition-all"
                        >
                          <KeyRound size={14} /> Edit
                        </button>
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
