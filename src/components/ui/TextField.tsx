import type { InputHTMLAttributes } from "react";

type TextFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, "className"> & {
  label: string;
  error?: string;
  hint?: string;
};

export function TextField({ label, error, hint, id, name, ...rest }: TextFieldProps) {
  const fieldId = id ?? name ?? label.toLowerCase().replace(/\s+/g, "-");
  const describedBy = error ? `${fieldId}-error` : hint ? `${fieldId}-hint` : undefined;

  return (
    <div>
      <label htmlFor={fieldId} className="block font-medium text-midnight text-sm">
        {label}
      </label>
      <input
        id={fieldId}
        name={name}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
        className={[
          "mt-1 w-full rounded-lg border bg-white px-3 py-2.5 text-neutral-900 text-sm outline-none transition focus:ring-2",
          error
            ? "border-primary focus:ring-primary/30"
            : "border-neutral-300 focus:ring-primary/30",
        ].join(" ")}
        {...rest}
      />
      {error ? (
        <p id={`${fieldId}-error`} className="mt-1 text-primary text-sm" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p id={`${fieldId}-hint`} className="mt-1 text-neutral-500 text-xs">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
