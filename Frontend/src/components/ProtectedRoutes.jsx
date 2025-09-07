import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const ProtectedRoutes = () => {
  const { isLoggedIn } = useAuth();
console.log("console.login",isLoggedIn);

  if (!isLoggedIn) {
    return <Navigate to={"/login"} />;
  }

  return <Outlet />;
};

export default ProtectedRoutes;
