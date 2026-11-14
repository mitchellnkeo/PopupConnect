import { Link, useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { AppHeader } from "../components/layout/AppHeader";
import { LandingFooter } from "../components/landing/LandingFooter";
import { ListingKindBadge } from "../components/discovery/ListingKindBadge";
import { ListingShareDialog } from "../components/listing/ListingShareDialog";
import { VendorPackageCard } from "../components/vendor/VendorPackageCard";
import { VendorPackagePopout } from "../components/vendor/VendorPackagePopout";
import { listingKindOf } from "../data/vendors";
import { useAuth } from "../features/auth/AuthContext";
import { useVendorCatalog } from "../hooks/useVendorCatalog";
import type { VendorPackage } from "../data/vendors";
import { btnPrimaryFull, btnSecondaryOutline } from "../lib/buttonStyles";
import {
  listingBookingFacts,
  listingContacts,
  listingIncludedItems,
  listingUrl,
} from "../lib/listingContent";
import { formatMoney } from "../lib/quoteSnapshot";

export function VendorDetailPage() {
  const { vendorId } = useParams<{ vendorId: string }>();
  const navigate = useNavigate();
  const { session } = useAuth();
  const { getVendor, loading } = useVendorCatalog();
  const [selectedPackage, setSelectedPackage] = useState<VendorPackage | null>(null);
  const [shareOpen, setShareOpen] = useState(false);
  const vendor = vendorId ? getVendor(vendorId) : undefined;

  const quotePath = vendor ? `/booking/quote?vendor=${vendor.id}` : "/booking/quote";
  const quotePathForPackage = (pkgId?: string) => {
    if (!vendor) return "/booking/quote";
    const params = new URLSearchParams({ vendor: vendor.id });
    if (pkgId) params.set("package", pkgId);
    return `/booking/quote?${params.toString()}`;
  };
  const vendorShortName = vendor?.title.split("'")[0] ?? "vendor";

  if (loading) {
    return (
      <div className="flex min-h-dvh flex-col bg-white">
        <AppHeader />
        <div className="mx-auto max-w-3xl px-4 py-20 text-center text-body/60">Loading vendor…</div>
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="flex min-h-dvh flex-col bg-white">
        <AppHeader />
        <div className="mx-auto max-w-3xl px-4 py-20 text-center">
          <h1 className="font-bold text-2xl text-midnight">Vendor not found</h1>
          <Link to="/explore" className="mt-4 inline-block text-primary hover:underline">
            Back to search
          </Link>
        </div>
      </div>
    );
  }

  const included = listingIncludedItems(vendor);
  const contacts = listingContacts(vendor);
  const bookingFacts = listingBookingFacts(vendor);
  const packagesLabel = listingKindOf(vendor) === "host" ? "Rental options" : "Packages";

  return (
    <div className="flex min-h-dvh flex-col bg-white">
      <AppHeader />

      <main className="mx-auto w-full max-w-[1600px] px-4 py-8 md:px-[60px]">
        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          <div className="min-w-0 space-y-8">
            {vendor.heroImageSrc || vendor.imageSrc ? (
              <img
                src={vendor.heroImageSrc ?? vendor.imageSrc}
                alt={vendor.title}
                className="aspect-[16/7] w-full rounded-[18px] object-cover"
              />
            ) : null}

            <section className="rounded-[20px] bg-white p-8 shadow-[0_0_6px_rgba(0,0,0,0.12)]">
              <ListingKindBadge kind={vendor} />
              <h1 className="mt-2 font-bold text-[length:var(--text-section,28px)] text-midnight">
                About {vendor.title}
              </h1>
              <p className="mt-1 text-body/60 text-base">{vendor.city}</p>
              {vendor.about ? (
                <p className="mt-4 text-body text-lg leading-relaxed">{vendor.about}</p>
              ) : (
                <p className="mt-4 text-body/60 text-base">This listing is still adding its story.</p>
              )}

              {included.length > 0 ? (
                <>
                  <h3 className="mt-6 font-bold text-body text-lg">What&apos;s Included</h3>
                  <ul className="mt-3 list-disc space-y-2 pl-5 text-body text-base">
                    {included.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </>
              ) : null}

              {vendor.idealFor.trim() ? (
                <>
                  <p className="mt-6 font-bold text-body text-lg">Ideal For</p>
                  <p className="mt-2 text-body text-base">{vendor.idealFor}</p>
                </>
              ) : null}
            </section>

            {bookingFacts.length > 0 ? (
              <section className="rounded-[20px] bg-white p-8 shadow-[0_0_6px_rgba(0,0,0,0.12)]">
                <h2 className="font-semibold text-[length:var(--text-row-title,22px)] text-midnight">
                  Booking details
                </h2>
                <dl className="mt-4 grid gap-6 sm:grid-cols-2">
                  {bookingFacts.map((fact) => (
                    <div key={fact.label}>
                      <dt className="font-medium text-body">{fact.label}</dt>
                      <dd>
                        {fact.kind === "money" ? formatMoney(fact.value) : fact.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </section>
            ) : null}

            {vendor.verified.length > 0 || contacts.length > 0 ? (
              <section className="rounded-[20px] bg-white p-8 shadow-[0_0_6px_rgba(0,0,0,0.12)]">
                {vendor.verified.length > 0 ? (
                  <>
                    <h2 className="font-semibold text-[length:var(--text-row-title,22px)] text-midnight">
                      Verified
                    </h2>
                    <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                      {vendor.verified.map((item) => (
                        <li key={item} className="flex items-center gap-2 text-primary text-base">
                          <span aria-hidden>✓</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </>
                ) : null}

                {contacts.length > 0 ? (
                  <>
                    <h3
                      className={`font-semibold text-[length:var(--text-row-title,22px)] text-midnight ${vendor.verified.length > 0 ? "mt-8" : ""}`}
                    >
                      Contact info
                    </h3>
                    <ul className="mt-4 grid gap-2 sm:grid-cols-2 text-primary text-base">
                      {contacts.map((item) => (
                        <li key={item.label}>{item.value}</li>
                      ))}
                    </ul>
                  </>
                ) : null}
              </section>
            ) : null}

            {vendor.gallery.length > 0 ? (
              <section className="rounded-[20px] bg-white p-8 shadow-[0_0_6px_rgba(0,0,0,0.12)]">
                <h2 className="font-bold text-[length:var(--text-section,28px)] text-midnight">Gallery</h2>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {vendor.gallery.map((src) => (
                    <img key={src} src={src} alt="" className="aspect-square rounded-[10px] object-cover" />
                  ))}
                </div>
              </section>
            ) : null}
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-[20px] bg-white p-8 shadow-[0_0_6px_rgba(0,0,0,0.12)]">
              <h2 className="font-bold text-[length:var(--text-section,28px)] text-midnight">
                {vendor.title}
              </h2>
              <p className="mt-1 text-body/60 text-sm">{vendor.city}</p>
              {vendor.startingPrice > 0 ? (
                <p className="mt-3 font-bold text-primary text-lg">
                  From {formatMoney(vendor.startingPrice)}
                </p>
              ) : null}

              {vendor.tags.length > 0 ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {vendor.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-orange-100 px-2 py-0.5 font-medium text-orange-800 text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              ) : null}

              <div className="mt-6 space-y-3">
                {session ? (
                  <Link
                    to="/account/settings/messages"
                    className={`inline-flex w-full items-center justify-center ${btnSecondaryOutline}`}
                  >
                    Message {vendorShortName}
                  </Link>
                ) : (
                  <Link
                    to="/sign-in"
                    state={{ from: "/account/settings/messages" }}
                    className={`inline-flex w-full items-center justify-center ${btnSecondaryOutline}`}
                  >
                    Sign in to message
                  </Link>
                )}
                {session ? (
                  <button
                    type="button"
                    onClick={() => navigate(quotePath)}
                    className={btnPrimaryFull}
                  >
                    Book now
                  </button>
                ) : (
                  <Link
                    to="/sign-in"
                    state={{ from: quotePath }}
                    className={`inline-flex items-center justify-center ${btnPrimaryFull}`}
                  >
                    Sign in to book
                  </Link>
                )}
                <button
                  type="button"
                  onClick={() => setShareOpen(true)}
                  className={`w-full ${btnSecondaryOutline}`}
                >
                  Share listing
                </button>
              </div>

              <div className="mt-8 space-y-4">
                <h3 className="font-bold text-[length:var(--text-section,28px)] text-midnight">
                  {packagesLabel}
                </h3>
                {vendor.packages.length > 0 ? (
                  vendor.packages.map((pkg) => (
                    <VendorPackageCard key={pkg.id} pkg={pkg} onSelect={setSelectedPackage} />
                  ))
                ) : (
                  <p className="text-body/60 text-sm">Packages will show here once the vendor adds them.</p>
                )}
              </div>
            </div>
          </aside>
        </div>
      </main>

      <LandingFooter />

      {selectedPackage ? (
        <VendorPackagePopout
          pkg={selectedPackage}
          vendorTitle={vendor.title}
          onClose={() => setSelectedPackage(null)}
          onQuote={() => {
            const next = quotePathForPackage(selectedPackage.id);
            setSelectedPackage(null);
            if (session) {
              navigate(next);
            } else {
              navigate("/sign-in", { state: { from: next } });
            }
          }}
          quoteLabel={session ? "Request quote" : "Sign in to request quote"}
        />
      ) : null}

      {shareOpen ? (
        <ListingShareDialog
          title={vendor.title}
          url={listingUrl(vendor)}
          onClose={() => setShareOpen(false)}
        />
      ) : null}
    </div>
  );
}
