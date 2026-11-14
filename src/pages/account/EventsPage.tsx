import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  EventsDayPanel,
  EventsExportButton,
  EventsListTable,
  EventsMonthBoard,
  EventsWeekBoard,
  UpcomingEventCards,
  type EventsView,
} from "../../components/account/EventsCalendar";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { Tabs } from "../../components/ui/Tabs";
import { useAuth } from "../../features/auth/AuthContext";
import { btnPrimary, btnSecondaryOutline } from "../../lib/buttonStyles";
import {
  addMonths,
  demoReservations,
  downloadCsv,
  groupReservationsByDay,
  reservationsToCsv,
  reservationStatusLabel,
  reservationStatusTone,
  shiftIso,
  todayIso,
  vendorCanDecide,
} from "../../lib/eventCalendar";
import { messagesHref } from "../../lib/messageThreads";
import { formatMoney, formatQuoteDate } from "../../lib/quoteSnapshot";
import {
  fetchReservationsForGuest,
  fetchReservationsForVendor,
  updateReservationStatus,
} from "../../services/reservationService";
import { fetchVendorProfileByOwner } from "../../services/vendorService";
import type { Reservation } from "../../types/database";

function ReservationCard({
  reservation,
  incoming,
  onSubmitDraft,
  onConfirm,
  onDecline,
  submittingId,
}: {
  reservation: Reservation;
  incoming?: boolean;
  onSubmitDraft?: (id: string) => void;
  onConfirm?: (id: string) => void;
  onDecline?: (id: string) => void;
  submittingId?: string | null;
}) {
  return (
    <article className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-semibold text-lg text-midnight">{reservation.vendor_title}</h2>
          <p className="mt-1 text-neutral-600 text-sm">
            {reservation.event_date ? formatQuoteDate(reservation.event_date) : "Date to be confirmed"}
            {reservation.location ? ` · ${reservation.location}` : ""}
          </p>
        </div>
        <StatusBadge
          label={reservationStatusLabel(reservation.status)}
          tone={reservationStatusTone(reservation.status)}
        />
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

      <div className="mt-4 flex flex-wrap gap-3">
        {incoming && vendorCanDecide(reservation.status) ? (
          <>
            <button
              type="button"
              className={btnPrimary}
              disabled={submittingId === reservation.id}
              onClick={() => onConfirm?.(reservation.id)}
            >
              {submittingId === reservation.id ? "Saving…" : "Confirm"}
            </button>
            <button
              type="button"
              className={btnSecondaryOutline}
              disabled={submittingId === reservation.id}
              onClick={() => onDecline?.(reservation.id)}
            >
              Decline
            </button>
          </>
        ) : !incoming && reservation.status === "draft" ? (
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
        <Link
          to={messagesHref({ reservationId: reservation.id })}
          className="text-primary text-sm hover:underline"
        >
          Message
        </Link>
        {incoming ? null : (
          <Link to={`/vendor/${reservation.vendor_slug}`} className="text-primary text-sm hover:underline">
            Vendor page
          </Link>
        )}
      </div>
    </article>
  );
}

export function EventsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const preview = import.meta.env.DEV && params.get("preview") === "1";
  const [mine, setMine] = useState<Reservation[]>([]);
  const [incoming, setIncoming] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submittingId, setSubmittingId] = useState<string | null>(null);
  const [view, setView] = useState<EventsView>("month");
  const [cursor, setCursor] = useState(() => {
    const date = new Date();
    return { year: date.getFullYear(), monthIndex: date.getMonth() };
  });
  const [selectedIso, setSelectedIso] = useState(todayIso());

  useEffect(() => {
    if (!user) {
      if (preview) {
        setMine(demoReservations());
        setIncoming([]);
        setLoading(false);
        return;
      }
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
  }, [user, preview]);

  const incomingIds = useMemo(() => new Set(incoming.map((row) => row.id)), [incoming]);
  const all = useMemo(() => {
    const seen = new Set<string>();
    return [...mine, ...incoming].filter((row) => {
      if (seen.has(row.id)) return false;
      seen.add(row.id);
      return true;
    });
  }, [mine, incoming]);
  const byDay = useMemo(() => groupReservationsByDay(all), [all]);
  const counts = useMemo(() => {
    const map = new Map<string, number>();
    for (const [iso, rows] of byDay) map.set(iso, rows.length);
    return map;
  }, [byDay]);
  const selectedEvents = byDay.get(selectedIso) ?? [];

  function selectDay(iso: string) {
    setSelectedIso(iso);
    const date = new Date(`${iso}T00:00:00`);
    setCursor({ year: date.getFullYear(), monthIndex: date.getMonth() });
  }

  async function decideIncoming(id: string, status: "confirmed" | "cancelled") {
    if (preview && !user) {
      setIncoming((current) => current.map((row) => (row.id === id ? { ...row, status } : row)));
      return;
    }
    setSubmittingId(id);
    setError(null);
    try {
      const updated = await updateReservationStatus(id, status);
      setIncoming((current) => current.map((row) => (row.id === updated.id ? updated : row)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update this quote.");
    } finally {
      setSubmittingId(null);
    }
  }

  async function submitDraft(id: string) {
    if (preview && !user) return;
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

  function exportCsv() {
    downloadCsv("freqnt-events.csv", reservationsToCsv(all));
  }

  return (
    <div className="space-y-8">
      <div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="font-semibold text-2xl text-midnight">My events</h1>
          <EventsExportButton disabled={all.length === 0} onClick={exportCsv} />
        </div>
        <p className="mt-2 text-neutral-600 text-sm leading-relaxed">
          Quotes land on this calendar as you save them. Export a CSV to share dates offline.
        </p>
      </div>

      {error ? <p className="text-primary text-sm">{error}</p> : null}
      {loading ? <p className="text-neutral-600 text-sm">Loading events…</p> : null}

      {!loading ? (
        <>
          <UpcomingEventCards reservations={all} onSelect={selectDay} />

          <Tabs
            aria-label="Calendar view"
            grow={false}
            tabs={[
              { id: "month", label: "Month" },
              { id: "week", label: "Week" },
              { id: "list", label: "List" },
            ]}
            value={view}
            onChange={(id) => setView(id as EventsView)}
          />

          {view === "month" ? (
            <div className="grid gap-4 lg:grid-cols-[240px_1fr]">
              <div className="order-2 lg:order-1">
                <EventsDayPanel
                  selectedIso={selectedIso}
                  reservations={selectedEvents}
                  incomingIds={incomingIds}
                />
              </div>
              <div className="order-1 lg:order-2 min-w-0">
                <EventsMonthBoard
                  year={cursor.year}
                  monthIndex={cursor.monthIndex}
                  selectedIso={selectedIso}
                  counts={counts}
                  onSelect={selectDay}
                  onShiftMonth={(delta) =>
                    setCursor((current) => addMonths(current.year, current.monthIndex, delta))
                  }
                />
              </div>
            </div>
          ) : null}

          {view === "week" ? (
            <div className="grid gap-4 lg:grid-cols-[240px_1fr]">
              <div className="order-2 lg:order-1">
                <EventsDayPanel
                  selectedIso={selectedIso}
                  reservations={selectedEvents}
                  incomingIds={incomingIds}
                />
              </div>
              <div className="order-1 lg:order-2 min-w-0">
                <EventsWeekBoard
                  selectedIso={selectedIso}
                  byDay={byDay}
                  onSelect={selectDay}
                  onShiftWeek={(delta) => selectDay(shiftIso(selectedIso, delta))}
                />
              </div>
            </div>
          ) : null}

          {view === "list" ? (
            <>
              <EventsListTable reservations={all} incomingIds={incomingIds} />
              {all.length === 0 ? (
                <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
                  <p className="text-midnight text-sm">You have not saved any quotes yet.</p>
                  <Link to="/explore" className={`mt-4 inline-flex ${btnPrimary}`}>
                    Find a vendor
                  </Link>
                </div>
              ) : null}
            </>
          ) : null}

          {view === "list" && mine.length > 0 ? (
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

          {view === "list" && incoming.length > 0 ? (
            <section className="space-y-4">
              <h2 className="font-medium text-midnight text-sm uppercase tracking-wide">
                Incoming requests
              </h2>
              {incoming.map((reservation) => (
                <ReservationCard
                  key={reservation.id}
                  reservation={reservation}
                  incoming
                  submittingId={submittingId}
                  onConfirm={(id) => void decideIncoming(id, "confirmed")}
                  onDecline={(id) => void decideIncoming(id, "cancelled")}
                />
              ))}
            </section>
          ) : null}
        </>
      ) : null}
    </div>
  );
}
