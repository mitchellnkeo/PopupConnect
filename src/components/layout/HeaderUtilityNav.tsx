import { Link } from "react-router-dom";
import { IconCalendar, IconComment } from "../explore/icons";

type HeaderUtilityNavProps = {
  variant?: "overlay" | "default";
};

export function HeaderUtilityNav({ variant = "default" }: HeaderUtilityNavProps) {
  const linkClass =
    variant === "overlay"
      ? "flex size-10 items-center justify-center rounded text-white transition hover:bg-white/10"
      : "flex size-10 items-center justify-center rounded text-midnight transition hover:bg-teal-100";

  return (
    <nav aria-label="Account shortcuts" className="flex items-center">
      <Link to="/account/settings/messages" className={linkClass} aria-label="Messages">
        <IconComment className="size-6" />
      </Link>
      <Link to="/account/settings/events" className={linkClass} aria-label="My events">
        <IconCalendar className="size-6" />
      </Link>
    </nav>
  );
}
