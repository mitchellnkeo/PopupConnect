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
        className={`flex h-16 min-w-[140px] items-center justify-center rounded-full px-6 font-normal text-body text-[length:var(--text-nav,22px)] lowercase transition md:h-20 md:min-w-[200px] lg:min-w-[240px] lg:px-8 ${
          active ? "bg-starlight" : "bg-white hover:bg-starlight/40"
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
        className="relative z-50 flex min-h-[72px] items-center gap-3 rounded-full bg-white px-2 py-1.5 shadow-[0_0_12px_12px_rgba(255,255,255,0.18)] md:min-h-[100px] md:gap-6 md:px-2.5 md:py-1.5"
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

      <p className="sr-only">
        Location: {whereLabel}. Dates: {whenSummary}.
      </p>
    </div>
  );
}
