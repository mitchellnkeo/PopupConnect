import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ProtectedRoute } from "../../components/auth/ProtectedRoute";
import { AppHeader } from "../../components/layout/AppHeader";
import { LandingFooter } from "../../components/landing/LandingFooter";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { useAuth } from "../../features/auth/AuthContext";
import { btnPrimary, btnSecondaryOutline } from "../../lib/buttonStyles";
import { confirmHref, isBookingPreview } from "../../lib/bookingRoutes";
import {
  canMarkDepositArranged,
  demoReservations,
  reservationStatusLabel,
  reservationStatusTone,
} from "../../lib/eventCalendar";
import { messagesHref, notifyInboxChanged } from "../../lib/messageThreads";
import { formatMoney, formatQuoteDate, vendorShortName } from "../../lib/quoteSnapshot";
import { fetchReservation, updateReservationStatus } from "../../services/reservationService";
import type { Reservation } from "../../types/database";

function copyFor(reservation: Reservation | null) {
  if (!reservation) {
    return {
      heading: "Deposit",
      body: "Open a quote from My events to see the deposit for that booking.",
    };
  }
  if (reservation.status === "booked") {
    return {
      heading: "Deposit arranged",
      body: "This date is booked. Card checkout is still not live — keep these amounts for your records, and message the vendor if plans change.",
    };
  }
  if (reservation.status === "confirmed") {
    return {
      heading: "Deposit due",
      body: "This vendor confirmed your quote. Card checkout is not live yet — message them to arrange the deposit, then mark it arranged so the date shows as booked.",
    };
  }
  if (reservation.status === "cancelled") {
    return {
      heading: "Quote cancelled",
      body: "This quote was declined or cancelled, so no deposit is due.",
    };
  }
  if (reservation.status === "draft") {
    return {
      heading: "Submit this quote first",
      body: "Save and submit the quote. The deposit becomes due after the vendor confirms.",
    };
  }
  return {
    heading: "Waiting on the vendor",
    body: "The vendor is still reviewing this quote. You can arrange the deposit once they confirm.",
  };
}

function PaymentContent() {
  const { user } = useAuth();
  const [params] = useSearchParams();
  const preview = isBookingPreview(params);
  const reservationId = params.get("id");
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [loading, setLoading] = useState(Boolean(reservationId) || preview);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (preview && (!reservationId || reservationId.startsWith("demo-"))) {
      const fromDemo = reservationId
        ? demoReservations().find((row) => row.id === reservationId)
        : demoReservations().find((row) => row.status === "confirmed" || row.status === "booked");
      setReservation(fromDemo ?? demoReservations()[0]);
      setLoading(false);
      setError(null);
      return;
    }
    if (!reservationId) {
      setReservation(null);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchReservation(reservationId)
      .then((row) => {
        if (!cancelled) setReservation(row);
      })
      .catch((err) => {
        if (!cancelled) {
          setReservation(null);
          setError(err instanceof Error ? err.message : "Could not load this quote.");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [reservationId, preview]);

  async function markArranged() {
    if (!reservation || !canMarkDepositArranged(reservation.status)) return;
    setSaving(true);
    setError(null);
    try {
      if (preview && (!user || reservation.id.startsWith("demo-"))) {
        setReservation({ ...reservation, status: "booked" });
        return;
      }
      const updated = await updateReservationStatus(reservation.id, "booked");
      setReservation(updated);
      notifyInboxChanged();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not mark this deposit as arranged.");
    } finally {
      setSaving(false);
    }
  }

  const copy = copyFor(reservation);
  const vendorName = vendorShortName(reservation?.vendor_title ?? "vendor");
  const confirmed = reservation?.status === "confirmed";
  const booked = reservation?.status === "booked";

  return (
    <div className="flex min-h-dvh flex-col bg-white">
      <AppHeader />

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-12 md:px-6">
        <div className="grid gap-10 lg:grid-cols-[320px_1fr]">
          <div className="space-y-6">
            <h1 className="font-semibold text-4xl text-midnight">{copy.heading}</h1>
            <p className="text-body text-base leading-relaxed">{copy.body}</p>
            {reservation ? (
              <p className="text-neutral-500 text-sm">
                {reservation.event_date ? formatQuoteDate(reservation.event_date) : "Date to be confirmed"}
                {reservation.location ? ` · ${reservation.location}` : ""}
              </p>
            ) : null}
          </div>

          <div className="space-y-6">
            {error ? <p className="text-primary text-sm">{error}</p> : null}
            {loading ? <p className="text-neutral-600 text-sm">Loading deposit…</p> : null}

            {!loading && reservation ? (
              <div className="overflow-hidden rounded-[24px] border border-border bg-white shadow-[0_0_12px_rgba(0,0,0,0.12)]">
                <div className="flex items-center justify-between bg-surface p-8">
                  <div>
                    <p className="font-bold text-lg text-primary">Deposit summary</p>
                    <p className="font-bold text-[length:var(--text-section,28px)] text-midnight">
                      {reservation.vendor_title}
                    </p>
                    <p className="mt-1 text-neutral-600 text-sm">
                      {reservation.package_name ?? "Custom package"}
                    </p>
                  </div>
                  <StatusBadge
                    label={reservationStatusLabel(reservation.status)}
                    tone={reservationStatusTone(reservation.status)}
                  />
                </div>
                <div className="space-y-5 px-8 py-6">
                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <p className="font-medium text-body">Deposit required</p>
                      <p className="font-bold text-[length:var(--text-section,28px)] text-primary">
                        {formatMoney(reservation.deposit_amount)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-body">Total booking amount</p>
                      <p className="font-semibold text-[length:var(--text-row-title,22px)] text-body">
                        {formatMoney(reservation.total_amount)}
                      </p>
                    </div>
                  </div>
                  <p className="text-neutral-500 text-sm leading-relaxed">
                    {booked
                      ? "No further deposit is due for this quote."
                      : confirmed
                        ? "Pay this deposit directly with the vendor until in-app checkout ships."
                        : "These amounts are from your quote. They lock in after the vendor confirms."}
                  </p>
                </div>
              </div>
            ) : null}

            {!loading && !reservation && !error ? (
              <div className="rounded-[24px] border border-border bg-white p-8 shadow-sm">
                <p className="text-midnight text-sm">Choose a quote from My events to see its deposit.</p>
                <Link to="/account/settings/events" className={`mt-4 inline-flex ${btnPrimary}`}>
                  View my events
                </Link>
              </div>
            ) : null}

            {reservation ? (
              <div className="flex flex-wrap gap-3">
                {canMarkDepositArranged(reservation.status) ? (
                  <button type="button" className={btnPrimary} disabled={saving} onClick={() => void markArranged()}>
                    {saving ? "Saving…" : "Mark deposit arranged"}
                  </button>
                ) : null}
                <Link
                  to={messagesHref({
                    reservationId: reservation.id,
                    vendorSlug: reservation.vendor_slug,
                  })}
                  className={booked ? btnPrimary : btnSecondaryOutline}
                >
                  Message {vendorName}
                </Link>
                <Link to={confirmHref(reservation.id)} className={btnSecondaryOutline}>
                  View quote
                </Link>
                <Link to="/account/settings/events" className="text-primary text-sm hover:underline">
                  My events
                </Link>
              </div>
            ) : null}
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}

export function PaymentPage() {
  const [params] = useSearchParams();
  const preview = isBookingPreview(params);
  if (preview) return <PaymentContent />;
  return (
    <ProtectedRoute>
      <PaymentContent />
    </ProtectedRoute>
  );
}
