import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import API from '../../services/api';
import { Eye, Search, Filter, Download } from 'lucide-react';

const STATUS_STYLING = {
  'Completed': 'bg-green-50 text-green-600',
  'Pending': 'bg-orange-50 text-orange-600',
  'Processing': 'bg-blue-50 text-blue-600',
  'Shipped': 'bg-purple-50 text-purple-600',
  'Cancelled': 'bg-red-50 text-red-600'
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await API.get('/admin/orders');
      if (res.data.orders) {
        const parsedOrders = res.data.orders.map(o => ({
            _id: o._id.slice(-6).toUpperCase(),
            realId: o._id,
            customer: o.user ? o.user.username : 'Unknown User',
            address: o.shippingaddress || 'No Address Provided',
            date: new Date(o.orderdate || Date.now()).toLocaleString("en-US", { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            }),
            price: `₹${o.totalamount?.toLocaleString()}`,
            status: o.orderstatus ? o.orderstatus.charAt(0).toUpperCase() + o.orderstatus.slice(1) : 'Unknown'
        }));
        setOrders(parsedOrders);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await API.put(`/admin/orders/${orderId}`, { status: newStatus.toLowerCase() });
      if (res.data) {
        setOrders(orders.map(o => 
          o.realId === orderId ? { 
            ...o, 
            status: newStatus.charAt(0).toUpperCase() + newStatus.slice(1) 
          } : o
        ));
      }
    } catch (error) {
      console.error("Failed to update status:", error);
      alert("Failed to update order status.");
    }
  };

  const filteredOrders = orders.filter(o => 
    o.customer?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    o._id?.includes(searchTerm)
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-gray-900">Order Management</h2>
            <p className="text-sm text-gray-500 font-medium">Track and process customer orders</p>
          </div>
          <button className="flex items-center gap-2 px-6 py-3 border border-gray-100 rounded-2xl text-sm font-bold text-gray-500 hover:bg-gray-50 transition-all">
            <Download size={18} />
            Export CSV
          </button>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by Order ID or Customer..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-50 border-none rounded-2xl py-3 pl-12 pr-4 text-sm focus:ring-2 focus:ring-[#7F56D9]/20 outline-none transition-all"
            />
          </div>
          <button className="flex items-center gap-2 px-6 py-3 border border-gray-100 rounded-2xl text-sm font-bold text-gray-500 hover:bg-gray-50 transition-all">
            <Filter size={18} />
            Filter
          </button>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Order ID</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Customer</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Address</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Date</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Total</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  Array(5).fill(0).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan="6" className="px-6 py-4 h-16 bg-gray-50/20"></td>
                    </tr>
                  ))
                ) : filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4 text-sm font-bold text-gray-900">#{order._id}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{order.customer}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 min-w-[250px] whitespace-normal break-words">{order.address}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{order.date}</td>
                    <td className="px-6 py-4 text-sm font-black text-gray-900">{order.price}</td>
                    <td className="px-6 py-4">
                      <select 
                        value={order.status.toLowerCase()} 
                        onChange={(e) => handleStatusChange(order.realId, e.target.value)}
                        className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest cursor-pointer outline-none border-r-8 border-transparent ${STATUS_STYLING[order.status] || 'bg-gray-50 text-gray-500'}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
