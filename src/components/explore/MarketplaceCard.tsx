import { Link } from "react-router-dom";
import { landingImages } from "../../config/landingImages";

type MarketplaceCardProps = {
  title: string;
  meta: string;
  description: string;
  imageSrc?: string;
  tags?: string[];
  to?: string;
  highlighted?: boolean;
  onClick?: () => void;
  onHover?: () => void;
};

export function MarketplaceCard({
  title,
  meta,
  description,
  imageSrc,
  tags,
  to,
  highlighted,
  onClick,
  onHover,
}: MarketplaceCardProps) {
  const className = `block w-full overflow-hidden rounded-[10px] bg-white text-left shadow-[0_0_20px_8px_rgba(0,0,0,0.05)] transition ${
    highlighted ? "ring-2 ring-primary" : ""
  }`;

  const content = (
    <>
      <div className="aspect-[400/288] overflow-hidden rounded-t-[12px]">
        {imageSrc ? (
          <img src={imageSrc} alt="" className="size-full object-cover" />
        ) : (
          <img src={landingImages.daylightStudio} alt="" className="size-full object-cover" />
        )}
      </div>
      <div className="flex flex-col gap-4 p-5">
        <div className="flex flex-col gap-1">
          <h3 className="font-semibold text-[22px] text-midnight leading-none">{title}</h3>
          <p className="text-body text-xs">{meta}</p>
        </div>
        <p className="line-clamp-3 text-base text-body leading-normal">{description}</p>
        {tags && tags.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="inline-flex h-6 items-center rounded border border-border px-2.5 text-body/80 text-xs"
              >
                {tag}
              </span>
            ))}
            {tags.length > 3 ? (
              <span className="inline-flex h-6 items-center rounded border border-border px-2.5 text-body/80 text-xs">
                ...
              </span>
            ) : null}
          </div>
        ) : null}
      </div>
    </>
  );

  if (onClick) {
    return (
      <button type="button" onClick={onClick} onMouseEnter={onHover} className={className}>
        {content}
      </button>
    );
  }

  if (to) {
    return (
      <Link to={to} onMouseEnter={onHover} className={className}>
        {content}
      </Link>
    );
  }

  return <div className={className}>{content}</div>;
}
