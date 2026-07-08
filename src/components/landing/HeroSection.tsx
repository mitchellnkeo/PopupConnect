import { landingImages } from "../../config/landingImages";
import { BackgroundImage } from "./BackgroundImage";
import { LandingHeader } from "./LandingHeader";

const HERO_IMAGE_SRC = landingImages.hero;
const WORDMARK_SRC = landingImages.makeItHappen;

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

        <div className="flex min-h-[min(85vh,738px)] flex-col items-center justify-end px-4 pt-28 pb-16 text-center md:px-[60px] md:pb-20">
          <img
            src={WORDMARK_SRC}
            alt="Make it happen"
            className="h-14 w-auto max-w-[min(92vw,1076px)] drop-shadow-[0_2px_18px_rgba(0,0,0,0.45)] sm:h-20 md:h-24 lg:h-[130px]"
          />
          <p className="mt-6 max-w-[min(92vw,1275px)] font-bold text-[length:var(--text-hero-sub,28px)] text-white leading-normal drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)] md:mt-8">
            A community-driven marketplace where small businesses and vendor artists get discovered —
            and anyone with a vision can find the people and places to make it real
          </p>
        </div>
      </BackgroundImage>
    </section>
  );
}
