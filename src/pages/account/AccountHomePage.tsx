import { AdminAccountPage } from "./AdminAccountPage";
import { PlannerAccountPage } from "./PlannerAccountPage";
import { VendorAccountPage } from "./VendorAccountPage";
import { useAuth } from "../../features/auth/AuthContext";
import { isAdminUser } from "../../lib/admins";
import { hasRole } from "../../lib/roles";

export function AccountHomePage() {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-surface">
        <p className="text-neutral-500 text-sm">Loading account…</p>
      </div>
    );
  }

  if (isAdminUser(user)) {
    return <AdminAccountPage />;
  }

  if (hasRole(profile, "vendor")) {
    return <VendorAccountPage />;
  }

  return <PlannerAccountPage />;
}
