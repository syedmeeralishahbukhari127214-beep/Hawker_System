"use client";

import React, { useEffect, useState } from "react";
import { FaBox, FaEdit, FaTrash } from "react-icons/fa";
import Layout from "../component/layout";

interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
}

const ManageProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/hawker/products", {
          credentials: "include",
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to fetch products");
        setProducts(data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("Fetch products error:", error.message);
        } else {
          console.error("Fetch products error:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Delete product
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const res = await fetch("/api/hawker/products", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      const data = await res.json().catch(() => ({ error: "Delete failed" }));

      if (!res.ok) throw new Error(data.error || "Delete failed");

      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Delete failed:", error.message);
        alert("Delete failed: " + error.message);
      } else {
        console.error("Delete failed:", error);
        alert("Delete failed");
      }
    }
  };

  // Edit product
  const handleEdit = async (product: Product) => {
    const newName = prompt("Enter new name:", product.name);
    const newDescription = prompt("Enter new description:", product.description);
    const newPrice = prompt("Enter new price:", product.price);

    if (!newName || !newDescription || !newPrice) return;

    const payload = {
      id: product.id,
      name: newName,
      description: newDescription,
      price: newPrice,
    };

    console.log("Sending PUT payload:", payload);

    try {
      const res = await fetch("/api/hawker/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({ error: "Update failed" }));

      if (!res.ok) throw new Error(data.error || "Update failed");

      setProducts((prev) =>
        prev.map((p) => (p.id === data.id ? data : p))
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Update failed:", error.message);
        alert("Update failed: " + error.message);
      } else {
        console.error("Update failed:", error);
        alert("Update failed");
      }
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-pink-500 flex items-center gap-3">
          <FaBox /> Manage Products
        </h1>

        <p className="text-gray-400">
          Update prices, stock, and details of your available products.
        </p>

        <div className="bg-gray-900 p-6 rounded-xl shadow-2xl">
          {loading ? (
            <p className="text-gray-400">Loading products...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm font-light">
                <thead className="border-b border-gray-700 font-medium">
                  <tr>
                    <th className="px-4 py-3">Actions</th>
                    <th className="px-4 py-3">Product Name</th>
                    <th className="px-4 py-3">Description</th>
                    <th className="px-4 py-3">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {products.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center py-6 text-gray-500">
                        No products found
                      </td>
                    </tr>
                  ) : (
                    products.map((product) => (
                      <tr
                        key={product.id}
                        className="border-b border-gray-800 hover:bg-gray-800"
                      >
                        <td className="px-4 py-3 space-x-2">
                          <button
                            onClick={() => handleEdit(product)}
                            className="text-cyan-500 hover:text-cyan-400 p-2 rounded-full bg-gray-700"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="text-red-500 hover:text-red-400 p-2 rounded-full bg-gray-700"
                          >
                            <FaTrash />
                          </button>
                        </td>
                        <td className="px-4 py-3">{product.name}</td>
                        <td className="px-4 py-3">{product.description}</td>
                        <td className="px-4 py-3">{product.price}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ManageProductsPage;
