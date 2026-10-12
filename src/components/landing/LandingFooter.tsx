import { Link } from "react-router-dom";
import { BrandLogo } from "../brand/BrandLogo";

const discover = [
  { to: "/explore?category=venues", label: "Spaces" },
  { to: "/explore", label: "Vendors & artists" },
  { to: "/explore", label: "Pop-ups & events" },
] as const;

const participate = [
  { to: "/sign-up", label: "Create a profile" },
  { to: "/sign-up", label: "List a space" },
  { to: "/sign-up", label: "Plan an event" },
] as const;

const about = [
  { to: "/#how-it-works", label: "How it works" },
  { to: "/about", label: "Community journal" },
  { to: "/about", label: "Contact us" },
] as const;

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: readonly { to: string; label: string }[];
}) {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-4">
      <p className="font-medium text-lg text-midnight">{title}</p>
      {links.map((item) => (
        <Link
          key={item.label}
          to={item.to}
          className="font-medium text-body/60 text-sm transition hover:text-primary"
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
}

function LegalBar() {
  return (
    <div className="flex flex-col gap-3 border-border border-t py-[18px] text-center text-body text-lg sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center justify-center gap-3">
        <span>2026 freqnt.club</span>
        <span aria-hidden>·</span>
        <Link to="/about" className="hover:text-primary">
          Privacy
        </Link>
        <span aria-hidden>·</span>
        <Link to="/about" className="hover:text-primary">
          Terms
        </Link>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <span>English (US)</span>
        <span aria-hidden>·</span>
        <Link to="/about" className="hover:text-primary">
          Contact Us
        </Link>
      </div>
    </div>
  );
}

export function LandingFooter() {
  return (
    <footer className="bg-white pt-16">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-12 px-6 md:px-[72px]">
        <div className="flex flex-col gap-12 md:flex-row md:gap-20">
          <div className="flex w-full max-w-[420px] flex-col gap-5">
            <BrandLogo />
            <p className="text-base text-body">
              People, places, and possibilities. A community marketplace for making things happen.
            </p>
          </div>
          <FooterColumn title="Discover" links={discover} />
          <FooterColumn title="Participate" links={participate} />
          <FooterColumn title="Get to know us" links={about} />
        </div>
        <LegalBar />
      </div>
    </footer>
  );
}
