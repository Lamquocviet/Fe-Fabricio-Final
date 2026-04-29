import { Star, Eye, Download } from "lucide-react";

export default function GameInfo({ game }) {
  console.log("Render GameInfo", game);
  return (
    <div>
      <h1 className="text-5xl font-bold leading-tight mb-2 !text-white">
        {game.title}
      </h1>

      <div className="flex items-center gap-8 mt-8">
        <div>
          <div className="flex items-center gap-1 text-4xl font-bold text-emerald-400">
            ${game.price}
          </div>
          <p className="text-sm text-zinc-500">One-time purchase</p>
        </div>

        <div className="h-12 w-px bg-zinc-800" />

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-zinc-400" />
            <div>
              {/* <p className="font-semibold">{game.views}K</p> */}
              <p className="text-xs text-zinc-500">views</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Download className="w-5 h-5 text-zinc-400" />
            <div>
              <p className="font-semibold">500K</p>
              <p className="text-xs text-zinc-500">downloads</p>
            </div>
          </div>
        </div>
      </div>

      {/* Rating */}
      <div className="flex items-center gap-3 mt-10">
        <div className="flex text-amber-400 text-2xl">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className="fill-current" />
          ))}
        </div>
        <span className="text-3xl font-semibold">{game.rating}</span>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-3 mt-10">
        {game.gameTags?.map((tag, index) => (
          <span
            key={index}
            className="bg-zinc-900 hover:bg-zinc-800 transition px-6 py-2.5 rounded-full text-sm border border-zinc-700"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
