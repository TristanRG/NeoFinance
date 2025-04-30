import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { logout as performLogout } from "../api/axios";
import ReportsMenu from "./ReportsMenu";

const Navbar = () => {
  const { auth, setAuth } = useContext(AuthContext);

  const handleLogout = () => {
    setAuth(null);
    performLogout();
  };

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

        {/* Reports Dropdown */}
        <div className="relative group">
          <div className="flex items-center justify-center cursor-pointer hover:text-[#2ecfe3]">
          <span>Reports</span>
          <svg className="w-4 h-4 ml-1 fill-current" viewBox="0 0 20 20">
        <path d="M5.25 7.75L10 12.5l4.75-4.75" />
        </svg>
    </div>
  <div className="absolute left-1/2 -translate-x-1/2 top-full hidden group-hover:block bg-white border rounded shadow-lg z-50">
    <ReportsMenu />
  </div>
  </div>
</div>


      {/* Right: Auth Section */}
      <div className="flex items-center space-x-4 text-sm font-medium text-gray-700">
        {auth ? (
          <>
            <span>{auth.username}</span>
            <span className="text-gray-400">|</span>
            <button
              onClick={handleLogout}
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