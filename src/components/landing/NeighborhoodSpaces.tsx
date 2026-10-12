import { Link } from "react-router-dom";
import { useVendorCatalog } from "../../hooks/useVendorCatalog";
import { listingKindOf } from "../../data/vendors";
import { listingMetaLine } from "../../lib/listingMeta";
import { discoveryHomes, type DiscoveryAudience } from "../../lib/discoveryHome";
import { btnTertiary } from "../../lib/buttonStyles";
import { landingIcons } from "../../config/landingImages";
import { MarketplaceCard } from "../explore/MarketplaceCard";

type NeighborhoodSpacesProps = {
  audience: DiscoveryAudience;
};

export function NeighborhoodSpaces({ audience }: NeighborhoodSpacesProps) {
  const copy = discoveryHomes[audience];
  const { vendors, loading } = useVendorCatalog();
  const listings = vendors
    .filter((vendor) => listingKindOf(vendor) === copy.listingKind)
    .slice(0, 3);

  return (
    <section className="flex flex-col gap-8 px-4 pt-8 pb-16 md:px-[60px]">
      <div className="flex flex-col gap-2">
        <p className="text-base text-body/60">{copy.listingsEyebrow}</p>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-normal text-[40px] text-midnight leading-none">{copy.listingsTitle}</h2>
          <Link to={copy.listingsTo} className={btnTertiary}>
            {copy.listingsCta}
            <img src={landingIcons.arrowRight} alt="" width={18} height={18} />
          </Link>
        </div>
      </div>

      {loading && listings.length === 0 ? (
        <p className="text-body/60 text-sm">
          {copy.listingKind === "host" ? "Loading spaces…" : "Loading makers…"}
        </p>
      ) : null}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {listings.map((listing) => (
          <MarketplaceCard
            key={listing.id}
            to={`/vendor/${listing.id}`}
            title={listing.title}
            meta={listingMetaLine(listing)}
            description={listing.about}
            imageSrc={listing.imageSrc}
          />
        ))}
      </div>
    </section>
  );
}
