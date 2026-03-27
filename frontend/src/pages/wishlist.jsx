import React from 'react';
import Navbar from '../components/layout/navbar';
import ProductCard from '../components/common/ProductCard';
import { useWishlist } from '../context/WishlistContext';
import { Heart, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

const Wishlist = () => {
  const { wishlistItems } = useWishlist();

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4">
              Wishlist
            </h1>
          </div>
        </div>

        {wishlistItems.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {wishlistItems.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6 text-gray-300">
              <Heart size={40} />
            </div>
            <h2 className="text-2xl font-bold mb-2">Your wishlist is empty</h2>
            <p className="text-gray-500 mb-8 max-w-xs">
              Looks like you haven't added any favorites yet. Start exploring our collection!
            </p>
            <Link 
              to="/Product" 
              className="px-8 py-4 bg-black text-white rounded-2xl font-bold hover:bg-zinc-800 transition-all flex items-center gap-2"
            >
              <ShoppingBag size={18} /> Shop Products
            </Link>
          </div>
        )}
      </main>
    </div>
  );
};

export default Wishlist;
