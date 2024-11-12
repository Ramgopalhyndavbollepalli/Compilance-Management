// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userId, setUserId] = useState(null);
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    console.log("DEBUG: Checking localStorage for token on initial load.");
    const storedToken = localStorage.getItem('accessToken');
    const storedRole = localStorage.getItem('userRole');
    const storedUserId = localStorage.getItem('userId');

    if (storedToken && storedRole && storedUserId) {
      console.log("DEBUG: Token found in localStorage:", storedToken);
      setAuthState(storedToken, storedRole, storedUserId);
    } else {
      console.warn("WARNING: Token or user info not found in localStorage.");
    }
  }, []);

  const setAuthState = (token, role, id) => {
    if (!token || !role || !id) {
      console.warn("WARNING: setAuthState received invalid arguments. Skipping auth update.");
      return;
    }

    console.log("DEBUG: Setting auth state with token:", token);
    setIsAuthenticated(true);
    setUserRole(role);
    setUserId(id);
    setAccessToken(token);

    // Save to localStorage for persistence
    localStorage.setItem('accessToken', token);
    localStorage.setItem('userRole', role);
    localStorage.setItem('userId', id);
    console.log("DEBUG: Token and user information saved to localStorage.");
  };

  const login = (role, id, token) => {
    console.log("DEBUG: Login called with token:", token, "role:", role, "userId:", id);
    setAuthState(token, role, id);
  };

  const logout = () => {
    console.log("DEBUG: Logging out, clearing auth state.");
    setIsAuthenticated(false);
    setUserRole(null);
    setUserId(null);
    setAccessToken(null);

    // Clear from localStorage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userRole, userId, accessToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
