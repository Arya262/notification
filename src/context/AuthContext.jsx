import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { API_ENDPOINTS } from "../config/api";
import { useLocation } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation(); // 👈 get current route

  // Check if user is logged in on route change
  useEffect(() => {
    setLoading(true);
    axios
      .get(`${API_ENDPOINTS.AUTH.ME}`, { withCredentials: true })
      .then((response) => {
        const data = response.data;
        if (data.success) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [location.pathname]); // 👈 re-run on every route change

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    axios
      .post(API_ENDPOINTS.AUTH.LOGOUT, {}, { withCredentials: true })
      .then(() => {
        setUser(null);
      });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
