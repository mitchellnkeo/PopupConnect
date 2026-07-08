# PopupConnect — Agent Handoff

Use this document to onboard a new AI session or teammate. It summarizes **what exists**, **how it works**, and **what to build next**.

**Read order:** this file → [SYSTEM_ARCHITECTURE.md](./SYSTEM_ARCHITECTURE.md) → [ProjectDeliverables.md](./ProjectDeliverables.md) → [CodingFundamentals.md](./CodingFundamentals.md).

All project documentation lives in **`docs/`** — see [docs/README.md](./README.md) for the full index.

---

## 0. Recent updates (changelog)

| Date | Change |
|------|--------|
| 2026-07-08 | **v1.0.0** — First review release: landing, explore, vendor detail, booking quote flow, hero/search UX polish. Version in footer + `src/config/version.ts`. |
| 2026-07-07 | Consolidated all project docs into **`docs/`** (`HANDOFF`, architecture, deliverables, coding standards, Supabase setup). Root `README.md` remains the setup entry point; `supabase/README.md` is a short pointer to `docs/SUPABASE.md`. |
| 2026-05 | Phase 1 auth shipped: Supabase client, sign-in/sign-up/welcome, profiles + roles migration, account profile page, Vercel deploy with env vars. |

**When you ship a feature or change architecture:** add a row to this table and update the relevant sections below.

---

## 1. Product summary

**PopupConnect** connects local enterprises (vendors/artists) with venues (hosts) so communities can discover, book, and run pop-up experiences.

- **Brand name in code:** PopupConnect (UI mockups sometimes say "CATALYST" — use PopupConnect unless the user asks to rebrand).
- **Personas:** Creative vendor (`vendor`), space vendor/host (`host`), event planner (`organizer`).
- **Quality bar:** Full happy-path walkthrough, no dead ends, branching states covered — see [ProjectDeliverables.md](./ProjectDeliverables.md).

---

## 2. Tech stack

| Layer | Choice |
|-------|--------|
| Frontend | React 19, TypeScript, Vite 6, React Router 7 |
| Styling | Tailwind CSS v4 (`@theme` in `src/index.css`) |
| Font | Mona Sans (`@fontsource-variable/mona-sans`) |
| Hosting | Vercel (SPA rewrites in `vercel.json`) |
| Backend | Supabase — Auth + Postgres + RLS (+ Storage planned) |
| Client SDK | `@supabase/supabase-js` |

**Not in repo yet:** Vercel Functions, Supabase Storage buckets, generated DB types, real map provider, real vendor/venue tables.

---

## 3. Design tokens

Defined in `src/index.css`:

| Token | Hex | Usage |
|-------|-----|--------|
| `primary` | `#cc3d00` | Buttons, accents (Sienna Orange) |
| `midnight` | `#172e50` | Headings, nav text |
| `starlight` | `#ffdfa6` | Cards, active states, peach bands |
| `neutral-*` | stone scale | Backgrounds, borders |

Reference assets: `reference_images/` (home, select_location, select_date, ColorScheme, etc.) and PDFs (`site map.pdf`, `Design Style Guide.pdf`).

Image placeholder pattern:

- `src/config/landingImages.ts` — hero, we-help-connect, community CTA
- `src/config/exploreImages.ts` — map tile
- `src/components/landing/BackgroundImage.tsx` — `BackgroundImage` + `ContentImage` slots

---

## 4. Routes (`src/App.tsx`)

### Implemented (real UI)

| Path | Page | Notes |
|------|------|--------|
| `/` | `LandingPage` | Hero, sections, search pill, footer |
| `/explore` | `ExplorePage` | Results grid + map split; URL-driven filters |
| `/sign-in` | `SignInPage` | Split layout; page title says **"Log in"** |
| `/sign-up` | `SignUpPage` | First/last name, email, passwords, terms |
| `/welcome` | `WelcomePage` | Post-auth onboarding; role radio → `/explore` |
| `/account/*` | `AccountLayout` | Profile + placeholder sub-pages |

### Placeholders (`PageShell` via `AppShell`)

`/where`, `/when`, `/booking/*`, `/location/:id`, `/vendor/:id`, `/messages`, `/about/*`, etc. — scaffold only; not designed to match mockups yet.

---

## 5. Auth & account flow (implemented)

```mermaid
flowchart TD
  A[Guest] --> B{Account menu}
  B -->|Sign in| C[/sign-in]
  B -->|Create account| D[/sign-up]
  D -->|session created| E[/welcome]
  C -->|onboarding incomplete| E
  C -->|onboarding complete| F[/explore or return URL]
  E -->|Start booking| F
  G[/account/*] -->|onboarding incomplete| E
```

### Key files

