import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext }      from '../context/AuthContext';

export default function AdminRoute() {
  const { auth } = useContext(AuthContext);

  if (!auth?.access) {
    return <Navigate to="/home" replace />;
  }

  if (!auth.isStaff) {
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
}
