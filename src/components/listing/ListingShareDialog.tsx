import { useEffect, useState } from "react";
import { btnPrimarySm, btnSecondaryOutline } from "../../lib/buttonStyles";
import { downloadDataUrl, qrDataUrl } from "../../lib/qr";

type ListingShareDialogProps = {
  title: string;
  url: string;
  onClose: () => void;
};

export function ListingShareDialog({ title, url, onClose }: ListingShareDialogProps) {
  const [qr, setQr] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    qrDataUrl(url)
      .then((dataUrl) => {
        if (!cancelled) setQr(dataUrl);
      })
      .catch(() => {
        if (!cancelled) setError("Could not generate a QR code.");
      });
    return () => {
      cancelled = true;
    };
  }, [url]);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
      setError("Could not copy the link.");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close share dialog"
        className="absolute inset-0 bg-body/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-labelledby="listing-share-title"
        className="relative w-full max-w-md rounded-[20px] bg-white p-8 shadow-xl"
      >
        <h2 id="listing-share-title" className="font-bold text-[length:var(--text-section,28px)] text-midnight">
          Share this listing
        </h2>
        <p className="mt-1 text-body/60 text-sm">{title}</p>
        <p className="mt-3 break-all text-body text-sm">{url}</p>

        {qr ? (
          <img src={qr} alt={`QR code for ${title}`} className="mx-auto mt-6 h-56 w-56" />
        ) : (
          <p className="mt-6 text-body/60 text-sm">Creating QR code…</p>
        )}

        {error ? <p className="mt-3 text-primary text-sm">{error}</p> : null}

        <div className="mt-8 flex flex-wrap gap-3">
          <button type="button" onClick={onClose} className={btnSecondaryOutline}>
            Close
          </button>
          <button type="button" onClick={() => void copyLink()} className={btnSecondaryOutline}>
            {copied ? "Copied" : "Copy link"}
          </button>
          {qr ? (
            <button
              type="button"
              className={btnPrimarySm}
              onClick={() => downloadDataUrl(`${title.replace(/\s+/g, "-").toLowerCase()}-qr.png`, qr)}
            >
              Download QR
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
