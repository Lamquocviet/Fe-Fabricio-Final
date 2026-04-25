import { useCallback, useEffect, useState } from "react";
import { getPosts, createPost, deletePost } from "../services/postService";
import { getUserById } from "../services/authService";

export default function usePosts({ page = 1, limit = 10 } = {}) {
  const [posts, setPosts] = useState([]);
  const [pagination, setPagination] = useState(null);

  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [error, setError] = useState("");

  const mapPostWithAuthor = useCallback(async (post) => {
    try {
      // const author = await getUserById(post.authorId);

      return {
        ...post,

        name: author?.name || "Unknown User",
        username: author?.username || "",
        avatar: author?.avatarUrl || "/default-avatar.png",
        time: post.createdAt
          ? new Date(post.createdAt).toLocaleString("vi-VN")
          : "",

        media:
          post.media?.map((item) => {
            const url = item.mediaUrl;

            if (!url) return "";

            if (url.startsWith("http://") || url.startsWith("https://")) {
              return url;
            }

            return `http://${url}`;
          }) || [],

        stats: {
          likes: post.stats?.likes ?? 0,
          comments: post.stats?.comments ?? 0,
        },
      };
    } catch (err) {
      return {
        ...post,

        name: "Unknown User",
        username: "",
        avatar: "/default-avatar.png",
        time: post.createdAt
          ? new Date(post.createdAt).toLocaleString("vi-VN")
          : "",

        media:
          post.media?.map((item) => {
            const url = item.mediaUrl;

            if (!url) return "";

            if (url.startsWith("http://") || url.startsWith("https://")) {
              return url;
            }

            return `http://${url}`;
          }) || [],

        stats: {
          likes: post.stats?.likes ?? 0,
          comments: post.stats?.comments ?? 0,
        },
      };
    }
  }, []);

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const res = await getPosts({ page, limit });

      const rawPosts = res?.posts || [];

      const postsWithAuthor = await Promise.all(
        rawPosts.map((post) => mapPostWithAuthor(post)),
      );

      setPosts(postsWithAuthor);
      setPagination(res?.pagination || null);
    } catch (err) {
      setError(err.message || "Không lấy được danh sách bài viết");
    } finally {
      setLoading(false);
    }
  }, [page, limit, mapPostWithAuthor]);

  const handleCreatePost = async (payload) => {
    try {
      setCreating(true);
      setError("");

      console.log("Created post response:", payload);

      const res = await createPost(payload);

      const newPost = await mapPostWithAuthor(res.data);

      setPosts((prevPosts) => [newPost, ...prevPosts]);

      return res;
    } catch (err) {
      setError(err.message || "Tạo bài viết thất bại");
      throw err;
    } finally {
      setCreating(false);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      setDeleting(true);
      setError("");

      await deletePost(postId);

      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
    } catch (err) {
      setError(err.message || "Xóa bài viết thất bại");
      throw err;
    } finally {
      setDeleting(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return {
    posts,
    pagination,

    loading,
    creating,
    deleting,
    error,

    refetch: fetchPosts,
    createPost: handleCreatePost,
    deletePost: handleDeletePost,
  };
}
