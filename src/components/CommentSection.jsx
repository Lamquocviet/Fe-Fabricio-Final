import React, { useEffect, useRef } from "react";
import useInfiniteComments from "../hooks/useInfiniteComments";
import CommentItem from "./CommentItem";

export default function CommentSection({ postId, isOpen }) {
  const containerRef = useRef(null);

  const { comments, loading, initialLoading, error, hasNextPage, loadMore } =
    useInfiniteComments(postId, isOpen);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !isOpen) return;

    const handleScroll = () => {
      const threshold = 80;
      const reachedBottom =
        container.scrollTop + container.clientHeight >=
        container.scrollHeight - threshold;

      if (reachedBottom && hasNextPage && !loading) {
        loadMore();
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [isOpen, hasNextPage, loading, loadMore]);

  if (!isOpen) return null;

  return (
    <div className="mt-4 rounded-[26px] border border-white/8 bg-[#0d0e10] p-3">
      {initialLoading ? (
        <div className="space-y-3">
          <div className="h-16 animate-pulse rounded-2xl bg-white/5" />
          <div className="h-16 animate-pulse rounded-2xl bg-white/5" />
          <div className="h-16 animate-pulse rounded-2xl bg-white/5" />
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200">
          {error}
        </div>
      ) : (
        <div
          ref={containerRef}
          className="max-h-65 space-y-3 overflow-y-auto pr-1">
          {comments.length === 0 ? (
            <div className="rounded-2xl border border-white/8 bg-white/2 p-4 text-sm text-zinc-400">
              Chưa có comment nào.
            </div>
          ) : (
            comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
              />
            ))
          )}

          {loading && (
            <div className="space-y-3 pt-1">
              <div className="h-16 animate-pulse rounded-2xl bg-white/5" />
              <div className="h-16 animate-pulse rounded-2xl bg-white/5" />
            </div>
          )}

          {!hasNextPage && comments.length > 0 && (
            <div className="py-2 text-center text-sm text-zinc-500">
              Đã hiển thị hết comments
            </div>
          )}
        </div>
      )}
    </div>
  );
}
