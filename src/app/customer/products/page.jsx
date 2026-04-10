"use client";
import React, { useEffect, useState } from "react";
import Layout from "../component/layout";
import Link from "next/link";

const ProductsPage = () => {
  const [hawkers, setHawkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHawkers = async () => {
      try {
        const res = await fetch("/api/customer/products");
        if (!res.ok) throw new Error("Failed to fetch products");

        const data = await res.json();

        // Extract unique hawkers from products
        const uniqueHawkersMap = {};
        data.forEach((p) => {
          if (p.hawker?.id && !uniqueHawkersMap[p.hawker.id]) {
            uniqueHawkersMap[p.hawker.id] = p.hawker;
          }
        });

        setHawkers(Object.values(uniqueHawkersMap));
      } catch (err) {
        if (err instanceof Error) setError(err.message);
        else setError("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchHawkers();
  }, []);

  return (
    <Layout>
      <h1 className="text-3xl font-bold text-pink-500 mb-6">
        Available Hawkers
      </h1>

      {loading && <p className="text-gray-400">Loading hawkers...</p>}
      {error && <p className="text-red-400">{error}</p>}

      {!loading && !error && hawkers.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {hawkers.map((h) => (
            <div
              key={h.id}
              className="bg-gray-900 p-6 rounded-lg shadow-md hover:scale-105 transition-transform"
            >
              {/* 🖼 Profile Picture */}
              <div className="flex justify-center mb-4">
                <img
                  src={h.image || "/default-hawker.png"}
                  alt={h.username}
                  className="w-16 h-16 rounded-full object-cover"
                />
              </div>

              {/* 🧑 Username */}
              <h3 className="text-xl font-semibold mb-2 text-center">
                {h.username || "Unknown Hawker"}
              </h3>

              {/* ⭐ Rating Section */}
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="text-yellow-400">
                  {"★".repeat(Math.round(h.avgRating || 0))}
                  {"☆".repeat(5 - Math.round(h.avgRating || 0))}
                </div>
                <span className="text-sm text-gray-400">
                  ({h.reviewCount || 0} reviews)
                </span>
              </div>

              {/* 🏆 Top Rated Badge */}
              {h.avgRating >= 4.5 && (
                <div className="text-center text-green-400 font-semibold mb-3">
                  Top Rated
                </div>
              )}

              {/* 🔗 Explore Button */}
              <Link
                href={`/customer/hawkers/${h.id}`}
                className="w-full block text-center bg-pink-600 hover:bg-pink-700 py-2 rounded-lg font-semibold"
              >
                Explore More
              </Link>
            </div>
          ))}
        </div>
      )}

      {!loading && !error && hawkers.length === 0 && (
        <p className="text-gray-400">No hawkers available</p>
      )}
    </Layout>
  );
};

export default ProductsPage;
