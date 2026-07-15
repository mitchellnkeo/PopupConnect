# Project deliverables

Backend and accounts follow **[SYSTEM_ARCHITECTURE.md](./SYSTEM_ARCHITECTURE.md)** (Supabase Auth + Postgres, RLS, Storage). See [README.md](./README.md) for the full doc index.

**Implementation status (v1.0.0):** See [HANDOFF.md](./HANDOFF.md) for what is built vs placeholder. Summary: landing, explore, vendor detail, and quote UI are live on mock data; persistence, payment, and messaging are not.

## Quality bar

Every screen in the primary happy path is designed and built
All branching scenarios (error states, edge cases, empty states, alternate paths) have corresponding screens accounted for
No flow dead-ends — every screen connects to the next logical step
The experience can be walked through in full, from entry point to completion
Branding is clear and reflected in design

Vendor Profile
Business Location Profile
Gallery page of vendors
User personas
Messaging
Workflow automations
Manage reservations
Customer profile
Manage multiple studio areas
Manage multiple vendor products or services

## Architecture mapping

| Deliverable | Supabase / app area |
|-------------|---------------------|
| User personas | `profiles`, `profile_roles`, onboarding |
| Vendor profile, gallery | `vendor_profiles`, Storage |
| Business location profile, studio areas | `venue_profiles`, `studio_areas` |
| Manage reservations | `reservations` |
| Customer profile | `profiles` |
| Messaging | `conversations`, `messages` |
| Workflow automations | Edge Functions / jobs (later phase) |