import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { ReactNode } from "react";

export const ProtectedRoute = ({ children, allowedRole }: { children: ReactNode; allowedRole?: "admin" | "student" }) => {
  const { role } = useAuth();
  if (!role) return <Navigate to="/" replace />;
  if (allowedRole && role !== allowedRole) return <Navigate to={role === "admin" ? "/admin" : "/student"} replace />;
  return <>{children}</>;
};
