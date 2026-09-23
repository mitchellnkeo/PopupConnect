import { BRAND_NAME } from "../../config/brand";

type BrandWordmarkProps = {
  className?: string;
};

export function BrandWordmark({ className = "" }: BrandWordmarkProps) {
  return <span className={className}>{BRAND_NAME}</span>;
}
