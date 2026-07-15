import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AppHeader } from "../components/layout/AppHeader";
import { ExploreAuthBanner } from "../components/explore/ExploreAuthBanner";
import { ResultCard } from "../components/explore/ResultCard";
import { ResultsMap } from "../components/explore/ResultsMap";
import { VendorPreviewModal } from "../components/vendor/VendorPreviewModal";
import { LandingFooter } from "../components/landing/LandingFooter";
import { exploreResults } from "../data/exploreResults";
import { getVendorById } from "../data/vendors";
import { filterExploreResults } from "../lib/vendorResults";
import {
  defaultExploreFilters,
  filtersToSearchParams,
  hasExploreSearchParams,
  parseExploreFilters,
  resultsHeading,
  type ExploreFilters,
} from "../lib/exploreSearch";

export function ExplorePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [previewVendorId, setPreviewVendorId] = useState<string | null>(null);

  useEffect(() => {
    if (!hasExploreSearchParams(searchParams)) {
      setSearchParams(filtersToSearchParams(defaultExploreFilters), { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const filters = useMemo(() => parseExploreFilters(searchParams), [searchParams]);
  const results = useMemo(() => filterExploreResults(exploreResults, filters), [filters]);
  const heading = useMemo(() => resultsHeading(filters), [filters]);
  const previewVendor = previewVendorId ? getVendorById(previewVendorId) : undefined;

  function handleFiltersChange(next: ExploreFilters) {
    setSearchParams(filtersToSearchParams(next), { replace: true });
  }

  return (
    <div className="flex min-h-dvh flex-col bg-white">
      <AppHeader showSearch filters={filters} onFiltersChange={handleFiltersChange} />

      <div className="mx-auto flex w-full max-w-[1600px] flex-1 flex-col gap-5 px-4 pt-10 pb-6 md:px-[60px] lg:flex-row lg:gap-5">
        <section className="flex min-w-0 flex-col lg:w-[42%]">
          <ExploreAuthBanner />

          <p className="mt-5 font-bold text-body/60 text-sm">Results</p>
          <h1 className="mt-2.5 font-bold text-[length:var(--text-section,28px)] text-midnight">
            {heading}
          </h1>

          <ul className="mt-5 grid max-h-[calc(100vh-12rem)] grid-cols-1 gap-6 overflow-y-auto pb-5 sm:grid-cols-2">
            {results.map((result) => (
              <li key={result.id}>
                <ResultCard
                  result={result}
                  highlighted={activeId === result.id}
                  onHover={() => setActiveId(result.id)}
                  onClick={() => setPreviewVendorId(result.id)}
                />
              </li>
            ))}
          </ul>
        </section>

        <section className="min-w-0 lg:w-[58%]">
          <div className="lg:sticky lg:top-28">
            <ResultsMap results={results} activeId={activeId} onMarkerHover={setActiveId} />
          </div>
        </section>
      </div>

      <LandingFooter />

      {previewVendor ? (
        <VendorPreviewModal vendor={previewVendor} onClose={() => setPreviewVendorId(null)} />
      ) : null}
    </div>
  );
}
