import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import AdminLayout from "./AdminLayout";

export default function AddProduct() {
  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    stock: "",
  });

  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("name", form.name);
      formData.append("price", form.price);
      formData.append("description", form.description);
      formData.append("category", form.category);
      formData.append("stock", form.stock);
      formData.append("image", image);

      const res = await API.post("/admin/products", formData);

      setSuccess(res.data.message || "Product added successfully!");

      setTimeout(() => {
        navigate("/admin/products");
      }, 800);


      setForm({
        name: "",
        price: "",
        description: "",
        category: "",
        stock: "",
      });
      setImage(null);


    } catch (err) {

      setError(
        err.response?.data?.message ||
        err.message ||
        "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
        <div className="max-w-2xl mx-auto">
            <div className="mb-8">
                <h2 className="text-2xl font-black text-gray-900">Add New Product</h2>
                <p className="text-sm text-gray-500 font-medium">Create a new entry in your product catalog</p>
            </div>


            {error && (
                <div className="mb-6 p-4 rounded-2xl bg-red-50 text-red-600 text-sm font-bold border border-red-100 animate-in fade-in slide-in-from-top-2">
                {error}
                </div>
            )}

            {success && (
                <div className="mb-6 p-4 rounded-2xl bg-green-50 text-green-600 text-sm font-bold border border-green-100 animate-in fade-in slide-in-from-top-2">
                {success}
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Product Name</label>
                        <input
                            name="name"
                            placeholder="Enter product name"
                            value={form.name}
                            onChange={handleChange}
                            className="w-full bg-gray-50 border-none p-4 rounded-2xl text-sm focus:ring-2 focus:ring-[#7F56D9]/20 outline-none transition-all"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Price (₹)</label>
                        <input
                            name="price"
                            placeholder="0.00"
                            value={form.price}
                            onChange={handleChange}
                            className="w-full bg-gray-50 border-none p-4 rounded-2xl text-sm focus:ring-2 focus:ring-[#7F56D9]/20 outline-none transition-all"
                            required
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Product Image</label>
                    <div className="relative group">
                        <input
                            type="file"
                            onChange={(e) => setImage(e.target.files[0])}
                            className="w-full bg-gray-50 border-dashed border-2 border-gray-200 p-8 rounded-2xl text-sm file:hidden text-gray-400 cursor-pointer hover:border-[#7F56D9] transition-all"
                            required
                        />
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-gray-400 font-bold text-xs uppercase tracking-widest group-hover:text-[#7F56D9]">
                            {image ? image.name : "Click to upload image"}
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Description</label>
                    <textarea
                        name="description"
                        placeholder="Describe the product..."
                        rows="4"
                        value={form.description}
                        onChange={handleChange}
                        className="w-full bg-gray-50 border-none p-4 rounded-2xl text-sm focus:ring-2 focus:ring-[#7F56D9]/20 outline-none transition-all resize-none"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Category</label>
                        <input
                            name="category"
                            placeholder="e.g. Mobiles, Laptops"
                            value={form.category}
                            onChange={handleChange}
                            className="w-full bg-gray-50 border-none p-4 rounded-2xl text-sm focus:ring-2 focus:ring-[#7F56D9]/20 outline-none transition-all"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Stock Level</label>
                        <input
                            name="stock"
                            placeholder="Available quantity"
                            value={form.stock}
                            onChange={handleChange}
                            className="w-full bg-gray-50 border-none p-4 rounded-2xl text-sm focus:ring-2 focus:ring-[#7F56D9]/20 outline-none transition-all"
                        />
                    </div>
                </div>

                <button
                    type="submit"   
                    disabled={loading}
                    className="w-full bg-[#7F56D9] text-white py-4 rounded-2xl font-bold shadow-lg shadow-purple-100 hover:shadow-purple-200 transition-all active:scale-[0.98] disabled:opacity-50"
                >
                    {loading ? "Adding..." : "Add Product"}
                </button>
            </form>
        </div>
    </AdminLayout>
  );
}
