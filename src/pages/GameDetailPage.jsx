import React, { useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import GameDetailSection from "@/sections/GameDetailSection";
import { useGameDetail } from "../hooks/useGameDetail";

const GameDetailPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const { game, loading } = useGameDetail();

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Header onOpenSidebar={() => setIsSidebarOpen(true)} />

      <div className="flex">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        <main className="flex-1 min-h-screen">
          {loading ? (
            <div className="flex items-center justify-center h-screen">
              <div className="text-2xl text-zinc-400">Đang tải thông tin game...</div>
            </div>
          ) : (
            game && <GameDetailSection game={game} />
          )}
        </main>
      </div>
    </div>
  );
};

export default GameDetailPage;