import { listingMetaLine } from "../../lib/listingMeta";
import type { ExploreResult } from "../../data/exploreResults";
import { MarketplaceCard } from "./MarketplaceCard";

type ResultCardProps = {
  result: ExploreResult;
  highlighted?: boolean;
  onHover?: () => void;
  onClick?: () => void;
};

export function ResultCard({ result, highlighted, onHover, onClick }: ResultCardProps) {
  const meta =
    result.distanceMiles != null
      ? `${result.distanceMiles < 10 ? result.distanceMiles.toFixed(1) : Math.round(result.distanceMiles)} mi · ${result.locationCity ?? result.city}`
      : listingMetaLine({ city: result.locationCity ?? result.city, tags: result.tags ?? [] });

  return (
    <MarketplaceCard
      title={result.title}
      meta={meta}
      description={result.about ?? result.city}
      imageSrc={result.imageSrc}
      highlighted={highlighted}
      onClick={onClick}
      onHover={onHover}
      to={onClick ? undefined : `/vendor/${result.id}`}
    />
  );
}
