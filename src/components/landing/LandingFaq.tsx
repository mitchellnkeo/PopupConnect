import { discoveryHomes, type DiscoveryAudience } from "../../lib/discoveryHome";

type LandingFaqProps = {
  audience: DiscoveryAudience;
};

export function LandingFaq({ audience }: LandingFaqProps) {
  const copy = discoveryHomes[audience];

  return (
    <section id="how-it-works" className="flex flex-col gap-8 bg-white px-4 py-16 md:px-[60px]">
      <h2 className="font-normal text-[40px] text-midnight leading-none">A few things you might be wondering</h2>
      <div>
        {copy.faq.map((item) => (
          <div
            key={item.question}
            className="flex flex-col gap-3 border-divider border-b py-[18px] md:flex-row md:gap-10"
          >
            <p className="w-full font-medium text-lg text-midnight md:w-[420px] md:shrink-0">{item.question}</p>
            <p className="min-w-0 flex-1 text-base text-body/60">{item.answer}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
