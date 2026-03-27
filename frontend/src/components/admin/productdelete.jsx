import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";

export default function DeleteProducts() {
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [searchId, setSearchId] = useState("");
  const navigate = useNavigate();

  // fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await API.get("/api/products");
        setProducts(res.data);
      } catch (err) {
        console.error("Deletion completely failed externally:", err);
      }
    };
    fetchProducts();
  }, []);

  const handleSearch = async () => {
  setError("");
  setMessage("");

  if (!searchId) {
    // if empty → reload all products
    const res = await API.get("/api/products");
    setProducts(res.data);
    return;
  }

  try {
    const res = await API.get(`/api/products/${searchId}`);

    // backend returns single object, so wrap in array
    setProducts([res.data]);
  } catch (err) {
    setError(err.response?.data?.message || "Product not found");
    setProducts([]);
  }
};


  // 🔥 DELETE PRODUCT
  const handleDelete = async (id) => {
    setMessage("");
    setError("");

    try {
      const res = await API.delete(`/admin/products/${id}`);

      // backend message
      setMessage(res.data.message);

      // update UI
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-5">Products</h2>

      <div className="flex gap-3 mb-6">
      <input
        type="text"
        placeholder="Enter Product ID"
        value={searchId}
        onChange={(e) => setSearchId(e.target.value)}
        className="border p-2 rounded w-full"
      />

      <button
        onClick={handleSearch}
        className="bg-black text-white px-6 rounded"
      >
        Search
      </button>
      </div>


      {/* HEADER + ADD BUTTON */}
      <div className="flex justify-end items-center mb-6">

        <button
          onClick={() => navigate("/addproduct")}
          className="bg-green-600 text-white px-6 py-2 rounded text-sm"
        >
          + Add Product
        </button>
      </div>

      {/* SUCCESS MESSAGE */}
      {message && (
        <div className="mb-3 p-2 bg-green-100 text-green-700 rounded">
          {message}
        </div>
      )}

      {/* ERROR MESSAGE */}
      {error && (
        <div className="mb-3 p-2 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {products.map((product) => (
        <div
          key={product._id}
          className="flex justify-between items-center border p-3 mb-2 rounded"
        >
          <span>{product.name}</span>

          <div className="space-x-6">
            <button
              onClick={() =>
                navigate(`/admin/updateproducts/${product._id}`)
              }
              className="bg-blue-600 text-white px-6 py-1 rounded text-sm"
            >
              Edit
            </button>

            <button
              onClick={() => handleDelete(product._id)}
              className="bg-red-600 text-white px-6 py-1 rounded text-sm"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
