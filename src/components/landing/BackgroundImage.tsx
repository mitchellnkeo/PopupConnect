import type { CSSProperties, ReactNode } from "react";

type BackgroundImageProps = {
  /** Set when you have an asset, e.g. `url(/images/hero.jpg)` or pass `src="/images/hero.jpg"` */
  src?: string;
  alt?: string;
  className?: string;
  imageClassName?: string;
  overlayClassName?: string;
  style?: CSSProperties;
  children?: ReactNode;
};

/**
 * Full-bleed background slot. Without `src`, shows a neutral placeholder
 * so layout can ship before final photography is ready.
 */
export function BackgroundImage({
  src,
  alt = "",
  className = "",
  imageClassName = "",
  overlayClassName = "",
  style,
  children,
}: BackgroundImageProps) {
  return (
    <div className={`relative overflow-hidden ${className}`.trim()} style={style}>
      {src ? (
        <img
          src={src}
          alt={alt}
          className={`absolute ${imageClassName || "inset-0 size-full object-cover"}`.trim()}
        />
      ) : (
        <div
          className="absolute inset-0 bg-gradient-to-br from-starlight via-neutral-200 to-midnight/25"
          role="img"
          aria-label={alt || "Background image placeholder"}
        />
      )}
      {overlayClassName ? (
        <div className={`pointer-events-none absolute inset-0 ${overlayClassName}`.trim()} />
      ) : null}
      {children ? <div className="relative z-10">{children}</div> : null}
    </div>
  );
}

type ContentImageProps = {
  src?: string;
  alt: string;
  className?: string;
};

/** Rounded content image slot (e.g. “We help connect” illustration). */
export function ContentImage({ src, alt, className = "" }: ContentImageProps) {
  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        className={`size-full rounded-[20px] object-cover ${className}`.trim()}
      />
    );
  }

  return (
    <div
      className={`flex size-full min-h-[280px] items-center justify-center rounded-2xl bg-gradient-to-br from-starlight to-neutral-200 ${className}`.trim()}
      role="img"
      aria-label={`${alt} placeholder`}
    >
      <span className="px-6 text-center text-neutral-500 text-sm">Image placeholder</span>
    </div>
  );
}
