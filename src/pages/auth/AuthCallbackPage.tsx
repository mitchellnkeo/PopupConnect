import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { AuthChrome } from "../../components/auth/AuthChrome";
import { authCardClass } from "../../components/auth/authStyles";
import { getPostAuthPath } from "../../lib/authRouting";
import { getSafeReturnPath } from "../../lib/authRedirects";
import { isSupabaseConfigured, supabase } from "../../lib/supabase";
import { fetchProfile } from "../../services/profileService";

export function AuthCallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    let cancelled = false;

    async function completeAuth() {
      if (!isSupabaseConfigured) {
        setError("Supabase is not configured. See docs/SUPABASE.md.");
        return;
      }

      const errorDescription =
        searchParams.get("error_description") ?? searchParams.get("error");
      if (errorDescription) {
        setError(errorDescription);
        return;
      }

      const next = getSafeReturnPath(searchParams.get("next"), "/explore");

      try {
        const existing = await supabase.auth.getSession();
        let session = existing.data.session;

        if (!session) {
          const code = searchParams.get("code");
          if (code) {
            const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
            if (exchangeError && !/already|expired/i.test(exchangeError.message)) {
              throw exchangeError;
            }
            session = data.session;
          }
        }

        if (!session) {
          await new Promise((resolve) => window.setTimeout(resolve, 500));
          const retry = await supabase.auth.getSession();
          session = retry.data.session;
        }

        if (!session?.user) {
          setError("Could not confirm your account. Request a new link or sign in again.");
          return;
        }

        const profile = await fetchProfile(session.user.id);
        if (cancelled) return;

        const target = getPostAuthPath(profile, next);
        if (target === "/welcome") {
          navigate("/welcome", { replace: true, state: { from: next } });
          return;
        }

        navigate(target, { replace: true });
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Could not complete sign-in.");
        }
      }
    }

    void completeAuth();
    return () => {
      cancelled = true;
    };
  }, [navigate, searchParams]);

  return (
    <AuthChrome layout="centered">
      <div className={`${authCardClass} text-center`}>
        {error ? (
          <>
            <h1 className="font-semibold text-3xl text-midnight tracking-tight">
              Could not verify account
            </h1>
            <p className="mt-4 text-primary text-sm" role="alert">
              {error}
            </p>
            <Link to="/sign-in" className="mt-6 inline-block font-medium text-primary hover:underline">
              Back to sign in
            </Link>
          </>
        ) : (
          <>
            <h1 className="font-semibold text-3xl text-midnight tracking-tight">
              Confirming your account
            </h1>
            <p className="mt-4 text-body/70 text-sm">One moment while we finish signing you in…</p>
          </>
        )}
      </div>
    </AuthChrome>
  );
}
