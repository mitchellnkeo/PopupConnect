import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { AuthChrome } from "../../components/auth/AuthChrome";
import { authCardClass } from "../../components/auth/authStyles";
import { Button } from "../../components/ui/Button";
import { TextField } from "../../components/ui/TextField";
import { mapAuthError } from "../../lib/authErrors";
import { isSupabaseConfigured, supabase } from "../../lib/supabase";

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [ready, setReady] = useState(false);
  const [linkError, setLinkError] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function prepareSession() {
      if (!isSupabaseConfigured) {
        setLinkError("Supabase is not configured. See docs/SUPABASE.md.");
        return;
      }

      const errorDescription =
        searchParams.get("error_description") ?? searchParams.get("error");
      if (errorDescription) {
        setLinkError(mapAuthError(errorDescription));
        return;
      }

      try {
        const code = searchParams.get("code");
        if (code) {
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          if (exchangeError && !/already|expired/i.test(exchangeError.message)) {
            throw exchangeError;
          }
        }

        const { data } = await supabase.auth.getSession();
        if (!data.session) {
          await new Promise((resolve) => window.setTimeout(resolve, 400));
        }

        const retry = await supabase.auth.getSession();
        if (cancelled) return;

        if (!retry.data.session) {
          setLinkError("This reset link is invalid or has expired. Request a new one.");
          return;
        }

        setReady(true);
      } catch (err) {
        if (!cancelled) {
          setLinkError(mapAuthError(err, "This reset link is invalid or has expired."));
        }
      }
    }

    void prepareSession();
    return () => {
      cancelled = true;
    };
  }, [searchParams]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setSubmitting(false);

    if (updateError) {
      setError(mapAuthError(updateError));
      return;
    }

    await supabase.auth.signOut();
    navigate("/sign-in", { replace: true, state: { reset: true } });
  }

  return (
    <AuthChrome layout="centered">
      <div className={authCardClass}>
        <h1 className="font-semibold text-3xl text-midnight tracking-tight">Set a new password</h1>

        {linkError ? (
          <>
            <p className="mt-4 text-primary text-sm" role="alert">
              {linkError}
            </p>
            <Link
              to="/forgot-password"
              className="mt-6 inline-block font-medium text-primary hover:underline"
            >
              Request a new reset link
            </Link>
          </>
        ) : !ready ? (
          <p className="mt-4 text-body/70 text-sm">Confirming your reset link…</p>
        ) : (
          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <TextField
              id="new-password"
              label="New password"
              type="password"
              autoComplete="new-password"
              required
              hint="At least 8 characters."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <TextField
              id="confirm-new-password"
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

            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? "Updating…" : "Update password"}
            </Button>
          </form>
        )}
      </div>
    </AuthChrome>
  );
}
