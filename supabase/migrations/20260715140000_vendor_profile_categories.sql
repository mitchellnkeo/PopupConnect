-- Category tags for explore filtering (e.g. matcha-bar)

alter table public.vendor_profiles
  add column if not exists category_ids jsonb not null default '["matcha-bar"]'::jsonb;
