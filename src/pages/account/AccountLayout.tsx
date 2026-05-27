import { useEffect } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../features/auth/AuthContext";
import { Button } from "../../components/ui/Button";
import { LogoMark } from "../../components/discovery/icons";

const navItems = [
  { to: "/account/profile", label: "My profile" },
  { to: "/account/events", label: "My events" },
  { to: "/account/privacy", label: "Privacy and security" },
  { to: "/account/messages", label: "Messages" },
  { to: "/account/docs", label: "My docs" },
] as const;

function navClassName({ isActive }: { isActive: boolean }) {
  return [
    "block rounded-lg px-3 py-2 text-sm transition",
    isActive ? "bg-starlight/80 font-medium text-midnight" : "text-neutral-700 hover:bg-neutral-100",
  ].join(" ");
}

export function AccountLayout() {
  const navigate = useNavigate();
  const { user, profile, signOut, loading } = useAuth();

  useEffect(() => {
    if (!loading && profile && !profile.onboarding_completed) {
      navigate("/welcome", { replace: true });
    }
  }, [loading, profile, navigate]);

  return (
    <div className="min-h-dvh bg-neutral-50">
      <header className="border-neutral-200 border-b bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4">
          <Link to="/" className="flex items-center gap-2">
            <LogoMark className="h-7 w-11" />
            <span className="font-semibold text-midnight text-sm uppercase tracking-wide">
              PopupConnect
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/explore" className="text-midnight text-sm hover:text-primary">
              Explore
            </Link>
            <Button type="button" variant="secondary" onClick={() => void signOut()}>
              Sign out
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-5xl gap-8 px-4 py-10 md:grid-cols-[220px_1fr]">
        <aside>
          <p className="font-medium text-midnight text-sm">
            {profile?.display_name ?? user?.email ?? "Account"}
          </p>
          {profile?.roles.length ? (
            <p className="mt-1 text-neutral-500 text-xs capitalize">
              {profile.roles.join(" · ")}
            </p>
          ) : null}

          <nav className="mt-6 flex flex-col gap-1" aria-label="Account">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} className={navClassName}>
                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        <div className="min-w-0">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
