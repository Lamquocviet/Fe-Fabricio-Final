import React from 'react';
import { Download, Gamepad2, DollarSign, Heart, MessageSquare } from 'lucide-react';

const StatCard = ({ title, value, change, icon: Icon, colorClass }) => (
  <div className="bg-zinc-900/60 backdrop-blur-sm border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-colors">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-zinc-400 text-sm font-medium mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-white">{value}</h3>
      </div>
      <div className={`p-3 rounded-xl border ${colorClass}`}>
        <Icon className="w-5 h-5" />
      </div>
    </div>
    <div className="mt-4 flex items-center text-sm">
      <span className={change.startsWith('+') ? 'text-emerald-400 font-medium' : 'text-rose-400 font-medium'}>
        {change}
      </span>
      <span className="text-zinc-500 ml-2">so với tháng trước</span>
    </div>
  </div>
);

const StatsCards = ({ filter }) => {
  const stats = [
    { title: 'Lượt tải game', value: '12,450', change: '+15.2%', icon: Download, colorClass: 'bg-violet-500/20 text-violet-400 border-violet-500/20' },
    { title: 'Browser Plays', value: '45,231', change: '+22.4%', icon: Gamepad2, colorClass: 'bg-blue-500/20 text-blue-400 border-blue-500/20' },
    { title: 'Doanh thu', value: '$8,430', change: '+8.1%', icon: DollarSign, colorClass: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/20' },
    { title: 'Cảm xúc bài viết', value: '2,845', change: '+5.4%', icon: Heart, colorClass: 'bg-rose-500/20 text-rose-400 border-rose-500/20' },
    { title: 'Bình luận', value: '1,204', change: '-2.3%', icon: MessageSquare, colorClass: 'bg-amber-500/20 text-amber-400 border-amber-500/20' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {stats.map((stat, idx) => (
        <StatCard key={idx} {...stat} />
      ))}
    </div>
  );
};

export default StatsCards;
