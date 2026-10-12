import { exploreCategories } from "../data/exploreCategories";
import type { ExploreResult } from "../data/exploreResults";
import type { ExploreFilters, ExplorePriceBand } from "./exploreSearch";
import { formatCategoryLabel, formatPriceBandLabel } from "./exploreSearch";

export const NEARBY_RADIUS_MILES = 5;

export type ExploreFacetId =
  | "popular"
  | "lowest-price"
  | "capacity-1-10"
  | "capacity-10-30"
  | "capacity-30-plus"
  | "top-rated"
  | "kid-friendly"
  | "best-match"
  | "nearby"
  | "no-deposit"
  | `price:${ExplorePriceBand}`
  | `category:${string}`;

export type ExploreFacet = {
  id: ExploreFacetId;
  label: string;
};

export const SORT_FACETS: readonly ExploreFacet[] = [
  { id: "popular", label: "Popular" },
  { id: "lowest-price", label: "Lowest price" },
];

export const SUGGESTED_FACETS: readonly ExploreFacet[] = [
  { id: "capacity-1-10", label: "1-10 people max" },
  { id: "capacity-10-30", label: "10-30 people max" },
  { id: "capacity-30-plus", label: ">30 people" },
  { id: "top-rated", label: "Top rated" },
  { id: "kid-friendly", label: "Kid-friendly" },
  { id: "best-match", label: "Best match" },
  { id: "nearby", label: "Nearby" },
  { id: "no-deposit", label: "No deposit needed" },
];

const PRICE_FACETS: readonly ExploreFacet[] = [
  { id: "price:under-150", label: formatPriceBandLabel("under-150") },
  { id: "price:under-300", label: formatPriceBandLabel("under-300") },
  { id: "price:300-plus", label: formatPriceBandLabel("300-plus") },
];

const KNOWN_FACETS: readonly ExploreFacet[] = [...SORT_FACETS, ...SUGGESTED_FACETS, ...PRICE_FACETS];

export function extraFilterFacets(): ExploreFacet[] {
  const categories = exploreCategories.map((category) => ({
    id: `category:${category.id}` as ExploreFacetId,
    label: formatCategoryLabel(category.id),
  }));
  return [...SORT_FACETS, ...PRICE_FACETS, ...categories];
}

export function facetLabel(id: ExploreFacetId): string {
  const known = KNOWN_FACETS.find((facet) => facet.id === id);
  if (known) return known.label;
  if (id.startsWith("category:")) return formatCategoryLabel(id.slice("category:".length));
  if (id.startsWith("price:")) return formatPriceBandLabel(id.slice("price:".length) as ExplorePriceBand);
  return id;
}

export function selectedFacets(filters: ExploreFilters): ExploreFacetId[] {
  const next = [...filters.facets] as ExploreFacetId[];
  if (filters.priceBand !== "any" && !next.some((facet) => facet.startsWith("price:"))) {
    next.push(`price:${filters.priceBand}`);
  }
  return next;
}

export function appliedFilterCount(filters: ExploreFilters): number {
  return selectedFacets(filters).length;
}

export function hasExploreFacets(filters: ExploreFilters): boolean {
  return appliedFilterCount(filters) > 0;
}

export function addExploreFacet(filters: ExploreFilters, id: ExploreFacetId): ExploreFilters {
  if (id.startsWith("price:")) {
    const priceBand = id.slice("price:".length) as ExplorePriceBand;
    return {
      ...filters,
      priceBand,
      facets: filters.facets.filter((facet) => !facet.startsWith("price:")),
    };
  }

  if (id.startsWith("category:")) {
    const categoryId = id.slice("category:".length);
    const categoryIds = selectedCategorySet(filters);
    if (!categoryIds.includes(categoryId)) categoryIds.push(categoryId);
    return {
      ...filters,
      categoryId: categoryIds.length === 1 ? categoryIds[0] : null,
      categoryIds,
    };
  }

  if (filters.facets.includes(id)) return filters;
  return { ...filters, facets: [...filters.facets, id] };
}

