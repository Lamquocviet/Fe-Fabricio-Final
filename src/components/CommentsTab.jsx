import { useEffect, useState } from "react";
import { getGameComments, createGameComment } from "@/services/gameService";

import useRequireAuth from "@/hooks/useRequireAuth";

export default function CommentsTab({ game }) {
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  // normalize function
  const normalizeComments = (data) => {
    return (data.items || []).map((c) => ({
      id: c.id,
      content: c.comment?.content || "",
      userName: c.commentator?.displayName || "Anonymous",
      createdAt: c.createdAt,
    }));
  };

  //  fetch comments
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
  }, [game?.id]);

  //  post comment
  const handlePost = async () => {
    try {
      if (!content.trim()) return;

      setLoading(true);

      const newComment = await createGameComment(game.id, content);

      // thêm comment mới ngay lập tức (không cần reload)
      const newItem = {
        id: newComment.id || Date.now(),
        content: newComment.comment?.content || content,
        userName: newComment.commentator?.displayName || "You",
        createdAt: new Date().toISOString(),
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

  const { requireAuth } = useRequireAuth();

  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8 md:p-10">
      {/* INPUT */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 mb-8">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Share your thoughts on this game..."
          className="w-full bg-transparent border-0 focus:outline-none text-zinc-300 placeholder-zinc-500 resize-none h-32"
        />
      </div>

      {/* BUTTON */}
      <button
        onClick={handlePost}
        disabled={loading}
        className="bg-red-600 hover:bg-red-700 transition px-10 py-4 rounded-2xl font-semibold text-lg"
      >
        {loading ? "Posting..." : "Post Comment"}
      </button>

      {/* COMMENTS LIST */}
      <div className="mt-12 max-h-[500px] overflow-y-auto pr-2 space-y-6 custom-scrollbar">
        {comments.length > 0 ? (
          comments.map((c) => (
            <div
              key={c.id}
              className="flex gap-4 p-5 rounded-2xl border border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900 transition-all duration-300"
            >
              {/* Avatar */}
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg shrink-0">
                {c.userName?.charAt(0).toUpperCase()}
              </div>

              {/* Content */}
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
