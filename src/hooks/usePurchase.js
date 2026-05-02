import { useEffect, useState, useCallback } from "react";
import { getPurchaseHistory } from "@/services/gameService";

export const usePurchase = () => {
  const [purchasedIds, setPurchasedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const fetchPurchased = useCallback(async () => {
  try {
    setLoading(true);

    const data = await getPurchaseHistory();

    const ids = (data || []).map((g) => String(g.id)); 
  
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