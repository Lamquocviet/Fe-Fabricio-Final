import { Star, Eye, Download } from "lucide-react";

export default function GameInfo({ game }) {
  if (!game) {
    return (
      <div className="text-center text-zinc-400">
        <p>Không thể tải thông tin game</p>
      </div>
    );
  }

  const tags = game.tags || [];

  return (
    <div>
      <h1 className="text-5xl font-bold mb-2 !text-white">
        {game.title}
        {game.type && (
          <span className="ml-4 text-sm text-zinc-400">
            ({game.type})
          </span>
        )}
      </h1>

      {/* Price */}
      <div className="flex items-center gap-8 mt-8">
        <div>
          <div className="text-4xl font-bold text-emerald-400">
            {game.price}
          </div>
          <p className="text-sm text-zinc-500">One-time purchase</p>
        </div>



       
      </div>

      {/* Rating */}
      <div className="flex items-center gap-3 mt-10">
        <div className="flex text-2xl">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`${
                i < Math.round(game.rating)
                  ? "text-amber-400 fill-current"
                  : "text-zinc-600"
              }`}
            />
          ))}
        </div>

        <span className="text-3xl font-semibold">
          {game.rating.toFixed(1)}
        </span>

        <span className="text-sm text-zinc-500">
          ({game.totalRatings} reviews)
        </span>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-3 mt-10">
        {tags.length > 0 ? (
          tags.map((tag, index) => (
            <span
              key={index}
              className="bg-zinc-900 px-6 py-2 rounded-full text-sm border border-zinc-700"
            >
              {tag}
            </span>
          ))
        ) : (
          <p className="text-sm text-zinc-500">Không có tags</p>
        )}
      </div>
    </div>
  );
}