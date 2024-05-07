import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const isAuthenticated = () => {
  const token = sessionStorage.getItem("accessToken");
  try {
    if (token) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
};

const ProtectedRoutes = () => {
  const location = useLocation();
  const isAuth = isAuthenticated();
  return isAuth ? <Outlet /> : <Navigate to="/" state={{ from: location }} />;
};

export default ProtectedRoutes;