import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { AuthContext } from '../context/AuthContext'; 
import { loginUser } from '../api/auth'; 
import logo from '../assets/login.png';
import { Mail, Lock } from 'lucide-react';

export default function Login({ onLogin }) {
  const { setAuth } = useContext(AuthContext); 
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const data = await loginUser(email, password);
      console.log("Login response:", data);
      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);
      
      setAuth({
        access: data.access,
        refresh: data.refresh,
        username: data.username,
      });      
      
      navigate('/dashboard'); 
    } catch (error) {
      setError('Invalid email or password');
      console.error('Login failed:', error.response?.data);
    }
  };


  return (
    <div className="flex items-center justify-center h-screen font-sans bg-gray-100">
      <div className="flex w-3/5 shadow-xl rounded-2xl overflow-hidden border-2 border-[#2ecfe3]">
        {/* Left Panel */}
        <div className="w-1/2 bg-[#b4d1c3] relative flex items-center justify-center">
          <img src={logo} alt="NeoFinance" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute bg-black bg-opacity-30 inset-0 flex flex-col items-center justify-center text-white p-8">
            <h2 className="text-2xl font-bold mb-2">The future of finance</h2>
            <p className="text-sm text-center max-w-sm">Safely handle your finances online.</p>
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-1/2 bg-white flex items-center justify-center">
          <div className="w-full max-w-md px-8 py-10">
            <h1 className="text-4xl font-bold text-gray-800 text-center mb-2">NeoFinance</h1>
            <p className="text-center text-[#2ecfe3] mb-6">Welcome to NeoFinance</p>

            <form onSubmit={handleLogin} className="space-y-5">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm mb-1 text-gray-600">Email</label>
                <div className="flex items-center border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-[#b4d1c3]">
                  <div className="pl-3 pr-2 border-r border-gray-300 text-gray-400"><Mail size={18} /></div>
                  <input
                    type="email"
                    id="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-3 pr-4 py-2 focus:outline-none rounded-r-md"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm mb-1 text-gray-600">Password</label>
                <div className="flex items-center border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-[#b4d1c3]">
                  <div className="pl-3 pr-2 border-r border-gray-300 text-gray-400"><Lock size={18} /></div>
                  <input
                    type="password"
                    id="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-3 pr-4 py-2 focus:outline-none rounded-r-md"
                  />
                </div>
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <button
                type="submit"
                className="w-full bg-white text-[#1a1a1a] border border-gray-300 py-2 rounded-md hover:bg-[#2ecfe3] transition"
              >
                Sign in
              </button>

              <div className="text-center text-gray-400 text-sm">or</div>

              <button
                type="button"
                className="w-full bg-white text-[#1a1a1a] border border-gray-300 py-2 rounded-md hover:bg-[#2ecfe3] transition"
              >
                Continue as guest
              </button>

              <div className="text-center text-sm mt-4 text-gray-500">
                New to NeoFinance? <a href="/register" className="text-blue-500 hover:underline">Create Account</a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
