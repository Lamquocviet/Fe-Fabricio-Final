import { useCallback, useEffect, useState } from "react";
import { getFeaturedGames, getTopRatedGames } from "../services/gameService";
import { getTrendingPosts } from "../services/postService";

const DEFAULT_AVATAR =
  "https://static.vecteezy.com/system/resources/thumbnails/065/277/981/small_2x/impressive-celebrated-minimalist-geometric-portrait-flat-color-clean-lines-with-scalable-design-png.png";

export default function useHomeFeed() {
  const [featuredGames, setFeaturedGames] = useState([]);
  const [topRatedGames, setTopRatedGames] = useState([]);
  const [posts, setPosts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const normalizeMediaUrl = useCallback((url) => {
    if (!url) return "";

    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }

    return `http://${url}`;
  }, []);

  const mapPostWithAuthor = useCallback(
    (post) => {
      const author = post?.author;

      return {
        ...post,

        name: author?.displayName || "Unknown User",
        username: author?.email ? `@${author.email.split("@")[0]}` : "",
        avatar: author?.avatarUrl || DEFAULT_AVATAR,
        role: author?.role || "user",

        authorId: post?.authorId || author?.id,

        time: post?.createdAt
          ? new Date(post.createdAt).toLocaleString("vi-VN")
          : "",

        media:
          post?.media
            ?.map((item) => {
              if (!item?.mediaUrl) return null;

              return {
                id: item.id,
                mediaUrl: normalizeMediaUrl(item.mediaUrl),
              };
            })
            .filter(Boolean) || [],

        likeCount: post?.likeCount ?? 0,
        dislikeCount: post?.dislikeCount ?? 0,
        commentCount: post?.commentCount ?? 0,
        myReaction: post?.myReaction ?? null,

        stats: {
          likes: post?.likeCount ?? 0,
          comments: post?.commentCount ?? 0,
        },
      };
    },
    [normalizeMediaUrl],
  );

  const fetchHomeFeed = useCallback(
    async ({ silent = false } = {}) => {
      try {
        if (!silent) {
          setLoading(true);
        }

        setError("");

        const [gamesData, topRatedGamesData, postsData] = await Promise.all([
          getFeaturedGames(),
          getTopRatedGames(),
          getTrendingPosts(),
        ]);

        const rawPosts = postsData?.items || postsData?.data || postsData || [];

        const mappedPosts = rawPosts.map((post) => mapPostWithAuthor(post));

        setFeaturedGames(gamesData?.game || gamesData || []);
        setTopRatedGames(topRatedGamesData?.data || topRatedGamesData || []);
        setPosts(mappedPosts);
      } catch (err) {
        setError(err?.response?.data?.message || err.message || "Load failed");
      } finally {
        if (!silent) {
          setLoading(false);
        }
      }
    },
    [mapPostWithAuthor],
  );

  useEffect(() => {
    fetchHomeFeed();
  }, [fetchHomeFeed]);

  return {
    featuredGames,
    topRatedGames,
    posts,
    loading,
    error,
    refetch: fetchHomeFeed,
  };
}
