import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthChrome } from "../../components/auth/AuthChrome";
import { GoogleAuthButton } from "../../components/auth/GoogleAuthButton";
import { authCardClass } from "../../components/auth/authStyles";
import { Button } from "../../components/ui/Button";
import { TextField } from "../../components/ui/TextField";
import { mapAuthError } from "../../lib/authErrors";
import { getPostAuthPath } from "../../lib/authRouting";
import { isSupabaseConfigured, supabase } from "../../lib/supabase";
import { fetchProfile } from "../../services/profileService";

export function SignInPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? "/explore";
  const justReset = Boolean((location.state as { reset?: boolean } | null)?.reset);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!isSupabaseConfigured) {
      setError("Supabase is not configured. See docs/SUPABASE.md.");
      return;
    }

    setSubmitting(true);
    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setSubmitting(false);

    if (signInError) {
      setError(mapAuthError(signInError));
      return;
    }

    const userId = data.user?.id;
    if (!userId) {
      navigate(from, { replace: true });
      return;
    }

    try {
      const profile = await fetchProfile(userId);
      const target = getPostAuthPath(profile, from);
      if (target === "/welcome") {
        navigate("/welcome", { replace: true, state: { from } });
      } else {
        navigate(target, { replace: true });
      }
    } catch {
      navigate(from, { replace: true });
    }
  }

  return (
    <AuthChrome layout="full">
      <div className="grid flex-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div
          className="hidden min-h-[420px] rounded-2xl bg-gradient-to-br from-starlight via-primary/20 to-midnight/30 lg:block"
          role="img"
          aria-label="Community illustration placeholder"
        />

        <div className={authCardClass}>
          <h1 className="font-semibold text-3xl text-midnight tracking-tight">Log in</h1>

          {justReset ? (
            <p className="mt-3 text-midnight text-sm" role="status">
              Password updated. Sign in with your new password.
            </p>
          ) : null}

          <div className="mt-8">
            <GoogleAuthButton nextPath={from} disabled={submitting} onError={setError} />
          </div>

          <div className="my-6 flex items-center gap-3 text-neutral-500 text-xs uppercase tracking-wide">
            <span className="h-px flex-1 bg-neutral-200" />
            or continue with email
            <span className="h-px flex-1 bg-neutral-200" />
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <TextField
              id="email"
              label="Email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <div>
              <TextField
                id="password"
                label="Password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Link
                to="/forgot-password"
                className="mt-2 inline-block text-primary text-sm hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            {error ? (
              <p className="text-primary text-sm" role="alert">
                {error}
              </p>
            ) : null}

            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? "Signing in…" : "Sign in"}
            </Button>
          </form>

          <p className="mt-6 text-center text-midnight text-sm">
            Don&apos;t have an account?{" "}
            <Link to="/sign-up" state={{ from }} className="font-medium text-primary hover:underline">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </AuthChrome>
  );
}
