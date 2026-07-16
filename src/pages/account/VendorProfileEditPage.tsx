import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { authInputClass, authLabelClass } from "../../components/auth/authStyles";
import { Button } from "../../components/ui/Button";
import { useAuth } from "../../features/auth/AuthContext";
import { slugify } from "../../lib/slugify";
import { invalidateVendorCatalog } from "../../lib/vendorCatalog";
import { fetchVendorProfileByOwner, saveVendorProfile } from "../../services/vendorService";
import type { VendorProductInput, VendorProfileWithProducts } from "../../types/database";

type ProductDraft = {
  key: string;
  name: string;
  description: string;
  price: string;
  highlights: string;
};

function emptyProduct(): ProductDraft {
  return {
    key: crypto.randomUUID(),
    name: "",
    description: "",
    price: "",
    highlights: "",
  };
}

function profileToDrafts(profile: VendorProfileWithProducts | null): ProductDraft[] {
  if (!profile?.products.length) {
    return [emptyProduct()];
  }

  return profile.products.map((product) => ({
    key: product.id,
    name: product.name,
    description: product.description ?? "",
    price: String(product.price),
    highlights: product.highlights.join("\n"),
  }));
}

export function VendorProfileEditPage() {
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [slugTouched, setSlugTouched] = useState(false);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [city, setCity] = useState("");
  const [about, setAbout] = useState("");
  const [idealFor, setIdealFor] = useState("");
  const [startingPrice, setStartingPrice] = useState("");
  const [deposit, setDeposit] = useState("");
  const [leadTime, setLeadTime] = useState("");
  const [minPartySize, setMinPartySize] = useState("");
  const [responseTime, setResponseTime] = useState("");
  const [published, setPublished] = useState(false);
  const [products, setProducts] = useState<ProductDraft[]>([emptyProduct()]);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    let mounted = true;

    fetchVendorProfileByOwner(user.id)
      .then((existing) => {
        if (!mounted) return;
        if (existing) {
          setTitle(existing.title);
          setSlug(existing.slug);
          setSlugTouched(true);
          setCity(existing.city ?? "");
          setAbout(existing.about ?? "");
          setIdealFor(existing.ideal_for ?? "");
          setStartingPrice(existing.starting_price != null ? String(existing.starting_price) : "");
          setDeposit(existing.deposit != null ? String(existing.deposit) : "");
          setLeadTime(existing.lead_time ?? "");
          setMinPartySize(existing.min_party_size != null ? String(existing.min_party_size) : "");
          setResponseTime(existing.response_time ?? "");
          setPublished(existing.published);
          setProducts(profileToDrafts(existing));
        }
      })
      .catch((err) => {
        if (mounted) {
          setError(err instanceof Error ? err.message : "Could not load vendor profile.");
        }
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [user]);

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!slugTouched) {
      setSlug(slugify(value));
    }
  }

  function updateProduct(key: string, patch: Partial<ProductDraft>) {
    setProducts((current) => current.map((p) => (p.key === key ? { ...p, ...patch } : p)));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;

    setError(null);
    setMessage(null);

    const trimmedTitle = title.trim();
    const trimmedSlug = slugify(slug || trimmedTitle);

    if (!trimmedTitle || !trimmedSlug) {
      setError("Business name and URL slug are required.");
      return;
    }

    const productInputs: VendorProductInput[] = products
      .filter((p) => p.name.trim())
      .map((p, index) => ({
        name: p.name.trim(),
        description: p.description.trim() || null,
        price: Number.parseFloat(p.price) || 0,
        highlights: p.highlights
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean),
        sort_order: index,
      }));

    setSaving(true);
    try {
      await saveVendorProfile(
        user.id,
        {
          slug: trimmedSlug,
          title: trimmedTitle,
          city: city.trim() || null,
          about: about.trim() || null,
          ideal_for: idealFor.trim() || null,
          starting_price: startingPrice ? Number.parseFloat(startingPrice) : null,
          deposit: deposit ? Number.parseFloat(deposit) : null,
          lead_time: leadTime.trim() || null,
          min_party_size: minPartySize ? Number.parseInt(minPartySize, 10) : null,
          response_time: responseTime.trim() || null,
          published,
        },
        productInputs,
      );
      invalidateVendorCatalog();
      setMessage("Vendor profile saved.");
      setSlug(trimmedSlug);
      setSlugTouched(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save vendor profile.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="text-neutral-500 text-sm">Loading vendor profile…</p>;
  }

  if (!profile?.roles.includes("vendor")) {
    return (
      <div className="rounded-xl border border-border bg-white p-6">
        <h1 className="font-semibold text-2xl text-midnight">Vendor profile</h1>
        <p className="mt-3 text-neutral-600 text-sm leading-relaxed">
          Add the <strong>Creative vendor</strong> role in{" "}
          <Link to="/account/settings/profile" className="text-primary hover:underline">
            My profile
          </Link>{" "}
          to create and manage a public vendor page.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-white p-6 md:p-8">
      <h1 className="font-semibold text-2xl text-midnight">Edit vendor profile</h1>
      <p className="mt-2 text-neutral-600 text-sm">
        Manage your public business page and bookable packages. Published profiles can be listed on
        explore once connected to live search.
      </p>

      <form className="mt-8 space-y-6" onSubmit={(e) => void handleSubmit(e)}>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label htmlFor="vendor-title" className={authLabelClass}>
              Business name
            </label>
            <input
              id="vendor-title"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className={authInputClass}
              required
            />
          </div>

          <div>
            <label htmlFor="vendor-slug" className={authLabelClass}>
              Public URL slug
            </label>
            <input
              id="vendor-slug"
              value={slug}
              onChange={(e) => {
                setSlugTouched(true);
                setSlug(slugify(e.target.value));
              }}
              className={authInputClass}
              required
            />
            <p className="mt-1 text-neutral-500 text-xs">/vendor/{slug || "your-slug"}</p>
          </div>

          <div>
            <label htmlFor="vendor-city" className={authLabelClass}>
              City
            </label>
            <input
              id="vendor-city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className={authInputClass}
            />
          </div>
        </div>

        <div>
          <label htmlFor="vendor-about" className={authLabelClass}>
            About
          </label>
          <textarea
            id="vendor-about"
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            rows={4}
            className={authInputClass}
          />
        </div>

        <div>
          <label htmlFor="vendor-ideal-for" className={authLabelClass}>
            Ideal for
          </label>
          <textarea
            id="vendor-ideal-for"
            value={idealFor}
            onChange={(e) => setIdealFor(e.target.value)}
            rows={2}
            className={authInputClass}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label htmlFor="starting-price" className={authLabelClass}>
              Starting price ($)
            </label>
            <input
              id="starting-price"
              type="number"
              min="0"
              step="0.01"
              value={startingPrice}
              onChange={(e) => setStartingPrice(e.target.value)}
              className={authInputClass}
            />
          </div>
          <div>
            <label htmlFor="deposit" className={authLabelClass}>
              Deposit ($)
            </label>
            <input
              id="deposit"
              type="number"
              min="0"
              step="0.01"
              value={deposit}
              onChange={(e) => setDeposit(e.target.value)}
              className={authInputClass}
            />
          </div>
          <div>
            <label htmlFor="lead-time" className={authLabelClass}>
              Lead time
            </label>
            <input
              id="lead-time"
              value={leadTime}
              onChange={(e) => setLeadTime(e.target.value)}
              className={authInputClass}
              placeholder="e.g. 2 days"
            />
          </div>
          <div>
            <label htmlFor="min-party" className={authLabelClass}>
              Minimum party size
            </label>
            <input
              id="min-party"
              type="number"
              min="1"
              value={minPartySize}
              onChange={(e) => setMinPartySize(e.target.value)}
              className={authInputClass}
            />
          </div>
          <div>
            <label htmlFor="response-time" className={authLabelClass}>
              Response time
            </label>
            <input
              id="response-time"
              value={responseTime}
              onChange={(e) => setResponseTime(e.target.value)}
              className={authInputClass}
              placeholder="e.g. 2 hours"
            />
          </div>
        </div>

        <label className="flex cursor-pointer items-center gap-3 text-sm">
          <input
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
            className="accent-primary"
          />
          <span className="text-midnight">Publish my vendor profile publicly</span>
        </label>

        <div>
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-semibold text-lg text-midnight">Packages</h2>
            <button
              type="button"
              onClick={() => setProducts((current) => [...current, emptyProduct()])}
              className="text-primary text-sm font-medium hover:underline"
            >
              Add package
            </button>
          </div>

          <div className="mt-4 space-y-4">
            {products.map((product, index) => (
              <div key={product.key} className="rounded-lg border border-border p-4">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-medium text-midnight text-sm">Package {index + 1}</p>
                  {products.length > 1 ? (
                    <button
                      type="button"
                      onClick={() =>
                        setProducts((current) => current.filter((p) => p.key !== product.key))
                      }
                      className="text-neutral-500 text-xs hover:text-primary"
                    >
                      Remove
                    </button>
                  ) : null}
                </div>
                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  <input
                    value={product.name}
                    onChange={(e) => updateProduct(product.key, { name: e.target.value })}
                    placeholder="Package name"
                    className={authInputClass}
                  />
                  <input
                    value={product.price}
                    onChange={(e) => updateProduct(product.key, { price: e.target.value })}
                    placeholder="Price"
                    type="number"
                    min="0"
                    step="0.01"
                    className={authInputClass}
                  />
                </div>
                <textarea
                  value={product.description}
                  onChange={(e) => updateProduct(product.key, { description: e.target.value })}
                  placeholder="Short description"
                  rows={2}
                  className={`mt-3 ${authInputClass}`}
                />
                <textarea
                  value={product.highlights}
                  onChange={(e) => updateProduct(product.key, { highlights: e.target.value })}
                  placeholder="Highlights (one per line)"
                  rows={3}
                  className={`mt-3 ${authInputClass}`}
                />
              </div>
            ))}
          </div>
        </div>

        {error ? (
          <p className="text-primary text-sm" role="alert">
            {error}
          </p>
        ) : null}
        {message ? (
          <p className="text-midnight text-sm" role="status">
            {message}
          </p>
        ) : null}

        <Button type="submit" disabled={saving}>
          {saving ? "Saving…" : "Save vendor profile"}
        </Button>
      </form>
    </div>
  );
}
