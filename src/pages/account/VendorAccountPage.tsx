import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ListingShareDialog } from "../../components/listing/ListingShareDialog";
import { AdminDashboardBanner } from "../../components/account/AdminDashboardBanner";
import { DashboardQuoteList } from "../../components/account/DashboardQuotes";
import { AppHeader } from "../../components/layout/AppHeader";
import { LandingFooter } from "../../components/landing/LandingFooter";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { isAdminUser } from "../../lib/admins";
import { btnPrimaryFull, btnSecondaryOutline } from "../../lib/buttonStyles";
import { demoIncomingReservations, vendorCanDecide } from "../../lib/eventCalendar";
import { useAuth } from "../../features/auth/AuthContext";
import { listingUrl } from "../../lib/listingContent";
import { fetchProfileNames } from "../../services/messageService";
import {
  fetchReservationsForVendor,
  updateReservationStatus,
} from "../../services/reservationService";
import { fetchVendorProfileByOwner } from "../../services/vendorService";
import type { Reservation, VendorProfileWithProducts } from "../../types/database";
import { vendors } from "../../data/vendors";

export function VendorAccountPage() {
  const { user, profile, loading: authLoading } = useAuth();
  const [params] = useSearchParams();
  const preview = import.meta.env.DEV && params.get("preview") === "1";
  const [vendorProfile, setVendorProfile] = useState<VendorProfileWithProducts | null>(null);
  const [incoming, setIncoming] = useState<Reservation[]>([]);
  const [guestNames, setGuestNames] = useState<Map<string, string | null>>(new Map());
  const [loading, setLoading] = useState(true);
  const [shareOpen, setShareOpen] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const demoVendor = vendors[0];

  useEffect(() => {
    if (!user) {
      setVendorProfile(null);
      setIncoming(preview ? demoIncomingReservations() : []);
      setGuestNames(
        preview
          ? new Map([
              ["guest-a", "Jordan Lee"],
              ["guest-b", "Sam Rivera"],
            ])
          : new Map(),
      );
      setLoading(false);
      return;
    }

    let mounted = true;
    setLoading(true);

    (async () => {
      const result = await fetchVendorProfileByOwner(user.id);
      const rows = result ? await fetchReservationsForVendor(result.id) : [];
      const names = await fetchProfileNames(rows.map((row) => row.guest_id));
      if (!mounted) return;
      setVendorProfile(result);
      setIncoming(rows);
      setGuestNames(names);
    })()
      .catch(() => {
        if (!mounted) return;
        setVendorProfile(null);
        setIncoming([]);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [user, preview]);

  async function setStatus(id: string, status: "confirmed" | "cancelled") {
    if (preview && !user) {
      setIncoming((current) => current.map((row) => (row.id === id ? { ...row, status } : row)));
      return;
    }
    setBusyId(id);
    setError(null);
    try {
      const updated = await updateReservationStatus(id, status);
      setIncoming((current) => current.map((row) => (row.id === updated.id ? updated : row)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update that quote.");
    } finally {
      setBusyId(null);
    }
  }

  const displayTitle = vendorProfile?.title ?? demoVendor.title;
  const displayCity = vendorProfile?.city ?? demoVendor.city;
  const displayAbout = vendorProfile?.about ?? demoVendor.about;
  const publicSlug = vendorProfile?.slug;
  const isOwnProfile = Boolean(vendorProfile);
  const isVendorRole = Boolean(profile?.roles.includes("vendor")) || isAdminUser(user);
  const openRequests = incoming.filter((row) => vendorCanDecide(row.status));
  const confirmedBookings = incoming.filter((row) => row.status === "confirmed");

  return (
    <div className="flex min-h-dvh flex-col bg-surface">
      <AppHeader />

      <main className="mx-auto w-full max-w-[1600px] px-4 py-8 md:px-[60px]">
        <AdminDashboardBanner current="vendor" />
        {!loading && !authLoading && !isOwnProfile && isVendorRole ? (
          <div className="mb-6 rounded-xl border border-primary/20 bg-starlight/40 px-4 py-3 text-body text-sm">
            You have not set up your vendor page yet.{" "}
            <Link to="/account/settings/vendor" className="font-medium text-primary hover:underline">
              Create your vendor profile
            </Link>
            .
          </div>
        ) : null}

        <div className="overflow-hidden rounded-[20px] bg-white shadow-[0_0_6px_rgba(0,0,0,0.12)]">
          {(vendorProfile?.hero_image_url ?? demoVendor.heroImageSrc) ? (
            <img
              src={vendorProfile?.hero_image_url ?? demoVendor.heroImageSrc}
              alt=""
              className="aspect-[16/5] w-full object-cover"
            />
          ) : null}

          <div className="grid gap-8 p-8 lg:grid-cols-[320px_1fr]">
            <aside className="space-y-6">
              <div>
                <h1 className="font-bold text-[length:var(--text-section,28px)] text-midnight">
                  {displayTitle}
                </h1>
                <p className="mt-1 text-body/60 text-base">{displayCity}</p>
                {vendorProfile?.published ? (
                  <div className="mt-2">
                    <StatusBadge label="Published" tone="success" />
                  </div>
                ) : isOwnProfile ? (
                  <div className="mt-2">
                    <StatusBadge label="Draft" tone="neutral" />
                  </div>
                ) : null}
              </div>

              <div className="space-y-3">
                <Link
                  to="/account/settings/vendor"
                  className={`inline-flex w-full items-center justify-center ${btnSecondaryOutline}`}
                >
                  {isOwnProfile ? "Edit vendor profile" : "Set up vendor profile"}
                </Link>
                {publicSlug && vendorProfile?.published ? (
                  <>
                    <Link
                      to={`/vendor/${publicSlug}`}
                      className={`inline-flex items-center justify-center ${btnPrimaryFull}`}
                    >
                      View public profile
                    </Link>
                    <button
                      type="button"
                      onClick={() => setShareOpen(true)}
                      className={`w-full ${btnSecondaryOutline}`}
                    >
                      Share listing QR
                    </button>
                  </>
                ) : (
                  <Link
                    to={`/vendor/${demoVendor.id}`}
                    className={`inline-flex items-center justify-center ${btnPrimaryFull}`}
                  >
                    View demo public profile
                  </Link>
                )}
              </div>
            </aside>

            <div className="space-y-8">
              <section className="rounded-[20px] bg-white p-8 shadow-[0_0_6px_rgba(0,0,0,0.12)]">
                <h2 className="font-bold text-[length:var(--text-section,28px)] text-midnight">
                  About {displayTitle}
                </h2>
                <p className="mt-4 text-body text-lg leading-relaxed">{displayAbout}</p>
              </section>

              {error ? <p className="text-primary text-sm">{error}</p> : null}

              {!loading ? (
                <DashboardQuoteList
                  title="Incoming quotes"
                  reservations={incoming}
                  incoming
                  guestNames={guestNames}
                  empty="No quote requests yet. Share your listing to get booked."
                  onConfirm={(id) => void setStatus(id, "confirmed")}
                  onDecline={(id) => void setStatus(id, "cancelled")}
                  busyId={busyId}
                />
              ) : null}

              {isOwnProfile || preview ? (
                <section className="rounded-[20px] bg-white p-8 shadow-[0_0_6px_rgba(0,0,0,0.12)]">
                  <h2 className="font-bold text-[length:var(--text-section,28px)] text-midnight">
                    Booking snapshot
                  </h2>
                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-lg bg-orange-100 p-3">
                      <p className="font-bold text-body text-sm">Open requests</p>
                      <p className="text-3xl text-midnight">{openRequests.length}</p>
                    </div>
                    <div className="rounded-lg bg-blue-100 p-3">
                      <p className="font-bold text-body text-sm">Confirmed bookings</p>
                      <p className="text-3xl text-midnight">{confirmedBookings.length}</p>
                    </div>
                  </div>
                </section>
              ) : (
                <section className="rounded-[20px] bg-white p-8 shadow-[0_0_6px_rgba(0,0,0,0.12)]">
                  <h2 className="font-bold text-[length:var(--text-section,28px)] text-midnight">
                    Vendor highlights
                  </h2>
                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-lg bg-orange-100 p-3">
                      <p className="font-bold text-body text-sm">Total bookings this year</p>
                      <p className="text-3xl text-midnight">{demoVendor.highlights.bookingsThisYear}</p>
                    </div>
                    <div className="rounded-lg bg-blue-100 p-3">
                      <p className="font-bold text-body text-sm">Local partnerships</p>
                      <p className="text-3xl text-midnight">{demoVendor.highlights.localPartnerships}</p>
                    </div>
                  </div>
                </section>
              )}

              {isOwnProfile && vendorProfile?.products.length ? (
                <section className="rounded-[20px] bg-white p-8 shadow-[0_0_6px_rgba(0,0,0,0.12)]">
                  <h2 className="font-bold text-[length:var(--text-section,28px)] text-midnight">
                    Your packages
                  </h2>
                  <ul className="mt-4 space-y-3">
                    {vendorProfile.products.map((product) => (
                      <li key={product.id} className="rounded-lg border border-border p-4">
                        <p className="font-bold text-midnight">{product.name}</p>
                        {product.description ? (
                          <p className="mt-1 text-body/70 text-sm">{product.description}</p>
                        ) : null}
                        <p className="mt-2 font-bold text-primary">${product.price}</p>
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}

              <nav className="flex flex-wrap gap-4 text-midnight text-sm">
                <Link to="/account/settings/profile" className="hover:text-primary">
                  Edit account settings
                </Link>
                <Link to="/account/settings/vendor" className="hover:text-primary">
                  Vendor profile editor
                </Link>
                <Link to="/account/settings/events" className="hover:text-primary">
                  My events
                </Link>
              </nav>
            </div>
          </div>
        </div>
      </main>

      <LandingFooter />

      {shareOpen && publicSlug ? (
        <ListingShareDialog
          title={displayTitle}
          url={listingUrl({ id: publicSlug, slug: publicSlug })}
          onClose={() => setShareOpen(false)}
        />
      ) : null}
    </div>
  );
}
