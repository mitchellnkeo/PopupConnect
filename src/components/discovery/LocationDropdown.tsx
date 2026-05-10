import { IconPin, IconSearch } from "./icons";

type LocationOption = {
  id: string;
  primary: string;
  secondary: string;
};

const MOCK_OPTIONS: LocationOption[] = [
  { id: "current", primary: "Location", secondary: "use current location" },
  { id: "other", primary: "location", secondary: "another location" },
  { id: "honolulu", primary: "Honolulu", secondary: "Hawaii, United States" },
];

type LocationDropdownProps = {
  query: string;
  onQueryChange: (value: string) => void;
  onPick?: (label: string) => void;
};

export function LocationDropdown({ query, onQueryChange, onPick }: LocationDropdownProps) {
  return (
    <div className="absolute top-full left-1/2 z-40 mt-3 w-[min(100vw-2rem,380px)] -translate-x-1/2 rounded-2xl border border-neutral-200 bg-white p-3 shadow-lg">
      <label className="sr-only" htmlFor="location-search">
        Search location
      </label>
      <div className="relative">
        <IconSearch className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-primary" />
        <input
          id="location-search"
          type="search"
          placeholder="Honolulu"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          className="w-full rounded-full border border-neutral-200 bg-white py-2.5 pr-3 pl-10 text-sm text-neutral-900 outline-none ring-primary/30 placeholder:text-neutral-400 focus:ring-2"
        />
      </div>
      <ul className="mt-3 max-h-56 divide-y divide-neutral-100 overflow-auto rounded-xl border border-neutral-100">
        {MOCK_OPTIONS.map((opt) => (
          <li key={opt.id}>
            <button
              type="button"
              onClick={() => onPick?.(`${opt.primary}${opt.secondary ? `, ${opt.secondary}` : ""}`)}
              className="flex w-full items-start gap-3 px-3 py-3 text-left transition hover:bg-starlight/70"
            >
              <IconPin className="mt-0.5 size-4 shrink-0 text-primary" />
              <span className="min-w-0">
                <span className="block font-semibold text-midnight text-sm">{opt.primary}</span>
                <span className="block text-neutral-500 text-xs">{opt.secondary}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
