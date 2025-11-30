import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const ProtectedRoutes =  () => {
  const {
      loading,
    isLoggedIn,
  } = useAuth();
  // console.log("consoele.login", isLoggedIn);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isLoggedIn) {
    return <Navigate to={"/login"} />;
  }

  return <Outlet />;
};

export default ProtectedRoutes;
