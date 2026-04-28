import axiosInstance from "../utils/axiosInstance";

const getErrorMessage = (error, fallbackMessage) => {
  return error?.response?.data?.message || fallbackMessage;
};

export const userService = {
  // Lấy thông tin user hiện tại
  async getCurrentUser() {
    try {
      const res = await axiosInstance.get("/Users/me");
      return res.data;
    } catch (error) {
      throw new Error(
        getErrorMessage(error, "Không lấy được thông tin người dùng")
      );
    }
  },

  // Cập nhật thông tin profile
  async updateProfile(data) {
    try {
      const res = await axiosInstance.put("/Users/profile", data);
      return res.data;
    } catch (error) {
      throw new Error(
        getErrorMessage(error, "Cập nhật profile thất bại")
      );
    }
  },

  // Upload avatar
  async uploadAvatar(file) {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await axiosInstance.post("/Users/avatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data;
    } catch (error) {
      throw new Error(
        getErrorMessage(error, "Tải avatar thất bại")
      );
    }
  }
};