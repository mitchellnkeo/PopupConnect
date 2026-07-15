import type { ProfileWithRoles } from "../types/database";

/** Full path including query string — use for post-auth redirects. */
export function getReturnPath(pathname: string, search = ""): string {
  return `${pathname}${search}`;
}

export function getPostAuthPath(
  profile: ProfileWithRoles | null,
  fallback = "/explore",
): string {
  if (!profile?.onboarding_completed) {
    return "/welcome";
  }
  return fallback;
}

export function getFirstName(
  profile: { display_name: string | null } | null,
  userMetadata?: Record<string, unknown>,
): string {
  const first = userMetadata?.first_name;
  if (typeof first === "string" && first.trim()) {
    return first.trim();
  }
  const display = profile?.display_name?.trim();
  if (display) {
    return display.split(/\s+/)[0] ?? "there";
  }
  return "there";
}
