"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Layout from "../../component/layout";

const HawkerProductsPage = () => {
  const { hawkerId } = useParams();
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [addingId, setAddingId] = useState(null);

  // ✅ Fetch Hawker Products
  useEffect(() => {
    const fetchHawkerProducts = async () => {
      try {
        const res = await fetch(`/api/customer/${hawkerId}`, {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to fetch products");
        }

        const data = await res.json();
        setProducts(data);
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchHawkerProducts();
  }, [hawkerId]);

  // ✅ Add To Cart (CONNECTED TO REAL BACKEND)
  const addToCart = async (productId) => {
    try {
      setAddingId(productId);

      const res = await fetch("/api/customer/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ productId }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add to cart");

      // ✅ Redirect to cart page after adding
      router.push("/customer/cart");

    } catch (err) {
      alert(err.message || "Error adding to cart");
    } finally {
      setAddingId(null);
    }
  };

  return (
    <Layout>
      <h1 className="text-3xl font-bold text-pink-500 mb-6">
        Hawker's Products
      </h1>

      {loading && <p className="text-gray-400">Loading products...</p>}
      {error && <p className="text-red-400">{error}</p>}

      {!loading && !error && products.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map((p) => (
            <div
              key={p.id}
              className="bg-gray-900 p-6 rounded-lg shadow-md hover:scale-105 transition-transform"
            >
              <h3 className="text-xl font-semibold mb-2">{p.name}</h3>
              <p className="text-pink-400 font-bold mb-4">
                Rs {p.price}
              </p>

              <button
                className="w-full bg-pink-600 hover:bg-pink-700 py-2 rounded-lg font-semibold disabled:opacity-60"
                onClick={() => addToCart(p.id)}
                disabled={addingId === p.id}
              >
                {addingId === p.id ? "Adding..." : "Add To Cart"}
              </button>
            </div>
          ))}
        </div>
      )}

      {!loading && !error && products.length === 0 && (
        <p className="text-gray-400">No products available</p>
      )}
    </Layout>
  );
};

export default HawkerProductsPage;
