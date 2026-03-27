import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';

export function SalesTrendChart({ data = [], loading }) {
  return (
    <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm h-[400px] flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
            <h3 className="text-lg font-black text-gray-900">Revenue Trend</h3>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Monthly Growth Analysis</p>
        </div>
        <select className="bg-gray-50 border-none rounded-xl px-3 py-1.5 text-xs font-bold outline-none cursor-pointer text-gray-500">
            <option>2024</option>
            <option>2023</option>
        </select>
      </div>
      
      <div className="flex-1">
          {loading ? (
              <div className="w-full h-full bg-gray-50 animate-pulse rounded-2xl flex items-center justify-center text-gray-300 font-bold italic">Plotting vectors...</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9CA3AF', fontWeight: 800 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9CA3AF', fontWeight: 800 }} />
                <Tooltip 
                    contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', padding: '12px' }}
                    itemStyle={{ fontSize: '10px', fontWeight: '900', textTransform: 'uppercase' }}
                />
                <Line type="monotone" dataKey="current" stroke="#7F56D9" strokeWidth={4} dot={{ r: 4, fill: '#7F56D9', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="last" stroke="#E5E7EB" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                </LineChart>
            </ResponsiveContainer>
          )}
      </div>
    </div>
  );
}

export function WeeklyPerformanceChart({ data = [], loading }) {
  return (
    <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm h-[400px] flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
            <h3 className="text-lg font-black text-gray-900">Order Volume</h3>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Weekly Activity</p>
        </div>
      </div>
      
      <div className="flex-1">
          {loading ? (
                <div className="w-full h-full bg-gray-50 animate-pulse rounded-2xl flex items-center justify-center text-gray-300 font-bold italic">Synthesizing volume...</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9CA3AF', fontWeight: 800 }} dy={10} />
                <Tooltip 
                    cursor={{fill: '#F9FAFB'}}
                    contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', padding: '12px' }}
                />
                <Bar dataKey="thisWeek" fill="#7F56D9" radius={[6, 6, 0, 0]} barSize={16} />
                <Bar dataKey="lastWeek" fill="#E5E7EB" radius={[6, 6, 0, 0]} barSize={16} />
                </BarChart>
            </ResponsiveContainer>
          )}
      </div>
    </div>
  );
}
