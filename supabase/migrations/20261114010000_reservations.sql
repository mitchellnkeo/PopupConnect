-- Quote / booking persistence (architecture: reservations)

create type public.reservation_status as enum (
  'draft',
  'submitted',
  'under_review',
  'confirmed',
  'cancelled'
);

create table public.reservations (
  id uuid primary key default gen_random_uuid(),
  guest_id uuid not null references public.profiles (id) on delete cascade,
  vendor_profile_id uuid references public.vendor_profiles (id) on delete set null,
  vendor_slug text not null,
  vendor_title text not null,
  status public.reservation_status not null default 'draft',
  event_date text,
  location text,
  duration text,
  guest_count integer,
  package_name text,
  add_ons text,
  deposit_amount numeric(10, 2) not null default 0,
  total_amount numeric(10, 2) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index reservations_guest_id_idx on public.reservations (guest_id);
create index reservations_vendor_profile_id_idx on public.reservations (vendor_profile_id);
create index reservations_created_at_idx on public.reservations (created_at desc);

create trigger reservations_updated_at
  before update on public.reservations
  for each row
  execute function public.set_updated_at();

alter table public.reservations enable row level security;

create policy "Guests can insert own reservations"
  on public.reservations
  for insert
  to authenticated
  with check (guest_id = auth.uid());

create policy "Guests can read own reservations"
  on public.reservations
  for select
  to authenticated
  using (guest_id = auth.uid());

create policy "Guests can update own reservations"
  on public.reservations
  for update
  to authenticated
  using (guest_id = auth.uid())
  with check (guest_id = auth.uid());

create policy "Vendors can read reservations for their listings"
  on public.reservations
  for select
  to authenticated
  using (
    vendor_profile_id is not null
    and exists (
      select 1
      from public.vendor_profiles vp
      where vp.id = vendor_profile_id
        and vp.profile_id = auth.uid()
    )
  );
