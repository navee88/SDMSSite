import React from "react";
import { Navigate } from "react-router-dom";
import { CF_sessionGet } from "../Common/CF_session";

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = CF_sessionGet("isLoggedIn") === "Login Success";

  if (!isAuthenticated) {
    return <Navigate to="/Login" replace />;
  }

  return children;
};

export default ProtectedRoute;
