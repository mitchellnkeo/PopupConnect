-- Status-only updates for guests (submit / cancel) and vendors (confirm / decline).

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
    ) then
      raise exception 'Guests cannot set that status';
    end if;
  elsif is_vendor then
    if not (
      next_status in ('confirmed', 'cancelled', 'under_review')
      and current_row.status in ('submitted', 'under_review', 'confirmed')
    ) then
      raise exception 'Vendors cannot set that status';
    end if;
  else
    raise exception 'Not allowed';
  end if;

  update public.reservations
  set status = next_status
  where id = res_id
  returning * into current_row;

  return current_row;
end;
$$;

grant execute on function public.set_reservation_status(uuid, public.reservation_status) to authenticated;
