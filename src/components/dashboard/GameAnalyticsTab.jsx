import React, { useState } from 'react';
import { ArrowLeft, Calendar } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const mockData = [
  { name: 'T2', views: 400, downloads: 240, payment: 120, ratings: 4.5, comments: 12 },
  { name: 'T3', views: 300, downloads: 139, payment: 80, ratings: 4.2, comments: 8 },
  { name: 'T4', views: 200, downloads: 980, payment: 210, ratings: 4.8, comments: 25 },
  { name: 'T5', views: 278, downloads: 390, payment: 150, ratings: 4.6, comments: 15 },
  { name: 'T6', views: 189, downloads: 480, payment: 90, ratings: 4.0, comments: 9 },
  { name: 'T7', views: 239, downloads: 380, payment: 180, ratings: 4.7, comments: 18 },
  { name: 'CN', views: 349, downloads: 430, payment: 240, ratings: 4.9, comments: 21 },
];

const ChartCard = ({ title, dataKey, color, data, type = 'area', prefix = '' }) => {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-zinc-900 border border-white/10 p-3 rounded-lg shadow-xl">
          <p className="text-white mb-2">{label}</p>
          <p style={{ color }} className="text-sm font-bold">
            {title.split(' ')[0]}: {prefix}{payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-zinc-900/60 backdrop-blur-sm border border-white/5 rounded-2xl p-6">
      <h3 className="text-lg font-bold text-white mb-6">{title}</h3>
      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          {type === 'area' ? (
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id={`color-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
              <XAxis dataKey="name" stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#ffffff20' }} />
              <Area type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2} fillOpacity={1} fill={`url(#color-${dataKey})`} />
            </AreaChart>
          ) : (
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
              <XAxis dataKey="name" stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#ffffff05' }} />
              <Bar dataKey={dataKey} fill={color} radius={[4, 4, 0, 0]} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const GameAnalyticsTab = ({ game, onBack }) => {
  const [dateFilter, setDateFilter] = useState('last_7_days');

  if (!game) return null;

  return (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-white/10 rounded-full transition-colors text-zinc-400 hover:text-white"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <div className="flex items-center gap-2 text-sm text-zinc-400 mb-1">
              <span className="cursor-pointer hover:text-white transition-colors" onClick={onBack}>Dashboard</span>
              <span>/</span>
              <span className="text-violet-400">{game.name}</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-white">Analytics</h2>
          </div>
        </div>

        {/* Date Filter */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-black/40 rounded-lg border border-white/10">
          <Calendar className="w-4 h-4 text-zinc-400" />
          <select 
            value={dateFilter} 
            onChange={(e) => setDateFilter(e.target.value)}
            className="bg-transparent text-sm text-zinc-200 outline-none cursor-pointer"
          >
            <option value="last_7_days" className="bg-zinc-900">7 ngày qua</option>
            <option value="last_30_days" className="bg-zinc-900">30 ngày qua</option>
            <option value="this_year" className="bg-zinc-900">Năm nay</option>
          </select>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Payments', value: game.price !== 'Free' ? '$' + (parseFloat(game.downloads.replace('K', '')) * parseFloat(game.price.replace('$', ''))).toFixed(2) + 'K' : '$0', color: 'text-emerald-400' },
          { label: 'Views', value: game.views, color: 'text-blue-400' },
          { label: 'Downloads', value: game.downloads, color: 'text-violet-400' },
          { label: 'Avg Rating', value: game.rating, color: 'text-amber-400' },
          { label: 'Comments', value: '1.2K', color: 'text-rose-400' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-zinc-900/60 border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-colors">
            <p className="text-zinc-400 text-sm font-medium mb-1">{stat.label}</p>
            <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <ChartCard title="Payments (Doanh thu)" dataKey="payment" color="#10b981" data={mockData} type="bar" prefix="$" />
        <ChartCard title="Views (Lượt xem)" dataKey="views" color="#3b82f6" data={mockData} />
        <ChartCard title="Downloads (Lượt tải)" dataKey="downloads" color="#8b5cf6" data={mockData} />
        <ChartCard title="Ratings (Đánh giá)" dataKey="ratings" color="#f59e0b" data={mockData} type="area" />
        <div className="md:col-span-2">
           <ChartCard title="Comments (Bình luận)" dataKey="comments" color="#f43f5e" data={mockData} type="bar" />
        </div>
      </div>
    </div>
  );
};

export default GameAnalyticsTab;
