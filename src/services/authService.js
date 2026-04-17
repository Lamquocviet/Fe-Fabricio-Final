import axiosInstance from "../utils/axiosInstance";

export const registerUser = async (data) => {
  try {
    const res = await axiosInstance.post("/auth/register", data);
    return res.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message || "Đăng ký thất bại");
  }
};

export const loginUser = async (data) => {
  try {
    const res = await axiosInstance.post("/auth/login", data);

    const responseData = res.data;

    if (responseData?.token) {
      localStorage.setItem("token", responseData.token);
    }

    if (responseData?.user) {
      localStorage.setItem("user", JSON.stringify(responseData.user));
    }

    return responseData;
  } catch (error) {
    throw new Error(error?.response?.data?.message || "Đăng nhập thất bại");
  }
};

export const getMyProfile = async () => {
  try {
    const res = await axiosInstance.get("/auth/profile");

    if (res.data?.user) {
      localStorage.setItem("user", JSON.stringify(res.data.user));
    }

    return res.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || "Không lấy được thông tin cá nhân",
    );
  }
};

export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};
