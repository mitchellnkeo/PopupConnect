import type { ReactNode } from "react";

type CheckboxProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  children: ReactNode;
  id?: string;
  required?: boolean;
  disabled?: boolean;
  name?: string;
};

export function Checkbox({
  checked,
  onChange,
  children,
  id,
  required,
  disabled,
  name,
}: CheckboxProps) {
  return (
    <label
      htmlFor={id}
      className={`flex items-start gap-3 text-midnight text-sm ${
        disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"
      }`}
    >
      <input
        id={id}
        name={name}
        type="checkbox"
        checked={checked}
        required={required}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-1 size-4 shrink-0 accent-primary"
      />
      <span>{children}</span>
    </label>
  );
}
