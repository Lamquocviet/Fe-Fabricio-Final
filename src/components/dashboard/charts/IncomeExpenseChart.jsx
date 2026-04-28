import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const data = [
  { name: 'Tháng 1', income: 400, expense: 240 },
  { name: 'Tháng 2', income: 300, expense: 139 },
  { name: 'Tháng 3', income: 200, expense: 980 },
  { name: 'Tháng 4', income: 278, expense: 390 },
  { name: 'Tháng 5', income: 189, expense: 480 },
  { name: 'Tháng 6', income: 239, expense: 380 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-zinc-900 border border-white/10 p-3 rounded-lg shadow-xl">
        <p className="text-white mb-2">{label}</p>
        <p className="text-emerald-400 text-sm">Thu nhập: <span className="font-bold">${payload[0].value}</span></p>
        <p className="text-rose-400 text-sm">Chi tiêu: <span className="font-bold">${payload[1].value}</span></p>
      </div>
    );
  }
  return null;
};

const IncomeExpenseChart = ({ filter }) => {
  return (
    <div className="bg-zinc-900/60 backdrop-blur-sm border border-white/5 rounded-2xl p-6">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-white">Thu / Chi mua game</h3>
      </div>
      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
            <XAxis dataKey="name" stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#ffffff05' }} />
            <Legend wrapperStyle={{ paddingTop: '10px' }} />
            <Bar dataKey="income" name="Thu nhập" fill="#10b981" radius={[4, 4, 0, 0]} />
            <Bar dataKey="expense" name="Chi tiêu" fill="#f43f5e" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default IncomeExpenseChart;
