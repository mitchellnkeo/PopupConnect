import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthChrome } from "../../components/auth/AuthChrome";
import { authCardClass, authInputClass, authLabelClass } from "../../components/auth/authStyles";
import { Button } from "../../components/ui/Button";
import { isSupabaseConfigured, supabase } from "../../lib/supabase";

export function SignUpPage() {
  const navigate = useNavigate();

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
        data: {
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          display_name: displayName,
        },
      },
    });
    setSubmitting(false);

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    if (data.session) {
      navigate("/welcome", { replace: true });
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

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="firstName" className={authLabelClass}>
                First name
              </label>
              <input
                id="firstName"
                type="text"
                autoComplete="given-name"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className={authInputClass}
              />
            </div>
            <div>
              <label htmlFor="lastName" className={authLabelClass}>
                Last name
              </label>
              <input
                id="lastName"
                type="text"
                autoComplete="family-name"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className={authInputClass}
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className={authLabelClass}>
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
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
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={authInputClass}
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className={authLabelClass}>
              Confirm password
            </label>
            <input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={authInputClass}
            />
          </div>

          <label className="flex cursor-pointer items-start gap-3 text-sm">
            <input
              type="checkbox"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              className="mt-1 accent-primary"
              required
            />
            <span className="text-midnight">
              I agree to the{" "}
              <Link to="/about" className="font-medium text-primary hover:underline">
                Terms and Conditions
              </Link>
            </span>
          </label>

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
            {submitting ? "Submitting…" : "Submit"}
          </Button>
        </form>

        <p className="mt-6 text-center text-neutral-600 text-sm">
          Already have an account?{" "}
          <Link to="/sign-in" className="font-medium text-primary hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </AuthChrome>
  );
}
