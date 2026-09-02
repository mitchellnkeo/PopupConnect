type StatusBadgeTone = "success" | "neutral" | "warning" | "danger";

const toneClass: Record<StatusBadgeTone, string> = {
  success: "bg-orange-100 text-orange-800",
  neutral: "bg-neutral-100 text-neutral-700",
  warning: "bg-starlight text-midnight",
  danger: "bg-primary/10 text-primary",
};

type StatusBadgeProps = {
  label: string;
  tone?: StatusBadgeTone;
};

export function StatusBadge({ label, tone = "neutral" }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 font-medium text-xs uppercase tracking-wide ${toneClass[tone]}`}
    >
      {label}
    </span>
  );
}
