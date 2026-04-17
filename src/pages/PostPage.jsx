import React, { useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import CreatePostBox from "@/components/CreatePostBox";
import PostCard from "../components/PostCard";
import { mockPosts } from "../mocks/postMock";
import useAuth from "../hooks/useAuth";

const PostPage = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const handlePostCreated = (newPost) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Header />

      <div className="flex">
        <Sidebar />

        <section className="flex-1 min-h-screen bg-[#050505] text-white">
          <div className="w-full px-5 py-8">
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#090909] p-6 md:p-10">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,90,90,0.2),transparent_40%),linear-gradient(180deg,rgba(255,255,255,0.03),transparent)]" />

              <div className="relative flex flex-col gap-6 lg:flex-row lg:justify-between">
                <div>
                  <span className="inline-block rounded-full border border-white/10 bg-white/5 px-4 py-1 text-sm">
                    Community Feed
                  </span>

                  <h1 className="mt-4 text-4xl font-bold leading-tight md:text-5xl">
                    Threads-style posts for players and devs
                  </h1>

                  <p className="mt-3 max-w-2xl text-white/60">
                    Share updates, celebrate launches, and expand mock comments
                    without leaving the page.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <CreatePostBox
                user={user}
                onPostCreated={handlePostCreated}
              />
            </div>

            <div className="mt-6 space-y-4">
              {mockPosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                />
              ))}
            </div>

            <div className="mt-6 h-px bg-white/10" />
          </div>
        </section>
      </div>
    </div>
  );
};

export default PostPage;
