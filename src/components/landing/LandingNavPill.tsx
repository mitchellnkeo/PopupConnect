import { Link } from "react-router-dom";

type LandingNavPillProps = {
  variant?: "light" | "dark";
};

const links = [
  { to: "/where", label: "where" },
  { to: "/when", label: "when" },
  { to: "/explore", label: "explore" },
] as const;

export function LandingNavPill({ variant = "light" }: LandingNavPillProps) {
  const isLight = variant === "light";

  return (
    <nav
      aria-label="Primary"
      className={
        isLight
          ? "flex divide-x divide-neutral-200/80 rounded-full bg-white/95 px-1 py-1 shadow-md backdrop-blur-sm"
          : "flex divide-x divide-neutral-200 rounded-full border border-neutral-200 bg-white px-1 py-1 shadow-sm"
      }
    >
      {links.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          className="rounded-full px-5 py-2 font-medium text-midnight text-sm lowercase transition hover:bg-starlight/50"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
