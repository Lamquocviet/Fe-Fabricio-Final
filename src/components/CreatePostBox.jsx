/* eslint-disable no-unused-vars */
import React, { useMemo } from "react";
import useCreatePost from "../hooks/useCreatePost";

export default function CreatePostCard({ user = [] }, onPostCreated) {
  const {
    content,
    images,
    loading,
    success,
    error,
    handleChangeContent,
    handleSelectImages,
    handleRemoveImage,
    handleSubmit,
  } = useCreatePost(onPostCreated);

  const previewImages = useMemo(() => {
    return images.map((file) => ({
      name: file.name,
      url: URL.createObjectURL(file),
    }));
  }, [images]);

  return (
    <div className="mt-6 rounded-3xl border border-white/10 bg-[#0d0d0d] p-4 md:p-6">
      {/* USER */}
      <div className="flex items-center gap-3">
        <img
          src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80"
          className="h-10 w-10 rounded-full"
        />

        <div>
          <p className="font-semibold">{user?.DisplayName || "John Doe"} </p>
          <p className="text-sm text-blue-400">
            {user?.Username || "@johndoe"}
          </p>
        </div>
      </div>

      {/* INPUT */}
      <textarea
        value={content}
        onChange={handleChangeContent}
        placeholder="Post something about the latest build, patch notes, or your current favorite game..."
        className="mt-4 w-full rounded-xl border border-white/10 bg-[#151515] p-4 text-sm outline-none placeholder:text-white/40 focus:border-white/20"
        rows={5}
      />

      {/* ACTIONS */}
      <div className="mt-4 flex gap-3">
        <label className="cursor-pointer rounded-full border border-white/10 px-4 py-2 text-sm text-blue-300 hover:bg-white/5">
          Upload image
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleSelectImages}
          />
        </label>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="rounded-xl bg-linear-to-r from-red-500 to-pink-500 px-6 py-2 font-semibold shadow-md hover:opacity-90">
          {loading ? "Posting..." : "Post"}
        </button>
      </div>

      {!!previewImages.length && (
        <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3">
          {previewImages.map((img, index) => (
            <div
              key={img.name}
              className="relative overflow-hidden rounded-xl border border-white/10 bg-[#151515]">
              <img
                src={img.url}
                alt={img.name}
                className="aspect-square w-full object-cover"
              />

              <button
                onClick={() => handleRemoveImage(index)}
                className="absolute top-2 right-2 z-10 rounded-full bg-black/60 px-2 text-xs text-white hover:bg-black">
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

      {success && <p className="mt-4 text-sm text-green-400">{success}</p>}
    </div>
  );
}
