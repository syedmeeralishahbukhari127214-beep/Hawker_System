"use client";

import React from "react";
import { FaMapMarkerAlt, FaLocationArrow } from "react-icons/fa";
import Layout from "../component/layout"; // Hawker layout import

const SetLocationPage = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-pink-500 flex items-center gap-3">
          <FaMapMarkerAlt /> Set Live Location
        </h1>
        <p className="text-gray-400">
          Your location allows customers to find you on the map. Update it when you move to a new spot.
        </p>

        <div className="bg-gray-900 p-8 rounded-xl shadow-2xl">
          {/* Placeholder for a Map component */}
          <div className="w-full h-96 bg-gray-800 rounded-lg flex items-center justify-center text-gray-500 mb-6 border border-gray-700">
            [Placeholder for Google Maps Integration showing current location]
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Current Coordinates (Demo)
              </label>
              <input
                type="text"
                readOnly
                defaultValue="Latitude: 33.6000, Longitude: 73.0000 (Near Sector C)"
                className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-gray-400"
              />
            </div>

            <button
              type="button"
              className="w-full flex items-center justify-center gap-3 bg-yellow-600 hover:bg-yellow-700 py-3 rounded-lg font-semibold transition-colors"
              onClick={() => alert("Location updated successfully! (Demo)")}
            >
              <FaLocationArrow /> Fetch & Update Current Location
            </button>

            <p className="text-sm text-gray-500 pt-2 text-center">
              Note: This requires device location permission and integration with a map API (e.g., Google Maps).
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SetLocationPage;
