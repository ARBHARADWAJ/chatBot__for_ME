// src/context/AuthContext.jsx
import React, { useState, useContext, createContext, useEffect } from "react";
import api from "../services/api";


const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // We MUST have a loading state

  useEffect(() => {
    // This function runs only ONCE when the app loads
    const validateUserSession = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const response = await api.post("/auth/validate-token", { token });
        if (response.data.success) {
          setUser(response.data.user);
        }
      } catch (error) {
        localStorage.removeItem("accessToken");
        setUser(null);
      } finally {
        setLoading(false); // Always stop loading after the check
      }
    };
    validateUserSession();
  }, []); // The empty array [] is crucial

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    setUser(null);
  };

  const value = { user, isLoggedIn: !!user, loading, login, logout };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
