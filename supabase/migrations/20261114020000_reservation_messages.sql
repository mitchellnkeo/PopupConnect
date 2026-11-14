-- Messages attached to a quote / reservation. One thread per reservation.

create or replace function public.is_reservation_participant(res_id uuid)
returns boolean
language sql
stable
security invoker
set search_path = public
as $$
  select exists (
    select 1
    from public.reservations r
    where r.id = res_id
      and (
        r.guest_id = auth.uid()
        or (
          r.vendor_profile_id is not null
          and exists (
            select 1
            from public.vendor_profiles vp
            where vp.id = r.vendor_profile_id
              and vp.profile_id = auth.uid()
          )
        )
      )
  );
$$;

grant execute on function public.is_reservation_participant(uuid) to authenticated;

create table public.reservation_messages (
  id uuid primary key default gen_random_uuid(),
  reservation_id uuid not null references public.reservations (id) on delete cascade,
  sender_id uuid not null references public.profiles (id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now(),
  constraint reservation_messages_body_len check (
    char_length(btrim(body)) > 0
    and char_length(body) <= 2000
  )
);

create index reservation_messages_reservation_created_idx
  on public.reservation_messages (reservation_id, created_at);

alter table public.reservation_messages enable row level security;

create policy "Participants can read reservation messages"
  on public.reservation_messages
  for select
  to authenticated
  using (public.is_reservation_participant(reservation_id));

create policy "Participants can send reservation messages"
  on public.reservation_messages
  for insert
  to authenticated
  with check (
    sender_id = auth.uid()
    and public.is_reservation_participant(reservation_id)
  );
