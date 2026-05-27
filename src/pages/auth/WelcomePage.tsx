import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthChrome } from "../../components/auth/AuthChrome";
import { authCardClass, authLabelClass } from "../../components/auth/authStyles";
import { ProtectedRoute } from "../../components/auth/ProtectedRoute";
import { Button } from "../../components/ui/Button";
import { useAuth } from "../../features/auth/AuthContext";
import { getFirstName } from "../../lib/authRouting";
import { setProfileRoles, updateProfile } from "../../services/profileService";
import type { AppRole } from "../../types/database";

const roleOptions: { value: AppRole; label: string }[] = [
  { value: "vendor", label: "Creative vendor" },
  { value: "host", label: "Space vendor" },
  { value: "organizer", label: "Event planner/coordinator" },
];

function WelcomeContent() {
  const navigate = useNavigate();
  const { user, profile, loading, refreshProfile } = useAuth();

  const [role, setRole] = useState<AppRole>("vendor");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && profile?.onboarding_completed) {
      navigate("/explore", { replace: true });
    }
  }, [loading, profile?.onboarding_completed, navigate]);

  useEffect(() => {
    if (profile?.roles[0]) {
      setRole(profile.roles[0]);
    }
  }, [profile?.roles]);

  const firstName = getFirstName(profile, user?.user_metadata);

  async function handleStartBooking(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;

    setSubmitting(true);
    setError(null);

    try {
      await setProfileRoles(user.id, [role]);
      await updateProfile(user.id, {
        display_name: profile?.display_name ?? null,
        avatar_url: profile?.avatar_url ?? null,
        onboarding_completed: true,
      });
      await refreshProfile();
      navigate("/explore", { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save your profile.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <AuthChrome layout="centered">
        <p className="text-center text-neutral-500 text-sm">Loading…</p>
      </AuthChrome>
    );
  }

  return (
    <AuthChrome layout="centered">
      <div className={`${authCardClass} w-full max-w-xl`}>
        <h1 className="font-semibold text-3xl text-midnight tracking-tight">
          Welcome, {firstName}!
        </h1>

        <form className="mt-8" onSubmit={handleStartBooking}>
          <h2 className="font-semibold text-lg text-midnight">Profile info</h2>
          <p className={`mt-4 ${authLabelClass}`}>I am a</p>

          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-6">
            {roleOptions.map((opt) => (
              <label
                key={opt.value}
                className="flex cursor-pointer items-center gap-2 text-midnight text-sm"
              >
                <input
                  type="radio"
                  name="onboarding-role"
                  value={opt.value}
                  checked={role === opt.value}
                  onChange={() => setRole(opt.value)}
                  className="accent-primary"
                />
                {opt.label}
              </label>
            ))}
          </div>

          {error ? (
            <p className="mt-4 text-primary text-sm" role="alert">
              {error}
            </p>
          ) : null}

          <Button type="submit" className="mt-10 w-full" disabled={submitting}>
            {submitting ? "Saving…" : "Start booking"}
          </Button>
        </form>
      </div>
    </AuthChrome>
  );
}

export function WelcomePage() {
  return (
    <ProtectedRoute>
      <WelcomeContent />
    </ProtectedRoute>
  );
}
