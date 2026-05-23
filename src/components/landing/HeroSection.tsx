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
        className="min-h-[min(85vh,720px)]"
        imageClassName={HERO_IMAGE_SRC ? "scale-105 blur-sm" : ""}
        overlayClassName="bg-midnight/45"
      >
        <LandingHeader overlay />

        <div className="flex min-h-[min(85vh,720px)] flex-col items-center justify-center px-4 pt-28 pb-20 text-center md:px-6">
          <h1 className="max-w-3xl font-semibold text-4xl text-white tracking-tight md:text-5xl lg:text-6xl">
            Make it happen
          </h1>
          <p className="mt-6 max-w-2xl text-base text-white/90 leading-relaxed md:text-lg">
            A community-driven marketplace where small businesses and vendor artists get discovered —
            and anyone with a vision can find the people and places to make it real.
          </p>
        </div>
      </BackgroundImage>
    </section>
  );
}
