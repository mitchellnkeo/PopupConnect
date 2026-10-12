import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  defaultExploreFilters,
  filtersToSearchParams,
  type ExploreFilters,
} from "../../lib/exploreSearch";
import { discoveryHomes, type DiscoveryAudience } from "../../lib/discoveryHome";
import { ExploreSearchBar } from "../explore/ExploreSearchBar";

type HeroSearchNavProps = {
  audience: DiscoveryAudience;
};

export function HeroSearchNav({ audience }: HeroSearchNavProps) {
  const navigate = useNavigate();
  const copy = discoveryHomes[audience];
  const [filters, setFilters] = useState<ExploreFilters>(() => ({
    ...defaultExploreFilters,
    categoryId: copy.searchCategoryId,
    categoryIds: copy.searchCategoryId ? [copy.searchCategoryId] : [],
  }));

  function submit() {
    const next = {
      ...filters,
      categoryId: filters.categoryId ?? copy.searchCategoryId,
      categoryIds:
        filters.categoryIds.length > 0
          ? filters.categoryIds
          : copy.searchCategoryId
            ? [copy.searchCategoryId]
            : [],
    };
    navigate(`/explore?${filtersToSearchParams(next).toString()}`);
  }

  return (
    <ExploreSearchBar
      key={audience}
      filters={filters}
      onFiltersChange={setFilters}
      variant="discovery"
      placeholders
      ctaLabel={copy.searchCta}
      onSubmit={submit}
    />
  );
}
