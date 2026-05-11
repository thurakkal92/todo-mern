"use client";

import type { LucideIcon } from "lucide-react";
import { Icon } from "./Icon";
import { cn } from "@/lib/cn";

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: LucideIcon;
  label?: string;
  size?: number;
}

export function IconButton({ icon, label, size = 20, className, ...props }: IconButtonProps) {
  return (
    <button
      aria-label={label}
      className={cn(
        "p-sm text-on-surface-variant hover:bg-surface-container-low hover:text-primary inline-flex items-center justify-center rounded-lg transition-all",
        className,
      )}
      {...props}
    >
      <Icon icon={icon} size={size} />
    </button>
  );
}
