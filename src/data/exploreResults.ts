import { vendorsToExploreResults } from "../lib/vendorResults";

export type ExploreResult = {
  id: string;
  title: string;
  city: string;
  mapX: number;
  mapY: number;
  imageSrc?: string;
  categoryIds?: string[];
};

export const exploreResults: ExploreResult[] = vendorsToExploreResults();
