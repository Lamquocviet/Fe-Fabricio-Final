import { useEffect, useState } from "react";
import GameCard from "./GameCard";
import { gameLibraryService } from "@/services/gameService";

export default function MyGameTab({ userId }) {
  const [games, setGames] = useState([]);
  

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await gameLibraryService.getGameLibrary();

        console.log("ALL GAMES:", res.games);
        console.log("USER ID:", userId);

        const myGames = res.games.filter(
          (g) => g.ownerId === userId
        );

        setGames(myGames);
      } catch (err) {
        console.error("MyGameTab error:", err);
      }
    };

    if (userId) fetch();
  }, [userId]);

  return (
    <div className="grid grid-cols-3 gap-6">
      {games.length === 0 ? (
        <p className="text-white">No games found</p>
      ) : (
        games.map((game) => (
          <GameCard key={game.id} game={game} />
        ))
      )}
    </div>
  );
}