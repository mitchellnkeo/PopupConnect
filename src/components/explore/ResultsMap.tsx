import { useState } from "react";
import { exploreImages } from "../../config/exploreImages";
import type { ExploreResult } from "../../data/exploreResults";
import { IconExpand } from "./icons";

type ResultsMapProps = {
  results: ExploreResult[];
  activeId: string | null;
  onMarkerHover: (id: string) => void;
};

export function ResultsMap({ results, activeId, onMarkerHover }: ResultsMapProps) {
  const [zoom, setZoom] = useState(1);

  return (
    <div className="relative h-full min-h-[320px] overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-100 shadow-sm lg:min-h-[calc(100vh-12rem)]">
      {exploreImages.map ? (
        <img
          src={exploreImages.map}
          alt="Map of search results"
          className="absolute inset-0 size-full object-cover transition-transform duration-200"
          style={{ transform: `scale(${zoom})` }}
        />
      ) : (
        <div
          className="absolute inset-0 bg-gradient-to-b from-neutral-100 via-neutral-200 to-neutral-300"
          role="img"
          aria-label="Map placeholder — add exploreImages.map when ready"
          style={{ transform: `scale(${zoom})` }}
        >
          <div className="absolute inset-0 opacity-40">
            <svg className="size-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
                  <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#a8a29e" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>
          <p className="absolute top-4 left-4 font-medium text-neutral-500 text-xs uppercase tracking-wide">
            Map placeholder
          </p>
        </div>
      )}

      {results.map((result) => (
        <button
          key={result.id}
          type="button"
          onMouseEnter={() => onMarkerHover(result.id)}
          onFocus={() => onMarkerHover(result.id)}
          className={`absolute size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-md transition hover:scale-125 ${
            activeId === result.id ? "bg-primary ring-2 ring-primary/40" : "bg-midnight"
          }`}
          style={{ left: `${result.mapX}%`, top: `${result.mapY}%` }}
          aria-label={result.title}
        />
      ))}

      <div className="absolute top-3 right-3 flex flex-col gap-2">
        <button
          type="button"
          className="flex size-9 items-center justify-center rounded-lg border border-neutral-200 bg-white text-midnight shadow-sm hover:bg-neutral-50"
          aria-label="Expand map"
        >
          <IconExpand className="size-4" />
        </button>
        <button
          type="button"
          onClick={() => setZoom((z) => Math.min(z + 0.15, 1.6))}
          className="flex size-9 items-center justify-center rounded-lg border border-neutral-200 bg-white font-medium text-midnight shadow-sm hover:bg-neutral-50"
          aria-label="Zoom in"
        >
          +
        </button>
        <button
          type="button"
          onClick={() => setZoom((z) => Math.max(z - 0.15, 0.85))}
          className="flex size-9 items-center justify-center rounded-lg border border-neutral-200 bg-white font-medium text-midnight shadow-sm hover:bg-neutral-50"
          aria-label="Zoom out"
        >
          −
        </button>
      </div>
    </div>
  );
}
