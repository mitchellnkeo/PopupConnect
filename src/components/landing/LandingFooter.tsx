import { Link } from "react-router-dom";
import { LogoMarkLight } from "./icons";

const footerLinks = [
  { to: "/", label: "home" },
  { to: "/about", label: "about us" },
] as const;

export function LandingFooter() {
  return (
    <footer className="bg-primary px-6 py-5 text-white md:px-[60px]">
      <div className="mx-auto flex max-w-[1600px] flex-col items-center gap-3 text-center">
        <Link to="/" className="flex items-center gap-1">
          <LogoMarkLight className="size-[18px]" />
          <span className="font-bold text-[length:var(--text-footer-logo,18px)] uppercase">
            PopupConnect
          </span>
        </Link>

        <nav aria-label="Footer" className="flex flex-col gap-3">
          {footerLinks.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className="text-[length:var(--text-footer,18px)] lowercase transition hover:text-white/80"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <p className="text-[length:var(--text-footer,18px)]">2026</p>
      </div>
    </footer>
  );
}
