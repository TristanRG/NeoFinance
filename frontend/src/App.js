import React, { useContext, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';
import axios from './api/axios';

import Navbar           from './components/Navbar';
import NeoFinanceLogin  from './pages/Login';
import Register         from './pages/Register';
import Home             from './pages/Home';
import Dashboard        from './pages/Dashboard';
import Transactions     from './pages/Transactions';
import Assistant        from './pages/Assistant';
import Reports          from './pages/Reports';
import Admin            from './pages/Admin';

import { AuthContext }      from './context/AuthContext';
import ProtectedRoute       from './components/ProtectedRoute';
import AdminRoute           from './components/AdminRoute';

function App() {
  const { auth, logout } = useContext(AuthContext);

  useEffect(() => {
    if (auth?.access) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${auth.access}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [auth]);

  return (
    <Router>
      <Navbar onLogout={logout} />

      <Routes>
        {/* Public Home */}
        <Route path="/" element={<Home />} />

        {/* Auth pages */}
        <Route
          path="/login"
          element={auth?.access ? <Navigate to="/" replace /> : <NeoFinanceLogin />}
        />
        <Route
          path="/register"
          element={auth?.access ? <Navigate to="/" replace /> : <Register />}
        />

        {/* Alias for home if needed */}
        <Route path="/home" element={<Home />} />

        {/* Authenticated user routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard"    element={<Dashboard />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/assistant"    element={<Assistant />} />
          <Route path="/reports"      element={<Reports />} />
        </Route>

        {/* Admin‐only routes */}
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<Admin />} />
        </Route>

        {/* Fallback to Home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
