import { exploreCategories } from "../data/exploreCategories";

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
    params.has("when") ||
    params.has("whenStart") ||
    params.has("category") ||
    params.has("q")
  );
}

export function buildExploreSearchParams(filters: ExploreFilters) {
  return filtersToSearchParams({ ...defaultExploreFilters, ...filters });
}
