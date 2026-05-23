import { type ReactNode, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DatePickerPopover } from "../search/DatePickerPopover";
import { ExploreDropdown } from "../search/ExploreDropdown";
import { LocationDropdown } from "../search/LocationDropdown";

type Panel = "none" | "where" | "when" | "explore";

const YEAR = 2026;
const MONTH_INDEX = 4;

function formatWhenSummary(mode: "single" | "range", singleDay: number, start: number, end: number) {
  const fmt = (day: number) =>
    new Date(YEAR, MONTH_INDEX, day)
      .toLocaleDateString("en-US", { month: "long", day: "numeric" })
      .toLowerCase();
  if (mode === "single") return fmt(singleDay);
  const lo = Math.min(start, end);
  const hi = Math.max(start, end);
  return `${fmt(lo)} - ${fmt(hi)}`;
}

type SegmentProps = {
  label: string;
  active: boolean;
  onClick: () => void;
  children?: ReactNode;
};

function Segment({ label, active, onClick, children }: SegmentProps) {
  return (
    <div className="relative flex flex-1 justify-center">
      <button
        type="button"
        onClick={onClick}
        aria-expanded={active}
        className={`w-full rounded-full px-4 py-2.5 font-medium text-midnight text-sm lowercase transition ${
          active ? "bg-starlight" : "hover:bg-starlight/40"
        }`}
      >
        {label}
      </button>
      {children}
    </div>
  );
}

function PanelAnchor({ children }: { children: ReactNode }) {
  return (
    <div className="absolute top-full left-1/2 z-50 mt-3 -translate-x-1/2">{children}</div>
  );
}

export function HeroSearchNav() {
  const navigate = useNavigate();
  const [panel, setPanel] = useState<Panel>("none");

  const [locationQuery, setLocationQuery] = useState("");
  const [whereLabel, setWhereLabel] = useState("seattle, wa");

  const [dateMode, setDateMode] = useState<"single" | "range">("single");
  const [singleDay, setSingleDay] = useState(5);
  const [rangeStart, setRangeStart] = useState(5);
  const [rangeEnd, setRangeEnd] = useState(7);

  const whenSummary = useMemo(
    () => formatWhenSummary(dateMode, singleDay, rangeStart, rangeEnd),
    [dateMode, singleDay, rangeStart, rangeEnd],
  );

  function toggle(next: Panel) {
    setPanel((current) => (current === next ? "none" : next));
  }

  function close() {
    setPanel("none");
  }

  function handleLocationPick(primary: string) {
    if (primary !== "use current location") {
      setWhereLabel(primary);
    }
    close();
  }

  function handleApplyDates() {
    close();
  }

  function handleClearDates() {
    setDateMode("single");
    setSingleDay(5);
    setRangeStart(5);
    setRangeEnd(7);
  }

  function handleExploreSearch(query: string, categoryId: string | null) {
    const params = new URLSearchParams();
    if (whereLabel) params.set("where", whereLabel);
    if (dateMode === "single") {
      params.set("when", String(singleDay));
    } else {
      params.set("whenStart", String(rangeStart));
      params.set("whenEnd", String(rangeEnd));
    }
    if (query.trim()) params.set("q", query.trim());
    if (categoryId) params.set("category", categoryId);
    navigate(`/explore?${params.toString()}`);
    close();
  }

  return (
    <div className="relative">
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
        className="relative z-50 flex min-w-[280px] divide-x divide-neutral-200/80 rounded-full bg-white/95 shadow-md backdrop-blur-sm sm:min-w-[340px]"
      >
        <Segment label="where" active={panel === "where"} onClick={() => toggle("where")}>
          {panel === "where" ? (
            <PanelAnchor>
              <LocationDropdown
                query={locationQuery}
                onQueryChange={setLocationQuery}
                onPick={handleLocationPick}
              />
            </PanelAnchor>
          ) : null}
        </Segment>

        <Segment label="when" active={panel === "when"} onClick={() => toggle("when")}>
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
                onClear={handleClearDates}
                onApply={handleApplyDates}
              />
            </PanelAnchor>
          ) : null}
        </Segment>

        <Segment label="explore" active={panel === "explore"} onClick={() => toggle("explore")}>
          {panel === "explore" ? (
            <PanelAnchor>
              <ExploreDropdown onSearch={handleExploreSearch} />
            </PanelAnchor>
          ) : null}
        </Segment>
      </nav>

      {/* Screen-reader summary of current filters */}
      <p className="sr-only">
        Location: {whereLabel}. Dates: {whenSummary}.
      </p>
    </div>
  );
}
