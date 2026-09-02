import { exploreCategories } from "../../data/exploreCategories";
import type { ExploreFilters, ExplorePriceBand, ExploreSort } from "../../lib/exploreSearch";
import {
  formatPriceBandLabel,
  formatSortLabel,
  selectedCategoryIds,
} from "../../lib/exploreSearch";
import { Checkbox } from "../ui/Checkbox";
import { Menu, MenuItem } from "../ui/Menu";

type ExploreRefineBarProps = {
  filters: ExploreFilters;
  onFiltersChange: (next: ExploreFilters) => void;
};

const SORT_OPTIONS: ExploreSort[] = ["distance", "price", "newest"];
const PRICE_OPTIONS: ExplorePriceBand[] = ["any", "under-150", "under-300", "300-plus"];

function triggerClass(active: boolean) {
  return [
    "rounded-full border px-3 py-1.5 font-medium text-sm transition",
    active
      ? "border-primary bg-starlight/50 text-midnight"
      : "border-neutral-300 bg-white text-midnight hover:bg-starlight/30",
  ].join(" ");
}

export function ExploreRefineBar({ filters, onFiltersChange }: ExploreRefineBarProps) {
  const categoryIds = selectedCategoryIds(filters);
  const filtersActive = categoryIds.length !== 1 || filters.priceBand !== "any";

  function patch(partial: Partial<ExploreFilters>) {
    onFiltersChange({ ...filters, ...partial });
  }

  function toggleCategory(id: string) {
    const next = categoryIds.includes(id)
      ? categoryIds.filter((item) => item !== id)
      : [...categoryIds, id];
    patch({
      categoryIds: next,
      categoryId: next.length === 1 ? next[0] : null,
    });
  }

  return (
    <div className="mt-4 flex flex-wrap items-center gap-2">
      <Menu
        align="left"
        aria-label="Sort results"
        trigger={
          <button type="button" className={triggerClass(filters.sort !== "distance")}>
            Sort: {formatSortLabel(filters.sort)}
          </button>
        }
      >
        {SORT_OPTIONS.map((sort) => (
          <MenuItem key={sort} onClick={() => patch({ sort })}>
            {formatSortLabel(sort)}
            {filters.sort === sort ? " ✓" : ""}
          </MenuItem>
        ))}
      </Menu>

      <Menu
        align="left"
        closeOnSelect={false}
        aria-label="Filter results"
        trigger={
          <button type="button" className={triggerClass(filtersActive)}>
            Filters
            {filters.priceBand !== "any" ? ` · ${formatPriceBandLabel(filters.priceBand)}` : ""}
          </button>
        }
      >
        <div className="px-4 py-2">
          <p className="font-medium text-midnight text-xs uppercase tracking-wide">Categories</p>
          <div className="mt-2 space-y-2">
            {exploreCategories.map((category) => (
              <Checkbox
                key={category.id}
                id={`filter-${category.id}`}
                checked={categoryIds.includes(category.id)}
                onChange={() => toggleCategory(category.id)}
              >
                {category.label}
              </Checkbox>
            ))}
          </div>
        </div>
        <div className="mt-1 border-neutral-100 border-t px-4 py-2">
          <p className="font-medium text-midnight text-xs uppercase tracking-wide">Price</p>
          <div className="mt-1">
            {PRICE_OPTIONS.map((band) => (
              <MenuItem key={band} onClick={() => patch({ priceBand: band })}>
                {formatPriceBandLabel(band)}
                {filters.priceBand === band ? " ✓" : ""}
              </MenuItem>
            ))}
          </div>
        </div>
      </Menu>
    </div>
  );
}
