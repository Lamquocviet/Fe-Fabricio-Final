import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';

const data = [
  { subject: 'Đồ họa', A: 120, B: 110, fullMark: 150 },
  { subject: 'Cốt truyện', A: 98, B: 130, fullMark: 150 },
  { subject: 'Gameplay', A: 86, B: 130, fullMark: 150 },
  { subject: 'Âm thanh', A: 99, B: 100, fullMark: 150 },
  { subject: 'Tối ưu', A: 85, B: 90, fullMark: 150 },
  { subject: 'Tương tác', A: 65, B: 85, fullMark: 150 },
];

const GameAnalysisChart = ({ selectedGame }) => {
  return (
    <div className="bg-zinc-900/60 backdrop-blur-sm border border-white/5 rounded-2xl p-6">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold text-white">Phân tích Game</h3>
          <p className="text-sm text-zinc-400">Đánh giá các khía cạnh {selectedGame !== 'all' ? selectedGame : ''}</p>
        </div>
      </div>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
            <PolarGrid stroke="#ffffff20" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: '#a1a1aa', fontSize: 12 }} />
            <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#18181b', border: '1px solid #ffffff10', borderRadius: '8px', color: '#fff' }}
            />
            <Radar name="Cyber City 2077" dataKey="A" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.5} />
            <Radar name="Fantasy Quest" dataKey="B" stroke="#0ea5e9" fill="#0ea5e9" fillOpacity={0.5} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default GameAnalysisChart;
