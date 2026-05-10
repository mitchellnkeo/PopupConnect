import type { ReactNode } from "react";

type PageShellProps = {
  title: string;
  description?: string;
  children?: ReactNode;
};

export function PageShell({ title, description, children }: PageShellProps) {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="font-semibold text-midnight text-3xl tracking-tight">{title}</h1>
      {description ? (
        <p className="mt-2 text-neutral-700">{description}</p>
      ) : null}
      <div className="mt-8 rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
        {children ?? (
          <p className="text-neutral-500">
            Placeholder screen — replace with real content as your flows solidify.
          </p>
        )}
      </div>
    </div>
  );
}
