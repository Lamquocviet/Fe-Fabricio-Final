import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const data = [
  { name: 'T2', downloads: 4000, interactions: 2400 },
  { name: 'T3', downloads: 3000, interactions: 1398 },
  { name: 'T4', downloads: 2000, interactions: 9800 },
  { name: 'T5', downloads: 2780, interactions: 3908 },
  { name: 'T6', downloads: 1890, interactions: 4800 },
  { name: 'T7', downloads: 2390, interactions: 3800 },
  { name: 'CN', downloads: 3490, interactions: 4300 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-zinc-900 border border-white/10 p-3 rounded-lg shadow-xl">
        <p className="text-white mb-2">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }} className="text-sm">
            {entry.name}: <span className="font-bold">{entry.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const DownloadsInteractionsChart = ({ filter }) => {
  return (
    <div className="bg-zinc-900/60 backdrop-blur-sm border border-white/5 rounded-2xl p-6">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-white">Tải game cá nhân & Tương tác</h3>
        <p className="text-sm text-zinc-400">Thống kê theo thời gian</p>
      </div>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorDownloads" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorInteractions" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
            <XAxis dataKey="name" stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            <Area type="monotone" name="Lượt tải" dataKey="downloads" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#colorDownloads)" />
            <Area type="monotone" name="Tương tác" dataKey="interactions" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorInteractions)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DownloadsInteractionsChart;
