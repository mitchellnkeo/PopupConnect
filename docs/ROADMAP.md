# PopupConnect — Roadmap

**Living document** — update this file when priorities shift, work starts, or items ship. For day-to-day progress and troubleshooting, see [WORK_LOG.md](./WORK_LOG.md).

**Last updated:** 2026-07-15 (P0 complete except friendly icons)

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
| Vendor packages — hover fill effect | **Todo** | Package cards on vendor detail page |
| Vendor page — click-to-view popout for package/info | **Todo** | Modal or drawer for package details without leaving profile |
| General prices on vendor profile pages | **Accepted as-is** | No change required per meeting |

### Auth & booking flows

| Item | Status | Notes |
|------|--------|-------|
| Distinct **logged-in** vs **not logged-in** flows | **Done** | Explore banner, landing CTAs, vendor CTAs, header nav, account menu return URLs |
| **Login required** before proceeding with quote | **Done** | `ProtectedRoute` on `/booking/quote` + `/booking/confirm`; return URL with `?vendor=` |
| Quote flow after login | **Done** | Return URL preserved through sign-in → welcome → quote |

### Vendor profiles (medium-term)

| Item | Status | Notes |
|------|--------|-------|
| Flesh out vendor profiles & capabilities | **Todo** | Edit option for vendor-owned pages; tie `/account` to real `vendor_profiles` |
| Vendor profile editing | **Todo** | Owner can update gallery, packages, pricing copy — depends on Supabase schema |

### Map & explore

| Item | Status | Notes |
|------|--------|-------|
| Map API implementation | **Todo** | Replace static map image in `ResultsMap` with real provider (Mapbox, Google Maps, etc.) |
| Replace mock explore data with Supabase | **Todo** | Depends on `vendor_profiles` / venues migrations — see [SYSTEM_ARCHITECTURE.md](./SYSTEM_ARCHITECTURE.md) |

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

1. Vendor package hover fill + click popout
2. Map API on explore page
3. Vendor profile edit + Supabase `vendor_profiles`

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
