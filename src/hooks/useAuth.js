// src/hooks/useAuth.js
import { useEffect, useState } from "react";
import {
  registerUser,
  loginUser,
  getMyProfile,
  logoutUser,
} from "../services/authService";

export default function useAuth() {
  const [user, setUser] = useState(() => {
    try {
      const rawUser = localStorage.getItem("user");
      return rawUser ? JSON.parse(rawUser) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (formData) => {
    try {
      setLoading(true);
      setError("");

      const res = await registerUser(formData);

      return res;
    } catch (err) {
      setError(err.message || "Đăng ký thất bại");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (formData) => {
    try {
      setLoading(true);
      setError("");

      const res = await loginUser(formData);

      // if (res?.user) {
      //   setUser(res.user);
      // } else {
      //   // Nếu backend chỉ trả token mà chưa trả user,
      //   // gọi profile để lấy user thật
      //   const profileRes = await getMyProfile();
      //   const profileUser = profileRes?.user || profileRes?.data || profileRes;
      //   setUser(profileUser);
      // }

      return res;
    } catch (err) {
      setError(err.message || "Đăng nhập thất bại");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchMyProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await getMyProfile();
      const profileUser = res?.user || res?.data || res;

      setUser(profileUser);
      localStorage.setItem("user", JSON.stringify(profileUser));

      return profileUser;
    } catch (err) {
      setError(err.message || "Không lấy được profile");
      setUser(null);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logoutUser();
    setUser(null);
    setError("");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const localUser = localStorage.getItem("user");

    if (token && !localUser) {
      fetchMyProfile().catch(() => {
        handleLogout();
      });
    }
  }, []);

  return {
    user,
    loading,
    error,
    setUser,
    handleRegister,
    handleLogin,
    fetchMyProfile,
    handleLogout,
  };
}
