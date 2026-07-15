import { Link, useNavigate } from "react-router-dom";
import type { VendorProfile } from "../../data/vendors";
import { useAuth } from "../../features/auth/AuthContext";
import { btnPrimarySm, btnSecondaryOutline } from "../../lib/buttonStyles";

type VendorPreviewModalProps = {
  vendor: VendorProfile;
  onClose: () => void;
};

export function VendorPreviewModal({ vendor, onClose }: VendorPreviewModalProps) {
  const navigate = useNavigate();
  const { session } = useAuth();
  const quotePath = `/booking/quote?vendor=${vendor.id}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close preview"
        className="absolute inset-0 bg-body/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-labelledby="vendor-preview-title"
        className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[20px] bg-white shadow-xl"
      >
        {vendor.imageSrc ? (
          <img src={vendor.imageSrc} alt="" className="aspect-[16/9] w-full object-cover" />
        ) : null}

        <div className="p-8">
          <h2 id="vendor-preview-title" className="font-bold text-[length:var(--text-section,28px)] text-midnight">
            {vendor.title}
          </h2>
          <p className="mt-1 text-body/60 text-sm">{vendor.city} · {vendor.distance}</p>

          <p className="mt-4 text-body text-base leading-relaxed">{vendor.about}</p>

          <div className="mt-4 flex flex-wrap gap-2">
            {vendor.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-orange-100 px-2 py-0.5 font-medium text-orange-800 text-sm"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg bg-orange-100 p-3">
              <p className="font-bold text-body text-sm">Starting price</p>
              <p className="text-2xl text-midnight">${vendor.startingPrice}</p>
            </div>
            <div className="rounded-lg bg-blue-100 p-3">
              <p className="font-bold text-body text-sm">Response time</p>
              <p className="text-2xl text-midnight">{vendor.responseTime}</p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={onClose}
              className={btnSecondaryOutline}
            >
              Keep browsing
            </button>
            <Link
              to={`/vendor/${vendor.id}`}
              onClick={onClose}
              className={`inline-flex items-center justify-center ${btnPrimarySm}`}
            >
              View full profile
            </Link>
            {session ? (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  navigate(quotePath);
                }}
                className={btnPrimarySm}
              >
                Request quote
              </button>
            ) : (
              <Link
                to="/sign-in"
                state={{ from: quotePath }}
                onClick={onClose}
                className={`inline-flex items-center justify-center ${btnPrimarySm}`}
              >
                Sign in to request quote
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
