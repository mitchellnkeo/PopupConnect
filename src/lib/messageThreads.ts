import { demoReservations } from "./eventCalendar";
import type { Reservation, ReservationMessage } from "../types/database";

export function messagesHref(opts?: { reservationId?: string | null; vendorSlug?: string | null }) {
  const params = new URLSearchParams();
  if (opts?.reservationId) params.set("reservation", opts.reservationId);
  else if (opts?.vendorSlug) params.set("vendor", opts.vendorSlug);
  const query = params.toString();
  return query ? `/account/settings/messages?${query}` : "/account/settings/messages";
}

export function relativeMessageTime(iso: string) {
  const delta = Date.now() - new Date(iso).getTime();
  const minutes = Math.round(delta / 60_000);
  if (!Number.isFinite(minutes)) return "";
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function lastMessageByReservation(messages: ReservationMessage[]) {
  const map = new Map<string, ReservationMessage>();
  for (const message of messages) {
    const current = map.get(message.reservation_id);
    if (!current || current.created_at < message.created_at) {
      map.set(message.reservation_id, message);
    }
  }
  return map;
}

export function pickThread(
  reservations: Reservation[],
  reservationId: string | null,
  vendorSlug: string | null,
) {
  if (reservationId) {
    return reservations.find((row) => row.id === reservationId) ?? reservations[0] ?? null;
  }
  if (vendorSlug) {
    return reservations.find((row) => row.vendor_slug === vendorSlug) ?? reservations[0] ?? null;
  }
  return reservations[0] ?? null;
}

export function demoMessages(): ReservationMessage[] {
  const ago = (minutes: number) => new Date(Date.now() - minutes * 60_000).toISOString();
  const [first, second] = demoReservations();
  return [
    {
      id: "msg-1",
      reservation_id: first.id,
      sender_id: "preview",
      body: "Hi — can the ceremony tasting start a little earlier on the 13th?",
      created_at: ago(180),
      sender_name: "You",
    },
    {
      id: "msg-2",
      reservation_id: first.id,
      sender_id: "vendor-aki",
      body: "Yes, we can open at 10:30. I’ll hold the tasting table near the window.",
      created_at: ago(95),
      sender_name: "Aki Matcha",
    },
    {
      id: "msg-3",
      reservation_id: second.id,
      sender_id: "preview",
      body: "We’ll confirm the final guest count by Monday.",
      created_at: ago(40),
      sender_name: "You",
    },
  ];
}
