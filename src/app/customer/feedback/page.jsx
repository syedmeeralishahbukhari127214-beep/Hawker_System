"use client";
import React, { useState, useEffect } from "react";
import Layout from "../component/layout";

const FeedbackPage = () => {
  const [hawkers, setHawkers] = useState([]);
  const [formData, setFormData] = useState({ hawkerId: "", rating: 5, comment: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/customer/hawkers")
      .then((res) => res.json())
      .then((data) => setHawkers(data))
      .catch((err) => console.error("Error fetching hawkers:", err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/customer/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // ✅ Ab sirf hawkerId, rating aur comment bhej rahe hain
        body: JSON.stringify(formData), 
      });

      const result = await res.json();

      if (res.ok) {
        alert("Feedback Submitted! ✅");
        setFormData({ hawkerId: "", rating: 5, comment: "" });
      } else {
        alert(result.error || "Submission failed ❌");
      }
    } catch (err) {
      alert("Error: Connection failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="p-6 max-w-xl mx-auto">
        <h1 className="text-3xl font-bold text-pink-500 mb-6">Rate a Hawker</h1>
        
        <form onSubmit={handleSubmit} className="bg-gray-900 p-6 rounded-lg shadow-md border border-gray-800">
          <label className="block mb-2 text-gray-400 font-medium">Select Hawker</label>
          <select 
            className="w-full p-3 bg-gray-800 rounded mb-4 text-white border border-gray-700 focus:border-pink-500 outline-none"
            value={formData.hawkerId}
            onChange={(e) => setFormData({...formData, hawkerId: e.target.value})}
            required
          >
            <option value="">-- Choose a Hawker --</option>
            {hawkers.map((h) => (
              <option key={h.id} value={h.id}>{h.user?.username}</option>
            ))}
          </select>

          <label className="block mb-2 text-gray-400 font-medium">Rating (1 to 5)</label>
          <input 
            type="number" min="1" max="5" 
            className="w-full p-3 bg-gray-800 rounded mb-4 text-white border border-gray-700"
            value={formData.rating} 
            onChange={(e) => setFormData({...formData, rating: e.target.value})} 
          />

          <label className="block mb-2 text-gray-400 font-medium">Your Comment</label>
          <textarea 
            className="w-full p-3 bg-gray-800 rounded mb-4 text-white border border-gray-700" 
            rows="4"
            value={formData.comment} 
            onChange={(e) => setFormData({...formData, comment: e.target.value})} 
            required 
          />

          <button 
            disabled={loading}
            className="w-full bg-pink-600 hover:bg-pink-700 py-3 rounded-lg font-bold text-lg transition-all disabled:bg-gray-700"
          >
            {loading ? "Sending..." : "Submit Feedback"}
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default FeedbackPage;