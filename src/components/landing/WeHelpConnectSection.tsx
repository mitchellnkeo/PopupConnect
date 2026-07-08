import { landingImages } from "../../config/landingImages";
import { ContentImage } from "./BackgroundImage";

const CONNECT_IMAGE_SRC = landingImages.weHelpConnect;

export function WeHelpConnectSection() {
  return (
    <section className="bg-white">
      <div className="mx-auto grid max-w-[1600px] items-center gap-10 px-6 py-16 md:grid-cols-2 md:gap-[60px] md:px-[120px] md:pt-20 md:pb-[60px]">
        <div className="flex flex-col gap-5 text-midnight">
          <h2 className="font-normal text-4xl leading-none">We help connect</h2>
          <p className="text-[length:var(--text-section,28px)] text-midnight leading-normal">
            A vendor booking platform where small businesses, local artists, and location hosts
            connect with the right people. We are artist and creator forward — giving you a space to
            showcase your work, grow your audience, and share your craft. Whether you&apos;re planning
            something special or simply looking for a good time, list your services, find what you
            need, and book — all in one place.
          </p>
        </div>

        <div className="aspect-[740/460] w-full">
          <ContentImage
            src={CONNECT_IMAGE_SRC}
            alt="Vendors and hosts collaborating"
            className="min-h-[280px] rounded-[20px]"
          />
        </div>
      </div>
    </section>
  );
}
