import React from "react";
import PostCard from "../components/PostCard";

export default function LatestPostsSection({ posts = [] }) {
  return (
    <section className="space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">
            Latest Posts
          </h2>
          <p className="mt-2 text-base text-sky-200/70">
            Threads-style community updates from players and devs.
          </p>
        </div>

        <button className="shrink-0 rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm text-zinc-200 hover:bg-white/10">
          Open feed
        </button>
      </div>

      <div className="space-y-5">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
          />
        ))}
      </div>
    </section>
  );
}
