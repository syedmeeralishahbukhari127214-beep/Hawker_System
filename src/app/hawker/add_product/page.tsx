"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import { FaPlusSquare, FaSave } from "react-icons/fa";
import Layout from "../component/layout"; // Hawker layout import

interface ProductForm {
  name: string;
  description: string;
  price: string;
}

const AddProductPage: React.FC = () => {
  const [form, setForm] = useState<ProductForm>({
    name: "",
    description: "",
    price: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Handle input changes
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle form submit
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/hawker/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setMessage("✅ Product added successfully!");
      setForm({ name: "", description: "", price: "" });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setMessage("❌ " + err.message);
      } else {
        setMessage("❌ Unknown error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-pink-500 flex items-center gap-3">
          <FaPlusSquare /> Add New Product
        </h1>

        <p className="text-gray-400">
          Add your product. Only logged-in hawkers can add products.
        </p>

        <div className="bg-gray-900 p-8 rounded-xl shadow-2xl max-w-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Product Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Product Name
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:ring-pink-500 focus:border-pink-500"
                placeholder="e.g. Fresh Apples"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:ring-pink-500 focus:border-pink-500"
                placeholder="Short product description"
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Price
              </label>
              <input
                type="text"
                name="price"
                value={form.price}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:ring-pink-500 focus:border-pink-500"
                placeholder="Rs. 250/kg"
              />
            </div>

            {/* Message */}
            {message && <p className="text-center text-gray-300">{message}</p>}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-pink-600 hover:bg-pink-700 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50"
            >
              <FaSave /> {loading ? "Saving..." : "Save Product"}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default AddProductPage;
