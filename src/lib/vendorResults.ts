import type { ExploreResult } from "../data/exploreResults";
import { vendors } from "../data/vendors";
import { DEFAULT_RADIUS_MILES, distanceMiles, normalizeSearchText } from "./geo";

export function vendorsToExploreResults(): ExploreResult[] {
  return vendors.map((vendor) => ({
    id: vendor.id,
    title: vendor.title,
    city: vendor.distance,
    locationCity: vendor.city,
    mapX: vendor.mapX,
    mapY: vendor.mapY,
    lat: vendor.lat,
    lng: vendor.lng,
    imageSrc: vendor.imageSrc,
    categoryIds: vendor.categoryIds,
    searchText: [vendor.title, vendor.city, vendor.about, vendor.idealFor, ...vendor.tags].join(" "),
  }));
}

function matchesLocation(result: ExploreResult, where: string) {
  const parts = where
    .toLowerCase()
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);

  if (parts.length === 0) return true;

  const haystack = `${result.locationCity ?? ""} ${result.city}`.toLowerCase();
  return parts.some((part) => haystack.includes(part));
}

function matchesQuery(result: ExploreResult, query: string) {
  const needle = normalizeSearchText(query);
  if (!needle) return true;

  const haystack = normalizeSearchText(
    [result.title, result.city, result.locationCity ?? "", result.searchText ?? "", ...(result.categoryIds ?? [])].join(
      " ",
    ),
  );
  return haystack.includes(needle);
}

export function filterExploreResults(
  results: ExploreResult[],
  filters: {
    categoryId: string | null;
    query: string;
    where?: string;
    lat?: number | null;
    lng?: number | null;
    radiusMiles?: number;
  },
): ExploreResult[] {
  let filtered = results;

  if (filters.categoryId) {
    filtered = filtered.filter((r) => r.categoryIds?.includes(filters.categoryId!));
  }

  const origin =
    filters.lat != null && filters.lng != null ? { lat: filters.lat, lng: filters.lng } : null;
  const radius = filters.radiusMiles ?? DEFAULT_RADIUS_MILES;

  if (origin) {
    filtered = filtered
      .map((result) => ({
        ...result,
        distanceMiles: distanceMiles(origin, { lat: result.lat, lng: result.lng }),
      }))
      .filter((result) => result.distanceMiles <= radius)
      .sort((a, b) => a.distanceMiles - b.distanceMiles);
  } else if (filters.where?.trim()) {
    filtered = filtered.filter((r) => matchesLocation(r, filters.where!));
  }

  if (filters.query.trim()) {
    filtered = filtered.filter((r) => matchesQuery(r, filters.query));
  }

  return filtered;
}
