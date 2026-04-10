"use client";
import React from "react";
import { usePathname } from "next/navigation";
import {
  FaUsers,
  FaBox,
  FaCommentDots,
  FaSignOutAlt,
  FaHome,
} from "react-icons/fa";
import Link from "next/link";

const Layout = ({ children }) => {
  const pathname = usePathname(); // 👈 current URL path

  const links = [
    { href: "/admin", label: "Dashboard", icon: <FaHome /> },
    { href: "/admin/users", label: "Manage Users", icon: <FaUsers /> },
    { href: "/admin/product", label: "Manage Products", icon: <FaBox /> },
    { href: "/admin/feedback", label: "View Feedback", icon: <FaCommentDots /> },
  ];

  return (
    <div className="flex min-h-screen bg-black text-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 p-6 flex flex-col space-y-6">
        <h2 className="text-2xl font-bold text-pink-500 tracking-wide text-center">
          Admin Panel
        </h2>

        {/* Navigation */}
        <nav className="flex-1 mt-4">
          <ul className="space-y-2">
            {links.map(({ href, label, icon }) => {
              const isActive = pathname === href;
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
                      isActive
                        ? "bg-pink-600 text-white font-semibold" // active style
                        : "text-gray-300 hover:bg-gray-800 hover:text-pink-400"
                    }`}
                  >
                    {icon}
                    <span>{label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout Button */}
        <button className="flex items-center justify-center gap-2 bg-pink-600 py-2 rounded-lg font-semibold hover:bg-pink-700 transition-colors">
          <FaSignOutAlt /> Logout
        </button>
      </aside>

      {/* Main content area */}
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
};

export default Layout;