export function removeExploreFacet(filters: ExploreFilters, id: ExploreFacetId): ExploreFilters {
  if (id.startsWith("price:")) {
    return { ...filters, priceBand: "any" };
  }

  if (id.startsWith("category:")) {
    const categoryId = id.slice("category:".length);
    const categoryIds = selectedCategorySet(filters).filter((item) => item !== categoryId);
    return {
      ...filters,
      categoryId: categoryIds.length === 1 ? categoryIds[0] : null,
      categoryIds,
    };
  }

  return { ...filters, facets: filters.facets.filter((facet) => facet !== id) };
}

export function clearExploreFacets(filters: ExploreFilters): ExploreFilters {
  return {
    ...filters,
    facets: [],
    priceBand: "any",
    sort: "distance",
  };
}

function selectedCategorySet(filters: ExploreFilters): string[] {
  if (filters.categoryIds.length > 0) return [...filters.categoryIds];
  return filters.categoryId ? [filters.categoryId] : [];
}

export function appliedFacetChips(filters: ExploreFilters): ExploreFacet[] {
  return selectedFacets(filters).map((id) => ({ id, label: facetLabel(id) }));
}

export function suggestedFacetChips(filters: ExploreFilters): ExploreFacet[] {
  const applied = new Set(selectedFacets(filters));
  return SUGGESTED_FACETS.filter((facet) => !applied.has(facet.id));
}

export function addableFacetChips(filters: ExploreFilters): ExploreFacet[] {
  const applied = new Set(selectedFacets(filters));
  const primaryCategories = new Set(selectedCategorySet(filters));
  return extraFilterFacets().filter((facet) => {
    if (applied.has(facet.id)) return false;
    if (facet.id.startsWith("category:")) {
      return !primaryCategories.has(facet.id.slice("category:".length));
    }
    return true;
  });
}

const KID_FRIENDLY = /kid|family|young adult|children|all ages/i;

export function maxGuestsOf(result: Pick<ExploreResult, "tags" | "minPartySize" | "maxGuests">): number {
  if (result.maxGuests != null) return result.maxGuests;
  const tagged = result.tags?.find((tag) => /\d+\s*guests?/i.test(tag));
  const fromTag = tagged?.match(/(\d+)/)?.[1];
  if (fromTag) return Number(fromTag);
  return result.minPartySize ?? 10;
}

export function matchesExploreFacet(result: ExploreResult, id: ExploreFacetId): boolean {
  if (id === "popular") {
    return (result.avgRating ?? 0) >= 4.7 || (result.bookingsThisYear ?? 0) >= 80;
  }
  if (id === "lowest-price" || id === "best-match") return true;
  if (id === "top-rated") return (result.avgRating ?? 0) >= 4.8;
  if (id === "no-deposit") return (result.deposit ?? 0) === 0;
  if (id === "kid-friendly") {
    return KID_FRIENDLY.test([result.about, result.searchText, ...(result.tags ?? [])].join(" "));
  }
  if (id === "nearby") {
    return result.distanceMiles == null || result.distanceMiles <= NEARBY_RADIUS_MILES;
  }

  const guests = maxGuestsOf(result);
  if (id === "capacity-1-10") return guests <= 10;
  if (id === "capacity-10-30") return guests > 10 && guests <= 30;
  if (id === "capacity-30-plus") return guests > 30;
  return true;
}

export function sortExploreResults(results: ExploreResult[], filters: ExploreFilters): ExploreResult[] {
  const facets = selectedFacets(filters);
  if (facets.includes("lowest-price")) {
    return [...results].sort((a, b) => (a.startingPrice ?? 0) - (b.startingPrice ?? 0));
  }
  if (facets.includes("popular")) {
    return [...results].sort((a, b) => (b.bookingsThisYear ?? 0) - (a.bookingsThisYear ?? 0));
  }
  if (facets.includes("top-rated")) {
    return [...results].sort((a, b) => (b.avgRating ?? 0) - (a.avgRating ?? 0));
  }
  return results;
}
