import { Link } from "react-router-dom";
import { useAuth } from "../../features/auth/AuthContext";
import { IconCalendar, IconComment } from "../explore/icons";

type HeaderUtilityNavProps = {
  variant?: "overlay" | "default";
};

export function HeaderUtilityNav({ variant = "default" }: HeaderUtilityNavProps) {
  const { session, loading } = useAuth();

  if (loading || !session) {
    return null;
  }

  const linkClass =
    variant === "overlay"
      ? "rounded p-2.5 text-white transition hover:bg-white/10"
      : "rounded p-2.5 text-midnight transition hover:bg-neutral-100";

  return (
    <>
      <Link to="/messages" className={linkClass} aria-label="Messages">
        <IconComment className="size-[18px]" />
      </Link>
      <Link to="/when" className={linkClass} aria-label="Calendar">
        <IconCalendar className="size-[18px]" />
      </Link>
    </>
  );
}
