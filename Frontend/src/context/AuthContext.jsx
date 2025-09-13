// src/context/AuthContext.jsx
import React, { useState, useContext, createContext } from "react";
import api from "../services/api";

// 1. Create the context
const AuthContext = createContext();

// 2. Create the Provider component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // Initially, no user is logged in
  // const [loading, setLoading] = useState(true); // To handle loading state during auth checks
  // This function will be called from our LoginPage
  const login = (userData) => {
    console.log("user data is set", userData);

    setUser(userData);
    // setLoading(false);
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
      setUser(null);
      // setLoading(true);
      alert("logged out successfully");
    } catch (e) {
      setUser(null);
      console.error("Error during logout:", e);
    }
    // We would also clear tokens from storage here
  };

  const value = {
    user,
    isLoggedIn: !!user, // Double negation turns the user object into a boolean
    // loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// 3. Create a custom hook to easily use the context
export function useAuth() {
  return useContext(AuthContext);
}
