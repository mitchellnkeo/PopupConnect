import type { VendorPackage } from "../../data/vendors";
import { btnPrimarySm, btnSecondaryOutline } from "../../lib/buttonStyles";

type VendorPackagePopoutProps = {
  pkg: VendorPackage;
  vendorTitle: string;
  onClose: () => void;
  onQuote?: () => void;
  quoteLabel?: string;
};

export function VendorPackagePopout({
  pkg,
  vendorTitle,
  onClose,
  onQuote,
  quoteLabel = "Request quote",
}: VendorPackagePopoutProps) {
  const highlights =
    pkg.highlights && pkg.highlights.length > 0
      ? pkg.highlights
      : [pkg.description];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close package details"
        className="absolute inset-0 bg-body/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-labelledby="package-popout-title"
        className="relative w-full max-w-md rounded-[20px] bg-white p-8 shadow-xl"
      >
        <h2 id="package-popout-title" className="font-bold text-[length:var(--text-section,28px)] text-midnight">
          {pkg.name}
        </h2>
        <p className="mt-1 text-body/60 text-sm">{vendorTitle}</p>

        <p className="mt-4 text-body text-base leading-relaxed">{pkg.description}</p>

        <ul className="mt-4 list-disc space-y-2 pl-5 text-body text-sm">
          {highlights.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        <p className="mt-6 font-bold text-[length:var(--text-section,28px)] text-primary">${pkg.price}</p>

        <div className="mt-8 flex flex-wrap gap-3">
          <button type="button" onClick={onClose} className={btnSecondaryOutline}>
            Close
          </button>
          {onQuote ? (
            <button type="button" onClick={onQuote} className={btnPrimarySm}>
              {quoteLabel}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
