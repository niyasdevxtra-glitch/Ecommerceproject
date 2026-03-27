import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import KPICards from '../../components/admin/KPICards';
import { SalesTrendChart, WeeklyPerformanceChart } from '../../components/admin/Charts';
import OrdersTable from '../../components/admin/OrdersTable';
import TopSoldItems from '../../components/admin/TopItems';
import API from '../../services/api';

export default function AdminDashboard() {
  const [data, setData] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalProducts: 0,
    orders: [],
    salesTrend: [],
    weeklyData: [],
    loading: true,
    error: null
  });

  const fetchDashboardData = async () => {
    try {
      setData(prev => ({ ...prev, loading: true, error: null }));

      // Fetch sequentially to avoid potential session concurrency issues in dev
      const ordersRes = await API.get('/admin/orders');
      const usersRes = await API.get('/admin/users');
      const productsRes = await API.get('/api/products');

      const fetchedOrders = ordersRes.data.orders || [];
      const fetchedUsers = usersRes.data.userlist || [];
      const fetchedProducts = productsRes.data || [];

      // Calculate Total Revenue
      const revenue = fetchedOrders
        .filter(o => o.orderstatus !== 'cancelled')
        .reduce((sum, o) => sum + (o.totalamount || 0), 0);

      // Compute Trends
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const trendMap = {};
      fetchedOrders.forEach(order => {
        const date = new Date(order.orderdate);
        const month = months[date.getMonth()];
        trendMap[month] = (trendMap[month] || 0) + (order.totalamount || 0);
      });
      const salesTrend = months.map(m => ({ name: m, current: trendMap[m] || 0, last: (trendMap[m] || 0) * 0.8 }));

      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const weeklyMap = {};
      fetchedOrders.forEach(order => {
        const date = new Date(order.orderdate);
        const day = days[date.getDay()];
        weeklyMap[day] = (weeklyMap[day] || 0) + 1;
      });
      const weeklyData = days.map(d => ({ day: d, thisWeek: weeklyMap[d] || 0, lastWeek: Math.floor((weeklyMap[d] || 0) * 0.7) }));

      setData({
        totalRevenue: revenue,
        totalOrders: fetchedOrders.length,
        totalCustomers: fetchedUsers.length,
        totalProducts: fetchedProducts.length,
        orders: fetchedOrders.slice(0, 5),
        salesTrend,
        weeklyData,
        loading: false,
        error: null
      });
    } catch (err) {
      console.error("Dashboard Fetch Error:", err);
      setData(prev => ({ 
        ...prev, 
        loading: false, 
        error: err.response?.data?.message || "Failed to load dashboard data." 
      }));
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-8">
        {data.error && (
            <div className="p-4 rounded-2xl bg-red-50 text-red-600 font-bold border border-red-100 flex items-center justify-between animate-in fade-in slide-in-from-top-2">
                <span>{data.error}</span>
                <button onClick={fetchDashboardData} className="px-4 py-1.5 bg-red-100 rounded-lg hover:bg-red-200 transition-all text-xs">Retry</button>
            </div>
        )}

        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <KPICards 
                revenue={data.totalRevenue}
                orders={data.totalOrders}
                customers={data.totalCustomers}
                products={data.totalProducts}
                loading={data.loading}
            />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
          <div className="lg:col-span-2">
            <SalesTrendChart data={data.salesTrend} loading={data.loading} />
          </div>
          <div className="lg:col-span-1">
            <WeeklyPerformanceChart data={data.weeklyData} loading={data.loading} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200 pb-8">
          <div className="lg:col-span-2">
            <OrdersTable orders={data.orders} loading={data.loading} onUpdate={fetchDashboardData} />
          </div>
          <div className="lg:col-span-1">
            <TopSoldItems />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
