import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/layout/navbar";
import Footer from "../components/layout/footer";
import AnimatedOrderButton from "../components/common/AnimatedOrderButton";
import { 
    ChevronRight, 
    MapPin, 
    CreditCard, 
    CheckCircle2, 
    ArrowLeft, 
    ShieldCheck, 
    Truck, 
    Package,
    ArrowRight
} from "lucide-react";
import API from "../services/api";

const STEPS = ["Shipping", "Payment", "Review"];

export default function CheckoutPage() {
    const { isLoggedIn } = useAuth();
    const { cartItems, cartTotal, clearCart } = useCart();
    const [currentStep, setCurrentStep] = useState(0);
    const [shippingData, setShippingData] = useState({
        address: "",
        city: "",
        pincode: "",
        phone: ""
    });
    const [paymentMethod, setPaymentMethod] = useState("COD");
    const [isProcessing, setIsProcessing] = useState(false);
    const navigate = useNavigate();

    const hasExpress = cartItems.some(item => item.shippingMethod === 'Express');
    const expressFee = hasExpress ? 100 : 0;
    const finalTotal = cartTotal + expressFee;

    useEffect(() => {
        if (!isLoggedIn) {
            navigate("/login", { state: { from: "/checkout" } });
        }
    }, [isLoggedIn, navigate]);

    const handleShippingSubmit = (e) => {
        e.preventDefault();
        setCurrentStep(1);
    };

    const handlePlaceOrder = async () => {
        setIsProcessing(true);
        try {
            const orderData = {
                items: cartItems.map(item => ({
                    productId: item.productId._id,
                    quantity: item.quantity,
                    price: item.productId.price
                })),
                totalPrice: finalTotal,
                shippingaddress: `${shippingData.address}, ${shippingData.city} - ${shippingData.pincode}`,
                paymentMethod,
                phoneNumber: shippingData.phone,
                carrierService: hasExpress ? 'Express' : 'Standard'
            };

            const res = await API.post("/order", orderData, { withCredentials: true });
            if (res.data.success) {
                alert("Order Placed Successfully! 🚀");
                // Clear cart after successful order
                if (typeof clearCart === 'function') {
                    clearCart();
                }
                navigate("/orders");
            }
        } catch (error) {
            console.error("Order failed", error);
            const errorMsg = error.response?.data?.message || "Failed to place order. Please try again.";
            alert(`Error: ${errorMsg}`);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            <Navbar />

            <main className="max-w-4xl mx-auto px-4 md:px-8 py-12">
                {/* Progress Indicator */}
                <div className="flex items-center justify-between mb-16 relative">
                    <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -z-10 group" />
                    <div className="absolute top-1/2 left-0 h-0.5 bg-black transition-all duration-500 -z-10" style={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }} />
                    
                    {STEPS.map((step, idx) => (
                        <div key={step} className="flex flex-col items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black transition-all ${
                                idx <= currentStep ? "bg-black text-white scale-110 shadow-xl shadow-black/20" : "bg-white text-gray-300 border-2 border-gray-100"
                            }`}>
                                {idx < currentStep ? <CheckCircle2 size={20} /> : idx + 1}
                            </div>
                            <span className={`text-[10px] font-black uppercase tracking-widest ${idx <= currentStep ? "text-black" : "text-gray-300"}`}>
                                {step}
                            </span>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Main Content Area */}
                    <div className="lg:col-span-12">
                        <div className="bg-white rounded-[3.5rem] p-8 md:p-12 shadow-xl shadow-black/5 border border-gray-100">
                            
                            {/* Step 0: Shipping */}
                            {currentStep === 0 && (
                                <form onSubmit={handleShippingSubmit} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <h2 className="text-3xl font-black uppercase tracking-tighter mb-10">Shipping Logistics</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2 md:col-span-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-2">Detailed Address</label>
                                            <textarea 
                                                required 
                                                value={shippingData.address}
                                                onChange={(e) => setShippingData({...shippingData, address: e.target.value})}
                                                placeholder="Unit, Floor, Building Name..." 
                                                className="w-full px-6 py-4 bg-gray-50 rounded-3xl border border-gray-100 focus:bg-white focus:ring-4 focus:ring-black/5 outline-none transition-all h-32"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-2">Urban Center (City)</label>
                                            <input 
                                                required 
                                                type="text" 
                                                value={shippingData.city}
                                                onChange={(e) => setShippingData({...shippingData, city: e.target.value})}
                                                className="w-full px-6 py-4 bg-gray-50 rounded-2xl border border-gray-100 focus:bg-white focus:ring-4 focus:ring-black/5 outline-none transition-all font-bold" 
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-2">Postal Access Code</label>
                                            <input 
                                                required 
                                                type="text" 
                                                value={shippingData.pincode}
                                                onChange={(e) => setShippingData({...shippingData, pincode: e.target.value})}
                                                className="w-full px-6 py-4 bg-gray-50 rounded-2xl border border-gray-100 focus:bg-white focus:ring-4 focus:ring-black/5 outline-none transition-all font-bold" 
                                            />
                                        </div>
                                        <div className="space-y-2 md:col-span-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-2">Communication Channel (Phone)</label>
                                            <input 
                                                required 
                                                type="tel" 
                                                value={shippingData.phone}
                                                onChange={(e) => setShippingData({...shippingData, phone: e.target.value})}
                                                className="w-full px-6 py-4 bg-gray-50 rounded-2xl border border-gray-100 focus:bg-white focus:ring-4 focus:ring-black/5 outline-none transition-all font-bold" 
                                            />
                                        </div>
                                    </div>
                                    <button type="submit" className="w-full py-5 bg-black text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 hover:bg-accent hover:text-black transition-all shadow-2xl shadow-black/20 mt-10">
                                        Submit <ArrowRight size={18} />
                                    </button>
                                </form>
                            )}

                            {/* Step 1: Payment */}
                            {currentStep === 1 && (
                                <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="flex items-center gap-4 mb-4">
                                        <button onClick={() => setCurrentStep(0)} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><ArrowLeft size={20}/></button>
                                        <h2 className="text-3xl font-black uppercase tracking-tighter">Payment Methods</h2>
                                    </div>
                                    
                                    <div className="space-y-4">
                                        <PaymentOption 
                                            id="COD" 
                                            title="Cash On Delivery (COD)" 
                                            desc="" 
                                            selected={paymentMethod === "COD"}
                                            onClick={() => setPaymentMethod("COD")}
                                        />
                                        <PaymentOption 
                                            id="Online" 
                                            title="Digital Transfer" 
                                            desc="Instant clearance via secure gateway." 
                                            disabled
                                            selected={paymentMethod === "Online"}
                                            onClick={() => setPaymentMethod("Online")}
                                        />
                                    </div>

                                    <button onClick={() => setCurrentStep(2)} className="w-full py-5 bg-black text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 hover:bg-accent hover:text-black transition-all shadow-2xl shadow-black/20">
                                        {paymentMethod === "COD" ? "Continue With COD" : "Execute Payment Logic"} <ArrowRight size={18} />
                                    </button>
                                </div>
                            )}

                            {/* Step 2: Review */}
                            {currentStep === 2 && (
                                <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="flex items-center gap-4">
                                        <button onClick={() => setCurrentStep(1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><ArrowLeft size={20}/></button>
                                        <h2 className="text-3xl font-black uppercase tracking-tighter">Final Validation</h2>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                        <div className="space-y-6">
                                            <div className="glass p-6 rounded-3xl border border-white">
                                                <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2">
                                                    <MapPin size={12} /> Target Destination
                                                </h3>
                                                <p className="font-bold text-sm leading-relaxed">
                                                    {shippingData.address}<br />
                                                    {shippingData.city} - {shippingData.pincode}<br />
                                                    <span className="text-gray-400">{shippingData.phone}</span>
                                                </p>
                                            </div>
                                            <div className="glass p-6 rounded-3xl border border-white">
                                                <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2">
                                                    <CreditCard size={12} /> Settlement Logic
                                                </h3>
                                                <p className="font-bold text-sm uppercase">{paymentMethod === "COD" ? "Cash On Delivery" : "Digital Transfer"}</p>
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            <div className="bg-gray-50 p-6 rounded-[2rem] border border-gray-100">
                                                <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-6">Manifest Content</h3>
                                                <div className="space-y-4">
                                                    {cartItems.map(item => (
                                                        <div key={item.productId._id} className="flex justify-between items-center text-xs font-bold">
                                                            <span className="text-gray-500 truncate max-w-[150px]">{item.productId.name} × {item.quantity}</span>
                                                            <span>₹{(item.productId.price * item.quantity).toLocaleString()}</span>
                                                        </div>
                                                    ))}
                                                    <div className="pt-4 border-t border-gray-200 flex justify-between items-end">
                                                        <span className="text-sm font-black uppercase tracking-tighter text-gray-400">Subtotal</span>
                                                        <span className="text-sm font-black text-gray-500">₹{cartTotal.toLocaleString()}</span>
                                                    </div>
                                                    <div className="flex justify-between items-end mt-2">
                                                        <span className="text-sm font-black uppercase tracking-tighter text-gray-400">Shipping</span>
                                                        <span className="text-sm font-black text-gray-500">{hasExpress ? '+₹100 (Express Air)' : 'Free (Standard)'}</span>
                                                    </div>
                                                    <div className="pt-4 border-t border-gray-200 flex justify-between items-end mt-4">
                                                        <span className="text-sm font-black uppercase tracking-tighter underline">Investment Core</span>
                                                        <span className="text-xl font-black">₹{finalTotal.toLocaleString()}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <AnimatedOrderButton 
                                        onClick={handlePlaceOrder}
                                        isLoading={isProcessing}
                                    />
                                </div>
                            )}

                        </div>
                    </div>
                </div>

                {/* Trust Badges */}
                <div className="mt-16 flex flex-wrap justify-center gap-10 opacity-40">
                    <TrustItem icon={<ShieldCheck size={20} />} text="Pixel Security" />
                    <TrustItem icon={<Package size={20} />} text="Hardware Verified" />
                    <TrustItem icon={<Truck size={20} />} text="Logistics Guaranteed" />
                </div>
            </main>

            <Footer />
        </div>
    );
}

function PaymentOption({ id, title, desc, selected, onClick, disabled = false }) {
    return (
        <button 
            type="button"
            disabled={disabled}
            onClick={onClick}
            className={`w-full flex items-center gap-6 p-6 rounded-3xl border transition-all duration-300 ${
                selected 
                    ? "bg-black text-white border-black shadow-2xl translate-x-1" 
                    : "bg-white text-gray-400 border-gray-100 hover:border-black/20"
            } ${disabled ? "opacity-30 cursor-not-allowed" : ""}`}
        >
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selected ? "border-accent" : "border-gray-200"}`}>
                {selected && <div className="w-2.5 h-2.5 bg-accent rounded-full" />}
            </div>
            <div className="text-left flex-1">
                <p className={`font-black uppercase tracking-tighter text-lg ${selected ? "text-white" : "text-black"}`}>{title}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">{desc}</p>
            </div>
            <CreditCard size={24} className={selected ? "text-accent" : "text-gray-200"} />
        </button>
    );
}

function TrustItem({ icon, text }) {
    return (
        <div className="flex items-center gap-3 grayscale">
            {icon}
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">{text}</span>
        </div>
    );
}
