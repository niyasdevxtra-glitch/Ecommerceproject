import React, { useState, useEffect } from 'react';
import API from '../services/api';
import Navbar from '../components/layout/navbar';
import Footer from '../components/layout/footer';
import { Package, XCircle, Clock, CheckCircle2 } from 'lucide-react';

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await API.get('/order');
            if (res.data.success) {
                setOrders(res.data.orders);
            }
        } catch (error) {
            if (error.response && error.response.status !== 404) {
                console.error("Failed to fetch orders:", error);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (orderId) => {
        if (!window.confirm("Are you sure you want to cancel this order?")) return;
        
        try {
            const res = await API.delete(`/order/${orderId}`);
            if (res.data.success) {
                setOrders(orders.map(order => 
                    order._id === orderId ? { ...order, orderstatus: 'cancelled' } : order
                ));
            }
        } catch (error) {
            console.error("Cancellation failed:", error);
            alert(error.response?.data?.message || "Failed to cancel order.");
        }
    };

    const getStatusDesign = (status) => {
        switch (status?.toLowerCase()) {
            case 'pending': return { icon: <Clock size={16} />, color: "text-amber-500", bg: "bg-amber-50", text: "Processing" };
            case 'shipped': return { icon: <Package size={16} />, color: "text-blue-500", bg: "bg-blue-50", text: "In Transit" };
            case 'delivered': return { icon: <CheckCircle2 size={16} />, color: "text-green-500", bg: "bg-green-50", text: "Delivered" };
            case 'cancelled': return { icon: <XCircle size={16} />, color: "text-red-500", bg: "bg-red-50", text: "Cancelled" };
            default: return { icon: <Package size={16} />, color: "text-gray-500", bg: "bg-gray-50", text: status };
        }
    };

    const getDeliveryEstimate = (order) => {
        if (order.orderstatus === 'cancelled') return 'Order Cancelled';
        if (order.orderstatus === 'delivered') return 'Delivered';
        
        const baseDate = order.shippedAt ? new Date(order.shippedAt) : new Date(order.orderdate || Date.now());
        const daysToAdd = order.carrierService === 'Express' ? 2 : 5;
        baseDate.setDate(baseDate.getDate() + daysToAdd);
        
        const day = baseDate.getDate();
        const suffix = ["th", "st", "nd", "rd"][((day % 100) - 20) % 10] || ["th", "st", "nd", "rd"][day % 100] || "th";
        const formatted = baseDate.toLocaleDateString("en-US", { weekday: 'long', month: 'short' }) + ` ${day}${suffix}`;
        
        return `Arriving by ${formatted}`;
    };

    const renderProgressBar = (status) => {
        if (status === 'cancelled') return null;
        
        const steps = ['Ordered', 'Packed', 'Shipped', 'Delivered'];
        let activeIndex = 0;
        if (status === 'shipped') activeIndex = 2;
        if (status === 'delivered') activeIndex = 3;

        return (
            <div className="w-full mt-10 mb-8 px-4">
                <div className="flex items-center justify-between relative">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1.5 bg-gray-100 rounded-full"></div>
                    <div 
                        className="absolute left-0 top-1/2 -translate-y-1/2 h-1.5 bg-green-500 rounded-full transition-all duration-1000"
                        style={{ width: `${(activeIndex / (steps.length - 1)) * 100}%` }}
                    ></div>
                    
                    {steps.map((step, idx) => {
                        const isActive = idx <= activeIndex;
                        return (
                            <div key={step} className="relative flex flex-col items-center group">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 transition-all duration-500 ${isActive ? 'bg-green-500 text-white shadow-lg shadow-green-200 scale-110' : 'bg-gray-200 text-transparent scale-100'}`}>
                                    <CheckCircle2 size={16} />
                                </div>
                                <span className={`absolute top-10 text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-colors duration-500 ${isActive ? 'text-green-600' : 'text-gray-400'}`}>
                                    {step}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            <Navbar />
            <main className="max-w-5xl mx-auto px-4 md:px-8 py-16">
                <header className="mb-12">
                    <h1 className="text-4xl font-black uppercase tracking-tighter">My Orders</h1>
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mt-2 block">Order History</p>
                </header>

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="bg-white p-12 rounded-[3rem] text-center border border-gray-100 shadow-xl shadow-black/5">
                        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                            <Package size={40} />
                        </div>
                        <h2 className="text-2xl font-black mb-2">No Orders Found</h2>
                        <p className="text-gray-400 font-medium">Your order history is currently empty.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => {
                            const statusDes = getStatusDesign(order.orderstatus);
                            return (
                                <div key={order._id} className="bg-white rounded-[2.5rem] p-6 md:p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300">
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 pb-8 border-b border-gray-100">
                                        <div>
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border ${statusDes.color.replace('text-', 'border-')} ${statusDes.color} ${statusDes.bg}`}>
                                                    {statusDes.icon}
                                                    {statusDes.text}
                                                </span>
                                                <span className="text-gray-400 text-xs font-bold font-mono">#{order._id.slice(-8)}</span>
                                            </div>
                                            <h3 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight mt-3">
                                                {getDeliveryEstimate(order)}
                                            </h3>
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">
                                                Ordered on {new Date(order.orderdate || Date.now()).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' })}
                                            </p>
                                        </div>
                                        
                                        <div className="flex items-center gap-6">
                                            <div className="text-right">
                                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Total Payload</p>
                                                <p className="text-2xl font-black">₹{order.totalamount?.toLocaleString()}</p>
                                            </div>
                                            
                                            {order.orderstatus === "pending" && (
                                                <button 
                                                    onClick={() => handleCancel(order._id)}
                                                    className="px-6 py-3 bg-red-50 text-red-500 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all active:scale-95"
                                                >
                                                    Cancel Order
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Progress Tracker UI */}
                                    {renderProgressBar(order.orderstatus)}
                                    
                                    <div className="mt-12 space-y-4">
                                        {order.items.map((item, idx) => (
                                            <div key={idx} className="flex items-center gap-4 group">
                                                <div className="w-4 h-4 rounded-full border-2 border-gray-200 group-hover:border-black transition-colors" />
                                                <div className="flex-1 flex justify-between items-center bg-gray-50 rounded-2xl p-4">
                                                    <div className="flex flex-col">
                                                        <p className="font-bold text-sm tracking-tight text-gray-800">
                                                            {item.product?.name || `Hardware ID: ${item.product?._id?.slice(-6) || item.product?.slice(-6)}`}
                                                        </p>
                                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">
                                                            Qty: {item.quantity}
                                                        </span>
                                                    </div>
                                                    <span className="font-black">₹{item.price ? item.price.toLocaleString() : "N/A"}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
}
