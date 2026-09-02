import { useEffect } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../features/auth/AuthContext";
import { Button } from "../../components/ui/Button";
import { Tabs } from "../../components/ui/Tabs";
import { LogoMark } from "../../components/discovery/icons";
import { formatRoleList, getAccountNavItems, getSettingsTabItems } from "../../lib/roles";

function navClassName({ isActive }: { isActive: boolean }) {
  return [
    "block rounded-lg px-3 py-2 text-sm transition",
    isActive ? "bg-starlight/80 font-medium text-midnight" : "text-neutral-700 hover:bg-neutral-100",
  ].join(" ");
}

export function AccountLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, profile, signOut, loading } = useAuth();
  const roles = profile?.roles ?? [];
  const settingsTabs = getSettingsTabItems(roles);
  const activeTab =
    settingsTabs.find((tab) => location.pathname.startsWith(tab.id))?.id ?? settingsTabs[0]?.id ?? "";

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
        <aside className="hidden md:block">
          <p className="font-medium text-midnight text-sm">
            {profile?.display_name ?? user?.email ?? "Account"}
          </p>
          {profile?.roles.length ? (
            <p className="mt-1 text-neutral-500 text-xs">{formatRoleList(profile.roles)}</p>
          ) : null}

          <nav className="mt-6 flex flex-col gap-1" aria-label="Account">
            {getAccountNavItems(roles).map((item) => (
              <NavLink key={item.to} to={item.to} className={navClassName}>
                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        <div className="min-w-0">
          <div className="md:hidden">
            <p className="font-medium text-midnight text-sm">
              {profile?.display_name ?? user?.email ?? "Account"}
            </p>
            <Link to="/account" className="mt-1 inline-block text-primary text-xs hover:underline">
              {roles.includes("vendor") ? "Back to my business" : "Back to my account"}
            </Link>
            {settingsTabs.length ? (
              <div className="mt-4 overflow-x-auto">
                <Tabs
                  aria-label="Account settings"
                  grow={false}
                  tabs={settingsTabs}
                  value={activeTab}
                  onChange={(id) => navigate(id)}
                />
              </div>
            ) : null}
          </div>
          <div className="mt-6 md:mt-0">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
