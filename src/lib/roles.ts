import type { AppRole, ProfileWithRoles } from "../types/database";

export const ROLE_OPTIONS: { value: AppRole; label: string }[] = [
  { value: "vendor", label: "Creative vendor" },
  { value: "host", label: "Space vendor" },
  { value: "organizer", label: "Event planner/coordinator" },
];

export function hasRole(profile: ProfileWithRoles | null | undefined, role: AppRole): boolean {
  return Boolean(profile?.roles.includes(role));
}

export function formatRoleList(roles: AppRole[]): string {
  return roles
    .map((role) => ROLE_OPTIONS.find((option) => option.value === role)?.label ?? role)
    .join(" · ");
}

export type AccountNavItem = {
  to: string;
  label: string;
};

export function getAccountNavItems(roles: AppRole[]): AccountNavItem[] {
  const items: AccountNavItem[] = [
    { to: "/account", label: roles.includes("vendor") ? "My business" : "My account" },
    { to: "/account/settings/profile", label: "My profile" },
  ];

  if (roles.includes("vendor")) {
    items.push({ to: "/account/settings/vendor", label: "Vendor profile" });
  }

  items.push(
    { to: "/account/settings/events", label: "My events" },
    { to: "/account/settings/privacy", label: "Privacy and security" },
    { to: "/account/settings/messages", label: "Messages" },
    { to: "/account/settings/docs", label: "My docs" },
  );

  return items;
}

const SETTINGS_SHORT_LABELS: Record<string, string> = {
  "/account/settings/profile": "Profile",
  "/account/settings/vendor": "Vendor",
  "/account/settings/events": "Events",
  "/account/settings/privacy": "Privacy",
  "/account/settings/messages": "Messages",
  "/account/settings/docs": "Docs",
};

export function getSettingsTabItems(roles: AppRole[]): { id: string; label: string }[] {
  return getAccountNavItems(roles)
    .filter((item) => item.to.startsWith("/account/settings/"))
    .map((item) => ({
      id: item.to,
      label: SETTINGS_SHORT_LABELS[item.to] ?? item.label,
    }));
}
