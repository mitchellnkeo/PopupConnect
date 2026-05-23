import { useId, useMemo, useState } from "react";
import { Button } from "../ui/Button";
import { daysMatrix, weekdayLabels } from "../discovery/calendarUtils";

type DateMode = "single" | "range";

type DatePickerPopoverProps = {
  mode: DateMode;
  onModeChange: (mode: DateMode) => void;
  singleDay: number;
  onSingleDayChange: (day: number) => void;
  rangeStart: number;
  rangeEnd: number;
  onRangeChange: (start: number, end: number) => void;
  onClear: () => void;
  onApply: () => void;
  className?: string;
};

const YEAR = 2026;
const MONTH_INDEX = 4; // May

function formatMonthDay(day: number) {
  const d = new Date(YEAR, MONTH_INDEX, day);
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export function DatePickerPopover({
  mode,
  onModeChange,
  singleDay,
  onSingleDayChange,
  rangeStart,
  rangeEnd,
  onRangeChange,
  onClear,
  onApply,
  className = "",
}: DatePickerPopoverProps) {
  const cells = useMemo(() => daysMatrix(YEAR, MONTH_INDEX), []);
  const weekdays = weekdayLabels();
  const [rangeAnchor, setRangeAnchor] = useState<number | null>(null);
  const radioName = useId();

  const lo = Math.min(rangeStart, rangeEnd);
  const hi = Math.max(rangeStart, rangeEnd);

  function dayCellClasses(day: number) {
    const inRange = mode === "range" && day >= lo && day <= hi;
    const isEndpoint =
      mode === "single" ? day === singleDay : day === lo || day === hi;

    return [
      "flex size-9 items-center justify-center rounded-full text-sm transition",
      mode === "range" && inRange && !isEndpoint ? "bg-starlight/70 text-midnight" : "",
      mode === "range" && inRange && isEndpoint
        ? "bg-starlight font-semibold text-midnight ring-2 ring-midnight"
        : "",
      mode === "single" && day === singleDay ? "border-2 border-midnight font-semibold text-midnight" : "",
      mode === "single" && day !== singleDay ? "border border-transparent hover:bg-neutral-100" : "",
      mode === "range" && !inRange ? "border border-transparent hover:bg-neutral-100" : "",
    ]
      .filter(Boolean)
      .join(" ");
  }

  function handleDayClick(day: number) {
    if (mode === "single") {
      onSingleDayChange(day);
      return;
    }
    if (rangeAnchor === null) {
      setRangeAnchor(day);
      onRangeChange(day, day);
      return;
    }
    onRangeChange(Math.min(rangeAnchor, day), Math.max(rangeAnchor, day));
    setRangeAnchor(null);
  }

  function handleClear() {
    setRangeAnchor(null);
    onClear();
  }

  const summarySingle = formatMonthDay(singleDay);

  return (
    <div
      className={`w-[min(100vw-2rem,360px)] rounded-2xl border border-neutral-200 bg-white p-4 shadow-lg ${className}`.trim()}
    >
      <div className="space-y-2">
        {mode === "single" ? (
          <input
            readOnly
            value={summarySingle}
            className="w-full rounded-lg border border-neutral-900 px-3 py-2 text-neutral-900 text-sm lowercase"
          />
        ) : (
          <div className="grid grid-cols-2 gap-2">
            <input
              readOnly
              value={formatMonthDay(lo)}
              className="rounded-lg border border-neutral-900 px-2 py-2 text-neutral-900 text-xs lowercase"
            />
            <input
              readOnly
              value={formatMonthDay(hi)}
              className="rounded-lg border border-neutral-900 px-2 py-2 text-neutral-900 text-xs lowercase"
            />
          </div>
        )}
      </div>

      <fieldset className="mt-4 flex gap-6 border-none p-0">
        <legend className="sr-only">Date selection mode</legend>
        <label className="flex cursor-pointer items-center gap-2 text-sm lowercase">
          <input
            type="radio"
            name={radioName}
            checked={mode === "single"}
            onChange={() => {
              onModeChange("single");
              setRangeAnchor(null);
            }}
            className="accent-primary"
          />
          one day
        </label>
        <label className="flex cursor-pointer items-center gap-2 text-sm lowercase">
          <input
            type="radio"
            name={radioName}
            checked={mode === "range"}
            onChange={() => {
              onModeChange("range");
              setRangeAnchor(null);
            }}
            className="accent-primary"
          />
          multiple days
        </label>
      </fieldset>

      <div className="mt-4 flex items-center justify-between">
        <button
          type="button"
          className="rounded-full p-1 text-midnight hover:bg-neutral-100"
          aria-label="Previous month"
        >
          ‹
        </button>
        <span className="font-medium text-midnight text-sm lowercase">
          {new Date(YEAR, MONTH_INDEX, 1).toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </span>
        <button
          type="button"
          className="rounded-full p-1 text-midnight hover:bg-neutral-100"
          aria-label="Next month"
        >
          ›
        </button>
      </div>

      <div className="mt-2 grid grid-cols-7 gap-1 text-center text-neutral-500 text-[10px] lowercase tracking-wide">
        {weekdays.map((d) => (
          <div key={d} className="py-1">
            {d}
          </div>
        ))}
      </div>

      <div className="mt-1 grid grid-cols-7 gap-1">
        {cells.map((day, i) =>
          day === null ? (
            <div key={`e-${i}`} />
          ) : (
            <button
              key={day}
              type="button"
              onClick={() => handleDayClick(day)}
              className={dayCellClasses(day)}
            >
              {day}
            </button>
          ),
        )}
      </div>

      <div className="mt-5 flex justify-end gap-3">
        <Button type="button" variant="secondary" onClick={handleClear}>
          clear dates
        </Button>
        <Button type="button" variant="primary" onClick={onApply}>
          apply
        </Button>
      </div>
    </div>
  );
}
