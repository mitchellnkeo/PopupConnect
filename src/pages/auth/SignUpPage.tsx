import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthChrome } from "../../components/auth/AuthChrome";
import { GoogleAuthButton } from "../../components/auth/GoogleAuthButton";
import { authCardClass } from "../../components/auth/authStyles";
import { Button } from "../../components/ui/Button";
import { Checkbox } from "../../components/ui/Checkbox";
import { TextField } from "../../components/ui/TextField";
import { mapAuthError } from "../../lib/authErrors";
import { getAuthCallbackUrl } from "../../lib/authRedirects";
import { isSupabaseConfigured, supabase } from "../../lib/supabase";

export function SignUpPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? "/explore";

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!isSupabaseConfigured) {
      setError("Supabase is not configured. See docs/SUPABASE.md.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!acceptedTerms) {
      setError("Please agree to the Terms and Conditions.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    const displayName = `${firstName.trim()} ${lastName.trim()}`.trim();

    setSubmitting(true);
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        emailRedirectTo: getAuthCallbackUrl(from),
        data: {
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          display_name: displayName,
        },
      },
    });
    setSubmitting(false);

    if (signUpError) {
      setError(mapAuthError(signUpError));
      return;
    }

    if (data.session) {
      navigate("/welcome", { replace: true, state: { from } });
      return;
    }

    setMessage(
      "Check your email to confirm your account, then sign in to finish setting up your profile.",
    );
  }

  return (
    <AuthChrome layout="centered">
      <div className={authCardClass}>
        <h1 className="font-semibold text-3xl text-midnight tracking-tight">Create account</h1>

        <div className="mt-8">
          <GoogleAuthButton
            nextPath={from}
            disabled={submitting}
            onBeforeStart={() => {
              if (acceptedTerms) return true;
              setError("Please agree to the Terms and Conditions.");
              return false;
            }}
            onError={(authError) => setError(mapAuthError(authError))}
          />
        </div>

        <div className="my-6 flex items-center gap-3 text-neutral-500 text-xs uppercase tracking-wide">
          <span className="h-px flex-1 bg-neutral-200" />
          or continue with email
          <span className="h-px flex-1 bg-neutral-200" />
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField
              id="firstName"
              label="First name"
              type="text"
              autoComplete="given-name"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <TextField
              id="lastName"
              label="Last name"
              type="text"
              autoComplete="family-name"
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>

          <TextField
            id="email"
            label="Email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <TextField
            id="password"
            label="Password"
            type="password"
            autoComplete="new-password"
            required
            hint="At least 8 characters."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <TextField
            id="confirmPassword"
            label="Confirm password"
            type="password"
            autoComplete="new-password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <Checkbox
            id="terms"
            checked={acceptedTerms}
            onChange={setAcceptedTerms}
            required
          >
            I agree to the{" "}
            <Link to="/about" className="font-medium text-primary hover:underline">
              Terms and Conditions
            </Link>
          </Checkbox>

          {error ? (
            <p className="text-primary text-sm" role="alert">
              {error}
            </p>
          ) : null}
          {message ? (
            <p className="text-midnight text-sm" role="status">
              {message}
            </p>
          ) : null}

          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? "Creating account…" : "Create account"}
          </Button>
        </form>

        <p className="mt-6 text-center text-neutral-600 text-sm">
          Already have an account?{" "}
          <Link to="/sign-in" state={{ from }} className="font-medium text-primary hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </AuthChrome>
  );
}
