import { useState } from "react";
import { purchaseGame } from "@/services/gameService";

export default function ActionButtons({ game }) {
  const [loading, setLoading] = useState(false);
  const [purchased, setPurchased] = useState(false);

  const handleBuy = async () => {
    try {
      if (!game) return;

      if (game.rawPrice === 0) {
        alert("Game miễn phí, không cần mua!");
        return;
      }

      setLoading(true);

      const res = await purchaseGame(game.id, game.rawPrice);

      console.log("✅ Purchase success:", res);

      setPurchased(true);
      alert("🎉 Mua game thành công!");
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 mt-12">
      <button
        onClick={handleBuy}
        disabled={loading || game?.rawPrice === 0 || purchased}
        className={`w-full py-5 rounded-2xl font-bold text-xl flex items-center justify-center gap-3
        ${
          loading
            ? "bg-yellow-600"
            : purchased
            ? "bg-green-600"
            : game?.rawPrice === 0
            ? "bg-zinc-600 cursor-not-allowed"
            : "bg-red-600 hover:bg-red-700"
        }`}
      >
        {loading
          ? "Processing..."
          : purchased
          ? "Purchased ✅"
          : game?.rawPrice === 0
          ? "Free Game"
          : "Buy Now"}
      </button>

      <button className="w-full border border-zinc-700 hover:bg-zinc-900 py-5 rounded-2xl font-medium text-lg">
        Add to favorites
      </button>

      <button className="w-full border border-zinc-700 hover:bg-zinc-900 py-5 rounded-2xl font-medium text-lg">
        Play Demo
      </button>
    </div>
  );
}