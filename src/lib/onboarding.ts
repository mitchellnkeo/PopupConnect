export type OnboardingAudience = "vendor" | "host";
export type OnboardingStep = "audience" | "details" | "contact";

export const VENDOR_TYPES = [
  { id: "food-beverage", label: "Food & Beverage", categoryId: "catering" },
  { id: "photo-video", label: "Photo & Video", categoryId: "photo-booth" },
  { id: "music-entertainment", label: "Music & Entertainment", categoryId: "dj-live-music" },
  { id: "decor-florals", label: "Decor & Florals", categoryId: "crafts" },
  { id: "rentals-structure", label: "Rentals & Structure", categoryId: "venues" },
  { id: "beauty", label: "Beauty", categoryId: "crafts" },
  { id: "clothing-attire", label: "Clothing and Attire", categoryId: "crafts" },
  { id: "production-av", label: "Production & A/V", categoryId: "photo-booth" },
  { id: "services-logistics", label: "Services & Logistics", categoryId: "crafts" },
] as const;

export type VendorTypeId = (typeof VENDOR_TYPES)[number]["id"];

export const BUSINESS_ROLES = ["Owner/Co-Owner", "Individual contributor"] as const;
export type BusinessRole = (typeof BUSINESS_ROLES)[number];

export const PHONE_TYPES = ["Mobile", "Office", "Home"] as const;
export type PhoneType = (typeof PHONE_TYPES)[number];

export function vendorTypeById(id: string | null) {
  return VENDOR_TYPES.find((type) => type.id === id) ?? null;
}

/** Progress fill widths from the Figma bar (244 / 595 / 848 of ~904). */
export function onboardingProgress(step: OnboardingStep, detailsStarted: boolean): number {
  if (step === "contact") return 94;
  if (step === "details" && detailsStarted) return 66;
  return 27;
}
