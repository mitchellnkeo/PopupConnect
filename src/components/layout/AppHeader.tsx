import { BrandLogo } from "../brand/BrandLogo";
import type { ExploreFilters } from "../../lib/exploreSearch";
import { ExploreSearchBar } from "../explore/ExploreSearchBar";
import { HeaderAuthActions } from "./HeaderAuthActions";

type AppHeaderProps = {
  showSearch?: boolean;
  filters?: ExploreFilters;
  onFiltersChange?: (next: ExploreFilters) => void;
};

export function AppHeader({ showSearch = false, filters, onFiltersChange }: AppHeaderProps) {
  const search = showSearch && filters && onFiltersChange;

  return (
    <header className="sticky top-0 z-30 overflow-visible border-border border-b bg-white">
      <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-4 py-3.5 md:px-[60px]">
        <BrandLogo />

        {search ? (
          <div className="hidden min-w-0 flex-1 justify-center overflow-visible lg:flex">
            <ExploreSearchBar filters={filters} onFiltersChange={onFiltersChange} variant="compact" />
          </div>
        ) : (
          <div className="hidden flex-1 lg:block" />
        )}

        <HeaderAuthActions />
      </div>

      {search ? (
        <div className="overflow-visible border-border border-t px-4 pb-4 lg:hidden">
          <ExploreSearchBar filters={filters} onFiltersChange={onFiltersChange} variant="compact" />
        </div>
      ) : null}
    </header>
  );
}
