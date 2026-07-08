import { Link } from "react-router-dom";
import { UserAccountMenu } from "../auth/UserAccountMenu";
import { IconCalendar, IconComment, LogoMarkPrimary } from "../explore/icons";
import type { ExploreFilters } from "../../lib/exploreSearch";
import { ExploreSearchBar } from "../explore/ExploreSearchBar";

type AppHeaderProps = {
  showSearch?: boolean;
  filters?: ExploreFilters;
  onFiltersChange?: (next: ExploreFilters) => void;
};

export function AppHeader({ showSearch = false, filters, onFiltersChange }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-border border-b bg-white">
      <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-4 py-5 md:px-[60px]">
        <Link to="/" className="flex shrink-0 items-center gap-3">
          <LogoMarkPrimary className="size-8" />
          <span className="font-bold text-[length:var(--text-logo,28px)] text-primary uppercase tracking-wide">
            PopupConnect
          </span>
        </Link>

        {showSearch && filters && onFiltersChange ? (
          <div className="hidden min-w-0 flex-1 justify-center lg:flex">
            <ExploreSearchBar filters={filters} onFiltersChange={onFiltersChange} variant="compact" />
          </div>
        ) : (
          <div className="hidden flex-1 lg:block" />
        )}

        <div className="flex shrink-0 items-center gap-2.5 pl-0 md:pl-[60px]">
          <Link
            to="/messages"
            className="rounded p-2.5 text-midnight transition hover:bg-neutral-100"
            aria-label="Messages"
          >
            <IconComment className="size-[18px]" />
          </Link>
          <Link
            to="/when"
            className="rounded p-2.5 text-midnight transition hover:bg-neutral-100"
            aria-label="Calendar"
          >
            <IconCalendar className="size-[18px]" />
          </Link>
          <UserAccountMenu />
        </div>
      </div>

      {showSearch && filters && onFiltersChange ? (
        <div className="border-border border-t px-4 pb-4 lg:hidden">
          <ExploreSearchBar filters={filters} onFiltersChange={onFiltersChange} variant="compact" />
        </div>
      ) : null}
    </header>
  );
}
