import { Link } from "react-router-dom";
import { AppHeader } from "../../components/layout/AppHeader";
import { LandingFooter } from "../../components/landing/LandingFooter";
import { btnSecondaryOutline } from "../../lib/buttonStyles";
import { useAuth } from "../../features/auth/AuthContext";

const DASHBOARDS = [
  {
    to: "/account/vendor",
    title: "Creative vendor",
    description: "Business dashboard, vendor page setup, and public profile tools.",
  },
  {
    to: "/account/planner",
    title: "Event planner",
    description: "Planner home for saved vendors, quotes, and upcoming events.",
  },
  {
    to: "/account/host",
    title: "Space vendor / host",
    description: "Host home for space listings and incoming booking requests.",
  },
] as const;

export function AdminAccountPage() {
  const { user, profile } = useAuth();
  const firstName = profile?.display_name?.split(/\s+/)[0] ?? "there";

  return (
    <div className="flex min-h-dvh flex-col bg-surface">
      <AppHeader />

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 md:px-6">
        <div className="rounded-[20px] bg-white p-8 shadow-[0_0_6px_rgba(0,0,0,0.12)]">
          <p className="font-medium text-body/60 text-sm">Admin</p>
          <h1 className="mt-2 font-bold text-[length:var(--text-section,28px)] text-midnight">
            Welcome back, {firstName}
          </h1>
          <p className="mt-3 text-body text-base leading-relaxed">
            You can open every role dashboard from this account. Settings and vendor tools are
            unlocked even if this profile only has one role.
          </p>
          <p className="mt-2 text-neutral-500 text-sm">{user?.email}</p>
        </div>

        <ul className="mt-6 grid gap-4">
          {DASHBOARDS.map((dashboard) => (
            <li key={dashboard.to}>
              <Link
                to={dashboard.to}
                className="block rounded-[20px] bg-white p-6 shadow-[0_0_6px_rgba(0,0,0,0.12)] transition hover:shadow-[0_0_10px_rgba(0,0,0,0.16)]"
              >
                <h2 className="font-bold text-midnight text-lg">{dashboard.title}</h2>
                <p className="mt-2 text-body text-sm leading-relaxed">{dashboard.description}</p>
                <p className="mt-3 font-medium text-primary text-sm">Open dashboard →</p>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            to="/account/settings/profile"
            className={`inline-flex items-center justify-center ${btnSecondaryOutline}`}
          >
            Edit profile
          </Link>
          <Link
            to="/account/settings/vendor"
            className={`inline-flex items-center justify-center ${btnSecondaryOutline}`}
          >
            Vendor profile editor
          </Link>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
