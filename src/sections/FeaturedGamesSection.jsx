import React from "react";
import TrendingGameCard from "@/components/TrendingGameCard";
import { useNavigate } from "react-router";

export default function FeaturedGamesSection({ games = [] }) {
  console.log("FeaturedGamesSection games:", games);
  const navigate = useNavigate();

  const handleClickView = () => {
    navigate(`/games`);
  };
  return (
    <section className="space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">
            Featured Games
          </h2>
          <p className="mt-2 text-base text-sky-200/70">
            Curated highlights with strong cover art, ratings, and tags.
          </p>
        </div>

        <button
          onClick={handleClickView}
          className="shrink-0 rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm text-zinc-200 hover:bg-white/10"
        >
          Browse all
        </button>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
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
