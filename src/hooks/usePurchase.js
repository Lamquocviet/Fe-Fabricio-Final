import { useEffect, useState, useCallback } from "react";
import { getPurchaseHistory } from "@/services/gameService";

export const usePurchase = () => {
  const [purchasedIds, setPurchasedIds] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPurchased = useCallback(async () => {
    try {
      setLoading(true);

      const data = await getPurchaseHistory();

      // console.log("PURCHASE RAW:", data);

      const extractIdFromThumbnail = (url) => {
        const match = url?.match(/game-assets\/([a-z0-9-]+)\//i);
        return match ? match[1] : null;
      };

      const ids = (data || []).map((g) =>
        String(extractIdFromThumbnail(g.thumbnailUrl)),
      );

      setPurchasedIds(ids);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPurchased();
  }, [fetchPurchased]);

  // update ngay UI sau khi mua
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
