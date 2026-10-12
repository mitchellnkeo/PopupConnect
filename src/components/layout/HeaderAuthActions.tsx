import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../features/auth/AuthContext";
import { getReturnPath } from "../../lib/authRouting";
import { UserAccountMenu } from "../auth/UserAccountMenu";
import { HeaderUtilityNav } from "./HeaderUtilityNav";

type HeaderAuthActionsProps = {
  variant?: "overlay" | "default";
};

export function HeaderAuthActions({ variant = "default" }: HeaderAuthActionsProps) {
  const { session, loading } = useAuth();
  const location = useLocation();
  const returnTo = getReturnPath(location.pathname, location.search);
  const overlay = variant === "overlay";

  if (loading) {
    return <div className="size-10" aria-hidden />;
  }

  if (session) {
    return (
      <div className="flex items-center gap-1">
        <HeaderUtilityNav variant={variant} />
        <UserAccountMenu variant={variant} />
      </div>
    );
  }

  const loginClass = overlay
    ? "flex h-10 items-center rounded px-3 text-[19px] text-teal-100 transition hover:bg-white/10"
    : "flex h-10 items-center rounded px-3 text-[19px] text-teal-800 transition hover:bg-teal-100";

  return (
    <div className="flex items-center gap-[18px]">
      <Link to="/sign-in" state={{ from: returnTo }} className={loginClass}>
        Login
      </Link>
      <Link
        to="/sign-up"
        state={{ from: returnTo }}
        className="flex h-10 items-center rounded bg-primary px-3 text-[19px] text-white transition hover:bg-primary-hover"
      >
        Join Freqnt
      </Link>
    </div>
  );
}
