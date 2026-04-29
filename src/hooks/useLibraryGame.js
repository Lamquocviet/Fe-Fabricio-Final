/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { gameLibraryService } from "@/services/gameService";
import { filterProducts } from "../utils/filterProducts";

// Transform API response to frontend format
const transformGameData = (apiGames) => {
  if (!Array.isArray(apiGames)) return [];
  
  return apiGames.map((game) => {
    // Check both camelCase (gameTags) and PascalCase (GameTags)
    const tagsArray = game.gameTags || game.GameTags || game.tags || [];
    
    let tags = [];
    if (Array.isArray(tagsArray) && tagsArray.length > 0) {
      tags = tagsArray.map(t => {
        // Handle both {id, Name} and {id, name} formats
        if (typeof t === 'string') return t;
        return t.Name || t.name || '';
      }).filter(Boolean);
    }
    
    console.log("Game:", game.title || game.Title, "Tags from API:", tagsArray, "Transformed tags:", tags);
    
    return {
      id: game.id || game.Id,
      title: game.title || game.Title,
      studio: game.studio || "Unknown Studio", 
      image: game.image || game.thumbnailUrl || game.ThumbnailUrl || "https://via.placeholder.com/400x300",
      tags: tags,
      price: formatPrice(game.price ?? game.Price),
      rating: game.rating || game.Rating || 0,
      description: game.description || game.Description || "",
      ...game, 
    };
  });
};


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

  // Fetch games from API
  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await gameLibraryService.getGameLibrary();
      
      // Extract games array from API response { GameTotal, games }
      const gamesArray = Array.isArray(data) ? data : (data?.games || []);
      
      console.log("Raw API games:", gamesArray);
      
      // Transform API data to frontend format
      const transformedGames = transformGameData(gamesArray);
      
      console.log("Transformed games:", transformedGames);
      
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
    refetch: fetchData, // Expose refetch function
  };
};