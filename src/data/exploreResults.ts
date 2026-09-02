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
  startingPrice?: number;
  createdAt?: string;
};

export const exploreResults: ExploreResult[] = vendorsToExploreResults();
