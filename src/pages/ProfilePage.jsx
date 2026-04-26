import React, { useState } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

import { useProfile } from "@/hooks/useProfile";
import { Edit2, Camera, Save, X } from "lucide-react";
import ProfileTab from "@/components/ProfileTab";

const ProfilePage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const { user, loading, saving, message, updateProfile } = useProfile();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  // Bắt đầu chỉnh sửa
  const startEditing = () => {
    if (!user) return;
    setFormData({
      displayName: user.displayName,
      avatar: user.avatar,
      bio: user.bio || "",
    });
    setIsEditing(true);
  };

  // Lưu thay đổi
  const handleSave = async () => {
    await updateProfile(formData);
    setIsEditing(false);
  };

  // Hủy chỉnh sửa
  const handleCancel = () => {
    setIsEditing(false);
  };

  // Thay đổi avatar
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData((prev) => ({ ...prev, avatar: event.target.result }));
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
            {/* ==================== MAIN PROFILE CARD ==================== */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden">
              {/* Phần trên: Avatar + Thông tin + Nút Đăng game */}
              <div className="p-8 flex flex-col sm:flex-row gap-6">
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <img
                    src={
                      isEditing ? formData.avatar || user?.avatar : user?.avatar
                    }
                    alt="Avatar"
                    className="w-28 h-28 rounded-2xl object-cover border border-zinc-700"
                  />
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
                  {isEditing ? (
                    <input
                      type="text"
                      name="displayName"
                      value={formData.displayName || ""}
                      onChange={handleInputChange}
                      className="text-3xl font-bold bg-transparent border-b-2 border-red-500 focus:outline-none w-full mb-2"
                    />
                  ) : (
                    <h2 className="text-4xl font-bold !text-white truncate">
                      {user?.displayName}
                    </h2>
                  )}

                  <p className="text-zinc-400">@{user?.username}</p>
                  <p className="text-zinc-400">@{user?.email}</p>

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
                  <button className="bg-gradient-to-r from-red-500 to-rose-600 hover:brightness-110 px-8 py-3 rounded-2xl font-semibold text-sm whitespace-nowrap transition">
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
                </div>
              </div>
            </div>
            <ProfileTab />
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProfilePage;
