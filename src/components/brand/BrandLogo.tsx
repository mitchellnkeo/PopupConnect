import { Link } from "react-router-dom";
import { BRAND_WORDMARK } from "../../config/brand";

type BrandLogoProps = {
  variant?: "primary" | "onDark";
  to?: string;
  className?: string;
};

export function BrandLogo({ variant = "primary", to = "/", className = "" }: BrandLogoProps) {
  const onDark = variant === "onDark";
  const mark = onDark ? "/images/brand/logo-mark-on-dark.svg" : "/images/brand/logo-mark.svg";

  return (
    <Link
      to={to}
      className={`inline-flex shrink-0 items-center gap-3 ${onDark ? "text-white" : "text-primary"} ${className}`.trim()}
    >
      <img src={mark} alt="" width={32} height={32} className="size-8" />
      <span className="font-bold text-[28px] leading-none tracking-tight">{BRAND_WORDMARK}</span>
    </Link>
  );
}
