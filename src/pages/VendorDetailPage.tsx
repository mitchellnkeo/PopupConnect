import { Link, useNavigate, useParams } from "react-router-dom";
import { AppHeader } from "../components/layout/AppHeader";
import { LandingFooter } from "../components/landing/LandingFooter";
import { useAuth } from "../features/auth/AuthContext";
import { getVendorById } from "../data/vendors";
import { btnPrimaryFull, btnSecondaryOutline } from "../lib/buttonStyles";

export function VendorDetailPage() {
  const { vendorId } = useParams<{ vendorId: string }>();
  const navigate = useNavigate();
  const { session } = useAuth();
  const vendor = vendorId ? getVendorById(vendorId) : undefined;

  const quotePath = vendor ? `/booking/quote?vendor=${vendor.id}` : "/booking/quote";
  const vendorShortName = vendor?.title.split("'")[0] ?? "vendor";

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
                className="aspect-[16/7] w-full rounded-[20px] object-cover"
              />
            ) : null}

            <section className="rounded-[20px] bg-white p-8 shadow-[0_0_6px_rgba(0,0,0,0.12)]">
              <h1 className="font-bold text-[length:var(--text-section,28px)] text-midnight">
                About {vendor.title}
              </h1>
              <p className="mt-1 text-body/60 text-base">{vendor.city}</p>
              <p className="mt-4 text-body text-lg leading-relaxed">{vendor.about}</p>

              <h3 className="mt-6 font-bold text-body text-lg">What&apos;s Included</h3>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-body text-base">
                {vendor.whatsIncluded.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>

              <p className="mt-6 font-bold text-body text-lg">Ideal For</p>
              <p className="mt-2 text-body text-base">{vendor.idealFor}</p>
            </section>

            <section className="rounded-[20px] bg-white p-8 shadow-[0_0_6px_rgba(0,0,0,0.12)]">
              <h2 className="font-semibold text-[length:var(--text-row-title,22px)] text-midnight">
                Booking details
              </h2>
              <div className="mt-4 grid gap-6 sm:grid-cols-2">
                <dl className="space-y-3 text-base">
                  <div>
                    <dt className="font-medium text-body">Starting price</dt>
                    <dd>${vendor.startingPrice}</dd>
                  </div>
                  <div>
                    <dt className="font-medium text-body">Deposit</dt>
                    <dd>${vendor.deposit}</dd>
                  </div>
                  <div>
                    <dt className="font-medium text-body">Lead time</dt>
                    <dd>{vendor.leadTime}</dd>
                  </div>
                </dl>
                <dl className="space-y-3 text-base">
                  <div>
                    <dt className="font-medium text-body">Minimum party size</dt>
                    <dd>{vendor.minPartySize}</dd>
                  </div>
                  <div>
                    <dt className="font-medium text-body">Response time</dt>
                    <dd>{vendor.responseTime}</dd>
                  </div>
                </dl>
              </div>
            </section>

            <section className="rounded-[20px] bg-white p-8 shadow-[0_0_6px_rgba(0,0,0,0.12)]">
              <h2 className="font-semibold text-[length:var(--text-row-title,22px)] text-midnight">Verified</h2>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {vendor.verified.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-primary text-base">
                    <span aria-hidden>✓</span>
                    {item}
                  </li>
                ))}
              </ul>

              <h3 className="mt-8 font-semibold text-[length:var(--text-row-title,22px)] text-midnight">
                Contact info
              </h3>
              <ul className="mt-4 grid gap-2 sm:grid-cols-2 text-primary text-base">
                <li>{vendor.contact.website}</li>
                <li>{vendor.contact.email}</li>
                <li>{vendor.contact.instagram}</li>
                <li>{vendor.contact.phone}</li>
              </ul>
            </section>

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
              <div className="flex flex-wrap gap-2">
                {vendor.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-orange-100 px-2 py-0.5 font-medium text-orange-800 text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-6 space-y-3">
                {session ? (
                  <button type="button" className={`w-full ${btnSecondaryOutline}`}>
                    Message {vendorShortName}
                  </button>
                ) : (
                  <Link
                    to="/sign-in"
                    state={{ from: `/messages` }}
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
              </div>

              <div className="mt-8 space-y-4">
                <h3 className="font-bold text-[length:var(--text-section,28px)] text-midnight">Packages</h3>
                {vendor.packages.map((pkg) => (
                  <div key={pkg.id} className="rounded-lg border border-border p-4">
                    <p className="font-bold text-midnight">{pkg.name}</p>
                    <p className="mt-1 text-body/70 text-sm">{pkg.description}</p>
                    <p className="mt-2 font-bold text-primary text-lg">${pkg.price}</p>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
