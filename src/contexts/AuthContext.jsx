/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";
import {
  registerUser,
  loginUser,
  getMyProfile,
  logoutUser,
} from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
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

  const saveUser = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const handleRegister = async (formData) => {
    try {
      setLoading(true);
      setError("");

      return await registerUser(formData);
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

      let loginUserData = res?.user;

      if (!loginUserData) {
        const profileRes = await getMyProfile();
        loginUserData = profileRes?.user || profileRes?.data || profileRes;
      }

      saveUser(loginUserData);

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

      saveUser(profileUser);

      return profileUser;
    } catch (err) {
      setError(err.message || "Không lấy được profile");
      setUser(null);
      localStorage.removeItem("user");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
    } finally {
      setUser(null);
      setError("");
      localStorage.removeItem("user");
    }
  };

  useEffect(() => {
    const localUser = localStorage.getItem("user");
    if (localUser) {
      try {
        const parsedUser = JSON.parse(localUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing user from localStorage:", error);
      }
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        setUser: saveUser,
        handleRegister,
        handleLogin,
        fetchMyProfile,
        handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default function useAuth() {
  return useContext(AuthContext);
}