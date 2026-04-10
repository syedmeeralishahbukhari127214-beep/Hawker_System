"use client";

import React, { useEffect, useState } from "react";
import Layout from "../component/layout";
import { FaCreditCard, FaMoneyBillWave, FaCheckCircle } from "react-icons/fa";

const PaymentPage = () => {
  const [cart, setCart] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [isConfirmed, setIsConfirmed] = useState(false); // Customer confirms cart
  const [orderStatus, setOrderStatus] = useState("PENDING"); // PENDING → PAID
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [loading, setLoading] = useState(true);

  // Fetch cart items
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await fetch("/api/customer/cart", { credentials: "include" });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to fetch cart");
        setCart(data);
        const total = data.reduce((acc, item) => acc + Number(item.product.price) * item.quantity, 0);
        setTotalAmount(total);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);

  // Customer confirms order → sends to hawker
  const handleConfirmOrder = async () => {
    if (cart.length === 0) return alert("Your cart is empty!");
    try {
      const res = await fetch("/api/customer/order", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cart }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Order confirmation failed");
      setIsConfirmed(true);
      alert("Order confirmed! Wait for hawker to confirm.");
    } catch (err) {
      alert(err.message);
    }
  };

  // Handle payment (after hawker confirmed)
  const handlePayment = async (e) => {
    e.preventDefault();
    if (!isConfirmed) return alert("Please confirm your order first!");

    try {
      const res = await fetch("/api/customer/payment", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cart, paymentMethod }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Payment failed");

      setOrderStatus("PAID");
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <Layout><p className="text-gray-400 text-center mt-6">Loading...</p></Layout>;

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-pink-500 mb-6 text-center">Payment</h1>

        {orderStatus === "PENDING" && (
          <form onSubmit={handlePayment} className="bg-gray-900 p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-3">
              <span className="text-gray-400 text-lg">Total Amount:</span>
              <span className="text-pink-500 text-2xl font-bold">Rs. {totalAmount}</span>
            </div>

            <label className="block mb-3 text-gray-400 font-semibold">Choose Payment Method:</label>
            <div className="flex flex-col space-y-3 mb-6">
              <label className="flex items-center gap-3 bg-gray-800 p-3 rounded-lg cursor-pointer hover:bg-gray-700 transition">
                <input type="radio" value="card" checked={paymentMethod === "card"} onChange={(e) => setPaymentMethod(e.target.value)} className="accent-pink-600" />
                <FaCreditCard className="text-pink-500" /> <span>Credit / Debit Card</span>
              </label>
              <label className="flex items-center gap-3 bg-gray-800 p-3 rounded-lg cursor-pointer hover:bg-gray-700 transition">
                <input type="radio" value="cash" checked={paymentMethod === "cash"} onChange={(e) => setPaymentMethod(e.target.value)} className="accent-pink-600" />
                <FaMoneyBillWave className="text-green-500" /> <span>Cash on Delivery</span>
              </label>
            </div>

            {paymentMethod === "card" && (
              <div className="space-y-4 mb-6">
                <input type="text" placeholder="Card Number" className="w-full p-2 bg-gray-800 rounded-lg text-gray-300" required />
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" placeholder="Expiry (MM/YY)" className="p-2 bg-gray-800 rounded-lg text-gray-300" required />
                  <input type="text" placeholder="CVV" className="p-2 bg-gray-800 rounded-lg text-gray-300" required />
                </div>
                <input type="text" placeholder="Cardholder Name" className="w-full p-2 bg-gray-800 rounded-lg text-gray-300" required />
              </div>
            )}

            <button type="button" onClick={handleConfirmOrder} className="w-full bg-yellow-600 hover:bg-yellow-700 py-3 rounded-lg font-semibold text-white mb-4 transition">Confirm Order</button>

            <button type="submit" disabled={!isConfirmed} className={`w-full py-3 rounded-lg font-semibold text-white transition ${isConfirmed ? "bg-pink-600 hover:bg-pink-700" : "bg-gray-700 cursor-not-allowed"}`}>Pay Now</button>
          </form>
        )}

        {orderStatus === "PAID" && (
          <div className="text-center bg-gray-900 p-10 rounded-lg shadow-md">
            <FaCheckCircle className="text-green-500 text-5xl mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Payment Successful!</h2>
            <p className="text-gray-400 mb-4">Thank you. Your order is now being prepared.</p>
            <p className="text-pink-400 font-semibold">Transaction ID: #{Math.floor(Math.random() * 1000000)}</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default PaymentPage;
