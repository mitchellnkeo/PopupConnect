import { useState } from "react";
import { Link } from "react-router-dom";
import { AuthChrome } from "../../components/auth/AuthChrome";
import { authCardClass } from "../../components/auth/authStyles";
import { Button } from "../../components/ui/Button";
import { TextField } from "../../components/ui/TextField";
import { mapAuthError } from "../../lib/authErrors";
import { isSupabaseConfigured, supabase } from "../../lib/supabase";

const COOLDOWN_MS = 60_000;

export function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [cooldown, setCooldown] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!isSupabaseConfigured) {
      setError("Supabase is not configured. See docs/SUPABASE.md.");
      return;
    }

    setSubmitting(true);
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setSubmitting(false);

    if (resetError) {
      setError(mapAuthError(resetError));
      return;
    }

    setSent(true);
    setCooldown(true);
    window.setTimeout(() => setCooldown(false), COOLDOWN_MS);
  }

  return (
    <AuthChrome layout="centered">
      <div className={authCardClass}>
        <h1 className="font-semibold text-3xl text-midnight tracking-tight">Forgot password</h1>
        <p className="mt-2 text-body/70 text-sm">
          Enter the email on your account. If it exists, we will send a reset link.
        </p>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <TextField
            id="reset-email"
            label="Email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {error ? (
            <p className="text-primary text-sm" role="alert">
              {error}
            </p>
          ) : null}
          {sent ? (
            <p className="text-midnight text-sm" role="status">
              If an account exists for that email, a reset link is on its way. Check your inbox and
              spam folder.
            </p>
          ) : null}

          <Button type="submit" className="w-full" disabled={submitting || cooldown}>
            {submitting ? "Sending…" : cooldown ? "Email sent" : "Send reset link"}
          </Button>
        </form>

        <p className="mt-6 text-center text-neutral-600 text-sm">
          <Link to="/sign-in" className="font-medium text-primary hover:underline">
            Back to sign in
          </Link>
        </p>
      </div>
    </AuthChrome>
  );
}
