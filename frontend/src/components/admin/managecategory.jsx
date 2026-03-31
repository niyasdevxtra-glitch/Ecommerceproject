import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import AdminLayout from './AdminLayout';
import { Plus, Trash2, Edit2, CheckCircle, AlertCircle, X, Image as ImageIcon, Layers } from 'lucide-react';

export default function ManageCategories() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        description: ''
    });
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);

    const fetchCategories = async () => {
        try {
            const res = await API.get('/api/categorys');
            if (Array.isArray(res.data)) {
                setCategories(res.data);
            }
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        if (selectedFile) {
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result);
            reader.readAsDataURL(selectedFile);
        }
    };

    const handleEditCategory = (cat) => {
        setEditingId(cat._id);
        setFormData({
            name: cat.name || '',
            description: cat.discription || ''
        });
        setPreview(cat.image ? (cat.image.startsWith('http') ? cat.image : `${import.meta.env.VITE_API_BASE_URL || "http://localhost:3001"}${cat.image}`) : null);
        setFile(null);
        setIsModalOpen(true);
        setMessage('');
        setError('');
    };

    const handleAddCategory = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setError('');

        const data = new FormData();
        data.append('name', formData.name);
        data.append('description', formData.description);
        
        if (file) {
            data.append('image', file);
        }

        try {
            const url = editingId ? `/admin/category/${editingId}` : '/admin/category';
            const method = editingId ? API.put : API.post;
            const res = await method(url, data);

            if (res.data && (res.data.category || res.data.updatedata)) {
                setMessage(editingId ? 'Category updated successfully!' : 'Category added successfully!');
                fetchCategories();
                setTimeout(() => {
                    setIsModalOpen(false);
                    setMessage('');
                    setEditingId(null);
                    setFormData({
                        name: '',
                        description: ''
                    });
                    setFile(null);
                    setPreview(null);
                }, 1500);
            } else {
                setError(res.data.message || 'Failed to save category');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Error saving category');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this category?")) return;

        try {
            const res = await API.delete(`/admin/category/${id}`);
            if (res.data) {
                setMessage('Category deleted!');
                fetchCategories();
                setTimeout(() => setMessage(''), 3000);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Error deleting category');
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-black text-gray-900">Category Management</h2>
                        <p className="text-sm text-gray-500 font-medium">Organize your products into meaningful groupings</p>
                    </div>
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 bg-[#7F56D9] text-white px-6 py-3 rounded-2xl font-bold hover:shadow-lg transition-all active:scale-95"
                    >
                        <Plus size={20} />
                        Add Category
                    </button>
                </div>

                {message && !isModalOpen && (
                    <div className="p-4 rounded-2xl bg-green-50 text-green-600 font-bold border border-green-100 flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                        <CheckCircle size={18} /> {message}
                    </div>
                )}
                {error && !isModalOpen && (
                    <div className="p-4 rounded-2xl bg-red-50 text-red-600 font-bold border border-red-100 flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                        <AlertCircle size={18} /> {error}
                    </div>
                )}

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                    {categories.map((cat) => (
                        <div key={cat._id} className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all relative group flex flex-col items-center">
                            <div className="aspect-square w-full bg-gray-50 rounded-2xl overflow-hidden mb-4 relative flex items-center justify-center">
                                {cat.image ? (
                                    <img 
                                        src={cat.image.startsWith('http') ? cat.image : `${import.meta.env.VITE_API_BASE_URL || "http://localhost:3001"}${cat.image}`} 
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        alt={cat.name}
                                    />
                                ) : (
                                    <Layers className="text-gray-300" size={48} />
                                )}
                                
                                <button 
                                    onClick={() => handleEditCategory(cat)}
                                    className="absolute top-2 right-12 p-2 bg-white/90 backdrop-blur text-gray-400 hover:text-blue-500 rounded-xl transition-all shadow-sm opacity-0 group-hover:opacity-100"
                                >
                                    <Edit2 size={16} />
                                </button>
                                <button 
                                    onClick={() => handleDelete(cat._id)}
                                    className="absolute top-2 right-2 p-2 bg-white/90 backdrop-blur text-gray-400 hover:text-red-500 rounded-xl transition-all shadow-sm opacity-0 group-hover:opacity-100"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                            <h3 className="font-bold text-gray-900 mb-1 truncate text-center w-full">{cat.name}</h3>
                            {cat.discription && <p className="text-xs text-gray-500 text-center truncate w-full">{cat.discription}</p>}
                        </div>
                    ))}
                </div>

                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-200">
                        <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
                            <div className="p-6 border-b border-gray-100 flex items-center justify-between shrink-0">
                                <h3 className="text-xl font-black text-gray-900 text-center w-full">{editingId ? 'Edit Category' : 'Add New Category'}</h3>
                                <button 
                                    onClick={() => {
                                        setIsModalOpen(false);
                                        setEditingId(null);
                                        setFormData({ name: '', description: '' });
                                        setFile(null);
                                        setPreview(null);
                                    }} 
                                    className="p-2 text-gray-400 hover:text-black rounded-xl hover:bg-gray-50 transition-all absolute right-4"
                                >
                                    <X size={24} />
                                </button>
                            </div>
                            
                            <div className="overflow-y-auto flex-1">
                                {(message || error) && (
                                    <div className="px-8 pt-6 pb-0">
                                        {message && (
                                            <div className="p-4 rounded-2xl bg-green-50 text-green-600 font-bold border border-green-100 flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                                                <CheckCircle size={18} /> {message}
                                            </div>
                                        )}
                                        {error && (
                                            <div className="p-4 rounded-2xl bg-red-50 text-red-600 font-bold border border-red-100 flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                                                <AlertCircle size={18} /> {error}
                                            </div>
                                        )}
                                    </div>
                                )}

                                <form onSubmit={handleAddCategory} className="p-8 space-y-6">
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Category Name</label>
                                            <input 
                                                type="text" 
                                                name="name" 
                                                value={formData.name} 
                                                onChange={handleChange} 
                                                required
                                                className="w-full bg-gray-50 border-none p-4 rounded-2xl text-sm focus:ring-2 focus:ring-[#7F56D9]/20 outline-none transition-all"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Description (Optional)</label>
                                            <input 
                                                type="text" 
                                                name="description" 
                                                value={formData.description} 
                                                onChange={handleChange} 
                                                className="w-full bg-gray-50 border-none p-4 rounded-2xl text-sm focus:ring-2 focus:ring-[#7F56D9]/20 outline-none transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Category Cover Image</label>
                                        <div className="relative group">
                                            <input 
                                                type="file" 
                                                onChange={handleFileChange} 
                                                className="w-full bg-gray-50 border-dashed border-2 border-gray-200 p-12 rounded-2xl text-sm file:hidden text-gray-400 cursor-pointer hover:border-[#7F56D9] transition-all"
                                                required={!editingId && !preview}
                                            />
                                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-gray-400 font-bold text-xs uppercase tracking-widest group-hover:text-[#7F56D9]">
                                                <ImageIcon className="mb-2" size={32} />
                                                {file ? file.name : "Click to upload media"}
                                            </div>
                                        </div>
                                        {preview && (
                                            <div className="mt-4 aspect-square max-w-[150px] mx-auto rounded-2xl overflow-hidden border border-gray-100">
                                                <img src={preview} className="w-full h-full object-cover" alt="Preview"/>
                                            </div>
                                        )}
                                    </div>

                                    <button 
                                        type="submit" 
                                        disabled={loading} 
                                        className="w-full bg-[#7F56D9] text-white py-4 rounded-2xl font-bold shadow-lg shadow-purple-100 hover:shadow-purple-200 transition-all active:scale-[0.98]"
                                    >
                                        {loading ? 'Saving...' : (editingId ? 'Update Category' : 'Save Category')}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
