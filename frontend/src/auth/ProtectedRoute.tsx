import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import type { Role } from "../api/types";

export function ProtectedRoute({ children, requireRole }: { children: ReactNode; requireRole?: Role }) {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requireRole && user.role !== requireRole) {
    return (
      <div className="section container" style={{ maxWidth: 560 }}>
        <h1>Нет доступа</h1>
        <p>Этот раздел доступен только роли {requireRole === "ADMIN" ? "администратора" : "родителя"}.</p>
      </div>
    );
  }

  return <>{children}</>;
}
