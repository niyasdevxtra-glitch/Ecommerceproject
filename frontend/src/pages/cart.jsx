import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/layout/navbar";
import Footer from "../components/layout/footer";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck, Truck, RotateCcw } from "lucide-react";

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();
  const { isLoggedIn } = useAuth();

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        <h1 className="text-4xl font-black mb-12 uppercase tracking-tighter">Carts</h1>

        {cartItems.length > 0 ? (
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Items List */}
            <div className="flex-1 space-y-6">
              {cartItems.map((item, index) => (
                <div key={item?.productId?._id || index} className="bg-white p-6 rounded-[2.5rem] border border-gray-100 flex flex-col md:flex-row items-center gap-8 shadow-sm hover:shadow-xl hover:shadow-black/5 transition-all">
                  <div className="w-32 h-32 bg-gray-50 rounded-3xl overflow-hidden border border-gray-100 flex-shrink-0">
                    <img 
                      src={item?.productId?.image ? (item.productId.image.includes('http') ? item.productId.image : `${import.meta.env.VITE_API_BASE_URL || "http://localhost:3001"}/uploads/${item.productId.image}`) : "https://via.placeholder.com/200"} 
                      alt={item?.productId?.name || "Unavailable Product"} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-xl font-bold mb-1">{item?.productId?.name || "Product Unavailable"}</h3>
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-4">{item?.productId?.category || "General Hardware"}</p>
                    
                    <div className="flex items-center justify-center md:justify-start gap-6">
                        <div className="flex items-center gap-4 bg-gray-50 rounded-2xl px-4 py-2 border border-gray-200">
                            <button onClick={() => item?.productId && updateQuantity(item.productId._id, item.quantity - 1)} className="p-1 hover:text-accent transition-colors"><Minus size={18} /></button>
                            <span className="text-lg font-black w-6 text-center">{item.quantity}</span>
                            <button onClick={() => item?.productId && updateQuantity(item.productId._id, item.quantity + 1)} className="p-1 hover:text-accent transition-colors"><Plus size={18} /></button>
                        </div>
                        <button 
                            onClick={() => item?.productId && removeFromCart(item.productId._id)}
                            className="p-3 text-red-400 hover:bg-red-50 rounded-2xl transition-all"
                        >
                            <Trash2 size={20} />
                        </button>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-2xl font-black">₹{((item?.productId?.price || 0) * item.quantity).toLocaleString()}</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">₹{(item?.productId?.price || 0).toLocaleString()} / unit</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary Sidebar */}
            <aside className="lg:w-96 space-y-8">
              <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-xl shadow-black/5 sticky top-32">
                <h2 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-8 px-2">Investment Summary</h2>
                
                <div className="space-y-4 mb-8">
                    <div className="flex justify-between text-sm font-bold text-gray-500">
                        <span>Subtotal</span>
                        <span className="text-black">₹{cartTotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold text-gray-500">
                        <span>Shipping</span>
                        <span className="text-green-600 uppercase text-[10px] tracking-widest">Calculated at completion</span>
                    </div>
                </div>

                <div className="pt-6 border-t border-gray-100 mb-10">
                    <div className="flex justify-between items-end">
                        <span className="font-black text-xs uppercase tracking-widest">Grand Total</span>
                        <span className="text-3xl font-black">₹{cartTotal.toLocaleString()}</span>
                    </div>
                </div>

                {isLoggedIn ? (
                    <Link to="/checkout" className="premium-button w-full bg-black text-white flex justify-center items-center gap-3 py-5 hover:bg-accent hover:text-black transition-all rounded-[2rem]">
                        Check Out <ArrowRight size={20} />
                    </Link>
                ) : (
                    <Link to="/login" state={{ from: "/checkout" }} className="premium-button w-full bg-black text-white flex justify-center items-center gap-3 py-5 hover:bg-accent hover:text-black transition-all rounded-[2rem]">
                        Login to Checkout <ArrowRight size={20} />
                    </Link>
                )}

                <div className="mt-10 grid grid-cols-1 gap-4">
                    <div className="flex items-center gap-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        <ShieldCheck size={16} className="text-green-500" /> Secure Encryption
                    </div>
                    <div className="flex items-center gap-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        <Truck size={16} className="text-blue-500" /> Express Deployment
                    </div>
                    <div className="flex items-center gap-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        <RotateCcw size={16} className="text-orange-500" /> 14-Day Reset
                    </div>
                </div>
              </div>
            </aside>
          </div>
        ) : (
          <div className="text-center py-40 bg-white rounded-[5rem] border border-dashed border-gray-200">
            <div className="mb-10 inline-flex p-10 bg-gray-50 rounded-full text-gray-200">
              <ShoppingBag size={80} strokeWidth={1} />
            </div>
            <h2 className="text-3xl font-black mb-4 uppercase tracking-tighter">Your Bag is Empty</h2>
            <p className="text-gray-400 font-medium max-w-sm mx-auto mb-12">
              Your cart is empty.
              Explore our tech collections to begin your protocol.
            </p>
            <Link to="/Product" className="premium-button bg-black text-white px-12 py-4 hover:bg-accent hover:text-black transition-all">
                Access Shop
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
