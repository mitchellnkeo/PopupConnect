type SwitchProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  disabled?: boolean;
  id?: string;
};

export function Switch({ checked, onChange, label, disabled, id }: SwitchProps) {
  return (
    <label
      htmlFor={id}
      className={`flex items-center justify-between gap-4 text-midnight text-sm ${
        disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"
      }`}
    >
      <span>{label}</span>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={[
          "relative h-6 w-11 shrink-0 rounded-full transition",
          checked ? "bg-primary" : "bg-neutral-300",
          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2",
        ].join(" ")}
      >
        <span
          className={[
            "absolute top-0.5 left-0.5 size-5 rounded-full bg-white shadow-sm transition",
            checked ? "translate-x-5" : "translate-x-0",
          ].join(" ")}
        />
      </button>
    </label>
  );
}
