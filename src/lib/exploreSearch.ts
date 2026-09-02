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
  query: string;
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
  query: "",
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

export function parseExploreFilters(params: URLSearchParams): ExploreFilters {
  const where = params.get("where") ?? defaultExploreFilters.where;
  const categoryId = params.has("category")
    ? params.get("category")
    : defaultExploreFilters.categoryId;
  const query = params.get("q") ?? "";

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
      query,
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
    query,
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
  if (filters.categoryId) return formatCategoryLabel(filters.categoryId);
  return "Explore vendors";
}

export function exploreEmptyCopy(filters: ExploreFilters) {
  const city = formatLocationLabel(filters.where).split(",")[0]?.trim() ?? "this area";

  if (filters.query.trim()) {
    return {
      title: `No results for “${filters.query.trim()}”`,
      hint: `Nothing in ${city} matches that search. Try different words or clear filters.`,
    };
  }

  if (filters.categoryId) {
    return {
      title: `No ${formatCategoryLabel(filters.categoryId).toLowerCase()} nearby`,
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

  if (filters.query.trim()) {
    return `${filters.query.trim()} in ${city}`;
  }

  if (filters.categoryId === "dj-live-music") return `DJs in ${city}`;
  if (filters.categoryId === "matcha-bar") return `Matcha Bars in ${city}`;

  const cat = formatCategoryLabel(filters.categoryId);
  return `${cat} in ${city}`;
}

export function filtersToSearchParams(filters: ExploreFilters) {
  const params = new URLSearchParams();
  if (filters.where) params.set("where", filters.where);
  if (filters.lat != null) params.set("lat", String(filters.lat));
  if (filters.lng != null) params.set("lng", String(filters.lng));
  if (filters.query.trim()) params.set("q", filters.query.trim());
  if (filters.categoryId) params.set("category", filters.categoryId);
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
    params.has("q")
  );
}

export function buildExploreSearchParams(filters: ExploreFilters) {
  return filtersToSearchParams({ ...defaultExploreFilters, ...filters });
}
