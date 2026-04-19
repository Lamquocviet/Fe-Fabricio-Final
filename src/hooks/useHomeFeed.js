import { useEffect, useState } from "react";
import { getFeaturedDrop } from "../services/homeService";
import { getFeaturedGames, getTrendingGames } from "../services/gameService";
import { getLatestPosts } from "../services/postService";

export default function useHomeFeed() {
  const [featuredDrop, setFeaturedDrop] = useState(null);
  const [featuredGames, setFeaturedGames] = useState([]);
  const [trendingGames, setTrendingGames] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(""); 

  useEffect(() => {
    let ignore = false;

    const fetchHomeFeed = async () => {
      try {
        setLoading(true);
        setError("");

        const [dropData, gamesData, trendingGames, postsData] = await Promise.all([
          getFeaturedDrop(),
          getFeaturedGames(),
          getTrendingGames(),
          getLatestPosts(),
        ]);

        if (!ignore) {
          setFeaturedDrop(dropData?.data || dropData || null);
          setFeaturedGames(gamesData?.data || gamesData || []);
          setTrendingGames(trendingGames?.data || trendingGames || []);
          setPosts(postsData?.data || postsData || []);
        }
      } catch (err) {
        if (!ignore) {
          setError(
            err?.response?.data?.message || err.message || "Load failed",
          );
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchHomeFeed();

    return () => {
      ignore = true;
    };
  }, []);

  return {
    featuredDrop,
    featuredGames,
    trendingGames,
    posts,
    loading,
    error,
  };
}
