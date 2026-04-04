import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API, { getMediaUrl } from "../../services/api";

export default function CategoryRow() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    API.get('/api/categorys')
      .then(res => setCategories(res.data || []))
      .catch(err => console.error("Failed to fetch categories:", err));
  }, []);

  const handleCategoryClick = (categoryName) => {
    navigate(`/category/${categoryName.toLowerCase()}`);
  };

  return (
    <section className="bg-white py-5 pt-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between overflow-x-auto scrollbar-hide">
          {categories.map((cat, index) => (
            <div
              key={index}
              onClick={() => handleCategoryClick(cat.name)}
              className="flex flex-col items-center min-w-[75px] cursor-pointer group"
            >
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-transparent group-hover:border-black transition-all duration-200">
                <img
                  src={cat.image ? (cat.image.includes('http') ? cat.image : getMediaUrl(cat.image)) : "https://via.placeholder.com/150"}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200"
                />
              </div>

              <p className="text-xs mt-2 font-medium text-gray-700 text-center group-hover:text-black group-hover:font-bold transition-all duration-200">
                {cat.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
