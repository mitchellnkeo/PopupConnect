import { useMemo } from "react";
import { searchLocations } from "../../data/searchLocations";
import { IconPin, IconSearch } from "../discovery/icons";

type LocationDropdownProps = {
  query: string;
  onQueryChange: (value: string) => void;
  onPick?: (primary: string) => void;
  className?: string;
};

export function LocationDropdown({ query, onQueryChange, onPick, className = "" }: LocationDropdownProps) {
  const filteredLocations = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return searchLocations;
    return searchLocations.filter(
      (opt) =>
        opt.primary.toLowerCase().includes(q) ||
        opt.secondary.toLowerCase().includes(q),
    );
  }, [query]);

  return (
    <div
      className={`w-[min(100vw-2rem,380px)] rounded-2xl border border-neutral-200 bg-white p-3 shadow-lg ${className}`.trim()}
    >
      <label className="sr-only" htmlFor="location-search">
        Search location
      </label>
      <div className="relative">
        <IconSearch className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-primary" />
        <input
          id="location-search"
          type="search"
          placeholder="search..."
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          className="w-full rounded-full border border-neutral-300 bg-white py-2.5 pr-3 pl-10 text-sm text-neutral-900 outline-none ring-primary/30 placeholder:text-neutral-400 focus:ring-2"
        />
      </div>
      <ul className="mt-3 max-h-64 overflow-auto">
        {filteredLocations.map((opt) => (
          <li key={opt.id}>
            <button
              type="button"
              onClick={() => onPick?.(opt.primary)}
              className="flex w-full items-start gap-3 rounded-lg px-2 py-2.5 text-left transition hover:bg-starlight/70"
            >
              <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md bg-neutral-200/80">
                <IconPin className="size-3.5 text-neutral-600" />
              </span>
              <span className="min-w-0">
                <span className="block font-medium text-midnight text-sm lowercase">{opt.primary}</span>
                {opt.secondary ? (
                  <span className="block text-neutral-500 text-xs lowercase">{opt.secondary}</span>
                ) : null}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
