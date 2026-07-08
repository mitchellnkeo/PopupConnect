import { Link } from "react-router-dom";
import { UserAccountMenu } from "../auth/UserAccountMenu";
import { IconCalendar, IconComment, LogoMarkLight } from "./icons";
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
      <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-4 py-5 md:px-[60px]">
        <Link to="/" className={`flex shrink-0 items-center gap-3 ${textClass}`}>
          <LogoMarkLight
            className={`size-8 ${overlay ? "" : "[&_circle]:stroke-midnight [&_circle]:fill-midnight/10"}`}
          />
          <span className="font-bold text-[length:var(--text-logo,28px)] uppercase tracking-wide">
            PopupConnect
          </span>
        </Link>

        <div className="hidden flex-1 justify-center lg:flex">
          <HeroSearchNav />
        </div>

        <div className={`flex shrink-0 items-center gap-2.5 pl-0 md:pl-[60px] ${textClass}`}>
          <Link
            to="/messages"
            className="rounded p-2.5 transition hover:bg-white/10"
            aria-label="Messages"
          >
            <IconComment className="size-[18px]" />
          </Link>
          <Link
            to="/when"
            className="rounded p-2.5 transition hover:bg-white/10"
            aria-label="Calendar"
          >
            <IconCalendar className="size-[18px]" />
          </Link>
          <UserAccountMenu variant="overlay" />
        </div>
      </div>

      <div className="flex justify-center px-4 pb-4 lg:hidden">
        <HeroSearchNav />
      </div>
    </header>
  );
}
