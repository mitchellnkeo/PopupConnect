import { Link } from "react-router-dom";
import { UserAccountButton } from "../auth/UserAccountButton";
import type { ExploreFilters } from "../../lib/exploreSearch";
import { ExploreSearchBar } from "./ExploreSearchBar";
import { IconCalendar, IconGlobe, LogoMarkPrimary } from "./icons";

type ExploreHeaderProps = {
  filters: ExploreFilters;
  onFiltersChange: (next: ExploreFilters) => void;
};

export function ExploreHeader({ filters, onFiltersChange }: ExploreHeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-neutral-200 border-b bg-white">
      <div className="mx-auto flex max-w-[1400px] items-center gap-4 px-4 py-4 md:px-6">
        <Link to="/" className="flex shrink-0 items-center gap-2">
          <LogoMarkPrimary className="h-7 w-11" />
          <span className="font-semibold text-primary text-sm uppercase tracking-widest">PopupConnect</span>
        </Link>

        <div className="hidden min-w-0 flex-1 justify-center md:flex">
          <ExploreSearchBar filters={filters} onFiltersChange={onFiltersChange} />
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          <button
            type="button"
            className="rounded-full p-2 text-midnight transition hover:bg-neutral-100"
            aria-label="Language"
          >
            <IconGlobe className="size-5" />
          </button>
          <Link
            to="/when"
            className="rounded-full p-2 text-midnight transition hover:bg-neutral-100"
            aria-label="Calendar"
          >
            <IconCalendar className="size-5" />
          </Link>
          <UserAccountButton />
        </div>
      </div>

      <div className="border-neutral-100 border-t px-4 pb-4 md:hidden">
        <ExploreSearchBar filters={filters} onFiltersChange={onFiltersChange} />
      </div>
    </header>
  );
}
