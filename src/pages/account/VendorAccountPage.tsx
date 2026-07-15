import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AppHeader } from "../../components/layout/AppHeader";
import { LandingFooter } from "../../components/landing/LandingFooter";
import { btnPrimaryFull, btnSecondaryOutline } from "../../lib/buttonStyles";
import { useAuth } from "../../features/auth/AuthContext";
import { fetchVendorProfileByOwner } from "../../services/vendorService";
import type { VendorProfileWithProducts } from "../../types/database";
import { vendors } from "../../data/vendors";

export function VendorAccountPage() {
  const { user, profile, loading: authLoading } = useAuth();
  const [vendorProfile, setVendorProfile] = useState<VendorProfileWithProducts | null>(null);
  const [loading, setLoading] = useState(true);

  const demoVendor = vendors[0];

  useEffect(() => {
    if (!user) {
      setVendorProfile(null);
      setLoading(false);
      return;
    }

    let mounted = true;
    setLoading(true);

    fetchVendorProfileByOwner(user.id)
      .then((result) => {
        if (mounted) setVendorProfile(result);
      })
      .catch(() => {
        if (mounted) setVendorProfile(null);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [user]);

  const displayTitle = vendorProfile?.title ?? demoVendor.title;
  const displayCity = vendorProfile?.city ?? demoVendor.city;
  const displayAbout = vendorProfile?.about ?? demoVendor.about;
  const publicSlug = vendorProfile?.slug;
  const isOwnProfile = Boolean(vendorProfile);
  const isVendorRole = profile?.roles.includes("vendor");

  return (
    <div className="flex min-h-dvh flex-col bg-surface">
      <AppHeader />

      <main className="mx-auto w-full max-w-[1600px] px-4 py-8 md:px-[60px]">
        {!loading && !authLoading && !isOwnProfile && isVendorRole ? (
          <div className="mb-6 rounded-xl border border-primary/20 bg-starlight/40 px-4 py-3 text-body text-sm">
            You have not set up your vendor page yet.{" "}
            <Link to="/account/settings/vendor" className="font-medium text-primary hover:underline">
              Create your vendor profile
            </Link>
            .
          </div>
        ) : null}

        {!isOwnProfile && !isVendorRole ? (
          <div className="mb-6 rounded-xl border border-border bg-white px-4 py-3 text-body text-sm">
            Showing demo vendor data. Add the vendor role and create a profile to manage your own
            business page.
          </div>
        ) : null}

        <div className="overflow-hidden rounded-[20px] bg-white shadow-[0_0_6px_rgba(0,0,0,0.12)]">
          {(vendorProfile?.hero_image_url ?? demoVendor.heroImageSrc) ? (
            <img
              src={vendorProfile?.hero_image_url ?? demoVendor.heroImageSrc}
              alt=""
              className="aspect-[16/5] w-full object-cover"
            />
          ) : null}

          <div className="grid gap-8 p-8 lg:grid-cols-[320px_1fr]">
            <aside className="space-y-6">
              <div>
                <h1 className="font-bold text-[length:var(--text-section,28px)] text-midnight">
                  {displayTitle}
                </h1>
                <p className="mt-1 text-body/60 text-base">{displayCity}</p>
                {vendorProfile?.published ? (
                  <p className="mt-2 font-medium text-primary text-xs uppercase tracking-wide">
                    Published
                  </p>
                ) : isOwnProfile ? (
                  <p className="mt-2 text-neutral-500 text-xs">Draft — not public yet</p>
                ) : null}
              </div>

              <div className="space-y-3">
                <Link
                  to="/account/settings/vendor"
                  className={`inline-flex w-full items-center justify-center ${btnSecondaryOutline}`}
                >
                  {isOwnProfile ? "Edit vendor profile" : "Set up vendor profile"}
                </Link>
                {publicSlug && vendorProfile?.published ? (
                  <Link
                    to={`/vendor/${publicSlug}`}
                    className={`inline-flex items-center justify-center ${btnPrimaryFull}`}
                  >
                    View public profile
                  </Link>
                ) : (
                  <Link
                    to={`/vendor/${demoVendor.id}`}
                    className={`inline-flex items-center justify-center ${btnPrimaryFull}`}
                  >
                    View demo public profile
                  </Link>
                )}
              </div>
            </aside>

            <div className="space-y-8">
              <section className="rounded-[20px] bg-white p-8 shadow-[0_0_6px_rgba(0,0,0,0.12)]">
                <h2 className="font-bold text-[length:var(--text-section,28px)] text-midnight">
                  About {displayTitle}
                </h2>
                <p className="mt-4 text-body text-lg leading-relaxed">{displayAbout}</p>
              </section>

              {isOwnProfile && vendorProfile?.products.length ? (
                <section className="rounded-[20px] bg-white p-8 shadow-[0_0_6px_rgba(0,0,0,0.12)]">
                  <h2 className="font-bold text-[length:var(--text-section,28px)] text-midnight">
                    Your packages
                  </h2>
                  <ul className="mt-4 space-y-3">
                    {vendorProfile.products.map((product) => (
                      <li key={product.id} className="rounded-lg border border-border p-4">
                        <p className="font-bold text-midnight">{product.name}</p>
                        {product.description ? (
                          <p className="mt-1 text-body/70 text-sm">{product.description}</p>
                        ) : null}
                        <p className="mt-2 font-bold text-primary">${product.price}</p>
                      </li>
                    ))}
                  </ul>
                </section>
              ) : (
                <section className="rounded-[20px] bg-white p-8 shadow-[0_0_6px_rgba(0,0,0,0.12)]">
                  <h2 className="font-bold text-[length:var(--text-section,28px)] text-midnight">
                    Vendor highlights
                  </h2>
                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-lg bg-orange-100 p-3">
                      <p className="font-bold text-body text-sm">Total bookings this year</p>
                      <p className="text-3xl text-midnight">{demoVendor.highlights.bookingsThisYear}</p>
                    </div>
                    <div className="rounded-lg bg-blue-100 p-3">
                      <p className="font-bold text-body text-sm">Local partnerships</p>
                      <p className="text-3xl text-midnight">{demoVendor.highlights.localPartnerships}</p>
                    </div>
                  </div>
                </section>
              )}

              <nav className="flex flex-wrap gap-4 text-midnight text-sm">
                <Link to="/account/settings/profile" className="hover:text-primary">
                  Edit account settings
                </Link>
                <Link to="/account/settings/vendor" className="hover:text-primary">
                  Vendor profile editor
                </Link>
                <Link to="/account/settings/events" className="hover:text-primary">
                  My events
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
