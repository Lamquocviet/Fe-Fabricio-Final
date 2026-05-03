import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { rateGame } from "@/services/gameService";


export default function GameInfo({ game }) {
  const [showRating, setShowRating] = useState(false);
  const [stars, setStars] = useState(0);
  const [hover, setHover] = useState(0); 
  const [loading, setLoading] = useState(false);

  const [localRating, setLocalRating] = useState(game?.rating || 0);
  const [localTotal, setLocalTotal] = useState(game?.totalRatings || 0);
  const [userRating, setUserRating] = useState(null);

  useEffect(() => {
  const fetchMyRating = async () => {
    try {
      const res = await rateGame (game.id);
      if (res?.myRating) {
        setUserRating(res.myRating);
      }
    } catch (err) {
      console.error("Fetch my rating error:", err);
    }
  };

  fetchMyRating();
}, [game.id]);
  if (!game) {
    return (
      <div className="text-center text-zinc-400">
        <p>Không thể tải thông tin game</p>
      </div>
    );
  }

  const tags = game.tags || [];

  // mở popup
  const openRating = () => {
    setStars(0);
    setHover(0);
    setShowRating(true);
  };
  

  // submit rating
  const handleRate = async () => {
  try {
    setLoading(true);

    await rateGame(game.id, stars);

    let newAvg = localRating;
    let newTotal = localTotal;

    if (userRating === null) {
      // 👉 lần đầu
      newTotal = localTotal + 1;
      newAvg = (localRating * localTotal + stars) / newTotal;
    } else {
      // 👉 update rating
      newAvg =
        (localRating * localTotal - userRating + stars) / localTotal;
    }

    setLocalTotal(newTotal);
    setLocalRating(newAvg);

    // ✅ lưu rating user
    setUserRating(stars);
    localStorage.setItem(`rating_${game.id}`, stars);

    setShowRating(false);
  } catch (err) {
    alert(err.message || "Rating thất bại!");
  } finally {
    setLoading(false);
  }
};

  return (
    <div>
      {/* TITLE */}
      <h1 className="text-5xl font-bold mb-2 text-white">
        {game.title}
        {game.type && (
          <span className="ml-4 text-sm text-zinc-400">
            ({game.type})
          </span>
        )}
      </h1>

      {/* PRICE + BUTTON */}
      <div className="flex items-center gap-8 mt-8">
        <div>
          <div className="text-4xl font-bold text-emerald-400">
            {game.price}
          </div>
          <p className="text-sm text-zinc-500">
            One-time purchase
          </p>
        </div>

        <button
          onClick={openRating}
          disabled={false}
          className="bg-yellow-500 hover:bg-yellow-600 px-6 py-3 rounded-xl font-semibold disabled:opacity-50"
        >
          {userRating !== null ? "✅ Already rated" : "⭐ Rate game"}
        </button>
      </div>

      
      <div className="flex items-center gap-3 mt-10">
        <div className="flex text-2xl">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`${
                i < Math.round(localRating)
                  ? "text-amber-400 fill-current"
                  : "text-zinc-600"
              }`}
            />
          ))}
        </div>

        <span className="text-3xl font-semibold">
          {localRating.toFixed(1)}
        </span>

        <span className="text-sm text-zinc-500">
          ({localTotal} reviews)
        </span>
      </div>

      {/* TAGS */}
      <div className="flex flex-wrap gap-3 mt-10">
        {tags.length > 0 ? (
          tags.map((tag, index) => (
            <span
              key={index}
              className="bg-zinc-900 px-6 py-2 rounded-full text-sm border border-zinc-700"
            >
              {tag}
            </span>
          ))
        ) : (
          <p className="text-sm text-zinc-500">
            Không có tags
          </p>
        )}
      </div>

      {/* POPUP */}
      {showRating && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#1c1d20] p-6 rounded-xl w-[400px]">
            <h2 className="text-xl font-bold mb-4 text-white text-center">
              Rate Game
            </h2>

            {/*  STAR PICKER */}
            <div className="flex gap-2 mb-4 text-4xl justify-center">
              {[1, 2, 3, 4, 5].map((n) => {
                const active = n <= (hover || stars);

                return (
                  <Star
                    key={n}
                    onClick={() => setStars(n)}
                    onMouseEnter={() => setHover(n)}
                    onMouseLeave={() => setHover(0)}
                    className={`cursor-pointer transition ${
                      active
                        ? "text-yellow-400 fill-yellow-400 scale-110"
                        : "text-zinc-500"
                    }`}
                  />
                );
              })}
            </div>

            <p className="text-center text-zinc-400 mb-4">
              {stars > 0
                ? `You selected: ${stars} ⭐`
                : "select your rating above"}
            </p>

            {/* ACTION */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowRating(false)}
                className="flex-1 bg-zinc-600 py-2 rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleRate}
                disabled={loading || stars === 0}
                className="flex-1 bg-yellow-500 py-2 rounded disabled:opacity-50"
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}