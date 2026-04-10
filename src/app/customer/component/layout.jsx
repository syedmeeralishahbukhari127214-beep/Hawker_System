"use client";
import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react"; // ✅ import signOut
import { FaShoppingCart, FaHome, FaBox, FaMapMarkerAlt, FaComments, FaStar, FaUser, FaSignOutAlt, FaCreditCard } from "react-icons/fa";

const Layout = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();

  const links = [
    { href: "/customer", label: "Dashboard", icon: <FaHome /> },
    { href: "/customer/products", label: "Products", icon: <FaBox /> },
    { href: "/customer/hawkers", label: "Nearby Hawkers", icon: <FaMapMarkerAlt /> },
    { href: "/customer/chat", label: "Chat", icon: <FaComments /> },
    { href: "/customer/feedback", label: "Feedback", icon: <FaStar /> },
    { href: "/customer/profile", label: "Profile", icon: <FaUser /> },
    { href: "/customer/cart", label: "Cart", icon: <FaShoppingCart /> },
    { href: "/customer/payment", label: "Payment", icon: <FaCreditCard /> },
  ];

  const handleLogout = async () => {
    await signOut({ redirect: false }); // logs out user
    router.push("/login"); // redirect to login page
  };

  return (
    <div className="flex min-h-screen bg-black text-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 p-6 flex flex-col space-y-6">
        <h2 className="text-2xl font-bold text-pink-500 tracking-wide text-center">
          Customer Panel
        </h2>

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

        <button
          onClick={handleLogout} // ✅ make logout work
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

export default Layout;
