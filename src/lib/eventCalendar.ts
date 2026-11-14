import type { Reservation, ReservationStatus } from "../types/database";
import {
  formatDurationLabel,
  formatTimeLabel,
  parseDurationTimes,
  toDateInputValue,
} from "./quoteSnapshot";

export type CalendarCell = {
  day: number;
  iso: string;
  inMonth: boolean;
};

export const WEEKDAY_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

export function todayIso() {
  return toDateInputValue(new Date());
}

export function reservationIso(reservation: Reservation) {
  const value = toDateInputValue(reservation.event_date ?? "");
  return value || null;
}

export function monthCells(year: number, monthIndex: number): CalendarCell[] {
  const first = new Date(year, monthIndex, 1);
  const start = new Date(year, monthIndex, 1 - first.getDay());
  const cells: CalendarCell[] = [];
  for (let i = 0; i < 42; i += 1) {
    const date = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i);
    cells.push({
      day: date.getDate(),
      iso: toDateInputValue(date),
      inMonth: date.getMonth() === monthIndex,
    });
  }
  return cells;
}

export function addMonths(year: number, monthIndex: number, delta: number) {
  const date = new Date(year, monthIndex + delta, 1);
  return { year: date.getFullYear(), monthIndex: date.getMonth() };
}

export function shiftIso(iso: string, days: number) {
  const date = new Date(`${iso}T00:00:00`);
  date.setDate(date.getDate() + days);
  return toDateInputValue(date);
}

export function monthHeading(year: number, monthIndex: number) {
  return new Date(year, monthIndex, 1)
    .toLocaleDateString("en-US", { month: "long", year: "numeric" })
    .toUpperCase();
}

export function weekdayHeading(iso: string) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function shortMonthDay(iso: string) {
  const date = new Date(`${iso}T00:00:00`);
  return {
    month: date.toLocaleDateString("en-US", { month: "short" }),
    day: date.getDate(),
  };
}

export function weekStartIso(iso: string) {
  const date = new Date(`${iso}T00:00:00`);
  date.setDate(date.getDate() - date.getDay());
  return toDateInputValue(date);
}

export function weekDays(startIso: string) {
  return Array.from({ length: 7 }, (_, index) => shiftIso(startIso, index));
}

export function groupReservationsByDay(reservations: Reservation[]) {
  const map = new Map<string, Reservation[]>();
  for (const reservation of reservations) {
    const iso = reservationIso(reservation);
    if (!iso) continue;
    const list = map.get(iso) ?? [];
    list.push(reservation);
    map.set(iso, list);
  }
  return map;
}

export function upcomingReservations(
  reservations: Reservation[],
  fromIso = todayIso(),
  limit = 3,
) {
  return reservations
    .filter((row) => {
      const iso = reservationIso(row);
      return Boolean(iso && iso >= fromIso && row.status !== "cancelled");
    })
    .sort((a, b) => (reservationIso(a) ?? "").localeCompare(reservationIso(b) ?? ""))
    .slice(0, limit);
}

export function relativeDayLabel(iso: string, fromIso = todayIso()) {
  const start = new Date(`${fromIso}T00:00:00`);
  const end = new Date(`${iso}T00:00:00`);
  const days = Math.round((end.getTime() - start.getTime()) / 86_400_000);
  if (days === 0) return "Today";
  if (days === 1) return "Tomorrow";
  if (days > 1) return `in ${days} days`;
  if (days === -1) return "Yesterday";
  return `${Math.abs(days)} days ago`;
}

export function eventTimes(reservation: Reservation) {
  const { startTime, endTime } = parseDurationTimes(reservation.duration);
  const durationMatch = reservation.duration?.match(/\(([^)]+)\)/);
  return {
    start: startTime ? formatTimeLabel(startTime) : "—",
    end: endTime ? formatTimeLabel(endTime) : "—",
    duration: durationMatch?.[1] ?? formatDurationLabel(startTime, endTime),
    range: startTime && endTime ? `${formatTimeLabel(startTime)} – ${formatTimeLabel(endTime)}` : "Time to be confirmed",
  };
}

