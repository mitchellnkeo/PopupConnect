import { vendorsToExploreResults } from "../lib/vendorResults";

export type ExploreResult = {
  id: string;
  title: string;
  city: string;
  locationCity?: string;
  mapX: number;
  mapY: number;
  lat: number;
  lng: number;
  imageSrc?: string;
  categoryIds?: string[];
  searchText?: string;
  distanceMiles?: number;
};

export const exploreResults: ExploreResult[] = vendorsToExploreResults();
