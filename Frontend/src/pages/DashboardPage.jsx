// src/pages/DashboardPage.jsx
import React from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { Navigate } from "react-router-dom";

function DashboardPage() {
  const { user, logout } = useAuth();
  const useNavigate = Navigate();

  const handleLogout = async () => {
    await logout();
    useNavigate("/login");
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">
        Welcome, {user?.fullName || "User"}!
      </h1>
      <p>You have successfully logged in.</p>
      <button
        onClick={handleLogout}
        className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
      >
        Logout
      </button>
    </div>
  );
}

export default DashboardPage;
