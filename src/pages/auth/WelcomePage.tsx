import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { OnboardingCard, OnboardingChrome } from "../../components/onboarding/OnboardingChrome";
import {
  OnboardingNav,
  OnboardingProgressBar,
  OnboardingSelect,
  OnboardingTertiaryButton,
  OnboardingTextField,
  RoleOptionCard,
} from "../../components/onboarding/OnboardingFields";
import { ProtectedRoute } from "../../components/auth/ProtectedRoute";
import { useAuth } from "../../features/auth/AuthContext";
import { getFirstName } from "../../lib/authRouting";
import {
  BUSINESS_ROLES,
  PHONE_TYPES,
  VENDOR_TYPES,
  onboardingProgress,
  vendorTypeById,
  type BusinessRole,
  type OnboardingAudience,
  type OnboardingStep,
  type PhoneType,
  type VendorTypeId,
} from "../../lib/onboarding";
import { slugify } from "../../lib/slugify";
import { setProfileRoles, updateProfile } from "../../services/profileService";
import { fetchVendorProfileByOwner, saveVendorProfile } from "../../services/vendorService";

type PhoneDraft = {
  id: string;
  number: string;
  type: PhoneType;
};

function emptyPhone(): PhoneDraft {
  return { id: crypto.randomUUID(), number: "", type: "Mobile" };
}

