const audienceRows = [
  {
    number: "01",
    title: "For vendors & artists",
    body: "Get discovered and book more gigs while showcasing your unique craft to the right audience.",
  },
  {
    number: "02",
    title: "For space owners",
    body: "List your location and fill your calendar with curated events and quality bookings.",
  },
  {
    number: "03",
    title: "For organizers",
    body: "Find reliable vendors and stunning venues in one place to bring your vision to life.",
  },
] as const;

export function BuiltForCollectiveSection() {
  return (
    <section className="bg-white pt-10">
      <div className="flex min-h-[600px] flex-col gap-12 bg-cream px-6 py-16 md:flex-row md:gap-[100px] md:px-[120px] md:py-[120px]">
        <div className="shrink-0">
          <h2 className="font-extrabold text-[length:var(--text-collective,72px)] text-accent leading-[1.08] tracking-[-0.02em]">
            BUILT
            <br />
            FOR THE
            <br />
            COLLECTIVE
          </h2>
        </div>

        <div className="flex min-w-0 flex-1 flex-col">
          {audienceRows.map((row, index) => (
            <div key={row.number} className="flex flex-col">
              <div className="h-px w-full bg-accent/30" />
              <div className="flex items-center gap-6 py-10 md:gap-10 md:py-12">
                <p className="shrink-0 font-light text-[length:var(--text-row-num,40px)] text-accent italic opacity-60">
                  {row.number}
                </p>
                <div className="flex min-w-0 flex-col gap-2">
                  <h3 className="font-bold text-[length:var(--text-row-title,32px)] text-body leading-normal">
                    {row.title}
                  </h3>
                  <p className="text-[length:var(--text-row-body,18px)] text-body/70 leading-[1.6]">
                    {row.body}
                  </p>
                </div>
              </div>
              {index === audienceRows.length - 1 ? (
                <div className="h-px w-full bg-accent/30" />
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
