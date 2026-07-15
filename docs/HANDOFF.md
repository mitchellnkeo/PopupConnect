# PopupConnect — Agent Handoff

**Living document** — update this file when the codebase, architecture, or team priorities change. It summarizes **what exists**, **how it works**, and **where to look next**.

**Read order:** this file → [ROADMAP.md](./ROADMAP.md) → [WORK_LOG.md](./WORK_LOG.md) (recent sessions) → [SYSTEM_ARCHITECTURE.md](./SYSTEM_ARCHITECTURE.md) → [ProjectDeliverables.md](./ProjectDeliverables.md) → [CodingFundamentals.md](./CodingFundamentals.md).

All project documentation lives in **`docs/`** — see [docs/README.md](./README.md) for the full index.

| Doc | Update when… |
|-----|----------------|
| [ROADMAP.md](./ROADMAP.md) | Priorities shift or work starts/completes |
| [WORK_LOG.md](./WORK_LOG.md) | Each work session (progress, troubleshooting) |
| [ProjectDeliverables.md](./ProjectDeliverables.md) | Deliverable status changes |
| [CHANGELOG.md](./CHANGELOG.md) | A version ships |
| This file (§0 + affected sections) | Architecture, routes, or major features change |

---

## 0. Recent updates (changelog)

| Date | Change |
|------|--------|
| 2026-07-15 | Team meeting captured in [ROADMAP.md](./ROADMAP.md): UX polish (icons, explore location fill, button hover), logged-in/out flows, login gate for quotes, map API, vendor package interactions, calendar/plan mode + export. Added [WORK_LOG.md](./WORK_LOG.md); refreshed [ProjectDeliverables.md](./ProjectDeliverables.md). |
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

**Current release:** `1.0.0` — see `src/config/version.ts`, root `VERSION`, [CHANGELOG.md](./CHANGELOG.md). Shown in site footer as `v1.0.0`.

**Not in repo yet:** Vercel Functions, Supabase Storage buckets, generated DB types, real map provider, real vendor/venue tables (explore uses mock data in `src/data/`).

---

## 3. Design tokens

Defined in `src/index.css`:

| Token | Hex | Usage |
|-------|-----|--------|
| `primary` | `#cc3d00` | Buttons, accents (Sienna Orange) |
| `midnight` | `#172e50` | Headings, nav text |
| `starlight` | `#ffdfa6` | Cards, active states, peach bands |
| `cream` | `#f5ede0` | Section backgrounds |
| `body` | `#102440` | Body copy |
| `accent` | `#c94b1f` | Section headings |
| `neutral-*` | stone scale | Backgrounds, borders |

Typography tokens: `--text-hero`, `--text-hero-sub` (hero headline + subcopy).

