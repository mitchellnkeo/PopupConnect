# Project deliverables

**Living document** — update status as features ship. Active work and priorities live in [ROADMAP.md](./ROADMAP.md). Session notes in [WORK_LOG.md](./WORK_LOG.md).

Backend and accounts follow **[SYSTEM_ARCHITECTURE.md](./SYSTEM_ARCHITECTURE.md)** (Supabase Auth + Postgres, RLS, Storage). See [README.md](./README.md) for the full doc index.

**Current release:** `1.0.0` — see [HANDOFF.md](./HANDOFF.md) for what is built vs placeholder.

---

## Quality bar

Every screen in the primary happy path is designed and built  
All branching scenarios (error states, edge cases, empty states, alternate paths) have corresponding screens accounted for  
No flow dead-ends — every screen connects to the next logical step  
The experience can be walked through in full, from entry point to completion  
Branding is clear and reflected in design  

**2026-07-15 addition:** Explicit **logged-in** and **not logged-in** paths; quote flow requires authentication before proceeding.

---

## Deliverable status

| Deliverable | Status | Notes |
|-------------|--------|-------|
| User personas & onboarding | **Partial** | Auth + welcome shipped; logged-in/out UI branching shipped |
| Gallery / explore vendors | **Partial** | Explore loads published Supabase profiles + mock fallback; DB vendors lack full gallery/highlights |
| Vendor profile (public) | **Partial** | Detail page resolves from catalog (Supabase + mock); package popout shipped |
| Vendor profile (owner edit) | **Partial** | `/account/settings/vendor` + migration shipped |
| Explore map | **Done** | Leaflet/OSM; markers from catalog lat/lng |
| Business location profile | **Not started** | `venue_profiles` planned |
| Manage reservations / quotes | **Partial** | Quote UI mock; **login gate shipped**; persistence not built |
| Payment | **Not started** | `/booking/payment` placeholder |
| Customer profile | **Partial** | Settings profile page shipped |
| Calendar / plan mode | **Not started** | MVP 1 Figma flows; export spreadsheet/PDF required |
| Messaging | **Not started** | Placeholder routes |
| Workflow automations | **Not started** | Later phase |
| Manage multiple studio areas | **Not started** | Host/venue feature |
| Manage multiple vendor products | **Partial** | UI shows packages; no owner CRUD |
| Map (real provider) | **Not started** | On roadmap — replace static explore map |
| Icons & interaction polish | **Partial** | Button hover shipped; friendly icons remain |

**Status key:** **Shipped** · **Partial** · **In planning** · **Not started**

---

## Product scope (original list)

- Vendor Profile
- Business Location Profile
- Gallery page of vendors
- User personas
- Messaging
- Workflow automations
- Manage reservations
- Customer profile
- Manage multiple studio areas
- Manage multiple vendor products or services

**Added from 2026-07-15 meeting:**

- Logged-in vs guest user flows (throughout discovery and booking)
- Login-required quote step
- Calendar / plan mode with event list and export (Excel/PDF)
- Real map on explore
- Vendor package interaction (hover fill, detail popout)

---

## Architecture mapping

| Deliverable | Supabase / app area | Roadmap |
|-------------|---------------------|---------|
| User personas | `profiles`, `profile_roles`, onboarding | P0 auth flows |
| Vendor profile, gallery | `vendor_profiles`, Storage | P1 |
| Business location profile, studio areas | `venue_profiles`, `studio_areas` | P3 |
| Manage reservations | `reservations` | P3 |
| Customer profile | `profiles` | Partial — shipped |
| Calendar / plan mode | `events`, `reservations` (TBD) | P2 |
| Messaging | `conversations`, `messages` | P3 |
| Workflow automations | Edge Functions / jobs | Later |
| Explore map | Map provider API + geo fields | P1 |

---

## When to update this file

1. A deliverable moves between status buckets (e.g. Partial → Shipped).
2. Scope changes from a meeting — add row + sync [ROADMAP.md](./ROADMAP.md).
3. Architecture mapping changes — also update [SYSTEM_ARCHITECTURE.md](./SYSTEM_ARCHITECTURE.md).

*Last updated: 2026-07-15*
