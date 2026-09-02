import type { ExploreResult } from "../../data/exploreResults";
import type { GeoPoint } from "../../lib/geo";
import { ExploreMap } from "./ExploreMap";

type ResultsMapProps = {
  results: ExploreResult[];
  activeId: string | null;
  onMarkerHover: (id: string) => void;
  onMarkerClick?: (id: string) => void;
  searchOrigin?: GeoPoint | null;
  onSearchArea?: (center: GeoPoint) => void;
  layoutKey?: string;
};

export function ResultsMap(props: ResultsMapProps) {
  return <ExploreMap {...props} />;
}
