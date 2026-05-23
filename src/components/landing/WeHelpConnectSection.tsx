import { landingImages } from "../../config/landingImages";
import { ContentImage } from "./BackgroundImage";

const CONNECT_IMAGE_SRC = landingImages.weHelpConnect;

export function WeHelpConnectSection() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 md:grid-cols-2 md:gap-16 md:px-6">
        <div>
          <h2 className="font-semibold text-3xl text-midnight tracking-tight md:text-4xl">
            We help connect
          </h2>
          <p className="mt-6 text-neutral-700 text-base leading-relaxed md:text-lg">
            A vendor booking platform where small businesses, local artists, and location hosts
            connect with the right people. We make it simple to discover talent, book space, and
            bring events to life in your neighborhood.
          </p>
        </div>

        <div className="aspect-[4/3] w-full md:aspect-auto md:min-h-[320px]">
          <ContentImage
            src={CONNECT_IMAGE_SRC}
            alt="Vendors and hosts collaborating"
            className="min-h-[280px]"
          />
        </div>
      </div>
    </section>
  );
}
