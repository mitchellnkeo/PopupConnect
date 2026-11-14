import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { useAuth } from "../../features/auth/AuthContext";
import { btnPrimary } from "../../lib/buttonStyles";
import {
  demoReservations,
  reservationStatusLabel,
  reservationStatusTone,
} from "../../lib/eventCalendar";
import {
  demoMessages,
  lastMessageByReservation,
  messagesHref,
  pickThread,
  relativeMessageTime,
} from "../../lib/messageThreads";
import { formatQuoteDate } from "../../lib/quoteSnapshot";
import {
  fetchProfileNames,
  fetchReservationMessages,
  sendReservationMessage,
} from "../../services/messageService";
import {
  fetchReservationsForGuest,
  fetchReservationsForVendor,
} from "../../services/reservationService";
import { fetchVendorProfileByOwner } from "../../services/vendorService";
import type { Reservation, ReservationMessage } from "../../types/database";

function threadTitle(reservation: Reservation, incoming: boolean, guestName: string | null) {
  if (incoming) return guestName?.trim() || "Quote request";
  return reservation.vendor_title;
}

function senderLabel(
  message: ReservationMessage,
  reservation: Reservation,
  currentUserId: string | undefined,
) {
  if (currentUserId && message.sender_id === currentUserId) return "You";
  if (message.sender_id === reservation.guest_id) {
    return message.sender_name?.trim() || "Guest";
  }
  return message.sender_name?.trim() || reservation.vendor_title;
}

