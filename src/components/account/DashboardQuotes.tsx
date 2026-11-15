import { Link } from "react-router-dom";
import { StatusBadge } from "../ui/StatusBadge";
import { btnPrimary, btnSecondaryOutline } from "../../lib/buttonStyles";
import {
  canMarkDepositArranged,
  reservationStatusLabel,
  reservationStatusTone,
  vendorCanDecide,
} from "../../lib/eventCalendar";
import { confirmHref, paymentHref } from "../../lib/bookingRoutes";
import { messagesHref } from "../../lib/messageThreads";
import { formatMoney, formatQuoteDate } from "../../lib/quoteSnapshot";
import type { Reservation } from "../../types/database";

export function DashboardQuoteRow({
  reservation,
  title,
  incoming,
  onConfirm,
  onDecline,
  onMarkArranged,
  busy,
}: {
  reservation: Reservation;
  title: string;
  incoming?: boolean;
  onConfirm?: (id: string) => void;
  onDecline?: (id: string) => void;
  onMarkArranged?: (id: string) => void;
  busy?: boolean;
}) {
  const decide = incoming && vendorCanDecide(reservation.status);
  const markArranged = canMarkDepositArranged(reservation.status);

  return (
    <article className="rounded-xl border border-neutral-200 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-midnight">{title}</h3>
          <p className="mt-1 text-neutral-600 text-sm">
            {reservation.event_date ? formatQuoteDate(reservation.event_date) : "Date to be confirmed"}
            {reservation.location ? ` · ${reservation.location}` : ""}
          </p>
          <p className="mt-1 text-neutral-500 text-sm">
            {reservation.package_name ?? "Custom package"}
            {reservation.guest_count != null ? ` · ${reservation.guest_count} guests` : ""}
            {` · ${formatMoney(reservation.total_amount)}`}
          </p>
        </div>
        <StatusBadge
          label={reservationStatusLabel(reservation.status)}
          tone={reservationStatusTone(reservation.status)}
        />
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        {decide ? (
          <>
            <button
              type="button"
              className={btnPrimary}
              disabled={busy}
              onClick={() => onConfirm?.(reservation.id)}
            >
              {busy ? "Saving…" : "Confirm"}
            </button>
            <button
              type="button"
              className={btnSecondaryOutline}
              disabled={busy}
              onClick={() => onDecline?.(reservation.id)}
            >
              Decline
            </button>
          </>
        ) : incoming && markArranged ? (
          <button
            type="button"
            className={btnPrimary}
            disabled={busy}
            onClick={() => onMarkArranged?.(reservation.id)}
          >
            {busy ? "Saving…" : "Mark deposit arranged"}
          </button>
        ) : !incoming && (reservation.status === "confirmed" || reservation.status === "booked") ? (
          <Link to={paymentHref(reservation.id)} className={btnPrimary}>
            {reservation.status === "booked" ? "View booking" : "View deposit"}
          </Link>
        ) : (
          <Link to={confirmHref(reservation.id)} className={btnSecondaryOutline}>
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

export function DashboardQuoteList({
  title,
  reservations,
  incoming,
  guestNames,
  empty,
  onConfirm,
  onDecline,
  onMarkArranged,
  busyId,
}: {
  title: string;
  reservations: Reservation[];
  incoming?: boolean;
  guestNames?: Map<string, string | null>;
  empty: string;
  onConfirm?: (id: string) => void;
  onDecline?: (id: string) => void;
  onMarkArranged?: (id: string) => void;
  busyId?: string | null;
}) {
  return (
    <section className="rounded-[20px] bg-white p-6 shadow-[0_0_6px_rgba(0,0,0,0.12)]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-bold text-midnight text-lg">{title}</h2>
        <Link to="/account/settings/events" className="text-primary text-sm hover:underline">
          Open calendar
        </Link>
      </div>
      {reservations.length === 0 ? (
        <p className="mt-4 text-neutral-600 text-sm">{empty}</p>
      ) : (
        <div className="mt-4 space-y-3">
          {reservations.map((reservation) => (
            <DashboardQuoteRow
              key={reservation.id}
              reservation={reservation}
              incoming={incoming}
              title={
                incoming
                  ? guestNames?.get(reservation.guest_id)?.trim() || "Quote request"
                  : reservation.vendor_title
              }
              onConfirm={onConfirm}
              onDecline={onDecline}
              onMarkArranged={onMarkArranged}
              busy={busyId === reservation.id}
            />
          ))}
        </div>
      )}
    </section>
  );
}
