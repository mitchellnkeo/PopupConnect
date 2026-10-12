import { vendorsToExploreResults } from "../lib/vendorResults";

export type ExploreResult = {
  id: string;
  title: string;
  city: string;
  locationCity?: string;
  kind?: "vendor" | "host";
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
  about?: string;
  tags?: string[];
  minPartySize?: number;
  maxGuests?: number;
  deposit?: number;
  avgRating?: number;
  bookingsThisYear?: number;
};

export const exploreResults: ExploreResult[] = vendorsToExploreResults();
