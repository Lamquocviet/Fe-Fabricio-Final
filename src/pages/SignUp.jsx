import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    displayName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
    if (error) setError("");
    if (successMessage) setSuccessMessage("");
  };

  const validateForm = () => {
    const { username, displayName, email, password, confirmPassword } =
      formData;

    if (!username || !displayName || !email || !password || !confirmPassword) {
      return "All fields are required";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Invalid email format";
    }

    if (password.length < 6) {
      return "Password must be at least 6 characters";
    }

    if (password !== confirmPassword) {
      return "Passwords do not match";
    }
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

      const payload = {
        username: formData.username,
        displayName: formData.displayName,
        email: formData.email,
        password: formData.password,
      };

      const result = await registerUser(payload);

      if (result?.token) {
        localStorage.setItem("token", result.token);
      }

      if (result?.user) {
        localStorage.setItem("user", JSON.stringify(result.user));
      }

      setLoading(false);
      setSuccessMessage("Registration successful");
      setFormData({
        username: "",
        displayName: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      navigate("/signin");
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(255,90,59,0.18),transparent_29%),radial-gradient(circle_at_top_right,rgba(255,90,59,0.12),transparent_22%),linear-gradient(180deg,#050505_0%,#0a0a0c_45%,#040404_100%)] px-4 py-6 md:px-6 flex items-center justify-center text-white">
      <div className="w-full max-w-7xl overflow-hidden rounded-[22px] md:rounded-[28px] border border-white/10 bg-[#141418]/70 backdrop-blur-md shadow-[0_20px_80px_rgba(0,0,0,0.45)] grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="border-b lg:border-b-0 lg:border-r border-white/10 px-5 py-8 sm:px-8 md:px-10 lg:px-12 lg:py-14 bg-[radial-gradient(circle_at_top_left,rgba(255,95,65,0.18),transparent_30%),linear-gradient(135deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01))]">
          <span className="inline-block rounded-full border border-orange-400/20 bg-orange-400/10 px-4 py-2 text-sm font-semibold text-orange-300">
            Join Fabricio Community
          </span>

          <h1 className="mt-5 text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight text-zinc-100">
            Create your player account and step into the community.
          </h1>

          <p className="mt-5 max-w-xl text-sm sm:text-base leading-7 text-zinc-400">
            Discover indie games, follow creators, react to community posts, and
            publish your own gaming content in one sleek dark platform.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            {[
              "Discover new games",
              "Follow creators",
              "Join community threads",
              "Publish your own posts",
            ].map((item) => (
              <span
                key={item}
                className="rounded-full border border-white/10 bg-white/3 px-4 py-2 text-xs sm:text-sm text-zinc-300">
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="px-4 py-5 sm:px-6 md:px-8 lg:px-9 flex items-center justify-center bg-linear-to-b from-white/2 to-white/1">
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#0a0a0c]/80 p-5 sm:p-6 md:p-8 shadow-[0_16px_50px_rgba(0,0,0,0.35)]">
            <h2 className="text-2xl md:text-3xl font-extrabold text-white">
              Sign Up
            </h2>
            <p className="mt-2 text-sm leading-6 text-zinc-400">
              Start building your profile and explore the latest games, updates,
              and player discussions.
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
              <div className="flex flex-col gap-2 text-left">
                <label className="mb-2 block text-sm font-medium text-zinc-300">
                  Username
                </label>
                <input
                  type="text"
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={handleChange("username")}
                  disabled={loading}
                  className="w-full rounded-2xl border border-white/10 bg-white/4 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-500 focus:border-orange-400/40"
                />
              </div>

              <div className="flex flex-col gap-2 text-left">
                <label className="mb-2 block text-sm font-medium text-zinc-300">
                  Display Name
                </label>
                <input
                  type="text"
                  placeholder="Enter your display name"
                  value={formData.displayName}
                  onChange={handleChange("displayName")}
                  disabled={loading}
                  className="w-full rounded-2xl border border-white/10 bg-white/4 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-500 focus:border-orange-400/40"
                />
              </div>

              <div className="flex flex-col gap-2 text-left">
                <label className="mb-2 block text-sm font-medium text-zinc-300">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange("email")}
                  disabled={loading}
                  className="w-full rounded-2xl border border-white/10 bg-white/4 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-500 focus:border-orange-400/40"
                />
              </div>

              <div className="flex flex-col gap-2 text-left">
                <label className="mb-2 block text-sm font-medium text-zinc-300">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange("password")}
                  disabled={loading}
                  className="w-full rounded-2xl border border-white/10 bg-white/4 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-500 focus:border-orange-400/40"
                />
              </div>

              <div className="flex flex-col gap-2 text-left">
                <label className="mb-2 block text-sm font-medium text-zinc-300">
                  Confirm Password
                </label>
                <input
                  type="password"
                  placeholder="Re-enter your password"
                  value={formData.confirmPassword}
                  onChange={handleChange("confirmPassword")}
                  disabled={loading}
                  className="w-full rounded-2xl border border-white/10 bg-white/4 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-500 focus:border-orange-400/40"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-2xl bg-linear-to-r from-[#ff6a4a] to-[#ff5a3b] px-4 py-3 text-sm font-bold text-white shadow-[0_10px_24px_rgba(255,90,59,0.22)] transition hover:from-[#ff7a59] hover:to-[#ff4d4d]">
                Create Account
              </button>
            </form>

            <div className="my-5 flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-zinc-500">
              <div className="h-px flex-1 bg-white/10"></div>
              <span>or continue</span>
              <div className="h-px flex-1 bg-white/10"></div>
            </div>

            <button className="w-full rounded-2xl border border-white/10 bg-white/3 px-4 py-3 text-sm font-semibold text-zinc-100 transition hover:bg-white/5">
              Continue with Google
            </button>

            <p className="mt-5 text-center text-sm text-zinc-400">
              Already have an account?{" "}
              <Link
                to="/signin"
                className="font-bold text-[#ff7a59] cursor-pointer">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
