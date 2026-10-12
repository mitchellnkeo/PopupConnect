import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { landingIcons, landingImages } from "../../config/landingImages";
import { getVendorById } from "../../data/vendors";
import { discoveryHomes, type DiscoveryAudience } from "../../lib/discoveryHome";
import { HeroSearchNav } from "./HeroSearchNav";

const venueSlides = [
  { id: "salt-yard", fallbackName: "Salt Yard Studio" },
  { id: "lanai-loft", fallbackName: "The Lānai Loft" },
  { id: "hale-mauka", fallbackName: "Hale Mauka Garden" },
  { id: "pier-38", fallbackName: "Pier 38 Warehouse" },
] as const;

const vendorSlides = [
  { id: "lei-thread", fallbackName: "Lei & Thread Studio" },
  { id: "snap-lei", fallbackName: "Snap Lei Photo" },
  { id: "hearth-leaf", fallbackName: "Hearth & Leaf" },
  { id: "clay-tide", fallbackName: "Clay & Tide" },
] as const;

function slidesFor(audience: DiscoveryAudience) {
  const featured =
    audience === "venues"
      ? {
          src: landingImages.communityGathering,
          name: "Mixed Pantry",
          location: "Downtown Seattle",
          to: "/explore?category=venues",
        }
      : {
          src: landingImages.communityGathering,
          name: "Aki's Mobile Matcha Bar",
          location: "Honolulu, HI",
          to: "/vendor/aki-matcha",
        };

  const listingSlides = (audience === "venues" ? venueSlides : vendorSlides).map((item) => {
    const vendor = getVendorById(item.id);
    return {
      src: vendor?.heroImageSrc ?? vendor?.imageSrc ?? landingImages.daylightStudio,
      name: vendor?.title ?? item.fallbackName,
      location: vendor?.city ?? "Honolulu, HI",
      to: `/vendor/${item.id}`,
    };
  });

  return [featured, ...listingSlides];
}

type DiscoveryHeroProps = {
  audience: DiscoveryAudience;
};

export function DiscoveryHero({ audience }: DiscoveryHeroProps) {
  const copy = discoveryHomes[audience];
  const slides = slidesFor(audience);
  const [slide, setSlide] = useState(0);
  const current = slides[slide] ?? slides[0];

  useEffect(() => {
    setSlide(0);
  }, [audience]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSlide((index) => (index + 1) % slides.length);
    }, 7000);
    return () => window.clearInterval(timer);
  }, [slides.length, audience]);

  return (
    <section className="flex flex-col gap-12 px-4 pt-16 pb-8 md:px-[60px]">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col items-center gap-3 text-center">
          <h1 className="font-normal text-[40px] text-midnight leading-none">{copy.headline}</h1>
          <p className="text-base text-body/60">{copy.subhead}</p>
        </div>
        <HeroSearchNav key={audience} audience={audience} />
      </div>

      <div className="flex flex-col gap-[18px]">
        <p className="font-semibold text-lg text-midnight">Popular</p>
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {copy.popular.map((space) => (
            <Link
              key={space.title}
              to={space.to}
              className="flex items-center gap-5 rounded-xl border-2 border-surface bg-surface p-6 transition hover:border-teal-100 hover:bg-teal-100"
            >
              <img src={landingIcons.coffee} alt="" width={28} height={28} className="shrink-0" />
              <span className="flex min-w-0 flex-col gap-1">
                <span className="font-medium text-lg text-midnight leading-none">{space.title}</span>
                <span className="text-body/60 text-sm leading-none">{space.subtitle}</span>
              </span>
            </Link>
          ))}
        </div>
      </div>

      <div className="relative h-[280px] overflow-hidden rounded-[18px] sm:h-[360px] lg:h-[450px]">
        <img
          src={current.src}
          alt=""
          className="absolute inset-0 size-full object-cover object-center"
        />

        <Link
          to={current.to}
          className="absolute bottom-6 left-6 flex items-center gap-6 rounded-[10px] bg-white px-5 py-3 shadow-[0_0_6px_rgba(255,255,255,0.25)]"
        >
          <span className="flex flex-col gap-1">
            <span className="font-medium text-[#18352f] text-base leading-none">{current.name}</span>
            <span className="font-medium text-[#68706f] text-sm leading-none">{current.location}</span>
          </span>
          <img src={landingIcons.arrowUpRight} alt="" width={24} height={24} />
        </Link>

        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-3 p-3">
          {slides.map((item, index) => (
            <button
              key={item.name}
              type="button"
              aria-label={`Show ${item.name}`}
              aria-current={index === slide ? true : undefined}
              onClick={() => setSlide(index)}
              className={`size-[13px] rounded-xl ${index === slide ? "bg-teal-600" : "bg-white/50"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
