import { useEffect, useState } from "react";
import type { VendorProfile } from "../data/vendors";
import { vendors as mockVendors } from "../data/vendors";
import {
  findVendorInCatalog,
  invalidateVendorCatalog,
  loadVendorCatalog,
} from "../lib/vendorCatalog";

type VendorCatalogState = {
  vendors: VendorProfile[];
  loading: boolean;
  error: string | null;
};

export function useVendorCatalog(): VendorCatalogState & {
  getVendor: (idOrSlug: string) => VendorProfile | undefined;
  refresh: () => Promise<void>;
} {
  const [state, setState] = useState<VendorCatalogState>({
    vendors: mockVendors,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    loadVendorCatalog()
      .then((vendors) => {
        if (!cancelled) {
          setState({ vendors, loading: false, error: null });
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setState({
            vendors: mockVendors,
            loading: false,
            error: err instanceof Error ? err.message : "Could not load vendors.",
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  async function refresh() {
    invalidateVendorCatalog();
    setState((current) => ({ ...current, loading: true, error: null }));

    try {
      const vendors = await loadVendorCatalog();
      setState({ vendors, loading: false, error: null });
    } catch (err) {
      setState({
        vendors: mockVendors,
        loading: false,
        error: err instanceof Error ? err.message : "Could not load vendors.",
      });
    }
  }

  return {
    ...state,
    getVendor: (idOrSlug: string) => findVendorInCatalog(state.vendors, idOrSlug),
    refresh,
  };
}
