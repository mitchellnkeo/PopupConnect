import { Link } from "react-router-dom";
import { useAuth } from "../../features/auth/AuthContext";
import { isAdminUser } from "../../lib/admins";

const DASHBOARDS = [
  { to: "/account/vendor", label: "Vendor" },
  { to: "/account/planner", label: "Planner" },
  { to: "/account/host", label: "Host" },
] as const;

export function AdminDashboardBanner({ current }: { current: "vendor" | "planner" | "host" }) {
  const { user } = useAuth();

  if (!isAdminUser(user)) return null;

  return (
    <div className="mb-6 flex flex-col gap-3 rounded-xl border border-primary/20 bg-starlight/40 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-body text-sm">
        Admin preview — viewing the{" "}
        <span className="font-medium text-midnight">{current}</span> dashboard.
      </p>
      <nav className="flex flex-wrap gap-x-4 gap-y-1 text-sm" aria-label="Switch dashboard">
        <Link to="/account" className="font-medium text-primary hover:underline">
          All dashboards
        </Link>
        {DASHBOARDS.filter((item) => item.to !== `/account/${current}`).map((item) => (
          <Link key={item.to} to={item.to} className="text-midnight hover:text-primary">
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
