"use client";

import React, { useEffect, useState } from "react";
import Layout from "./component/layout";
import Link from "next/link";
import { FaUsers, FaBox, FaClipboardList, FaUserClock } from "react-icons/fa";

const AdminDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loadingAction, setLoadingAction] = useState(false);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await fetch("/api/admin/dashboard");
      const data = await res.json();
      setDashboard(data);
    } catch (err) {
      console.error("Failed to fetch dashboard:", err);
    }
  };

  // ✅ Approve / Reject Handler
  const handleApproval = async (id, type, action) => {
    try {
      setLoadingAction(true);
      const res = await fetch("/api/admin/approve-user", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, type, action }),
      });
      const data = await res.json();

      if (data.success) {
        alert(`${type} ${action === "approve" ? "approved" : "rejected"} successfully!`);

        // Remove user from pending lists in UI
        setDashboard((prev) => ({
          ...prev,
          pendingHawkers:
            type === "hawker"
              ? prev.pendingHawkers.filter((h) => h.id !== id)
              : prev.pendingHawkers,
          pendingCustomers:
            type === "customer"
              ? prev.pendingCustomers.filter((c) => c.id !== id)
              : prev.pendingCustomers,
        }));
      } else {
        alert("Action failed!");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong!");
    } finally {
      setLoadingAction(false);
    }
  };

  if (!dashboard) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center text-white">
          Loading...
        </div>
      </Layout>
    );
  }

  const {
    totalHawkers,
    totalCustomers,
    totalProducts,
    pendingApprovals,
    pendingHawkers = [],
    pendingCustomers = [],
  } = dashboard;

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-gray-950 to-black text-gray-100 flex flex-col p-6 md:p-10">
        {/* HEADER */}
        <header className="flex justify-between items-center mb-10 border-b border-gray-800 pb-4">
          <h1 className="text-3xl md:text-4xl font-extrabold text-pink-500 tracking-wide">
            Admin Dashboard
          </h1>
        </header>

        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <SummaryCard title="Total Hawkers" value={totalHawkers} icon={<FaUsers />} color="pink" />
          <SummaryCard title="Total Customers" value={totalCustomers} icon={<FaUsers />} color="pink" />
          <SummaryCard title="Total Products" value={totalProducts} icon={<FaBox />} color="pink" />
          <SummaryCard title="Pending Approvals" value={pendingApprovals} icon={<FaUserClock />} color="red" />
        </div>

        {/* PENDING HAWKER APPROVALS */}
        <PendingTable
          title="Pending Hawker Registrations"
          data={pendingHawkers}
          type="hawker"
          handleApproval={handleApproval}
          loading={loadingAction}
        />

        {/* PENDING CUSTOMER APPROVALS */}
        <PendingTable
          title="Pending Customer Registrations"
          data={pendingCustomers}
          type="customer"
          handleApproval={handleApproval}
          loading={loadingAction}
        />
      </div>
    </Layout>
  );
};

// ✅ Reusable Summary Card
const SummaryCard = ({ title, value, icon, color }) => (
  <div
    className={`bg-gray-900 rounded-xl p-6 shadow-lg hover:shadow-${color}-900/20 transition-transform hover:-translate-y-1`}
  >
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-gray-400 text-sm">{title}</h3>
        <p className={`text-3xl font-bold text-${color}-500 mt-1`}>{value}</p>
      </div>
      <div className={`text-3xl text-${color}-500 opacity-80`}>{icon}</div>
    </div>
  </div>
);

// ✅ Reusable Pending Table
const PendingTable = ({ title, data, type, handleApproval, loading }) => (
  <div className="bg-gray-900 rounded-xl p-6 mb-10 shadow-lg">
    <div className="flex justify-between items-center mb-5">
      <h2 className="text-xl font-semibold flex items-center gap-2 text-pink-400">
        <FaClipboardList className="text-pink-500" /> {title}
      </h2>
    </div>
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="bg-gray-800 text-gray-300 uppercase text-xs tracking-wider">
            <th className="py-3 px-4 text-left">ID</th>
            <th className="py-3 px-4 text-left">Name</th>
            <th className="py-3 px-4 text-left">Email</th>
            <th className="py-3 px-4 text-left">Registration Date</th>
            <th className="py-3 px-4 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id} className="border-b border-gray-800 hover:bg-gray-800/60 transition-colors">
              <td className="py-3 px-4">{item.id}</td>
              <td className="py-3 px-4">{item.username}</td>
              <td className="py-3 px-4">{item.email}</td>
              <td className="py-3 px-4">{new Date(item.createdAt).toLocaleDateString()}</td>
              <td className="py-3 px-4 text-center">
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => handleApproval(item.id, type, "approve")}
                    disabled={loading}
                    className="bg-green-600 hover:bg-green-700 py-1 px-3 rounded text-white text-xs font-semibold transition-all"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleApproval(item.id, type, "reject")}
                    disabled={loading}
                    className="bg-red-600 hover:bg-red-700 py-1 px-3 rounded text-white text-xs font-semibold transition-all"
                  >
                    Reject
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {data.length === 0 && <p className="text-center text-gray-400 py-6">No pending registrations.</p>}
    </div>
  </div>
);

export default AdminDashboard;
