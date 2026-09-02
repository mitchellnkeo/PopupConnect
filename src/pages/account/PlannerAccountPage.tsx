import { Link } from "react-router-dom";
import { AppHeader } from "../../components/layout/AppHeader";
import { LandingFooter } from "../../components/landing/LandingFooter";
import { btnPrimary, btnSecondaryOutline } from "../../lib/buttonStyles";
import { formatRoleList } from "../../lib/roles";
import { useAuth } from "../../features/auth/AuthContext";

export function PlannerAccountPage() {
  const { profile, user } = useAuth();
  const firstName = profile?.display_name?.split(/\s+/)[0] ?? "there";
  const isHost = profile?.roles.includes("host");
  const isOrganizer = profile?.roles.includes("organizer");

  return (
    <div className="flex min-h-dvh flex-col bg-surface">
      <AppHeader />

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 md:px-6">
        <div className="rounded-[20px] bg-white p-8 shadow-[0_0_6px_rgba(0,0,0,0.12)]">
          <p className="font-medium text-body/60 text-sm">
            {formatRoleList(profile?.roles ?? [])}
          </p>
          <h1 className="mt-2 font-bold text-[length:var(--text-section,28px)] text-midnight">
            Welcome back, {firstName}
          </h1>
          <p className="mt-3 text-body text-base leading-relaxed">
            {isOrganizer && isHost
              ? "Plan events and manage spaces from one account. Bookings and venue tools will land here as those features ship."
              : isHost
                ? "Your space listings and incoming booking requests will live here once venue profiles are connected."
                : "Your saved vendors, quotes, and upcoming events will live here once reservations are connected."}
          </p>
          <p className="mt-2 text-neutral-500 text-sm">{user?.email}</p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to="/explore" className={`inline-flex items-center justify-center ${btnPrimary}`}>
              Explore vendors
            </Link>
            <Link
              to="/account/settings/profile"
              className={`inline-flex items-center justify-center ${btnSecondaryOutline}`}
            >
              Edit profile
            </Link>
            <Link
              to="/account/settings/events"
              className={`inline-flex items-center justify-center ${btnSecondaryOutline}`}
            >
              My events
            </Link>
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
