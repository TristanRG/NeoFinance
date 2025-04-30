import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import NewsFeed from '../components/NewsFeed';
import { AuthContext } from '../context/AuthContext'; // make sure the path is correct

export default function HomePage() {
  const features = [
    { label: "Sales", icon: "👥" },
    { label: "Resource Planning", icon: "📊" },
    { label: "Project Management", icon: "🧩" },
    { label: "Budgeting", icon: "💰" },
    { label: "Reporting", icon: "📈" },
    { label: "Time Tracking", icon: "⏱️" },
    { label: "Billing", icon: "🧾" },
    { label: "Collaboration", icon: "🤝" },
  ];

  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();

  const boxVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  const handleGetStarted = () => {
    navigate('/register');
  };

  return (
    <div className="bg-gray-50 min-h-screen p-8">
      <div className="max-w-5xl mx-auto space-y-16">
        {/* Intro Section */}
        <div className="text-center space-y-6">
          <p className="text-sm text-[#2ecfe3] font-semibold uppercase tracking-wider">
            All-in-one Finance Management System
          </p>
          <h1 className="text-5xl font-bold leading-tight">
            We’re <span className="text-[#2ecfe3]">the Tool</span> for Financial Control
          </h1>
          <p className="text-lg text-gray-700 leading-relaxed">
            NeoFinance is your all-in-one solution for smart financial management.
            Choose what matters most to your growth:
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.label}
              className="flex items-center bg-white border border-gray-300 rounded-full px-6 py-3 shadow-sm hover:shadow-md transition-shadow duration-300"
              variants={boxVariants}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <span className="text-2xl mr-3">{feature.icon}</span>
              <span className="font-medium text-base text-gray-800">{feature.label}</span>
            </motion.div>
          ))}
        </div>

        {/* CTA Button – only show if not logged in */}
        {!auth && (
          <div className="text-center">
            <button
              onClick={handleGetStarted}
              className="bg-[#2ecfe3] text-white px-10 py-4 rounded-full font-semibold shadow-md hover:bg-[#26b3c0] transition-colors duration-300"
            >
              Get Started Now
            </button>
          </div>
        )}

        {/* Finance News Showcase */}
        <NewsFeed />
      </div>
    </div>
  );
}
