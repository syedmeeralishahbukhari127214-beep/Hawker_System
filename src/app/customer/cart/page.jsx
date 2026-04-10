"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Layout from "../component/layout";

const CartPage = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ Fetch cart from backend (cookie JWT)
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await fetch("/api/customer/cart", {
          method: "GET",
          credentials: "include",
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to fetch cart");

        setCart(data);
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  // ✅ Update Quantity
  const updateQuantity = async (productId, quantity) => {
    try {
      const res = await fetch("/api/customer/cart", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ productId, quantity }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update quantity");

      setCart(data); // backend returns updated cart
    } catch (err) {
      alert(err.message);
    }
  };

  // ✅ Remove Item
  const removeItem = async (productId) => {
    try {
      const res = await fetch("/api/customer/cart", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ productId }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to remove item");

      setCart(data);
    } catch (err) {
      alert(err.message);
    }
  };

  const total = cart.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );
  const router = useRouter();

  return (
    <Layout>
      <div>
        <h1 className="text-3xl font-bold text-pink-500 mb-6">
          🛒 Your Cart
        </h1>

        {loading && <p className="text-gray-400">Loading cart...</p>}
        {error && <p className="text-red-400">{error}</p>}

        {!loading && cart.length === 0 && (
          <p className="text-gray-400">Your cart is empty.</p>
        )}

        {!loading && cart.length > 0 && (
          <div className="space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="bg-gray-900 p-4 rounded-xl flex justify-between items-center"
              >
                <div>
                  <h2 className="font-semibold text-lg">
                    {item.product.name}
                  </h2>
                  <p className="text-gray-400">
                    Rs {item.product.price} × {item.quantity}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() =>
                      updateQuantity(item.product.id, item.quantity - 1)
                    }
                    className="bg-gray-700 px-3 py-1 rounded hover:bg-pink-600"
                  >
                    -
                  </button>

                  <span>{item.quantity}</span>

                  <button
                    onClick={() =>
                      updateQuantity(item.product.id, item.quantity + 1)
                    }
                    className="bg-gray-700 px-3 py-1 rounded hover:bg-pink-600"
                  >
                    +
                  </button>

                  <button
                    onClick={() => removeItem(item.product.id)}
                    className="bg-red-600 px-3 py-1 rounded hover:bg-red-700 ml-4"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}

            {/* Total */}
            <div className="bg-gray-800 p-6 rounded-xl flex justify-between items-center mt-6">
              <h2 className="text-xl font-semibold">
                Total: <span className="text-pink-500">Rs {total}</span>
              </h2>

              <button
  className="bg-pink-600 px-6 py-2 rounded-lg font-semibold hover:bg-pink-700 transition"
  onClick={() => router.push("/customer/payment")}
>
  Checkout
</button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CartPage;
