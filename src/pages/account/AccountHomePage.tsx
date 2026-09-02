import { PlannerAccountPage } from "./PlannerAccountPage";
import { VendorAccountPage } from "./VendorAccountPage";
import { useAuth } from "../../features/auth/AuthContext";
import { hasRole } from "../../lib/roles";

export function AccountHomePage() {
  const { profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-surface">
        <p className="text-neutral-500 text-sm">Loading account…</p>
      </div>
    );
  }

  if (hasRole(profile, "vendor")) {
    return <VendorAccountPage />;
  }

  return <PlannerAccountPage />;
}
