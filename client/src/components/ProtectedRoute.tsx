import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import type { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
}

// Redirects unauthenticated users to login
const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
