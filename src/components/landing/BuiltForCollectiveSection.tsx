import { IconOrganizer, IconPalette, IconVenueHost } from "./icons";

const audienceCards = [
  {
    icon: IconPalette,
    title: "For vendors & artists",
    body: "Get discovered and book more gigs",
  },
  {
    icon: IconVenueHost,
    title: "For space owners",
    body: "List your location and fill your calendar",
  },
  {
    icon: IconOrganizer,
    title: "For organizers",
    body: "Find vendors and venues in one place",
  },
] as const;

export function BuiltForCollectiveSection() {
  return (
    <section className="px-4 pb-16 md:px-6 md:pb-24">
      <div className="mx-auto max-w-6xl rounded-3xl bg-starlight px-6 py-14 md:px-12 md:py-16">
        <h2 className="text-center font-semibold text-3xl text-primary tracking-tight md:text-4xl">
          Built for the collective
        </h2>

        <ul className="mt-12 grid gap-6 md:grid-cols-3">
          {audienceCards.map((card) => (
            <li
              key={card.title}
              className="flex flex-col items-center rounded-2xl bg-primary px-6 py-10 text-center text-white"
            >
              <card.icon className="size-8" strokeWidth={1.5} />
              <h3 className="mt-5 font-semibold text-lg">{card.title}</h3>
              <p className="mt-2 text-sm text-white/90 leading-relaxed">{card.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
