import type { GeoPoint } from "./geo";

export type GeocodedPlace = {
  label: string;
  lat: number;
  lng: number;
};

type NominatimHit = {
  lat: string;
  lon: string;
  display_name: string;
};

function formatLabel(displayName: string): string {
  return displayName
    .split(",")
    .slice(0, 3)
    .map((part) => part.trim())
    .filter(Boolean)
    .join(", ");
}

async function nominatim<T>(path: string, params: URLSearchParams): Promise<T> {
  const url = `https://nominatim.openstreetmap.org/${path}?${params.toString()}`;
  const response = await fetch(url, {
    headers: { Accept: "application/json" },
  });
  if (!response.ok) {
    throw new Error("Location lookup failed.");
  }
  return (await response.json()) as T;
}

export async function searchPlaces(query: string, limit = 5): Promise<GeocodedPlace[]> {
  const trimmed = query.trim();
  if (trimmed.length < 2) return [];

  const params = new URLSearchParams({
    q: trimmed,
    format: "json",
    limit: String(limit),
    addressdetails: "0",
  });

  const hits = await nominatim<NominatimHit[]>("search", params);
  return hits.map((hit) => ({
    label: formatLabel(hit.display_name),
    lat: Number(hit.lat),
    lng: Number(hit.lon),
  }));
}

export async function geocodeAddress(query: string): Promise<GeoPoint | null> {
  const [first] = await searchPlaces(query, 1);
  if (!first) return null;
  return { lat: first.lat, lng: first.lng };
}

export async function reverseGeocode(point: GeoPoint): Promise<string> {
  const params = new URLSearchParams({
    lat: String(point.lat),
    lon: String(point.lng),
    format: "json",
  });

  try {
    const hit = await nominatim<NominatimHit>("reverse", params);
    return formatLabel(hit.display_name);
  } catch {
    return "Current location";
  }
}