Reference assets: `reference_images/` (home, select_location, select_date, ColorScheme, etc.), Figma [Catalyst Design System](https://www.figma.com/design/Rr4R0eC6SzVheNO8Nlgxty/Catalyst-Design-System), [v.01_sandbox MVP 1](https://www.figma.com/design/xR1Xp9QmdUVHj55DmQFnO4/v.01_sandbox?node-id=121-3813) (plan mode / calendar flows), and PDFs (`site map.pdf`, `Design Style Guide.pdf`).

Image assets:

- `public/images/landing/` — hero, we-help-connect, community (from Figma)
- `public/images/explore/` — map placeholder
- `public/images/vendors/` — mock vendor photos
- `src/config/landingImages.ts`, `src/config/exploreImages.ts` — path constants
- `src/components/landing/BackgroundImage.tsx` — `BackgroundImage` + `ContentImage` slots

---

## 4. Routes (`src/App.tsx`)

### Implemented (real UI)

| Path | Page | Notes |
|------|------|--------|
| `/` | `LandingPage` | Hero, marketing sections, `HeroSearchNav`, footer |
| `/explore` | `ExplorePage` | URL-driven filters; results grid + map; vendor preview modal |
| `/vendor/:vendorId` | `VendorDetailPage` | Full vendor profile (mock data) |
| `/booking/quote` | `QuoteRequestPage` | Quote preview; `?vendor=` query param |
| `/booking/confirm` | `QuoteConfirmationPage` | Post-quote confirmation |
| `/sign-in` | `SignInPage` | Split layout; page title says **"Log in"** |
| `/sign-up` | `SignUpPage` | First/last name, email, passwords, terms |
| `/welcome` | `WelcomePage` | Post-auth onboarding; role radio → `/explore` |
| `/account` | `VendorAccountPage` | Protected; demo vendor account UI (mock vendor) |
| `/account/settings/*` | `AccountLayout` | Protected; profile + placeholder sub-pages |

`/booking` redirects to `/booking/quote`.

### Placeholders (`PageShell` via `AppShell`)

`/where`, `/when`, `/booking/review`, `/booking/payment`, `/location/:id`, `/messages`, `/about/*`, etc. — scaffold only.

### Shared layout components

- **`AppHeader`** — logo, optional `ExploreSearchBar`, account menu (used on explore, vendor, booking pages)
- **`LandingHeader`** — transparent overlay header on home hero
- **`LandingFooter`** — footer on landing + explore; shows `2026 · v1.0.0`

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

Clickable segments with dropdown panels:

- **where** → `LocationDropdown` (mock cities in `src/data/searchLocations.ts`)
- **when** → `DatePickerPopover` (single/range; month navigation)
- **explore** → `ExploreDropdown` (categories in `src/data/exploreCategories.ts`) → **search** navigates to `/explore?...`

Filter state is managed via `src/lib/exploreSearch.ts` (`ExploreFilters`, URL param helpers). Home hero uses Mona Sans headline (`--text-hero`); subcopy uses `--text-hero-sub`.

Shared search components: `src/components/search/`. Search bars: `HeroSearchNav` (home), `ExploreSearchBar` (explore header).

---

## 8. Explore page (`/explore`)

- **Header:** `AppHeader` with compact `ExploreSearchBar`
- **Layout:** ~42% results list + ~58% sticky map (desktop); stacked on mobile
- **Filters:** URL params via `exploreSearch.ts` — `where`, `when` / `whenStart`+`whenEnd`, `whenMonth`, `whenYear`, `category`, `q`
- **Results:** `filterExploreResults()` in `src/lib/vendorResults.ts` over mock data
- **Data:** `src/data/exploreResults.ts`, `src/data/vendors.ts` (6 Honolulu matcha vendors)
- **Interactions:** card hover ↔ map marker; card click → `VendorPreviewModal` → full profile or quote
- **Map:** static image in `ResultsMap` with positioned markers (`exploreImages.map`) — **real map API on [ROADMAP](./ROADMAP.md) P1**

**Known issues (2026-07-15):** location input segment background fill bug on explore search bar — see [ROADMAP](./ROADMAP.md) P0.

---

## 9. Vendor & booking flow (mock UI — v1.0.0)

```mermaid
flowchart LR
  A[/explore] --> B[Result card]
  B --> C[VendorPreviewModal]
  C --> D[/vendor/:id]
  C --> E[/booking/quote]
  E --> F[/booking/confirm]
```

- **Vendor detail:** gallery, packages, highlights, quote CTA
- **Quote request / confirm:** static quote line items; no persistence yet
- **`/account`:** demo vendor account page (not tied to signed-in user's vendor record)

### Planned changes (2026-07-15 meeting — see [ROADMAP.md](./ROADMAP.md))

- **Login gate:** quote flow should require sign-in before proceeding (not implemented yet).
- **Logged-in vs guest flows:** distinct UI/state paths through explore → vendor → booking.
- **Vendor packages:** hover fill + click popout for package details.
- **Pricing:** general prices on vendor profiles accepted as-is — no change required.

---

## 10. Source layout (high signal)

```
docs/                     # All project documentation (sources of truth)
  HANDOFF.md              # This file — start here for new sessions
  ROADMAP.md              # Prioritized backlog (living)
  WORK_LOG.md             # Session progress & troubleshooting (living)
  CHANGELOG.md            # Release notes (v1.0.0+)
  SYSTEM_ARCHITECTURE.md
  ProjectDeliverables.md
  CodingFundamentals.md
  SUPABASE.md
  README.md               # Doc index
VERSION                   # Plain-text release version (1.0.0)
src/
  App.tsx                 # All routes
  main.tsx                # AuthProvider wrapper
  index.css               # Tailwind theme + typography tokens
  config/
    version.ts            # APP_VERSION (footer, releases)
    landingImages.ts
    exploreImages.ts
  pages/
    LandingPage.tsx
    ExplorePage.tsx
    VendorDetailPage.tsx
    booking/              # QuoteRequest, QuoteConfirmation
    auth/                 # SignIn, SignUp, Welcome
    account/              # VendorAccountPage, AccountLayout, Profile
  components/
    layout/AppHeader.tsx  # Shared header + search bar
    landing/              # Hero, sections, HeroSearchNav, LandingFooter
    explore/              # ExploreSearchBar, ResultCard, ResultsMap
    search/               # Location, date, explore dropdowns
    vendor/               # VendorPreviewModal
    auth/                 # Menu, ProtectedRoute, AuthChrome
    ui/Button.tsx
  features/auth/          # AuthContext
  services/               # profileService
  lib/                    # supabase, exploreSearch, vendorResults, authRouting
  types/database.ts       # Hand-written types (not yet generated)
  data/                   # vendors, exploreResults, searchLocations, categories
public/images/            # landing, explore, vendors assets
supabase/migrations/
reference_images/         # UI/UX PNG references
README.md                 # Setup + deploy (repo entry point)
```

---

## 11. Deployment (Vercel)

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

## 12. Team conventions ([CodingFundamentals.md](./CodingFundamentals.md))

- **Before coding:** describe approach and wait for approval if requirements are ambiguous.
- **>3 files:** break into smaller tasks first.
- **After code:** note what could break + suggested tests.
- **Commits:** only when user asks.
- **Supabase:** never expose service role in client; RLS is source of truth; use `services/` wrappers.
- **Docs:** update [ROADMAP.md](./ROADMAP.md) and [WORK_LOG.md](./WORK_LOG.md) during active work; update [SYSTEM_ARCHITECTURE.md](./SYSTEM_ARCHITECTURE.md) when schema/auth patterns change; add a row to **§0 Recent updates** and [CHANGELOG.md](./CHANGELOG.md) when releases ship.

---

## 13. What is NOT built yet (priority backlog)

**Source of truth for active priorities:** [ROADMAP.md](./ROADMAP.md) (updated 2026-07-15 from team meeting).

### P0 — next up

| Feature | Notes |
|---------|-------|
| Explore location input background fill | Bug on explore search bar |
| Login required for quote | Gate `/booking/quote`; return URL after sign-in |
| Logged-in vs guest flows | Branching across discovery and booking |
| Button hover darkening | Primary button interaction polish |
| Friendly icon replacement | Replace placeholder icons |

### P1 — vendor & explore

| Feature | Notes |
|---------|-------|
| Vendor package hover fill + popout | Vendor detail page |
| Map API | Replace static map in `ResultsMap` |
| Vendor profile edit + Supabase | Tie `/account` to real data |

### P2 — plan mode / calendar (MVP 1 Figma)

| Feature | Notes |
|---------|-------|
| Calendar view + saved lists | Tabs or modes TBD |
| Export events (Excel/PDF) | Meeting requirement |
| Event details + invites | Organizer tooling |

### P3 — architecture backlog

Persist bookings/quotes, payment, messaging, avatar upload, generated DB types, venue profiles — see [ROADMAP.md](./ROADMAP.md) and [SYSTEM_ARCHITECTURE.md](./SYSTEM_ARCHITECTURE.md).

### Sitemap reference (from `site map.pdf`)

Home → search → explore results → vendor detail → quote → **login (planned)** → payment → confirm. **v1.0.0** covers through quote confirmation (mock, no login gate); payment and persistence remain.

---

## 14. Known gotchas

1. **Vite env vars** must be prefixed `VITE_` and require dev server restart / Vercel redeploy.
2. **Vercel `vercel env add`:** cannot select Development + Production/Preview in one command.
3. **Email confirmation:** if enabled in Supabase, sign-up may not get a session until email is confirmed → user lands on message, not `/welcome`.
4. **Explore route vs AppShell:** `/explore` is the real page; `/explore/results` under `AppShell` is still a placeholder.
5. **Bundle size warning** ~500KB — consider code-splitting later.
6. **Mock data scope:** default filters use Honolulu + matcha vendors; `searchLocations.ts` has houston, honolulu, hartford, hayward (not Seattle).
7. **`UserAccountButton.tsx`** re-exports `UserAccountMenu` for backwards compatibility — prefer `UserAccountMenu`.
8. **Supabase CLI:** use `npm run db:*` scripts (dev dependency) unless you installed the CLI globally — see [SUPABASE.md](./SUPABASE.md).
9. **Search dropdown z-index:** backdrop must stay below panel (`z-40` / `z-50` / `z-60`) — portaling backdrop above panels breaks search button clicks.

---

## 15. Quick start for next agent

```bash
npm install
cp .env.example .env.local   # fill Supabase URL + Publishable key
npm run db:link              # paste project ref when prompted
npm run db:push
npm run dev                  # http://localhost:5173
```

**Smoke test path (v1.0.0):**

1. `/` → open where/when/explore dropdowns → search → `/explore`
2. `/explore` → change filters; click vendor → preview modal → profile or quote
3. `/booking/quote` → continue → `/booking/confirm`
4. `/sign-up` → create account → `/welcome` → Start booking → `/explore`
5. Account circle → Sign out → Sign in
6. `/account/settings/profile` → edit name/roles
7. Footer shows `v1.0.0`

---

## 16. Related docs

| File | Purpose |
|------|---------|
| [docs/README.md](./README.md) | Documentation index |
| [ROADMAP.md](./ROADMAP.md) | Prioritized backlog (living) |
| [WORK_LOG.md](./WORK_LOG.md) | Session progress & troubleshooting (living) |
| [CHANGELOG.md](./CHANGELOG.md) | Release notes |
| [SYSTEM_ARCHITECTURE.md](./SYSTEM_ARCHITECTURE.md) | Supabase model, RLS, phases, decision log |
| [ProjectDeliverables.md](./ProjectDeliverables.md) | Scope + deliverable status |
| [CodingFundamentals.md](./CodingFundamentals.md) | Code style + Supabase rules |
| [SUPABASE.md](./SUPABASE.md) | CLI + migration steps |
| [../README.md](../README.md) | Setup + deploy |
| [../VERSION](../VERSION) | Current release version |
| [../.env.example](../.env.example) | Env template |

---

*Last updated: 2026-07-15 — living handoff; see ROADMAP for active work.*
