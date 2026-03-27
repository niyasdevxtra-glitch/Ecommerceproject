import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import AdminLayout from './AdminLayout';
import { Plus, Trash2, Edit2, CheckCircle, AlertCircle, ExternalLink, X, Image as ImageIcon } from 'lucide-react';

export default function ManageBanners() {
    const [banners, setBanners] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const [formData, setFormData] = useState({
        type: 'image',
        category: 'main',
        title: '',
        highlight: '',
        subtitle: '',
        link: '/Product',
        productCategory: ''
    });
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);

    const fetchBanners = async () => {
        try {
            const res = await API.get('/api/banners');
            if (res.data.success) {
                setBanners(res.data.banners);
            }
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchBanners();
        API.get('/api/categorys')
            .then(res => setCategories(res.data || []))
            .catch(err => console.error(err));
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

    const handleEditBanner = (banner) => {
        setEditingId(banner._id);
        setFormData({
            type: banner.type || 'image',
            category: banner.category || 'main',
            title: banner.title || '',
            highlight: banner.highlight || '',
            subtitle: banner.subtitle || '',
            link: banner.link || '/Product',
            productCategory: banner.productCategory || ''
        });
        setPreview(banner.src);
        setFile(null);
        setIsModalOpen(true);
        setMessage('');
        setError('');
    };

    const handleAddBanner = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setError('');

        const data = new FormData();
        data.append('type', formData.type);
        data.append('category', formData.category);
        if (formData.category === 'main' || formData.category === 'category_section') {
            data.append('title', formData.title);
            data.append('highlight', formData.highlight);
            data.append('subtitle', formData.subtitle);
        }
        if (formData.category === 'category_section' && formData.productCategory) {
            data.append('productCategory', formData.productCategory);
        }
        data.append('link', formData.link);
        if (file) {
            data.append('image', file);
        }

        try {
            const url = editingId ? `/admin/banners/${editingId}` : '/admin/banners';
            const method = editingId ? API.put : API.post;
            const res = await method(url, data);

            if (res.data && res.data.success) {
                setMessage(editingId ? 'Banner updated successfully!' : 'Banner added successfully!');
                fetchBanners();
                setTimeout(() => {
                    setIsModalOpen(false);
                    setMessage('');
                    setEditingId(null);
                    setFormData({
                        type: 'image',
                        category: 'main',
                        title: '',
                        highlight: '',
                        subtitle: '',
                        link: '/Product',
                        productCategory: ''
                    });
                    setFile(null);
                    setPreview(null);
                }, 1500);
            } else {
                setError(res.data.message || 'Failed to save banner');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Error saving banner');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this banner?")) return;

        try {
            const res = await API.delete(`/admin/banners/${id}`);
            if (res.data.success) {
                setMessage('Banner deleted!');
                fetchBanners();
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Error deleting banner');
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-black text-gray-900">Banner Management</h2>
                        <p className="text-sm text-gray-500 font-medium">Control the visual spotlights of your platform</p>
                    </div>
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 bg-[#7F56D9] text-white px-6 py-3 rounded-2xl font-bold hover:shadow-lg transition-all active:scale-95"
                    >
                        <Plus size={20} />
                        Add New Banner
                    </button>
                </div>



                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {banners.map((banner) => (
                        <div key={banner._id} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden group hover:shadow-md transition-all">
                            <div className="relative aspect-[21/9] bg-gray-50 overflow-hidden">
                                <img 
                                    src={banner.src.startsWith('http') ? banner.src : `${import.meta.env.VITE_API_BASE_URL || "http://localhost:3001"}${banner.src}`} 
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    alt={banner.title}
                                />
                                <div className="absolute top-3 right-3">
                                    <span className="px-2 py-1 bg-white/90 backdrop-blur-sm shadow-sm rounded-lg text-[10px] font-black uppercase tracking-widest text-[#7F56D9]">
                                        {banner.category}
                                    </span>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                     <span className="px-2 py-1 bg-purple-50 text-[#7F56D9] text-[10px] font-bold uppercase tracking-widest rounded-lg">
                                        {banner.type}
                                    </span>
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => handleEditBanner(banner)}
                                            className="p-2 text-gray-400 hover:bg-gray-50 hover:text-blue-500 rounded-xl transition-all shadow-sm border border-transparent hover:border-blue-100"
                                            title="Edit Banner"
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(banner._id)}
                                            className="p-2 text-gray-400 hover:bg-gray-50 hover:text-red-500 rounded-xl transition-all shadow-sm border border-transparent hover:border-red-100"
                                            title="Delete Banner"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                                <h3 className="font-bold text-gray-900 mb-2 truncate">{banner.title || 'No Title'}</h3>
                                <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase">
                                    <ExternalLink size={12} /> {banner.link}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-200">
                        <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                                <h3 className="text-xl font-black text-gray-900 text-center w-full">{editingId ? 'Edit Banner' : 'Add New Banner'}</h3>
                                <button 
                                    onClick={() => {
                                        setIsModalOpen(false);
                                        setEditingId(null);
                                        setFormData({
                                            type: 'image',
                                            category: 'main',
                                            title: '',
                                            highlight: '',
                                            subtitle: '',
                                            link: '/Product',
                                            productCategory: ''
                                        });
                                        setFile(null);
                                        setPreview(null);
                                    }} 
                                    className="p-2 text-gray-400 hover:text-black rounded-xl hover:bg-gray-50 transition-all absolute right-4"
                                >
                                    <X size={24} />
                                </button>
                            </div>
                            
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

                            <form onSubmit={handleAddBanner} className="p-6 md:p-8 space-y-6 max-h-[80vh] overflow-y-auto w-full">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Banner Type</label>
                                        <select 
                                            name="type"
                                            value={formData.type}
                                            onChange={handleChange}
                                            className="w-full bg-gray-50 border-none p-4 rounded-2xl text-sm focus:ring-2 focus:ring-[#7F56D9]/20 outline-none transition-all"
                                        >
                                            <option value="image">Image</option>
                                            <option value="video">Video</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Category (Location)</label>
                                        <select 
                                            name="category"
                                            value={formData.category}
                                            onChange={handleChange}
                                            className="w-full bg-gray-50 border-none p-4 rounded-2xl text-sm focus:ring-2 focus:ring-[#7F56D9]/20 outline-none transition-all"
                                        >
                                            <option value="main">Main Slider</option>
                                            <option value="new_launch">New Launch</option>
                                            <option value="category_section">Category Section</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Banner Image / Video</label>
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
                                        <div className="mt-4 aspect-[21/9] rounded-2xl overflow-hidden border border-gray-100">
                                            <img src={preview} className="w-full h-full object-cover" alt="Preview"/>
                                        </div>
                                    )}
                                </div>

                                {(formData.category === 'main' || formData.category === 'category_section') && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-in slide-in-from-top-2">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Main Title</label>
                                            <input 
                                                type="text" 
                                                name="title" 
                                                value={formData.title} 
                                                onChange={handleChange} 
                                                className="w-full bg-gray-50 border-none p-4 rounded-2xl text-sm focus:ring-2 focus:ring-[#7F56D9]/20 outline-none transition-all"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Highlight Text</label>
                                            <input 
                                                type="text" 
                                                name="highlight" 
                                                value={formData.highlight} 
                                                onChange={handleChange} 
                                                className="w-full bg-gray-50 border-none p-4 rounded-2xl text-sm focus:ring-2 focus:ring-[#7F56D9]/20 outline-none transition-all"
                                            />
                                        </div>
                                        <div className="sm:col-span-2 space-y-2">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Subtitle</label>
                                            <input 
                                                type="text" 
                                                name="subtitle" 
                                                value={formData.subtitle} 
                                                onChange={handleChange} 
                                                className="w-full bg-gray-50 border-none p-4 rounded-2xl text-sm focus:ring-2 focus:ring-[#7F56D9]/20 outline-none transition-all"
                                            />
                                        </div>
                                    </div>
                                )}

                                {formData.category === 'category_section' && (
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Select Product Category</label>
                                        <select 
                                            name="productCategory"
                                            value={formData.productCategory}
                                            onChange={handleChange}
                                            className="w-full bg-gray-50 border-none p-4 rounded-2xl text-sm focus:ring-2 focus:ring-[#7F56D9]/20 outline-none transition-all"
                                        >
                                            <option value="">-- Choose Category --</option>
                                            {categories.map((c, i) => <option key={i} value={c.name}>{c.name}</option>)}
                                        </select>
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Redirect Link</label>
                                    <input 
                                        type="text" 
                                        name="link" 
                                        value={formData.link} 
                                        onChange={handleChange} 
                                        className="w-full bg-gray-50 border-none p-4 rounded-2xl text-sm focus:ring-2 focus:ring-[#7F56D9]/20 outline-none transition-all"
                                    />
                                </div>

                                <button 
                                    type="submit" 
                                    disabled={loading} 
                                    className="w-full bg-[#7F56D9] text-white py-4 rounded-2xl font-bold shadow-lg shadow-purple-100 hover:shadow-purple-200 transition-all active:scale-[0.98]"
                                >
                                    {loading ? 'Saving...' : (editingId ? 'Update Banner' : 'Save Banner')}
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
