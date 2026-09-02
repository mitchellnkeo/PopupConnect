import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../features/auth/AuthContext";
import { isAdminUser } from "../../lib/admins";
import { hasRole } from "../../lib/roles";
import type { AppRole } from "../../types/database";

export function RoleDashboardRoute({
  role,
  children,
}: {
  role: AppRole;
  children: ReactNode;
}) {
  const { loading, user, profile } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-surface">
        <p className="text-neutral-500 text-sm">Loading account…</p>
      </div>
    );
  }

  if (isAdminUser(user) || hasRole(profile, role)) {
    return children;
  }

  return <Navigate to="/account" replace />;
}
