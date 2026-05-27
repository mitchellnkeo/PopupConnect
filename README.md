# PopupConnect

A website that connects local enterprises with venues that can host them.

## Stack

| Layer | Technology |
|-------|------------|
| Frontend | React, TypeScript, Vite, Tailwind CSS |
| Hosting | [Vercel](https://vercel.com) |
| Accounts & data | [Supabase](https://supabase.com) (Auth + Postgres + Storage) |

System design, auth model, and planned database layout are documented in **[SYSTEM_ARCHITECTURE.md](./SYSTEM_ARCHITECTURE.md)**.

## Getting started

```bash
npm install
cp .env.example .env.local   # add Supabase URL + anon key
npm run dev
```

### Database migrations (CLI)

The Supabase CLI is installed as a dev dependency — use **`npm run`**, not bare `supabase`, unless you installed the CLI via Homebrew:

```bash
npm run db:login
npm run db:link
npm run db:push
```

See [supabase/README.md](./supabase/README.md) if you see `command not found: supabase`.

Open the URL shown in the terminal (typically `http://localhost:5173`).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Local development server |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview production build |

## Project docs

- [SYSTEM_ARCHITECTURE.md](./SYSTEM_ARCHITECTURE.md) — Supabase, auth, RLS, deployment
- [ProjectDeliverables.md](./ProjectDeliverables.md) — Product scope
- [CodingFundamentals.md](./CodingFundamentals.md) — Team coding standards

## Deploy on Vercel

### Environment variables (dashboard)

In Vercel → **Project → Settings → Environment Variables**, add:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY` (your Supabase **Publishable** key)

Redeploy after changing env vars. Configure Supabase **Authentication → URL configuration** with your production URL (see team notes or prior setup).

### Vercel CLI (`command not found: vercel`)

The Vercel CLI is not installed by default. Use one of:

**Global install (Homebrew):**

```bash
brew install vercel-cli
vercel --version
```

**Global install (npm):**

```bash
npm install -g vercel
vercel --version
```

**No install — use npx:**

```bash
npx vercel login
npx vercel link
npx vercel env add VITE_SUPABASE_URL
npx vercel env add VITE_SUPABASE_ANON_KEY
```

### CLI workflow (from project root)

```bash
cd /path/to/PopupConnect
vercel login
vercel link          # pick existing Vercel project if prompted
vercel env add VITE_SUPABASE_URL production preview development
vercel env add VITE_SUPABASE_ANON_KEY production preview development
vercel --prod        # optional: deploy production from CLI
```

When `vercel env add` prompts for the value, paste the same values as in `.env.local`. Select **Production**, **Preview**, and **Development** so all deployments work.

Pull env vars locally (optional):

```bash
vercel env pull .env.local
```

Note: `vercel env pull` may overwrite `.env.local` — back it up first if needed.
