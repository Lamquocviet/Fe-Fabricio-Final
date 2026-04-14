/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";    

const FormField = ({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  disabled = false,
}) => {
  return (
    <div className="flex flex-col gap-2 text-left">
      <label className="block text-sm font-medium text-zinc-300">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="w-full rounded-2xl border border-white/10 bg-white/4 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-orange-400/40 disabled:cursor-not-allowed disabled:opacity-60"
      />
    </div>
  );
};

const Login = () => {
  // const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (field) => (e) => {
    const value = field === "rememberMe" ? e.target.checked : e.target.value;

    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (error) setError("");
    if (successMessage) setSuccessMessage("");
  };

  const validateForm = () => {
    const { username, password } = formData;

    if (!username || !password) {
      return "Email and password are required";
    }


    if (password.length < 6) {
      return "Password must be at least 6 characters";
    }

    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccessMessage("");

      await new Promise((resolve) => setTimeout(resolve, 1200));

      const payload = {
        username: formData.username,
        password: formData.password
      }

    //   const result = await loginUser(payload);

    //   if(result?.token) {
    //     localStorage.setItem("token", result.token);
    //   }

    //   if(result?.user) {
    //     localStorage.setItem("user", JSON.stringify(result.user));
    //   }

      setSuccessMessage("Login successful");

      // navigate("/");
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(255,90,59,0.18),transparent_28%),radial-gradient(circle_at_top_right,rgba(255,90,59,0.12),transparent_22%),linear-gradient(180deg,#050505_0%,#0a0a0c_45%,#040404_100%)] px-4 py-6 md:px-6 flex items-center justify-center text-white">
      <div className="w-full max-w-7xl overflow-hidden rounded-[22px] md:rounded-[28px] border border-white/10 bg-[#141418]/70 backdrop-blur-md shadow-[0_20px_80px_rgba(0,0,0,0.45)] grid grid-cols-1 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="order-2 lg:order-1 px-4 py-5 sm:px-6 md:px-8 lg:px-9 flex items-center justify-center bg-linear-to-b from-white/2 to-white/1">
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#0a0a0c]/80 p-5 sm:p-6 md:p-8 shadow-[0_16px_50px_rgba(0,0,0,0.35)]">
            <h2 className="text-2xl md:text-3xl font-extrabold text-white">
              Welcome Back
            </h2>

            <p className="mt-2 text-sm leading-6 text-zinc-400">
              Log in to continue your journey, track your favorite games, and
              join the latest player discussions.
            </p>

            {error && (
              <div className="mt-4 rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}

            {successMessage && (
              <div className="mt-4 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-300">
                {successMessage}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="mt-6 space-y-4">
              <FormField
                label="Username"
                type="text"
                placeholder="Enter your username"
                value={formData.username}
                onChange={handleChange("username")}
                disabled={loading}
              />

              <div className="flex flex-col gap-2 text-left">
                <label className="block text-sm font-medium text-zinc-300">
                  Password
                </label>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange("password")}
                    disabled={loading}
                    className="w-full rounded-2xl border border-white/10 bg-white/4 px-4 py-3 pr-12 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-orange-400/40 disabled:cursor-not-allowed disabled:opacity-60"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-zinc-400 transition hover:text-zinc-200">
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 text-sm">
                <label className="flex items-center gap-2 text-zinc-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.rememberMe}
                    onChange={handleChange("rememberMe")}
                    className="h-4 w-4 rounded border-white/10 bg-transparent accent-orange-500"
                  />
                  Remember me
                </label>

                <span className="cursor-pointer font-medium text-[#ff7a59] hover:text-[#ff8b6d]">
                  Forgot password?
                </span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-linear-to-r from-[#ff6a4a] to-[#ff5a3b] px-4 py-3 text-sm font-bold text-white shadow-[0_10px_24px_rgba(255,90,59,0.22)] transition hover:from-[#ff7a59] hover:to-[#ff4d4d] disabled:cursor-not-allowed disabled:opacity-60">
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <div className="my-5 flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-zinc-500">
              <div className="h-px flex-1 bg-white/10"></div>
              <span>or continue</span>
              <div className="h-px flex-1 bg-white/10"></div>
            </div>

            <button
              type="button"
              className="w-full rounded-2xl border border-white/10 bg-white/3 px-4 py-3 text-sm font-semibold text-zinc-100 transition hover:bg-white/5">
              Continue with Google
            </button>

            <p className="mt-5 text-center text-sm text-zinc-400">
              Don&apos;t have an account?{" "}
              <Link to="/signup" className="cursor-pointer font-bold text-[#ff7a59]">
                Sign up
              </Link>
            </p>
          </div>
        </div>

        <div className="order-1 lg:order-2 border-b lg:border-b-0 lg:border-l border-white/10 px-5 py-8 sm:px-8 md:px-10 lg:px-12 lg:py-14 bg-[radial-gradient(circle_at_top_right,rgba(255,95,65,0.18),transparent_30%),linear-gradient(135deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01))] flex flex-col justify-center">
          <span className="inline-block rounded-full border border-orange-400/20 bg-orange-400/10 px-4 py-2 text-sm font-semibold text-orange-300 w-fit">
            Back to GameStore
          </span>

          <h1 className="mt-5 text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight text-zinc-100">
            Jump back into your world of games and community.
          </h1>

          <p className="mt-5 max-w-xl text-sm sm:text-base leading-7 text-zinc-400">
            Access your profile, continue discussions, discover fresh releases,
            and stay connected with creators and players across the platform.
          </p>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              "Track your favorite titles",
              "Save games to your list",
              "Join player conversations",
              "Follow creators and updates",
            ].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-white/10 bg-white/3 px-4 py-4 text-sm text-zinc-300">
                {item}
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-3xl border border-orange-400/10 bg-orange-400/5 p-5">
            <p className="text-sm leading-7 text-zinc-300">
              “Discover new worlds, share your thoughts, and keep your gaming
              identity in one sleek platform.”
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
