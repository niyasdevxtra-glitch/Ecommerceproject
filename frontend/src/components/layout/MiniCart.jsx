import React from 'react';
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

export default function MiniCart() {
    const { cartItems, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, cartTotal, loading } = useCart();
    const { isLoggedIn } = useAuth();

    return (
        <div className={`fixed inset-0 z-[110] transition-all duration-500 ${isCartOpen ? "visible" : "invisible"}`}>
            {/* Backdrop */}
            <div 
                className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-500 ${isCartOpen ? "opacity-100" : "opacity-0"}`}
                onClick={() => setIsCartOpen(false)}
            />

            {/* Panel */}
            <div className={`absolute top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl transition-transform duration-500 flex flex-col ${isCartOpen ? "translate-x-0" : "translate-x-full"}`}>
                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-black text-white rounded-xl">
                            <ShoppingBag size={20} />
                        </div>
                        <div>
                            <h2 className="text-xl font-black uppercase tracking-tighter">Your Bag</h2>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mt-1">
                                {cartItems.length} Unique Concepts
                            </p>
                        </div>
                    </div>
                    <button onClick={() => setIsCartOpen(false)} className="p-3 hover:bg-black hover:text-white rounded-2xl transition-all active:scale-90">
                        <X size={24} />
                    </button>
                </div>

                {/* Items List */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
                    {cartItems.length > 0 ? (
                        cartItems.map((item, idx) => {
                            const product = item?.productId;
                            if (!product) return null; // Skip invalid items safely

                            return (
                                <div key={product._id || idx} className="flex gap-4 group">
                                    <div className="w-24 h-24 bg-gray-50 rounded-[1.5rem] overflow-hidden flex-shrink-0 border border-gray-100 transition-transform group-hover:scale-105">
                                        <img 
                                            src={product.image ? `${import.meta.env.VITE_API_BASE_URL || "http://localhost:3001"}/uploads/${product.image}` : "https://via.placeholder.com/150"} 
                                            alt={product.name || "Product"} 
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 flex flex-col justify-between py-1">
                                        <div>
                                            <h3 className="font-bold text-lg leading-tight truncate max-w-[200px]">{product.name || "Unknown Product"}</h3>
                                            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">{product.category || "Hardware"}</p>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4 bg-gray-50 rounded-xl px-2 py-1 border border-gray-100">
                                                <button onClick={() => updateQuantity(product._id, (item.quantity || 1) - 1)} className="p-1 hover:text-accent transition-colors"><Minus size={14} /></button>
                                                <span className="text-sm font-black w-4 text-center">{item.quantity}</span>
                                                <button onClick={() => updateQuantity(product._id, (item.quantity || 1) + 1)} className="p-1 hover:text-accent transition-colors"><Plus size={14} /></button>
                                            </div>
                                            <span className="font-black text-lg">₹{((product.price || 0) * (item.quantity || 0)).toLocaleString()}</span>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => removeFromCart(product._id)}
                                        className="opacity-0 group-hover:opacity-100 p-2 text-red-400 hover:text-red-500 transition-all hover:bg-red-50 rounded-xl h-fit self-center"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            );
                        })
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center">
                            <div className="p-8 bg-gray-50 rounded-full text-gray-300 mb-6 animate-pulse">
                                <ShoppingBag size={64} strokeWidth={1} />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Empty Bag</h3>
                            <p className="text-gray-400 text-sm font-medium max-w-[200px] mx-auto">
                                Your digital archive is empty. Start adding elite hardware.
                            </p>
                            <button 
                                onClick={() => setIsCartOpen(false)}
                                className="mt-8 premium-button text-xs py-3 w-full bg-black text-white hover:bg-accent hover:text-black transition-all"
                            >
                                Browse Collections
                            </button>
                        </div>
                    )}
                </div>

                {/* Footer */}
                {cartItems.length > 0 && (
                    <div className="p-6 border-t border-gray-100 bg-gray-50 space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Total Investment</span>
                            <span className="text-2xl font-black">₹{cartTotal.toLocaleString()}</span>
                        </div>
                        {isLoggedIn ? (
                            <Link 
                                to="/checkout" 
                                onClick={() => setIsCartOpen(false)}
                                className="premium-button w-full bg-black text-white flex justify-center items-center gap-3 py-4 hover:bg-accent hover:text-black transition-all"
                            >
                                Check Out <ArrowRight size={18} />
                            </Link>
                        ) : (
                            <Link 
                                to="/login" 
                                state={{ from: "/checkout" }} 
                                onClick={() => setIsCartOpen(false)}
                                className="premium-button w-full bg-black text-white flex justify-center items-center gap-3 py-4 hover:bg-accent hover:text-black transition-all"
                            >
                                Login to Checkout <ArrowRight size={18} />
                            </Link>
                        )}
                        <Link 
                            to="/cart" 
                            onClick={() => setIsCartOpen(false)}
                            className="w-full flex justify-center text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors"
                        >
                            View Cart
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
