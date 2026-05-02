import React from "react";
import TrendingGameCard from "../components/TrendingGameCard";
import GameCard from "@/components/GameCard";

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

      <div className="grid gap-4 xl:grid-cols-2 justify-items-center">
        {games.map((item) => (
          <TrendingGameCard
            key={item.game.id}
            game={item.game}
            averageRating={item.averageRating}
            totalRatings={item.totalRating}
          />
        ))}
      </div>
    </section>
  );
}
