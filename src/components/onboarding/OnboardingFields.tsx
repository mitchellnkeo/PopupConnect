import { useEffect, useId, useRef, useState } from "react";
import { btnTertiary } from "../../lib/buttonStyles";

export function OnboardingProgressBar({ value }: { value: number }) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div
      className="h-2 w-full overflow-hidden rounded-xl bg-body/10"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(clamped)}
    >
      <div
        className="h-full rounded-[10px] bg-teal-600 transition-[width] duration-300"
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}

const inputClass =
  "flex h-9 w-full items-center rounded border border-gray-400 bg-white px-2.5 text-[18px] text-body outline-none transition focus:border-primary";

type OnboardingTextFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  id?: string;
  type?: string;
  autoComplete?: string;
  placeholder?: string;
};

export function OnboardingTextField({
  label,
  value,
  onChange,
  id,
  type = "text",
  autoComplete,
  placeholder,
}: OnboardingTextFieldProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;

  return (
    <div className="flex w-full flex-col items-start">
      <label htmlFor={fieldId} className="pb-0.5 text-[16px] text-midnight">
        {label}
      </label>
      <input
        id={fieldId}
        type={type}
        value={value}
        autoComplete={autoComplete}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className={inputClass}
      />
    </div>
  );
}

type OnboardingSelectProps<T extends string> = {
  label: string;
  value: T | "";
  onChange: (value: T) => void;
  options: readonly { value: T; label: string }[] | readonly T[];
  placeholder?: string;
};

function optionList<T extends string>(
  options: readonly { value: T; label: string }[] | readonly T[],
): { value: T; label: string }[] {
  return options.map((option) =>
    typeof option === "string" ? { value: option, label: option } : option,
  );
}

export function OnboardingSelect<T extends string>({
  label,
  value,
  onChange,
  options,
  placeholder = " ",
}: OnboardingSelectProps<T>) {
  const generatedId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const items = optionList(options);
  const selected = items.find((item) => item.value === value);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative flex w-full flex-col items-start">
      <label htmlFor={generatedId} className="pb-0.5 text-[16px] text-midnight">
        {label}
      </label>
      <button
        id={generatedId}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className={`${inputClass} justify-between gap-2 text-left`}
      >
        <span className={selected ? "min-w-0 flex-1 truncate" : "min-w-0 flex-1 text-body/40"}>
          {selected?.label ?? placeholder}
        </span>
        <img src="/images/icons/caret-down.svg" alt="" width={18} height={18} className="shrink-0" />
      </button>
      {open ? (
        <ul
          role="listbox"
          className="absolute top-[calc(100%+4px)] z-20 w-full overflow-hidden rounded bg-white shadow-[0_0_6px_rgba(0,0,0,0.25)]"
        >
          {items.map((item) => (
            <li key={item.value} role="none">
              <button
                type="button"
                role="option"
                aria-selected={item.value === value}
                onClick={() => {
                  onChange(item.value);
                  setOpen(false);
                }}
                className="flex h-10 w-full items-center px-6 text-left text-[16px] text-body transition hover:bg-teal-100"
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

type RoleOptionCardProps = {
  label: string;
  selected: boolean;
  onSelect: () => void;
};

export function RoleOptionCard({ label, selected, onSelect }: RoleOptionCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={[
        "flex items-center gap-2.5 rounded-[10px] border p-6 text-left text-[16px] text-midnight transition",
        selected
          ? "border-teal-600 bg-teal-100"
          : "border-gray-400 bg-white hover:border-teal-600 hover:bg-teal-100/60",
      ].join(" ")}
    >
      <span
        className={[
          "relative size-6 shrink-0 rounded-full border-2",
          selected ? "border-teal-600" : "border-gray-500",
        ].join(" ")}
        aria-hidden
      >
        {selected ? <span className="absolute inset-[3px] rounded-full bg-teal-600" /> : null}
      </span>
      {label}
    </button>
  );
}

type OnboardingNavProps = {
  onBack: () => void;
  onNext?: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
  nextBusy?: boolean;
};

export function OnboardingNav({
  onBack,
  onNext,
  nextLabel = "Next",
  nextDisabled,
  nextBusy,
}: OnboardingNavProps) {
  const nextClass =
    "inline-flex min-h-10 max-h-10 items-center justify-center rounded bg-primary px-3 py-[5.5px] text-[19px] text-white transition hover:bg-primary-hover disabled:pointer-events-none disabled:opacity-40";

  return (
    <div className="flex w-full items-center justify-between pt-[18px]">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex min-h-10 max-h-10 items-center justify-center rounded border-2 border-primary bg-white px-3 py-[5.5px] text-[19px] text-primary transition hover:bg-teal-100"
      >
        Back
      </button>
      {onNext ? (
        <button type="button" onClick={onNext} disabled={nextDisabled || nextBusy} className={nextClass}>
          {nextBusy ? "Saving…" : nextLabel}
        </button>
      ) : (
        <span />
      )}
    </div>
  );
}

export function OnboardingTertiaryButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button type="button" onClick={onClick} className={btnTertiary}>
      {children}
    </button>
  );
}
