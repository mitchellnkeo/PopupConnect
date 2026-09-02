# PopupConnect — Roadmap

**Living document** — update this file when priorities shift, work starts, or items ship. For day-to-day progress and troubleshooting, see [WORK_LOG.md](./WORK_LOG.md).

**Last updated:** 2026-09-02 (admin dashboards)

---

## How to use this doc

| When… | Do this |
|-------|---------|
| Starting a task | Move item to **In progress**; add a [WORK_LOG](./WORK_LOG.md) entry |
| Shipping a feature | Mark **Done**; update [HANDOFF.md](./HANDOFF.md) §0, [ProjectDeliverables.md](./ProjectDeliverables.md), and [CHANGELOG.md](./CHANGELOG.md) if release-worthy |
| Scope changes | Edit priority/status here first, then sync deliverables |

**Design reference:** [Figma v.01_sandbox — MVP 1](https://www.figma.com/design/xR1Xp9QmdUVHj55DmQFnO4/v.01_sandbox?node-id=121-3813) (plan mode / calendar flows live under MVP 1 page).

---

## Meeting takeaways — 2026-07-15

Captured from team review of v1.0.0 prototype.

### UX polish (near-term)

| Item | Status | Notes |
|------|--------|-------|
| Replace placeholder icons with friendly-feeling icons | **Todo** | Audit current icon usage (landing cards, explore, vendor, auth); align with Figma Catalyst / MVP 1 |
| Explore page — location input background fill bug | **Done** | `ExploreSearchBar` compact — overflow clip, corner rounding, full-height segments |
| Button hover — darker interaction state | **Done** | `--color-primary-hover` token + shared `buttonStyles.ts` |
| Vendor packages — hover fill effect | **Done** | `VendorPackageCard` hover + `VendorPackagePopout` |
| Vendor page — click-to-view popout for package/info | **Done** | Click package → detail modal with highlights + quote CTA |
| General prices on vendor profile pages | **Accepted as-is** | No change required per meeting |

### Auth & booking flows

| Item | Status | Notes |
|------|--------|-------|
| Distinct **logged-in** vs **not logged-in** flows | **Done** | Explore banner, landing CTAs, vendor CTAs, header nav, account menu return URLs |
| **Login required** before proceeding with quote | **Done** | `ProtectedRoute` on `/booking/quote` + `/booking/confirm`; return URL with `?vendor=` |
| Quote flow after login | **Done** | Return URL preserved through sign-in → welcome → quote |
| Admin accounts can open every role dashboard | **Done** | Allowlist in `src/lib/admins.ts`; `/account`, `/account/vendor`, `/account/planner`, `/account/host` |

### Vendor profiles (medium-term)

| Item | Status | Notes |
|------|--------|-------|
| Flesh out vendor profiles & capabilities | **Partial** | Edit page + account tie-in shipped; gallery/highlights still mock on public page |
| Vendor profile editing | **Done** | `/account/settings/vendor` + `vendor_profiles` / `vendor_products` migration |

### Map & explore

| Item | Status | Notes |
|------|--------|-------|
| Map API implementation | **Done** | Leaflet + OpenStreetMap tiles in `ExploreMap`; lat/lng on mock vendors |
| Replace mock explore data with Supabase | **Done** | `vendorCatalog.ts` + `useVendorCatalog`; explore, vendor detail, quote pages merge published profiles with mock fallback |
| Honest date filter + richer text search | **Done** | Dates are planning-only copy; query matches title/about/tags; empty states + Clear filters |
| Location geocode + 25-mile radius | **Done** | Nominatim + curated cities; URL `lat`/`lng`; sort by distance; current location |
| Map bounds + marker click | **Done** | Fit bounds on result set change; marker click opens vendor preview |
| Vendor city geocode on save | **Done** | `VendorProfileEditPage` writes `lat`/`lng` from Nominatim |
| Sort / multi-category / price filters | **Done** | `ExploreRefineBar`; URL `sort`, `categories`, `price` |
| Map search this area | **Done** | Button after panning ~1.5 miles from the search origin |
| Mobile list / map tabs | **Done** | Tabs on small screens; desktop list + map unchanged |
| Server-side explore filters | **Done** | Category / text / bbox / price pushed into `vendor_profiles` query |
| Map marker clustering | **Done** | `react-leaflet-cluster` with brand cluster icons |
| Production email / domain | **Blocked** | App email-change form is ready; needs domain + Resend SMTP |

### Plan mode / calendar (MVP 1 — larger feature)

From Figma MVP 1 **flow: plan mode** and meeting notes:

| Item | Status | Notes |
|------|--------|-------|
| Calendar view — events in one place | **Todo** | New route(s); calendar + list modes discussed in Figma notes |
| Event details + guest invites in one area | **Todo** | Post-booking / organizer experience |
| Saved lists + planning mode | **Todo** | Tabs: calendar vs saved lists (Figma open question) |
| List view — filter columns, customize table | **Todo** | Wide-out event list |
| Export calendar events as **spreadsheet or PDF** | **Todo** | Explicit meeting requirement |

---

## Priority tiers

### P0 — Ship next (polish + gating)

1. ~~Explore location input background fill fix~~ **Done**
2. ~~Login required for quote flow~~ **Done**
3. ~~Logged-in vs logged-out flow differentiation~~ **Done**
4. ~~Button hover darkening~~ **Done**
5. Friendly icon replacement pass

### P1 — Vendor & explore depth

1. ~~Vendor package hover fill + click popout~~ **Done**
2. ~~Map API on explore page~~ **Done** (Leaflet + OSM)
3. ~~Vendor profile edit + Supabase `vendor_profiles`~~ **Done** — run `npm run db:push` to apply migrations
4. ~~Wire explore + public vendor pages to published profiles~~ **Done** — includes `20260715140000_vendor_profile_categories.sql`
5. ~~Explore radius search + map click-through (Phase B)~~ **Done** — Nominatim, 25-mile filter, vendor geocode on save
6. ~~Explore refine + mobile map tabs + search this area (Phase C)~~ **Done**

### P2 — Plan mode / calendar

1. Calendar page (view + list modes)
2. Saved lists / planning mode
3. Export to Excel/PDF
4. Event details + invite tooling

### P3 — Backlog (from architecture phases)

- Quote/booking persistence (`reservations` table)
- Payment step (`/booking/payment`)
- Messaging
- Avatar upload (Storage)
- Generated DB types from Supabase CLI

Full architecture phases: [SYSTEM_ARCHITECTURE.md](./SYSTEM_ARCHITECTURE.md).

---

## Status legend

| Status | Meaning |
|--------|---------|
| **Todo** | Not started |
| **In progress** | Actively being worked |
| **Blocked** | Waiting on dependency or decision |
| **Done** | Shipped; docs updated |
| **Accepted as-is** | Reviewed; no work planned |

---

## Related docs

| File | Role |
|------|------|
| [HANDOFF.md](./HANDOFF.md) | Current codebase snapshot for agents |
| [ProjectDeliverables.md](./ProjectDeliverables.md) | Product scope ↔ architecture map |
| [WORK_LOG.md](./WORK_LOG.md) | Session-by-session progress and troubleshooting |
| [CHANGELOG.md](./CHANGELOG.md) | Release notes |
