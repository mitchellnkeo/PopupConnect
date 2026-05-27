import { Link } from "react-router-dom";
import { LandingFooter } from "../landing/LandingFooter";
import { IconCalendar } from "../landing/icons";
import { LogoMarkPrimary } from "../explore/icons";
import { UserAccountMenu } from "./UserAccountMenu";

type AuthChromeProps = {
  children: React.ReactNode;
  /** Centered single column (sign-up) vs full-width main (sign-in split) */
  layout?: "centered" | "full";
};

export function AuthChrome({ children, layout = "centered" }: AuthChromeProps) {
  return (
    <div className="flex min-h-dvh flex-col bg-white">
      <header className="border-neutral-100 border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 md:px-6">
          <Link to="/" className="flex items-center gap-2">
            <LogoMarkPrimary className="h-7 w-11" />
            <span className="font-semibold text-primary text-sm uppercase tracking-widest">
              PopupConnect
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <Link
              to="/about"
              className="rounded-full p-2 text-midnight transition hover:bg-neutral-100"
              aria-label="About"
            >
              <span className="block size-5 rounded border-2 border-midnight border-dashed" />
            </Link>
            <Link
              to="/when"
              className="rounded-full p-2 text-midnight transition hover:bg-neutral-100"
              aria-label="Calendar"
            >
              <IconCalendar className="size-5" />
            </Link>
            <UserAccountMenu />
          </div>
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
