import { NavLink, Outlet } from "react-router-dom";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/where", label: "Where" },
  { to: "/when", label: "When" },
  { to: "/explore", label: "Explore" },
  { to: "/messages", label: "Messages" },
  { to: "/about", label: "About" },
  { to: "/account", label: "Account" },
] as const;

function navClassName({ isActive }: { isActive: boolean }) {
  return [
    "rounded-md px-3 py-2 text-sm font-medium transition-colors",
    isActive
      ? "bg-starlight/80 text-midnight"
      : "text-midnight/80 hover:bg-starlight/40 hover:text-midnight",
  ].join(" ");
}

export function AppShell() {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="border-neutral-200 border-b bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4">
          <NavLink to="/" className="font-semibold text-midnight text-lg tracking-tight">
            PopupConnect
          </NavLink>
          <nav className="flex flex-wrap gap-1">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} className={navClassName} end={item.to === "/"}>
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-neutral-200 border-t bg-white py-6 text-neutral-500 text-sm">
        <div className="mx-auto max-w-6xl px-4">
          PopupConnect — connecting enterprises with host venues.
        </div>
      </footer>
    </div>
  );
}
