"use client";

import React, { useEffect, useState } from "react";
import Layout from "../component/layout";

const UserPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [loadingAction, setLoadingAction] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/users");
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      setUsers(data.users);
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (id, action) => {
    try {
      setLoadingAction(true);
      const res = await fetch("/api/admin/approve-user", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, type: "user", action }),
      });
      const data = await res.json();

      if (data.success) {
        alert(`User ${action === "approve" ? "approved" : "rejected"} successfully!`);
        setUsers((prev) =>
          prev.map((u) =>
            u.id === id ? { ...u, isApproved: action === "approve" } : u
          )
        );
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

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-gray-950 to-black text-gray-100 p-6 md:p-10">
        <h1 className="text-3xl font-bold text-pink-500 mb-6">All Users</h1>

        {loading && <p className="text-gray-400">Loading users...</p>}
        {error && <p className="text-red-400">{error}</p>}

        {!loading && !error && users.length > 0 && (
          <div className="overflow-x-auto rounded-lg shadow-lg">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-800 text-gray-300 uppercase text-xs tracking-wider">
                  <th className="py-3 px-4">Profile</th>
                  <th className="py-3 px-4">Username</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Phone</th>
                  <th className="py-3 px-4">Address</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Registered At</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-gray-800 hover:bg-gray-800/60 transition-colors"
                  >
                    <td className="py-2 px-4">
                      <img
                        src={user.image || "/default-user.png"}
                        alt={user.username}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    </td>
                    <td className="py-2 px-4">{user.username}</td>
                    <td className="py-2 px-4">{user.email}</td>
                    <td className="py-2 px-4">{user.role}</td>
                    <td className="py-2 px-4">{user.phone || "-"}</td>
                    <td className="py-2 px-4">{user.address || "-"}</td>
                    <td className="py-2 px-4">
                      {user.isApproved ? (
                        <span className="text-green-400 font-semibold">Approved</span>
                      ) : (
                        <span className="text-yellow-400 font-semibold">Pending</span>
                      )}
                    </td>
                    <td className="py-2 px-4">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-2 px-4 text-center">
                      {!user.isApproved && (
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleApproval(user.id, "approve")}
                            disabled={loadingAction}
                            className="bg-green-600 hover:bg-green-700 py-1 px-3 rounded text-white text-xs font-semibold transition-all"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleApproval(user.id, "reject")}
                            disabled={loadingAction}
                            className="bg-red-600 hover:bg-red-700 py-1 px-3 rounded text-white text-xs font-semibold transition-all"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && !error && users.length === 0 && (
          <p className="text-gray-400 mt-6">No users found.</p>
        )}
      </div>
    </Layout>
  );
};

export default UserPage;
