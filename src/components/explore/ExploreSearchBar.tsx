import { useEffect, useState } from "react";
import type { ExploreFilters } from "../../lib/exploreSearch";
import {
  defaultExploreFilters,
  formatDateLabel,
  formatExploreQueryLabel,
  formatLocationLabel,
} from "../../lib/exploreSearch";
import { btnPrimary } from "../../lib/buttonStyles";
import { DatePickerPopover } from "../search/DatePickerPopover";
import { ExploreDropdown } from "../search/ExploreDropdown";
import { LocationDropdown } from "../search/LocationDropdown";

type Panel = "none" | "where" | "when" | "explore";

type ExploreSearchBarProps = {
  filters: ExploreFilters;
  onFiltersChange: (next: ExploreFilters) => void;
  variant?: "default" | "compact" | "discovery";
  ctaLabel?: string;
  onSubmit?: () => void;
  placeholders?: boolean;
};

type SegmentButtonProps = {
  label: string;
  value: string;
  active: boolean;
  onClick: () => void;
  compact?: boolean;
  discovery?: boolean;
  segmentPosition?: "first" | "middle" | "last";
};

function segmentCornerClass(compact: boolean | undefined, position: SegmentButtonProps["segmentPosition"]) {
  if (!compact || !position) return "";
  if (position === "first") return "rounded-l-full";
  if (position === "last") return "rounded-r-full";
  return "";
}

function SegmentButton({
  label,
  value,
  active,
  onClick,
  compact,
  discovery,
  segmentPosition,
}: SegmentButtonProps) {
  const corners = segmentCornerClass(compact, segmentPosition);

  if (discovery) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-expanded={active}
        className={`flex min-w-0 flex-1 flex-col gap-1 rounded px-2 py-1.5 text-left ${
          active ? "bg-surface" : "hover:bg-surface"
        }`}
      >
        <span className="font-medium text-body text-sm">{label}</span>
        <span className="w-full truncate text-[18px] text-body/60">{value}</span>
      </button>
    );
  }

  if (compact) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-expanded={active}
        title={value}
        className={`h-full min-w-0 flex-1 truncate px-3 py-2.5 text-center font-medium text-base text-body transition sm:min-w-[160px] sm:px-5 sm:text-lg ${corners} ${
          active ? "bg-surface" : "bg-white hover:bg-surface"
        }`}
      >
        {value}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={active}
      className={`w-full px-4 py-2.5 text-left transition hover:bg-starlight/40 ${
        active ? "bg-starlight/80" : ""
      }`}
    >
      <span className="block text-[10px] text-neutral-500 leading-none">{label}</span>
      <span className="mt-1 block truncate font-medium text-midnight text-sm">{value}</span>
    </button>
  );
}

const PANEL_ALIGN: Record<Exclude<Panel, "none">, string> = {
  where: "left-0",
  when: "left-1/2 -translate-x-1/2",
  explore: "right-0",
};

const DISCOVERY_PANEL_ALIGN: Record<Exclude<Panel, "none">, string> = {
  when: "left-0",
  where: "left-1/2 -translate-x-1/2",
  explore: "right-0",
};

