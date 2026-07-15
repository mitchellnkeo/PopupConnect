import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { AppHeader } from "../../components/layout/AppHeader";
import { LandingFooter } from "../../components/landing/LandingFooter";
import { getVendorById } from "../../data/vendors";
import { btnPrimary, btnSecondaryOutline } from "../../lib/buttonStyles";

const quoteDetails = [
  { label: "Event date", value: "Saturday July 12, 2026" },
  { label: "Location", value: "123 North street, Seattle WA, 98107" },
  { label: "Duration", value: "2PM - 8PM (6 hours)" },
  { label: "Guest count", value: "20 people" },
  { label: "Selected package", value: "Premium Matcha Bar Package" },
  { label: "Add-ons", value: "Non-dairy options" },
];

export function QuoteRequestPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const vendorId = searchParams.get("vendor") ?? "aki-matcha";
  const vendor = getVendorById(vendorId);

  return (
    <div className="flex min-h-dvh flex-col bg-white">
      <AppHeader />

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12 md:px-6">
        <div className="rounded-[20px] border border-border bg-white p-8 shadow-[0_0_6px_rgba(0,0,0,0.12)]">
          <div className="border-border border-b pb-5">
            <p className="text-body/60 text-lg">Quote preview</p>
            <h1 className="font-bold text-[length:var(--text-section,28px)] text-midnight">
              {vendor?.title ?? "Vendor"}
            </h1>
          </div>

          <dl className="mt-8 space-y-3">
            {quoteDetails.map((row) => (
              <div
                key={row.label}
                className="flex items-center justify-between gap-4 border-border border-b pb-2.5 text-base"
              >
                <dt className="w-36 font-medium text-body text-sm">{row.label}</dt>
                <dd className="flex-1 text-right font-medium text-body">{row.value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-8 space-y-2">
            <div className="flex items-center justify-between text-body/60 text-lg">
              <span>Deposit amount</span>
              <span className="font-bold text-body text-lg">$100.00</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold text-[length:var(--text-row-title,22px)] text-midnight">
                Total quote
              </span>
              <span className="font-bold text-[length:var(--text-section,28px)] text-primary">$360.00</span>
            </div>
          </div>

          <p className="mt-6 border-border border-t pt-6 text-body/60 text-xs leading-relaxed">
            Cancellation policy: Cancellations 7+ days before the event receive a full refund minus the
            deposit. Cancellations within 7 days are non-refundable. Prices are subject to change. Final
            quote is confirmed upon booking.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-border border-t pt-8">
            <Link
              to={vendor ? `/vendor/${vendor.id}` : "/explore"}
              className={btnSecondaryOutline}
            >
              Decline & Edit
            </Link>
            <div className="flex flex-wrap gap-3">
              <button type="button" className={btnSecondaryOutline}>
                Save for later
              </button>
              <button
                type="button"
                onClick={() => navigate(`/booking/confirm?vendor=${vendorId}`)}
                className={btnPrimary}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
