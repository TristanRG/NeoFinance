import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Navbar = ({ onLogout }) => {
  const { auth } = useContext(AuthContext);

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-white shadow-md">
      
      {/* Left: Logo */}
      <div className="text-2xl font-bold">
        <span className="text-black">Neo</span>
        <span className="text-[#2ecfe3]">Finance</span>
      </div>

      {/* Middle: Navigation Links */}
      <div className="flex space-x-6 text-gray-800 font-medium">
        <Link to="/home" className="hover:text-[#2ecfe3]">Home</Link>
        <Link to="/dashboard" className="hover:text-[#2ecfe3]">Dashboard</Link>
        <Link to="/transactions" className="hover:text-[#2ecfe3]">Transactions</Link>
        <Link to="/assistant" className="hover:text-[#2ecfe3]">Assistant</Link>
        <Link to="/reports" className="hover:text-[#2ecfe3]">Reports</Link>
      </div>

      {/* Right: Auth Section */}
      <div className="flex items-center space-x-4 text-sm font-medium text-gray-700">
        {auth ? (
          <>
            <span>{auth.username}</span>
            <span className="text-gray-400">|</span>
            <button
              onClick={onLogout}
              className="hover:text-[#2ecfe3] focus:outline-none"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:text-[#2ecfe3]">Login</Link>
            <span className="text-gray-400">|</span>
            <Link to="/register" className="text-gray-800 hover:text-[#2ecfe3]">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
