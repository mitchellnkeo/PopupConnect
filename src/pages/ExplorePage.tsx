import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AppHeader } from "../components/layout/AppHeader";
import { ExploreAuthBanner } from "../components/explore/ExploreAuthBanner";
import { ExploreFilterPicker } from "../components/explore/ExploreFilterPicker";
import { ResultCard } from "../components/explore/ResultCard";
import { ResultsMap } from "../components/explore/ResultsMap";
import { VendorPreviewModal } from "../components/vendor/VendorPreviewModal";
import { LandingFooter } from "../components/landing/LandingFooter";
import { Tabs } from "../components/ui/Tabs";
import { useExploreCatalog } from "../hooks/useExploreCatalog";
import { reverseGeocode } from "../lib/geocode";
import type { GeoPoint } from "../lib/geo";
import { vendorsToExploreResults } from "../lib/vendorCatalog";
import { filterExploreResults } from "../lib/vendorResults";
import {
  defaultExploreFilters,
  exploreEmptyCopy,
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
  const [cardLayout, setCardLayout] = useState<"grid" | "list">("grid");

  useEffect(() => {
    if (!hasExploreSearchParams(searchParams)) {
      setSearchParams(filtersToSearchParams(defaultExploreFilters), { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const filters = useMemo(() => parseExploreFilters(searchParams), [searchParams]);
  const { vendors, loading, getVendor } = useExploreCatalog(filters);
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

      <div className="mx-auto flex w-full max-w-[1600px] flex-1 flex-col gap-6 px-4 pt-12 pb-6 md:px-[60px]">
        <ExploreAuthBanner />

        <div className="flex flex-col gap-2">
          <p className="font-medium text-body/60 text-sm">Results</p>
          <h1 className="font-normal text-[28px] text-midnight leading-none">{heading}</h1>
        </div>

        <ExploreFilterPicker
          filters={filters}
          onFiltersChange={handleFiltersChange}
          cardLayout={cardLayout}
          onCardLayoutChange={setCardLayout}
        />

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

        <div className="flex flex-col gap-5 lg:flex-row">
          <section
            className={`min-w-0 flex-1 flex-col ${mobileView === "list" ? "flex" : "hidden lg:flex"}`}
          >
            <ul
              className={`grid gap-6 ${cardLayout === "list" ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2"}`}
            >
              {loading && results.length === 0 ? (
                <li className="col-span-full py-8 text-body/60 text-sm">Loading listings…</li>
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
            className={`min-w-0 lg:w-[38%] lg:min-w-[420px] ${mobileView === "map" ? "block" : "hidden lg:block"}`}
          >
            <div
              className={`overflow-hidden rounded-[20px] ${
                mobileView === "map" ? "h-[calc(100dvh-14rem)]" : "h-[320px]"
              } lg:sticky lg:top-28 lg:h-[calc(100vh-10rem)]`}
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
      </div>

      <LandingFooter />

      {previewVendor ? (
        <VendorPreviewModal vendor={previewVendor} onClose={() => setPreviewVendorId(null)} />
      ) : null}
    </div>
  );
}
