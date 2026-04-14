import React from "react";

export default function GameCard({ game }) {
  return (
    <article className="overflow-hidden rounded-[28px] border border-white/10 bg-[#101113] shadow-[0_10px_50px_rgba(0,0,0,0.35)]">
      <div className="relative">
        <img
          src={game.image}
          alt={game.title}
          className="h-90 w-full object-cover lg:h-115"
        />

        <button className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-black/35 text-zinc-300 backdrop-blur hover:bg-black/50">
          ♡
        </button>
      </div>

      <div className="space-y-5 p-5 lg:p-6">
        <div>
          <h3 className="text-3xl font-bold leading-tight text-white">
            {game.title}
          </h3>
          <p className="mt-1 text-lg text-sky-200/70">{game.studio}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {game.tags?.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-zinc-300">
              {tag}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-4 text-sm">
          <span className="text-2xl font-bold text-[#ffb14a]">
            {game.price}
          </span>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-zinc-200">
            ★★★★★ {game.rating}
          </span>
        </div>

        <p className="text-base leading-8 text-zinc-400">{game.description}</p>

        <div className="flex flex-wrap items-center gap-3">
          <button className="rounded-2xl bg-linear-to-r from-[#ff6a4a] to-[#ff4d61] px-5 py-3 text-sm font-semibold text-white transition hover:scale-[1.02]">
            View
          </button>
          <button className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-zinc-200 transition hover:bg-white/10">
            {game.cta || "Play"}
          </button>
          <button className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-[#ffb14a] hover:bg-white/10">
            👍
          </button>
          <button className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-[#ffb14a] hover:bg-white/10">
            👎
          </button>
        </div>
      </div>
    </article>
  );
}
