import type { ExploreResult } from "../data/exploreResults";
import { vendors } from "../data/vendors";
import type { ExploreFilters, ExplorePriceBand } from "./exploreSearch";
import { selectedCategoryIds } from "./exploreSearch";
import { DEFAULT_RADIUS_MILES, distanceMiles, normalizeSearchText } from "./geo";

export function vendorsToExploreResults(): ExploreResult[] {
  return vendors.map((vendor) => ({
    id: vendor.id,
    title: vendor.title,
    city: vendor.distance,
    locationCity: vendor.city,
    kind: vendor.kind ?? "vendor",
    mapX: vendor.mapX,
    mapY: vendor.mapY,
    lat: vendor.lat,
    lng: vendor.lng,
    imageSrc: vendor.imageSrc,
    categoryIds: vendor.categoryIds,
    searchText: [vendor.title, vendor.city, vendor.about, vendor.idealFor, ...vendor.tags].join(" "),
    startingPrice: vendor.startingPrice,
    createdAt: vendor.createdAt,
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

function matchesPrice(price: number, band: ExplorePriceBand) {
  if (band === "any") return true;
  if (band === "under-150") return price < 150;
  if (band === "under-300") return price < 300;
  return price >= 300;
}

function createdAtValue(result: ExploreResult) {
  return result.createdAt ?? "";
}

export function filterExploreResults(results: ExploreResult[], filters: ExploreFilters): ExploreResult[] {
  let filtered = results;
  const categoryIds = selectedCategoryIds(filters);

  if (categoryIds.length > 0) {
    filtered = filtered.filter((result) => categoryIds.some((id) => result.categoryIds?.includes(id)));
  }

  const origin =
    filters.lat != null && filters.lng != null ? { lat: filters.lat, lng: filters.lng } : null;
  const radius = DEFAULT_RADIUS_MILES;

  if (origin) {
    filtered = filtered
      .map((result) => ({
        ...result,
        distanceMiles: distanceMiles(origin, { lat: result.lat, lng: result.lng }),
      }))
      .filter((result) => result.distanceMiles <= radius);
  } else if (filters.where?.trim()) {
    filtered = filtered.filter((result) => matchesLocation(result, filters.where));
  }

  if (filters.query.trim()) {
    filtered = filtered.filter((result) => matchesQuery(result, filters.query));
  }

  if (filters.priceBand !== "any") {
    filtered = filtered.filter((result) => matchesPrice(result.startingPrice ?? 0, filters.priceBand));
  }

  if (filters.sort === "price") {
    return [...filtered].sort((a, b) => (a.startingPrice ?? 0) - (b.startingPrice ?? 0));
  }

  if (filters.sort === "newest") {
    return [...filtered].sort((a, b) => createdAtValue(b).localeCompare(createdAtValue(a)));
  }

  if (origin) {
    return [...filtered].sort((a, b) => (a.distanceMiles ?? 0) - (b.distanceMiles ?? 0));
  }

  return filtered;
}
