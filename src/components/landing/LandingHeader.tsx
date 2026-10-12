import { BrandLogo } from "../brand/BrandLogo";
import { AudienceToggle } from "../layout/AudienceToggle";
import { HeaderAuthActions } from "../layout/HeaderAuthActions";

type LandingHeaderProps = {
  overlay?: boolean;
};

export function LandingHeader({ overlay = false }: LandingHeaderProps) {
  const variant = overlay ? "overlay" : "default";

  return (
    <header
      className={
        overlay
          ? "absolute inset-x-0 top-0 z-30 border-white/40 border-b bg-body/40"
          : "sticky top-0 z-30 border-gray-300 border-b bg-white"
      }
    >
      <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-4 py-3.5 md:px-[60px]">
        <BrandLogo variant={overlay ? "onDark" : "primary"} />
        <AudienceToggle variant={variant} />
        <HeaderAuthActions variant={variant} />
      </div>
    </header>
  );
}
