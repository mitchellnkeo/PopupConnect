import { Link } from "react-router-dom";
import { landingImages } from "../../config/landingImages";

const COMMUNITY_IMAGE_SRC = landingImages.community;

const ctaCards = [
  {
    title: "Join as vendor or host",
    body: "Register to sell your products or host community events and workshops.",
    buttonLabel: "Join as vendor",
    to: "/sign-up",
  },
  {
    title: "Start booking",
    body: "Discover unique local vendors and experiences in your neighborhood.",
    buttonLabel: "Join as event planner",
    to: "/sign-up",
  },
] as const;

export function CommunityWaitingSection() {
  return (
    <section className="relative min-h-[560px] overflow-hidden bg-body">
      <img
        src={COMMUNITY_IMAGE_SRC}
        alt=""
        aria-hidden
        className="pointer-events-none absolute inset-0 size-full object-cover opacity-30"
      />

      <div className="relative flex min-h-[560px] flex-col">
        <div className="flex items-center justify-center px-6 pt-10 pb-5 md:px-[60px]">
          <h2 className="text-center font-bold text-4xl text-white md:text-[56px]">
            Your community is waiting
          </h2>
        </div>

        <div className="flex flex-1 items-center justify-center px-6 pt-16 pb-[60px] md:px-[100px] md:pt-[120px]">
          <div className="grid w-full max-w-[1100px] gap-6 md:grid-cols-2 md:gap-6">
            {ctaCards.map((card) => (
              <div
                key={card.title}
                className="flex flex-col gap-4 rounded-xl border border-white/40 bg-white/10 p-8 backdrop-blur-[2.5px]"
              >
                <div className="flex flex-col gap-2">
                  <p className="font-bold text-[length:var(--text-cta-title,28px)] text-white">
                    {card.title}
                  </p>
                  <p className="text-[length:var(--text-cta-body,18px)] text-white/80">
                    {card.body}
                  </p>
                </div>
                <Link
                  to={card.to}
                  className="inline-flex w-full items-center justify-center rounded bg-primary px-5 py-2.5 font-semibold text-[length:var(--text-cta-body,18px)] text-white transition hover:bg-primary/90"
                >
                  {card.buttonLabel}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
