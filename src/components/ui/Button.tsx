import type { ButtonHTMLAttributes, ReactNode } from "react";
import { btnPrimaryPill, btnSecondaryOutline } from "../../lib/buttonStyles";

type Variant = "primary" | "secondary" | "tertiary";

const variants: Record<Variant, string> = {
  primary: btnPrimaryPill,
  secondary: btnSecondaryOutline,
  tertiary: "rounded-full px-5 py-2 text-sm font-medium text-primary transition hover:bg-starlight/50",
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  children: ReactNode;
};

export function Button({ variant = "primary", className = "", children, type = "button", ...rest }: ButtonProps) {
  return (
    <button type={type} className={`${variants[variant]} ${className}`.trim()} {...rest}>
      {children}
    </button>
  );
}
