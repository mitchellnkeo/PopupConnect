import { Link } from "react-router-dom";

type GuestNavLinksProps = {
  variant?: "overlay" | "default";
};

const links = [
  { to: "/explore", label: "Find vendors" },
  { to: "/explore?category=venues", label: "Find venues" },
  { to: "/#how-it-works", label: "How it works" },
] as const;

export function GuestNavLinks({ variant = "default" }: GuestNavLinksProps) {
  const linkClass =
    variant === "overlay"
      ? "flex h-10 items-center rounded-lg px-5 text-base text-white transition hover:bg-white/10"
      : "flex h-10 items-center rounded-lg px-5 text-base text-body transition hover:text-primary";

  return (
    <nav aria-label="Primary" className="hidden items-center gap-2 lg:flex">
      {links.map((item) => (
        <Link key={item.label} to={item.to} className={linkClass}>
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