| File | Role |
|------|------|
| `src/lib/supabase.ts` | Supabase client; `isSupabaseConfigured` guard |
| `src/features/auth/AuthContext.tsx` | Session, user, profile, `signOut`, `refreshProfile` |
| `src/services/profileService.ts` | `fetchProfile`, `updateProfile`, `setProfileRoles` |
| `src/lib/authRouting.ts` | `getPostAuthPath`, `getFirstName` |
| `src/components/auth/ProtectedRoute.tsx` | Redirects to `/sign-in` if unauthenticated |
| `src/components/auth/UserAccountMenu.tsx` | Top-right circle + dropdown |
| `src/components/auth/AuthChrome.tsx` | Auth pages header + footer |

### Account menu (signed out)

- **Sign in** → `/sign-in`
- **Create account** → `/sign-up`
- Do **not** add a duplicate "Log in" item (user explicitly removed it).

### Sign-up metadata (Supabase `user_metadata`)

```json
{ "first_name", "last_name", "display_name" }
```

### Onboarding

- `profiles.onboarding_completed` (boolean, default `false`)
- Welcome step sets **one** role via radio, then `onboarding_completed: true`
- Profile page allows **multiple** role checkboxes for later edits

### Role label mapping (UI ↔ DB)

| UI label | `app_role` enum |
|----------|-----------------|
| Creative vendor | `vendor` |
| Space vendor | `host` |
| Event planner/coordinator | `organizer` |

---

## 6. Supabase

### Project

- Cloud project ref example from conversation: `bvsneqsgbefuguajsait`
- URL pattern: `https://<project-ref>.supabase.co`

### Env vars (client only)

```env
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<Publishable key from dashboard>
```

- Use **Publishable** (anon) key in the client — **never** Secret/service role with `VITE_` prefix.
- Local: `.env.local` (gitignored). Vercel: set **Production + Preview** separately from **Development** (CLI quirk).

### Migration applied

`supabase/migrations/20260523120000_profiles_and_roles.sql`:

- `profiles` (1:1 with `auth.users`)
- `profile_roles` (`vendor` | `host` | `organizer`)
- RLS policies
- `handle_new_user()` trigger → auto-insert profile on sign-up

### CLI commands

```bash
npm run db:login
npm run db:link     # paste project ref when prompted
npm run db:push
```

See [SUPABASE.md](./SUPABASE.md) for full setup (CLI install options, auth dashboard, verify steps).

### Auth dashboard settings (important for prod)

- **Authentication → URL configuration:** add production `*.vercel.app` URL + `http://localhost:5173/**`
- Email provider enabled; **Confirm email** may be disabled for easier dev testing

---

## 7. Landing page (`/`)

Sections in `src/pages/LandingPage.tsx`:

1. **Hero** — `HeroSection` + `LandingHeader`
2. **We help connect** — two-column + image slot
3. **Built for the collective** — three orange audience cards
4. **Your community is waiting** — CTA cards → `/sign-up`, `/explore`
5. **Footer** — `LandingFooter`

### Hero search pill (`HeroSearchNav`)

Clickable segments with dropdowns:

- **where** → `LocationDropdown` (cities mock in `src/data/searchLocations.ts`)
- **when** → `DatePickerPopover` (May 2026, single/range)
- **explore** → `ExploreDropdown` (categories in `src/data/exploreCategories.ts`) → navigates to `/explore?...`

Shared search components live in `src/components/search/`.

---

## 8. Explore page (`/explore`)

- **Header:** `ExploreHeader` — logo, `ExploreSearchBar`, globe, calendar, `UserAccountMenu`
- **Layout:** ~58% results grid + ~42% sticky map
- **Toggle:** show map / show list (mobile switches; desktop shows both)
- **Filters:** parsed from URL via `src/lib/exploreSearch.ts` (`where`, `when`, `category`, `q`)
- **Data:** mock results in `src/data/exploreResults.ts` with `mapX`/`mapY` for marker positions
- **Map:** placeholder grid in `ResultsMap`; set `exploreImages.map` when ready

---

## 9. Source layout (high signal)

```
docs/                     # All project documentation (sources of truth)
  HANDOFF.md              # This file — start here for new sessions
  SYSTEM_ARCHITECTURE.md
  ProjectDeliverables.md
  CodingFundamentals.md
  SUPABASE.md
  README.md               # Doc index
src/
  App.tsx                 # All routes
  main.tsx                # AuthProvider wrapper
  index.css               # Tailwind theme
  pages/
    LandingPage.tsx
    ExplorePage.tsx
    auth/                 # SignIn, SignUp, Welcome
    account/              # AccountLayout, Profile, placeholders
  components/
    landing/              # Hero, sections, HeroSearchNav
    explore/              # Grid, map, header
    search/               # Location, date, explore dropdowns
    auth/                 # Menu, ProtectedRoute, AuthChrome
    ui/Button.tsx
  features/auth/          # AuthContext
  services/               # profileService
  lib/                    # supabase, exploreSearch, authRouting
  types/database.ts       # Hand-written types (not yet generated)
  data/                   # Mock vendors, results, locations, categories
  config/                 # Image path configs
supabase/
  migrations/
  README.md               # Pointer to docs/SUPABASE.md
reference_images/         # UI/UX PNG references
README.md                 # Setup + deploy (repo entry point)
```

