import useRequireAuth from "@/hooks/useRequireAuth";

export default function CommentsTab() {
  const { requireAuth } = useRequireAuth();

  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8 md:p-10">
      {/* <h2 className="text-3xl font-bold mb-6">Comments</h2> */}
      
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 mb-8">
        <textarea 
          placeholder="Share your thoughts on this game..."
          className="w-full bg-transparent border-0 focus:outline-none text-zinc-300 placeholder-zinc-500 resize-none h-32"
        />
      </div>

      <button
        type="button"
        onClick={() => requireAuth()}
        className="bg-red-600 hover:bg-red-700 transition px-10 py-4 rounded-2xl font-semibold text-lg"
      >
        Post Comment
      </button>

      {/* Comment mẫu */}
      <div className="mt-12 text-zinc-400 text-sm">
        No comments yet. Be the first to share your thoughts!
      </div>
    </div>
  );
}
