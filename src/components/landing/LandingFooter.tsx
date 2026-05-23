import { Link } from "react-router-dom";
import { LogoMarkLight } from "./icons";

const footerLinks = [
  { to: "/", label: "home" },
  { to: "/about", label: "about us" },
  { to: "/about", label: "2026" },
] as const;

export function LandingFooter() {
  return (
    <footer className="bg-primary px-4 py-14 text-white md:px-6">
      <div className="mx-auto flex max-w-6xl flex-col items-center text-center">
        <Link to="/" className="flex items-center gap-2">
          <LogoMarkLight className="h-7 w-11" />
          <span className="font-semibold text-sm uppercase tracking-widest">PopupConnect</span>
        </Link>

        <nav aria-label="Footer" className="mt-8 flex flex-col gap-3">
          {footerLinks.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className="text-sm lowercase transition hover:text-white/80"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
