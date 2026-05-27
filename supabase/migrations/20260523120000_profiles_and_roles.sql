-- PopupConnect Phase 1: profiles + roles
-- Run via Supabase CLI (`supabase db push`) or paste into SQL Editor in the dashboard.

-- Roles enum
create type public.app_role as enum ('vendor', 'host', 'organizer');

-- Profiles (1:1 with auth.users)
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  avatar_url text,
  onboarding_completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Role membership (users may have multiple roles)
create table public.profile_roles (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (profile_id, role)
);

create index profile_roles_profile_id_idx on public.profile_roles (profile_id);

-- updated_at trigger
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
  before update on public.profiles
  for each row
  execute function public.set_updated_at();

-- Auto-create profile on sign-up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data ->> 'display_name',
      split_part(new.email, '@', 1)
    )
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- RLS
alter table public.profiles enable row level security;
alter table public.profile_roles enable row level security;

create policy "Profiles are publicly readable"
  on public.profiles
  for select
  to authenticated, anon
  using (true);

create policy "Users can insert own profile"
  on public.profiles
  for insert
  to authenticated
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles
  for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "Profile roles are readable when authenticated"
  on public.profile_roles
  for select
  to authenticated
  using (true);

create policy "Users can manage own roles"
  on public.profile_roles
  for all
  to authenticated
  using (profile_id = auth.uid())
  with check (profile_id = auth.uid());
