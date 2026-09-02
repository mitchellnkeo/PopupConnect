import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AppHeader } from "../components/layout/AppHeader";
import { ExploreAuthBanner } from "../components/explore/ExploreAuthBanner";
import { ExploreRefineBar } from "../components/explore/ExploreRefineBar";
import { ResultCard } from "../components/explore/ResultCard";
import { ResultsMap } from "../components/explore/ResultsMap";
import { VendorPreviewModal } from "../components/vendor/VendorPreviewModal";
import { LandingFooter } from "../components/landing/LandingFooter";
import { Tabs } from "../components/ui/Tabs";
import { useVendorCatalog } from "../hooks/useVendorCatalog";
import { reverseGeocode } from "../lib/geocode";
import type { GeoPoint } from "../lib/geo";
import { vendorsToExploreResults } from "../lib/vendorCatalog";
import { filterExploreResults } from "../lib/vendorResults";
import {
  defaultExploreFilters,
  exploreEmptyCopy,
  formatDateLabel,
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
  const [mobileView, setMobileView] = useState<"list" | "map">("list");
  const { vendors, loading, getVendor } = useVendorCatalog();

  useEffect(() => {
    if (!hasExploreSearchParams(searchParams)) {
      setSearchParams(filtersToSearchParams(defaultExploreFilters), { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const filters = useMemo(() => parseExploreFilters(searchParams), [searchParams]);
  const catalogResults = useMemo(() => vendorsToExploreResults(vendors), [vendors]);
  const results = useMemo(
    () => filterExploreResults(catalogResults, filters),
    [catalogResults, filters],
  );
  const heading = useMemo(() => resultsHeading(filters), [filters]);
  const emptyCopy = useMemo(() => exploreEmptyCopy(filters), [filters]);
  const previewVendor = previewVendorId ? getVendor(previewVendorId) : undefined;
  const searchOrigin =
    filters.lat != null && filters.lng != null ? { lat: filters.lat, lng: filters.lng } : null;

  function handleFiltersChange(next: ExploreFilters) {
    setSearchParams(filtersToSearchParams(next), { replace: true });
  }

  async function handleSearchArea(center: GeoPoint) {
    const label = await reverseGeocode(center);
    handleFiltersChange({
      ...filters,
      where: label,
      lat: center.lat,
      lng: center.lng,
    });
  }

  return (
    <div className="flex min-h-dvh flex-col bg-white">
      <AppHeader showSearch filters={filters} onFiltersChange={handleFiltersChange} />

      <div className="mx-auto flex w-full max-w-[1600px] flex-1 flex-col gap-5 px-4 pt-10 pb-6 md:px-[60px] lg:flex-row lg:gap-5">
        <div className="lg:hidden">
          <Tabs
            aria-label="Results view"
            tabs={[
              { id: "list", label: "List" },
              { id: "map", label: "Map" },
            ]}
            value={mobileView}
            onChange={(id) => setMobileView(id === "map" ? "map" : "list")}
          />
        </div>

        <section
          className={`min-w-0 flex-col lg:flex lg:w-[42%] ${mobileView === "list" ? "flex" : "hidden lg:flex"}`}
        >
          <ExploreAuthBanner />

          <p className="mt-5 font-bold text-body/60 text-sm">Results</p>
          <h1 className="mt-2.5 font-bold text-[length:var(--text-section,28px)] text-midnight">
            {heading}
          </h1>
          <p className="mt-2 text-body/55 text-sm">
            Planning for {formatDateLabel(filters)}. Dates don&apos;t filter availability yet.
          </p>

          <ExploreRefineBar filters={filters} onFiltersChange={handleFiltersChange} />

          <ul className="mt-5 grid max-h-[calc(100vh-12rem)] grid-cols-1 gap-6 overflow-y-auto pb-5 sm:grid-cols-2">
            {loading ? (
              <li className="col-span-full py-8 text-body/60 text-sm">Loading vendors…</li>
            ) : null}
            {!loading && results.length === 0 ? (
              <li className="col-span-full py-8">
                <p className="font-medium text-midnight text-sm">{emptyCopy.title}</p>
                <p className="mt-1 text-body/60 text-sm">{emptyCopy.hint}</p>
                <button
                  type="button"
                  onClick={() => handleFiltersChange(defaultExploreFilters)}
                  className="mt-3 font-medium text-primary text-sm hover:underline"
                >
                  Clear filters
                </button>
              </li>
            ) : null}
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

        <section
          className={`min-w-0 lg:w-[58%] ${mobileView === "map" ? "block" : "hidden lg:block"}`}
        >
          <div
            className={`${
              mobileView === "map" ? "h-[calc(100dvh-14rem)]" : "h-[320px]"
            } lg:sticky lg:top-28 lg:h-[calc(100vh-12rem)]`}
          >
            <ResultsMap
              results={results}
              activeId={activeId}
              onMarkerHover={setActiveId}
              onMarkerClick={setPreviewVendorId}
              searchOrigin={searchOrigin}
              onSearchArea={(center) => void handleSearchArea(center)}
              layoutKey={mobileView}
            />
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
