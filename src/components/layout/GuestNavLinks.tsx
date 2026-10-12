import { Link, useLocation, useSearchParams } from "react-router-dom";

type GuestNavLinksProps = {
  variant?: "overlay" | "default";
};

const links = [
  { to: "/explore", label: "Find vendors", venues: false },
  { to: "/explore?category=venues", label: "Find venues", venues: true },
] as const;

export function GuestNavLinks({ variant = "default" }: GuestNavLinksProps) {
  const location = useLocation();
  const [params] = useSearchParams();
  const venuesActive =
    params.get("category") === "venues" || Boolean(params.get("categories")?.includes("venues"));

  return (
    <nav aria-label="Primary" className="flex items-center gap-1 sm:gap-8">
      {links.map((item) => {
        const active =
          item.venues
            ? venuesActive
            : location.pathname === "/" || (location.pathname.startsWith("/explore") && !venuesActive);

        const color = active
          ? variant === "overlay"
            ? "text-teal-100"
            : "text-teal-600"
          : variant === "overlay"
            ? "text-white"
            : "text-body";

        const weight = active ? "font-medium" : "font-normal";

        return (
          <Link
            key={item.label}
            to={item.to}
            className={`flex h-10 items-center rounded-lg px-5 text-base ${color} ${weight} transition hover:text-primary`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
