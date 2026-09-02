import { Link } from "react-router-dom";
import { useAuth } from "../../features/auth/AuthContext";
import { hasRole } from "../../lib/roles";

export function VendorRoute({ children }: { children: React.ReactNode }) {
  const { loading, profile } = useAuth();

  if (loading) {
    return (
      <div className="rounded-2xl border border-neutral-200 bg-white p-6 text-neutral-500 text-sm shadow-sm">
        Loading account…
      </div>
    );
  }

  if (!hasRole(profile, "vendor")) {
    return (
      <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
        <h1 className="font-semibold text-2xl text-midnight">Vendor tools</h1>
        <p className="mt-3 text-body text-sm leading-relaxed">
          Add the Creative vendor role on your profile to create and publish a public vendor page.
        </p>
        <Link
          to="/account/settings/profile"
          className="mt-4 inline-block font-medium text-primary hover:underline"
        >
          Go to profile
        </Link>
      </div>
    );
  }

  return children;
}
