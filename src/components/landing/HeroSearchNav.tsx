import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  defaultExploreFilters,
  filtersToSearchParams,
  type ExploreFilters,
} from "../../lib/exploreSearch";
import { ExploreSearchBar } from "../explore/ExploreSearchBar";

export function HeroSearchNav() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<ExploreFilters>(defaultExploreFilters);

  function submit() {
    navigate(`/explore?${filtersToSearchParams(filters).toString()}`);
  }

  return (
    <ExploreSearchBar
      filters={filters}
      onFiltersChange={setFilters}
      variant="discovery"
      placeholders
      ctaLabel="Search vendors"
      onSubmit={submit}
    />
  );
}
