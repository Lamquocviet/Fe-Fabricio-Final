import { useState } from "react";
import PaymentModal from "./PaymentModal";
import {
  getPlayUrl,
  getDownloadUrl,
} from "@/services/gameService";

export default function ActionButtons({ game }) {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const isFree = game?.rawPrice === 0;
  const isBrowser = game?.type?.toLowerCase() === "browser";

  const isPurchased = (() => {
  const data = localStorage.getItem("purchasedGames");
  const list = data ? JSON.parse(data) : [];
  return list.includes(game?.id);
})();

  const handlePlay = async () => {
    try {
      setLoading(true);

      const res = await getPlayUrl(game.id);
      window.open(res.data.gameUrl, "_blank");
    } catch (err) {
      console.error(err);
      alert("Không thể mở game!");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      setLoading(true);

      const res = await getDownloadUrl(game.id);

      const link = document.createElement("a");
      link.href = res.data.downloadUrl;
      link.setAttribute("download", "");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error(err);
      alert("Download thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="space-y-4 mt-12">

    {/* FREE OR OWNED */}
    {(isFree || isPurchased) ? (
      isBrowser ? (
        <button
          onClick={handlePlay}
          disabled={loading}
          className="w-full py-5 rounded-2xl bg-green-600 hover:bg-green-700"
        >
          {loading ? "Loading..." : "🎮 Play"}
        </button>
      ) : (
        <button
          onClick={handleDownload}
          disabled={loading}
          className="w-full py-5 rounded-2xl bg-blue-600 hover:bg-blue-700"
        >
          {loading ? "Downloading..." : "⬇ Download"}
        </button>
      )
    ) : (
      /*  NOT OWNED */
      <>
        <button
          onClick={() => setShowModal(true)}
          className="w-full py-5 rounded-2xl bg-red-600 hover:bg-red-700"
        >
          Buy Now
        </button>

        {showModal && (
          <PaymentModal
            game={game}
            onClose={() => setShowModal(false)}
            onSuccess={() => {
              //  trigger re-render
              window.location.reload();
            }}
          />
        )}
      </>
    )}
  </div>
);
}