import axios from "axios";
import {
  clearStoredAuth,
  isAuthErrorStatus,
  notifyAuthRequired,
  SESSION_EXPIRED_MESSAGE,
} from "@/utils/authGuard";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 60000,
});
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error?.response?.status;
    const requestUrl = error?.config?.url || "";
    const isAuthRequest = /\/auth\/(login|register|signin|signout|logout)/i.test(
      requestUrl,
    );

    if (isAuthErrorStatus(status) && !isAuthRequest) {
      clearStoredAuth();
      notifyAuthRequired(SESSION_EXPIRED_MESSAGE);

      if (window.location.pathname !== "/signin") {
        window.setTimeout(() => {
          window.location.href = "/signin";
        }, 300);
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
