import { Link } from "react-router-dom";
import { IconCalendar } from "../landing/icons";
import { StatusBadge } from "../ui/StatusBadge";
import { btnSecondaryOutline } from "../../lib/buttonStyles";
import {
  WEEKDAY_SHORT,
  addMonths,
  eventTimes,
  monthCells,
  monthHeading,
  relativeDayLabel,
  reservationIso,
  reservationStatusLabel,
  reservationStatusTone,
  shortMonthDay,
  todayIso,
  upcomingReservations,
  weekDays,
  weekStartIso,
  weekdayHeading,
  type CalendarCell,
} from "../../lib/eventCalendar";
import type { Reservation } from "../../types/database";

type EventsView = "month" | "week" | "list";

function reservationHref(reservation: Reservation, incoming: boolean) {
  if (incoming) return `/vendor/${reservation.vendor_slug}`;
  if (reservation.status === "draft") {
    return `/booking/quote?id=${reservation.id}&vendor=${reservation.vendor_slug}`;
  }
  return `/booking/confirm?id=${reservation.id}`;
}

export function UpcomingEventCards({
  reservations,
  onSelect,
}: {
  reservations: Reservation[];
  onSelect: (iso: string) => void;
}) {
  const upcoming = upcomingReservations(reservations);
  if (upcoming.length === 0) return null;

  return (
    <section>
      <h2 className="font-medium text-midnight text-sm uppercase tracking-wide">Upcoming events</h2>
      <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
        {upcoming.map((reservation) => {
          const iso = reservationIso(reservation);
          if (!iso) return null;
          const badge = shortMonthDay(iso);
          const times = eventTimes(reservation);
          return (
            <button
              key={reservation.id}
              type="button"
              onClick={() => onSelect(iso)}
              className="flex min-w-[260px] flex-1 items-stretch gap-3 rounded-2xl border border-neutral-200 bg-white p-3 text-left shadow-sm transition hover:border-primary/40"
            >
              <span className="flex size-[72px] shrink-0 flex-col items-center justify-center rounded-xl bg-accent text-white">
                <span className="font-medium text-xs uppercase tracking-wide">{badge.month}</span>
                <span className="font-semibold text-2xl leading-none">{badge.day}</span>
              </span>
              <span className="min-w-0 py-0.5">
                <span className="block truncate font-semibold text-midnight text-sm">
                  {reservation.vendor_title}
                </span>
                <span className="mt-1 block text-neutral-600 text-xs leading-relaxed">
                  {weekdayHeading(iso).replace(/^\w+, /, "")} · {times.range}
                </span>
                {reservation.location ? (
                  <span className="mt-0.5 block truncate text-neutral-500 text-xs">
                    at {reservation.location}
                  </span>
                ) : null}
                <span className="mt-1 block text-neutral-400 text-xs">{relativeDayLabel(iso)}</span>
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function MonthGrid({
  year,
  monthIndex,
  selectedIso,
  counts,
  onSelect,
}: {
  year: number;
  monthIndex: number;
  selectedIso: string;
  counts: Map<string, number>;
  onSelect: (iso: string) => void;
}) {
  const cells = monthCells(year, monthIndex);
  const today = todayIso();

  return (
    <div className="min-w-0 flex-1">
      <div className="grid grid-cols-7 gap-1 text-center text-[11px] text-neutral-500">
        {WEEKDAY_SHORT.map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>
      <div className="mt-1 grid grid-cols-7 gap-1">
        {cells.map((cell) => (
          <DayCell
            key={cell.iso}
            cell={cell}
            selected={cell.iso === selectedIso}
            today={cell.iso === today}
            count={counts.get(cell.iso) ?? 0}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  );
}

function DayCell({
  cell,
  selected,
  today,
  count,
  onSelect,
}: {
  cell: CalendarCell;
  selected: boolean;
  today: boolean;
  count: number;
  onSelect: (iso: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(cell.iso)}
      aria-pressed={selected}
      aria-label={
        count
          ? `${weekdayHeading(cell.iso)}, ${count} ${count === 1 ? "event" : "events"}`
          : weekdayHeading(cell.iso)
      }
      className={[
        "relative flex min-h-11 items-start justify-start rounded-lg border px-1.5 py-1 text-left text-sm transition",
        cell.inMonth ? "text-midnight" : "text-neutral-400",
        selected ? "border-accent bg-white" : "border-transparent",
        !selected && today ? "bg-teal-100" : "",
        !selected && !today ? "hover:bg-neutral-50" : "",
      ].join(" ")}
    >
      {cell.day}
      {count > 0 ? (
        <span className="absolute top-0.5 right-0.5 flex size-4 items-center justify-center rounded-sm bg-accent font-medium text-[10px] text-white">
          {count}
        </span>
      ) : null}
    </button>
  );
}

export function EventsMonthBoard({
  year,
  monthIndex,
  selectedIso,
  counts,
  onSelect,
  onShiftMonth,
}: {
  year: number;
  monthIndex: number;
  selectedIso: string;
  counts: Map<string, number>;
  onSelect: (iso: string) => void;
  onShiftMonth: (delta: number) => void;
}) {
  const next = addMonths(year, monthIndex, 1);

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <button
          type="button"
          onClick={() => onShiftMonth(-1)}
          className="rounded-full px-2 py-1 text-midnight text-lg hover:bg-neutral-100"
          aria-label="Previous month"
        >
          ‹
        </button>
        <div className="grid min-w-0 flex-1 grid-cols-1 gap-6 lg:grid-cols-2">
          <p className="text-center font-semibold text-midnight text-sm tracking-wide">
            {monthHeading(year, monthIndex)}
          </p>
          <p className="hidden text-center font-semibold text-midnight text-sm tracking-wide lg:block">
            {monthHeading(next.year, next.monthIndex)}
          </p>
        </div>
        <button
          type="button"
          onClick={() => onShiftMonth(1)}
          className="rounded-full px-2 py-1 text-midnight text-lg hover:bg-neutral-100"
          aria-label="Next month"
        >
          ›
        </button>
      </div>
      <div className="flex flex-col gap-6 lg:flex-row">
        <MonthGrid
          year={year}
          monthIndex={monthIndex}
          selectedIso={selectedIso}
          counts={counts}
          onSelect={onSelect}
        />
        <div className="hidden min-w-0 flex-1 lg:block">
          <MonthGrid
            year={next.year}
            monthIndex={next.monthIndex}
            selectedIso={selectedIso}
            counts={counts}
            onSelect={onSelect}
          />
        </div>
      </div>
    </div>
  );
}

export function EventsWeekBoard({
  selectedIso,
  byDay,
  onSelect,
  onShiftWeek,
}: {
  selectedIso: string;
  byDay: Map<string, Reservation[]>;
  onSelect: (iso: string) => void;
  onShiftWeek: (delta: number) => void;
}) {
  const start = weekStartIso(selectedIso);
  const days = weekDays(start);
  const end = days[6];
  const today = todayIso();
  const heading = `${shortMonthDay(start).month} ${shortMonthDay(start).day} – ${shortMonthDay(end).month} ${shortMonthDay(end).day}`;

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <button
          type="button"
          onClick={() => onShiftWeek(-7)}
          className="rounded-full px-2 py-1 text-midnight text-lg hover:bg-neutral-100"
          aria-label="Previous week"
        >
          ‹
        </button>
        <p className="font-semibold text-midnight text-sm">{heading}</p>
        <button
          type="button"
          onClick={() => onShiftWeek(7)}
          className="rounded-full px-2 py-1 text-midnight text-lg hover:bg-neutral-100"
          aria-label="Next week"
        >
          ›
        </button>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-7">
        {days.map((iso, index) => {
          const events = byDay.get(iso) ?? [];
          const selected = iso === selectedIso;
          return (
            <button
              key={iso}
              type="button"
              onClick={() => onSelect(iso)}
              className={[
                "min-h-28 rounded-xl border p-2 text-left transition",
                selected ? "border-accent" : "border-neutral-200 hover:border-primary/40",
                iso === today && !selected ? "bg-teal-100" : "bg-white",
              ].join(" ")}
            >
              <span className="block text-[11px] text-neutral-500 uppercase">{WEEKDAY_SHORT[index]}</span>
              <span className="font-semibold text-midnight text-sm">{shortMonthDay(iso).day}</span>
              <span className="mt-2 flex flex-col gap-1">
                {events.slice(0, 3).map((event) => (
                  <span
                    key={event.id}
                    className="truncate rounded bg-orange-100 px-1.5 py-0.5 text-[11px] text-orange-800"
                  >
                    {event.vendor_title}
                  </span>
                ))}
                {events.length > 3 ? (
                  <span className="text-[11px] text-neutral-500">+{events.length - 3} more</span>
                ) : null}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function EventsDayPanel({
  selectedIso,
  reservations,
  incomingIds,
}: {
  selectedIso: string;
  reservations: Reservation[];
  incomingIds: Set<string>;
}) {
  return (
    <aside className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
      <h2 className="font-semibold text-midnight text-sm">{weekdayHeading(selectedIso)}</h2>
      {reservations.length === 0 ? (
        <p className="mt-3 text-neutral-500 text-sm">No events on this day.</p>
      ) : (
        <ul className="mt-3 space-y-3">
          {reservations.map((reservation) => {
            const times = eventTimes(reservation);
            const incoming = incomingIds.has(reservation.id);
            return (
              <li key={reservation.id}>
                <Link
                  to={reservationHref(reservation, incoming)}
                  className="block rounded-xl border border-transparent p-2 transition hover:border-neutral-200 hover:bg-neutral-50"
                >
                  <p className="flex items-center gap-2 text-midnight text-sm">
                    <IconCalendar className="size-4 text-accent" />
                    {times.range}
                  </p>
                  <p className="mt-1 font-medium text-midnight text-sm">{reservation.vendor_title}</p>
                  {reservation.location ? (
                    <p className="text-neutral-500 text-xs">at {reservation.location}</p>
                  ) : null}
                  <div className="mt-2">
                    <StatusBadge
                      label={reservationStatusLabel(reservation.status)}
                      tone={reservationStatusTone(reservation.status)}
                    />
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </aside>
  );
}

export function EventsListTable({
  reservations,
  incomingIds,
}: {
  reservations: Reservation[];
  incomingIds: Set<string>;
}) {
  if (reservations.length === 0) return null;

  const sorted = [...reservations].sort((a, b) =>
    (reservationIso(a) ?? "9999").localeCompare(reservationIso(b) ?? "9999"),
  );

  return (
    <div className="overflow-x-auto rounded-2xl border border-neutral-200 bg-white shadow-sm">
      <table className="min-w-[720px] w-full text-left text-sm">
        <thead>
          <tr className="border-b border-neutral-200 text-midnight text-xs uppercase tracking-wide">
            <th className="px-4 py-3 font-medium">Date</th>
            <th className="px-4 py-3 font-medium">Start</th>
            <th className="px-4 py-3 font-medium">End</th>
            <th className="px-4 py-3 font-medium">Duration</th>
            <th className="px-4 py-3 font-medium">Guests</th>
            <th className="px-4 py-3 font-medium">Location</th>
            <th className="px-4 py-3 font-medium">Vendor</th>
            <th className="px-4 py-3 font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((reservation) => {
            const iso = reservationIso(reservation);
            const times = eventTimes(reservation);
            const incoming = incomingIds.has(reservation.id);
            return (
              <tr key={reservation.id} className="border-b border-neutral-100 last:border-0">
                <td className="px-4 py-3 whitespace-nowrap text-midnight">
                  {iso ? weekdayHeading(iso).replace(/^\w+, /, "") : "TBC"}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-neutral-700">{times.start}</td>
                <td className="px-4 py-3 whitespace-nowrap text-neutral-700">{times.end}</td>
                <td className="px-4 py-3 whitespace-nowrap text-neutral-700">{times.duration}</td>
                <td className="px-4 py-3 text-neutral-700">{reservation.guest_count ?? "—"}</td>
                <td className="px-4 py-3 text-neutral-700">{reservation.location ?? "—"}</td>
                <td className="px-4 py-3">
                  <Link
                    to={reservationHref(reservation, incoming)}
                    className="font-medium text-primary hover:underline"
                  >
                    {reservation.vendor_title}
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <StatusBadge
                    label={reservationStatusLabel(reservation.status)}
                    tone={reservationStatusTone(reservation.status)}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export function EventsExportButton({
  disabled,
  onClick,
}: {
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button type="button" className={btnSecondaryOutline} disabled={disabled} onClick={onClick}>
      Export CSV
    </button>
  );
}

export type { EventsView };
