type RadioOption<T extends string> = {
  value: T;
  label: string;
};

type RadioGroupProps<T extends string> = {
  name: string;
  value: T;
  onChange: (value: T) => void;
  options: RadioOption<T>[];
  legend?: string;
  disabled?: boolean;
};

export function RadioGroup<T extends string>({
  name,
  value,
  onChange,
  options,
  legend,
  disabled,
}: RadioGroupProps<T>) {
  return (
    <fieldset className="border-none p-0" disabled={disabled}>
      {legend ? <legend className="mb-3 font-medium text-midnight text-sm">{legend}</legend> : null}
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-6">
        {options.map((option) => (
          <label
            key={option.value}
            className={`flex items-center gap-2 text-midnight text-sm ${
              disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"
            }`}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              className="size-4 accent-primary"
            />
            {option.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
