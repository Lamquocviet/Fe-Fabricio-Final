/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { gameLibraryService } from "@/services/gameService";
import { filterProducts } from "../utils/filterProducts";

// Transform API response to frontend format
const transformGameData = (apiGames) => {
  if (!Array.isArray(apiGames)) return [];
  
  return apiGames.map((game) => ({
    id: game.id || game.Id,
    title: game.title || game.Title,
    studio: game.studio || "Unknown Studio", 
    image: game.image || game.ThumbnailUrl || "https://via.placeholder.com/400x300",
    tags: game.tags || game.GameTags?.map(t => t.name || t.Name) || [],
    price: formatPrice(game.price ?? game.Price),
    rating: game.rating || game.Rating || 0,
    description: game.description || game.Description || "",
    ...game, // Keep original data as fallback
  }));
};

// Format price: decimal to "$X.XX" or "Free"
const formatPrice = (price) => {
  const numPrice = typeof price === "string" ? parseFloat(price) : price;
  if (numPrice === 0 || numPrice === null || numPrice === undefined) {
    return "Free";
  }
  return `$${numPrice.toFixed(2)}`;
};

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({
    price: "All",
    tag: "",
    sort: "Newest",
  });

  const [filteredProducts, setFilteredProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await gameLibraryService.getGameLibrary();
        
        // Extract games array from API response { GameTotal, games }
        const gamesArray = Array.isArray(data) ? data : (data?.games || []);
        
        // console.log("Raw API games:", gamesArray);
        
        // Transform API data to frontend format
        const transformedGames = transformGameData(gamesArray);
        
        // console.log("Transformed games:", transformedGames);
        
        setProducts(transformedGames);
        setFilteredProducts(transformedGames);
        setTotal(data?.GameTotal || transformedGames.length);
      } catch (error) {
        console.error("Error fetching games:", error);
        setProducts([]);
        setFilteredProducts([]);
      } finally {
        setLoading(false);
      }
    };
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
  };
};