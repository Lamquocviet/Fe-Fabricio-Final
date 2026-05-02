import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

import { useProfile } from "@/hooks/useProfile";
import useRequireAuth from "@/hooks/useRequireAuth";
import { changePassword } from "@/services/userService";
import { Edit2, Camera, Save, X, KeyRound } from "lucide-react";
import ProfileTab from "@/components/ProfileTab";

import { toast } from "sonner";

const INITIAL_PASSWORD_FORM = {
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
};

const getProfileName = (user) => {
  return user?.displayName || user?.username || "Người dùng";
};

const getAvatarInitials = (name) => {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
};

const ProfilePage = () => {
  const navigate = useNavigate();
  const { requireAuth } = useRequireAuth();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const { user, loading, saving, message, updateProfile } = useProfile();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [failedAvatarSrc, setFailedAvatarSrc] = useState("");
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState(INITIAL_PASSWORD_FORM);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordFeedback, setPasswordFeedback] = useState({
    type: "",
    text: "",
  });

  const [avatarVersion, setAvatarVersion] = useState(0);

  const profileName = getProfileName(user);
  const avatarSrc = (user?.avatarUrl || user?.avatar) + `?v=${avatarVersion}`;

  const shouldShowAvatarImage =
    Boolean(avatarSrc) && failedAvatarSrc !== avatarSrc;

  // Bắt đầu chỉnh sửa
  const startEditing = () => {
    if (!requireAuth() || !user) return;

    setFormData({
      avatar: user.avatarUrl || user.avatar || "",
      avatarFile: null,
      avatarPreview: "",
      bio: user.bio || "",
    });
    setIsEditing(true);
  };

  // Lưu thay đổi
  const handleSave = async () => {
    if (!requireAuth()) return;

    await updateProfile({
      bio: formData.bio || "",
      avatarFile: formData.avatarFile,
    });

    setAvatarVersion((prev) => prev + 1);
    setFailedAvatarSrc("");

    setIsEditing(false);
  };

  // Hủy chỉnh sửa
  const handleCancel = () => {
    setIsEditing(false);
  };

  // Thay đổi avatar
  const handleAvatarChange = (e) => {
    if (!requireAuth()) {
      e.target.value = "";
      return;
    }

    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData((prev) => ({
          ...prev,
          avatarFile: file,
          avatarPreview: event.target.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const openPasswordModal = () => {
    if (!requireAuth()) return;

    setPasswordForm(INITIAL_PASSWORD_FORM);
    setPasswordFeedback({ type: "", text: "" });
    setIsPasswordModalOpen(true);
  };

  const closePasswordModal = () => {
    if (passwordSaving) return;

    setIsPasswordModalOpen(false);
    setPasswordForm(INITIAL_PASSWORD_FORM);
    setPasswordFeedback((prev) =>
      prev.type === "error" ? { type: "", text: "" } : prev,
    );
  };

  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;

    setPasswordForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (passwordFeedback.type === "error") {
      setPasswordFeedback({ type: "", text: "" });
    }
  };

  const validatePasswordForm = () => {
    const oldPassword = passwordForm.oldPassword.trim();
    const newPassword = passwordForm.newPassword.trim();
    const confirmPassword = passwordForm.confirmPassword.trim();

    if (!oldPassword || !newPassword || !confirmPassword) {
      return "Vui lòng nhập đầy đủ thông tin.";
    }

    if (newPassword.length < 6) {
      return "Mật khẩu mới phải có ít nhất 6 ký tự.";
    }

    if (newPassword !== confirmPassword) {
      return "Mật khẩu mới và xác nhận mật khẩu không khớp.";
    }

    if (oldPassword === newPassword) {
      return "Mật khẩu mới không được trùng với mật khẩu hiện tại.";
    }

    return "";
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (!requireAuth()) return;

    const validationError = validatePasswordForm();

    if (validationError) {
      setPasswordFeedback({ type: "error", text: validationError });
      return;
    }

    try {
      setPasswordSaving(true);
      setPasswordFeedback({ type: "", text: "" });

      await changePassword({
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword,
        confirmPassword: passwordForm.confirmPassword,
      });

      setPasswordForm(INITIAL_PASSWORD_FORM);
      setIsPasswordModalOpen(false);
      setPasswordFeedback({
        type: "success",
        text: "Đổi mật khẩu thành công.",
      });
    } catch (error) {
      setPasswordFeedback({
        type: "error",
        text: error.message || "Không thể đổi mật khẩu. Vui lòng thử lại.",
      });
    } finally {
      setPasswordSaving(false);
    }
  };

  const handleUploadGameClick = () => {
    if (!requireAuth()) return;

    navigate("/uploadgame");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] text-white">
        <Header onOpenSidebar={() => setIsSidebarOpen(true)} />
        <div className="flex">
          <Sidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
          />
          <main className="flex-1 flex items-center justify-center pt-20">
            <p className="text-xl">Đang tải thông tin...</p>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Header onOpenSidebar={() => setIsSidebarOpen(true)} />
      <div className="flex">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        <main className="flex-1 p-6 pt-8">
          <div className="w-full mx-auto">
            {message?.text && (
              <div
                className={`mb-6 p-4 rounded-2xl text-center ${
                  message.type === "success"
                    ? "bg-green-500/20 text-green-400"
                    : "bg-red-500/20 text-red-400"
                }`}
              >
                {message.text}
              </div>
            )}
            {passwordFeedback.type === "success" && (
              <div className="mb-6 rounded-2xl bg-green-500/20 p-4 text-center text-green-400">
                {passwordFeedback.text}
              </div>
            )}
            {/* ==================== MAIN PROFILE CARD ==================== */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden">
              {/* Phần trên: Avatar + Thông tin + Nút Đăng game */}
              <div className="p-8 flex flex-col sm:flex-row gap-6">
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  {shouldShowAvatarImage ? (
                    <img
                      src={avatarSrc}
                      alt={profileName}
                      onError={() => setFailedAvatarSrc(avatarSrc)}
                      className="w-28 h-28 rounded-2xl object-cover border border-zinc-700 bg-zinc-800"
                    />
                  ) : (
                    <div className="flex h-28 w-28 items-center justify-center rounded-2xl border border-zinc-700 bg-gradient-to-br from-red-600 to-zinc-800 text-3xl font-bold text-white">
                      {getAvatarInitials(profileName) || "U"}
                    </div>
                  )}
                  {isEditing && (
                    <label className="absolute -bottom-2 -right-2 bg-red-600 p-2.5 rounded-xl cursor-pointer hover:bg-red-700 transition shadow-lg">
                      <Camera className="w-5 h-5" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                {/* Thông tin cá nhân */}
                <div className="flex-1">
                  <h2 className="text-4xl font-bold !text-white truncate">
                    {profileName}
                  </h2>

                  <p className="text-zinc-400">@{user?.username || "user"}</p>
                  <p className="text-zinc-400">{user?.email || ""}</p>

                  {isEditing ? (
                    <textarea
                      name="bio"
                      value={formData.bio || ""}
                      onChange={handleInputChange}
                      rows={3}
                      className="mt-4 w-full bg-zinc-800 border border-zinc-700 rounded-2xl p-4 text-sm resize-y"
                      placeholder="Mô tả về bạn..."
                    />
                  ) : (
                    <p className="text-zinc-300 mt-3 leading-relaxed">
                      {user?.bio ||
                        "Indie game lover | Passionate about atmospheric stories and cozy experiences."}
                    </p>
                  )}
                </div>

                {/* Nút Đăng game */}
                <div className="flex flex-col gap-4 flex-shrink-0 self-start sm:self-center mt-2 sm:mt-0 justify-between">
                  <button
                    type="button"
                    onClick={handleUploadGameClick}
                    className="bg-gradient-to-r from-red-500 to-rose-600 hover:brightness-110 px-8 py-3 rounded-2xl font-semibold text-sm whitespace-nowrap transition"
                  >
                    Đăng game
                  </button>
                  {isEditing ? (
                    <div className="flex gap-3">
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        className="bg-red-600 hover:bg-red-700 disabled:bg-zinc-700 px-6 py-2.5 rounded-xl font-medium flex items-center gap-2"
                      >
                        <Save className="w-4 h-4" />
                        Lưu
                      </button>
                      <button
                        onClick={handleCancel}
                        className="border border-zinc-700 hover:bg-zinc-800 px-6 py-2.5 rounded-xl font-medium flex items-center gap-2"
                      >
                        <X className="w-4 h-4" />
                        Hủy
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={startEditing}
                      className="flex items-center gap-2 border border-zinc-700 hover:bg-zinc-800 px-6 py-2.5 rounded-xl font-medium transition"
                    >
                      <Edit2 className="w-4 h-4" />
                      Chỉnh sửa
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={openPasswordModal}
                    className="flex items-center gap-2 border border-zinc-700 hover:bg-zinc-800 px-6 py-2.5 rounded-xl font-medium transition"
                  >
                    <KeyRound className="w-4 h-4" />
                    Đổi mật khẩu
                  </button>
                </div>
              </div>
            </div>
            <ProfileTab user={user} />
          </div>
        </main>
      </div>

      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-white">Đổi mật khẩu</h2>
                <p className="mt-1 text-sm text-zinc-400">
                  Cập nhật mật khẩu đăng nhập cho tài khoản của bạn.
                </p>
              </div>

              <button
                type="button"
                onClick={closePasswordModal}
                disabled={passwordSaving}
                className="rounded-xl border border-zinc-800 p-2 text-zinc-400 transition hover:bg-zinc-900 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                aria-label="Đóng"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handlePasswordSubmit} className="mt-6 space-y-4">
              <label className="block">
                <span className="text-sm font-medium text-zinc-300">
                  Mật khẩu hiện tại
                </span>
                <input
                  type="password"
                  name="oldPassword"
                  value={passwordForm.oldPassword}
                  onChange={handlePasswordInputChange}
                  className="mt-2 w-full rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-red-500"
                  placeholder="Nhập mật khẩu hiện tại"
                  autoComplete="current-password"
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-zinc-300">
                  Mật khẩu mới
                </span>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordInputChange}
                  className="mt-2 w-full rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-red-500"
                  placeholder="Tối thiểu 6 ký tự"
                  autoComplete="new-password"
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-zinc-300">
                  Xác nhận mật khẩu mới
                </span>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordInputChange}
                  className="mt-2 w-full rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-red-500"
                  placeholder="Nhập lại mật khẩu mới"
                  autoComplete="new-password"
                />
              </label>

              {passwordFeedback.type === "error" && (
                <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300">
                  {passwordFeedback.text}
                </div>
              )}

              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closePasswordModal}
                  disabled={passwordSaving}
                  className="rounded-xl border border-zinc-700 px-5 py-2.5 text-sm font-medium text-zinc-200 transition hover:bg-zinc-900 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Hủy
                </button>

                <button
                  type="submit"
                  disabled={passwordSaving}
                  className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-zinc-700"
                >
                  {passwordSaving ? "Đang cập nhật..." : "Cập nhật mật khẩu"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
