/* eslint-disable no-unused-vars */
import { useCallback, useEffect, useState } from "react";
import {
  getPosts,
  createPost,
  updatePost,
  deletePost,
  createComment,
} from "../services/postService";
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
      const author = await getUserById(post.authorId);

      return {
        ...post,

        name: author?.displayName || "Unknown User",
        avatar:
          author?.avatarUrl ||
          "https://static.vecteezy.com/system/resources/thumbnails/065/277/981/small_2x/impressive-celebrated-minimalist-geometric-portrait-flat-color-clean-lines-with-scalable-design-png.png",
        role: author?.role || "user",
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
        time: post?.createdAt
          ? new Date(post.createdAt).toLocaleString("vi-VN")
          : "",

        media:
          post?.media?.map((item) => {
            const url = item.mediaUrl;

            if (!url) return "";

            if (url.startsWith("http://") || url.startsWith("https://")) {
              return url;
            }

            return `http://${url}`;
          }) || [],

        stats: {
          likes: post?.stats?.likes ?? 0,
          comments: post?.stats?.comments ?? 0,
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

  const handleUpdatePost = async (postId, payload) => {
    try {
      setCreating(true);
      setError("");

      await updatePost(postId, payload);
    } catch (err) {
      setError(err.message || "Cập nhật bài viết thất bại");
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

  const handleCreateComment = async (postId, content) => {
    try {
      setCreating(true);
      setError("");

      await createComment(postId, { content });
    } catch (err) {
      setError(err.message || "Tạo bài viết thất bại");
      throw err;
    } finally {
      setCreating(false);
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
    updatePost: handleUpdatePost,
    deletePost: handleDeletePost,
    createComment: handleCreateComment,
  };
}
