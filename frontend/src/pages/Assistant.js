import React, { useContext, useState, useEffect, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from '../api/axios';

const Assistant = () => {
  const { auth } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    setMessages([
      {
        sender: "bot",
        text: `Hello, ${auth?.username || "Guest"}! 👋 How can I help you today with budgeting, saving, or investing?`
      }
    ]);
  }, [auth]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { sender: "user", text: userMessage }]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post('/chat/', { message: userMessage });
      const botReply = res.data.response;

      setMessages(prev => [...prev, { sender: "bot", text: botReply }]);
    } catch (err) {
      console.error("Chatbot error:", err);
      setMessages(prev => [
        ...prev,
        {
          sender: "bot",
          text: "Oops! Emmanuel is having a hard time responding. Please try again later."
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
<div className="flex justify-center items-center bg-[#e4e6e7] min-h-[calc(100vh-4rem)] overflow-hidden">
  <div className="w-full max-w-7xl h-[80vh] bg-[#1e1e1e] text-white rounded-2xl shadow-xl flex flex-col">
        
        {/* Chat messages */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 no-scrollbar">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex items-start gap-3 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.sender === "bot" && (
                <div className="w-8 h-8 bg-cyan-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  E
                </div>
              )}
              <div
                className={`max-w-[75%] px-4 py-3 rounded-xl text-sm leading-relaxed ${
                  msg.sender === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-[#2d2d2d] text-white"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex items-start gap-3 justify-start">
              <div className="w-8 h-8 bg-cyan-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                E
              </div>
              <div className="bg-[#2d2d2d] text-gray-300 px-4 py-2 rounded-lg text-sm animate-pulse">
                Emmanuel is typing...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input form */}
        <form
          onSubmit={handleSubmit}
          className="bg-[#1e1e1e] border-t border-gray-700 px-6 py-4 flex items-center gap-4"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Emmanuel about budgeting, saving, investing..."
            className="flex-1 bg-transparent outline-none placeholder-gray-400 text-sm"
          />
          <button
            type="submit"
            className="text-sm px-5 py-2 rounded-md bg-cyan-500 hover:bg-cyan-400 transition disabled:opacity-50 text-white"
            disabled={loading}
          >
            {loading ? "..." : "Send"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Assistant;
