import { Link, useSearchParams } from "react-router-dom";

type AudienceToggleProps = {
  variant?: "overlay" | "default";
};

export function AudienceToggle({ variant = "default" }: AudienceToggleProps) {
  const [params] = useSearchParams();
  const venues = params.get("category") === "venues" || params.get("categories")?.includes("venues");

  const shell =
    variant === "overlay"
      ? "bg-white/60"
      : "bg-[rgba(0,50,51,0.1)]";

  const idle =
    variant === "overlay" ? "text-body" : "text-body";

  return (
    <nav
      aria-label="Discovery"
      className={`hidden items-center overflow-hidden rounded-full p-1 sm:flex ${shell}`}
    >
      <Link
        to="/explore"
        className={`flex h-10 items-center rounded-full px-5 text-lg ${
          venues ? idle : "bg-teal-600 text-white"
        }`}
      >
        Vendors
      </Link>
      <Link
        to="/explore?category=venues"
        className={`flex h-10 items-center rounded-full px-5 text-lg ${
          venues ? "bg-teal-600 text-white" : idle
        }`}
      >
        Venues
      </Link>
    </nav>
  );
}
