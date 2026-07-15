-- PopupConnect Phase 3: vendor profiles + products

create table public.vendor_profiles (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  slug text not null,
  title text not null,
  city text,
  about text,
  ideal_for text,
  starting_price numeric(10, 2),
  deposit numeric(10, 2),
  lead_time text,
  min_party_size integer,
  response_time text,
  image_url text,
  hero_image_url text,
  lat double precision,
  lng double precision,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (profile_id),
  unique (slug)
);

create index vendor_profiles_profile_id_idx on public.vendor_profiles (profile_id);
create index vendor_profiles_published_idx on public.vendor_profiles (published) where published = true;

create table public.vendor_products (
  id uuid primary key default gen_random_uuid(),
  vendor_profile_id uuid not null references public.vendor_profiles (id) on delete cascade,
  name text not null,
  description text,
  price numeric(10, 2) not null default 0,
  highlights jsonb not null default '[]'::jsonb,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index vendor_products_vendor_profile_id_idx on public.vendor_products (vendor_profile_id);

create trigger vendor_profiles_updated_at
  before update on public.vendor_profiles
  for each row
  execute function public.set_updated_at();

create trigger vendor_products_updated_at
  before update on public.vendor_products
  for each row
  execute function public.set_updated_at();

-- RLS
alter table public.vendor_profiles enable row level security;
alter table public.vendor_products enable row level security;

create policy "Published vendor profiles are publicly readable"
  on public.vendor_profiles
  for select
  to authenticated, anon
  using (published = true);

create policy "Owners can read own vendor profile"
  on public.vendor_profiles
  for select
  to authenticated
  using (profile_id = auth.uid());

create policy "Owners can insert own vendor profile"
  on public.vendor_profiles
  for insert
  to authenticated
  with check (profile_id = auth.uid());

create policy "Owners can update own vendor profile"
  on public.vendor_profiles
  for update
  to authenticated
  using (profile_id = auth.uid())
  with check (profile_id = auth.uid());

create policy "Products readable when vendor is published"
  on public.vendor_products
  for select
  to authenticated, anon
  using (
    exists (
      select 1
      from public.vendor_profiles vp
      where vp.id = vendor_profile_id
        and (vp.published = true or vp.profile_id = auth.uid())
    )
  );

create policy "Owners can manage own vendor products"
  on public.vendor_products
  for all
  to authenticated
  using (
    exists (
      select 1
      from public.vendor_profiles vp
      where vp.id = vendor_profile_id
        and vp.profile_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1
      from public.vendor_profiles vp
      where vp.id = vendor_profile_id
        and vp.profile_id = auth.uid()
    )
  );
