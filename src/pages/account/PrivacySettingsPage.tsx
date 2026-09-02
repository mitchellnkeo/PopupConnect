import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { TextField } from "../../components/ui/TextField";
import { useAuth } from "../../features/auth/AuthContext";
import { mapAuthError } from "../../lib/authErrors";
import { isSupabaseConfigured, supabase } from "../../lib/supabase";

export function PrivacySettingsPage() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [signingOutEverywhere, setSigningOutEverywhere] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [nextEmail, setNextEmail] = useState(user?.email ?? "");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [emailSaved, setEmailSaved] = useState(false);
  const [emailSaving, setEmailSaving] = useState(false);

  const usesPassword =
    !user?.identities || user.identities.some((identity) => identity.provider === "email");

  useEffect(() => {
    setNextEmail(user?.email ?? "");
  }, [user?.email]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaved(false);

    if (!isSupabaseConfigured) {
      setError("Supabase is not configured.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSaving(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setSaving(false);

    if (updateError) {
      setError(mapAuthError(updateError));
      return;
    }

    setPassword("");
    setConfirmPassword("");
    setSaved(true);
  }

  async function handleEmailChange(e: React.FormEvent) {
    e.preventDefault();
    setEmailError(null);
    setEmailSaved(false);

    const trimmed = nextEmail.trim().toLowerCase();
    if (!trimmed || !trimmed.includes("@")) {
      setEmailError("Enter a valid email address.");
      return;
    }
    if (trimmed === user?.email?.toLowerCase()) {
      setEmailError("That is already this account’s email.");
      return;
    }
    if (!isSupabaseConfigured) {
      setEmailError("Supabase is not configured.");
      return;
    }

    setEmailSaving(true);
    const { error: updateError } = await supabase.auth.updateUser({ email: trimmed });
    setEmailSaving(false);

    if (updateError) {
      setEmailError(mapAuthError(updateError));
      return;
    }

    setEmailSaved(true);
  }

  async function handleSignOutEverywhere() {
    setSigningOutEverywhere(true);
    await signOut({ everywhere: true });
    navigate("/sign-in", { replace: true });
  }

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
      <h1 className="font-semibold text-2xl text-midnight">Privacy and security</h1>
      <p className="mt-1 text-neutral-600 text-sm">{user?.email}</p>

      <form className="mt-8 max-w-md space-y-3" onSubmit={(e) => void handleEmailChange(e)}>
        <h2 className="font-medium text-midnight text-sm">Email</h2>
        <TextField
          id="account-email"
          label="Account email"
          type="email"
          autoComplete="email"
          value={nextEmail}
          onChange={(e) => setNextEmail(e.target.value)}
          hint="Supabase sends a confirmation link to the new address. That only arrives after custom SMTP is set up."
        />
        {emailError ? (
          <p className="text-primary text-sm" role="alert">
            {emailError}
          </p>
        ) : null}
        {emailSaved ? (
          <p className="text-midnight text-sm" role="status">
            Check the new inbox to confirm the change. The current email stays active until then.
          </p>
        ) : null}
        <Button type="submit" variant="secondary" disabled={emailSaving}>
          {emailSaving ? "Sending…" : "Update email"}
        </Button>
      </form>

      {!usesPassword ? (
        <p className="mt-6 text-body text-sm leading-relaxed">
          This account signs in with Google. Password changes are not available unless you also
          create an email/password login.
        </p>
      ) : (
        <form className="mt-8 max-w-md space-y-5" onSubmit={handleSubmit}>
          <h2 className="font-medium text-midnight text-sm">Change password</h2>
          <TextField
            id="account-new-password"
            label="New password"
            type="password"
            autoComplete="new-password"
            required
            hint="At least 8 characters."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <TextField
            id="account-confirm-password"
            label="Confirm password"
            type="password"
            autoComplete="new-password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          {error ? (
            <p className="text-primary text-sm" role="alert">
              {error}
            </p>
          ) : null}
          {saved ? (
            <p className="text-midnight text-sm" role="status">
              Password updated.
            </p>
          ) : null}

          <Button type="submit" disabled={saving}>
            {saving ? "Updating…" : "Update password"}
          </Button>
        </form>
      )}

      <section className="mt-10 max-w-md space-y-3 border-neutral-200 border-t pt-8">
        <h2 className="font-medium text-midnight text-sm">Sessions</h2>
        <p className="text-neutral-600 text-sm leading-relaxed">
          Sign out of PopupConnect on this browser and every other device using this account.
        </p>
        <Button
          type="button"
          variant="secondary"
          disabled={signingOutEverywhere}
          onClick={() => void handleSignOutEverywhere()}
        >
          {signingOutEverywhere ? "Signing out…" : "Sign out of all devices"}
        </Button>
      </section>
    </div>
  );
}
