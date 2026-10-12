import { BRAND_WORDMARK } from "../../config/brand";

type BrandWordmarkProps = {
  className?: string;
};

export function BrandWordmark({ className = "" }: BrandWordmarkProps) {
  return <span className={className}>{BRAND_WORDMARK}</span>;
}
