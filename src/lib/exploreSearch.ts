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
  categoryId: string | null;
  query: string;
};

export const defaultExploreFilters: ExploreFilters = {
  where: "honolulu, hi",
  whenDay: 1,
  whenMonth: 6,
  whenYear: 2026,
  whenMode: "single",
  whenEndDay: 1,
  categoryId: "dj-live-music",
  query: "",
};

export function parseExploreFilters(params: URLSearchParams): ExploreFilters {
  const where = params.get("where") ?? defaultExploreFilters.where;
  const categoryId = params.get("category") ?? defaultExploreFilters.categoryId;
  const query = params.get("q") ?? "";

  const whenStart = params.get("whenStart");
  const whenEnd = params.get("whenEnd");
  const when = params.get("when");

  if (whenStart && whenEnd) {
    return {
      where,
      categoryId,
      query,
      whenMode: "range",
      whenDay: Number(whenStart) || 5,
      whenEndDay: Number(whenEnd) || 7,
      whenMonth: 4,
      whenYear: 2026,
    };
  }

  const day = when ? Number(when) : defaultExploreFilters.whenDay;
  return {
    where,
    categoryId,
    query,
    whenMode: "single",
    whenDay: Number.isFinite(day) ? day : defaultExploreFilters.whenDay,
    whenEndDay: Number.isFinite(day) ? day : defaultExploreFilters.whenEndDay,
    whenMonth: when ? 4 : defaultExploreFilters.whenMonth,
    whenYear: 2026,
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
  const { whenDay, whenMonth, whenYear, whenMode, whenEndDay } = filters;
  const month = MONTH_NAMES[whenMonth] ?? "July";
  if (whenMode === "range" && whenEndDay !== whenDay) {
    const endMonth = MONTH_NAMES[whenMonth] ?? "May";
    return `${month} ${whenDay} – ${endMonth} ${whenEndDay}, ${whenYear}`;
  }
  return `${month} ${whenDay}, ${whenYear}`;
}

export function formatCategoryLabel(categoryId: string | null) {
  if (!categoryId) return "All vendors";
  const match = exploreCategories.find((c) => c.id === categoryId);
  if (!match) return "All vendors";
  if (categoryId === "dj-live-music") return "DJs & Live music";
  return match.label
    .split("/")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" / ");
}

export function resultsHeading(filters: ExploreFilters) {
  const city = formatLocationLabel(filters.where).split(",")[0]?.trim() ?? "your area";
  if (filters.categoryId === "dj-live-music") return `DJs in ${city}`;
  const cat = formatCategoryLabel(filters.categoryId);
  return `${cat} in ${city}`;
}

export function filtersToSearchParams(filters: ExploreFilters) {
  const params = new URLSearchParams();
  if (filters.where) params.set("where", filters.where);
  if (filters.query) params.set("q", filters.query);
  if (filters.categoryId) params.set("category", filters.categoryId);
  if (filters.whenMode === "range") {
    params.set("whenStart", String(filters.whenDay));
    params.set("whenEnd", String(filters.whenEndDay));
  } else {
    params.set("when", String(filters.whenDay));
  }
  return params;
}
