import { Link } from "react-router-dom";
import { landingIcons } from "../../config/landingImages";
import { discoveryHomes, type DiscoveryAudience } from "../../lib/discoveryHome";
import { btnPrimary } from "../../lib/buttonStyles";

type BelongSectionProps = {
  audience: DiscoveryAudience;
};

export function BelongSection({ audience }: BelongSectionProps) {
  const copy = discoveryHomes[audience];

  return (
    <section className="flex flex-col gap-8 bg-teal-600 px-6 py-16 md:px-[72px]">
      <div className="flex flex-col gap-3">
        <h2 className="font-normal text-[40px] text-white leading-none">One community. Many ways to belong.</h2>
        <p className="max-w-[1040px] text-lg text-white">{copy.belongSubhead}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {copy.pathways.map((path) => (
          <div
            key={path.title}
            className="flex flex-col items-start gap-6 rounded-xl border border-divider bg-white p-8"
          >
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <img src={landingIcons.palette} alt="" width={30} height={30} />
                <p className="font-semibold text-[22px] text-midnight">{path.title}</p>
              </div>
              <p className="text-base text-body">{path.body}</p>
            </div>
            <Link to={path.to} className={`inline-flex items-center ${btnPrimary}`}>
              {path.cta}
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
