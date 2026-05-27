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
cp .env.example .env.local   # add Supabase URL + anon key when Phase 1 is wired
npm run dev
```

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
