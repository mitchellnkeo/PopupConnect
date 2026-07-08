import { useEffect, useId, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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

type UserAccountMenuProps = {
  /** Hero header uses light icons; explore/account use default styling */
  variant?: "overlay" | "default";
  className?: string;
};

export function UserAccountMenu({ variant = "default", className = "" }: UserAccountMenuProps) {
  const menuId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { configured, loading, user, profile, signOut } = useAuth();
  const [open, setOpen] = useState(false);

  const isOverlay = variant === "overlay";
  const label = user ? initials(profile?.display_name, user.email) : "?";

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  async function handleSignOut() {
    setOpen(false);
    await signOut();
    navigate("/");
  }

  const triggerClass = [
    "flex items-center justify-center rounded-full font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
    isOverlay ? "size-10 text-base" : "size-9 font-semibold text-xs",
    isOverlay
      ? "bg-midnight text-white hover:bg-midnight/90 focus-visible:outline-white"
      : "bg-midnight text-white hover:bg-midnight/90 focus-visible:outline-primary",
    open && (isOverlay ? "ring-2 ring-white/80" : "ring-2 ring-primary/40"),
  ]
    .filter(Boolean)
    .join(" ");

  const panelClass =
    "absolute top-full right-0 z-50 mt-2 w-52 overflow-hidden rounded-xl border border-neutral-200 bg-white py-1 shadow-lg";

  const itemClass =
    "block w-full px-4 py-2.5 text-left text-midnight text-sm transition hover:bg-starlight/60";

  return (
    <div ref={rootRef} className={`relative ${className}`.trim()}>
      <button
        type="button"
        className={triggerClass}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls={menuId}
        aria-label={user ? "Account menu" : "Sign in options"}
        title={user ? (profile?.display_name ?? user.email ?? "Account") : "Account"}
        onClick={() => setOpen((o) => !o)}
        disabled={loading}
      >
        {loading ? "…" : label}
      </button>

      {open ? (
        <div id={menuId} role="menu" className={panelClass}>
          {!configured ? (
            <p className="px-4 py-3 text-neutral-500 text-xs">
              Supabase is not configured. Add keys to <code>.env.local</code>.
            </p>
          ) : user ? (
            <>
              <div className="border-neutral-100 border-b px-4 py-3">
                <p className="truncate font-medium text-midnight text-sm">
                  {profile?.display_name ?? "Your account"}
                </p>
                <p className="truncate text-neutral-500 text-xs">{user.email}</p>
              </div>
              <Link
                role="menuitem"
                to="/account/settings/profile"
                className={itemClass}
                onClick={() => setOpen(false)}
              >
                My profile
              </Link>
              <Link
                role="menuitem"
                to="/account/settings/events"
                className={itemClass}
                onClick={() => setOpen(false)}
              >
                My events
              </Link>
              <Link
                role="menuitem"
                to="/account"
                className={itemClass}
                onClick={() => setOpen(false)}
              >
                Account settings
              </Link>
              <button type="button" role="menuitem" className={itemClass} onClick={() => void handleSignOut()}>
                Log out
              </button>
            </>
          ) : (
            <>
              <Link
                role="menuitem"
                to="/sign-in"
                className={itemClass}
                onClick={() => setOpen(false)}
              >
                Sign in
              </Link>
              <Link
                role="menuitem"
                to="/sign-up"
                className={itemClass}
                onClick={() => setOpen(false)}
              >
                Create account
              </Link>
            </>
          )}
        </div>
      ) : null}
    </div>
  );
}
