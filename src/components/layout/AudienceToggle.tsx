import { Link, useLocation, useSearchParams } from "react-router-dom";
import { VENDORS_HOME, VENUES_HOME } from "../../lib/discoveryHome";

type AudienceToggleProps = {
  variant?: "overlay" | "default";
};

export function AudienceToggle({ variant = "default" }: AudienceToggleProps) {
  const location = useLocation();
  const [params] = useSearchParams();
  const exploringVenues =
    location.pathname.startsWith("/explore") &&
    (params.get("category") === "venues" || Boolean(params.get("categories")?.includes("venues")));
  const venues = location.pathname === VENUES_HOME || exploringVenues;

  const shell = variant === "overlay" ? "bg-white/60" : "bg-[rgba(0,50,51,0.1)]";
  const idle = variant === "overlay" ? "text-white" : "text-body";

  return (
    <nav aria-label="Discovery" className={`flex items-center overflow-hidden rounded-full p-1 ${shell}`}>
      <Link
        to={VENDORS_HOME}
        className={`flex h-10 items-center rounded-full px-5 text-lg ${
          venues ? idle : "bg-teal-600 text-white"
        }`}
      >
        Vendors
      </Link>
      <Link
        to={VENUES_HOME}
        className={`flex h-10 items-center rounded-full px-5 text-lg ${
          venues ? "bg-teal-600 text-white" : idle
        }`}
      >
        Venues
      </Link>
    </nav>
  );
}
