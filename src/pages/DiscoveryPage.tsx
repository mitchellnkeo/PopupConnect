import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { DatePickerPopover } from "../components/discovery/DatePickerPopover";
import { LocationDropdown } from "../components/discovery/LocationDropdown";
import { VendorSection } from "../components/discovery/VendorSection";
import { IconMenu, LogoMark } from "../components/discovery/icons";
import {
  celebrateSection,
  exploreVendors,
  lovedByLocals,
} from "../data/mockVendors";

type Panel = "none" | "where" | "when";

function formatWhenLabel(mode: "single" | "range", singleDay: number, rangeStart: number, rangeEnd: number) {
  const short = (day: number) =>
    new Date(2026, 4, day)
      .toLocaleDateString("en-US", { month: "long", day: "numeric" })
      .toLowerCase();
  if (mode === "single") return short(singleDay);
  const lo = Math.min(rangeStart, rangeEnd);
  const hi = Math.max(rangeStart, rangeEnd);
  return `${short(lo)} - ${short(hi)}`;
}

export function DiscoveryPage() {
  const [panel, setPanel] = useState<Panel>("none");
  const [menuOpen, setMenuOpen] = useState(false);

  const [locationQuery, setLocationQuery] = useState("");
  const [whereLabel, setWhereLabel] = useState("seattle, wa");

  const [dateMode, setDateMode] = useState<"single" | "range">("single");
  const [singleDay, setSingleDay] = useState(5);
  const [rangeStart, setRangeStart] = useState(5);
  const [rangeEnd, setRangeEnd] = useState(7);

  const [exploreLabel] = useState("live music");

  const whenDisplay = useMemo(
    () => formatWhenLabel(dateMode, singleDay, rangeStart, rangeEnd),
    [dateMode, singleDay, rangeStart, rangeEnd],
  );

  function toggle(next: Panel) {
    setPanel((p) => (p === next ? "none" : next));
  }

  function closePanels() {
    setPanel("none");
  }

  function handleApplyDates() {
    if (dateMode === "single") {
      setSingleDay(singleDay);
    }
    closePanels();
  }

  function handleClearDates() {
    setDateMode("single");
    setSingleDay(5);
    setRangeStart(5);
    setRangeEnd(7);
  }

  return (
    <div className="min-h-dvh bg-white">
      {panel !== "none" ? (
        <button
          type="button"
          aria-label="Close panels"
          className="fixed inset-0 z-30 bg-midnight/10"
          onClick={closePanels}
        />
      ) : null}

      <header className="relative z-40 border-neutral-200 border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-4">
          <div className="flex shrink-0 items-center gap-2">
            <LogoMark className="h-7 w-11 shrink-0" />
            <span className="font-semibold text-midnight text-sm uppercase tracking-wide">PopupConnect</span>
          </div>

          <div className="relative flex min-w-0 flex-1 justify-center">
            <div className="flex max-w-full divide-x divide-neutral-200 overflow-x-auto rounded-full border border-neutral-200 bg-neutral-50/80 shadow-sm">
              <Link
                to="/"
                onClick={closePanels}
                className="shrink-0 px-4 py-2.5 text-left text-midnight text-sm lowercase transition hover:bg-starlight/40"
              >
                home
              </Link>

              <button
                type="button"
                onClick={() => toggle("where")}
                className={`relative shrink-0 px-4 py-2.5 text-left transition hover:bg-starlight/40 ${
                  panel === "where" ? "bg-white ring-2 ring-midnight ring-inset" : ""
                }`}
              >
                <span className="block text-[10px] text-neutral-500 leading-none">Where</span>
                <span className="mt-1 block font-medium text-midnight text-sm lowercase">{whereLabel}</span>
              </button>

              <button
                type="button"
                onClick={() => toggle("when")}
                className={`relative shrink-0 px-4 py-2.5 text-left transition hover:bg-starlight/40 ${
                  panel === "when" ? "bg-white ring-2 ring-midnight ring-inset" : ""
                }`}
              >
                <span className="block text-[10px] text-neutral-500 leading-none">When</span>
                <span className="mt-1 block font-medium text-midnight text-sm lowercase">{whenDisplay}</span>
              </button>

              <button
                type="button"
                onClick={closePanels}
                className="shrink-0 px-4 py-2.5 text-left text-midnight transition hover:bg-starlight/40"
              >
                <span className="block text-[10px] text-neutral-500 leading-none">Explore</span>
                <span className="mt-1 block font-medium text-sm lowercase">{exploreLabel}</span>
              </button>
            </div>

            {panel === "where" ? (
              <LocationDropdown
                query={locationQuery}
                onQueryChange={setLocationQuery}
                onPick={(label) => {
                  const short = label.split(",")[0]?.trim().toLowerCase() ?? whereLabel;
                  setWhereLabel(short.includes("location") ? whereLabel : short);
                  closePanels();
                }}
              />
            ) : null}

            {panel === "when" ? (
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
            ) : null}
          </div>

          <button
            type="button"
            className="shrink-0 rounded-full p-2 text-primary hover:bg-starlight/50"
            aria-expanded={menuOpen}
            aria-label="Open menu"
            onClick={() => setMenuOpen((o) => !o)}
          >
            <IconMenu className="size-6" />
          </button>
        </div>

        {menuOpen ? (
          <div className="absolute top-full right-4 z-50 w-56 rounded-xl border border-neutral-200 bg-white p-3 shadow-lg">
            <p className="text-neutral-500 text-xs">Menu placeholder — wire team navigation here.</p>
          </div>
        ) : null}
      </header>

      <div className="mx-auto max-w-6xl px-4 pt-10 pb-16">
        <VendorSection title="explore vendors" items={exploreVendors} />
        <VendorSection title="loved by locals" items={lovedByLocals} />
        <VendorSection title="celebrate asian pacific islander month" items={celebrateSection} />
      </div>
    </div>
  );
}
