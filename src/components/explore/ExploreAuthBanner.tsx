import { Link } from "react-router-dom";
import { useAuth } from "../../features/auth/AuthContext";
import { useReturnPath } from "../../hooks/useReturnPath";
import { getFirstName } from "../../lib/authRouting";

export function ExploreAuthBanner() {
  const returnTo = useReturnPath();
  const { loading, session, profile, user } = useAuth();

  if (loading) {
    return null;
  }

  if (session) {
    const firstName = getFirstName(profile, user?.user_metadata);

    return (
      <div className="rounded-xl bg-cream px-4 py-3 md:px-5">
        <p className="text-body text-sm md:text-base">
          Welcome back, <span className="font-semibold text-midnight">{firstName}</span>.{" "}
          <Link
            to="/account/settings/events"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            View my events
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-surface px-4 py-3 md:px-5">
      <p className="text-body text-sm md:text-base">
        Browsing as a guest.{" "}
        <Link
          to="/sign-in"
          state={{ from: returnTo }}
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Sign in
        </Link>{" "}
        to book vendors and track your events, or{" "}
        <Link
          to="/sign-up"
          state={{ from: returnTo }}
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          create an account
        </Link>
        .
      </p>
    </div>
  );
}
