import { Link } from "react-router-dom";
import { LogoMark } from "../discovery/icons";

type AuthPageLayoutProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
};

export function AuthPageLayout({ title, subtitle, children }: AuthPageLayoutProps) {
  return (
    <div className="flex min-h-dvh flex-col bg-neutral-50">
      <header className="border-neutral-200 border-b bg-white px-4 py-4">
        <Link to="/" className="mx-auto flex max-w-md items-center gap-2">
          <LogoMark className="h-7 w-11" />
          <span className="font-semibold text-midnight text-sm uppercase tracking-wide">
            PopupConnect
          </span>
        </Link>
      </header>

      <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-12">
        <h1 className="font-semibold text-3xl text-midnight tracking-tight">{title}</h1>
        {subtitle ? <p className="mt-2 text-neutral-600 text-sm">{subtitle}</p> : null}
        <div className="mt-8 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">{children}</div>
      </main>
    </div>
  );
}
