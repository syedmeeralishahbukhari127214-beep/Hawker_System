"use client";

import React, { useState, useEffect, useRef } from "react";
import { FaComments, FaPaperPlane } from "react-icons/fa";
import Layout from "../../hawker/component/layout";

const HawkerChatPage = () => {
  const [chatList, setChatList] = useState([]);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [activeChatId, setActiveChatId] = useState(null);

  const bottomRef = useRef(null);

  // Auto-scroll when messages update
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Load chat list
  useEffect(() => {
    const fetchChatList = async () => {
      try {
        const res = await fetch("/api/hawker/chat/list", { credentials: "include" });
        if (!res.ok) return;
        const data = await res.json();
        setChatList(data || []);
      } catch (err) {
        console.error("Failed to load chat list", err);
      }
    };
    fetchChatList();
  }, []);

  // Load messages when activeChatId changes
  useEffect(() => {
    if (!activeChatId) return;
    const fetchMessages = async () => {
      try {
        const res = await fetch(`/api/hawker/chat?chatId=${activeChatId}`, {
          method: "GET",
          credentials: "include",
        });
        if (!res.ok) return;
        const data = await res.json();
        setMessages(data || []);
      } catch (err) {
        console.error("Failed to load messages", err);
      }
    };
    fetchMessages();
  }, [activeChatId]);

  // Send new message
  const sendMessage = async () => {
    if (!input.trim() || !activeChatId) return;
    try {
      const res = await fetch("/api/hawker/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ chatId: activeChatId, text: input }),
      });
      if (!res.ok) return;
      const data = await res.json();
      setMessages((prev) => [...prev, data]);
      setInput("");
    } catch (err) {
      console.error("Failed to send message", err);
    }
  };

  return (
    <Layout>
      <div className="flex h-[75vh] bg-gray-900 rounded-xl shadow-2xl overflow-hidden">
        {/* Sidebar - Chat list */}
        <div className="w-1/3 border-r border-gray-800 flex flex-col">
          <div className="p-4 border-b border-gray-800 flex items-center gap-3">
            <FaComments className="text-pink-500" />
            <h2 className="text-white font-bold">Customer Chats</h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            {chatList.map((chat) => (
              <div
                key={chat.id}
                onClick={() => setActiveChatId(chat.id)}
                className={`cursor-pointer p-4 hover:bg-gray-800 flex flex-col gap-1 border-b border-gray-700 ${
                  activeChatId === chat.id ? "bg-gray-800" : ""
                }`}
              >
                <span className="font-semibold text-white truncate">
                  {chat.customer?.user?.username || "Unknown Customer"}
                </span>
                {chat.messages?.[0] && (
                  <span className="text-gray-400 text-sm truncate">
                    {chat.messages[0].text}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Active Chat Window */}
        <div className="w-2/3 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-800 bg-gray-800">
            <h2 className="text-white font-semibold">
              {chatList.find((c) => c.id === activeChatId)?.customer?.user?.username || "Select a chat"}
            </h2>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.senderRole === "hawker" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`px-4 py-2 rounded-2xl max-w-[70%] break-words ${
                    msg.senderRole === "hawker"
                      ? "bg-pink-600 text-white rounded-br-sm"
                      : "bg-gray-800 text-gray-200 rounded-bl-sm"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-800 flex gap-2 bg-gray-800">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 rounded-full bg-gray-700 text-white outline-none"
            />
            <button
              onClick={sendMessage}
              className="bg-pink-600 hover:bg-pink-700 px-4 py-2 rounded-full text-white flex items-center justify-center"
            >
              <FaPaperPlane />
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HawkerChatPage;
