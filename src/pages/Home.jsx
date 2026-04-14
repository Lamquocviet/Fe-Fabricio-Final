import React from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import FeaturedDropSection from "../sections/FeaturedDropSection";
import FeaturedGamesSection from "../sections/FeaturedGamesSection";
import TrendingNowSection from "../sections/TrendingNowSection";
import LatestPostsSection from "../sections/LatestPostsSection";
import useHomeFeed from "../hooks/useHomeFeed";

export default function Home() {
  const { featuredDrop, featuredGames, trendingGames, posts, loading, error } = useHomeFeed();

  if (loading) {
    return (
      <div className="space-y-6 bg-[#050505] px-4 py-6 text-white lg:px-6">
        <div className="h-90 animate-pulse rounded-[30px] bg-white/5" />
        <div className="h-105 animate-pulse rounded-[30px] bg-white/5" />
        <div className="h-80 animate-pulse rounded-[30px] bg-white/5" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#050505] px-4 py-6 text-white lg:px-6">
        <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-5 text-red-200">
          Failed to load home feed: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 px-4 py-6 lg:px-6">
          <div className="space-y-8">
            <FeaturedDropSection featuredDrop={featuredDrop} />
            <FeaturedGamesSection games={featuredGames} />
            <TrendingNowSection games={trendingGames} />
            <LatestPostsSection posts={posts} />
          </div>
        </main>
      </div>
    </div>
  );
}
