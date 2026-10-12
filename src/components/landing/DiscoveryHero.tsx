import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { landingIcons, landingImages } from "../../config/landingImages";
import { getVendorById } from "../../data/vendors";
import { HeroSearchNav } from "./HeroSearchNav";

const popularSpaces = [
  {
    title: "Storefronts",
    subtitle: "Meet the neighbors",
    to: "/explore?category=venues&q=storefront",
  },
  {
    title: "Outdoor spaces",
    subtitle: "Gather in open air",
    to: "/explore?category=venues&q=garden",
  },
  {
    title: "Cafés & community",
    subtitle: "Make yourself at home",
    to: "/explore?category=venues&q=studio",
  },
  {
    title: "Large spaces",
    subtitle: "Endless potential",
    to: "/explore?category=venues&q=warehouse",
  },
] as const;

const hostSlides = [
  { id: "salt-yard", fallbackName: "Salt Yard Studio" },
  { id: "lanai-loft", fallbackName: "The Lānai Loft" },
  { id: "hale-mauka", fallbackName: "Hale Mauka Garden" },
  { id: "pier-38", fallbackName: "Pier 38 Warehouse" },
] as const;

const slides = [
  {
    src: landingImages.communityGathering,
    name: "Mixed Pantry",
    location: "Downtown Seattle",
    to: "/explore?category=venues",
  },
  ...hostSlides.map((host) => {
    const vendor = getVendorById(host.id);
    return {
      src: vendor?.heroImageSrc ?? vendor?.imageSrc ?? landingImages.daylightStudio,
      name: vendor?.title ?? host.fallbackName,
      location: vendor?.city ?? "Honolulu",
      to: `/vendor/${host.id}`,
    };
  }),
];

export function DiscoveryHero() {
  const [slide, setSlide] = useState(0);
  const current = slides[slide] ?? slides[0];

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSlide((index) => (index + 1) % slides.length);
    }, 7000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="flex flex-col gap-12 px-4 pt-16 pb-8 md:px-[60px]">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col items-center gap-3 text-center">
          <h1 className="font-normal text-[40px] text-midnight leading-none">Find a place to gather</h1>
          <p className="text-base text-body/60">Search venues, compare options, and book in minutes.</p>
        </div>
        <HeroSearchNav />
      </div>

      <div className="flex flex-col gap-[18px]">
        <p className="font-semibold text-lg text-midnight">Popular</p>
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {popularSpaces.map((space) => (
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
