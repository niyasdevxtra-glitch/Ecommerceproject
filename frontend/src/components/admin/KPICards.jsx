import React from 'react';
import { TrendingUp, ShoppingCart, Users, Package } from 'lucide-react';

const KPI_LIST = [
  { title: "Total Revenue", key: "revenue", icon: <TrendingUp size={24} />, color: "bg-green-50 text-green-500", prefix: "₹" },
  { title: "Total Orders", key: "orders", icon: <ShoppingCart size={24} />, color: "bg-blue-50 text-blue-500" },
  { title: "Customers", key: "customers", icon: <Users size={24} />, color: "bg-purple-50 text-[#7F56D9]" },
  { title: "Total Products", key: "products", icon: <Package size={24} />, color: "bg-orange-50 text-orange-500" },
];

export default function KPICards({ revenue, orders, customers, products, loading }) {
  const data = { revenue, orders, customers, products };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {KPI_LIST.map((kpi) => (
        <div 
          key={kpi.title} 
          className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 ${kpi.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
              {kpi.icon}
            </div>
            <div className="flex items-center gap-1 text-[10px] font-black text-green-500 bg-green-50 px-2 py-1 rounded-lg">
              <TrendingUp size={10} /> +12.5%
            </div>
          </div>
          
          <div className="space-y-1">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">
              {kpi.title}
            </h3>
            {loading ? (
                <div className="h-8 w-24 bg-gray-50 animate-pulse rounded-lg"></div>
            ) : (
                <p className="text-3xl font-black text-gray-900 tracking-tight">
                {kpi.prefix}{data[kpi.key]?.toLocaleString()}
                </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
