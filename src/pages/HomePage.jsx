import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import FeaturedDropSection from "../sections/FeaturedDropSection";
import FeaturedGamesSection from "../sections/FeaturedGamesSection";
import TrendingNowSection from "../sections/TrendingNowSection";
import LatestPostsSection from "../sections/LatestPostsSection";
import useHomeFeed from "../hooks/useHomeFeed";
import usePosts from "../hooks/usePost";
import useAuth from "@/contexts/AuthContext";

import { gameLibraryService } from "@/services/gameService";

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState(new Set());

  const { user } = useAuth();
  
  const { featuredGames, topRatedGames, posts, loading, error, refetch } =
    useHomeFeed();
  

  useEffect(() => {
    if (user) {
      gameLibraryService.getGameFavorites()
        .then(favs => {
          const ids = new Set(favs.map(g => g.id));
          setFavoriteIds(ids);
        })
        .catch(err => console.error("Lỗi lấy danh sách yêu thích:", err));
    }
  }, [user]);
  const {
    comments,
    deleting,
    updatePost,
    deletePost,
    getPostComments,
    createComment,
    createReaction,
    removeReaction,
  } = usePosts({ page: 1, limit: 10 });

  

  const handleUpdatePost = async (postId, payload) => {
    await updatePost(postId, payload);
    await refetch({ silent: true });
  };

  const handleDeletePost = async (postId) => {
    await deletePost(postId);
    await refetch({ silent: true });
  };

  const handleCreateComment = async (postId, payload) => {
    await createComment(postId, payload);
    await getPostComments(postId, 1, 5);
  };

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
      <Header onOpenSidebar={() => setIsSidebarOpen(true)} />

      <div className="flex me-4">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        <main className="flex-1">
          <div className="space-y-8 px-4 py-6 lg:p-0">
            <FeaturedDropSection featuredDrop={featuredGames} />

            <FeaturedGamesSection games={topRatedGames.slice(0, 2)} />

            <TrendingNowSection games={topRatedGames.slice(2, 6)}  favoriteIds={favoriteIds}/>

            <LatestPostsSection
              posts={posts}
              currentUser={user}
              comments={comments}
              onUpdatePost={handleUpdatePost}
              onDeletePost={handleDeletePost}
              onGetComments={getPostComments}
              onCreateComment={handleCreateComment}
              createReaction={createReaction}
              removeReaction={removeReaction}
              deleting={deleting}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
