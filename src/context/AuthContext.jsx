import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import axios from "axios";
import { API_ENDPOINTS } from "../config/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch user once when app starts
  useEffect(() => {
    refreshUser();
  }, []);

  // ✅ Fetch user from backend
  const refreshUser = useCallback(() => {
    setLoading(true);
    axios
      .get(API_ENDPOINTS.AUTH.ME, { withCredentials: true })
      .then((response) => {
        const data = response.data;
        if (data.success) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      })
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  // ✅ Login method
  const login = useCallback((userData) => {
    setUser(userData);
  }, []);

  // ✅ Logout method
  const logout = useCallback(() => {
    axios
      .post(API_ENDPOINTS.AUTH.LOGOUT, {}, { withCredentials: true })
      .then(() => {
        setUser(null);
      });
  }, []);

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{ user, login, logout, refreshUser, isAuthenticated, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Custom hook with safety check
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
