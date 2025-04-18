import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from '../api/axios';

const Assistant = () => {
  const { auth } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();

    // Add user message
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
        { sender: "bot", text: "Oops! Emmanuel is having a hard time responding. Please try again later." }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-[#1E1E1E] text-white flex flex-col justify-center items-center relative overflow-hidden pl-[80px]">
      
      {/* Greeting - only shows when no messages */}
      {messages.length === 0 && (
        <h1 className="text-4xl font-medium text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-400 to-pink-500">
          Hello, {auth?.username || "Guest"}
        </h1>
      )}

      {/* Message container */}
      <div className="absolute bottom-52 w-[90%] max-w-2xl h-[55%] overflow-y-auto bg-[#1f1f1f] rounded-xl p-4 flex flex-col gap-3 shadow-inner">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`max-w-[75%] px-4 py-2 rounded-lg text-sm ${
              msg.sender === "user"
                ? "bg-blue-600 self-end text-white"
                : "bg-gray-700 self-start text-gray-200"
            }`}
          >
            {msg.text}
          </div>
        ))}
        {loading && (
          <div className="bg-gray-700 self-start text-gray-200 px-4 py-2 rounded-lg text-sm animate-pulse">
            Emmanuel is typing...
          </div>
        )}
      </div>

      {/* Input form */}
      <form
        onSubmit={handleSubmit}
        className="absolute bottom-10 w-[90%] max-w-2xl bg-[#2A2A2A] rounded-xl px-6 py-4 flex items-center gap-4 shadow-lg"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Emmanuel..."
          className="flex-1 bg-transparent outline-none text-white placeholder-gray-400"
        />
        <button
          type="submit"
          className="text-sm text-white px-4 py-1 rounded-md bg-[#2ecfe3] hover:bg-[#25b3c5] transition disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </form>
    </div>
  );
};

export default Assistant;
