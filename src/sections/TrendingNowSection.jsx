import React from "react";
import TrendingGameCard from "../components/TrendingGameCard";

export default function TrendingNowSection({ games = [] }) {
  return (
    <section className="space-y-5">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-white">
          Trending Now
        </h2>
        <p className="mt-2 text-base text-sky-200/70">
          A horizontal discovery rail inspired by storefront browsing.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {games.map((game) => (
          <TrendingGameCard
            key={game.id}
            game={game}
          />
        ))}
      </div>
    </section>
  );
}
