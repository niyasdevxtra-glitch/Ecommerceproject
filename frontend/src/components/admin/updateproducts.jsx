import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../services/api";
import AdminLayout from "./AdminLayout";

export default function EditProduct() {
  const { id } = useParams(); 
  const navigate = useNavigate();

  const [form, setForm] = useState({  
    name: "",
    price: "",
    description: "",
    category: "",
    stock: "",
  });

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await API.get(`/api/products`);
        const product = res.data.find(p => p._id === id);
        if (product) {
            setForm({
            name: product.name || "",
            price: product.price || "",
            description: product.description || "",
            category: product.category || "",
            stock: product.stock || "",
            });
        }
      } catch (err) {
        setError("Failed to load product");
      }
    };

    fetchProduct();
  }, [id]);

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

      if (image) {
        formData.append("image", image);
      }

      await API.put(`/admin/products/${id}`, formData);

      setSuccess("Product updated successfully!");

      setTimeout(() => {
        navigate("/admin/products");
      }, 1000);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to update product"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
        <div className="max-w-2xl mx-auto">
            <div className="mb-8 tracking-tight">
                <h2 className="text-2xl font-black text-gray-900">Edit Product</h2>
                <p className="text-sm text-gray-500 font-medium italic">Modifying ID: {id}</p>
            </div>

            {error && (
                <div className="mb-6 p-4 rounded-2xl bg-red-50 text-red-600 text-sm font-bold border border-red-100">
                {error}
                </div>
            )}

            {success && (
                <div className="mb-6 p-4 rounded-2xl bg-green-50 text-green-600 text-sm font-bold border border-green-100">
                {success}
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Product Name</label>
                        <input
                            name="name"
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
                            value={form.price}
                            onChange={handleChange}
                            className="w-full bg-gray-50 border-none p-4 rounded-2xl text-sm focus:ring-2 focus:ring-[#7F56D9]/20 outline-none transition-all"
                            required
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Update Image (Optional)</label>
                    <input
                        type="file"
                        onChange={(e) => setImage(e.target.files[0])}
                        className="w-full bg-gray-50 border-dashed border-2 border-gray-100 p-8 rounded-2xl text-sm file:hidden text-gray-400 cursor-pointer hover:border-[#7F56D9] transition-all"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Description</label>
                    <textarea
                        name="description"
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
                            value={form.category}
                            onChange={handleChange}
                            className="w-full bg-gray-50 border-none p-4 rounded-2xl text-sm focus:ring-2 focus:ring-[#7F56D9]/20 outline-none transition-all"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Stock Level</label>
                        <input
                            name="stock"
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
                    {loading ? "Updating..." : "Update Product"}
                </button>
            </form>
        </div>
    </AdminLayout>
  );
}
