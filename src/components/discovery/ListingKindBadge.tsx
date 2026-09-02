import { listingKindOf, type ListingKind, type VendorProfile } from "../../data/vendors";

export function ListingKindBadge({
  kind,
  className = "",
}: {
  kind?: ListingKind | VendorProfile;
  className?: string;
}) {
  const resolved = typeof kind === "string" || kind == null ? (kind ?? "vendor") : listingKindOf(kind);
  const isHost = resolved === "host";

  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 font-medium text-[11px] uppercase tracking-wide ${
        isHost ? "bg-midnight text-white" : "bg-starlight text-midnight"
      } ${className}`.trim()}
    >
      {isHost ? "Space" : "Vendor"}
    </span>
  );
}
