import React, { useState } from 'react';
import { Eye, CheckCircle, Clock, Truck, XCircle } from 'lucide-react';
import API from '../../services/api';

const STATUS_MAP = {
  pending: { label: "Pending", color: "bg-orange-50 text-orange-600", icon: <Clock size={12} /> },
  shipped: { label: "Shipped", color: "bg-blue-50 text-blue-600", icon: <Truck size={12} /> },
  delivered: { label: "Delivered", color: "bg-green-50 text-green-600", icon: <CheckCircle size={12} /> },
  cancelled: { label: "Cancelled", color: "bg-red-50 text-red-600", icon: <XCircle size={12} /> },
};

export default function OrdersTable({ orders = [], loading, onUpdate }) {
  const [updating, setUpdating] = useState(null);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdating(orderId);
    try {
      await API.put(`/admin/orders/${orderId}`, { status: newStatus });
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error("Error updating order status:", error);
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden h-full flex flex-col">
      <div className="p-8 border-b border-gray-50 flex items-center justify-between">
        <h3 className="text-xl font-black text-gray-900">Recent Orders</h3>
        <button className="text-[10px] font-black text-[#7F56D9] uppercase tracking-widest px-4 py-2 bg-purple-50 rounded-xl hover:bg-[#7F56D9] hover:text-white transition-all">
          View All
        </button>
      </div>

      <div className="flex-1 overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50/50">
            <tr>
              <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Order ID</th>
              <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Customer</th>
              <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Amount</th>
              <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
              <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
                <tr><td colSpan="5" className="px-8 py-12 text-center text-gray-400 font-bold italic">Gathering transmission data...</td></tr>
            ) : orders.length === 0 ? (
                <tr><td colSpan="5" className="px-8 py-12 text-center text-gray-400 font-bold italic">No recent signals found.</td></tr>
            ) : orders.map((order) => (
              <tr key={order._id} className="hover:bg-gray-50/30 transition-colors group">
                <td className="px-8 py-5">
                  <span className="text-xs font-black text-gray-400">#</span>
                  <span className="text-xs font-bold text-gray-900 ml-0.5">{order._id.slice(-6).toUpperCase()}</span>
                </td>
                <td className="px-8 py-5 text-sm font-bold text-gray-900">
                  {order.shippingaddress?.split(',')[0] || "Guest Customer"}
                </td>
                <td className="px-8 py-5 text-sm font-black text-gray-900">
                  ₹{order.totalamount?.toLocaleString()}
                </td>
                <td className="px-8 py-5">
                  <select 
                    value={order.orderstatus}
                    disabled={updating === order._id}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border-none outline-none cursor-pointer transition-all ${STATUS_MAP[order.orderstatus]?.color || 'bg-gray-100 text-gray-600'}`}
                  >
                    {Object.keys(STATUS_MAP).map(status => (
                        <option key={status} value={status} className="bg-white text-gray-900">
                            {status.toUpperCase()}
                        </option>
                    ))}
                  </select>
                </td>
                <td className="px-8 py-5">
                  <button className="p-2 text-gray-300 hover:text-[#7F56D9] hover:bg-purple-50 rounded-xl transition-all">
                    <Eye size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
