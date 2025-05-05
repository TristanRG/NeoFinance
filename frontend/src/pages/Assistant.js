import React, { useContext, useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { AuthContext } from '../context/AuthContext';
import axios from '../api/axios';
import AssistantInput from '../components/AssistantInput';

export default function Assistant() {
  const { auth } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    setMessages([
      {
        sender: 'bot',
        text: `Hello, **${auth?.username || 'Guest'}**! 👋\n\nHow can I help you today with budgeting, saving, or investing?`
      }
    ]);
  }, [auth]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async ({ text, file }) => {
    if (file) {
      setMessages(ms => [...ms, { sender: 'user', text: `Uploaded: **${file.name}**` }]);
    }
    if (text) {
      setMessages(ms => [...ms, { sender: 'user', text }]);
    }

    setLoading(true);
    try {
      let res;
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        if (text) formData.append('message', text);
        res = await axios.post('/assistant/csv/', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        res = await axios.post('/assistant/', { message: text });
      }
      setMessages(ms => [...ms, { sender: 'bot', text: res.data.response }]);
    } catch (err) {
      console.error('Chatbot error:', err);
      setMessages(ms => [
        ...ms,
        {
          sender: 'bot',
          text: '😞 Oops! Emmanuel is having a hard time responding. Please try again later.'
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
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex items-start gap-3 ${
                msg.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.sender === 'bot' && (
                <div className="w-8 h-8 bg-cyan-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  E
                </div>
              )}
              <div
                className={`max-w-[75%] px-4 py-3 rounded-xl text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-[#2d2d2d] text-white'
                }`}
              >
                <ReactMarkdown>{msg.text}</ReactMarkdown>
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

        {/* Extracted Input + CSV */}
        <AssistantInput onSend={handleSend} loading={loading} />
      </div>
    </div>
  );
}
