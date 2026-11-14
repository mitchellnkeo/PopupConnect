import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { AppHeader } from "../../components/layout/AppHeader";
import { LandingFooter } from "../../components/landing/LandingFooter";
import { useVendorCatalog } from "../../hooks/useVendorCatalog";
import { btnPrimary, btnSecondaryOutline } from "../../lib/buttonStyles";
import { messagesHref } from "../../lib/messageThreads";
import { formatMoney, quoteSnapshotFromVendor, vendorShortName } from "../../lib/quoteSnapshot";
import { fetchReservation } from "../../services/reservationService";
import type { Reservation } from "../../types/database";

const nextSteps = [
  "Vendor reviews your requirements",
  "You receive a finalized quote",
  "Approve and pay deposit",
  "Event details locked in",
];

function snapshotFromReservation(reservation: Reservation) {
  return {
    vendorTitle: reservation.vendor_title,
    eventDate: reservation.event_date ?? "To be confirmed",
    location: reservation.location ?? "To be confirmed",
    duration: reservation.duration ?? "To be confirmed",
    guestCount: reservation.guest_count ?? 0,
    packageName: reservation.package_name ?? "Custom package",
    addOns: reservation.add_ons ?? "None",
    depositAmount: reservation.deposit_amount,
    totalAmount: reservation.total_amount,
  };
}

export function QuoteConfirmationPage() {
  const [searchParams] = useSearchParams();
  const reservationId = searchParams.get("id");
  const vendorId = searchParams.get("vendor") ?? "aki-matcha";
  const { getVendor, loading: vendorLoading } = useVendorCatalog();
  const vendor = getVendor(vendorId);
  const fallback = useMemo(
    () => (vendor ? quoteSnapshotFromVendor(vendor, searchParams) : null),
    [vendor, searchParams],
  );

  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [loadingReservation, setLoadingReservation] = useState(Boolean(reservationId));

  useEffect(() => {
    if (!reservationId) {
      setLoadingReservation(false);
      return;
    }

    let cancelled = false;
    setLoadingReservation(true);

    fetchReservation(reservationId)
      .then((row) => {
        if (!cancelled) setReservation(row);
      })
      .catch(() => {
        if (!cancelled) setReservation(null);
      })
      .finally(() => {
        if (!cancelled) setLoadingReservation(false);
      });

    return () => {
      cancelled = true;
    };
  }, [reservationId]);

  const snapshot = reservation
    ? snapshotFromReservation(reservation)
    : reservationId
      ? null
      : fallback;
  const loading = loadingReservation || (vendorLoading && !snapshot);
  const statusLabel =
    reservation?.status === "draft"
      ? "Saved"
      : reservation?.status === "confirmed"
        ? "Confirmed"
        : "Under review";

  const summaryLeft = snapshot
    ? [
        { label: "Event date", value: snapshot.eventDate },
        { label: "Location", value: snapshot.location },
        { label: "Scheduled time", value: snapshot.duration },
      ]
    : [];
  const summaryRight = snapshot
    ? [
        { label: "Party size", value: `${snapshot.guestCount} people` },
        { label: "Package", value: snapshot.packageName },
        { label: "Add-ons", value: snapshot.addOns },
      ]
    : [];

  const messageName = vendorShortName(snapshot?.vendorTitle ?? vendor?.title ?? "vendor");

  return (
    <div className="flex min-h-dvh flex-col bg-white">
      <AppHeader />

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-12 md:px-6">
        <div className="grid gap-10 lg:grid-cols-[320px_1fr]">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="text-4xl" aria-hidden>
                🥂
              </span>
              <h1 className="font-semibold text-4xl text-midnight">
                {reservation?.status === "draft" ? "Saved!" : "Submitted!"}
              </h1>
            </div>

            <div className="rounded-[20px] bg-orange-100 p-8 text-orange-800">
              <p className="font-bold text-lg">What happens next?</p>
              <ol className="mt-4 space-y-3 text-sm">
                {nextSteps.map((step, index) => (
                  <li key={step} className="flex gap-3">
                    <span>{index + 1}.</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <div className="space-y-8">
            <div className="overflow-hidden rounded-[24px] border border-border bg-white shadow-[0_0_12px_rgba(0,0,0,0.12)]">
              <div className="flex items-center justify-between bg-surface p-8">
                <div>
                  <p className="font-bold text-lg text-primary">Quote summary</p>
                  <p className="font-bold text-[length:var(--text-section,28px)] text-midnight">
                    {loading ? "Loading vendor…" : (snapshot?.vendorTitle ?? "Vendor")}
                  </p>
                </div>
                <span className="rounded bg-[#3174a8] px-2 py-1 font-medium text-sm text-white">
                  {statusLabel}
                </span>
              </div>

              <div className="grid gap-8 px-8 py-6 sm:grid-cols-2">
                <dl className="space-y-5">
                  {summaryLeft.map((row) => (
                    <div key={row.label}>
                      <dt className="font-medium text-body">{row.label}</dt>
                      <dd className="text-body">{row.value}</dd>
                    </div>
                  ))}
                </dl>
                <dl className="space-y-5">
                  {summaryRight.map((row) => (
                    <div key={row.label}>
                      <dt className="font-medium text-body">{row.label}</dt>
                      <dd className="text-body">{row.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              {snapshot ? (
                <div className="flex items-end justify-between border-border border-t px-8 py-6">
                  <div>
                    <p className="font-medium text-body">Deposit required</p>
                    <p className="font-semibold text-[length:var(--text-row-title,22px)] text-body">
                      {formatMoney(snapshot.depositAmount)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-body">Total booking amount</p>
                    <p className="font-bold text-[length:var(--text-section,28px)] text-primary">
                      {formatMoney(snapshot.totalAmount)}
                    </p>
                  </div>
                </div>
              ) : null}
            </div>

            <div className="flex flex-wrap justify-between gap-4">
              <Link
                to={messagesHref({
                  reservationId,
                  vendorSlug: reservation?.vendor_slug ?? vendorId,
                })}
                className={btnSecondaryOutline}
              >
                Message {messageName}
              </Link>
              <div className="flex flex-wrap gap-3">
                {reservationId ? (
                  <Link
                    to={`/booking/quote?id=${reservationId}&vendor=${reservation?.vendor_slug ?? vendorId}`}
                    className={btnSecondaryOutline}
                  >
                    Edit quote
                  </Link>
                ) : null}
                <Link to="/account/settings/events" className={btnPrimary}>
                  View my events
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
