"use client";
import React from "react";
import Layout from "../component/layout";

const HawkersPage = () => {
  const hawkers = [
    { id: 1, name: "Ali Khan", distance: "0.8 km", area: "Model Town" },
    { id: 2, name: "Sara Ahmed", distance: "1.2 km", area: "Iqbal Town" },
  ];

  return (
    <Layout>
      <h1 className="text-3xl font-bold text-pink-500 mb-6">Nearby Hawkers</h1>
      <ul className="space-y-4">
        {hawkers.map((h) => (
          <li key={h.id} className="bg-gray-900 p-5 rounded-lg flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">{h.name}</h3>
              <p className="text-gray-400">{h.area}</p>
            </div>
            <span className="text-pink-400 font-semibold">{h.distance}</span>
          </li>
        ))}
      </ul>
    </Layout>
  );
};

export default HawkersPage;
