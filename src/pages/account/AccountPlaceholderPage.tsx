type AccountPlaceholderPageProps = {
  title: string;
  description: string;
};

export function AccountPlaceholderPage({ title, description }: AccountPlaceholderPageProps) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
      <h1 className="font-semibold text-2xl text-midnight">{title}</h1>
      <p className="mt-3 text-neutral-600 text-sm leading-relaxed">{description}</p>
    </div>
  );
}
