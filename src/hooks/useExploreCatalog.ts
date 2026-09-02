import { useEffect, useState } from "react";
import type { VendorProfile } from "../data/vendors";
import { vendors as mockVendors } from "../data/vendors";
import type { ExploreFilters } from "../lib/exploreSearch";
import { filtersToSearchParams } from "../lib/exploreSearch";
import { findVendorInCatalog, searchVendorCatalog } from "../lib/vendorCatalog";

type ExploreCatalogState = {
  vendors: VendorProfile[];
  loading: boolean;
};

export function useExploreCatalog(filters: ExploreFilters): ExploreCatalogState & {
  getVendor: (idOrSlug: string) => VendorProfile | undefined;
} {
  const filterKey = filtersToSearchParams(filters).toString();
  const [state, setState] = useState<ExploreCatalogState>({
    vendors: mockVendors,
    loading: true,
  });

  useEffect(() => {
    let cancelled = false;
    setState((current) => ({ ...current, loading: true }));

    searchVendorCatalog(filters)
      .then((vendors) => {
        if (!cancelled) setState({ vendors, loading: false });
      })
      .catch(() => {
        if (!cancelled) setState({ vendors: mockVendors, loading: false });
      });

    return () => {
      cancelled = true;
    };
  }, [filterKey]);

  return {
    ...state,
    getVendor: (idOrSlug: string) => findVendorInCatalog(state.vendors, idOrSlug),
  };
}
