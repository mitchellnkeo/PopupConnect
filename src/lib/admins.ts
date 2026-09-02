const EXPLICIT_ADMIN_EMAILS = ["mitchellnkeo@gmail.com"];

/** Local-part tokens that grant admin (rad@, amy.smith@, rad+popup@). */
const ADMIN_LOCAL_TOKENS = new Set(["rad", "amy"]);

function extraAdminEmails(): string[] {
  const raw = import.meta.env.VITE_ADMIN_EMAILS ?? "";
  return raw
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  const normalized = email.trim().toLowerCase();
  if (EXPLICIT_ADMIN_EMAILS.includes(normalized)) return true;
  if (extraAdminEmails().includes(normalized)) return true;

  const local = normalized.split("@")[0] ?? "";
  return local.split(/[._+\-]/).some((token) => ADMIN_LOCAL_TOKENS.has(token));
}

export function isAdminUser(user?: { email?: string | null } | null): boolean {
  return isAdminEmail(user?.email);
}
