import { useState } from "react";
import {
  purchaseGame,
  getPlayUrl,
  getDownloadUrl,
} from "@/services/gameService";

export default function PaymentModal({ game, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);

  const savePurchased = (gameId) => {
    const data = localStorage.getItem("purchasedGames");
    const list = data ? JSON.parse(data) : [];

    if (!list.includes(gameId)) {
      list.push(gameId);
      localStorage.setItem("purchasedGames", JSON.stringify(list));
    }
  };

  const handleConfirm = async () => {
    try {
      setLoading(true);

      await purchaseGame(game.id, game.rawPrice);

      savePurchased(game.id);

      // 3. Handle game type
      if (game.type === "Browser") {
        const res = await getPlayUrl(game.id);
        window.open(res.data.gameUrl, "_blank");
      } else {
        const res = await getDownloadUrl(game.id);

        const link = document.createElement("a");
        link.href = res.data.downloadUrl;
        link.setAttribute("download", "");
        document.body.appendChild(link);
        link.click();
        link.remove();
      }

      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Thanh toán thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center">
      <div className="bg-[#1c1d20] p-6 rounded-xl w-[400px]">
        <h2 className="text-xl font-bold mb-4 !text-white">Confirm Purchase</h2>

        <p>{game.title}</p>
        <p className="text-zinc-400">{game.price}</p>

        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 bg-zinc-600 py-2 rounded">
            Cancel
          </button>

          <button
            onClick={handleConfirm}
            disabled={loading}
            className="flex-1 bg-red-600 py-2 rounded"
          >
            {loading ? "Processing..." : "Pay"}
          </button>
        </div>
      </div>
    </div>
  );
}