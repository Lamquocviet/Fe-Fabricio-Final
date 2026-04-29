/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import CommentSection from "./CommentSection";

export default function PostCard({
  post,
  comments,
  currentUser,
  onUpdatePost,
  onDeletePost,

  onGetComments,
  onCreateComment,
  createReaction,
  removeReaction,
  deleting,
}) {
  const [showComments, setShowComments] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [editTitle, setEditTitle] = useState(post.title || "");
  const [editContent, setEditContent] = useState(post.content || "");

  const [existingImages, setExistingImages] = useState(post.media || []);
  const [newImages, setNewImages] = useState([]);
  const [deletedImageIds, setDeletedImageIds] = useState([]);

  const [commentLoading, setCommentLoading] = useState(false);
  const [commentPage, setCommentPage] = useState(1);

  const [commentCount, setCommentCount] = useState(post.commentCount ?? 0);

  const handleToggleComments = async () => {
    const nextOpen = !showComments;
    setShowComments(nextOpen);

    if (!nextOpen) return;

    try {
      setCommentLoading(true);
      await onGetComments(post.id, 1, 5);
      setCommentPage(1);
    } finally {
      setCommentLoading(false);
    }
  };

  const handleCreateComment = async (postId, content) => {
    const oldCommentCount = commentCount;

    try {
      setCommentCount((prev) => prev + 1);

      await onCreateComment(postId, content);
      await onGetComments(postId, 1, 5);
      setCommentPage(1);
    } catch (err) {
      setCommentCount(oldCommentCount);
    }
  };

  const normalizeReaction = (reaction) => {
    if (!reaction) return null;

    const value = reaction.toString().toUpperCase();

    if (value === "LIKE") return "Like";
    if (value === "DISLIKE") return "Dislike";

    return null;
  };

  const [userReaction, setUserReaction] = useState(
    normalizeReaction(post.myReaction),
  );

  const [likeCount, setLikeCount] = useState(post.likeCount ?? 0);
  const [dislikeCount, setDislikeCount] = useState(post.dislikeCount ?? 0);
  const [reacting, setReacting] = useState(false);

  const isEditable = post?.authorId === currentUser?.id;

  useEffect(() => {
    setUserReaction(normalizeReaction(post.myReaction));
    setLikeCount(post.likeCount ?? 0);
    setDislikeCount(post.dislikeCount ?? 0);
    setCommentCount(post.commentCount ?? 0);
  }, [
    post.dislikeCount,
    post.id,
    post.likeCount,
    post.myReaction,
    post.commentCount,
  ]);

  const handleLike = async () => {
    if (reacting) return;

    const oldReaction = userReaction;
    const oldLikeCount = likeCount;
    const oldDislikeCount = dislikeCount;

    setReacting(true);

    try {
      if (oldReaction === "Like") {
        setUserReaction(null);
        setLikeCount((prev) => Math.max(prev - 1, 0));

        await removeReaction(post.id);
        return;
      }

      if (oldReaction === "Dislike") {
        setDislikeCount((prev) => Math.max(prev - 1, 0));
      }

      setUserReaction("Like");
      setLikeCount((prev) => prev + 1);

      if (oldReaction === "Dislike") {
        await removeReaction(post.id);
      }

      await createReaction(post.id, "Like");
    } catch (err) {
      setUserReaction(oldReaction);
      setLikeCount(oldLikeCount);
      setDislikeCount(oldDislikeCount);
    } finally {
      setReacting(false);
    }
  };

  const handleDislike = async () => {
    if (reacting) return;

    const oldReaction = userReaction;
    const oldLikeCount = likeCount;
    const oldDislikeCount = dislikeCount;

    setReacting(true);

    try {
      if (oldReaction === "Dislike") {
        setUserReaction(null);
        setDislikeCount((prev) => Math.max(prev - 1, 0));

        await removeReaction(post.id);
        return;
      }

      if (oldReaction === "Like") {
        setLikeCount((prev) => Math.max(prev - 1, 0));
      }

      setUserReaction("Dislike");
      setDislikeCount((prev) => prev + 1);

      if (oldReaction === "Like") {
        await removeReaction(post.id);
      }

      await createReaction(post.id, "Dislike");
    } catch (err) {
      setUserReaction(oldReaction);
      setLikeCount(oldLikeCount);
      setDislikeCount(oldDislikeCount);
    } finally {
      setReacting(false);
    }
  };

  const handleSelectEditImages = (e) => {
    const files = Array.from(e.target.files || []);
    setNewImages((prev) => [...prev, ...files]);
    e.target.value = "";
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditTitle(post.title || "");
    setEditContent(post.content || "");
    setExistingImages(post.media || []);
    setNewImages([]);
    setDeletedImageIds([]);
  };

  const handleSaveEdit = async () => {
    if (!editTitle.trim() || !editContent.trim()) return;

    const formData = new FormData();

    formData.append("Title", editTitle.trim());
    formData.append("Content", editContent.trim());

    deletedImageIds.forEach((id) => {
      formData.append("DeletedImageIds", id);
    });

    newImages.forEach((file) => {
      formData.append("NewImages", file);
    });

    await onUpdatePost(post.id, formData);

    setIsEditing(false);
    setNewImages([]);
    setDeletedImageIds([]);
  };

  const handleRemoveExistingImage = (imageId) => {
    if (!imageId) return;

    setExistingImages((prev) => prev.filter((image) => image.id !== imageId));

    setDeletedImageIds((prev) =>
      prev.includes(imageId) ? prev : [...prev, imageId],
    );
  };

  const handleRemoveNewImage = (index) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
  };

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

      {isEditing ? (
        <>
          <input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="mt-4 w-full rounded-xl border border-white/10 bg-[#151515] p-4 text-sm text-white outline-none focus:border-white/20"
            placeholder="Edit title..."
          />

          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="mt-4 w-full rounded-xl border border-white/10 bg-[#151515] p-4 text-sm text-white outline-none focus:border-white/20"
            placeholder="Edit content..."
            rows={5}
          />

          <div className="mt-4">
            <label className="cursor-pointer rounded-full border border-white/10 px-4 py-2 text-sm text-blue-300 hover:bg-white/5">
              Change image
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleSelectEditImages}
              />
            </label>
          </div>

          {(existingImages.length > 0 || newImages.length > 0) && (
            <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3">
              {existingImages.map((image) => (
                <div
                  key={image.id}
                  className="relative overflow-hidden rounded-xl border border-white/10 bg-[#151515]"
                >
                  <img
                    src={image.mediaUrl}
                    alt={image.id}
                    className="aspect-square w-full object-cover"
                  />

                  <button
                    type="button"
                    onClick={() => handleRemoveExistingImage(image.id)}
                    className="absolute right-2 top-2 rounded-full bg-black/70 px-2 text-xs text-white hover:bg-red-500"
                  >
                    ✕
                  </button>
                </div>
              ))}

              {newImages.map((file, index) => (
                <div
                  key={`${file.name}-${file.lastModified}-${index}`}
                  className="relative overflow-hidden rounded-xl border border-white/10 bg-[#151515]"
                >
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="aspect-square w-full object-cover"
                  />

                  <button
                    type="button"
                    onClick={() => handleRemoveNewImage(index)}
                    className="absolute right-2 top-2 rounded-full bg-black/70 px-2 text-xs text-white hover:bg-red-500"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="mt-4 flex gap-3">
            <button
              type="button"
              onClick={handleSaveEdit}
              className="rounded-full bg-green-500 px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
            >
              Save
            </button>

            <button
              type="button"
              onClick={handleCancelEdit}
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-200 hover:bg-white/10"
            >
              Cancel
            </button>
          </div>
        </>
      ) : (
        <>
          <h2 className="mt-4 text-2xl font-bold leading-snug text-white">
            {post.title}
          </h2>

          <p className="mt-4 text-base leading-7 text-zinc-100">
            {post.content}
          </p>

          {!!post.media?.length && (
            <div
              className={`mt-4 grid gap-3 ${
                post.media.length > 1
                  ? "grid-cols-1 md:grid-cols-2"
                  : "grid-cols-1"
              }`}
            >
              {post.media.map((media, index) => (
                <div
                  key={media.id || index}
                  className="overflow-hidden rounded-[18px] bg-[#0e0f11]"
                >
                  <img
                    src={media.mediaUrl}
                    alt={`${post.name}-${media.id}`}
                    className={`w-full object-cover ${
                      post.media.length > 1 ? "aspect-16/8" : "aspect-16/7"
                    }`}
                  />
                </div>
              ))}
            </div>
          )}
        </>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-5 text-sm text-zinc-400">
        <button
          type="button"
          disabled={reacting}
          onClick={handleLike}
          className={`transition hover:text-white disabled:opacity-60 ${
            userReaction === "Like" ? "text-red-500" : ""
          }`}
        >
          ♥ {likeCount}
        </button>

        <button
          type="button"
          disabled={reacting}
          onClick={handleDislike}
          className={`transition hover:text-white disabled:opacity-60 ${
            userReaction === "Dislike" ? "text-yellow-400" : ""
          }`}
        >
          👎 {dislikeCount}
        </button>

        <button
          type="button"
          className="transition hover:text-white"
          onClick={handleToggleComments}
        >
          Comments {showComments ? "▲" : "▼"} {commentCount}
        </button>

        {isEditable && !isEditing && (
          <button
            type="button"
            onClick={() => {
              setExistingImages(post.media || []);
              setNewImages([]);
              setDeletedImageIds([]);
              setIsEditing(true);
            }}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-zinc-200 transition hover:bg-white/10"
          >
            Edit
          </button>
        )}
      </div>

      <CommentSection
        postId={post.id}
        isOpen={showComments}
        authorId={post.authorId}
        loading={commentLoading}
        onCreateComment={handleCreateComment}
      />
    </article>
  );
}
