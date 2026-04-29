import { useCallback, useEffect, useState } from "react";
import PostCard from "@/components/PostCard";
import { userService } from "@/services/userService";
import {
  createComment,
  createReaction,
  deletePost,
  getPostComments,
  removeReaction,
  updatePost,
} from "@/services/postService";

const DEFAULT_AVATAR =
  "https://static.vecteezy.com/system/resources/thumbnails/065/277/981/small_2x/impressive-celebrated-minimalist-geometric-portrait-flat-color-clean-lines-with-scalable-design-png.png";

const getUserId = (user) => user?.id || user?.Id || "";

const normalizeMediaUrl = (url) => {
  if (!url) return "";

  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  return `http://${url}`;
};

const getItemsFromResponse = (response) => {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.items)) return response.items;
  if (Array.isArray(response?.data?.items)) return response.data.items;
  if (Array.isArray(response?.data)) return response.data;

  return [];
};

export default function ProfileTab({ user }) {
  const [activeTab, setActiveTab] = useState("Games");
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState({});
  const [postsLoading, setPostsLoading] = useState(false);
  const [postsError, setPostsError] = useState("");
  const [deleting, setDeleting] = useState(false);

  const userId = getUserId(user);

  const tabs = [
    { id: "Games", label: "Games" },
    { id: "Posts", label: "Posts" },
    { id: "My games", label: "My games" },
  ];

  const mapPostWithAuthor = useCallback(
    (post) => {
      const author = post?.author || {};
      const rawUsername = author.username || user?.username || "";
      const username = rawUsername
        ? `@${rawUsername.toString().replace(/^@/, "")}`
        : user?.email
          ? `@${user.email.split("@")[0]}`
          : "";

      return {
        ...post,
        authorId: post?.authorId || author?.id || userId,
        name:
          author?.displayName ||
          user?.displayName ||
          user?.username ||
          "Unknown User",
        username,
        avatar: author?.avatarUrl || user?.avatarUrl || user?.avatar || DEFAULT_AVATAR,
        role: author?.role || user?.role || "user",
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
    [
      user?.avatar,
      user?.avatarUrl,
      user?.displayName,
      user?.email,
      user?.role,
      user?.username,
      userId,
    ],
  );

  const fetchUserPosts = useCallback(
    async ({ silent = false } = {}) => {
      if (!userId) return;

      try {
        if (!silent) {
          setPostsLoading(true);
        }

        setPostsError("");

        const response = await userService.getUserPosts(userId, {
          page: 1,
          limit: 20,
        });

        const mappedPosts = getItemsFromResponse(response).map(mapPostWithAuthor);
        setPosts(mappedPosts);
      } catch (error) {
        setPosts([]);
        setPostsError(error.message || "Không lấy được danh sách bài viết");
      } finally {
        if (!silent) {
          setPostsLoading(false);
        }
      }
    },
    [mapPostWithAuthor, userId],
  );

  useEffect(() => {
    if (activeTab !== "Posts") return;

    if (!userId) {
      setPosts([]);
      return;
    }

    fetchUserPosts();
  }, [activeTab, fetchUserPosts, userId]);

  const handleUpdatePost = async (postId, payload) => {
    try {
      setPostsError("");
      await updatePost(postId, payload);
      await fetchUserPosts({ silent: true });
    } catch (error) {
      setPostsError(error.message || "Cập nhật bài viết thất bại");
      throw error;
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      setDeleting(true);
      setPostsError("");

      await deletePost(postId);
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
    } catch (error) {
      setPostsError(error.message || "Xóa bài viết thất bại");
      throw error;
    } finally {
      setDeleting(false);
    }
  };

  const handleGetPostComments = async (postId, page = 1, pageSize = 5) => {
    try {
      setPostsError("");

      const response = await getPostComments({
        postId,
        Page: page,
        PageSize: pageSize,
      });

      setComments((prevComments) => ({
        ...prevComments,
        [postId]: getItemsFromResponse(response),
      }));

      return response;
    } catch (error) {
      setPostsError(error.message || "Lấy bình luận thất bại");
      throw error;
    }
  };

  const handleCreateComment = async (postId, content) => {
    try {
      setPostsError("");
      await createComment(postId, { content });
    } catch (error) {
      setPostsError(error.message || "Tạo bình luận thất bại");
      throw error;
    }
  };

  const handleCreateReaction = async (postId, reactionType) => {
    try {
      setPostsError("");
      await createReaction(postId, reactionType);
    } catch (error) {
      setPostsError(error.message || "Tương tác thất bại");
      throw error;
    }
  };

  const handleRemoveReaction = async (postId) => {
    try {
      setPostsError("");
      await removeReaction(postId);
    } catch (error) {
      setPostsError(error.message || "Xóa tương tác thất bại");
      throw error;
    }
  };

  const renderPosts = () => {
    if (!userId) {
      return (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-center text-sm text-zinc-400">
          Không tìm thấy thông tin người dùng.
        </div>
      );
    }

    if (postsLoading) {
      return <p className="text-sm text-zinc-400">Đang tải bài viết...</p>;
    }

    if (postsError) {
      return (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
          {postsError}
        </div>
      );
    }

    if (posts.length === 0) {
      return (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-center text-sm text-zinc-400">
          Chưa có bài viết nào.
        </div>
      );
    }

    return (
      <div className="space-y-5">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            currentUser={user}
            comments={comments[post.id] || []}
            onUpdatePost={handleUpdatePost}
            onDeletePost={handleDeletePost}
            onGetComments={handleGetPostComments}
            onCreateComment={handleCreateComment}
            createReaction={handleCreateReaction}
            removeReaction={handleRemoveReaction}
            deleting={deleting}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="mt-16 max-w-7xl mx-auto px-6">
      {/* Tab Navigation */}
      <div className="flex border-b border-zinc-800">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-8 py-4 text-lg font-medium transition-all relative
              ${
                activeTab === tab.id
                  ? "text-white"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500" />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-8">
        {activeTab === "Games" && <h1>Games</h1>}
        {activeTab === "Posts" && renderPosts()}
        {activeTab === "My games" && <h1>My games</h1>}
      </div>
    </div>
  );
}
