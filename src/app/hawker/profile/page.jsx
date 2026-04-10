"use client";

import React, { useEffect, useState } from "react";
import { FaUser, FaSave, FaEdit, FaCamera } from "react-icons/fa";
import Layout from "../component/layout"; 

const ProfilePage = () => {
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState("");

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    address: "",
  });

  // ✅ Fetch profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/hawker/profile");
        const data = await res.json();

        if (res.ok) {
          setFormData({
            username: data.user.username || "",
            email: data.user.email || "",
            phone: data.user.phone || "",
            address: data.user.address || "",
          });
          setPreviewImage(data.user.image || "");
        } else {
          setMessage("❌ Failed to load profile");
        }
      } catch (err) {
        setMessage("❌ Server error");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // ✅ input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setProfileImage(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  // ✅ Save
  const handleSave = async () => {
    if (!isEditing || isSaving) return;

    setIsSaving(true);
    setMessage("");

    const data = new FormData();
    data.append("username", formData.username);
    data.append("email", formData.email);
    data.append("phone", formData.phone);
    data.append("address", formData.address);

    if (profileImage) {
      data.append("image", profileImage);
    }

    try {
      const res = await fetch("/api/hawker/profile", {
        method: "PUT",
        body: data,
      });

      if (res.ok) {
        setMessage("✅ Profile Updated Successfully!");
        setIsEditing(false);
      } else {
        const err = await res.json();
        setMessage(err?.error || "❌ Update Failed");
      }
    } catch (error) {
      setMessage("❌ Server Error");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <p className="text-gray-400">Loading...</p>;

  return (
    <Layout>
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-pink-500 flex items-center gap-3">
        <FaUser /> My Profile
      </h1>

      <div className="bg-gray-900 p-8 rounded-xl shadow-2xl max-w-xl">
        {/* PROFILE IMAGE */}
        <div className="relative w-28 h-28 mx-auto mb-4">
          <img
            src={
              previewImage ||
              "https://via.placeholder.com/150?text=User"
            }
            alt="Profile"
            className="w-28 h-28 rounded-full object-cover border-4 border-pink-600"
          />

          {isEditing && (
            <label className="absolute bottom-1 right-1 bg-pink-600 p-2 rounded-full cursor-pointer">
              <FaCamera className="text-white text-sm" />
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleImageChange}
              />
            </label>
          )}
        </div>

        <h2 className="text-center text-xl font-semibold text-white mb-6">
          {formData.username}
        </h2>

        <form className="space-y-4">
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            disabled={!isEditing}
            placeholder="Full Name"
            className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 disabled:opacity-50"
          />

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            disabled={!isEditing}
            placeholder="Email"
            className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 disabled:opacity-50"
          />

          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            disabled={!isEditing}
            placeholder="Phone"
            className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 disabled:opacity-50"
          />

          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            disabled={!isEditing}
            placeholder="Address"
            className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 disabled:opacity-50"
          />

          {!isEditing ? (
            <button
              type="button"
              onClick={() => {
                setIsEditing(true);
                setMessage("");
              }}
              className="w-full bg-pink-600 hover:bg-pink-700 py-3 rounded-lg font-semibold flex justify-center gap-2"
            >
              <FaEdit /> Edit Profile
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className={`w-full py-3 rounded-lg font-semibold flex justify-center gap-2 ${
                isSaving
                  ? "bg-gray-700"
                  : "bg-cyan-600 hover:bg-cyan-700"
              }`}
            >
              <FaSave /> {isSaving ? "Saving..." : "Save Profile"}
            </button>
          )}

          {message && (
            <p
              className={`text-center mt-3 font-semibold ${
                message.includes("❌")
                  ? "text-red-500"
                  : "text-green-500"
              }`}
            >
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
    </Layout>
  );
};

export default ProfilePage;