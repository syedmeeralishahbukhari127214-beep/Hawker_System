"use client";
import React, { useEffect, useState } from "react";
import Layout from "./component/layout";
import { useRouter } from "next/navigation";
import { FaShoppingBag, FaWallet, FaStar, FaCommentDots, FaCartPlus, FaBox, FaBell } from "react-icons/fa";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const Dashboard = () => {
  const router = useRouter();
  const [activeOrders, setActiveOrders] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);
  const [favoriteHawkers, setFavoriteHawkers] = useState(0);
  const [feedbackGiven, setFeedbackGiven] = useState(0);
  const [recentOrders, setRecentOrders] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [monthlySpending, setMonthlySpending] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // 1️⃣ Orders
        const ordersRes = await fetch("/api/customer/orders", { credentials: "include" });
        const ordersData = await ordersRes.json();
        if (!ordersRes.ok) throw new Error(ordersData.error || "Failed to fetch orders");

        const active = ordersData.filter(o => o.status !== "PAID").length;
        const total = ordersData.reduce((acc, o) => acc + (o.status === "PAID" ? o.totalAmount : 0), 0);
        setActiveOrders(active);
        setTotalSpent(total);

        // Recent Orders
        setRecentOrders(ordersData.slice(-5).reverse());

        // Monthly Spending (last 6 months)
        const spendingMap = {};
        ordersData.forEach(o => {
          if (o.status === "PAID") {
            const month = new Date(o.createdAt).toLocaleString("default", { month: "short", year: "numeric" });
            spendingMap[month] = (spendingMap[month] || 0) + o.totalAmount;
          }
        });
        const sortedMonths = Object.keys(spendingMap).sort((a, b) => new Date(a) - new Date(b));
        const chartData = sortedMonths.map(month => ({ month, amount: spendingMap[month] }));
        setMonthlySpending(chartData);

        // Top Purchased Products
        const productCount = {};
        ordersData.forEach(o => {
          o.items.forEach(item => {
            productCount[item.name] = (productCount[item.name] || 0) + item.quantity;
          });
        });
        const topProductsArr = Object.entries(productCount)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([name, qty]) => ({ name, qty }));
        setTopProducts(topProductsArr);

        // Notifications (mock example: last 5 orders)
        setNotifications(ordersData.slice(-5).reverse().map(o => ({
          id: o.id,
          text: `Order ${o.id} is ${o.status}`
        })));

        // 2️⃣ Favorites
        const favRes = await fetch("/api/customer/favorites", { credentials: "include" });
        const favData = await favRes.json();
        setFavoriteHawkers(favData.length);

        // 3️⃣ Feedbacks
        const feedbackRes = await fetch("/api/customer/feedbacks", { credentials: "include" });
        const feedbackData = await feedbackRes.json();
        setFeedbackGiven(feedbackData.length);

        // 4️⃣ Cart
        const cartRes = await fetch("/api/customer/cart", { credentials: "include" });
        const cartData = await cartRes.json();
        setCartCount(cartData.length);

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <Layout><p className="text-gray-400 text-center mt-6">Loading...</p></Layout>;

  return (
    <Layout>
      <div>
        <h1 className="text-3xl font-bold text-pink-500 mb-2">Welcome, Customer!</h1>
        <p className="text-gray-300 mb-6">Here's an overview of your activity:</p>

        {/* Top Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-900 p-6 rounded-lg shadow-md text-center">
            <FaShoppingBag className="text-pink-500 text-2xl mb-2 mx-auto" />
            <h3 className="text-gray-400">Active Orders</h3>
            <p className="text-3xl text-pink-500 font-bold">{activeOrders}</p>
          </div>
          <div className="bg-gray-900 p-6 rounded-lg shadow-md text-center">
            <FaWallet className="text-pink-500 text-2xl mb-2 mx-auto" />
            <h3 className="text-gray-400">Total Spent</h3>
            <p className="text-3xl text-pink-500 font-bold">Rs. {totalSpent}</p>
          </div>
          <div className="bg-gray-900 p-6 rounded-lg shadow-md text-center">
            <FaStar className="text-yellow-400 text-2xl mb-2 mx-auto" />
            <h3 className="text-gray-400">Favorite Hawkers</h3>
            <p className="text-3xl text-pink-500 font-bold">{favoriteHawkers}</p>
          </div>
          <div className="bg-gray-900 p-6 rounded-lg shadow-md text-center">
            <FaCommentDots className="text-green-400 text-2xl mb-2 mx-auto" />
            <h3 className="text-gray-400">Feedback Given</h3>
            <p className="text-3xl text-pink-500 font-bold">{feedbackGiven}</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-4 mb-8">
          <button
            onClick={() => router.push("/customer/cart")}
            className="flex items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white py-2 px-4 rounded-lg transition"
          >
            <FaCartPlus /> View Cart ({cartCount})
          </button>
          <button
            onClick={() => router.push("/customer/products")}
            className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition"
          >
            <FaBox /> Browse Products
          </button>
          <button
            onClick={() => router.push("/customer/payment")}
            className="flex items-center gap-2 bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded-lg transition"
          >
            <FaWallet /> Go to Payment
          </button>
        </div>

        {/* Monthly Spending Chart */}
        <div className="bg-gray-900 p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-semibold text-pink-500 mb-4 flex items-center gap-2">
            <FaWallet /> Monthly Spending
          </h2>
          {monthlySpending.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={monthlySpending}>
                <CartesianGrid stroke="#444" strokeDasharray="3 3" />
                <XAxis dataKey="month" stroke="#aaa" />
                <YAxis stroke="#aaa" />
                <Tooltip />
                <Line type="monotone" dataKey="amount" stroke="#ff69b4" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-400">No spending data available.</p>
          )}
        </div>

        {/* Top Purchased Products */}
        <div className="bg-gray-900 p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-semibold text-pink-500 mb-4">Top Purchased Products</h2>
          {topProducts.length > 0 ? (
            <ul className="space-y-2">
              {topProducts.map(p => (
                <li key={p.name} className="flex justify-between px-4 py-2 bg-gray-800 rounded-lg">
                  <span>{p.name}</span>
                  <span className="font-bold text-pink-500">{p.qty}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400">No products purchased yet.</p>
          )}
        </div>

        {/* Recent Notifications */}
        <div className="bg-gray-900 p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-semibold text-pink-500 mb-4 flex items-center gap-2">
            <FaBell /> Recent Notifications
          </h2>
          {notifications.length > 0 ? (
            <ul className="space-y-2">
              {notifications.map(n => (
                <li key={n.id} className="px-4 py-2 bg-gray-800 rounded-lg text-gray-300">{n.text}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400">No notifications yet.</p>
          )}
        </div>

        {/* Recent Orders */}
        <div>
          <h2 className="text-2xl font-semibold text-pink-500 mb-4">Recent Orders</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-900 rounded-lg shadow-md">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="px-4 py-2 text-left text-gray-400">Order ID</th>
                  <th className="px-4 py-2 text-left text-gray-400">Total</th>
                  <th className="px-4 py-2 text-left text-gray-400">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map(order => (
                  <tr key={order.id} className="hover:bg-gray-800 border-b border-gray-700 cursor-pointer" onClick={() => router.push(`/customer/order/${order.id}`)}>
                    <td className="px-4 py-2">{order.id}</td>
                    <td className="px-4 py-2">Rs. {order.totalAmount}</td>
                    <td className={`px-4 py-2 font-semibold ${
                      order.status === "PAID" ? "text-green-400" :
                      order.status === "CONFIRMED" ? "text-yellow-400" :
                      "text-pink-500"
                    }`}>{order.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </Layout>
  );
};

export default Dashboard;
