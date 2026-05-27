import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthPageLayout } from "../../components/auth/AuthPageLayout";
import { Button } from "../../components/ui/Button";
import { isSupabaseConfigured, supabase } from "../../lib/supabase";
import { setProfileRoles } from "../../services/profileService";
import type { AppRole } from "../../types/database";

const roleOptions: { value: AppRole; label: string }[] = [
  { value: "vendor", label: "Vendor or artist" },
  { value: "host", label: "Space owner (host)" },
  { value: "organizer", label: "Organizer" },
];

export function SignUpPage() {
  const navigate = useNavigate();

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [roles, setRoles] = useState<AppRole[]>(["vendor"]);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function toggleRole(role: AppRole) {
    setRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role],
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!isSupabaseConfigured) {
      setError("Supabase is not configured. See supabase/README.md.");
      return;
    }

    if (roles.length === 0) {
      setError("Select at least one role.");
      return;
    }

    setSubmitting(true);
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: { display_name: displayName.trim() },
      },
    });
    setSubmitting(false);

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    const userId = data.user?.id;
    if (userId && data.session) {
      try {
        await setProfileRoles(userId, roles);
      } catch (roleErr) {
        console.error(roleErr);
        setError("Account created but roles could not be saved. Update them in your profile.");
        navigate("/account/profile", { replace: true });
        return;
      }
      navigate("/account/profile", { replace: true });
      return;
    }

    setMessage(
      "Check your email to confirm your account, then sign in. Your profile will be ready after confirmation.",
    );
  }

  return (
    <AuthPageLayout title="Create account" subtitle="Join as a vendor, host, or organizer.">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="displayName" className="block font-medium text-midnight text-sm">
            Display name
          </label>
          <input
            id="displayName"
            type="text"
            autoComplete="name"
            required
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

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
            autoComplete="new-password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30"
          />
          <p className="mt-1 text-neutral-500 text-xs">At least 8 characters.</p>
        </div>

        <fieldset className="border-none p-0">
          <legend className="mb-2 font-medium text-midnight text-sm">I am a…</legend>
          <div className="space-y-2">
            {roleOptions.map((opt) => (
              <label key={opt.value} className="flex cursor-pointer items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={roles.includes(opt.value)}
                  onChange={() => toggleRole(opt.value)}
                  className="accent-primary"
                />
                {opt.label}
              </label>
            ))}
          </div>
        </fieldset>

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
        <Link to="/sign-in" className="font-medium text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </AuthPageLayout>
  );
}
