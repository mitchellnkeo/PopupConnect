import { IconPin } from "./icons";

export type VendorCardProps = {
  title: string;
  city: string;
  distanceMiles: number;
  isNew?: boolean;
};

export function VendorCard({ title, city, distanceMiles, isNew }: VendorCardProps) {
  return (
    <article className="w-[220px] shrink-0 overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
      <div className="relative aspect-[4/3] bg-starlight">
        <div className="absolute inset-0 bg-gradient-to-b from-white/50 to-transparent" />
        {isNew ? (
          <span className="absolute top-2 right-2 rounded bg-neutral-900 px-2 py-0.5 font-medium text-[10px] text-white uppercase tracking-wide">
            new
          </span>
        ) : null}
      </div>
      <div className="space-y-2 p-3">
        <h3 className="font-semibold text-midnight text-sm lowercase leading-snug">{title}</h3>
        <p className="flex items-center gap-1.5 text-neutral-500 text-xs">
          <IconPin className="size-3.5 shrink-0 text-primary" />
          <span>{city}</span>
        </p>
        <p className="text-neutral-500 text-xs">{distanceMiles.toFixed(1)} miles away</p>
      </div>
    </article>
  );
}
