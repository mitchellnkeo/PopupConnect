import type { ExploreResult } from "../data/exploreResults";
import { vendors } from "../data/vendors";

export function vendorsToExploreResults(): ExploreResult[] {
  return vendors.map((vendor) => ({
    id: vendor.id,
    title: vendor.title,
    city: vendor.distance,
    mapX: vendor.mapX,
    mapY: vendor.mapY,
    imageSrc: vendor.imageSrc,
    categoryIds: vendor.categoryIds,
  }));
}

export function filterExploreResults(
  results: ExploreResult[],
  filters: { categoryId: string | null; query: string },
): ExploreResult[] {
  let filtered = results;

  if (filters.categoryId) {
    filtered = filtered.filter((r) => r.categoryIds?.includes(filters.categoryId!));
  }

  if (filters.query.trim()) {
    const q = filters.query.trim().toLowerCase();
    filtered = filtered.filter((r) => r.title.toLowerCase().includes(q));
  }

  return filtered;
}