function WelcomeContent({ preview = false }: { preview?: boolean }) {
  const navigate = useNavigate();
  const location = useLocation();
  const returnTo = (location.state as { from?: string } | null)?.from ?? "/explore";
  const { user, profile, loading, refreshProfile } = useAuth();

  const [step, setStep] = useState<OnboardingStep>("audience");
  const [audience, setAudience] = useState<OnboardingAudience | null>(null);
  const [vendorType, setVendorType] = useState<VendorTypeId | "">("");
  const [businessName, setBusinessName] = useState("");
  const [businessRole, setBusinessRole] = useState<BusinessRole | "">("");
  const [phones, setPhones] = useState<PhoneDraft[]>([emptyPhone()]);
  const [address1, setAddress1] = useState("");
  const [city, setCity] = useState("");
  const [region, setRegion] = useState("");
  const [zip, setZip] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!preview && !loading && profile?.onboarding_completed) {
      navigate(returnTo, { replace: true });
    }
  }, [preview, loading, profile?.onboarding_completed, navigate, returnTo]);

  useEffect(() => {
    if (profile?.roles.includes("vendor")) setAudience("vendor");
    else if (profile?.roles.includes("host")) setAudience("host");
  }, [profile?.roles]);

  const firstName = preview ? "Mary" : getFirstName(profile, user?.user_metadata);
  const detailsStarted = audience === "host" || Boolean(vendorType);
  const detailsReady =
    Boolean(businessName.trim() && businessRole) && (audience === "host" || Boolean(vendorType));

  function handleAudience(next: OnboardingAudience) {
    setAudience(next);
    if (next === "host") setVendorType("");
    setError(null);
    setStep("details");
  }

  async function completeOnboarding() {
    if (preview) {
      navigate(returnTo, { replace: true });
      return;
    }
    if (!user || !audience) return;

    setSubmitting(true);
    setError(null);

    try {
      const role = audience === "vendor" ? "vendor" : "host";
      await setProfileRoles(user.id, [role]);

      if (audience === "vendor" && businessName.trim()) {
        const existing = await fetchVendorProfileByOwner(user.id);
        const category = vendorTypeById(vendorType);
        const baseSlug = slugify(businessName) || `vendor-${user.id.slice(0, 8)}`;
        const slug = existing?.slug ?? `${baseSlug}-${user.id.replace(/-/g, "").slice(0, 6)}`;
        const cityLine = [city.trim(), region.trim()].filter(Boolean).join(", ") || city.trim();
        const products =
          existing?.products.map((product) => ({
            id: product.id,
            name: product.name,
            description: product.description,
            price: product.price,
            highlights: product.highlights,
            sort_order: product.sort_order,
          })) ?? [];

        await saveVendorProfile(
          user.id,
          {
            slug,
            title: businessName.trim(),
            city: cityLine || existing?.city || null,
            category_ids: category ? [category.categoryId] : existing?.category_ids,
            published: existing?.published ?? false,
            about: existing?.about,
            ideal_for: existing?.ideal_for,
            starting_price: existing?.starting_price,
            deposit: existing?.deposit,
            lead_time: existing?.lead_time,
            min_party_size: existing?.min_party_size,
            response_time: existing?.response_time,
            image_url: existing?.image_url,
            hero_image_url: existing?.hero_image_url,
            lat: existing?.lat,
            lng: existing?.lng,
          },
          products,
        );
      }

      await updateProfile(user.id, {
        display_name: profile?.display_name ?? null,
        avatar_url: profile?.avatar_url ?? null,
        onboarding_completed: true,
      });
      await refreshProfile();
      navigate(returnTo, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save your profile.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!preview && loading) {
    return (
      <OnboardingChrome>
        <p className="text-center text-midnight/60 text-sm">Loading…</p>
      </OnboardingChrome>
    );
  }

  return (
    <OnboardingChrome>
      <OnboardingCard>
        <OnboardingProgressBar value={onboardingProgress(step, detailsStarted)} />

        <div className="flex w-full flex-col gap-2">
          <h1 className="font-bold text-[28px] text-midnight leading-none">
            Hi {firstName}, Welcome to Freqnt!
          </h1>
          <p className="text-[22px] text-midnight leading-none">
            A few quick questions and we’ll set things up for you
          </p>
        </div>

        {step === "audience" ? (
          <fieldset className="flex w-full flex-col gap-[18px] border-none p-0">
            <legend className="text-[16px] text-midnight">Are you a vendor or venue host?</legend>
            <div className="flex flex-wrap gap-6">
              <RoleOptionCard
                label="I am a vendor"
                selected={audience === "vendor"}
                onSelect={() => handleAudience("vendor")}
              />
              <RoleOptionCard
                label="I am a venue host"
                selected={audience === "host"}
                onSelect={() => handleAudience("host")}
              />
            </div>
          </fieldset>
        ) : null}

        {step === "details" ? (
          <div className="flex w-full flex-col gap-[18px]">
            {audience === "vendor" ? (
              <OnboardingSelect
                label="Type of vendor"
                value={vendorType}
                onChange={setVendorType}
                options={VENDOR_TYPES.map((type) => ({ value: type.id, label: type.label }))}
              />
            ) : null}

            {detailsStarted ? (
              <>
                <OnboardingTextField
                  label="Name of your business"
                  value={businessName}
                  onChange={setBusinessName}
                  autoComplete="organization"
                />
                <OnboardingSelect
                  label="What is your role?"
                  value={businessRole}
                  onChange={setBusinessRole}
                  options={BUSINESS_ROLES}
                />
              </>
            ) : null}

            <OnboardingNav
              onBack={() => {
                setError(null);
                setStep("audience");
              }}
              onNext={() => {
                setError(null);
                setStep("contact");
              }}
              nextDisabled={!detailsReady}
            />
          </div>
        ) : null}

        {step === "contact" ? (
          <div className="flex w-full flex-col gap-8">
            <div className="flex w-full flex-col gap-[18px]">
              <h2 className="text-center font-medium text-[18px] text-midnight leading-none">
                Contact information
              </h2>
              {phones.map((phone, index) => (
                <div key={phone.id} className="flex w-full flex-col gap-[18px] sm:flex-row">
                  <OnboardingTextField
                    label="Phone number"
                    value={phone.number}
                    onChange={(number) =>
                      setPhones((current) =>
                        current.map((item) => (item.id === phone.id ? { ...item, number } : item)),
                      )
                    }
                    type="tel"
                    autoComplete={index === 0 ? "tel" : "off"}
                  />
                  <OnboardingSelect
                    label="Phone number type"
                    value={phone.type}
                    onChange={(type) =>
                      setPhones((current) =>
                        current.map((item) => (item.id === phone.id ? { ...item, type } : item)),
                      )
                    }
                    options={PHONE_TYPES}
                  />
                </div>
              ))}
              <OnboardingTertiaryButton
                onClick={() => setPhones((current) => [...current, emptyPhone()])}
              >
                + phone number
              </OnboardingTertiaryButton>
            </div>

            <div className="flex w-full flex-col gap-[18px]">
              <h2 className="text-center font-medium text-[18px] text-midnight leading-none">
                Address (optional)
              </h2>
              <OnboardingTextField
                label="Address 1"
                value={address1}
                onChange={setAddress1}
                autoComplete="address-line1"
              />
              <div className="flex w-full flex-col gap-[18px] sm:flex-row">
                <OnboardingTextField
                  label="City"
                  value={city}
                  onChange={setCity}
                  autoComplete="address-level2"
                />
                <OnboardingTextField
                  label="State"
                  value={region}
                  onChange={setRegion}
                  autoComplete="address-level1"
                />
              </div>
              <OnboardingTextField
                label="Zip code"
                value={zip}
                onChange={setZip}
                autoComplete="postal-code"
              />
            </div>

            {error ? (
              <p className="text-primary text-sm" role="alert">
                {error}
              </p>
            ) : null}

            <OnboardingNav
              onBack={() => {
                setError(null);
                setStep("details");
              }}
              onNext={completeOnboarding}
              nextLabel="Skip for later"
              nextBusy={submitting}
            />
          </div>
        ) : null}

        {step !== "contact" && error ? (
          <p className="text-primary text-sm" role="alert">
            {error}
          </p>
        ) : null}
      </OnboardingCard>
    </OnboardingChrome>
  );
}

export function WelcomePage() {
  const [params] = useSearchParams();
  const preview = import.meta.env.DEV && params.get("preview") === "1";

  if (preview) {
    return <WelcomeContent preview />;
  }

  return (
    <ProtectedRoute>
      <WelcomeContent />
    </ProtectedRoute>
  );
}
