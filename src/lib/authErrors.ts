const MESSAGE_MAP: Array<[RegExp, string]> = [
  [/invalid login credentials/i, "Email or password is incorrect."],
  [/email not confirmed/i, "Confirm your email before signing in, or continue with Google."],
  [/user already registered/i, "An account with this email already exists. Sign in instead."],
  [/already registered/i, "An account with this email already exists. Sign in instead."],
  [/identity.*already/i, "This email is already linked to another sign-in method."],
  [/rate limit|too many requests|over_email_send_rate_limit/i, "Too many attempts. Try again in a few minutes."],
  [/error sending|smtp|confirmation email/i, "We could not send a confirmation email. Production email is not set up yet."],
  [/password should be at least/i, "Password must be at least 8 characters."],
  [/same password/i, "Choose a password you have not used before."],
  [/expired|otp_expired|token has expired/i, "This link has expired. Request a new one."],
  [/invalid.*token|invalid.*link/i, "This link is invalid. Request a new one."],
];

export function mapAuthError(error: unknown, fallback = "Something went wrong. Try again."): string {
  const raw =
    error instanceof Error
      ? error.message
      : typeof error === "string"
        ? error
        : fallback;

  const match = MESSAGE_MAP.find(([pattern]) => pattern.test(raw));
  return match?.[1] ?? raw;
}
