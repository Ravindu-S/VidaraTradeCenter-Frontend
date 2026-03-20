import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const AdminRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <svg className="animate-spin h-8 w-8 text-indigo-600" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check for ADMIN role
  const userRole = user?.role || user?.user?.role;
  const userRoles = user?.roles || user?.user?.roles || [];
  const isAdmin =
    userRole === "ADMIN" ||
    userRole === "ROLE_ADMIN" ||
    userRoles.includes("ADMIN") ||
    userRoles.includes("ROLE_ADMIN");

  console.log("[AdminRoute] user:", JSON.stringify(user));
  console.log("[AdminRoute] isAuthenticated:", isAuthenticated, "isAdmin:", isAdmin, "role:", userRole, "roles:", userRoles);

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;
