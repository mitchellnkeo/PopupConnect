# Supabase setup

> Migrations live in [`supabase/migrations/`](../supabase/migrations/). Full doc index: [docs/README.md](./README.md).

## Install the CLI (fix `command not found: supabase`)

The Supabase CLI is **not** included with `@supabase/supabase-js`. Use one of these:

### Option A — npm scripts (recommended for this repo)

The CLI is a **dev dependency**. From the project root:

```bash
npm install
npm run db:login    # opens browser to authenticate
npm run db:link     # paste your project ref when prompted
npm run db:push     # apply migrations in supabase/migrations/
```

You do **not** need a global `supabase` command if you use `npm run db:*`.

### Option B — npx (no install)

```bash
npx supabase login
npx supabase link --project-ref YOUR_PROJECT_REF
npx supabase db push
```

### Option C — Homebrew (global `supabase` command)

```bash
brew install supabase/tap/supabase
supabase --version
```

Then you can run `supabase db push` directly from the repo root (after `supabase link`).

---

## 1. Create a project

1. Go to [supabase.com](https://supabase.com) and create a project.
2. In **Project Settings → General**, copy the **Project ID** (reference), e.g. `abcdefghijklmnop`.
3. In **Project Settings → API**, copy the **Project URL** and **anon public** key.

## 2. Configure the app

```bash
cp .env.example .env.local
```

Set in `.env.local`:

```
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
# Optional. Extra admin emails (comma-separated). mitchellnkeo@gmail.com and rad/amy local-parts are already allowlisted.
# VITE_ADMIN_EMAILS=rad@example.com,amy@example.com

# Required for `npm run db:push` — NOT the anon key, NOT your GitHub password.
# Supabase Dashboard → Project Settings → Database → Database password
SUPABASE_DB_PASSWORD=your-database-password
```

Restart `npm run dev` after changing env vars. The CLI reads `SUPABASE_DB_PASSWORD` from your shell environment when you run `db:push` (it does not auto-load `.env.local` unless you export it — see §7).

## 3. Link the CLI to your cloud project (one time)

```bash
npm run db:login
npm run db:link
```

When linking, enter your **Project ID** (same as the subdomain in your Supabase URL).

This writes connection info under `supabase/.temp/` (gitignored). Do not commit secrets.

## 4. Apply database migrations

```bash
npm run db:push
```

This runs SQL files in `supabase/migrations/` against your **remote** database.

**Alternative — SQL Editor:** paste `migrations/20260523120000_profiles_and_roles.sql` into the dashboard if you prefer not to use the CLI.

### Useful commands

| Command | Purpose |
|---------|---------|
| `npm run db:push` | Apply local migrations to linked remote DB |
| `npm run db:pull` | Pull remote schema into a new migration (use with care) |
| `npm run db:status` | List migration history on remote |

## 5. Auth settings

### Email + confirmation link

In **Authentication → Providers → Email**:

1. Enable **Email**.
2. Turn **Confirm email** **on** so new users receive a verification link instead of signing in immediately.
3. Keep **Secure email change** on.

In **Authentication → URL configuration**:

| Setting | Value |
|---------|--------|
| Site URL | Production origin, e.g. `https://your-app.vercel.app` |
| Redirect URLs | `http://localhost:5173/**`, `http://localhost:5174/**`, `https://your-app.vercel.app/**` |

Sign-up and Google return to `/auth/callback`. Password reset links return to `/reset-password`. Both must be covered by the Redirect URLs allowlist.

If confirmation emails never arrive, check **Authentication → Emails** (rate limits on the built-in sender) or add custom SMTP.

**Keep Confirm email off** until custom SMTP is working. The built-in sender is capped at about 2 emails/hour and will block real sign-ups.

### Custom domain + SMTP (unblocks production email)

The app already has forgot/reset password, email change, and `/auth/callback`. Those stay rate-limited or fail until you own a sending domain.

1. Buy a domain (for example `popupconnect.com`) and add it in Vercel **Settings → Domains**.
2. In [Resend](https://resend.com) (or another SMTP provider), add that domain and copy the DNS records (SPF, DKIM, optional DMARC).
3. In **Supabase → Authentication → Emails → SMTP settings**, turn on custom SMTP and paste the Resend host, port, user, and API key.
4. Set the sender to something like `noreply@your-domain.com`.
5. Add a **custom Auth domain** (or at least the app domain) so Google security emails and confirm links do not show `*.supabase.co`.
6. After a test message succeeds, turn **Confirm email** on.

Google OAuth consent-screen branding also uses this domain — the security email will keep showing the Supabase project host until the custom Auth domain is live.

### Google SSO

1. In [Google Cloud Console](https://console.cloud.google.com/) create an OAuth client (Web application).
2. Add authorized JavaScript origins: `https://YOUR_PROJECT_REF.supabase.co`, plus `http://localhost:5173` for local.
3. Add authorized redirect URI: `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`.
4. In **Authentication → Providers → Google**, enable the provider and paste the Client ID and Client Secret.

The app buttons call `signInWithOAuth({ provider: "google" })` and return to `/auth/callback`.

### Do not use Vercel Authentication for user accounts

Vercel **Deployment Protection** / **Vercel Authentication** is a team login wall (Vercel SSO). It is not app signup. If production requires “Log in with Vercel”:

1. Vercel project → **Settings → Deployment Protection**
2. Set **Vercel Authentication** to **off** for **Production** (previews can stay protected)

Users should only verify through the **email link** or **Google**.

## 6. Verify

1. `npm run dev`
2. Open `/sign-up`, create an account with email — you should see “Check your email…”.
3. Open the confirmation link; you should land on `/welcome`.
4. Repeat with **Continue with Google** after the Google provider is enabled.
5. Confirm rows appear in **Table Editor** → `profiles` and `profile_roles`.

## 7. Troubleshooting `db push` (login role timeout / 544)

**GitHub linked to Supabase ≠ CLI database access.** GitHub integration is for repo/deploy features. The CLI still needs:

1. **Supabase account login** — `npm run db:login` (browser OAuth to supabase.com)
2. **Project link** — `npm run db:link` (project ref, e.g. `bvsneqsgbefuguajsait`)
3. **Database password** — from **Project Settings → Database → Database password** (reset if unknown)

### Fix: use password-based auth

Add the database password to `.env.local`, then run push with the env var exported:

```bash
# From project root — loads SUPABASE_DB_PASSWORD from .env.local for this command
export $(grep -v '^#' .env.local | grep SUPABASE_DB_PASSWORD | xargs)
npm run db:push
```

Or inline (no file):

```bash
SUPABASE_DB_PASSWORD='your-database-password' npm run db:push
```

### If it still times out

1. **Unpause the project** — inactive free-tier projects show as paused in the dashboard; restore before pushing.
2. **Check IP bans** — **Database Settings → Network Bans** (or **Network Restrictions**). Remove your IP if listed after failed CLI attempts. See [Supabase troubleshooting](https://supabase.com/docs/guides/troubleshooting/error-connection-refused-when-trying-to-connect-to-supabase-database-hwG0Dr).
3. **Re-link with password** (pooler issues):

   ```bash
   rm -rf supabase/.temp
   SUPABASE_DB_PASSWORD='your-database-password' npm run db:link
   npm run db:push
   ```

4. **Skip pooler** (if your network has IPv6):

   ```bash
   npx supabase@beta link --skip-pooler
   npx supabase@beta db push
   ```

### Fallback — SQL Editor (no CLI)

Paste migration SQL manually:

1. Dashboard → **SQL Editor** → New query
2. Run `supabase/migrations/20260523120000_profiles_and_roles.sql` (if not already applied)
3. Run `supabase/migrations/20260715120000_vendor_profiles.sql`

## Local Supabase (optional)

`supabase start` runs Postgres + Auth in Docker for fully local development. That is separate from `db push` to the cloud. See [Supabase local dev docs](https://supabase.com/docs/guides/cli/local-development).
