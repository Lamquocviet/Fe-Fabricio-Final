import { useEffect, useState, useCallback } from "react";
import { getPurchaseHistory } from "@/services/gameService";
import useAuth from "@/contexts/AuthContext";
import { isAuthenticatedUser } from "@/utils/authGuard";

export const usePurchase = () => {
  const { user } = useAuth() || {};

  const [purchasedIds, setPurchasedIds] = useState([]);
  const [loading, setLoading] = useState(false);

  const isAuthenticated = isAuthenticatedUser(user);

  const fetchPurchased = useCallback(async () => {
    if (!isAuthenticated) {
      setPurchasedIds([]);
      setLoading(false);
      return [];
    }

    try {
      setLoading(true);

      const data = await getPurchaseHistory();

      const extractIdFromThumbnail = (url) => {
        const match = url?.match(/game-assets\/([a-z0-9-]+)\//i);
        return match ? match[1] : null;
      };

      const ids = (data || [])
        .map((g) => extractIdFromThumbnail(g.thumbnailUrl))
        .filter(Boolean)
        .map(String);

      setPurchasedIds(ids);

      return ids;
    } catch (err) {
      const status = err?.response?.status;

      if (status === 401 || status === 403) {
        setPurchasedIds([]);
        return [];
      }

      console.error(err);
      return [];
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchPurchased();
  }, [fetchPurchased]);

  const addPurchasedId = useCallback((gameId) => {
    setPurchasedIds((prev) => {
      const idStr = String(gameId);

      if (prev.includes(idStr)) return prev;

      return [...prev, idStr];
    });
  }, []);

  return {
    purchasedIds,
    loading,
    fetchPurchased,
    addPurchasedId,
  };
};