export function ExploreSearchBar({
  filters,
  onFiltersChange,
  variant = "default",
  ctaLabel = "Search vendors",
  onSubmit,
  placeholders = false,
}: ExploreSearchBarProps) {
  const [panel, setPanel] = useState<Panel>("none");
  const [locationQuery, setLocationQuery] = useState("");
  const [filled, setFilled] = useState({
    when: !placeholders,
    where: !placeholders,
    type: !placeholders && Boolean(filters.query.trim() || filters.categoryId),
  });

  const [dateMode, setDateMode] = useState(filters.whenMode);
  const [singleDay, setSingleDay] = useState(filters.whenDay);
  const [rangeStart, setRangeStart] = useState(filters.whenDay);
  const [rangeEnd, setRangeEnd] = useState(filters.whenEndDay);
  const [monthIndex, setMonthIndex] = useState(filters.whenMonth);
  const [endMonthIndex, setEndMonthIndex] = useState(filters.whenEndMonth);

  useEffect(() => {
    setDateMode(filters.whenMode);
    setSingleDay(filters.whenDay);
    setRangeStart(filters.whenDay);
    setRangeEnd(filters.whenEndDay);
    setMonthIndex(filters.whenMonth);
    setEndMonthIndex(filters.whenEndMonth);
  }, [filters]);

  const compact = variant === "compact";
  const discovery = variant === "discovery";

  function close() {
    setPanel("none");
  }

  function toggle(next: Panel) {
    setPanel((current) => (current === next ? "none" : next));
  }

  function patch(partial: Partial<ExploreFilters>) {
    onFiltersChange({ ...filters, ...partial });
  }

  const locationDisplay =
    placeholders && !filled.where ? "Search location" : formatLocationLabel(filters.where);
  const dateDisplay =
    placeholders && !filled.when ? "Search date" : formatDateLabel(filters, { short: compact });
  const exploreDisplay =
    placeholders && !filled.type ? "Search for vendor types" : formatExploreQueryLabel(filters);

  const barClass = discovery
    ? "relative z-50 flex w-full items-center gap-4 overflow-visible rounded-2xl border border-gray-300 bg-white px-[18px] py-3.5"
    : compact
      ? "relative z-50 flex h-12 max-w-full items-stretch overflow-hidden rounded-full border border-gray-300 bg-white"
      : "relative z-50 flex max-w-full rounded-full border border-neutral-200 bg-white shadow-sm";

  const panelAlign = discovery ? DISCOVERY_PANEL_ALIGN : PANEL_ALIGN;

  const panelContent =
    panel === "where" ? (
      <LocationDropdown
        query={locationQuery}
        onQueryChange={setLocationQuery}
        onPick={(place) => {
          patch({ where: place.label, lat: place.lat, lng: place.lng });
          setFilled((current) => ({ ...current, where: true }));
          close();
        }}
      />
    ) : panel === "when" ? (
      <DatePickerPopover
        mode={dateMode}
        onModeChange={setDateMode}
        singleDay={singleDay}
        onSingleDayChange={setSingleDay}
        rangeStart={rangeStart}
        rangeEnd={rangeEnd}
        onRangeChange={(a, b) => {
          setRangeStart(a);
          setRangeEnd(b);
        }}
        monthIndex={monthIndex}
        onMonthChange={setMonthIndex}
        endMonthIndex={endMonthIndex}
        onEndMonthChange={setEndMonthIndex}
        year={filters.whenYear}
        onClear={() => {
          setDateMode("single");
          setSingleDay(defaultExploreFilters.whenDay);
          setRangeStart(defaultExploreFilters.whenDay);
          setRangeEnd(defaultExploreFilters.whenEndDay);
          setMonthIndex(defaultExploreFilters.whenMonth);
          setEndMonthIndex(defaultExploreFilters.whenEndMonth);
          patch({
            whenMode: "single",
            whenDay: defaultExploreFilters.whenDay,
            whenEndDay: defaultExploreFilters.whenEndDay,
            whenMonth: defaultExploreFilters.whenMonth,
            whenEndMonth: defaultExploreFilters.whenEndMonth,
          });
          setFilled((current) => ({ ...current, when: false }));
        }}
        onApply={() => {
          if (dateMode === "range") {
            patch({
              whenMode: "range",
              whenDay: rangeStart,
              whenEndDay: rangeEnd,
              whenMonth: monthIndex,
              whenEndMonth: endMonthIndex,
            });
          } else {
            patch({
              whenMode: "single",
              whenDay: singleDay,
              whenEndDay: singleDay,
              whenMonth: monthIndex,
              whenEndMonth: monthIndex,
            });
          }
          setFilled((current) => ({ ...current, when: true }));
          close();
        }}
      />
    ) : panel === "explore" ? (
      <ExploreDropdown
        areaLabel={`popular in the ${formatLocationLabel(filters.where)} area`}
        initialQuery={filters.query}
        initialCategoryId={filters.categoryId}
        onSearch={(query, categoryId) => {
          patch({ query, categoryId, categoryIds: categoryId ? [categoryId] : [] });
          setFilled((current) => ({ ...current, type: true }));
          close();
        }}
      />
    ) : null;

  const fields = discovery
    ? ([
        { panel: "when" as const, label: "When", value: dateDisplay },
        { panel: "where" as const, label: "Where", value: locationDisplay },
        { panel: "explore" as const, label: "Type", value: exploreDisplay },
      ] as const)
    : compact
      ? ([
          { panel: "when" as const, label: "Date", value: dateDisplay },
          { panel: "where" as const, label: "Location", value: locationDisplay },
          { panel: "explore" as const, label: "Search", value: exploreDisplay },
        ] as const)
      : ([
          { panel: "where" as const, label: "Location", value: locationDisplay },
          { panel: "when" as const, label: "Date", value: dateDisplay },
          { panel: "explore" as const, label: "Search", value: exploreDisplay },
        ] as const);

  return (
    <div className="relative max-w-full">
      {panel !== "none" ? (
        <button
          type="button"
          aria-label="Close search panel"
          className="fixed inset-0 z-40"
          onClick={close}
        />
      ) : null}

      <div className={barClass}>
        <div className={`relative flex min-w-0 flex-1 ${discovery ? "gap-3" : ""}`}>
          {fields.map((field, index) => (
            <div
              key={field.panel}
              className={`relative flex h-full min-w-0 flex-1 ${
                compact || discovery ? "" : "border-neutral-200 border-r last:border-r-0"
              }`}
            >
              {compact && index > 0 ? <div className="w-px shrink-0 self-stretch bg-border" /> : null}
              <SegmentButton
                label={field.label}
                value={field.value}
                active={panel === field.panel}
                onClick={() => toggle(field.panel)}
                compact={compact}
                discovery={discovery}
                segmentPosition={compact ? (index === 0 ? "first" : index === 2 ? "last" : "middle") : undefined}
              />
            </div>
          ))}
        </div>

        {discovery && onSubmit ? (
          <div className="flex shrink-0 items-center pl-6">
            <button type="button" onClick={onSubmit} className={`${btnPrimary} min-h-11 px-5 py-2`}>
              {ctaLabel}
            </button>
          </div>
        ) : null}
      </div>

      {panel !== "none" && panelContent ? (
        <div
          className={`absolute top-[calc(100%+0.5rem)] z-[60] ${panelAlign[panel]} max-w-[calc(100vw-2rem)]`}
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        >
          {panelContent}
        </div>
      ) : null}
    </div>
  );
}