export function reservationStatusLabel(status: ReservationStatus) {
  if (status === "draft") return "Saved";
  if (status === "submitted") return "Under review";
  if (status === "under_review") return "Under review";
  if (status === "confirmed") return "Confirmed";
  return "Cancelled";
}

export function reservationStatusTone(
  status: ReservationStatus,
): "success" | "neutral" | "warning" | "danger" {
  if (status === "confirmed") return "success";
  if (status === "cancelled") return "danger";
  if (status === "draft") return "neutral";
  return "warning";
}

function csvEscape(value: string) {
  if (/[",\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

export function reservationsToCsv(reservations: Reservation[]) {
  const header = [
    "Date",
    "Start time",
    "End time",
    "Duration",
    "Guests",
    "Location",
    "Vendor",
    "Package",
    "Status",
    "Total",
  ];
  const rows = [...reservations]
    .sort((a, b) => (reservationIso(a) ?? "9999").localeCompare(reservationIso(b) ?? "9999"))
    .map((row) => {
      const times = eventTimes(row);
      return [
        reservationIso(row) ?? "",
        times.start,
        times.end,
        times.duration,
        row.guest_count != null ? String(row.guest_count) : "",
        row.location ?? "",
        row.vendor_title,
        row.package_name ?? "",
        reservationStatusLabel(row.status),
        String(row.total_amount),
      ].map(csvEscape);
    });
  return [header.join(","), ...rows.map((row) => row.join(","))].join("\n");
}

export function downloadCsv(filename: string, csv: string) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export function demoReservations(): Reservation[] {
  const now = new Date().toISOString();
  const day = (offset: number) => {
    const date = new Date();
    date.setDate(date.getDate() + offset);
    return toDateInputValue(date);
  };

  return [
    {
      id: "demo-1",
      guest_id: "preview",
      vendor_profile_id: null,
      vendor_slug: "aki-matcha",
      vendor_title: "Aki Matcha",
      status: "confirmed",
      event_date: day(0),
      location: "Honolulu",
      duration: "11:00 AM – 8:30 PM (9.5 hours)",
      guest_count: 40,
      package_name: "Ceremony tasting",
      add_ons: null,
      deposit_amount: 200,
      total_amount: 850,
      created_at: now,
      updated_at: now,
    },
    {
      id: "demo-2",
      guest_id: "preview",
      vendor_profile_id: null,
      vendor_slug: "ono-sushi",
      vendor_title: "Ono Sushi",
      status: "submitted",
      event_date: day(6),
      location: "Kakaako",
      duration: "4:00 PM – 8:00 PM (4 hours)",
      guest_count: 28,
      package_name: "Omakase bar",
      add_ons: null,
      deposit_amount: 300,
      total_amount: 1400,
      created_at: now,
      updated_at: now,
    },
    {
      id: "demo-3",
      guest_id: "preview",
      vendor_profile_id: null,
      vendor_slug: "lei-workshop",
      vendor_title: "Lei Workshop",
      status: "draft",
      event_date: day(10),
      location: "Manoa",
      duration: "10:00 AM – 1:00 PM (3 hours)",
      guest_count: 16,
      package_name: "Private class",
      add_ons: null,
      deposit_amount: 75,
      total_amount: 420,
      created_at: now,
      updated_at: now,
    },
    {
      id: "demo-4",
      guest_id: "preview",
      vendor_profile_id: null,
      vendor_slug: "aki-matcha",
      vendor_title: "Aki Matcha",
      status: "confirmed",
      event_date: day(21),
      location: "Waikiki",
      duration: "9:00 AM – 12:00 PM (3 hours)",
      guest_count: 22,
      package_name: "Market tasting",
      add_ons: null,
      deposit_amount: 150,
      total_amount: 640,
      created_at: now,
      updated_at: now,
    },
  ];
}
