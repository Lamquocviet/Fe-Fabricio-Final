import axiosInstance from "../utils/axiosInstance";

export const registerUser = async (data) => {
  try {
    const res = await axiosInstance.post("/Auth/register", data);
    return res.data;
}

export const loginUser = async (data) => {
    const res = await axiosInstance.post("/auth/login", data);

    const responseData = res.data;

    if (responseData?.accessToken) {
      localStorage.setItem("token", responseData.accessToken);
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
    const res = await axiosInstance.get("/User");

    if (res.data?.user) {
      localStorage.setItem("user", JSON.stringify(res.data.user));
    }

    return res.data;
}