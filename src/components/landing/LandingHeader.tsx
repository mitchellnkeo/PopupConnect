import { Link } from "react-router-dom";
import { UserAccountMenu } from "../auth/UserAccountMenu";
import { IconCalendar, IconGlobe, LogoMarkLight } from "./icons";
import { HeroSearchNav } from "./HeroSearchNav";

type LandingHeaderProps = {
  /** Hero uses transparent overlay; inner pages can use solid header later */
  overlay?: boolean;
};

export function LandingHeader({ overlay = true }: LandingHeaderProps) {
  const textClass = overlay ? "text-white" : "text-midnight";

  return (
    <header
      className={`absolute inset-x-0 top-0 z-20 ${overlay ? "bg-transparent" : "border-neutral-200 border-b bg-white"}`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-5 md:px-6">
        <Link to="/" className={`flex shrink-0 items-center gap-2 ${textClass}`}>
          <LogoMarkLight className={`h-7 w-11 ${overlay ? "" : "[&_circle]:stroke-midnight [&_circle]:fill-midnight/10"}`} />
          <span className="font-semibold text-sm uppercase tracking-widest">PopupConnect</span>
        </Link>

        <div className="hidden flex-1 justify-center sm:flex">
          <HeroSearchNav />
        </div>

        <div className={`flex shrink-0 items-center gap-3 ${textClass}`}>
          <button type="button" className="rounded-full p-2 transition hover:bg-white/15" aria-label="Language">
            <IconGlobe className="size-5" />
          </button>
          <Link
            to="/when"
            className="rounded-full p-2 transition hover:bg-white/15"
            aria-label="Calendar"
          >
            <IconCalendar className="size-5" />
          </Link>
          <UserAccountMenu variant="overlay" />
        </div>
      </div>

      <div className="flex justify-center px-4 pb-4 sm:hidden">
        <HeroSearchNav />
      </div>
    </header>
  );
}
