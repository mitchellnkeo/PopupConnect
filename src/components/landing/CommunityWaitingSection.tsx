import { Link } from "react-router-dom";
import { landingImages } from "../../config/landingImages";
import { BackgroundImage } from "./BackgroundImage";
import { Button } from "../ui/Button";

const COMMUNITY_IMAGE_SRC = landingImages.community;

const ctaLinkClass =
  "mt-6 inline-flex w-full items-center justify-center rounded-full bg-primary px-5 py-2.5 font-medium text-sm text-white shadow-sm transition hover:bg-primary/90";

export function CommunityWaitingSection() {
  return (
    <section className="bg-white px-4 pb-20 md:px-6">
      <h2 className="text-center font-semibold text-3xl text-midnight tracking-tight md:text-4xl">
        Your community is waiting
      </h2>

      <div className="relative mx-auto mt-10 max-w-6xl">
        <BackgroundImage
          src={COMMUNITY_IMAGE_SRC}
          alt="Community gathering"
          className="min-h-[420px] rounded-3xl md:min-h-[480px]"
          overlayClassName="bg-midnight/15"
        >
          <div className="flex min-h-[420px] flex-col items-center justify-center gap-6 px-4 py-12 md:min-h-[480px] md:flex-row md:gap-8 md:px-8">
            <div className="flex w-full max-w-xs flex-col items-center rounded-2xl border border-white/40 bg-white/70 px-8 py-8 text-center shadow-lg backdrop-blur-md">
              <p className="font-semibold text-lg text-primary">Join as vendor or host</p>
              <Button className="mt-6 w-full" variant="primary">
                I am a vendor
              </Button>
            </div>

            <div className="flex w-full max-w-xs flex-col items-center rounded-2xl border border-white/40 bg-white/70 px-8 py-8 text-center shadow-lg backdrop-blur-md">
              <p className="font-semibold text-lg text-primary">Start booking</p>
              <Link to="/explore" className={ctaLinkClass}>
                Explore vendors
              </Link>
            </div>
          </div>
        </BackgroundImage>
      </div>
    </section>
  );
}
