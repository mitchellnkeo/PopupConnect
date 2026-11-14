import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { useAuth } from "../../features/auth/AuthContext";
import { btnPrimary, btnSecondaryOutline } from "../../lib/buttonStyles";
import { formatMoney } from "../../lib/quoteSnapshot";
import {
  fetchReservationsForGuest,
  fetchReservationsForVendor,
  updateReservationStatus,
} from "../../services/reservationService";
import { fetchVendorProfileByOwner } from "../../services/vendorService";
import type { Reservation, ReservationStatus } from "../../types/database";

function statusTone(status: ReservationStatus): "success" | "neutral" | "warning" | "danger" {
  if (status === "confirmed") return "success";
  if (status === "cancelled") return "danger";
  if (status === "draft") return "neutral";
  return "warning";
}

function statusLabel(status: ReservationStatus) {
  if (status === "draft") return "Saved";
  if (status === "submitted") return "Under review";
  if (status === "under_review") return "Under review";
  if (status === "confirmed") return "Confirmed";
  return "Cancelled";
}

function ReservationCard({
  reservation,
  incoming,
  onSubmitDraft,
  submittingId,
}: {
  reservation: Reservation;
  incoming?: boolean;
  onSubmitDraft?: (id: string) => void;
  submittingId?: string | null;
}) {
  return (
    <article className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-semibold text-lg text-midnight">{reservation.vendor_title}</h2>
          <p className="mt-1 text-neutral-600 text-sm">
            {reservation.event_date ?? "Date to be confirmed"}
            {reservation.location ? ` · ${reservation.location}` : ""}
          </p>
        </div>
        <StatusBadge label={statusLabel(reservation.status)} tone={statusTone(reservation.status)} />
      </div>

      <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-neutral-500">Package</dt>
          <dd className="text-midnight">{reservation.package_name ?? "Custom package"}</dd>
        </div>
        <div>
          <dt className="text-neutral-500">Guests</dt>
          <dd className="text-midnight">
            {reservation.guest_count != null ? `${reservation.guest_count} people` : "—"}
          </dd>
        </div>
        <div>
          <dt className="text-neutral-500">Deposit</dt>
          <dd className="text-midnight">{formatMoney(reservation.deposit_amount)}</dd>
        </div>
        <div>
          <dt className="text-neutral-500">Total</dt>
          <dd className="font-medium text-primary">{formatMoney(reservation.total_amount)}</dd>
        </div>
      </dl>

      {incoming ? null : (
        <div className="mt-4 flex flex-wrap gap-3">
          {reservation.status === "draft" ? (
            <>
              <Link
                to={`/booking/quote?id=${reservation.id}&vendor=${reservation.vendor_slug}`}
                className={btnSecondaryOutline}
              >
                Continue building
              </Link>
              <button
                type="button"
                className={btnPrimary}
                disabled={submittingId === reservation.id}
                onClick={() => onSubmitDraft?.(reservation.id)}
              >
                {submittingId === reservation.id ? "Submitting…" : "Submit quote"}
              </button>
            </>
          ) : (
            <Link to={`/booking/confirm?id=${reservation.id}`} className={btnSecondaryOutline}>
              View quote
            </Link>
          )}
          <Link to={`/vendor/${reservation.vendor_slug}`} className="text-primary text-sm hover:underline">
            Vendor page
          </Link>
        </div>
      )}
    </article>
  );
}

export function EventsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [mine, setMine] = useState<Reservation[]>([]);
  const [incoming, setIncoming] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submittingId, setSubmittingId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setMine([]);
      setIncoming([]);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    (async () => {
      const guestRows = await fetchReservationsForGuest(user.id);
      const vendorProfile = await fetchVendorProfileByOwner(user.id);
      const vendorRows = vendorProfile
        ? await fetchReservationsForVendor(vendorProfile.id)
        : [];
      if (!cancelled) {
        setMine(guestRows);
        setIncoming(vendorRows);
      }
    })()
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Could not load events.");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [user]);

  async function submitDraft(id: string) {
    setSubmittingId(id);
    setError(null);
    try {
      const updated = await updateReservationStatus(id, "submitted");
      setMine((current) => current.map((row) => (row.id === updated.id ? updated : row)));
      navigate(`/booking/confirm?id=${updated.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not submit this quote.");
    } finally {
      setSubmittingId(null);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-semibold text-2xl text-midnight">My events</h1>
        <p className="mt-2 text-neutral-600 text-sm leading-relaxed">
          Saved and submitted quotes live here. Messaging and payments will attach to these events next.
        </p>
      </div>

      {error ? <p className="text-primary text-sm">{error}</p> : null}
      {loading ? <p className="text-neutral-600 text-sm">Loading events…</p> : null}

      {!loading && mine.length === 0 ? (
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <p className="text-midnight text-sm">You have not saved any quotes yet.</p>
          <Link to="/explore" className={`mt-4 inline-flex ${btnPrimary}`}>
            Find a vendor
          </Link>
        </div>
      ) : null}

      {mine.length > 0 ? (
        <section className="space-y-4">
          <h2 className="font-medium text-midnight text-sm uppercase tracking-wide">Your quotes</h2>
          {mine.map((reservation) => (
            <ReservationCard
              key={reservation.id}
              reservation={reservation}
              onSubmitDraft={(id) => void submitDraft(id)}
              submittingId={submittingId}
            />
          ))}
        </section>
      ) : null}

      {incoming.length > 0 ? (
        <section className="space-y-4">
          <h2 className="font-medium text-midnight text-sm uppercase tracking-wide">
            Incoming requests
          </h2>
          {incoming.map((reservation) => (
            <ReservationCard key={reservation.id} reservation={reservation} incoming />
          ))}
        </section>
      ) : null}
    </div>
  );
}
