import type { VendorProfile } from "../data/vendors";

export function listingPath(vendor: Pick<VendorProfile, "id" | "slug">) {
  return `/vendor/${vendor.slug || vendor.id}`;
}

export function listingUrl(vendor: Pick<VendorProfile, "id" | "slug">) {
  if (typeof window === "undefined") return listingPath(vendor);
  return `${window.location.origin}${listingPath(vendor)}`;
}

export function listingIncludedItems(vendor: VendorProfile) {
  if (vendor.whatsIncluded.length > 0) return vendor.whatsIncluded;
  const fromPackages = vendor.packages.flatMap((pkg) => pkg.highlights ?? []);
  return [...new Set(fromPackages.filter((item) => item.trim().length > 0))];
}

export function listingContacts(vendor: VendorProfile) {
  const { website, email, instagram, phone } = vendor.contact;
  return [
    website ? { label: "Website", value: website } : null,
    email ? { label: "Email", value: email } : null,
    instagram ? { label: "Instagram", value: instagram } : null,
    phone ? { label: "Phone", value: phone } : null,
  ].filter((item): item is { label: string; value: string } => Boolean(item));
}

type BookingFact =
  | { label: string; value: number; kind: "money" }
  | { label: string; value: string; kind: "text" };

export function listingBookingFacts(vendor: VendorProfile): BookingFact[] {
  const facts: BookingFact[] = [];
  if (vendor.startingPrice > 0) {
    facts.push({ label: "Starting price", value: vendor.startingPrice, kind: "money" });
  }
  if (vendor.deposit > 0) {
    facts.push({ label: "Deposit", value: vendor.deposit, kind: "money" });
  }
  if (vendor.leadTime.trim()) {
    facts.push({ label: "Lead time", value: vendor.leadTime, kind: "text" });
  }
  if (vendor.minPartySize > 0) {
    facts.push({ label: "Minimum party size", value: String(vendor.minPartySize), kind: "text" });
  }
  if (vendor.responseTime.trim()) {
    facts.push({ label: "Response time", value: vendor.responseTime, kind: "text" });
  }
  return facts;
}
