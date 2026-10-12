import { landingIcons } from "../../config/landingImages";
import {
  addableFacetChips,
  addExploreFacet,
  appliedFacetChips,
  appliedFilterCount,
  clearExploreFacets,
  removeExploreFacet,
  suggestedFacetChips,
  type ExploreFacetId,
} from "../../lib/exploreFacets";
import { btnPrimary, btnTertiary } from "../../lib/buttonStyles";
import type { ExploreFilters } from "../../lib/exploreSearch";
import { IconGrid, IconRows } from "./icons";
import { Menu, MenuItem } from "../ui/Menu";

type ExploreFilterPickerProps = {
  filters: ExploreFilters;
  onFiltersChange: (next: ExploreFilters) => void;
  cardLayout: "grid" | "list";
  onCardLayoutChange: (layout: "grid" | "list") => void;
};

function FilterChip({
  label,
  dismissible,
  onClick,
  onDismiss,
}: {
  label: string;
  dismissible?: boolean;
  onClick?: () => void;
  onDismiss?: () => void;
}) {
  const className =
    "inline-flex h-9 items-center justify-center gap-1 rounded-[20px] border border-gray-300 bg-white px-3 text-base text-body";

  if (dismissible) {
    return (
      <span className={className}>
        {label}
        <button type="button" aria-label={`Remove ${label}`} onClick={onDismiss} className="pt-0.5">
          <img src={landingIcons.crossSmall} alt="" width={18} height={18} />
        </button>
      </span>
    );
  }

  return (
    <button type="button" onClick={onClick} className={`${className} transition hover:bg-surface`}>
      {label}
    </button>
  );
}

export function ExploreFilterPicker({
  filters,
  onFiltersChange,
  cardLayout,
  onCardLayoutChange,
}: ExploreFilterPickerProps) {
  const applied = appliedFacetChips(filters);
  const suggested = suggestedFacetChips(filters);
  const addable = addableFacetChips(filters);
  const count = appliedFilterCount(filters);

  function add(id: ExploreFacetId) {
    onFiltersChange(addExploreFacet(filters, id));
  }

  function remove(id: ExploreFacetId) {
    onFiltersChange(removeExploreFacet(filters, id));
  }

  return (
    <section className="overflow-hidden rounded-[10px] border border-border bg-white">
      <div className="flex flex-col gap-5 p-5">
        <div className="flex items-center justify-between gap-4">
          <p className="font-medium text-lg text-body">Filters ({count})</p>
          <div className="flex items-center gap-1" role="group" aria-label="Card layout">
            <button
              type="button"
              aria-label="List layout"
              aria-pressed={cardLayout === "list"}
              onClick={() => onCardLayoutChange("list")}
              className={`rounded p-1.5 ${cardLayout === "list" ? "bg-surface text-midnight" : "text-body/60 hover:text-midnight"}`}
            >
              <IconRows className="size-5" />
            </button>
            <button
              type="button"
              aria-label="Grid layout"
              aria-pressed={cardLayout === "grid"}
              onClick={() => onCardLayoutChange("grid")}
              className={`rounded p-1.5 ${cardLayout === "grid" ? "bg-surface text-midnight" : "text-body/60 hover:text-midnight"}`}
            >
              <IconGrid className="size-5" />
            </button>
          </div>
        </div>

        {applied.length > 0 ? (
          <div className="flex flex-wrap gap-4">
            {applied.map((facet) => (
              <FilterChip key={facet.id} label={facet.label} dismissible onDismiss={() => remove(facet.id)} />
            ))}
          </div>
        ) : null}
      </div>

      {suggested.length > 0 ? (
        <div className="flex flex-col gap-2 px-5 pt-3 pb-5">
          <p className="text-base text-body">Suggested</p>
          <div className="flex flex-wrap gap-4">
            {suggested.map((facet) => (
              <FilterChip key={facet.id} label={facet.label} onClick={() => add(facet.id)} />
            ))}
          </div>
        </div>
      ) : null}

      <div className="flex flex-wrap items-center gap-[18px] px-5 pb-5">
        <Menu
          align="left"
          aria-label="Add filter"
          trigger={
            <button type="button" className={`${btnPrimary} min-h-10 px-3 py-[5.5px]`}>
              Add filter
            </button>
          }
        >
          {addable.length === 0 ? (
            <p className="px-4 py-2.5 text-body/60 text-sm">All filters are applied</p>
          ) : (
            addable.map((facet) => (
              <MenuItem key={facet.id} onClick={() => add(facet.id)}>
                {facet.label}
              </MenuItem>
            ))
          )}
        </Menu>

        {count > 0 ? (
          <button
            type="button"
            className={btnTertiary}
            onClick={() => onFiltersChange(clearExploreFacets(filters))}
          >
            Clear all filters
          </button>
        ) : (
          <span className={`${btnTertiary} pointer-events-none opacity-40`}>Clear all filters</span>
        )}
      </div>
    </section>
  );
}
