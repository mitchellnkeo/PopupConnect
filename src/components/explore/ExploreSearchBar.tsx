import { type ReactNode, useState } from "react";
import type { ExploreFilters } from "../../lib/exploreSearch";
import {
  formatCategoryLabel,
  formatDateLabel,
  formatLocationLabel,
} from "../../lib/exploreSearch";
import { DatePickerPopover } from "../search/DatePickerPopover";
import { ExploreDropdown } from "../search/ExploreDropdown";
import { LocationDropdown } from "../search/LocationDropdown";

type Panel = "none" | "where" | "when" | "category";

type ExploreSearchBarProps = {
  filters: ExploreFilters;
  onFiltersChange: (next: ExploreFilters) => void;
  variant?: "default" | "compact";
};

type SegmentProps = {
  label: string;
  value: string;
  active: boolean;
  onClick: () => void;
  compact?: boolean;
  children?: ReactNode;
};

function Segment({ label, value, active, onClick, compact, children }: SegmentProps) {
  if (compact) {
    return (
      <div className="relative min-w-[140px] flex-1 md:min-w-[200px] lg:min-w-[240px]">
        <button
          type="button"
          onClick={onClick}
          aria-expanded={active}
          className={`w-full truncate px-5 py-2.5 text-body text-lg transition first:rounded-l-full last:rounded-r-full ${
            active ? "bg-starlight/60" : "bg-white hover:bg-starlight/30"
          }`}
        >
          {value}
        </button>
        {children}
      </div>
    );
  }

  return (
    <div className="relative min-w-0 flex-1">
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
      {children}
    </div>
  );
}

function PanelAnchor({ children }: { children: ReactNode }) {
  return (
    <div className="absolute top-full left-1/2 z-50 mt-2 -translate-x-1/2">{children}</div>
  );
}

export function ExploreSearchBar({
  filters,
  onFiltersChange,
  variant = "default",
}: ExploreSearchBarProps) {
  const [panel, setPanel] = useState<Panel>("none");
  const [locationQuery, setLocationQuery] = useState("");

  const [dateMode, setDateMode] = useState<"single" | "range">(filters.whenMode);
  const [singleDay, setSingleDay] = useState(filters.whenDay);
  const [rangeStart, setRangeStart] = useState(filters.whenDay);
  const [rangeEnd, setRangeEnd] = useState(filters.whenEndDay);

  const compact = variant === "compact";

  function close() {
    setPanel("none");
  }

  function toggle(next: Panel) {
    setPanel((p) => (p === next ? "none" : next));
  }

  function patch(partial: Partial<ExploreFilters>) {
    onFiltersChange({ ...filters, ...partial });
  }

  const locationDisplay = formatLocationLabel(filters.where);
  const dateDisplay = formatDateLabel(filters);
  const categoryDisplay = formatCategoryLabel(filters.categoryId);

  const barClass = compact
    ? "relative z-50 flex h-[42px] items-stretch overflow-hidden rounded-full border border-border bg-white"
    : "relative z-50 flex divide-x divide-neutral-200 overflow-hidden rounded-full border border-neutral-200 bg-white shadow-sm";

  return (
    <div className="relative">
      {panel !== "none" ? (
        <button type="button" aria-label="Close search panel" className="fixed inset-0 z-40" onClick={close} />
      ) : null}

      <div className={barClass}>
        <Segment
          label="Location"
          value={locationDisplay}
          active={panel === "where"}
          onClick={() => toggle("where")}
          compact={compact}
        >
          {panel === "where" ? (
            <PanelAnchor>
              <LocationDropdown
                query={locationQuery}
                onQueryChange={setLocationQuery}
                onPick={(primary) => {
                  if (primary !== "use current location") patch({ where: primary });
                  close();
                }}
              />
            </PanelAnchor>
          ) : null}
        </Segment>

        {compact ? <div className="w-px self-stretch bg-border" /> : null}

        <Segment
          label="Date"
          value={dateDisplay}
          active={panel === "when"}
          onClick={() => toggle("when")}
          compact={compact}
        >
          {panel === "when" ? (
            <PanelAnchor>
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
                onClear={() => {
                  setDateMode("single");
                  setSingleDay(15);
                  setRangeStart(15);
                  setRangeEnd(15);
                }}
                onApply={() => {
                  if (dateMode === "range") {
                    patch({
                      whenMode: "range",
                      whenDay: rangeStart,
                      whenEndDay: rangeEnd,
                      whenMonth: 7,
                    });
                  } else {
                    patch({
                      whenMode: "single",
                      whenDay: singleDay,
                      whenEndDay: singleDay,
                      whenMonth: 7,
                    });
                  }
                  close();
                }}
              />
            </PanelAnchor>
          ) : null}
        </Segment>

        {compact ? <div className="w-px self-stretch bg-border" /> : null}

        <Segment
          label="Service"
          value={categoryDisplay}
          active={panel === "category"}
          onClick={() => toggle("category")}
          compact={compact}
        >
          {panel === "category" ? (
            <PanelAnchor>
              <ExploreDropdown
                areaLabel={`popular in the ${locationDisplay} area`}
                onSearch={(query, categoryId) => {
                  patch({ query, categoryId });
                  close();
                }}
              />
            </PanelAnchor>
          ) : null}
        </Segment>
      </div>
    </div>
  );
}
