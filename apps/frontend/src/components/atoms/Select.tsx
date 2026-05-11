"use client";

import { forwardRef } from "react";
import { AlertCircle, ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
  inputSize?: "sm" | "md" | "lg";
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ error, inputSize = "md", className, children, ...props }, ref) => {
    const sizeClass =
      inputSize === "lg"
        ? "h-11 px-3 py-2 text-body-md"
        : inputSize === "sm"
          ? "h-9 px-3 text-body-sm"
          : "h-10 px-3 py-2 text-body-sm";

    return (
      <div className="gap-xs flex flex-col">
        <div className="relative">
          <select
            ref={ref}
            className={cn(
              "bg-surface-bright text-on-surface w-full appearance-none rounded-lg border transition-all focus:outline-none",
              sizeClass,
              error
                ? "border-error ring-error/10 ring-4"
                : "border-outline-variant focus:border-secondary focus:ring-secondary/10 focus:ring-4",
              className,
            )}
            {...props}
          >
            {children}
          </select>
          <ChevronDown
            size={16}
            className="text-outline-variant pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
            aria-hidden="true"
          />
        </div>
        {error && (
          <span className="mt-xs gap-xs text-body-sm text-error flex items-center">
            <AlertCircle size={16} aria-hidden="true" />
            {error}
          </span>
        )}
      </div>
    );
  },
);
Select.displayName = "Select";
