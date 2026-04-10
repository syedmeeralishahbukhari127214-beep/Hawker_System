"use client";

import React, { useEffect, useState } from "react";
import Layout from "../component/layout";

const ProductDashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/admin/products");
        if (!res.ok) throw new Error("Failed to fetch products");

        const data = await res.json();

        // Ensure products is always an array
        if (Array.isArray(data)) {
          setProducts(data);
        } else if (Array.isArray(data.products)) {
          setProducts(data.products);
        } else {
          setProducts([]);
          console.warn("Invalid API response format", data);
        }
      } catch (err) {
        console.error(err);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <Layout>
      <div className="flex min-h-screen bg-black text-gray-100">
        <main className="flex-1 p-8">
          <h1 className="text-3xl font-bold mb-6 text-pink-500">Manage Products</h1>

          <div className="bg-gray-900 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Products</h2>

            {loading ? (
              <p className="text-gray-400">Loading products...</p>
            ) : error ? (
              <p className="text-red-400">{error}</p>
            ) : products.length === 0 ? (
              <p className="text-gray-400 text-center">No products found</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full table-auto text-gray-200 text-sm">
                  <thead>
                    <tr className="bg-gray-800 uppercase text-gray-300">
                      <th className="py-3 px-6 text-left">#</th>
                      <th className="py-3 px-6 text-left">Product</th>
                      <th className="py-3 px-6 text-left">Description</th>
                      <th className="py-3 px-6 text-left">Price</th>
                      <th className="py-3 px-6 text-left">Hawker</th>
                      <th className="py-3 px-6 text-center">Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {products.map((product, index) => (
                      <tr
                        key={product.id || index}
                        className="border-b border-gray-700 hover:bg-gray-800"
                      >
                        <td className="py-3 px-6">{index + 1}</td>
                        <td className="py-3 px-6">{product.name}</td>
                        <td className="py-3 px-6">{product.description || "-"}</td>
                        <td className="py-3 px-6">{product.price}</td>
                        <td className="py-3 px-6">
                          {product.hawker?.user?.username || "Unknown"}
                        </td>
                        <td className="py-3 px-6 text-center">
                          <div className="flex justify-center gap-3">
                            <button className="text-blue-400 hover:text-blue-300">
                              Edit
                            </button>
                            <button className="text-red-400 hover:text-red-300">
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </Layout>
  );
};

export default ProductDashboard;
