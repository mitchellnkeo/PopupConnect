/** Only allow same-origin relative paths so auth redirects cannot leave the app. */
export function getSafeReturnPath(value: string | null | undefined, fallback = "/explore"): string {
  if (!value) return fallback;
  if (!value.startsWith("/") || value.startsWith("//")) return fallback;
  return value;
}

export function getAuthCallbackUrl(next = "/welcome"): string {
  const params = new URLSearchParams({
    next: getSafeReturnPath(next, "/welcome"),
  });
  return `${window.location.origin}/auth/callback?${params.toString()}`;
}
