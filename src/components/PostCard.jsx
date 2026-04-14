import React, { useState } from "react";
import CommentSection from "./CommentSection";

export default function PostCard({ post }) {
  const [showComments, setShowComments] = useState(false);

  return (
    <article className="rounded-3xl border border-white/10 bg-[#121315] p-2 shadow-[0_8px_28px_rgba(0,0,0,0.28)] lg:p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <img
            src={post.avatar}
            alt={post.name}
            className="h-10 w-10 shrink-0 rounded-full object-cover ring-1 ring-white/10"
          />

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-1.5">
              <h3 className="text-lg font-semibold leading-none text-white">
                {post.name}
              </h3>
              <span className="text-sm text-zinc-500">{post.username}</span>
              <span className="text-sm text-zinc-600">•</span>
              <span className="text-sm text-zinc-500">{post.time}</span>
            </div>
          </div>
        </div>

        <span className="shrink-0 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs capitalize text-sky-200/80">
          {post.role}
        </span>
      </div>

      <p className="mt-4 text-base leading-7 text-zinc-100">{post.content}</p>

      {!!post.media?.length && (
        <div
          className={`mt-4 grid gap-3 ${
            post.media.length > 1 ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"
          }`}>
          {post.media.map((media, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-[18px] bg-[#0e0f11]">
              <img
                src={media}
                alt={`${post.name}-${index}`}
                className={`w-full object-cover ${
                  post.media.length > 1 ? "aspect-16/8" : "aspect-16/7"
                }`}
              />
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-5 text-sm text-zinc-400">
        <button className="transition hover:text-white">
          ♥ {post.stats?.likes ?? 0}
        </button>

        <button className="transition hover:text-white">Dislike</button>

        <button
          className="transition hover:text-white"
          onClick={() => setShowComments((prev) => !prev)}>
          Comments {showComments ? "▲" : "▼"} {post.stats?.comments ?? 0}
        </button>

        {post.editable && (
          <button className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-zinc-200 transition hover:bg-white/10">
            Edit
          </button>
        )}
      </div>

      <CommentSection
        postId={post.id}
        isOpen={showComments}
      />
    </article>
  );
}
