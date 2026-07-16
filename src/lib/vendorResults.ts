import type { ExploreResult } from "../data/exploreResults";
import { vendors } from "../data/vendors";

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

export function filterExploreResults(
  results: ExploreResult[],
  filters: { categoryId: string | null; query: string; where?: string },
): ExploreResult[] {
  let filtered = results;

  if (filters.categoryId) {
    filtered = filtered.filter((r) => r.categoryIds?.includes(filters.categoryId!));
  }

  if (filters.where?.trim()) {
    filtered = filtered.filter((r) => matchesLocation(r, filters.where!));
  }

  if (filters.query.trim()) {
    const q = filters.query.trim().toLowerCase();
    filtered = filtered.filter((r) => r.title.toLowerCase().includes(q));
  }

  return filtered;
}
