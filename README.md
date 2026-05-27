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

## Deploy

Connect the repo to Vercel. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in the Vercel project environment when Supabase is connected.
