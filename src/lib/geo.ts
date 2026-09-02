export const DEFAULT_RADIUS_MILES = 25;

export type GeoPoint = {
  lat: number;
  lng: number;
};

/** Great-circle distance in miles. */
export function distanceMiles(a: GeoPoint, b: GeoPoint): number {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const earthMiles = 3958.8;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * earthMiles * Math.asin(Math.min(1, Math.sqrt(h)));
}

/** Axis-aligned box around a point. Used for SQL prefilter before haversine. */
export function boundingBox(origin: GeoPoint, radiusMiles: number) {
  const latDelta = radiusMiles / 69;
  const lngDelta = radiusMiles / (69 * Math.max(Math.cos((origin.lat * Math.PI) / 180), 0.01));
  return {
    south: origin.lat - latDelta,
    north: origin.lat + latDelta,
    west: origin.lng - lngDelta,
    east: origin.lng + lngDelta,
  };
}

export function normalizeSearchText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .trim();
}
