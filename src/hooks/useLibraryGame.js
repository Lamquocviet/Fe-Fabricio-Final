/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { gameLibraryService } from "@/services/gameService";
import { filterProducts } from "../utils/filterProducts";


// PRICE (QUAN TRỌNG)

const normalizePrice = (price) => {
  if (price === null || price === undefined) return 0;

  const num =
    typeof price === "string" ? parseFloat(price) : price;

  return isNaN(num) ? 0 : num;
};

const formatPrice = (price) => {
  if (price === 0) return "Free";
  return `$${price.toFixed(2)}`;
};


// TRANSFORM DATA

const transformGameData = (apiGames) => {
  if (!Array.isArray(apiGames)) return [];

  return apiGames.map((game) => {
    // TAGS
    const tagsRaw =
      game.gameTags || game.GameTags || game.tags || [];

    const tags = Array.isArray(tagsRaw)
      ? tagsRaw
          .map((t) =>
            typeof t === "string"
              ? t
              : t?.name || t?.Name || t?.tag?.name
          )
          .filter(Boolean)
      : [];

    //  PRICE
    const rawPrice = normalizePrice(
      game.price ?? game.Price
    );

    return {
      id: game.id || game.Id,
      title: game.title || game.Title || "Unknown",
      studio: game.studio || "Unknown Studio",
      type: game.gameType || "Unknown",

      image:
        game.image ||
        game.thumbnailUrl ||
        game.ThumbnailUrl ||
        "https://via.placeholder.com/400x300",

      tags,

      rawPrice,                     
      price: formatPrice(rawPrice),
      isFree: rawPrice === 0,      

      rating: game.rating || game.Rating || 0,
      description:
        game.description || game.Description || "",
    };
  });
};


//HOOK

export const useProducts = () => {
  const initialFilters = {
    price: "All",
    tag: "",
    sort: "Newest",
  };
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState(initialFilters);

  const [filteredProducts, setFilteredProducts] =
    useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const resetFilters = () => {
    setFilters(initialFilters);
  };
  const fetchData = async () => {
    try {
      setLoading(true);

      const data =
        await gameLibraryService.getGameLibrary();

      const gamesArray = data?.games || [];

      const transformed = transformGameData(gamesArray);

      setProducts(transformed);
      setFilteredProducts(transformed);
      setTotal(data?.GameTotal || transformed.length);
    } catch (error) {
      console.error("Error fetching games:", error);
      setProducts([]);
      setFilteredProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const result = filterProducts(products, filters);
    setFilteredProducts(result);
  }, [filters, products]);

  return {
    filters,
    setFilters,
    filteredProducts,
    total,
    loading,
    resetFilters,
    refetch: fetchData,
  };
};