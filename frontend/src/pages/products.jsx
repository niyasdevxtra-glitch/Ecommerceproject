import { useEffect, useState, useMemo } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import API from "../services/api";
import ProductCard from "../components/common/ProductCard";
import Navbar from "../components/layout/navbar";
import Footer from "../components/layout/footer";
import { Search, SlidersHorizontal, LayoutGrid, Smartphone, Watch, Speaker, Gamepad, X } from "lucide-react";

const CATEGORY_ICONS = {
  "All": <LayoutGrid size={16} />,
  "Mobiles": <Smartphone size={16} />,
  "Watches": <Watch size={16} />,
  "Speakers": <Speaker size={16} />,
  "Gaming": <Gamepad size={16} />,
};

const getCategoryIcon = (name) => CATEGORY_ICONS[name] || <LayoutGrid size={16} />;

export default function Products() {
  const { categoryId } = useParams();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [priceRange, setPriceRange] = useState(200000);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const searchFromUrl = searchParams.get("search");
    if (searchFromUrl) {
      setSearchQuery(searchFromUrl);
    }
  }, [searchParams]);

  useEffect(() => {
    if (categoryId && categories.length > 0) {
      const match = categories.find(c => c.name.toLowerCase() === categoryId.toLowerCase());
      if (match) setSelectedCategory(match.name);
    } else if (!categoryId) {
      setSelectedCategory("All");
    }
  }, [categoryId, categories]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    const controller = new AbortController();
    const fetchInitialData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          API.get("/api/products", { signal: controller.signal }),
          API.get("/api/categorys", { signal: controller.signal })
        ]);
        setProducts(productsRes.data);
        
        const dynamicCategories = categoriesRes.data || [];
        setCategories([{ name: "All" }, ...dynamicCategories]);

        // If there's a categoryId in URL, set the selected category after categories are loaded
        if (categoryId) {
          const match = dynamicCategories.find(c => c.name.toLowerCase() === categoryId.toLowerCase());
          if (match) setSelectedCategory(match.name);
        }
      } catch (error) {
        if (error.name !== 'CanceledError') {
          console.error("Failed to load initial data", error);
        }
      } finally {
        setTimeout(() => setLoading(false), 600);
      }
    };
    fetchInitialData();
    return () => controller.abort();
  }, [categoryId]);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(debouncedSearch.toLowerCase());
      const matchesCategory = selectedCategory === "All" || 
        (p.category && p.category.trim().toLowerCase() === selectedCategory.toLowerCase());
      const matchesPrice = p.price <= priceRange;
      return matchesSearch && matchesCategory && matchesPrice;
    });
  }, [products, debouncedSearch, selectedCategory, priceRange]);

  return (
    <div className="bg-gray-50 min-h-screen pb-20 md:pb-0">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center gap-8 mb-16 px-2 lg:pl-0">
          {/* Align 'System Categories' label in the header row on desktop */}
          <div className="hidden lg:block w-72 flex-shrink-0">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 px-2">System Categories</h3>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between w-full gap-8">
            <h1 className="text-black font-black uppercase tracking-tighter text-2xl md:text-3xl whitespace-nowrap">
                {selectedCategory}
            </h1>
            
            <div className="flex items-center gap-4 w-full md:max-w-2xl">
              <div className="relative group w-full">
                <Search size={22} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors" />
                <input 
                  type="text" 
                  placeholder="Find your next tool..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-14 pr-6 py-4 bg-white border border-gray-100 rounded-[2rem] shadow-sm focus:ring-4 focus:ring-black/5 outline-none transition-all font-medium text-lg"
                />
              </div>
              <button 
                onClick={() => setIsFilterOpen(true)}
                className="lg:hidden p-4 bg-black text-white rounded-2xl shadow-xl active:scale-90 transition-transform"
              >
                <SlidersHorizontal size={20} />
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-72 space-y-12 sticky top-32 h-fit">
            <section>
              <div className="space-y-2">
                {categories.map((cat) => (
                  <button
                    key={cat._id || cat.name}
                    onClick={() => setSelectedCategory(cat.name)}
                    className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl font-bold transition-all duration-300 ${
                      selectedCategory === cat.name 
                        ? "bg-black text-white shadow-2xl shadow-black/20 translate-x-2" 
                        : "bg-white text-gray-400 hover:bg-gray-100 hover:text-black"
                    }`}
                  >
                    <span className="flex items-center gap-4">
                        {getCategoryIcon(cat.name)} {cat.name}
                    </span>
                    {selectedCategory === cat.name && <div className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />}
                  </button>
                ))}
              </div>
            </section>

            <section className="px-2">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">BudgetCapping</h3>
                <span className="text-sm font-black text-black">₹{priceRange.toLocaleString()}</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="200000" 
                step="5000"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
              />
              <div className="flex justify-between mt-4 text-[9px] font-black text-gray-300 uppercase tracking-widest">
                <span>Min.0</span>
                <span>Max.2L</span>
              </div>
            </section>

            <button 
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
                setPriceRange(200000);
              }}
              className="w-full py-5 text-[10px] font-black uppercase tracking-[0.2em] border-2 border-dashed border-gray-200 text-gray-300 rounded-[2rem] hover:border-black hover:text-black transition-all"
            >
              Reset Interface
            </button>
          </aside>

          {/* Product Grid Area */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                {[1,2,3,4,5,6].map(i => (
                  <div key={i} className="space-y-6">
                    <div className="aspect-square bg-white animate-pulse rounded-[3rem] border border-gray-100" />
                    <div className="h-4 w-3/4 bg-gray-200 animate-pulse rounded-full mx-auto md:mx-0" />
                    <div className="h-4 w-1/2 bg-gray-100 animate-pulse rounded-full mx-auto md:mx-0" />
                  </div>
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                {filteredProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-40 bg-white rounded-[4rem] border border-dashed border-gray-200 shadow-inner">
                <div className="mb-8 inline-flex p-8 bg-gray-50 rounded-full text-gray-300 animate-bounce">
                  <Search size={64} strokeWidth={1} />
                </div>
                <h2 className="text-2xl font-black mb-3">No Results Found</h2>
                <p className="text-gray-400 font-medium max-w-xs mx-auto text-sm leading-relaxed">
                    The requested hardware combination does not exist in our current archive.
                </p>
                <button 
                    onClick={() => setSelectedCategory("All")}
                    className="mt-8 px-8 py-3 bg-black text-white text-xs font-black uppercase tracking-widest rounded-full hover:bg-accent hover:text-black transition-all"
                >
                    Show Everything
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Mobile Modal Filter */}
      <div className={`fixed inset-0 z-[100] transition-all duration-500 lg:hidden ${isFilterOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}>
        <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setIsFilterOpen(false)} />
        <div className={`absolute bottom-0 left-0 right-0 bg-white rounded-t-[3rem] p-10 transition-transform duration-500 transform ${isFilterOpen ? "translate-y-0" : "translate-y-full"}`}>
            <div className="flex items-center justify-between mb-10">
                <h2 className="text-2xl font-black uppercase tracking-tighter">Filters</h2>
                <button onClick={() => setIsFilterOpen(false)} className="p-2 bg-gray-100 rounded-full"><X size={24} /></button>
            </div>
            
            <div className="space-y-12">
                <div className="grid grid-cols-2 gap-3">
                    {categories.map(cat => (
                        <button 
                            key={cat._id || cat.name}
                            onClick={() => { setSelectedCategory(cat.name); setIsFilterOpen(false); }}
                            className={`flex flex-col items-center gap-3 p-6 rounded-3xl font-bold transition-all ${selectedCategory === cat.name ? "bg-black text-white scale-95 shadow-2xl" : "bg-gray-50 text-gray-500"}`}
                        >
                            {getCategoryIcon(cat.name)}
                            <span className="text-[10px] uppercase tracking-widest">{cat.name}</span>
                        </button>
                    ))}
                </div>

                <div>
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">Price Limit</h3>
                        <span className="text-lg font-black">₹{priceRange.toLocaleString()}</span>
                    </div>
                    <input 
                        type="range" 
                        min="0" 
                        max="200000" 
                        step="5000"
                        value={priceRange}
                        onChange={(e) => setPriceRange(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
                    />
                </div>

                <button 
                    onClick={() => setIsFilterOpen(false)}
                    className="w-full py-5 bg-black text-white rounded-[2rem] font-black uppercase tracking-widest shadow-2xl shadow-black/20"
                >
                    Apply Concept
                </button>
            </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
