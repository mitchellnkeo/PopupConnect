# PopupConnect — Work Log

**Living document** — append entries as work happens. Captures progression, decisions, and troubleshooting so future sessions (human or AI) can pick up context quickly.

**Format:** newest entries first.

---

## 2026-07-15 — P1: vendor packages, map API, vendor profiles

**Who:** Mitchell + AI session  
**Focus:** P1 roadmap — package UX, real explore map, Supabase vendor editing.

### Done

- **Package hover + popout** — `VendorPackageCard` (starlight hover fill), `VendorPackagePopout` with highlights and quote/sign-in CTA.
- **Map API** — `ExploreMap` using Leaflet + OpenStreetMap; mock vendors have `lat`/`lng` (Honolulu). No API key required.
- **Vendor profiles (Supabase)** — migration `20260715120000_vendor_profiles.sql` (`vendor_profiles`, `vendor_products`, RLS). `vendorService.ts`, `/account/settings/vendor` edit page, `/account` loads owner profile when present.

### Apply migration

```bash
npm run db:push
```

### Files added/changed

- `src/components/vendor/VendorPackageCard.tsx`, `VendorPackagePopout.tsx`
- `src/components/explore/ExploreMap.tsx`, `ResultsMap.tsx`
- `src/services/vendorService.ts`, `src/pages/account/VendorProfileEditPage.tsx`
- `supabase/migrations/20260715120000_vendor_profiles.sql`
- `leaflet`, `react-leaflet` dependencies

### Next up

Wire explore search to published `vendor_profiles`; P2 calendar/plan mode; optional Mapbox if team prefers styled tiles.

---

## 2026-07-15 — P0: auth flows + button hover

**Who:** Mitchell + AI session  
**Focus:** Logged-in vs guest UX differentiation; darker primary button hover.

### Done

- **Button hover** — Added `--color-primary-hover: #a83300` in `index.css`. Centralized classes in `src/lib/buttonStyles.ts`; updated `Button.tsx` and all inline primary buttons.
- **Guest vs member flows:**
  - `ExploreAuthBanner` — guest sign-in CTA vs logged-in welcome + my events link
  - `CommunityWaitingSection` — sign-up CTAs for guests; explore + my events for members
  - `VendorDetailPage` / `VendorPreviewModal` — "Sign in to book/quote" vs direct actions
  - `HeaderUtilityNav` — messages + calendar icons only when signed in
  - `UserAccountMenu` — sign-in/sign-up preserve current page as return URL

### Files changed

- `src/index.css`, `src/lib/buttonStyles.ts`, `src/hooks/useReturnPath.ts`
- `src/components/ui/Button.tsx`, `layout/HeaderUtilityNav.tsx`, `explore/ExploreAuthBanner.tsx`
- `src/components/landing/CommunityWaitingSection.tsx`, `LandingHeader.tsx`, `layout/AppHeader.tsx`
- `src/pages/ExplorePage.tsx`, `VendorDetailPage.tsx`, `components/vendor/VendorPreviewModal.tsx`
- `src/components/auth/UserAccountMenu.tsx`, booking pages

### Suggested tests

1. Signed out: explore shows guest banner; vendor shows "Sign in to book"; no calendar/message icons in header.
2. Signed in: explore welcome banner; landing community section shows member cards; vendor shows "Book now".
3. Primary buttons darken on hover (not lighten).

### Next up

