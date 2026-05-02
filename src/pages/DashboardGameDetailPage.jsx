import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Pencil,
  Save,
  X,
  Star,
  Heart,
  MessageSquare,
  Gamepad2,
  ImagePlus,
  Loader2,
  UploadCloud,
  FileArchive,
  AlertCircle,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import CommentItem from "@/components/CommentItem";
import { gameLibraryService, updateGame, deleteGame, getGameComments, getGameRatings } from "@/services/gameService";
import { useTag } from "@/hooks/useTag";

/* ─────────────── helpers ─────────────── */
function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

const inputCls =
  "w-full bg-[#1a1c28] border border-[#2a2d3d] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500 transition-colors";
const textareaCls = inputCls + " resize-none";

/* ─────────────── main page ─────────────── */
export default function DashboardGameDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [game, setGame] = useState(null);
  const [comments, setComments] = useState([]);
  const [ratings, setRatings] = useState({ total: 0, average: 0 });
  const [loading, setLoading] = useState(true);
  const [commentsLoading, setCommentsLoading] = useState(true);

  /* edit state */
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({});
  const [selectedTagIds, setSelectedTagIds] = useState([]);
  const [newThumbnail, setNewThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const thumbnailRef = useRef(null);

  /* delete modal state */
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteInput, setDeleteInput] = useState("");
  const [deleting, setDeleting] = useState(false);

  const { tags } = useTag();

  /* ── fetch game + stats ── */
  useEffect(() => {
    if (!id) return;
    
    // Đảm bảo ID sạch (bỏ :1 hoặc các ký tự thừa từ console/trace)
    const cleanId = id.split(":")[0];
    
    const fetchAll = async () => {
      try {
        setLoading(true);
        const g = await gameLibraryService.getGameById(cleanId);
        setGame(g);
        setForm({
          Title: g.title ?? "",
          Description: g.description ?? "",
          Price: g.price ?? 0,
          GameType: g.gameType ?? "Browser",
        });
        setSelectedTagIds((g.tags ?? []).map((t) => t.id ?? t));
      } catch {
        toast.error("Không thể tải thông tin game");
      } finally {
        setLoading(false);
      }
    };

    const fetchStats = async () => {
      try {
        setCommentsLoading(true);
        const [ratingData, commentData] = await Promise.allSettled([
          getGameRatings(cleanId),
          getGameComments(cleanId, { page: 1, limit: 50 }),
        ]);
        if (ratingData.status === "fulfilled") setRatings(ratingData.value);
        if (commentData.status === "fulfilled") {
          const raw = commentData.value;
          setComments(Array.isArray(raw) ? raw : (raw?.items ?? raw?.data ?? []));
        }
      } catch {
        /* silent */
      } finally {
        setCommentsLoading(false);
      }
    };

    fetchAll();
    fetchStats();
  }, [id]);

  /* ── edit handlers ── */
  const startEdit = () => {
    setIsEditing(true);
    setNewThumbnail(null);
    setThumbnailPreview(null);
    setForm({
      Title: game.title ?? "",
      Description: game.description ?? "",
      Price: game.price ?? 0,
      GameType: game.gameType ?? "Browser",
    });
    setSelectedTagIds((game.tags ?? []).map((t) => t.id ?? t));
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setNewThumbnail(null);
    setThumbnailPreview(null);
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setNewThumbnail(file);
    setThumbnailPreview(URL.createObjectURL(file));
  };

  const toggleTag = (tagId) => {
    setSelectedTagIds((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    );
  };

  const handleSave = async () => {
    if (!form.Title?.trim()) {
      toast.error("Tên game không được trống");
      return;
    }
    try {
      setSaving(true);
      const payload = {
        Title: form.Title,
        Description: form.Description,
        Price: parseFloat(form.Price) || 0,
        GameType: form.GameType,
        TagIds: selectedTagIds,
      };
      if (newThumbnail) payload.Thumbnail = newThumbnail;

      const cleanId = id.split(":")[0];
      await updateGame(cleanId, payload);
      toast.success("Cập nhật game thành công!");

      /* refresh game data */
      const updated = await gameLibraryService.getGameById(id);
      setGame(updated);
      setIsEditing(false);
      setNewThumbnail(null);
      setThumbnailPreview(null);
    } catch (err) {
      toast.error(err.message || "Cập nhật thất bại");
    } finally {
      setSaving(false);
    }
  };

  /* ── delete handler ── */
  const handleDelete = async () => {
    if (deleteInput.trim() !== game.title.trim()) {
      toast.error("Tên game không khớp, vui lòng nhập đúng tên");
      return;
    }
    try {
      setDeleting(true);
      await deleteGame(id);
      toast.success("Xóa game thành công!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.message || "Xóa game thất bại");
    } finally {
      setDeleting(false);
    }
  };

  /* ─────────── render ─────────── */
  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-zinc-400 text-sm">Đang tải thông tin game...</p>
        </div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white">
        <p>Không tìm thấy game.</p>
      </div>
    );
  }

  const displayThumbnail = thumbnailPreview || game.thumbnailUrl;
  const currentTags = game.tags ?? [];
  const gameTagIds = currentTags.map((t) => t.id ?? t);

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Header />
      <div className="flex me-4">
        <Sidebar />

        <main className="flex-1 p-6 md:p-8 h-screen overflow-y-auto custom-scrollbar">
          <div className="max-w-7xl mx-auto pb-20 space-y-6">

            {/* Breadcrumb */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/dashboard")}
                className="p-2 hover:bg-white/10 rounded-full transition-colors text-zinc-400 hover:text-white"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <div className="flex items-center gap-2 text-sm text-zinc-400 mb-0.5">
                  <span
                    className="cursor-pointer hover:text-white transition-colors"
                    onClick={() => navigate("/dashboard")}
                  >
                    Dashboard
                  </span>
                  <span>/</span>
                  <span className="text-violet-400">{game.title}</span>
                </div>
                <h1 className="text-2xl font-bold text-white">Chi tiết Game</h1>
              </div>
            </div>

            {/* Stats strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: "Giá", value: game.price > 0 ? `$${game.price}` : "Miễn phí", color: "text-emerald-400" },
                { label: "Lượt đánh giá", value: ratings.total ?? 0, color: "text-rose-400" },
                { label: "Điểm TB", value: `${ratings.average?.toFixed(1) ?? 0}/5`, color: "text-amber-400" },
                { label: "Bình luận", value: comments.length, color: "text-blue-400" },
              ].map((s, i) => (
                <div key={i} className="bg-zinc-900/60 border border-white/5 rounded-2xl p-4 hover:border-white/10 transition-colors">
                  <p className="text-zinc-400 text-xs font-medium mb-1">{s.label}</p>
                  <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                </div>
              ))}
            </div>

            {/* Two-column layout: 7:3 Ratio */}
            <div className="grid grid-cols-1 lg:grid-cols-10 gap-8">

              {/* ═══ LEFT – Game Info / Edit (70%) ═══ */}
              <div className="lg:col-span-7 bg-zinc-900/60 backdrop-blur-xl border border-white/5 rounded-[32px] p-8 space-y-8 shadow-2xl">
                {/* Toolbar */}
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Gamepad2 className="w-5 h-5 text-violet-400" />
                    Thông tin Game
                  </h2>
                  {!isEditing ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={startEdit}
                        className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-sm font-medium transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                        Chỉnh sửa
                      </button>
                      <button
                        onClick={() => { setShowDeleteModal(true); setDeleteInput(""); }}
                        className="flex items-center gap-2 px-3 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/40 text-red-400 rounded-lg text-sm font-medium transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        Xóa game
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={cancelEdit}
                        className="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 text-zinc-300 rounded-lg text-sm transition-colors"
                      >
                        <X className="w-4 h-4" />
                        Hủy
                      </button>
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white rounded-lg text-sm font-medium transition-colors"
                      >
                        {saving ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Save className="w-4 h-4" />
                        )}
                        Lưu
                      </button>
                    </div>
                  )}
                </div>

                {/* Thumbnail */}
                <div className="space-y-2">
                  <label className="text-sm text-zinc-400">Thumbnail</label>
                  <div className="relative group">
                    {displayThumbnail ? (
                      <img
                        src={displayThumbnail}
                        alt={game.title}
                        className="w-full h-52 object-cover rounded-xl border border-white/5"
                      />
                    ) : (
                      <div className="w-full h-52 bg-zinc-800 rounded-xl border border-white/5 flex items-center justify-center">
                        <Gamepad2 className="w-16 h-16 text-zinc-600" />
                      </div>
                    )}
                    {isEditing && (
                      <button
                        type="button"
                        onClick={() => thumbnailRef.current?.click()}
                        className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity gap-2"
                      >
                        <ImagePlus className="w-8 h-8 text-white" />
                        <span className="text-white text-sm font-medium">Đổi ảnh</span>
                      </button>
                    )}
                    <input
                      ref={thumbnailRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleThumbnailChange}
                    />
                  </div>
                </div>

                {/* Fields */}
                {isEditing ? (
                  <div className="space-y-4">
                    {/* Backend Warning */}
                    <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-3 mb-4 flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <p className="text-[11px] text-amber-200/80 leading-relaxed">
                        Lưu ý: Backend hiện chưa hỗ trợ API cập nhật thông tin game (Lỗi 405). Việc nhấn "Lưu" có thể thất bại cho đến khi backend được cập nhật.
                      </p>
                    </div>

                    <div>
                      <label className="text-sm text-zinc-400 mb-1 block">Tên game</label>
                      <input
                        className={inputCls}
                        value={form.Title}
                        onChange={(e) => setForm((p) => ({ ...p, Title: e.target.value }))}
                        placeholder="Tên game"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-zinc-400 mb-1 block">Giá ($)</label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          className={inputCls}
                          value={form.Price}
                          onChange={(e) => setForm((p) => ({ ...p, Price: e.target.value }))}
                        />
                      </div>
                      <div>
                        <label className="text-sm text-zinc-400 mb-1 block">Game Type</label>
                        <select
                          className={inputCls}
                          value={form.GameType}
                          onChange={(e) => setForm((p) => ({ ...p, GameType: e.target.value }))}
                        >
                          <option value="Browser">Browser</option>
                          <option value="Download">Download</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm text-zinc-400 mb-1 block">Mô tả</label>
                      <textarea
                        rows={5}
                        className={textareaCls}
                        value={form.Description}
                        onChange={(e) => setForm((p) => ({ ...p, Description: e.target.value }))}
                        placeholder="Mô tả game..."
                      />
                    </div>
                    {/* Tags */}
                    <div>
                      <label className="text-sm text-zinc-400 mb-2 block">Tags</label>
                      <div className="flex flex-wrap gap-2">
                        {tags.map((tag) => {
                          const active = selectedTagIds.includes(tag.id);
                          return (
                            <button
                              key={tag.id}
                              type="button"
                              onClick={() => toggleTag(tag.id)}
                              className={`px-3 py-1.5 text-xs rounded-full border transition-all ${
                                active
                                  ? "bg-gradient-to-br from-violet-600 to-violet-500 text-white border-transparent shadow-lg shadow-violet-500/25"
                                  : "bg-[#1a1c28] border-[#2a2d3d] text-zinc-400 hover:border-violet-400 hover:text-white"
                              }`}
                            >
                              {tag.name}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ) : (
                  /* View mode */
                  <div className="space-y-4">
                    <InfoRow label="Tên game" value={game.title} />
                    <InfoRow
                      label="Giá"
                      value={
                        <span className="font-semibold text-emerald-400">
                          {game.price > 0 ? `$${game.price}` : "Miễn phí"}
                        </span>
                      }
                    />
                    <InfoRow label="Loại game" value={game.gameType} />
                    <div>
                      <p className="text-xs text-zinc-500 mb-1">Mô tả</p>
                      <p className="text-sm text-zinc-200 leading-relaxed whitespace-pre-line">
                        {game.description || <span className="text-zinc-500 italic">Chưa có mô tả</span>}
                      </p>
                    </div>
                    {/* Tags display */}
                    {currentTags.length > 0 && (
                      <div>
                        <p className="text-xs text-zinc-500 mb-2">Tags</p>
                        <div className="flex flex-wrap gap-2">
                          {currentTags.map((tag) => (
                            <span
                              key={tag.id ?? tag}
                              className="px-3 py-1 text-xs rounded-full bg-violet-500/20 border border-violet-500/30 text-violet-300"
                            >
                              {tag.name ?? tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* ── Game file section (always visible) ── */}
                <div className="pt-4 border-t border-white/5">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-medium text-white flex items-center gap-2">
                      <FileArchive className="w-4 h-4 text-amber-400" />
                      File Game (ZIP)
                    </p>
                  </div>
                  {/* Backend chưa có API update game nên chỉ upload mới khi cần */}
                  <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                    <div className="text-xs text-amber-200/80 leading-relaxed">
                      <p className="font-semibold text-amber-300 mb-1">Chức năng đổi file ZIP chưa khả dụng</p>
                      <p>Backend hiện chưa có API cập nhật file game. Để thay đổi file ZIP, bạn cần xóa game này và đăng lại với file mới, hoặc yêu cầu nhà phát triển backend bổ sung endpoint <code className="bg-black/30 px-1 rounded">PUT /Games/:id</code>.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* ═══ RIGHT – Comments (30%) ═══ */}
              <div className="lg:col-span-3 bg-zinc-900/60 backdrop-blur-xl border border-white/5 rounded-[32px] p-8 flex flex-col h-fit max-h-[calc(100vh-180px)] shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl -mr-16 -mt-16 pointer-events-none" />
                <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-5 shrink-0">
                  <MessageSquare className="w-5 h-5 text-blue-400" />
                  Bình luận &amp; Đánh giá
                  <span className="ml-auto text-sm font-normal text-zinc-400">
                    {comments.length} bình luận
                  </span>
                </h2>

                <div className="overflow-y-auto flex-1 space-y-3 pr-1 custom-scrollbar">
                  {commentsLoading ? (
                    <div className="space-y-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="h-16 animate-pulse rounded-2xl bg-white/5" />
                      ))}
                    </div>
                  ) : comments.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center gap-3">
                      <MessageSquare className="w-12 h-12 text-zinc-700" />
                      <p className="text-zinc-400 text-sm">Game này chưa có bình luận nào.</p>
                    </div>
                  ) : (
                    comments.map((comment, idx) => (
                      <div
                        key={comment.id ?? idx}
                        className="rounded-[22px] border border-white/8 bg-[#111214] px-4 py-3"
                      >
                        <div className="flex items-start gap-3">
                          <img
                            src={
                              comment.commentator?.avatarUrl ||
                              `https://ui-avatars.com/api/?name=${comment.commentator?.username ?? "U"}&background=7C3AED&color=fff&size=64`
                            }
                            alt={comment.commentator?.displayName ?? "User"}
                            className="h-9 w-9 rounded-full object-cover ring-1 ring-white/10 shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2 flex-wrap">
                              <span className="font-semibold text-sky-200 text-sm">
                                {comment.commentator?.displayName || comment.commentator?.username || "Ẩn danh"}
                              </span>
                              <span className="text-xs text-zinc-500">
                                {comment.createdAt
                                  ? new Date(comment.createdAt).toLocaleDateString("vi-VN")
                                  : ""}
                              </span>
                            </div>
                            <p className="mt-1 text-sm text-zinc-200 leading-relaxed">
                              {comment.comment?.content ?? comment.content}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>
          </div>
        </main>
      </div>

      {/* Delete confirmation modal */}
      {showDeleteModal && (
        <ConfirmDeleteModal
          gameName={game.title}
          value={deleteInput}
          onChange={setDeleteInput}
          onConfirm={handleDelete}
          onCancel={() => { setShowDeleteModal(false); setDeleteInput(""); }}
          deleting={deleting}
        />
      )}
    </div>
  );
}

/* ── Helper sub-component ── */
function InfoRow({ label, value }) {
  return (
    <div>
      <p className="text-xs text-zinc-500 mb-0.5">{label}</p>
      <p className="text-sm text-zinc-200">{value}</p>
    </div>
  );
}

/* ── Delete confirmation modal ── */
function ConfirmDeleteModal({ gameName, value, onChange, onConfirm, onCancel, deleting }) {
  const isMatch = value.trim() === gameName.trim();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Modal card */}
      <div className="relative w-full max-w-md bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl p-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/15 border border-red-500/20 flex items-center justify-center shrink-0">
              <Trash2 className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Xóa game?</h3>
              <p className="text-xs text-zinc-400 mt-0.5">Hành động này không thể hoàn tác</p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-zinc-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Warning banner */}
        <div className="bg-red-500/8 border border-red-500/20 rounded-xl p-3 mb-5 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <p className="text-xs text-red-200/80 leading-relaxed">
            Game <span className="font-semibold text-red-300">"{gameName}"</span> sẽ bị xóa vĩnh viễn cùng toàn bộ file game và dữ liệu liên quan.
          </p>
        </div>

        {/* Confirm input */}
        <div className="mb-5">
          <label className="block text-sm text-zinc-300 mb-2">
            Nhập tên game để xác nhận:{" "}
            <span className="font-semibold text-white">{gameName}</span>
          </label>
          <input
            autoFocus
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && isMatch && !deleting && onConfirm()}
            placeholder={`Nhập "${gameName}" để tiếp tục`}
            className="w-full bg-[#1a1c28] border border-[#2a2d3d] rounded-lg px-3 py-2.5 text-sm text-white
              placeholder:text-zinc-600 focus:outline-none transition-colors focus:border-red-500"
          />
          {value.length > 0 && !isMatch && (
            <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              Tên không khớp
            </p>
          )}
          {isMatch && (
            <p className="text-xs text-emerald-400 mt-1.5">✓ Tên game khớp</p>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 bg-white/5 hover:bg-white/10 text-zinc-300 rounded-xl text-sm font-medium transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={onConfirm}
            disabled={!isMatch || deleting}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700
              disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl text-sm font-semibold transition-colors"
          >
            {deleting ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Đang xóa...</>
            ) : (
              <><Trash2 className="w-4 h-4" /> Xác nhận xóa</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
