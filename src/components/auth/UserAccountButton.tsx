import { Link } from "react-router-dom";
import { useAuth } from "../../features/auth/AuthContext";

function initials(displayName: string | null | undefined, email: string | undefined) {
  if (displayName?.trim()) {
    const parts = displayName.trim().split(/\s+/);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return displayName.slice(0, 2).toUpperCase();
  }
  if (email) {
    return email.slice(0, 2).toUpperCase();
  }
  return "?";
}

type UserAccountButtonProps = {
  className?: string;
};

export function UserAccountButton({ className = "" }: UserAccountButtonProps) {
  const { configured, loading, user, profile } = useAuth();

  if (!configured) {
    return (
      <Link
        to="/sign-in"
        className={`rounded-full border border-neutral-200 px-3 py-2 text-midnight text-xs transition hover:bg-neutral-100 ${className}`}
      >
        Sign in
      </Link>
    );
  }

  if (loading) {
    return (
      <span
        className={`flex size-9 items-center justify-center rounded-full bg-neutral-200 text-neutral-500 text-xs ${className}`}
        aria-hidden
      >
        …
      </span>
    );
  }

  if (!user) {
    return (
      <Link
        to="/sign-in"
        className={`flex size-9 items-center justify-center rounded-full bg-midnight font-semibold text-white text-xs transition hover:bg-midnight/90 ${className}`}
        aria-label="Sign in"
      >
        →
      </Link>
    );
  }

  const label = initials(profile?.display_name, user.email);

  return (
    <Link
      to="/account/profile"
      className={`flex size-9 items-center justify-center rounded-full bg-midnight font-semibold text-white text-xs transition hover:bg-midnight/90 ${className}`}
      aria-label="My account"
      title={profile?.display_name ?? user.email ?? "Account"}
    >
      {label}
    </Link>
  );
}
