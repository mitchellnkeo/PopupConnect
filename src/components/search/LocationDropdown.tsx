import { useEffect, useMemo, useState } from "react";
import { searchLocations, type LocationOption } from "../../data/searchLocations";
import { reverseGeocode, searchPlaces, type GeocodedPlace } from "../../lib/geocode";
import { IconPin, IconSearch } from "../discovery/icons";

export type LocationPick = {
  label: string;
  lat: number | null;
  lng: number | null;
};

type LocationDropdownProps = {
  query: string;
  onQueryChange: (value: string) => void;
  onPick?: (place: LocationPick) => void;
  className?: string;
};

export function LocationDropdown({ query, onQueryChange, onPick, className = "" }: LocationDropdownProps) {
  const [remotePlaces, setRemotePlaces] = useState<GeocodedPlace[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchedQuery, setSearchedQuery] = useState("");
  const [geoError, setGeoError] = useState<string | null>(null);

  const curated = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return searchLocations;
    return searchLocations.filter(
      (opt) =>
        opt.primary.toLowerCase().includes(q) ||
        opt.secondary.toLowerCase().includes(q),
    );
  }, [query]);

  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setRemotePlaces([]);
      setSearchedQuery("");
      return;
    }

    const handle = window.setTimeout(() => {
      setLoading(true);
      searchPlaces(q)
        .then((places) => {
          setRemotePlaces(places);
          setSearchedQuery(q);
        })
        .catch(() => {
          setRemotePlaces([]);
          setSearchedQuery(q);
        })
        .finally(() => setLoading(false));
    }, 350);

    return () => window.clearTimeout(handle);
  }, [query]);

  async function handleCurrentLocation() {
    setGeoError(null);
    if (!navigator.geolocation) {
      setGeoError("Location is not available in this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const label = await reverseGeocode({ lat, lng });
        onPick?.({ label, lat, lng });
      },
      () => {
        setGeoError("Could not read your location. Choose a city instead.");
      },
    );
  }

  function handleCurated(option: LocationOption) {
    if (option.id === "current") {
      void handleCurrentLocation();
      return;
    }
    onPick?.({
      label: option.primary,
      lat: option.lat ?? null,
      lng: option.lng ?? null,
    });
  }

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
      {geoError ? (
        <p className="mt-2 text-primary text-xs" role="alert">
          {geoError}
        </p>
      ) : null}
      <ul className="mt-3 max-h-64 overflow-auto">
        {curated.map((opt) => (
          <li key={opt.id}>
            <button
              type="button"
              onClick={() => handleCurated(opt)}
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
        {loading ? (
          <li className="px-2 py-2 text-neutral-500 text-xs">Searching places…</li>
        ) : null}
        {remotePlaces.map((place) => (
          <li key={`${place.lat},${place.lng}`}>
            <button
              type="button"
              onClick={() => onPick?.({ label: place.label, lat: place.lat, lng: place.lng })}
              className="flex w-full items-start gap-3 rounded-lg px-2 py-2.5 text-left transition hover:bg-starlight/70"
            >
              <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md bg-neutral-200/80">
                <IconPin className="size-3.5 text-neutral-600" />
              </span>
              <span className="min-w-0">
                <span className="block font-medium text-midnight text-sm">{place.label}</span>
              </span>
            </button>
          </li>
        ))}
        {!loading &&
        searchedQuery === query.trim() &&
        curated.length === 0 &&
        remotePlaces.length === 0 ? (
          <li className="px-2 py-2 text-neutral-500 text-xs">No matching places.</li>
        ) : null}
      </ul>
    </div>
  );
}
