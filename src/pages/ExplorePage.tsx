import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ExploreHeader } from "../components/explore/ExploreHeader";
import { ResultCard } from "../components/explore/ResultCard";
import { ResultsMap } from "../components/explore/ResultsMap";
import { ViewModeToggle, type ViewMode } from "../components/explore/ViewModeToggle";
import { LandingFooter } from "../components/landing/LandingFooter";
import { exploreResults } from "../data/exploreResults";
import {
  filtersToSearchParams,
  parseExploreFilters,
  resultsHeading,
  type ExploreFilters,
} from "../lib/exploreSearch";

export function ExplorePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<ViewMode>("map");
  const [activeId, setActiveId] = useState<string | null>(null);

  const filters = useMemo(() => parseExploreFilters(searchParams), [searchParams]);

  const heading = useMemo(() => resultsHeading(filters), [filters]);

  function handleFiltersChange(next: ExploreFilters) {
    setSearchParams(filtersToSearchParams(next), { replace: true });
  }

  return (
    <div className="flex min-h-dvh flex-col bg-white">
      <ExploreHeader filters={filters} onFiltersChange={handleFiltersChange} />

      <div className="mx-auto flex w-full max-w-[1400px] flex-1 flex-col gap-6 px-4 py-6 md:px-6 lg:flex-row lg:gap-8">
        {/* Results column — full width on mobile when "show list" */}
        <section
          className={`flex min-w-0 flex-col lg:w-[58%] ${
            viewMode === "list" ? "block" : "hidden lg:block"
          }`}
        >
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-neutral-500 text-sm">Results</p>
              <h1 className="mt-1 font-semibold text-3xl text-neutral-900 tracking-tight md:text-4xl">
                {heading}
              </h1>
            </div>
            <ViewModeToggle mode={viewMode} onChange={setViewMode} />
          </div>

          <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {exploreResults.map((result) => (
              <li key={result.id}>
                <ResultCard
                  result={result}
                  highlighted={activeId === result.id}
                  onHover={() => setActiveId(result.id)}
                />
              </li>
            ))}
          </ul>
        </section>

        {/* Map column — full width on mobile when "show map" */}
        <section
          className={`min-w-0 lg:w-[42%] ${viewMode === "map" ? "block" : "hidden lg:block"}`}
        >
          <div className="lg:sticky lg:top-24">
            <ResultsMap
              results={exploreResults}
              activeId={activeId}
              onMarkerHover={setActiveId}
            />
          </div>
        </section>
      </div>

      <LandingFooter />
    </div>
  );
}
