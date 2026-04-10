"use client";

import React, { useState } from "react";
import Link from "next/link";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "",
    phone: "",
    address: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.role) {
      setMessage("Please select a role");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      setMessage(data.message);

      if (res.ok) {
        setFormData({
          username: "",
          email: "",
          password: "",
          role: "",
          phone: "",
          address: "",
        });
      }
    } catch (error) {
      console.error(error);
      setMessage("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-black text-gray-200 overflow-hidden flex items-center justify-center px-4">

      {/* Animated Glow Blobs */}
      <div className="absolute w-[500px] h-[500px] bg-pink-600/20 rounded-full blur-3xl animate-pulse -top-40 -left-40"></div>
      <div className="absolute w-[400px] h-[400px] bg-purple-700/20 rounded-full blur-3xl animate-pulse bottom-0 right-0"></div>

      {/* Fade In Card */}
      <div className="relative w-full max-w-md animate-fadeInUp">

        {/* Animated Gradient Border */}
        <div className="p-[1px] rounded-[2rem] bg-gradient-to-br from-pink-500 via-purple-600 to-pink-500 animate-gradientMove">

          <div className="bg-gray-900/80 backdrop-blur-xl rounded-[2rem] p-10 border border-gray-800 shadow-2xl">

            {/* Logo */}
            <div className="text-center mb-8 text-3xl font-black italic tracking-tight text-white">
              STREET<span className="text-pink-500">HAWKER</span>
            </div>

            <h1 className="text-3xl font-black text-white text-center mb-2 italic">
              Create Account
            </h1>

            <p className="text-gray-400 text-center mb-8 text-sm">
              Join the modern street hustle.
            </p>

            <form className="space-y-5" onSubmit={handleSubmit}>

              <input
                name="username"
                value={formData.username}
                onChange={handleChange}
                type="text"
                placeholder="User Name"
                className="w-full bg-black/50 border border-gray-700 text-white px-5 py-4 rounded-xl focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/40 transition-all hover:scale-[1.02]"
              />

              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                type="email"
                placeholder="E-mail"
                className="w-full bg-black/50 border border-gray-700 text-white px-5 py-4 rounded-xl focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/40 transition-all hover:scale-[1.02]"
              />

              <input
                name="password"
                value={formData.password}
                onChange={handleChange}
                type="password"
                placeholder="Password"
                className="w-full bg-black/50 border border-gray-700 text-white px-5 py-4 rounded-xl focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/40 transition-all hover:scale-[1.02]"
              />

              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full bg-black/50 border border-gray-700 text-gray-300 px-5 py-4 rounded-xl focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/40 transition-all hover:scale-[1.02]"
              >
                <option value="">Select Role</option>
                <option value="hawker">Hawker</option>
                <option value="customer">Customer</option>
              </select>

              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                type="tel"
                placeholder="Phone Number"
                className="w-full bg-black/50 border border-gray-700 text-white px-5 py-4 rounded-xl focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/40 transition-all hover:scale-[1.02]"
              />

              <input
                name="address"
                value={formData.address}
                onChange={handleChange}
                type="text"
                placeholder="Address"
                className="w-full bg-black/50 border border-gray-700 text-white px-5 py-4 rounded-xl focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/40 transition-all hover:scale-[1.02]"
              />

              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-pink-600 text-white font-bold py-4 rounded-xl transition-all shadow-[0_0_25px_rgba(219,39,119,0.5)] ${
                  loading
                    ? "opacity-70 cursor-not-allowed"
                    : "hover:bg-pink-500 hover:scale-[1.05] active:scale-[0.97]"
                }`}
              >
                {loading ? "Registering..." : "Register"}
              </button>

            </form>

            {message && (
              <p className="mt-6 text-center text-pink-400 text-sm">
                {message}
              </p>
            )}

            <div className="my-8 h-px bg-gray-800"></div>

            <div className="text-center">
              <p className="text-gray-400 text-sm">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-pink-500 font-bold hover:text-pink-400 transition-all"
                >
                  Login
                </Link>
              </p>
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

export default RegisterPage;
