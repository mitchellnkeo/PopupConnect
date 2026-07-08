import { landingImages } from "../../config/landingImages";
import { BackgroundImage } from "./BackgroundImage";
import { LandingHeader } from "./LandingHeader";

const HERO_IMAGE_SRC = landingImages.hero;

export function HeroSection() {
  return (
    <section className="relative">
      <BackgroundImage
        src={HERO_IMAGE_SRC}
        alt="Community marketplace hero"
        className="min-h-[min(85vh,738px)]"
        imageClassName="left-0 w-full h-[120%] -top-[10%] object-cover object-[center_40%]"
        overlayClassName="bg-gradient-to-b from-midnight/30 via-midnight/10 to-midnight/55"
      >
        <LandingHeader overlay />

        <div className="flex min-h-[min(85vh,738px)] flex-col items-center justify-center px-4 pt-28 pb-14 text-center sm:pt-32 lg:pt-24 md:px-[60px] md:pb-16">
          <h1 className="max-w-[min(88vw,1076px)] font-extrabold text-[length:var(--text-hero)] text-white leading-[1.02] tracking-[-0.03em] drop-shadow-[0_2px_18px_rgba(0,0,0,0.45)]">
            Make it happen
          </h1>
          <p className="mt-[1.1em] max-w-[min(72vw,840px)] font-medium text-[length:var(--text-hero-sub)] text-white leading-[1.45] drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)]">
            A community-driven marketplace where small businesses and vendor artists get discovered —
            and anyone with a vision can find the people and places to make it real
          </p>
        </div>
      </BackgroundImage>
    </section>
  );
}
