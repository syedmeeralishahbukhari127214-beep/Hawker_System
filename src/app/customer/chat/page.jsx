"use client";
import React, { useState, useEffect, useRef } from "react";
import Layout from "../component/layout";

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [chatId, setChatId] = useState(null);
  const [hawkers, setHawkers] = useState([]);
  const [activeHawkerId, setActiveHawkerId] = useState(null);
  const [activeUsername, setActiveUsername] = useState("");

  const bottomRef = useRef(null);

  // Auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Load hawkers
  useEffect(() => {
    const fetchHawkers = async () => {
      try {
        const res = await fetch("/api/hawker/list", { credentials: "include" });
        const data = await res.json();
        setHawkers(data);
      } catch (err) {
        console.error("Failed to load hawkers", err);
      }
    };
    fetchHawkers();
  }, []);

  // Start chat with a hawker
  const startChat = async (hawkerId) => {
    if (!hawkerId) return;
    try {
      const res = await fetch("/api/customer/chat/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ hawkerId }),
      });
      const data = await res.json();
      if (res.ok) {
        setChatId(data.id);
        setActiveHawkerId(hawkerId);
        setActiveUsername(hawkers.find((h) => h.id === hawkerId)?.user.username);
      }
    } catch (err) {
      console.error("Failed to start chat", err);
    }
  };

  // Load messages when chatId changes
  useEffect(() => {
    if (!chatId) return;
    const fetchMessages = async () => {
      try {
        const res = await fetch(`/api/customer/chat?chatId=${chatId}`, {
          credentials: "include",
        });
        const data = await res.json();
        setMessages(data);
      } catch (err) {
        console.error("Failed to load messages", err);
      }
    };
    fetchMessages();
  }, [chatId]);

  // Open chat from sidebar
  const openChat = (hawker) => {
    startChat(hawker.id);
  };

  // Send message
  const sendMessage = async () => {
    if (!input.trim() || !chatId) return;
    try {
      const res = await fetch("/api/customer/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ chatId, text: input }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessages((prev) => [...prev, data]);
        setInput("");
      }
    } catch (err) {
      console.error("Failed to send message", err);
    }
  };

  return (
    <Layout>
      <h1 className="text-3xl font-bold text-pink-500 mb-6">Chat with Hawkers</h1>

      {/* Main layout */}
      <div className="bg-gray-900 rounded-xl shadow-lg h-[75vh] flex overflow-hidden">

        {/* LEFT - All hawkers as sidebar */}
        <div className="w-1/3 border-r border-gray-800 overflow-y-auto">
          {hawkers.map((h) => (
            <div
              key={h.id}
              onClick={() => openChat(h)}
              className={`flex items-center p-4 gap-3 cursor-pointer hover:bg-gray-800 ${
                activeHawkerId === h.id ? "bg-gray-800" : ""
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-pink-600 flex items-center justify-center text-white font-bold">
                {h.user.username.charAt(0).toUpperCase()}
              </div>
              <div className="flex flex-col truncate">
                <span className="text-white font-semibold truncate">
                  {h.user.username}
                </span>
                <span className="text-gray-400 text-sm truncate">
                  Click to chat
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT - Chat Window */}
        <div className="w-2/3 flex flex-col">
          {chatId ? (
            <>
              <div className="p-4 border-b border-gray-800">
                <h2 className="text-white font-semibold">{activeUsername}</h2>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, idx) => {
                  const isCustomer = msg.senderRole === "customer";
                  return (
                    <div
                      key={idx}
                      className={`flex ${isCustomer ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`px-4 py-2 rounded-2xl max-w-[70%] break-words ${
                          isCustomer
                            ? "bg-pink-600 text-white rounded-br-sm"
                            : "bg-gray-800 text-gray-200 rounded-bl-sm"
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  );
                })}
                <div ref={bottomRef} />
              </div>

              <div className="border-t border-gray-800 p-4 flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 bg-gray-800 rounded-full outline-none text-white"
                />
                
                <button
                  onClick={sendMessage}
                  className="bg-pink-600 hover:bg-pink-700 px-6 py-2 rounded-full text-white"
                >
                  Send
                </button>
                
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              Select a hawker to start chatting
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ChatPage;
  