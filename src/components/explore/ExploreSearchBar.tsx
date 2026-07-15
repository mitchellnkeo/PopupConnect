import { useEffect, useState } from "react";
import type { ExploreFilters } from "../../lib/exploreSearch";
import {
  defaultExploreFilters,
  formatDateLabel,
  formatExploreQueryLabel,
  formatLocationLabel,
} from "../../lib/exploreSearch";
import { DatePickerPopover } from "../search/DatePickerPopover";
import { ExploreDropdown } from "../search/ExploreDropdown";
import { LocationDropdown } from "../search/LocationDropdown";

type Panel = "none" | "where" | "when" | "explore";

type ExploreSearchBarProps = {
  filters: ExploreFilters;
  onFiltersChange: (next: ExploreFilters) => void;
  variant?: "default" | "compact";
};

type SegmentButtonProps = {
  label: string;
  value: string;
  active: boolean;
  onClick: () => void;
  compact?: boolean;
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
  segmentPosition,
}: SegmentButtonProps) {
  const corners = segmentCornerClass(compact, segmentPosition);

  if (compact) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-expanded={active}
        title={value}
        className={`h-full w-full truncate px-3 py-2.5 text-body text-base transition sm:px-5 sm:text-lg ${corners} ${
          active ? "bg-starlight/60" : "bg-white hover:bg-starlight/30"
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

export function ExploreSearchBar({
  filters,
  onFiltersChange,
  variant = "default",
}: ExploreSearchBarProps) {
  const [panel, setPanel] = useState<Panel>("none");
  const [locationQuery, setLocationQuery] = useState("");

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

  function close() {
    setPanel("none");
  }

  function toggle(next: Panel) {
    setPanel((current) => (current === next ? "none" : next));
  }

  function patch(partial: Partial<ExploreFilters>) {
    onFiltersChange({ ...filters, ...partial });
  }

  const locationDisplay = formatLocationLabel(filters.where);
  const dateDisplay = formatDateLabel(filters);
  const exploreDisplay = formatExploreQueryLabel(filters);

  const barClass = compact
    ? "relative z-50 flex h-[42px] max-w-full items-stretch overflow-hidden rounded-full border border-border bg-white"
    : "relative z-50 flex max-w-full rounded-full border border-neutral-200 bg-white shadow-sm";

  const panelContent =
    panel === "where" ? (
      <LocationDropdown
        query={locationQuery}
        onQueryChange={setLocationQuery}
        onPick={(primary) => {
          if (primary !== "use current location") {
            patch({ where: primary });
          }
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
          close();
        }}
      />
    ) : panel === "explore" ? (
      <ExploreDropdown
        areaLabel={`popular in the ${locationDisplay} area`}
        initialQuery={filters.query}
        initialCategoryId={filters.categoryId}
        onSearch={(query, categoryId) => {
          patch({ query, categoryId });
          close();
        }}
      />
    ) : null;

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
        <div className={`relative flex h-full min-w-0 flex-1 ${compact ? "" : "border-neutral-200 border-r"}`}>
          <SegmentButton
            label="Location"
            value={locationDisplay}
            active={panel === "where"}
            onClick={() => toggle("where")}
            compact={compact}
            segmentPosition={compact ? "first" : undefined}
          />
        </div>

        {compact ? <div className="w-px shrink-0 self-stretch bg-border" /> : null}

        <div className={`relative flex h-full min-w-0 flex-1 ${compact ? "" : "border-neutral-200 border-r"}`}>
          <SegmentButton
            label="Date"
            value={dateDisplay}
            active={panel === "when"}
            onClick={() => toggle("when")}
            compact={compact}
            segmentPosition={compact ? "middle" : undefined}
          />
        </div>

        {compact ? <div className="w-px shrink-0 self-stretch bg-border" /> : null}

        <div className="relative flex h-full min-w-0 flex-1">
          <SegmentButton
            label="Search"
            value={exploreDisplay}
            active={panel === "explore"}
            onClick={() => toggle("explore")}
            compact={compact}
            segmentPosition={compact ? "last" : undefined}
          />
        </div>
      </div>

      {panel !== "none" && panelContent ? (
        <div
          className={`absolute top-[calc(100%+0.5rem)] z-[60] ${PANEL_ALIGN[panel]} max-w-[calc(100vw-2rem)]`}
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        >
          {panelContent}
        </div>
      ) : null}
    </div>
  );
}
