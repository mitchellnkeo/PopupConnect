-- Read receipts, system notes on status changes, and booked transitions.

alter table public.reservations
  add column if not exists guest_last_read_at timestamptz,
  add column if not exists vendor_last_read_at timestamptz;

alter table public.reservation_messages
  add column if not exists kind text not null default 'user';

alter table public.reservation_messages
  drop constraint if exists reservation_messages_kind_check;

alter table public.reservation_messages
  add constraint reservation_messages_kind_check
  check (kind in ('user', 'system'));

create or replace function public.set_reservation_status(
  res_id uuid,
  next_status public.reservation_status
)
returns public.reservations
language plpgsql
security definer
set search_path = public
as $$
declare
  current_row public.reservations;
  is_vendor boolean;
  old_status public.reservation_status;
  note text;
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;

  select * into current_row
  from public.reservations
  where id = res_id;

  if not found then
    raise exception 'Reservation not found';
  end if;

  is_vendor := current_row.vendor_profile_id is not null
    and exists (
      select 1
      from public.vendor_profiles vp
      where vp.id = current_row.vendor_profile_id
        and vp.profile_id = auth.uid()
    );

  if current_row.guest_id = auth.uid() then
    if not (
      (next_status = 'submitted' and current_row.status in ('draft', 'submitted', 'under_review'))
      or (next_status = 'cancelled' and current_row.status <> 'cancelled')
      or (next_status = 'booked' and current_row.status = 'confirmed')
    ) then
      raise exception 'Guests cannot set that status';
    end if;
  elsif is_vendor then
    if not (
      (next_status = 'confirmed' and current_row.status in ('submitted', 'under_review'))
      or (next_status = 'under_review' and current_row.status in ('submitted', 'under_review'))
      or (next_status = 'cancelled' and current_row.status in ('submitted', 'under_review', 'confirmed', 'booked'))
      or (next_status = 'booked' and current_row.status = 'confirmed')
    ) then
      raise exception 'Vendors cannot set that status';
    end if;
  else
    raise exception 'Not allowed';
  end if;

  old_status := current_row.status;

  update public.reservations
  set status = next_status
  where id = res_id
  returning * into current_row;

  if old_status is distinct from next_status then
    note := case next_status
      when 'submitted' then 'This quote was submitted.'
      when 'confirmed' then 'This quote was confirmed.'
      when 'booked' then 'The deposit was marked as arranged. This date is booked.'
      when 'cancelled' then
        case
          when is_vendor then 'This quote was declined.'
          else 'This quote was cancelled.'
        end
      else null
    end;

    if note is not null then
      insert into public.reservation_messages (reservation_id, sender_id, body, kind)
      values (res_id, auth.uid(), note, 'system');
    end if;
  end if;

  return current_row;
end;
$$;

grant execute on function public.set_reservation_status(uuid, public.reservation_status) to authenticated;

create or replace function public.mark_reservation_read(res_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  current_row public.reservations;
  is_vendor boolean;
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;

  select * into current_row
  from public.reservations
  where id = res_id;

  if not found then
    raise exception 'Reservation not found';
  end if;

  is_vendor := current_row.vendor_profile_id is not null
    and exists (
      select 1
      from public.vendor_profiles vp
      where vp.id = current_row.vendor_profile_id
        and vp.profile_id = auth.uid()
    );

  if current_row.guest_id = auth.uid() then
    update public.reservations
    set guest_last_read_at = now()
    where id = res_id;
  elsif is_vendor then
    update public.reservations
    set vendor_last_read_at = now()
    where id = res_id;
  else
    raise exception 'Not allowed';
  end if;
end;
$$;

grant execute on function public.mark_reservation_read(uuid) to authenticated;

create or replace function public.unread_reservation_thread_count()
returns integer
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(count(*)::integer, 0)
  from public.reservations r
  where (
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
  and exists (
    select 1
    from public.reservation_messages m
    where m.reservation_id = r.id
      and m.sender_id is distinct from auth.uid()
      and m.created_at > coalesce(
        case
          when r.guest_id = auth.uid() then r.guest_last_read_at
          else r.vendor_last_read_at
        end,
        'epoch'::timestamptz
      )
  );
$$;

grant execute on function public.unread_reservation_thread_count() to authenticated;
