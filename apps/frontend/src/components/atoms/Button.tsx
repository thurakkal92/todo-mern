"use client";

import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "dotted";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  children: React.ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-on-primary font-bold rounded-lg shadow-sm hover:opacity-90 active:scale-95",
  secondary:
    "border-2 border-primary text-primary font-bold rounded-lg hover:bg-surface-container-low active:scale-95",
  ghost: "text-on-surface-variant hover:text-primary hover:bg-surface-container-low rounded-lg",
  danger: "bg-error text-on-error font-bold rounded-lg hover:opacity-90 active:scale-95",
  dotted:
    "rounded-xl border-2 border-dashed border-dark/10 text-on-surface-variant hover:border-dark/20 hover:bg-dark/5 hover:text-on-surface",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-9 px-3 text-body-sm",
  md: "h-10 px-4 py-2 text-body-sm",
  lg: "h-11 px-8 text-body-sm",
};

export function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  disabled,
  className,
  children,
  ...props
}: ButtonProps) {
  const isDisabled = disabled ?? isLoading;

  return (
    <button
      disabled={isDisabled}
      className={cn(
        "gap-sm inline-flex items-center justify-center transition-all",
        variantClasses[variant],
        sizeClasses[size],
        isDisabled && "cursor-not-allowed opacity-70",
        className,
      )}
      {...props}
    >
      {isLoading && (
        <span
          className={cn(
            "h-4 w-4 animate-spin rounded-full border-2",
            variant === "primary" || variant === "danger"
              ? "border-on-primary/30 border-t-on-primary"
              : "border-primary/30 border-t-primary",
          )}
          aria-hidden="true"
        />
      )}
      {children}
    </button>
  );
}
