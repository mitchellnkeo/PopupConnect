-- New terminal status after a confirmed quote's deposit is arranged.

alter type public.reservation_status add value if not exists 'booked';
