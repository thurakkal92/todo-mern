"use client";

import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
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
    "border border-primary text-primary font-bold rounded-lg hover:bg-surface-container-low active:scale-95",
  ghost: "text-on-surface-variant hover:text-primary hover:bg-surface-container-low rounded-lg",
  danger: "bg-error text-on-error font-bold rounded-lg hover:opacity-90 active:scale-95",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-md py-1.5 text-body-sm",
  md: "px-lg py-md text-body-sm",
  lg: "px-2xl py-md text-body-md",
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
