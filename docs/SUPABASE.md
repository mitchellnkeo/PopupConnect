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

In **Authentication → Providers**, enable **Email**.

For local development you may disable **Confirm email** under **Authentication → Providers → Email** so sign-up works immediately.

## 6. Verify

1. `npm run dev`
2. Open `/sign-up`, create an account.
3. Open `/account/profile` and edit your display name.
4. Confirm rows appear in **Table Editor** → `profiles` and `profile_roles`.

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
