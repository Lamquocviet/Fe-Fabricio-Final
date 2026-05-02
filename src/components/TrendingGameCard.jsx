import React from "react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { useNavigate } from "react-router";
import { useState, useEffect} from "react";
import { gameLibraryService } from "@/services/gameService";

const renderStars = (rating = 0) => {
  return Array.from({ length: 5 }, (_, i) => {
    const starValue = i + 1;

    if (rating >= starValue) {
      return <FaStar key={i} className="text-yellow-400" />;
    }

    if (rating >= starValue - 0.5) {
      return <FaStarHalfAlt key={i} className="text-yellow-400" />;
    }

    return <FaRegStar key={i} className="text-yellow-400" />;
  });
};


export default function TrendingGameCard({
  game,
  averageRating,
  totalRatings,
  isFavorite: initialFavorite = false
}) {
  const navigate = useNavigate();
  const handleClickView = () => {
    navigate(`/games/${game.id}`);
  };
  const [isFavorite, setIsFavorite] = useState(initialFavorite);
  const [loadingFav, setLoadingFav] = useState(false);

  const handleToggleFavorite = async (e) => {
  e.stopPropagation();
  if (loadingFav) return;

  try {
    setLoadingFav(true);
    if (isFavorite) {
      await gameLibraryService.removeGameFavorite(game.id);
      setIsFavorite(false);
    } else {
      await gameLibraryService.addGameFavorite(game.id);
      setIsFavorite(true);
    }
  } catch (err) {
    // Nếu Backend trả về lỗi 500 nhưng thực tế là do đã tồn tại (duplicate)
    // Bạn có thể kiểm tra message từ server trả về
    const errorMsg = err.response?.data?.message || err.message;
    
    if (errorMsg.includes("duplicate") || err.response?.status === 500) {
      // Giả định nếu lỗi 500 khi Add là do đã tồn tại
      setIsFavorite(true); 
    } else {
      alert("Phiên làm việc hết hạn hoặc lỗi hệ thống!");
    }
  } finally {
    setLoadingFav(false);
  }
};
useEffect(() => {
  setIsFavorite(initialFavorite);
}, [initialFavorite]);
  return (
    <article
      onClick={handleClickView}
      className="overflow-hidden scale-[0.95] rounded-[22px] border border-white/10 bg-[#141517] shadow-[0_8px_24px_rgba(0,0,0,0.24)] transition hover:-translate-y-0.5 hover:border-white/15"
    >
      <div className="overflow-hidden">
        <img
          src={game.thumbnailUrl}
          alt={game.title}
          className="aspect-4/3 w-full object-cover"
        />
      </div>

      <div className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="truncate text-xl font-bold leading-tight text-white">
              {game.title}
            </h3>
            <p className="truncate text-sm text-sky-200/70">{game.studio}</p>
          </div>

          <button
            onClick={handleToggleFavorite}
            disabled={loadingFav}
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-[14px] border transition
    ${
      isFavorite
        ? "border-red-500 bg-red-500 text-white"
        : "border-red-500/25 bg-red-500/10 text-white hover:bg-red-500/20"
    }`}
          >
            {isFavorite ? "❤️" : "♡"}
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {game.gameTags?.map((tag) => (
            <span
              key={tag.id}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300"
            >
              {tag.name}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`text-2xl font-bold ${
              game.price === "Free" ? "text-[#1ee59b]" : "text-[#ffb14a]"
            }`}
          >
            ${game.price}
          </span>

          <span className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-200">
            {renderStars(averageRating)}
            <span>
              {averageRating?.toFixed(1) ?? "0.0"} ({totalRatings ?? 0})
            </span>
          </span>
        </div>
      </div>
    </article>
  );
}
