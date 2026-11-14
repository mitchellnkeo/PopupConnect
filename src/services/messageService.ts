import { isSupabaseConfigured, supabase } from "../lib/supabase";
import type { ReservationMessage } from "../types/database";

function mapMessage(
  row: Record<string, unknown>,
  names: Map<string, string | null>,
): ReservationMessage {
  const senderId = row.sender_id as string;
  return {
    id: row.id as string,
    reservation_id: row.reservation_id as string,
    sender_id: senderId,
    body: row.body as string,
    created_at: row.created_at as string,
    sender_name: names.get(senderId) ?? null,
  };
}

async function displayNamesFor(ids: string[]) {
  const unique = [...new Set(ids.filter(Boolean))];
  if (unique.length === 0) return new Map<string, string | null>();

  const { data, error } = await supabase.from("profiles").select("id, display_name").in("id", unique);
  if (error) throw error;

  return new Map(
    (data ?? []).map((row) => [row.id as string, (row.display_name as string | null) ?? null]),
  );
}

export async function fetchReservationMessages(
  reservationIds: string[],
): Promise<ReservationMessage[]> {
  if (!isSupabaseConfigured || reservationIds.length === 0) return [];

  const { data, error } = await supabase
    .from("reservation_messages")
    .select("id, reservation_id, sender_id, body, created_at")
    .in("reservation_id", reservationIds)
    .order("created_at", { ascending: true });

  if (error) throw error;
  const rows = (data ?? []) as Record<string, unknown>[];
  const names = await displayNamesFor(rows.map((row) => row.sender_id as string));
  return rows.map((row) => mapMessage(row, names));
}

export async function sendReservationMessage(
  reservationId: string,
  senderId: string,
  body: string,
): Promise<ReservationMessage> {
  if (!isSupabaseConfigured) {
    throw new Error("Supabase is not configured.");
  }

  const trimmed = body.trim();
  if (!trimmed) {
    throw new Error("Write a message before sending.");
  }

  const { data, error } = await supabase
    .from("reservation_messages")
    .insert({
      reservation_id: reservationId,
      sender_id: senderId,
      body: trimmed,
    })
    .select("id, reservation_id, sender_id, body, created_at")
    .single();

  if (error) throw error;

  const names = await displayNamesFor([senderId]);
  return mapMessage(data as Record<string, unknown>, names);
}

export async function fetchProfileNames(ids: string[]) {
  return displayNamesFor(ids);
}
