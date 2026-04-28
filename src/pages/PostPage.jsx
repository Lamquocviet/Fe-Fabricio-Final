/* eslint-disable no-unused-vars */
import React from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import CreatePostBox from "@/components/CreatePostBox";
import PostCard from "../components/PostCard";
import useAuth from "@/contexts/AuthContext";
import usePosts from "../hooks/usePost";

const PostPage = () => {
  const {
    posts,
    comments,
    loading,
    creating,
    deleting,
    error,
    createPost,
    updatePost,
    deletePost,

    getPostComments,
    createComment,
    createReaction,
    removeReaction,
    refetch,
  } = usePosts({ page: 1, limit: 10 });

  const { user } = useAuth();

  const handleCreatePost = async (payload) => {
    await createPost({
      ...payload,
    });

    await refetch();
  };

  const handleUpdatePost = async (postId, payload) => {
    await updatePost(postId, payload);

    await refetch();
  };

  const handleDeletePost = async (postId) => {
    await deletePost(postId);
    await refetch();
  };

  const handleCreateComment = async (postId, payload) => {
    await createComment(postId, payload);
    // await refetch();
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Header />

      <div className="flex">
        <Sidebar />

        <section className="min-h-screen flex-1 bg-[#050505] text-white">
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
                onPostCreated={handleCreatePost}
                loading={creating}
                error={error}
              />
            </div>

            {error && (
              <p className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
                {error}
              </p>
            )}

            {loading ? (
              <p className="mt-6 text-white/60">Đang tải bài viết...</p>
            ) : (
              <div className="mt-6 space-y-4">
                {posts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    currentUser={user}
                    onUpdatePost={handleUpdatePost}
                    onDeletePost={handleDeletePost}
                    onGetComments={getPostComments}
                    comments={comments[post.id] || []}
                    onCreateComment={handleCreateComment}
                    createReaction={createReaction}
                    removeReaction={removeReaction}
                    deleting={deleting}
                  />
                ))}
              </div>
            )}

            <div className="mt-6 h-px bg-white/10" />
          </div>
        </section>
      </div>
    </div>
  );
};

export default PostPage;
