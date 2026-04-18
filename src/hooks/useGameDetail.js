import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { gameLibraryService } from '@/services/gameService';

export const useGameDetail = () => {
  const { id } = useParams();
  
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGame = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const foundGame = await gameLibraryService.getGameById(id);

        if (foundGame) {
          setGame(foundGame);
        } else {
          setError("Game not found");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load game");
      } finally {
        setLoading(false);
      }
    };

    fetchGame();
  }, [id]);

  return { game, loading, error };
};