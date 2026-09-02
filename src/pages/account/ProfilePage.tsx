import { useEffect, useState } from "react";
import { Button } from "../../components/ui/Button";
import { Checkbox } from "../../components/ui/Checkbox";
import { TextField } from "../../components/ui/TextField";
import { useAuth } from "../../features/auth/AuthContext";
import { ROLE_OPTIONS } from "../../lib/roles";
import { setProfileRoles, updateProfile } from "../../services/profileService";
import type { AppRole } from "../../types/database";

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

  const initials = displayName.trim()
    ? displayName
        .trim()
        .split(/\s+/)
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : (user?.email?.slice(0, 2).toUpperCase() ?? "?");

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
      <h1 className="font-semibold text-2xl text-midnight">My profile</h1>
      <p className="mt-1 text-neutral-600 text-sm">{user?.email}</p>

      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="flex items-center gap-4">
          {profile?.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt=""
              className="size-16 rounded-full object-cover"
            />
          ) : (
            <div
              className="flex size-16 items-center justify-center rounded-full bg-midnight font-semibold text-lg text-white"
              aria-hidden
            >
              {initials}
            </div>
          )}
          <div>
            <p className="font-medium text-midnight text-sm">Profile photo</p>
            <p className="mt-1 text-neutral-500 text-xs">Photo upload is coming once Storage is set up.</p>
          </div>
        </div>

        <div className="max-w-md">
          <TextField
            id="displayName"
            label="Display name"
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
        </div>

        <fieldset className="border-none p-0">
          <legend className="mb-2 font-medium text-midnight text-sm">Roles</legend>
          <div className="space-y-3">
            {ROLE_OPTIONS.map((opt) => (
              <Checkbox
                key={opt.value}
                id={`role-${opt.value}`}
                checked={roles.includes(opt.value)}
                onChange={() => toggleRole(opt.value)}
              >
                {opt.label}
              </Checkbox>
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
