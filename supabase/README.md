# Supabase setup

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
```

Restart `npm run dev` after changing env vars.

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

## Local Supabase (optional)

`supabase start` runs Postgres + Auth in Docker for fully local development. That is separate from `db push` to the cloud. See [Supabase local dev docs](https://supabase.com/docs/guides/cli/local-development).
