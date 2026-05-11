"use client";

import { Icon } from "./Icon";
import { cn } from "@/lib/cn";

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: string;
  label: string;
  iconFilled?: boolean;
  size?: number;
}

export function IconButton({
  icon,
  label,
  iconFilled = false,
  size = 20,
  className,
  ...props
}: IconButtonProps) {
  return (
    <button
      aria-label={label}
      className={cn(
        "p-sm text-on-surface-variant hover:bg-surface-container-low hover:text-primary inline-flex items-center justify-center rounded-lg transition-all",
        className,
      )}
      {...props}
    >
      <Icon name={icon} filled={iconFilled} size={size} />
    </button>
  );
}
