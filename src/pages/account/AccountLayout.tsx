import { useEffect } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../features/auth/AuthContext";
import { Tabs } from "../../components/ui/Tabs";
import { AppHeader } from "../../components/layout/AppHeader";
import { isAdminUser } from "../../lib/admins";
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
  const { user, profile, loading } = useAuth();
  const roles = profile?.roles ?? [];
  const admin = isAdminUser(user);
  const settingsTabs = getSettingsTabItems(roles, { isAdmin: admin });
  const activeTab =
    settingsTabs.find((tab) => location.pathname.startsWith(tab.id))?.id ?? settingsTabs[0]?.id ?? "";

  useEffect(() => {
    if (!loading && profile && !profile.onboarding_completed) {
      navigate("/welcome", { replace: true });
    }
  }, [loading, profile, navigate]);

  return (
    <div className="min-h-dvh bg-white">
      <AppHeader />

      <div className="mx-auto grid max-w-5xl gap-8 px-4 py-10 md:grid-cols-[220px_1fr]">
        <aside className="hidden md:block">
          <p className="font-medium text-midnight text-sm">
            {profile?.display_name ?? user?.email ?? "Account"}
          </p>
          {admin ? (
            <p className="mt-1 text-neutral-500 text-xs">Admin</p>
          ) : profile?.roles.length ? (
            <p className="mt-1 text-neutral-500 text-xs">{formatRoleList(profile.roles)}</p>
          ) : null}

          <nav className="mt-6 flex flex-col gap-1" aria-label="Account">
            {getAccountNavItems(roles, { isAdmin: admin }).map((item) => (
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
              {admin ? "Back to dashboards" : roles.includes("vendor") ? "Back to my business" : "Back to my account"}
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
