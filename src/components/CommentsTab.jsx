import { useEffect, useState } from "react";
import { getGameComments, createGameComment } from "@/services/gameService";
import useRequireAuth from "@/hooks/useRequireAuth";
import useAuth from "@/contexts/AuthContext";

const API_BASE_URL = "http://localhost/";

export default function CommentsTab({ game }) {
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const { requireAuth } = useRequireAuth();
  const { user } = useAuth();

  const getAvatarUrl = (avatar, version = "") => {
    if (!avatar) return `https://static.vecteezy.com/system/resources/thumbnails/065/277/981/small_2x/impressive-celebrated-minimalist-geometric-portrait-flat-color-clean-lines-with-scalable-design-png.png`;

    const src =
      avatar.startsWith("http://") || avatar.startsWith("https://")
        ? avatar
        : `${API_BASE_URL}${avatar}`;

    return version ? `${src}?v=${version}` : src;
  };

  const normalizeComments = (data) => {
    return (data.items || []).map((c) => {
      const commentatorId =
        c.commentator?.id ||
        c.commentator?.userId ||
        c.commentatorId ||
        c.userId;

      return {
        id: c.id,
        userId: commentatorId,
        content: c.comment?.content || "",
        userName:
          c.commentator?.displayName || c.commentator?.username || "Anonymous",
        avatarRaw: c.commentator?.avatarUrl || c.commentator?.avatar,
        userAvatar: getAvatarUrl(
          c.commentator?.avatarUrl || c.commentator?.avatar,
        ),
        userRole: c.commentator?.role || "user",
        createdAt: c.createdAt,
      };
    });
  };

  useEffect(() => {
    const fetchComments = async () => {
      if (!game?.id) return;

      try {
        const res = await getGameComments(game.id);
        setComments(normalizeComments(res));
      } catch (err) {
        console.error(err);
      }
    };

    fetchComments();
  }, [
    game?.id,
    user?.id,
    user?.userId,
    user?.avatarUrl,
    user?.avatar,
    user?.avatarVersion,
    user?.updatedAt,
  ]);

  const handlePost = async () => {
    if (!requireAuth()) return;

    try {
      if (!content.trim()) return;

      setLoading(true);

      const newComment = await createGameComment(game.id, content);

      const currentUserAvatar = user?.avatarUrl || user?.avatar;

      const newItem = {
        id: newComment?.id || Date.now(),
        userId:
          newComment?.commentator?.id ||
          newComment?.commentator?.userId ||
          user?.id ||
          user?.userId,
        content: newComment?.comment?.content || content,
        userName:
          newComment?.commentator?.displayName ||
          newComment?.commentator?.username ||
          user?.displayName ||
          user?.username ||
          "You",
        avatarRaw:
          newComment?.commentator?.avatarUrl ||
          newComment?.commentator?.avatar ||
          currentUserAvatar,
        userAvatar: getAvatarUrl(
          newComment?.commentator?.avatarUrl ||
            newComment?.commentator?.avatar ||
            currentUserAvatar,
          user?.avatarVersion || user?.updatedAt || Date.now(),
        ),
        userRole: newComment?.commentator?.role || user?.role || "user",
        createdAt: newComment?.createdAt || new Date().toISOString(),
      };
      setComments((prev) => [newItem, ...prev]);

      setContent("");
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getRenderedCommentAvatar = (comment) => {
    const currentUserId = user?.id || user?.userId;

    const isCurrentUserComment =
      currentUserId &&
      comment.userId &&
      String(currentUserId) === String(comment.userId);

    if (isCurrentUserComment) {
      return getAvatarUrl(
        user?.avatarUrl || user?.avatar || comment.avatarRaw,
        user?.avatarVersion || user?.updatedAt || Date.now(),
      );
    }

    return comment.userAvatar;
  };

  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8 md:p-10">
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 mb-8">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Share your thoughts on this game..."
          className="w-full bg-transparent border-0 focus:outline-none text-zinc-300 placeholder-zinc-500 resize-none h-32"
        />
      </div>

      <button
        onClick={handlePost}
        disabled={loading}
        className="bg-red-600 hover:bg-red-700 transition px-10 py-4 rounded-2xl font-semibold text-lg"
      >
        {loading ? "Posting..." : "Post Comment"}
      </button>

      <div className="mt-12 max-h-[500px] overflow-y-auto pr-2 space-y-6 custom-scrollbar">
        {comments.length > 0 ? (
          comments.map((c) => (
            <div
              key={c.id}
              className="flex gap-4 p-5 rounded-2xl border border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg shrink-0 overflow-hidden">
                <img
                  src={getRenderedCommentAvatar(c)}
                  alt={c.userName}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-white">
                    {c.userName}
                  </p>

                  <p className="text-xs text-zinc-500">
                    {new Date(c.createdAt).toLocaleString()}
                  </p>
                </div>

                <p className="text-zinc-300 mt-2 leading-relaxed">
                  {c.content || "No content"}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-zinc-400 text-sm text-center py-10">
            No comments yet. Be the first to share your thoughts!
          </div>
        )}
      </div>
    </div>
  );
}
