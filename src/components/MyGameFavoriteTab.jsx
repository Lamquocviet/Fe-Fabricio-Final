import { useEffect, useState } from "react";
import TrendingGameCard from "./TrendingGameCard";
import { gameLibraryService } from "@/services/gameService";

const MyGameFavoriteTab = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchGames = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await gameLibraryService.getGameFavorites();
        setGames(res);
      } catch (err) {
        console.error("MyGameFavoriteTab error:", err);
        setError("Failed to fetch games");
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  return (
    <div className="container mx-auto">
      {loading ? (
        <p className="text-white">Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : games.length === 0 ? (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-center text-sm text-zinc-400">
          Chưa có game yêu thích nào.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {games.map((game) => (
            <TrendingGameCard key={game.id} game={game} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyGameFavoriteTab;
