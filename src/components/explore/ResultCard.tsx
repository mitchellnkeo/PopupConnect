import { Link } from "react-router-dom";
import type { ExploreResult } from "../../data/exploreResults";

type ResultCardProps = {
  result: ExploreResult;
  highlighted?: boolean;
  onHover?: () => void;
  onClick?: () => void;
};

export function ResultCard({ result, highlighted, onHover, onClick }: ResultCardProps) {
  const content = (
    <>
      {result.imageSrc ? (
        <img src={result.imageSrc} alt="" className="aspect-[325/196] w-full object-cover" />
      ) : (
        <div
          className="aspect-[325/196] w-full bg-gradient-to-br from-starlight via-neutral-100 to-neutral-200"
          role="img"
          aria-label={`${result.title} placeholder`}
        />
      )}
      <div className="px-5 py-2.5">
        <h3 className="font-bold text-lg text-midnight leading-snug">{result.title}</h3>
        <p className="text-body/60 text-xs">{result.city}</p>
      </div>
    </>
  );

  const className = `block w-full overflow-hidden rounded-[10px] bg-white text-left shadow-[0_0_20px_8px_rgba(0,0,0,0.25)] transition ${
    highlighted ? "ring-2 ring-primary" : ""
  }`;

  if (onClick) {
    return (
      <button type="button" onClick={onClick} onMouseEnter={onHover} className={className}>
        {content}
      </button>
    );
  }

  return (
    <Link to={`/vendor/${result.id}`} onMouseEnter={onHover} className={className}>
      {content}
    </Link>
  );
}
