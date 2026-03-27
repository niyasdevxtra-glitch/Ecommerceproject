import React, { useState, useEffect } from 'react';
import API from '../../services/api';

const COLORS = ['bg-[#7F56D9]', 'bg-[#2E90FA]', 'bg-[#32D583]', 'bg-[#F79009]', 'bg-[#D6BBFB]'];

export default function TopSoldItems() {
  const [topItems, setTopItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopItems = async () => {
      try {
        const res = await API.get('/admin/orders');
        if (res.data.orders) {
          const salesMap = {};
          
          res.data.orders.forEach(order => {
            if (order.orderstatus !== 'cancelled' && order.items) {
              order.items.forEach(item => {
                if (item.product && item.product.name) {
                  const pName = item.product.name;
                  salesMap[pName] = (salesMap[pName] || 0) + item.quantity;
                }
              });
            }
          });

          const sortedItems = Object.keys(salesMap)
            .map(name => ({ name, sales: salesMap[name] }))
            .sort((a, b) => b.sales - a.sales)
            .slice(0, 5)
            .map((item, index) => ({
              ...item,
              color: COLORS[index % COLORS.length]
            }));

          setTopItems(sortedItems);
        }
      } catch (error) {
        console.error("Failed to fetch top items", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopItems();
  }, []);

  const maxSales = topItems.length > 0 ? Math.max(...topItems.map(item => item.sales)) : 1;

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm h-full flex flex-col min-h-[400px]">
        <div className="flex items-center justify-between mb-8 gap-4">
            <h3 className="text-lg font-bold text-gray-900 whitespace-nowrap">Top Sold Items</h3>
        </div>
        <div className="flex-1 flex items-center justify-center">
            <span className="text-gray-400 font-bold text-xs tracking-widest uppercase animate-pulse">Aggregating Data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm h-full flex flex-col min-h-[400px]">
      <div className="flex items-center justify-between mb-8 gap-4">
        <h3 className="text-lg font-bold text-gray-900 whitespace-nowrap">Top Sold Items</h3>
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">All Time</span>
      </div>
      <div className="space-y-6 flex-1">
        {topItems.length > 0 ? topItems.map((item) => (
          <div key={item.name} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-gray-900 truncate max-w-[150px]">{item.name}</span>
              <span className="text-xs font-black text-gray-400 uppercase tracking-widest">{item.sales} SOLD</span>
            </div>
            <div className="h-2 w-full bg-gray-50 rounded-full overflow-hidden">
              <div 
                className={`h-full ${item.color} rounded-full transition-all duration-1000`} 
                style={{ width: `${(item.sales / maxSales) * 100}%` }}
              ></div>
            </div>
          </div>
        )) : (
            <div className="flex-1 flex items-center justify-center">
               <span className="text-gray-400 font-bold text-xs tracking-widest uppercase">No Sales Yet</span>
            </div>
        )}
      </div>
      <button className="w-full mt-10 py-3.5 border border-gray-100 rounded-2xl text-xs font-black text-gray-400 uppercase tracking-widest hover:bg-gray-50 transition-colors shadow-sm">
        Full Report
      </button>
    </div>
  );
}
