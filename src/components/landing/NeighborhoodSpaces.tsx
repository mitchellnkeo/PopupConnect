import { Link } from "react-router-dom";
import { useVendorCatalog } from "../../hooks/useVendorCatalog";
import { listingKindOf } from "../../data/vendors";
import { listingMetaLine } from "../../lib/listingMeta";
import { btnTertiary } from "../../lib/buttonStyles";
import { landingIcons } from "../../config/landingImages";
import { MarketplaceCard } from "../explore/MarketplaceCard";

export function NeighborhoodSpaces() {
  const { vendors, loading } = useVendorCatalog();
  const spaces = vendors.filter((vendor) => listingKindOf(vendor) === "host").slice(0, 3);

  return (
    <section className="flex flex-col gap-8 px-4 pt-8 pb-16 md:px-[60px]">
      <div className="flex flex-col gap-2">
        <p className="text-base text-body/60">Explore</p>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-normal text-[40px] text-midnight leading-none">Spaces in your neighborhood</h2>
          <Link to="/explore?category=venues" className={btnTertiary}>
            Explore all venues
            <img src={landingIcons.arrowRight} alt="" width={18} height={18} />
          </Link>
        </div>
      </div>

      {loading && spaces.length === 0 ? <p className="text-body/60 text-sm">Loading spaces…</p> : null}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {spaces.map((space) => (
          <MarketplaceCard
            key={space.id}
            to={`/vendor/${space.id}`}
            title={space.title}
            meta={listingMetaLine(space)}
            description={space.about}
            imageSrc={space.imageSrc}
          />
        ))}
      </div>
    </section>
  );
}
