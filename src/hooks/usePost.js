/* eslint-disable no-unused-vars */
import { useCallback, useEffect, useState } from "react";
import {
  getPosts,
  createPost,
  updatePost,
  deletePost,
  getPostComments,
  createComment,
  createReaction,
  removeReaction,
} from "../services/postService";
import useRequireAuth from "@/hooks/useRequireAuth";

export default function usePosts({ page = 1, limit = 10 } = {}) {
  const { ensureAuth } = useRequireAuth();

  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState({});
  const [pagination, setPagination] = useState(null);

  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [error, setError] = useState("");

  const mapPostWithAuthor = useCallback((post) => {
    try {
      const author = post.author;

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

        // ✅ FIX QUAN TRỌNG: giữ lại object { id, mediaUrl }
        media:
          post.media
            ?.map((item) => {
              if (!item?.mediaUrl) return null;

              let url = item.mediaUrl;

              if (!url.startsWith("http://") && !url.startsWith("https://")) {
                url = `http://${url}`;
              }

              return {
                id: item.id,
                mediaUrl: url,
              };
            })
            .filter(Boolean) || [],

        stats: {
          likes: post.likeCount ?? 0,
          comments: post.commentCount ?? 0,
        },
      };
    } catch (err) {
      return {
        ...post,

        name: "Unknown User",
        avatar: "/default-avatar.png",

        time: post?.createdAt
          ? new Date(post.createdAt).toLocaleString("vi-VN")
          : "",

        media:
          post?.media
            ?.map((item) => {
              if (!item?.mediaUrl) return null;

              let url = item.mediaUrl;

              if (!url.startsWith("http://") && !url.startsWith("https://")) {
                url = `http://${url}`;
              }

              return {
                id: item.id,
                mediaUrl: url,
              };
            })
            .filter(Boolean) || [],

        stats: {
          likes: post?.likeCount ?? 0,
          comments: post?.commentCount ?? 0,
        },
      };
    }
  }, []);

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const res = await getPosts({ page, limit });

      const rawPosts = res?.items || [];

      const postsWithAuthor = await Promise.all(
        rawPosts.map((post) => mapPostWithAuthor(post)),
      );

      setPosts(postsWithAuthor);
      setPagination(res?.page || null);
    } catch (err) {
      setError(err.message || "Không lấy được danh sách bài viết");
    } finally {
      setLoading(false);
    }
  }, [page, limit, mapPostWithAuthor]);

  const handleCreatePost = async (payload) => {
    try {
      ensureAuth();
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
      ensureAuth();
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
      ensureAuth();
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

  const handleCreateReaction = async (postId, type) => {
    try {
      ensureAuth();
      await createReaction(postId, type);
    } catch (err) {
      setError(err.message || "Thêm phản ứng thất bại");
      throw err;
    }
  };

  const handleRemoveReaction = async (postId, type) => {
    try {
      ensureAuth();
      await removeReaction(postId);
    } catch (err) {
      setError(err.message || "Xoá phản ứng thất bại");
      throw err;
    }
  };

  const handleGetPostComments = async (postId, page = 1, pageSize = 5) => {
    try {
      setError("");

      const res = await getPostComments({
        postId,
        Page: page,
        PageSize: pageSize,
      });

      setComments((prev) => ({
        ...prev,
        [postId]: res?.items || res || [],
      }));

      return res;
    } catch (err) {
      setError(err.message || "Lấy bình luận thất bại");
      throw err;
    }
  };

  const handleCreateComment = async (postId, content) => {
    try {
      ensureAuth();
      setCreating(true);
      setError("");

      await createComment(postId, { content });
    } catch (err) {
      setError(err.message || "Tạo bình luận thất bại");
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
    comments,
    pagination,

    loading,
    creating,
    deleting,
    error,

    refetch: fetchPosts,
    createPost: handleCreatePost,
    updatePost: handleUpdatePost,
    deletePost: handleDeletePost,

    createReaction: handleCreateReaction,
    removeReaction: handleRemoveReaction,

    getPostComments: handleGetPostComments,
    createComment: handleCreateComment,
  };
}
