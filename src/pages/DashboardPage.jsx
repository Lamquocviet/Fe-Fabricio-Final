import React, { useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

import DashboardFilters from "../components/dashboard/DashboardFilters";
import StatsCards from "../components/dashboard/StatsCards";
import FeedbackNotifications from "../components/dashboard/FeedbackNotifications";
import DownloadsInteractionsChart from "../components/dashboard/charts/DownloadsInteractionsChart";
import BrowserPlaysChart from "../components/dashboard/charts/BrowserPlaysChart";
import IncomeExpenseChart from "../components/dashboard/charts/IncomeExpenseChart";
import NetworkChart from "../components/dashboard/charts/NetworkChart";
import MyGamesList from "../components/dashboard/MyGamesList";
import GameAnalyticsTab from "../components/dashboard/GameAnalyticsTab";

const DashboardPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const [dateRange, setDateRange] = useState("last_30_days");
  const [selectedFilterGame, setSelectedFilterGame] = useState("all");

  const [activeTab, setActiveTab] = useState("overview"); // "overview" | "analytics"
  const [selectedGameForAnalytics, setSelectedGameForAnalytics] = useState(null);

  const handleSelectGame = (game) => {
    setSelectedGameForAnalytics(game);
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
                    <p className="text-zinc-400 mt-1">Theo dõi hoạt động và phân tích hiệu suất của bạn.</p>
                  </div>
                  <DashboardFilters 
                     dateRange={dateRange} 
                     setDateRange={setDateRange} 
                     selectedGame={selectedFilterGame}
                     setSelectedGame={setSelectedFilterGame}
                  />
                </div>

                <StatsCards filter={dateRange} />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-8">
                    <DownloadsInteractionsChart filter={dateRange} />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <BrowserPlaysChart filter={dateRange} />
                       <IncomeExpenseChart filter={dateRange} />
                    </div>

                    <MyGamesList onSelectGame={handleSelectGame} />
                  </div>

                  <div className="space-y-8">
                     <NetworkChart filter={dateRange} />
                     <FeedbackNotifications />
                  </div>
                </div>
              </>
            ) : (
              <GameAnalyticsTab 
                game={selectedGameForAnalytics} 
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
