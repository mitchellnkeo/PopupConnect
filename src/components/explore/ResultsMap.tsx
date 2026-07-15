import type { ExploreResult } from "../../data/exploreResults";
import { ExploreMap } from "./ExploreMap";

type ResultsMapProps = {
  results: ExploreResult[];
  activeId: string | null;
  onMarkerHover: (id: string) => void;
};

export function ResultsMap(props: ResultsMapProps) {
  return <ExploreMap {...props} />;
}
