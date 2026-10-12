import { useAuth } from "../../features/auth/AuthContext";
import { BrandLogo } from "../brand/BrandLogo";
import { AudienceToggle } from "../layout/AudienceToggle";
import { GuestNavLinks } from "../layout/GuestNavLinks";
import { HeaderAuthActions } from "../layout/HeaderAuthActions";

type LandingHeaderProps = {
  overlay?: boolean;
};

export function LandingHeader({ overlay = true }: LandingHeaderProps) {
  const { session, loading } = useAuth();
  const loggedIn = !loading && Boolean(session);
  const variant = overlay ? "overlay" : "default";

  return (
    <header
      className={`absolute inset-x-0 top-0 z-20 ${
        overlay
          ? "border-white/40 border-b bg-body/40"
          : "border-neutral-200 border-b bg-white"
      }`}
    >
      <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-4 py-3.5 md:px-[60px]">
        <div className="flex min-w-0 items-center gap-8 md:gap-12">
          <BrandLogo variant={overlay ? "onDark" : "primary"} />
          {loggedIn ? <AudienceToggle variant={variant} /> : null}
        </div>

        {!loggedIn ? <GuestNavLinks variant={variant} /> : <div className="hidden flex-1 lg:block" />}

        <HeaderAuthActions variant={variant} />
      </div>
    </header>
  );
}
