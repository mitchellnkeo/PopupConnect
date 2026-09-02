import { exploreCategories } from "../data/exploreCategories";
import { findCuratedLocation } from "../data/searchLocations";

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

export type ExploreSort = "distance" | "price" | "newest";
export type ExplorePriceBand = "any" | "under-150" | "under-300" | "300-plus";

export type ExploreFilters = {
  where: string;
  lat: number | null;
  lng: number | null;
  whenDay: number;
  whenMonth: number;
  whenYear: number;
  whenMode: "single" | "range";
  whenEndDay: number;
  whenEndMonth: number;
  categoryId: string | null;
  categoryIds: string[];
  query: string;
  sort: ExploreSort;
  priceBand: ExplorePriceBand;
};

export const defaultExploreFilters: ExploreFilters = {
  where: "honolulu, hi",
  lat: 21.3069,
  lng: -157.8583,
  whenDay: 15,
  whenMonth: 7,
  whenYear: 2026,
  whenMode: "single",
  whenEndDay: 15,
  whenEndMonth: 7,
  categoryId: "matcha-bar",
  categoryIds: ["matcha-bar"],
  query: "",
  sort: "distance",
  priceBand: "any",
};

function parseMonth(value: string | null, fallback: number) {
  const month = Number(value);
  return Number.isFinite(month) && month >= 0 && month <= 11 ? month : fallback;
}

function parseDay(value: string | null, fallback: number) {
  const day = Number(value);
  return Number.isFinite(day) && day >= 1 && day <= 31 ? day : fallback;
}

function parseYear(value: string | null, fallback: number) {
  const year = Number(value);
  return Number.isFinite(year) && year >= 2000 && year <= 2100 ? year : fallback;
}

function parseCoord(value: string | null): number | null {
  if (value == null || value === "") return null;
  const coord = Number(value);
  return Number.isFinite(coord) ? coord : null;
}

const SORTS: ExploreSort[] = ["distance", "price", "newest"];
const PRICE_BANDS: ExplorePriceBand[] = ["any", "under-150", "under-300", "300-plus"];

function parseSort(value: string | null): ExploreSort {
  return SORTS.includes(value as ExploreSort) ? (value as ExploreSort) : defaultExploreFilters.sort;
}

function parsePriceBand(value: string | null): ExplorePriceBand {
  return PRICE_BANDS.includes(value as ExplorePriceBand)
    ? (value as ExplorePriceBand)
    : defaultExploreFilters.priceBand;
}

function parseCategoryIds(params: URLSearchParams): string[] {
  const multi = params.get("categories");
  if (multi) {
    return multi
      .split(",")
      .map((part) => part.trim())
      .filter(Boolean);
  }
  if (params.has("category")) {
    const single = params.get("category");
    return single ? [single] : [];
  }
  return defaultExploreFilters.categoryIds;
}

export function selectedCategoryIds(filters: ExploreFilters): string[] {
  if (filters.categoryIds.length > 0) return filters.categoryIds;
  return filters.categoryId ? [filters.categoryId] : [];
}

export function parseExploreFilters(params: URLSearchParams): ExploreFilters {
  const where = params.get("where") ?? defaultExploreFilters.where;
  const categoryIds = parseCategoryIds(params);
  const categoryId = categoryIds.length === 1 ? categoryIds[0] : null;
  const query = params.get("q") ?? "";
  const sort = parseSort(params.get("sort"));
  const priceBand = parsePriceBand(params.get("price"));

  const whenYear = parseYear(params.get("whenYear"), defaultExploreFilters.whenYear);
  const whenStart = params.get("whenStart");
  const whenEnd = params.get("whenEnd");
  const when = params.get("when");
  const curated = findCuratedLocation(where);
  const lat = parseCoord(params.get("lat")) ?? curated?.lat ?? null;
  const lng = parseCoord(params.get("lng")) ?? curated?.lng ?? null;

  if (whenStart && whenEnd) {
    const whenDay = parseDay(whenStart, defaultExploreFilters.whenDay);
    const whenEndDay = parseDay(whenEnd, defaultExploreFilters.whenEndDay);
    const whenMonth = parseMonth(params.get("whenMonth"), defaultExploreFilters.whenMonth);
    const whenEndMonth = parseMonth(
      params.get("whenEndMonth"),
      whenMonth,
    );

    return {
      where,
      lat,
      lng,
      categoryId,
      categoryIds,
      query,
      sort,
      priceBand,
      whenMode: "range",
      whenDay,
      whenEndDay,
      whenMonth,
      whenEndMonth,
      whenYear,
    };
  }

  const whenDay = when ? parseDay(when, defaultExploreFilters.whenDay) : defaultExploreFilters.whenDay;
  const whenMonth = parseMonth(params.get("whenMonth"), defaultExploreFilters.whenMonth);

  return {
    where,
    lat,
    lng,
    categoryId,
    categoryIds,
    query,
    sort,
    priceBand,
    whenMode: "single",
    whenDay,
    whenEndDay: whenDay,
    whenMonth,
    whenEndMonth: whenMonth,
    whenYear,
  };
}

export function formatLocationLabel(where: string) {
  return where
    .split(",")
    .map((part) =>
      part
        .trim()
        .split(/\s+/)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" "),
    )
    .join(", ");
}

