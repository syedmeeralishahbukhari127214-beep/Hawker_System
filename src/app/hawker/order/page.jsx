"use client";

import React, { useEffect, useState } from "react";
import { FaShoppingBag, FaCheckCircle, FaTruck } from "react-icons/fa";
import Layout from "../component/layout";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch hawker orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/hawker/orders", { credentials: "include" });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to fetch orders");
        setOrders(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // Confirm an order
  const confirmOrder = async (orderId) => {
    try {
      const res = await fetch("/api/hawker/order/confirm", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ orderId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to confirm order");

      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: "CONFIRMED" } : o));
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <Layout><p className="text-gray-400">Loading...</p></Layout>;

  return (
    <Layout>
      <h1 className="text-3xl font-bold text-pink-500 flex items-center gap-3"><FaShoppingBag /> Customer Orders</h1>

      <div className="bg-gray-900 p-6 rounded-xl shadow-2xl mt-6 overflow-x-auto">
        <table className="min-w-full text-left text-sm font-light">
          <thead className="border-b border-gray-700 font-medium">
            <tr>
              <th className="px-4 py-3">Order ID</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Products</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id} className="border-b border-gray-800 hover:bg-gray-800">
                <td className="px-4 py-3">{order.id}</td>
                <td className="px-4 py-3">{order.customerId}</td>
                <td className="px-4 py-3">{order.products.map(p => p.product.name).join(", ")}</td>
                <td className="px-4 py-3">Rs {order.totalAmount}</td>
                <td className="px-4 py-3">{order.status}</td>
                <td className="px-4 py-3">
                  {order.status === "PENDING" && (
                    <button onClick={() => confirmOrder(order.id)} className="text-green-500 hover:text-green-400 p-2 rounded-full bg-gray-700" title="Confirm Order">
                      <FaCheckCircle />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};

export default OrdersPage;
