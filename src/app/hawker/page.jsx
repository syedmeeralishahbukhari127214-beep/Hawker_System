"use client";
import React, { useEffect, useState } from "react";
import { FaBox, FaComments, FaStar, FaChartLine, FaShoppingBag, FaPlusSquare, FaMapMarkerAlt } from "react-icons/fa";
import Link from "next/link";
import Layout from "../hawker/component/layout";

// Animated number component
const AnimatedNumber = ({ value }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseFloat(value) || 0;
    if (end === 0) return;

    const duration = 1000; // 1s animation
    const increment = end / (duration / 16);

    const counter = setInterval(() => {
      start += increment;
      if (start >= end) {
        start = end;
        clearInterval(counter);
      }
      setCount(Math.floor(start));
    }, 16);

    return () => clearInterval(counter);
  }, [value]);

  return <span>{count}</span>;
};

const StatCard = ({ icon, title, value }) => (
  <div className="text-pink-500 bg-gray-900 rounded-xl p-6 shadow-lg hover:shadow-pink-900/20 transition-transform hover:-translate-y-1">
    <div className="flex items-center justify-between">
      <div className="text-4xl">{icon}</div>
      <div className="text-right">
        <p className="text-sm font-light uppercase opacity-70 text-gray-400">{title}</p>
        <p className="text-3xl font-bold mt-1">
          <AnimatedNumber value={value} /> {title === "Average Rating" ? "/ 5" : ""}
        </p>
      </div>
    </div>
  </div>
);

const HawkerDashboardPage = () => {
  const [stats, setStats] = useState([
    { id: 1, title: "Today's Orders", value: 12, icon: <FaShoppingBag /> },
    { id: 2, title: "Total Products", value: 45, icon: <FaBox /> },
    { id: 3, title: "New Chats", value: 8, icon: <FaComments /> },
    { id: 4, title: "Average Rating", value: 4.7, icon: <FaStar /> },
  ]);

  const pendingOrders = [
    { id: 'ORD-1005', customer: 'Ahmad S.', product: 'Potatoes (5kg)', price: '₹250' },
    { id: 'ORD-1003', customer: 'Ali R.', product: 'Mixed Vegetables', price: '₹220' },
  ];

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <header>
          <h1 className="text-4xl font-extrabold text-white flex items-center gap-3">
            <FaChartLine className="text-pink-500" />
            Hawker Dashboard
          </h1>
          <p className="text-gray-400 mt-1">Overview of your sales and product inventory.</p>
        </header>

        {/* Animated Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <StatCard key={stat.id} {...stat} />
          ))}
        </div>

        {/* Pending Orders Table */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-gray-900 p-6 rounded-xl shadow-xl">
            <h3 className="text-xl font-semibold mb-4 text-pink-400">Pending Orders</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm font-light">
                <thead className="border-b border-gray-700 font-medium">
                  <tr>
                    <th className="px-4 py-3">Order ID</th>
                    <th className="px-4 py-3">Customer</th>
                    <th className="px-4 py-3">Product Summary</th>
                    <th className="px-4 py-3">Price</th>
                    <th className="px-4 py-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingOrders.map((order) => (
                    <tr key={order.id} className="border-b border-gray-800 hover:bg-gray-800">
                      <td className="px-4 py-3 font-medium">{order.id}</td>
                      <td className="px-4 py-3">{order.customer}</td>
                      <td className="px-4 py-3 text-cyan-400">{order.product}</td>
                      <td className="px-4 py-3">{order.price}</td>
                      <td className="px-4 py-3">
                        <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 text-xs rounded">
                          Confirm
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-gray-500 text-sm">You have {pendingOrders.length} orders awaiting confirmation.</p>
          </div>

          {/* Quick Actions */}
          <div className="lg:col-span-1 bg-gray-900 p-6 rounded-xl shadow-xl space-y-4">
            <h3 className="text-xl font-semibold mb-4 text-pink-400">Quick Actions</h3>
            <Link href="/hawker/add_product" className="w-full flex items-center justify-center gap-3 bg-pink-600 hover:bg-pink-700 py-3 rounded-lg font-semibold transition-colors">
              <FaPlusSquare /> Add New Product
            </Link>
            <Link href="/hawker/chat" className="w-full flex items-center justify-center gap-3 bg-gray-700 hover:bg-gray-600 py-3 rounded-lg font-semibold transition-colors">
              <FaComments /> Check New Messages
            </Link>
            <Link href="/hawker/location" className="w-full flex items-center justify-center gap-3 bg-yellow-600 hover:bg-yellow-700 py-3 rounded-lg font-semibold transition-colors">
              <FaMapMarkerAlt /> Update Live Location
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HawkerDashboardPage;
