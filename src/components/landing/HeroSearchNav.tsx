import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  defaultExploreFilters,
  filtersToSearchParams,
  formatDateLabel,
  formatExploreQueryLabel,
  formatLocationLabel,
  type ExploreFilters,
} from "../../lib/exploreSearch";
import { DatePickerPopover } from "../search/DatePickerPopover";
import { ExploreDropdown } from "../search/ExploreDropdown";
import { LocationDropdown } from "../search/LocationDropdown";

type Panel = "none" | "where" | "when" | "explore";

const PANEL_ALIGN: Record<Exclude<Panel, "none">, string> = {
  where: "left-0",
  when: "left-1/2 -translate-x-1/2",
  explore: "right-0",
};

export function HeroSearchNav() {
  const navigate = useNavigate();
  const [panel, setPanel] = useState<Panel>("none");

  const [filters, setFilters] = useState<ExploreFilters>(defaultExploreFilters);
  const [locationQuery, setLocationQuery] = useState("");

  const [dateMode, setDateMode] = useState<"single" | "range">(filters.whenMode);
  const [singleDay, setSingleDay] = useState(filters.whenDay);
  const [rangeStart, setRangeStart] = useState(filters.whenDay);
  const [rangeEnd, setRangeEnd] = useState(filters.whenEndDay);
  const [monthIndex, setMonthIndex] = useState(filters.whenMonth);
  const [endMonthIndex, setEndMonthIndex] = useState(filters.whenEndMonth);

  const whereLabel = useMemo(() => formatLocationLabel(filters.where), [filters.where]);
  const whenLabel = useMemo(() => formatDateLabel(filters), [filters]);
  const exploreLabel = useMemo(() => formatExploreQueryLabel(filters), [filters]);

  function toggle(next: Panel) {
    setPanel((current) => (current === next ? "none" : next));
  }

  function close() {
    setPanel("none");
  }

  function patch(partial: Partial<ExploreFilters>) {
    setFilters((current) => ({ ...current, ...partial }));
  }

  function navigateToExplore(next: ExploreFilters) {
    navigate(`/explore?${filtersToSearchParams(next).toString()}`);
    close();
  }

  function handleLocationPick(primary: string) {
    if (primary !== "use current location") {
      patch({ where: primary });
    }
    close();
  }

  function handleApplyDates() {
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
  }

  function handleClearDates() {
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
  }

  function handleExploreSearch(query: string, categoryId: string | null) {
    const next = { ...filters, query, categoryId };
    setFilters(next);
    navigateToExplore(next);
  }

  useEffect(() => {
    setDateMode(filters.whenMode);
    setSingleDay(filters.whenDay);
    setRangeStart(filters.whenDay);
    setRangeEnd(filters.whenEndDay);
    setMonthIndex(filters.whenMonth);
    setEndMonthIndex(filters.whenEndMonth);
  }, [filters]);

  const panelContent =
    panel === "where" ? (
      <LocationDropdown
        query={locationQuery}
        onQueryChange={setLocationQuery}
        onPick={handleLocationPick}
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
        onClear={handleClearDates}
        onApply={handleApplyDates}
      />
    ) : panel === "explore" ? (
      <ExploreDropdown
        areaLabel={`popular in the ${whereLabel} area`}
        initialQuery={filters.query}
        initialCategoryId={filters.categoryId}
        onSearch={handleExploreSearch}
      />
    ) : null;

  return (
    <div className="relative z-50">
      {panel !== "none" ? (
        <button
          type="button"
          aria-label="Close search panel"
          className="fixed inset-0 z-40"
          onClick={close}
        />
      ) : null}

      <nav
        aria-label="Search"
        className="relative z-50 flex min-h-[72px] max-w-full items-center gap-3 rounded-full bg-white px-2 py-1.5 shadow-[0_0_12px_12px_rgba(255,255,255,0.18)] md:min-h-[100px] md:gap-6 md:px-2.5 md:py-1.5"
      >
        <button
          type="button"
          onClick={() => toggle("where")}
          aria-expanded={panel === "where"}
          title={whereLabel}
          className={`flex h-16 min-w-[120px] flex-1 items-center justify-center truncate rounded-full px-4 font-normal text-body text-base lowercase transition sm:min-w-[160px] sm:px-6 sm:text-[length:var(--text-nav,22px)] md:h-20 md:min-w-[200px] lg:min-w-[240px] lg:px-8 ${
            panel === "where" ? "bg-starlight" : "bg-white hover:bg-starlight/40"
          }`}
        >
          {whereLabel}
        </button>

        <button
          type="button"
          onClick={() => toggle("when")}
          aria-expanded={panel === "when"}
          title={whenLabel}
          className={`flex h-16 min-w-[120px] flex-1 items-center justify-center truncate rounded-full px-4 font-normal text-body text-base lowercase transition sm:min-w-[160px] sm:px-6 sm:text-[length:var(--text-nav,22px)] md:h-20 md:min-w-[200px] lg:min-w-[240px] lg:px-8 ${
            panel === "when" ? "bg-starlight" : "bg-white hover:bg-starlight/40"
          }`}
        >
          {whenLabel}
        </button>

        <button
          type="button"
          onClick={() => toggle("explore")}
          aria-expanded={panel === "explore"}
          title={exploreLabel}
          className={`flex h-16 min-w-[120px] flex-1 items-center justify-center truncate rounded-full px-4 font-normal text-body text-base lowercase transition sm:min-w-[160px] sm:px-6 sm:text-[length:var(--text-nav,22px)] md:h-20 md:min-w-[200px] lg:min-w-[240px] lg:px-8 ${
            panel === "explore" ? "bg-starlight" : "bg-white hover:bg-starlight/40"
          }`}
        >
          {exploreLabel}
        </button>
      </nav>

      {panel !== "none" && panelContent ? (
        <div
          className={`absolute top-[calc(100%+0.75rem)] z-[60] ${PANEL_ALIGN[panel]} max-w-[calc(100vw-2rem)]`}
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        >
          {panelContent}
        </div>
      ) : null}

      <p className="sr-only">
        Location: {whereLabel}. Dates: {whenLabel}. Search: {exploreLabel}.
      </p>
    </div>
  );
}
