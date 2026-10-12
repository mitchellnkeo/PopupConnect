import { BrandLogo } from "../brand/BrandLogo";
import { UserAccountMenu } from "../auth/UserAccountMenu";
import type { ExploreFilters } from "../../lib/exploreSearch";
import { ExploreSearchBar } from "./ExploreSearchBar";
import { HeaderUtilityNav } from "../layout/HeaderUtilityNav";

type ExploreHeaderProps = {
  filters: ExploreFilters;
  onFiltersChange: (next: ExploreFilters) => void;
};

export function ExploreHeader({ filters, onFiltersChange }: ExploreHeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-border border-b bg-white">
      <div className="mx-auto flex max-w-[1600px] items-center gap-4 px-4 py-3.5 md:px-[60px]">
        <BrandLogo />

        <div className="hidden min-w-0 flex-1 justify-center md:flex">
          <ExploreSearchBar filters={filters} onFiltersChange={onFiltersChange} />
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          <HeaderUtilityNav />
          <UserAccountMenu />
        </div>
      </div>

      <div className="border-border border-t px-4 pb-4 md:hidden">
        <ExploreSearchBar filters={filters} onFiltersChange={onFiltersChange} />
      </div>
    </header>
  );
}
