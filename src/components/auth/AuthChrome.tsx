import { BrandLogo } from "../brand/BrandLogo";
import { LandingFooter } from "../landing/LandingFooter";
import { HeaderAuthActions } from "../layout/HeaderAuthActions";

type AuthChromeProps = {
  children: React.ReactNode;
  /** Centered single column (sign-up) vs full-width main (sign-in split) */
  layout?: "centered" | "full";
};

export function AuthChrome({ children, layout = "centered" }: AuthChromeProps) {
  return (
    <div className="flex min-h-dvh flex-col bg-white">
      <header className="border-border border-b bg-white">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-4 py-3.5 md:px-[60px]">
          <BrandLogo />
          <HeaderAuthActions />
        </div>
      </header>

      <main
        className={
          layout === "centered"
            ? "mx-auto flex w-full max-w-lg flex-1 flex-col justify-center px-4 py-10"
            : "mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-10 md:px-6"
        }
      >
        {children}
      </main>

      <LandingFooter />
    </div>
  );
}
