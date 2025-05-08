import React, { createContext, useContext } from 'react';
import { AuthContext } from './AuthContext';

export const AdminContext = createContext({ isAdmin: false });

export const AdminProvider = ({ children }) => {
  const { auth } = useContext(AuthContext);
  const isAdmin = Boolean(auth?.is_staff);

  return (
    <AdminContext.Provider value={{ isAdmin }}>
      {children}
    </AdminContext.Provider>
  );
};