export function MessagesPage() {
  const { user } = useAuth();
  const [params] = useSearchParams();
  const preview = import.meta.env.DEV && params.get("preview") === "1";
  const reservationParam = params.get("reservation");
  const vendorParam = params.get("vendor");

  const [mine, setMine] = useState<Reservation[]>([]);
  const [incoming, setIncoming] = useState<Reservation[]>([]);
  const [messages, setMessages] = useState<ReservationMessage[]>([]);
  const [guestNames, setGuestNames] = useState<Map<string, string | null>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!user) {
      if (preview) {
        const rows = demoReservations();
        setMine(rows);
        setIncoming([]);
        setMessages(demoMessages());
        setGuestNames(new Map());
        setLoading(false);
        return;
      }
      setMine([]);
      setIncoming([]);
      setMessages([]);
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
      const combined = [...guestRows, ...vendorRows];
      const uniqueIds = [...new Set(combined.map((row) => row.id))];
      const [threadMessages, names] = await Promise.all([
        fetchReservationMessages(uniqueIds),
        fetchProfileNames(vendorRows.map((row) => row.guest_id)),
      ]);
      if (!cancelled) {
        setMine(guestRows);
        setIncoming(vendorRows);
        setMessages(threadMessages);
        setGuestNames(names);
      }
    })()
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Could not load messages.");
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
  const reservations = useMemo(() => {
    const seen = new Set<string>();
    return [...mine, ...incoming].filter((row) => {
      if (seen.has(row.id)) return false;
      seen.add(row.id);
      return true;
    });
  }, [mine, incoming]);

  const latest = useMemo(() => lastMessageByReservation(messages), [messages]);
  const threads = useMemo(() => {
    return [...reservations].sort((a, b) => {
      const aTime = latest.get(a.id)?.created_at ?? "";
      const bTime = latest.get(b.id)?.created_at ?? "";
      if (aTime && bTime) return bTime.localeCompare(aTime);
      if (aTime) return -1;
      if (bTime) return 1;
      return b.created_at.localeCompare(a.created_at);
    });
  }, [reservations, latest]);

  const selected = pickThread(threads, reservationParam, vendorParam);
  const selectedIncoming = selected ? incomingIds.has(selected.id) : false;
  const selectedMessages = selected
    ? messages.filter((message) => message.reservation_id === selected.id)
    : [];
  const missingVendorQuote = Boolean(
    vendorParam && !threads.some((row) => row.vendor_slug === vendorParam) && !loading,
  );

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [selectedMessages.length, selected?.id]);

  async function handleSend(event: React.FormEvent) {
    event.preventDefault();
    if (!selected) return;
    const body = draft.trim();
    if (!body) return;

    setSending(true);
    setError(null);
    try {
      if (preview && !user) {
        const next: ReservationMessage = {
          id: `demo-${Date.now()}`,
          reservation_id: selected.id,
          sender_id: "preview",
          body,
          created_at: new Date().toISOString(),
          sender_name: "You",
        };
        setMessages((current) => [...current, next]);
        setDraft("");
        return;
      }
      if (!user) {
        setError("Sign in to send a message.");
        return;
      }
      const saved = await sendReservationMessage(selected.id, user.id, body);
      setMessages((current) => [...current, saved]);
      setDraft("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send that message.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-semibold text-2xl text-midnight">Messages</h1>
        <p className="mt-2 text-neutral-600 text-sm leading-relaxed">
          Each conversation stays attached to a quote, so the vendor sees the date, package, and notes together.
        </p>
      </div>

      {error ? <p className="text-primary text-sm">{error}</p> : null}
      {loading ? <p className="text-neutral-600 text-sm">Loading messages…</p> : null}

      {!loading && threads.length === 0 ? (
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <p className="text-midnight text-sm">
            {missingVendorQuote
              ? "Save a quote with this vendor to start a conversation."
              : "Save a quote to message a vendor. Threads are created with the booking, not as a separate inbox."}
          </p>
          <Link
            to={vendorParam ? `/booking/quote?vendor=${vendorParam}` : "/explore"}
            className={`mt-4 inline-flex ${btnPrimary}`}
          >
            {vendorParam ? "Build a quote" : "Find a vendor"}
          </Link>
        </div>
      ) : null}

      {!loading && threads.length > 0 ? (
        <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
          <aside className="rounded-2xl border border-neutral-200 bg-white shadow-sm">
            <ul>
              {threads.map((reservation) => {
                const last = latest.get(reservation.id);
                const incomingThread = incomingIds.has(reservation.id);
                const active = reservation.id === selected?.id;
                return (
                  <li key={reservation.id} className="border-b border-neutral-100 last:border-0">
                    <Link
                      to={messagesHref({ reservationId: reservation.id })}
                      className={[
                        "block px-4 py-3 text-left transition",
                        active ? "bg-teal-100" : "hover:bg-neutral-50",
                      ].join(" ")}
                    >
                      <span className="flex items-start justify-between gap-2">
                        <span className="font-medium text-midnight text-sm">
                          {threadTitle(
                            reservation,
                            incomingThread,
                            guestNames.get(reservation.guest_id) ?? null,
                          )}
                        </span>
                        {last ? (
                          <span className="shrink-0 text-neutral-400 text-xs">
                            {relativeMessageTime(last.created_at)}
                          </span>
                        ) : null}
                      </span>
                      <span className="mt-1 block truncate text-neutral-500 text-xs">
                        {reservation.package_name ?? "Custom package"}
                        {reservation.event_date
                          ? ` · ${formatQuoteDate(reservation.event_date)}`
                          : ""}
                      </span>
                      <span className="mt-1 block truncate text-neutral-600 text-xs">
                        {last?.body ?? "No messages yet"}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </aside>

          {selected ? (
            <section className="flex min-h-[420px] flex-col rounded-2xl border border-neutral-200 bg-white shadow-sm">
              <header className="border-b border-neutral-200 px-5 py-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="font-semibold text-lg text-midnight">
                      {threadTitle(
                        selected,
                        selectedIncoming,
                        guestNames.get(selected.guest_id) ?? null,
                      )}
                    </h2>
                    <p className="mt-1 text-neutral-600 text-sm">
                      {selected.event_date ? formatQuoteDate(selected.event_date) : "Date to be confirmed"}
                      {selected.location ? ` · ${selected.location}` : ""}
                    </p>
                  </div>
                  <StatusBadge
                    label={reservationStatusLabel(selected.status)}
                    tone={reservationStatusTone(selected.status)}
                  />
                </div>
                <div className="mt-3 flex flex-wrap gap-3">
                  <Link
                    to={
                      selected.status === "draft" && !selectedIncoming
                        ? `/booking/quote?id=${selected.id}&vendor=${selected.vendor_slug}`
                        : `/booking/confirm?id=${selected.id}`
                    }
                    className="text-primary text-sm hover:underline"
                  >
                    View quote
                  </Link>
                  <Link
                    to={`/vendor/${selected.vendor_slug}`}
                    className="text-primary text-sm hover:underline"
                  >
                    Vendor page
                  </Link>
                </div>
              </header>

              <div className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
                {selectedMessages.length === 0 ? (
                  <p className="text-neutral-500 text-sm">
                    No messages yet. Ask a question about this quote.
                  </p>
                ) : (
                  selectedMessages.map((message) => {
                    const mineMessage = Boolean(user?.id === message.sender_id || (preview && message.sender_id === "preview"));
                    return (
                      <div
                        key={message.id}
                        className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${
                          mineMessage
                            ? "ml-auto bg-primary text-white"
                            : "bg-neutral-100 text-midnight"
                        }`}
                      >
                        <p className={`text-[11px] ${mineMessage ? "text-white/80" : "text-neutral-500"}`}>
                          {senderLabel(message, selected, preview && !user ? "preview" : user?.id)}
                        </p>
                        <p className="mt-0.5 whitespace-pre-wrap">{message.body}</p>
                      </div>
                    );
                  })
                )}
                <div ref={bottomRef} />
              </div>

              <form className="border-t border-neutral-200 p-4" onSubmit={(event) => void handleSend(event)}>
                <label htmlFor="message-body" className="sr-only">
                  Message
                </label>
                <textarea
                  id="message-body"
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  maxLength={2000}
                  rows={3}
                  placeholder="Write a note about this quote…"
                  className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-neutral-900 text-sm outline-none transition focus:ring-2 focus:ring-primary/30"
                />
                <div className="mt-3 flex justify-end">
                  <button
                    type="submit"
                    className={btnPrimary}
                    disabled={sending || !draft.trim()}
                  >
                    {sending ? "Sending…" : "Send"}
                  </button>
                </div>
              </form>
            </section>
          ) : (
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
              <p className="text-neutral-600 text-sm">Select a quote to open its conversation.</p>
            </div>
          )}
        </div>
      ) : null}

      {missingVendorQuote && threads.length > 0 ? (
        <p className="text-neutral-600 text-sm">
          No quote with this vendor yet.{" "}
          <Link to={`/booking/quote?vendor=${vendorParam}`} className="text-primary hover:underline">
            Build a quote
          </Link>{" "}
          to start a thread.
        </p>
      ) : null}
    </div>
  );
}
