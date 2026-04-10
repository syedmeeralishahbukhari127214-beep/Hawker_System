"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import { FaSignInAlt } from "react-icons/fa";

const LoginPage = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.status === 403) {
        setErrorMessage("Your account is not approved yet by admin.");
        setLoading(false);
        return;
      }

      if (!res.ok) {
        setErrorMessage(data.message || "Login failed");
        setLoading(false);
        return;
      }

      if (data.token) localStorage.setItem("token", data.token);
      if (data.user?.role) localStorage.setItem("role", data.user.role);

      toast.success("Login successful!");

      const role = data.user?.role;
      if (role === "hawker") router.push("/hawker");
      else if (role === "customer") router.push("/customer");
      else router.push("/dashboard");

      setFormData({ email: "", password: "" });
    } catch (err) {
      console.error("Login Error:", err);
      setErrorMessage("Something went wrong, please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-black text-gray-200 overflow-hidden flex items-center justify-center px-4">

      {/* Animated Gradient Blobs */}
      <div className="absolute w-[500px] h-[500px] bg-pink-600/20 rounded-full blur-3xl animate-pulse -top-40 -left-40"></div>
      <div className="absolute w-[400px] h-[400px] bg-purple-700/20 rounded-full blur-3xl animate-pulse bottom-0 right-0"></div>

      {/* Fade + Slide In Card */}
      <div className="relative w-full max-w-md animate-fadeInUp">

        {/* Animated Border */}
        <div className="p-[1px] rounded-[2rem] bg-gradient-to-br from-pink-500 via-purple-600 to-pink-500 animate-gradientMove">

          <div className="bg-gray-900/80 backdrop-blur-xl rounded-[2rem] p-10 border border-gray-800 shadow-2xl">

            {/* Logo */}
            <div className="text-center mb-8 text-3xl font-black italic tracking-tight text-white">
              STREET<span className="text-pink-500">HAWKER</span>
            </div>

            <h1 className="text-3xl font-black text-white text-center mb-2 italic">
              Welcome Back
            </h1>

            <p className="text-gray-400 text-center mb-8 text-sm">
              Login to continue your hustle.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter your email"
                className="w-full bg-black/50 border border-gray-700 text-white px-5 py-4 rounded-xl focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/40 transition-all hover:scale-[1.02]"
              />

              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter your password"
                className="w-full bg-black/50 border border-gray-700 text-white px-5 py-4 rounded-xl focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/40 transition-all hover:scale-[1.02]"
              />

              <button
                type="submit"
                disabled={loading}
                className={`w-full flex items-center justify-center gap-3 bg-pink-600 text-white font-bold py-4 rounded-xl transition-all shadow-[0_0_25px_rgba(219,39,119,0.5)] ${
                  loading
                    ? "opacity-70 cursor-not-allowed"
                    : "hover:bg-pink-500 hover:scale-[1.05] active:scale-[0.97]"
                }`}
              >
                <FaSignInAlt />
                {loading ? "Logging in..." : "Login"}
              </button>

              {errorMessage && (
                <p className="text-red-400 text-sm text-center mt-2">
                  {errorMessage}
                </p>
              )}

            </form>

            <div className="my-8 h-px bg-gray-800"></div>

            <div className="text-center">
              <Link
                href="/signup"
                className="text-pink-500 font-bold hover:text-pink-400 transition-all"
              >
                Don’t have an account? Register Now
              </Link>
            </div>

          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(60px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out forwards;
        }

        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .animate-gradientMove {
          background-size: 200% 200%;
          animation: gradientMove 6s ease infinite;
        }
      `}</style>

    </div>
  );
};

export default LoginPage;