Friendly icon replacement (ROADMAP P0 #5) or P1 vendor package hover.

---

## 2026-07-15 — P0: explore location fill + quote login gate

**Who:** Mitchell + AI session  
**Focus:** Ship first two P0 roadmap items from team meeting.

### Done

- **Explore location fill fix** — `ExploreSearchBar` compact variant: `overflow-hidden` on pill, `h-full` segment buttons, `rounded-l-full` / `rounded-r-full` on first/last segments so active/hover backgrounds fill the left cap cleanly.
- **Quote login gate** — `/booking/quote` and `/booking/confirm` wrapped in `ProtectedRoute`. Return URL includes query string (`?vendor=…`). Sign-in → welcome → quote resume path preserves `from` via location state (`SignInPage`, `SignUpPage`, `WelcomePage`).

### Files changed

- `src/components/explore/ExploreSearchBar.tsx`
- `src/components/auth/ProtectedRoute.tsx`
- `src/lib/authRouting.ts`
- `src/App.tsx`
- `src/pages/auth/SignInPage.tsx`, `SignUpPage.tsx`, `WelcomePage.tsx`

### What could break

- Guest users hitting `/booking/quote` directly now redirect to sign-in (intended).
- New users completing welcome should land on quote if that was their `from` URL; verify with `?vendor=` param intact.
- Explore search pill on mobile header — confirm location segment corners look correct at narrow widths.

### Suggested tests

1. Logged out → vendor detail → Book now → sign-in → (welcome if new) → quote page with same vendor.
2. Explore page → open location segment → active fill reaches rounded left edge with no white gap.
3. Logged in → quote flow works without redirect.

### Next up

Logged-in vs guest flow differentiation (ROADMAP P0 #3) or button hover darkening.

---

## 2026-07-15 — Documentation & meeting capture

**Who:** Mitchell + AI session  
**Focus:** Align docs with team meeting takeaways; establish ongoing ROADMAP and WORK_LOG.

### Done

- Created [ROADMAP.md](./ROADMAP.md) from 2026-07-15 meeting notes (UX polish, auth gating, vendor profiles, map API, calendar/plan mode).
- Created this WORK_LOG.md.
- Updated [HANDOFF.md](./HANDOFF.md) as a living doc — links to ROADMAP/WORK_LOG, meeting decisions, refreshed backlog pointer.
- Updated [ProjectDeliverables.md](./ProjectDeliverables.md) with deliverable status and roadmap cross-links.
- Updated [docs/README.md](./README.md) index.

### Meeting decisions captured

- Placeholder icons → replace with friendly-feeling set.
- Explore location input has a background fill bug to fix.
- Two flows: logged-in vs not logged-in; quote requires login before proceed.
- Vendor profile general pricing is acceptable for now.
- Map API needed on explore.
- Button hover should be darker; vendor package cards need hover fill + click popout.
- Vendor profile editing / fuller capabilities — build out over time.
- Calendar (MVP 1 plan mode in Figma) + export events to spreadsheet/PDF.

### Figma reference (prior session)

- Reviewed [v.01_sandbox MVP 1 page](https://www.figma.com/design/xR1Xp9QmdUVHj55DmQFnO4/v.01_sandbox?node-id=121-3813).
- Retrieved partial design notes (View-seat MCP rate limit on Amy's team file).
- Plan mode notes include: calendar view, saved lists, list/table customization, export — now reflected in ROADMAP.

### Next up (suggested)

See [ROADMAP.md](./ROADMAP.md) P0 items — likely starting with explore location fill fix or quote login gate.

### Open questions

- Map provider preference (Mapbox vs Google Maps vs other)?
- Calendar: tabbed calendar + saved lists vs separate routes?
- Icon source — Figma export, icon library (e.g. Phosphor, Heroicons), or custom?

---

## 2026-07-08 — v1.0.0 review release

**Focus:** First team-review deploy.

### Shipped

- Landing, explore, vendor detail, quote flow (mock), auth screens, account demo.
- Version `1.0.0` in footer and `src/config/version.ts`.
- Docs consolidated under `docs/`.

See [CHANGELOG.md](./CHANGELOG.md) for release details.

---

## 2026-05 — Phase 1 auth

**Focus:** Supabase integration foundation.

### Shipped

- Supabase client, sign-in/sign-up/welcome, profiles + roles migration.
- Account profile page, Vercel deploy with env vars.

See [HANDOFF.md](./HANDOFF.md) §5–6 and [SUPABASE.md](./SUPABASE.md).

---

## Template (copy for new entries)

```markdown
## YYYY-MM-DD — Short title

**Who:**  
**Focus:**

### Done
-

### Issues / troubleshooting
-

### Decisions
-

### Next up
-
```