export function formatDateLabel(filters: ExploreFilters) {
  const { whenDay, whenMonth, whenYear, whenMode, whenEndDay, whenEndMonth } = filters;
  const startMonth = MONTH_NAMES[whenMonth] ?? "August";
  const endMonth = MONTH_NAMES[whenEndMonth] ?? startMonth;

  if (whenMode === "range" && (whenEndDay !== whenDay || whenEndMonth !== whenMonth)) {
    return `${startMonth} ${whenDay} – ${endMonth} ${whenEndDay}, ${whenYear}`;
  }

  return `${startMonth} ${whenDay}, ${whenYear}`;
}

export function formatCategoryLabel(categoryId: string | null) {
  if (!categoryId) return "All vendors";
  const match = exploreCategories.find((c) => c.id === categoryId);
  if (!match) return "All vendors";
  if (categoryId === "dj-live-music") return "DJs & Live music";
  if (categoryId === "matcha-bar") return "Matcha Bar";
  return match.label
    .split("/")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" / ");
}

/** Third search pill: free-text query takes priority over category label. */
export function formatExploreQueryLabel(filters: ExploreFilters) {
  const trimmed = filters.query.trim();
  if (trimmed) return trimmed;
  const ids = selectedCategoryIds(filters);
  if (ids.length > 1) return `${ids.length} categories`;
  if (ids.length === 1) return formatCategoryLabel(ids[0]);
  return "Explore vendors";
}

export function formatSortLabel(sort: ExploreSort) {
  if (sort === "price") return "Price";
  if (sort === "newest") return "Newest";
  return "Distance";
}

export function formatPriceBandLabel(band: ExplorePriceBand) {
  if (band === "under-150") return "Under $150";
  if (band === "under-300") return "Under $300";
  if (band === "300-plus") return "$300+";
  return "Any price";
}

export function exploreEmptyCopy(filters: ExploreFilters) {
  const city = formatLocationLabel(filters.where).split(",")[0]?.trim() ?? "this area";
  const ids = selectedCategoryIds(filters);

  if (filters.query.trim()) {
    return {
      title: `No results for “${filters.query.trim()}”`,
      hint: `Nothing in ${city} matches that search. Try different words or clear filters.`,
    };
  }

  if (ids.length > 1) {
    return {
      title: `No matching vendors nearby`,
      hint: `No matches within 25 miles of ${city} for those categories. Try fewer filters.`,
    };
  }

  if (ids.length === 1) {
    return {
      title: `No ${formatCategoryLabel(ids[0]).toLowerCase()} nearby`,
      hint: `No matches within 25 miles of ${city}. Try another category or location.`,
    };
  }

  return {
    title: `No vendors near ${city}`,
    hint: "Try a different city or clear filters to see more results.",
  };
}

export function resultsHeading(filters: ExploreFilters) {
  const city = formatLocationLabel(filters.where).split(",")[0]?.trim() ?? "your area";
  const ids = selectedCategoryIds(filters);

  if (filters.query.trim()) {
    return `${filters.query.trim()} in ${city}`;
  }

  if (ids.length > 1) return `${ids.length} categories in ${city}`;
  if (ids[0] === "dj-live-music") return `DJs in ${city}`;
  if (ids[0] === "matcha-bar") return `Matcha Bars in ${city}`;

  const cat = formatCategoryLabel(ids[0] ?? null);
  return `${cat} in ${city}`;
}

export function filtersToSearchParams(filters: ExploreFilters) {
  const params = new URLSearchParams();
  if (filters.where) params.set("where", filters.where);
  if (filters.lat != null) params.set("lat", String(filters.lat));
  if (filters.lng != null) params.set("lng", String(filters.lng));
  if (filters.query.trim()) params.set("q", filters.query.trim());
  const categoryIds = selectedCategoryIds(filters);
  if (categoryIds.length > 1) {
    params.set("categories", categoryIds.join(","));
  } else if (categoryIds.length === 1) {
    params.set("category", categoryIds[0]);
  }
  if (filters.sort !== "distance") params.set("sort", filters.sort);
  if (filters.priceBand !== "any") params.set("price", filters.priceBand);
  params.set("whenYear", String(filters.whenYear));

  if (filters.whenMode === "range") {
    params.set("whenStart", String(filters.whenDay));
    params.set("whenEnd", String(filters.whenEndDay));
    params.set("whenMonth", String(filters.whenMonth));
    params.set("whenEndMonth", String(filters.whenEndMonth));
  } else {
    params.set("when", String(filters.whenDay));
    params.set("whenMonth", String(filters.whenMonth));
  }

  return params;
}

export function hasExploreSearchParams(params: URLSearchParams) {
  return (
    params.has("where") ||
    params.has("lat") ||
    params.has("lng") ||
    params.has("when") ||
    params.has("whenStart") ||
    params.has("category") ||
    params.has("categories") ||
    params.has("sort") ||
    params.has("price") ||
    params.has("q")
  );
}

export function buildExploreSearchParams(filters: ExploreFilters) {
  return filtersToSearchParams({ ...defaultExploreFilters, ...filters });
}
