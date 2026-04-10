// components/HawkerLayout.jsx
"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  FaBox,
  FaComments,
  FaUser,
  FaSignOutAlt,
  FaChartLine,
  FaPlusSquare,
  FaShoppingBag,
  FaMapMarkerAlt,
} from "react-icons/fa";

const HawkerLayout = ({ children }) => {
  const pathname = usePathname();

  // Hawker sidebar links
  const links = [
    { href: "/hawker", label: "Dashboard", icon: <FaChartLine /> },
    { href: "/hawker/add_product", label: "Add Product", icon: <FaPlusSquare /> },
    { href: "/hawker/product", label: "Manage Products", icon: <FaBox /> },
    { href: "/hawker/order", label: "Orders", icon: <FaShoppingBag /> },
    { href: "/hawker/chat", label: "Chat", icon: <FaComments /> },
    { href: "/hawker/profile", label: "Profile", icon: <FaUser /> },
    { href: "/hawker/location", label: "Set Location", icon: <FaMapMarkerAlt /> },
  ];

  return (
    <div className="flex min-h-screen bg-black text-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 p-6 flex flex-col space-y-6">
        {/* Title */}
        <h2 className="text-2xl font-bold text-pink-500 tracking-wide text-center">
          Hawker Panel
        </h2>

        {/* Navigation Links */}
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
                        ? "bg-pink-600 text-white font-semibold"
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
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center justify-center gap-2 bg-pink-600 py-2 rounded-lg font-semibold hover:bg-pink-700 transition-colors"
        >
          <FaSignOutAlt /> Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 bg-gradient-to-br from-gray-950 to-black">
        {children}
      </main>
    </div>
  );
};

export default HawkerLayout;
