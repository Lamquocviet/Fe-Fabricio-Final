/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import CommentSection from "./CommentSection";

export default function PostCard({
  post,
  currentUser,
  onUpdatePost,
  onDeletePost,
  onCreateComment,
  deleting,
}) {
  const [showComments, setShowComments] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [editTitle, setEditTitle] = useState(post.title || "");
  const [editContent, setEditContent] = useState(post.content || "");

  const [existingImages, setExistingImages] = useState(post.media || []);
  const [newImages, setNewImages] = useState([]);

  const isEditable = post?.authorId === currentUser?.id;

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
  };

  const handleSaveEdit = async () => {
    if (!editTitle.trim() || !editContent.trim()) return;

    const updatedImages = [...existingImages, ...newImages];

    await onUpdatePost(post.id, {
      Title: editTitle.trim(),
      Content: editContent.trim(),
      mediaFiles: updatedImages,
    });

    setIsEditing(false);
    setNewImages([]);
  };

  const handleRemoveExistingImage = (index) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveNewImage = (index) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCreateComment = async (postId, payload) => {
    await onCreateComment(postId, payload);
  }

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
              {existingImages.map((image, index) => (
                <div
                  key={`existing-${index}`}
                  className="relative overflow-hidden rounded-xl border border-white/10 bg-[#151515]"
                >
                  <img
                    src={image}
                    alt={`existing-${index}`}
                    className="aspect-square w-full object-cover"
                  />

                  <button
                    type="button"
                    onClick={() => handleRemoveExistingImage(index)}
                    className="absolute right-2 top-2 rounded-full bg-black/70 px-2 text-xs text-white hover:bg-red-500"
                  >
                    ✕
                  </button>
                </div>
              ))}

              {newImages.map((file, index) => (
                <div
                  key={`${file.name}-${index}`}
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
                  key={index}
                  className="overflow-hidden rounded-[18px] bg-[#0e0f11]"
                >
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
        </>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-5 text-sm text-zinc-400">
        <button className="transition hover:text-white">
          ♥ {post.stats?.likes ?? 0}
        </button>

        <button className="transition hover:text-white">Dislike</button>

        <button
          className="transition hover:text-white"
          onClick={() => setShowComments((prev) => !prev)}
        >
          Comments {showComments ? "▲" : "▼"} {post.stats?.comments ?? 0}
        </button>

        {isEditable && !isEditing && (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-zinc-200 transition hover:bg-white/10"
          >
            Edit
          </button>
        )}
      </div>

      <CommentSection postId={post.id} isOpen={showComments} onCreateComment={handleCreateComment} />
    </article>
  );
}
