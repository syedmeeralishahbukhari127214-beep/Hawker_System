"use client";
import React, { useState, useEffect } from "react";
import { FaStar, FaUser, FaMotorcycle } from "react-icons/fa";
import Layout from "../component/layout";

const AdminFeedbackPage = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simple fetch bina kisi token ke
    fetch("/api/admin/feedback")
      .then((res) => res.json())
      .then((data) => {
        setFeedbacks(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <Layout><div className="p-10 text-white text-center">Loading Feedbacks...</div></Layout>;

  return (
    <Layout>
      <div className="p-6 bg-black min-h-screen">
        <h1 className="text-3xl font-bold text-pink-500 mb-8">All Customer Feedbacks</h1>

        <div className="overflow-x-auto bg-gray-900 rounded-xl border border-gray-800 shadow-2xl">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-800 text-pink-400 uppercase text-xs">
              <tr>
                <th className="p-4 border-b border-gray-700">Customer</th>
                <th className="p-4 border-b border-gray-700">Hawker Name</th>
                <th className="p-4 border-b border-gray-700">Rating</th>
                <th className="p-4 border-b border-gray-700">Message</th>
                <th className="p-4 border-b border-gray-700">Date</th>
              </tr>
            </thead>
            <tbody className="text-gray-300">
              {feedbacks.map((f) => (
                <tr key={f.id} className="border-b border-gray-800 hover:bg-gray-800/40 transition-colors">
                  <td className="p-4 flex items-center gap-2 font-medium text-white">
                    <FaUser className="text-pink-500 text-sm" /> {f.customer?.user?.username}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <FaMotorcycle className="text-gray-500" /> {f.hawker?.user?.username}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex text-yellow-500 gap-1">
                      {[...Array(f.rating)].map((_, i) => <FaStar key={i} size={12} />)}
                    </div>
                  </td>
                  <td className="p-4 text-sm max-w-xs truncate" title={f.comment}>
                    {f.comment}
                  </td>
                  <td className="p-4 text-xs text-gray-500">
                    {new Date(f.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {feedbacks.length === 0 && (
            <div className="p-10 text-center text-gray-600">Abhi tak koi feedback nahi aaya.</div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default AdminFeedbackPage;