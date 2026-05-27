import { useEffect, useState } from "react";
import { Button } from "../../components/ui/Button";
import { useAuth } from "../../features/auth/AuthContext";
import { setProfileRoles, updateProfile } from "../../services/profileService";
import type { AppRole } from "../../types/database";

const roleOptions: { value: AppRole; label: string }[] = [
  { value: "vendor", label: "Vendor or artist" },
  { value: "host", label: "Space owner (host)" },
  { value: "organizer", label: "Organizer" },
];

export function ProfilePage() {
  const { user, profile, refreshProfile } = useAuth();

  const [displayName, setDisplayName] = useState("");
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setDisplayName(profile?.display_name ?? "");
    setRoles(profile?.roles ?? []);
  }, [profile]);

  function toggleRole(role: AppRole) {
    setRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role],
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    setError(null);
    setSaved(false);

    try {
      await updateProfile(user.id, {
        display_name: displayName.trim() || null,
        avatar_url: profile?.avatar_url ?? null,
        onboarding_completed: true,
      });
      await setProfileRoles(user.id, roles);
      await refreshProfile();
      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save profile.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
      <h1 className="font-semibold text-2xl text-midnight">My profile</h1>
      <p className="mt-1 text-neutral-600 text-sm">{user?.email}</p>

      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="displayName" className="block font-medium text-midnight text-sm">
            Display name
          </label>
          <input
            id="displayName"
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="mt-1 w-full max-w-md rounded-xl border border-neutral-200 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        <fieldset className="border-none p-0">
          <legend className="mb-2 font-medium text-midnight text-sm">Roles</legend>
          <div className="space-y-2">
            {roleOptions.map((opt) => (
              <label key={opt.value} className="flex cursor-pointer items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={roles.includes(opt.value)}
                  onChange={() => toggleRole(opt.value)}
                  className="accent-primary"
                />
                {opt.label}
              </label>
            ))}
          </div>
        </fieldset>

        {error ? (
          <p className="text-primary text-sm" role="alert">
            {error}
          </p>
        ) : null}
        {saved ? (
          <p className="text-midnight text-sm" role="status">
            Profile saved.
          </p>
        ) : null}

        <Button type="submit" disabled={saving}>
          {saving ? "Saving…" : "Save changes"}
        </Button>
      </form>
    </div>
  );
}
