import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthPageLayout } from "../../components/auth/AuthPageLayout";
import { Button } from "../../components/ui/Button";
import { isSupabaseConfigured, supabase } from "../../lib/supabase";

export function SignInPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? "/account/profile";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!isSupabaseConfigured) {
      setError("Supabase is not configured. See supabase/README.md.");
      return;
    }

    setSubmitting(true);
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setSubmitting(false);

    if (signInError) {
      setError(signInError.message);
      return;
    }

    navigate(from, { replace: true });
  }

  return (
    <AuthPageLayout title="Sign in" subtitle="Access your PopupConnect account.">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email" className="block font-medium text-midnight text-sm">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        <div>
          <label htmlFor="password" className="block font-medium text-midnight text-sm">
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30"
          />
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

      <p className="mt-6 text-center text-neutral-600 text-sm">
        New here?{" "}
        <Link to="/sign-up" className="font-medium text-primary hover:underline">
          Create an account
        </Link>
      </p>
    </AuthPageLayout>
  );
}
