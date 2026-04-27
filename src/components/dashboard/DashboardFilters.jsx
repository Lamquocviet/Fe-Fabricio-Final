import React from 'react';
import { Calendar, Filter } from 'lucide-react';

const DashboardFilters = ({ dateRange, setDateRange, selectedGame, setSelectedGame }) => {
  return (
    <div className="flex flex-wrap items-center gap-4 bg-zinc-900/50 p-3 rounded-xl border border-white/5">
      <div className="flex items-center gap-2 px-3 py-1.5 bg-black/40 rounded-lg border border-white/10">
        <Calendar className="w-4 h-4 text-zinc-400" />
        <select 
          value={dateRange} 
          onChange={(e) => setDateRange(e.target.value)}
          className="bg-transparent text-sm text-zinc-200 outline-none cursor-pointer"
        >
          <option value="last_7_days" className="bg-zinc-900">7 ngày qua</option>
          <option value="last_30_days" className="bg-zinc-900">30 ngày qua</option>
          <option value="this_year" className="bg-zinc-900">Năm nay</option>
          <option value="all_time" className="bg-zinc-900">Tất cả</option>
        </select>
      </div>

      <div className="flex items-center gap-2 px-3 py-1.5 bg-black/40 rounded-lg border border-white/10">
        <Filter className="w-4 h-4 text-zinc-400" />
        <select 
          value={selectedGame} 
          onChange={(e) => setSelectedGame(e.target.value)}
          className="bg-transparent text-sm text-zinc-200 outline-none cursor-pointer"
        >
          <option value="all" className="bg-zinc-900">Tất cả Game</option>
          <option value="game_1" className="bg-zinc-900">Cyber City 2077</option>
          <option value="game_2" className="bg-zinc-900">Fantasy Quest</option>
        </select>
      </div>
    </div>
  );
};

export default DashboardFilters;
