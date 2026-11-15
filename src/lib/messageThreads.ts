import { demoReservations } from "./eventCalendar";
import type { Reservation, ReservationMessage } from "../types/database";

export const INBOX_CHANGED_EVENT = "freqnt:inbox-changed";

export function notifyInboxChanged() {
  window.dispatchEvent(new Event(INBOX_CHANGED_EVENT));
}

export function messagesHref(opts?: { reservationId?: string | null; vendorSlug?: string | null }) {
  const params = new URLSearchParams();
  if (opts?.reservationId) params.set("reservation", opts.reservationId);
  else if (opts?.vendorSlug) params.set("vendor", opts.vendorSlug);
  if (import.meta.env.DEV && opts?.reservationId?.startsWith("demo-")) params.set("preview", "1");
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

export function lastReadAt(reservation: Reservation, incoming: boolean) {
  return incoming ? reservation.vendor_last_read_at : reservation.guest_last_read_at;
}

export function threadIsUnread(
  reservation: Reservation,
  lastMessage: ReservationMessage | undefined,
  currentUserId: string | undefined,
  incoming: boolean,
) {
  if (!lastMessage) return false;
  const selfId = currentUserId ?? (incoming ? "vendor-preview" : "preview");
  if (lastMessage.sender_id === selfId) return false;
  const readAt = lastReadAt(reservation, incoming);
  if (!readAt) return true;
  return lastMessage.created_at > readAt;
}

export function demoMessages(): ReservationMessage[] {
  const ago = (minutes: number) => new Date(Date.now() - minutes * 60_000).toISOString();
  const [first, second, , booked] = demoReservations();
  return [
    {
      id: "msg-sys-1",
      reservation_id: first.id,
      sender_id: "vendor-aki",
      body: "This quote was confirmed.",
      kind: "system",
      created_at: ago(200),
      sender_name: "Aki Matcha",
    },
    {
      id: "msg-1",
      reservation_id: first.id,
      sender_id: "preview",
      body: "Hi — can the ceremony tasting start a little earlier on the 13th?",
      kind: "user",
      created_at: ago(180),
      sender_name: "You",
    },
    {
      id: "msg-2",
      reservation_id: first.id,
      sender_id: "vendor-aki",
      body: "Yes, we can open at 10:30. I’ll hold the tasting table near the window.",
      kind: "user",
      created_at: ago(95),
      sender_name: "Aki Matcha",
    },
    {
      id: "msg-3",
      reservation_id: second.id,
      sender_id: "preview",
      body: "We’ll confirm the final guest count by Monday.",
      kind: "user",
      created_at: ago(40),
      sender_name: "You",
    },
    {
      id: "msg-sys-2",
      reservation_id: booked.id,
      sender_id: "preview",
      body: "The deposit was marked as arranged. This date is booked.",
      kind: "system",
      created_at: ago(30),
      sender_name: "You",
    },
  ];
}
