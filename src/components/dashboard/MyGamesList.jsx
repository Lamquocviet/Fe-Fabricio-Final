import React from 'react';
import { BarChart2, Star, Download, Eye } from 'lucide-react';

const MyGamesList = ({ onSelectGame }) => {
  const games = [
    { id: 1, name: "Cyber City 2077", views: "12K", downloads: "5K", rating: 4.8, price: "$19.99" },
    { id: 2, name: "Fantasy Quest", views: "8K", downloads: "3.2K", rating: 4.5, price: "Free" },
    { id: 3, name: "Space Explorer", views: "15K", downloads: "8K", rating: 4.9, price: "$9.99" },
  ];

  return (
    <div className="bg-zinc-900/60 backdrop-blur-sm border border-white/5 rounded-2xl p-6">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-white">Game của tôi</h3>
        <p className="text-sm text-zinc-400">Danh sách các game bạn đã xuất bản</p>
      </div>
      
      <div className="space-y-4">
        {games.map(game => (
          <div key={game.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-black/40 rounded-xl border border-white/5 hover:border-white/10 transition-colors gap-4">
            <div className="flex-1">
              <h4 className="text-white font-semibold text-lg">{game.name}</h4>
              <div className="flex items-center gap-4 mt-2 text-sm text-zinc-400">
                <span className="flex items-center gap-1"><Eye className="w-4 h-4" /> {game.views}</span>
                <span className="flex items-center gap-1"><Download className="w-4 h-4" /> {game.downloads}</span>
                <span className="flex items-center gap-1"><Star className="w-4 h-4 text-amber-400" /> {game.rating}</span>
                <span className="font-medium text-emerald-400">{game.price}</span>
              </div>
            </div>
            <button 
              onClick={() => onSelectGame(game)}
              className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-lg transition-colors text-sm font-medium whitespace-nowrap"
            >
              <BarChart2 className="w-4 h-4" />
              Analytics
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyGamesList;
