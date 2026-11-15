import { Link } from "react-router-dom";
import { useUnreadThreadCount } from "../../hooks/useUnreadThreadCount";
import { IconCalendar, IconComment } from "../explore/icons";

type HeaderUtilityNavProps = {
  variant?: "overlay" | "default";
};

export function HeaderUtilityNav({ variant = "default" }: HeaderUtilityNavProps) {
  const unread = useUnreadThreadCount();
  const unreadLabel = unread > 9 ? "9+" : String(unread);
  const linkClass =
    variant === "overlay"
      ? "flex size-10 items-center justify-center rounded text-white transition hover:bg-white/10"
      : "flex size-10 items-center justify-center rounded text-midnight transition hover:bg-teal-100";

  return (
    <nav aria-label="Account shortcuts" className="flex items-center">
      <Link
        to="/account/settings/messages"
        className={`relative ${linkClass}`}
        aria-label={unread > 0 ? `Messages, ${unread} unread` : "Messages"}
      >
        <IconComment className="size-6" />
        {unread > 0 ? (
          <span className="absolute top-0.5 right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 font-semibold text-[10px] text-white">
            {unreadLabel}
          </span>
        ) : null}
      </Link>
      <Link to="/account/settings/events" className={linkClass} aria-label="My events">
        <IconCalendar className="size-6" />
      </Link>
    </nav>
  );
}
