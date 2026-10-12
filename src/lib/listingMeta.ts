import type { VendorProfile } from "../data/vendors";

function titleCase(value: string) {
  return value
    .split(/\s+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function listingMetaLine(
  vendor: Pick<VendorProfile, "city" | "tags"> & { maxGuests?: number },
) {
  const guestTag = vendor.tags.find((tag) => /\d+\s*guests?/i.test(tag));
  const typeTag = vendor.tags.find((tag) => tag !== guestTag);
  const guestMatch = guestTag?.match(/(\d+)/);
  const guestCount = guestMatch?.[1] ?? (vendor.maxGuests != null ? String(vendor.maxGuests) : null);
  const guest = guestCount ? `Max ${guestCount} guests` : null;
  const type = typeTag ? titleCase(typeTag) : null;

  return [vendor.city, type, guest].filter(Boolean).join("  ·  ");
}
