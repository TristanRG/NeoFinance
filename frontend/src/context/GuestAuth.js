import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { AuthContext } from './AuthContext';

export default function GuestAuth() {
  const navigate = useNavigate();
  const { setAuth } = useContext(AuthContext);

  const handleGuest = async () => {
    try {
      const { data } = await axios.post('/users/guest-signup/');
      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);
      setAuth({
        access: data.access,
        refresh: data.refresh,
        username: data.user.username,
        isGuest: true,
      });
      navigate('/dashboard');
    } catch (err) {
      console.error('Guest signup failed:', err);
    }
  };

  return (
    <button
      type="button"
      onClick={handleGuest}
      className="w-full bg-white text-[#1a1a1a] border border-gray-300 py-2 rounded-md hover:bg-[#2ecfe3] transition"
    >
      Continue as guest
    </button>
  );
}