---

## 10. Deployment (Vercel)

- Build: `npm run build` → `dist/`
- `vercel.json`: SPA fallback to `index.html`
- Set `VITE_SUPABASE_*` on Vercel for **Production** and **Preview** (separate CLI runs if using Development)
- Redeploy after env changes (vars baked at build time)
- User has working production auth after env + Supabase URL config

### Vercel CLI

```bash
brew install vercel-cli   # or npm i -g vercel
vercel login
vercel link
vercel env add VITE_SUPABASE_URL      # Production + Preview first
vercel env add VITE_SUPABASE_ANON_KEY
```

---

## 11. Team conventions ([CodingFundamentals.md](./CodingFundamentals.md))

- **Before coding:** describe approach and wait for approval if requirements are ambiguous.
- **>3 files:** break into smaller tasks first.
- **After code:** note what could break + suggested tests.
- **Commits:** only when user asks.
- **Supabase:** never expose service role in client; RLS is source of truth; use `services/` wrappers.
- **Docs:** update [SYSTEM_ARCHITECTURE.md](./SYSTEM_ARCHITECTURE.md) when schema/auth patterns change; add a row to **§0 Recent updates** in this file when major features ship.

---

## 12. What is NOT built yet (priority backlog)

Aligned with [ProjectDeliverables.md](./ProjectDeliverables.md) and [SYSTEM_ARCHITECTURE.md](./SYSTEM_ARCHITECTURE.md) phases:

| Priority | Feature | Notes |
|----------|---------|--------|
| High | Booking flow screens | `/booking/*` still `PageShell` |
| High | Vendor / venue detail pages | `/vendor/:id`, `/location/:id` |
| High | `vendor_profiles`, `venue_profiles` tables + migrations | Phase 3 |
| High | Replace mock explore data with Supabase queries | |
| Medium | Password reset, email confirm UX | Privacy page placeholder |
| Medium | Avatar upload (Storage) | `profiles.avatar_url` exists |
| Medium | Real map (Mapbox/Google/static image) | `exploreImages.map` |
| Medium | Messaging | `conversations` / `messages` |
| Medium | Reservations + studio areas + products | Phase 4 |
| Low | Workflow automations | Edge Functions |
| Low | Wire `/where` `/when` standalone pages or remove in favor of search pill | |
| Low | Generate `src/types/database.ts` from Supabase CLI | |
| Low | Sign-in page title says "Log in" while menu says "Sign in" — align if user wants consistency | |

### Sitemap reference (from `site map.pdf`)

Home → where/when/explore/messages/about/account → results → details → booking → payment → confirm. Many branches share the same checkout funnel.

---

## 13. Known gotchas

1. **Vite env vars** must be prefixed `VITE_` and require dev server restart / Vercel redeploy.
2. **Vercel `vercel env add`:** cannot select Development + Production/Preview in one command.
3. **Email confirmation:** if enabled in Supabase, sign-up may not get a session until email is confirmed → user lands on message, not `/welcome`.
4. **Explore route vs AppShell:** `/explore` is the real page; `/explore/results` under `AppShell` is still a placeholder.
5. **Bundle size warning** ~500KB — consider code-splitting later.
6. **Mock card locations** say "Seattle, WA" while filters may say Honolulu — intentional mock mismatch until real data.
7. **`UserAccountButton.tsx`** re-exports `UserAccountMenu` for backwards compatibility — prefer `UserAccountMenu`.
8. **Supabase CLI:** use `npm run db:*` scripts (dev dependency) unless you installed the CLI globally — see [SUPABASE.md](./SUPABASE.md).

---

## 14. Quick start for next agent

```bash
npm install
cp .env.example .env.local   # fill Supabase URL + Publishable key
npm run db:link              # paste project ref when prompted
npm run db:push
npm run dev                  # http://localhost:5173
```

**Smoke test path:**

1. `/` → open where/when/explore dropdowns
2. `/sign-up` → create account → `/welcome` → Start booking → `/explore`
3. Account circle → Sign out → Sign in
4. `/account/profile` → edit name/roles

---

## 15. Related docs

| File | Purpose |
|------|---------|
| [docs/README.md](./README.md) | Documentation index |
| [SYSTEM_ARCHITECTURE.md](./SYSTEM_ARCHITECTURE.md) | Supabase model, RLS, phases, decision log |
| [ProjectDeliverables.md](./ProjectDeliverables.md) | Scope + deliverable → architecture map |
| [CodingFundamentals.md](./CodingFundamentals.md) | Code style + Supabase rules |
| [SUPABASE.md](./SUPABASE.md) | CLI + migration steps |
| [../README.md](../README.md) | Setup + deploy |
| [../.env.example](../.env.example) | Env template |

---

*Last updated: 2026-07-07. Update §0 and relevant sections when major features ship or architecture changes.*
