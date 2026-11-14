import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ProtectedRoute } from "../../components/auth/ProtectedRoute";
import { AppHeader } from "../../components/layout/AppHeader";
import { LandingFooter } from "../../components/landing/LandingFooter";
import { useAuth } from "../../features/auth/AuthContext";
import { useVendorCatalog } from "../../hooks/useVendorCatalog";
import { btnPrimary, btnSecondaryOutline } from "../../lib/buttonStyles";
import {
  formFromReservation,
  formatDurationLabel,
  formatMoney,
  initialQuoteForm,
  quoteSnapshotFromForm,
  selectedPackage,
  type QuoteFormState,
} from "../../lib/quoteSnapshot";
import { fetchReservation, saveReservation } from "../../services/reservationService";

const fieldClass =
  "h-9 w-full rounded border border-gray-400 bg-white px-2.5 text-right text-[16px] text-body outline-none transition focus:border-primary";

export function QuoteRequestPage() {
  const [params] = useSearchParams();
  const preview = import.meta.env.DEV && params.get("preview") === "1";
  if (preview) return <QuoteRequestContent />;
  return (
    <ProtectedRoute>
      <QuoteRequestContent />
    </ProtectedRoute>
  );
}

function QuoteRequestContent() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const reservationId = searchParams.get("id");
  const vendorId = searchParams.get("vendor") ?? (reservationId ? "" : "aki-matcha");
  const { getVendor, loading } = useVendorCatalog();

  const [form, setForm] = useState<QuoteFormState | null>(null);
  const [loadedReservationVendor, setLoadedReservationVendor] = useState<string | null>(null);
  const [saving, setSaving] = useState<"draft" | "submitted" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const vendor = getVendor(vendorId || loadedReservationVendor || "");

  useEffect(() => {
    if (!reservationId || !user) return;

    let cancelled = false;
    fetchReservation(reservationId)
      .then((reservation) => {
        if (cancelled || !reservation) return;
        setLoadedReservationVendor(reservation.vendor_slug);
      })
      .catch(() => {
        if (!cancelled) setLoadedReservationVendor(null);
      });

    return () => {
      cancelled = true;
    };
  }, [reservationId, user]);

  const hydratedKey = useRef<string | null>(null);

  useEffect(() => {
    if (!vendor) return;
    const currentVendor = vendor;
    const key = `${currentVendor.id}:${reservationId ?? ""}:${searchParams.get("package") ?? ""}`;
    if (hydratedKey.current === key) return;
    hydratedKey.current = key;

    let cancelled = false;

    async function hydrate() {
      if (reservationId) {
        try {
          const reservation = await fetchReservation(reservationId);
          if (cancelled || !reservation) return;
          setForm(formFromReservation(currentVendor, reservation));
          return;
        } catch {
          /* fall through to defaults */
        }
      }
      if (!cancelled) setForm(initialQuoteForm(currentVendor, searchParams));
    }

    void hydrate();
    return () => {
      cancelled = true;
    };
  }, [vendor, reservationId, searchParams]);

  const snapshot = useMemo(
    () => (vendor && form ? quoteSnapshotFromForm(vendor, form) : null),
    [vendor, form],
  );
  const pkg = vendor && form ? selectedPackage(vendor, form.packageId) : undefined;
  const canSubmit = Boolean(snapshot && form?.eventDate && form.location.trim() && form.guestCount > 0);

  function update<K extends keyof QuoteFormState>(key: K, value: QuoteFormState[K]) {
    setForm((current) => (current ? { ...current, [key]: value } : current));
  }

  async function persist(status: "draft" | "submitted") {
    if (!snapshot || !canSubmit) return;
    if (!user) {
      setError("Sign in to save this quote.");
      return;
    }

    setSaving(status);
    setError(null);

    try {
      const reservation = await saveReservation(user.id, snapshot, status, reservationId);
      if (status === "draft") {
        navigate("/account/settings/events");
        return;
      }
      navigate(`/booking/confirm?id=${reservation.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save this quote.");
    } finally {
      setSaving(null);
    }
  }

  return (
    <div className="flex min-h-dvh flex-col bg-white">
      <AppHeader />

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12 md:px-6">
        <div className="rounded-[20px] border border-border bg-white p-8 shadow-[0_0_6px_rgba(0,0,0,0.12)]">
          <div className="border-border border-b pb-5">
            <p className="text-body/60 text-lg">Build your quote</p>
            <h1 className="font-bold text-[length:var(--text-section,28px)] text-midnight">
              {vendor?.title ?? (loading ? "Loading vendor…" : "Vendor not found")}
            </h1>
          </div>

          {form && vendor ? (
            <div className="mt-8 space-y-3">
              <QuoteField label="Event date">
                <input
                  type="date"
                  value={form.eventDate}
                  min={toDateInputMin()}
                  onChange={(event) => update("eventDate", event.target.value)}
                  className={fieldClass}
                />
              </QuoteField>

              <QuoteField label="Location">
                <input
                  type="text"
                  value={form.location}
                  onChange={(event) => update("location", event.target.value)}
                  className={fieldClass}
                />
              </QuoteField>

              <QuoteField label="Duration">
                <div className="flex items-center justify-end gap-2">
                  <input
                    type="time"
                    aria-label="Start time"
                    value={form.startTime}
                    onChange={(event) => update("startTime", event.target.value)}
                    className={fieldClass}
                  />
                  <span className="text-body/50 text-sm">to</span>
                  <input
                    type="time"
                    aria-label="End time"
                    value={form.endTime}
                    onChange={(event) => update("endTime", event.target.value)}
                    className={fieldClass}
                  />
                </div>
                <p className="mt-1 text-body/50 text-xs">{formatDurationLabel(form.startTime, form.endTime)}</p>
              </QuoteField>

              <QuoteField label="Guest count">
                <input
                  type="number"
                  min={1}
                  value={form.guestCount}
                  onChange={(event) => update("guestCount", Number(event.target.value) || 1)}
                  className={fieldClass}
                />
                {vendor.minPartySize > 1 ? (
                  <p className="mt-1 text-body/50 text-xs">Minimum {vendor.minPartySize} guests</p>
                ) : null}
              </QuoteField>

              <QuoteField label="Selected package">
                <select
                  value={form.packageId}
                  onChange={(event) => update("packageId", event.target.value)}
                  className={fieldClass}
                >
                  {vendor.packages.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.name} — {formatMoney(option.price)}
                    </option>
                  ))}
                </select>
                {pkg?.description ? (
                  <p className="mt-1 text-body/50 text-xs">{pkg.description}</p>
                ) : null}
              </QuoteField>

              <QuoteField label="Add-ons">
                <input
                  type="text"
                  value={form.addOns}
                  placeholder="None"
                  onChange={(event) => update("addOns", event.target.value)}
                  className={fieldClass}
                />
              </QuoteField>
            </div>
          ) : (
            <p className="mt-8 text-body text-sm">
              {loading ? "Loading quote details…" : "This listing is not available for quotes."}
            </p>
          )}

          {snapshot ? (
            <div className="mt-8 space-y-2">
              <div className="flex items-center justify-between text-body/60 text-lg">
                <span>Deposit amount</span>
                <span className="font-bold text-body text-lg">{formatMoney(snapshot.depositAmount)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[length:var(--text-row-title,22px)] text-midnight">
                  Total quote
                </span>
                <span className="font-bold text-[length:var(--text-section,28px)] text-primary">
                  {formatMoney(snapshot.totalAmount)}
                </span>
              </div>
            </div>
          ) : null}

          <p className="mt-6 border-border border-t pt-6 text-body/60 text-xs leading-relaxed">
            Cancellation policy: Cancellations 7+ days before the event receive a full refund minus the
            deposit. Cancellations within 7 days are non-refundable. Prices are subject to change. Final
            quote is confirmed upon booking.
          </p>

          {error ? <p className="mt-4 text-primary text-sm">{error}</p> : null}

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-border border-t pt-8">
            <Link
              to={vendor ? `/vendor/${vendor.id}` : "/explore"}
              className={btnSecondaryOutline}
            >
              Back to listing
            </Link>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                className={btnSecondaryOutline}
                disabled={!canSubmit || saving !== null}
                onClick={() => void persist("draft")}
              >
                {saving === "draft" ? "Saving…" : "Save for later"}
              </button>
              <button
                type="button"
                disabled={!canSubmit || saving !== null}
                onClick={() => void persist("submitted")}
                className={btnPrimary}
              >
                {saving === "submitted" ? "Submitting…" : "Request quote"}
              </button>
            </div>
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}

function QuoteField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="border-border border-b pb-2.5">
      <div className="flex items-center justify-between gap-4">
        <label className="w-36 shrink-0 font-medium text-body text-sm">{label}</label>
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}

function toDateInputMin() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}
