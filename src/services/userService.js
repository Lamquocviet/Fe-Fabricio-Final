// src/services/userService.js
const currentUser = {
  id: 1,
  username: "vietlam",
  displayName: "Lâm Quốc Việt",
  email: "viet.lam@example.com",
  avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop&crop=face",
  bio: "Indie game lover | Passionate about atmospheric stories and cozy experiences.",
};

export const userService = {
  // Lấy thông tin user hiện tại
  async getCurrentUser() {
    await new Promise(resolve => setTimeout(resolve, 400));
    return currentUser;
  },

  // Cập nhật thông tin profile
  async updateProfile(data) {
    await new Promise(resolve => setTimeout(resolve, 600));
    // Giả lập cập nhật
    Object.assign(currentUser, data);
    return currentUser;
  },

  // Upload avatar (giả lập)
  async uploadAvatar(file) {
    await new Promise(resolve => setTimeout(resolve, 800));
    // Trả về URL giả lập
    return "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop&crop=face";
  }
};