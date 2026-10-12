import { BRAND_NAME } from "../../config/brand";

const questions = [
  {
    question: `What can I discover on ${BRAND_NAME}?`,
    answer: "Independent vendors and artists, spaces for pop-ups, and ideas for local community events.",
  },
  {
    question: "How do I start a conversation?",
    answer: "Explore a profile and share your idea, dates, and what you need with the vendor or space owner.",
  },
  {
    question: "Can I join before I have an event planned?",
    answer: "Yes. Start with a profile, browse the community, and connect when your next idea takes shape.",
  },
] as const;

export function LandingFaq() {
  return (
    <section id="how-it-works" className="flex flex-col gap-8 bg-white px-4 py-16 md:px-[60px]">
      <h2 className="font-normal text-[40px] text-midnight leading-none">A few things you might be wondering</h2>
      <div>
        {questions.map((item) => (
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
