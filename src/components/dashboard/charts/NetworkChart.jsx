import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const data = [
  { name: 'Tháng 1', follower: 120, following: 80 },
  { name: 'Tháng 2', follower: 150, following: 85 },
  { name: 'Tháng 3', follower: 180, following: 90 },
  { name: 'Tháng 4', follower: 220, following: 95 },
  { name: 'Tháng 5', follower: 290, following: 100 },
];

const NetworkChart = ({ filter }) => {
  return (
    <div className="bg-zinc-900/60 backdrop-blur-sm border border-white/5 rounded-2xl p-6">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-white">Follower / Following</h3>
      </div>
      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
            <XAxis dataKey="name" stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#18181b', border: '1px solid #ffffff10', borderRadius: '8px' }}
              itemStyle={{ fontSize: '14px' }}
            />
            <Legend wrapperStyle={{ paddingTop: '10px' }} />
            <Line type="monotone" dataKey="follower" name="Followers" stroke="#0ea5e9" strokeWidth={3} dot={false} />
            <Line type="monotone" dataKey="following" name="Following" stroke="#eab308" strokeWidth={3} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default NetworkChart;
