import { Link, useSearchParams } from "react-router-dom";
import { AppHeader } from "../../components/layout/AppHeader";
import { LandingFooter } from "../../components/landing/LandingFooter";
import { getVendorById } from "../../data/vendors";
import { btnPrimary, btnSecondaryOutline } from "../../lib/buttonStyles";

const summaryLeft = [
  { label: "Event date", value: "Saturday July 12, 2026" },
  { label: "Location", value: "123 North st, Seattle WA, 98107" },
  { label: "Scheduled time", value: "2PM-8PM (6 hours)" },
];

const summaryRight = [
  { label: "Party size", value: "20 people" },
  { label: "Package", value: "Premium Matcha Bar Package" },
  { label: "Add-ons", value: "Non-dairy options" },
];

const nextSteps = [
  "Vendor reviews your requirements",
  "You receive a finalized quote",
  "Approve and pay deposit",
  "Event details locked in",
];

export function QuoteConfirmationPage() {
  const [searchParams] = useSearchParams();
  const vendorId = searchParams.get("vendor") ?? "aki-matcha";
  const vendor = getVendorById(vendorId);

  return (
    <div className="flex min-h-dvh flex-col bg-white">
      <AppHeader />

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-12 md:px-6">
        <div className="grid gap-10 lg:grid-cols-[320px_1fr]">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="text-4xl" aria-hidden>
                🥂
              </span>
              <h1 className="font-semibold text-4xl text-midnight">Submitted!</h1>
            </div>

            <div className="rounded-[20px] bg-orange-100 p-8 text-orange-800">
              <p className="font-bold text-lg">What happens next?</p>
              <ol className="mt-4 space-y-3 text-sm">
                {nextSteps.map((step, index) => (
                  <li key={step} className="flex gap-3">
                    <span>{index + 1}.</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <div className="space-y-8">
            <div className="overflow-hidden rounded-[24px] border border-border bg-white shadow-[0_0_12px_rgba(0,0,0,0.12)]">
              <div className="flex items-center justify-between bg-surface p-8">
                <div>
                  <p className="font-bold text-lg text-primary">Quote summary</p>
                  <p className="font-bold text-[length:var(--text-section,28px)] text-midnight">
                    {vendor?.title ?? "Vendor"}
                  </p>
                </div>
                <span className="rounded bg-[#3174a8] px-2 py-1 font-medium text-sm text-white">
                  Under review
                </span>
              </div>

              <div className="grid gap-8 px-8 py-6 sm:grid-cols-2">
                <dl className="space-y-5">
                  {summaryLeft.map((row) => (
                    <div key={row.label}>
                      <dt className="font-medium text-body">{row.label}</dt>
                      <dd className="text-body">{row.value}</dd>
                    </div>
                  ))}
                </dl>
                <dl className="space-y-5">
                  {summaryRight.map((row) => (
                    <div key={row.label}>
                      <dt className="font-medium text-body">{row.label}</dt>
                      <dd className="text-body">{row.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              <div className="flex items-end justify-between border-border border-t px-8 py-6">
                <div>
                  <p className="font-medium text-body">Deposit required</p>
                  <p className="font-semibold text-[length:var(--text-row-title,22px)] text-body">$100</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-body">Total booking amount</p>
                  <p className="font-bold text-[length:var(--text-section,28px)] text-primary">$360</p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap justify-between gap-4">
              <Link to="/messages" className={btnSecondaryOutline}>
                Message Aki
              </Link>
              <Link to="/" className={btnPrimary}>
                Back to home
              </Link>
            </div>
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
