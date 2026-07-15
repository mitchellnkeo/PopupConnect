import type { VendorPackage } from "../../data/vendors";

type VendorPackageCardProps = {
  pkg: VendorPackage;
  onSelect: (pkg: VendorPackage) => void;
};

export function VendorPackageCard({ pkg, onSelect }: VendorPackageCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(pkg)}
      className="w-full rounded-lg border border-border p-4 text-left transition hover:border-primary/30 hover:bg-starlight/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary/40"
    >
      <p className="font-bold text-midnight">{pkg.name}</p>
      <p className="mt-1 line-clamp-2 text-body/70 text-sm">{pkg.description}</p>
      <p className="mt-2 font-bold text-primary text-lg">${pkg.price}</p>
      <p className="mt-2 text-primary text-xs font-medium">View details →</p>
    </button>
  );
}
