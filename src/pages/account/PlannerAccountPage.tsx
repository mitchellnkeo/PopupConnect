import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { AdminDashboardBanner } from "../../components/account/AdminDashboardBanner";
import { DashboardQuoteList } from "../../components/account/DashboardQuotes";
import { AppHeader } from "../../components/layout/AppHeader";
import { LandingFooter } from "../../components/landing/LandingFooter";
import { btnPrimary, btnSecondaryOutline } from "../../lib/buttonStyles";
import { demoReservations, upcomingReservations } from "../../lib/eventCalendar";
import { formatRoleList } from "../../lib/roles";
import { useAuth } from "../../features/auth/AuthContext";
import { fetchReservationsForGuest } from "../../services/reservationService";
import type { Reservation } from "../../types/database";

export function PlannerAccountPage({ previewRole }: { previewRole?: "host" | "organizer" }) {
  const { profile, user } = useAuth();
  const [params] = useSearchParams();
  const preview = import.meta.env.DEV && params.get("preview") === "1";
  const firstName = profile?.display_name?.split(/\s+/)[0] ?? "there";
  const isHost = previewRole ? previewRole === "host" : Boolean(profile?.roles.includes("host"));
  const isOrganizer = previewRole
    ? previewRole === "organizer"
    : Boolean(profile?.roles.includes("organizer"));
  const roleLabel = previewRole
    ? formatRoleList([previewRole])
    : formatRoleList(profile?.roles ?? []);

  const [quotes, setQuotes] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setQuotes(preview ? demoReservations() : []);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    fetchReservationsForGuest(user.id)
      .then((rows) => {
        if (!cancelled) setQuotes(rows);
      })
      .catch(() => {
        if (!cancelled) setQuotes([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [user, preview]);

  const upcoming = useMemo(() => upcomingReservations(quotes, undefined, 5), [quotes]);

  const intro = isOrganizer && isHost
    ? "Plan events from one account. Venue listings will land here next; your quotes are below."
    : isHost
      ? "Space listings are not connected yet. Your quotes and upcoming events still live here."
      : "Saved quotes and upcoming events for the vendors you are booking.";

  return (
    <div className="flex min-h-dvh flex-col bg-surface">
      <AppHeader />

      <main className="mx-auto w-full max-w-3xl flex-1 space-y-6 px-4 py-10 md:px-6">
        <AdminDashboardBanner current={previewRole === "host" ? "host" : "planner"} />
        <div className="rounded-[20px] bg-white p-8 shadow-[0_0_6px_rgba(0,0,0,0.12)]">
          <p className="font-medium text-body/60 text-sm">
            {roleLabel}
          </p>
          <h1 className="mt-2 font-bold text-[length:var(--text-section,28px)] text-midnight">
            Welcome back, {firstName}
          </h1>
          <p className="mt-3 text-body text-base leading-relaxed">{intro}</p>
          {user?.email ? <p className="mt-2 text-neutral-500 text-sm">{user.email}</p> : null}

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

        {loading ? (
          <p className="text-neutral-500 text-sm">Loading quotes…</p>
        ) : (
          <DashboardQuoteList
            title="Upcoming quotes"
            reservations={upcoming}
            empty="No upcoming quotes yet. Find a vendor to save a date."
          />
        )}
      </main>

      <LandingFooter />
    </div>
  );
}
