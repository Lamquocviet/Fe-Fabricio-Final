import React from "react";

export default function TrendingGameCard({ game }) {
  return (
    <article className="overflow-hidden rounded-[22px] border border-white/10 bg-[#141517] shadow-[0_8px_24px_rgba(0,0,0,0.24)] transition hover:-translate-y-0.5 hover:border-white/15">
      <div className="overflow-hidden">
        <img
          src={game.image}
          alt={game.title}
          className="aspect-4/3 w-full object-cover"
        />
      </div>

      <div className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="truncate text-xl font-bold leading-tight text-white">
              {game.title}
            </h3>
            <p className="truncate text-sm text-sky-200/70">{game.studio}</p>
          </div>

          <button className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[14px] border border-red-500/25 bg-red-500/10 text-sm text-white transition hover:bg-red-500/20">
            ♡
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {game.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300">
              {tag}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`text-2xl font-bold ${
              game.price === "Free" ? "text-[#1ee59b]" : "text-[#ffb14a]"
            }`}>
            {game.price}
          </span>

          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-200">
            ★★★★★ {game.rating}
          </span>
        </div>
      </div>
    </article>
  );
}
