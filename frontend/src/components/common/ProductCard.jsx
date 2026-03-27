import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Eye, Star, Heart } from "lucide-react";
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import AnimatedAddToCart from './AnimatedAddToCart';

const ProductCard = ({ product }) => {
  const { addToCart, setIsCartOpen } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const navigate = useNavigate();

  const isFavorited = isInWishlist(product._id);

  const handleCardClick = (e) => {
    if (!e.target.closest('button') && !e.target.closest('a')) {
      navigate(`/products/${product._id}`);
    }
  };

  return (
    <div 
      onClick={handleCardClick}
      className="css-scroll-item group relative bg-gray-200/50 backdrop-blur-xl p-4 rounded-3xl border border-white/60 shadow-sm transition-all duration-500 hover:bg-gray-200/70 hover:shadow-xl hover:shadow-black/5 hover:-translate-y-1 overflow-hidden cursor-pointer"
    >
      
      {/* Badge */}
      <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
        <span className="px-2 py-1 bg-black text-white text-[10px] font-black uppercase tracking-widest rounded-lg drop-shadow-md">
          New
        </span>
      </div>

      {/* Image Gallery Mockup */}
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-gray-50 mb-4">
        <img
          src={product.image ? `${import.meta.env.VITE_API_BASE_URL || "http://localhost:3001"}/uploads/${product.image}` : "https://via.placeholder.com/400"}
          alt={product.name}
          loading="lazy"
          className="css-scroll-image w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Quick Actions Overlay */}
        <div className="absolute inset-0 bg-black/5 group-hover:bg-black/10 transition-all duration-500 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0">
          <button 
            onClick={() => product.stock > 0 && addToCart(product)}
            disabled={product.stock <= 0}
            className={`p-3 rounded-full shadow-xl transition-all shadow-black/10 ${
              product.stock > 0 
              ? 'bg-white hover:bg-black hover:text-white transform hover:scale-110 active:scale-90 text-black' 
              : 'bg-white/80 text-gray-300 cursor-not-allowed'
            }`}
            title="Add to Cart"
          >
            <ShoppingCart size={18} />
          </button>
          <button 
            onClick={() => toggleWishlist(product)}
            className={`p-3 rounded-full shadow-xl transition-all shadow-black/10 transform hover:scale-110 active:scale-90 ${
              isFavorited ? 'bg-accent text-black' : 'bg-white text-black hover:bg-black hover:text-white'
            }`}
            title={isFavorited ? "Remove from Wishlist" : "Add to Wishlist"}
          >
            <Heart size={18} fill={isFavorited ? "currentColor" : "none"} />
          </button>
          <Link to={`/products/${product._id}`} className="p-3 bg-white rounded-full shadow-xl hover:bg-black hover:text-white transition-all transform hover:scale-110 active:scale-90 text-black shadow-black/10" title="View Details">
            <Eye size={18} />
          </Link>
        </div>
      </div>

      {/* Product Info */}
      <div className="css-scroll-text space-y-1 text-center md:text-left">
        <div className="flex items-center gap-1 text-accent mb-1 justify-center md:justify-start">
            <Star size={12} fill="currentColor" />
            <span className="text-[10px] font-bold text-gray-400">4.9 (120)</span>
        </div>
        <h3 className="text-black font-bold text-sm md:text-base tracking-tight truncate group-hover:text-accent transition-colors">
          {product.name}
        </h3>
        <p className="text-gray-400 text-xs font-semibold uppercase tracking-tighter">
          {product.category || "Premium Tech"}
        </p>
        <div className="flex items-center gap-3 mt-4 justify-center md:justify-start">
          <span className="text-lg md:text-xl font-black text-black">₹{product.price}</span>
          <span className="text-xs text-gray-400 line-through font-bold">₹{Math.round(product.price * 1.2)}</span>
        </div>
        <div className="pt-3 flex justify-center md:justify-start">
          {product.stock > 0 ? (
            <span className="px-1.5 py-0.5 bg-green-50/100 text-green-700 text-[8px] font-black uppercase tracking-widest rounded-md border border-dashed border-green-400 shadow-sm">
              In Stock
            </span>
          ) : (
            <span className="px-1.5 py-0.5 bg-red-50/100 text-red-600 text-[8px] font-black uppercase tracking-widest rounded-md border border-dashed border-red-400 shadow-sm">
              Sold Out
            </span>
          )}
        </div>
      </div>

      {/* Mobile Quick Add */}
      <div className="md:hidden mt-4 w-full">
        {product.stock > 0 ? (
          <AnimatedAddToCart
            className="compact"
            onClick={() => addToCart(product, 1, false)}
            onComplete={() => setIsCartOpen(true)}
          />
        ) : (
          <button disabled className="w-full py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200">
            <ShoppingCart size={14} /> Out of Stock
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
