import { Link } from "react-router-dom";
import { AppHeader } from "../../components/layout/AppHeader";
import { LandingFooter } from "../../components/landing/LandingFooter";
import { vendors } from "../../data/vendors";

const akiVendor = vendors[0];

export function VendorAccountPage() {
  const vendor = akiVendor;

  return (
    <div className="flex min-h-dvh flex-col bg-surface">
      <AppHeader />

      <main className="mx-auto w-full max-w-[1600px] px-4 py-8 md:px-[60px]">
        <div className="overflow-hidden rounded-[20px] bg-white shadow-[0_0_6px_rgba(0,0,0,0.12)]">
          {vendor.heroImageSrc ? (
            <img src={vendor.heroImageSrc} alt="" className="aspect-[16/5] w-full object-cover" />
          ) : null}

          <div className="grid gap-8 p-8 lg:grid-cols-[320px_1fr]">
            <aside className="space-y-6">
              <div>
                <h1 className="font-bold text-[length:var(--text-section,28px)] text-midnight">{vendor.title}</h1>
                <p className="mt-1 text-body/60 text-base">{vendor.city}</p>
              </div>

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

              <div className="space-y-3">
                <button
                  type="button"
                  className="w-full rounded border-2 border-primary bg-white px-5 py-2.5 font-semibold text-primary"
                >
                  Message Aki
                </button>
                <Link
                  to={`/vendor/${vendor.id}`}
                  className="block w-full rounded bg-primary px-5 py-2.5 text-center font-semibold text-white"
                >
                  View public profile
                </Link>
              </div>
            </aside>

            <div className="space-y-8">
              <section className="rounded-[20px] bg-white p-8 shadow-[0_0_6px_rgba(0,0,0,0.12)]">
                <h2 className="font-bold text-[length:var(--text-section,28px)] text-midnight">
                  About {vendor.title}
                </h2>
                <p className="mt-4 text-body text-lg leading-relaxed">{vendor.about}</p>
              </section>

              <section className="rounded-[20px] bg-white p-8 shadow-[0_0_6px_rgba(0,0,0,0.12)]">
                <h2 className="font-bold text-[length:var(--text-section,28px)] text-midnight">Vendor highlights</h2>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-lg bg-orange-100 p-3">
                    <p className="font-bold text-body text-sm">Total bookings this year</p>
                    <p className="text-3xl text-midnight">{vendor.highlights.bookingsThisYear}</p>
                  </div>
                  <div className="rounded-lg bg-blue-100 p-3">
                    <p className="font-bold text-body text-sm">Local partnerships</p>
                    <p className="text-3xl text-midnight">{vendor.highlights.localPartnerships}</p>
                  </div>
                  <div className="rounded-lg bg-orange-100 p-3">
                    <p className="font-bold text-body text-sm">Repeat clients</p>
                    <p className="text-3xl text-midnight">{vendor.highlights.repeatClients}%</p>
                  </div>
                  <div className="rounded-lg bg-blue-100 p-3">
                    <p className="font-bold text-body text-sm">Average rating</p>
                    <p className="text-3xl text-midnight">{vendor.highlights.avgRating}</p>
                  </div>
                </div>
              </section>

              <section className="rounded-[20px] bg-white p-8 shadow-[0_0_6px_rgba(0,0,0,0.12)]">
                <h2 className="font-bold text-[length:var(--text-section,28px)] text-midnight">Gallery</h2>
                <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {vendor.gallery.map((src) => (
                    <img key={src} src={src} alt="" className="aspect-square rounded-[10px] object-cover" />
                  ))}
                </div>
              </section>

              <nav className="flex flex-wrap gap-4 text-midnight text-sm">
                <Link to="/account/settings/profile" className="hover:text-primary">
                  Edit account settings
                </Link>
                <Link to="/account/settings/events" className="hover:text-primary">
                  My events
                </Link>
                <Link to="/account/settings/messages" className="hover:text-primary">
                  Messages
                </Link>
              </nav>
            </div>
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
