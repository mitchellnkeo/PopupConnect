import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthChrome } from "../../components/auth/AuthChrome";
import { authCardClass, authInputClass, authLabelClass } from "../../components/auth/authStyles";
import { Button } from "../../components/ui/Button";
import { getPostAuthPath } from "../../lib/authRouting";
import { isSupabaseConfigured, supabase } from "../../lib/supabase";
import { fetchProfile } from "../../services/profileService";

export function SignInPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? "/explore";

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
      setError(signInError.message);
      return;
    }

    const userId = data.user?.id;
    if (!userId) {
      navigate(from, { replace: true });
      return;
    }

    try {
      const profile = await fetchProfile(userId);
      navigate(getPostAuthPath(profile, from), { replace: true });
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

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className={authLabelClass}>
                Username
              </label>
              <input
                id="email"
                type="email"
                autoComplete="username email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={authInputClass}
              />
            </div>

            <div>
              <label htmlFor="password" className={authLabelClass}>
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={authInputClass}
              />
            </div>

            {error ? (
              <p className="text-primary text-sm" role="alert">
                {error}
              </p>
            ) : null}

            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? "Submitting…" : "Submit"}
            </Button>
          </form>

          <p className="mt-6 text-center text-midnight text-sm">
            Don&apos;t have an account?{" "}
            <Link to="/sign-up" className="font-medium text-primary hover:underline">
              Create account
            </Link>
          </p>

          <Link
            to="/sign-up"
            className="mt-4 inline-flex w-full items-center justify-center rounded-full border-2 border-primary bg-white px-5 py-2.5 font-medium text-primary text-sm transition hover:bg-starlight/50"
          >
            Create account
          </Link>
        </div>
      </div>
    </AuthChrome>
  );
}
