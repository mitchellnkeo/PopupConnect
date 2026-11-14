import type { QuoteSnapshot } from "../lib/quoteSnapshot";
import { isSupabaseConfigured, supabase } from "../lib/supabase";
import type { Reservation, ReservationStatus } from "../types/database";

function mapReservation(row: Record<string, unknown>): Reservation {
  return {
    id: row.id as string,
    guest_id: row.guest_id as string,
    vendor_profile_id: (row.vendor_profile_id as string | null) ?? null,
    vendor_slug: row.vendor_slug as string,
    vendor_title: row.vendor_title as string,
    status: row.status as ReservationStatus,
    event_date: (row.event_date as string | null) ?? null,
    location: (row.location as string | null) ?? null,
    duration: (row.duration as string | null) ?? null,
    guest_count: row.guest_count != null ? Number(row.guest_count) : null,
    package_name: (row.package_name as string | null) ?? null,
    add_ons: (row.add_ons as string | null) ?? null,
    deposit_amount: Number(row.deposit_amount ?? 0),
    total_amount: Number(row.total_amount ?? 0),
    created_at: row.created_at as string,
    updated_at: row.updated_at as string,
  };
}

async function resolveVendorProfileId(slug: string): Promise<string | null> {
  const { data, error } = await supabase
    .from("vendor_profiles")
    .select("id")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (error) throw error;
  return (data?.id as string | undefined) ?? null;
}

export async function createReservation(
  guestId: string,
  snapshot: QuoteSnapshot,
  status: ReservationStatus,
): Promise<Reservation> {
  if (!isSupabaseConfigured) {
    throw new Error("Supabase is not configured.");
  }

  const vendorProfileId = await resolveVendorProfileId(snapshot.vendorSlug);

  const { data, error } = await supabase
    .from("reservations")
    .insert({
      guest_id: guestId,
      vendor_profile_id: vendorProfileId,
      vendor_slug: snapshot.vendorSlug,
      vendor_title: snapshot.vendorTitle,
      status,
      event_date: snapshot.eventDate,
      location: snapshot.location,
      duration: snapshot.duration,
      guest_count: snapshot.guestCount,
      package_name: snapshot.packageName,
      add_ons: snapshot.addOns,
      deposit_amount: snapshot.depositAmount,
      total_amount: snapshot.totalAmount,
    })
    .select("*")
    .single();

  if (error) throw error;
  return mapReservation(data as Record<string, unknown>);
}

export async function updateReservationStatus(
  reservationId: string,
  status: ReservationStatus,
): Promise<Reservation> {
  const { data, error } = await supabase
    .from("reservations")
    .update({ status })
    .eq("id", reservationId)
    .select("*")
    .single();

  if (error) throw error;
  return mapReservation(data as Record<string, unknown>);
}

export async function saveReservation(
  guestId: string,
  snapshot: QuoteSnapshot,
  status: ReservationStatus,
  reservationId?: string | null,
): Promise<Reservation> {
  if (reservationId) {
    const { data, error } = await supabase
      .from("reservations")
      .update({
        vendor_slug: snapshot.vendorSlug,
        vendor_title: snapshot.vendorTitle,
        status,
        event_date: snapshot.eventDate,
        location: snapshot.location,
        duration: snapshot.duration,
        guest_count: snapshot.guestCount,
        package_name: snapshot.packageName,
        add_ons: snapshot.addOns,
        deposit_amount: snapshot.depositAmount,
        total_amount: snapshot.totalAmount,
      })
      .eq("id", reservationId)
      .eq("guest_id", guestId)
      .select("*")
      .single();

    if (error) throw error;
    return mapReservation(data as Record<string, unknown>);
  }

  return createReservation(guestId, snapshot, status);
}

export async function fetchReservation(reservationId: string): Promise<Reservation | null> {
  if (!isSupabaseConfigured) return null;

  const { data, error } = await supabase
    .from("reservations")
    .select("*")
    .eq("id", reservationId)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;
  return mapReservation(data as Record<string, unknown>);
}

export async function fetchReservationsForGuest(guestId: string): Promise<Reservation[]> {
  if (!isSupabaseConfigured) return [];

  const { data, error } = await supabase
    .from("reservations")
    .select("*")
    .eq("guest_id", guestId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []).map((row) => mapReservation(row as Record<string, unknown>));
}

export async function fetchReservationsForVendor(
  vendorProfileId: string,
): Promise<Reservation[]> {
  if (!isSupabaseConfigured) return [];

  const { data, error } = await supabase
    .from("reservations")
    .select("*")
    .eq("vendor_profile_id", vendorProfileId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []).map((row) => mapReservation(row as Record<string, unknown>));
}
