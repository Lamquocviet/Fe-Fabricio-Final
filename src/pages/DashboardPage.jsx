import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

import StatsCards from "../components/dashboard/StatsCards";
import MyGamesList from "../components/dashboard/MyGamesList";
import GameAnalyticsTab from "../components/dashboard/GameAnalyticsTab";
import { userService } from "../services/userService";
import { getGameRatings, getGameComments } from "../services/gameService";
import { toast } from "sonner";

const DashboardPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [games, setGames] = useState([]);
  const [stats, setStats] = useState({
    totalGames: 0,
    totalPosts: 0,
    totalRatings: 0,
    avgRating: 0,
    totalComments: 0,
  });
  const [loading, setLoading] = useState(true);
  
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedGame, setSelectedGame] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Fetch all user games
        const myGames = await userService.getMyGames();
        
        let tRatings = 0;
        let tComments = 0;
        let sumAvgRating = 0;
        let ratedGamesCount = 0;

        // Fetch stats for each game
        const gamesWithStats = await Promise.all(
          myGames.map(async (game) => {
            let ratingData = { Total: 0, Average: 0 };
            let comments = [];
            
            try {
              ratingData = await getGameRatings(game.id);
            } catch (e) { /* ignore error if no ratings */ }
            
            try {
              comments = await getGameComments(game.id);
            } catch (e) { /* ignore error if no comments */ }

            const totalR = ratingData.total || 0;
            const avgR = ratingData.average || 0;
            const totalC = Array.isArray(comments) ? comments.length : (comments.total || 0);

            tRatings += totalR;
            tComments += totalC;
            
            if (totalR > 0) {
              sumAvgRating += avgR;
              ratedGamesCount++;
            }

            return {
              ...game,
              stats: {
                ratings: totalR,
                avgRating: avgR,
                comments: totalC,
                commentsData: Array.isArray(comments) ? comments : (comments.items || [])
              }
            };
          })
        );

        // Fetch post count
        let totalPosts = 0;
        try {
          const postsData = await userService.getUserPosts(null, { page: 1, limit: 1 });
          // API trả về { total, items, page, pageSize }
          totalPosts = postsData?.total ?? postsData?.Total ?? 0;
        } catch (e) { /* ignore */ }

        setGames(gamesWithStats);
        setStats({
          totalGames: myGames.length,
          totalPosts,
          totalRatings: tRatings,
          avgRating: ratedGamesCount > 0 ? (sumAvgRating / ratedGamesCount).toFixed(1) : 0,
          totalComments: tComments,
        });

      } catch (error) {
        toast.error("Không thể tải dữ liệu dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleSelectGame = (game) => {
    setSelectedGame(game);
    setActiveTab("analytics");
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Header onOpenSidebar={() => setIsSidebarOpen(true)} />
      <div className="flex me-4">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
        
        <main className="flex-1 p-6 md:p-8 h-screen overflow-y-auto custom-scrollbar">
          <div className="max-w-7xl mx-auto space-y-8 pb-20">
            {activeTab === "overview" ? (
              <>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">Dashboard</h1>
                    <p className="text-zinc-400 mt-1">Quản lý và theo dõi các game bạn đã xuất bản.</p>
                  </div>
                </div>

                <StatsCards stats={stats} />

                {loading ? (
                  <div className="flex justify-center py-12">
                    <div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : (
                  <MyGamesList games={games} onSelectGame={handleSelectGame} />
                )}
              </>
            ) : (
              <GameAnalyticsTab 
                game={selectedGame} 
                onBack={() => setActiveTab("overview")} 
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
