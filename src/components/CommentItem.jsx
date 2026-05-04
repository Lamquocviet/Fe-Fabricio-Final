import React from "react";

function formatTimeAgo(input) {
  if (!input) return "Now";

  const diffMs = Date.now() - new Date(input).getTime();
  const diffMin = Math.floor(diffMs / 60000);

  if (diffMin < 1) return "Now";
  if (diffMin < 60) return `${diffMin}m ago`;

  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour}h ago`;

  const diffDay = Math.floor(diffHour / 24);
  return `${diffDay}d ago`;
}

export default function CommentItem({ comment, authorId }) {
  console.log("CommentItem render", { comment, authorId });
  const authorComment = comment.commentator || "Unknown";
  const isAuthor = authorComment.id === authorId;
  const avatarUrl = authorComment?.avatarUrl
    ? authorComment.avatarUrl.startsWith("http")
      ? authorComment.avatarUrl
      : `http://localhost/${authorComment.avatarUrl}`
    : "https://static.vecteezy.com/system/resources/thumbnails/065/277/981/small_2x/impressive-celebrated-minimalist-geometric-portrait-flat-color-clean-lines-with-scalable-design-png.png";
  return (
    <div className="rounded-[22px] border border-white/8 bg-[#111214] px-4 py-3">
      <div className="flex items-start gap-3">
        <img
          src={avatarUrl}
          alt={
            authorComment.displayName || authorComment.username || "User Avatar"
          }
          className="h-9 w-9 rounded-full object-cover ring-1 ring-white/10"
        />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`font-semibold ${isAuthor ? "text-red-400" : "text-sky-200"}`}
            >
              {authorComment.id === authorId
                ? "You"
                : authorComment.displayName ||
                  authorComment.username ||
                  "Unknown"}
            </span>
            <span className="text-sm text-zinc-500">
              {formatTimeAgo(comment.createdAt)} -{" "}
              {isAuthor ? "Author" : "User"}
            </span>
          </div>

          <p className="mt-1 wrap-break-word text-[15px] leading-6 text-zinc-100">
            {comment.content}
          </p>
        </div>
      </div>
    </div>
  );
}
