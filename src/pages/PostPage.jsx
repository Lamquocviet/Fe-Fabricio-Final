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
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Header />

      <div className="flex me-4">
        <Sidebar />

        <main className="flex-1">
          <div className="space-y-8 px-4 py-6 lg:p-0">
            <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.035] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-8 lg:p-10">
              <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#ff6a4a]/10 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-28 left-1/3 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl" />

              <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <span className="inline-flex items-center rounded-full border border-orange-400/20 bg-orange-400/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-orange-300">
                    Community Feed
                  </span>

                  <h1 className="mt-5 max-w-4xl text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
                    Threads-style posts for players and devs
                  </h1>

                  <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-400">
                    Share updates, celebrate launches, discuss gameplay, and
                    stay connected with creators and players across FabricIO.
                  </p>
                </div>

                <div className="hidden rounded-3xl border border-white/10 bg-white/5 px-5 py-4 text-right lg:block">
                  <p className="text-3xl font-black text-white">
                    {posts?.length || 0}
                  </p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                    Posts loaded
                  </p>
                </div>
              </div>
            </section>

            <section className="overflow-hidden rounded-[28px] border border-white/10 bg-[#111113]/80 p-5 shadow-[0_18px_60px_rgba(0,0,0,0.28)] backdrop-blur-xl sm:p-6">
              <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="text-2xl font-extrabold text-white">
                    Create a post
                  </h2>
                  <p className="mt-1 text-sm text-zinc-400">
                    Chia sẻ cập nhật, câu hỏi hoặc cảm nhận mới với cộng đồng.
                  </p>
                </div>

                <span className="w-fit rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-zinc-400">
                  {user
                    ? `Posting as ${user?.displayName || user?.username}`
                    : "Guest mode"}
                </span>
              </div>

              <CreatePostBox
                user={user}
                onPostCreated={handleCreatePost}
                loading={creating}
                error={error}
              />
            </section>

            {error && (
              <p className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
                {error}
              </p>
            )}

            <section className="overflow-hidden rounded-[28px] border border-white/10 bg-[#111113]/80 p-5 shadow-[0_18px_60px_rgba(0,0,0,0.28)] backdrop-blur-xl sm:p-6">
              <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="text-2xl font-extrabold text-white">
                    Latest Posts
                  </h2>
                  <p className="mt-1 text-sm text-zinc-400">
                    Những bài viết mới nhất từ người chơi và nhà phát triển.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={refetch}
                  className="w-fit rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-zinc-200 transition hover:bg-white/10 hover:text-white"
                >
                  Refresh
                </button>
              </div>

              {loading ? (
                <div className="flex min-h-[220px] items-center justify-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-orange-500/30 border-t-orange-400" />
                    <p className="text-sm text-zinc-500">
                      Đang tải bài viết...
                    </p>
                  </div>
                </div>
              ) : posts.length > 0 ? (
                <div className="space-y-4">
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
              ) : (
                <div className="rounded-3xl border border-dashed border-white/10 bg-black/20 px-6 py-14 text-center">
                  <p className="text-lg font-bold text-white">
                    Chưa có bài viết nào
                  </p>
                  <p className="mt-2 text-sm text-zinc-500">
                    Hãy là người đầu tiên chia sẻ điều gì đó với cộng đồng.
                  </p>
                </div>
              )}
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PostPage;
