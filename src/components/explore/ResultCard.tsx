import type { ExploreResult } from "../../data/exploreResults";

type ResultCardProps = {
  result: ExploreResult;
  highlighted?: boolean;
  onHover?: () => void;
};

export function ResultCard({ result, highlighted, onHover }: ResultCardProps) {
  return (
    <article
      onMouseEnter={onHover}
      className={`overflow-hidden rounded-2xl border bg-white shadow-sm transition ${
        highlighted ? "border-primary ring-2 ring-primary/20" : "border-neutral-200"
      }`}
    >
      {result.imageSrc ? (
        <img src={result.imageSrc} alt="" className="aspect-[4/3] w-full object-cover" />
      ) : (
        <div
          className="aspect-[4/3] w-full bg-gradient-to-br from-starlight via-neutral-100 to-neutral-200"
          role="img"
          aria-label={`${result.title} placeholder`}
        />
      )}
      <div className="p-4">
        <h3 className="font-semibold text-lg text-midnight leading-snug">{result.title}</h3>
        <p className="mt-1 text-neutral-500 text-sm">{result.city}</p>
      </div>
    </article>
  );
}
