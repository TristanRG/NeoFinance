import React, { useContext, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import NeoFinanceLogin from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import Transactions from './pages/Transactions';
import Assistant from './pages/Assistant';
import Reports from './pages/Reports';
import axios from 'axios';
import { AuthContext } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const { auth, logout } = useContext(AuthContext);

  useEffect(() => {
    if (auth?.accessToken) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${auth.accessToken}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [auth]);

  return (
    <Router>
      <div className="App">
        <Navbar onLogout={logout} />

        <Routes>
          <Route
            path="/login"
            element={auth ? <Navigate to="/home" /> : <NeoFinanceLogin />}
          />
          <Route
            path="/register"
            element={auth ? <Navigate to="/home" /> : <Register />}
          />

          <Route path="/home" element={<Home />} />

          {/* Protected Routes using the wrapper */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/assistant" element={<Assistant />} />
            <Route path="/reports" element={<Reports />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
