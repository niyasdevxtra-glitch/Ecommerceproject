import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from '../services/api'
import Navbar from "../components/layout/navbar";
import Footer from "../components/layout/footer";
import AnimatedAddToCart from "../components/common/AnimatedAddToCart";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { ShoppingBag, Star, ShieldCheck, Truck, RotateCcw, ArrowLeft, Heart, Share2 } from "lucide-react";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shippingSpeed, setShippingSpeed] = useState("Standard");
  const { addToCart, setIsCartOpen } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const isFavorited = product ? isInWishlist(product._id) : false;

  const getDeliveryEstimate = (daysToAdd) => {
      const baseDate = new Date();
      baseDate.setDate(baseDate.getDate() + daysToAdd);
      const day = baseDate.getDate();
      const suffix = ["th", "st", "nd", "rd"][((day % 100) - 20) % 10] || ["th", "st", "nd", "rd"][day % 100] || "th";
      return `Arriving by ${baseDate.toLocaleDateString("en-US", { weekday: 'long', month: 'short' })} ${day}${suffix}`;
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    const controller = new AbortController();

    const fetchProduct = async () => {
      try {
        const res = await API.get(`/api/products/${id}`, { signal: controller.signal });
        setProduct(res.data);
      } catch (error) {
        if (error.name !== 'CanceledError') {
          console.error("Failed to load product", error);
        }
      } finally {
        setTimeout(() => setLoading(false), 500);
      }
    };

    fetchProduct();
    return () => controller.abort();
  }, [id]);

  if (loading) {
    return (
      <div className="bg-white min-h-screen">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-20 animate-pulse">
            <div className="grid md:grid-cols-2 gap-16">
                <div className="aspect-square bg-gray-100 rounded-[3rem]" />
                <div className="space-y-8">
                    <div className="h-10 w-3/4 bg-gray-100 rounded-full" />
                    <div className="h-6 w-1/4 bg-gray-100 rounded-full" />
                    <div className="h-32 w-full bg-gray-50 rounded-[2rem]" />
                </div>
            </div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-20">
        {/* Breadcrumbs / Back */}
        <div className="mb-12 flex items-center justify-between">
            <Link to="/Product" className="group flex items-center gap-3 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors">
                <div className="p-2 bg-gray-50 rounded-full group-hover:bg-black group-hover:text-white transition-all">
                    <ArrowLeft size={16} />
                </div>
                Return to Archive
            </Link>
            <div className="flex gap-4">
                <button 
                    onClick={() => toggleWishlist(product)}
                    className={`p-3 rounded-full transition-all flex items-center justify-center ${
                        isFavorited ? 'bg-accent text-black shadow-lg scale-110' : 'bg-gray-50 text-black hover:bg-black hover:text-white'
                    }`}
                    title={isFavorited ? "Remove from Wishlist" : "Add to Wishlist"}
                >
                    <Heart size={18} fill={isFavorited ? "currentColor" : "none"} />
                </button>
                <button className="p-3 bg-gray-50 rounded-full hover:bg-black hover:text-white transition-all"><Share2 size={18} /></button>
            </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 md:gap-24 items-start border-b border-gray-100 pb-20">
          {/* Gallery */}
          <div className="lg:sticky lg:top-32 space-y-6">
            <div className="aspect-square rounded-[3rem] overflow-hidden border border-gray-100 bg-gray-50 group hover:shadow-2xl hover:shadow-black/5 transition-all duration-700">
                <img
                    src={product.image ? (product.image.includes('http') ? product.image : `${import.meta.env.VITE_API_BASE_URL || "http://localhost:3001"}/uploads/${product.image}`) : "https://via.placeholder.com/800"}
                    alt={product.name}
                    loading="eager"
                    fetchpriority="high"
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
            </div>
            <div className="grid grid-cols-4 gap-4">
                {[1,2,3,4].map(i => (
                    <div key={i} className="aspect-square rounded-2xl bg-gray-50 border border-transparent hover:border-black transition-all cursor-pointer overflow-hidden opacity-40 hover:opacity-100">
                        <img src={product.image ? (product.image.includes('http') ? product.image : `${import.meta.env.VITE_API_BASE_URL || "http://localhost:3001"}/uploads/${product.image}`) : "https://via.placeholder.com/200"} className="w-full h-full object-cover" />
                    </div>
                ))}
            </div>
          </div>

          {/* Info */}
          <div className="space-y-10">
            <div className="css-scroll-item">
                <div className="flex items-center gap-3 mb-6">
                    <span className="px-3 py-1 bg-black text-white text-[10px] font-black uppercase tracking-widest rounded-lg">Elite Edition</span>
                    <div className="flex items-center gap-1 text-accent">
                        <Star size={14} fill="currentColor" />
                        <span className="text-xs font-bold text-gray-400 font-mono">5.0 SPEC</span>
                    </div>
                </div>
                <h1 className="css-scroll-text text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4 leading-tight">{product.name}</h1>
                <p className="css-scroll-text text-gray-400 font-bold uppercase tracking-widest text-xs">{product.category || "Precision Hardware"}</p>
            </div>

            <div className="css-scroll-text flex items-baseline gap-4">
                <span className="text-4xl font-black">₹{product.price.toLocaleString()}</span>
                <span className="text-lg text-gray-300 line-through font-bold decoration-2">₹{(product.price * 1.2).toLocaleString()}</span>
            </div>

            <div className="css-scroll-item glass p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                <h3 className="css-scroll-text text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">Technical Manifest</h3>
                <p className="css-scroll-text text-gray-600 font-medium leading-relaxed text-lg">
                    {product.description || "Experimental hardware designed for the next era of digital interaction. Built with sustainable materials and powered by cutting-edge processing logic."}
                </p>
            </div>

            <div className="css-scroll-item">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">Logistics Speed</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                    <button 
                      onClick={() => setShippingSpeed('Standard')}
                      className={`flex flex-col p-5 rounded-3xl border transition-all text-left ${shippingSpeed === 'Standard' ? 'border-black bg-black text-white shadow-xl shadow-black/10' : 'border-gray-200 bg-white text-black hover:border-black/20'}`}
                    >
                      <span className="text-sm font-black uppercase tracking-tighter">Standard</span>
                      <span className={`text-[10px] font-bold tracking-widest mt-1 opacity-70`}>{getDeliveryEstimate(5)} (Free)</span>
                    </button>
                    <button 
                      onClick={() => setShippingSpeed('Express')}
                      className={`flex flex-col p-5 rounded-3xl border transition-all text-left ${shippingSpeed === 'Express' ? 'border-accent bg-accent text-black shadow-xl shadow-accent/20' : 'border-gray-200 bg-white text-black hover:border-black/20'}`}
                    >
                      <span className="text-sm font-black uppercase tracking-tighter">Express Air</span>
                      <span className={`text-[10px] font-bold tracking-widest mt-1 opacity-70`}>{getDeliveryEstimate(2)} (+₹100)</span>
                    </button>
                </div>
            </div>

            <div className="css-scroll-item flex flex-col sm:flex-row gap-4 w-full">
                <AnimatedAddToCart 
                    onClick={() => addToCart(product, 1, false, shippingSpeed)} 
                    onComplete={() => setIsCartOpen(true)}
                />
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10 border-t border-gray-100">
                <Feature icon={<ShieldCheck className="text-green-500" />} title="Warranty" desc="24M Secure" />
                <Feature icon={<Truck className="text-blue-500" />} title="Logistics" desc="Express" />
                <Feature icon={<RotateCcw className="text-orange-500" />} title="Return" desc="14D Reset" />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function Feature({ icon, title, desc }) {
    return (
        <div className="css-scroll-item flex items-start gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors">
            <div className="p-2 bg-white rounded-xl shadow-sm border border-gray-100">{icon}</div>
            <div className="css-scroll-text">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 leading-none mb-1">{title}</p>
                <p className="text-xs font-black uppercase tracking-tighter">{desc}</p>
            </div>
        </div>
    );
}
